'use client'

import React, { useState } from 'react';
import { Input } from 'antd';
import { Lock } from 'lucide-react';
import axios from 'axios';

const { OTP } = Input;

function PasskeyForm({ onAuthSuccess }) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passkey.trim() === '' || passkey.length !== 7) {
      setError('Please enter a valid 6-digit passkey');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:7000/verify-passkey', { passkey });
      if (response.data.success) {
        onAuthSuccess(response.data);
      } else {
        setError('Invalid passkey. Please try again.');
      }
    } catch (err) {
      console.log('Error Verifying passkey');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-16 bg-gray-100">
      <div className="bg-white p-8 w-96 rounded-[60px] bg-gradient-to-br from-[#f9f8f8] to-[#ffffff] shadow-[5px_5px_3px_#666666,-5px_-5px_3px_#ffffff]">
        <div className="flex justify-center mb-6">
          <Lock className="text-blue-500" size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Enter Passkey</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passkey" className="block text-sm font-medium text-gray-700 mb-2">
              Passkey
            </label>
            <OTP
              value={passkey}
              onChange={setPasskey}
              length={7}
               mask="🔒"
               variant='filled'
              className="flex justify-between"
              inputRender={({ index, ...props }) => (
                <span key={index} className="relative inline-block">
                  <Input
                    {...props}
                    className="w-15 p-3 h-15 text-center border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </span>
              )}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r w-full from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-95 hover:brightness-110 hover:animate-pulse active:animate-bounce"
          >
            {isLoading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasskeyForm;

