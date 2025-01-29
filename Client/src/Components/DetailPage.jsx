import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
const DetailPage = ({ id }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState(null);
  const things = "pass: 'sdparfojpargthfa',"

  // Function to handle password submission and data fetching
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the password to the backend in the URL
      const response = await fetch(`http://localhost:7000/playerdata/${password}`, {
        method: 'GET', // GET request since password is part of the URL
      });

      // If password is incorrect
      if (!response.ok) {
        throw new Error('Incorrect password');
      }

      // If password is correct, get the data
      const data = await response.json();
      setIsAuthenticated(true); // Set authentication to true
      setPlayerData(data); // Set the fetched player data

    } catch (err) {
      setError(err.message); // Show error message if the password is incorrect
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 pt-16">
  {!isAuthenticated ? (
    <motion.form
      onSubmit={handleSubmit}
      className="p-8 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Enter Password
      </motion.h1>
      <div className="relative">
        <motion.input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Password"
          required
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <motion.button
        type="submit"
        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Lock className="inline-block mr-2" size={20} />
        Unlock
      </motion.button>
      {error && (
        <motion.p
          className="mt-4 text-red-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {error}
        </motion.p>
      )}
    </motion.form>
      ) : (
        <div className="min-h-screen bg-gray-100 p-8 px-6">
          {/* Render player data if authenticated */}
          <h1 className="text-3xl font-bold mb-8 text-center">Event Details</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Always show Event, College, Gmail, and Captain data */}
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold text-gray-700">Event:</div>
                <div className="text-gray-600">{playerData?.event}</div>
                <div className="font-semibold text-gray-700">College:</div>
                <div className="text-gray-600">{playerData?.college}</div>
                <div className="font-semibold text-gray-700">Gmail:</div>
                <div className="text-gray-600">{playerData?.gmail}</div>
                <div className="font-semibold text-gray-700">Captain Name:</div>
                <div className="text-gray-600">{playerData?.captain?.name}</div>
                <div className="font-semibold text-gray-700">Captain ID:</div>
                <div className="text-gray-600">{playerData?.captain?.id}</div>
                <div className="font-semibold text-gray-700">Captain Mobile:</div>
                <div className="text-gray-600">{playerData?.captain?.mobile}</div>
              </div>
            </div>

            {/* Render players */}
            {playerData?.players && playerData.players.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h2 className="text-xl font-semibold mb-4">Players</h2>
                {playerData.players.map((player, index) => (
                  <div key={player.id} className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="font-semibold text-gray-700">Player {index + 1} Name:</div>
                      <div className="text-gray-600">{player.name}</div>
                      <div className="font-semibold text-gray-700">Player {index + 1} ID:</div>
                      <div className="text-gray-600">{player.id}</div>
                      <div className="font-semibold text-gray-700">Player {index + 1} Mobile:</div>
                      <div className="text-gray-600">{player.mobile}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
