import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { io } from 'socket.io-client';
import Api from '../../../services/Api';
import MyGameRecordList from './components/MyGameRecordList';
import GameList from './components/GameList';
import ReactHowler from 'react-howler';
import ChartList from './components/ChartList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popup from '../../../components/Popup';
import { useToast } from '../../../components/ToastContext'; 

const SOCKET_URL = 'http://localhost:3000'; 



const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
});



const countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();

const getPopupClass = (item) => {
  switch (item) {
    case '0': return 0;
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
    case 'Red': return 10;
    case 'Violet': return 12;
    case 'Green': return 11;
    case 'Big': return 13;
    case 'Small': return 14;
    default: return 1; // Default class if nothing is selected
  }
};


export default function Wingo() {

  const { showToast } = useToast();


  const [showBetPopup, setShowBetPopup] = useState(false);

 

  const [userInfo, setUserInfo] = useState(null);
    const [activeSection, setActiveSection] = useState('section1');
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    const [gamelist, setGamelist] = useState([]);
    const [myBets,setMyBets] = useState(null);
    const [last5Periods, setLast5Periods] = useState([]);
    const [period, setPeriod] = useState(null);
    const [lastperiod, setLastPeriod] = useState(null);
    const [isplay, setIsPlay] =useState(null);
    const [time, setTime] = useState({
      seconds1: 0,
      seconds2: 0,
    });
    const [showMark, setShowMark] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(''); // To track the selected item
  const [balance, setBalance] = useState(1);  // State for balance
  const [quantity, setQuantity] = useState(1);  // State for quantity
  const [lastBet, setLastBet] = useState([]);  // State for quantity
 
    const [join, setJoin] = useState(null);
    const [totalGamePages, setTotalGamePages] = useState(null);
    const [totalBetsPages, setTotalBetsPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGamePage, setCurrentGamePage] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const handleIncreaseQuantity = () => {
      setQuantity((prevQuantity) => prevQuantity + 1); // Increment quantity
    };

    const handleDecreaseQuantity = () => {
      setQuantity((prevQuantity) => prevQuantity - 1); // Increment quantity
    };

  //   const [toasts, setToasts] = useState([]);

  // // Function to show a new toast (success or error)
  // const showToast = (text, type = 'success') => {
  //   console.log(text);
  //   const newToast = { id: Date.now(), text, type }; // Use a unique ID and message type
  //   setToasts((prevToasts) => [...prevToasts, newToast]); // Add the new toast to the list
  // };

  // // Function to remove a toast
  // const removeToast = (id) => {
  //   setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id)); // Remove the toast by id
  // };
  

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
    
    


  const handleOpenPopup = (item) => {
    setSelectedItem(item);
 
  if (item === 'Big') {
      setJoin('l');
    } else if (item === 'Small') {
      setJoin('n');
    } else if (item === 'Violet') {
      setJoin('t');
    } else if (item === 'Red') {
      setJoin('d');
    } else if (item === 'Green') {
      setJoin('x');
    } else if (!isNaN(item)) {
      setJoin(item);
    } 

    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedItem(''); // Reset the selected item when closing the popup
    setBalance(1);  // Reset balance
    setQuantity(1);  // Reset quantity
  };

  const setIsPlayCancel =()=>{
       setIsPlay(false);
  }

    const getClassName = (amount) => {
      return `n${amount}`; // Construct class name based on amount
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

    const checkPeriodAndStage = async (period) => {
      try {
        const response = await Api.post('/api/webapi/checkPeriodAndStage', { period });
        console.log("hi");

        console.log(response.data.status);
        if (response.data.status == true) {
          // Handle success case
          // console.log(response.data);
          return true;
        } else {
          // console.error('API response was not successful:', response.data.status);
          return false;
        }
      } catch (error) {
        console.error('An error occurred during the API request:', error);
        return false;
      }
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
          setShowMark(true);
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

        const response = await Api.post('/api/webapi/GetNoaverageEmerdList', {
          typeid: "1",
          pageno: pageno.toString(),
          pageto: "10",
          language: "vi",
        });
  
        const { gameslist } = response.data?response.data.data:[];
        console.log(response.data.page);
  
        // Update gamelist state
        setGamelist(gameslist);
        setTotalGamePages(response.data.page);
  
        // Compute last5Periods
        const last5 = gameslist.slice(0, 5).map(item => item.amount);
        setLast5Periods(last5);
        
      } catch (err) {
        console.error('An error occurred:', err);
        setError('An error occurred. Please try again.');
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await Api.get('/api/webapi/GetUserInfo');
        const data =  response.data;

        console.log(data);

        setUserInfo(data.data); // Assuming data.data contains the user's information


      } catch (err) {
        console.error('An error occurred:', err);
        setError('An error occurred. Please try again.');
      } 
    };

    const fetchWingo = async () => {
      try {
        const response = await Api.get('/api/webapi/Wingo1');
        const data = response.data;
  
        console.log('period:', data.data.data[0]);
  
        
        setPeriod(data.data.data[0]?data.data.data[0].period : []); // Update state with the fetched data
  
      } catch (err) {
        console.error('An error occurred:', err);
        setError('An error occurred. Please try again.');
      }
    };

    const fetchMyBets = async (pageNumber = 1) => {
      try {
        const pageno = (pageNumber - 1) * 10; // Calculate pageno based on the page number
        const response = await Api.post('/api/webapi/GetMyEmerdList', {
          typeid: "1",
          pageno: pageno.toString(),
          pageto: "10",
          language: "vi",
        });
    
        const { gameslist } = response.data.data;

        console.log(response.data.data);
        
    
        // Set total pages based on the total number of records and page size
        const totalRecords = response.data.page; // Assuming the API returns total records
    
        setTotalBetsPages(totalRecords);
        setMyBets(gameslist);
        console.log(gameslist[0]);
        setLastBet(gameslist[0]);
      } catch (err) {
        console.error('An error occurred:', err);
        setError('An error occurred. Please try again.');
      }
    };
    
    
    // Fetch the first page when the component mounts
    useEffect(() => {
      fetchWingo();      
      fetchMyBets(1);
      fetchGamelist(1);
    }, []);
    

    


    useEffect(() => {
      
      fetchMyBets();
      fetchGamelist();
      fetchUserInfo();
      fetchWingo();


      const handleSocketData = async (msg) => {
        console.log("Received message from server:", msg);
        if (msg.data[0].game !== 'wingo') return;
  
        const data1 = msg.data[0];
        const data2 = [msg.data[1]];
  
        setPeriod(data1.period);
        setLastPeriod(data2.period);
        // Handle other state updates here
  
        const isCheckSuccessful = await checkPeriodAndStage(data2.period);
        if (isCheckSuccessful) {
          fetchMyBets();
          setIsVisible(true);

        }

        fetchUserInfo();

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

      socket.on('data-server', handleSocketData);


        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setError(error);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // Clean up the socket connection when the component unmounts
        return () => {
          socket.off('data-server', handleSocketData);

            socket.disconnect();
        };
    }, []);
  
    const handleJoin = async () => {
      const totalAmount = quantity * balance;
  
      // Validate inputs
      if (!join || !quantity || !balance || userInfo.money_user < totalAmount) {
        showToast('Invalid input or insufficient balance', 'succes');

        toast.error('Invalid input or insufficient balance',{ icon: false, // No icon
          progressBar: false, // No progress bar
          style: {
            backgroundColor: 'black', // Black background
            color: 'white', // White text
          }});
       
        

        return;
      }
  
      try {
        // Make the AJAX request
        const response = await Api.post('/api/webapi/action/join', {
          typeid: '1',
          join: join,
          x: quantity,
          money: balance,
        });
  
        // setShowBetPopup(true);
        showToast('Bet placed successfully!', 'succes');
        // toast.success('Bet placed successfully!');

        

        const { data } = response;


  
        handleClosePopup();
        fetchMyBets();
        fetchUserInfo();
        setIsPlayCancel();
  
  
      
        // Emit the event through socket
        socket.emit('data-server_2', {
          money: quantity * balance,
          join,
          time: Date.now(),
          change: data.change,
        });
  
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

  
    // if (loading) {
    //   return <Loader/>
    // }
  
   

    const showSection = (sectionId) => {
      fetchGamelist(1);

        setActiveSection(sectionId);

      };


    return (

      
<div className="" style={{fontSize: '12px'}}>
<ToastContainer />
{showBetPopup && <Popup text="Bet Successful" />}



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
    style={{"--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sansSerif'", display: 'none'}}>
    <div data-v-647954c7="" className="loading-wrapper">
      
      <div data-v-647954c7="" className="loading-animat">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="200"
          height="200"
          preserveAspectRatio="xMidYMid meet"
          style={{width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)', contentVisibility: 'visible',}}
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
    data-v-5d71c3fd=""
    className="WinGo__C"
    style={{"--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sans-serif'"}}>
    <div data-v-12a80a3e="" data-v-5d71c3fd="" className="navbar main">
      <div data-v-12a80a3e="" className="navbar-fixed">
        <div data-v-12a80a3e="" className="navbar__content">
          <div data-v-12a80a3e="" className="navbar__content-left">
            <i
              data-v-12a80a3e=""
              className="van-badge__wrapper van-icon van-icon-arrow-left"  onClick={()=> navigate('/index')}>
                </i>
          </div>
          <div data-v-12a80a3e="" className="navbar__content-center">
            <div
              data-v-12a80a3e=""
              className="headLogo"


              style={{
                backgroundImage: `url('/assets/png/BDGPRO2.png')`
              }}
            ></div>
            <div data-v-12a80a3e="" className="navbar__content-title"></div>
          </div>
          <div data-v-12a80a3e="" className="navbar__content-right">
            <div data-v-5d71c3fd="" className="WinGo__C-head-more">
              <div data-v-5d71c3fd=""></div>
              <div data-v-5d71c3fd="" className=""></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div data-v-7dd1adab="" data-v-5d71c3fd="" className="Wallet__C">
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
    <div data-v-5d71c3fd="" className="noticeBar__container lottery-notice">
      <svg className="svg-icon icon-noticeBarSpeaker">
        <use href="#icon-noticeBarSpeaker"></use>
      </svg>
      <div className="noticeBar__container-body">
        <div className="noticeBar__container-body-text">
          Be cautious of counterfeit websites mimicking our Big Daddy Pro official
          site, do not transfer money to anyone, including agents, and keep
          payment receipts and UTR numbers confidential.
        </div>
      </div>
      <button className="hotIcon">Detail</button>
    </div>
    <div data-v-17d56002="" data-v-5d71c3fd="" className="GameList__C">
    <div data-v-17d56002="" className="GameList__C-item" onClick={() => {
    navigate('/wingo');
  }}>
        <div data-v-17d56002="">Win Go<br />30Sec</div>
      </div>
      <div data-v-17d56002="" className="GameList__C-item  active" onClick={() => {
    navigate('/wingo1');
  }}>
        <div data-v-17d56002="">Win Go<br />1Min</div>
      </div>
      <div data-v-17d56002="" className="GameList__C-item" onClick={() => {
    navigate('/wingo3');
  }}>
        <div data-v-17d56002="">Win Go<br />3Min</div>
      </div>
      <div data-v-17d56002="" className="GameList__C-item" onClick={() => {
    navigate('/wingo5');
  }}>
        <div data-v-17d56002="">Win Go<br />5Min</div>
      </div>
     
    </div>
    <div data-v-3e4c6499="" className="TimeLeft__C">
      {/* popup start */}
      <div className="van-overlay" data-v-0bba67ea="" style={{ display: isplay ? 'block' :'none', zIndex: '2008' }}>
        </div>
        <div
          role="dialog"
          tabindex="0"
          className="van-popup van-popup--round van-popup--center"
          data-v-0bba67ea=""
          style={{ display: isplay ? 'block' : 'none', zIndex: '2008' }}
        >
          <div data-v-0bba67ea="" className="TimeLeft__C-PreSale">
            <div data-v-0bba67ea="" className="TimeLeft__C-PreSale-head">
              How to play
            </div>
            <div data-v-0bba67ea="" className="TimeLeft__C-PreSale-body">
              <div data-v-0bba67ea="">
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >1 minutes 1 issue, 45 seconds to order, 15 seconds waiting
                    for the draw. It opens all day. The total number of trade is
                    1440 issues.</font
                  ><br />
                </p>
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >If you spend 100 to trade, after deducting 2 service fee,
                    your contract amount is 98:</font
                  >
                </p>
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >1.</font
                  ><span
                    style={{
                      fontFamily: "'Arial', 'Microsoft YaHei', 'Malgun Gothic', 'Meiryo', 'sans-serif',"}}                  
                    >Select</span
                  ><font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >green: if the result shows 1,3,7,9 you will get (98*2)
                    196;If the result shows 5, you will get (98*1.5) 147</font
                  >
                </p>
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >2.</font
                  ><span
                    style={{
                      fontFamily: "'Arial', 'Microsoft YaHei', 'Malgun Gothic', 'Meiryo', 'sans-serif',"}}
                    >Select</span
                  ><font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >red: if the result shows 2,4,6,8 you will get (98*2) 196;If
                    the result shows 0, you will get (98*1.5) 147</font
                  >
                </p>
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >3.</font
                  ><span
                    style={{
                      fontFamily: "'Arial', 'Microsoft YaHei', 'Malgun Gothic', 'Meiryo', 'sans-serif',"}}
                    >Select</span
                  ><font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >violet:if the result shows 0 or 5, you will get (98*4.5)
                    441</font
                  >
                </p>
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >4. Select number:if the result is the same as the number
                    you selected, you will get (98*9) 882</font
                  >
                </p>
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >5. Select big: if the result shows 5,6,7,8,9 you will get
                    (98 * 2) 196</font
                  >
                </p>
                <p >
                  <font
                    face="Arial, Microsoft YaHei, \\5FAE软雅黑, \\5B8B体, Malgun Gothic, Meiryo, sans-serif"
                    >6. Select small: if the result shows 0,1,2,3,4 you will get
                    (98 * 2) 196</font
                  >
                </p>
              </div>
            </div>
            <div data-v-0bba67ea="" className="TimeLeft__C-PreSale-foot">
              <div data-v-0bba67ea="" className="TimeLeft__C-PreSale-foot-btn" onClick={setIsPlayCancel}>
              Close
              </div>
            </div>
          </div>
        </div>
      {/* popup end */}
      <div data-v-3e4c6499="" className="TimeLeft__C-rule" onClick={setIsPlay}>
        <svg
          data-v-3e4c6499=""
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path
            data-v-3e4c6499=""
            d="M23.67 3H12.33C6.66 3 5.25 4.515 5.25 10.56V27.45C5.25 31.44 7.44 32.385 10.095 29.535L10.11 29.52C11.34 28.215 13.215 28.32 14.28 29.745L15.795 31.77C17.01 33.375 18.975 33.375 20.19 31.77L21.705 29.745C22.785 28.305 24.66 28.2 25.89 29.52C28.56 32.37 30.735 31.425 30.735 27.435V10.56C30.75 4.515 29.34 3 23.67 3ZM11.67 18C10.845 18 10.17 17.325 10.17 16.5C10.17 15.675 10.845 15 11.67 15C12.495 15 13.17 15.675 13.17 16.5C13.17 17.325 12.495 18 11.67 18ZM11.67 12C10.845 12 10.17 11.325 10.17 10.5C10.17 9.675 10.845 9 11.67 9C12.495 9 13.17 9.675 13.17 10.5C13.17 11.325 12.495 12 11.67 12ZM24.345 17.625H16.095C15.48 17.625 14.97 17.115 14.97 16.5C14.97 15.885 15.48 15.375 16.095 15.375H24.345C24.96 15.375 25.47 15.885 25.47 16.5C25.47 17.115 24.96 17.625 24.345 17.625ZM24.345 11.625H16.095C15.48 11.625 14.97 11.115 14.97 10.5C14.97 9.885 15.48 9.375 16.095 9.375H24.345C24.96 9.375 25.47 9.885 25.47 10.5C25.47 11.115 24.96 11.625 24.345 11.625Z"
            fill="currentColor"
          ></path></svg
        >How to play
      </div>
      <div data-v-3e4c6499="" className="TimeLeft__C-name">Win Go 1 min</div>
      <div data-v-3e4c6499="" className="TimeLeft__C-num">
      {last5Periods.map((amount, index) => (
    
            <div data-v-3e4c6499="" key={index} className={getClassName(amount)}>
            </div>
          
        ))}
      </div>
      <div data-v-3e4c6499="" className="TimeLeft__C-id">{period}</div>
      <div data-v-3e4c6499="" className="TimeLeft__C-text">Time remaining</div>
      <div data-v-3e4c6499="" className="TimeLeft__C-time">
        <div data-v-3e4c6499="">0</div>
        <div data-v-3e4c6499="">0</div>
        <div data-v-3e4c6499="">:</div>
        <div data-v-3e4c6499="">{time.seconds1}</div>
        <div data-v-3e4c6499="">{time.seconds2}</div>
      </div>
    </div>
    <div
      data-v-4aca9bd1=""
      data-v-5d71c3fd=""
      className="Betting__C"
      voicetype="1"
      typeid="30"
    >
      <div data-v-4aca9bd1="" className="Betting__C-mark" style={{ display: showMark ? '' : 'none' }}
      >
        <div data-v-4aca9bd1="">{time.seconds1}</div>
        <div data-v-4aca9bd1="">{time.seconds2}</div>
      </div>
      <div data-v-4aca9bd1="" className="Betting__C-head">
        <div data-v-4aca9bd1="" className="Betting__C-head-g" onClick={() => handleOpenPopup('Green')}>Green</div>
        <div data-v-4aca9bd1="" className="Betting__C-head-p" onClick={() => handleOpenPopup('Violet')}>Violet</div>
        <div data-v-4aca9bd1="" className="Betting__C-head-r" onClick={() => handleOpenPopup('Red')}>Red</div>
      </div>
      <div data-v-4aca9bd1="" className="Betting__C-numC">
        <div data-v-4aca9bd1="" className="Betting__C-numC-item0" onClick={() => handleOpenPopup('0')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item1" onClick={() => handleOpenPopup('1')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item2" onClick={() => handleOpenPopup('2')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item3" onClick={() => handleOpenPopup('3')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item4" onClick={() => handleOpenPopup('4')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item5" onClick={() => handleOpenPopup('5')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item6" onClick={() => handleOpenPopup('6')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item7" onClick={() => handleOpenPopup('7')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item8" onClick={() => handleOpenPopup('8')}></div>
        <div data-v-4aca9bd1="" className="Betting__C-numC-item9" onClick={() => handleOpenPopup('9')}></div>
      </div>
      <div data-v-4aca9bd1="" className="Betting__C-multiple">
        <div data-v-4aca9bd1="" className="Betting__C-multiple-l">Random</div>
        <div data-v-4aca9bd1="" className={`Betting__C-multiple-r ${quantity === '1' || quantity === 1 ? 'active' : ''}`}
                    onClick={() => handleSelectQuantity('1')}>
          X1
        </div>
        <div data-v-4aca9bd1="" className={`Betting__C-multiple-r ${quantity === '5' || quantity === 5 ? 'active' : ''}`}
                    onClick={() => handleSelectQuantity('5')}>X5</div>
        <div data-v-4aca9bd1="" className={`Betting__C-multiple-r ${quantity === '10' || quantity === 10 ? 'active' : ''}`}
                    onClick={() => handleSelectQuantity('10')}>X10</div>
        <div data-v-4aca9bd1="" className={`Betting__C-multiple-r ${quantity === '20' || quantity === 20 ? 'active' : ''}`}
                    onClick={() => handleSelectQuantity('20')}>X20</div>
        <div data-v-4aca9bd1="" className={`Betting__C-multiple-r ${quantity === '50' || quantity === 50 ? 'active' : ''}`}
                    onClick={() => handleSelectQuantity('50')}>X50</div>
        <div data-v-4aca9bd1="" className={`Betting__C-multiple-r ${quantity === '100' || quantity === 100 ? 'active' : ''}`}
                    onClick={() => handleSelectQuantity('100')}>X100</div>
           
      </div>
      <div data-v-4aca9bd1="" className="Betting__C-foot">
        <div data-v-4aca9bd1="" className="Betting__C-foot-b" onClick={() => handleOpenPopup('Big')}>Big</div>
        <div data-v-4aca9bd1="" className="Betting__C-foot-s" onClick={() => handleOpenPopup('Small')}>Small</div>
      </div>
    </div>
    <div data-v-72f81e71="" data-v-5d71c3fd="" className="RecordNav__C">
      <div data-v-72f81e71="" className={` ${activeSection === 'section1' ? 'active' : ''}`} onClick={() => showSection('section1')}>Game history</div>
      <div data-v-72f81e71="" className={` ${activeSection === 'section2' ? 'active' : ''}`} onClick={() => showSection('section2')}>Chart</div>
      <div data-v-72f81e71="" className={` ${activeSection === 'section3' ? 'active' : ''}`} onClick={() => showSection('section3')}>My history</div>
    </div>
    <div data-v-4b21e13b="" data-v-5d71c3fd="" className="MyGameRecord__C game-record"   listapi="e=>_(f.WinGoGetNoaverageEmerdList,e).then(t=>t.data)" emerdapi="e=>_(f.WinGoGetEmerdList,e).then(t=>t.data)" id="section3" style={{ display: activeSection === 'section3' ? 'block' : 'none' }}>
      <div data-v-4b21e13b="" className="MyGameRecord__C-head">
        <div data-v-4b21e13b="" className="MyGameRecord__C-head-moreB">Detail <svg data-v-4b21e13b=""
            className="svg-icon icon-rightCircle">
            <use href="#icon-rightCircle"></use>
          </svg></div>
      </div>
      <div data-v-4b21e13b="" className="MyGameRecord__C-body">
        <div data-v-2faec5cb="" data-v-4b21e13b="" className="MyGameRecordList__C">
         
   <MyGameRecordList myBets={myBets}/>

          
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
    <div data-v-d485a39d="" data-v-5d71c3fd="" className="Trend__C game-record" apifun="e=>_(f.WinGoGetMyEmerdList,e).then(t=>t.data)" gopathname="AllLotteryGames-BettingRecordWin" id="section2" style={{ display: activeSection === 'section2' ? 'block' : 'none' }}>
      <div data-v-d485a39d="" className="Trend__C-head">
        <div data-v-d485a39d="" className="van-row">
          <div data-v-d485a39d="" className="van-col van-col--8">Period</div>
          <div data-v-d485a39d="" className="van-col van-col--16">Number</div>
        </div>
      </div>
      <div data-v-d485a39d="" className="Trend__C-body1">
        <div data-v-d485a39d="" className="Trend__C-body1-line">Statistic (last 100 Periods)</div>
        <div data-v-d485a39d="" className="Trend__C-body1-line lottery">
          <div data-v-d485a39d="">Winning number</div>
          <div data-v-d485a39d="" className="Trend__C-body1-line-num">
            <div data-v-d485a39d="">0</div>
            <div data-v-d485a39d="">1</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">3</div>
            <div data-v-d485a39d="">4</div>
            <div data-v-d485a39d="">5</div>
            <div data-v-d485a39d="">6</div>
            <div data-v-d485a39d="">7</div>
            <div data-v-d485a39d="">8</div>
            <div data-v-d485a39d="">9</div>
          </div>
        </div>
        <div data-v-d485a39d="" className="Trend__C-body1-line">
          <div data-v-d485a39d="">Missing</div>
          <div data-v-d485a39d="" className="Trend__C-body1-line-num">
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">23</div>
            <div data-v-d485a39d="">5</div>
            <div data-v-d485a39d="">9</div>
            <div data-v-d485a39d="">25</div>
            <div data-v-d485a39d="">7</div>
            <div data-v-d485a39d="">1</div>
            <div data-v-d485a39d="">4</div>
            <div data-v-d485a39d="">17</div>
            <div data-v-d485a39d="">0</div>
          </div>
        </div>
        <div data-v-d485a39d="" className="Trend__C-body1-line">
          <div data-v-d485a39d="">Avg missing</div>
          <div data-v-d485a39d="" className="Trend__C-body1-line-num">
            <div data-v-d485a39d="">7</div>
            <div data-v-d485a39d="">13</div>
            <div data-v-d485a39d="">10</div>
            <div data-v-d485a39d="">7</div>
            <div data-v-d485a39d="">15</div>
            <div data-v-d485a39d="">8</div>
            <div data-v-d485a39d="">11</div>
            <div data-v-d485a39d="">6</div>
            <div data-v-d485a39d="">11</div>
            <div data-v-d485a39d="">9</div>
          </div>
        </div>
        <div data-v-d485a39d="" className="Trend__C-body1-line">
          <div data-v-d485a39d="">Frequency</div>
          <div data-v-d485a39d="" className="Trend__C-body1-line-num">
            <div data-v-d485a39d="">12</div>
            <div data-v-d485a39d="">9</div>
            <div data-v-d485a39d="">9</div>
            <div data-v-d485a39d="">14</div>
            <div data-v-d485a39d="">6</div>
            <div data-v-d485a39d="">12</div>
            <div data-v-d485a39d="">7</div>
            <div data-v-d485a39d="">13</div>
            <div data-v-d485a39d="">8</div>
            <div data-v-d485a39d="">10</div>
          </div>
        </div>
        <div data-v-d485a39d="" className="Trend__C-body1-line">
          <div data-v-d485a39d="">Max consecutive</div>
          <div data-v-d485a39d="" className="Trend__C-body1-line-num">
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">1</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">2</div>
            <div data-v-d485a39d="">1</div>
          </div>
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
    style={{ zIndex:10 }}
  >
    <i 
      data-v-4b21e13b="" 
      className="van-badge__wrapper van-icon van-icon-arrow MyGameRecord__C-icon" 
      style={{ fontSize: '20px' }}
    ></i>
  </div>
</div>
    </div>
    <div data-v-481307ec="" data-v-5d71c3fd="" className="GameRecord__C game-record" apifun="e=>_(f.WinGoGetMyEmerdList,e).then(t=>t.data)" listapi="e=>_(f.WinGoGetNoaverageEmerdList,e).then(t=>t.data)" emerdapi="e=>_(f.WinGoGetEmerdList,e).then(t=>t.data)"  gopathname="AllLotteryGames-BettingRecordWin" id="section1" style={{ display: activeSection === 'section1' ? 'block' : 'none' }}>
      <div data-v-481307ec="" className="GameRecord__C-head">
        <div data-v-481307ec="" className="van-row">
          <div data-v-481307ec="" className="van-col van-col--8">Period</div>
          <div data-v-481307ec="" className="van-col van-col--5">Number</div>
          <div data-v-481307ec="" className="van-col van-col--5">Big Small</div>
          <div data-v-481307ec="" className="van-col van-col--6">Color</div>
        </div>
      </div>
      <div data-v-481307ec="" className="GameRecord__C-body">
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
    <div data-v-3e71d3da="" data-v-5d71c3fd="" className="dialog inactive">
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
          <div data-v-5d71c3fd=""></div>
        </div>
        <div data-v-3e71d3da="" className="dialog__container-footer">
          <button data-v-3e71d3da="">Confirm</button
          ><button data-v-3e71d3da="">Cancel</button>
        </div>
        
      </div>
      <div data-v-3e71d3da="" className="dialog__outside"></div>
    </div>
    <div
      data-v-e44179e3=""
      data-v-5d71c3fd=""
      className="WinningTip__C"
      style={{display: 'none'}}
    >
      <div data-v-e44179e3="" className="WinningTip__C-body">
        <div data-v-e44179e3="" className="WinningTip__C-body-l1">
          Congratulations
        </div>
        <div data-v-e44179e3="" className="WinningTip__C-body-l2 typeundefined">
          Lottery results
          <div data-v-e44179e3=""></div>
          <div data-v-e44179e3="" className="WinningNum"></div>
          <div data-v-e44179e3="">Small</div>
        </div>
        <div data-v-e44179e3="" className="WinningTip__C-body-l3">
          <div data-v-e44179e3="" className="head">Bonus</div>
          <div data-v-e44179e3="" className="bonus"></div>
          <div data-v-e44179e3="" className="gameDetail">Period:</div>
        </div>
        <div data-v-e44179e3="" className="WinningTip__C-body-l4">
          <div data-v-e44179e3="" className="acitveBtn"></div>
          3 seconds auto close
        </div>
        <div data-v-e44179e3="" className="closeBtn"></div>
        <i
          data-v-e44179e3=""
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
    style={{"--f13b4d11-currentFontFamily": "'Roboto', 'Inter', 'sans-serif'","--f6a705e1-currentFontFamily": 'bahnschrift'}}
  >
    {/* <img
      className=""
      data-origin="/assets/png/icon_sevice-9f0c8455.png"
      src="/assets/png/icon_sevice-9f0c8455.png"
    /> */}
  </div>
  
</div>

<div data-v-app=""></div>
{isPopupVisible && (
<div className="van-overlay" style={{zIndex: '2005'}}></div>
)
}
{isPopupVisible && (
        <div
          role="dialog"
          tabIndex="0"
          className={`van-popup van-popup--round van-popup--bottom Betting__Popup-${getPopupClass(selectedItem)}`}
          data-v-7f36fe93=""
          style={{ zIndex: 2009 }}
        >
          <div data-v-7f36fe93="" className="Betting__Popup-1">
            <div data-v-7f36fe93="" className="Betting__Popup-head">
              <div data-v-7f36fe93="" className="Betting__Popup-head-title">Win Go 1Min</div>
              <div data-v-7f36fe93="" className="Betting__Popup-head-selectName">
                <span data-v-7f36fe93="">Select</span>
                <span data-v-7f36fe93="">{selectedItem}</span>
              </div>
            </div>
            <div data-v-7f36fe93="" className="Betting__Popup-body">
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
            <div data-v-7f36fe93="" className="Betting__Popup-foot">
              <div data-v-7f36fe93="" className="Betting__Popup-foot-c" onClick={handleClosePopup}>Cancel</div>
              <div data-v-7f36fe93="" className="Betting__Popup-foot-s bgcolor"  onClick={handleJoin} >Total amount ₹{quantity*balance}.00</div>
            </div>
          </div>
        </div>
      )}

<div
  role="dialog"
  tabIndex="0"
  className="van-popup van-popup--center van-toast van-toast--middle van-toast--break-word van-toast--loading"
  style={{zIndex: '2005', display: 'none'}}
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
{lastBet && lastBet.result !== undefined && lastBet.status !== undefined  && lastBet.status !== 0 ? (
  lastBet.status === 2 ? (
    <div data-v-e44179e3="" data-v-5d71c3fd="" className="WinningTip__C" style={{ display: isVisible ? '' : 'none' }}>
      <div data-v-e44179e3="" className="WinningTip__C-body isL">
        
        <div data-v-e44179e3="" className="WinningTip__C-body-l1 isL">Sorry</div>

        <div data-v-e44179e3="" className={`WinningTip__C-body-l2 type${lastBet.result}`}>Lottery results 
          <div data-v-e44179e3="">
            {lastBet.result === 0 ? 'Red Violet'
              : lastBet.result === 5 ? 'Green Violet'
              : lastBet.result % 2 === 0 ? 'Red' : 'Green'}
          </div>

          <div data-v-e44179e3="" className="WinningNum">{lastBet.result}</div>

          <div data-v-e44179e3="">{lastBet.result < 5 ? 'Small' : 'Big'}</div>
        </div>

        <div data-v-e44179e3="" className="WinningTip__C-body-l3">
          <div data-v-e44179e3="" className="isLose">Lose</div>
          <div data-v-e44179e3="" className="gameDetail">Period: 1 min {lastBet.stage}</div>
        </div>

        <div data-v-e44179e3="" className="WinningTip__C-body-l4">
          <div data-v-e44179e3="" className="acitveBtn"></div> 3 seconds auto close
        </div>

        <div data-v-e44179e3="" className="closeBtn" onClick={toggleVisibility}></div>

        <i data-v-e44179e3="" className="van-badge__wrapper van-icon van-icon-arrow arrowBtn" style={{color: 'rgb(255, 255, 255)', fontSize: '30px', display: 'none'}}></i>
      </div>
    </div>
  ) : (
    <div data-v-e44179e3="" data-v-5d71c3fd="" className="WinningTip__C" style={{ display: isVisible ? '' : 'none' }}>
      <div data-v-e44179e3="" className="WinningTip__C-body" style={{ backgroundImage : `url('/assets/png/win-popup.png')` }}>
        <div data-v-e44179e3="" className="WinningTip__C-body-l1">Congratulations</div>
        <div data-v-e44179e3="" className={`WinningTip__C-body-l2 type${lastBet.result}`}>
          Lottery results
          <div data-v-e44179e3="">
            {lastBet.result === 0 ? 'Red Violet'
              : lastBet.result === 5 ? 'Green Violet'
              : lastBet.result % 2 === 0 ? 'Red' : 'Green'}
          </div>
          <div data-v-e44179e3="" className="WinningNum">{lastBet.result}</div>
          <div data-v-e44179e3="">{lastBet.result < 5 ? 'Small' : 'Big'}</div>
        </div>
        <div data-v-e44179e3="" className="WinningTip__C-body-l3">
          <div data-v-e44179e3="" className="head">Bonus</div>
          <div data-v-e44179e3="" className="bonus">₹{lastBet.get}</div>
          <div data-v-e44179e3="" className="gameDetail">
            Period:1min {lastBet.stage}
          </div>
        </div>
        <div data-v-e44179e3="" className="WinningTip__C-body-l4">
          <div data-v-e44179e3="" className="acitveBtn"></div>
          3 seconds auto close
        </div>
        <div data-v-e44179e3="" className="closeBtn" onClick={toggleVisibility}></div>
        <i
          data-v-e44179e3=""
          className="van-badge__wrapper van-icon van-icon-arrow arrowBtn"
          style={{color: 'rgb(255, 255, 255)', fontSize: '30px', display: 'none'}}
          ></i>
      </div>
    </div>
  )
) : null }

</div>
);
}
