import { useState, useEffect } from "react";
import React from 'react';
import Api from '../../services/Api';
import { useToast } from '../../components/ToastContext'; 
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Or use QRCodeSVG if you prefer SVG rendering



export default function CryptoDeposit(){

  const [isButtonActive, setButtonActive] = useState(true); // For button state
  const [utr, setUtr] = useState(''); // For UTR input
  const [money, setMoney] = useState(''); // For storing money from location
  const [currency, setCurrency] = useState(''); // For storing money from location
  const [adminData, setAdminData] = useState(''); // For storing money from location
  const [error, setError] = useState(null);


  const { showToast } = useToast(); // Toast notification

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await Api.get('/api/webapi/GetUserInfo');
        if (response.data.status) {
          setAdminData(response.data.data.adminData);
         
        } else {
          setError('Failed to fetch user info');
        }
      } catch (err) {
        setError('Error fetching user info');
        console.error(err);
      } 
    };

    fetchUserInfo();
  }, []);

  // Step 1: Use useEffect to handle setting the money state
  useEffect(() => {
    if (location.state && location.state.money && location.state.currency) {
      setMoney(location.state.money);
      setCurrency(location.state.currency);
      console.log(location.state.currency);

    } else {
       

      navigate('/wallet/deposit'); // Redirect if no money data
    }
  }, [location, navigate]);

  // Step 2: Handle UTR input change and button state
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUtr(value);

    // Enable or disable button based on UTR value
    setButtonActive(!value);
  };

  const handlePay = async () => {
        
//     if(utr.length < 12){
//       showToast('UTR must be 12 digit long.', 'succes');
// return;
//     }


    try {
      const response = await Api.post('/api/webapi/rechargeCoin', {
        currency: currency,
        money: money,
        tx_id: utr,
      });

      if (response.data.message==='Order Submitted successfully') {
        console.log('Recharge Done Successfully'); 
        navigate('/wallet/deposit', { state: { msg: 'Order created successfully' } });
      } else {

        // console.log('Cancellation failed:', response.data.message);
      }
    } catch (error) {
      showToast('Error while creating Order.', 'succes');

      console.error('Error while cancelling recharge:', error);
    }
  };

  // Step 3: Handle radio button change for payment options
  const [selectedOption, setSelectedOption] = useState('paytm');
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

    return(
<div className="" style={{fontSize: '12px'}}>

    <div id="app" data-v-app="">
       
        <div data-v-003e4505="" id="home" className="red-home content"
            style={{'--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'"}}>
            <div data-v-12a80a3e="" data-v-003e4505="" className="navbar white">
                <div data-v-12a80a3e="" className="navbar-fixed">
                    <div data-v-12a80a3e="" className="navbar__content">
                        <div data-v-12a80a3e="" className="navbar__content-left"><img data-v-003e4505=""
                                src="/assets/png/BDGPRO2.png"
                                alt=""/></div>
                        <div data-v-12a80a3e="" className="navbar__content-center">
                            <div data-v-12a80a3e="" className="navbar__content-title"></div>
                        </div>
                      
                    </div>
                </div>

                
            </div>
            
            <div className="container11">
          
              <div  className="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '40px',}}>
                
                    <div data-v-67e25db3="" className="maindiv" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',  borderRadius: '10px', width: '100%', margin: '0 auto', background: `url('/assets/bottom-ccedfa9a.png')`,backgroundPositionX:'center',backgroundRepeat: 'no-repeat', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',}}>
                        <div data-v-67e25db3="" className="sec1" style={{margin: '10px 0', textAlign: 'center',}}>
                            <div data-v-67e25db3="" className="ti1" style={{fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px', color: '#333'}}>Payment</div>
                            <div data-v-67e25db3="" className="time" style={{fontSize: '2em', color: '#ff0000'}}>${money}( ₹{money * 90})</div>
                        </div>
                        <div data-v-67e25db3="" className="sec2" style={{margin: '10px 0', textAlign: 'center'}}>
                            <div data-v-67e25db3="" className="ti2" style={{fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px', color: '#333'}}>Copy Wallet Address</div>
                            <div data-v-67e25db3="" className="num2" style={{fontSize: '1.2em', color: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                                {currency =='USDT(BEP20)'? adminData[0]?.bep20 : adminData[0]?.trc20 }
                                <svg data-v-67e25db3="" className="c5" xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{marginLeft: '1px'}}>
                                    <rect data-v-67e25db3="" x="1" y="3" width="8" height="9" rx="1" stroke="black"></rect>
                                    <path data-v-67e25db3="" d="M9.5 10H10C10.5523 10 11 9.55228 11 9V2C11 1.44772 10.5523 1 10 1H4C3.44772 1 3 1.44772 3 2V3" stroke="black"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                  
               
                 

                  
                </div>


                  <div data-v-7cba6004="" data-v-36cc3380=""      className="Recharge__container-intro" style={{marginTop: '40px'}}>
                   
                       {/* <div data-v-9e03166f="" className="Recharge__content-paymoney       boxStyle" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 2fr))', gridTemplateRows: 'repeat(2, minmax(100px, 2fr))'}}>

                        <div data-v-9e03166f="" className="Recharge__content-paymoney__money-input radius" style={{width: '81%', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',background: '#fff',  marginTop: '.26667rem'}}>
                            <div data-v-9e03166f="" className="" >
                                <img src="/assets/png/OIP.jpeg" className="imgs" style={{width: '108px', height: '70px',  aspectRatio: '3 / 2', objectFit: 'cover', mixBlendMode: 'darken'}}/>
                              </div>
                            
                            <div data-v-9e03166f="" className="place-right" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '9%',}}>
                                <input type="radio" name="option" value="paytm"
          checked={selectedOption === 'paytm'}
          onChange={handleOptionChange}
 style={{transform: 'scale(1.5)'}}  />
                            </div>
                        </div>
                        
                        <div data-v-9e03166f="" className="Recharge__content-paymoney__money-input radius" style={{width: '81%', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',background: '#fff',marginLeft:'20px',}}>
                            <div data-v-9e03166f="" className=" " style={{width: '50%'}}>
                                <img src="/assets/png/th (1).jpeg" className="imgs" style={{width: '108px', height: '70px',  aspectRatio: '3 / 2', objectFit: 'cover', mixBlendMode: 'darken'}}/>
                            </div>
                            
                            <div data-v-9e03166f="" className="place-right" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '9%',}}>
                                <input type="radio" name="option" value="phonepe"
          checked={selectedOption === 'phonepe'}
          onChange={handleOptionChange}
 style={{transform: 'scale(1.5)'}}/>
                            </div>
                        </div>
                        <div data-v-9e03166f="" className="Recharge__content-paymoney__money-input radius" style={{width: '81%', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',background: '#fff'}}>
                            <div data-v-9e03166f="" className=" " style={{width: '50%'}}>
                                <img src="/assets/png/th.jpeg" className="imgs" style={{width: '108px', height: '70px',  aspectRatio: '3 / 2', objectFit: 'cover', mixBlendMode: 'darken'}}/>
                            </div>
                            
                            <div data-v-9e03166f="" className="place-right" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '9%',}}>
                                <input type="radio" name="option" value="gpay"
          checked={selectedOption === 'gpay'}
          onChange={handleOptionChange}
 style={{transform: 'scale(1.5)'}}/>
                            </div>
                        </div>
                        <div data-v-9e03166f="" className="Recharge__content-paymoney__money-input radius" style={{width: '81%', height: '65px', background: '#fff', marginLeft:'20px',}}>
                            <div data-v-9e03166f="" className=" " style={{width: '50%'}}>
                                <img src="/assets/png/image-260nw-2327361425.webp" className="imgs" style={{width: '108px', height: '70px',  aspectRatio: '3 / 2', objectFit: 'cover', mixBlendMode: 'darken'}}/>
                            </div>
                            
                            <div data-v-9e03166f="" className="place-right" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '9%',}}>
                                <input type="radio" name="option" value="upi"
          checked={selectedOption === 'upi'}
          onChange={handleOptionChange}
 style={{transform: 'scale(1.5)'}}/>
                            </div>
                        </div>
                     
                        
                        


                    </div> */}
                    <div data-v-7cba6004="" data-v-36cc3380=""      className="Recharge__container-intro">
                   
    <div data-v-9e03166f="" className="Recharge__content-paymoney">
         
        <div data-v-9e03166f="" className="" style={{width: '100%', height: 'auto',  display: 'flex',
            flexDirection: 'column',
        justifyContent: 'spaceAround',
       
        }}>


            <div data-v-67e25db3="" className="codeqr">
       
            <div data-v-67e25db3="" className="imgqr" style={{
               width: '150px',
               height: '150px',
              
                borderRadius: '8px', marginLeft: '80px',}}>
                                     <QRCodeCanvas  value=                                {currency =='USDT(BEP20)'? adminData[0]?.bep20 : adminData[0]?.trc20 }
  size={150} level={"H"} includeMargin={true} />

            </div>
          </div>
            <div data-v-9e03166f="" className="place-right" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '9%',}}>
                {/* <h3 style={{color:'#fff'}}>Note: Please Submit UTR Number After Done Payment</h3> */}
            </div>
        </div>

    </div>
</div>
   

   

   <div data-v-9e03166f="" className="Recharge__content-paymoney__money-input radius">
    <div data-v-9e03166f="" className="van-cell van-field van-field--disabled amount-input" modelmodifiers="[object Object]">
      <div className="van-cell__value van-field__value">
        <div className="van-field__body">
          <input type="number" inputmode="numeric" id="van-field-3-input" className="van-field__control" value={utr}
            placeholder=" Please enter the Transaction ID" onChange={handleInputChange}
            />
        </div>
        </div>
        </div>
        </div>

                        <div data-v-9e03166f="" className="Recharge__container-rechageBtn" onClick={handlePay} style={{ 
    backgroundColor: isButtonActive ? '' : '#c4933f'
  }}>Pay</div>
                    </div>
                    
                
                      
                  </div>
              
                </div>
                
              </div>
  
</div>)}
