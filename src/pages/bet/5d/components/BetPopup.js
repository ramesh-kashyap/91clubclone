import React, { useState } from 'react';

const BetPopup = ({ show, onClose, onSubmit }) => {
  const [listJoin, setListJoin] = useState([]);
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [balance, setBalance] = useState(1); // Default balance
  const [navSelection, setNavSelection] = useState(''); // For FDB__C-nav

  // Function to handle nav selection (A, B, C, D, E, SUM)
  const handleNavClick = (value) => {
    setNavSelection(value);
    setListJoin([value]); // Only one value can be selected from here
  };

  // Function to handle FDB__C-H selection (Big, Small, Odd, Even)
  const handleHClick = (value) => {
    setListJoin([value]); // Only one value from FDB__C-H
  };

  // Function to handle FDB__C-Num selection (0-9)
  const handleNumClick = (value) => {
    setListJoin((prev) => {
      // If value is already selected, remove it, otherwise add it
      const updatedSelection = prev.includes(value)
        ? prev.filter((num) => num !== value)
        : [...prev, value];
      return updatedSelection;
    });
  };

  const handleCancel = () => {
    setListJoin([]);
    setQuantity(1);
    setBalance(1);
    setNavSelection('');
    onClose(); // Close the popup
  };

  const handleTotalAmount = () => {
    // Pass listJoin and other values to parent on submit
    onSubmit({
      listJoin,
      quantity,
      balance,
    });
  };

  if (!show) return null;

  return (
    <div className="van-overlay" style={{ zIndex: '2004', display: show ? 'block' : 'none' }}>
      <div
        role="dialog"
        tabIndex="0"
        className="van-popup van-popup--round van-popup--bottom"
        style={{
          zIndex: '2004',
          boxShadow: 'rgba(37, 37, 60, 0.26) 0px -18px 40px',
        }}
      >
        <div className="Betting__Popup-body">
          {/* FDB__C-nav */}
          <div className="FDB__C-nav">
            {['A', 'B', 'C', 'D', 'E', 'SUM'].map((nav) => (
              <div
                key={nav}
                className={navSelection === nav ? 'active' : ''}
                onClick={() => handleNavClick(nav)}
              >
                {nav}
              </div>
            ))}
          </div>

          {/* FDB__C-H */}
          <div className="FDB__C-H">
            {[
              { label: 'Big', rate: '1.98' },
              { label: 'Small', rate: '1.98' },
              { label: 'Odd', rate: '1.98' },
              { label: 'Even', rate: '1.98' },
            ].map((item) => (
              <div
                key={item.label}
                className={listJoin.includes(item.label) ? 'active' : ''}
                onClick={() => handleHClick(item.label)}
              >
                <span>{item.label}</span>
                <span>{item.rate}</span>
              </div>
            ))}
          </div>

          {/* FDB__C-Num */}
          <div className="FDB__C-Num">
            {Array.from({ length: 10 }, (_, i) => i).map((num) => (
              <div
                key={num}
                className={listJoin.includes(num) ? 'active' : ''}
                onClick={() => handleNumClick(num)}
              >
                <div className="round">{num}</div>
                <div className="rate">9</div>
              </div>
            ))}
          </div>

          {/* Quantity and Balance */}
          <div className="Betting__Popup-body-line">
            Balance
            <div className="Betting__Popup-body-line-list">
              {[1, 10, 100, 1000].map((val) => (
                <div
                  key={val}
                  className={`Betting__Popup-body-line-item ${balance === val ? 'bgcolor' : ''}`}
                  onClick={() => setBalance(val)}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="Betting__Popup-body-line">
            Quantity
            <div className="Betting__Popup-body-line-btnL">
              <div className="Betting__Popup-btn" onClick={() => setQuantity(quantity - 1)}>
                -
              </div>
              <input
                type="tel"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="van-field__control"
              />
              <div className="Betting__Popup-btn" onClick={() => setQuantity(quantity + 1)}>
                +
              </div>
            </div>
          </div>

          <div className="Betting__Popup-body-line">
            <span className="Betting__Popup-agree active">I agree</span>
            <span className="Betting__Popup-preSaleShow">《Pre-sale rules》</span>
          </div>
        </div>

        {/* Footer */}
        <div className="Betting__Popup-foot">
          <div className="Betting__Popup-foot-c" onClick={handleCancel}>
            Cancel
          </div>
          <div className="Betting__Popup-foot-s" onClick={handleTotalAmount}>
            Total amount ₹{balance * quantity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetPopup;
