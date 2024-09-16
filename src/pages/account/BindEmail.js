import {React, useState} from 'react';
import { useNavigate  } from 'react-router-dom';
import Api from '../../services/Api';
import { useToast } from '../../components/ToastContext'; 
 



export default function Register() {


  const { showToast } = useToast();




  const navigate = useNavigate();
        
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [bindSuccess, setBindSuccess] = useState(false);

  const handleSendOtp = async () => {
    try {
      const response = await Api.post('/send-otp', { email });
      if (response.status === 200) {
        setOtpSent(true); // OTP sent successfully

        showToast('OTP sent to your email successfully.', 'succes');

        // alert('OTP sent to your email successfully.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      showToast('Failed to send OTP', 'succes');

      // alert(error.response.data.message || 'Failed to send OTP');
    }
  };

  const handleBindEmail = async () => {
    try {
      const response = await Api.post('/verify-otp', { email, otp });

      if (response.status === 200) {
        setBindSuccess(true);
        showToast('Email bound successfully!', 'succes');

        // alert('Email bound successfully!');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showToast('Failed to verify OTP', 'succes');

      // alert(error.response.data.message || 'Failed to verify OTP');
    }
  };



  return (
    <div style={{fontSize: '12px'}}> 



<div id="app" data-v-app="">
  
  <div
    data-v-eca8202a=""
    className="bind-container"
    style={{'--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'"}}
  >
    <div data-v-12a80a3e="" data-v-eca8202a="" className="navbar white">
      <div data-v-12a80a3e="" className="navbar-fixed">
        <div data-v-12a80a3e="" className="navbar__content">
          <div data-v-12a80a3e="" className="navbar__content-left">
            <i
              data-v-12a80a3e=""
              className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={()=>navigate('/main/SettingCenters')}
              ></i
            >
          </div>
          <div data-v-12a80a3e="" className="navbar__content-center">
            <div data-v-12a80a3e="" className="navbar__content-title">
              Bind mailbox
            </div>
          </div>
          <div data-v-12a80a3e="" className="navbar__content-right"></div>
        </div>
      </div>
    </div>
    <div data-v-eca8202a="" className="email-container">
      <div data-v-eca8202a="">
        <div data-v-4499df08="" data-v-eca8202a="" className="emailcontainer">
          <div data-v-4499df08="" className="emailinput__container">
            <div data-v-4499df08="" className="emailinput__container-label">
              <svg
                data-v-4499df08=""
                className="svg-icon icon-email emailinput__container-label__icon emailinput__container-label__icon"
              >
                <use href="#icon-email"></use></svg
              ><span data-v-4499df08="">Mail</span>
            </div>
            <div data-v-4499df08="" className="emailinput__container-input">
              <input
                data-v-4499df08=""
                type="text"
                name="userEmail"
                maxLength="250"
                placeholder="please input your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        data-v-484b25b1=""
        data-v-eca8202a=""
        className="verifyInput__container"
      >
        <div data-v-484b25b1="" className="verifyInput__container-label">
          <svg
            data-v-484b25b1=""
            className="svg-icon icon-safeIcon verifyInput__container-label__icon verifyInput__container-label__icon"
          >
            <use href="#icon-safeIcon"></use></svg
          ><span data-v-484b25b1="">Verification Code</span>
        </div>
        <div data-v-484b25b1="" className="verifyInput__container-input">
          <input
            data-v-484b25b1=""
            type="text"
            placeholder="Please enter the confirmation code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          /><button data-v-484b25b1="" className="">
            <span data-v-484b25b1="" onClick={handleSendOtp}>Send</span>
          </button>
        </div>
        <div
          data-v-484b25b1=""
          className="verifyInput__container-tip"
          style={{display: 'none'}}
        >
          <i
            data-v-484b25b1=""
            className="van-badge__wrapper van-icon van-icon-warning-o"
            ></i
          ><span data-v-484b25b1="">Did not receive verification code?</span
          ><span data-v-484b25b1="">Contact customer service</span>
        </div>
      </div>
      <div
        data-v-eca8202a=""
        className="updateP-container-tips"
        style={{display: 'none'}}
        >
        <span data-v-eca8202a="">Please enter the confirmation code!</span>
      </div>
      <div data-v-eca8202a="" className="bind-button">
        <button data-v-eca8202a=""           style={{display: 'none'}}
        >Next step</button
        ><button data-v-eca8202a="" onClick={handleBindEmail}>Bind</button>
      </div>
    </div>
    <div data-v-c0caae78="" data-v-eca8202a="" className="dialog inactive">
      <div
        data-v-c0caae78=""
        className="dialog__container"
        role="dialog"
        tabIndex="0"
      >
        <div data-v-c0caae78="" className="dialog__container-img">
          <img
            data-v-c0caae78=""
            alt=""
            className=""
            data-origin="/assets/png/succeed-83674414.png"
            src="/assets/png/succeed-83674414.png"
          />
        </div>
        <div data-v-c0caae78="" className="dialog__container-title">
          <h1 data-v-c0caae78="">bind successfully</h1>
        </div>
        <div data-v-c0caae78="" className="dialog__container-content"></div>
        <div data-v-c0caae78="" className="dialog__container-footer">
        <button data-v-c0caae78="">Confirm</button>
        </div>
      </div>
      <div data-v-c0caae78="" className="dialog__outside"></div>
    </div>
  </div>
  <div
    className="customer"
    id="customerId"

    style={{
     ' --f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'",
      '--f6a705e1-currentFontFamily': 'bahnschrift'
    }}
  >
    {/* <img
      className=""
      data-origin="/assets/png/icon_sevice-9f0c8455.png"
      src="/assets/png/icon_sevice-9f0c8455.png"
    /> */}
  </div>
</div>

    </div>
  )
}
