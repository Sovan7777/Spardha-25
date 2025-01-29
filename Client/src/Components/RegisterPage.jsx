import React, { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Upload, User, Trophy, Check, ChevronDown, PlusCircle, Trash2, CreditCard, School, Loader2, BadgeInfo } from "lucide-react"
import axios from "axios"
import Lottie from "react-lottie-player"
import animationData from "../assets/animationData.json"
import footballAnimation from "../assets/footballAnimation.json"
import basketballAnimation from "../assets/basketballAnimation.json"
import ChessAnimation from "../assets/ChessAnimation.json"
import runningAnimation from "../assets/runningAnimation.json"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import qrcode from "../assets/qrcode.jpg"
import { TextField, Tooltip } from "@mui/material"
import { Listbox, Transition, Combobox } from "@headlessui/react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { registrationSchema } from "../Data/ValidationSchema"

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#fb8500",
    },
  },
})

const MemoizedTextField = React.memo(TextField)

function RegisterPage() {
  const [data, setData] = useState([])
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    event: "",
    college: "",
    gmail: "",
    captainName: "",
    captainId: "",
    captainMobile: "",
    captainGender: "Mr.", 
    idCardPic: null,
    players: [],
    upiId: "",
    transactionScreenshot: null,
  })

  const [focusedInput, setFocusedInput] = useState(null)
  const [showNotInList, setShowNotInList] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [amount, setAmount] = useState(null)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [extraPlayers, setExtraPlayers] = useState([])
  const [collegeSuggestions, setCollegeSuggestions] = useState([])
  const [showAnimation, setShowAnimation] = useState(false)
  const [playerList, setPlayerList] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState({
    name: "",
    id: "",
    mobile: "",
    idCardPic: null,
    gender: "Mr.",
  })
  const [maxExtraPlayers, setMaxExtraPlayers] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [collegeList, setCollegeList] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchcollegedata = async () => {
      try {
        const [collegeResponse, eventResponse] = await Promise.all([
          axios.get("http://localhost:7000/collegedata"),
          axios.get("http://localhost:7000/data"),
        ])
        setCollegeList(collegeResponse.data)
        setData(eventResponse.data)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }
    fetchcollegedata()
  }, [])

  const filteredColleges = useMemo(
    () =>
      query === ""
        ? collegeList
        : collegeList.filter((college) => college.collegename.toLowerCase().startsWith(query.toLowerCase())),
    [query, collegeList],
  )

  const handleCollegeInputChange = useCallback(
    debounce((value) => {
      setFormData((prevFormData) => ({ ...prevFormData, college: value }))
      const filteredSuggestions = collegeList.filter((college) =>
        college.collegename.toLowerCase().includes(value.toLowerCase()),
      )
      setCollegeSuggestions(filteredSuggestions)
    }, 300),
    [collegeList], // Removed unnecessary dependencies
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(window.scrollTimeout)
      window.scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleeventchange = (e) => {
    const selectedEventName = e.target.value
    const selectedEvent = data.find((event) => event.EventName === selectedEventName)

    if (selectedEvent) {
      const requiredPlayers = selectedEvent.Players || 0
      const maxExtraPlayers = selectedEvent.Extra || 0

      setFormData({
        ...formData,
        event: selectedEventName,
        players: [],
      })

      setTotalPlayers(requiredPlayers)
      setExtraPlayers([])
      setAmount(selectedEvent.EntryFee || 0)
      setMaxExtraPlayers(maxExtraPlayers)
      setPlayerList([])
    } else {
      setTotalPlayers(0)
      setExtraPlayers([])
      setAmount(null)
      setMaxExtraPlayers(0)
      setFormData({
        ...formData,
        players: [],
      })
      setPlayerList([])
    }
  }

  const handleInputChange = (e, field) => {
    if (field === "transactionScreenshot" || field === "Authorizationfileupload" || field === "idCardPic") {
      setFormData({
        ...formData,
        [field]: e.target.files[0],
      })
    } else {
      setFormData({
        ...formData,
        [field]: e.target.value,
      })
    }
  }

  const handlePlayerInputChange = (e, field, setFieldValue, playerIndex) => {
    const value = field === "playerIdCardPic" ? e.target.files[0] : e.target.value

    setCurrentPlayer((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (typeof setFieldValue === "function") {
      setFieldValue(`players[${playerIndex}].${field}`, value)
    }
  }

  const handleAddPlayer = useCallback(() => {
    if (!currentPlayer.name || !currentPlayer.id || !currentPlayer.mobile || !currentPlayer.playerIdCardPic) {
      toast.error("Please fill out all player fields before adding.")
      return
    }

    const isDuplicate = [...playerList, ...extraPlayers].some(
      (player) => player.id === currentPlayer.id || player.mobile === currentPlayer.mobile,
    )
    if (isDuplicate) {
      toast.error("Player ID or mobile number must be unique across all players.")
      return
    }

    if (playerList.length < totalPlayers - 1) {
      setPlayerList([...playerList, currentPlayer])
    } else if (extraPlayers.length < maxExtraPlayers) {
      setExtraPlayers([...extraPlayers, currentPlayer])
    } else {
      toast.error("Maximum number of players reached.")
      return
    }

    setCurrentPlayer({ name: "", id: "", mobile: "", playerIdCardPic: null })
  }, [currentPlayer, playerList, extraPlayers, totalPlayers, maxExtraPlayers])

  const handleRemovePlayer = useCallback(
    (index, type) => {
      if (type === "required") {
        setPlayerList(playerList.filter((_, i) => i !== index))
      } else {
        setExtraPlayers(extraPlayers.filter((_, i) => i !== index))
      }
    },
    [playerList, extraPlayers],
  )

  const handleEditPlayer = (index, type) => {
    const playerToEdit = type === "required" ? playerList[index] : extraPlayers[index]

    setCurrentPlayer({
      name: playerToEdit.name,
      id: playerToEdit.id,
      mobile: playerToEdit.mobile,
      playerIdCardPic: playerToEdit.playerIdCardPic,
    })

    if (type === "required") {
      setPlayerList(playerList.filter((_, i) => i !== index))
    } else {
      setExtraPlayers(extraPlayers.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      setShowAnimation(true)
      const allPlayers = [...playerList, ...extraPlayers]

      if (playerList.length < totalPlayers - 1) {
        toast.error(`Please add all required players. Remaining: ${totalPlayers - 1 - playerList.length}`)
        setShowAnimation(false)
        setSubmitting(false)
        return
      }

      try {
        const formData = new FormData()

        // Append form fields
        Object.keys(values).forEach((key) => {
          if (key !== "players" && key !== "idCardPic" && key !== "transactionScreenshot") {
            formData.append(key, values[key])
          }
        })

        // Append players array
        formData.append("players", JSON.stringify(allPlayers))

        // Append files
        if (values.idCardPic) formData.append("idCardPic", values.idCardPic)
        if (values.transactionScreenshot) formData.append("transactionScreenshot", values.transactionScreenshot)

        allPlayers.forEach((player, index) => {
          if (player.playerIdCardPic) {
            formData.append(`playerIdCardPic`, player.playerIdCardPic) // Updated line
          }
        })

        const response = await axios.post("http://localhost:7000/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        toast.success(`Registration Successful for ${values.event}. Check Your Email for Furthur Details.`)
        resetForm()
        setPlayerList([])
        setExtraPlayers([])
      } catch (error) {
        console.error("Submission error:", error.response?.data || error.message)
        toast.error(error.response?.data?.message || "Registration failed. Please try again.")
      } finally {
        setShowAnimation(false)
        setSubmitting(false)
      }
    },
    [playerList, extraPlayers, totalPlayers],
  )

  const iseventcollegefill = () => {
    return formData.event
  }

  const iscaptainfill = () => {
    return (
      iseventcollegefill() && formData.captainName && formData.captainId && formData.captainMobile && formData.gmail
    )
  }

  const isplayerfilled = () => {
    return iscaptainfill() && formData.players.length === totalPlayers - 1 && formData.idCardPic
  }
  const ispaymentfill = () => {
    return isplayerfilled() && formData.upiId && formData.transactionScreenshot
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30,
      },
    },
  }

  const generateSelectBackground = (focusedInput, inputName) => `
    ${focusedInput === inputName ? "ring-2 ring-[#fb8500] border-[#fb8500] scale-[1.02]" : ""}
    bg-gradient-to-r from-[#fdf0d5] to-white
    hover:from-orange-300 hover:to-[#fdf0d5]
    transition-all duration-300
  `

  const sportAnimations = {
    football: footballAnimation,
    basketball: basketballAnimation,
    running: runningAnimation,
    chess: ChessAnimation,
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-[#fdf0d5] to-[#f59323] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <AnimatePresence>
          {Object.keys(sportAnimations).map((sport, index) => (
            <motion.div
              key={sport}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 2,
                scale: 1,
                x: Math.sin(Date.now() / 1000 + index) * 50,
                y: Math.cos(Date.now() / 1000 + index) * 50,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Lottie animationData={sportAnimations[sport]} play style={{ width: 100, height: 100 }} />
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <Formik initialValues={formData} validationSchema={registrationSchema} onSubmit={handleSubmit}>
              {({ errors, touched, setFieldValue, values, isSubmitting }) => (
                <Form className="space-y-8 flex-1">
                  <motion.div
                    className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-[#fb8500] px-6 py-4 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white mr-2" />
                      <h2 className="text-2xl font-bold text-white text-center">Sports Event Registration</h2>
                    </div>

                    <div className="p-6 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 group">
                          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                            <Trophy className="w-5 h-5 text-[#fb8500] group-hover:text-[#fb8500] transition-colors" />
                          </motion.div>
                          <span className="group-hover:text-[#fb8500] transition-colors">Select Event</span>
                          <Tooltip title="Select Sports Event in Which You Willing to Participate" placement="top-end">
                          <BadgeInfo className="w-4 h-4" />
                          </Tooltip>
                        </motion.label>
                        <Field name="event">
                          {({ field }) => (
                            <Listbox
                              value={field.value}
                              onChange={(value) => {
                                setFieldValue("event", value)
                                handleeventchange({ target: { value } })
                              }}
                            >
                              <div className="relative mt-1">
                                <Listbox.Button
                                  className={`relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${generateSelectBackground(
                                    focusedInput,
                                    "event",
                                  )}`}
                                >
                                  <span className="block truncate">{field.value || "Select Event from here"}</span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={React.Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {data.map((field, index) => (
                                      <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                                          }`
                                        }
                                        value={field.EventName}
                                        disabled={field.Entries === 0}
                                      >
                                        {({ selected }) => (
                                          <>
                                            <span
                                              className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                                            >
                                              {field.EventName}
                                            </span>
                                            {selected ? (
                                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                <Check className="h-5 w-5" aria-hidden="true" />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                          )}
                        </Field>
                      </motion.div>

                      <motion.label className="block text-sm font-medium text-gray-700 -mb-2 flex items-center gap-2 group">
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                          <School className="w-5 h-5 text-[#fb8500] group-hover:text-[#fb8500] transition-colors" />
                        </motion.div>
                        <span className="group-hover:text-[#fb8500] transition-colors">
                          Select College(Input Min. 3 Letter)
                        </span>
                        <Tooltip title="Type Initial 3 Letter of Your College Name(Not Short Name). If Not in List Click on Not in List! Add College. Enter Complete College Name as This Will Print on Certificate. Ex - Don Bosco Institute of Technology Not like DBIT" placement="right-start" className="">
                          <BadgeInfo className="w-4 h-4" />
                          </Tooltip>
                      </motion.label>
                      <Field name="college">
                        {({ field }) => (
                          <Combobox
                            value={field.value}
                            onChange={(value) => {
                              if (value === "notInList") {
                                setShowInput(true)
                                setIsOpen(false)
                              } else {
                                setFieldValue("college", value)
                                setShowInput(false)
                                setIsOpen(false)
                              }
                            }}
                            as="div"
                            className="relative mt-1"
                            open={isOpen}
                          >
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg -mt-3 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                              <Combobox.Input
                                placeholder="select and add college..."
                                className="w-full border-none py-3 pl-3 pr-10 placeholder:text-black focus:placeholder:hidden text-sm leading-5 text-gray-900 focus:ring-0"
                                displayValue={(college) =>
                                  typeof college === "string" ? college : college?.collegename || ""
                                }
                                onChange={(event) => {
                                  const inputValue = event.target.value
                                  setQuery(inputValue)

                                  const doesExist = collegeList.some(
                                    (college) => college.collegename.toLowerCase() === inputValue.toLowerCase(),
                                  )

                                  setShowNotInList(!doesExist && inputValue.trim() !== "")
                                  setIsOpen(true)
                                }}
                                onFocus={() => setIsOpen(true)}
                              />
                              <Combobox.Button
                                className="absolute inset-y-0 right-0 flex items-center pr-2"
                                onClick={() => setIsOpen(!isOpen)}
                              />
                            </div>

                            <Transition
                              as={React.Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                {filteredColleges.length > 0 ? (
                                  filteredColleges.map((college, index) => (
                                    <Combobox.Option
                                      key={college.id || index}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                                        }`
                                      }
                                      value={college.collegename || college}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                                          >
                                            {college.collegename || college}
                                          </span>
                                          {selected && (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-amber-600" : "text-amber-600"
                                                }`}
                                            >
                                              <Check className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Combobox.Option>
                                  ))
                                ) : showNotInList ? (
                                  <Combobox.Option
                                    className="relative cursor-pointer select-none py-2 px-4 text-gray-700 hover:bg-amber-100 hover:text-amber-900"
                                    value="notInList"
                                  >
                                    Not in list! Add College
                                  </Combobox.Option>
                                ) : (
                                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    No colleges found
                                  </div>
                                )}
                              </Combobox.Options>
                            </Transition>

                            {showInput && (
                              <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-100">
                                <label htmlFor="add-new-college" className="block text-sm text-gray-600">
                                  Add New College
                                </label>
                                <input
                                  type="text"
                                  id="add-new-college"
                                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#fb8500] focus:border-[#fb8500]"
                                  placeholder="Type college name"
                                  value={query}
                                  onChange={(e) => setQuery(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="mt-2 w-full bg-[#fb8500] text-white py-2 px-4 rounded-md"
                                  onClick={() => {
                                    if (query.trim()) {
                                      setCollegeList((prevList) => [...prevList, { collegename: query.trim() }])
                                      setFieldValue("college", query.trim())
                                      setShowInput(false)
                                      setQuery("")
                                    }
                                  }}
                                >
                                  Add College
                                </button>
                              </div>
                            )}
                          </Combobox>
                        )}
                      </Field>
                      {iseventcollegefill() && (
                        <motion.div variants={itemVariants} className="bg-gray-50 shadow p-6 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-[#fb8500]" />
                            Captain Details
                            <Tooltip title="Select Gender and captain Full Name, Same Name Will print on Certificate. Student ID Must be Same as per College ID Card. A valid Phone Number having Whatsapp, ID card Image in .JPG and .JPEG Format, Size of Image 1MB" placement="top-end">
                               <BadgeInfo className="w-4 h-4" />
                            </Tooltip>
                          </h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-center">
                              <Field name="captainGender">
                                {({ field }) => (
                                  <div className="w-1/4">
                                    <select
                                      {...field}
                                      value={field.value}
                                      onChange={(e) => {
                                        field.onChange(e)
                                      }}
                                      id="captainGender"
                                      className="w-full text-sm outline-none rounded-tl-md rounded-bl-md py-4 px-2 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 bg-white shadow-sm"
                                    >
                                      <option value="Mr.">Mr.</option>
                                      <option value="Ms.">Ms.</option>
                                    </select>
                                  </div>
                                )}
                              </Field>
                              <Field name="captainName">
                                {({ field }) => (
                                  <div className="flex-1">
                                    <MemoizedTextField
                                      {...field}
                                      fullWidth
                                      label="Captain Full Name"
                                      variant="outlined"
                                      error={touched.captainName && errors.captainName}
                                      helperText={touched.captainName && errors.captainName}
                                    />
                                  </div>
                                )}
                              </Field>
                            </div>

                            <Field name="captainId">
                              {({ field }) => (
                                <MemoizedTextField
                                  {...field}
                                  fullWidth
                                  label="Captain Student ID Number"
                                  variant="outlined"
                                  error={touched.captainId && errors.captainId}
                                  helperText={touched.captainId && errors.captainId}
                                />
                              )}
                            </Field>

                            <Field name="captainMobile">
                              {({ field }) => (
                                <MemoizedTextField
                                  {...field}
                                  fullWidth
                                  label="Captain Mobile Number"
                                  variant="outlined"
                                  error={touched.captainMobile && errors.captainMobile}
                                  helperText={touched.captainMobile && errors.captainMobile}
                                />
                              )}
                            </Field>

                            <div className="relative">
                              <input
                                type="file"
                                name="idCardPic"
                                id="idCardPic"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) => {
                                  setFieldValue("idCardPic", event.currentTarget.files[0])
                                }}
                              />
                              <label
                                htmlFor="idCardPic"
                                className="flex items-center justify-center p-2 w-full rounded-lg border border-gray-300 shadow-sm transition-all duration-300 cursor-pointer hover:bg-gray-50"
                              >
                                <Upload className="w-5 h-5 text-[#fb8500] mr-2" />
                                {values.idCardPic ? values.idCardPic.name : "Upload Captain ID Card Picture"}
                              </label>
                              {touched.idCardPic && errors.idCardPic && (
                                <div className="text-red-500 text-xs mt-1">{errors.idCardPic}</div>
                              )}
                            </div>

                            <motion.div variants={itemVariants} className="col-span-2">
                              <Field name="gmail">
                                {({ field }) => (
                                  <MemoizedTextField
                                    {...field}
                                    fullWidth
                                    label="Gmail Address"
                                    variant="outlined"
                                    type="email"
                                    error={touched.gmail && errors.gmail}
                                    helperText={touched.gmail && errors.gmail}
                                  />
                                )}
                              </Field>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {playerList.length < totalPlayers - 1 ||
                        (maxExtraPlayers > 0 && extraPlayers.length < maxExtraPlayers) ? (
                        <motion.div
                          className="flex flex-col gap-4 border p-4 rounded-lg bg-gray-50"
                          variants={itemVariants}
                        >
                          <h3 className="text-lg font-medium text-gray-900 flex gap-3 items-center">
                            {playerList.length < totalPlayers - 1 ? "Add Players" : "Add Extra Players"}
                            <Tooltip title="Select Gender and Player Full Name, Same Name Will print on Certificate. Student ID Must be Same as per College ID Card. A valid Phone Number having Whatsapp, ID card Image in .JPG and .JPEG Format, Size of Image 1MB. After that click on Add Player. Notify - You must be Enter Required Player Details and Unique Field Require and Extra Player is Enter as Captain Choice. Watch the Table After Each Entry." placement="top-end">
                              <BadgeInfo className="h-4 w-4" />
                            </Tooltip>
                          </h3>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-center ">
                              <Field name={`players[${playerList.length}].gender`}>
                                {({ field }) => (
                                  <div className="relative">
                                    <select
                                      {...field}
                                      value={currentPlayer.gender}
                                      onChange={(e) =>
                                        handlePlayerInputChange(e, "gender", setFieldValue, playerList.length)
                                      }
                                      className="text-sm outline-none rounded-tl-lg rounded-bl-lg h-full py-4 px-3 border focus:border-slate-600 shadow-sm bg-white"
                                    >
                                      <option value="Mr.">Mr.</option>
                                      <option value="Ms.">Ms.</option>
                                    </select>
                                  </div>
                                )}
                              </Field>

                              <Field name={`players[${playerList.length}].name`}>
                                {({ field }) => (
                                  <MemoizedTextField
                                    {...field}
                                    fullWidth
                                    label="Player Name"
                                    variant="outlined"
                                    value={currentPlayer.name}
                                    onChange={(e) =>
                                      handlePlayerInputChange(e, "name", setFieldValue, playerList.length)
                                    }
                                    error={Boolean(errors.players?.[playerList.length]?.name)}
                                    helperText={errors.players?.[playerList.length]?.name}
                                  />
                                )}
                              </Field>
                            </div>

                            <Field name={`players[${playerList.length}].id`}>
                              {({ field }) => (
                                <MemoizedTextField
                                  {...field}
                                  fullWidth
                                  label="Player College ID Number"
                                  variant="outlined"
                                  value={currentPlayer.id}
                                  onChange={(e) => handlePlayerInputChange(e, "id", setFieldValue, playerList.length)}
                                  error={Boolean(errors.players?.[playerList.length]?.id)}
                                  helperText={errors.players?.[playerList.length]?.id}
                                />
                              )}
                            </Field>

                            <Field name={`players[${playerList.length}].mobile`}>
                              {({ field }) => (
                                <MemoizedTextField
                                  {...field}
                                  fullWidth
                                  label="Player Mobile"
                                  variant="outlined"
                                  value={currentPlayer.mobile}
                                  onChange={(e) =>
                                    handlePlayerInputChange(e, "mobile", setFieldValue, playerList.length)
                                  }
                                  error={Boolean(errors.players?.[playerList.length]?.mobile)}
                                  helperText={errors.players?.[playerList.length]?.mobile}
                                />
                              )}
                            </Field>

                            <div>
                              <Field name={`players[${playerList.length}].playerIdCardPic`}>
                                {({ field, form }) => (
                                  <div>
                                    <label
                                      htmlFor={`player-idCard-${playerList.length}`}
                                      className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                      Upload Player ID Card
                                    </label>
                                    <input
                                      type="file"
                                      id={`player-idCard-${playerList.length}`}
                                      name="playerIdCardPic"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files[0]
                                        form.setFieldValue(`players[${playerList.length}].playerIdCardPic`, file)
                                        setCurrentPlayer((prev) => ({
                                          ...prev,
                                          playerIdCardPic: file,
                                        }))
                                      }}
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fdf0d5] file:text-[#fb8500] hover:file:bg-[#fb8500]/20"
                                    />
                                  </div>
                                )}
                              </Field>{" "}
                            </div>
                          </div>

                          <motion.button
                            type="button"
                            onClick={handleAddPlayer}
                            className="flex justify-center gap4 cursor-pointer text-white font-bold shadow-md hover:scale-[1.2] shadow-orange-400 rounded-full px-5 py-2 bg-gradient-to-bl from-orange-400 to-orange-600 hover:bg-gradient-to-tr hover:from-blue-500 hover:to-blue-700 hover:shadow-md hover:shadow-blue-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <PlusCircle />
                            Add More Players
                          </motion.button>
                        </motion.div>
                      ) : null}

                      <motion.div
                        className="overflow-x-auto mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th className="border px-1 text-center py-1">Type</th>
                              <th className="border px-1 text-center py-1">Name</th>
                              <th className="border px-1 text-center py-1">ID</th>
                              <th className="border px-1 text-center py-1">Mobile</th>
                              <th className="border px-1 text-center py-1">ID Card</th>
                              <th className="border px-1 text-center py-1">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {playerList.map((player, index) => (
                              <tr
                                key={`required-${index}`}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                              >
                                <td className="border px-1 text-center py-1">Required</td>
                                <td className="border px-1 text-center py-1">{player.name}</td>
                                <td className="border px-1 text-center py-1">{player.id}</td>
                                <td className="border px-1 text-center py-1">{player.mobile}</td>
                                <td className="border px-1 text-center py-1">
                                  {player.playerIdCardPic?.name || "N/A"}
                                </td>
                                <td className="border px-1 text-center py-1">
                                  <div className="flex items-center justify-around">
                                    <motion.button
                                      onClick={() => handleEditPlayer(index, "required")}
                                      className="bg-blue-200 text-blue-500 hover:bg-blue-700 group transition-all duration-500 hover:text-white font-bold py-2 px-2 rounded-full mr-2"
                                    >
                                      {/* You'll need to import UserPenIcon here */}
                                      Edit
                                    </motion.button>

                                    <motion.button
                                      onClick={() => handleRemovePlayer(index, "required")}
                                      className="bg-red-200 hover:bg-red-700 text-red-600 group transition-all duration-500 hover:text-white font-bold py-2 px-2 rounded-full"
                                    >
                                      {/* You'll need to import EraserIcon here */}
                                      Remove
                                    </motion.button>
                                  </div>
                                </td>
                              </tr>
                            ))}

                            {extraPlayers.map((player, index) => (
                              <tr key={`extra-${index}`} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">Extra</td>
                                <td className="border px-4 py-2">{player.name}</td>
                                <td className="border px-4 py-2">{player.id}</td>
                                <td className="border px-4 py-2">{player.mobile}</td>
                                <td className="border px-4 py-2">{player.playerIdCardPic?.name || "N/A"}</td>
                                <td className="border px-4 py-2">
                                  <div className="flex items-center">
                                    <motion.button
                                      onClick={() => handleEditPlayer(index, "extra")}
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-2"
                                    >
                                      Edit
                                    </motion.button>

                                    <motion.button
                                      onClick={() => handleRemovePlayer(index, "extra")}
                                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                                    >
                                      Remove
                                    </motion.button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>

                      <motion.div variants={itemVariants} className="bg-gray-50 shadow p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#fb8500]" />
                          Payment Details
                          <Tooltip title="Enter valid Transaction ID and Enter the ScreentShot, ScreenShot Must be in .JPG and .JPEG Format, Make the payment as per amount shown with the qr code." placement="right-start">
                            <BadgeInfo className="h-4 w-4" />
                          </Tooltip>
                        </h3>
                        <div className="space-y-4">
                          <Field name="upiId">
                            {({ field }) => (
                              <MemoizedTextField
                                {...field}
                                fullWidth
                                label="Transaction ID"
                                variant="outlined"
                                error={touched.upiId && errors.upiId}
                                helperText={touched.upiId && errors.upiId}
                              />
                            )}
                          </Field>
                          <div>
                            <label
                              htmlFor="transactionScreenshot"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Upload Transaction Screenshot
                            </label>
                            <input
                              type="file"
                              id="transactionScreenshot"
                              name="transactionScreenshot"
                              accept="image/*"
                              onChange={(event) => {
                                setFieldValue("transactionScreenshot", event.currentTarget.files[0])
                              }}
                              className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-[#fdf0d5] file:text-[#fb8500]
                                  hover:file:bg-[#fb8500]/20"
                            />
                            {touched.transactionScreenshot && errors.transactionScreenshot && (
                              <div className="text-red-500 text-xs mt-1">{errors.transactionScreenshot}</div>
                            )}
                          </div>
                          <p className="inline-block"><span className="bg-orange-200 font-medium rounded-full text-orange-500 px-3 py-1">Amount:</span> <span className="font-medium">{amount}</span></p>
                        </div>
                      </motion.div>
                    </div>
                    <motion.div
                      className="px-6 py-4 bg-gray-50 flex justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#fb8500] text-white px-6 py-2 rounded-lg hover:bg-[#fb8500]/80 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb8500] flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Registration"
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                  <ToastContainer />
                </Form>
              )}
            </Formik>

            <motion.div
              className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden lg:w-1/3 self-start"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="bg-[#fb8500] px-6 py-4">
                <h2 className="text-2xl font-bold text-white text-center">Event Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <p>Event Name: {formData.event}</p>
                  <div className="flex justify-between mt-2 bg-orange-100 p-3 rounded-xl">
                    <p className="font-bold text-orange-400">
                      Minimum Player : <span className="text-base text-gray-950">{totalPlayers}</span>
                    </p>
                    <p className="font-bold text-orange-400">
                      Extra Player : <span className="text-base text-gray-950">{maxExtraPlayers}</span>
                    </p>
                  </div>
                </div>
                <div className="bg-[#fb8500] px-6 py-4 -mx-6">
                  <h3 className="text-xl font-bold text-white text-center">Payment Option</h3>
                </div>
                <div className="flex justify-center">
                  <div className="bg-gray-200 p-4 rounded-lg">
                    <img src={qrcode || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
                <div>
                  {iseventcollegefill() && (
                  <div>
                <div className="text-center">
                  <p className="text-2xl font-bold">Amount: ₹{amount}</p>
                  <p className="text-lg mt-2">UPI: PPQR01.YUZUNL@IOB</p>
                </div>
                <div className="text-left">
                  <div className="inline-block mb-2">
                  <h1 className="bg-orange-200 text-orange-500 px-2 py-1 font-medium rounded-full">NEFT Bank Details :</h1>
                  </div>
                  <p className="mb-2">A/c Name: Don Bosco Institute of Technology</p>
                  <p className="mb-2">A/c No. 179502000000526</p>
                  <p className="mb-2">IFSC Code.: IOBA0001795</p>
                  <p className="mb-2">Account Type: Current Account</p>
                  <p className="inline-block">Branch Name: Indian Overseas Bank, New Friends Colony, New Delhi</p>
                </div>
                </div>
                )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showAnimation && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Lottie loop animationData={animationData} play style={{ width: 200, height: 200 }} />
            </motion.div>
          )}
        </AnimatePresence>

        <ToastContainer position="bottom-right" autoClose={5000} />
      </div>
    </ThemeProvider>
  )
}

export default RegisterPage

