import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { io } from 'socket.io-client';
import Api from '../../../services/Api';
import MyGameRecordList from '../k3/components/MyGameRecordList';
import GameList from '../k3/components/GameList';
import ReactHowler from 'react-howler';
import ChartList from '../k3/components/ChartList';
import BetPopup from '../k3/components/BetPopup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SOCKET_URL = 'http://localhost:3000';



const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
});


const countDownDate =new Date("2030-07-16T23:59:59.9999999+01:00").getTime();


export default function K3(){

    const [gameJoin, setGameJoin] = useState('game1');
    const [activeTime, setActiveTime] =useState('time1');

    const [activeHistory, setActiveHistory] =useState('history1');

    const showHistory =(historyID) =>{
      setActiveHistory(historyID);
    };

const showSection = (sectionId) => {
    setGameJoin(sectionId);
    setListJoin([]);
    setShowBetPopup(false);
  };




  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [gamelist, setGamelist] = useState([]);
  const [myBets,setMyBets] = useState(null);
  const [period, setPeriod] = useState(null);
  const [showBetPopup , setShowBetPopup] = useState(false);


  const [time, setTime] = useState({
    seconds1: 0,
    seconds2: 0,
  });
  const [showMark, setShowMark] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(''); // To track the selected item
const [balance, setBalance] = useState(1);  // State for balance
const [quantity, setQuantity] = useState(1);  // State for quantity
const [listJoin, setListJoin] = useState([]);

const [lastBet, setLastBet] = useState([]);  // State for quantity

  const [join, setJoin] = useState(null);
  const [totalGamePages, setTotalGamePages] = useState(null);
  const [totalBetsPages, setTotalBetsPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentGamePage, setCurrentGamePage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);


  const addToListJoin = (item) => {
    setListJoin((prevListJoin) => {
      // Create a new list without the item if it already exists
      const itemIndex = prevListJoin.indexOf(item);
      let newList;
      
      if (itemIndex > -1) {
        // Item exists, remove it
        newList = prevListJoin.filter((_, index) => index !== itemIndex);
      } else {
        // Item does not exist, add it
        newList = [...prevListJoin, item];
      }
      
      // Only show BetPopup if gameJoin is 'game1' and newList is not empty
      if (gameJoin === 'game1' && newList.length > 0) {
        setShowBetPopup(true); // Show the BetPopup
      } else {
        // Hide the BetPopup if newList is empty
        setShowBetPopup(false);
      }
      
      console.log('Updated List:', newList);
      
      return newList;
    });
  };
  
  
  
  
  

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (error) {
        toast.error(error); // Show the error in a toast notification
    }
}, [error]);

  const navigate = useNavigate();

  const handleNextPage = () => {
    if (currentPage < totalBetsPages) {
      setCurrentPage(prevPage => prevPage + 1);
      fetchMyBets(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      fetchMyBets(currentPage - 1);
    }
  };

  const handleNextGamePage = () => {
    if (currentGamePage < totalGamePages) {
      setCurrentGamePage(prevPage => {
        const nextPage = prevPage + 1;
        fetchGamelist(nextPage); // Pass the next page number to fetchGamelist
        return nextPage;
      });
    }
  };
  
  const handlePreviousGamePage = () => {
    if (currentGamePage > 1) {
      setCurrentGamePage(prevPage => {
        const previousPage = prevPage - 1;
        fetchGamelist(previousPage); // Pass the previous page number to fetchGamelist
        return previousPage;
      });
    }
  };
  
  


const handleClosePopup = () => {
  setPopupVisible(false);
  setSelectedItem(''); // Reset the selected item when closing the popup
  setBalance(1);  // Reset balance
  setQuantity(1);  // Reset quantity
};


  
  const [playAudio2, setPlayAudio2] = useState(false);
const audio1Ref = useRef(null);
const [audio2Played, setAudio2Played] = useState(false);
const [userInteracted, setUserInteracted] = useState(false); // New state to track user interaction

useEffect(() => {
  const audio1 = new Audio('/assets/audio/di1.da40b233.mp3');
  audio1.loop = false; // Ensure audio1 does not loop
  audio1Ref.current = audio1; // Assign the audio to ref

  let intervalId;

  const handleUserInteraction = () => {
    setUserInteracted(true);
    // Remove the event listener after interaction
    document.removeEventListener('click', handleUserInteraction);
    document.removeEventListener('touchstart', handleUserInteraction);
  };

  // Add event listeners to detect any user interaction
  document.addEventListener('click', handleUserInteraction);
  document.addEventListener('touchstart', handleUserInteraction);

  const startCountdown = () => {
    intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
      const seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
      setTime({ seconds1, seconds2 });

      if (userInteracted) { // Play audio only if the user has interacted
        if (seconds1 === 0 && seconds2 > 0 && seconds2 <= 5) {
          if (audio1Ref.current && audio1Ref.current.paused) {
            audio1Ref.current.play();
          }
        } else {
          if (audio1Ref.current) {
            audio1Ref.current.pause();
            audio1Ref.current.currentTime = 0;
          }
        }
      }

      if (seconds1 === 0 && seconds2 === 0) {
        console.log('Playing audio2');
        setPlayAudio2(true);
        setAudio2Played(true);
        setTimeout(() => {
          setPlayAudio2(false); // Stop audio2 after it has finished playing
        }, 3000); // Adjust this duration based on the length of audio2
      }

      if (seconds1 !== 0 || seconds2 > 5) {
        setShowMark(false);

        if (userInteracted && audio1Ref.current) { // Only pause audio if user interacted
          audio1Ref.current.pause();
          audio1Ref.current.currentTime = 0;
        }
      }

      if (seconds1 === 0 && seconds2 <= 5) {
        handleClosePopup();
        setListJoin([]);
        setShowMark(true);
        setShowBetPopup(false);

      }

    }, 1000); // Check every second
  };

  startCountdown();

  return () => {
    clearInterval(intervalId); // Clean up on component unmount
    if (audio1Ref.current) {
      audio1Ref.current.pause();
      audio1Ref.current.currentTime = 0;
    }
  };
}, [audio2Played, userInteracted]);

  const fetchGamelist = async (pageNumber = 1) => {
    try {
      const pageno = (pageNumber - 1) * 10; // Calculate pageno based on the page number

      const response = await Api.post('/api/webapi/k3/GetNoaverageEmerdList', {
        gameJoin: "1",
        pageno: pageno.toString(),
        pageto: "10",
      });

      // console.log(response.data.data.gameslist);

      // Update gamelist state
      setGamelist(response.data.data.gameslist ?? []);
      setTotalGamePages(response.data.page ?? 0);
      setPeriod(response.data.period ?? null);

     
      
    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await Api.get('/api/webapi/GetUserInfo');
      const data =  response.data;

      // console.log(data);

      setUserInfo(data.data); // Assuming data.data contains the user's information


    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred. Please try again.');
    } 
  };

  

  const fetchMyBets = async (pageNumber = 1) => {
    try {
      const pageno = (pageNumber - 1) * 10; // Calculate pageno based on the page number
      const response = await Api.post('/api/webapi/k3/GetMyEmerdList', {
        gameJoin: "1",
        pageno: pageno.toString(),
        pageto: "10",
      });
  
      const { gameslist } = response.data.data;

      // console.log(response.data.data);
      
  
      // Set total pages based on the total number of records and page size
      const totalRecords = response.data.page; // Assuming the API returns total records
  
      setTotalBetsPages(totalRecords);
      console.log("hi");
      console.log(gameslist);
      setMyBets(gameslist);
      // console.log(gameslist[0]);
      setLastBet(gameslist[0]);
    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred. Please try again.');
    }
  };
  
  
  // Fetch the first page when the component mounts
  useEffect(() => {
    fetchMyBets(1);
    fetchGamelist(1);
  }, []);
  

  


  useEffect(() => {
    
    fetchMyBets();
    fetchGamelist();
    fetchUserInfo();


    const handleSocketData = async (msg) => {

      if (msg.game !== '1') return;

        console.log(msg.data[0]);

      fetchGamelist();

    };


      console.log("Connecting to socket...");

      socket.on('connect', () => {
        console.log('WebSocket Connection Established');
    });
    
    socket.on('disconnect', (reason) => {
        console.log('WebSocket Connection Closed:', reason);
        if (reason === 'io client disconnect') {
            // Handle client disconnect, maybe attempt a reconnect
            socket.connect();  // Example of reconnecting
        }
    });
    
    socket.on('connect_error', (error) => {
        console.error('WebSocket Connection Error:', error);
    });

    socket.on('data-server-k3', handleSocketData);


      socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setError(error);
      });

      socket.on('disconnect', () => {
          console.log('Socket disconnected');
      });

      // Clean up the socket connection when the component unmounts
      return () => {
        socket.off('data-server-k3', handleSocketData);

          socket.disconnect();
      };
  }, []);



  return(
  <div className="" style={{fontSize: '12px'}}>
    <ToastContainer />


    <div id="app" data-v-app="">
    <audio ref={audio1Ref} src="/assets/audio/di1.da40b233.mp3" />
      <ReactHowler
        src="/assets/audio/di2.317de251.mp3"
        playing={playAudio2}
        loop={false} // Play only once
        volume={1.0}
        onEnd={() => setPlayAudio2(false)} // Ensure audio2 stops after playing
      />
      <div
        data-v-647954c7=""
        className="ar-loading-view"
        style={{"--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sansSerif'",
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
        data-v-d024c659=""
        className="K3__C"
        style={{"--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sansSerif',"}}
      >
        <div data-v-12a80a3e="" data-v-d024c659="" className="navbar main">
          <div data-v-12a80a3e="" className="navbar-fixed">
            <div data-v-12a80a3e="" className="navbar__content">
              <div data-v-12a80a3e="" className="navbar__content-left">
                <i
                  data-v-12a80a3e=""
                  className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={()=>navigate('/index')}
                  ></i
                >
              </div>
              <div data-v-12a80a3e="" className="navbar__content-center">
                <div
                  data-v-12a80a3e=""
                  className="headLogo"
                  style={{ backgroundImage: `url('/assets/png/h5setting_20230714005938hfia.png')` }}
                ></div>
                <div data-v-12a80a3e="" className="navbar__content-title"></div>
              </div>
              <div data-v-12a80a3e="" className="navbar__content-right">
                <div data-v-d024c659="" className="K3__C-head-more">
                  <div data-v-d024c659=""></div>
                  <div data-v-d024c659="" className=""></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-v-7dd1adab="" data-v-d024c659="" className="Wallet__C">
          <div data-v-7dd1adab="" className="Wallet__C-balance">
            <div data-v-7dd1adab="" className="Wallet__C-balance-l1">
              <div data-v-7dd1adab="">₹{userInfo?userInfo.money_user:0.00}</div>
            </div>
            <div data-v-7dd1adab="" className="Wallet__C-balance-l2">
              <svg data-v-7dd1adab="" className="svg-icon icon-lottyWallet">
                <use href="#icon-lottyWallet"></use>
              </svg>
              <div data-v-7dd1adab="">Wallet balance</div>
            </div>
            <div data-v-7dd1adab="" className="Wallet__C-balance-l3">
              <div data-v-7dd1adab="" onClick={()=>navigate('/wallet/withdraw')}>Withdraw</div>
              <div data-v-7dd1adab="" onClick={()=>navigate('/wallet/deposit')}>Deposit</div>
            </div>
          </div>
        </div>
        <div data-v-d024c659="" className="noticeBar__container" sitemsg="">
          <svg className="svg-icon icon-noticeBarSpeaker">
            <use href="#icon-noticeBarSpeaker"></use>
          </svg>
          <div className="noticeBar__container-body">
            <div className="noticeBar__container-body-text">
              Welcome to Big Daddy Pro! We have a variety of games, promos and bonus
              for you to enjoy, so why wait? Go register and enjoy the variety
              reward awaits you.
            </div>
          </div>
          <button className="hotIcon">Detail</button>
        </div>
        <div data-v-17d56002="" data-v-d024c659="" className="GameList__C">
        <div data-v-17d56002="" className="GameList__C-item active" onClick={() => {navigate('/AllLotteryGames/K3');}}>

    <div data-v-17d56002="">K3 Lotre <br />1Min</div>
  </div>

  <div data-v-17d56002="" className="GameList__C-item" onClick={() => {navigate('/AllLotteryGames/K3/3');}}>

    <div data-v-17d56002="">K3 Lotre<br />3Min</div>
  </div>

  <div data-v-17d56002="" className="GameList__C-item" onClick={() => {navigate('/AllLotteryGames/K3/5');}}>

    <div data-v-17d56002="">K3 Lotre<br />5Min</div>
  </div>

  <div data-v-17d56002="" className="GameList__C-item" onClick={() => {navigate('/AllLotteryGames/K3/10');}}>

    <div data-v-17d56002="">K3 Lotre<br />10Min</div>
  </div>
</div>

        <div data-v-75b35bf5="" className="K3TL__C">
          <div data-v-75b35bf5="" className="K3TL__C-l1">
            <div data-v-75b35bf5="" className="left">
              <div data-v-75b35bf5="">Period</div>
              <div data-v-75b35bf5="" className="K3TL__C-rule">
                <svg
                  data-v-75b35bf5=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                >
                  <path
                    data-v-75b35bf5=""
                    d="M9.0484 25.8284L9.04089 25.8359L9.03366 25.8437C8.47797 26.4402 7.97942 26.8014 7.56631 26.9797C7.15908 27.1556 6.87147 27.141 6.67169 27.055C6.46753 26.967 6.24252 26.7559 6.06263 26.3149C5.88195 25.8718 5.76602 25.2377 5.76602 24.3993V9.38602C5.76602 6.69019 6.09509 5.23943 6.86083 4.42092C7.61326 3.61665 8.94055 3.26602 11.4593 3.26602H21.5393C24.0584 3.26602 25.3852 3.61676 26.1358 4.42054C26.8997 5.23844 27.226 6.68864 27.2193 9.38453V9.38602V24.386C27.2193 25.2248 27.1041 25.8592 26.9242 26.3024C26.7451 26.7438 26.5211 26.9543 26.3182 27.0418C26.1198 27.1275 25.8328 27.1424 25.4244 26.9663C25.0105 26.7878 24.5102 26.4264 23.9512 25.8299C23.2918 25.1224 22.4328 24.7733 21.5701 24.8202C20.7074 24.8672 19.8916 25.3075 19.3127 26.0793L19.3123 26.0799L17.9676 27.8772C17.9673 27.8776 17.967 27.878 17.9667 27.8785C17.5231 28.4638 16.9844 28.7094 16.4927 28.7094C16.001 28.7094 15.4623 28.4638 15.0187 27.8785C15.0184 27.878 15.0181 27.8776 15.0177 27.8772L13.6733 26.0802C13.6732 26.0801 13.6732 26.08 13.6731 26.0799C12.5033 24.515 10.4028 24.3993 9.05577 25.8211L9.0484 25.8284ZM8.93935 14.666C8.93935 15.7307 9.80798 16.5993 10.8727 16.5993C11.9374 16.5993 12.806 15.7307 12.806 14.666C12.806 13.6013 11.9374 12.7327 10.8727 12.7327C9.80798 12.7327 8.93935 13.6013 8.93935 14.666ZM8.93935 9.33268C8.93935 10.3974 9.80798 11.266 10.8727 11.266C11.9374 11.266 12.806 10.3974 12.806 9.33268C12.806 8.26798 11.9374 7.39935 10.8727 7.39935C9.80798 7.39935 8.93935 8.26798 8.93935 9.33268ZM14.806 16.266H22.1393C23.0174 16.266 23.7393 15.5441 23.7393 14.666C23.7393 13.788 23.0174 13.066 22.1393 13.066H14.806C13.928 13.066 13.206 13.788 13.206 14.666C13.206 15.5441 13.928 16.266 14.806 16.266ZM14.806 10.9327H22.1393C23.0174 10.9327 23.7393 10.2107 23.7393 9.33268C23.7393 8.45465 23.0174 7.73268 22.1393 7.73268H14.806C13.928 7.73268 13.206 8.45465 13.206 9.33268C13.206 10.2107 13.928 10.9327 14.806 10.9327Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  ></path>
                </svg>
                How to play
              </div>
            </div>
            <div data-v-75b35bf5="">Time remaining</div>
          </div>
          <div data-v-75b35bf5="" className="K3TL__C-l2">
            <div data-v-75b35bf5="">{period}</div>
            <div data-v-75b35bf5="" className="K3TL__C-time">
              <div data-v-75b35bf5="">0</div>
              <div data-v-75b35bf5="">0</div>
              <div data-v-75b35bf5="" notime="">:</div>
              <div data-v-75b35bf5="">{time.seconds1}</div>
              <div data-v-75b35bf5="">{time.seconds2}</div>
            </div>
          </div>
          <div data-v-75b35bf5="" className="K3TL__C-l3">
            <div data-v-75b35bf5="" className="box">
              <div data-v-75b35bf5="" className="num1"></div>
              <div data-v-75b35bf5="" className="num2"></div>
              <div data-v-75b35bf5="" className="num6"></div>
            </div>
          </div>
        </div>
        <div
          data-v-8a4509d7=""
          data-v-d024c659=""
          className="K3B__C"
          voicetype="1"
          typeid="9"
        >
          <div data-v-8a4509d7="" className="K3B__C-mark" style={{ display: showMark ? '' : 'none' }}>
            <div data-v-8a4509d7="">{time.seconds1}</div>
            <div data-v-8a4509d7="">{time.seconds2}</div>
          </div>
          <div data-v-8a4509d7="" className="K3B__C-nav" >
            <div data-v-8a4509d7="" className={`${gameJoin === 'game1' ? 'active' : ''}`}  onClick={() => showSection('game1')}>Total</div>
            <div data-v-8a4509d7="" className={`${gameJoin === 'game2' ? 'active' : ''}`}  onClick={() => showSection('game2')}>2 same</div>
            <div data-v-8a4509d7="" className={`${gameJoin === 'game3' ? 'active' : ''}`}  onClick={() => showSection('game3')}>3 same</div>
            <div data-v-8a4509d7="" className={`${gameJoin === 'game4' ? 'active' : ''}`}  onClick={() => showSection('game4')}>Different</div>
          </div>
          <div
  data-v-ed0c8e79=""
  data-v-8a4509d7=""
  className="K3B__C-bettingList"
  id="game1"
  style={{ display: gameJoin === 'game1' ? 'flex' : 'none' }}
>
  <div data-v-ed0c8e79="" className="num num3" onClick={() => addToListJoin(3)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num3">3</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">207.36X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num4" onClick={() => addToListJoin(4)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num4">4</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">69.12X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num5" onClick={() => addToListJoin(5)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num5">5</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">34.56X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num6" onClick={() => addToListJoin(6)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num6">6</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">20.74X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num7" onClick={() => addToListJoin(7)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num7">7</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">13.83X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num8" onClick={() => addToListJoin(8)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num8">8</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">9.88X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num9" onClick={() => addToListJoin(9)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num9">9</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">8.3X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num10" onClick={() => addToListJoin(10)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num10">10</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">7.68X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num11" onClick={() => addToListJoin(11)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num11">11</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">7.68X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num12" onClick={() => addToListJoin(12)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num12">12</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">8.3X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num13" onClick={() => addToListJoin(13)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num13">13</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">9.88X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num14" onClick={() => addToListJoin(14)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num14">14</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">13.83X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num15" onClick={() => addToListJoin(15)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num15">15</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">20.74X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num16" onClick={() => addToListJoin(16)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num16">16</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">34.56X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num17" onClick={() => addToListJoin(17)}>
    <div data-v-ed0c8e79="" className="ball rball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num17">17</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">69.12X</div>
  </div>
  <div data-v-ed0c8e79="" className="num num18" onClick={() => addToListJoin(18)}>
    <div data-v-ed0c8e79="" className="ball gball">
      <div data-v-ed0c8e79="" className="K3B__C-odds-bet num18">18</div>
    </div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">207.36X</div>
  </div>
  <div data-v-ed0c8e79="" className="num numA" onClick={() => addToListJoin('b')}>
    <div data-v-ed0c8e79="" className="">Big</div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">2X</div>
  </div>
  <div data-v-ed0c8e79="" className="num numB" onClick={() => addToListJoin('s')}>
    <div data-v-ed0c8e79="" className="">Small</div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">2X</div>
  </div>
  <div data-v-ed0c8e79="" className="num numC" onClick={() => addToListJoin('l')}>
    <div data-v-ed0c8e79="" className="">Odd</div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">2X</div>
  </div>
  <div data-v-ed0c8e79="" className="num numD" onClick={() => addToListJoin('c')}>
    <div data-v-ed0c8e79="" className="">Even</div>
    <div data-v-ed0c8e79="" className="K3B__C-odds-rate">2X</div>
  </div>
</div>


          <div 
  data-v-5c28a69e="" 
  data-v-8a4509d7="" 
  className="K3B__C-betting2"  
  id="game2" 
  style={{ display: gameJoin === 'game2' ? 'block' : 'none' }}
>
  <div data-v-5c28a69e="" className="K3B__C-betting2-tip1">
    2 matching numbers: odds
    <span data-v-5c28a69e="">(13.83)</span>
    <i 
      data-v-5c28a69e="" 
      className="van-badge__wrapper van-icon van-icon-question icon" 
      style={{ color: 'rgb(250, 87, 74)', fontSize: '16px' }}
    ></i>
  </div>
  
  <div data-v-5c28a69e="" className="K3B__C-betting2-line1 mb30">
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">11</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">22</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">33</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">44</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">55</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">66</div>
    </div>
  </div>
  
  <div data-v-5c28a69e="" className="K3B__C-betting2-tip1">
    A pair of unique numbers: odds
    <span data-v-5c28a69e="">(69.12)</span>
    <i 
      data-v-5c28a69e="" 
      className="van-badge__wrapper van-icon van-icon-question icon" 
      style={{ color: 'rgb(250, 87, 74)', fontSize: '16px' }}
    ></i>
  </div>
  
  <div data-v-5c28a69e="" className="K3B__C-betting2-line2">
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">11</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">22</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">33</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">44</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">55</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">66</div>
    </div>
  </div>
  
  <div data-v-5c28a69e="" className="K3B__C-betting2-line3">
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">1</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">2</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">3</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">4</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">5</div>
    </div>
    <div data-v-5c28a69e="">
      <div data-v-5c28a69e="">6</div>
    </div>
  </div>
</div>


<div data-v-8a4509d7="" data-v-d024c659="" className="K3B__C" voicetype="1" typeid="9" style={{ display: 'none' }}>
    <div data-v-8a4509d7="" className="K3B__C-mark"  style={{ display: showMark ? '' : 'none' }}>
        <div data-v-8a4509d7="">{time.seconds1}</div>
        <div data-v-8a4509d7="">{time.seconds2}</div>
        </div></div>
        <div data-v-3deb049d="" data-v-8a4509d7="" className="K3B__C-betting3" id="game3" style={{ display: gameJoin === 'game3' ? 'block' : 'none' }}><div data-v-3deb049d="" className="K3B__C-betting3-tip1">3 of the same number: odds <span data-v-3deb049d="">(207.36)</span><i data-v-3deb049d="" className="van-badge__wrapper van-icon van-icon-question icon" style={{color: 'rgb(250, 87, 74)', fontSize: '16px'}}></i></div><div data-v-3deb049d="" className="K3B__C-betting3-line1 mb30"><div data-v-3deb049d="" className=""><div data-v-3deb049d="">111</div></div><div data-v-3deb049d="" className=""><div data-v-3deb049d="">222</div></div><div data-v-3deb049d="" className=""><div data-v-3deb049d="">333</div></div><div data-v-3deb049d="" className=""><div data-v-3deb049d="">444</div></div><div data-v-3deb049d="" className=""><div data-v-3deb049d="">555</div></div><div data-v-3deb049d="" className=""><div data-v-3deb049d="">666</div></div></div><div data-v-3deb049d="" className="K3B__C-betting3-tip1">Any 3 of the same number: odds <span data-v-3deb049d="">(34.56)</span><i data-v-3deb049d="" className="van-badge__wrapper van-icon van-icon-question icon" style={{color: 'rgb(250, 87, 74)', fontSize: '16px'}}></i></div><div data-v-3deb049d="" className="K3B__C-betting3-btn">Any 3 of the same number: odds</div></div>

          <div data-v-bcf2c3f9="" data-v-8a4509d7="" className="K3B__C-betting4" id="game4" style={{ display: gameJoin === 'game4' ? 'block' : 'none' }}><div data-v-bcf2c3f9="" className="K3B__C-betting4-tip1">3 different numbers: odds <span data-v-bcf2c3f9="">(34.56)</span><i data-v-bcf2c3f9="" className="van-badge__wrapper van-icon van-icon-question icon" style={{color: 'rgb(250, 87, 74)', fontSize: '16px'}}></i></div><div data-v-bcf2c3f9="" className="K3B__C-betting4-line1 mb30"><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">1</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">2</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">3</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">4</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">5</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">6</div></div></div><div data-v-bcf2c3f9="" className="K3B__C-betting4-tip1">3 continuous numbers: odds <span data-v-bcf2c3f9="">(8.64)</span><i data-v-bcf2c3f9="" className="van-badge__wrapper van-icon van-icon-question icon" style={{color: 'rgb(250, 87, 74)', fontSize: '16px'}}></i></div><div data-v-bcf2c3f9="" className="K3B__C-betting4-btn">3 continuous numbers</div><div data-v-bcf2c3f9="" className="K3B__C-betting4-tip1">2 different numbers: odds <span data-v-bcf2c3f9="">(6.91)</span><i data-v-bcf2c3f9="" className="van-badge__wrapper van-icon van-icon-question icon" style={{color: 'rgb(250, 87, 74)', fontSize: '16px'}}></i></div><div data-v-bcf2c3f9="" className="K3B__C-betting4-line1"><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">1</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">2</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">3</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">4</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">5</div></div><div data-v-bcf2c3f9="" className=""><div data-v-bcf2c3f9="">6</div></div></div></div>

        </div>
        <div data-v-72f81e71="" data-v-d024c659="" className="RecordNav__C">
          <div data-v-72f81e71="" className={`${activeHistory === 'history1' ? 'active' : ''}`} onClick={()=>showHistory('history1')}>Game history</div>
          <div data-v-72f81e71="" className={`${activeHistory === 'history2' ? 'active':''}`} onClick={()=>showHistory('history2')}>Chart</div>
          <div data-v-72f81e71="" className={`${activeHistory === 'history3' ? 'active':''}`} onClick={()=>showHistory('history3')}>My history</div>
        </div>
        <div
          data-v-4e09079f=""
          data-v-d024c659=""
          className="GameRecord__C"
          apifun="e=>_(f.WinTxrGetTRXMyEmerdList,e).then(t=>t.data)"
          listapi="e=>_(f.GetK3NoaverageEmerdList,e).then(t=>t.data)"
          emerdapi="e=>_(f.WinTxrGetEmerdList,e).then(t=>t.data)"
          gopathname="AllLotteryGames-BettingRecordK3"   id="history1" style={{ display: activeHistory === 'history1' ? 'block' : 'none' }}
        >
          <div data-v-4e09079f="" className="GameRecord__C-head">
            <div data-v-4e09079f="" className="van-row">
              <div data-v-4e09079f="" className="van-col van-col--10">Period</div>
              <div data-v-4e09079f="" className="van-col van-col--4">Sum</div>
              <div data-v-4e09079f="" className="van-col van-col--10">Results</div>
            </div>
          </div>
          

          <GameList gamelist={gamelist} />

                     
          <div data-v-4b21e13b="" className="MyGameRecord__C-foot">
  <div 
    data-v-4b21e13b="" 
    className={`MyGameRecord__C-foot-previous ${currentGamePage === 1 ? 'disabled' : ''}`} 
    onClick={handlePreviousGamePage}
  >
    <i 
      data-v-4b21e13b="" 
      className="van-badge__wrapper van-icon van-icon-arrow-left MyGameRecord__C-icon" 
      style={{ fontSize: '20px' }}
    ></i>
  </div>
  <div data-v-4b21e13b="" className="MyGameRecord__C-foot-page">
    {currentGamePage}/{totalGamePages}
  </div>
  <div 
    data-v-4b21e13b="" 
    className={`MyGameRecord__C-foot-next ${currentGamePage === totalGamePages ? 'disabled' : ''}`} 
    onClick={handleNextGamePage}
  >
    <i 
      data-v-4b21e13b="" 
      className="van-badge__wrapper van-icon van-icon-arrow MyGameRecord__C-icon" 
      style={{ fontSize: '20px' }}
    ></i>
  </div>
</div>
        </div>
        <div data-v-3e71d3da="" data-v-d024c659="" className="dialog inactive" style={{display: 'none'}}>
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
              <div data-v-d024c659=""></div>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-footer">
              <button data-v-3e71d3da="">Confirm</button
              ><button data-v-3e71d3da="">Cancel</button>
            </div>
          </div>
          <div data-v-3e71d3da="" className="dialog__outside"></div>
        </div>

        <div
        data-v-4159c83a=""
        data-v-d024c659=""
        className="Trend__C"
        apifun="e=>_(f.WinTxrGetTRXMyEmerdList,e).then(t=>t.data)"
        listapi="e=>_(f.GetK3NoaverageEmerdList,e).then(t=>t.data)"
        emerdapi="e=>_(f.WinTxrGetEmerdList,e).then(t=>t.data)"
        gopathname="AllLotteryGames-BettingRecordK3" id="history2" style={{ display: activeHistory === 'history2' ? 'block' : 'none' }}
      >


      
        <div data-v-4159c83a="" className="Trend__C-head">
          <div data-v-4159c83a="" className="van-row">
            <div data-v-4159c83a="" className="van-col van-col--8">Period</div>
            <div data-v-4159c83a="" className="van-col van-col--6">Results</div>
            <div data-v-4159c83a="" className="van-col van-col--10">Number</div>
          </div>
        </div>

        <ChartList gamelist={gamelist} />

          
        <div data-v-4b21e13b="" className="MyGameRecord__C-foot">
  <div 
    data-v-4b21e13b="" 
    className={`MyGameRecord__C-foot-previous ${currentGamePage === 1 ? 'disabled' : ''}`} 
    onClick={handlePreviousGamePage}
  >
    <i 
      data-v-4b21e13b="" 
      className="van-badge__wrapper van-icon van-icon-arrow-left MyGameRecord__C-icon" 
      style={{ fontSize: '20px' }}
    ></i>
  </div>
  <div data-v-4b21e13b="" className="MyGameRecord__C-foot-page">
    {currentGamePage}/{totalGamePages}
  </div>
  <div 
    data-v-4b21e13b="" 
    className={`MyGameRecord__C-foot-next ${currentGamePage === totalGamePages ? 'disabled' : ''}`} 
    onClick={handleNextGamePage}
  >
    <i 
      data-v-4b21e13b="" 
      className="van-badge__wrapper van-icon van-icon-arrow MyGameRecord__C-icon" 
      style={{ fontSize: '20px' }}
    ></i>
  </div>
</div>
      </div>
       
      <div
      data-v-cffd8c9f=""
      data-v-d024c659=""
      className="MyGameRecord__C"
      apifun="e=>_(f.WinTxrGetTRXMyEmerdList,e).then(t=>t.data)"
      listapi="e=>_(f.GetK3NoaverageEmerdList,e).then(t=>t.data)"
      emerdapi="e=>_(f.WinTxrGetEmerdList,e).then(t=>t.data)"
      id="history3" style={{ display: activeHistory === 'history3' ? 'block' : 'none' }}>
      <div data-v-cffd8c9f="" className="MyGameRecord__C-head">
        <div data-v-cffd8c9f="" className="MyGameRecord__C-head-moreB">
          Detail
          <svg data-v-cffd8c9f="" className="svg-icon icon-rightCircle">
            <use href="#icon-rightCircle"></use>
          </svg>
        </div>
      </div>
      <div data-v-cffd8c9f="" className="MyGameRecord__C-body" >
      <div data-v-a5ef3154="" data-v-cffd8c9f="" className="MyGameRecordList__C">
   
      <MyGameRecordList myBets={myBets} gameJoin={gameJoin}/>

      

   
    <div data-v-a5ef3154="" className="MyGameRecordList__C-detail" style={{ display:'none' }}>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-text">Details</div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Order number <div data-v-a5ef3154="">
                K32024090215592148858774f <svg data-v-a5ef3154="" className="svg-icon icon-copy">
                    <use href="#icon-copy"></use>
                </svg></div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Period <div data-v-a5ef3154="">
                20240902090960</div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Purchase amount <div data-v-a5ef3154="">
                ₹15.00</div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Quantity <div data-v-a5ef3154="">1</div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Amount after tax <div data-v-a5ef3154=""
                className="red">₹14.70</div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Tax <div data-v-a5ef3154="">₹0.30</div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Result <div data-v-a5ef3154=""
                className="numList">
                <div data-v-a5ef3154="" className="n5"></div>
                <div data-v-a5ef3154="" className="n6"></div>
                <div data-v-a5ef3154="" className="n1"></div>
            </div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line noLine">Select <div data-v-a5ef3154=""
                className="line1"><span data-v-a5ef3154="" className="">2 same numbers:</span><span data-v-a5ef3154=""
                    className="btn actionViolet">11</span><span data-v-a5ef3154=""
                    className="btn actionViolet">22</span><span data-v-a5ef3154=""
                    className="btn actionViolet">33</span><span data-v-a5ef3154=""
                    className="btn actionViolet">44</span><span data-v-a5ef3154=""
                    className="btn actionViolet">55</span><span data-v-a5ef3154=""
                    className="btn actionViolet">66</span><span data-v-a5ef3154="" className="">2 same and 1 different
                    numbers:</span><span data-v-a5ef3154="" className="btn actionRedGreen">22|1,3,4</span><span
                    data-v-a5ef3154="" className="btn actionRedGreen">55|1,3,4</span><span data-v-a5ef3154=""
                    className="btn actionRedGreen">66|1,3,4</span></div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Status <div data-v-a5ef3154=""
                className="red">Failed</div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Win/lose <div data-v-a5ef3154=""
                className="red">- ₹14.70</div>
        </div>
        <div data-v-a5ef3154="" className="MyGameRecordList__C-detail-line">Order time <div data-v-a5ef3154="">
                2024-09-02 15:59:21</div>
        </div>
    </div>
   
</div>
      </div>
      <div data-v-4b21e13b="" className="MyGameRecord__C-foot">
  <div 
    data-v-4b21e13b="" 
    className={`MyGameRecord__C-foot-previous ${currentPage === 1 ? 'disabled' : ''}`} 
    onClick={handlePreviousPage}
  >
    <i 
      data-v-4b21e13b="" 
      className="van-badge__wrapper van-icon van-icon-arrow-left MyGameRecord__C-icon" 
      style={{ fontSize: '20px' }}
    ></i>
  </div>
  <div data-v-4b21e13b="" className="MyGameRecord__C-foot-page">
    {currentPage}/{totalBetsPages}
  </div>
  <div 
    data-v-4b21e13b="" 
    className={`MyGameRecord__C-foot-next ${currentPage === totalBetsPages ? 'disabled' : ''}`} 
    onClick={handleNextPage}
  >
    <i 
      data-v-4b21e13b="" 
      className="van-badge__wrapper van-icon van-icon-arrow MyGameRecord__C-icon" 
      style={{ fontSize: '20px' }}
    ></i>
  </div>
</div>
      
    </div>

    {showBetPopup && <BetPopup listOrder={listJoin} gameJoin={gameJoin} game={1} userBalance={userInfo?userInfo.money_user:0.00} setListJoin={setListJoin}   
setShowBetPopup={setShowBetPopup} fetchMyBets={fetchMyBets} fetchUserInfo={fetchUserInfo} />}

      

      


        <div
          data-v-2d418cc5=""
          data-v-d024c659=""
          className="WinningTip__C"
          style={{display: 'none'}}
        >
          <div data-v-2d418cc5="" className="WinningTip__C-body">
            <div data-v-2d418cc5="" className="WinningTip__C-body-l1">
              Congratulations
            </div>
            <div data-v-2d418cc5="" className="WinningTip__C-body-l2">
              <div data-v-2d418cc5="" className="line1"></div>
              <div data-v-2d418cc5="" className="line2">
                <div data-v-2d418cc5=""></div>
                <div data-v-2d418cc5="" className="yuan">Small</div>
                <div data-v-2d418cc5="">Even</div>
              </div>
            </div>
            <div data-v-2d418cc5="" className="WinningTip__C-body-l3">
              <div data-v-2d418cc5="" className="head">Bonus</div>
              <div data-v-2d418cc5="" className="bonus"></div>
              <div data-v-2d418cc5="" className="gameDetail">Period:</div>
            </div>
            <div data-v-2d418cc5="" className="WinningTip__C-body-l4">
              <div data-v-2d418cc5="" className="acitveBtn"></div>
              3 seconds auto close
            </div>
            <div data-v-2d418cc5="" className="closeBtn"></div>
            <i
              data-v-2d418cc5=""
              className="van-badge__wrapper van-icon van-icon-arrow arrowBtn"
              style={{color: 'rgb(255, 255, 255)', fontSize: '30px', display: 'none'}}
              ></i
            >
          </div>
        </div>
        <div
          data-v-0ac3de13=""
          data-v-d024c659=""
          className="changlongEnter changlong"
        ></div>
        <audio id="voice1">
          <source src="/assets/mp3/di1-0f3d86cb.mp3" type="audio/mpeg" /></audio
        ><audio id="voice2">
          <source src="/assets/mp3/di2-ad9aa8fb.mp3" type="audio/mpeg" />
        </audio>
      </div>
      <div
        className="customer"
        id="customerId"
        style={{"--f13b4d11-currentFontFamily": "'Roboto', 'Inter', sansSerif",
          "--f6a705e1-currentFontFamily": 'bahnschrift'
        }}
      >
        <img
          className=""
          data-origin="/assets/png/icon_sevice-9f0c8455.png"
          src="/assets/png/icon_sevice-9f0c8455.png"
        />
      </div>
      
    </div>

    <div data-v-app=""></div>
    <div className="van-overlay" style={{zIndex: 2011, display: 'none'}}> 
       <div className="van-overlay" style={{zIndex: 2011, display: 'none'}}> 
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--round van-popup--bottom"
      data-v-7181abf7=""
      style={{
        zIndex: '2020',
        boxShadow: "rgba(37, 37, 60, 0.26) 0px -18px 40px",
      }}
    >
      <div data-v-7181abf7="" className="Betting__Popup-body">
        <div data-v-baf77bdf="" className="FDB__C-nav">
          <div data-v-baf77bdf="" className="active">A</div>
          <div data-v-baf77bdf="" className="">B</div>
          <div data-v-baf77bdf="" className="">C</div>
          <div data-v-baf77bdf="" className="">D</div>
          <div data-v-baf77bdf="" className="">E</div>
          <div data-v-baf77bdf="" className="">SUM</div>
        </div>
        <div data-v-baf77bdf="" className="FDB__C-H">
          <div data-v-baf77bdf="" className="active">
            <span data-v-baf77bdf="">Big</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
          <div data-v-baf77bdf="" className="">
            <span data-v-baf77bdf="">Small</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
          <div data-v-baf77bdf="" className="">
            <span data-v-baf77bdf="">Odd</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
          <div data-v-baf77bdf="" className="">
            <span data-v-baf77bdf="">Even</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
        </div>
        <div data-v-baf77bdf="" className="FDB__C-Num">
          <div data-v-baf77bdf="" txt="0" className="">
            <div data-v-baf77bdf="" className="round">0</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="1" className="">
            <div data-v-baf77bdf="" className="round">1</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="2" className="">
            <div data-v-baf77bdf="" className="round">2</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="3" className="">
            <div data-v-baf77bdf="" className="round">3</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="4" className="">
            <div data-v-baf77bdf="" className="round">4</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="5" className="">
            <div data-v-baf77bdf="" className="round">5</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="6" className="">
            <div data-v-baf77bdf="" className="round">6</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="7" className="">
            <div data-v-baf77bdf="" className="round">7</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="8" className="">
            <div data-v-baf77bdf="" className="round">8</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="9" className="">
            <div data-v-baf77bdf="" className="round">9</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          Balance
          <div data-v-7181abf7="" className="Betting__Popup-body-line-list">
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item bgcolor"
            >
              1
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-body-line-item">
              10
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-body-line-item">
              100
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-body-line-item">
              1000
            </div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          Quantity
          <div data-v-7181abf7="" className="Betting__Popup-body-line-btnL">
            <div data-v-7181abf7="" className="Betting__Popup-btn bgcolor">
              -
            </div>
            <div
              data-v-7181abf7=""
              className="van-cell van-field Betting__Popup-input"
              modelmodifiers="[object Object]"
            >
              
              <div className="van-cell__value van-field__value">
                <div className="van-field__body">
                  <input
                    type="tel"
                    inputMode="numeric"
                    id="van-field-19-input"
                    className="van-field__control"
                  />
                </div>
                
              </div>
              
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-btn bgcolor">
              +
            </div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          <div data-v-7181abf7=""></div>
          <div data-v-7181abf7="" className="Betting__Popup-body-line-list">
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder bgcolor"
            >
              X1
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X5
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X10
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X20
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X50
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X100
            </div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          <span data-v-7181abf7="" className="Betting__Popup-agree active"
            >I agree</span
          ><span data-v-7181abf7="" className="Betting__Popup-preSaleShow"
            >《Pre-sale rules》</span
          >
        </div>
      </div>
      <div data-v-7181abf7="" className="Betting__Popup-foot">
        <div data-v-7181abf7="" className="Betting__Popup-foot-c">Cancel</div>
        <div data-v-7181abf7="" className="Betting__Popup-foot-s bgcolor">
          Total amount₹1.00
        </div>
      </div>
      
    </div></div></div>
    <div className="van-overlay" style={{zIndex: '2001', display: 'none'}}>  <div className="van-overlay" data-v-7181abf7="" style={{zIndex: '2020'}}>
      
    </div>
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--round van-popup--bottom"
      data-v-7181abf7=""
      style={{
        zIndex: '2020',
        boxShadow: 'rgba(37, 37, 60, 0.26) 0px -18px 40px',
      }}
    >
      <div data-v-7181abf7="" className="Betting__Popup-body">
        <div data-v-baf77bdf="" className="FDB__C-nav">
          <div data-v-baf77bdf="" className="active">A</div>
          <div data-v-baf77bdf="" className="">B</div>
          <div data-v-baf77bdf="" className="">C</div>
          <div data-v-baf77bdf="" className="">D</div>
          <div data-v-baf77bdf="" className="">E</div>
          <div data-v-baf77bdf="" className="">SUM</div>
        </div>
        <div data-v-baf77bdf="" className="FDB__C-H">
          <div data-v-baf77bdf="" className="active">
            <span data-v-baf77bdf="">Big</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
          <div data-v-baf77bdf="" className="">
            <span data-v-baf77bdf="">Small</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
          <div data-v-baf77bdf="" className="">
            <span data-v-baf77bdf="">Odd</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
          <div data-v-baf77bdf="" className="">
            <span data-v-baf77bdf="">Even</span
            ><span data-v-baf77bdf="">1.98</span>
          </div>
        </div>
        <div data-v-baf77bdf="" className="FDB__C-Num">
          <div data-v-baf77bdf="" txt="0" className="">
            <div data-v-baf77bdf="" className="round">0</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="1" className="">
            <div data-v-baf77bdf="" className="round">1</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="2" className="">
            <div data-v-baf77bdf="" className="round">2</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="3" className="">
            <div data-v-baf77bdf="" className="round">3</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="4" className="">
            <div data-v-baf77bdf="" className="round">4</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="5" className="">
            <div data-v-baf77bdf="" className="round">5</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="6" className="">
            <div data-v-baf77bdf="" className="round">6</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="7" className="">
            <div data-v-baf77bdf="" className="round">7</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="8" className="">
            <div data-v-baf77bdf="" className="round">8</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
          <div data-v-baf77bdf="" txt="9" className="">
            <div data-v-baf77bdf="" className="round">9</div>
            <div data-v-baf77bdf="" className="rate">9</div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          Balance
          <div data-v-7181abf7="" className="Betting__Popup-body-line-list">
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item bgcolor"
            >
              1
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-body-line-item">
              10
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-body-line-item">
              100
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-body-line-item">
              1000
            </div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          Quantity
          <div data-v-7181abf7="" className="Betting__Popup-body-line-btnL">
            <div data-v-7181abf7="" className="Betting__Popup-btn bgcolor">
              -
            </div>
            <div
              data-v-7181abf7=""
              className="van-cell van-field Betting__Popup-input"
              modelmodifiers="[object Object]"
            >
              
              <div className="van-cell__value van-field__value">
                <div className="van-field__body">
                  <input
                    type="tel"
                    inputMode="numeric"
                    id="van-field-19-input"
                    className="van-field__control"
                  />
                </div>
                
              </div>
              
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-btn bgcolor">
              +
            </div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          <div data-v-7181abf7=""></div>
          <div data-v-7181abf7="" className="Betting__Popup-body-line-list">
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder bgcolor"
            >
              X1
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X5
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X10
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X20
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X50
            </div>
            <div
              data-v-7181abf7=""
              className="Betting__Popup-body-line-item setBorder"
            >
              X100
            </div>
          </div>
        </div>
        <div data-v-7181abf7="" className="Betting__Popup-body-line">
          <span data-v-7181abf7="" className="Betting__Popup-agree active"
            >I agree</span
          ><span data-v-7181abf7="" className="Betting__Popup-preSaleShow"
            >《Pre-sale rules》</span
          >
        </div>
      </div>
      <div data-v-7181abf7="" className="Betting__Popup-foot">
        <div data-v-7181abf7="" className="Betting__Popup-foot-c">Cancel</div>
        <div data-v-7181abf7="" className="Betting__Popup-foot-s bgcolor">
          Total amount₹1.00
        </div>
      </div>
      
    </div></div>
  </div>
)}
