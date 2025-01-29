<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="space-y-8 flex-1">
            <motion.div
              className="bg-white rounded-xl shadow-xl overflow-hidden"
              variants={itemVariants}
            >
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white text-center">Sports Event Registration</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Event Selection */}
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="transform-gpu"
                >
                  <motion.label
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Trophy className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                    </motion.div>
                    <span className="group-hover:text-indigo-600 transition-colors">Select Event</span>
                  </motion.label>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <select
                      name="event"
                      value={formData.event}
                      onChange={handleeventchange}
                      className={`block w-full rounded-lg border-2 border-gray-200
        shadow-md hover:shadow-lg
        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50
        transition-all duration-300
        pl-4 pr-10 py-3.5
        appearance-none
        bg-white
        hover:border-indigo-400
        text-gray-700 font-medium
        bg-gradient-to-b from-white to-gray-50
        cursor-pointer
        backdrop-blur-sm
        ${focusedInput === 'event' ? 'ring-2 ring-indigo-500/50 border-indigo-500 scale-[1.02]' : ''}
      `}
                      onFocus={() => setFocusedInput('event')}
                      onBlur={() => setFocusedInput(null)}
                    >
                      <option value="" className="text-gray-500">Select Event from here</option>
                      {data.map((field, index) => (
                        <motion.option
                          key={index}
                          value={field.EventName}
                          disabled={event.Entries === 0}
                          className="py-2 font-medium"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {field.EventName}
                        </motion.option>
                      ))}
                    </select>
                    <motion.div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none"
                      animate={{ rotate: focusedInput === 'event' ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* College Selection */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <School className="w-5 h-5 text-indigo-600" />
                    College Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleCollegeInputChange}
                      onFocus={() => setFocusedInput('college')}
                      onBlur={() => {
                        setFocusedInput(null);
                        // Delay hiding suggestions to allow for clicks
                        setTimeout(() => setCollegeSuggestions([]), 200);
                      }}
                      placeholder="Type your college name"
                      className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 p-2 ${
                        focusedInput === 'college' ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    />
                    {collegeSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto">
                        {collegeSuggestions.map((college, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCollegeSuggestionClick(college)}
                          >
                            {college}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>

                {/* Authorization Details */}
                <motion.div variants={itemVariants}>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Upload
                      className="w-5 h-5 text-indigo-600"
                    />
                    Authorization Details
                  </label>
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors duration-300">
                    <div
                      className="space-y-1 text-center">
                      <Upload
                        className="mx-auto h-12 w-12 text-gray-400"
                      />
                      <div
                        className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="Authorizationfileupload"
                            type="file"
                            onChange={(e) => setFormData({ ...formData, Authorizationfileupload: e.target.files[0] })}
                            className="sr-only"  required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p
                        className="text-xs text-gray-500">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </motion.div>

                 {/* gmail verifid */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    Gmail Address
                  </label>
                  <input
                    type="email"
                    name="gmail"
                    value={formData.gmail}
                    onChange={(e) => handleInputChange(e, 'gmail')}
                    onFocus={() => setFocusedInput('gmail')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter your Gmail address"
                    className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 p-2 ${
                      focusedInput === 'gmail' ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    required
                  />
                </motion.div>

                {/* Captain Details */}
                <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Captain Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="captainName"
                      value={formData.captainName}
                      onChange={(e) => handleInputChange(e, 'captainName')}
                      onFocus={() => setFocusedInput('captainName')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Captain Name"
                      className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === 'captainName' ? 'ring-2 ring-indigo-500' : ''}`}
                      required
                    />
                    <input
                      type="text"
                      name="captainId"
                      value={formData.captainId}
                      onChange={(e) => handleInputChange(e, 'captainId')}
                      onFocus={() => setFocusedInput('captainId')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Captain ID Number"
                      className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === 'captainId' ? 'ring-2 ring-indigo-500' : ''}`}
                      required
                    />
                    <input
                      type="text"
                      name="captainMobile"
                      value={formData.captainMobile}
                      onChange={(e) => handleInputChange(e, 'captainMobile')}
                      onFocus={() => setFocusedInput('captainMobile')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Captain Mobile Number"
                      className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === 'captainMobile' ? 'ring-2 ring-indigo-500' : ''}`}
                      required
                    />
                  </div>
                </motion.div>

                {/* Team Players */}
                <motion.div variants={itemVariants} className="space-y-4">
                  {formData.players.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium text-gray-900">Team Players</h3>

                      {formData.players.map((player, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Player {index + 2}</h4>

                          <div className="flex items-center space-x-2">
                            <div className="flex-grow space-y-2">
                              <input
                                type="text"
                                value={player.name}
                                onChange={(e) => handlePlayerInputChange(e, index, 'name')}
                                onFocus={() => setFocusedInput(`playerName${index}`)}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Player Name"
                                className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === `playerName${index}` ? 'ring-2 ring-indigo-500' : ''}`}
                                required
                              />
                              <input
                                type="text"
                                value={player.id}
                                onChange={(e) => handlePlayerInputChange(e, index, 'id')}
                                onFocus={() => setFocusedInput(`playerId${index}`)}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Player ID"
                                className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === `playerId${index}` ? 'ring-2 ring-indigo-500' : ''}`}
                                required
                              />
                              <input
                                type="text"
                                value={player.mobile}
                                onChange={(e) => handlePlayerInputChange(e, index, 'mobile')}
                                onFocus={() => setFocusedInput(`playerMobile${index}`)}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Player Mobile"
                                className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === `playerMobile${index}` ? 'ring-2 ring-indigo-500' : ''}`}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Extra Players */}
                      {extraPlayers.map((player, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Extra Player {index + 1}</h4>

                          <div className="flex items-center space-x-2">
                            <div className="flex-grow space-y-2">
                              <input
                                type="text"
                                value={player.name}
                                onChange={(e) => handlePlayerInputChange(e, index, 'name', true)}
                                onFocus={() => setFocusedInput(`extraPlayerName${index}`)}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Player Name"
                                className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === `extraPlayerName${index}` ? 'ring-2 ring-indigo-500' : ''}`}
                                required
                              />
                              <input
                                type="text"
                                value={player.id}
                                onChange={(e) => handlePlayerInputChange(e, index, 'id', true)}
                                onFocus={() => setFocusedInput(`extraPlayerId${index}`)}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Player ID"
                                className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === `extraPlayerId${index}` ? 'ring-2 ring-indigo-500' : ''}`}
                                required
                              />
                              <input
                                type="text"
                                value={player.mobile}
                                onChange={(e) => handlePlayerInputChange(e, index, 'mobile', true)}
                                onFocus={() => setFocusedInput(`extraPlayerMobile${index}`)}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="Player Mobile"
                                className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === `extraPlayerMobile${index}` ? 'ring-2 ring-indigo-500' : ''}`}
                                required
                              />
                            </div>
                            <motion.button
                              type="button"
                              onClick={() => handleRemovePlayer(index)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      ))}

                      {/* Show "Add Extra Player" button if there are less than the total number of players */}
                      {formData.players.length + extraPlayers.length < totalPlayers - 1 && (
                        <motion.button
                          type="button"
                          onClick={handleaddPlayers}
                          className="flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <PlusCircle className="w-5 h-5 mr-2" />
                          Add Extra Player
                        </motion.button>
                      )}
                    </>
                  )}
                </motion.div>

                {/* Payment Details */}
                {isFormFilled() && (
                  <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      Payment Details
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={(e) => handleInputChange(e, 'upiId')}
                        onFocus={() => setFocusedInput('upiId')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="UPI ID"
                        className={`block p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 ${focusedInput === 'upiId' ? 'ring-2 ring-indigo-500' : ''}`}
                        required
                      />
                      <div>
                        <label htmlFor="transactionScreenshot" className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Transaction Screenshot
                        </label>
                        <input
                          type="file"
                          id="transactionScreenshot"
                          name="transactionScreenshot"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, transactionScreenshot: e.target.files[0] })}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                            required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {isallFilled() && (
              <motion.div
                className="px-6 py-4 bg-gray-50 flex justify-end"
                variants={itemVariants}
              >
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Registration
                </button>
              </motion.div>
              )}
            </motion.div>
          </form>

          {/* QR Code and Payment Info Section */}
          <motion.div
            className="bg-white rounded-xl shadow-xl overflow-hidden lg:w-1/3"
            variants={itemVariants}
          >
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white text-center">Payment Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-center">
                <div className="bg-gray-200 p-4 rounded-lg">
                  <img src="/placeholder.svg?height=200&width=200" alt="QR Code" className="w-48 h-48" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">Amount: ₹{amount}</p>
                <p className="text-lg mt-2">UPI: example@upi</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>