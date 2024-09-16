import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

export default function AddUSDT() {
  const [trc20, setTrc] = useState('');
  const [bep20, setBep] = useState('');

  const navigate = useNavigate();


 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Api.post('/api/webapi/addBank', {
        usdtBep20: bep20, 
        usdttrc20: trc20,
      });

      if (response.data.status) {
        console.log('Bank information added/updated successfully');
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('An error occurred during the API request:', error);
    }
  };

  return (
    <div className="" style={{ fontSize: '12px' }}>
      <div id="app" data-v-app="">
        <div
          data-v-24736190=""
          className="addUSDT__container"
          style={{ '--f13b4d11-currentFontFamily': "'Roboto', 'Inter', sans-serif" }}
        >
          <div data-v-12a80a3e="" data-v-24736190="" className="navbar">
            <div data-v-12a80a3e="" className="navbar-fixed">
              <div data-v-12a80a3e="" className="navbar__content">
                <div data-v-12a80a3e="" className="navbar__content-left">
                  <i
                    data-v-12a80a3e=""
                    className="van-badge__wrapper van-icon van-icon-arrow-left"
                    onClick={() => navigate('/wallet/Withdraw')}
                  ></i>
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
              {/* <div data-v-24736190="" className="addUSDT__container-content-top">
                <img data-v-24736190="" src="/assets/png/hint-c6828dc5.png" />
                <span data-v-24736190="">
                  To ensure the safety of your funds, please link your wallet
                </span>
              </div> */}             

              <div data-v-24736190="" className="addUSDT__container-content-item">
                <div data-v-24736190="" className="label">
                  <svg data-v-24736190="" className="svg-icon icon-usdt2 icon icon">
                    <use href="#icon-usdt2"></use>
                  </svg>
                  Add USDT TRC20 Address<span style={{position: 'absolute', height: '1.17333rem',
    width: '.8rem',
    fontWeight: '900',
    fontSize: '.56rem',
    lineHeight: '1.17333rem',}}><img data-v-cb5583fe="" src="/assets/png/usdt.png" style={{width: 'auto',  height: '.6rem',   marginTop: '.26667rem',}}/>
                 
                 </span>
                </div>
                <div data-v-24736190="" className="input">             
                  <input
                    data-v-24736190=""
                    placeholder="   Please enter the USDT Trc20 address"
                    maxLength="36"
                    value={trc20}  
                    onChange={(e) => setTrc(e.target.value)}  
                   // Display the correct address
                   
                  />
                </div>
              </div>

              <div data-v-24736190="" className="addUSDT__container-content-item">
                <div data-v-24736190="" className="label">
                  <svg data-v-24736190="" className="svg-icon icon-usdt2 icon icon">
                    <use href="#icon-usdt2"></use>
                  </svg>Add USDT Bep20 Address<span style={{position: 'absolute', height: '1.17333rem',
    width: '.8rem',
    fontWeight: '900',
    fontSize: '.56rem',
    lineHeight: '1.17333rem',}}><img data-v-cb5583fe="" src="/assets/png/trc20.png" style={{width: 'auto',  height: '.6rem',   marginTop: '.26667rem',}}/>
                 
                 </span>
                </div>
                <div data-v-24736190="" className="input">
                  <input
                    data-v-24736190=""
                    placeholder="    Please enter the USDT Bep20 address"
                    maxLength="36"
                    value={bep20}  
                    onChange={(e) => setBep(e.target.value)} 
                   
                  />
                </div>
              </div>

              <div data-v-24736190="" className="addUSDT__container-content-btn">
                <button data-v-24736190="" className="" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>

          {/* <div
            className="van-overlay"
            role="button"
            tabIndex="0"
            data-v-24736190=""
            style={{ zIndex: 2006, display: isVisible ? 'block' : 'none' }}
          ></div> */}
          
        </div>

        <div
          className="customer"
          id="customerId"
          style={{
            '--f13b4d11-currentFontFamily': "'Roboto', 'Inter', sansSerif",
            '--f6a705e1-currentFontFamily': 'bahnschrift',
          }}
        >
          {/* <img
            className=""
            data-origin="/assets/png/icon_sevice-9f0c8455.png"
            src="/assets/png/icon_sevice-9f0c8455.png"
          /> */}
          <p data-v-5ca05f64="" className="customer__mobile">
            {`+91-9876543210`}
          </p>
        </div>
      </div>
    </div>
  );
}
