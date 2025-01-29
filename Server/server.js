const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const cloudinary= require("./lib/clouinary");
const teamIdGenerate = require("./lib/teamIdGenerate")

const port = 7000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const capitalizeWords = (str) => {
  if (!str) return ""
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function generate() {
  const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@$#&"
  const number = "123456789"
  let result = ""

  for (let i = 0; i < 10; i++) {
    if (Math.random() > 0.5) {
      result += str[Math.floor(Math.random() * str.length)]
    } else {
      result += number[Math.floor(Math.random() * number.length)]
    }
  }
  return result
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sovanbhai388@gmail.com",
    pass: "sdparfojpargthfa",
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.log("Error verifying transporter:", error)
  } else {
    console.log("Nodemailer transporter verified")
  }
})
// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Spardha", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error Occurred:", err))

// Mongoose Schema
const registrationSchema = new mongoose.Schema({
  teamId:{
    type:String,
    required:true,
    unique:true,
  },
  event: { type: String, required: true },
  college: { type: String, required: true },
  gmail: { type: String, required: true },
  captain: {
    name: { type: String, required: true },
    gender: { type: String, required: true }, // Add captain's gender here
    id: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  players: [
    {
      name: { type: String, required: true },
      gender: { type: String, required: true }, // Add player's gender here
      id: { type: String, required: true },
      mobile: { type: String, required: true },
      playerIdCardPicPath: { type: String, required: true },
    },
  ],
  upiId: { type: String, required: true },
  transactionScreenshotPath: { type: String },
  idCardPicPath: { type: String },
  password: { type: String },
  amount: { type: String, required: true },
  status: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Registration = mongoose.model("Registration", registrationSchema)

// Multer Storage Configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Not an image! Please upload an image."), false)
    }
  },
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

app.use("/uploads", express.static("uploads"))

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

app.use((req, res, next) => {
  if (req.body.captainGender && Array.isArray(req.body.captainGender)) {
    req.body.captainGender = req.body.captainGender[0] // Use the first value
  }
  next()
})

app.post(
  "/register",
  upload.fields([
    { name: "idCardPic", maxCount: 1 },
    { name: "transactionScreenshot", maxCount: 1 },
    { name: "playerIdCardPic", maxCount: 10 }, // Max 10 player ID cards
  ]),
  async (req, res) => {
    try {

       console.log(req.files,"files images ");
      const { event, college, gmail, captainName, captainId, captainMobile, captainGender, players, upiId } = req.body

    

      const existingRegistration = await mongoose.connection.db.collection("registrations").findOne({
        "captain.id": captainId,
        event: event,
      })

      if (existingRegistration) {
        return res.status(400).json({
          message: "This captain has already registered for this event.",
        })
      }

      const playerList = JSON.parse(players)
      const eventData = await mongoose.connection.db.collection("TeamData").findOne({ EventName: event })
      if (!eventData) {
        return res.status(400).json({ message: "Invalid event selected." })
      }

      const requiredPlayers = eventData.Players || 0

      if (playerList.length < requiredPlayers - 1) {
        return res.status(400).json({
          message: `You must add ${requiredPlayers - 1} players. Currently added: ${playerList.length}.`,
        })
      }
      if (playerList.length > 0) {
        if (!req.files.playerIdCardPic || req.files.playerIdCardPic.length !== playerList.length) {
          return res.status(400).json({
            message: "Each player must have a valid Player ID Card uploaded.",
          })
        }
      }

          // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //  .upload(
    //      file.transactionScreenshot, {
    //          public_id: 'shoes',
    //      }
    //  )
    //  .catch((error) => {
    //      console.log(error);
    //  });


      // Function to upload an image to Cloudinary
      const uploadToCloudinary = async (file) => {
        try {
          // console.log(file,"files");
          // const base64Image = `data:${file.mimetype};base64,${file.buffer?.toString("base64")}`;
          const result = await cloudinary.uploader.upload(file.path, { folder: "spardha" });
          return result.secure_url;
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return null;
        }
      };

          // Upload files to Cloudinary
          const transactionScreenshotUrl = await uploadToCloudinary(req.files.transactionScreenshot[0])
  
        const idCardPicUrl = await uploadToCloudinary(req.files.idCardPic[0]);


        const playerIdCardUrls = req.files?.playerIdCardPic ? await Promise.all(
         req.files?.playerIdCardPic?.map((f)=>uploadToCloudinary(f))
        ):"";
      const formattedPlayers = JSON.parse(players).map((player, index) => ({
        ...player,
        name: capitalizeWords(player.name),
        gender: player.gender, // Save player gender
        id: player.id,
        mobile: player.mobile,
        // playerIdCardPicPath: req.files.playerIdCardPic[index]
        //   ? `/uploads/${req.files.playerIdCardPic[index].filename}`
        //   : null, 
        playerIdCardPicPath:playerIdCardUrls,
      }))
      // const transactionScreenshotPath = req.files.transactionScreenshot ? req.files.transactionScreenshot[0].path : null
      // const idCardPicPath = req.files.idCardPic ? `/uploads/${req.files.idCardPic[0].filename}` : null

      const passwordforcheck = generate()

  


      const statusvalue = "Pending"

      const teamId = String(teamIdGenerate());
      console.log(teamId);

      const registration = new Registration({
        teamId,
        event,
        college: capitalizeWords(college),
        gmail: capitalizeWords(gmail),
        captain: {
          name: capitalizeWords(captainName),
          gender: captainGender,
          id: captainId,
          mobile: captainMobile,
        },
        players: formattedPlayers,
        upiId,
        transactionScreenshotPath:transactionScreenshotUrl,
        idCardPicPath:idCardPicUrl,
        amount: eventData.EntryFee,
        status: statusvalue,
        password: generate(),
      })

      const result = await mongoose.connection.db.collection("TeamData").updateOne(
        {
          EventName: event,
          Players: { $gt: 1 },
        },
        {
          $inc: { Entries: -1 },
        },
      )
      if (result.modifiedCount > 0) {
        const updatedEvent = await mongoose.connection.db.collection("TeamData").findOne({ EventName: event })

        if (!updatedEvent) {
          console.error(`Event "${event}" not found.`)
        } else if (updatedEvent.Entries === 0) {
          console.log(`Event "${event}" is now full.`)
        }
      } else {
        console.error(`Failed to update Entries for Event "${event}".`)
      }
      await registration.save()


      const mailOptions = {
        from: "sovnbhai388@gmail.com",
        to: gmail,
        subject: "Registration Successful",
        html: `
          <h1>Thank You for Registering!</h1>
          <p>Dear ${captainName},</p>
          <p>Your registration for the event <strong>${event}</strong> has been successfully received.</p>
          <p>Details:</p>
          <ul>
            <li>College: ${college}</li>
            <li>Captain Name: ${captainName}</li>
            <li>UPI ID: ${upiId}</li>
          </ul>
          <h3>Here your password for Check deatils about Team <cbd>${passwordforcheck}</cbd></h3>
          <p>We look forward to seeing you at the event!</p>
        `,
      }
      await transporter.sendMail(mailOptions)
      res.status(201).json({ msg: "Registration saved successfully" })
    } catch (err) {
      console.error("Registration error:", err)
      res.status(500).json({ message: "Error occurred while registering", error: err.message })
    }
  },
)

// GET /data Route
app.get("/data", async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection("TeamData").find().toArray()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ msg: "Error fetching data", error: err.message })
  }
})

const Passkey = "spardha"

app.post("/verify-passkey", (req, res) => {
  const { passkey } = req.body

  if (passkey === Passkey) {
    res.status(200).json({ success: true })
  } else {
    res.status(401).json({ success: false, message: "Invalid passkey" })
  }
})

app.get("/userdata", async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection("registrations").find().toArray()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ msg: "Error Fetching Data" })
  }
})

app.delete("/userdata/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection("registrations")
      .deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "User deleted successfully" });
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user", error: err.message });
  }
});

app.put("/userdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Exclude `_id` from being updated
    delete updatedData._id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID format" });
    }

    // Perform the update
    const result = await mongoose.connection.db.collection("registrations").findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updatedData },
      { returnDocument: "after" }
    );

    // If the document is not found, fetch it again to confirm success
    if (!result.value) {
      const updatedDocument = await mongoose.connection.db.collection("registrations").findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!updatedDocument) {
        return res.status(404).json({ msg: "Record not found after update" });
      }

      return res.status(200).json(updatedDocument);
    }

    // Return the updated document
    res.status(200).json(result.value);
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ msg: "Error updating record", error: err.message });
  }
});

app.get("/playerdata/:password", async (req, res) => {
  const { password } = req.params

  try {
    const data = await mongoose.connection.db.collection("registrations").findOne({ password })
    if (!data) {
      return res.status(404).json({ msg: "Invalid password. Team not found." })
    }
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ msg: "Error fetching data", error: err.message })
  }
})

app.get("/collegedata", async (req, res) => {
  try {
    const projection = { _id: 0 }
    const data = await mongoose.connection.db.collection("CollegeList").find({}, { projection }).toArray()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ msg: "Error fetching data", error: err.message })
  }
})
// Start Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  })
})

