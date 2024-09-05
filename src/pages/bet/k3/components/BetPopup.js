import React, { useState } from 'react';
import Api from '../../../../services/Api'

const BetPopup = ({ gameJoin,listOrder,game,userBalance, setListJoin, setShowBetPopup }) => {
  // State for balance and quantity
  const [balance, setBalance] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const calculateTotalMoney = (quantity, balance, listOrder, gameJoin) => {
    console.log(listOrder)
    switch (gameJoin) {
      case 'game1':
        console.log("hi");
        return calculateTotalMoney1(quantity, balance, listOrder);
      case 'game2':
        // return calculateTotalMoney2(quantity, balance, listJoin);
      case 'game3':
        // return calculateTotalMoney3(quantity, balance, listJoin);
      case 'game4':
        // return calculateTotalMoney4(quantity, balance, listJoin);
      default:
        console.log("hi1");

        return 0;
    }
  };

  const betGame1 = async () => {
     
    const totalAmount = calculateTotalMoney1(quantity, balance, listOrder);

    if(totalAmount > userBalance){
        console.error('Insufficient Balance');
        return;
    }


    try {
      const response = await Api.post('/api/webapi/action/k3/join', {
        listJoin: listOrder.join(','), // Pass listOrder as listJoin
        game,                // game value from props
        gameJoin: 1,       // gameJoin for game1
        xvalue: quantity,    // Pass quantity as xvalue
        money: balance,      // Pass balance as money
      });

      console.log('Bet successfully placed:', response.data);
      
      setListJoin([]);       
        setShowBetPopup(false)


      // You can handle the success message here or update the state
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  const calculateTotalMoney1 = (quantity, balance, listOrder) => {
    return Number(quantity) * Number(balance) * listOrder.length;
  };

  const totalAmount = calculateTotalMoney(quantity, balance, listOrder, gameJoin);


  // Determine the title based on the gameJoin prop
  const getTitle = () => {
    switch (gameJoin) {
      case 'game1':
        return 'Sum:';
      case 'game2':
        return 'Choose 2 suitable numbers:';
      case 'game3':
        return 'Choose 3 unique numbers:';
      case 'game4':
        return 'Choose 3 different numbers:';
      default:
        return '';
    }
  };

  // Handle balance selection
  const handleSelectBalance = (value) => {
    setBalance(value);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setQuantity(value);
    }
  };

  // Handle increment/decrement of quantity
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--round van-popup--bottom"
      data-v-5f002ad4=""
      style={{
        zIndex: '2010',
        boxShadow: 'rgba(37, 37, 60, 0.26) 0px -18px 40px',
      }}
    >
      <div data-v-5f002ad4="" className="Betting__Popup-body">
        <div data-v-5f002ad4="" className="Betting__Popup-type1">
          <p data-v-5f002ad4="" className="title">{getTitle()}</p>
          <div data-v-5f002ad4="" className="list">
  {gameJoin === 'game1' && listOrder.map((item, index) => {
    let itemClass = '';
    let displayText = item;  // Default to showing the item unless it's b, s, l, c

    // Conditionally set the className and display text based on the item value
    if (typeof item === 'number') {
      itemClass = item % 2 === 0 ? 'green' : 'red';  // Set 'green' for even, 'red' for odd
    } else if (item === 'b') {
      itemClass = 'red numA';  // Class for 'Big'
      displayText = 'Big';     // Display "Big" for 'b'
    } else if (item === 's') {
      itemClass = 'green numB'; // Class for 'Small'
      displayText = 'Small';    // Display "Small" for 's'
    } else if (item === 'l') {
      itemClass = 'red numC';   // Class for 'Odd'
      displayText = 'Odd';      // Display "Odd" for 'l'
    } else if (item === 'c') {
      itemClass = 'green numD'; // Class for 'Even'
      displayText = 'Even';     // Display "Even" for 'c'
    }

    return (
      <div key={index} data-v-5f002ad4="" className={itemClass}>
        {displayText}
      </div>
    );
  })}
</div>


        </div>

        <div data-v-5f002ad4="" className="Betting__Popup-body-line">
          Balance
          <div data-v-5f002ad4="" className="Betting__Popup-body-line-list">
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                balance === 1 ? 'bgcolor' : ''
              }`}
              onClick={() => handleSelectBalance(1)}
            >
              1
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                balance === 10 ? 'bgcolor' : ''
              }`}
              onClick={() => handleSelectBalance(10)}
            >
              10
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                balance === 100 ? 'bgcolor' : ''
              }`}
              onClick={() => handleSelectBalance(100)}
            >
              100
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                balance === 1000 ? 'bgcolor' : ''
              }`}
              onClick={() => handleSelectBalance(1000)}
            >
              1000
            </div>
          </div>
        </div>

        <div data-v-5f002ad4="" className="Betting__Popup-body-line">
          Quantity
          <div data-v-5f002ad4="" className="Betting__Popup-body-line-btnL">
            <div
              data-v-5f002ad4=""
              className="Betting__Popup-btn bgcolor"
              onClick={decrementQuantity}
            >
              -
            </div>
            <div data-v-5f002ad4="" className="van-cell van-field Betting__Popup-input">
              <div className="van-cell__value van-field__value">
                <div className="van-field__body">
                  <input
                    type="tel"
                    inputMode="numeric"
                    id="van-field-1-input"
                    className="van-field__control"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
              </div>
            </div>
            <div
              data-v-5f002ad4=""
              className="Betting__Popup-btn bgcolor"
              onClick={incrementQuantity}
            >
              +
            </div>
          </div>
        </div>

        <div data-v-5f002ad4="" className="Betting__Popup-body-line">
          <div data-v-5f002ad4=""></div>
          <div data-v-5f002ad4="" className="Betting__Popup-body-line-list">
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                quantity === 1 ? 'bgcolor' : ''
              }`}
              onClick={() => setQuantity(1)}
            >
              X1
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                quantity === 5 ? 'bgcolor' : ''
              }`}
              onClick={() => setQuantity(5)}
            >
              X5
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                quantity === 10 ? 'bgcolor' : ''
              }`}
              onClick={() => setQuantity(10)}
            >
              X10
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                quantity === 20 ? 'bgcolor' : ''
              }`}
              onClick={() => setQuantity(20)}
            >
              X20
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                quantity === 50 ? 'bgcolor' : ''
              }`}
              onClick={() => setQuantity(50)}
            >
              X50
            </div>
            <div
              data-v-5f002ad4=""
              className={`Betting__Popup-body-line-item ${
                quantity === 100 ? 'bgcolor' : ''
              }`}
              onClick={() => setQuantity(100)}
            >
              X100
            </div>
          </div>
        </div>

        <div data-v-5f002ad4="" className="Betting__Popup-body-line">
          <span
            data-v-5f002ad4=""
            className="Betting__Popup-agree active"
          >
            I agree
          </span>
          <span data-v-5f002ad4="" className="Betting__Popup-preSaleShow">
            《Pre-sale rules》
          </span>
        </div>
      </div>

      <div data-v-5f002ad4="" className="Betting__Popup-foot">
        <div
      data-v-5f002ad4=""
      className="Betting__Popup-foot-c"
      onClick={() => {
        setListJoin([]);       
        setShowBetPopup(false); // Hide the popup
      }}
    >
      Cancel
    </div>
        <div
          data-v-5f002ad4=""
          className="Betting__Popup-foot-s bgcolor"
          onClick={() => {
            if (gameJoin === 'game1') {
              betGame1(); // Call the betGame1 function for game1
            }
          }}
        >
          Total amount ₹{totalAmount}.00
        </div>
      </div>
    </div>
  );
};

export default BetPopup;
