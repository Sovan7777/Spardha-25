import React from 'react';
import { motion } from 'framer-motion';
import Lottie from "react-lottie-player";
import footballAnimation from '../assets/football-animation.json';
import basketballAnimation from '../assets/basketball-animation.json';
import runningAnimation from '../assets/running-animation.json';

const AnimatedBackground = () => {
  const sportAnimations = {
    football: footballAnimation,
    basketball: basketballAnimation,
    running: runningAnimation,
  };

  return (
    <>
      {Object.keys(sportAnimations).map((sport, index) => (
        <motion.div
          key={sport}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.2, 
            scale: 1,
            x: Math.sin(Date.now() / 1000 + index) * 50,
            y: Math.cos(Date.now() / 1000 + index) * 50,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Lottie
            animationData={sportAnimations[sport]}
            play
            style={{ width: 100, height: 100 }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default AnimatedBackground;

