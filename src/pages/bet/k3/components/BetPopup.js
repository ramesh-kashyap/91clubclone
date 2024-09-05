import React, { useState } from 'react';
import axios from 'axios';

const BetPopup = ({ gameJoin, listOrder, game, setShowBetPopup, setListJoin, betGame1 }) => {
  // State for balance and quantity
  const [balance, setBalance] = useState(1);
  const [quantity, setQuantity] = useState(1);

  // Calculate the total money based on gameJoin
  const calculateTotalMoney = (quantity, balance, listOrder, gameJoin) => {
    switch (gameJoin) {
      case 'game1':
        return calculateTotalMoney1(quantity, balance, listOrder);
      default:
        return 0;
    }
  };

  const calculateTotalMoney1 = (quantity, balance, listOrder) => {
    return Number(quantity) * Number(balance) * listOrder.length;
  };

  const totalAmount = calculateTotalMoney(quantity, balance, listOrder, gameJoin);

  // Handle balance and quantity
  const handleSelectBalance = (value) => setBalance(value);
  const handleQuantityChange = (e) => setQuantity(parseInt(e.target.value, 10) || 0);
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  // Handle cancel action
  const handleCancel = () => {
    setShowBetPopup(false);
    setListJoin([]);
  };

  // Handle total amount confirmation
  const handleTotalAmount = () => {
    if (gameJoin === 'game1') {
      betGame1({
        listJoin: listOrder,
        game,
        gameJoin: '1', // Hardcoded for game1
        xvalue: quantity,
        money: balance,
      });
    }
  };

  return (
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--round van-popup--bottom"
      style={{ zIndex: '2010', boxShadow: 'rgba(37, 37, 60, 0.26) 0px -18px 40px' }}
    >
      <div className="Betting__Popup-body">
        <div className="Betting__Popup-type1">
          <p className="title">Sum:</p>
          <div className="list">
            {gameJoin === 'game1' &&
              listOrder.map((item, index) => {
                let itemClass = '';
                let displayText = item;

                // Conditionally set the className and display text based on the item value
                if (typeof item === 'number') {
                  itemClass = item % 2 === 0 ? 'green' : 'red'; // Even = green, Odd = red
                } else if (item === 'b') {
                  itemClass = 'red numA';
                  displayText = 'Big';
                } else if (item === 's') {
                  itemClass = 'green numB';
                  displayText = 'Small';
                } else if (item === 'l') {
                  itemClass = 'red numC';
                  displayText = 'Odd';
                } else if (item === 'c') {
                  itemClass = 'green numD';
                  displayText = 'Even';
                }

                return (
                  <div key={index} className={itemClass}>
                    {displayText}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="Betting__Popup-body-line">
          Balance
          <div className="Betting__Popup-body-line-list">
            {[1, 10, 100, 1000].map((value) => (
              <div
                key={value}
                className={`Betting__Popup-body-line-item ${balance === value ? 'bgcolor' : ''}`}
                onClick={() => handleSelectBalance(value)}
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        <div className="Betting__Popup-body-line">
          Quantity
          <div className="Betting__Popup-body-line-btnL">
            <div className="Betting__Popup-btn bgcolor" onClick={decrementQuantity}>
              -
            </div>
            <input
              type="tel"
              inputMode="numeric"
              className="van-field__control"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <div className="Betting__Popup-btn bgcolor" onClick={incrementQuantity}>
              +
            </div>
          </div>
        </div>

        <div className="Betting__Popup-foot">
          <div className="Betting__Popup-foot-c" onClick={handleCancel}>
            Cancel
          </div>
          <div className="Betting__Popup-foot-s bgcolor" onClick={handleTotalAmount}>
            Total amount ₹{totalAmount}.00
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetPopup;
