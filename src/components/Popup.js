import React, { useState, useEffect } from 'react';

// Popup Component (Toast)
const Popup = ({ text, type, onClose = () => {} }) => {  // Provide a default empty function for onClose
    useEffect(() => {
        console.log("Popup mounted, setting timer for 3 seconds");
        const timer = setTimeout(() => {
          console.log("Timer finished, closing popup");
          onClose(); // Call the onClose function to remove the popup
        }, 3000);
    
        // Cleanup the timer when the component unmounts
        return () => {
          console.log("Cleaning up timer");
          clearTimeout(timer);
        };
      }, [onClose]);
    
      


  // Dynamic styling based on the type of message
  const popupStyle = {
    zIndex: 2007,
    color: '#fff',
  };

  return (
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--center van-toast van-toast--middle van-toast--success"
      style={popupStyle}
    >
      <i className={`van-badge__wrapper van-icon van-icon-${type === 'success' ? 'success' : 'error'} van-toast__icon`}></i>
      <div className="van-toast__text">{text}</div>
    </div>
  );
};

export default React.memo(Popup);
