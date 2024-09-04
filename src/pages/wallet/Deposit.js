import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Deposit(){
const [activeSection, setActiveSection] = useState('section1');
const [selectedAmount, setSelectedAmount] = useState('');
const [inputAmount, setInputAmount] = useState('');
const navigate = useNavigate();
const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };
  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setInputAmount(amount);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputAmount(value);

   

    // Clear the selectedAmount if input is changed manually and doesn't match any predefined amount
    if (amounts[activeSection].indexOf(value) === -1) {
      setSelectedAmount(''); 
    } else {
      setSelectedAmount(value); // Set selectedAmount to match input value
    }
  };
  const handleSubmit = () => {
    // Check if activeSection is 'section1' and inputAmount is provided
    if (activeSection === 'section1' && inputAmount) {
      navigate('/wallet/paymentPage', { state: { section: activeSection, amount: inputAmount } });
    } else {
      // Handle cases for other sections if needed or show an alert
      console.log('Section is not section1 or inputAmount is missing.');
    }
  };
  const amounts = {
    section1: ['300', '500', '800', '1000', '3000','5000'],
    section2: ['10', '20', '50','100','200','500'],
    section3: ['10', '20', '50','100','200','500'],
    section4: ['1000', '3000', '5000','10000','25000','50000'],
    section5: ['500', '1000', '1500', '2000', '5000', '10000'],
    section6: ['500', '1000', '1500', '2000', '5000', '10000'],
  };

  const isActive = (amount) => {
    return selectedAmount === amount || inputAmount === amount;
  };

 

 return(
 <div style={{fontSize: '12px'}} className="">
    

    <div id="app" data-v-app="">
      <div
        data-v-647954c7=""
        className="ar-loading-view"
        style={{
          "--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sansSerif'",
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
                contentVisibility: 'visible',
              }}
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
              <g clip-path="url(#__lottie_element_2)">
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
        data-v-36cc3380=""
        className="Recharge__box"
        style={{"--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sansSerif',"}}
      >
        <div data-v-36cc3380="" className="Recharge__container">
          <div data-v-12a80a3e="" data-v-36cc3380="" className="navbar white">
            <div data-v-12a80a3e="" className="navbar-fixed">
              <div data-v-12a80a3e="" className="navbar__content">
                <div data-v-12a80a3e="" className="navbar__content-left"  onClick={()=> navigate('/wallet')}>
                  <i
                    data-v-12a80a3e=""
                    className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={()=>navigate('/wallet')}
                    ></i
                  >
                </div>
                <div data-v-12a80a3e="" className="navbar__content-center">
                  
                  <div data-v-12a80a3e="" className="navbar__content-title">
                    Deposit
                  </div>
                </div>
                <div data-v-12a80a3e="" className="navbar__content-right">
                  <div data-v-36cc3380="" className="title" onClick={()=> navigate('/wallet/deposit')} >Deposit history </div>
                </div>
              </div>
            </div>
          </div>
          <div data-v-98c90f53="" data-v-36cc3380="" className="balanceAssets">
            <div data-v-98c90f53="" className="balanceAssets__header">
              <div data-v-98c90f53="" className="balanceAssets__header__left">
                <img
                  data-v-98c90f53=""
                  src="/assets/png/balance-e39ce400.png"
                />
                Balance
              </div>
            </div>
            <div data-v-98c90f53="" className="balanceAssets__main">
              <p data-v-98c90f53="">₹56.05</p>
              <img
                data-v-98c90f53=""
                src="/assets/png/refresh-8e0efe26.png"
                alt=""
              />
            </div>
            
          </div>
          <div data-v-4f3d8608="" data-v-36cc3380="">
            
            <div data-v-4f3d8608="" className="Recharge__container-tabcard">
            <div
                data-v-4f3d8608=""
                className={`Recharge__container-tabcard__items ${activeSection === 'section1' || 'section4' ? 'active' : ''}`}  onClick={() => showSection('section1')}
              >
                <div data-v-4f3d8608="" className="centers">
                  
                  <div
                    data-v-4f3d8608=""
                    className="Recharge__container-tabcard__top"
                  >
                    <img
                      data-v-4f3d8608=""
                      className="img"
                      src="https://ossimg.91admin123admin.com/91club/payNameIcon/payNameIcon_20240313185300ivg6.png"
                      alt=""
                    />
                  </div>
                  <div
                    data-v-4f3d8608=""
                    className="Recharge__container-tabcard__bot"
                  >
                    UPI-transfer
                  </div>
                </div>
              </div>
              <div
                data-v-4f3d8608=""
                 className={`Recharge__container-tabcard__items ${activeSection === 'section2' || 'section5' ? 'active' : ''}`}  onClick={() => showSection('section2')}
              >
                <div data-v-4f3d8608="" className="centers">
                  
                  <div
                    data-v-4f3d8608=""
                    className="Recharge__container-tabcard__top"
                  >
                    <img
                      data-v-4f3d8608=""
                      className="img"
                      src="/assets/png/usdt.png"
                      alt=""
                    />
                  </div>
                  <div
                    data-v-4f3d8608=""
                    className="Recharge__container-tabcard__bot"
                  >
                    USDT
                  </div>
                </div>
              </div>              
              <div
                data-v-4f3d8608=""
                className={`Recharge__container-tabcard__items ${activeSection === 'section3' || 'section6' ? 'active' : ''}`} onClick={() => showSection('section3')}
              >
                <div data-v-4f3d8608="" className="centers">
                  
                  <div
                    data-v-4f3d8608=""
                    className="Recharge__container-tabcard__top"
                  >
                    <img
                      data-v-4f3d8608=""
                      className="img"
                      src="/assets/png/trx.png"
                      alt=""
                    />
                  </div>
                  <div
                    data-v-4f3d8608=""
                    className="Recharge__container-tabcard__bot"
                  >
                    USDT BEP20
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
          <div data-v-9e03166f="" className="Recharge__content">
            <div
              data-v-9e03166f=""
              className="Recharge__content-quickInfo boxStyle"
            >
              <div
                data-v-9e03166f=""
                className="Recharge__content-quickInfo__title"
              >
                <div data-v-9e03166f="" className="title">
                  <svg data-v-9e03166f="" className="svg-icon icon-quickpay2">
                    <use href="#icon-quickpay2"></use>
                  </svg>
                  <p data-v-9e03166f="">Select channel</p>
                </div>
              </div>
              <div data-v-9e03166f="" className="rechargeTypes_list"  id="section3" style={{ display: activeSection === 'section3' ? 'grid' : 'none' }}>
                <div
                  data-v-9e03166f=""
                  className={`Recharge__content-quickInfo__item ${activeSection === 'section3' ? 'item_active' : ''}`}  onClick={() => showSection('section3')}
                >
                   
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-Super</div>
                    <div data-v-9e03166f="">Balance:300 - 50K</div>
                    
                  </div>
                </div>
                <div
                  data-v-9e03166f=""
                  className={`Recharge__content-quickInfo__item ${activeSection === 'section6' ? 'item_active' : ''}`}  onClick={() => showSection('section6')}
                >
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-ceco</div>
                    <div data-v-9e03166f="">Balance:500 - 50K</div>
                    
                  </div>
                </div>
                
              </div>
              {/* section 6 */}
              <div data-v-9e03166f="" className="rechargeTypes_list"  id="section6" style={{ display: activeSection === 'section6' ? 'grid' : 'none' }}>
                <div
                  data-v-9e03166f=""
                  className={`Recharge__content-quickInfo__item ${activeSection === 'section3' ? 'item_active' : ''}`}  onClick={() => showSection('section3')}
                >
                   
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-Super</div>
                    <div data-v-9e03166f="">Balance:300 - 50K</div>
                    
                  </div>
                </div>
                <div
                  data-v-9e03166f=""
                  className={`Recharge__content-quickInfo__item ${activeSection === 'section6' ? 'item_active' : ''}`}  onClick={() => showSection('section6')}
                >
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-ceco</div>
                    <div data-v-9e03166f="">Balance:500 - 50K</div>
                    
                  </div>
                </div>
                
              </div>
              {/* section 2 */}
              <div data-v-9e03166f="" className="rechargeTypes_list"  id="section2" style={{ display: activeSection === 'section2' ? 'grid' : 'none' }}>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section2' ? 'item_active' : ''}`}  onClick={() => showSection('section2')}>
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-ARpay</div>
                    <div data-v-9e03166f="">Balance:500 - 30K</div>
                    
                  </div>
                </div>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section5' ? 'item_active' : ''}`}  onClick={() => showSection('section5')}>
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-Super</div>
                    <div data-v-9e03166f="">Balance:300 - 50K</div>
                    
                  </div>
                </div>
              </div>
              {/* section 5 */}
              <div data-v-9e03166f="" className="rechargeTypes_list"  id="section5" style={{ display: activeSection === 'section5' ? 'grid' : 'none' }}>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section2' ? 'item_active' : ''}`}  onClick={() => showSection('section2')}>
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-ARpay</div>
                    <div data-v-9e03166f="">Balance:500 - 30K</div>
                    
                  </div>
                </div>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section5' ? 'item_active' : ''}`}  onClick={() => showSection('section5')}>
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="">USDT-Super</div>
                    <div data-v-9e03166f="">Balance:300 - 50K</div>
                    
                  </div>
                </div>
              </div>
              {/* section1 */}
              <div data-v-9e03166f="" className="rechargeTypes_list" id="section1" style={{ display: activeSection === 'section1' ? 'grid' : 'none' }}>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section1' ? 'item_active' : ''}`}  onClick={() => showSection('section1')}>
                {/* <img data-v-98c90f53="" src="/assets/png/usdt.png" alt="" style={{width:'20px',position:'absolute', left:'30px', top:'482px'}}/>                */}
                  <div data-v-9e03166f="" className="other">                  
                    <div data-v-9e03166f=""  style={{paddingLeft:'18px'}}>QR-ARpay</div>
                    <div data-v-9e03166f="">Balance:500 - 30K</div>
                    
                  </div>
                </div>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section4' ? 'item_active' : ''}`}  onClick={() => showSection('section4')}>
                {/* <img data-v-98c90f53="" src="/assets/png/usdt.png" alt="" style={{width:'20px',position:'absolute', left:'30px', top:'482px'}}/>  */}
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="" style={{paddingLeft:'18px'}}>QR-3cPay</div>
                    <div data-v-9e03166f="">Balance:500 - 50K</div>
                    
                  </div>
                </div>
              </div>
              {/* section4 */}
              <div data-v-9e03166f="" className="rechargeTypes_list" id="section4" style={{ display: activeSection === 'section4' ? 'grid' : 'none' }}>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section1' ? 'item_active' : ''}`}  onClick={() => showSection('section1')}>
                {/* <img data-v-98c90f53="" src="/assets/png/usdt.png" alt="" style={{width:'20px',position:'absolute', left:'30px', top:'482px'}}/>                */}
                  <div data-v-9e03166f="" className="other">                  
                    <div data-v-9e03166f=""  style={{paddingLeft:'18px'}}>QR-ARpay</div>
                    <div data-v-9e03166f="">Balance:500 - 30K</div>
                    
                  </div>
                </div>
                <div data-v-9e03166f="" className={`Recharge__content-quickInfo__item ${activeSection === 'section4' ? 'item_active' : ''}`}  onClick={() => showSection('section4')}>
                {/* <img data-v-98c90f53="" src="/assets/png/usdt.png" alt="" style={{width:'20px',position:'absolute', left:'30px', top:'482px'}}/>  */}
                  <div data-v-9e03166f="" className="other">
                    <div data-v-9e03166f="" style={{paddingLeft:'18px'}}>QR-3cPay</div>
                    <div data-v-9e03166f="">Balance:500 - 50K</div>
                    
                  </div>
                </div>
              </div>

              </div>
            <div data-v-9e03166f="" className="Recharge__content-paymoney boxStyle">
              <div data-v-9e03166f="" className="Recharge__content-paymoney__title">
                <svg data-v-9e03166f="" className="svg-icon icon-saveWallet">
                  <use href="#icon-saveWallet"></use>
                </svg>
                <p data-v-9e03166f="">Deposit amount</p>
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-paymoney__money-list" id="section1" style={{ display: activeSection === 'section1' ? 'flex' : 'none' }}
              >
                {amounts.section1.map((amount) => (
                <div
                  data-v-9e03166f=""
                  key={amount}
            className={`Recharge__content-paymoney__money-list__item ${isActive(amount) ? 'active' : ''}`}
            onClick={() => handleAmountClick(amount)}
                >
                  <div data-v-9e03166f="" className="amount">
                    <span data-v-9e03166f="">₹</span>{amount}
                  </div>                  
                </div>
                ))}
                
              
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-paymoney__money-list" id="section2" style={{ display: activeSection === 'section2' ? 'flex' : 'none' }}
              >
                {amounts.section2.map((amount) => (
                <div
                  data-v-9e03166f=""
                  key={amount}
            className={`Recharge__content-paymoney__money-list__item ${isActive(amount) ? 'active' : ''}`}
            onClick={() => handleAmountClick(amount)}
                >                
                  <div data-v-9e03166f="" className="amount">
                    <span data-v-9e03166f=""><img data-v-98c90f53="" src="/assets/png/usdt.png" alt="" style={{width: '20px'}} /></span>{amount}
                  </div>                  
                </div>
                 ))}
                
              
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-paymoney__money-list" id="section3" style={{ display: activeSection === 'section3' ? 'flex' : 'none' }}
              >
                {amounts.section3.map((amount) => (
                <div
                  data-v-9e03166f=""
                  key={amount}
                  className={`Recharge__content-paymoney__money-list__item ${isActive(amount) ? 'active' : ''}`}
            onClick={() => handleAmountClick(amount)}
                >
                  <div data-v-9e03166f="" className="amount">
                    <span data-v-9e03166f=""><img data-v-98c90f53="" src="/assets/png/trx.png" alt="" style={{width: '20px'}} /></span>{amount}
                  </div>                  
                </div>
                ))}
                
              
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-paymoney__money-list" id="section4" style={{ display: activeSection === 'section4' ? 'flex' : 'none' }}
              >
                {amounts.section4.map((amount) => (
                <div
                  data-v-9e03166f=""
                  key={amount}
            className={`Recharge__content-paymoney__money-list__item ${isActive(amount) ? 'active' : ''}`}
            onClick={() => handleAmountClick(amount)}
                >
                  <div data-v-9e03166f="" className="amount">
                    <span data-v-9e03166f="">₹</span>{amount}
                  </div>                  
                </div>
                ))}
                
              
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-paymoney__money-list" id="section5" style={{ display: activeSection === 'section5' ? 'flex' : 'none' }}
              >
                {amounts.section5.map((amount) => (
                <div
                  data-v-9e03166f=""
                  key={amount}
            className={`Recharge__content-paymoney__money-list__item ${isActive(amount) ? 'active' : ''}`}
            onClick={() => handleAmountClick(amount)}
                >                
                  <div data-v-9e03166f="" className="amount">
                    <span data-v-9e03166f=""><img data-v-98c90f53="" src="/assets/png/usdt.png" alt="" style={{width: '20px'}} /></span>{amount}
                  </div>                  
                </div>
                 ))}
                
              
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-paymoney__money-list" id="section6" style={{ display: activeSection === 'section6' ? 'flex' : 'none' }}
              >
                {amounts.section6.map((amount) => (
                <div
                  data-v-9e03166f=""
                  key={amount}
                  className={`Recharge__content-paymoney__money-list__item ${isActive(amount) ? 'active' : ''}`}
            onClick={() => handleAmountClick(amount)}
                >
                  <div data-v-9e03166f="" className="amount">
                    <span data-v-9e03166f=""><img data-v-98c90f53="" src="/assets/png/trx.png" alt="" style={{width: '20px'}} /></span>{amount}
                  </div>                  
                </div>
                ))}
                
              
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-paymoney__money-input"
              >
                <div data-v-9e03166f="" className="place-div">{activeSection === 'section1'&& 'section4' ? '₹' 
 : activeSection === 'section3' || 'section6' ? <img data-v-98c90f53="" src="/assets/png/trx.png" alt="" style={{width: '20px'}} /> 
 : activeSection === 'section2' || 'section5' ? <img data-v-98c90f53="" src="/assets/png/usdt.png" alt="" style={{width: '20px'}} /> 
 : '$'}</div>
                <div
                  data-v-9e03166f=""
                  className="van-cell van-field amount-input"
                  modelmodifiers="[object Object]"
                >
                  
                  <div className="van-cell__value van-field__value">
                    <div className="van-field__body">
                      < input type = "tel"
                      inputmode = "numeric"
                      id = "van-field-7-input"
                      className = "van-field__control"
                      placeholder = "Please enter the amount"
                      value={inputAmount}
                      onChange={handleInputChange}
                      />
                    </div>
                    
                  </div>
                  
                </div>
                
                <div data-v-9e03166f="" className="place-right">
                  <img
                    data-v-9e03166f=""
                    src="/assets/png/clean-82487515.png"
                    alt=""
                  />
                </div>
                
              </div>
              
              <div data-v-9e03166f="" className={`Recharge__container-rechageBtn ${inputAmount || selectedAmount ? 'rechage_active' : ''}`} onClick={handleSubmit}>
                Deposit
              </div>
            </div>
            <div
              data-v-9e03166f=""
              className="Recharge__content-waitPay boxStyle"
              style={{display: 'none'}}
            >
              <img
                data-v-9e03166f=""
                src="/assets/png/tip-0498e3f9.png"
                alt=""
              />
              <div data-v-9e03166f="" className="wait_text">
                You have 1 unpaid order
              </div>
              <div
                data-v-9e03166f=""
                className="Recharge__content-waitPay__countdown"
              >
                <span data-v-9e03166f="">3</span
                ><span data-v-9e03166f="">0</span
                ><span data-v-9e03166f="">:</span
                ><span data-v-9e03166f="">0</span
                ><span data-v-9e03166f="">0</span>
              </div>
              <div data-v-9e03166f="" className="go_pay">Go pay</div>
            </div>
            
          </div>
          
          <div
            data-v-7cba6004=""
            data-v-36cc3380=""
            className="Recharge__container-intro"
          >
            <div data-v-7cba6004="" className="Recharge__container-intro__title">
              <div data-v-7cba6004="" className="img">
                <svg data-v-7cba6004="" className="svg-icon icon-shuoming">
                  <use href="#icon-shuoming"></use>
                </svg>
              </div>
              <p data-v-7cba6004="">Recharge instructions</p>
            </div>
            <div data-v-7cba6004="" className="Recharge__container-intro__lists">
              
              <div data-v-7cba6004="" className="item">
                <p data-v-7cba6004="">
                  If the transfer time is up, please fill out the deposit form
                  again.
                </p>
                <p data-v-7cba6004="">
                  The transfer amount must match the order you created,
                  otherwise the money cannot be credited successfully.
                </p>
                <p data-v-7cba6004="">
                  If you transfer the wrong amount, our company will not be
                  responsible for the lost amount!
                </p>
                
                <p data-v-7cba6004="">
                  Note: do not cancel the deposit order after the money has been
                  transferred.
                </p>
              </div>
              
            </div>
          </div>
          <div
            data-v-9f5f4114=""
            data-v-36cc3380=""
            className="record__main"
            payid="2"
          >
            <div data-v-9f5f4114="" className="record__main-title">
              <svg data-v-9f5f4114="" className="svg-icon icon-historyHead">
                <use href="#icon-historyHead"></use></svg
              ><span data-v-9f5f4114="">Deposit history</span>
            </div>
            
            <div data-v-9f5f4114="">
              <div data-v-9f5f4114="" className="record__main-info">
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__title flex_between"
                >
                  <div data-v-9f5f4114="" className="recharge_text">Deposit</div>
                  <div data-v-9f5f4114="" className="flex_between">
                    <div data-v-9f5f4114="" className="rechargeFail">Failed</div>
                    
                  </div>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__money item flex_between"
                >
                  <span data-v-9f5f4114="">Balance</span
                  ><span data-v-9f5f4114="">₹100.00</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__type item flex_between"
                >
                  <span data-v-9f5f4114="">Type</span
                  ><span data-v-9f5f4114="">UPI-ICE</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__time item flex_between"
                >
                  <span data-v-9f5f4114="">Time</span
                  ><span data-v-9f5f4114="">2024-07-30 16:43:18</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__orderNumber item flex_between"
                >
                  <span data-v-9f5f4114="">Order number</span>
                  <div data-v-9f5f4114="">
                    <span data-v-9f5f4114="">p2024073011131873726770</span
                    ><svg data-v-9f5f4114="" className="svg-icon icon-copy" alt="">
                      <use href="#icon-copy"></use>
                    </svg>
                  </div>
                </div>
                
              </div>
              <div data-v-9f5f4114="" className="record__main-info">
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__title flex_between"
                >
                  <div data-v-9f5f4114="" className="recharge_text">Deposit</div>
                  <div data-v-9f5f4114="" className="flex_between">
                    <div data-v-9f5f4114="" className="success">Complete</div>
                    <img
                      data-v-9f5f4114=""
                      src="/assets/png/left_arrow-6c6e3cc6.png"
                      alt=""
                    />
                  </div>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__money item flex_between"
                >
                  <span data-v-9f5f4114="">Balance</span
                  ><span data-v-9f5f4114="">₹100.00</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__type item flex_between"
                >
                  <span data-v-9f5f4114="">Type</span
                  ><span data-v-9f5f4114="">UPI-ICE</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__time item flex_between"
                >
                  <span data-v-9f5f4114="">Time</span
                  ><span data-v-9f5f4114="">2024-07-30 16:09:19</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__orderNumber item flex_between"
                >
                  <span data-v-9f5f4114="">Order number</span>
                  <div data-v-9f5f4114="">
                    <span data-v-9f5f4114="">p2024073010391969107618</span
                    ><svg data-v-9f5f4114="" className="svg-icon icon-copy" alt="">
                      <use href="#icon-copy"></use>
                    </svg>
                  </div>
                </div>
                
              </div>
              <div data-v-9f5f4114="" className="record__main-info">
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__title flex_between"
                >
                  <div data-v-9f5f4114="" className="recharge_text">Deposit</div>
                  <div data-v-9f5f4114="" className="flex_between">
                    <div data-v-9f5f4114="" className="success">Complete</div>
                    <img
                      data-v-9f5f4114=""
                      src="/assets/png/left_arrow-6c6e3cc6.png"
                      alt=""
                    />
                  </div>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__money item flex_between"
                >
                  <span data-v-9f5f4114="">Balance</span
                  ><span data-v-9f5f4114="">₹100.00</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__type item flex_between"
                >
                  <span data-v-9f5f4114="">Type</span
                  ><span data-v-9f5f4114="">UPI-ICE</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__time item flex_between"
                >
                  <span data-v-9f5f4114="">Time</span
                  ><span data-v-9f5f4114="">2024-07-09 12:55:12</span>
                </div>
                <div
                  data-v-9f5f4114=""
                  className="record__main-info__orderNumber item flex_between"
                >
                  <span data-v-9f5f4114="">Order number</span>
                  <div data-v-9f5f4114="">
                    <span data-v-9f5f4114="">p2024070907251227219587</span
                    ><svg data-v-9f5f4114="" className="svg-icon icon-copy" alt="">
                      <use href="#icon-copy"></use>
                    </svg>
                  </div>
                </div>
                
              </div>
              
            </div>
          </div>
        </div>
        <div data-v-3e71d3da="" data-v-36cc3380="" className="dialog inactive">
          <div
            data-v-3e71d3da=""
            className="dialog__container"
            role="dialog"
            tabindex="0"
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
              <h1 data-v-3e71d3da="">Invalid amount</h1>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-content">
              <div data-v-36cc3380="" className="cancen_model_cnt">
                Please select another amount
              </div>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-footer">
              <button data-v-3e71d3da="">OK</button
              ><button data-v-3e71d3da="">Cancel</button>
            </div>
            
          </div>
          <div data-v-3e71d3da="" className="dialog__outside"></div>
        </div>
        
        <div data-v-3e71d3da="" data-v-36cc3380="" className="dialog inactive">
          <div
            data-v-3e71d3da=""
            className="dialog__container"
            role="dialog"
            tabindex="0"
          >
            <div data-v-3e71d3da="" className="dialog__container-img">
              <img
                data-v-3e71d3da=""
                className=""
                alt=""
                data-origin=""
                src="/assets/png/avatar-2f23f3bd.png"
              />
            </div>
            <div data-v-3e71d3da="" className="dialog__container-title">
              <h1 data-v-3e71d3da="">
                You have been disabled from C2C transactions for 0 hours
              </h1>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-content">
              <div data-v-36cc3380="" className="forbidden_tip">
                0 hours remaining
              </div>
              <div data-v-36cc3380="" className="forbidden1">
                Because your transactions failed 0 times in a row
              </div>
              <div data-v-36cc3380="" className="forbidden2">
                C2C recharge is prohibited within 0 hours
              </div>
              <div data-v-36cc3380="" className="forbidden3">
                If you have any questions, please contact customer service
              </div>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-footer">
              <button data-v-3e71d3da="">Sure</button
              >
            </div>
            
          </div>
          <div data-v-3e71d3da="" className="dialog__outside"></div>
        </div>
        <div data-v-3e71d3da="" data-v-36cc3380="" className="dialog inactive">
          <div
            data-v-3e71d3da=""
            className="dialog__container"
            role="dialog"
            tabindex="0"
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
              <h1 data-v-3e71d3da="">safety warning</h1>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-content">
              <div data-v-36cc3380="" className="cancen_model_cnt">
                Please use your own PIX account to obtain the order and QR code
                for recharge. Do not use the QR code provided by others to pay.
              </div>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-footer">
              <button data-v-3e71d3da="">Confirm</button
              >
            </div>
            
          </div>
          <div data-v-3e71d3da="" className="dialog__outside"></div>
        </div>
      </div>
      <div
        className="customer"
        id="customerId"
        style={{
          "--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sansSerif'",
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
  </div>

)}