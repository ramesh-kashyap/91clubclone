import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

export default function AddUSDT() {
  const [usdtBep20, setUsdtBep20] = useState('');
  const [usdtTrc20, setUsdtTrc20] = useState('');

  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const items = [
    { label: 'USDT BEP20', value: 'usdtBep20' },
    { label: 'USDT TRC20', value: 'usdtTrc20' },
  ];

  const sortedItems = [...items].sort((a, b) =>
    a.value === selectedValue ? -1 : b.value === selectedValue ? 1 : 0
  );

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await Api.post('/api/webapi/addBank', {
        usdtBep20,
        usdtTrc20,
      });
  
      
    } catch (error) {
      console.error('An error occurred during the API request:', error);
    }
  };
  
  


    return(
  <div className="" style={{fontSize: '12px'}}>
  

    <div id="app" data-v-app="">
    
      
      <div
        data-v-24736190=""
        className="addUSDT__container"
        style={{'--f13b4d11-currentFontFamily': "'Roboto', 'Inter', sans-serif"}}
      >
        <div data-v-12a80a3e="" data-v-24736190="" className="navbar">
          <div data-v-12a80a3e="" className="navbar-fixed">
            <div data-v-12a80a3e="" className="navbar__content">
              <div data-v-12a80a3e="" className="navbar__content-left">
                <i
                  data-v-12a80a3e=""
                  className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={()=>navigate('/wallet/Withdraw')}
                  ></i
                >
              </div>
              <div data-v-12a80a3e="" className="navbar__content-center">
                
                <div data-v-12a80a3e="" className="navbar__content-title">
                  Add USDT address
                </div>
              </div>
              <div data-v-12a80a3e="" className="navbar__content-right"></div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
        <div data-v-24736190="" className="addUSDT__container-content">
          <div data-v-24736190="" className="addUSDT__container-content-top">
            <img data-v-24736190="" src="/assets/png/hint-c6828dc5.png" /><span
              data-v-24736190=""
              >To ensure the safety of your funds, please link your wallet</span
            >
          </div>
          
          <div data-v-24736190="" className="addUSDT__container-content-item">
            <div data-v-24736190="" className="label">
              <svg data-v-24736190="" className="svg-icon icon-usdt1 icon icon">
                <use href="#icon-usdt1"></use>
              </svg>
              Select main network
            </div>
            <div data-v-24736190="" className="ar-searchbar">
              <div
                data-v-fa757a88=""
                data-v-24736190=""
                className="ar-searchbar__selector"
              >
                <div data-v-fa757a88="">
                  <input
                  type="text"
                    data-v-fa757a88=""
                    className="ar-searchbar__selector-default"
                    onClick={handleToggle}
                        value={selectedValue}
                        onChange={(e) => setSelectedValue(e.target.value.replace(/[^\w\/]/ig, ''))}
                    />
                  <i
                    data-v-fa757a88=""
                    className="van-badge__wrapper van-icon van-icon-arrow-down"onClick={handleToggle}
                    ></i
                  >
                </div>
              </div>
            </div>
          </div>
          <div data-v-24736190="" className="addUSDT__container-content-item">
            <div data-v-24736190="" className="label">
              <svg data-v-24736190="" className="svg-icon icon-usdt2 icon icon">
                <use href="#icon-usdt2"></use>
              </svg>
              USDT Address
            </div>
            <div data-v-24736190="" className="input">
              <input
                data-v-24736190=""
                placeholder="Please enter the USDT address"
                maxLength="36"
                onInput={(e) => e.target.value = e.target.value.replace(/[^\w\/]/ig, '')}
              />
            </div>
          </div>
          
          {/* <div data-v-24736190="" className="addUSDT__container-content-item">
            <div data-v-24736190="" className="label">
              <svg data-v-24736190="" className="svg-icon icon-usdt3 icon icon">
                <use href="#icon-usdt3"></use>
              </svg>
              Address Alias
            </div>
            <input
              data-v-24736190=""
              placeholder="Please enter a remark of the withdrawal address"
              maxLength="20"
            />
          </div> */}
          <div data-v-24736190="" className="addUSDT__container-content-btn">
            <button data-v-24736190="" className="" type="submit">Save</button>
          </div>
        </div>
        </form>
        <div className="van-overlay" role="button" tabIndex="0" data-v-24736190="" style={{ zIndex: 2006, display: isVisible ? 'block' : 'none' }}></div>
        <div role="dialog" tabIndex="0" className="van-popup van-popup--round van-popup--bottom" data-v-24736190="" style={{ zIndex: 2006, display: isVisible ? 'block' : 'none' }}>
          <div data-v-24736190="" className="van-picker">
            <div className="van-picker__toolbar">
              <button type="button" className="van-picker__cancel van-haptics-feedback" onClick={handleCancel}>Cancel</button>
              <button type="button" className="van-picker__confirm van-haptics-feedback" onClick={handleCancel}>Confirm</button>
              </div>
              <div className="van-picker__columns" style={{height: '264px'}}>
                <div className="van-picker-column">
                  <ul className="van-picker-column__wrapper" style={{transform: 'translate3d(0px, 110px, 0px)', 'transitionDuration': '0ms', "transitionProperty": 'none'}}>
                  {sortedItems.map((item) => (
        <li
          key={item.value}
          role="button"
          tabIndex="0"
          className={`van-picker-column__item ${item.value === selectedValue ? 'van-picker-column__item--selected' : ''}`}
          style={{ height: '44px', cursor: 'pointer' }}
          onClick={() => handleSelect(item.value)}
        >
          <div className="van-ellipsis">{item.label}</div>
        </li>
      ))}
                  </ul>
                        </div>
                        <div className="van-picker__mask" style={{backgroundSize: '100% 110px'}}></div>
                        <div className="van-hairline-unset--top-bottom van-picker__frame" style={{height: '44px'}}></div>
                        </div>
                        </div>
                        </div>
        
      </div>
      <div
        className="customer"
        id="customerId"
        style={{
          "--f13b4d11-currentFontFamily": "'Roboto', 'Inter', sansSerif",
          "--f6a705e1-currentFontFamily": 'bahnschrift',
        }}
      >
        <img
          className=""
          data-origin="/assets/png/icon_sevice-9f0c8455.png"
          src="/assets/png/icon_sevice-9f0c8455.png"
        />
      </div>
      
    </div>

    <div></div>
    
  </div>
)}
