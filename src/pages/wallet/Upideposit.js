import { useState, useEffect } from "react";
import React from 'react';
import Api from '../../services/Api';
import { useToast } from '../../components/ToastContext'; 
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function UpiDeposit(){

  const [isButtonActive, setButtonActive] = useState(true); // For button state
  const [utr, setUtr] = useState(''); // For UTR input
  const [money, setMoney] = useState(''); // For storing money from location

  const { showToast } = useToast(); // Toast notification

  const navigate = useNavigate();
  const location = useLocation();

  // Step 1: Use useEffect to handle setting the money state
  useEffect(() => {
    if (location.state && location.state.money) {
      setMoney(location.state.money);
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
        
    if(utr.length < 12){
      showToast('UTR must be 12 digit long.', 'succes');
return;
    }


    try {
      const response = await Api.post('/api/webapi/manualPayment', {
        upi: selectedOption,
        money: money,
        txt_utr: utr,
      });

      if (response.data.message==='Order created successfully') {
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
                            <div data-v-67e25db3="" className="time" style={{fontSize: '2em', color: '#ff0000'}}>₹ {money}</div>
                        </div>
                        <div data-v-67e25db3="" className="sec2" style={{margin: '10px 0', textAlign: 'center'}}>
                            <div data-v-67e25db3="" className="ti2" style={{fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px', color: '#333'}}>Copy to UPI Payment Software</div>
                            <div data-v-67e25db3="" className="num2" style={{fontSize: '1.2em', color: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                                UPI:P2024090609590109021@ubipp
                                <svg data-v-67e25db3="" className="c5" xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none" style={{marginLeft: '10px'}}>
                                    <rect data-v-67e25db3="" x="1" y="3" width="8" height="9" rx="1" stroke="black"></rect>
                                    <path data-v-67e25db3="" d="M9.5 10H10C10.5523 10 11 9.55228 11 9V2C11 1.44772 10.5523 1 10 1H4C3.44772 1 3 1.44772 3 2V3" stroke="black"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                  
               
                 

                  
                </div>


                  <div data-v-7cba6004="" data-v-36cc3380=""      className="Recharge__container-intro" style={{marginTop: '40px'}}>
                   
                       <div data-v-9e03166f="" className="Recharge__content-paymoney       boxStyle" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 2fr))', gridTemplateRows: 'repeat(2, minmax(100px, 2fr))'}}>

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
                     
                        
                        


                    </div>
                    <div data-v-7cba6004="" data-v-36cc3380=""      className="Recharge__container-intro">
                   
    <div data-v-9e03166f="" className="Recharge__content-paymoney">
         
        <div data-v-9e03166f="" className="" style={{width: '100%', height: 'auto',  display: 'flex',
            flexDirection: 'column',
        justifyContent: 'spaceAround',
       
        }}>
{/* <div className="txt" style={{display: 'flex', flexDirection: 'row',  marginTop: '10px',}}>
  <img style={{width: '20px'}} src="/assets/png/th (5).jpeg" alt=""/>
  <h1 style={{fontSize: '20px', paddingRight: '5px',}}>Other</h1>
  </div> */}

            <div data-v-67e25db3="" className="codeqr">
       
            <div data-v-67e25db3="" className="imgqr" style={{
               width: '150px',
               height: '150px',
                border: '1px solid #ddd',
              
                borderRadius: '8px', marginLeft: '80px',}}>
              <img
                data-v-67e25db3=""
                src="data:image/png;base64,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"
                alt="QR Code"
                id="canvasDom"
              />
            </div>
          </div>
            <div data-v-9e03166f="" className="place-right" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '9%',}}>
                <h3 style={{color:'#fff'}}>Note: Please Submit UTR Number After Done Payment</h3>
            </div>
        </div>

    </div>
</div>
   

   

   <div data-v-9e03166f="" className="Recharge__content-paymoney__money-input radius">
    <div data-v-9e03166f="" className="van-cell van-field van-field--disabled amount-input" modelmodifiers="[object Object]">
      <div className="van-cell__value van-field__value">
        <div className="van-field__body">
          <input type="number" inputmode="numeric" id="van-field-3-input" className="van-field__control" value={utr}
            placeholder=" Please enter the 12 digit UTR number" onChange={handleInputChange}
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