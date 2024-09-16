import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';
// import DepositHistory from './DepositHistory';


const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function WithdrawHistory() {


  const [isVisible, setIsVisible] = useState(false);
  const [isSecondVisible, setIsSecondVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isBank, setIsBank] = useState(null);
  const [isTier, setIsTier] = useState('All');
  const [isYear ,setIsYear] =useState('year3');
  const [isMonth, setIsMonth] =useState('month8');
  const [isDate, setIsDate] =useState('Date2');
  const [filteredHistory, setFilteredHistory] =useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);

  const bank = (bankId)=>{
    setIsBank(bankId);


    let filtered = withdrawHistory;
    if(bankId ==='bank2'){
      filtered = withdrawHistory.filter((history)=>history.walletType === "BankCard");
    }else if (bankId === 'bank3') {
      filtered = withdrawHistory.filter((history) => history.walletType !== "BankCard");
    } 
  

    setFilteredHistory(filtered);
  }


  const fetchWithdrawHistory= async () => {
    try {
      const response = await Api.get('/api/webapi/withdraw/list?page=1&limit=10');
      const data =  response.data;

      console.log(data.datas);

      setWithdrawHistory(data.datas); // Assuming data.data contains the user's information
      setFilteredHistory(data.datas);


    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred. Please try again.');
    } 
  };


  useEffect(() => {
    fetchWithdrawHistory();  
 
   
  }, []);

  const handleConfirm =()=>{
  let filtered = withdrawHistory ;

  if (isTier === 'Pending'){
    filtered = withdrawHistory.filter((history)=>history.status === 0);
  }else if(isTier === 'Success'){
    filtered = withdrawHistory.filter((history)=>history.status === 1);
  }else if(isTier === 'Failed'){
    filtered = withdrawHistory.filter((history)=>history.status === 2);
  }

  setFilteredHistory(filtered);
  setIsVisible(false);
  }


  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };
  const handleSecondToggle = () => {
    setIsSecondVisible(!isSecondVisible);
  };
  const handleSecondCancel = () => {
    setIsSecondVisible(false);
  };

  const tier = (tierId)=>{
    setIsTier(tierId);
  }
  const year = (yearId) =>{
    setIsYear(yearId)
  }

  const month = (monthId)=>{
    setIsMonth(monthId)
  }

  const Date = (DateId)=>{
    setIsDate(DateId)
  }


  const formatTimestampToIST = (timestamp) => {
    try {
      // Convert the timestamp to a number if it's in string format
      const numericTimestamp = Number(timestamp);
  
      // If the timestamp is in seconds (10 digits), convert it to milliseconds
      const validTimestamp = numericTimestamp.toString().length === 13 ? numericTimestamp : numericTimestamp * 1000;
  
      // Create a Date object from the valid timestamp
      const date = new Date(validTimestamp);
  
      // Check if the Date object is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }
  
      // Format the date in IST
      return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    } catch (error) {
      return 'Invalid Timestamp';
    }
  };


  const getStatusTextAndColor = (status) => {
    switch (status) {
      case 0:
        return { text: 'Pending', color: 'yellow' };
      case 1:
        return { text: 'Complete', color: 'green' };
      case 2:
        return { text: 'Failed', color: 'red' };
      default:
        return { text: 'Unknown', color: 'grey' };
    }
  };


  const navigate = useNavigate();
  return (
    <div>
 

    <div id="app" data-v-app="">
      <div
        data-v-647954c7=""
        className="ar-loading-view"
        style={{
          '--f13b4d11-currentFontFamily':"'Roboto', 'Inter', 'sansSerif'",
          display: 'none'
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
                contentVisibility: 'visible'
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
          <div data-v-647954c7="" className="com__box"  style={{display: 'none'}}>
          
            <div className="loading" data-v-647954c7="">
              <div className="shape shape-1" data-v-647954c7=""></div>
              <div className="shape shape-2" data-v-647954c7=""></div>
              <div className="shape shape-3" data-v-647954c7=""></div>
              <div className="shape shape-4" data-v-647954c7=""></div>
            </div>
           
          </div>
         
        </div>
        <div data-v-647954c7="" className="skeleton-wrapper"  style={{display: 'none'}}>
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
        data-v-e4760c44=""
        className="rechargeh__container"
        style={{'--f13b4d11-currentFontFamily': "'Roboto', 'Inter', sansSerif"}}
      >
        <div data-v-12a80a3e="" data-v-e4760c44="" className="navbar white">
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
                  Withdrawal history
                </div>
              </div>
              <div data-v-12a80a3e="" className="navbar__content-right"></div>
            </div>
          </div>
        </div>
        <div data-v-e4760c44="" className="rechargeh__container_header">
          <div
            data-v-e4760c44=""
            className="van-tabs van-tabs--card onlineGames__container-tabBar"
          >
            <div className="van-tabs__wrap">
              <div
                role="tablist"
                className="van-tabs__nav van-tabs__nav--card" style={{ padding:'5px'}}
                aria-orientation="horizontal"
              >
                
                <div
                  id="van-tabs-1-0"
                  role="tab"
                  className={`van-tab van-tab--card ${isBank ==='bank1' ? 'van-tab--active':''}`}
                  tabIndex="0"
                  aria-selected="true"
                  aria-controls="van-tab-2"
                >
                  <span className="van-tab__text van-tab__text--ellipsis"
                    ><div data-v-e4760c44="" className="tabDiv"  id="bank1" onClick={()=>bank('bank1')}>
                      <svg data-v-e4760c44="" className="svg-icon icon-all">
                        <use href="#icon-all"></use>
                      </svg>
                      All
                    </div></span
                  >
                </div>
                <div
                  id="van-tabs-1-1"
                  role="tab"
                  className={`van-tab van-tab--card ${isBank ==='bank2' ? 'van-tab--active':''}`}
                  tabIndex="-1"
                  aria-selected="false"
                  aria-controls="van-tab-3"
                >
                  <span className="van-tab__text van-tab__text--ellipsis"
                    ><div data-v-e4760c44="" className="tabDiv"  id="bank2" onClick={()=>bank('bank2')}>
                      <img
                        data-v-e4760c44=""
                        src="/assets/png/payNameIcon_20240821190505sggk.png"
                      />
                      BANK CARD
                    </div></span
                  >
                </div>
                <div
                  id="van-tabs-1-2"
                  role="tab"
                  className={`van-tab van-tab--card ${isBank ==='bank3' ? 'van-tab--active':''}`}
                  tabIndex="-1"
                  aria-selected="false"
                  aria-controls="van-tab-4"
                >
                  <span className="van-tab__text van-tab__text--ellipsis"
                    ><div data-v-e4760c44="" className="tabDiv" id="bank3" onClick={()=>bank('bank3')}>
                      <img
                        data-v-e4760c44=""
                        src="/assets/png/usdt.png"
                      />
                      USDT
                    </div></span
                  >
                </div>
                
              </div>
            </div>
            
            <div className="van-tabs__content"></div>
          </div>
         
          <div data-v-e4760c44="" className="ar">
            <div data-v-e4760c44="" className="ar-searchbar">
              <div
                data-v-fa757a88=""
                data-v-e4760c44=""
                className="ar-searchbar__selector"
              >
                <div data-v-fa757a88="">
                  <span
                    data-v-fa757a88=""
                    className="ar-searchbar__selector-default"
                    >{isTier}</span
                  ><i
                    data-v-fa757a88=""
                    className="van-badge__wrapper van-icon van-icon-arrow-down" onClick={handleToggle}
                    ></i
                  >
                </div>
              </div>
              <div className="ar-searchbar__selector">
                <div>
                  <span className="noSelect">Choose a date</span
                  ><i className="van-badge__wrapper van-icon van-icon-arrow-down" onClick={handleSecondToggle}
                    ></i
                  >
                </div>
              </div>
            
            </div>
          </div>
        </div>
        <div
          data-v-cbab7763=""
          data-v-e4760c44=""
          className="infiniteScroll"
          id="refreshd17a3e4580ef4fedaf1f391b2d85bdd0"
        >
           <div data-v-e4760c44="" className="rechargeh__container-content">
            
            {filteredHistory.length === 0 ? (
          <div>No Data</div>
        ) : (
          filteredHistory.map((history, index) => (
  
            
            <div key={index} data-v-e4760c44="" className="rechargeh__container-content__item">
              <div data-v-e4760c44="" className="rechargeh__container-content__item-header ar-1px-b">
                <span data-v-e4760c44="">Withdraw</span>
                <span
    data-v-e4760c44=""
    className="stateG"
    style={{ color: history.status === 0 ? "yellow" : history.status === 1 ? "green" : "red" }} // Set the dynamic color here
  >
    {history.status === 0 ? "Pending" : history.status === 1 ? "Complete" : "Failed"}
  </span>
  
              </div>
              <div data-v-e4760c44="" className="rechargeh__container-content__item-body">
                <div data-v-e4760c44="">
                  <span data-v-e4760c44="">Balance</span>
                  <span data-v-e4760c44="">{history.money}</span>
                </div>
                <div data-v-e4760c44="">
                  <span data-v-e4760c44="">Type</span>
                  <span data-v-e4760c44="">{history.walletType}</span>
                </div>
                <div data-v-e4760c44="">
                  <span data-v-e4760c44="">Time</span>
                  <span data-v-e4760c44="">{formatTimestampToIST(history.time)}</span>
                </div>
                <div data-v-e4760c44="">
                  <span data-v-e4760c44="">Order number</span>
                  <span data-v-e4760c44="">{history.id_order}</span>
                  <svg data-v-e4760c44="" className="svg-icon icon-copy">
                    <use href="#icon-copy"></use>
                  </svg>
                </div>
               
                <div data-v-e4760c44="">
                  <textarea
                    data-v-e4760c44=""
                    className="textarea"
                    name="remark"
                    cols="30"
                    rows="10"
                    readOnly
                    style={{ display: 'none' }}
                  >
                    {history.remarks}
                  </textarea>
                </div>
              </div>
            </div>
          ))
        )}
            </div>
            
        
            <div className="van-overlay" role="button" tabIndex="0" data-v-10d1559c="" style={{zIndex: '2001', display: isVisible ? 'block' : 'none'}}></div>
        <div
  role="dialog"
  tabIndex="0"
  className="van-popup van-popup--round van-popup--bottom"
  data-v-10d1559c=""
  style={{zIndex: '2001', display: isVisible ? 'block' : 'none'}}
>
  <div data-v-10d1559c="" className="van-picker">
    <div className="van-picker__toolbar"style={{backgroundColor:'#fae59f'}}>
      <button type="button" className="van-picker__cancel van-haptics-feedback" onClick={handleCancel}>
        Cancel</button
      ><button
        type="button"
        className="van-picker__confirm van-haptics-feedback"
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </div>
    
    <div className="van-picker__columns" style={{height: '264px'}}>
      <div className="van-picker-column">
        <ul
          className="van-picker-column__wrapper"
          style={{
            transform: isTier === 'All' ? 'translate3d(0px, 110px, 0px)':
            isTier === 'Pending' ? 'translate3d(0px, 66px, 0px)':
            isTier === 'Success' ? 'translate3d(0px, 22px, 0px)':
            isTier === 'Failed' ? 'translate3d(0px, -22px, 0px)':

            '',
            transitionDuration: '0ms',
            transitionProperty: 'none', 
          }}
        >
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item van-picker-column__item--selected" id="All" onClick={()=>tier('All')}
            style={{height: '44px'}} 
          >
            <div className="van-ellipsis">All</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item" id="Pending" onClick={()=>tier('Pending')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">Pending</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item" id="Success" onClick={()=>tier('Success')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">Success</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item" id="Failed" onClick={()=>tier('Failed')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">Failed</div>
          </li>
          
        </ul>
      </div>
      <div className="van-picker__mask" style={{backgroundSize: '100% 110px'}}></div>
      <div
        className="van-hairline-unset--top-bottom van-picker__frame"
        style={{height: '44px'}}
      ></div>
    </div>
    
  </div>
  
</div>
<div className="van-overlay" role="button" tabIndex="0" data-v-10d1559c="" style={{zIndex: '2002', display: isSecondVisible ? 'block' : 'none'}}></div>
<div
  role="dialog"
  tabIndex="0"
  className="van-popup van-popup--round van-popup--bottom"
  data-v-10d1559c=""
  style={{zIndex: '2002', display: isSecondVisible ? 'block' : 'none'}}
>
  <div data-v-10d1559c="" className="van-picker">
    <div className="van-picker__toolbar">
      <button type="button" className="van-picker__cancel van-haptics-feedback" onClick={handleSecondCancel}>
        Cancel
      </button>
      <div className="van-picker__title van-ellipsis">Choose a date</div>
      <button type="button" className="van-picker__confirm van-haptics-feedback">
        Confirm
      </button>
    </div>
    
    <div className="van-picker__columns" style={{height: '264px'}}>
      <div className="van-picker-column">
        <ul
          className="van-picker-column__wrapper"
          style={{ transform: isYear ==='year1' ? 'translate3d(0px, 110px, 0px)':
            isYear ==='year2' ? 'translate3d(0px, 66px, 0px)':
            isYear ==='year3' ? 'translate3d(0px, 22px, 0px)'
            :'', transitionDuration: '0ms', transitionProperty: 'none', }}
        >
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item" id="year1" onClick={()=>year('year1')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">2022</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item" id="year2" onClick={()=>year('year2')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">2023</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item van-picker-column__item--selected" id="year3" onClick={()=>year('year3')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">2024</div>
          </li>
        </ul>
      </div>
      <div className="van-picker-column">
        <ul
          className="van-picker-column__wrapper"
          style={{
            transform: isMonth ==='month1' ? 'translate3d(0px, 110px, 0px)':
            isMonth ==='month2' ? 'translate3d(0px, 66px, 0px)':
            isMonth ==='month3' ? 'translate3d(0px, 22px, 0px)':
            isMonth ==='month4' ? 'translate3d(0px, -22px, 0px)':
            isMonth ==='month5' ? 'translate3d(0px, -66px, 0px)':
            isMonth ==='month6' ? 'translate3d(0px, -110px, 0px)':
            isMonth ==='month7' ? 'translate3d(0px, -154px, 0px)':
            isMonth ==='month8' ? 'translate3d(0px, -198px, 0px)':
            isMonth ==='month9' ? 'translate3d(0px, -242px, 0px)':
            isMonth ==='month10' ? 'translate3d(0px, -286px, 0px)':
            isMonth ==='month11' ? 'translate3d(0px, -330px, 0px)':
            isMonth ==='month12' ? 'translate3d(0px, -374px, 0px)':
            '',
            transitionDuration: '0ms',
            transitionProperty: 'none',
          }}
        >
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item" id="month1" onClick={()=>month('month1')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">01</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month2" onClick={()=>month('month2')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">02</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month3" onClick={()=>month('month3')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">03</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month4" onClick={()=>month('month4')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">04</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month5" onClick={()=>month('month5')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">05</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month6" onClick={()=>month('month6')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">06</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month7" onClick={()=>month('month7')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">07</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item van-picker-column__item--selected"  id="month8" onClick={()=>month('month8')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">08</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month9" onClick={()=>month('month9')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">09</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month10" onClick={()=>month('month10')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">10</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month11" onClick={()=>month('month11')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">11</div>
          </li>
          <li
            role="button"
            tabIndex="0"
            className="van-picker-column__item"  id="month12" onClick={()=>month('month12')}
            style={{height: '44px'}}
          >
            <div className="van-ellipsis">12</div>
          </li>
        </ul>
      </div>
      <div className="van-picker-column">
                <ul
                  className="van-picker-column__wrapper"
                  style={{
                    transform: isDate  ==='Date1' ? 'translate3d(0px, 110px, 0px)':
                    isDate  ==='Date2' ? 'translate3d(0px, 66px, 0px)':
                    isDate === 'Date3' ? 'translate3d(0px, 22px, 0px)' :
                    isDate === 'Date4' ? 'translate3d(0px, -22px, 0px)' :
                    isDate === 'Date5' ? 'translate3d(0px, -66px, 0px)' :
                    isDate === 'Date6' ? 'translate3d(0px, -110px, 0px)' :
                    isDate === 'Date7' ? 'translate3d(0px, -154px, 0px)' :
                    isDate === 'Date8' ? 'translate3d(0px, -198px, 0px)' :
                    isDate === 'Date9' ? 'translate3d(0px, -242px, 0px)' :
                    isDate === 'Date10' ? 'translate3d(0px, -286px, 0px)' :
                    isDate === 'Date11' ? 'translate3d(0px, -330px, 0px)' :
                    isDate === 'Date12' ? 'translate3d(0px, -374px, 0px)' :
                    isDate === 'Date13' ? 'translate3d(0px, -418px, 0px)' :
                    isDate === 'Date14' ? 'translate3d(0px, -462px, 0px)' :
                    isDate === 'Date15' ? 'translate3d(0px, -506px, 0px)' :
                    isDate === 'Date16' ? 'translate3d(0px, -550px, 0px)' :
                    isDate === 'Date17' ? 'translate3d(0px, -594px, 0px)' :
                    isDate === 'Date18' ? 'translate3d(0px, -638px, 0px)' :
                    isDate === 'Date19' ? 'translate3d(0px, -682px, 0px)' :
                    isDate === 'Date20' ? 'translate3d(0px, -726px, 0px)' :
                    isDate === 'Date21' ? 'translate3d(0px, -770px, 0px)' :
                    isDate === 'Date22' ? 'translate3d(0px, -814px, 0px)' :
                    isDate === 'Date23' ? 'translate3d(0px, -858px, 0px)' :
                    isDate === 'Date24' ? 'translate3d(0px, -902px, 0px)' :
                    isDate === 'Date25' ? 'translate3d(0px, -946px, 0px)' :
                    isDate === 'Date26' ? 'translate3d(0px, -990px, 0px)' :
                    isDate === 'Date27' ? 'translate3d(0px, -1034px, 0px)' :
                    isDate === 'Date28' ? 'translate3d(0px, -1078px, 0px)' :
                    isDate === 'Date29' ? 'translate3d(0px, -1122px, 0px)' :
                    isDate === 'Date30' ? 'translate3d(0px, -1166px, 0px)' :
                    isDate === 'Date31' ? 'translate3d(0px, -1200px, 0px)' :
                    '',
                    transitionDuration: '0ms',
                    transitionProperty: 'none',
                  }}
                >
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date1" onClick={()=>Date('Date1')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">01</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date2" onClick={()=>Date('Date2')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">02</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date3" onClick={()=>Date('Date3')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">03</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date4" onClick={()=>Date('Date4')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">04</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date5" onClick={()=>Date('Date5')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">05</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date6" onClick={()=>Date('Date6')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">06</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date7" onClick={()=>Date('Date7')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">07</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date8" onClick={()=>Date('Date8')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">08</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date9" onClick={()=>Date('Date9')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">09</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date10" onClick={()=>Date('Date10')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">10</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date11" onClick={()=>Date('Date11')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">11</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date12" onClick={()=>Date('Date12')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">12</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date13" onClick={()=>Date('Date13')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">13</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date14" onClick={()=>Date('Date14')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">14</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date15" onClick={()=>Date('Date15')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">15</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date16" onClick={()=>Date('Date16')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">16</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date17" onClick={()=>Date('Date17')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">17</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date18" onClick={()=>Date('Date18')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">18</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date19" onClick={()=>Date('Date19')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">19</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date20" onClick={()=>Date('Date20')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">20</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date21" onClick={()=>Date('Date21')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">21</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date22" onClick={()=>Date('Date22')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">22</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date23" onClick={()=>Date('Date23')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">23</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date24" onClick={()=>Date('Date24')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">24</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date25" onClick={()=>Date('Date25')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">25</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date26" onClick={()=>Date('Date26')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">26</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date27" onClick={()=>Date('Date27')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">27</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date28" onClick={()=>Date('Date28')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">28</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date29" onClick={()=>Date('Date29')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">29</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item" id="Date30" onClick={()=>Date('Date30')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">30</div>
                  </li>
                  <li
                    role="button"
                    tabIndex="0"
                    className="van-picker-column__item van-picker-column__item--selected" id="Date31" onClick={()=>Date('Date31')}
                    style={{height: '44px'}}
                  >
                    <div className="van-ellipsis">31</div>
                  </li>
                </ul>
              </div>
      <div className="van-picker__mask" style={{backgroundSize: '100% 110px'}}></div>
      <div
        className="van-hairline-unset--top-bottom van-picker__frame"
        style={{height: '44px'}}
      ></div>
    </div>
    
  </div>
  
</div>
     
      </div>

          
          
        </div>
      </div>

          
       
     
      <div
        className="customer"
        id="customerId"
        style={{
          '--f13b4d11-currentFontFamily': "'Roboto', 'Inter', sansSerif",
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
  )
}