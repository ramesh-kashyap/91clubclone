import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api'


export default function Withdraw() {
 
  



  const [activeSection, setActiveSection] = useState('section1');
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [amount, setAmount] = useState(null);
  const [needToBet, setNeedToBet] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);


  const showSection = (sectionID) =>{
     setActiveSection(sectionID);
  };
  const navigate = useNavigate();
 


  const fetchUserInfo = async () => {
    try {
      const response = await Api.post('/api/webapi/check/Info');
      const data =  response.data;

      console.log(data.userInfo[0].money);

      setUserInfo(data.userInfo[0]); // Assuming data.data contains the user's information
      setWalletAddress(data.datas[0].usdtBep20)

      if(data.userInfo[0].total_bet > data.userInfo[0].able_to_bet){
        setNeedToBet(0);
      }
      else{
        setNeedToBet( parseFloat(data.userInfo[0].able_to_bet) - parseFloat(data.userInfo[0].total_bet) );
      }


    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred. Please try again.');
    } 
  };

  const handleSubmit = async (e) => {
    if (amount< 900) {
      setError('Amount need to be greater than 900');
      return;
    }
    if (needToBet < 0) {
      setError('You need to bet more to Withdraw');
      return;
    }
    try {
        
      const paymentMode= activeSection == 'section2' ? "USDT(TRC20)" : null ;

            

      const response = await Api.post('/api/webapi/withdrawalUsdt', {
        money: amount, 
        paymentMode,
      });
      console.log(response.data);
      if (response.data.status == true) {
        // Redirect to login or home page
        console.log("Withdraw Success");

        fetchUserInfo();

      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
};

  useEffect(() => {

    fetchUserInfo();

    console.log();


}, []);







  return (
    <div style={{fontSize: '12px'}}>
 

    <div id="app" data-v-app="">
      <div
        data-v-647954c7=""
        className="ar-loading-view"
        style={{
          "--f13b4d11-currentFontFamily": "{'Roboto', 'Inter', 'sansSerif'}",
          display: 'none',
        }}
      >
        <div data-v-647954c7="" className="loading-wrapper">
          <div data-v-647954c7="" className="loading-animat">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              
              viewBox="0 0 200 200"
              width="200"
              height="200"
              preserveAspectRatio="xMidYMid meet"
              style={{
                width: '100%',
                height: '100%',
                transform: 'translate3d(0px, 0px, 0px)',
                contentVisibility: 'visible'}}
              
            >
              <defs>
                <clipPath id="__lottie_element_2">
                  <rect width="200" height="200" x="0" y="0"></rect>
                </clipPath>
                <image
                  href="data:image/png;base64,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"
                ></image>
                <image
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg=="
                ></image>
              </defs>
              <g clipPath="url(#__lottie_element_2)">
                <g
                  className="ai"
                  transform="matrix(1,0,0,1,0,0)"
                  opacity="1"
                  style={{display: 'block'}}
                >
                  <image
                    width="200px"
                    height="200px"
                    preserveAspectRatio="xMidYMid slice"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg=="
                  ></image>
                </g>
                <g
                  className="png"
                  transform="matrix(0.800000011920929,0,0,0.800000011920929,60,60)"
                  opacity="1"
                  style={{display: 'block'}}
                >
                  <image
                    width="100px"
                    height="100px"
                    preserveAspectRatio="xMidYMid slice"
                    href="data:image/png;base64,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"
                  ></image>
                </g>
              </g>
            </svg>
          </div>
          <div data-v-647954c7="" className="com__box" style={{display: 'none'}}>
            <div className="loading" data-v-647954c7="">
              <div className="shape shape-1" data-v-647954c7=""></div>
              <div className="shape shape-2" data-v-647954c7=""></div>
              <div className="shape shape-3" data-v-647954c7=""></div>
              <div className="shape shape-4" data-v-647954c7=""></div>
            </div>
            
          </div>
          
        </div>
        <div data-v-647954c7="" className="skeleton-wrapper" style={{display: 'none'}}>
          <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
            
            <div className="van-skeleton__content">
              
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '60%'}}></div>
            </div>
          </div>
          <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
            <div className="van-skeleton-avatar van-skeleton-avatar--round"></div>
            <div className="van-skeleton__content">
              <h3 className="van-skeleton-title"></h3>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '60%'}}></div>
            </div>
          </div>
          <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
            
            <div className="van-skeleton__content">
              <h3 className="van-skeleton-title"></h3>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '100%'}}></div>
              <div className="van-skeleton-paragraph" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div
        data-v-80a607a5=""
        className="withdraw__container"
        style={{'--f13b4d11-currentFontFamily': "'Roboto', 'Inter', sans-serif"}}
      >
        <div data-v-12a80a3e="" data-v-80a607a5="" className="navbar">
          <div data-v-12a80a3e="" className="navbar-fixed">
            <div data-v-12a80a3e="" className="navbar__content">
              <div data-v-12a80a3e="" className="navbar__content-left">
                <i
                  data-v-12a80a3e=""
                  className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={()=>navigate('/wallet')}
                  ></i
                >
              </div>
              <div data-v-12a80a3e="" className="navbar__content-center">
                
                <div data-v-12a80a3e="" className="navbar__content-title">
                  Withdraw
                </div>
              </div>
              <div data-v-12a80a3e="" className="navbar__content-right">
                <span data-v-80a607a5="">Withdrawal history</span>
              </div>
            </div>
          </div>
        </div>
        <div data-v-80a607a5="" className="withdraw__container-content">
          
          <div data-v-0879c174="" data-v-80a607a5="" className="balanceAssets">
            <div data-v-0879c174="" className="balanceAssets__header">
              <div data-v-0879c174="" className="balanceAssets__header__left">
                <img
                  data-v-0879c174=""
                  src="/assets/png/balance-e39ce400.png"
                />
                Available balance
              </div>
            </div>
            <div data-v-0879c174="" className="balanceAssets__main">
              <p data-v-0879c174="">₹{userInfo?userInfo.money:0}</p>
              <img
                data-v-0879c174=""
                src="/assets/png/refresh-8e0efe26.png"
                alt=""
              />
            </div>
          </div>
        
          <div data-v-9bae072d="" data-v-80a607a5="" className="withdrawWay">
            
            <div data-v-9bae072d="" className={`${activeSection === 'section1' ? 'select' : ''}`} onClick={()=> showSection('section1')}>
              <div data-v-9bae072d="">
                <img
                  data-v-9bae072d=""
                  src="https://ossimg.91admin123admin.com/91club/payNameIcon/WithBeforeImgIcon2_20230912183258ejvp.png"
                />
              </div>
              <span data-v-9bae072d=""> BANK CARD</span>
            </div>
            <div data-v-9bae072d="" className={`${activeSection === 'section2' ? 'select' : ''}`} onClick={() => showSection('section2')}>
              <div data-v-9bae072d="">
                <img
                  data-v-9bae072d=""
                  src="https://ossimg.91admin123admin.com/91club/payNameIcon/WithBeforeImgIcon_20230912183344vmsx.png"
                />
              </div>
              <span data-v-9bae072d="">USDT</span>
            </div>
          </div>
          <div  id="section1" style={{ display: activeSection === 'section1' ? 'block' : 'none' }}>
          <div data-v-80a607a5="" className="bankInfo">
            <div data-v-80a607a5="" className="bankInfoItem type1">
              <div data-v-80a607a5="">
                <svg data-v-80a607a5="" className="svg-icon icon-1">
                  <use href="#icon-1"></use></svg
                ><span data-v-80a607a5="">Yes Bank</span>
              </div>
              <div data-v-80a607a5="">
                <span data-v-80a607a5=""></span
                ><span data-v-80a607a5="">084399****495</span>
              </div>
              <i
                data-v-80a607a5=""
                className="van-badge__wrapper van-icon van-icon-arrow"
                ></i
              >
            </div>       
    </div>
          <div data-v-cb5583fe="" className="explain">
            <div data-v-cb5583fe="" className="input">
              <div data-v-cb5583fe="" className="place-div">₹</div>
              <input
                data-v-cb5583fe=""
                placeholder="Please enter the amount"
                className="inp"
                
              />
            </div>
            
            <div data-v-cb5583fe="" className="balance bank">
              <div data-v-cb5583fe="">
                <span data-v-cb5583fe=""
                  >Withdrawable balance
                  <h6 data-v-cb5583fe="" className="yellow">₹{userInfo ? userInfo.money :0}</h6></span
                ><input data-v-cb5583fe="" type="button" value="All" />
              </div>
              <div data-v-cb5583fe="">
                <span data-v-cb5583fe="">Withdrawal amount received</span>
                <div data-v-cb5583fe="" className="rightD">
                  <span data-v-cb5583fe="" className="yellow">₹0.00</span>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div data-v-ef5c8333="" data-v-80a607a5="" className="addWithdrawType" id="section2" style={{ display: activeSection === 'section2' ? 'block' : 'none' }}>
          <div data-v-80a607a5="" className="bankInfo" style={{display: walletAddress == null ? 'none':'block'}}>
            <div data-v-80a607a5="" className="bankInfoItem type1">
              <div data-v-80a607a5="">
                <svg data-v-80a607a5="" className="svg-icon icon-1">
                  <use href="#icon-1"></use></svg
                ><span data-v-80a607a5="">Yes Bank</span>
              </div>
              <div data-v-80a607a5="">
                <span data-v-80a607a5=""></span
                ><span data-v-80a607a5="">{walletAddress.substring(0, 9)}...{walletAddress.substring(walletAddress.length - 6)}</span>
              </div>
              <i
                data-v-80a607a5=""
                className="van-badge__wrapper van-icon van-icon-arrow"
                ></i
              >
            </div>       
    </div>
            <div data-v-ef5c8333="" className="addWithdrawType-top" onClick={()=>navigate('/wallet/Withdraw/AddUSDT')} style={{display: walletAddress !== null ? 'none':'block'}}>
              <img data-v-ef5c8333="" src="/assets/png/add-1ad7f3f5.png" /><span
                data-v-ef5c8333="">Add a bank account number</span>
            </div>
            <div data-v-ef5c8333="" className="addWithdrawType-text">
              Need to add beneficiary information to be able to withdraw money
            </div>
            <div data-v-cb5583fe="" className="explain usdt">
            <div data-v-cb5583fe="" className="head">
              <img
                data-v-cb5583fe="" src="/assets/png/usdt.png"
              />
            </div>
            
            <div data-v-cb5583fe="" className="input">
              <div data-v-cb5583fe="" className="place-div">₹</div>
              <input
                data-v-cb5583fe=""
                type="number"
                placeholder="Please enter withdrawal amount"
                className="inp"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div data-v-cb5583fe="" className="balance usdt">
              <div data-v-cb5583fe="">
                <span data-v-cb5583fe=""
                  >Withdrawable balance
                  <h6 data-v-cb5583fe="" className="yellow">₹{userInfo?userInfo.money:0}</h6></span
                ><input data-v-cb5583fe="" type="button" value="All" />
              </div>
            </div>
          </div>
          </div>
          
          
          <div data-v-80a607a5="" className="recycleBtnD">
            <button data-v-80a607a5="" className="recycleBtn" onClick={handleSubmit}>Withdraw</button>
          </div>
      
          <div
            data-v-76eb7f31=""
            data-v-80a607a5=""
            className="Recharge__container-intro"
          >
            <div data-v-76eb7f31="" className="br">
              
              <p data-v-76eb7f31="">
                Need to bet <span data-v-470caa86="" className="red">₹{needToBet}</span> to
                be able to withdraw
              </p>
              <p data-v-76eb7f31="">
                Withdraw time
                <span data-v-76eb7f31="" className="red">00:05-23:55</span>
              </p>
              <p data-v-76eb7f31="">
                Inday Remaining Withdrawal Times<span
                  data-v-76eb7f31=""
                  className="red"
                  >3</span
                >
              </p>
              <p data-v-76eb7f31="">
                Withdrawal amount range
                <span data-v-76eb7f31="" className="red">₹110.00-₹200,000.00</span>
              </p>
              
              <p data-v-76eb7f31="">
                Please confirm your beneficial account information before
                withdrawing. If your information is incorrect, our company will
                not be liable for the amount of loss
              </p>
              <p data-v-76eb7f31="">
                If your beneficial information is incorrect, please contact
                customer service
              </p>
            </div>
          </div>
          <div
            data-v-30972a14=""
            data-v-80a607a5=""
            className="rechargeh__container"
          >
            <div data-v-30972a14="" className="rechargeh__container-head">
              <svg data-v-30972a14="" className="svg-icon icon-historyHead">
                <use href="#icon-historyHead"></use>
              </svg>
              <h1 data-v-30972a14="">Withdrawal history</h1>
            </div>
            <div data-v-30972a14="" className="rechargeh__container-content">
              <div
                data-v-30972a14=""
                className="rechargeh__container-content__item"
              >
                <div
                  data-v-30972a14=""
                  className="rechargeh__container-content__item-header ar-1px-b"
                >
                  <span data-v-30972a14="">Withdraw</span
                  ><span data-v-30972a14="" className="stateG"
                    >Completed
                    </span
                  >
                </div>
                <div
                  data-v-30972a14=""
                  className="rechargeh__container-content__item-body"
                >
                  <div data-v-30972a14="">
                    <span data-v-30972a14="">Balance</span
                    ><span data-v-30972a14="">₹110.00</span>
                  </div>
                  <div data-v-30972a14="">
                    <span data-v-30972a14="">Type</span
                    ><span data-v-30972a14=""> BANK CARD</span>
                  </div>
                  <div data-v-30972a14="">
                    <span data-v-30972a14="">Time</span
                    ><span data-v-30972a14="">2024-07-09 15:53:08</span>
                  </div>
                  <div data-v-30972a14="">
                    <span data-v-30972a14="">Order number</span
                    ><span data-v-30972a14="">WD2024070915530896076538c</span
                    ><svg data-v-30972a14="" className="svg-icon icon-copy">
                      <use href="#icon-copy"></use>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div data-v-30972a14="" className="rechargeh__container-footer">
              <button data-v-30972a14="" onClick={()=>navigate('/wallet')}>All history</button>
            </div>
          </div>
        </div>
        <div data-v-3e71d3da="" data-v-80a607a5="" className="dialog inactive c2c">
          <div
            data-v-3e71d3da=""
            className="dialog__container"
            role="dialog"
            tabIndex="0"
          >
            <div data-v-3e71d3da="" className="dialog__container-img">
              <img
                data-v-80a607a5=""
                className="succeedImg"
                data-origin="/assets/png/succeed-83674414.png"
                src="/assets/png/succeed-83674414.png"
              />
            </div>
            <div data-v-3e71d3da="" className="dialog__container-title">
              <h1 data-v-3e71d3da="">C2C withdrawal successful</h1>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-content">
              <div data-v-80a607a5="" className="c2cTip">
                <h1 data-v-80a607a5="">
                  Please come back and click [Confirm Payment] after receiving
                  the transfer
                </h1>
                <p data-v-80a607a5="">
                  C2C withdrawal rewards will be automatically issued after you
                  click <span>[Confirm Arrival]</span>!
                </p>
              </div>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-footer">
              <button data-v-3e71d3da="">Confirm</button
              >
            </div>
            
          </div>
          <div data-v-3e71d3da="" className="dialog__outside"></div>
        </div>
        <div data-v-3e71d3da="" data-v-80a607a5="" className="dialog inactive">
          <div
            data-v-3e71d3da=""
            className="dialog__container"
            role="dialog"
            tabIndex="0"
          >
            <div data-v-3e71d3da="" className="dialog__container-img">
              <img
                data-v-3e71d3da=""
                className=""
                alt=""
                data-origin="/assets/png/tip-0498e3f9.png"
                src="/assets/png/tip-0498e3f9.png"
              />
            </div>
            <div data-v-3e71d3da="" className="dialog__container-title">
              <h1 data-v-3e71d3da=""></h1>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-content">
              <h1 data-v-80a607a5="">
                You must recharge to enable the withdrawal function
              </h1>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-footer">
              <button data-v-3e71d3da="">Confirm</button
              >
            </div>
            <img
              data-v-3e71d3da=""
              className="close_img"
              src="/assets/png/close-84ce5e6a.png"
            />
          </div>
          <div data-v-3e71d3da="" className="dialog__outside"></div>
        </div>
      </div>
      <div
        className="customer"
        id="customerId"
        style={{
          '--f13b4d11-currentFontFamily': "'Roboto', 'Inter', sans-serif",
          '--f6a705e1-currentFontFamily': "bahnschrift"
    }}
      >
        <img
          className=""
          data-origin="/assets/png/icon_sevice-9f0c8455.png"
          src="/assets/png/icon_sevice-9f0c8455.png"
        />
      </div>
      
    </div>
  
    </div>
  )
}
