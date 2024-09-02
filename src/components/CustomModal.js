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
      <div className="van-dialog__header">Tips</div>
      <div className="van-dialog__content">
        <div className="van-dialog__message van-dialog__message--has-title">
          Game requires recharge to enter
          <center>Recharge now?</center>
        </div>
      </div>
      <div className="van-hairline--top van-dialog__footer">
        <button
          type="button"
          className="van-button van-button--default van-button--large van-dialog__cancel"
          onClick={onClose} // Close modal on Cancel click
          style={{
            color: '#000',
            width: '80%',
            height: '.93333rem',
            textAlign: 'center',
            lineHeight: '.93333rem',
            borderRadius: '1.06667rem',
            zIndex: 100,
            fontWeight: 700,
            fontSize: '.41667rem',
            letterSpacing: '.06667rem',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="van-button van-button--default van-button--large van-dialog__confirm van-hairline--left"
          onClick={onConfirm} // Confirm action on Confirm click
        >
          <span className="van-button__text">Confirm</span>
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
