import React, { useState, useEffect } from 'react';

const Popup = ({ text }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically hide the popup after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false); // This will hide the popup
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  if (!isVisible) return null; // Don't render anything if the popup is not visible

  return (
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--center van-toast van-toast--middle van-toast--success"
      style={{ zIndex: '2007', color: '#fff' }}
    >
      <i className="van-badge__wrapper van-icon van-icon-success van-toast__icon"></i>
      <div className="van-toast__text">{text}</div>
    </div>
  );
};

export default Popup;
