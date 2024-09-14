import React from 'react';

const CustomModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--center van-dialog"
      aria-labelledby="Tips"
      style={{
        zIndex: 2010,
        display: isOpen ? 'block' : 'none', // Toggle visibility based on isOpen prop
      }}
      id="myPopup"
    >
      <div className="van-dialog__header" style={{ color : '#fff' }}>Tips</div>
      <div className="van-dialog__content">
        <div className="van-dialog__message van-dialog__message--has-title" style={{ color: '#A8A5A1' }}>
          Are you sure you want to join
          <center>the game?</center>
        </div>
      </div>
      <div className="van-hairline--top van-dialog__footer">
        <button
          type="button"
          className="van-button van-button--default van-button--large van-dialog__cancel"
          onClick={onClose} // Close modal on Cancel click
          style={{
            color: '#fff',
            width: '80%',
            textAlign: 'center',
            zIndex: 100,
            fontWeight: 700,
            fontSize: '.41667rem',
            letterSpacing: '.06667rem',
            background: '#6F7381' ,
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="van-button van-button--default van-button--large van-dialog__confirm van-hairline--left"
          onClick={onConfirm} // Confirm action on Confirm click
          style={{ 
            color: '#8F5206', 
            backgroundImage: 'linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)' 
          }}
                  >
          <span className="van-button__text">Confirm</span>
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
