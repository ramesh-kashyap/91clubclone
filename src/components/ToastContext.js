import React, { createContext, useState, useContext } from 'react';
import Popup from './Popup';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, text, type }]);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Popup
            key={toast.id}
            text={toast.text}
            type={toast.type}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
