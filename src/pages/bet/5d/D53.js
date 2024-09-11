import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { io } from 'socket.io-client';
import Api from '../../../services/Api';
import MyGameRecordList from '../5d/components/MyGameRecordList';
import GameList from '../5d/components/GameList';
import LotteryResults from '../5d/components/LotteryResults';
import ReactHowler from 'react-howler';
import ChartList from '../5d/components/ChartList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '../../../components/ToastContext'; 



const SOCKET_URL = 'http://localhost:3000';



const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
});


const countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();


export default function D5(){
  const { showToast } = useToast();


    const [gameJoin, setGameJoin] = useState('game1');
    const [activeTime, setActiveTime] =useState('time1');
    const [activeSection, setActiveSection] = useState('section1');
    const [activeHistory, setActiveHistory] =useState('history1');
    const [lastResult, setLastResult] =useState({});


    const showHistory =(historyID) =>{
      setActiveHistory(historyID);
    };

const showSection = (sectionId) => {

  fetchGamelist();
    setActiveSection(sectionId);
    setListJoin([]);
    setShowBetPopup(false);
  };

  const handleSelectBalance = (value) => {
    setBalance(value);
  };

  const handleSelectQuantity = (value) => {
    setQuantity(value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };



  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [gamelist, setGamelist] = useState([]);
  const [myBets,setMyBets] = useState(null);
  const [period, setPeriod] = useState(null);
  const [showBetPopup , setShowBetPopup] = useState(false);


  const [time, setTime] = useState({
    minute: 0,
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

  const [join, setJoin] = useState('a');
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
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const minute = Math.ceil(minutes % 3);
      const seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
      const seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
      setTime({ minute, seconds1, seconds2 });

      if (userInteracted) { // Play audio only if the user has interacted
        if (minute === 0 && seconds1 === 0 && seconds2 > 0 && seconds2 <= 5) {
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

      if (minute === 0 && seconds1 === 0 && seconds2 === 0) {
        console.log('Playing audio2');
        setPlayAudio2(true);
        setAudio2Played(true);
        setTimeout(() => {
          setPlayAudio2(false); // Stop audio2 after it has finished playing
        }, 3000); // Adjust this duration based on the length of audio2
      }

      if (minute === 0 && seconds1 !== 0 || seconds2 > 5) {
        setShowMark(false);

        if (userInteracted && audio1Ref.current) { // Only pause audio if user interacted
          audio1Ref.current.pause();
          audio1Ref.current.currentTime = 0;
        }
      }

      if (minute === 0 && seconds1 === 0 && seconds2 <= 5) {
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

      const response = await Api.post('/api/webapi/5d/GetNoaverageEmerdList', {
        gameJoin: "3",
        pageno: pageno.toString(),
        pageto: "10",
      });

      console.log("hi");

      console.log(response.data.data.gameslist);

      // Update gamelist state
      setGamelist(response.data.data.gameslist ?? []);
      setLastResult(response.data.data.gameslist[0] ?? {});

    console.log(response.data.data.gameslist[0]);

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
      const response = await Api.post('/api/webapi/5d/GetMyEmerdList', {
        gameJoin: "3",
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

      if (msg.game !== '3') return;

        console.log(msg.data[0]);

      fetchGamelist();
      fetchUserInfo();
      fetchMyBets();

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


  const handleJoin = async () => {
    const totalAmount = quantity * balance * listJoin.length;
  
    // Validate inputs
    if (!join || !quantity || !balance || !listJoin || userInfo.money_user < totalAmount) {
      showToast('Invalid input or insufficient balance', 'succes');

      toast.error('Invalid input or insufficient balance', {
        icon: false, // No icon
        progressBar: false, // No progress bar
        style: {
          backgroundColor: 'black', // Black background
          color: 'white', // White text
        },
      });
      return;
    }
  
    // Prepare the list_join value
    const formattedListJoin = listJoin.length > 1 ? listJoin.join('') : listJoin[0];
  
    try {
      // Make the AJAX request
      const response = await Api.post('/api/webapi/action/5d/join', {
        game: '1',
        list_join: formattedListJoin,
        join: join,
        x: quantity,
        money: balance,
      });
  
      showToast('Bet placed successfully!', 'succes');

       setShowBetPopup(false);
       fetchUserInfo();
       fetchMyBets();


    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  


  const handleSelection = (value, section) => {
    setListJoin((prevList) => {
      // Handle selection from FDB__C-H
      if (section === 'FDB__C-H') {
        // Clear items from FDB__C-Num
        const newList = prevList.filter(item => !item.startsWith('num'));
        // Add the new selection from FDB__C-H
        return newList.includes(value) 
          ? newList.filter((item) => item !== value) // Remove if already in the list
          : [value]; // Replace with new value
      }
      
      // Handle selection from FDB__C-Num
      if (section === 'FDB__C-Num') {
        // Clear items from FDB__C-H
        const newList = prevList.filter(item => !['b', 's', 'c', 'l'].includes(item));
        // Add or remove the new selection from FDB__C-Num
        return newList.includes(value)
          ? newList.filter((item) => item !== value) // Remove if already in the list
          : [...newList, value]; // Add new value
      }
      
      return prevList;
    });
  
    setShowBetPopup(true);
  };
  



  const [betData, setBetData] = useState(null); // Store the submitted data

  // Function to open the BetPopup
  const handleOpenBetPopup = () => {
    setShowBetPopup(true);
  };

  // Function to close the BetPopup
  const handleCloseBetPopup = () => {
    setShowBetPopup(false);
  };

  // Function to handle the submission from BetPopup
  const handleSubmitBetPopup = (data) => {
    console.log('Bet data submitted:', data);
    setBetData(data); // Store the bet data (listJoin, quantity, balance)
    setShowBetPopup(false); // Close the popup after submission
  };

  return (
    <div style={{fontSize: '12px'}}>


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
        style={{
          '--f13b4d11-currentFontFamily': "'Roboto', 'Inter', 'sansSerif'",
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
        data-v-4f526022=""
        className="FD__C"
        style={{'--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'"}}
      >
        <div data-v-12a80a3e="" data-v-4f526022="" className="navbar main">
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
                  style={{
                    backgroundImage: `url('/assets/png/BDGPRO2.png')`}}
                ></div>
                <div data-v-12a80a3e="" className="navbar__content-title"></div>
              </div>
              <div data-v-12a80a3e="" className="navbar__content-right">
                <div data-v-4f526022="" className="FD__C-head-more">
                  <div data-v-4f526022=""></div>
                  <div data-v-4f526022="" className=""></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-v-7dd1adab="" data-v-4f526022="" className="Wallet__C">
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
              <div data-v-7dd1adab="">Withdraw</div>
              <div data-v-7dd1adab="">Deposit</div>
            </div>
          </div>
        </div>
        <div data-v-4f526022="" className="noticeBar__container">
          <svg className="svg-icon icon-noticeBarSpeaker">
            <use href="#icon-noticeBarSpeaker"></use>
          </svg>
          <div className="noticeBar__container-body">
            <div className="noticeBar__container-body-text" onClick={handleOpenBetPopup}>
              Due to unstable of bank india will have delay or failed on
              payment, so if you are experiencing any issues with making a
              payment, we recommend switching to a different payment channel and
              attempting to deposit again. to ensure your transaction smooth and
              fast we suggesting to do payment using barcode method or PAYTM
              method, also for using PhonePe sometimes will encountering delay
              or failed payment, Your satisfaction is our priority. Thank you
              for your understanding and continued support.
            </div>
          </div>
          <button className="hotIcon">Detail</button>
        </div>
        <div data-v-17d56002="" data-v-4f526022="" className="GameList__C">
          <div data-v-17d56002="" className="GameList__C-item" onClick={() => {navigate('/home/AllLotteryGames/5D');}}>
            <div data-v-17d56002="">5D<br />1Min</div>
          </div>
          <div data-v-17d56002="" className="GameList__C-item active" onClick={() => {navigate('/home/AllLotteryGames/5D/3');}}>
            <div data-v-17d56002="">5D<br />3Min</div>
          </div>
          <div data-v-17d56002="" className="GameList__C-item" onClick={() => {navigate('/home/AllLotteryGames/5D/5');}}>
            <div data-v-17d56002="">5D<br />5Min</div>
          </div>
          <div data-v-17d56002="" className="GameList__C-item" onClick={() => {navigate('/home/AllLotteryGames/5D/10');}}>
            <div data-v-17d56002="">5D<br />10Min</div>
          </div>
        </div>
        
        <LotteryResults lastResult={lastResult} />

        <div data-v-69f351dd="" className="FDTL__C">
          <div data-v-69f351dd="" className="FDTL__C-l1">
            <div data-v-69f351dd="" className="left">
              <div data-v-69f351dd="">Period</div>
              <div data-v-69f351dd="" className="FDTL__C-rule">
                <svg
                  data-v-69f351dd=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    data-v-69f351dd=""
                    d="M8.5484 25.8291L8.54089 25.8366L8.53366 25.8444C7.97797 26.4409 7.47942 26.802 7.06631 26.9804C6.65908 27.1562 6.37147 27.1416 6.17169 27.0556C5.96753 26.9677 5.74252 26.7566 5.56263 26.3155C5.38195 25.8725 5.26602 25.2383 5.26602 24.4V9.38666C5.26602 6.69084 5.59509 5.24007 6.36083 4.42157C7.11326 3.6173 8.44055 3.26666 10.9593 3.26666H21.0393C23.5584 3.26666 24.8852 3.61741 25.6358 4.42118C26.3997 5.23909 26.726 6.68929 26.7193 9.38518V9.38666V24.3867C26.7193 25.2254 26.6041 25.8598 26.4242 26.3031C26.2451 26.7444 26.0211 26.9549 25.8182 27.0425C25.6198 27.1281 25.3328 27.1431 24.9244 26.967C24.5105 26.7884 24.0102 26.4271 23.4512 25.8305C22.7918 25.1231 21.9328 24.7739 21.0701 24.8209C20.2074 24.8679 19.3916 25.3082 18.8127 26.08L18.8123 26.0806L17.4676 27.8779C17.4673 27.8783 17.467 27.8787 17.4667 27.8791C17.0231 28.4644 16.4844 28.71 15.9927 28.71C15.501 28.71 14.9623 28.4644 14.5187 27.8791C14.5184 27.8787 14.5181 27.8783 14.5177 27.8779L13.1733 26.0808C13.1732 26.0807 13.1732 26.0806 13.1731 26.0806C12.0033 24.5156 9.90283 24.3999 8.55577 25.8217L8.5484 25.8291ZM8.43935 14.6667C8.43935 15.7314 9.30798 16.6 10.3727 16.6C11.4374 16.6 12.306 15.7314 12.306 14.6667C12.306 13.602 11.4374 12.7333 10.3727 12.7333C9.30798 12.7333 8.43935 13.602 8.43935 14.6667ZM8.43935 9.33333C8.43935 10.398 9.30798 11.2667 10.3727 11.2667C11.4374 11.2667 12.306 10.398 12.306 9.33333C12.306 8.26863 11.4374 7.4 10.3727 7.4C9.30798 7.4 8.43935 8.26863 8.43935 9.33333ZM14.306 16.2667H21.6393C22.5174 16.2667 23.2393 15.5447 23.2393 14.6667C23.2393 13.7886 22.5174 13.0667 21.6393 13.0667H14.306C13.428 13.0667 12.706 13.7886 12.706 14.6667C12.706 15.5447 13.428 16.2667 14.306 16.2667ZM14.306 10.9333H21.6393C22.5174 10.9333 23.2393 10.2114 23.2393 9.33333C23.2393 8.45529 22.5174 7.73333 21.6393 7.73333H14.306C13.428 7.73333 12.706 8.45529 12.706 9.33333C12.706 10.2114 13.428 10.9333 14.306 10.9333Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  ></path></svg
                >How to play
              </div>
            </div>
            <div data-v-69f351dd="">Time remaining</div>
          </div>
          <div data-v-69f351dd="" className="FDTL__C-l2">
            <div data-v-69f351dd="">{lastResult.period + 1}</div>
            <div data-v-69f351dd="" className="FDTL__C-time">
              <div data-v-69f351dd="">0</div>
              <div data-v-69f351dd="">{time.minute}</div>
              <div data-v-69f351dd="" notime="">:</div>
              <div data-v-69f351dd="">{time.seconds1}</div>
              <div data-v-69f351dd="">{time.seconds2}</div>
            </div>
          </div>
          <div data-v-69f351dd="" className="FDTL__C-l3">
            <div data-v-69f351dd="" className="box">
              <div data-v-69f351dd="" className="slot-column">
                <div data-v-69f351dd="" className="slot-transform transform0">
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    3
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    4
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    5
                  </div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    3
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    4
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    5
                  </div>
                </div>
              </div>
              <div data-v-69f351dd="" className="slot-column">
                <div data-v-69f351dd="" className="slot-transform transform1">
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    0
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    2
                  </div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    0
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    2
                  </div>
                </div>
              </div>
              <div data-v-69f351dd="" className="slot-column">
                <div data-v-69f351dd="" className="slot-transform transform2">
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    2
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    3
                  </div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    2
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    3
                  </div>
                </div>
              </div>
              <div data-v-69f351dd="" className="slot-column">
                <div data-v-69f351dd="" className="slot-transform transform3">
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    -2
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    -1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    0
                  </div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    -2
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    -1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    0
                  </div>
                </div>
              </div>
              <div data-v-69f351dd="" className="slot-column">
                <div data-v-69f351dd="" className="slot-transform transform4">
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    0
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    2
                  </div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div className="slot-num" data-v-69f351dd="">0</div>
                  <div className="slot-num" data-v-69f351dd="">1</div>
                  <div className="slot-num" data-v-69f351dd="">2</div>
                  <div className="slot-num" data-v-69f351dd="">3</div>
                  <div className="slot-num" data-v-69f351dd="">4</div>
                  <div className="slot-num" data-v-69f351dd="">5</div>
                  <div className="slot-num" data-v-69f351dd="">6</div>
                  <div className="slot-num" data-v-69f351dd="">7</div>
                  <div className="slot-num" data-v-69f351dd="">8</div>
                  <div className="slot-num" data-v-69f351dd="">9</div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    0
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    1
                  </div>
                  <div
                    data-v-69f351dd=""
                    className="slot-num"
                    num="[object Object]"
                  >
                    2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          data-v-28e57f6a=""
          data-v-4f526022=""
          className="FDB__C"
          voicetype="1"
          typeid="5"
        >
          <div data-v-28e57f6a="" className="FDB__C-mark" style={{ display: showMark ? '' : 'none' }}>
            <div data-v-28e57f6a="">{time.seconds1}</div>
            <div data-v-28e57f6a="">{time.seconds2}</div>
          </div>
          <div data-v-baf77bdf="" className="FDB__C-nav">
            <div data-v-baf77bdf="" className={join==='a'?'active':''} onClick={()=>{setJoin('a')}}>A</div>
            <div data-v-baf77bdf="" className={join==='b'?'active':''} onClick={()=>{setJoin('b')}}>B</div>
            <div data-v-baf77bdf="" className={join==='c'?'active':''} onClick={()=>{setJoin('c')}}>C</div>
            <div data-v-baf77bdf="" className={join==='d'?'active':''} onClick={()=>{setJoin('d')}}>D</div>
            <div data-v-baf77bdf="" className={join==='e'?'active':''} onClick={()=>{setJoin('e')}}>E</div>
            <div data-v-baf77bdf="" className={join==='total'?'active':''} onClick={()=>{setJoin('total')}}>SUM</div>
          </div>
          <div data-v-baf77bdf="" className="FDB__C-H">
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('b') ? 'active' : ''}
    onClick={() => handleSelection('b', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Big</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('s') ? 'active' : ''}
    onClick={() => handleSelection('s', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Small</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('c') ? 'active' : ''}
    onClick={() => handleSelection('c', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Odd</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('l') ? 'active' : ''}
    onClick={() => handleSelection('l', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Even</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
</div>

      {/* Number options from 0 to 9 */}
      <div data-v-baf77bdf="" className="FDB__C-Num" >
  {[...Array(10).keys()].map((num) => (
    <div
      data-v-baf77bdf=""
      key={num}
      className={listJoin.includes(num.toString()) ? 'active' : ''}
      onClick={() => handleSelection(num.toString(), 'FDB__C-Num')}
      style={{ display: join === 'total' ? 'none' : '' }}
    >
      <div data-v-baf77bdf="" className="round">{num}</div>
      <div data-v-baf77bdf="" className="rate">9</div>
    </div>
  ))}
</div>


          <div
            className="van-overlay"
            data-v-7181abf7=""
            style={{zIndex: '2004', display: showBetPopup===true?'':'none'}}
          >
          </div>
          <div
            role="dialog"
            tabIndex="0"
            className="van-popup van-popup--round van-popup--bottom"
            data-v-7181abf7=""
            style={{
              zIndex: '2004',
              boxShadow: 'rgba(37, 37, 60, 0.26) 0px -18px 40px',
             display: showBetPopup===true?'':'none'
            }}
          >
            <div data-v-7181abf7="" className="Betting__Popup-body">
            <div data-v-baf77bdf="" className="FDB__C-nav">
            <div data-v-baf77bdf="" className={join==='a'?'active':''} onClick={()=>{setJoin('a')}}>A</div>
            <div data-v-baf77bdf="" className={join==='b'?'active':''} onClick={()=>{setJoin('b')}}>B</div>
            <div data-v-baf77bdf="" className={join==='c'?'active':''} onClick={()=>{setJoin('c')}}>C</div>
            <div data-v-baf77bdf="" className={join==='d'?'active':''} onClick={()=>{setJoin('d')}}>D</div>
            <div data-v-baf77bdf="" className={join==='e'?'active':''} onClick={()=>{setJoin('e')}}>E</div>
            <div data-v-baf77bdf="" className={join==='total'?'active':''} onClick={()=>{setJoin('total')}}>SUM</div>
          </div>
              <div data-v-baf77bdf="" className="FDB__C-H">
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('b') ? 'active' : ''}
    onClick={() => handleSelection('b', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Big</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('s') ? 'active' : ''}
    onClick={() => handleSelection('s', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Small</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('c') ? 'active' : ''}
    onClick={() => handleSelection('c', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Odd</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
  <div
    data-v-baf77bdf=""
    className={listJoin.includes('l') ? 'active' : ''}
    onClick={() => handleSelection('l', 'FDB__C-H')}
  >
    <span data-v-baf77bdf="">Even</span>
    <span data-v-baf77bdf="">1.98</span>
  </div>
</div>

      {/* Number options from 0 to 9 */}
      <div data-v-baf77bdf="" className="FDB__C-Num" >
  {[...Array(10).keys()].map((num) => (
    <div
      data-v-baf77bdf=""
      key={num}
      className={listJoin.includes(num.toString()) ? 'active' : ''}
      onClick={() => handleSelection(num.toString(), 'FDB__C-Num')}
      style={{ display: join === 'total' ? 'none' : '' }}
    >
      <div data-v-baf77bdf="" className="round">{num}</div>
      <div data-v-baf77bdf="" className="rate">9</div>
    </div>
  ))}
</div>
              <div data-v-7f36fe93="" className="Betting__Popup-body-line">
                Balance
                <div data-v-7f36fe93="" className="Betting__Popup-body-line-list">
                  <div data-v-7f36fe93=""  className={`Betting__Popup-body-line-item ${balance === 1 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectBalance(1)}>1</div>
                  <div data-v-7f36fe93=""  className={`Betting__Popup-body-line-item ${balance === 10 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectBalance(10)}>10</div>
 <div data-v-7f36fe93=""  className={`Betting__Popup-body-line-item ${balance === 100 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectBalance(100)}>100</div>
 <div data-v-7f36fe93=""  className={`Betting__Popup-body-line-item ${balance === 1000 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectBalance(1000)}>1000</div>
                </div>
              </div>
              <div data-v-7f36fe93="" className="Betting__Popup-body-line">
                Quantity
                <div data-v-7f36fe93="" className="Betting__Popup-body-line-btnL">
                  <div data-v-7f36fe93="" className="Betting__Popup-btn bgcolor" onClick={() => setQuantity((prev) => prev > 0 ? prev - 1 : 0)}>-</div>
                  <div data-v-7f36fe93="" className="van-cell van-field Betting__Popup-input">
                    <div className="van-cell__value van-field__value">
                      <div className="van-field__body">
                        <input
                          type="tel"
                          inputMode="numeric"
                          id="van-field-1-input"
                          className="van-field__control"
                          data-v-7f36fe93=""
                          value={quantity}
                          onChange={handleQuantityChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div data-v-7f36fe93="" className="Betting__Popup-btn bgcolor" onClick={() => setQuantity((prev) => prev + 1)}>+</div>
                </div>
              </div>
              <div data-v-7f36fe93="" className="Betting__Popup-body-line">
                <div data-v-7f36fe93=""></div>
                <div data-v-7f36fe93="" className="Betting__Popup-body-line-list">
                <div
                    data-v-7f36fe93=""
                    className={`Betting__Popup-body-line-item ${quantity === '1' || quantity === 1 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectQuantity('1')}
                  >
                    X1
                  </div>
                  <div
                    data-v-7f36fe93=""
                    className={`Betting__Popup-body-line-item ${quantity === '5' || quantity === 5 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectQuantity('5')}
                  >
                    X5
                  </div>  
                  <div
                    data-v-7f36fe93=""
                    className={`Betting__Popup-body-line-item ${quantity === '10' || quantity === 10 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectQuantity('10')}
                  >
                    X10
                  </div>
                  <div
                    data-v-7f36fe93=""
                    className={`Betting__Popup-body-line-item ${quantity === '20' || quantity === 20 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectQuantity('20')}
                  >
                    X20
                  </div>
                  <div
                    data-v-7f36fe93=""
                    className={`Betting__Popup-body-line-item ${quantity === '50' || quantity === 50 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectQuantity('50')}
                  >
                    X50
                  </div>
                  <div
                    data-v-7f36fe93=""
                    className={`Betting__Popup-body-line-item ${quantity === '100' || quantity === 100 ? 'bgcolor' : ''}`}
                    onClick={() => handleSelectQuantity('100')}
                  >
                    X100
                  </div>
                </div>
              </div>

              <div data-v-7f36fe93="" className="Betting__Popup-body-line"><span data-v-7f36fe93="" className="Betting__Popup-agree active">I
        agree</span><span data-v-7f36fe93="" className="Betting__Popup-preSaleShow">《Pre-sale rules》</span></div>
              
              
            </div>
            <div data-v-7181abf7="" className="Betting__Popup-foot">
              <div data-v-7181abf7="" className="Betting__Popup-foot-c" onClick={() => {setShowBetPopup(false);  setListJoin([]); setJoin('a') }}>Cancel</div>
              <div data-v-7181abf7="" className="Betting__Popup-foot-s bgcolor" onClick={handleJoin}>
                Total amount₹{balance*quantity*listJoin.length}
              </div>
            </div>
          </div>
        </div>
        <div data-v-72f81e71="" data-v-4f526022="" className="RecordNav__C">
          <div data-v-72f81e71="" className={` ${activeSection === 'section1' ? 'active' : ''}`} onClick={() => showSection('section1')}>Game history</div>
          <div data-v-72f81e71=""  className={` ${activeSection === 'section2' ? 'active' : ''}`} onClick={() => showSection('section2')}>Chart</div>
          <div data-v-72f81e71=""  className={` ${activeSection === 'section3' ? 'active' : ''}`} onClick={() => showSection('section3')}>My history</div>
        </div>
        <div
          data-v-9215aba8=""
          data-v-4f526022=""
          className="GameRecord__C"
          emerdapi="e=>_(f.WinGoGetEmerdList,e).then(t=>t.data)"
          gopathname="AllLotteryGames-BettingRecord5D"  id="section2" style={{ display: activeSection === 'section1' ? 'block' : 'none' }}
        >
          <div data-v-9215aba8="" className="GameRecord__C-head">
            <div data-v-9215aba8="" className="van-row">
              <div data-v-9215aba8="" className="van-col van-col--8">Period</div>
              <div data-v-9215aba8="" className="van-col van-col--12">Result</div>
              <div data-v-9215aba8="" className="van-col van-col--4">Total</div>
            </div>
          </div>
          <div data-v-9215aba8="" className="GameRecord__C-body">

          <GameList gamelist={gamelist} />

            
          </div>
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
          data-v-9d93d892=""
          data-v-4f526022=""
          className="Trend__C"
          emerdapi="e=>_(f.WinGoGetEmerdList,e).then(t=>t.data)"
          gopathname="AllLotteryGames-BettingRecord5D" id="section2" style={{ display: activeSection === 'section2' ? 'block' : 'none' }}
        >
          <div data-v-9d93d892="" className="Trend__C-body1">
            <div data-v-9d93d892="" className="Trend__C-nav">
              <div data-v-9d93d892="" className="active">A</div>
              <div data-v-9d93d892="" className="">B</div>
              <div data-v-9d93d892="" className="">C</div>
              <div data-v-9d93d892="" className="">D</div>
              <div data-v-9d93d892="" className="">E</div>
            </div>
            <div data-v-9d93d892="" className="Trend__C-body1-line">
              Statistic (last 100 Periods)
            </div>
          </div>
          <div data-v-9d93d892="" className="Trend__C-head">
            <div data-v-9d93d892="" className="van-row">
              <div data-v-9d93d892="" className="van-col van-col--8">Period</div>
              <div data-v-9d93d892="" className="van-col van-col--16">Number</div>
            </div>
          </div>
         
         <ChartList gamelist={gamelist}/>

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
    style={{ zIndex:1000 }}
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
          data-v-36ddca8e=""
          data-v-4f526022=""
          className="MyGameRecord__C"
          emerdapi="e=>_(f.WinGoGetEmerdList,e).then(t=>t.data)"  id="section2" style={{ display: activeSection === 'section3' ? 'block' : 'none' }}
        >
          <div data-v-36ddca8e="" className="MyGameRecord__C-head">
            <div data-v-36ddca8e="" className="MyGameRecord__C-head-moreB">
              Detail
              <svg data-v-36ddca8e="" className="svg-icon icon-rightCircle">
                <use href="#icon-rightCircle"></use>
              </svg>
            </div>
          </div>
          <div data-v-36ddca8e="" className="MyGameRecord__C-body">
            <div
              data-v-8bb41fd5=""
              data-v-36ddca8e=""
              className="MyGameRecordList__C"
            >
              <MyGameRecordList myBets={myBets} />
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
        <div data-v-3e71d3da="" data-v-4f526022="" className="dialog inactive">
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
              <div data-v-4f526022=""></div>
            </div>
            <div data-v-3e71d3da="" className="dialog__container-footer">
              <button data-v-3e71d3da="">Confirm</button
              ><button data-v-3e71d3da="">Cancel</button>
            </div>
          </div>
          <div data-v-3e71d3da="" className="dialog__outside"></div>
        </div>


        <div className="van-overlay" data-v-7181abf7="" style={{zIndex: 2030, display:'none'}}>
        </div>
        <div
          role="dialog"
          tabIndex="0"
          className="van-popup van-popup--round van-popup--bottom"
          data-v-7181abf7=""
          style={{
            zIndex: '2030',
            boxShadow: 'rgba(37, 37, 60, 0.26) 0px -18px 40px',
            display:'none',
          }}
        >
          <div data-v-7181abf7="" className="Betting__Popup-body">
            <div data-v-baf77bdf="" className="FDB__C-nav">
              <div data-v-baf77bdf="" className="">A</div>
              <div data-v-baf77bdf="" className="active">B</div>
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
                        id="van-field-2-input"
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
        </div>

        <div className="van-overlay" data-v-7181abf7="" style={{zIndex: '2036',display:'none'}}>
        </div>

        <div
          role="dialog"
          tabIndex="0"
          className="van-popup van-popup--round van-popup--bottom"
          data-v-7181abf7=""
          style={{
            zIndex: '2036',
            display: 'none',
            boxShadow: 'rgba(37, 37, 60, 0.26) 0px -18px 40px'
          }}
        >
          <div data-v-7181abf7="" className="Betting__Popup-body" style={{display:'none'}}>
            <div data-v-baf77bdf="" className="FDB__C-nav">
              <div data-v-baf77bdf="" className="active">A</div>
              <div data-v-baf77bdf="" className="">B</div>
              <div data-v-baf77bdf="" className="">C</div>
              <div data-v-baf77bdf="" className="">D</div>
              <div data-v-baf77bdf="" className="">E</div>
              <div data-v-baf77bdf="" className="">SUM</div>
            </div>
            <div data-v-baf77bdf="" className="FDB__C-H">
              <div data-v-baf77bdf="" className="">
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
              <div data-v-baf77bdf="" txt="0" className="active">
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
                        id="van-field-3-input"
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
            <div data-v-7181abf7="" className="Betting__Popup-foot-s bgcolor" onClick={handleJoin}>
              Total amount₹1.00
            </div>
          </div>
        </div>

        <div
          data-v-e05c7c66=""
          data-v-4f526022=""
          className="WinningTip__C"
          style={{display: 'none'}}
        >
          <div data-v-e05c7c66="" className="WinningTip__C-body">
            <div data-v-e05c7c66="" className="WinningTip__C-body-l1">
              Congratulations
            </div>
            <div data-v-e05c7c66="" className="WinningTip__C-body-l2">
              Lottery results
              <div data-v-e05c7c66="" className="line1">
                <div data-v-e05c7c66="">
                  <div data-v-e05c7c66="" className="title sum">SUM</div>
                  <div data-v-e05c7c66="" className="num"></div>
                </div>
              </div>
            </div>
            <div data-v-e05c7c66="" className="WinningTip__C-body-l3">
              <div data-v-e05c7c66="" className="head">Bonus</div>
              <div data-v-e05c7c66="" className="bonus"></div>
              <div data-v-e05c7c66="" className="gameDetail">Period:</div>
            </div>
            <div data-v-e05c7c66="" className="WinningTip__C-body-l4">
              <div data-v-e05c7c66="" className="acitveBtn"></div>
              3 seconds auto close
            </div>
            <div data-v-e05c7c66="" className="closeBtn"></div>
            <i
              data-v-e05c7c66=""
              className="van-badge__wrapper van-icon van-icon-arrow arrowBtn"
              style={{color: 'rgb(255, 255, 255)', fontSize: '30px', display: 'none'}}
              ></i
            >
          </div>
        </div>
       
        <audio id="voice1">
          <source src="/assets/mp3/di1-0f3d86cb.mp3" type="audio/mpeg" /></audio
        ><audio id="voice2">
          <source src="/assets/mp3/di2-ad9aa8fb.mp3" type="audio/mpeg" />
        </audio>
      </div>
      <div
        className="customer"
        id="customerId"
        style={{
          '--f13b4d11-currentFontFamily': "'Roboto', 'Inter', 'sansSerif'",
          '--f6a705e1-currentFontFamily': 'bahnschrift'
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
    <div className="van-overlay" style={{zIndex: '2003', display: 'none'}}></div>
    <div
      role="dialog"
      tabIndex="0"
      className="van-popup van-popup--center van-toast van-toast--middle van-toast--loading"
      style={{zIndex: '2003', display: 'none'}}
    >
      <div
        className="van-loading van-loading--circular van-toast__loading"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="van-loading__spinner van-loading__spinner--circular"
          ><svg className="van-loading__circular" viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none"></circle></svg></span
        >
      </div>
    </div>



    </div>
  )
}