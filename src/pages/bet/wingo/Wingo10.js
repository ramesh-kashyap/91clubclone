import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Api from '../../../services/Api';
import MyGameRecordList from './components/MyGameRecordList';
import GameList from './components/GameList';
import ReactHowler from 'react-howler';
import ChartList from './components/ChartList';
import { useNavigate } from 'react-router-dom';
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


var countDownDate = new Date("2030-07-16T23:59:59.9999999+01:00").getTime();

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


export default function Wingo10() {
  const { showToast } = useToast();


    const navigate = useNavigate();


  const [userInfo, setUserInfo] = useState(null);
    const [activeSection, setActiveSection] = useState('section1');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gamelist, setGamelist] = useState([]);
    const [myBets,setMyBets] = useState(null);
    const [last5Periods, setLast5Periods] = useState([]);
    const [period, setPeriod] = useState(null);
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
  const [lastBet, setLastBet] = useState([]);  // State for quantity
 
    const [join, setJoin] = useState(null);
    const [totalGamePages, setTotalGamePages] = useState(null);
    const [totalBetsPages, setTotalBetsPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGamePage, setCurrentGamePage] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };



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
        const response = await Api.post('/api/webapi/checkPeriodAndStage10', { period });
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

    useEffect(() => {
      if (error) {
          toast.error(error); // Show the error in a toast notification
      }
  }, [error]);
    
    const [playAudio2, setPlayAudio2] = useState(false);
    const audio1Ref = useRef(null);
    const [audio2Played, setAudio2Played] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false); // Track user interaction
  
    useEffect(() => {
      const audio1 = new Audio('/assets/audio/di1.da40b233.mp3');
      audio1.loop = false; // Ensure audio1 does not loop
      audio1Ref.current = audio1;
  
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
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const minute = Math.ceil(minutes % 10);
          const seconds1 = Math.floor((distance % (1000 * 60)) / 10000);
          const seconds2 = Math.floor(((distance % (1000 * 60)) / 1000) % 10);
          setTime({ minute, seconds1, seconds2 });
  
          if (userInteracted) { // Only play audio if the user has interacted
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
  
          if (minute === 0 && (seconds1 !== 0 || seconds2 > 5)) {
            setShowMark(false);
  
            if (userInteracted && audio1Ref.current) { // Only pause audio if user interacted
              audio1Ref.current.pause();
              audio1Ref.current.currentTime = 0;
            }
          }
  
          if (minute === 0 && seconds1 === 0 && seconds2 <= 5) {
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
          typeid: "10",
          pageno: pageno.toString(),
          pageto: "10",
          language: "vi",
        }); 
        console.log("hi123");   
        console.log(response);
  
        const { gameslist } = response.data.data;
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
        const response = await Api.get('/api/webapi/Wingo10');
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
          typeid: "10",
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

      const handleSocketData = async (msg) => {
        console.log("Received message from server:", msg);
        if (msg.data[0].game !== 'wingo10') return;
  
        const data1 = msg.data[0];
        const data2 = [msg.data[1]];

        console.log('data:', data1);
  
        setPeriod(data1.period);
        // Handle other state updates here
  
        const isCheckSuccessful = await checkPeriodAndStage(data1.period);
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

        toast.error('Invalid input or insufficient balance');
        return;
      }
  
      try {
        // Make the AJAX request
        const response = await Api.post('/api/webapi/action/join', {
          typeid: "10",
          join: join,
          x: quantity,
          money: balance,
        });
  
        const { data } = response;

        showToast('Bet placed successfully!', 'succes');

  
        handleClosePopup();
        fetchMyBets();
        fetchUserInfo();
  
  
      
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

<svg
  xmlns="http://www.w3.org/2000/svg"
  style={{position: 'absolute', width: '0', height: '0'}}
>
  <symbol
    id="icon-privacyIcon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M41 14V30H12.7C9.56 30 7 32.56 7 35.7V14C7 6 9 4 17 4H31C39 4 41 6 41 14Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M41 30V37C41 40.86 37.86 44 34 44H14C10.14 44 7 40.86 7 37V35.7C7 32.56 9.56 30 12.7 30H41ZM32 15.5H16C15.18 15.5 14.5 14.82 14.5 14C14.5 13.18 15.18 12.5 16 12.5H32C32.82 12.5 33.5 13.18 33.5 14C33.5 14.82 32.82 15.5 32 15.5ZM26 22.5H16C15.18 22.5 14.5 21.82 14.5 21C14.5 20.18 15.18 19.5 16 19.5H26C26.82 19.5 27.5 20.18 27.5 21C27.5 21.82 26.82 22.5 26 22.5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-riskProtocal"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M32.38 4H15.64C8.34 4 4 8.34 4 15.62V32.36C4 39.64 8.34 43.98 15.62 43.98H32.36C39.64 43.98 43.98 39.64 43.98 32.36V15.62C44 8.34 39.66 4 32.38 4Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.5 4V24.84C32.5 26.12 32.12 27.08 31.46 27.46C30.78 27.86 29.7 27.66 28.5 26.94L25.86 25.36C24.84 24.74 23.16 24.74 22.14 25.36L19.5 26.94C18.3 27.66 17.22 27.84 16.54 27.46C15.88 27.08 15.5 26.12 15.5 24.84V4H32.5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-about"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      d="M48.3242 14.2031L32.6492 5.75313C30.9992 4.85312 28.9992 4.85312 27.3492 5.75313L11.6742 14.2031C10.5242 14.8281 9.82422 16.0281 9.82422 17.4031C9.82422 18.7531 10.5242 19.9781 11.6742 20.6031L27.3492 29.0531C28.1742 29.5031 29.0992 29.7281 29.9992 29.7281C30.8992 29.7281 31.8242 29.5031 32.6492 29.0531L48.3242 20.6031C49.4742 19.9781 50.1742 18.7781 50.1742 17.4031C50.1742 16.0281 49.4742 14.8281 48.3242 14.2031Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M24.775 31.9773L10.175 24.6773C9.05 24.1273 7.75 24.1773 6.7 24.8273C5.625 25.5023 5 26.6273 5 27.8773V41.6523C5 44.0273 6.325 46.1773 8.45 47.2523L23.025 54.5523C23.5699 54.8224 24.1742 54.9503 24.7818 54.9241C25.3894 54.8979 25.9804 54.7184 26.5 54.4023C27.575 53.7523 28.2 52.6023 28.2 51.3523V37.5773C28.225 35.1773 26.9 33.0273 24.775 31.9773ZM53.3 24.8273C52.225 24.1773 50.925 24.1023 49.825 24.6773L35.25 31.9773C33.125 33.0523 31.8 35.1773 31.8 37.5773V51.3523C31.8 52.6023 32.425 53.7523 33.5 54.4023C34.0196 54.7184 34.6106 54.8979 35.2182 54.9241C35.8258 54.9503 36.4301 54.8224 36.975 54.5523L51.55 47.2523C53.675 46.1773 55 44.0523 55 41.6523V27.8773C55 26.6273 54.375 25.5023 53.3 24.8273Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-feedback"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M40.6016 9.12109H19.4016C13.2266 9.12109 8.22656 14.1461 8.22656 20.2961V43.8211C8.22656 49.9711 13.2516 54.9961 19.4016 54.9961H40.5766C46.7516 54.9961 51.7516 49.9711 51.7516 43.8211V20.2961C51.7766 14.1211 46.7516 9.12109 40.6016 9.12109Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M35.875 5H24.125C21.525 5 19.4 7.1 19.4 9.7V12.05C19.4 14.65 21.5 16.75 24.1 16.75H35.875C38.475 16.75 40.575 14.65 40.575 12.05V9.7C40.6 7.1 38.475 5 35.875 5ZM37.5 32.375H20C18.975 32.375 18.125 31.525 18.125 30.5C18.125 29.475 18.975 28.625 20 28.625H37.5C38.525 28.625 39.375 29.475 39.375 30.5C39.375 31.525 38.525 32.375 37.5 32.375ZM30.95 42.375H20C18.975 42.375 18.125 41.525 18.125 40.5C18.125 39.475 18.975 38.625 20 38.625H30.95C31.975 38.625 32.825 39.475 32.825 40.5C32.825 41.525 31.975 42.375 30.95 42.375Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-guide"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M30 13.2541V53.3291C29.575 53.3291 29.125 53.2541 28.775 53.0541L28.675 53.0041C23.875 50.3791 15.5 47.6291 10.075 46.9041L9.35 46.8041C6.95 46.5041 5 44.2541 5 41.8541V11.6541C5 8.67913 7.425 6.42913 10.4 6.67913C15.65 7.10413 23.6 9.75413 28.05 12.5291L28.675 12.9041C29.05 13.1291 29.525 13.2541 30 13.2541Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M55 11.6739V41.8489C55 44.2489 53.05 46.4988 50.65 46.7989L49.825 46.8988C44.375 47.6239 35.975 50.3988 31.175 53.0489C30.85 53.2488 30.45 53.3239 30 53.3239V13.2489C30.475 13.2489 30.95 13.1239 31.325 12.8989L31.75 12.6239C36.2 9.82385 44.175 7.14885 49.425 6.69885H49.575C52.55 6.44885 55 8.67385 55 11.6739ZM19.375 23.0939H13.75C12.725 23.0939 11.875 22.2439 11.875 21.2189C11.875 20.1939 12.725 19.3439 13.75 19.3439H19.375C20.4 19.3439 21.25 20.1939 21.25 21.2189C21.25 22.2439 20.4 23.0939 19.375 23.0939ZM21.25 30.5939H13.75C12.725 30.5939 11.875 29.7439 11.875 28.7189C11.875 27.6939 12.725 26.8439 13.75 26.8439H21.25C22.275 26.8439 23.125 27.6939 23.125 28.7189C23.125 29.7439 22.275 30.5939 21.25 30.5939Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-notificationCenter"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      d="M21 34H12V50.5C12 52.9853 14.0146 55 16.5 55C18.9854 55 21 52.9853 21 50.5V34Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.6"
      d="M23.75 15H11.25C9.17887 15 7.5 16.6789 7.5 18.75V31.25C7.5 33.3211 9.17887 35 11.25 35H25"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.6"
      d="M42.5 17.5H45C49.1421 17.5 52.5 20.8579 52.5 25C52.5 29.1421 49.1421 32.5 45 32.5H42.5"
      fill="var(--main-color)"
    ></path>
    <path
      d="M42.2432 42.5C42.3851 42.5 42.5 42.3849 42.5 42.2428V7.75724C42.5 7.61518 42.3851 7.5 42.2432 7.5H37.9706C28.3219 7.5 20.5 15.3351 20.5 25C20.5 34.6649 28.3219 42.5 37.9706 42.5H42.2432Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-serviceCenter"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 59"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40.5616 47.7085C46.9614 44.2361 51.2765 37.6807 51.2765 30.1657C51.2765 19.022 41.7881 9.98828 30.0836 9.98828C18.379 9.98828 8.89062 19.022 8.89062 30.1657C8.89062 37.6852 13.2109 44.2439 19.617 47.7148C17.0174 45.1944 15.4141 41.7394 15.4141 37.9279C15.4141 33.9619 17.411 32.4952 18.6745 31.7193C19.0718 31.4753 20.4928 31.2313 22.3354 30.9149C26.3524 30.2251 32.3735 29.1913 34.1617 27.0632C35.9014 24.9928 35.7509 23.2028 35.6543 22.0531C35.6061 21.479 35.5712 21.0646 35.7919 20.8546C36.4544 20.2243 37.4221 20.3954 40.6826 23.959C43.943 27.5225 44.7581 32.7574 44.7581 37.9279C44.7581 41.7363 43.1574 45.1887 40.5616 47.7085Z"
      fill="var(--main-color)"
    ></path>
    <g opacity="0.6">
      <path
        d="M28.8809 53.7847C40.4635 55.1654 51.4474 47.926 53.9875 36.8571C54.1796 36.02 54.3182 35.1837 54.4055 34.3513L52.8032 34.018C52.7395 35.0399 52.5917 36.0704 52.355 37.102C50.0167 47.2913 39.8412 53.9262 29.1704 52.5233L28.8809 53.7847Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M4 25.9591C4 24.8545 4.89543 23.9591 6 23.9591H8.5209C9.62547 23.9591 10.5209 24.8545 10.5209 25.9591V34.376C10.5209 35.4806 9.62547 36.376 8.5209 36.376H6C4.89543 36.376 4 35.4806 4 34.376V25.9591Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M49.6439 25.9591C49.6439 24.8545 50.5394 23.9591 51.6439 23.9591H54.1648C55.2694 23.9591 56.1648 24.8545 56.1648 25.9591V34.376C56.1648 35.4806 55.2694 36.376 54.1648 36.376H51.6439C50.5394 36.376 49.6439 35.4806 49.6439 34.376V25.9591Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M7.49783 28.6149C7.34553 27.6011 7.26673 26.5647 7.26673 25.5108C7.26673 13.5099 17.485 3.78125 30.0899 3.78125C42.6948 3.78125 52.913 13.5099 52.913 25.5108C52.913 26.5647 52.8342 27.6011 52.6819 28.6149H51.1434C51.3083 27.6031 51.3939 26.5665 51.3939 25.511C51.3939 14.3673 41.8568 5.33355 30.0922 5.33355C18.3277 5.33355 8.79063 14.3673 8.79063 25.511C8.79063 26.5665 8.87619 27.6031 9.04111 28.6149H7.49783Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M33.8935 53.574C33.5091 55.2489 31.7714 56.31 30.0122 55.9441C28.253 55.5782 27.1385 53.9237 27.5228 52.2488C27.9072 50.5739 29.6449 49.5128 31.4041 49.8787C33.1633 50.2447 34.2778 51.8991 33.8935 53.574Z"
        fill="var(--main-color)"
      ></path>
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M34.8954 42.6172C33.7028 43.5506 31.9855 44.1363 30.0767 44.1363C28.1698 44.1363 26.4541 43.5518 25.2617 42.6201C25.6652 44.8046 27.6682 46.4644 30.0783 46.4644C32.4895 46.4644 34.4931 44.8031 34.8954 42.6172Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-settingCenter"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M5 32.2035V27.8035C5 25.2035 7.125 23.0535 9.75 23.0535C14.275 23.0535 16.125 19.8535 13.85 15.9285C12.55 13.6785 13.325 10.7535 15.6 9.4535L19.925 6.9785C21.9 5.8035 24.45 6.5035 25.625 8.4785L25.9 8.9535C28.15 12.8785 31.85 12.8785 34.125 8.9535L34.4 8.4785C35.575 6.5035 38.125 5.8035 40.1 6.9785L44.425 9.4535C46.7 10.7535 47.475 13.6785 46.175 15.9285C43.9 19.8535 45.75 23.0535 50.275 23.0535C52.875 23.0535 55.025 25.1785 55.025 27.8035V32.2035C55.025 34.8035 52.9 36.9535 50.275 36.9535C45.75 36.9535 43.9 40.1535 46.175 44.0785C47.475 46.3535 46.7 49.2535 44.425 50.5535L40.1 53.0285C38.125 54.2035 35.575 53.5035 34.4 51.5285L34.125 51.0535C31.875 47.1285 28.175 47.1285 25.9 51.0535L25.625 51.5285C24.45 53.5035 21.9 54.2035 19.925 53.0285L15.6 50.5535C14.5102 49.926 13.714 48.8919 13.3859 47.6779C13.0578 46.464 13.2247 45.1695 13.85 44.0785C16.125 40.1535 14.275 36.9535 9.75 36.9535C7.125 36.9535 5 34.8035 5 32.2035Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M30 38.125C32.1549 38.125 34.2215 37.269 35.7452 35.7452C37.269 34.2215 38.125 32.1549 38.125 30C38.125 27.8451 37.269 25.7785 35.7452 24.2548C34.2215 22.731 32.1549 21.875 30 21.875C27.8451 21.875 25.7785 22.731 24.2548 24.2548C22.731 25.7785 21.875 27.8451 21.875 30C21.875 32.1549 22.731 34.2215 24.2548 35.7452C25.7785 37.269 27.8451 38.125 30 38.125Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-VipIcon"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M16.8469 5H43.1308C46.2059 5 49.8323 7.27126 51.1958 10.0735L58.1584 24.2909C59.841 27.7126 58.9127 32.5795 56.1567 35.1457L36.0521 53.6992C32.7158 56.7669 27.2908 56.7669 23.9546 53.6992L3.84999 35.1457C1.06495 32.5795 0.165608 27.7126 1.84824 24.2909L8.81086 10.0735C10.1454 7.27126 13.7717 5 16.8469 5Z"
      fill="#03AC84"
    ></path>
    <path
      d="M23.4103 17C24.2155 17 24.7602 17.1319 25.0444 17.3956C25.3523 17.6593 25.5654 18.2107 25.6838 19.0498L28.0284 38.1812C28.0995 38.7566 28.2534 39.1282 28.4902 39.296C28.7271 39.4638 29.106 39.5597 29.627 39.5837L29.5915 43H28.0284C25.9443 43 24.5708 42.4846 23.9076 41.4537C23.5524 40.9023 23.3037 40.3628 23.1616 39.8354C23.0195 39.284 22.8893 38.5168 22.7709 37.5339L20 17H23.4103ZM32.6821 43H30.4796L34.3517 19.0498C34.4464 18.2347 34.6477 17.6953 34.9556 17.4315C35.2635 17.1438 35.82 17 36.6252 17H40L36.4476 38.2531C36.2818 39.1641 36.1397 39.8354 36.0213 40.2669C35.9266 40.6985 35.749 41.166 35.4885 41.6694C35.2279 42.1729 34.8727 42.5205 34.4227 42.7123C33.9728 42.9041 33.3925 43 32.6821 43Z"
      fill="#03AC84"
    ></path>
  </symbol>
  <symbol
    id="icon-betHistory"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M54.2259 73.1178H18.4859C12.7419 73.1178 8.08594 68.4617 8.08594 62.7177V16.9937C8.08594 11.2497 12.7419 6.59375 18.4859 6.59375H54.2259C59.9699 6.59375 64.6259 11.2497 64.6259 16.9937V62.7177C64.6259 68.4617 59.9699 73.1178 54.2259 73.1178Z"
      fill="#5CA6FF"
    ></path>
    <path
      d="M49.1664 25.4703H23.7664C21.9984 25.4703 20.5664 24.0383 20.5664 22.2703C20.5664 20.5023 21.9984 19.0703 23.7664 19.0703H49.1664C50.9344 19.0703 52.3664 20.5023 52.3664 22.2703C52.3664 24.0383 50.9344 25.4703 49.1664 25.4703ZM49.1664 38.1583H23.7664C21.9984 38.1583 20.5664 36.7263 20.5664 34.9583C20.5664 33.1903 21.9984 31.7583 23.7664 31.7583H49.1664C50.9344 31.7583 52.3664 33.1903 52.3664 34.9583C52.3664 36.7263 50.9344 38.1583 49.1664 38.1583ZM35.9304 50.8463H23.7664C21.9984 50.8463 20.5664 49.4143 20.5664 47.6463C20.5664 45.8783 21.9984 44.4463 23.7664 44.4463H35.9304C37.6984 44.4463 39.1304 45.8783 39.1304 47.6463C39.1304 49.4143 37.6944 50.8463 35.9304 50.8463Z"
      fill="var(--bg_color_L2)"
    ></path>
    <path
      d="M42.9609 58.008C42.9609 61.9438 44.5244 65.7184 47.3075 68.5014C50.0905 71.2845 53.8651 72.848 57.8009 72.848C61.7367 72.848 65.5113 71.2845 68.2944 68.5014C71.0774 65.7184 72.6409 61.9438 72.6409 58.008C72.6409 54.0722 71.0774 50.2975 68.2944 47.5145C65.5113 44.7315 61.7367 43.168 57.8009 43.168C53.8651 43.168 50.0905 44.7315 47.3075 47.5145C44.5244 50.2975 42.9609 54.0722 42.9609 58.008Z"
      fill="#5CA6FF"
    ></path>
    <path
      d="M57.8205 43.1875C49.6245 43.1875 42.9805 49.8315 42.9805 58.0275C42.9805 65.8395 49.0165 72.2355 56.6805 72.8195C61.2405 71.7195 64.6325 67.6115 64.6325 62.7115V44.8395C62.5264 43.7526 60.1905 43.1862 57.8205 43.1875Z"
      fill="#3689FF"
    ></path>
    <path d="M68 48H48V68H68V48Z" fill="white" fillOpacity="0.01"></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M58.0026 46.4687C58.9231 46.4687 59.6693 47.2149 59.6693 48.1354L59.6693 68.1354C59.6693 69.0559 58.9231 69.8021 58.0026 69.8021C57.0821 69.8021 56.3359 69.0559 56.3359 68.1354L56.3359 48.1354C56.3359 47.2149 57.0821 46.4687 58.0026 46.4687Z"
      fill="var(--bg_color_L2)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50.918 54.2487C50.918 51.2571 53.3431 48.832 56.3346 48.832H62.5834L62.5846 50.4987L62.5846 52.1654H56.3346C55.184 52.1654 54.2513 53.0981 54.2513 54.2487C54.2513 55.3993 55.184 56.332 56.3346 56.332C57.2551 56.332 58.0013 57.0782 58.0013 57.9987C58.0013 58.9192 57.2551 59.6654 56.3346 59.6654C53.3431 59.6654 50.918 57.2403 50.918 54.2487ZM64.2513 50.4987C64.2513 51.4192 63.5051 52.1654 62.5846 52.1654L62.5846 50.4987L62.5834 48.832C63.5039 48.832 64.2513 49.5782 64.2513 50.4987Z"
      fill="var(--bg_color_L2)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M54.6667 57.9987C54.6667 57.0782 55.4129 56.332 56.3333 56.332H59.6667C62.6582 56.332 65.0833 58.7571 65.0833 61.7487C65.0833 64.7403 62.6582 67.1654 59.6667 67.1654H53.4179L53.4167 65.4987L53.4167 63.832H59.6667C60.8173 63.832 61.75 62.8993 61.75 61.7487C61.75 60.5981 60.8173 59.6654 59.6667 59.6654H56.3333C55.4129 59.6654 54.6667 58.9192 54.6667 57.9987ZM51.75 65.4987C51.75 64.5782 52.4962 63.832 53.4167 63.832L53.4167 65.4987L53.4179 67.1654C52.4974 67.1654 51.75 66.4192 51.75 65.4987Z"
      fill="var(--bg_color_L2)"
    ></path>
  </symbol>
  <symbol
    id="icon-crown"
    viewBox="0 0 48 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M33.5405 40.3898H14.4605C13.6205 40.3898 12.8605 39.8498 12.5805 39.0698L4.26048 15.7698C3.60048 13.9098 5.72048 12.3298 7.30048 13.4698L15.3005 19.1898C16.3605 19.9498 17.8805 19.4898 18.3405 18.2698L22.1205 8.18977C22.7605 6.44977 25.2205 6.44977 25.8605 8.18977L29.6405 18.2698C29.7485 18.5573 29.9214 18.8161 30.1456 19.026C30.3698 19.236 30.6393 19.3914 30.9333 19.4804C31.2273 19.5694 31.5378 19.5894 31.8408 19.539C32.1438 19.4886 32.4311 19.3691 32.6805 19.1898L40.6805 13.4698C42.2805 12.3298 44.3805 13.9298 43.7205 15.7698L35.4005 39.0698C35.1405 39.8498 34.3805 40.3898 33.5405 40.3898Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M29 31.9297H19C18.18 31.9297 17.5 31.2497 17.5 30.4297C17.5 29.6097 18.18 28.9297 19 28.9297H29C29.82 28.9297 30.5 29.6097 30.5 30.4297C30.5 31.2497 29.82 31.9297 29 31.9297Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-diamond"
    viewBox="0 0 48 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8.07227H36L44 18.1617L24 42.3762L4 18.1617L12 8.07227Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M4 18.1602H44"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M24 42.3747L16 18.1602"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M24 42.3747L32 18.1602"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M8 13.1152L4 18.1599L24 42.3745L44 18.1599L40 13.1152"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-editIcon"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.1" filter="url(#filter0_d_2333_99022)">
      <path
        d="M16 28C16 16.9543 24.9543 8 36 8H76C87.0457 8 96 16.9543 96 28V68C96 79.0457 87.0457 88 76 88H36C24.9543 88 16 79.0457 16 68V28Z"
        fill="var(--main-color)"
      ></path>
    </g>
    <path
      opacity="0.6"
      d="M56.0008 61.3766C57.0815 61.3766 58.118 60.9472 58.8822 60.183C59.6465 59.4188 60.0758 58.3823 60.0758 57.3016C60.0758 56.2208 59.6465 55.1843 58.8822 54.4201C58.118 53.6559 57.0815 53.2266 56.0008 53.2266C54.92 53.2266 53.8835 53.6559 53.1193 54.4201C52.3551 55.1843 51.9258 56.2208 51.9258 57.3016C51.9258 58.3823 52.3551 59.4188 53.1193 60.183C53.8835 60.9472 54.92 61.3766 56.0008 61.3766Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M67.625 41.6016H44.375C34.125 41.6016 31 44.7266 31 54.9766V59.6266C31 69.8766 34.125 73.0016 44.375 73.0016H67.625C77.875 73.0016 81 69.8766 81 59.6266V54.9766C81 44.7266 77.875 41.6016 67.625 41.6016ZM56 64.8516C51.825 64.8516 48.45 61.4516 48.45 57.3016C48.45 53.1516 51.825 49.7516 56 49.7516C60.175 49.7516 63.55 53.1516 63.55 57.3016C63.55 61.4516 60.175 64.8516 56 64.8516Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.6"
      d="M43.7969 41.625V38.7C43.7969 31.375 45.8719 26.5 55.9969 26.5C66.1219 26.5 68.1969 31.375 68.1969 38.7V41.625C69.4719 41.65 70.6219 41.7 71.6969 41.85V38.7C71.6969 31.95 70.0719 23 55.9969 23C41.9219 23 40.2969 31.95 40.2969 38.7V41.825C41.3469 41.7 42.5219 41.625 43.7969 41.625Z"
      fill="var(--main-color)"
    ></path>
    <defs>
      <filter
        id="filter0_d_2333_99022"
        x="0"
        y="0"
        width="112"
        height="112"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="8"></feOffset>
        <feGaussianBlur stdDeviation="8"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.815686 0 0 0 0 0.915765 0 0 0 0 0.929412 0 0 0 0.36 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2333_99022"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2333_99022"
          result="shape"
        ></feBlend>
      </filter>
    </defs>
  </symbol>
  <symbol
    id="icon-gifts"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M50.4219 25V45C50.4219 52.5 47.9219 55 40.4219 55H20.4219C12.9219 55 10.4219 52.5 10.4219 45V25H50.4219Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M54.25 17.5V20C54.25 22.75 52.925 25 49.25 25H11.75C7.925 25 6.75 22.75 6.75 20V17.5C6.75 14.75 7.925 12.5 11.75 12.5H49.25C52.925 12.5 54.25 14.75 54.25 17.5Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M29.5993 12.5013H15.7993C15.3882 12.0554 15.1663 11.4674 15.1803 10.8611C15.1943 10.2548 15.4431 9.67767 15.8743 9.25125L19.4243 5.70125C19.8736 5.25698 20.48 5.00781 21.1118 5.00781C21.7437 5.00781 22.35 5.25698 22.7993 5.70125L29.5993 12.5013ZM45.1818 12.5013H31.3818L38.1818 5.70125C38.6311 5.25698 39.2375 5.00781 39.8693 5.00781C40.5012 5.00781 41.1075 5.25698 41.5568 5.70125L45.1068 9.25125C46.0068 10.1513 46.0318 11.5763 45.1818 12.5013Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.6"
      d="M22.8516 25V37.85C22.8516 39.85 25.0516 41.025 26.7266 39.95L29.0766 38.4C29.4848 38.1312 29.9628 37.9879 30.4516 37.9879C30.9403 37.9879 31.4184 38.1312 31.8266 38.4L34.0516 39.9C34.427 40.1503 34.8634 40.2939 35.3141 40.3157C35.7648 40.3374 36.2129 40.2364 36.6107 40.0234C37.0085 39.8104 37.341 39.4934 37.5727 39.1062C37.8045 38.719 37.9268 38.2762 37.9266 37.825V25H22.8516Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-googleIcon"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.1" filter="url(#filter0_d_2333_99273)">
      <path
        d="M16 28C16 16.9543 24.9543 8 36 8H76C87.0457 8 96 16.9543 96 28V68C96 79.0457 87.0457 88 76 88H36C24.9543 88 16 79.0457 16 68V28Z"
        fill="var(--main-color)"
      ></path>
    </g>
    <path
      opacity="0.4"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M55.5 75C70.6878 75 83 62.6878 83 47.5C83 32.3122 70.6878 20 55.5 20C40.3122 20 28 32.3122 28 47.5C28 62.6878 40.3122 75 55.5 75ZM55.4986 56.2607C50.6609 56.2607 46.7393 52.3391 46.7393 47.5014C46.7393 42.6638 50.6609 38.7422 55.4986 38.7422C60.3362 38.7422 64.2578 42.6638 64.2578 47.5014C64.2578 52.3391 60.3362 56.2607 55.4986 56.2607Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M61.9771 20.7737C66.8866 21.9635 71.3735 24.4826 74.9454 28.0546L67.8936 35.1065C65.6169 32.8298 62.7572 31.2243 59.6282 30.466C56.4992 29.7077 53.2217 29.8259 50.1554 30.8076C47.0892 31.7894 44.3526 33.5968 42.2459 36.0315C40.1392 38.4661 38.7438 41.4341 38.2129 44.6096C37.6819 47.7851 38.0359 51.0456 39.236 54.0331C40.4361 57.0207 42.4359 59.62 45.016 61.5459C47.5962 63.4717 50.6569 64.6496 53.8624 64.9505C57.068 65.2513 60.2944 64.6633 63.1878 63.2511L67.5621 72.2135C63.0224 74.4292 57.9601 75.3517 52.9307 74.8797C47.9012 74.4077 43.0989 72.5596 39.0507 69.5379C35.0025 66.5163 31.8648 62.438 29.9818 57.7505C28.0989 53.063 27.5435 47.9474 28.3765 42.965C29.2096 37.9826 31.3989 33.3259 34.7043 29.5059C38.0097 25.6859 42.3034 22.8501 47.1144 21.3097C51.9254 19.7693 57.0677 19.5839 61.9771 20.7737ZM55.7013 26.9256C54.5762 26.9256 53.6642 26.0136 53.6642 24.8886C53.6642 23.7636 54.5762 22.8516 55.7013 22.8516C56.8263 22.8516 57.7383 23.7636 57.7383 24.8886C57.7383 26.0136 56.8263 26.9256 55.7013 26.9256ZM37.3712 31.6113C37.3712 32.7363 38.2833 33.6483 39.4083 33.6483C40.5333 33.6483 41.4453 32.7363 41.4453 31.6113C41.4453 30.4862 40.5333 29.5742 39.4083 29.5742C38.2833 29.5742 37.3712 30.4862 37.3712 31.6113ZM32.8888 49.5389C31.7637 49.5389 30.8517 48.6269 30.8517 47.5019C30.8517 46.3769 31.7637 45.4648 32.8888 45.4648C34.0138 45.4648 34.9258 46.3769 34.9258 47.5019C34.9258 48.6269 34.0138 49.5389 32.8888 49.5389ZM37.3712 63.7948C37.3712 64.9199 38.2833 65.8319 39.4083 65.8319C40.5333 65.8319 41.4453 64.9199 41.4453 63.7948C41.4453 62.6698 40.5333 61.7578 39.4083 61.7578C38.2833 61.7578 37.3712 62.6698 37.3712 63.7948ZM55.4981 72.3514C54.3731 72.3514 53.4611 71.4394 53.4611 70.3144C53.4611 69.1894 54.3731 68.2773 55.4981 68.2773C56.6232 68.2773 57.5352 69.1894 57.5352 70.3144C57.5352 71.4394 56.6232 72.3514 55.4981 72.3514Z"
      fill="var(--main-color)"
    ></path>
    <rect
      x="53.0547"
      y="45.0547"
      width="27.7037"
      height="5.09259"
      rx="2.5463"
      fill="var(--main-color)"
    ></rect>
    <defs>
      <filter
        id="filter0_d_2333_99273"
        x="0"
        y="0"
        width="112"
        height="112"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="8"></feOffset>
        <feGaussianBlur stdDeviation="8"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.815686 0 0 0 0 0.915765 0 0 0 0 0.929412 0 0 0 0.36 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2333_99273"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2333_99273"
          result="shape"
        ></feBlend>
      </filter>
    </defs>
  </symbol>
  <symbol
    id="icon-language"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M19.6217 52.2742C19.5467 52.2742 19.4467 52.3242 19.3717 52.3242C14.5217 49.9242 10.5717 45.9492 8.14672 41.0992C8.14672 41.0242 8.19672 40.9242 8.19672 40.8492C11.2467 41.7492 14.3967 42.4242 17.5217 42.9492C18.0717 46.0992 18.7217 49.2242 19.6217 52.2742ZM52.8492 41.1242C50.3742 46.0992 46.2492 50.1242 41.2242 52.5492C42.1742 49.3742 42.9742 46.1742 43.4992 42.9492C46.6492 42.4242 49.7492 41.7492 52.7992 40.8492C52.7742 40.9492 52.8492 41.0492 52.8492 41.1242ZM53.0492 19.2742C49.8992 18.3242 46.7242 17.5492 43.4992 16.9992C42.9742 13.7742 42.1992 10.5742 41.2242 7.44922C46.3992 9.92422 50.5742 14.0992 53.0492 19.2742ZM19.6242 7.72172C18.7242 10.7717 18.0742 13.8717 17.5492 17.0217C14.3242 17.5217 11.1242 18.3217 7.94922 19.2717C10.3742 14.2467 14.3992 10.1217 19.3742 7.64672C19.4492 7.64672 19.5492 7.72172 19.6242 7.72172Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M39.23 16.475C33.43 15.825 27.58 15.825 21.78 16.475C22.405 13.05 23.205 9.625 24.33 6.325C24.38 6.125 24.355 5.975 24.38 5.775C26.355 5.3 28.38 5 30.505 5C32.605 5 34.655 5.3 36.605 5.775C36.63 5.975 36.63 6.125 36.68 6.325C37.805 9.65 38.605 13.05 39.23 16.475ZM16.975 38.73C13.525 38.105 10.125 37.305 6.825 36.18C6.625 36.13 6.475 36.155 6.275 36.13C5.8 34.155 5.5 32.13 5.5 30.005C5.5 27.905 5.8 25.855 6.275 23.905C6.475 23.88 6.625 23.88 6.825 23.83C10.15 22.73 13.525 21.905 16.975 21.28C16.35 27.08 16.35 32.93 16.975 38.73ZM55.5 30.005C55.5 32.13 55.2 34.155 54.725 36.13C54.525 36.155 54.375 36.13 54.175 36.18C50.85 37.28 47.45 38.105 44.025 38.73C44.675 32.93 44.675 27.08 44.025 21.28C47.45 21.905 50.875 22.705 54.175 23.83C54.375 23.88 54.525 23.905 54.725 23.905C55.2 25.88 55.5 27.905 55.5 30.005ZM39.23 43.525C38.605 46.975 37.805 50.375 36.68 53.675C36.63 53.875 36.63 54.025 36.605 54.225C34.655 54.7 32.605 55 30.505 55C28.38 55 26.355 54.7 24.38 54.225C24.355 54.025 24.38 53.875 24.33 53.675C23.2429 50.3557 22.3908 46.964 21.78 43.525C24.68 43.85 27.58 44.075 30.505 44.075C33.43 44.075 36.355 43.85 39.23 43.525ZM39.9075 39.4075C33.6606 40.1964 27.3394 40.1964 21.0925 39.4075C20.3037 33.1606 20.3037 26.8394 21.0925 20.5925C27.3394 19.8037 33.6606 19.8037 39.9075 20.5925C40.6964 26.8394 40.6964 33.1606 39.9075 39.4075Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-logout"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M14.5 8C13.8406 8.37652 13.2062 8.79103 12.6 9.24051C11.5625 10.0097 10.6074 10.8814 9.75 11.8402C6.79377 15.1463 5 19.4891 5 24.2455C5 34.6033 13.5066 43 24 43C34.4934 43 43 34.6033 43 24.2455C43 19.4891 41.2062 15.1463 38.25 11.8402C37.3926 10.8814 36.4375 10.0097 35.4 9.24051C34.7938 8.79103 34.1594 8.37652 33.5 8"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M24 4V24"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-love"
    viewBox="0 0 30 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.9946 30.4322C23.0148 30.4322 29.5165 23.7194 29.5165 15.4388C29.5165 7.15811 23.0148 0.445312 14.9946 0.445312C6.97433 0.445312 0.472656 7.15811 0.472656 15.4388C0.472656 23.7194 6.97433 30.4322 14.9946 30.4322ZM10.0356 7.31738C9.29556 7.31738 8.616 7.72604 8.26904 8.37971L5.96505 12.7204C5.5728 13.4594 5.68198 14.3644 6.23872 14.9889L13.5008 23.1351C14.2961 24.0273 15.6913 24.0273 16.4866 23.1351L23.7487 14.9889C24.3054 14.3644 24.4146 13.4594 24.0224 12.7204L21.7184 8.37971C21.3714 7.72603 20.6918 7.31738 19.9518 7.31738H10.0356Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-messageIcon"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.2"
      d="M0 20C0 8.95431 8.95431 0 20 0H60C71.0457 0 80 8.95431 80 20V60C80 71.0457 71.0457 80 60 80H20C8.95431 80 0 71.0457 0 60V20Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M29.8214 39.1101L14.1412 56.6069C13.8822 55.9411 13.749 55.2229 13.75 54.4972V25.3819C13.7504 24.6997 13.8695 24.0241 14.1008 23.3926L29.8214 39.1101Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.5"
      d="M38.3452 42.2511L15.8906 22.0736C16.714 21.5361 17.6752 21.25 18.6576 21.25H60.2648C61.2483 21.2487 62.2108 21.5359 63.0335 22.0765L44.9548 38.3231L44.8364 38.4247L40.5749 42.2517C40.2683 42.5267 39.8713 42.6787 39.46 42.6786C39.0486 42.6785 38.6517 42.5263 38.3452 42.2511Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M45.7101 40.7283L62.7409 57.9874C61.9421 58.4884 61.0208 58.7524 60.0815 58.7497H18.5471C17.6087 58.7523 16.6884 58.4882 15.8906 57.9874L32.9203 40.7283L38.2877 45.6018C38.5694 45.8585 38.9347 46.0005 39.3135 46.0005C39.6922 46.0005 40.0576 45.8585 40.3392 45.6018L45.7101 40.7283ZM65.1763 25.3236V53.5872C65.1772 54.291 65.0351 54.9875 64.7588 55.6333L47.9996 38.6493L64.8014 23.3926C65.0488 24.0055 65.1761 24.6614 65.1763 25.3236Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-myDraw"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      d="M19.5 4H8.5V17.5L19.5 25.6M19.5 4V25.6V4ZM41.5 4H52.5V17.5L41.5 25.6M41.5 4V25.6V4Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.5 25.6016C26.2741 25.6016 22.4191 27.1614 19.5 29.7266C16.1244 32.693 14 37.0037 14 41.8016C14 50.7486 21.3873 58.0016 30.5 58.0016C39.6127 58.0016 47 50.7486 47 41.8016C47 37.0037 44.8756 32.693 41.5 29.7266C38.5809 27.1614 34.7259 25.6016 30.5 25.6016ZM30.9754 31.4666C30.8258 31.0059 30.1741 31.0059 30.0244 31.4666L28.1425 37.2584C28.0756 37.4644 27.8836 37.6039 27.667 37.6039H21.5771C21.0928 37.6039 20.8914 38.2237 21.2832 38.5084L26.21 42.0879C26.3853 42.2152 26.4586 42.4409 26.3917 42.6469L24.5098 48.4387C24.3601 48.8994 24.8874 49.2824 25.2792 48.9977L30.206 45.4182C30.3813 45.2909 30.6186 45.2909 30.7938 45.4182L35.7206 48.9977C36.1125 49.2824 36.6397 48.8994 36.49 48.4387L34.6082 42.6469C34.5412 42.4409 34.6145 42.2152 34.7898 42.0879L39.7166 38.5084C40.1084 38.2237 39.9071 37.6039 39.4227 37.6039H33.3328C33.1162 37.6039 32.9242 37.4644 32.8573 37.2584L30.9754 31.4666Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M20.5 4H40.5V27C38 25.1842 34.3418 23.9737 30.5 23.9737C26.6582 23.9737 21.75 25.7895 20.5 27V4Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-myWithdrawHistory"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.6654 50.0012C9.2987 50.0012 3.33203 55.9678 3.33203 63.3345C3.33203 65.8345 4.03203 68.2012 5.26536 70.2012C6.44047 72.1761 8.10965 73.811 10.1086 74.9449C12.1075 76.0788 14.3672 76.6726 16.6654 76.6678C21.532 76.6678 25.7654 74.0678 28.0654 70.2012C29.2987 68.2012 29.9987 65.8345 29.9987 63.3345C29.9987 55.9678 24.032 50.0012 16.6654 50.0012ZM23.232 62.2345L16.132 68.8012C15.6654 69.2345 15.032 69.4678 14.432 69.4678C13.7987 69.4678 13.1654 69.2345 12.6654 68.7345L9.36536 65.4345C8.90043 64.964 8.63969 64.3293 8.63969 63.6678C8.63969 63.0064 8.90043 62.3716 9.36536 61.9012C10.332 60.9345 11.932 60.9345 12.8987 61.9012L14.4987 63.5012L19.832 58.5678C20.832 57.6345 22.432 57.7012 23.3654 58.7012C24.2987 59.7012 24.232 61.3012 23.232 62.2345ZM59.1687 23.5012C58.3687 23.3678 57.5354 23.3345 56.6687 23.3345H23.3354C22.402 23.3345 21.502 23.4012 20.6354 23.5345C21.102 22.6012 21.7687 21.7345 22.5687 20.9345L33.402 10.0678C35.6021 7.88976 38.5729 6.66797 41.6687 6.66797C44.7645 6.66797 47.7353 7.88976 49.9354 10.0678L55.7687 15.9678C57.902 18.0678 59.0354 20.7345 59.1687 23.5012Z"
      fill="#FF891D"
    ></path>
    <path
      opacity="0.4"
      d="M73.3346 40.0026V56.6693C73.3346 66.6693 66.668 73.3359 56.668 73.3359H25.4346C26.468 72.4693 27.368 71.4026 28.068 70.2026C29.3013 68.2026 30.0013 65.8359 30.0013 63.3359C30.0013 55.9693 24.0346 50.0026 16.668 50.0026C12.668 50.0026 9.1013 51.7693 6.66797 54.5359V40.0026C6.66797 30.9359 12.1346 24.6026 20.6346 23.5359C21.5013 23.4026 22.4013 23.3359 23.3346 23.3359H56.668C57.5346 23.3359 58.368 23.3693 59.168 23.5026C67.768 24.5026 73.3346 30.8693 73.3346 40.0026Z"
      fill="#FF891D"
    ></path>
    <path
      d="M73.3346 41.6641H63.3346C59.668 41.6641 56.668 44.6641 56.668 48.3307C56.668 51.9974 59.668 54.9974 63.3346 54.9974H73.3346"
      fill="#FF891D"
    ></path>
  </symbol>
  <symbol
    id="icon-notification"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M43 51.25H18C10.5 51.25 5.5 47.5 5.5 38.75V21.25C5.5 12.5 10.5 8.75 18 8.75H43C50.5 8.75 55.5 12.5 55.5 21.25V38.75C55.5 47.5 50.5 51.25 43 51.25Z"
      fill="currentColor"
    ></path>
    <path
      d="M30.4987 32.1818C28.3987 32.1818 26.2737 31.5318 24.6487 30.2068L16.8237 23.9568C16.4598 23.6408 16.2319 23.1966 16.1876 22.7167C16.1433 22.2369 16.286 21.7584 16.5858 21.3812C16.8857 21.0039 17.3196 20.757 17.7971 20.6919C18.2746 20.6268 18.7588 20.7486 19.1487 21.0318L26.9737 27.2818C28.8737 28.8068 32.0987 28.8068 33.9987 27.2818L41.8237 21.0318C42.6237 20.3818 43.8237 20.5068 44.4487 21.3318C45.0987 22.1318 44.9737 23.3318 44.1487 23.9568L36.3237 30.2068C34.7237 31.5318 32.5987 32.1818 30.4987 32.1818Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-points"
    viewBox="0 0 98 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_i_2239_90691)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.7615 26.2029C30.1125 25.5623 30.7849 25.1641 31.5154 25.1641H66.4794C67.2099 25.1641 67.8823 25.5623 68.2333 26.2029L77.6407 43.3688C78.0531 44.1213 77.9395 45.053 77.3583 45.6844L50.4689 74.8986C49.6767 75.7594 48.3181 75.7594 47.5258 74.8986L20.6365 45.6844C20.0553 45.053 19.9417 44.1213 20.3541 43.3688L29.7615 26.2029Z"
        fill="#FFA522"
      ></path>
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M49 93C73.3005 93 93 73.3005 93 49C93 24.6995 73.3005 5 49 5C24.6995 5 5 24.6995 5 49C5 73.3005 24.6995 93 49 93ZM31.5154 25.168C30.7849 25.168 30.1125 25.5662 29.7615 26.2068L20.3541 43.3727C19.9417 44.1252 20.0553 45.0569 20.6365 45.6883L47.5258 74.9025C48.3181 75.7633 49.6767 75.7633 50.4689 74.9025L77.3583 45.6883C77.9395 45.0569 78.0531 44.1252 77.6407 43.3727L68.2333 26.2068C67.8823 25.5662 67.2099 25.168 66.4794 25.168H31.5154Z"
      fill="url(#paint0_linear_2239_90691)"
    ></path>
    <defs>
      <filter
        id="filter0_i_2239_90691"
        x="20.1094"
        y="25.1641"
        width="57.7773"
        height="54.3809"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        ></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.941176 0 0 0 0 0.482353 0 0 0 0 0.054902 0 0 0 0.25 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_2239_90691"
        ></feBlend>
      </filter>
      <linearGradient
        id="paint0_linear_2239_90691"
        x1="49"
        y1="5"
        x2="49"
        y2="93"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFF670"></stop>
        <stop offset="1" stopColor="#FFD93E"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-pointsSmallIncon"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_i_2239_90697)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4318 11.824C12.7829 11.1834 13.4553 10.7852 14.1857 10.7852H27.8165C28.547 10.7852 29.2193 11.1834 29.5704 11.824L32.8825 17.8677C33.2949 18.6202 33.1813 19.5519 32.6002 20.1833L22.4727 31.1864C21.6804 32.0471 20.3218 32.0471 19.5296 31.1864L9.40208 20.1833C8.82095 19.5519 8.70734 18.6202 9.11974 17.8677L12.4318 11.824Z"
        fill="#FFA522"
      ></path>
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.0017 39.8549C31.4162 39.8549 39.8588 31.4123 39.8588 20.9978C39.8588 10.5833 31.4162 2.14062 21.0017 2.14062C10.5872 2.14062 2.14453 10.5833 2.14453 20.9978C2.14453 31.4123 10.5872 39.8549 21.0017 39.8549ZM14.1857 10.7812C13.4553 10.7812 12.7829 11.1795 12.4318 11.8201L9.11974 17.8638C8.70734 18.6163 8.82095 19.548 9.40208 20.1794L19.5296 31.1825C20.3218 32.0432 21.6804 32.0432 22.4727 31.1825L32.6002 20.1794C33.1813 19.548 33.2949 18.6163 32.8825 17.8638L29.5704 11.8201C29.2193 11.1795 28.547 10.7812 27.8165 10.7812H14.1857Z"
      fill="url(#paint0_linear_2239_90697)"
    ></path>
    <defs>
      <filter
        id="filter0_i_2239_90697"
        x="8.875"
        y="10.7852"
        width="24.2539"
        height="25.0469"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        ></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.941176 0 0 0 0 0.482353 0 0 0 0 0.054902 0 0 0 0.25 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_2239_90697"
        ></feBlend>
      </filter>
      <linearGradient
        id="paint0_linear_2239_90697"
        x1="21.0017"
        y1="2.14062"
        x2="21.0017"
        y2="39.8549"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFF670"></stop>
        <stop offset="1" stopColor="#FFD93E"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-productCode"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M17.325 49.25C19.375 47.05 22.5 47.225 24.3 49.625L26.825 53C28.85 55.675 32.125 55.675 34.15 53L36.675 49.625C38.475 47.225 41.6 47.05 43.65 49.25C48.1 54 51.725 52.425 51.725 45.775V17.6C51.75 7.525 49.4 5 39.95 5H21.05C11.6 5 9.25 7.525 9.25 17.6V45.75C9.25 52.425 12.9 53.975 17.325 49.25Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M41.0756 29.375H27.3256C26.3006 29.375 25.4506 28.525 25.4506 27.5C25.4506 26.475 26.3006 25.625 27.3256 25.625H41.0756C42.1006 25.625 42.9506 26.475 42.9506 27.5C42.9506 28.525 42.1006 29.375 41.0756 29.375ZM41.0756 19.375H27.3256C26.3006 19.375 25.4506 18.525 25.4506 17.5C25.4506 16.475 26.3006 15.625 27.3256 15.625H41.0756C42.1006 15.625 42.9506 16.475 42.9506 17.5C42.9506 18.525 42.1006 19.375 41.0756 19.375ZM19.9531 20C18.5781 20 17.4531 18.875 17.4531 17.5C17.4531 16.125 18.5781 15 19.9531 15C21.3281 15 22.4531 16.125 22.4531 17.5C22.4531 18.875 21.3281 20 19.9531 20ZM19.9531 30C18.5781 30 17.4531 28.875 17.4531 27.5C17.4531 26.125 18.5781 25 19.9531 25C21.3281 25 22.4531 26.125 22.4531 27.5C22.4531 28.875 21.3281 30 19.9531 30Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-rechargeHistory"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M70 23.3346V56.668C70 66.668 65 73.3346 53.3333 73.3346H26.6667C15 73.3346 10 66.668 10 56.668V23.3346C10 13.3346 15 6.66797 26.6667 6.66797H53.3333C65 6.66797 70 13.3346 70 23.3346Z"
      fill="#F95959"
    ></path>
    <path
      d="M51.6667 6.66797V32.868C51.6667 34.3346 49.9333 35.068 48.8667 34.1013L41.1333 26.968C40.8266 26.6792 40.4213 26.5184 40 26.5184C39.5787 26.5184 39.1734 26.6792 38.8667 26.968L31.1333 34.1013C30.8949 34.3225 30.5969 34.4691 30.2761 34.523C29.9553 34.5768 29.6258 34.5357 29.3281 34.4046C29.0305 34.2735 28.7777 34.0581 28.6009 33.7851C28.4241 33.512 28.3311 33.1932 28.3333 32.868V6.66797H51.6667ZM58.3333 49.168H44.1667C42.8 49.168 41.6667 48.0346 41.6667 46.668C41.6667 45.3013 42.8 44.168 44.1667 44.168H58.3333C59.7 44.168 60.8333 45.3013 60.8333 46.668C60.8333 48.0346 59.7 49.168 58.3333 49.168ZM58.3333 62.5013H30C28.6333 62.5013 27.5 61.368 27.5 60.0013C27.5 58.6346 28.6333 57.5013 30 57.5013H58.3333C59.7 57.5013 60.8333 58.6346 60.8333 60.0013C60.8333 61.368 59.7 62.5013 58.3333 62.5013Z"
      fill="#F95959"
    ></path>
  </symbol>
  <symbol
    id="icon-rechargeIcon"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.8"
      d="M32.25 6.29534L32.175 6.47034L24.925 23.2953H17.8C16.1 23.2953 14.5 23.6203 13 24.2703L17.375 13.8203L17.475 13.5953L17.625 13.1953C17.7 13.0203 17.75 12.8703 17.825 12.7453C21.1 5.17034 24.8 3.44534 32.25 6.29534Z"
      fill="#F87700"
    ></path>
    <path
      d="M45.7219 23.8008C44.5969 23.4758 43.4219 23.3008 42.1969 23.3008H24.9219L32.1719 6.47578L32.2469 6.30078C32.5969 6.42578 32.9719 6.60078 33.3469 6.72578L38.8719 9.05078C41.9469 10.3258 44.0969 11.6508 45.4219 13.2508C45.6469 13.5508 45.8469 13.8258 46.0469 14.1508C46.2719 14.5008 46.4469 14.8508 46.5469 15.2258C46.6469 15.4508 46.7219 15.6508 46.7719 15.8758C47.4219 18.0008 47.0219 20.5758 45.7219 23.8008Z"
      fill="#F87700"
    ></path>
    <path
      opacity="0.4"
      d="M54.3938 35.5008V40.3758C54.3938 40.8758 54.3688 41.3758 54.3438 41.8508C53.8688 50.6008 48.9938 55.0008 39.7438 55.0008H20.2437C19.6187 55.0008 19.0437 54.9508 18.4688 54.8758C10.5188 54.3508 6.26875 50.1008 5.71875 42.1508C5.64375 41.5508 5.59375 40.9758 5.59375 40.3758V35.5008C5.59375 30.4758 8.64375 26.1508 12.9938 24.2758C14.4938 23.6258 16.0938 23.3008 17.7938 23.3008H42.1938C43.4188 23.3008 44.5938 23.4758 45.7188 23.8008C48.2264 24.5659 50.4225 26.1154 51.984 28.2215C53.5455 30.3275 54.3902 32.879 54.3938 35.5008Z"
      fill="#F87700"
    ></path>
    <path
      opacity="0.6"
      d="M17.3687 13.8281L12.9938 24.2781C10.799 25.2223 8.92876 26.7884 7.61374 28.7831C6.29873 30.7778 5.59651 33.1139 5.59375 35.5031V28.1781C5.59375 21.0781 10.6438 15.1531 17.3687 13.8281ZM54.3988 28.1756V35.5006C54.3952 32.8788 53.5505 30.3273 51.989 28.2213C50.4275 26.1153 48.2314 24.5658 45.7238 23.8006C47.0238 20.5756 47.4238 18.0006 46.7738 15.8756C46.7238 15.6506 46.6488 15.4506 46.5488 15.2256C48.9163 16.46 50.8999 18.32 52.284 20.6033C53.6681 22.8866 54.3995 25.5056 54.3988 28.1756Z"
      fill="#F87700"
    ></path>
  </symbol>
  <symbol
    id="icon-statsIcon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M53 56.875H8C6.975 56.875 6.125 56.025 6.125 55C6.125 53.975 6.975 53.125 8 53.125H53C54.025 53.125 54.875 53.975 54.875 55C54.875 56.025 54.025 56.875 53 56.875Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M14.5 20.9475H10.5C9.125 20.9475 8 22.0725 8 23.4475V44.9975C8 46.3725 9.125 47.4975 10.5 47.4975H14.5C15.875 47.4975 17 46.3725 17 44.9975V23.4475C17 22.0475 15.875 20.9475 14.5 20.9475ZM32.5 12.9775H28.5C27.125 12.9775 26 14.1025 26 15.4775V45.0025C26 46.3775 27.125 47.5025 28.5 47.5025H32.5C33.875 47.5025 35 46.3775 35 45.0025V15.4775C35 14.1025 33.875 12.9775 32.5 12.9775ZM50.5 5H46.5C45.125 5 44 6.125 44 7.5V45C44 46.375 45.125 47.5 46.5 47.5H50.5C51.875 47.5 53 46.375 53 45V7.5C53 6.125 51.875 5 50.5 5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-tournament"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M14.25 7.5V52.5"
      stroke="var(--main-color)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M14.25 11.25H31.75L40.5 15H49.25C50.6307 15 51.75 16.1193 51.75 17.5V38.75C51.75 40.1308 50.6307 41.25 49.25 41.25H40.5L31.75 37.5H14.25V11.25Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M9.25 52.5H19.25"
      stroke="var(--main-color)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-tradeHistory"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M54.2259 73.1178H18.4859C12.7419 73.1178 8.08594 68.4617 8.08594 62.7177V16.9937C8.08594 11.2497 12.7419 6.59375 18.4859 6.59375H54.2259C59.9699 6.59375 64.6259 11.2497 64.6259 16.9937V62.7177C64.6259 68.4617 59.9699 73.1178 54.2259 73.1178Z"
      fill="#4BE2AC"
    ></path>
    <path
      d="M49.1703 25.4703H23.7703C22.0023 25.4703 20.5703 24.0383 20.5703 22.2703C20.5703 20.5023 22.0023 19.0703 23.7703 19.0703H49.1703C50.9383 19.0703 52.3703 20.5023 52.3703 22.2703C52.3703 24.0383 50.9383 25.4703 49.1703 25.4703ZM49.1703 38.1583H23.7703C22.0023 38.1583 20.5703 36.7263 20.5703 34.9583C20.5703 33.1903 22.0023 31.7583 23.7703 31.7583H49.1703C50.9383 31.7583 52.3703 33.1903 52.3703 34.9583C52.3703 36.7263 50.9383 38.1583 49.1703 38.1583ZM35.9343 50.8463H23.7703C22.0023 50.8463 20.5703 49.4143 20.5703 47.6463C20.5703 45.8783 22.0023 44.4463 23.7703 44.4463H35.9343C37.7023 44.4463 39.1343 45.8783 39.1343 47.6463C39.1343 49.4143 37.6983 50.8463 35.9343 50.8463Z"
      fill="var(--bg_color_L2)"
    ></path>
    <path
      d="M42.5 58.008C42.5 61.9438 44.0635 65.7184 46.8465 68.5014C49.6296 71.2845 53.4042 72.848 57.34 72.848C61.2758 72.848 65.0504 71.2845 67.8334 68.5014C70.6165 65.7184 72.18 61.9438 72.18 58.008C72.18 54.0722 70.6165 50.2975 67.8334 47.5145C65.0504 44.7315 61.2758 43.168 57.34 43.168C53.4042 43.168 49.6296 44.7315 46.8465 47.5145C44.0635 50.2975 42.5 54.0722 42.5 58.008Z"
      fill="#4BE2AC"
    ></path>
    <path
      d="M57.8205 43.1875C49.6245 43.1875 42.9805 49.8315 42.9805 58.0275C42.9805 65.8395 49.0165 72.2355 56.6805 72.8195C61.2405 71.7195 64.6325 67.6115 64.6325 62.7115V44.8395C62.5264 43.7526 60.1905 43.1862 57.8205 43.1875Z"
      fill="#06CC76"
    ></path>
    <path
      d="M51.25 54.375H63.75"
      stroke="var(--bg_color_L2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M51.25 61.875H63.75"
      stroke="var(--bg_color_L2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M63.75 54.375L59.375 50"
      stroke="var(--bg_color_L2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M55.625 66.25L51.25 61.875"
      stroke="var(--bg_color_L2)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-vault"
    viewBox="0 0 98 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M83.7096 8.16406H14.293C10.9102 8.16406 8.16797 10.9063 8.16797 14.2891V83.7057C8.16797 87.0886 10.9102 89.8307 14.293 89.8307H83.7096C87.0925 89.8307 89.8346 87.0886 89.8346 83.7057V14.2891C89.8346 10.9063 87.0925 8.16406 83.7096 8.16406Z"
      fill="url(#paint0_linear_2239_90668)"
    ></path>
    <path
      d="M24.5013 28.5807C26.7565 28.5807 28.5846 26.7526 28.5846 24.4974C28.5846 22.2422 26.7565 20.4141 24.5013 20.4141C22.2461 20.4141 20.418 22.2422 20.418 24.4974C20.418 26.7526 22.2461 28.5807 24.5013 28.5807Z"
      fill="#FFA522"
    ></path>
    <path
      d="M24.5013 77.5807C26.7565 77.5807 28.5846 75.7526 28.5846 73.4974C28.5846 71.2422 26.7565 69.4141 24.5013 69.4141C22.2461 69.4141 20.418 71.2422 20.418 73.4974C20.418 75.7526 22.2461 77.5807 24.5013 77.5807Z"
      fill="#FFA522"
    ></path>
    <path
      d="M73.5013 28.5807C75.7565 28.5807 77.5846 26.7526 77.5846 24.4974C77.5846 22.2422 75.7565 20.4141 73.5013 20.4141C71.2461 20.4141 69.418 22.2422 69.418 24.4974C69.418 26.7526 71.2461 28.5807 73.5013 28.5807Z"
      fill="#FFA522"
    ></path>
    <path
      d="M73.5013 77.5807C75.7565 77.5807 77.5846 75.7526 77.5846 73.4974C77.5846 71.2422 75.7565 69.4141 73.5013 69.4141C71.2461 69.4141 69.418 71.2422 69.418 73.4974C69.418 75.7526 71.2461 77.5807 73.5013 77.5807Z"
      fill="#FFA522"
    ></path>
    <g filter="url(#filter0_i_2239_90668)">
      <path
        d="M49 67.375C59.1483 67.375 67.375 59.1483 67.375 49C67.375 38.8517 59.1483 30.625 49 30.625C38.8517 30.625 30.625 38.8517 30.625 49C30.625 59.1483 38.8517 67.375 49 67.375Z"
        fill="#FFA522"
      ></path>
    </g>
    <path
      d="M49 67.375C59.1483 67.375 67.375 59.1483 67.375 49C67.375 38.8517 59.1483 30.625 49 30.625C38.8517 30.625 30.625 38.8517 30.625 49C30.625 59.1483 38.8517 67.375 49 67.375Z"
      stroke="#FFA522"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <defs>
      <filter
        id="filter0_i_2239_90668"
        x="29.625"
        y="29.625"
        width="38.75"
        height="42.75"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        ></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.941667 0 0 0 0 0.48105 0 0 0 0 0.0558645 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_2239_90668"
        ></feBlend>
      </filter>
      <linearGradient
        id="paint0_linear_2239_90668"
        x1="49.0013"
        y1="8.16406"
        x2="49.0013"
        y2="89.8307"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFF976"></stop>
        <stop offset="1" stopColor="#FFD435"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-versionUpdateIcon"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.2"
      d="M0 20C0 8.95431 8.95431 0 20 0H60C71.0457 0 80 8.95431 80 20V60C80 71.0457 71.0457 80 60 80H20C8.95431 80 0 71.0457 0 60V20Z"
      fill="var(--main-color)"
    ></path>
    <circle
      opacity="0.5"
      cx="40.5"
      cy="40.5"
      r="20.5"
      fill="var(--main-color)"
    ></circle>
    <path
      d="M67 40.5C67 36.8886 66.2887 33.3127 64.9067 29.9762C63.5247 26.6398 61.4991 23.6082 58.9454 21.0546C56.3918 18.501 53.3602 16.4753 50.0238 15.0933C46.6873 13.7113 43.1114 13 39.5 13C35.8886 13 32.3127 13.7113 28.9762 15.0933C25.6398 16.4753 22.6082 18.501 20.0546 21.0546C17.501 23.6082 15.4753 26.6398 14.0933 29.9762C12.7113 33.3127 12 36.8886 12 40.5C12.0004 47.7935 14.8981 54.788 20.0557 59.945C25.2132 65.102 32.2081 67.9989 39.5015 67.9985C46.795 67.9981 53.7896 65.1004 58.9465 59.9428C64.1035 54.7853 67.0004 47.7904 67 40.4969V40.5ZM43.4233 53.1271C39.3587 57.4621 34.2249 58.8538 33.6135 55.5849C33.1496 53.1271 35.5798 44.1867 36.0652 40.8287C36.228 39.7258 34.8363 40.8287 34.8363 40.8287C34.8363 40.8287 30.8485 43.6368 29.9329 42.0577C29.7885 41.8057 30.7716 41.0346 31.1618 40.8287C31.1618 40.8287 39.4816 34.7149 42.2005 35.9069C44.9195 37.099 41.2451 44.6322 40.9716 45.7475C40.7013 46.8627 38.9746 55.3944 44.6522 50.6631C44.6522 50.6631 47.4849 48.7798 43.4233 53.124V53.1271ZM41.3434 32.211C40.2067 32.146 39.1422 31.6326 38.3836 30.7836C37.625 29.9346 37.2343 28.8193 37.2972 27.6824C37.3575 26.5447 37.8671 25.4775 38.714 24.7153C39.5608 23.9531 40.6757 23.5584 41.8134 23.6178C44.1822 23.7468 45.9917 25.7807 45.8627 28.1464C45.8328 28.7103 45.6921 29.2627 45.4487 29.7722C45.2052 30.2817 44.8637 30.7383 44.4437 31.1157C44.0237 31.4932 43.5335 31.7842 43.001 31.9722C42.4685 32.1601 41.9042 32.2412 41.3403 32.211H41.3434Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-wallets"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M37.5 15.3789H15C9.475 15.3789 5 19.8539 5 25.3789V16.3539C5 11.2539 9.125 7.12891 14.225 7.12891H28.275C33.375 7.12891 37.5 10.2789 37.5 15.3789Z"
      fill="#F95959"
    ></path>
    <path
      opacity="0.4"
      d="M43.7 30.4961C42.45 31.7211 41.85 33.5711 42.35 35.4461C42.975 37.7711 45.275 39.2461 47.675 39.2461H50V42.8711C50 48.3961 45.525 52.8711 40 52.8711H15C9.475 52.8711 5 48.3961 5 42.8711V25.3711C5 19.8461 9.475 15.3711 15 15.3711H40C45.5 15.3711 50 19.8711 50 25.3711V28.9961H47.3C45.9 28.9961 44.625 29.5461 43.7 30.4961Z"
      fill="#F95959"
    ></path>
    <path
      d="M55 31.5561V36.7061C55 38.1061 53.85 39.2561 52.425 39.2561H47.6C44.9 39.2561 42.425 37.2811 42.2 34.5811C42.05 33.0061 42.65 31.5311 43.7 30.5061C44.625 29.5561 45.9 29.0061 47.3 29.0061H52.425C53.85 29.0061 55 30.1561 55 31.5561ZM32.5 29.7461H17.5C16.475 29.7461 15.625 28.8961 15.625 27.8711C15.625 26.8461 16.475 25.9961 17.5 25.9961H32.5C33.525 25.9961 34.375 26.8461 34.375 27.8711C34.375 28.8961 33.525 29.7461 32.5 29.7461Z"
      fill="#F95959"
    ></path>
  </symbol>
  <symbol
    id="icon-weal4"
    viewBox="0 0 48 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_4808_6957)">
      <rect
        opacity="0.4"
        x="4"
        y="4.42969"
        width="40"
        height="40"
        rx="4"
        fill="var(--main-color)"
      ></rect>
      <path
        d="M12 14.4297C13.1046 14.4297 14 13.5343 14 12.4297C14 11.3251 13.1046 10.4297 12 10.4297C10.8954 10.4297 10 11.3251 10 12.4297C10 13.5343 10.8954 14.4297 12 14.4297Z"
        fill="weal4"
      ></path>
      <path
        d="M12 38.4297C13.1046 38.4297 14 37.5343 14 36.4297C14 35.3251 13.1046 34.4297 12 34.4297C10.8954 34.4297 10 35.3251 10 36.4297C10 37.5343 10.8954 38.4297 12 38.4297Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M36 14.4297C37.1046 14.4297 38 13.5343 38 12.4297C38 11.3251 37.1046 10.4297 36 10.4297C34.8954 10.4297 34 11.3251 34 12.4297C34 13.5343 34.8954 14.4297 36 14.4297Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M36 38.4297C37.1046 38.4297 38 37.5343 38 36.4297C38 35.3251 37.1046 34.4297 36 34.4297C34.8954 34.4297 34 35.3251 34 36.4297C34 37.5343 34.8954 38.4297 36 38.4297Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M24 33.4297C28.9706 33.4297 33 29.4003 33 24.4297C33 19.4591 28.9706 15.4297 24 15.4297C19.0294 15.4297 15 19.4591 15 24.4297C15 29.4003 19.0294 33.4297 24 33.4297Z"
        fill="var(--main-color)"
        stroke="var(--main-color)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_4808_6957">
        <rect
          y="0.429688"
          width="48"
          height="48"
          rx="16"
          fill="white"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-weal5"
    viewBox="0 0 48 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.14063 11.5725C6.14062 12.5106 6.60251 13.4394 7.49992 14.306C8.39732 15.1726 9.71267 15.96 11.3709 16.6233C13.029 17.2866 14.9976 17.8127 17.1641 18.1717C19.3307 18.5306 21.6527 18.7154 23.9978 18.7154C26.3428 18.7154 28.6649 18.5306 30.8314 18.1717C32.9979 17.8127 34.9665 17.2866 36.6247 16.6233C38.2829 15.96 39.5982 15.1726 40.4956 14.306C41.393 13.4394 41.8549 12.5106 41.8549 11.5725C41.8549 10.6345 41.393 9.7057 40.4956 8.83909C39.5982 7.97248 38.2829 7.18506 36.6247 6.52178C34.9665 5.85851 32.9979 5.33237 30.8314 4.97341C28.6649 4.61444 26.3428 4.42969 23.9978 4.42969C21.6527 4.42969 19.3307 4.61444 17.1641 4.97341C14.9976 5.33237 13.029 5.85851 11.3709 6.52178C9.71267 7.18506 8.39732 7.97248 7.49992 8.83909C6.60251 9.7057 6.14062 10.6345 6.14063 11.5725Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M40.3692 17.2891C37.6138 19.8118 31.3192 21.5748 23.9978 21.5748C16.6763 21.5748 10.3817 19.8118 7.62634 17.2891C6.67098 18.1641 6.14062 19.1301 6.14062 20.1462C6.14062 24.0913 14.1357 27.2891 23.9978 27.2891C33.8598 27.2891 41.8549 24.0913 41.8549 20.1462C41.8549 19.1301 41.3246 18.1641 40.3692 17.2891Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M40.3692 25.8555C37.6138 28.3782 31.3192 30.1412 23.9978 30.1412C16.6763 30.1412 10.3817 28.3782 7.62634 25.8555C6.67098 26.7305 6.14062 27.6965 6.14062 28.7126C6.14062 32.6577 14.1357 35.8555 23.9978 35.8555C33.8598 35.8555 41.8549 32.6577 41.8549 28.7126C41.8549 27.6965 41.3246 26.7305 40.3692 25.8555Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M40.3692 34.4297C37.6138 36.9525 31.3192 38.7154 23.9978 38.7154C16.6763 38.7154 10.3817 36.9525 7.62634 34.4297C6.67098 35.3047 6.14062 36.2708 6.14062 37.2868C6.14062 41.2319 14.1357 44.4297 23.9978 44.4297C33.8598 44.4297 41.8549 41.2319 41.8549 37.2868C41.8549 36.2708 41.3246 35.3047 40.3692 34.4297Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-widthdrawBlue"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M55 22.5V41.15C55 46.875 50.35 51.5 44.625 51.5H15.375C9.65 51.5 5 46.875 5 41.15V22.5H55Z"
      fill="#5CA6FF"
    ></path>
    <path
      d="M55 18.8461V22.4961H5V18.8461C5 13.1211 9.65 8.49609 15.375 8.49609H44.625C50.35 8.49609 55 13.1211 55 18.8461ZM20 43.1261H15C13.975 43.1261 13.125 42.2761 13.125 41.2511C13.125 40.2261 13.975 39.3761 15 39.3761H20C21.025 39.3761 21.875 40.2261 21.875 41.2511C21.875 42.2761 21.025 43.1261 20 43.1261ZM36.25 43.1261H26.25C25.225 43.1261 24.375 42.2761 24.375 41.2511C24.375 40.2261 25.225 39.3761 26.25 39.3761H36.25C37.275 39.3761 38.125 40.2261 38.125 41.2511C38.125 42.2761 37.275 43.1261 36.25 43.1261Z"
      fill="#5CA6FF"
    ></path>
  </symbol>
  <symbol
    id="icon-ArPayBackground"
    viewBox="0 0 131 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="k">
      <g id="Rectangle 6678" filter="url(#filter0_d_1246_6363)">
        <path
          d="M4 2H127V38L65.5 48L4 38V2Z"
          fill="url(#paint0_linear_1246_6363)"
        ></path>
      </g>
      <path
        id="Subtract"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2H6V36.4348L65.5 46L125 36.4348V2H124V35.5L65.5 44.5L7 35.5V2Z"
        fill="url(#paint1_linear_1246_6363)"
      ></path>
    </g>
    <defs>
      <filter
        id="filter0_d_1246_6363"
        x="0"
        y="0"
        width="131"
        height="54"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="2"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.525 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1246_6363"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1246_6363"
          result="shape"
        ></feBlend>
      </filter>
      <linearGradient
        id="paint0_linear_1246_6363"
        x1="65.5"
        y1="2"
        x2="65.5"
        y2="48"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9E9F"></stop>
        <stop offset="0.0686938" stopColor="#EE2526"></stop>
        <stop offset="0.494792" stopColor="#FF3E3F"></stop>
        <stop offset="1" stopColor="#FF3839"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_1246_6363"
        x1="65.5"
        y1="2"
        x2="65.5"
        y2="46"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0405212" stopColor="white"></stop>
        <stop offset="0.0644429" stopColor="#FFA6A6"></stop>
        <stop offset="1" stopColor="#FFC2C3"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-Circle1"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="10"
      cy="10"
      r="9.4"
      stroke="var(--main-color)"
      strokeWidth="1.2"
    ></circle>
    <circle cx="10" cy="10" r="5" fill="var(--main-color)"></circle>
  </symbol>
  <symbol
    id="icon-Circle2"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.7">
      <circle
        cx="10"
        cy="10"
        r="9.4"
        stroke="var(--main-color)"
        strokeWidth="1.2"
      ></circle>
      <circle cx="10" cy="10" r="5" fill="var(--main-color)"></circle>
    </g>
  </symbol>
  <symbol
    id="icon-Language"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M19.7721 52.275C19.6971 52.275 19.5971 52.325 19.5221 52.325C14.6721 49.925 10.7221 45.95 8.29711 41.1C8.29711 41.025 8.34711 40.925 8.34711 40.85C11.3971 41.75 14.5471 42.425 17.6721 42.95C18.2221 46.1 18.8721 49.225 19.7721 52.275ZM52.9996 41.125C50.5246 46.1 46.3996 50.125 41.3746 52.55C42.3246 49.375 43.1246 46.175 43.6496 42.95C46.7996 42.425 49.8996 41.75 52.9496 40.85C52.9246 40.95 52.9996 41.05 52.9996 41.125ZM53.1996 19.275C50.0496 18.325 46.8746 17.55 43.6496 17C43.1246 13.775 42.3496 10.575 41.3746 7.44995C46.5496 9.92495 50.7246 14.1 53.1996 19.275ZM19.7746 7.72245C18.8746 10.7725 18.2246 13.8725 17.6996 17.0225C14.4746 17.5225 11.2746 18.3225 8.09961 19.2725C10.5246 14.2475 14.5496 10.1225 19.5246 7.64745C19.5996 7.64745 19.6996 7.72245 19.7746 7.72245Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M39.3804 16.475C33.5804 15.825 27.7304 15.825 21.9304 16.475C22.5554 13.05 23.3554 9.625 24.4804 6.325C24.5304 6.125 24.5054 5.975 24.5304 5.775C26.5054 5.3 28.5304 5 30.6554 5C32.7554 5 34.8054 5.3 36.7554 5.775C36.7804 5.975 36.7804 6.125 36.8304 6.325C37.9554 9.65 38.7554 13.05 39.3804 16.475ZM17.1254 38.73C13.6754 38.105 10.2754 37.305 6.97539 36.18C6.77539 36.13 6.62539 36.155 6.42539 36.13C5.95039 34.155 5.65039 32.13 5.65039 30.005C5.65039 27.905 5.95039 25.855 6.42539 23.905C6.62539 23.88 6.77539 23.88 6.97539 23.83C10.3004 22.73 13.6754 21.905 17.1254 21.28C16.5004 27.08 16.5004 32.93 17.1254 38.73ZM55.6504 30.005C55.6504 32.13 55.3504 34.155 54.8754 36.13C54.6754 36.155 54.5254 36.13 54.3254 36.18C51.0004 37.28 47.6004 38.105 44.1754 38.73C44.8254 32.93 44.8254 27.08 44.1754 21.28C47.6004 21.905 51.0254 22.705 54.3254 23.83C54.5254 23.88 54.6754 23.905 54.8754 23.905C55.3504 25.88 55.6504 27.905 55.6504 30.005ZM39.3804 43.525C38.7554 46.975 37.9554 50.375 36.8304 53.675C36.7804 53.875 36.7804 54.025 36.7554 54.225C34.8054 54.7 32.7554 55 30.6554 55C28.5304 55 26.5054 54.7 24.5304 54.225C24.5054 54.025 24.5304 53.875 24.4804 53.675C23.3933 50.3557 22.5412 46.964 21.9304 43.525C24.8304 43.85 27.7304 44.075 30.6554 44.075C33.5804 44.075 36.5054 43.85 39.3804 43.525ZM40.0579 39.4075C33.811 40.1964 27.4898 40.1964 21.2429 39.4075C20.4541 33.1606 20.4541 26.8394 21.2429 20.5925C27.4898 19.8037 33.811 19.8037 40.0579 20.5925C40.8468 26.8394 40.8468 33.1606 40.0579 39.4075Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-Line"
    viewBox="0 0 2 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L0.999999 21"
      stroke="#888888"
      strokeLinecap="round"
    ></path>
  </symbol>
  <symbol
    id="icon-commission"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M40.475 5H19.525C10.425 5 5 10.425 5 19.525V40.45C5 49.575 10.425 55 19.525 55H40.45C49.55 55 54.975 49.575 54.975 40.475V19.525C55 10.425 49.575 5 40.475 5Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M35.6504 30L31.8754 28.675V20.2H32.7754C34.8004 20.2 36.4504 21.975 36.4504 24.15C36.4504 25.175 37.3004 26.025 38.3254 26.025C39.3504 26.025 40.2004 25.175 40.2004 24.15C40.2004 19.9 36.8754 16.45 32.7754 16.45H31.8754V15C31.8754 13.975 31.0254 13.125 30.0004 13.125C28.9754 13.125 28.1254 13.975 28.1254 15V16.45H26.5004C22.8004 16.45 19.7754 19.575 19.7754 23.4C19.7754 27.875 22.3754 29.3 24.3504 30L28.1254 31.325V39.775H27.2254C25.2004 39.775 23.5504 38 23.5504 35.825C23.5504 34.8 22.7004 33.95 21.6754 33.95C20.6504 33.95 19.8004 34.8 19.8004 35.825C19.8004 40.075 23.1254 43.525 27.2254 43.525H28.1254V45C28.1254 46.025 28.9754 46.875 30.0004 46.875C31.0254 46.875 31.8754 46.025 31.8754 45V43.55H33.5004C37.2004 43.55 40.2254 40.425 40.2254 36.6C40.2004 32.1 37.6004 30.675 35.6504 30ZM25.6004 26.475C24.3254 26.025 23.5504 25.6 23.5504 23.425C23.5504 21.65 24.8754 20.225 26.5254 20.225H28.1504V27.375L25.6004 26.475ZM33.5004 39.8H31.8754V32.65L34.4004 33.525C35.6754 33.975 36.4504 34.4 36.4504 36.575C36.4504 38.35 35.1254 39.8 33.5004 39.8Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-copy_Code"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M40.475 5H19.525C10.425 5 5 10.425 5 19.525V40.45C5 49.575 10.425 55 19.525 55H40.45C49.55 55 54.975 49.575 54.975 40.475V19.525C55 10.425 49.575 5 40.475 5Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M53.25 30.5751H44.55C42.1 30.5751 39.925 31.9251 38.825 34.1251L36.725 38.2751C36.225 39.2751 35.225 39.9001 34.125 39.9001H25.925C25.15 39.9001 24.05 39.7251 23.325 38.2751L21.225 34.1501C20.6935 33.0859 19.8767 32.1904 18.8657 31.5636C17.8548 30.9367 16.6895 30.6031 15.5 30.6001H6.75C5.775 30.6001 5 31.3751 5 32.3501V40.5001C5 49.5751 10.45 55.0001 19.55 55.0001H40.5C49.075 55.0001 54.35 50.3001 55 41.9501V32.3251C55 31.3751 54.225 30.5751 53.25 30.5751ZM33.875 19.4951H26.125C25.15 19.4951 24.375 18.7201 24.375 17.7451C24.375 16.7701 25.15 15.9951 26.125 15.9951H33.875C34.85 15.9951 35.625 16.7701 35.625 17.7451C35.625 18.7201 34.825 19.4951 33.875 19.4951ZM35.8225 26.4776H24.1725C23.1975 26.4776 22.4225 25.7026 22.4225 24.7276C22.4225 23.7526 23.1975 22.9776 24.1725 22.9776H35.7975C36.7725 22.9776 37.5475 23.7526 37.5475 24.7276C37.5475 25.7026 36.7725 26.4776 35.8225 26.4776Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-directSubordinates"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M19 20C22.866 20 26 16.866 26 13C26 9.13401 22.866 6 19 6C15.134 6 12 9.13401 12 13C12 16.866 15.134 20 19 20Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      opacity="0.4"
      d="M32.6074 7C34.6402 8.2249 35.9998 10.4537 35.9998 13C35.9998 15.5463 34.6402 17.7751 32.6074 19"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M4 40.8V42H34V40.8C34 36.3196 34 34.0794 33.1281 32.3681C32.3611 30.8628 31.1372 29.6389 29.6319 28.8719C27.9206 28 25.6804 28 21.2 28H16.8C12.3196 28 10.0794 28 8.36808 28.8719C6.86278 29.6389 5.63893 30.8628 4.87195 32.3681C4 34.0794 4 36.3196 4 40.8Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      opacity="0.4"
      d="M43.999 42.0001V40.8001C43.999 36.3197 43.999 34.0795 43.1271 32.3682C42.3601 30.8629 41.1362 29.6391 39.6309 28.8721"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-invite_reg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M52.5 17.5V42.5C52.5 50 48.75 55 40 55H20C11.25 55 7.5 50 7.5 42.5V17.5C7.5 10 11.25 5 20 5H40C48.75 5 52.5 10 52.5 17.5Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M38.75 5V24.65C38.75 25.75 37.45 26.3 36.65 25.575L30.85 20.225C30.62 20.0084 30.3159 19.8878 30 19.8878C29.6841 19.8878 29.38 20.0084 29.15 20.225L23.35 25.575C23.1711 25.7409 22.9476 25.8508 22.7071 25.8912C22.4665 25.9317 22.2193 25.9008 21.9961 25.8025C21.7728 25.7041 21.5832 25.5426 21.4507 25.3378C21.3181 25.133 21.2483 24.8939 21.25 24.65V5H38.75ZM43.75 36.875H33.125C32.1 36.875 31.25 36.025 31.25 35C31.25 33.975 32.1 33.125 33.125 33.125H43.75C44.775 33.125 45.625 33.975 45.625 35C45.625 36.025 44.775 36.875 43.75 36.875ZM43.75 46.875H22.5C21.475 46.875 20.625 46.025 20.625 45C20.625 43.975 21.475 43.125 22.5 43.125H43.75C44.775 43.125 45.625 43.975 45.625 45C45.625 46.025 44.775 46.875 43.75 46.875Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-rebateRatio"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.36"
      d="M18.75 17.9814C23.9068 20.0007 30.0104 20.0007 30.0104 20.0007C30.0104 20.0007 36.1 20.0007 41.25 17.9814C46.8773 24.5487 50.8205 33.2062 53.4121 40.4976C56.0359 47.8791 50.2508 55.0007 42.4168 55.0007H17.5246C9.71023 55.0007 3.93235 47.9117 6.54287 40.5462C9.12242 33.2679 13.0685 24.6074 18.75 17.9814Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M30 25V47"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M35.5 27C35.5 27 30.4853 27 28 27C25.5147 27 23.5 29.0147 23.5 31.5C23.5 33.9853 25.5147 36 28 36"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M24.5 45C24.5 45 29.5147 45 32 45C34.4853 45 36.5 42.9853 36.5 40.5C36.5 38.0147 34.4853 36 32 36H28"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30 20C38.9746 20 46.25 16.6421 46.25 12.5C46.25 8.35786 38.9746 5 30 5C21.0254 5 13.75 8.35786 13.75 12.5C13.75 16.6421 21.0254 20 30 20Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-server"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M13.4999 50C9.89986 44.4 10.3332 36.6667 10.9999 33.5L21.9999 21L33.9999 29.5L49.4999 33.5C49.9999 36 50.3999 42.4 47.9999 48C44.9999 55 35.9999 59 30.4999 59C24.9999 59 17.9999 57 13.4999 50Z"
      fill="var(--teshu-icon,var(--main-color))"
    ></path>
    <path
      d="M54.7158 33.4087V31.6947C54.8437 23.8926 52.5542 17.3183 48.0392 12.6498C45.8491 10.3941 43.1899 8.64749 40.2498 7.53358C39.7766 3.37668 35.2488 0 29.7361 0C24.2234 0 19.67 3.32552 19.2223 7.54637C16.2861 8.66044 13.6311 10.4072 11.4457 12.6625C6.96908 17.3183 4.61563 23.8542 4.75633 31.6692V33.754C4.03645 34.4538 3.52496 35.3397 3.27881 36.313C3.03266 37.2863 3.06152 38.3088 3.36217 39.2667C3.60387 40.1445 4.05307 40.9513 4.6719 41.6191C5.29073 42.2869 6.06105 42.7961 6.91791 43.1038C7.79515 43.6676 8.81692 43.9653 9.85972 43.9608C10.8147 48.5559 13.354 52.6694 17.0339 55.5824C20.7138 58.4955 25.3002 60.0229 29.9919 59.8977C34.6792 60.0168 39.2596 58.4866 42.9342 55.5741C46.6087 52.6615 49.1442 48.5515 50.0985 43.9608H50.3031C51.5987 43.9477 52.8518 43.497 53.8589 42.6817C54.5138 42.3061 55.0874 41.8039 55.5463 41.2044C56.0053 40.605 56.3403 39.9202 56.5321 39.1899C56.8329 38.1467 56.8212 37.0381 56.4984 36.0014C56.1756 34.9647 55.5558 34.0455 54.7158 33.3575V33.4087ZM48.7555 38.5248C48.7579 39.7582 48.6638 40.9898 48.4741 42.2085C46.7906 44.9067 44.5039 47.1774 41.7939 48.842C39.084 50.5065 36.0248 51.5196 32.8569 51.8013C32.5162 51.4174 32.0929 51.1155 31.6189 50.9184C31.1448 50.7212 30.6324 50.6339 30.1198 50.663C28.4059 50.663 27.0245 51.5967 27.0245 52.7606C27.0245 53.9245 28.3931 54.8582 30.1198 54.8582C30.7471 54.9242 31.3792 54.7903 31.9259 54.4756C32.4726 54.1609 32.9059 53.6815 33.1639 53.1059C35.3153 52.864 37.4237 52.3304 39.4312 51.5199C42.2032 50.4095 44.7125 48.7323 46.7985 46.5956C47.1439 46.2503 47.4509 45.9049 47.7578 45.534C45.2893 53.1059 38.6766 57.9663 30.0814 57.9663H29.9919C18.9154 57.9663 11.2155 49.9851 11.2155 38.576V37.4888C11.2155 37.0028 11.2922 35.6981 11.3562 34.4703C15.948 32.7947 20.0921 26.3867 21.7676 23.4321C24.4363 27.0903 28.0667 29.9371 32.2558 31.6564C34.2362 32.3468 36.2675 32.8813 38.3313 33.2552C42.3475 34.1121 46.1462 34.9307 48.7171 38.2946L48.8194 38.3841L48.7555 38.5248Z"
      fill="var(--teshu-icon,var(--main-color))"
    ></path>
  </symbol>
  <symbol
    id="icon-subordinate"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 49 48"
    fill="none"
  >
    <path
      d="M7.04203 2H23.302C24.662 2 25.762 3.12 25.762 4.5V7.24C25.762 8.24 25.142 9.48 24.522 10.1L19.222 14.84C18.482 15.46 17.982 16.72 17.982 17.7V23.06C17.982 23.8 17.482 24.8 16.882 25.18L15.162 26.3C13.562 27.3 11.342 26.18 11.342 24.18V17.56C11.342 16.68 10.842 15.56 10.362 14.94L5.68203 9.94C5.06203 9.32 4.58203 8.2 4.58203 7.44V4.58C4.58203 3.12 5.68203 2 7.04203 2Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M34.582 4H29.782C29.222 4 28.782 4.44 28.782 5V7.24C28.782 9.22 27.722 11.16 26.682 12.22L21.242 17.08C21.182 17.22 21.082 17.42 21.022 17.58V23.08C21.022 24.9 19.942 26.88 18.462 27.78L16.822 28.84C15.902 29.42 14.882 29.7 13.862 29.7C12.942 29.7 12.022 29.46 11.182 29C9.88203 28.28 8.98203 27.1 8.58203 25.74V20.42C8.58363 20.2888 8.55776 20.1588 8.5061 20.0383C8.45443 19.9177 8.37811 19.8093 8.28203 19.72L6.28203 17.72C5.64203 17.1 4.58203 17.54 4.58203 18.42V34C4.58203 39.52 9.06203 44 14.582 44H34.582C40.102 44 44.582 39.52 44.582 34V14C44.582 8.48 40.102 4 34.582 4Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M36.582 27.5H26.582C25.762 27.5 25.082 26.82 25.082 26C25.082 25.18 25.762 24.5 26.582 24.5H36.582C37.402 24.5 38.082 25.18 38.082 26C38.082 26.82 37.402 27.5 36.582 27.5ZM36.582 35.5H22.582C21.762 35.5 21.082 34.82 21.082 34C21.082 33.18 21.762 32.5 22.582 32.5H36.582C37.402 32.5 38.082 33.18 38.082 34C38.082 34.82 37.402 35.5 36.582 35.5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-teamSubordinates"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M24 20C27.866 20 31 16.866 31 13C31 9.13401 27.866 6 24 6C20.134 6 17 9.13401 17 13C17 16.866 20.134 20 24 20Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      opacity="0.4"
      d="M12 7.25488C10.1865 8.51983 9 10.6214 9 13.0002C9 15.5465 10.3596 17.7753 12.3924 19.0002"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      opacity="0.4"
      d="M36 7.25488C37.8135 8.51983 39 10.6214 39 13.0002C39 15.3789 37.8135 17.4806 36 18.7455"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M12 40V42H36V40C36 36.2725 36 34.4087 35.391 32.9385C34.5791 30.9783 33.0217 29.4209 31.0615 28.609C29.5913 28 27.7275 28 24 28C20.2725 28 18.4087 28 16.9385 28.609C14.9783 29.4209 13.4209 30.9783 12.609 32.9385C12 34.4087 12 36.2725 12 40Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      opacity="0.4"
      d="M43.999 42.0001V40.8001C43.999 36.3197 43.999 34.0795 43.1271 32.3682C42.3601 30.8629 41.1362 29.6391 39.6309 28.8721"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      opacity="0.4"
      d="M4 42.0001V40.8001C4 36.3197 4 34.0795 4.87195 32.3682C5.63893 30.8629 6.86278 29.6391 8.36807 28.8721"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-team_partner"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      d="M14.5566 14.5753C14.5566 21.6326 20.007 27.3352 26.7177 27.3352C33.4285 27.3352 38.8789 21.6326 38.8789 14.5753C38.8789 7.51804 33.4288 1.81543 26.718 1.81543C20.0073 1.81543 14.5566 7.51804 14.5566 14.5753ZM47.5079 59.0613L47.5022 59.0154C39.6097 58.7121 33.3027 52.2203 33.3027 44.2537C33.3027 38.8662 36.1699 34.1403 40.486 31.5567C37.556 29.7609 35.2561 29.2883 35.2561 29.2883L28.3249 41.2919V37.5741C31.066 33.5098 27.5686 31.6825 26.8441 31.3675C26.8127 31.3675 26.7812 31.336 26.7495 31.336H26.718C25.9935 31.6511 22.4962 33.4469 25.2373 37.5741V41.3234L18.18 29.2568C18.18 29.2568 0.347656 32.88 0.347656 59.0299H26.718V59.0613H47.5079Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M47.5081 32.0449C40.6555 32.0449 35.0488 37.6516 35.0488 44.5042C35.0488 51.3568 40.6555 56.9635 47.5081 56.9635C54.3607 56.9635 59.9674 51.3568 59.9674 44.5042C59.9674 37.6516 54.3607 32.0449 47.5081 32.0449ZM47.5081 54.4716C42.026 54.4716 37.5407 49.9863 37.5407 44.5042C37.5407 39.0221 42.026 34.5368 47.5081 34.5368C52.9902 34.5368 57.4756 39.0221 57.4756 44.5042C57.4756 49.9863 52.9902 54.4716 47.5081 54.4716Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.36"
      d="M50.0009 43.258H45.0172C44.6434 43.258 44.3942 43.0088 44.3942 42.635C44.3942 42.2612 44.6434 42.012 45.0172 42.012H51.8698V39.5202H48.755V37.0283H46.2631V39.5202H45.0172C43.2729 39.5202 41.9023 40.8907 41.9023 42.635C41.9023 44.3793 43.2729 45.7498 45.0172 45.7498H50.0009C50.3747 45.7498 50.6238 45.999 50.6238 46.3728C50.6238 46.7466 50.3747 46.9958 50.0009 46.9958H43.1483V49.4876H46.2631V51.9795H48.755V49.4876H50.0009C51.7452 49.4876 53.1157 48.1171 53.1157 46.3728C53.1157 44.6285 51.7452 43.258 50.0009 43.258Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-team_port"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M54.9744 15.0504C55.0244 15.6504 54.9744 16.2754 54.8244 16.9004L46.3994 50.7254C46.1074 51.9488 45.4098 53.0373 44.4201 53.8136C43.4305 54.5899 42.2071 55.0082 40.9494 55.0004H8.09939C4.32439 55.0004 1.64939 51.3004 2.74939 47.6754L13.2744 13.8504C13.9994 11.5004 16.1744 9.90039 18.6244 9.90039H49.3744C51.7744 9.90039 53.7244 11.3254 54.5494 13.3254C54.7929 13.8704 54.9368 14.4546 54.9744 15.0504Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M57.475 49.0503C57.5337 49.8108 57.4342 50.5752 57.183 51.2954C56.9317 52.0156 56.5341 52.6759 56.0151 53.2348C55.496 53.7938 54.8669 54.2392 54.1673 54.543C53.4677 54.8469 52.7127 55.0026 51.95 55.0003H40.95C43.55 55.0003 45.8 53.2503 46.4 50.7253L54.825 16.9003C54.975 16.2753 55.025 15.6503 54.975 15.0503L55 15.0003L57.475 49.0503ZM24.2 17.8278C24.05 17.8278 23.9 17.8028 23.75 17.7778C23.51 17.7193 23.284 17.6139 23.0849 17.4677C22.8857 17.3216 22.7174 17.1375 22.5897 16.9261C22.4619 16.7147 22.3772 16.4801 22.3403 16.2359C22.3035 15.9916 22.3153 15.7425 22.375 15.5028L24.975 4.70282C25.225 3.70282 26.225 3.10282 27.25 3.32782C28.25 3.57782 28.875 4.57782 28.625 5.60282L26.025 16.4028C25.825 17.2528 25.05 17.8278 24.2 17.8278ZM40.95 17.8553C40.825 17.8553 40.675 17.8553 40.55 17.8053C40.0672 17.6944 39.6463 17.4006 39.3758 16.9855C39.1054 16.5705 39.0065 16.0668 39.1 15.5803L41.45 4.73032C41.675 3.70532 42.675 3.08032 43.675 3.28032C44.675 3.50532 45.325 4.50532 45.125 5.50532L42.775 16.3553C42.6 17.2553 41.825 17.8553 40.95 17.8553ZM39.25 31.8753H19.25C18.225 31.8753 17.375 31.0253 17.375 30.0003C17.375 28.9753 18.225 28.1253 19.25 28.1253H39.25C40.275 28.1253 41.125 28.9753 41.125 30.0003C41.125 31.0253 40.275 31.8753 39.25 31.8753ZM36.75 41.8753H16.75C15.725 41.8753 14.875 41.0253 14.875 40.0003C14.875 38.9753 15.725 38.1253 16.75 38.1253H36.75C37.775 38.1253 38.625 38.9753 38.625 40.0003C38.625 41.0253 37.775 41.8753 36.75 41.8753Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.1855 30.0003C17.1855 28.8168 18.1449 27.8574 19.3284 27.8574H39.0427C40.2261 27.8574 41.1855 28.8168 41.1855 30.0003C41.1855 31.1837 40.2261 32.1431 39.0427 32.1431H19.3284C18.1449 32.1431 17.1855 31.1837 17.1855 30.0003Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5713 39.8567C14.5713 38.6733 15.5306 37.7139 16.7141 37.7139H36.4284C37.6119 37.7139 38.5713 38.6733 38.5713 39.8567C38.5713 41.0402 37.6119 41.9996 36.4284 41.9996H16.7141C15.5306 41.9996 14.5713 41.0402 14.5713 39.8567Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-SearchTrx"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M22.3206 29.4914C20.713 30.1573 18.99 30.5 17.25 30.5C13.7359 30.5 10.3657 29.104 7.88084 26.6192C5.39598 24.1343 4 20.7641 4 17.25C4 13.7359 5.39598 10.3657 7.88083 7.88083C10.3657 5.39598 13.7359 4 17.25 4C18.99 4 20.713 4.34272 22.3206 5.0086C23.9281 5.67447 25.3888 6.65046 26.6192 7.88083C27.8495 9.11121 28.8255 10.5719 29.4914 12.1794C30.1573 13.787 30.5 15.51 30.5 17.25C30.5 18.99 30.1573 20.713 29.4914 22.3206C28.8255 23.9281 27.8495 25.3888 26.6192 26.6192C25.3888 27.8495 23.9281 28.8255 22.3206 29.4914ZM31.95 31.9985C31.9436 31.9985 31.9355 31.9971 31.9282 31.9941C31.9242 31.9925 31.922 31.9911 31.9214 31.9906L29.1369 29.2062C29.1268 29.1953 29.1211 29.1809 29.1211 29.166C29.1211 29.152 29.1261 29.1385 29.1351 29.1279C29.1381 29.1254 29.1407 29.124 29.1432 29.123C29.1472 29.1213 29.1535 29.1197 29.1619 29.1197C29.1774 29.1197 29.1952 29.1249 29.2127 29.1404L31.9929 31.9206C31.9948 31.9226 31.9963 31.9243 31.9975 31.926C31.9989 31.928 31.9998 31.9299 32.0005 31.9317C32.0022 31.9357 32.0037 31.942 32.0037 31.9504C32.0037 31.9608 32.0014 31.9723 31.9952 31.984C31.9756 31.9955 31.9587 31.9985 31.95 31.9985Z"
      stroke="currentColor"
      strokeWidth="2"
    ></path>
  </symbol>
  <symbol
    id="icon-rule"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M29.7516 7.6875H17.8266C17.1422 7.6875 16.5938 7.13437 16.5938 6.45469V1.27969C16.5938 0.6 17.1469 0.046875 17.8266 0.046875H29.7469C30.4312 0.046875 30.9844 0.6 30.9844 1.27969V6.45C30.9844 7.13438 30.4313 7.6875 29.7516 7.6875Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M40.7938 4.64062H33.9172C33.6875 4.64062 33.5047 4.82813 33.5047 5.05313V8.58281C33.5047 9.26719 32.9516 9.81562 32.2719 9.81562H15.7063C15.0219 9.81562 14.4734 9.2625 14.4734 8.58281V5.05313C14.4734 4.82344 14.2859 4.64062 14.0609 4.64062H7.17969C5.49688 4.64062 4.13281 6.00469 4.13281 7.6875V44.9062C4.13281 46.5891 5.49688 47.9531 7.17969 47.9531H40.7938C42.4766 47.9531 43.8406 46.5891 43.8406 44.9062V7.6875C43.8406 6.00469 42.4766 4.64062 40.7938 4.64062ZM7.82656 16.9688C7.82656 16.1391 8.49688 15.4688 9.32656 15.4688H33.4203C34.25 15.4688 34.9203 16.1391 34.9203 16.9688C34.9203 17.7984 34.25 18.4688 33.4203 18.4688H9.32656C8.49688 18.4688 7.82656 17.7984 7.82656 16.9688ZM19.5922 39.1406C19.5922 39.9703 18.9219 40.6406 18.0922 40.6406H9.32656C8.49688 40.6406 7.82656 39.9703 7.82656 39.1406C7.82656 38.3109 8.49688 37.6406 9.32656 37.6406H18.0922C18.9219 37.6406 19.5922 38.3109 19.5922 39.1406ZM19.5922 31.7484C19.5922 32.5781 18.9219 33.2484 18.0922 33.2484H9.32656C8.49688 33.2484 7.82656 32.5781 7.82656 31.7484C7.82656 30.9187 8.49688 30.2484 9.32656 30.2484H18.0922C18.9219 30.2484 19.5922 30.9234 19.5922 31.7484ZM22.4984 25.8609H9.32656C8.49688 25.8609 7.82656 25.1906 7.82656 24.3609C7.82656 23.5312 8.49688 22.8609 9.32656 22.8609H22.4984C23.3281 22.8609 23.9984 23.5312 23.9984 24.3609C23.9984 25.1859 23.3281 25.8609 22.4984 25.8609ZM32.0141 43.7859C27.3547 43.7859 23.5766 41.8453 23.5766 39.45C23.5766 38.85 23.8156 38.2781 24.2422 37.7578C25.5266 39.3094 28.5219 40.4016 32.0141 40.4016C35.5063 40.4016 38.5016 39.3141 39.7859 37.7578C40.2172 38.2781 40.4516 38.85 40.4516 39.45C40.4516 41.8453 36.6734 43.7859 32.0141 43.7859ZM32.0141 38.9766C27.3547 38.9766 23.5766 37.0359 23.5766 34.6406C23.5766 34.0172 23.8344 33.4266 24.2938 32.8875C25.6016 34.4109 28.5688 35.4703 32.0141 35.4703C35.4594 35.4703 38.4219 34.4062 39.7344 32.8875C40.1938 33.4219 40.4516 34.0172 40.4516 34.6406C40.4516 37.0359 36.6734 38.9766 32.0141 38.9766ZM32.0141 34.1672C27.3547 34.1672 23.5766 32.2266 23.5766 29.8313C23.5766 27.4359 27.3547 25.4953 32.0141 25.4953C36.6734 25.4953 40.4516 27.4359 40.4516 29.8313C40.4516 32.2266 36.6734 34.1672 32.0141 34.1672Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-winningStar"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <g clipPath="url(#clip0_6360_21191)">
      <path
        d="M23.9955 47.9998C10.7874 48.0471 -0.23118 37.1883 0.00368673 23.5594C0.230542 10.3977 11.1372 -0.274265 24.5288 0.00537298C37.2674 0.271345 47.9986 10.6432 48 24.0104C48.0014 37.308 37.2675 47.9998 23.9955 47.9998ZM31.898 33.1019C31.9229 33.0378 31.9637 32.9372 32.0012 32.8354C33.1533 29.6991 34.3075 26.5635 35.4523 23.4244C35.536 23.1947 35.6523 23.088 35.8957 23.0243C37.2211 22.6772 38.0122 21.3663 37.7026 20.0709C37.4124 18.8567 36.2337 18.0384 34.9821 18.182C33.8198 18.3155 32.8786 19.3717 32.8533 20.572C32.8411 21.1496 33.0217 21.6654 33.3848 22.1331C32.2741 23.4385 31.1737 24.7319 30.0385 26.0661C29.6353 23.6602 29.2447 21.329 28.8523 18.9878C28.9398 18.952 29.0064 18.9252 29.0725 18.8975C30.322 18.3741 30.9078 17.1195 30.5141 15.8101C30.134 14.5463 28.8118 13.7321 27.5455 13.9871C26.5239 14.1927 25.8288 14.7962 25.5231 15.7839C25.2074 16.804 25.4546 17.7202 26.2156 18.4748C26.3696 18.6275 26.399 18.7449 26.3322 18.9462C25.6104 21.1204 24.8986 23.298 24.183 25.4742C24.1586 25.5481 24.1223 25.6181 24.0673 25.7465C23.2467 23.3546 22.4458 21.02 21.6468 18.6912C22.8623 17.9342 23.0229 16.5173 22.6448 15.5997C22.187 14.4887 21.0419 13.806 19.8796 13.9608C18.6987 14.118 17.751 15.0669 17.62 16.2404C17.5534 16.8374 17.6585 17.4066 17.9731 17.9268C18.3196 18.4997 18.8001 18.8909 19.5106 18.9992C19.0253 21.3552 18.5454 23.6849 18.0595 26.0437C17.9958 25.9875 17.9587 25.9614 17.9295 25.9282C16.8492 24.6989 15.7714 23.4675 14.6876 22.2414C14.5807 22.1205 14.601 22.0352 14.6673 21.905C14.8237 21.5976 15.0201 21.291 15.0871 20.961C15.3937 19.4526 13.9742 17.8363 12.2263 18.1747C11.1024 18.3924 10.2019 19.4713 10.2078 20.6228C10.214 21.8218 11.1066 22.8928 12.2555 23.0499C12.4471 23.0761 12.5109 23.1563 12.5678 23.3159C13.1845 25.044 13.8075 26.7699 14.4283 28.4965C14.9596 29.9743 15.491 31.4521 16.02 32.9307C16.0686 33.0664 16.1044 33.1693 16.298 33.1459C16.9872 33.0625 17.6799 33.0088 18.3697 32.9293C20.934 32.6341 23.5048 32.4656 26.0844 32.6334C28.007 32.7585 29.9258 32.9409 31.898 33.1019Z"
        fill="var(--main-color)"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6360_21191">
        <rect width="48" height="48" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-activityDetail"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96 96"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 5C11.5817 5 8 8.58172 8 13V80C8 84.4183 11.5817 88 16 88H56.8008C53.8078 84.5039 52 79.9631 52 75C52 63.9543 60.9543 55 72 55C76.5024 55 80.6574 56.4878 84 58.9985V13C84 8.58172 80.4183 5 76 5H75V22.382C75 23.1253 74.2177 23.6088 73.5528 23.2764L68.4472 20.7236C68.1657 20.5828 67.8343 20.5828 67.5528 20.7236L62.4472 23.2764C61.7823 23.6088 61 23.1253 61 22.382V5H16ZM18 22.5C18 21.1193 19.1193 20 20.5 20H43.5C44.8807 20 46 21.1193 46 22.5C46 23.8807 44.8807 25 43.5 25H20.5C19.1193 25 18 23.8807 18 22.5ZM18 35.5C18 34.1193 19.1193 33 20.5 33H71.5C72.8807 33 74 34.1193 74 35.5C74 36.8807 72.8807 38 71.5 38H20.5C19.1193 38 18 36.8807 18 35.5ZM20.5 46C19.1193 46 18 47.1193 18 48.5C18 49.8807 19.1193 51 20.5 51H55.5C56.8807 51 58 49.8807 58 48.5C58 47.1193 56.8807 46 55.5 46H20.5Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M56 75C56 66.1791 63.1791 59 72 59C80.8209 59 88 66.1791 88 75C88 83.8209 80.8209 91 72 91C63.1791 91 56 83.8209 56 75ZM63 77.5C64.3807 77.5 65.5 76.3807 65.5 75C65.5 73.6193 64.3807 72.5 63 72.5C61.6193 72.5 60.5 73.6193 60.5 75C60.5 76.3807 61.6193 77.5 63 77.5ZM72 77.5C73.3807 77.5 74.5 76.3807 74.5 75C74.5 73.6193 73.3807 72.5 72 72.5C70.6193 72.5 69.5 73.6193 69.5 75C69.5 76.3807 70.6193 77.5 72 77.5ZM83.5 75C83.5 76.3807 82.3807 77.5 81 77.5C79.6193 77.5 78.5 76.3807 78.5 75C78.5 73.6193 79.6193 72.5 81 72.5C82.3807 72.5 83.5 73.6193 83.5 75Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-activityIntro"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96 96"
    fill="none"
  >
    <path
      d="M72 59C63.1791 59 56 66.1791 56 75C56 83.8209 63.1791 91 72 91C80.8209 91 88 83.8209 88 75C88 66.1791 80.8209 59 72 59Z"
      fill="var(--main-color)"
    ></path>
    <circle
      cx="71.75"
      cy="84.75"
      r="1.75"
      fill="var(--text_color_L4)"
    ></circle>
    <rect
      x="70"
      y="75.5"
      width="3.5"
      height="6.5"
      rx="1.75"
      fill="var(--text_color_L4)"
    ></rect>
    <path
      d="M72 77C75.3137 77 78 74.3137 78 71C78 67.6863 75.3137 65 72 65C68.6863 65 66 67.6863 66 71C66 71.4413 66.0476 71.8715 66.1381 72.2857"
      stroke="var(--text_color_L4)"
      strokeWidth="3.5"
      strokeLinecap="round"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 13C8 8.58172 11.5817 5 16 5H76C80.4183 5 84 8.58172 84 13V58.9985C80.6574 56.4878 76.5024 55 72 55C60.9543 55 52 63.9543 52 75C52 79.9631 53.8078 84.5039 56.8008 88H16C11.5817 88 8 84.4183 8 80V13ZM20.5 20C19.1193 20 18 21.1193 18 22.5C18 23.8807 19.1193 25 20.5 25H43.5C44.8807 25 46 23.8807 46 22.5C46 21.1193 44.8807 20 43.5 20H20.5ZM20.5 33C19.1193 33 18 34.1193 18 35.5C18 36.8807 19.1193 38 20.5 38H71.5C72.8807 38 74 36.8807 74 35.5C74 34.1193 72.8807 33 71.5 33H20.5ZM18 48.5C18 47.1193 19.1193 46 20.5 46H55.5C56.8807 46 58 47.1193 58 48.5C58 49.8807 56.8807 51 55.5 51H20.5C19.1193 51 18 49.8807 18 48.5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-activityRule"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96 96"
    fill="none"
  >
    <path
      d="M72 59C63.1791 59 56 66.1791 56 75C56 83.8209 63.1791 91 72 91C80.8209 91 88 83.8209 88 75C88 66.1791 80.8209 59 72 59ZM82.4095 72.1914L76.762 76.5848L78.6432 83.4903C78.7154 83.7601 78.6166 84.0451 78.3886 84.2048C78.2708 84.2884 78.134 84.3302 77.9972 84.3302C77.8679 84.3302 77.7387 84.2922 77.6285 84.22L72 80.4689L66.3715 84.2238C66.1397 84.3796 65.8394 84.372 65.6114 84.2086C65.3872 84.0451 65.2846 83.7601 65.3568 83.4941L67.238 76.5886L61.5905 72.1914C61.3663 72.0166 61.2751 71.7164 61.3701 71.4504C61.4613 71.1805 61.7159 70.9981 62.001 70.9981H68.8836L71.3805 64.7501C71.5819 64.2447 72.4143 64.2447 72.6195 64.7501L75.1164 70.9981H81.9991C82.2841 70.9981 82.5387 71.1805 82.6299 71.4504C82.7249 71.7202 82.6337 72.0166 82.4095 72.1914Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 13C8 8.58172 11.5817 5 16 5H76C80.4183 5 84 8.58172 84 13V58.9985C80.6574 56.4878 76.5024 55 72 55C60.9543 55 52 63.9543 52 75C52 79.9631 53.8078 84.5039 56.8008 88H16C11.5817 88 8 84.4183 8 80V13ZM20.5 20C19.1193 20 18 21.1193 18 22.5C18 23.8807 19.1193 25 20.5 25H43.5C44.8807 25 46 23.8807 46 22.5C46 21.1193 44.8807 20 43.5 20H20.5ZM20.5 33C19.1193 33 18 34.1193 18 35.5C18 36.8807 19.1193 38 20.5 38H71.5C72.8807 38 74 36.8807 74 35.5C74 34.1193 72.8807 33 71.5 33H20.5ZM18 48.5C18 47.1193 19.1193 46 20.5 46H55.5C56.8807 46 58 47.1193 58 48.5C58 49.8807 56.8807 51 55.5 51H20.5C19.1193 51 18 49.8807 18 48.5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-activityRulesBackground"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 294 61"
    fill="none"
  >
    <path
      d="M0 1.00082C0 1.00082 2.48839 0.849562 6.22476 1.00082L293.555 1.00054C293.656 1.00053 293.757 1.00054 293.856 1.00054L294 1.00054L293.555 1.00054C286.407 1.00119 272.491 1.06227 265 5.43465C256.5 10.3959 252 13.8688 241 36.1943C231.492 55.4919 215.5 60.6698 210 61.0005H85C68 61.0005 55.5 43.1401 52.5 37.1866C49.5 31.2331 46.0048 22.308 35.5 10.892C28.3127 3.0812 14.3314 1.32898 6.22476 1.00082L0 1.00082Z"
      fill="var(--light-main-color, var(--bg_color_L3))"
    ></path>
    <path
      d="M293.856 1.00054C293.757 1.00054 293.656 1.00053 293.555 1.00054L294 1.00054L293.856 1.00054Z"
      fill="var(--light-main-color, var(--bg_color_L3))"
    ></path>
  </symbol>
  <symbol
    id="icon-eventDescriptionArrow"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 28"
    fill="none"
  >
    <path
      d="M23 12.2679C24.3333 13.0378 24.3333 14.9622 23 15.732L3.5 26.9904C2.16666 27.7602 0.499999 26.7979 0.499999 25.2583L0.5 2.74167C0.5 1.20207 2.16667 0.239817 3.5 1.00962L23 12.2679Z"
      fill="#E6EBF0"
    ></path>
  </symbol>
  <symbol
    id="icon-refresh"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 29 28"
    fill="none"
  >
    <g clipPath="url(#clip0_4402_98617)">
      <path
        d="M25.1778 22.687C22.5234 25.998 18.623 28 14.3922 28C7.7044 28 1.9602 23.0048 0.5 16.0776L3.279 15.4C4.4466 20.937 9.0428 24.934 14.3922 24.934C17.8726 24.934 21.0716 23.24 23.1982 20.4596L20.1 16.975H28.5V26.425L25.1778 22.687ZM3.8222 5.313C6.4766 2.002 10.377 0 14.6078 0C21.2956 0 27.0398 4.9952 28.5 11.9224L25.721 12.6C24.5534 7.063 19.9572 3.066 14.6078 3.066C11.1274 3.066 7.9284 4.76 5.8018 7.5404L8.9 11.025H0.5V1.575L3.8222 5.313Z"
        fill="var(--text_color_L4)"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_4402_98617">
        <rect
          width="28"
          height="28"
          fill="white"
          transform="translate(0.5)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-actNewGift"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.4">
      <path
        d="M21.3279 14.981H26.672V44H21.3279V14.981Z"
        fill="var(--norm_red-color)"
      ></path>
      <path
        d="M15.2285 12.5162C12.9505 12.5751 11.0581 10.7194 11.0013 8.37187C10.9443 6.02431 12.7447 4.07362 15.0226 4.01512C15.6791 3.99802 16.33 4.1428 16.9212 4.43739C17.4393 4.67944 17.9038 5.02826 18.2861 5.46236L24.0828 12.5164L15.2285 12.5162Z"
        fill="var(--norm_red-color)"
      ></path>
      <path
        d="M35.7575 11.2405C35.3748 11.6447 34.9175 11.9659 34.4124 12.185C33.9074 12.4041 33.3648 12.5167 32.8169 12.5162H24.0149L29.7916 5.40766C30.1781 4.97374 30.6459 4.62501 31.1668 4.38247C33.2404 3.4103 35.6867 4.35533 36.63 6.49325C37.3444 8.11306 37.005 10.0201 35.7791 11.2729L35.7575 11.2405Z"
        fill="var(--norm_red-color)"
      ></path>
    </g>
    <path
      d="M42.6523 24.1544V42.6846C42.6522 43.0313 42.5145 43.3636 42.2697 43.6087C42.0249 43.8537 41.6928 43.9914 41.3467 43.9913H29.5918V24.1542L42.6523 24.1544ZM19.316 44H7.60231C6.88154 43.9998 6.29715 43.4148 6.29693 42.6931V24.1546H19.3495V43.9915L19.316 44ZM6.30516 15H19.3582V21.5353H6.30516C5.959 21.5351 5.62705 21.3974 5.38221 21.1524C5.13749 20.9071 5.00001 20.5746 5 20.2279V16.3154C5.00466 15.5954 5.58628 15.0129 6.30516 15.0082V15ZM29.6416 15H42.694C43.4131 15.0044 43.9951 15.5868 44 16.307V20.2279C43.9998 20.9501 43.4152 21.5353 42.694 21.5353H29.5915L29.6416 15Z"
      fill="var(--norm_red-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-act_notic"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.33203 16.6667C9.33203 12.9848 12.3168 10 15.9987 10C19.6806 10 22.6654 12.9848 22.6654 16.6667V27.3333H9.33203V16.6667Z"
      fill="#D23838"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M16 3.33301V5.33301"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M23.9262 6.21875L22.6406 7.75086"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M28.1454 13.5244L26.1758 13.8717"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3.85547 13.5254L5.82508 13.8727"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M8.07422 6.21875L9.35982 7.75087"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M4 27.333H28.6667"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-activity"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle
      opacity="0.3"
      cx="27"
      cy="24"
      r="18"
      fill="currentColor"
    ></circle>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.4489 16.6808C17.4491 16.6697 17.4492 16.6586 17.4492 16.6475C17.4492 15.681 16.6833 14.8975 15.7168 14.8975C14.7529 14.8975 13.9263 15.6767 13.9219 16.6396H13.9209C13.9212 16.6432 13.9215 16.6469 13.9219 16.6505C13.9221 16.7723 13.9355 16.8911 13.9606 17.0059C14.5925 21.9877 18.8462 25.8397 23.9996 25.8397C29.1037 25.8397 33.3252 22.0611 34.0195 17.1487C34.0666 16.9905 34.0918 16.8229 34.0918 16.6494C34.0918 15.6829 33.3083 14.8994 32.3418 14.8994C31.3753 14.8994 30.5469 15.6829 30.5469 16.6494C30.5469 16.6662 30.5471 16.6829 30.5476 16.6996C30.0741 19.8911 27.3228 22.3397 23.9996 22.3397C20.67 22.3397 17.9144 19.8815 17.4489 16.6808Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5124 5.2H37.4875C40.0604 5.2 42.1758 7.22874 42.2833 9.79945L42.7935 22H42.8V22.0005C42.8 22.8841 43.5163 23.6005 44.4 23.6005C45.2837 23.6005 46 22.8841 46 22.0005C46 21.9341 45.996 21.8686 45.9881 21.8044L45.4805 9.66575C45.3013 5.38123 41.7757 2 37.4875 2H10.5124C6.2241 2 2.69852 5.38123 2.51935 9.66575L1.34844 37.6657C1.15836 42.2112 4.79203 46 9.34145 46H38.6584C43.2078 46 46.8415 42.2112 46.6514 37.6657L46.3308 30H46.3303C46.3069 29.1368 45.5998 28.4442 44.7309 28.4442C43.862 28.4442 43.1549 29.1368 43.1315 30H43.128L43.1312 30.0763C43.1317 30.1004 43.1327 30.1243 43.1342 30.148L43.4542 37.7994C43.5682 40.5267 41.388 42.8 38.6584 42.8H9.34145C6.6118 42.8 4.4316 40.5267 4.54565 37.7994L5.71656 9.79945C5.82406 7.22874 7.93941 5.2 10.5124 5.2Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-activityNote"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M18 33C22.1421 33 25.8921 31.3211 28.6066 28.6066C31.3211 25.8921 33 22.1421 33 18C33 13.8579 31.3211 10.1079 28.6066 7.39339C25.8921 4.67893 22.1421 3 18 3C13.8579 3 10.1079 4.67893 7.39339 7.39339C4.67893 10.1079 3 13.8579 3 18C3 22.1421 4.67893 25.8921 7.39339 28.6066C10.1079 31.3211 13.8579 33 18 33Z"
      stroke="#D23838"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 27.75C19.0355 27.75 19.875 26.9105 19.875 25.875C19.875 24.8395 19.0355 24 18 24C16.9645 24 16.125 24.8395 16.125 25.875C16.125 26.9105 16.9645 27.75 18 27.75Z"
      fill="#D23838"
    ></path>
    <path
      d="M18 9V21"
      stroke="#D23838"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-activityWallet"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 30"
    fill="none"
  >
    <g clipPath="url(#clip0_2271_83618)">
      <path d="M30 0H0V30H30V0Z" fill="white" fillOpacity="0.01"></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2422 7.48056L19.8688 2.5L22.7516 7.49306L11.2422 7.48056Z"
        fill="#FFA522"
      ></path>
      <path
        d="M2.5 8.75C2.5 8.05963 3.05964 7.5 3.75 7.5H26.25C26.9404 7.5 27.5 8.05963 27.5 8.75V26.25C27.5 26.9404 26.9404 27.5 26.25 27.5H3.75C3.05964 27.5 2.5 26.9404 2.5 26.25V8.75Z"
        fill="#FDD95A"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.9688 21.25H22.5C20.6878 21.25 19.2188 19.8509 19.2188 18.125C19.2188 16.3991 20.6878 15 22.5 15H27.9688V21.25ZM21.9872 18.9581C22.505 18.9581 22.9247 18.5383 22.9247 18.0206C22.9247 17.5028 22.505 17.0831 21.9872 17.0831C21.4694 17.0831 21.0497 17.5028 21.0497 18.0206C21.0497 18.5383 21.4694 18.9581 21.9872 18.9581Z"
        fill="#FFA522"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_2271_83618">
        <rect width="30" height="30" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-add_icon"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 23.1047C15.3813 23.1047 14.875 22.6031 14.875 21.9797V10.9922C14.875 10.3734 15.3766 9.86719 16 9.86719C16.6234 9.86719 17.125 10.3687 17.125 10.9922V21.9797C17.125 22.5984 16.6187 23.1047 16 23.1047Z"
      fill="var(--text_color_L1)"
    ></path>
    <path
      d="M21.4984 17.6108H10.5016C9.88281 17.6108 9.37656 17.1093 9.37656 16.4858C9.37656 15.8671 9.87812 15.3608 10.5016 15.3608H21.4984C22.1172 15.3608 22.6234 15.8624 22.6234 16.4858C22.6234 17.1093 22.1219 17.6108 21.4984 17.6108Z"
      fill="var(--text_color_L1)"
    ></path>
    <path
      d="M22.0266 31.625H9.97344C4.53125 31.625 0.875 27.8047 0.875 22.1234V10.8812C0.875 5.19531 4.53125 1.375 9.97344 1.375H22.0312C27.4734 1.375 31.125 5.19531 31.125 10.8766V22.1188C31.125 27.8047 27.4688 31.625 22.0266 31.625ZM9.97344 3.625C5.81563 3.625 3.12969 6.47031 3.12969 10.8766V22.1188C3.12969 26.525 5.81563 29.3703 9.97344 29.3703H22.0312C26.1844 29.375 28.875 26.5297 28.875 22.1234V10.8812C28.875 6.475 26.1891 3.62969 22.0312 3.62969H9.97344V3.625Z"
      fill="var(--text_color_L1)"
    ></path>
  </symbol>
  <symbol
    id="icon-address"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40.5 18.5C40.5 32.8 24 46 24 46C24 46 7.5 32.8 7.5 18.5C7.5 9.38727 14.8873 2 24 2C33.1127 2 40.5 9.38727 40.5 18.5ZM30.6004 18.5004C30.6004 22.1455 27.6455 25.1004 24.0004 25.1004C20.3553 25.1004 17.4004 22.1455 17.4004 18.5004C17.4004 14.8553 20.3553 11.9004 24.0004 11.9004C27.6455 11.9004 30.6004 14.8553 30.6004 18.5004Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-all"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon">
      <path
        id="Vector"
        d="M36.75 28.4375H26.25C25.5325 28.4375 24.9375 27.8425 24.9375 27.125C24.9375 26.4075 25.5325 25.8125 26.25 25.8125H36.75C37.4675 25.8125 38.0625 26.4075 38.0625 27.125C38.0625 27.8425 37.4675 28.4375 36.75 28.4375ZM36.75 35.4375H26.25C25.5325 35.4375 24.9375 34.8425 24.9375 34.125C24.9375 33.4075 25.5325 32.8125 26.25 32.8125H36.75C37.4675 32.8125 38.0625 33.4075 38.0625 34.125C38.0625 34.8425 37.4675 35.4375 36.75 35.4375ZM38.5 14.91V6.965C38.5 4.4975 37.38 3.5 34.5975 3.5H27.5275C24.745 3.5 23.625 4.4975 23.625 6.965V14.8925C23.625 17.3775 24.745 18.3575 27.5275 18.3575H34.5975C37.38 18.375 38.5 17.3775 38.5 14.91ZM18.375 14.91V6.965C18.375 4.4975 17.255 3.5 14.4725 3.5H7.4025C4.62 3.5 3.5 4.4975 3.5 6.965V14.8925C3.5 17.3775 4.62 18.3575 7.4025 18.3575H14.4725C17.255 18.375 18.375 17.3775 18.375 14.91ZM18.375 34.5975V27.5275C18.375 24.745 17.255 23.625 14.4725 23.625H7.4025C4.62 23.625 3.5 24.745 3.5 27.5275V34.5975C3.5 37.38 4.62 38.5 7.4025 38.5H14.4725C17.255 38.5 18.375 37.38 18.375 34.5975Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-anbg"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_186_36254"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="1"
      y="1"
      width="68"
      height="68"
    >
      <path
        d="M33.5569 68.5569C52.0898 69.3539 67.7599 54.9761 68.5569 36.4431C69.3539 17.9102 54.9761 2.24013 36.4431 1.44312C17.9102 0.646107 2.24012 15.0239 1.44311 33.5569C0.646096 52.0898 15.0239 67.7599 33.5569 68.5569Z"
        fill="url(#paint0_linear_186_36254)"
      ></path>
    </mask>
    <g mask="url(#mask0_186_36254)">
      <g filter="url(#filter0_d_186_36254)">
        <path
          d="M33.5569 68.5569C52.0898 69.3539 67.7599 54.9761 68.5569 36.4431C69.3539 17.9102 54.9761 2.24013 36.4431 1.44312C17.9102 0.646107 2.24012 15.0239 1.44311 33.5569C0.646096 52.0898 15.0239 67.7599 33.5569 68.5569Z"
          fill="url(#paint1_linear_186_36254)"
        ></path>
      </g>
      <path
        d="M34.4543 58.5795C50.119 59.2532 63.3639 47.1005 64.0376 31.4358C64.7113 15.771 52.5586 2.52608 36.8938 1.85241C21.2291 1.17874 7.98416 13.3314 7.31049 28.9962C6.63683 44.6609 18.7895 57.9059 34.4543 58.5795Z"
        fill="url(#paint2_linear_186_36254)"
      ></path>
      <g filter="url(#filter1_f_186_36254)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.9941 54.2005C33.1553 63.2088 51.9376 59.0321 60.9459 44.8714C62.7462 42.0417 64.0197 39.0272 64.7923 35.9438C64.3629 40.3673 62.913 44.7595 60.3637 48.766C51.7109 62.3679 33.6703 66.38 20.0681 57.7272C13.8697 53.784 9.66276 47.891 7.73828 41.3576C10.0995 46.4562 13.9011 50.9604 18.9941 54.2005Z"
          fill="#F26565"
        ></path>
      </g>
      <path
        d="M34.4918 59.275C48.0826 59.8595 59.574 49.3158 60.1585 35.725C60.7429 22.1341 50.1992 10.6428 36.6084 10.0583C23.0175 9.47381 11.5262 20.0175 10.9417 33.6084C10.3572 47.1992 20.901 58.6906 34.4918 59.275Z"
        fill="url(#paint3_linear_186_36254)"
      ></path>
      <path
        d="M-27.8454 35.321C-32.8649 44.6572 -29.3655 56.2949 -20.0292 61.3144C-10.693 66.3338 0.944652 62.8344 5.96414 53.4982C10.9836 44.1619 7.4842 32.5243 -1.85205 27.5048C-11.1883 22.4853 -22.8259 25.9847 -27.8454 35.321Z"
        fill="url(#paint4_linear_186_36254)"
      ></path>
      <path
        d="M94.1708 28.2582C100.556 35.7018 99.6987 46.9127 92.2551 53.2983C84.8115 59.6839 73.6007 58.8262 67.215 51.3826C60.8294 43.939 61.6871 32.7282 69.1307 26.3425C76.5743 19.9569 87.7852 20.8146 94.1708 28.2582Z"
        fill="url(#paint5_linear_186_36254)"
      ></path>
      <path
        d="M24.5591 -25.4224C32.3161 -31.4235 43.4692 -30 49.4703 -22.243C55.4713 -14.486 54.0479 -3.33291 46.2909 2.66816C38.5339 8.66923 27.3808 7.24577 21.3797 -0.511225C15.3786 -8.26822 16.8021 -19.4213 24.5591 -25.4224Z"
        fill="url(#paint6_linear_186_36254)"
      ></path>
      <path
        d="M23.1952 79.4598C22.7739 89.2581 30.3753 97.5427 40.1736 97.9641C49.9719 98.3855 58.2566 90.784 58.6779 80.9857C59.0993 71.1875 51.4978 62.9028 41.6996 62.4814C31.9013 62.06 23.6166 69.6615 23.1952 79.4598Z"
        fill="url(#paint7_linear_186_36254)"
      ></path>
      <g filter="url(#filter2_f_186_36254)">
        <path
          d="M31.4831 61.6469C31.5333 62.5288 33.3613 63.142 35.5661 63.0166C37.7709 62.8911 39.5175 62.0745 39.4673 61.1925C39.4171 60.3106 37.5891 59.6974 35.3844 59.8229C33.1796 59.9483 31.4329 60.765 31.4831 61.6469Z"
          fill="white"
        ></path>
      </g>
      <g style={{mixBlendMode: 'screen'}} filter="url(#filter3_f_186_36254)">
        <path
          d="M34.2076 25.4474C40.7458 26.0919 46.4148 22.8729 46.8697 18.2578C47.3245 13.6426 42.3931 9.37889 35.8549 8.73447C29.3168 8.09004 23.6478 11.309 23.193 15.9241C22.7381 20.5393 27.6695 24.803 34.2076 25.4474Z"
          fill="#FFCFCE"
        ></path>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_186_36254"
        x="-2.58838"
        y="-4.5885"
        width="75.1768"
        height="75.177"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="-2"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 0.630158 0 0 0 0 0.630158 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_186_36254"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_186_36254"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter1_f_186_36254"
        x="4.73828"
        y="32.9438"
        width="63.0542"
        height="32.3481"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="1.5"
          result="effect1_foregroundBlur_186_36254"
        ></feGaussianBlur>
      </filter>
      <filter
        id="filter2_f_186_36254"
        x="25.4819"
        y="53.8066"
        width="19.9863"
        height="15.2263"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="3"
          result="effect1_foregroundBlur_186_36254"
        ></feGaussianBlur>
      </filter>
      <filter
        id="filter3_f_186_36254"
        x="18.1641"
        y="3.65234"
        width="33.7349"
        height="26.8772"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="2.5"
          result="effect1_foregroundBlur_186_36254"
        ></feGaussianBlur>
      </filter>
      <linearGradient
        id="paint0_linear_186_36254"
        x1="20.1375"
        y1="8.34639"
        x2="44.0641"
        y2="66.2072"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F22427"></stop>
        <stop offset="1" stopColor="#960204"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_186_36254"
        x1="29.9357"
        y1="6.31369"
        x2="44.0641"
        y2="66.2072"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FB444C"></stop>
        <stop offset="1" stopColor="#DF242E"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_186_36254"
        x1="28.9373"
        y1="3.46916"
        x2="38.5326"
        y2="60.4738"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FA999A"></stop>
        <stop offset="0.743552" stopColor="#FE474D"></stop>
        <stop offset="1" stopColor="#DD2223" stopOpacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_186_36254"
        x1="30.1694"
        y1="11.6563"
        x2="35.5173"
        y2="58.6479"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.349342" stopColor="#FBF9FD"></stop>
        <stop offset="0.889385" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_186_36254"
        x1="9.74742"
        y1="40.5508"
        x2="-28.0715"
        y2="49.2971"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBF9FD"></stop>
        <stop offset="0.373872" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint5_linear_186_36254"
        x1="62.1375"
        y1="40.3055"
        x2="77.8119"
        y2="39.7457"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBF9FD"></stop>
        <stop offset="0.601592" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint6_linear_186_36254"
        x1="36.9468"
        y1="5.59797"
        x2="36.9468"
        y2="-11.196"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0664686" stopColor="#FBF9FD"></stop>
        <stop offset="1" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint7_linear_186_36254"
        x1="56.6154"
        y1="68.6771"
        x2="28.6354"
        y2="91.1926"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EBA3A6"></stop>
        <stop offset="0.373872" stopColor="#EBA3A5"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-arpay1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 37 40"
    fill="none"
  >
    <rect
      opacity="0.4"
      width="36.6667"
      height="40"
      rx="8"
      fill="var(--main-color)"
    ></rect>
    <path
      d="M5.83301 16.6667C5.83301 15.7462 6.5792 15 7.49967 15H15.833C16.7535 15 17.4997 15.7462 17.4997 16.6667C17.4997 17.5871 16.7535 18.3333 15.833 18.3333H7.49967C6.5792 18.3333 5.83301 17.5871 5.83301 16.6667Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M5.83301 9.16667C5.83301 8.24619 6.5792 7.5 7.49967 7.5H23.333C24.2535 7.5 24.9997 8.24619 24.9997 9.16667C24.9997 10.0871 24.2535 10.8333 23.333 10.8333H7.49967C6.5792 10.8333 5.83301 10.0871 5.83301 9.16667Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M27.9863 14.4082V17.7692H26.209V14.4082H27.9863ZM27.7699 33.0133V36.0781H25.9925V33.0133H27.7699ZM29.0231 29.2764C29.0231 28.8434 28.9434 28.475 28.7839 28.1712C28.6319 27.8674 28.3813 27.5978 28.0319 27.3623C27.6901 27.1268 27.2268 26.899 26.6419 26.6787C25.6545 26.2989 24.7848 25.8964 24.0329 25.471C23.2885 25.0381 22.7075 24.5026 22.2897 23.8646C21.872 23.219 21.6631 22.4025 21.6631 21.415C21.6631 20.4732 21.8872 19.6567 22.3353 18.9655C22.7834 18.2743 23.4025 17.7426 24.1924 17.3704C24.9899 16.9907 25.9166 16.8008 26.9723 16.8008C27.7775 16.8008 28.5066 16.9223 29.1598 17.1654C29.813 17.4008 30.3751 17.7502 30.846 18.2135C31.3169 18.6693 31.6777 19.2275 31.9284 19.8883C32.179 20.5492 32.3044 21.3049 32.3044 22.1556H29.0345C29.0345 21.6999 28.9851 21.2973 28.8864 20.9479C28.7877 20.5985 28.6433 20.3061 28.4535 20.0706C28.2712 19.8352 28.0509 19.6605 27.7926 19.5465C27.5344 19.425 27.2496 19.3643 26.9382 19.3643C26.4748 19.3643 26.0951 19.4554 25.7988 19.6377C25.5026 19.82 25.2861 20.0668 25.1494 20.3783C25.0203 20.6821 24.9557 21.0315 24.9557 21.4264C24.9557 21.8138 25.0241 22.1518 25.1608 22.4404C25.3051 22.7291 25.552 22.9949 25.9014 23.238C26.2508 23.4734 26.7293 23.7165 27.3369 23.9671C28.3243 24.3469 29.1902 24.7571 29.9346 25.1976C30.6789 25.6381 31.26 26.1774 31.6777 26.8154C32.0955 27.4535 32.3044 28.2662 32.3044 29.2536C32.3044 30.2334 32.0765 31.0689 31.6208 31.7601C31.165 32.4437 30.527 32.9678 29.7067 33.3324C28.8864 33.6893 27.937 33.8678 26.8584 33.8678C26.1596 33.8678 25.4646 33.7767 24.7734 33.5944C24.0822 33.4045 23.4556 33.1007 22.8936 32.6829C22.3315 32.2652 21.8834 31.7107 21.5492 31.0195C21.215 30.3207 21.0479 29.4625 21.0479 28.4447H24.3291C24.3291 28.9991 24.4013 29.4625 24.5456 29.8346C24.6899 30.1992 24.8798 30.4916 25.1152 30.7119C25.3583 30.9246 25.6317 31.0765 25.9355 31.1676C26.2394 31.2588 26.547 31.3044 26.8584 31.3044C27.3445 31.3044 27.7433 31.217 28.0547 31.0423C28.3737 30.8676 28.613 30.6284 28.7725 30.3245C28.9396 30.0131 29.0231 29.6637 29.0231 29.2764Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-arpay2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 46 41"
    fill="none"
  >
    <path
      d="M9.1449 6.3253C4.09234 6.3253 0 10.4176 0 15.4702C0 15.4702 0 15.0129 0 9.98325C0 4.95356 4.57245 0.5 9.60214 0.5H26.7717C30.7404 0.5 34.0635 2.66533 34.966 6.18459C29.2637 6.18459 12.8029 6.3253 9.1449 6.3253Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M35.3908 20.0382C34.2476 21.1585 33.6989 22.8503 34.1562 24.5649C34.7277 26.6911 36.8311 28.04 39.0258 28.04H42.981V31.355C42.981 36.4076 38.8887 40.4999 33.8361 40.4999H9.1449C4.09234 40.4999 0 36.4076 0 31.355V15.3514C0 10.2989 4.09234 6.20654 9.1449 6.20654C9.1449 6.20654 28.8064 6.20654 33.8361 6.20654C38.8658 6.20654 42.981 10.3217 42.981 15.3514V18.6665H38.6829C37.4026 18.6665 36.2367 19.1694 35.3908 20.0382Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M45.7244 21.0072V25.7169C45.7244 26.9971 44.6727 28.0488 43.3696 28.0488H38.9572C36.488 28.0488 34.2247 26.2427 34.0189 23.7736C33.8817 22.3333 34.4304 20.9844 35.3906 20.047C36.2365 19.1783 37.4025 18.6753 38.6828 18.6753H43.3696C44.6727 18.6753 45.7244 19.727 45.7244 21.0072Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M25.0116 30.5596H29.2638L21.4457 15.9277H16.7583L10.0596 30.5596H20.8946L22.2895 28.1478L20.5727 25.1688L19.2851 27.2674H15.5578L19.0795 19.8296L25.0116 30.5596Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-arrLeft"
    viewBox="0 0 14 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Vector">
      <path
        d="M7.00049 22.2029L14.0005 12.0001L14.0004 33.0001L7.00049 22.2029Z"
        fill="var(--text_color_L4)"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.0005 0.944336L0.822266 22.2056L14.0005 43.4669V39.2718L3.95444 22.2056L14.0005 5.13942V0.944336Z"
        fill="var(--text_color_L4)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-bank"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M62.2194 20.8328L36.8563 9.72248C36.8284 9.70852 36.7935 9.69455 36.7655 9.68058C36.591 9.57583 35.8438 9.16382 35.0337 9.12891H34.9429C34.1259 9.17081 33.3857 9.57583 33.2041 9.68058C33.1762 9.69455 33.1482 9.7155 33.1133 9.72248L7.80604 20.8328C7.35911 21.0074 7.09375 21.4543 7.09375 21.8943V23.2351C7.09375 23.6959 7.46386 24.0661 7.92476 24.0661H10.6622C11.0393 24.0661 11.3675 24.3105 11.4653 24.6736C11.8074 25.9795 13.26 25.9027 13.4904 25.8887H56.4373C56.6678 25.9096 58.1203 25.9864 58.4625 24.6736C58.5602 24.3105 58.8884 24.0661 59.2655 24.0661H62.003C62.4639 24.0661 62.834 23.6959 62.834 23.2351V21.9641C62.834 21.9222 62.841 21.8733 62.8479 21.8314C62.8968 21.4194 62.6384 21.0493 62.2194 20.8328ZM60.3968 55.7351H9.62168C7.67336 55.7351 7.71526 57.6415 7.71526 57.6415V60.0018C7.71526 60.4627 8.08537 60.8328 8.54626 60.8328H61.4653C61.9262 60.8328 62.2963 60.4627 62.2963 60.0018V57.6415C62.3032 57.6415 62.3521 55.7351 60.3968 55.7351ZM15.1245 28.675V50.1485H12.9527C11.3465 50.1485 11.1231 51.6708 11.0951 51.9641C11.0951 51.992 11.0882 52.02 11.0882 52.0409V52.9906C11.0882 53.4515 11.4583 53.8216 11.9192 53.8216H58.1901C58.651 53.8216 59.0211 53.4515 59.0211 52.9906V52.0409C59.0211 52.013 59.0211 51.9851 59.0141 51.9641C58.9862 51.6708 58.7627 50.1485 57.1566 50.1485H54.9848V28.675C54.9848 28.2141 54.6147 27.844 54.1538 27.844H48.8186C48.3577 27.844 47.9876 28.2141 47.9876 28.675V50.1485H43.7278V28.675C43.7278 28.2141 43.3577 27.844 42.8968 27.844H37.6035C37.1426 27.844 36.7725 28.2141 36.7725 28.675V50.1904H33.3158V28.675C33.3158 28.2141 32.9457 27.844 32.4848 27.844H27.1915C26.7306 27.844 26.3605 28.2141 26.3605 28.675V50.1485H22.1007V28.675C22.1007 28.2141 21.7306 27.844 21.2697 27.844H15.9764C15.4946 27.844 15.1245 28.2141 15.1245 28.675Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-bankCard"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.11362 15.0854C3.3562 15.0854 2.74219 14.4713 2.74219 13.7139V10.9711C2.74219 7.94139 5.19823 5.48535 8.2279 5.48535H39.7708C42.8004 5.48535 45.2565 7.94139 45.2565 10.9711V13.7139C45.2565 14.4713 44.6425 15.0854 43.885 15.0854H4.11362ZM4.11362 18.5139C3.3562 18.5139 2.74219 19.1279 2.74219 19.8854V36.3425C2.74219 39.3722 5.19823 41.8282 8.2279 41.8282H39.7708C42.8004 41.8282 45.2565 39.3722 45.2565 36.3425V19.8854C45.2565 19.1279 44.6425 18.5139 43.885 18.5139H4.11362ZM35.6564 36.1001C35.1539 36.6695 34.4185 37.0287 33.5993 37.0287C32.0845 37.0287 30.8564 35.8007 30.8564 34.2858C30.8564 32.771 32.0845 31.543 33.5993 31.543C34.4185 31.543 35.1539 31.9021 35.6564 32.4715C36.159 31.9021 36.8944 31.543 37.7136 31.543C39.2284 31.543 40.4564 32.771 40.4564 34.2858C40.4564 35.8007 39.2284 37.0287 37.7136 37.0287C36.8944 37.0287 36.159 36.6695 35.6564 36.1001Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-bankHeader"
    viewBox="0 0 702 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_10_170301"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="702"
      height="70"
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H692C697.523 0 702 4.47715 702 10V70H0V10Z"
        fill="white"
      ></path>
    </mask>
    <g mask="url(#mask0_10_170301)">
      <path
        d="M81.48 27.152H100.2V30.352H92.712V50H88.968V30.352H81.48V27.152ZM110.416 33.008C111.216 33.008 111.92 33.136 112.496 33.424V37.072C111.664 36.816 110.896 36.72 110.128 36.72C109.168 36.72 108.304 37.072 107.536 37.84C106.64 38.704 106.224 39.824 106.224 41.232V50H102.608V33.456H106.224V35.824C106.672 34.992 107.184 34.352 107.792 33.904C108.528 33.296 109.392 33.008 110.416 33.008ZM122.256 33.008C124.752 33.008 126.768 33.808 128.304 35.472C129.808 37.104 130.576 39.184 130.576 41.744C130.576 44.272 129.808 46.352 128.336 47.952C126.8 49.616 124.752 50.448 122.256 50.448C119.728 50.448 117.712 49.616 116.176 47.952C114.672 46.352 113.936 44.272 113.936 41.744C113.936 39.184 114.672 37.104 116.208 35.472C117.712 33.808 119.728 33.008 122.256 33.008ZM122.256 35.984C120.72 35.984 119.568 36.56 118.736 37.776C118.032 38.8 117.68 40.144 117.68 41.744C117.68 43.344 118.032 44.656 118.736 45.68C119.568 46.864 120.72 47.472 122.256 47.472C123.76 47.472 124.944 46.864 125.776 45.68C126.48 44.624 126.864 43.312 126.864 41.744C126.864 40.144 126.48 38.8 125.776 37.776C124.944 36.56 123.76 35.984 122.256 35.984ZM142.308 33.008C146.436 33.008 148.516 35.248 148.516 39.792V50H144.868V40.112C144.868 37.392 143.62 36.048 141.124 36.048C140.228 36.048 139.428 36.368 138.756 37.008C137.988 37.712 137.54 38.736 137.412 40.048V50H133.764V33.456H137.412V35.376C138.052 34.608 138.788 34 139.588 33.616C140.42 33.2 141.316 33.008 142.308 33.008ZM156.742 23.536H159.782C158.438 25.744 157.414 27.952 156.71 30.16C155.75 32.912 155.302 35.696 155.302 38.48C155.302 41.232 155.75 44.016 156.71 46.8C157.414 48.976 158.438 51.184 159.782 53.424H156.742C155.206 51.312 154.054 49.136 153.222 46.896C152.23 44.208 151.75 41.392 151.75 38.512C151.75 35.568 152.23 32.784 153.222 30.096C154.054 27.792 155.206 25.616 156.742 23.536ZM161.574 27.152H180.294V30.352H172.806V50H169.062V30.352H161.574V27.152ZM183.021 27.152H193.197C195.533 27.152 197.389 27.664 198.733 28.72C200.141 29.872 200.877 31.536 200.877 33.712C200.877 34.896 200.557 35.952 199.917 36.88C199.213 37.904 198.221 38.576 197.005 38.896V38.96C198.989 39.408 200.109 40.72 200.365 42.96L200.749 46.64C200.877 48.048 201.357 49.168 202.125 50H198.061C197.517 49.296 197.197 48.304 197.069 47.024L196.781 44.208C196.653 42.96 196.269 42.064 195.629 41.52C194.957 40.944 193.965 40.688 192.685 40.688H186.765V50H183.021V27.152ZM186.765 30.352V37.488H192.685C194.157 37.488 195.277 37.168 196.045 36.56C196.749 35.92 197.101 35.024 197.101 33.872C197.101 32.624 196.749 31.728 196.045 31.184C195.341 30.608 194.221 30.352 192.685 30.352H186.765ZM215.254 26.704C217.942 26.704 220.182 27.408 221.91 28.816C223.574 30.16 224.566 32.016 224.918 34.32H221.27C220.886 32.816 220.182 31.728 219.126 31.024C218.102 30.32 216.79 30 215.19 30C212.79 30 210.998 30.8 209.782 32.464C208.662 33.936 208.118 35.984 208.118 38.608C208.118 41.296 208.662 43.376 209.75 44.816C210.934 46.352 212.79 47.152 215.286 47.152C216.918 47.152 218.262 46.736 219.286 45.968C220.374 45.104 221.142 43.792 221.59 42.064H225.238C224.726 44.752 223.542 46.832 221.654 48.336C219.894 49.744 217.782 50.448 215.318 50.448C211.51 50.448 208.662 49.232 206.806 46.864C205.174 44.816 204.374 42.064 204.374 38.608C204.374 35.216 205.206 32.432 206.902 30.32C208.822 27.888 211.606 26.704 215.254 26.704ZM236.483 26.704C238.691 26.704 240.515 27.344 241.955 28.624C243.363 29.904 244.067 31.536 244.067 33.584C244.067 35.568 243.299 37.36 241.827 38.992C240.931 39.952 239.331 41.168 237.091 42.672C234.755 44.208 233.347 45.552 232.835 46.704H244.099V50H228.163C228.163 47.664 228.899 45.648 230.435 43.92C231.267 42.96 233.027 41.552 235.683 39.728C237.155 38.704 238.179 37.84 238.819 37.168C239.811 36.048 240.323 34.832 240.323 33.552C240.323 32.304 239.971 31.376 239.331 30.768C238.659 30.16 237.667 29.872 236.355 29.872C234.947 29.872 233.891 30.352 233.187 31.312C232.483 32.208 232.099 33.584 232.035 35.376H228.291C228.323 32.816 229.059 30.768 230.531 29.2C232.035 27.536 234.019 26.704 236.483 26.704ZM255.319 26.704C257.975 26.704 260.055 27.792 261.559 30.032C262.967 32.144 263.671 34.992 263.671 38.576C263.671 42.16 262.967 45.008 261.559 47.12C260.055 49.328 257.975 50.448 255.319 50.448C252.631 50.448 250.551 49.328 249.079 47.12C247.671 45.008 246.967 42.16 246.967 38.576C246.967 34.992 247.671 32.144 249.079 30.032C250.551 27.792 252.631 26.704 255.319 26.704ZM255.319 29.872C253.495 29.872 252.215 30.864 251.479 32.912C250.967 34.288 250.711 36.176 250.711 38.576C250.711 40.944 250.967 42.832 251.479 44.24C252.215 46.256 253.495 47.28 255.319 47.28C257.111 47.28 258.391 46.256 259.159 44.24C259.671 42.832 259.927 40.944 259.927 38.576C259.927 36.176 259.671 34.288 259.159 32.912C258.391 30.864 257.111 29.872 255.319 29.872ZM266.218 23.536H269.258C270.762 25.616 271.946 27.792 272.778 30.096C273.738 32.784 274.25 35.568 274.25 38.512C274.25 41.392 273.738 44.208 272.778 46.896C271.946 49.136 270.762 51.312 269.258 53.424H266.218C267.53 51.184 268.554 48.976 269.29 46.8C270.218 44.016 270.698 41.232 270.698 38.48C270.698 35.696 270.218 32.912 269.29 30.16C268.554 27.952 267.53 25.744 266.218 23.536Z"
        fill="white"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M690.847 21.138C707.178 38.335 706.477 65.5153 689.28 81.8469C672.083 98.1785 644.903 97.477 628.571 80.28C612.239 63.083 612.941 35.9027 630.138 19.5711C647.335 3.23949 674.515 3.94101 690.847 21.138ZM660.283 28.6248L659.005 44.5061L632.046 46.4145L660.283 28.6248ZM661.457 23.7932C661.233 23.846 661.009 23.9377 660.795 24.0729L625.31 46.4289C624.449 46.9712 624.179 47.8735 624.351 48.6804C624.235 49.5409 624.614 50.4685 625.587 50.9134L679.708 75.675C681.086 76.3053 682.419 75.4002 682.706 74.1949C682.944 73.8309 683.074 73.3786 683.035 72.8608L679.503 25.6135C679.455 24.9784 679.162 24.4698 678.745 24.1258C678.377 23.4952 677.694 23.0454 676.842 23.066L662.632 23.4093C662.197 23.4198 661.792 23.5598 661.457 23.7932ZM662.919 40.4756L664.007 26.9556L673.867 26.7174L662.919 40.4756ZM632.176 49.9929L659.809 48.0368L676.048 70.065L632.176 49.9929ZM676.207 29.5241L679.089 68.0688L662.92 46.2222L676.207 29.5241Z"
        fill="white"
        fillOpacity="0.36"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-bankKbz"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.0332029 34.9543C0.0332029 28.5512 -0.0578035 22.1463 0.0615189 15.7454C0.160054 10.464 2.10146 5.98753 6.55829 2.85183C8.86257 1.23062 11.4674 0.448946 14.2515 0.166534C15.6089 0.0288521 16.9652 0.003611 18.3257 0.00377491C29.932 0.00606961 41.5384 -0.0122872 53.1446 0.0159049C56.5288 0.0241002 59.8148 0.561387 62.754 2.4101C66.6491 4.86002 68.9105 8.3932 69.6589 12.9113C69.935 14.5787 70.0016 16.2612 70 17.9519C69.9885 29.6688 70.0072 41.3857 69.9861 53.1025C69.9795 56.7502 69.3618 60.2637 67.2168 63.338C64.3954 67.3817 60.4324 69.4006 55.5854 69.85C54.2273 69.9759 52.8703 69.9957 51.5099 69.9956C39.9854 69.9943 28.4607 70.0121 16.9362 69.9843C13.4664 69.9759 10.0964 69.4306 7.10334 67.4971C3.2973 65.0385 1.07388 61.538 0.341576 57.0798C0.067576 55.4116 -0.00247982 53.7299 0.00243057 52.0392C0.0189622 46.3443 0.00865072 40.6493 0.00865072 34.9543C0.0168347 34.9543 0.0250189 34.9543 0.0332029 34.9543Z"
      fill="#0053AA"
    ></path>
    <path
      d="M55.871 49.0046C56.534 47.3427 57.1256 45.8627 57.7148 44.3815C58.3691 42.7366 59.0163 41.0889 59.6763 39.4464C59.9982 38.6454 60.4559 38.3729 61.0431 38.6011C61.6104 38.8217 61.8016 39.4062 61.4904 40.1444C59.805 44.143 58.1263 48.1448 56.403 52.1274C55.8152 53.4858 55.028 54.7238 53.4231 55.1068C52.3729 55.3574 51.3333 55.2542 50.3228 54.8974C49.7927 54.7103 49.4985 54.3245 49.6986 53.7659C49.896 53.2148 50.3386 53.1183 50.8965 53.2614C52.9195 53.7804 53.7486 53.4154 54.6306 51.7226C54.8576 51.2871 54.8367 50.9337 54.628 50.501C53.0356 47.2001 51.4645 43.889 49.8894 40.5799C49.7644 40.3174 49.6259 40.0544 49.5517 39.7764C49.4156 39.2668 49.5969 38.8484 50.0832 38.6327C50.5562 38.4228 51.0032 38.5129 51.3124 38.9586C51.4493 39.156 51.5451 39.3835 51.644 39.6042C52.9036 42.4151 54.1601 45.2275 55.4186 48.039C55.5362 48.3011 55.6623 48.5595 55.871 49.0046Z"
      fill="#FDFDFD"
    ></path>
    <path
      d="M7.51204 51.4646C6.5243 51.4649 5.53583 51.4432 4.5488 51.4734C3.99953 51.4902 3.76356 51.3097 3.76965 50.7216C3.79094 48.6402 3.77674 46.5584 3.77906 44.4768C3.77935 44.2119 3.73358 43.9007 4.0566 43.7905C4.33862 43.6944 4.48884 43.95 4.65353 44.117C6.75142 46.2443 8.847 48.3743 10.9407 50.5059C11.1397 50.7085 11.427 50.9014 11.2608 51.2465C11.1149 51.5494 10.8024 51.4597 10.5477 51.4615C9.53591 51.4684 8.52398 51.4643 7.51204 51.4646Z"
      fill="#FDFDFD"
    ></path>
    <path
      d="M62.4287 14.9256C63.4634 14.9255 64.4986 14.9412 65.5327 14.9185C66.0278 14.9077 66.236 15.0552 66.2302 15.5745C66.2069 17.6654 66.2213 19.7566 66.2203 21.8477C66.2201 22.0609 66.2662 22.3093 66.0183 22.421C65.7309 22.5504 65.5634 22.3206 65.3934 22.1551C63.1962 20.0159 61.0012 17.8743 58.8074 15.7317C58.6526 15.5805 58.4569 15.4275 58.5491 15.1785C58.6571 14.8865 58.9342 14.9272 59.1768 14.9266C60.2607 14.9244 61.3448 14.9258 62.4287 14.9256Z"
      fill="#FCFDFD"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.0884 40.6238C21.0887 41.3164 21.089 42.0089 21.089 42.7015C21.0891 43.6093 21.089 44.5172 21.089 45.425C21.0889 46.8783 21.0888 48.3316 21.0891 49.7849C21.0894 50.8713 21.4417 51.4155 22.1295 51.3986C22.8009 51.3821 23.1313 50.8677 23.1334 49.827C23.134 49.4811 23.1369 49.1352 23.1397 48.7893C23.1472 47.8691 23.1547 46.9489 23.1218 46.0302C23.1005 45.4332 23.258 45.2511 23.8765 45.2508C24.3154 45.2506 24.7549 45.262 25.1945 45.2734C26.4101 45.305 27.6266 45.3367 28.8323 45.1227C30.9841 44.7409 32.7746 43.7992 33.6101 41.6409C35.0162 38.0089 32.6564 34.4384 28.709 34.2557C27.2127 34.1864 25.7128 34.1927 24.213 34.1989C23.643 34.2013 23.073 34.2037 22.5033 34.2019C21.3393 34.1982 21.0925 34.4485 21.0903 35.6181C21.0871 37.2867 21.0878 38.9552 21.0884 40.6238ZM23.1377 38.8178C23.1367 39.1145 23.1357 39.4112 23.1357 39.7079V41.8233C23.1355 43.3962 23.1357 43.412 24.6827 43.3914C25.0653 43.3863 25.4488 43.3952 25.8323 43.4041C26.7869 43.4263 27.7418 43.4484 28.6845 43.2546C30.0956 42.9644 31.2349 42.2759 31.7271 40.8334C32.551 38.4186 30.9715 36.2326 28.236 36.0686C27.3022 36.0126 26.3652 36.0137 25.428 36.0148C24.8327 36.0155 24.2374 36.0163 23.6428 36.0023C23.1958 35.992 23.1224 36.189 23.1293 36.5716C23.1427 37.3202 23.1402 38.069 23.1377 38.8178Z"
      fill="#FDFDFD"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.734 51.2647C41.0772 51.9584 43.1508 51.4437 45.0085 49.6021C45.0151 49.7141 45.0223 49.8099 45.0288 49.8953C45.0407 50.0537 45.0499 50.176 45.0474 50.298C45.0338 50.9304 45.3104 51.3348 45.9562 51.3991C46.506 51.4539 46.9605 51.042 46.9599 50.3869C46.9593 49.6329 46.972 48.8785 46.9848 48.1241C47.0173 46.2009 47.0499 44.2776 46.8608 42.3604C46.7303 41.0381 46.111 39.8972 44.9283 39.2489C42.4091 37.8681 39.8521 38.2446 37.3376 39.3164C36.9305 39.4899 36.7427 39.909 36.92 40.3667C37.1043 40.8424 37.4869 41.0184 37.9808 40.9072C38.1172 40.8765 38.2484 40.8239 38.3798 40.7712C38.4524 40.7421 38.525 40.713 38.5986 40.6876C39.8329 40.2606 41.0843 40.0298 42.3965 40.2792C43.9873 40.5815 44.8512 41.5257 45.0316 43.1465C45.0962 43.727 45.0088 43.9078 44.3548 43.7535C42.4875 43.3129 40.5957 43.1743 38.7266 43.7557C36.8003 44.3549 35.7754 45.7054 35.7872 47.5492C35.7986 49.334 36.8485 50.7066 38.734 51.2647ZM43.1475 49.4462C44.4057 48.8146 45.1065 47.8124 45.0657 46.2366L45.0657 46.2258C45.0689 45.3903 45.069 45.3681 44.1357 45.1893C42.6987 44.9145 41.249 44.7283 39.8042 45.1133C38.463 45.4707 37.7763 46.3326 37.8045 47.5372C37.831 48.6666 38.5825 49.5068 39.8871 49.8264C41.0163 50.1029 42.1144 49.9647 43.1475 49.4462Z"
      fill="#F2F5F7"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M51.7636 15.2574C52.5719 15.925 52.6936 17.1308 52.0355 17.9507L41.22 31.4252C40.5619 32.2451 39.3731 32.3686 38.5649 31.701C37.7566 31.0335 37.6349 29.8276 38.293 29.0078L49.1085 15.5333C49.7666 14.7134 50.9553 14.5899 51.7636 15.2574Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.1596 16.4474C38.1596 15.5121 38.907 14.7539 39.8291 14.7539H50.572C51.494 14.7539 52.2415 15.5121 52.2415 16.4474C52.2415 17.3827 51.494 18.1409 50.572 18.1409H39.8291C38.907 18.1409 38.1596 17.3827 38.1596 16.4474Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.3773 30.4373C38.3773 29.502 39.1248 28.7438 40.0468 28.7438H50.7897C51.7118 28.7438 52.4592 29.502 52.4592 30.4373C52.4592 31.3726 51.7118 32.1308 50.7897 32.1308H40.0468C39.1248 32.1308 38.3773 31.3726 38.3773 30.4373Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.67079 14.7539C6.72082 14.7539 7.57204 15.6047 7.57204 16.6542V30.3946C7.57204 31.4441 6.72082 32.2949 5.67079 32.2949C4.62075 32.2949 3.76953 31.4441 3.76953 30.3946V16.6542C3.76953 15.6047 4.62075 14.7539 5.67079 14.7539Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.1898 15.3317C17.9207 16.0853 17.902 17.2883 17.148 18.0188L7.94472 26.9353C7.19077 27.6658 5.98711 27.6471 5.25627 26.8935C4.52543 26.1399 4.54416 24.9369 5.29811 24.2064L14.5014 15.2899C15.2553 14.5594 16.459 14.5781 17.1898 15.3317Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.2934 31.8506C16.4627 32.4925 15.2686 32.3398 14.6263 31.5095L9.06601 24.3214C8.42375 23.4911 8.57653 22.2976 9.40724 21.6557C10.238 21.0138 11.432 21.1665 12.0743 21.9967L17.6346 29.1849C18.2769 30.0152 18.1241 31.2087 17.2934 31.8506Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.7383 14.918C23.7976 14.918 24.6564 15.6241 24.6564 16.6759V30.4464C24.6564 31.4982 23.7976 32.1311 22.7383 32.1311C21.679 32.1311 20.8203 31.4982 20.8203 30.4464V16.6759C20.8203 15.6241 21.679 14.918 22.7383 14.918Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.4842 14.918H22.8859V23.2682H30.4842C32.8066 23.2682 34.6892 21.3989 34.6892 19.0931C34.6892 16.7872 32.8066 14.918 30.4842 14.918ZM24.9515 18.2873C24.87 18.2873 24.8039 18.3529 24.8039 18.4338V21.6567C24.8039 21.7376 24.87 21.8032 24.9515 21.8032H29.0826C30.0604 21.8032 30.8531 21.0162 30.8531 20.0453C30.8531 19.0744 30.0604 18.2873 29.0826 18.2873H24.9515Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.4316 32.1311H22.8859V23.1949H31.7173C33.8475 23.1949 35.5744 24.9096 35.5744 27.0247C35.5744 29.8449 33.2719 32.1311 30.4316 32.1311ZM24.92 28.6885C24.8559 28.6885 24.8039 28.6369 24.8039 28.5732V25.1414C24.8039 25.0777 24.8559 25.0261 24.92 25.0261H30.0416C31.0602 25.0261 31.8859 25.8459 31.8859 26.8573C31.8859 27.8686 31.0602 28.6885 30.0416 28.6885H24.92Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-bankName"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 49 48"
    fill="none"
  >
    <g clipPath="url(#clip0_2093_19994)">
      <path
        d="M44.9609 38V44H4.96094V38C4.96094 36.9 5.86094 36 6.96094 36H42.9609C44.0609 36 44.9609 36.9 44.9609 38Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M16.9609 22H8.96094V36H16.9609V22Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M28.9609 22H20.9609V36H28.9609V22Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M40.9609 22H32.9609V36H40.9609V22Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M46.9609 45.4997H2.96094C2.14094 45.4997 1.46094 44.8197 1.46094 43.9997C1.46094 43.1797 2.14094 42.4997 2.96094 42.4997H46.9609C47.7809 42.4997 48.4609 43.1797 48.4609 43.9997C48.4609 44.8197 47.7809 45.4997 46.9609 45.4997ZM43.7009 11.4997L25.7009 4.29969C25.3009 4.13969 24.6209 4.13969 24.2209 4.29969L6.22094 11.4997C5.52094 11.7797 4.96094 12.5997 4.96094 13.3597V19.9997C4.96094 21.0997 5.86094 21.9997 6.96094 21.9997H42.9609C44.0609 21.9997 44.9609 21.0997 44.9609 19.9997V13.3597C44.9609 12.5997 44.4009 11.7797 43.7009 11.4997ZM24.9609 16.9997C23.3009 16.9997 21.9609 15.6597 21.9609 13.9997C21.9609 12.3397 23.3009 10.9997 24.9609 10.9997C26.6209 10.9997 27.9609 12.3397 27.9609 13.9997C27.9609 15.6597 26.6209 16.9997 24.9609 16.9997Z"
        fill="var(--main-color)"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_2093_19994">
        <rect
          width="48"
          height="48"
          fill="white"
          transform="translate(0.960938)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-bankTitle"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_6487_39735)">
      <path
        opacity="0.4"
        d="M45.7147 17.1445V33.314C45.7147 38.2775 41.6758 42.2874 36.7033 42.2874H11.2976C6.32499 42.2874 2.28613 38.2775 2.28613 33.314V17.1445H45.7147Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M45.7147 14.5957V17.7275H2.28613V14.5957C2.28613 9.68333 6.32499 5.71484 11.2976 5.71484H36.7033C41.6758 5.71484 45.7147 9.68333 45.7147 14.5957ZM15.3147 35.4291H10.9718C10.0816 35.4291 9.34328 34.6998 9.34328 33.8203C9.34328 32.9408 10.0816 32.2114 10.9718 32.2114H15.3147C16.205 32.2114 16.9433 32.9408 16.9433 33.8203C16.9433 34.6998 16.205 35.4291 15.3147 35.4291ZM29.429 35.4291H20.7433C19.853 35.4291 19.1147 34.6998 19.1147 33.8203C19.1147 32.9408 19.853 32.2114 20.7433 32.2114H29.429C30.3193 32.2114 31.0576 32.9408 31.0576 33.8203C31.0576 34.6998 30.3193 35.4291 29.429 35.4291Z"
        fill="var(--main-color)"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6487_39735">
        <rect width="48" height="48" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-bankWave"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.0332029 34.9543C0.0332029 28.5512 -0.0578035 22.1463 0.0615189 15.7454C0.160054 10.464 2.10146 5.98753 6.55829 2.85183C8.86257 1.23062 11.4674 0.448946 14.2515 0.166534C15.6089 0.0288521 16.9652 0.003611 18.3257 0.00377491C29.932 0.00606961 41.5384 -0.0122872 53.1446 0.0159049C56.5288 0.0241002 59.8148 0.561387 62.754 2.4101C66.6491 4.86002 68.9105 8.3932 69.6589 12.9113C69.935 14.5787 70.0016 16.2612 70 17.9519C69.9885 29.6688 70.0072 41.3857 69.9861 53.1025C69.9795 56.7502 69.3618 60.2637 67.2168 63.338C64.3954 67.3817 60.4324 69.4006 55.5854 69.85C54.2273 69.9759 52.8703 69.9957 51.5099 69.9956C39.9854 69.9943 28.4607 70.0121 16.9362 69.9843C13.4664 69.9759 10.0964 69.4306 7.10334 67.4971C3.2973 65.0385 1.07388 61.538 0.341576 57.0798C0.067576 55.4116 -0.00247982 53.7299 0.00243057 52.0392C0.0189622 46.3443 0.00865072 40.6493 0.00865072 34.9543C0.0168347 34.9543 0.0250189 34.9543 0.0332029 34.9543Z"
      fill="#FEE412"
    ></path>
    <path
      d="M38.1666 14.1537C37.9433 14.4628 37.6544 14.4843 37.4212 14.6004C31.1832 17.703 27.0532 22.543 25.4569 29.3736C24.6675 32.7514 25.0655 36.0984 26.3473 39.3151C27.176 41.3951 30.1111 44.0473 30.3566 44.2931C30.6021 44.539 30.9455 44.7578 31.175 44.9487C33.9698 47.2744 37.7417 46.7406 40.0284 43.9104C42.7778 40.5079 42.2777 34.9898 38.9614 32.1366C36.2858 29.8344 32.5948 30.0706 30.2718 32.7318C28.5499 34.7044 28.0401 37.0406 28.3681 39.5952C28.3993 39.8381 28.4483 40.0787 28.4823 40.3213C28.4895 40.3723 28.4823 40.4939 28.457 40.4939C28.3106 40.4413 28.1587 40.2197 28.0758 40.0599C25.9525 35.9627 25.7171 31.7018 27.2407 27.3974C29.0249 22.3561 32.3908 18.6179 37.0956 16.0827C39.6495 14.7066 42.4362 14.6676 45.1778 14.9574C52.7197 15.7544 58.584 21.3602 59.9011 28.8262C61.3047 36.7813 56.7036 44.6544 49.0667 47.4167C46.3417 48.4023 43.5821 49.1943 40.6758 49.4174C32.4701 50.0469 25.8088 47.0338 20.563 40.8086C16.6909 36.2135 14.5111 30.9486 14.7393 24.8432C14.9745 18.5502 18.7897 13.492 24.5627 12.0619C29.2544 10.8997 33.7528 11.6261 37.9594 14.0411C38.0263 14.0795 38.0949 14.1149 38.1666 14.1537Z"
      fill="#0090C6"
    ></path>
    <path
      d="M44.528 50.4153C41.1087 55.9847 36.0134 58.5097 29.603 58.4185C19.6597 58.2773 11.5942 51.2251 10.0466 41.3699C9.37127 37.0693 10.3358 33.148 13.1528 29.7543C13.3182 29.5548 13.4451 29.2988 13.7815 29.1901C13.8787 29.6489 13.9502 30.1003 14.0705 30.5381C16.8162 40.5218 22.8953 47.3061 33.0326 50.0868C36.4426 51.0222 39.9337 50.9042 43.4056 50.2992C43.6466 50.2573 43.8639 50.2315 44.1057 50.1938C44.3749 50.1518 44.5308 50.105 44.528 50.4153Z"
      fill="#0090C6"
    ></path>
    <path
      d="M44.528 50.4137C44.4556 50.2334 44.2532 50.2433 44.1057 50.1931C44.4077 50.1198 44.647 50.0795 44.6797 50.1113C44.7067 50.138 44.5967 50.2749 44.528 50.4137Z"
      fill="#0090C6"
    ></path>
  </symbol>
  <symbol
    id="icon-bookicon"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 37C7 29.2967 7 11 7 11C7 7.68629 9.68629 5 13 5H35V31C35 31 18.2326 31 13 31C9.7 31 7 33.6842 7 37Z"
      fill="var(--main-color)"
      stroke="#07DDD1"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M35 31C35 31 14.1537 31 13 31C9.68629 31 7 33.6863 7 37C7 40.3137 9.68629 43 13 43C15.2091 43 25.8758 43 41 43V7"
      stroke="#07DDD1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M14 37H34"
      stroke="#07DDD1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-cart"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.3568 46.8747C23.3703 46.8747 25.0026 45.2424 25.0026 43.2288C25.0026 41.2153 23.3703 39.583 21.3568 39.583C19.3432 39.583 17.7109 41.2153 17.7109 43.2288C17.7109 45.2424 19.3432 46.8747 21.3568 46.8747Z"
      fill="var(--light-bg_white, var(--main-color))"
    ></path>
    <path
      d="M39.0599 46.8747C41.0734 46.8747 42.7057 45.2424 42.7057 43.2288C42.7057 41.2153 41.0734 39.583 39.0599 39.583C37.0464 39.583 35.4141 41.2153 35.4141 43.2288C35.4141 45.2424 37.0464 46.8747 39.0599 46.8747Z"
      fill="var(--light-bg_white, var(--main-color))"
    ></path>
    <path
      d="M5.21094 6.25L14.5859 12.5L19.7943 35.4167H40.6276L45.8359 17.7083H26.0443"
      stroke="var(--light-bg_white, var(--main-color))"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M26.0391 27.083H33.6148H42.7057"
      stroke="var(--light-bg_white, var(--main-color))"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-changlong"
    viewBox="0 0 110 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 55C0 24.6243 24.6243 0 55 0C85.3757 0 110 24.6243 110 55C110 85.3757 85.3757 110 55 110C24.6243 110 0 85.3757 0 55Z"
      fill="white"
    ></path>
    <g filter="url(#filter0_i_234_67307)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.2127 22.7154C20.9535 27.0685 10.3928 38.0529 8.51501 54.2338C6.06343 75.3592 20.7729 99.4571 46.3545 103.385C66.8198 106.527 82.3109 94.5738 87.4983 88.2044C99.01 72.9176 97.7309 60.2849 97.7309 60.2849C97.7309 60.2849 96.5584 66.7604 92.0816 70.5822C86.5846 75.2749 82.7017 75.3593 81.849 75.3593C79.5395 73.4838 73.5989 68.6925 67.8857 65.805C60.7441 62.1956 50.1917 56.1446 50.5115 50.1999C50.8341 44.2033 56.5871 41.6011 66.7132 42.3442C67.033 42.3677 64.5814 46.8026 62.1298 48.8197C66.429 49.3859 76.2637 50.943 79.9304 53.9154C83.5971 56.8878 82.7372 59.4002 81.849 60.2849C82.9504 60.3556 85.7289 60.1362 88.0312 58.6925C90.3335 57.2487 91.4776 55.5432 91.7619 54.8708C90.8381 55.2601 88.7987 55.7201 88.0312 54.4462C87.2638 53.1723 87.4272 51.9338 87.6048 51.4738C84.4071 51.0845 78.3102 49.5842 79.504 46.6967C80.9963 43.0873 85.2599 42.9811 86.6455 43.4058C88.0312 43.8304 90.696 44.892 91.0157 50.6245C91.028 50.8438 91.3137 50.6318 91.8062 50.2665C92.9475 49.4199 95.1993 47.7495 97.7309 48.7137C99.5429 49.4037 99.2587 53.3138 97.7309 54.4462C99.5429 54.0923 104.233 51.686 105.405 45.9536C105.492 45.5296 105.076 45.4781 104.251 45.3761C102.851 45.2027 100.273 44.8837 96.9848 42.3442C92.8064 39.117 91.6197 38.1687 91.5487 38.0979L91.7619 34.17C91.328 33.8937 90.8607 33.5972 90.3688 33.2851C86.3885 30.76 80.798 27.2134 78.3315 25.0405C75.8009 22.8111 70.4438 16.4416 68.9516 3.91506C68.6652 1.51115 67.6725 17.1848 71.0205 23.7666C71.6774 25.0581 57.5901 12.7262 55.7781 7.20595C55.7093 6.99642 56.9069 15.0616 62.4496 22.3865C63.0004 23.1144 62.0893 22.9956 60.1669 22.7449C56.2017 22.2277 47.9341 21.1493 39.3195 25.7836C24.7167 33.6393 23.5442 47.8644 24.7167 54.4462C25.5677 59.2233 27.2749 65.9112 36.1218 74.6162C38.0053 76.4694 32.6044 81.3041 23.4376 75.3593C18.1081 71.903 12.2457 66.3358 13.3116 51.4738C14.4387 35.7572 24.0384 25.2296 27.2127 22.7154ZM80.7831 32.8961L88.0312 36.2931L85.3665 37.8855C84.8335 37.1424 83.5971 35.4863 82.9149 34.8069C82.2327 34.1275 81.2094 33.2499 80.7831 32.8961Z"
        fill="url(#paint0_linear_234_67307)"
      ></path>
    </g>
    <mask
      id="mask0_234_67307"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="8"
      y="3"
      width="98"
      height="101"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.2127 22.7154C20.9535 27.0685 10.3928 38.0529 8.51501 54.2338C6.06343 75.3592 20.7729 99.4571 46.3545 103.385C66.8198 106.527 82.3109 94.5738 87.4983 88.2044C99.01 72.9176 97.7309 60.2849 97.7309 60.2849C97.7309 60.2849 96.5584 66.7604 92.0816 70.5822C86.5846 75.2749 82.7017 75.3593 81.849 75.3593C79.5395 73.4838 73.5989 68.6925 67.8857 65.805C60.7441 62.1956 50.1917 56.1446 50.5115 50.1999C50.8341 44.2033 56.5871 41.6011 66.7132 42.3442C67.033 42.3677 64.5814 46.8026 62.1298 48.8197C66.429 49.3859 76.2637 50.943 79.9304 53.9154C83.5971 56.8878 82.7372 59.4002 81.849 60.2849C82.9504 60.3556 85.7289 60.1362 88.0312 58.6925C90.3335 57.2487 91.4776 55.5432 91.7619 54.8708C90.8381 55.2601 88.7987 55.7201 88.0312 54.4462C87.2638 53.1723 87.4272 51.9338 87.6048 51.4738C84.4071 51.0845 78.3102 49.5842 79.504 46.6967C80.9963 43.0873 85.2599 42.9811 86.6455 43.4058C88.0312 43.8304 90.696 44.892 91.0157 50.6245C91.028 50.8438 91.3137 50.6318 91.8062 50.2665C92.9475 49.4199 95.1993 47.7495 97.7309 48.7137C99.5429 49.4037 99.2587 53.3138 97.7309 54.4462C99.5429 54.0923 104.233 51.686 105.405 45.9536C105.492 45.5296 105.076 45.4781 104.251 45.3761C102.851 45.2027 100.273 44.8837 96.9848 42.3442C92.8064 39.117 91.6197 38.1687 91.5487 38.0979L91.7619 34.17C91.328 33.8937 90.8607 33.5972 90.3688 33.2851C86.3885 30.76 80.798 27.2134 78.3315 25.0405C75.8009 22.8111 70.4438 16.4416 68.9516 3.91506C68.6652 1.51115 67.6725 17.1848 71.0205 23.7666C71.6774 25.0581 57.5901 12.7262 55.7781 7.20595C55.7093 6.99642 56.9069 15.0616 62.4496 22.3865C63.0004 23.1144 62.0893 22.9956 60.1669 22.7449C56.2017 22.2277 47.9341 21.1493 39.3195 25.7836C24.7167 33.6393 23.5442 47.8644 24.7167 54.4462C25.5677 59.2233 27.2749 65.9112 36.1218 74.6162C38.0053 76.4694 32.6044 81.3041 23.4376 75.3593C18.1081 71.903 12.2457 66.3358 13.3116 51.4738C14.4387 35.7572 24.0384 25.2296 27.2127 22.7154ZM80.7831 32.8961L88.0312 36.2931L85.3665 37.8855C84.8335 37.1424 83.5971 35.4863 82.9149 34.8069C82.2327 34.1275 81.2094 33.2499 80.7831 32.8961Z"
        fill="url(#paint1_linear_234_67307)"
      ></path>
    </mask>
    <g mask="url(#mask0_234_67307)">
      <path
        d="M53.4702 40.7507C58.3388 39.982 64.0941 41.421 66.9165 42.1667C65.0832 44 51.1418 44.4792 51.0359 49.5926C50.949 53.7944 55.9611 59.1425 63.2073 62.6958C75.5904 68.7679 80.459 73.5618 82.1524 75.0532C89.0042 81.0877 88.0286 87.5368 88.0286 87.5368C88.0286 87.5368 85.2617 91.7759 79.3348 95.7193C73.4078 99.6627 68.2915 101.292 68.2915 101.292C68.2915 101.292 79.6122 92.0979 65.6416 80.8058C59.2744 75.6594 40.7696 62.8023 40.9813 53.5342C41.1735 45.1206 48.0725 41.6029 53.4702 40.7507Z"
        fill="url(#paint2_linear_234_67307)"
      ></path>
      <path
        d="M86.3869 80.393C84.7918 77.4583 82.4971 75.913 81.5835 75.1667C82.7894 75.1667 88.2507 74.3154 93.0744 69.6239C96.0154 66.7635 97.3071 62.2668 97.7456 59.9211C97.8552 62.2668 98.227 66.2119 96.4729 71.6498C94.639 77.3353 91.5371 83.5917 88.0289 87.5368C88.0289 85.4043 87.6891 82.7887 86.3869 80.393Z"
        fill="url(#paint3_linear_234_67307)"
      ></path>
      <g filter="url(#filter1_i_234_67307)">
        <path
          d="M46.7881 83.8169C44.1408 81.3327 38.2516 76.6504 35.75 74.25C35.4284 81.4512 14.3201 77.357 13.4453 55.7534C12.6948 37.2209 22.7727 26.8427 28.1333 22.0772C21.0573 26.4191 8.94238 39.9743 8.29912 55.7534C7.72107 69.9325 12.266 81.2753 20.8429 89.8532C29.9493 98.9606 40.912 102.684 46.0939 103.39C48.0237 102.861 51.1248 99.2783 52.0415 95.2541C53.1753 90.2768 48.9324 85.829 46.7881 83.8169Z"
          fill="url(#paint4_linear_234_67307)"
        ></path>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_i_234_67307"
        x="8.25"
        y="1.66666"
        width="97.1665"
        height="102.235"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="-2"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        ></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 0.964706 0 0 0 0 0.956863 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_234_67307"
        ></feBlend>
      </filter>
      <filter
        id="filter1_i_234_67307"
        x="8.25"
        y="20.0772"
        width="43.9805"
        height="83.3131"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="-2"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        ></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 0.964706 0 0 0 0 0.956863 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_234_67307"
        ></feBlend>
      </filter>
      <linearGradient
        id="paint0_linear_234_67307"
        x1="56.8333"
        y1="3.66666"
        x2="56.8333"
        y2="103.902"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF7F79"></stop>
        <stop offset="1" stopColor="#FB4B4B"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_234_67307"
        x1="56.8333"
        y1="3.66666"
        x2="56.8333"
        y2="103.902"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF736D"></stop>
        <stop offset="1" stopColor="#F73E46"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_234_67307"
        x1="64.4833"
        y1="40.4526"
        x2="64.4833"
        y2="100.833"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F3464A"></stop>
        <stop offset="1" stopColor="#FFAA96"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_234_67307"
        x1="98.3367"
        y1="61.3072"
        x2="88.0919"
        y2="86.5664"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C8B"></stop>
        <stop offset="1" stopColor="#F7434A"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_234_67307"
        x1="30.2404"
        y1="22.0772"
        x2="30.2404"
        y2="102.879"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.111391" stopColor="#FF9E8D"></stop>
        <stop offset="1" stopColor="#EF323B"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-chat"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="30" cy="24" r="18" fill="#FFF4F4"></circle>
    <line
      x1="17.4375"
      y1="19.125"
      x2="17.4375"
      y2="23.375"
      stroke="#FFCDCB"
      strokeWidth="4"
      strokeLinecap="round"
    ></line>
    <line
      x1="29.125"
      y1="19.125"
      x2="29.125"
      y2="23.375"
      stroke="#FFCDCB"
      strokeWidth="4"
      strokeLinecap="round"
    ></line>
    <path
      d="M39.5469 32.0192C42.1287 28.9816 43.6344 25.2175 43.6344 21.2328C43.6344 11.6544 34.9341 3.35014 23.5 3.35014C12.0659 3.35014 3.36559 11.6544 3.36559 21.2328C3.36559 29.4476 9.76503 36.7251 18.8 38.6308V42.0409C8.07347 40.0735 0 31.505 0 21.2328C0 9.50625 10.5213 0 23.5 0C36.4787 0 47 9.50625 47 21.2328C47 26.1009 45.1868 30.5864 42.1373 34.1679L39.5469 32.0192Z"
      fill="#FFCDCB"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.8274 39.1807C33.4277 39.8869 33.3392 40.9439 32.6297 41.5414L27.2077 47.1082C25.7525 48.3339 23.6088 48.2916 22.2035 47.0094L17.2588 41.4975C16.5737 40.8724 16.5274 39.8128 17.1554 39.1308C17.7834 38.4489 18.8479 38.4028 19.533 39.0279L24.4777 44.5398C24.6339 44.6823 24.8721 44.687 25.0338 44.5508L30.4558 38.984C31.1652 38.3864 32.2271 38.4745 32.8274 39.1807Z"
      fill="#FFCDCB"
    ></path>
    <path
      d="M41.9426 31.931C42.6223 32.5619 42.6595 33.6218 42.0257 34.2984C41.3918 34.975 40.327 35.0121 39.6473 34.3811C38.9676 33.7502 38.9304 32.6903 39.5642 32.0137C40.198 31.3371 41.2629 31.3001 41.9426 31.931Z"
      fill="#FFCDCB"
    ></path>
  </symbol>
  <symbol
    id="icon-chess"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <ellipse
      cx="24"
      cy="24.005"
      rx="18"
      ry="17.8488"
      stroke="currentColor"
    ></ellipse>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 41.8538C33.9411 41.8538 42 33.8626 42 24.005C42 14.1474 33.9411 6.15625 24 6.15625C14.0589 6.15625 6 14.1474 6 24.005C6 33.8626 14.0589 41.8538 24 41.8538ZM27.695 20.2582C29.1348 21.6473 30.605 23.0657 30.9686 24.2357C31.8261 26.9953 30.214 29.1047 27.5731 29.1047C26.3543 29.1047 25.5007 28.5988 24.9348 28.0538C24.8988 28.3954 24.9022 28.8583 25.0286 29.3597C25.2343 30.1757 25.8001 30.8896 26.0572 31.1446V31.6546H21.9429V31.1446C22.2001 30.8896 22.6806 30.2252 22.9715 29.3597C23.1357 28.8713 23.1601 28.383 23.1117 28.0273C22.5608 28.5822 21.7345 29.1047 20.5764 29.1047C18.107 29.1047 16.0833 27.1281 17.0437 24.2357C17.4482 23.0175 18.9112 21.6047 20.3334 20.2313C20.6173 19.9571 20.8996 19.6846 21.1715 19.4154C22.613 17.9885 23.7554 16.6492 23.9699 16.3978C23.9935 16.3701 24.0058 16.3556 24.0061 16.3556C24.0064 16.3556 24.0181 16.3694 24.0404 16.3959C24.2493 16.6429 25.3886 17.9907 26.8286 19.4154C27.1097 19.6935 27.4019 19.9754 27.695 20.2582Z"
      fill="currentColor"
    ></path>
    <path
      d="M18.4797 7.06917C18.444 6.91493 18.5358 6.76114 18.6883 6.72516C19.2212 6.59948 20.5013 6.32678 22.2273 6.15328C23.9533 5.97978 25.2626 5.99219 25.81 6.00927C25.9667 6.01417 26.0878 6.14656 26.084 6.30476L25.9992 9.91235C25.9961 10.0424 25.909 10.1543 25.7839 10.185C25.3094 10.3016 24.087 10.5796 22.6941 10.7196C21.3013 10.8596 20.0475 10.8306 19.559 10.8108C19.4302 10.8055 19.3223 10.7133 19.293 10.5865L18.4797 7.06917Z"
      fill="#B8DBC8"
    ></path>
    <path
      d="M29.4974 40.9561C29.5324 41.1105 29.44 41.2639 29.2874 41.2993C28.754 41.423 27.4729 41.6908 25.7462 41.8577C24.0196 42.0247 22.7104 42.0073 22.163 41.9881C22.0063 41.9826 21.8858 41.8498 21.8901 41.6916L21.9889 38.0844C21.9925 37.9543 22.08 37.8428 22.2052 37.8125C22.6802 37.6977 23.9037 37.4244 25.2971 37.2897C26.6905 37.155 27.9441 37.1888 28.4325 37.2104C28.5613 37.2162 28.6689 37.3089 28.6977 37.4358L29.4974 40.9561Z"
      fill="#B8DBC8"
    ></path>
    <path
      d="M41.4839 28.0003C41.6328 28.0476 41.7161 28.2035 41.6691 28.3532C41.506 28.8727 41.0896 30.1027 40.3604 31.6618C39.6312 33.2209 38.9531 34.3306 38.6586 34.7896C38.5737 34.9219 38.3998 34.9595 38.2673 34.8774L35.1728 32.9594C35.0633 32.8915 35.0122 32.76 35.0498 32.6359C35.1914 32.1699 35.5735 30.9877 36.1615 29.7307C36.7494 28.4737 37.4128 27.4207 37.6801 27.0126C37.7512 26.9039 37.8856 26.8576 38.0085 26.8967L41.4839 28.0003Z"
      fill="#B8DBC8"
    ></path>
    <path
      d="M40.5726 17.1763C40.7119 17.1047 40.7682 16.9368 40.6967 16.7973C40.4482 16.3124 39.8299 15.1688 38.8475 13.7526C37.865 12.3364 37.009 11.3549 36.6412 10.9514C36.5353 10.8353 36.3571 10.8275 36.2399 10.9309L33.5144 13.3345C33.4176 13.4199 33.3892 13.5581 33.4471 13.6738C33.6652 14.1094 34.2418 15.2119 35.0341 16.3538C35.8263 17.4958 36.6584 18.424 36.9907 18.7817C37.079 18.8767 37.2193 18.8998 37.3343 18.8407L40.5726 17.1763Z"
      fill="#B8DBC8"
    ></path>
    <path
      d="M7.53066 31.2649C7.3933 31.3402 7.34138 31.5095 7.41662 31.6471C7.67806 32.1251 8.327 33.252 9.34734 34.6417C10.3677 36.0313 11.2499 36.9898 11.6284 37.3834C11.7374 37.4966 11.9158 37.4996 12.0302 37.3931L14.6897 34.9182C14.7842 34.8303 14.8089 34.6914 14.7479 34.5773C14.5182 34.1477 13.912 33.0609 13.0892 31.9402C12.2664 30.8196 11.4095 29.9138 11.0677 29.5651C10.977 29.4724 10.836 29.4531 10.7227 29.5153L7.53066 31.2649Z"
      fill="#B8DBC8"
    ></path>
    <path
      d="M6.40816 20.1019C6.25952 20.054 6.17679 19.8977 6.22441 19.7482C6.38965 19.2295 6.81106 18.0011 7.5467 16.445C8.28233 14.8888 8.96491 13.7819 9.26132 13.3241C9.34673 13.1921 9.52082 13.1552 9.65301 13.2379L12.7396 15.1683C12.8488 15.2366 12.8994 15.3684 12.8612 15.4922C12.7178 15.9577 12.3308 17.1384 11.7377 18.393C11.1446 19.6476 10.4769 20.6979 10.2079 21.105C10.1363 21.2133 10.0018 21.2591 9.87898 21.2195L6.40816 20.1019Z"
      fill="#B8DBC8"
    ></path>
    <mask
      id="mask0_2094_41589"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="11"
      y="11"
      width="26"
      height="26"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.9978 36.7541C31.0986 36.7541 36.8549 31.0461 36.8549 24.005C36.8549 16.9638 31.0986 11.2559 23.9978 11.2559C16.897 11.2559 11.1406 16.9638 11.1406 24.005C11.1406 31.0461 16.897 36.7541 23.9978 36.7541ZM23.9978 35.7342C30.5305 35.7342 35.8263 30.4828 35.8263 24.005C35.8263 17.5271 30.5305 12.2758 23.9978 12.2758C17.465 12.2758 12.1692 17.5271 12.1692 24.005C12.1692 30.4828 17.465 35.7342 23.9978 35.7342Z"
        fill="currentColor"
      ></path>
    </mask>
    <g mask="url(#mask0_2094_41589)">
      <path
        d="M21.4299 11.0021L24.5148 10.9336L24.5609 12.9729L21.4759 13.0415L21.4299 11.0021Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M28.3322 11.3949L31.1971 12.5315L30.4329 14.4254L27.568 13.2888L28.3322 11.3949Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M17.4308 12.2151L14.9296 14.007L16.1343 15.6604L18.6355 13.8685L17.4308 12.2151Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M12.3368 17.3762L11.14 20.1965L13.0361 20.9876L14.2329 18.1673L12.3368 17.3762Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M10.8828 23.7507L10.8828 26.8105L12.94 26.8105V23.7507L10.8828 23.7507Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M12.5203 30.4231L14.2092 32.9839L15.9309 31.8674L14.242 29.3066L12.5203 30.4231Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M16.7971 35.5881L19.6607 36.7279L20.427 34.8348L17.5634 33.6951L16.7971 35.5881Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M23.4828 37.2646L26.5682 37.3118L26.5999 35.2722L23.5146 35.225L23.4828 37.2646Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M30.5929 35.8649L33.1037 34.0863L31.9079 32.4264L29.3971 34.205L30.5929 35.8649Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M35.2458 31.0912L36.5971 28.3404L34.7477 27.4471L33.3964 30.1979L35.2458 31.0912Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M37.392 24.5156L37.3686 21.4559L35.3115 21.4714L35.335 24.5311L37.392 24.5156Z"
        fill="#B8DBC8"
      ></path>
      <path
        d="M35.824 17.7544L34.0818 15.2289L32.3839 16.3806L34.1261 18.9061L35.824 17.7544Z"
        fill="#B8DBC8"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-clock_b"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="none"
  >
    <path
      d="M49.9046 27.0391C50.0517 27.7139 50.3656 28.3391 50.8158 28.8554H28.6882V25.7923C28.6882 20.1291 33.3609 15.6107 39.5384 15.6107C45.4703 15.6107 49.8701 19.9903 49.8701 25.8288V26.7195V26.8812L49.9046 27.0391ZM56.7053 28.9486C57.2005 28.4152 57.5444 27.755 57.7005 27.0391L57.7349 26.8812V26.7195V25.8559C57.7752 23.4025 57.3256 20.9657 56.4129 18.6958C55.4985 16.4217 54.1382 14.3621 52.4141 12.646L52.4042 12.6362L52.3941 12.6265C48.9558 9.32933 44.4187 7.49241 39.7005 7.50002L39.4816 7.50002L39.4809 7.50002C34.707 7.50203 30.106 9.30237 26.5465 12.55L26.5465 12.55L26.5429 12.5532C24.7253 14.2225 23.276 16.267 22.2885 18.5501C21.3016 20.8319 20.7978 23.3014 20.8092 25.7958V29.6025C18.5861 30.3692 16.6212 31.7782 15.1551 33.6654C13.4403 35.8728 12.507 38.6062 12.5 41.42V41.4237L12.5 59.939L12.5 59.9428C12.5085 63.2588 13.7938 66.4444 16.0873 68.8006C18.3821 71.1582 21.5008 72.4934 24.7634 72.5H24.7665L55.2406 72.5L55.2437 72.5C58.5059 72.4934 61.6239 71.1579 63.9177 68.7998C66.21 66.4432 67.4936 63.2573 67.5 59.9419V59.939L67.5 41.4237L67.5 41.4208C67.4936 38.1049 66.2104 34.9184 63.9184 32.5607C61.9702 30.5565 59.4269 29.2898 56.7053 28.9486Z"
      fill="currentColor"
      stroke="#333333"
      strokeWidth="3"
    ></path>
    <path
      d="M40.0473 39H40.0125C37.8143 39.0425 35.7039 39.888 34.0647 41.3828C32.4254 42.8777 31.366 44.9228 31.0787 47.1467C30.7915 49.3706 31.2956 51.6259 32.4994 53.503C33.7032 55.38 35.5269 56.7543 37.6393 57.3763V61.0402C37.7072 61.3594 37.8362 61.6616 38.0189 61.9297C38.2016 62.1978 38.4345 62.4264 38.7041 62.6024C39.0953 62.8626 39.5524 63.0008 40.0195 63C40.1926 62.9987 40.3651 62.9796 40.5345 62.9432C40.9997 62.8434 41.4263 62.6076 41.7624 62.2647C42.0986 61.9217 42.3296 61.4864 42.4275 61.0118V57.355C44.5245 56.7199 46.3306 55.3423 47.5209 53.4698C48.7112 51.5973 49.2075 49.3529 48.9206 47.1404C48.6337 44.9279 47.5824 42.8924 45.9558 41.4002C44.3292 39.9079 42.2341 39.0568 40.0473 39ZM44.4179 48.3444C44.4188 48.9318 44.3063 49.5137 44.0868 50.0568C43.8673 50.5999 43.5452 51.0936 43.1387 51.5096C42.7322 51.9257 42.2493 52.256 41.7177 52.4816C41.1861 52.7073 40.6161 52.8239 40.0404 52.8249C38.8787 52.8249 37.7645 52.3545 36.9425 51.5171C36.1204 50.6798 35.6577 49.5438 35.6558 48.3586C35.6503 47.1722 36.1069 46.0321 36.9253 45.1892C37.7436 44.3463 38.8566 43.8696 40.0195 43.8639C41.1823 43.8583 42.2998 44.3241 43.1259 45.1591C43.9521 45.994 44.4194 47.1296 44.4249 48.316L44.4179 48.3444Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-close"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 57C44.9117 57 57 44.9117 57 30C57 15.0883 44.9117 3 30 3C15.0883 3 3 15.0883 3 30C3 44.9117 15.0883 57 30 57Z"
      stroke="white"
      strokeWidth="4"
      strokeLinejoin="round"
    ></path>
    <path
      d="M43 17L17 43"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M17 17L43 43"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-copy"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-copy4d"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.5 6.2158V3.90625C6.5 3.1296 7.1296 2.5 7.90625 2.5H20.0938C20.8704 2.5 21.5 3.1296 21.5 3.90625V16.0938C21.5 16.8704 20.8704 17.5 20.0938 17.5H17.7582"
      stroke="#E6EBF0"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M16.0938 6.5H3.90625C3.1296 6.5 2.5 7.1296 2.5 7.90625V20.0938C2.5 20.8704 3.1296 21.5 3.90625 21.5H16.0938C16.8704 21.5 17.5 20.8704 17.5 20.0938V7.90625C17.5 7.1296 16.8704 6.5 16.0938 6.5Z"
      fill="var(--text_color_L1)"
      stroke="#E6EBF0"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-customer1"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon">
      <path
        id="Vector"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.60868 36.9866C5.32131 33.3783 3.32142 28.6145 3.32142 23.3913C3.32142 12.1271 12.6179 2.99561 24.0856 2.99561C35.5534 2.99561 44.8499 12.1271 44.8499 23.3913C44.8499 31.356 40.2004 38.2515 33.4234 41.6092C29.277 43.7709 24.5467 44.9956 19.5253 44.9956C13.3726 44.9956 7.6569 43.157 2.91699 40.0087C2.91699 40.0087 6.09557 39.662 8.60786 36.9874L8.60868 36.9866Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.8397 33.4854C39.2117 28.1136 39.2117 19.4041 33.8397 14.0322C31.3487 11.5413 28.1401 10.2062 24.8794 10.0255C24.781 7.57907 26.0979 5.92609 26.1043 5.91803L26.103 5.91829L26.104 5.91699C22.3564 6.64093 18.7778 8.45398 15.8759 11.3559C13.6504 13.5813 12.0658 16.2048 11.1211 18.997C11.2594 18.6308 11.4136 18.2692 11.5837 17.9134C11.3879 18.4127 11.211 18.9229 11.051 19.4449C9.47773 24.2208 10.5882 29.6872 14.3864 33.4854C19.7584 38.8574 28.4679 38.8574 33.8397 33.4854Z"
        fill="white"
      ></path>
      <path
        id="Vector_3"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.1299 22.3449V24.0538V25.1921C17.1299 26.3283 18.0509 27.2493 19.1872 27.2493C20.3234 27.2493 21.2443 26.3283 21.2443 25.1921V24.0521V22.3449C21.2443 21.2089 20.3234 20.2876 19.1872 20.2876C18.0509 20.2876 17.1299 21.2089 17.1299 22.3449Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_4"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.3125 22.3449V24.0538V25.1921C27.3125 26.3283 28.2336 27.2493 29.3697 27.2493C30.5059 27.2493 31.427 26.3283 31.427 25.1921V24.0521V22.3449C31.427 21.2089 30.5059 20.2876 29.3697 20.2876C28.2336 20.2876 27.3125 21.2089 27.3125 22.3449Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-customerPublic"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.60575 36.9871C5.31838 33.3788 3.31849 28.615 3.31849 23.3918C3.31849 12.1276 12.615 2.99609 24.0827 2.99609C35.5505 2.99609 44.847 12.1276 44.847 23.3918C44.847 31.3565 40.1975 38.252 33.4205 41.6097C29.2741 43.7714 24.5438 44.9961 19.5224 44.9961C13.3697 44.9961 7.65397 43.1575 2.91406 40.0092C2.91406 40.0092 6.09264 39.6625 8.60493 36.9879L8.60575 36.9871ZM33.8368 33.4859C39.2088 28.1141 39.2088 19.4046 33.8368 14.0327C31.3458 11.5418 28.1372 10.2067 24.8765 10.026C24.7781 7.57955 26.095 5.92657 26.1014 5.91851L26.1001 5.91877L26.1011 5.91747C22.3535 6.64141 18.7749 8.45446 15.873 11.3564C13.6475 13.5818 12.0629 16.2053 11.1182 18.9975C11.2565 18.6313 11.4107 18.2697 11.5808 17.9139C11.385 18.4132 11.2081 18.9234 11.0481 19.4454C9.47482 24.2213 10.5853 29.6877 14.3835 33.4859C19.7555 38.8579 28.465 38.8579 33.8368 33.4859Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.127 22.3454V25.1926C17.127 26.3288 18.048 27.2498 19.1843 27.2498C20.3205 27.2498 21.2414 26.3288 21.2414 25.1926V22.3454C21.2414 21.2094 20.3205 20.2881 19.1843 20.2881C18.048 20.2881 17.127 21.2094 17.127 22.3454Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.3096 22.3454V25.1926C27.3096 26.3288 28.2307 27.2498 29.3668 27.2498C30.503 27.2498 31.4241 26.3288 31.4241 25.1926V22.3454C31.4241 21.2094 30.503 20.2881 29.3668 20.2881C28.2307 20.2881 27.3096 21.2094 27.3096 22.3454Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-customer_b"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="none"
  >
    <path
      d="M67 69V32.995C67 18.6387 55.1352 7 40.5 7C25.8648 7 14 18.6387 14 32.995V69H67Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M66.7456 71H14.2527C13.5609 71 13 70.4314 13 69.7301V32.8776C13 17.5058 25.3364 5 40.5 5C55.6636 5 68 17.5058 68 32.8776V69.7301C67.9983 70.4314 67.4374 71 66.7456 71ZM15.5055 68.4593H65.4921V32.8776C65.4921 18.9067 54.28 7.5407 40.4983 7.5407C26.7167 7.5407 15.5055 18.9067 15.5055 32.8776V68.4593Z"
      fill="#333333"
    ></path>
    <path
      d="M49.7097 19C49.6927 19.0617 44.433 38.0444 19.0017 38.0452C19.0017 38.0669 19 38.0886 19 38.1102V51.854C19 63.5328 28.6257 73 40.5 73C52.3743 73 62 63.5328 62 51.854V38.1102C62 38.0886 61.9983 38.0669 61.9983 38.0452C48.6252 38.0436 49.7063 19.0675 49.7097 19Z"
      fill="white"
    ></path>
    <path
      d="M48.1738 22.339C48.7436 22.8348 49.2835 23.3623 49.7969 23.9139C49.4666 21.1199 49.5873 19.0225 49.5881 19C49.5839 19.0167 49.2057 20.3658 48.1738 22.339ZM62 38.1099C62 38.0883 61.9983 38.0666 61.9983 38.045C59.1764 38.045 56.9937 37.2142 55.3029 35.9025C55.3808 36.6283 55.4244 37.3641 55.4244 38.1108V51.8543C55.4244 62.4438 47.4311 71.2151 37 72.7583H37.0009C37.3157 72.805 37.634 72.8433 37.9532 72.8758C38.0567 72.8867 38.1611 72.895 38.2646 72.905C38.5016 72.9267 38.7404 72.9442 38.9799 72.9583C39.0818 72.9642 39.1836 72.9708 39.2854 72.975C39.6174 72.99 39.9511 73 40.2874 73C42.9107 73 45.4246 72.5467 47.7528 71.7167C52.4083 70.0568 56.3177 66.8878 58.8564 62.8188C59.2192 62.2372 59.5537 61.638 59.8583 61.0214C61.2308 58.2482 61.9991 55.1383 61.9991 51.8535V38.1099H62Z"
      fill="var(--icon1)"
    ></path>
    <path
      d="M71.4825 54H61.7478V38H71.4817C71.7681 38 72 38.2408 72 38.5381V53.461C72.0008 53.7592 71.7689 54 71.4825 54ZM9.5183 54H19.2522V38H9.5183C9.23194 38 9 38.2408 9 38.5381V53.461C9 53.7592 9.23194 54 9.5183 54Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M67.5549 55H61.5798C60.8903 55 60.3313 54.4343 60.3313 53.7366V38.2651C60.3313 37.5674 60.8903 37.0017 61.5798 37.0017H67.5549C70.557 37.0017 73 39.473 73 42.5116V49.4917C72.9992 52.5287 70.557 55 67.5549 55ZM62.8283 52.4724H67.5549C69.1797 52.4724 70.5021 51.1342 70.5021 49.4901V42.5099C70.5021 40.8658 69.1797 39.5276 67.5549 39.5276H62.8283V52.4724ZM19.4202 55H13.4451C10.443 55 8 52.5287 8 49.4901V42.5099C8 39.4721 10.4422 37 13.4451 37H19.4202C20.1097 37 20.6687 37.5657 20.6687 38.2634V53.7349C20.6696 54.4343 20.1105 55 19.4202 55ZM13.4451 39.5284C11.8203 39.5284 10.4979 40.8666 10.4979 42.5108V49.4909C10.4979 51.1351 11.8203 52.4732 13.4451 52.4732H18.1717V39.5284H13.4451Z"
      fill="#333333"
    ></path>
    <path
      d="M40.5 75C28.0936 75 18 64.8638 18 52.4049V38.5405C18 38.5127 18.0008 38.485 18.0017 38.4573C18.005 37.7612 18.5675 37.2106 19.2598 37.2106C29.2764 37.2106 37.2144 34.1465 42.8547 28.105C47.0778 23.5808 48.3719 18.9767 48.3845 18.9304C48.5553 18.3067 49.1672 17.9124 49.8025 18.0167C50.4379 18.1217 50.8924 18.6892 50.8556 19.3348C50.8497 19.4348 50.3475 29.4802 55.0376 34.4618C56.7788 36.3112 58.9711 37.2098 61.7402 37.2106C62.4291 37.2106 62.99 37.7671 62.9983 38.4581C62.9992 38.4892 63 38.5153 63 38.5405V52.4049C63.0008 64.8638 52.9073 75 40.5 75ZM20.5171 39.7224V52.4049C20.5171 63.47 29.4815 72.4722 40.5 72.4722C51.5185 72.4722 60.4829 63.47 60.4829 52.4049V39.6837C57.5849 39.4248 55.1406 38.2538 53.2028 36.1935C50.1951 32.9949 49.0198 28.2698 48.5745 24.6088C47.6638 26.1749 46.424 27.9629 44.7658 29.7526C40.6808 34.1634 33.1881 39.3954 20.5171 39.7224Z"
      fill="#333333"
    ></path>
    <path
      d="M66.7365 64H40.2635C39.5658 64 39 63.441 39 62.7517C39 62.0623 39.5658 61.5033 40.2635 61.5033H65.4729V54.2483C65.4729 53.559 66.0387 53 66.7365 53C67.4342 53 68 53.559 68 54.2483V62.7525C68 63.441 67.4342 64 66.7365 64Z"
      fill="#333333"
    ></path>
    <path
      d="M42.7986 66H38.2014C36.4333 66 35 64.4331 35 62.5C35 60.5669 36.4333 59 38.2014 59H42.7986C44.5667 59 46 60.5669 46 62.5C46 64.4331 44.5667 66 42.7986 66Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M42.393 67H37.6079C35.0677 67 33 64.9811 33 62.5C33 60.0189 35.0669 58 37.6079 58H42.393C44.9331 58 47 60.0189 47 62.5C47.0008 64.9811 44.934 67 42.393 67ZM37.6087 60.4902C36.4739 60.4902 35.5512 61.3916 35.5512 62.5C35.5512 63.6084 36.4739 64.5098 37.6087 64.5098H42.3938C43.5286 64.5098 44.4514 63.6084 44.4514 62.5C44.4514 61.3916 43.5286 60.4902 42.3938 60.4902H37.6087Z"
      fill="#333333"
    ></path>
  </symbol>
  <symbol
    id="icon-deleteMain"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.75 7.5V33H29.25V7.5H6.75Z"
      stroke="var(--text_color_L2)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15 15V24.75"
      stroke="var(--text_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M21 15V24.75"
      stroke="var(--text_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 7.5H33"
      stroke="var(--text_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M12 7.5L14.4667 3H21.5828L24 7.5H12Z"
      stroke="var(--text_color_L2)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-detail"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Frame">
      <path
        id="Vector"
        d="M39 4H11C9.89543 4 9 4.89543 9 6V42C9 43.1046 9.89543 44 11 44H39C40.1046 44 41 43.1046 41 42V6C41 4.89543 40.1046 4 39 4Z"
        fill="var(--main-color)"
        stroke="var(--main-color)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        id="Vector_2"
        d="M17 30H31"
        stroke="var(--bg_color_L2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        id="Vector_3"
        d="M17 36H24"
        stroke="var(--bg_color_L2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        id="Vector_4"
        d="M31 12H17V22H31V12Z"
        fill="var(--main-color)"
        stroke="var(--bg_color_L2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-dialogNickname"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon">
      <path
        id="Vector"
        opacity="0.4"
        d="M44 16.476V31.524C44 33.988 42.6791 36.276 40.5438 37.53L27.4673 45.076C25.3319 46.308 22.6902 46.308 20.5328 45.076L7.45625 37.53C6.40347 36.92 5.52986 36.0439 4.92318 34.9896C4.3165 33.9354 3.99811 32.7401 4.00001 31.524V16.476C4.00001 14.012 5.32087 11.724 7.45625 10.47L20.5328 2.924C22.6681 1.692 25.3099 1.692 27.4673 2.924L40.5438 10.47C42.6791 11.724 44 13.99 44 16.476Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_2"
        d="M23.5028 24.0028C25.2638 24.0028 26.9526 23.3178 28.1977 22.0986C29.4429 20.8793 30.1424 19.2257 30.1424 17.5014C30.1424 15.7771 29.4429 14.1235 28.1977 12.9042C26.9526 11.685 25.2638 11 23.5028 11C21.7419 11 20.0531 11.685 18.808 12.9042C17.5628 14.1235 16.8633 15.7771 16.8633 17.5014C16.8633 19.2257 17.5628 20.8793 18.808 22.0986C20.0531 23.3178 21.7419 24.0028 23.5028 24.0028ZM31.1369 37C33.4451 37 34.7844 34.4887 33.5021 32.6192C31.5644 29.801 27.8029 27.9036 23.5 27.9036C19.1971 27.9036 15.4356 29.801 13.4979 32.6192C12.2156 34.4887 13.5549 37 15.8631 37H31.1369Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-diamond"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.6364 5H37.3636L45 18.3L24 43L3 18.3L10.6364 5Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M10.6328 5L23.9965 43L37.3601 5"
      stroke="var(--bg_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 18.2998H45"
      stroke="var(--bg_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15.4062 18.3L23.9971 5L32.5881 18.3"
      stroke="var(--bg_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-down"
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.9999 29.0001L12 17.0001H19.9999V6.00012H27.9999V17.0001H35.9999L23.9999 29.0001Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M42 37H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    ></path>
    <path
      d="M34 44H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    ></path>
  </symbol>
  
  <symbol
    id="icon-downArrow"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.7416 11.694C26.4622 10.8819 25.8857 9.59961 24.8 9.59961L15.8872 9.59961L6.8 9.59961C5.72151 9.59961 5.15333 10.8777 5.87586 11.6783L14.4434 21.1724C15.2295 21.9855 16.5448 21.9855 17.331 21.1724L25.7416 11.694Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-dropDown"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.7416 11.694C26.4622 10.8819 25.8857 9.59961 24.8 9.59961L15.8872 9.59961L6.8 9.59961C5.72151 9.59961 5.15333 10.8777 5.87586 11.6783L14.4434 21.1724C15.2295 21.9855 16.5448 21.9855 17.331 21.1724L25.7416 11.694Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-edit"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M5.25 31.5H32.25"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M8.25 20.0399V25.5H13.7379L29.25 9.98107L23.7713 4.5L8.25 20.0399Z"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-editMain"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.25 31.5H32.25"
      stroke="var(--text_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M8.25 20.0399V25.5H13.7379L29.25 9.98107L23.7713 4.5L8.25 20.0399Z"
      stroke="var(--text_color_L2)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-editPswIcon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      opacity="0.6"
      d="M24.0022 34.7C24.8668 34.7 25.696 34.3565 26.3074 33.7452C26.9187 33.1338 27.2622 32.3046 27.2622 31.44C27.2622 30.5754 26.9187 29.7462 26.3074 29.1348C25.696 28.5235 24.8668 28.18 24.0022 28.18C23.1376 28.18 22.3084 28.5235 21.697 29.1348C21.0857 29.7462 20.7422 30.5754 20.7422 31.44C20.7422 32.3046 21.0857 33.1338 21.697 33.7452C22.3084 34.3565 23.1376 34.7 24.0022 34.7Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M33.3 18.882H14.7C6.5 18.882 4 21.382 4 29.582V33.302C4 41.502 6.5 44.002 14.7 44.002H33.3C41.5 44.002 44 41.502 44 33.302V29.582C44 21.382 41.5 18.882 33.3 18.882ZM24 37.482C20.66 37.482 17.96 34.762 17.96 31.442C17.96 28.122 20.66 25.402 24 25.402C27.34 25.402 30.04 28.122 30.04 31.442C30.04 34.762 27.34 37.482 24 37.482Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.6"
      d="M14.238 18.9V16.56C14.238 10.7 15.898 6.8 23.998 6.8C32.098 6.8 33.758 10.7 33.758 16.56V18.9C34.778 18.92 35.698 18.96 36.558 19.08V16.56C36.558 11.16 35.258 4 23.998 4C12.738 4 11.438 11.16 11.438 16.56V19.06C12.278 18.96 13.218 18.9 14.238 18.9Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-email"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 23.7768L2.36511 38C2.1234 37.4588 1.99911 36.875 2 36.285V12.6171C2.00034 12.0625 2.11154 11.5133 2.32741 11L17 23.7768Z"
      fill="currentColor"
    ></path>
    <path
      d="M23.0524 26.6409L4 9.69183C4.69859 9.24036 5.5142 9.00002 6.34774 9H41.6508C42.4853 8.99887 43.3019 9.24019 44 9.69423L28.6605 23.3414L28.56 23.4268L24.9443 26.6414C24.6841 26.8724 24.3473 27.0001 23.9982 27C23.6492 26.9999 23.3124 26.8721 23.0524 26.6409Z"
      fill="currentColor"
    ></path>
    <path
      d="M29.4114 25.2188L43.9245 39.3748C43.2439 39.7856 42.4588 40.0022 41.6583 40H6.26378C5.4641 40.0021 4.67982 39.7855 4 39.3748L18.5122 25.2188L23.0862 29.2161C23.3262 29.4266 23.6376 29.5431 23.9603 29.5431C24.2831 29.5431 24.5944 29.4266 24.8344 29.2161L29.4114 25.2188ZM46 12.5838V35.7657C46.0007 36.343 45.8796 36.9142 45.6442 37.4439L31.3624 23.5136L45.6805 11C45.8913 11.5027 45.9998 12.0407 46 12.5838Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-empty"
    viewBox="0 0 389 227"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.3"
      d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z"
      fill="url(#paint0_linear_6306_124794)"
    ></path>
    <path
      d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z"
      fill="url(#paint1_linear_6306_124794)"
    ></path>
    <path
      d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z"
      fill="url(#paint2_linear_6306_124794)"
    ></path>
    <path
      d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z"
      fill="url(#paint3_linear_6306_124794)"
    ></path>
    <path
      opacity="0.712"
      d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z"
      fill="url(#paint4_linear_6306_124794)"
    ></path>
    <path
      d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z"
      fill="url(#paint5_linear_6306_124794)"
    ></path>
    <path
      d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z"
      fill="url(#paint6_linear_6306_124794)"
    ></path>
    <rect
      x="48.8203"
      y="144"
      width="5"
      height="20"
      rx="2.5"
      fill="url(#paint7_linear_6306_124794)"
    ></rect>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z"
      fill="url(#paint8_linear_6306_124794)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z"
      fill="url(#paint9_linear_6306_124794)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z"
      fill="url(#paint10_linear_6306_124794)"
    ></path>
    <path
      d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z"
      fill="url(#paint11_linear_6306_124794)"
    ></path>
    <path
      opacity="0.398"
      d="M284.309 32.6133C282.541 53.9608 273.212 64.0459 263.885 69.6786C249.04 78.6443 231.874 74.1814 227.627 69.6786C220.715 62.3476 233.578 51.1844 246.322 59.5164C259.065 67.8484 223.925 97.2125 187.223 92.0122C162.755 88.5459 140.684 82.0766 121.008 72.6045"
      stroke="#908E9B"
      strokeWidth="0.881"
      strokeLinecap="round"
      strokeDasharray="2.64 2.64"
    ></path>
    <path
      d="M83.2109 50.6191L124.558 71.2914L116.173 82.6011L83.2109 50.6191Z"
      fill="#565461"
    ></path>
    <path
      d="M83.2109 50.6191L116.168 82.5997L118.765 69.3487L83.2109 50.6191Z"
      fill="url(#paint12_linear_6306_124794)"
    ></path>
    <path
      d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z"
      fill="url(#paint13_linear_6306_124794)"
    ></path>
    <path
      d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z"
      fill="#6D6B7A"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_6306_124794"
        x1="185.676"
        y1="129.156"
        x2="185.676"
        y2="227"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#484852"></stop>
        <stop offset="0.615" stopColor="#777783" stopOpacity="0.1"></stop>
        <stop offset="1" stopColor="#DEDEE6" stopOpacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_6306_124794"
        x1="110.557"
        y1="19.5694"
        x2="110.557"
        y2="79.5818"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#353240"></stop>
        <stop offset="1" stopColor="#24212F" stopOpacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_6306_124794"
        x1="303.907"
        y1="65.2301"
        x2="303.907"
        y2="109.586"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#353240"></stop>
        <stop offset="1" stopColor="#24212F" stopOpacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_6306_124794"
        x1="212.361"
        y1="177.425"
        x2="211.673"
        y2="-1.70206e-05"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#100F15"></stop>
        <stop offset="0.232" stopColor="#27252F"></stop>
        <stop offset="0.925" stopColor="#514E5A"></stop>
        <stop offset="1" stopColor="#33323C"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_6306_124794"
        x1="188.942"
        y1="9.13086"
        x2="188.942"
        y2="155.486"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#676570"></stop>
        <stop offset="1" stopColor="#403F4B"></stop>
      </linearGradient>
      <linearGradient
        id="paint5_linear_6306_124794"
        x1="177.68"
        y1="144.809"
        x2="177.68"
        y2="177.424"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#504F5C"></stop>
        <stop offset="1" stopColor="#2E2C3B"></stop>
      </linearGradient>
      <linearGradient
        id="paint6_linear_6306_124794"
        x1="275.816"
        y1="28.1825"
        x2="275.816"
        y2="3.62035"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#31303A"></stop>
        <stop offset="1" stopColor="#2B2930"></stop>
      </linearGradient>
      <linearGradient
        id="paint7_linear_6306_124794"
        x1="51.3203"
        y1="144"
        x2="51.3203"
        y2="164"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#33303E"></stop>
        <stop offset="1" stopColor="#3D3B46"></stop>
      </linearGradient>
      <linearGradient
        id="paint8_linear_6306_124794"
        x1="52.0976"
        y1="99.1497"
        x2="52.0976"
        y2="149.74"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#302C3F"></stop>
        <stop offset="1" stopColor="#494854"></stop>
      </linearGradient>
      <linearGradient
        id="paint9_linear_6306_124794"
        x1="344.097"
        y1="165.449"
        x2="344.097"
        y2="181.337"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#23202A"></stop>
        <stop offset="1" stopColor="#42404B"></stop>
      </linearGradient>
      <linearGradient
        id="paint10_linear_6306_124794"
        x1="344.795"
        y1="140.896"
        x2="344.795"
        y2="172.673"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#302C3F"></stop>
        <stop offset="1" stopColor="#494854"></stop>
      </linearGradient>
      <linearGradient
        id="paint11_linear_6306_124794"
        x1="296.068"
        y1="131.764"
        x2="296.068"
        y2="170.902"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#494855"></stop>
        <stop offset="1" stopColor="#312F3B"></stop>
      </linearGradient>
      <linearGradient
        id="paint12_linear_6306_124794"
        x1="84.0489"
        y1="52.2659"
        x2="113.914"
        y2="80.8551"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#605D6A"></stop>
        <stop offset="1" stopColor="#7D7B8B"></stop>
      </linearGradient>
      <linearGradient
        id="paint13_linear_6306_124794"
        x1="83.5475"
        y1="51.2645"
        x2="106.537"
        y2="69.6654"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7C7A84"></stop>
        <stop offset="1" stopColor="#ABAAB3"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-errorTip"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 27.5C18.4517 27.5 21.5768 26.1009 23.8388 23.8388C26.1009 21.5768 27.5 18.4517 27.5 15C27.5 11.5482 26.1009 8.42325 23.8388 6.16116C21.5768 3.89911 18.4517 2.5 15 2.5C11.5482 2.5 8.42325 3.89911 6.16116 6.16116C3.89911 8.42325 2.5 11.5482 2.5 15C2.5 18.4517 3.89911 21.5768 6.16116 23.8388C8.42325 26.1009 11.5482 27.5 15 27.5Z"
      stroke="#FE6868"
      strokeLinejoin="round"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 23.125C15.8629 23.125 16.5625 22.4254 16.5625 21.5625C16.5625 20.6996 15.8629 20 15 20C14.1371 20 13.4375 20.6996 13.4375 21.5625C13.4375 22.4254 14.1371 23.125 15 23.125Z"
      fill="#FF7172"
    ></path>
    <path
      d="M15 7.5V17.5"
      stroke="#FE6868"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-eye"
    t="1503993826520"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="7878"
  >
    <defs><style type="text/css"></style></defs>
    <path
      d="M941.677063 391.710356c9.337669-14.005992 6.224772-32.68133-6.224772-43.575447-14.005992-10.894118-32.68133-7.78122-43.575447 6.224771-1.556449 1.556449-174.300768 205.426673-379.727441 205.426673-199.200878 0-379.727441-205.426673-381.28389-206.982098-10.894118-12.450567-31.124881-14.005992-43.575448-3.112898-12.450567 10.894118-14.005992 31.124881-3.112897 43.575448 3.112897 4.668323 40.46255 46.687322 99.600439 93.375667l-79.369676 82.48155c-12.450567 12.450567-10.894118 32.68133 1.556449 43.575448 3.112897 6.224772 10.894118 9.337669 18.675338 9.337669 7.78122 0 15.562441-3.112897 21.787213-9.337669l85.594447-88.706321c40.46255 28.013007 88.706321 54.469566 141.619438 73.14388L340.959485 707.631586c-4.668323 17.118889 4.669346 34.237779 21.787213 38.906101h9.337669c14.005992 0 26.456558-9.337669 29.568432-23.343661l32.68133-110.494556c24.90011 4.668323 51.356668 7.78122 77.813227 7.78122s52.913117-3.112897 77.813227-7.78122l32.68133 108.938108c3.112897 14.005992 17.118889 23.343661 29.569456 23.343661 3.112897 0 6.224772 0 7.78122-1.556449 17.118889-4.669346 26.456558-21.787212 21.788236-38.906102l-32.68133-108.938108c52.913117-18.675338 101.156888-45.131897 141.619438-73.14388l84.037998 87.150896c6.224772 6.224772 14.005992 9.337669 21.787212 9.337669 7.78122 0 15.562441-3.112897 21.787212-9.337669 12.450567-12.450567 12.450567-31.124881 1.556449-43.575448l-79.369675-82.48155c63.808258-46.688345 101.158934-91.820242 101.158934-91.820242z"
      p-id="7879"
    ></path>
  </symbol>
  <symbol
    id="icon-fish"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <mask
      id="mask0_2094_41544"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="6"
      y="6"
      width="36"
      height="36"
    >
      <circle cx="24" cy="24" r="18" fill="#D9D9D9"></circle>
    </mask>
    <g mask="url(#mask0_2094_41544)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.4705 12.992C17.2079 14.0478 13.802 13.3906 11.2254 11.5176C8.65115 14.157 6.94305 17.5424 6.35131 21.184C9.24189 22.2447 11.6331 24.5757 12.6547 27.7324C13.6762 30.8888 13.1042 34.1786 11.3832 36.7317C14.3198 39.6583 18.2092 41.4967 22.3564 41.8918C23.627 39.7355 25.661 38.0177 28.2295 37.1865C30.8181 36.3488 33.4945 36.5589 35.7997 37.5825C38.9641 34.833 41.0645 31.0476 41.7397 26.9331C39.0138 25.7686 36.7873 23.4755 35.8028 20.4338C34.7996 17.3337 35.2977 14.1078 36.8953 11.5428C34.2573 8.83606 30.8169 7.02579 27.0991 6.38029C26.1085 9.40788 23.7332 11.9361 20.4705 12.992ZM28.0728 35.9093C33.8105 34.0525 36.9566 27.8958 35.0998 22.158C33.243 16.4202 27.0863 13.2741 21.3485 15.131C15.6107 16.9879 12.4646 23.1445 14.3215 28.8823C16.1784 34.62 22.335 37.7661 28.0728 35.9093Z"
        fill="currentColor"
      ></path>
      <path
        d="M27.0008 29.6018C26.7496 29.841 26.425 30.0249 26.0271 30.1538C25.6331 30.2812 25.2622 30.3223 24.9146 30.2768C24.5659 30.2276 24.2672 30.1024 24.0184 29.9012C23.7686 29.6961 23.5893 29.4254 23.4805 29.0894C23.3692 28.7456 23.3561 28.4148 23.441 28.0971C23.5286 27.7743 23.6987 27.4887 23.9513 27.2406C24.2026 26.9885 24.5195 26.8006 24.9019 26.6768C25.2882 26.5518 25.6551 26.5184 26.0026 26.5767C26.3488 26.6311 26.652 26.7635 26.9122 26.9737C27.171 27.1801 27.3561 27.4554 27.4674 27.7992C27.5761 28.1352 27.5874 28.4602 27.5012 28.774C27.4176 29.0828 27.2508 29.3587 27.0008 29.6018Z"
        fill="currentColor"
      ></path>
      <path
        d="M25.1322 24.3616C24.9171 24.5807 24.6434 24.7439 24.3113 24.8514C23.979 24.959 23.6616 24.987 23.359 24.9356C23.0564 24.8841 22.7929 24.7623 22.5686 24.5703C22.3443 24.3784 22.1815 24.1259 22.0802 23.8129C21.9802 23.5039 21.9642 23.2103 22.0321 22.9322C22.1026 22.6491 22.2461 22.3999 22.4624 22.1849C22.6775 21.9659 22.953 21.802 23.2892 21.6932C23.6291 21.5832 23.9485 21.5546 24.2472 21.6073C24.5447 21.6561 24.805 21.7745 25.0281 21.9627C25.2499 22.147 25.4108 22.3937 25.5108 22.7027C25.612 23.0157 25.6281 23.3157 25.5588 23.6027C25.4895 23.8897 25.3473 24.1427 25.1322 24.3616Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.4489 33.9791C32.1208 32.4673 34.6824 27.4544 33.1705 22.7825C31.6586 18.1106 26.6457 15.549 21.9739 17.0608C17.302 18.5727 14.7403 23.5857 16.2522 28.2575C17.7641 32.9294 22.777 35.4911 27.4489 33.9791ZM24.1012 32.3326C24.8904 32.3974 25.7311 32.2853 26.6234 31.9965C27.5159 31.7077 28.261 31.3066 28.8588 30.793C29.4591 30.2743 29.8745 29.6982 30.1047 29.0647C30.335 28.431 30.3483 27.793 30.1446 27.1504C29.9807 26.6571 29.716 26.2413 29.3504 25.903C28.9874 25.5596 28.5665 25.3138 28.0875 25.1658C27.6112 25.0126 27.123 24.9743 26.6227 25.0509L26.5965 24.9697C27.1772 24.6409 27.5878 24.1688 27.8282 23.5532C28.0686 22.9377 28.085 22.3029 27.8776 21.6487C27.6762 21.0396 27.3183 20.5536 26.8041 20.1909C26.2885 19.8242 25.6709 19.6037 24.9512 19.5294C24.2353 19.4537 23.4775 19.5453 22.6778 19.8041C21.8781 20.0629 21.2084 20.4332 20.6687 20.9152C20.1316 21.392 19.7617 21.9301 19.5586 22.5292C19.3543 23.1245 19.3516 23.7293 19.5504 24.3435C19.7605 24.9926 20.1419 25.4986 20.6947 25.8617C21.2463 26.221 21.8595 26.3619 22.5343 26.2843L22.5605 26.3655C22.1026 26.599 21.7237 26.918 21.4235 27.3224C21.1221 27.723 20.9249 28.1688 20.8319 28.6597C20.7417 29.1456 20.7766 29.6358 20.9366 30.1303C21.1441 30.7716 21.5268 31.2815 22.0846 31.66C22.6425 32.0386 23.3146 32.2628 24.1012 32.3326Z"
        fill="currentColor"
      ></path>
      <path
        d="M-5.27379 33.5341C-3.83367 37.9843 0.941276 40.4243 5.39135 38.9841C9.8414 37.5441 12.2814 32.7691 10.8414 28.319C9.4012 23.869 4.62629 21.4289 0.176219 22.869C-4.27386 24.3092 -6.71391 29.0841 -5.27379 33.5341Z"
        fill="currentColor"
      ></path>
      <path
        d="M14.6506 -4.99372C10.3306 -3.59569 8.01311 1.19803 9.47439 5.71338C10.9356 10.2287 15.6222 12.7558 19.9422 11.3577C24.2622 9.95969 26.5796 5.16597 25.1185 0.650652C23.6572 -3.86467 18.9706 -6.39174 14.6506 -4.99372Z"
        fill="currentColor"
      ></path>
      <path
        d="M34.1591 55.51C29.4706 57.0272 24.4777 54.5736 23.0072 50.0295C21.5368 45.4855 24.1454 40.5719 28.8339 39.0546C33.5223 37.5373 38.5152 39.991 39.9857 44.535C41.4562 49.079 38.8476 53.9928 34.1591 55.51Z"
        fill="currentColor"
      ></path>
      <path
        d="M54.1353 14.5011C55.6056 19.0444 53.1145 23.9194 48.5712 25.3896C44.028 26.8598 39.1531 24.3687 37.6829 19.8255C36.2125 15.2823 38.7036 10.4074 43.2469 8.93712C47.7902 7.46678 52.6651 9.9579 54.1353 14.5011Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-flash"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.0755 9.06172C13.0454 8.80636 10.726 9.37364 9.59674 10.2059C2.25733 15.6154 0.5 23.9377 0.5 29.5553C0.5 35.4849 3.70453 39.9582 6.8057 39.9582C9.75967 39.9582 11.213 38.4479 14.2925 35.2477C14.446 35.0882 14.6035 34.9246 14.7654 34.7567C18.4435 30.943 20.9677 29.8674 24.4823 29.8674C29.0413 29.8674 32.2056 33.208 34.7821 35.9281C35.187 36.3556 35.5775 36.7678 35.9566 37.1493C38.5492 39.7584 40.505 40.1502 41.7455 39.9582C42.8693 39.7842 46.9141 38.2937 47.6377 32.4681C48.4 26.3304 47.2242 21.129 43.9163 15.7195C40.6084 10.31 37.6106 9.06172 34.5094 9.06172C31.6052 9.06172 30.4231 10.1569 29.3508 11.1504C29.2782 11.2176 29.2062 11.2844 29.1341 11.3503C29.0006 11.4725 28.8379 11.6441 28.649 11.8433L28.6489 11.8434C27.7559 12.7856 26.274 14.349 24.4823 14.2631C22.5181 14.169 21.7946 13.7429 20.5542 12.4946L20.3523 12.2911C18.8758 10.8008 17.4485 9.36023 15.0755 9.06172ZM9.45478 23.0971H8.87411C7.20819 23.0971 5.94013 21.7517 5.94013 20.1926C5.94013 18.6335 7.20819 17.2881 8.87411 17.2881H9.45478V17.2798C9.45478 15.7207 10.7228 14.3754 12.3888 14.3754C14.0547 14.3754 15.3227 15.7207 15.3227 17.2798V17.2881H15.9034C17.5693 17.2881 18.8374 18.6335 18.8374 20.1926C18.8374 21.7517 17.5693 23.0971 15.9034 23.0971H15.3227V23.3135C15.3227 24.8726 14.0547 26.2179 12.3888 26.2179C10.7228 26.2179 9.45478 24.8726 9.45478 23.3135V23.0971ZM8.87411 21.8571C7.96066 21.8571 7.22016 21.1119 7.22016 20.1926C7.22016 19.2733 7.96066 18.5281 8.87411 18.5281H10.7348V17.2798C10.7348 16.3606 11.4753 15.6154 12.3888 15.6154C13.3022 15.6154 14.0427 16.3606 14.0427 17.2798V18.5281H15.9034C16.8169 18.5281 17.5574 19.2733 17.5574 20.1926C17.5574 21.1119 16.8169 21.8571 15.9034 21.8571H14.0427V23.3135C14.0427 24.2327 13.3022 24.9779 12.3888 24.9779C11.4753 24.9779 10.7348 24.2327 10.7348 23.3135V21.8571H8.87411ZM35.7019 18.2997C36.7623 18.2997 37.622 17.467 37.622 16.4397C37.622 15.4125 36.7623 14.5797 35.7019 14.5797C34.6415 14.5797 33.7819 15.4125 33.7819 16.4397C33.7819 17.467 34.6415 18.2997 35.7019 18.2997ZM35.7019 24.4997C36.7623 24.4997 37.622 23.667 37.622 22.6397C37.622 21.6125 36.7623 20.7797 35.7019 20.7797C34.6415 20.7797 33.7819 21.6125 33.7819 22.6397C33.7819 23.667 34.6415 24.4997 35.7019 24.4997ZM42.1021 19.5397C42.1021 20.567 41.2424 21.3997 40.182 21.3997C39.1216 21.3997 38.262 20.567 38.262 19.5397C38.262 18.5125 39.1216 17.6797 40.182 17.6797C41.2424 17.6797 42.1021 18.5125 42.1021 19.5397ZM31.2218 21.3997C32.2822 21.3997 33.1418 20.567 33.1418 19.5397C33.1418 18.5125 32.2822 17.6797 31.2218 17.6797C30.1614 17.6797 29.3018 18.5125 29.3018 19.5397C29.3018 20.567 30.1614 21.3997 31.2218 21.3997Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-AG"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.6897 12.5431H49.2845L50.2904 8H78.7414L73.7586 38.6293H50.6035L50.4569 42H21L25.6897 12.5431ZM69.2153 20.3101H73.1723C72.928 17.8188 69.4943 13.1569 64.8191 12.6894C58.9568 12.1031 53.8275 14.6681 51.6294 20.8962C48.9916 28.3703 53.6835 34.3398 60.2757 34.5255C70.6809 34.8186 72.2928 24.1204 72.2928 24.1204H61.448V27.4911H66.8706C66.7241 28.6636 64.8191 30.9315 60.2757 30.7152C54.9997 30.4639 54.8532 26.0256 54.9997 24.1204C55.1463 22.2153 57.4911 15.7668 63.4997 16.2064C67.0171 16.4638 68.6292 18.4048 69.2153 20.3101ZM39.4654 15.1806L23.4913 37.6031H28.0344L32.5775 31.3013L42.3964 31.4479L44.7214 37.6031L46.0602 30.1289L40.4913 15.1806H39.4654ZM39.3189 22.2151H38.7326L35.2154 27.6375H41.0775L39.3189 22.2151Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-AG_Electronic"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.6897 12.5431H49.2845L50.2904 8H78.7414L73.7586 38.6293H50.6035L50.4569 42H21L25.6897 12.5431ZM69.2153 20.3101H73.1723C72.928 17.8188 69.4943 13.1569 64.8191 12.6894C58.9568 12.1031 53.8275 14.6681 51.6294 20.8962C48.9916 28.3703 53.6835 34.3398 60.2757 34.5255C70.6809 34.8186 72.2928 24.1204 72.2928 24.1204H61.448V27.4911H66.8706C66.7241 28.6636 64.8191 30.9315 60.2757 30.7152C54.9997 30.4639 54.8532 26.0256 54.9997 24.1204C55.1463 22.2153 57.4911 15.7668 63.4997 16.2064C67.0171 16.4638 68.6292 18.4048 69.2153 20.3101ZM39.4654 15.1806L23.4913 37.6031H28.0344L32.5775 31.3013L42.3964 31.4479L44.7214 37.6031L46.0602 30.1289L40.4913 15.1806H39.4654ZM39.3189 22.2151H38.7326L35.2154 27.6375H41.0775L39.3189 22.2151Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-AG_Fish"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.6897 12.5431H49.2845L50.2904 8H78.7414L73.7586 38.6293H50.6035L50.4569 42H21L25.6897 12.5431ZM69.2153 20.3101H73.1723C72.928 17.8188 69.4943 13.1569 64.8191 12.6894C58.9568 12.1031 53.8275 14.6681 51.6294 20.8962C48.9916 28.3703 53.6835 34.3398 60.2757 34.5255C70.6809 34.8186 72.2928 24.1204 72.2928 24.1204H61.448V27.4911H66.8706C66.7241 28.6636 64.8191 30.9315 60.2757 30.7152C54.9997 30.4639 54.8532 26.0256 54.9997 24.1204C55.1463 22.2153 57.4911 15.7668 63.4997 16.2064C67.0171 16.4638 68.6292 18.4048 69.2153 20.3101ZM39.4654 15.1806L23.4913 37.6031H28.0344L32.5775 31.3013L42.3964 31.4479L44.7214 37.6031L46.0602 30.1289L40.4913 15.1806H39.4654ZM39.3189 22.2151H38.7326L35.2154 27.6375H41.0775L39.3189 22.2151Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-AG_Sport"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.6897 12.5431H49.2845L50.2904 8H78.7414L73.7586 38.6293H50.6035L50.4569 42H21L25.6897 12.5431ZM69.2153 20.3101H73.1723C72.928 17.8188 69.4943 13.1569 64.8191 12.6894C58.9568 12.1031 53.8275 14.6681 51.6294 20.8962C48.9916 28.3703 53.6835 34.3398 60.2757 34.5255C70.6809 34.8186 72.2928 24.1204 72.2928 24.1204H61.448V27.4911H66.8706C66.7241 28.6636 64.8191 30.9315 60.2757 30.7152C54.9997 30.4639 54.8532 26.0256 54.9997 24.1204C55.1463 22.2153 57.4911 15.7668 63.4997 16.2064C67.0171 16.4638 68.6292 18.4048 69.2153 20.3101ZM39.4654 15.1806L23.4913 37.6031H28.0344L32.5775 31.3013L42.3964 31.4479L44.7214 37.6031L46.0602 30.1289L40.4913 15.1806H39.4654ZM39.3189 22.2151H38.7326L35.2154 27.6375H41.0775L39.3189 22.2151Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-AG_Video"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.6897 12.5431H49.2845L50.2904 8H78.7414L73.7586 38.6293H50.6035L50.4569 42H21L25.6897 12.5431ZM69.2153 20.3101H73.1723C72.928 17.8188 69.4943 13.1569 64.8191 12.6894C58.9568 12.1031 53.8275 14.6681 51.6294 20.8962C48.9916 28.3703 53.6835 34.3398 60.2757 34.5255C70.6809 34.8186 72.2928 24.1204 72.2928 24.1204H61.448V27.4911H66.8706C66.7241 28.6636 64.8191 30.9315 60.2757 30.7152C54.9997 30.4639 54.8532 26.0256 54.9997 24.1204C55.1463 22.2153 57.4911 15.7668 63.4997 16.2064C67.0171 16.4638 68.6292 18.4048 69.2153 20.3101ZM39.4654 15.1806L23.4913 37.6031H28.0344L32.5775 31.3013L42.3964 31.4479L44.7214 37.6031L46.0602 30.1289L40.4913 15.1806H39.4654ZM39.3189 22.2151H38.7326L35.2154 27.6375H41.0775L39.3189 22.2151Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-BB"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M51.1216 14.2603L48.8091 9H66.8884C68.7805 9.07306 72.9429 10.2274 74.4565 14.2603C75.9701 18.2932 73.966 20.7626 72.7747 21.4932V22.1507C73.6156 23.1005 74.877 25.4384 74.877 27.411C74.877 29.1644 73.1952 33.5479 68.9907 34.4247C66.1899 35.0087 62.0288 35.6839 59.1773 36.1465C58.6043 36.2395 58.0841 36.3239 57.6386 36.3973L58.4795 30.9178L66.2578 29.8219C67.2388 29.6758 69.1168 28.8575 68.7805 26.7534C68.4441 24.6493 66.3979 24.4155 65.4169 24.5616L57.6386 25L55.7465 36.6164C54.6254 36.8356 52.2989 37.2301 51.9625 37.0548C51.9218 37.0336 51.8674 37.0083 51.8023 36.9781C51.1956 36.696 49.6704 35.9872 49.8603 34.2055C50.0284 32.6274 52.0326 21.5662 53.0136 16.2329C53.1538 15.5753 52.9716 14.2603 51.1216 14.2603ZM59.5306 14.0411H66.468C67.3089 14.0411 68.7805 15.0493 68.7805 16.4521C68.7805 17.8548 67.5191 19.0822 66.6782 19.0822L58.4795 19.5205L59.5306 14.0411Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.0027 9H41.0308C42.5026 9 46.7069 10.4904 48.3887 13.8219C50.4909 17.9863 47.3378 22.3699 46.4967 23.0274C46.3088 23.1743 46.3565 23.5388 46.4967 23.6849C47.3376 24.5616 49.0194 27.0164 49.0194 29.8219C49.0194 33.3288 45.6558 36.8356 44.1842 37.4932C42.7126 38.1507 32.8323 39.9041 31.3605 39.9041C31.1505 39.9041 32.2014 34.4247 32.2014 34.4247L39.7695 33.3288C40.6805 33.1096 42.5865 32.2329 42.9228 30.4795C43.3433 28.2877 41.8717 26.3151 39.5593 25.8767C37.7093 25.526 33.4628 25.8767 31.5707 26.0959L30.5196 32.8904L24.6333 33.5479L27.3663 15.5753C27.2962 15.0639 26.8197 14.0848 25.4742 14.2603C25.2642 14.2877 23.9326 12.1416 24.0027 10.9726V9ZM33.6732 14.0409H39.4806C41.4515 14.0411 43.1333 15.3562 43.1333 16.8902C43.1333 18.8749 41.6617 20.1779 40.6106 20.397C39.7697 20.5724 34.9345 20.7623 32.6221 20.8354L33.6732 14.0409Z"
      fill="currentColor"
    ></path>
    <path
      d="M30.0992 34.6438L24.2129 35.5206C24.1428 36.3242 24.0027 38.1507 24.0027 39.0274C24.0027 40.1233 24.8436 40.7808 25.8947 40.7808C26.7356 40.7808 28.4875 40.3425 29.2583 40.1233L30.0992 34.6438Z"
      fill="currentColor"
    ></path>
    <path
      d="M74.6667 41H36.4059C46.4967 39.4658 67.2668 36.3096 69.6213 35.9589C71.9759 35.6082 73.1251 36.9817 73.4054 37.7123L74.6667 40.5616V41Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-BetSoft"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M68.6609 30.5413C68.6609 32.0875 68.6976 33.6348 68.6524 35.1797C68.5813 37.6184 66.6531 39.7005 64.2981 39.9503C61.6831 40.2276 59.4273 38.7221 58.7802 36.2497C58.6833 35.8793 58.6196 35.4887 58.6182 35.1071C58.6074 31.9567 58.626 28.806 58.6052 25.6556C58.6021 25.1818 58.7489 25.0664 59.1958 25.0898C59.8754 25.1252 60.5608 25.1357 61.2387 25.0877C61.8011 25.0479 61.991 25.1758 61.9825 25.7928C61.941 28.8075 61.9557 31.8231 61.9599 34.8383C61.9614 35.9249 62.6704 36.6472 63.6724 36.6154C64.4723 36.5899 65.1202 36.0477 65.2634 35.2612C65.308 35.0161 65.3156 34.7618 65.316 34.5116C65.3194 31.593 65.3341 28.6742 65.3041 25.756C65.2983 25.204 65.4698 25.0693 65.9894 25.1011C66.6875 25.144 67.3917 25.1377 68.0908 25.1024C68.5397 25.0798 68.6908 25.1982 68.6818 25.6706C68.6509 27.2937 68.67 28.9177 68.67 30.5412C68.6668 30.5413 68.6638 30.5413 68.6609 30.5413Z"
      fill="currentColor"
    ></path>
    <path
      d="M68.6702 18.5024C68.6697 20.1267 68.6598 21.7512 68.6777 23.3754C68.6816 23.7262 68.594 23.8448 68.226 23.8317C67.4285 23.8035 66.628 23.7979 65.8311 23.8332C65.4047 23.8521 65.3252 23.702 65.3275 23.3112C65.3436 20.3913 65.3375 17.4714 65.334 14.5513C65.3336 14.3013 65.3262 14.047 65.2813 13.8019C65.1142 12.8907 64.3983 12.3365 63.5005 12.4041C62.6304 12.4695 61.9737 13.1612 61.97 14.0744C61.9576 17.1102 61.9458 20.1465 61.9744 23.1821C61.9797 23.7335 61.8116 23.8628 61.2951 23.8335C60.5379 23.7907 59.7765 23.8156 59.017 23.8202C58.7816 23.8216 58.6081 23.815 58.6126 23.4946C58.6583 20.1313 58.46 16.7612 58.7042 13.4057C58.8951 10.7828 61.3405 8.84281 63.9588 9.01995C66.6866 9.20441 68.6906 11.3424 68.6724 14.0354C68.6624 15.5245 68.6706 17.0134 68.6702 18.5024Z"
      fill="currentColor"
    ></path>
    <path
      d="M49.5441 25.0992C51.3862 25.0992 53.0588 25.1074 54.731 25.0916C55.0337 25.0887 55.186 25.2308 55.3396 25.4457C56.2637 26.7384 56.6286 28.1989 56.636 29.7579C56.6443 31.5166 56.6502 33.276 56.613 35.0341C56.553 37.881 54.29 40.0229 51.4453 39.9648C48.6544 39.9077 46.5537 37.7166 46.569 34.8809C46.5724 34.2624 46.5846 33.6433 46.5635 33.0256C46.5525 32.7051 46.6424 32.5797 46.9855 32.5882C47.8416 32.6092 48.6988 32.6087 49.5549 32.5882C49.8734 32.5805 49.9494 32.6938 49.9387 32.9877C49.9149 33.6442 49.906 34.3021 49.9204 34.9588C49.941 35.8925 50.5701 36.5533 51.4587 36.6083C52.3681 36.6646 53.2119 36.0632 53.2413 35.1488C53.3004 33.2993 53.4152 31.4379 53.1074 29.599C52.892 28.3115 52.209 27.2732 51.1799 26.4565C50.6669 26.0494 50.1713 25.6209 49.5441 25.0992Z"
      fill="currentColor"
    ></path>
    <path
      d="M53.6502 23.8225C51.7828 23.8225 50.0762 23.8175 48.3696 23.8276C48.0982 23.8292 48.005 23.6501 47.8851 23.479C47.0957 22.3534 46.6908 21.0893 46.6621 19.7332C46.621 17.7823 46.6272 15.8296 46.6585 13.8784C46.6967 11.4996 48.6101 9.36923 50.9221 9.07241C53.5016 8.74123 55.793 10.1888 56.5117 12.597C56.8629 13.7735 56.649 14.9782 56.7088 16.1692C56.7204 16.4003 56.5677 16.4024 56.4024 16.4021C55.4875 16.4007 54.5726 16.3947 53.6578 16.4057C53.3957 16.4089 53.3276 16.3042 53.332 16.0617C53.344 15.4049 53.346 14.7474 53.3326 14.0906C53.3124 13.1065 52.6427 12.4149 51.7118 12.3956C50.7758 12.3762 50.0381 13.0302 50.0164 14.0098C49.9816 15.5728 49.8836 17.1381 50.0337 18.7011C50.1769 20.1926 50.8139 21.4338 51.9585 22.412C52.4739 22.8523 52.9996 23.2806 53.6502 23.8225Z"
      fill="currentColor"
    ></path>
    <path
      d="M23.5252 32.5221C23.5252 30.2214 23.5393 27.9205 23.5132 25.6202C23.5081 25.1691 23.6458 25.0861 24.0679 25.0893C26.6383 25.1092 29.209 25.1153 31.7792 25.0851C32.2754 25.0793 32.2799 25.2834 32.293 25.6577C32.3074 26.0722 32.2214 26.226 31.7586 26.2142C30.299 26.1769 28.8378 26.2082 27.3779 26.1797C26.9832 26.1719 26.9013 26.2968 26.9027 26.6651C26.9143 29.8164 26.9142 32.9679 26.893 36.1191C26.8902 36.532 27.007 36.6254 27.4083 36.6193C28.8684 36.5973 30.3293 36.6331 31.7893 36.6089C32.2133 36.6018 32.3084 36.7374 32.2924 37.1301C32.2593 37.9409 32.2605 38.7539 32.2781 39.5655C32.2851 39.8911 32.1924 39.9943 31.8554 39.9927C29.2265 39.9799 26.5976 39.9785 23.9688 39.9937C23.607 39.9958 23.5145 39.8957 23.5169 39.5402C23.5332 37.2009 23.5252 34.8615 23.5252 32.5221Z"
      fill="currentColor"
    ></path>
    <path
      d="M74.3288 17.6021C74.3288 19.1676 74.3423 20.7331 74.3195 22.2983C74.3136 22.6986 74.4149 22.8255 74.8327 22.8183C76.3117 22.7929 77.7918 22.8274 79.2706 22.7972C79.7281 22.7878 79.7539 22.9845 79.7595 23.3442C79.7652 23.7089 79.6807 23.8354 79.2835 23.8326C76.6557 23.8141 74.0276 23.8136 71.3998 23.833C70.992 23.836 70.9308 23.691 70.9315 23.3357C70.9418 18.736 70.9434 14.1362 70.9294 9.53653C70.9282 9.135 71.0286 9.01578 71.4436 9.01799C74.0324 9.03146 76.6215 9.026 79.2102 9.00081C79.6385 8.99663 79.7873 9.09275 79.764 9.5407C79.7227 10.331 79.7278 11.1257 79.7571 11.9169C79.7713 12.303 79.6503 12.4072 79.2689 12.402C77.7897 12.3817 76.3098 12.4097 74.8308 12.3838C74.4102 12.3765 74.314 12.5083 74.3196 12.9058C74.3419 14.471 74.3288 16.0366 74.3288 17.6021Z"
      fill="currentColor"
    ></path>
    <path
      d="M23.5363 16.3897C23.5363 14.109 23.5494 11.828 23.5249 9.54742C23.5202 9.1077 23.6391 8.99894 24.0735 9.003C26.6431 9.02761 29.2131 9.03248 31.7828 9.01577C32.2033 9.01298 32.3011 9.13649 32.2848 9.5314C32.2522 10.3226 32.2467 11.1171 32.2808 11.908C32.2991 12.3328 32.1469 12.4182 31.7519 12.4115C30.2921 12.3863 28.8317 12.408 27.3719 12.3843C27.0009 12.3783 26.882 12.4636 26.8843 12.8541C26.9013 16.0047 26.9011 19.1555 26.8846 22.306C26.8825 22.7004 26.966 22.8289 27.3876 22.8208C28.8667 22.7929 30.3473 22.8325 31.826 22.7973C32.3129 22.7857 32.2762 23.0233 32.2944 23.3554C32.3149 23.7319 32.2029 23.8353 31.8177 23.8326C29.209 23.8147 26.6001 23.8145 23.9913 23.8327C23.5988 23.8355 23.5144 23.7172 23.5171 23.3482C23.5335 21.0288 23.5254 18.7093 23.5254 16.3898C23.529 16.3897 23.5327 16.3897 23.5363 16.3897Z"
      fill="currentColor"
    ></path>
    <path
      d="M87.7916 18.1502C87.7916 19.8909 87.7817 21.6316 87.7997 23.3721C87.8034 23.7242 87.7164 23.8435 87.3485 23.8315C86.5312 23.8047 85.7111 23.7966 84.8947 23.8338C84.4593 23.8536 84.3965 23.691 84.3982 23.3078C84.4126 19.8652 84.3958 16.4225 84.4186 12.98C84.4219 12.4879 84.282 12.358 83.8027 12.383C83.0256 12.4234 82.2446 12.3827 81.4657 12.3993C81.1564 12.4059 81.0104 12.345 81.0209 11.9908C81.0469 11.1213 81.0409 10.2503 81.0281 9.38016C81.0241 9.1076 81.1059 9.00592 81.3893 9.00661C84.4282 9.01369 87.4673 9.01427 90.5062 9.00638C90.8138 9.00557 90.8469 9.15276 90.8437 9.3999C90.8327 10.2702 90.8246 11.1408 90.8419 12.0107C90.8483 12.33 90.7174 12.4035 90.4283 12.3982C89.7079 12.3847 88.986 12.4155 88.2664 12.3853C87.8782 12.3689 87.7792 12.4953 87.7831 12.8704C87.802 14.6301 87.7916 16.3902 87.7916 18.1502Z"
      fill="currentColor"
    ></path>
    <path
      d="M41.3972 18.1799C41.3972 19.8808 41.3847 21.5817 41.4064 23.2823C41.4115 23.6858 41.3543 23.863 40.8834 23.8359C40.088 23.7898 39.2871 23.8022 38.4901 23.8323C38.1042 23.8469 38.0088 23.73 38.0104 23.3529C38.0252 19.9127 38.0042 16.4723 38.0342 13.0322C38.039 12.4798 37.8685 12.3644 37.3611 12.3921C36.6042 12.4333 35.8429 12.3891 35.0842 12.4092C34.7577 12.4179 34.6395 12.3235 34.6492 11.987C34.6736 11.1373 34.6747 10.2864 34.6624 9.43623C34.6575 9.10157 34.7896 9.01927 35.1107 9.01996C38.0696 9.02635 41.0286 9.0231 43.9875 9.00534C44.3411 9.00325 44.4579 9.08845 44.4452 9.45376C44.4156 10.3032 44.4209 11.1545 44.4383 12.0045C44.4446 12.3103 44.3465 12.4066 44.0417 12.3983C43.3609 12.3795 42.6751 12.438 41.9992 12.3783C41.4458 12.3294 41.3786 12.5455 41.3862 13.0197C41.414 14.7393 41.3972 16.4597 41.3972 18.1799Z"
      fill="currentColor"
    ></path>
    <path
      d="M70.9385 32.5712C70.9385 30.2525 70.9469 27.9338 70.9302 25.6152C70.9274 25.2256 71.0136 25.0862 71.4377 25.0893C74.0455 25.1091 76.6537 25.1147 79.2613 25.0857C79.7685 25.08 79.7533 25.313 79.7693 25.6727C79.7866 26.0617 79.695 26.2099 79.2658 26.2021C77.8066 26.1755 76.3464 26.2095 74.8872 26.1812C74.4514 26.1727 74.3373 26.2859 74.3389 26.7226C74.3546 30.9348 74.3356 35.1472 74.3563 39.3594C74.3588 39.8719 74.2312 40.0276 73.7138 39.9961C72.9577 39.95 72.1953 39.9593 71.4379 39.994C71.0124 40.0135 70.9267 39.8622 70.9297 39.4695C70.9475 37.17 70.9385 34.8706 70.9385 32.5712Z"
      fill="currentColor"
    ></path>
    <path
      d="M41.3877 32.5122C41.3877 34.8324 41.3787 37.1525 41.3964 39.4725C41.3995 39.8641 41.3153 40.0132 40.8905 39.9954C40.074 39.9613 39.2547 39.9723 38.4373 39.9922C38.1253 39.9997 38.002 39.9412 38.0032 39.5917C38.0179 34.8935 38.0205 30.1953 38.0117 25.4971C38.011 25.1463 38.1427 25.0868 38.4522 25.0931C39.2892 25.1107 40.1277 25.1209 40.9639 25.0894C41.3464 25.075 41.4064 25.2143 41.4045 25.5519C41.3909 27.8719 41.3974 30.192 41.3974 32.5121C41.394 32.5122 41.3908 32.5122 41.3877 32.5122Z"
      fill="currentColor"
    ></path>
    <path
      d="M87.7916 32.5106C87.7916 34.8292 87.7829 37.1478 87.8 39.4663C87.8029 39.8572 87.7162 40.0106 87.2914 39.9937C86.4754 39.9611 85.6568 39.9722 84.8398 39.9902C84.5286 39.997 84.3983 39.9347 84.3991 39.5847C84.4103 34.8896 84.4103 30.1944 84.3991 25.4994C84.3983 25.15 84.5276 25.086 84.84 25.093C85.6569 25.1112 86.4756 25.1233 87.2916 25.0893C87.7163 25.0715 87.8034 25.2194 87.8003 25.6129C87.7824 27.9121 87.7916 30.2114 87.7916 32.5106Z"
      fill="currentColor"
    ></path>
    <path
      d="M97.8566 30.268C97.0004 29.3785 96.1538 28.4793 95.2851 27.6019C94.344 26.6514 93.3825 25.7209 92.4294 24.7822C92.2671 24.6224 92.0741 24.513 92.3507 24.2441C94.1993 22.4464 96.0302 20.6306 97.8687 18.8225C97.891 18.8006 97.9376 18.8028 98 18.7868C98 22.5835 98 26.3718 98 30.1601C97.9522 30.1961 97.9044 30.2321 97.8566 30.268Z"
      fill="currentColor"
    ></path>
    <path
      d="M2 18.5268C2.45885 19.0237 2.79764 19.4163 3.16332 19.7824C4.6162 21.2375 6.07926 22.6827 7.53285 24.1371C7.6701 24.2744 7.95686 24.3727 7.65572 24.6643C5.79027 26.47 3.93944 28.2905 2.00012 30.1879C2 26.2932 2 22.5125 2 18.5268Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.0034 14.6928C11.0027 15.2789 11.002 15.8649 11.002 16.4509C11.002 16.6404 11.002 16.83 11.0021 17.0195C11.0022 17.392 11.0024 17.7645 11.0027 18.1369C11.0037 19.8931 11.0048 21.6492 10.9956 23.4052C10.9939 23.7322 11.0334 23.8809 11.4272 23.8782C14.151 23.8597 16.8751 23.8635 19.5991 23.8756C19.8995 23.8769 20.0546 23.7639 20.1874 23.5171C20.6198 22.7138 20.788 21.8553 20.7845 20.9536C20.7823 20.3691 20.7795 19.7846 20.7767 19.2001V19.1997C20.7686 17.505 20.7604 15.8103 20.7658 14.1157C20.7749 11.2264 18.6292 9.03889 15.726 9.01497C15.1706 9.01035 14.6151 9.01247 14.0597 9.0146C13.2141 9.01786 12.3685 9.02109 11.5235 9.00057C11.0631 8.98943 10.9887 9.14046 10.9923 9.55462C11.0074 11.2672 11.0054 12.98 11.0034 14.6928ZM14.3435 16.3502C14.3429 16.7679 14.3423 17.1856 14.3423 17.6034C14.3423 18.994 14.3423 20.3847 14.3422 21.7753C14.3422 22.2929 14.3422 22.5541 14.4737 22.6847C14.6077 22.8177 14.8782 22.8152 15.4242 22.8101C16.752 22.7977 17.3665 22.1804 17.3664 20.8468C17.3663 20.2066 17.3602 19.5661 17.3541 18.9257L17.354 18.9213C17.3411 17.5734 17.3282 16.2255 17.3719 14.8794C17.4369 12.8783 16.7471 12.2721 14.7772 12.38C14.4024 12.4006 14.3325 12.5168 14.3356 12.8522C14.3467 14.0181 14.3451 15.1841 14.3435 16.3502Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.0117 30.7746C11.011 31.3529 11.0104 31.9312 11.0104 32.5095C11.0104 33.0959 11.011 33.6823 11.0116 34.2688C11.0134 36.0202 11.0152 37.7717 11.0009 39.5231C10.9978 39.9079 11.1082 39.9999 11.4836 39.9945C12.4423 39.9805 13.4013 39.9824 14.3603 39.9843C14.8804 39.9853 15.4005 39.9864 15.9205 39.9849C18.9522 39.9762 21.1314 37.7851 21.1158 34.7804C21.1038 32.4426 21.1024 30.1049 21.1054 27.7672C21.1065 26.9783 20.9107 26.2449 20.5705 25.5375C20.4269 25.2389 20.2353 25.133 19.8928 25.1348C17.0906 25.1502 14.2882 25.1503 11.4858 25.1353C11.1099 25.1332 10.9972 25.224 11.0006 25.6119C11.0154 27.3313 11.0136 29.0507 11.0117 30.7702V30.7746ZM14.3937 30.1503C14.3928 30.5744 14.392 30.9985 14.392 31.4226C14.392 32.6971 14.3921 33.9716 14.3921 35.2461C14.3921 35.939 14.3921 36.2836 14.5656 36.4544C14.7373 36.6233 15.0788 36.622 15.7582 36.6194C17.0885 36.6144 17.6994 36.0013 17.7076 34.6636C17.71 34.2751 17.7127 33.8865 17.7155 33.498C17.7214 32.6701 17.7272 31.8423 17.7296 31.0144C17.73 30.8572 17.7312 30.6998 17.7328 30.5425C17.7341 30.4093 17.7356 30.2761 17.7372 30.1429C17.7465 29.3518 17.7557 28.5605 17.7129 27.7722C17.6617 26.8303 17.0138 26.2572 16.084 26.2114C15.9045 26.2025 15.7242 26.2052 15.5439 26.2078H15.543C15.3145 26.2112 15.0861 26.2146 14.8597 26.1944C14.4696 26.1597 14.3785 26.3002 14.3833 26.6723C14.3983 27.8306 14.396 28.989 14.3937 30.1475V30.1503Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-CMD"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.9793 19.0423L29.5005 16H10.7403C7.19096 16 4.90927 19.0423 4.40223 19.8028C3.89519 20.5634 0.345823 27.1549 1.10639 30.1972C1.71484 32.631 4.14857 33.493 5.6697 33.493H21.388L22.6556 30.4507C20.4955 30.389 16.4875 30.4174 13.6928 30.4372C12.6608 30.4446 11.7942 30.4507 11.2472 30.4507C9.21907 30.4507 9.10658 28.6024 9.47229 27.662C10.0638 26.1408 11.5005 22.693 12.5145 21.0704C13.5286 19.4479 14.6272 19.0423 15.0498 19.0423H27.9793ZM31.5289 34H26.205L33.8106 16L46.7402 16.2535L46.9937 27.4085L56.6275 16L69.8106 16.2535L62.712 34H52.5712L57.3881 21.5775L46.7402 34H38.374L37.3599 20.5634L31.5289 34ZM67.5289 34L73.867 16.2535H94.6557C95.6698 16.2535 97.698 16.7606 98.4586 18.0282C99.211 19.2823 98.543 22.507 97.9515 23.8592L95.1627 30.4507C94.4022 31.9718 91.5121 34 88.0642 34H67.5289ZM81.2192 19.549H88.5714C88.9939 19.6335 89.7375 20.1068 89.3319 21.3237C88.9263 22.5406 86.9657 27.4082 86.0361 29.6899C85.8671 30.1124 85.0728 30.9575 83.2474 30.9575H76.9094L81.2192 19.549Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-CQ9"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M39.6316 26.4505C39.6591 26.7809 39.6926 27.1027 39.7253 27.4171C39.9128 29.2203 40.0747 30.777 38.9306 32.2873C35.5213 36.5138 30.9671 37.7817 26.7849 37.7817C19.724 37.7817 14 32.1049 14 25.1022C14 18.0995 19.724 12.4227 26.7849 12.4227C30.3496 12.4227 33.8418 14.3153 36.1605 16.6492C35.5213 17.4945 34.4559 18.5511 34.006 19.1713C32.2862 17.1141 29.6899 15.8039 26.7849 15.8039C21.6069 15.8039 17.4093 19.9669 17.4093 25.1022C17.4093 30.2375 21.6069 34.4005 26.7849 34.4005C29.6964 34.4005 33.5361 33.4811 36.1605 30.5967C37.3142 29.3287 37.1924 28.9701 37.2259 28.4834C38.2887 27.6247 38.8285 26.8982 39.6316 26.4505Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M49.3716 37.7817C56.4325 37.7817 62.1565 32.1049 62.1565 25.1022C62.1565 18.0995 56.4325 12.4227 49.3716 12.4227C42.3107 12.4227 36.5867 18.0995 36.5867 25.1022C36.5867 32.1049 42.3107 37.7817 49.3716 37.7817ZM49.3716 34.4005C54.5496 34.4005 58.7472 30.2375 58.7472 25.1022C58.7472 19.9669 54.5496 15.8039 49.3716 15.8039C44.1936 15.8039 39.996 19.9669 39.996 25.1022C39.996 30.2375 44.1936 34.4005 49.3716 34.4005Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M74.9414 32.2873C80.5902 32.2873 85.1694 27.7458 85.1694 22.1436C85.1694 16.5415 80.5902 12 74.9414 12C69.2927 12 64.7135 16.5415 64.7135 22.1436C64.7135 27.7458 69.2927 32.2873 74.9414 32.2873ZM74.9414 28.9061C78.7073 28.9061 81.7601 25.8784 81.7601 22.1436C81.7601 18.4089 78.7073 15.3812 74.9414 15.3812C71.1756 15.3812 68.1228 18.4089 68.1228 22.1436C68.1228 25.8784 71.1756 28.9061 74.9414 28.9061Z"
      fill="currentColor"
    ></path>
    <path
      d="M49.3716 26.5815C45.9623 26.5815 43.2633 26.9337 42.3399 27.2155C42.553 28.0608 43.6184 30.5967 43.6184 30.5967C43.6184 30.5967 53.3833 28.5724 58.7472 32.7099C66.4182 38.627 72.8106 38.2044 75.3676 37.7817C77.9246 37.3591 81.547 36.0911 83.6778 32.0759C85.8086 28.0608 85.1694 22.1436 85.1694 22.1436H83.6778L80.6946 30.174C80.9077 31.2306 77.8394 34.0624 73.2368 34.4005C67.4836 34.8232 64.5323 32.171 61.0911 29.9627C57.4687 27.6381 53.6332 26.5815 49.3716 26.5815Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-Card365"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26.9014 14.223V10.4223C28.5813 10.2816 31.9412 10.4223 34.0412 12.1115C35.9534 13.6498 36.9811 15.4899 36.9811 19.7129C36.9811 23.5136 31.5212 25.2029 32.7812 25.2029C34.0412 25.2029 37.821 26.4698 37.821 30.6928C37.821 34.9158 36.6724 36.8378 35.3011 37.8719C33.6212 39.1388 29.2813 40.1242 27.3214 39.9834V36.605C28.5813 36.605 29.0013 35.4789 29.0013 34.9158V29.0036C29.0013 27.3144 29.0013 26.4698 27.7414 26.4698C26.7334 26.4698 26.0614 26.4698 25.6414 25.6252C25.3614 24.7806 25.2215 23.0914 26.9014 23.0914C28.5813 23.0914 29.0013 22.2468 29.0013 21.8245V15.0676C29.0013 14.392 27.6014 14.223 26.9014 14.223Z"
      fill="currentColor"
    ></path>
    <path
      d="M51.2606 13.8007V10.4223C41.6009 11.6892 40.7609 21.8245 40.7609 22.2467C40.7609 22.669 39.921 30.2705 43.2808 35.3381C45.6676 38.9379 49.4406 39.9834 50.8406 39.9834V36.605C50.5606 36.605 49.9166 36.5205 49.5806 36.1827C49.2446 35.8448 49.1606 35.1973 49.1606 34.9158V15.4899C49.1606 14.1386 50.5606 13.8007 51.2606 13.8007Z"
      fill="currentColor"
    ></path>
    <path
      d="M54.2005 22.669C51.5126 22.669 50.0006 23.5136 49.5806 23.9359V27.7367L51.2606 26.8921C51.9326 26.5542 52.5205 26.8921 52.5205 28.159V34.4935C52.5205 36.5205 51.6806 36.605 51.2606 36.605V39.9834C51.2606 39.9834 60.0803 39.5611 60.5003 30.2705C60.7291 25.2081 57.5604 22.669 54.2005 22.669Z"
      fill="currentColor"
    ></path>
    <path
      d="M75.1998 11.6892C71.7733 11.6892 67.22 10.9854 65.1201 10.4223L64.7001 18.0237C64.7001 18.0237 73.5198 19.7129 77.2997 16.7568C79.6718 14.9017 81.0796 11.6892 81.4995 10C81.4995 10 78.5596 11.6892 75.1998 11.6892Z"
      fill="currentColor"
    ></path>
    <path
      d="M67.64 19.713L64.7001 19.2906L64.2801 24.3582C64.2801 25.2028 64.2925 26.0599 64.7001 26.4698C65.5401 27.3144 66.8 26.8921 68.06 26.0475C69.068 25.3718 70.4399 24.9213 70.9999 24.7805V20.9798C70.9999 20.9798 67.92 22.106 67.22 22.669L67.64 19.713Z"
      fill="currentColor"
    ></path>
    <path
      d="M71.4199 24.7805V20.9798C77.2997 20.5575 81.4523 23.8832 81.9195 28.5813C82.3395 32.8043 81.0796 36.1827 78.9796 37.8719C77.1245 39.3642 72.8781 40.1242 71.3382 39.9834V37.0273C71.3382 37.0273 73.9398 36.8865 73.9398 34.4935V26.8921C73.9398 25.2029 71.9799 24.7805 71.4199 24.7805Z"
      fill="currentColor"
    ></path>
    <path
      d="M26.4813 14.223V10.4223C21.0215 10.8446 19.3416 14.6453 18.9216 16.7568C18.5016 18.8683 19.7616 22.2467 22.7015 22.2467C25.6414 22.2467 27.3213 20.1352 27.3213 18.0237C27.3213 15.9122 25.2214 15.0676 25.2214 14.6453C25.2214 14.3075 26.0613 14.223 26.4813 14.223Z"
      fill="currentColor"
    ></path>
    <path
      d="M51.6805 13.8007V10.4223C57.1403 10.8446 59.2402 13.8007 59.6602 15.9122C60.1811 18.5313 58.8202 21.8244 55.8803 21.8244C52.9404 21.8244 51.6806 19.7129 51.6806 18.0237C51.6806 15.9122 53.3604 15.0676 53.3604 14.6453C53.3604 13.8844 52.1005 13.8007 51.6805 13.8007Z"
      fill="currentColor"
    ></path>
    <path
      d="M26.9801 36.605V39.9834C21.5202 39.5611 18.5016 36.605 18.0814 34.0712C17.5929 31.1257 19.3416 28.159 22.2815 28.159C25.2214 28.159 26.4813 30.2705 26.4813 32.382C26.4813 34.4935 24.8014 35.7604 24.8014 36.1827C24.8014 36.5205 26.5601 36.605 26.9801 36.605Z"
      fill="currentColor"
    ></path>
    <path
      d="M70.9998 37.0273L71.0003 39.9834C65.5405 39.5611 63.96 36.1602 63.4405 34.0712C62.8494 31.6944 64.2807 28.5813 66.8004 28.5813C69.7403 28.5813 71.0003 30.2705 71.0003 32.382C71.0003 34.4935 68.8999 35.3381 68.9004 36.1827C68.9006 36.5205 70.5798 37.0273 70.9998 37.0273Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-DG"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 23.0483C12.0007 23.4057 14.3453 24.1205 15.7177 24.1205H33.8382C33.4808 22.4764 33.3021 17.8326 33.3021 12.3261C33.3021 12.2637 33.847 12.2285 34.7069 12.173C36.8015 12.0378 40.7651 11.782 43.2736 10.7178C46.4903 9.35317 49.0636 7.39394 49.5997 6H49.9214C50.3503 7.39394 53.1378 9.75281 56.998 11.0395C59.6174 11.9125 63.4657 11.9664 65.5248 11.9952C65.7414 11.9982 65.9383 12.001 66.1118 12.0044C66.2548 14.4705 66.3262 20.2391 65.4685 24.4422C65.451 24.528 72.4611 24.4079 78.6695 24.3015L78.67 24.3015L78.6706 24.3015L78.6712 24.3015L78.6719 24.3015L78.6732 24.3014C80.2239 24.2749 81.7244 24.2492 83.0528 24.2277C85.9474 24.1811 87.8132 23.3443 88.3066 23.0483C88.4139 22.984 87.1302 27.5579 81.9806 27.6588C76.5123 27.7661 66.9696 27.8732 66.7551 27.8732C66.5407 27.8732 63.324 28.6222 63.324 32.4837C63.324 38.5954 68.3635 38.1664 68.3635 38.1664V33.3415H71.7945V41.4903L67.184 41.5975C65.6829 41.5975 61.8229 40.2037 60.5363 36.022C60.5117 35.942 60.1716 36.3599 59.7003 36.9391L59.7003 36.9392C59.3178 37.4092 58.8488 37.9856 58.3919 38.4882C57.3196 39.6676 53.0308 43.0986 49.8142 43.0986C44.3459 43.0986 38.9848 36.1292 38.9848 36.1292C38.9848 36.1292 38.2342 38.2445 36.197 40.0965C34.8032 41.3637 32.7659 41.5976 32.5515 41.5976L27.5121 41.4903V33.3415H31.0504L31.1576 38.0592H32.6587C33.8382 38.0592 36.0898 36.2365 36.0898 33.8776C36.0898 30.2321 35.232 27.766 31.6937 27.6587C31.2127 27.6442 29.5168 27.6555 27.38 27.6698L27.3787 27.6698L27.3772 27.6698L27.3767 27.6698H27.3763H27.3761H27.376H27.376H27.3759H27.3757H27.3755H27.3754H27.3753C23.7992 27.6937 18.9908 27.7259 16.5755 27.6587C15.0702 27.6169 11.1716 25.7932 11 23.0483ZM13.5733 27.8732C14.2524 28.2306 15.8679 28.9454 16.8972 28.9454H31.0504V32.4837H19.1488C17.5048 32.0191 14.088 30.4465 13.5733 27.8732ZM19.3633 33.4487C18.2911 33.4487 16.8614 32.8768 16.4683 32.5909C16.3611 34.6282 19.5777 36.8799 21.186 36.987H26.2254V33.4487H19.3633ZM18.9344 36.987C19.3633 37.3444 20.993 38.0592 21.9366 38.0592H26.2254V41.4903H23.0088C21.9366 41.3832 19.3633 39.5604 18.9344 36.987ZM82.0878 28.8382H68.3635V32.4837H78.9784C84.5539 32.4837 85.8405 27.7874 85.7333 27.8732C84.8755 28.5594 82.9456 28.8024 82.0878 28.8382ZM73.0812 33.3415H79.9434C81.0156 33.3415 82.4095 33.0199 83.0528 32.591C83.305 32.4229 81.7661 36.8798 77.4773 36.8798H73.0812V33.3415ZM77.6917 38.1664H73.0812V41.4903L75.5473 41.4904C79.4073 41.4904 80.5331 36.9871 80.3723 37.0943C79.5497 37.6427 78.335 38.1664 77.6917 38.1664ZM44.1312 13.3986C41.3435 14.4708 37.7337 15.0427 36.1968 15.1142C35.6607 16.0792 36.1968 20.5825 37.3762 25.3002C38.5557 30.018 40.5929 33.6635 41.0218 33.3418C41.2968 33.1355 44.4382 31.915 47.2786 30.8114C48.8672 30.1942 50.3617 29.6135 51.2078 29.2674C53.5667 28.3024 54.1028 27.0158 53.9956 25.0858C53.8883 23.1558 52.6017 22.7269 51.5295 22.5125C50.6717 22.3409 50.3143 22.8699 50.2428 23.1558C51.0291 23.2988 52.28 23.5847 50.9934 23.5847C49.7759 23.5847 49.6644 23.8304 49.589 23.9964C49.5648 24.0497 49.5444 24.0947 49.4923 24.1208C49.2778 24.228 49.385 24.7641 49.4923 25.0858C49.578 25.3431 49.8139 25.5504 49.9212 25.6219H47.6695V25.9436H47.2406C46.2756 25.9436 44.3027 26.2223 44.1312 27.3374C43.9596 28.4525 45.0604 28.8028 45.6323 28.8385L45.8467 29.2674C45.2034 29.2674 43.7452 29.246 43.059 29.1602C42.3728 29.0744 41.272 28.2667 40.8073 27.8735H40.0568C40.021 27.6948 39.971 27.0587 40.0568 25.9436C40.164 24.5497 41.0218 23.7991 41.2362 24.1208C41.297 24.2119 41.3147 24.3203 41.3308 24.4191C41.3717 24.6688 41.4025 24.857 42.094 24.5497C42.866 24.2066 43.3449 22.5482 43.4879 21.7619L42.6301 21.6547L42.8445 21.4403L43.9168 21.1186C44.1312 20.9399 44.603 20.5396 44.7745 20.368C44.9461 20.1965 44.846 19.7962 44.7745 19.6175C44.4529 18.724 44.3242 16.6582 46.3828 15.5431C48.4415 14.428 52.3872 15.0068 52.3872 15.0068C52.3872 15.0068 48.849 15.3285 47.3479 15.9718C46.147 16.4865 46.0612 17.9018 46.4901 17.7947L47.6695 16.7224L47.7767 17.4731L48.9562 16.5081C48.5273 17.3658 48.6988 18.4809 48.9562 17.3658C49.2778 15.972 51.315 15.4359 52.3872 15.3286C53.2377 15.2436 54.4255 15.4958 54.9339 15.6038L54.9339 15.6038C55.0665 15.632 55.1528 15.6503 55.175 15.6503C55.2008 15.6503 55.3812 15.706 55.6555 15.7906C56.5228 16.0582 58.3276 16.6151 59.1423 16.6151C60 16.6151 60.3217 16.2577 60.4289 16.079C60.5361 16.4007 60.3645 17.0656 59.2494 17.1514C58.2908 17.2251 57.6365 17.096 56.4844 16.8687C55.9612 16.7655 55.3353 16.642 54.5317 16.5081C51.9584 16.0792 51.3256 16.6047 50.7789 17.1514C50.4573 17.4731 50.3501 17.7947 50.4573 17.7947C50.4905 17.7947 50.5578 17.7885 50.6551 17.7796C51.2596 17.724 53.0212 17.5621 54.9606 18.1162C56.7619 18.6309 58.07 20.368 58.3916 21.1186L57.3194 20.7969C57.3194 20.9756 57.5694 21.7118 58.7134 22.5125C59.7856 23.2629 61.1795 23.3701 61.1795 23.3701C61.1795 23.3701 60.7506 24.1208 59.8928 24.0134C59.035 23.9061 58.4989 23.7991 58.4989 23.7991C58.4989 23.7991 59.1423 26.1578 58.7134 28.4095C58.2845 30.6611 54.9606 33.2346 53.3522 33.8779C52.0656 34.3926 51.1006 34.6642 50.7789 34.7357C53.0306 35.0572 53.674 35.8541 53.1378 35.8079C48.1627 35.379 45.6323 37.0588 44.989 37.9523C44.6674 38.399 47.6681 40.2962 49.814 40.0966C54.7462 39.6378 58.9278 34.0548 60.7506 29.5889C62.3602 25.6452 63.5383 17.6875 63.5383 14.8997L63.4842 14.8972C61.952 14.8243 58.3993 14.6554 56.2472 13.8275C53.4595 12.7552 50.4573 10.6108 49.9212 10.0747C49.7671 9.92051 49.5996 10.0747 49.5996 10.0747C48.9562 10.7179 46.8544 12.3513 44.1312 13.3986ZM46.0612 21.7616C45.9897 21.4042 46.0183 20.5608 46.7045 20.0461C47.3907 19.5314 48.0627 19.6887 48.3129 19.8316C48.3844 20.1176 48.3772 20.8181 47.7768 21.3328C47.1764 21.8474 46.3829 21.8331 46.0612 21.7616Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-EVO"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38.4321 12.6882H54.5375V16.601H42.6177V22.3081H50.5531V26.2209H42.6177V32.6109H54.9067V36.5238H38.4321V12.6882Z"
      fill="currentColor"
    ></path>
    <path
      d="M53.7466 19.5794H58.0321L61.7818 31.3893L65.2638 19.5794H69.4161L63.6567 36.5221H59.8055L53.7466 19.5794Z"
      fill="currentColor"
    ></path>
    <path
      d="M68.76 28.0864C68.76 22.918 72.1088 19.2566 76.8966 19.2566C81.6512 19.2566 85 22.918 85 28.0864C85 33.1835 81.5846 36.8449 76.7968 36.8449C72.0406 36.8449 68.76 33.2549 68.76 28.0864ZM80.7795 28.1935V28.0508C80.7795 24.8209 79.3056 22.8823 76.895 22.8823C74.4512 22.8823 72.9773 24.8209 72.9773 28.0508V28.1935C72.9773 31.352 74.4163 33.2192 76.8285 33.2192C79.2723 33.2192 80.7795 31.3537 80.7795 28.1935Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.5317 39.6466C31.8185 39.6466 31.2416 39.0265 31.2416 38.2619C31.2432 37.4956 31.8201 36.8772 32.5317 36.8772C33.2465 36.8772 33.8218 37.4956 33.8233 38.2619C33.8218 39.0265 33.2449 39.6466 32.5317 39.6466ZM32.5317 36.5221C31.6378 36.5221 30.912 37.302 30.912 38.2619C30.912 39.2218 31.6378 40 32.5317 40C33.4271 40 34.153 39.2218 34.153 38.2619C34.153 37.302 33.4271 36.5221 32.5317 36.5221Z"
      fill="currentColor"
    ></path>
    <path
      d="M29.885 23.776C31.1751 23.8202 32.5903 23.7828 34.153 23.6503C33.928 20.2777 32.9041 17.476 31.37 15.3047C31.4429 15.8993 31.4841 16.5042 31.4841 17.1209C31.4841 19.5353 30.9025 21.8035 29.885 23.776Z"
      fill="currentColor"
    ></path>
    <path
      d="M29.3445 24.7326C27.0433 28.4466 23.1081 30.8949 18.6372 30.8949C18.3187 30.8949 18.0033 30.8779 17.6911 30.8542C16.55 32.7299 15.813 34.8129 15 36.7719C23.0194 41.3626 33.3748 36.5221 34.153 24.8345C32.3685 24.6833 30.7757 24.6561 29.3445 24.7326Z"
      fill="currentColor"
    ></path>
    <path
      d="M15 11.7146C17.2299 17.0938 18.9003 23.4073 29.885 23.776C30.9025 21.8035 31.4841 19.5353 31.4841 17.1209C31.4841 16.5042 31.4429 15.8993 31.37 15.3047C27.5885 9.95786 20.7039 8.44912 15 11.7146Z"
      fill="currentColor"
    ></path>
    <path
      d="M29.3445 24.7326C22.7341 25.0826 19.6294 27.6668 17.6911 30.8542C18.0033 30.8779 18.3187 30.8949 18.6372 30.8949C23.1081 30.8949 27.0433 28.4449 29.3445 24.7326Z"
      fill="currentColor"
    ></path>
    <path
      d="M31.912 37.98H31.6695V37.8084H32.3574V37.98H32.1165V38.7156H31.912V37.98Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.443 37.8066H32.7663L32.9216 38.3859L33.0832 37.8066H33.3986V38.7138H33.1973V37.9816L32.9834 38.7138H32.8233L32.6173 37.985V38.7138H32.443V37.8066Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-EVOPlay"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M69.5 6.52637C68.1848 9.64453 66.9503 12.5478 65.7424 15.4621C65.5432 15.9423 65.146 16.025 64.73 16.1284C53.6686 18.883 42.6049 21.6312 31.5476 24.4012C30.7533 24.6 30.4817 24.4811 30.5076 23.6228C30.5671 21.645 30.5801 19.6619 30.5029 17.6852C30.467 16.769 30.7592 16.3898 31.682 16.1577C40.978 13.8203 50.2622 11.4374 59.5494 9.0672C62.7702 8.24457 65.9904 7.42252 69.5 6.52637Z"
      fill="currentColor"
    ></path>
    <path
      d="M62.8898 21.7534C61.7413 24.5068 60.6689 27.0706 59.6053 29.6373C59.4191 30.0871 59.0785 30.2325 58.6054 30.2951C49.5115 31.4997 40.4182 32.7089 31.3296 33.9526C30.6626 34.044 30.5076 33.9199 30.5158 33.2955C30.5453 31.1895 30.5483 29.083 30.5141 26.977C30.5035 26.3359 30.7386 26.1073 31.3838 26.0211C41.7994 24.6234 52.2114 23.2039 62.8898 21.7534Z"
      fill="currentColor"
    ></path>
    <path
      d="M57.2866 35.6123C56.1965 38.1692 55.1553 40.6026 54.1241 43.0394C53.9309 43.4967 53.5461 43.4599 53.1536 43.4599C45.9212 43.4576 38.6887 43.4479 31.4569 43.4737C30.6909 43.4766 30.5159 43.2204 30.5294 42.5299C30.5701 40.5107 30.5524 38.4903 30.5383 36.4705C30.5347 35.9564 30.5548 35.5985 31.2701 35.6002C39.8837 35.6186 48.498 35.6123 57.2866 35.6123Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-EVO_Electronic"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M69.5 6.52637C68.1848 9.64453 66.9503 12.5478 65.7424 15.4621C65.5432 15.9423 65.146 16.025 64.73 16.1284C53.6686 18.883 42.6049 21.6312 31.5476 24.4012C30.7533 24.6 30.4817 24.4811 30.5076 23.6228C30.5671 21.645 30.5801 19.6619 30.5029 17.6852C30.467 16.769 30.7592 16.3898 31.682 16.1577C40.978 13.8203 50.2622 11.4374 59.5494 9.0672C62.7702 8.24457 65.9904 7.42252 69.5 6.52637Z"
      fill="currentColor"
    ></path>
    <path
      d="M62.8898 21.7534C61.7413 24.5068 60.6689 27.0706 59.6053 29.6373C59.4191 30.0871 59.0785 30.2325 58.6054 30.2951C49.5115 31.4997 40.4182 32.7089 31.3296 33.9526C30.6626 34.044 30.5076 33.9199 30.5158 33.2955C30.5453 31.1895 30.5483 29.083 30.5141 26.977C30.5035 26.3359 30.7386 26.1073 31.3838 26.0211C41.7994 24.6234 52.2114 23.2039 62.8898 21.7534Z"
      fill="currentColor"
    ></path>
    <path
      d="M57.2866 35.6123C56.1965 38.1692 55.1553 40.6026 54.1241 43.0394C53.9309 43.4967 53.5461 43.4599 53.1536 43.4599C45.9212 43.4576 38.6887 43.4479 31.4569 43.4737C30.6909 43.4766 30.5159 43.2204 30.5294 42.5299C30.5701 40.5107 30.5524 38.4903 30.5383 36.4705C30.5347 35.9564 30.5548 35.5985 31.2701 35.6002C39.8837 35.6186 48.498 35.6123 57.2866 35.6123Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-EVO_Video"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38.4321 12.6882H54.5375V16.601H42.6177V22.3081H50.5531V26.2209H42.6177V32.6109H54.9067V36.5238H38.4321V12.6882Z"
      fill="currentColor"
    ></path>
    <path
      d="M53.7466 19.5794H58.0321L61.7818 31.3893L65.2638 19.5794H69.4161L63.6567 36.5221H59.8055L53.7466 19.5794Z"
      fill="currentColor"
    ></path>
    <path
      d="M68.76 28.0864C68.76 22.918 72.1088 19.2566 76.8966 19.2566C81.6512 19.2566 85 22.918 85 28.0864C85 33.1835 81.5846 36.8449 76.7968 36.8449C72.0406 36.8449 68.76 33.2549 68.76 28.0864ZM80.7795 28.1935V28.0508C80.7795 24.8209 79.3056 22.8823 76.895 22.8823C74.4512 22.8823 72.9773 24.8209 72.9773 28.0508V28.1935C72.9773 31.352 74.4163 33.2192 76.8285 33.2192C79.2723 33.2192 80.7795 31.3537 80.7795 28.1935Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.5317 39.6466C31.8185 39.6466 31.2416 39.0265 31.2416 38.2619C31.2432 37.4956 31.8201 36.8772 32.5317 36.8772C33.2465 36.8772 33.8218 37.4956 33.8233 38.2619C33.8218 39.0265 33.2449 39.6466 32.5317 39.6466ZM32.5317 36.5221C31.6378 36.5221 30.912 37.302 30.912 38.2619C30.912 39.2218 31.6378 40 32.5317 40C33.4271 40 34.153 39.2218 34.153 38.2619C34.153 37.302 33.4271 36.5221 32.5317 36.5221Z"
      fill="currentColor"
    ></path>
    <path
      d="M29.885 23.776C31.1751 23.8202 32.5903 23.7828 34.153 23.6503C33.928 20.2777 32.9041 17.476 31.37 15.3047C31.4429 15.8993 31.4841 16.5042 31.4841 17.1209C31.4841 19.5353 30.9025 21.8035 29.885 23.776Z"
      fill="currentColor"
    ></path>
    <path
      d="M29.3445 24.7326C27.0433 28.4466 23.1081 30.8949 18.6372 30.8949C18.3187 30.8949 18.0033 30.8779 17.6911 30.8542C16.55 32.7299 15.813 34.8129 15 36.7719C23.0194 41.3626 33.3748 36.5221 34.153 24.8345C32.3685 24.6833 30.7757 24.6561 29.3445 24.7326Z"
      fill="currentColor"
    ></path>
    <path
      d="M15 11.7146C17.2299 17.0938 18.9003 23.4073 29.885 23.776C30.9025 21.8035 31.4841 19.5353 31.4841 17.1209C31.4841 16.5042 31.4429 15.8993 31.37 15.3047C27.5885 9.95786 20.7039 8.44912 15 11.7146Z"
      fill="currentColor"
    ></path>
    <path
      d="M29.3445 24.7326C22.7341 25.0826 19.6294 27.6668 17.6911 30.8542C18.0033 30.8779 18.3187 30.8949 18.6372 30.8949C23.1081 30.8949 27.0433 28.4449 29.3445 24.7326Z"
      fill="currentColor"
    ></path>
    <path
      d="M31.912 37.98H31.6695V37.8084H32.3574V37.98H32.1165V38.7156H31.912V37.98Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.443 37.8066H32.7663L32.9216 38.3859L33.0832 37.8066H33.3986V38.7138H33.1973V37.9816L32.9834 38.7138H32.8233L32.6173 37.985V38.7138H32.443V37.8066Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-HB"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M47.8039 1.5C47.1109 1.5 46.549 2.06184 46.549 2.7549V3.38235C46.549 4.07542 47.1109 4.63725 47.8039 4.63725C48.497 4.63725 49.0588 4.07542 49.0588 3.38235V2.7549C49.0588 2.06184 48.497 1.5 47.8039 1.5ZM55.0196 10.598C55.0196 9.90498 55.5814 9.34314 56.2745 9.34314C56.9676 9.34314 57.5294 9.90498 57.5294 10.598V11.2255C57.5294 11.9186 56.9676 12.4804 56.2745 12.4804C55.5814 12.4804 55.0196 11.9186 55.0196 11.2255V10.598ZM56.2745 13.1078C55.5814 13.1078 55.0196 13.6697 55.0196 14.3627V16.8233L55.0129 16.82C54.962 17.2039 54.6333 17.5 54.2353 17.5C53.8021 17.5 53.451 17.1489 53.451 16.7157V16.0544V10.9118C53.451 10.2187 52.8891 9.65686 52.1961 9.65686C51.503 9.65686 50.9412 10.2187 50.9412 10.9118V14.8241V15.4608C50.9412 15.894 50.5901 16.2451 50.1569 16.2451C49.7237 16.2451 49.3725 15.894 49.3725 15.4608V14.6703V13.8922C49.3725 13.1125 48.7405 12.4804 47.9608 12.4804C47.1811 12.4804 46.549 13.1125 46.549 13.8922V16.0544V16.0882V17.3431C46.549 17.7764 46.1979 18.1275 45.7647 18.1275C45.3315 18.1275 44.9804 17.7764 44.9804 17.3431V16.8234V12.4804C44.9804 11.7873 44.4186 11.2255 43.7255 11.2255C43.0324 11.2255 42.4706 11.7873 42.4706 12.4804V18.0536V19.0686V19.5392C42.4706 19.9724 42.1195 20.3235 41.6863 20.3235C41.2531 20.3235 40.902 19.9724 40.902 19.5392V18.8226V17.1863C40.902 16.4932 40.3401 15.9314 39.6471 15.9314C38.954 15.9314 38.3922 16.4932 38.3922 17.1863V20.0529V20.6373V22.6765C38.3922 23.1097 38.0411 23.4608 37.6078 23.4608C37.1746 23.4608 36.8235 23.1097 36.8235 22.6765V20.8218V20.4804C36.8235 19.7007 36.1915 19.0686 35.4118 19.0686C34.6321 19.0686 34 19.7007 34 20.4804V22.2059V23.6176V39.5718C34 40.2805 34.3751 40.9363 34.986 41.2957L46.9579 48.338C48.8356 49.4425 51.1644 49.4425 53.0421 48.338L65.014 41.2957C65.6249 40.9363 66 40.2805 66 39.5718V23.6176V22.2059V20.4804C66 19.7007 65.3679 19.0686 64.5882 19.0686C63.8085 19.0686 63.1765 19.7007 63.1765 20.4804V20.8217V21.7353C63.1765 22.1685 62.8254 22.5196 62.3922 22.5196C61.9589 22.5196 61.6078 22.1685 61.6078 21.7353V20.951V20.0529V17.5C61.6078 16.8069 61.046 16.2451 60.3529 16.2451C59.6599 16.2451 59.098 16.8069 59.098 17.5V18.8225L59.0695 18.8085C58.9776 19.1394 58.674 19.3824 58.3137 19.3824C57.8805 19.3824 57.5294 19.0313 57.5294 18.598V18.0536L57.5085 18.0433C57.5222 17.9689 57.5294 17.8922 57.5294 17.8137V14.3627C57.5294 13.6697 56.9676 13.1078 56.2745 13.1078ZM47.9608 5.89216C47.1811 5.89216 46.549 6.52423 46.549 7.30392V9.81373C46.549 10.5934 47.1811 11.2255 47.9608 11.2255C48.7405 11.2255 49.3725 10.5934 49.3725 9.81373V7.30392C49.3725 6.52423 48.7405 5.89216 47.9608 5.89216ZM50.6275 4.16667C50.6275 3.38697 51.2595 2.7549 52.0392 2.7549C52.8189 2.7549 53.451 3.38697 53.451 4.16667V6.9902C53.451 7.76989 52.8189 8.40196 52.0392 8.40196C51.2595 8.40196 50.6275 7.76989 50.6275 6.9902V4.16667ZM42.4706 25.6567H48.1177V29.1077H52.1961V25.6567H57.8432V37.4214H52.353V34.1273H48.1177V37.4214H42.4706V25.6567Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-HackMD"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="ODINç”µå&shy;">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M53.8406 23.7016C53.2211 23.749 51.9071 23.6952 51.6027 21.969C51.4022 20.8318 51.3912 20.3863 51.3767 19.8005C51.3671 19.4134 51.356 18.965 51.2877 18.2154C51.139 16.5823 50.3053 15.1414 49.3325 14.6392C49.2212 14.5818 51.0516 14.0418 52.3114 15.223C52.5525 15.4491 52.399 11.528 50.3464 10.1138C50.151 9.9792 52.8472 9.44858 54.4454 11.6341C55.235 12.7138 55.3527 13.473 55.3936 13.7371C55.4006 13.7823 55.4054 13.813 55.4109 13.8283C55.8121 13.2432 56.6146 11.7445 56.6146 10.8316C56.6146 9.83848 56.2886 8.87968 56.1256 8.52441C56.9657 8.55371 58.565 9.67976 58.834 10.8316C59.1621 12.2364 59.0212 13.1197 58.9895 13.3183C58.9871 13.3335 58.9853 13.3446 58.9844 13.3518C60.0602 13.1556 62.368 12.2136 62.9938 10.2582C63.0265 10.1561 63.513 11.1834 63.5092 12.1717C63.5059 13.0116 63.0739 13.8192 63.0029 13.9519C62.9982 13.9607 62.995 13.9666 62.9938 13.9692C62.9889 13.9792 63.0423 13.9907 63.1448 14.0128C63.9602 14.1886 67.8856 15.035 70.4199 21.114C73.3102 28.0467 68.4091 37.0424 65.7616 39.4862C63.3217 41.7385 60.5549 44.265 55.7232 45.6698C56.1098 45.5315 56.5688 45.3394 57.079 45.0747C55.8822 45.5963 54.5776 45.995 53.1683 46.2073C45.5949 47.3484 40.1239 43.8168 40.3292 43.8407C45.2654 44.4154 48.9224 42.3333 50.1339 41.2205C50.1339 41.2205 46.8224 43.2779 40.3292 41.9389C32.9056 40.4081 29.9047 32.7095 30.0595 32.841C34.3393 36.476 39.8247 35.921 39.5685 35.8532C35.2578 34.7122 31.7604 32.5835 29.8061 27.8658C27.3243 21.8748 29.778 16.8778 29.8061 17.4272C30.0762 22.7014 34.1731 25.8795 36.1876 26.8092C34.9081 25.6266 32.6804 21.9564 32.7644 17.6385C32.9248 9.39552 39.1589 6.1019 39.1036 6.18556C35.9699 10.9322 38.4238 17.6385 38.512 16.8778C39.5263 8.1296 45.1185 4.65355 50.5143 3.73435C55.7353 2.84493 59.7115 5.75832 59.5454 5.74115C57.8451 5.56536 53.1683 5.72045 50.1339 8.76329C47.0996 11.8061 45.1048 15.2293 46.3304 20.7656C47.556 26.3019 53.1683 30.2745 57.6119 29.7673C62.0556 29.2602 62.8013 26.4236 62.6448 25.299C62.3979 23.524 59.7954 21.4633 57.6119 23.1385C55.7347 24.5788 56.589 26.6294 56.8768 27.3202C56.9404 27.4727 56.9763 27.5589 56.9491 27.5576C54.6318 27.4473 53.9276 25.0896 53.8406 23.7016ZM54.4445 46.003C54.8864 45.9006 55.3123 45.7893 55.7232 45.6698C54.8833 45.9702 54.3849 46.0168 54.4445 46.003Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-Hacksaw"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M55.543 25.6357C56.2213 24.6748 56.843 23.8039 57.4525 22.9248C57.6331 22.6641 57.7557 22.7219 57.9189 22.9389C58.3739 23.5437 58.8873 24.0931 59.5231 24.5163C60.3262 25.0508 61.1982 25.3177 62.1692 25.1558C62.8906 25.0355 63.3154 24.6435 63.3913 24.0518C63.4709 23.4305 63.1563 22.9494 62.4603 22.6482C62.0053 22.4512 61.525 22.3428 61.0447 22.2344C60.9424 22.2113 60.8402 22.1882 60.7382 22.1643C60.6883 22.1526 60.6384 22.1406 60.5886 22.1284C60.5332 22.1148 60.478 22.1009 60.423 22.0864C60.2814 22.0492 60.139 22.0153 59.9969 21.9805C59.9315 21.9645 59.8663 21.9483 59.8012 21.9315C59.7598 21.9208 59.7185 21.9099 59.6772 21.8986C56.8713 21.1303 55.6666 19.5148 55.7365 16.6144C55.7524 15.9565 55.8161 15.3032 56.0085 14.6712C56.5457 12.9067 57.7034 11.7398 59.4937 11.2862C62.181 10.6052 64.5749 11.1021 66.5376 13.1797C66.8419 13.502 66.8553 13.7348 66.5869 14.0818C65.9991 14.8419 65.4367 15.6226 64.8925 16.4144C64.6732 16.7337 64.5309 16.7807 64.2395 16.4844C63.5875 15.8215 62.8252 15.3297 61.8781 15.1851C61.4595 15.1212 61.0443 15.1308 60.6379 15.2529C60.2406 15.3723 59.9611 15.616 59.8806 16.0396C59.7981 16.473 59.9422 16.8295 60.2833 17.1019C60.6416 17.3879 61.0708 17.5271 61.505 17.6443C61.7917 17.7217 62.0797 17.7946 62.3676 17.8674L62.3718 17.8683C62.798 17.9761 63.2241 18.0838 63.6459 18.2063C66.4179 19.0105 67.6078 20.7191 67.41 23.8543C67.3716 24.4622 67.2276 25.0532 67.0304 25.6319C66.9582 25.8438 66.8568 25.9313 66.618 25.9247C63.6724 25.8433 60.7269 25.7681 57.7284 25.6915L55.543 25.6357Z"
      fill="currentColor"
    ></path>
    <path
      d="M47.7629 22.0191C47.1176 22.9613 46.5171 23.8386 45.9166 24.7161C45.9077 24.7292 45.8942 24.7457 45.8961 24.7588C45.9915 25.4449 45.5993 25.4092 45.2153 25.3744C45.1757 25.3708 45.1361 25.3672 45.0972 25.3644C45.0612 25.3618 45.0257 25.36 44.9911 25.3593C44.6245 25.3532 44.2578 25.3436 43.8912 25.3339C43.3265 25.3191 42.762 25.3043 42.1974 25.3022C41.884 25.3009 41.7498 25.2422 41.7509 24.8842C41.7634 20.6102 41.7623 16.3362 41.7534 12.0622C41.7526 11.7011 41.8404 11.5462 42.2391 11.5557C43.2824 11.5807 44.3271 11.5832 45.3703 11.5547C45.7927 11.5432 45.8776 11.7052 45.8742 12.0852C45.8627 13.4056 45.8643 14.7261 45.866 16.0466C45.8666 16.519 45.8673 16.9913 45.8673 17.4636V17.9539C45.9747 17.8923 46.0417 17.8173 46.0933 17.7397C46.1094 17.7157 46.1238 17.6915 46.1376 17.6673L46.1525 17.6408L46.1679 17.6128L46.1688 17.6111L46.1712 17.6068C46.1882 17.5757 46.205 17.5453 46.2234 17.5161L46.5131 17.0539C47.5816 15.3491 48.6501 13.6443 49.7064 11.9319C49.878 11.6537 50.0692 11.5428 50.4015 11.5477C51.2303 11.5596 52.0592 11.5587 52.8882 11.5577L53.3121 11.5574C53.6588 11.5571 54.0055 11.5573 54.3522 11.5588C54.365 11.5588 54.3782 11.5583 54.3917 11.5574L54.401 11.5567L54.4218 11.5548L54.4612 11.5506C54.5869 11.5366 54.7202 11.5217 54.7848 11.6637C54.8456 11.7971 54.7593 11.9018 54.6773 12.001C54.6541 12.0292 54.6312 12.057 54.6121 12.0848L54.3214 12.5098C53.116 14.2719 51.9105 16.0341 50.6907 17.7863C50.5109 18.0446 50.502 18.2337 50.6331 18.5184C51.423 20.235 52.1998 21.9576 52.9766 23.6801C53.1928 24.1596 53.4091 24.6392 53.6257 25.1186L53.6263 25.1197C53.7316 25.3531 53.7844 25.4701 53.7466 25.527C53.7422 25.5337 53.7365 25.5395 53.7296 25.5446C53.7261 25.5472 53.7222 25.5496 53.7181 25.5518L53.7102 25.5556C53.6895 25.5646 53.662 25.5702 53.6269 25.5736C53.5934 25.5767 53.5529 25.5778 53.5049 25.5776C53.4489 25.5775 53.3825 25.5756 53.3048 25.5736C53.0262 25.5661 52.7476 25.5576 52.469 25.549C51.6237 25.5231 50.7784 25.4971 49.9335 25.503C49.4342 25.5065 49.1715 25.3612 48.9949 24.8669C48.7554 24.1967 48.4732 23.5415 48.1786 22.8576L48.1752 22.85C48.0511 22.5619 47.9247 22.2686 47.7985 21.9669L47.7629 22.0191Z"
      fill="currentColor"
    ></path>
    <path
      d="M88.8499 19.9569C88.7713 20.4541 88.6924 20.9512 88.6135 21.4483C88.3662 23.0057 88.1188 24.5632 87.8833 26.1225C87.8395 26.4127 87.7324 26.4846 87.4527 26.4745C86.0882 26.4252 84.7231 26.3866 83.3579 26.3668C83.0622 26.3624 82.9453 26.2539 82.8696 25.9825C81.5766 21.3453 80.2783 16.7094 78.9694 12.0766C78.8545 11.6698 78.9293 11.5346 79.3727 11.5451C80.4485 11.5705 81.5256 11.5714 82.6013 11.5439C82.9989 11.5337 83.1568 11.658 83.2477 12.0482C83.708 14.0253 84.1841 15.9988 84.6601 17.9723L84.6692 18.0095C84.8128 18.6048 84.9563 19.2001 85.0996 19.7955L85.1037 19.8124C85.1058 19.8208 85.1079 19.8292 85.1102 19.8376C85.1143 19.8524 85.1186 19.8672 85.1235 19.882C85.1352 19.9173 85.1499 19.9526 85.1706 19.9885C85.1955 20.032 85.2291 20.0763 85.2764 20.1221L85.3697 19.6617L85.3739 19.6406L85.4335 19.3477C85.5424 18.8126 85.6512 18.2775 85.7573 17.7418C85.8366 17.3407 85.9163 16.9397 85.996 16.5387L85.9976 16.5303C86.2948 15.0353 86.592 13.5403 86.8702 12.0419C86.9413 11.6595 87.0977 11.5473 87.4725 11.5563C88.4359 11.5795 89.4014 11.5933 90.3635 11.5517C90.8429 11.5309 90.9927 11.7114 91.0758 12.1499C91.4551 14.1538 91.8494 16.1548 92.2442 18.1582C92.3758 18.8262 92.5074 19.4944 92.6386 20.1631C92.7619 20.0917 92.7804 19.9799 92.7988 19.8692C92.8037 19.8397 92.8086 19.8101 92.8154 19.7815C92.9676 19.1468 93.1204 18.5122 93.2732 17.8776L93.2806 17.847L93.2879 17.8161C93.7443 15.9207 94.2007 14.0254 94.6413 12.1265C94.743 11.688 94.9175 11.5348 95.3812 11.5517C96.3526 11.5871 97.3261 11.5753 98.2987 11.5633L98.6097 11.5596C98.96 11.5554 99.065 11.6488 98.9627 12.0105C97.6188 16.7658 96.284 21.5238 94.9552 26.2834C94.8862 26.5303 94.8184 26.6654 94.516 26.6528C93.168 26.5969 91.8189 26.5594 90.4698 26.5362C90.189 26.5314 90.08 26.4446 90.038 26.169C89.7891 24.5352 89.5324 22.9026 89.2758 21.2699C89.1969 20.7687 89.1181 20.2674 89.0395 19.7661C88.8846 19.689 88.8874 19.7676 88.8902 19.8461C88.8921 19.8981 88.8939 19.9502 88.8499 19.9569Z"
      fill="currentColor"
    ></path>
    <path
      d="M14.7266 19.6405C14.7272 19.1358 14.7277 18.6311 14.7277 18.1264C14.7277 17.6109 14.7272 17.0953 14.7267 16.5798C14.7255 15.0622 14.7243 13.5447 14.734 12.0272C14.7361 11.6737 14.627 11.5513 14.2657 11.5572C13.1257 11.576 11.9846 11.584 10.8452 11.5541C10.3955 11.5423 10.2667 11.6834 10.2723 12.1257C10.2839 13.0298 10.2831 13.9339 10.2824 14.8381C10.2822 15.1059 10.282 15.3737 10.282 15.6416C10.2821 15.9264 10.2826 16.2112 10.2838 16.496C10.2844 16.6508 10.2853 16.8057 10.2864 16.9606L10.2876 17.1123C10.2885 17.211 10.2895 17.3097 10.2907 17.4083C10.2949 17.7746 10.1902 17.8743 9.8323 17.8575C9.20728 17.8283 8.57839 17.8234 7.95403 17.8588C7.55819 17.8813 7.47797 17.7432 7.48174 17.3745C7.49228 16.3779 7.49181 15.3812 7.49134 14.3845C7.49097 13.6043 7.49059 12.824 7.49549 12.0438C7.49756 11.7084 7.41959 11.5507 7.04136 11.557C5.86919 11.5766 4.69645 11.5738 3.52419 11.5582C3.17722 11.5536 3.08306 11.6957 3.08353 12.0151C3.08946 15.9852 3.0905 19.9554 3.08099 23.9255C3.08023 24.2299 3.1888 24.2984 3.47033 24.3024C4.69071 24.3199 5.91128 24.3478 7.13072 24.3964C7.44605 24.4088 7.5113 24.2977 7.49991 24.0145C7.49407 23.8681 7.4921 23.7216 7.49181 23.575C7.49172 23.4925 7.4921 23.4099 7.49257 23.3273L7.49332 23.2265V23.2206L7.49436 23.0827C7.49501 22.9848 7.4953 22.8869 7.49464 22.7891L7.49398 22.7098C7.49351 22.6729 7.49285 22.636 7.4921 22.5991L7.49125 22.5678C7.49097 22.5539 7.49068 22.5399 7.49021 22.526C7.48306 22.2819 7.55528 22.1842 7.8143 22.1893C8.52077 22.2032 9.2278 22.2046 9.93417 22.1887C10.2061 22.1827 10.3019 22.265 10.2914 22.5419C10.2822 22.7845 10.2846 23.0276 10.2871 23.2707C10.2881 23.3783 10.2891 23.4859 10.2891 23.5934C10.2892 23.6791 10.2887 23.7649 10.2869 23.8505C10.2861 23.8874 10.2851 23.9243 10.2839 23.9612C10.2826 24.0002 10.2811 24.0392 10.2792 24.0782C10.2634 24.3963 10.3711 24.4845 10.6845 24.488C11.8888 24.5011 13.0936 24.5256 14.2965 24.5832C14.6807 24.6015 14.7381 24.4713 14.7354 24.1295C14.7236 22.6332 14.7251 21.1369 14.7266 19.6405Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M76.0296 26.1576C77.4855 26.1931 78.9414 26.2288 80.3968 26.2802C80.7912 26.2942 80.8445 26.2087 80.7399 25.8406C79.4282 21.2254 78.1276 16.6069 76.8365 11.9859C76.7467 11.6649 76.6051 11.5523 76.271 11.5571C75.0345 11.5749 73.7971 11.5814 72.5608 11.5544C72.1515 11.5454 71.9788 11.6705 71.8649 12.07C70.5902 16.5456 69.3008 21.0171 67.9949 25.4837C67.876 25.8905 67.9602 25.9682 68.3541 25.975C69.8734 26.0013 71.3924 26.0402 72.9115 26.0792L76.0296 26.1576ZM74.5997 16.9156C74.5533 16.5423 74.5061 16.1633 74.3683 15.7875C74.3619 15.7943 74.3558 15.8006 74.3499 15.8065C74.3368 15.8196 74.3251 15.8305 74.3149 15.8399C74.2908 15.8622 74.2758 15.8761 74.2733 15.8921C74.1468 16.6705 74.021 17.4491 73.8952 18.2276C73.6748 19.5918 73.4544 20.9561 73.2305 22.3196C73.1909 22.5611 73.3039 22.5834 73.493 22.5813L73.7196 22.5785C74.189 22.5727 74.6586 22.5669 75.1272 22.585C75.4421 22.5972 75.4449 22.4728 75.4041 22.2151C75.3355 21.7812 75.2688 21.347 75.203 20.9127C75.1523 20.5783 75.1021 20.2437 75.0519 19.9091C74.9671 19.3444 74.8825 18.7796 74.7953 18.2153C74.7501 17.9232 74.7043 17.6312 74.6576 17.3393C74.635 17.1992 74.6174 17.0578 74.5997 16.9156Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.6343 24.6493C22.1375 24.6493 21.6407 24.6487 21.144 24.6481C19.7457 24.6465 18.3475 24.6449 16.9493 24.6561C16.5541 24.6593 16.5071 24.5592 16.6149 24.1896C17.7919 20.151 18.9548 16.1081 20.1059 12.062C20.2104 11.6944 20.3537 11.5442 20.7596 11.5536C21.9959 11.5824 23.2336 11.5786 24.4702 11.5553C24.849 11.5482 24.9962 11.6828 25.095 12.0375C26.2525 16.1979 27.4217 20.3552 28.6032 24.509C28.706 24.8704 28.6732 24.9712 28.2699 24.9562C26.886 24.905 25.5017 24.8694 24.1172 24.8338C23.7861 24.8253 23.4551 24.8168 23.124 24.808L22.6339 24.7949L22.6343 24.6493ZM22.7774 16.6323C22.7233 16.2939 22.6691 15.9555 22.6153 15.617L22.5429 15.6186L22.2846 17.2409C22.0145 18.9374 21.7445 20.634 21.4698 22.3297C21.429 22.582 21.5664 22.5812 21.7382 22.5802H21.7444C21.8195 22.5798 21.8947 22.5793 21.9698 22.5787L22.0899 22.5777C22.3366 22.5756 22.5833 22.5736 22.83 22.5747C23.014 22.5756 23.198 22.5784 23.3819 22.5842C23.6597 22.5932 23.692 22.4933 23.6514 22.2458C23.5453 21.5987 23.448 20.9502 23.3507 20.3016C23.2891 19.8903 23.2274 19.4789 23.1635 19.0679C23.1213 18.797 23.0787 18.5262 23.036 18.2554C22.9977 18.0136 22.9593 17.7717 22.9207 17.5299L22.7774 16.6323Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.7902 25.0418C33.0597 25.0472 33.3293 25.0526 33.5989 25.0577C34.1536 25.111 34.709 25.1031 35.2644 25.0951C35.4297 25.0928 35.5949 25.0904 35.7602 25.0897C35.8948 25.0891 36.0295 25.0896 36.164 25.0919C36.2528 25.0935 36.3174 25.0617 36.3089 24.9562C35.6116 24.6639 35.0815 24.1767 34.7866 23.4913C33.8631 21.3452 33.7959 19.1446 34.7215 17.01C35.6063 14.9697 38.1249 14.677 39.6039 16.3462C39.6148 16.3585 39.6247 16.3731 39.635 16.3882C39.677 16.45 39.7239 16.5192 39.8692 16.4715V15.2997C39.8693 14.5728 39.8694 13.8434 39.8693 13.113L39.8688 11.7565C39.8688 11.5271 39.6888 11.4724 39.5191 11.4224C38.9493 11.2549 38.3727 11.1439 37.7755 11.0965C35.2964 10.8999 33.1611 11.6623 31.6233 13.5991C28.945 16.9724 28.7327 20.7534 30.089 24.7172C30.1648 24.9393 30.2993 25 30.5177 25.0027C31.2753 25.0114 32.0327 25.0266 32.7902 25.0418Z"
      fill="currentColor"
    ></path>
    <path
      d="M20.5088 25.4567C22.4193 25.5097 24.3297 25.5667 26.2404 25.611C26.494 25.6168 26.6375 25.6581 26.7121 25.9442C26.9863 26.9962 27.2918 28.0401 27.5943 29.0846C27.6881 29.4081 27.6264 29.5605 27.2483 29.556C26.0599 29.5419 24.8711 29.5422 23.6828 29.5566C23.3594 29.5605 23.2282 29.4326 23.1686 29.1281C23.0582 28.5636 22.9059 28.0073 22.7863 27.4445C22.7353 27.2044 22.6317 27.1097 22.3689 27.1127C21.0841 27.1272 19.7991 27.1259 18.5142 27.1138C18.2525 27.1113 18.1488 27.2017 18.0991 27.4524C17.984 28.0329 17.8291 28.6056 17.7119 29.1859C17.657 29.4579 17.5205 29.5561 17.2491 29.5543C16.0446 29.5463 14.8398 29.5445 13.6353 29.5552C13.3073 29.558 13.1919 29.4503 13.2867 29.1261C13.6327 27.9443 13.9835 26.7636 14.3058 25.5754C14.3866 25.2774 14.5691 25.3168 14.7767 25.3169C16.6874 25.3188 18.5981 25.318 20.5088 25.318C20.5088 25.3643 20.5088 25.4105 20.5088 25.4567Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.9817 25.9004C34.442 25.9004 35.9024 25.9067 37.3627 25.8952C37.6618 25.8928 37.7785 25.9621 37.7713 26.2908C37.7486 27.3143 37.7532 28.3388 37.7689 29.3626C37.7736 29.6704 37.6726 29.8228 37.3683 29.9051C34.2054 30.761 30.3203 29.9545 28.3266 26.1455C28.0749 25.6645 28.0832 25.6652 28.6015 25.6679C30.0615 25.6756 31.5216 25.6706 32.9817 25.6706C32.9817 25.7472 32.9817 25.8237 32.9817 25.9004Z"
      fill="currentColor"
    ></path>
    <path
      d="M59.0856 26.5926C60.8183 26.5926 62.551 26.5894 64.2837 26.5944C64.8586 26.596 64.8657 26.6126 64.5728 27.1353C63.6075 28.8579 62.0955 29.8008 60.1692 30.0301C57.4195 30.3575 55.1233 29.4342 53.3078 27.3435C53.1642 27.1782 53.0164 26.9475 53.1402 26.7579C53.2951 26.5216 53.4412 26.3818 53.7594 26.3942C55.5231 26.4646 57.321 26.5461 59.0856 26.5926Z"
      fill="currentColor"
    ></path>
    <path
      d="M72.2532 26.7971C74.2921 26.8506 76.3309 26.9102 78.3701 26.9493C78.663 26.955 78.7934 27.0391 78.8622 27.3275C78.9993 27.9023 79.1662 28.4708 79.3445 29.0344C79.461 29.4026 79.398 29.5646 78.9679 29.5575C77.8118 29.5383 76.655 29.5378 75.4991 29.5586C75.1309 29.5653 74.9877 29.4222 74.9232 29.0807C74.8196 28.5311 74.6691 27.9905 74.5521 27.4433C74.501 27.2041 74.3957 27.1097 74.1333 27.1127C72.8486 27.1273 71.5636 27.1259 70.2789 27.1139C70.0193 27.1115 69.9115 27.1968 69.8614 27.4493C69.7463 28.0297 69.593 28.6024 69.4726 29.1818C69.4174 29.4474 69.2876 29.5567 69.0117 29.5547C67.7911 29.5457 66.5705 29.546 65.3499 29.5541C65.0238 29.5562 64.9624 29.4141 65.0457 29.1337C65.2598 28.4136 65.4802 27.6949 65.6701 26.9683C65.741 26.697 65.86 26.6244 66.1368 26.6333C68.1752 26.6981 70.2143 26.7443 72.2532 26.7971Z"
      fill="currentColor"
    ></path>
    <path
      d="M41.7204 35.8233C41.5828 36.2821 41.4208 36.7354 41.3147 37.2012C41.2092 37.6636 40.8654 37.5047 40.5907 37.5214C40.3422 37.5366 40.0937 37.5823 40.0101 37.207C39.8997 36.7107 39.7164 36.2304 39.4622 35.74C39.4622 35.9739 39.4615 36.2078 39.4623 36.4417C39.4644 37.0818 39.4548 37.7222 39.476 38.3616C39.4844 38.6151 39.412 38.6808 39.1581 38.6873C38.0627 38.7152 38.0629 38.7246 38.0629 37.6418C38.0629 36.3137 38.0723 34.9856 38.056 33.6576C38.0522 33.3492 38.1282 33.2478 38.4522 33.2452C39.7553 33.2347 39.7545 33.2234 40.1574 34.4661C40.3189 34.9642 40.4846 35.461 40.6828 36.0625C40.9696 35.1688 41.2325 34.3882 41.4663 33.599C41.5427 33.3408 41.6522 33.2226 41.9321 33.2494C42.3601 33.2903 42.9107 33.0768 43.1872 33.3364C43.4431 33.5765 43.2589 34.1244 43.2619 34.5362C43.2713 35.7842 43.2559 37.0325 43.2722 38.2803C43.2761 38.5836 43.213 38.7192 42.881 38.6861C42.5629 38.6545 42.2402 38.6703 41.9195 38.6652C41.7709 37.8675 41.8994 37.0624 41.8538 36.2621C41.8451 36.1096 41.905 35.9475 41.8005 35.8064C41.7948 35.7986 41.7738 35.7973 41.7618 35.8003C41.7469 35.8038 41.7341 35.8153 41.7204 35.8233Z"
      fill="currentColor"
    ></path>
    <path
      d="M3.17825 25.0622C3.80467 25.0622 4.43129 25.0722 5.05733 25.0576C5.33501 25.0511 5.41118 25.1567 5.40867 25.4231C5.39701 26.656 5.39643 27.889 5.408 29.1219C5.41118 29.4611 5.27465 29.5608 4.94703 29.5566C3.77449 29.5419 2.60157 29.544 1.42894 29.5556C1.12542 29.5585 0.996987 29.4707 1.00036 29.147C1.01386 27.8661 1.01299 26.5849 1.00007 25.3041C0.997374 25.0337 1.06843 24.9489 1.34814 24.9596C1.9574 24.9829 2.56811 24.9668 3.17825 24.9668C3.17825 24.9986 3.17825 25.0304 3.17825 25.0622Z"
      fill="currentColor"
    ></path>
    <path
      d="M10.3703 25.2542C10.9961 25.2542 11.622 25.2617 12.2477 25.2505C12.4989 25.2461 12.62 25.2976 12.616 25.591C12.5998 26.7747 12.6039 27.9588 12.613 29.1427C12.6152 29.4271 12.5168 29.5461 12.2229 29.544C11.003 29.5354 9.78307 29.5357 8.56319 29.5436C8.26025 29.5457 8.17656 29.3974 8.17723 29.1279C8.18022 27.912 8.18485 26.696 8.1675 25.4802C8.16325 25.18 8.28975 25.1455 8.5414 25.152C9.15067 25.1677 9.7606 25.1571 10.3703 25.1571C10.3703 25.1894 10.3703 25.2218 10.3703 25.2542Z"
      fill="currentColor"
    ></path>
    <path
      d="M73.2388 36.1934C73.2388 36.9094 73.2259 37.6257 73.2454 38.3412C73.2529 38.6166 73.1668 38.6834 72.8979 38.687C71.8059 38.7013 71.806 38.7111 71.806 37.604C71.806 36.2931 71.8182 34.9819 71.7977 33.6713C71.7923 33.3268 71.901 33.2445 72.231 33.2482C73.1372 33.2585 73.1373 33.2436 73.5021 34.0785C73.757 34.662 74.0123 35.2454 74.3772 35.8213C74.3772 35.136 74.4085 34.4489 74.3661 33.7662C74.3388 33.3274 74.485 33.2326 74.8992 33.246C75.8206 33.276 75.8214 33.2539 75.8214 34.1814C75.8214 35.5403 75.8126 36.8994 75.828 38.2581C75.8316 38.5703 75.7757 38.6596 75.4241 38.7006C74.6844 38.7865 74.283 38.5457 74.0692 37.8224C73.8998 37.2493 73.5946 36.716 73.3498 36.1651C73.3127 36.1745 73.2758 36.1839 73.2388 36.1934Z"
      fill="currentColor"
    ></path>
    <path
      d="M89.2462 35.9804C89.2462 35.4359 89.2375 34.8913 89.2484 34.3471C89.2618 33.6764 89.5583 33.3348 90.2338 33.2825C90.7929 33.2391 91.3579 33.2448 91.9191 33.2635C92.7941 33.2928 93.0968 33.6169 93.1051 34.4778C93.1114 35.1401 93.1114 35.1401 92.4521 35.1401C92.3397 35.1401 92.2258 35.1288 92.115 35.1421C91.7187 35.1895 91.4598 35.1114 91.5471 34.6219C91.594 34.3589 91.4527 34.2594 91.1829 34.2567C90.9001 34.2538 90.8245 34.3723 90.8271 34.631C90.8363 35.5276 90.8361 36.4244 90.8276 37.3211C90.8252 37.5784 90.9036 37.7049 91.1832 37.7037C91.4602 37.7026 91.5826 37.5747 91.5338 37.3218C91.4842 37.064 91.7531 36.6972 91.1991 36.5889C90.9569 36.5415 91.1148 36.105 91.1033 35.8471C91.0935 35.628 91.2947 35.6782 91.4285 35.6768C91.8943 35.6719 92.3603 35.6818 92.826 35.6719C93.0284 35.6676 93.112 35.7301 93.1079 35.9432C93.0961 36.5515 93.1183 37.1607 93.095 37.7683C93.0749 38.2937 92.6389 38.6858 92.1111 38.6901C91.5011 38.695 90.891 38.6924 90.2809 38.6909C89.6971 38.6895 89.2769 38.3055 89.2536 37.7095C89.2311 37.1339 89.2487 36.5568 89.2487 35.9804C89.2479 35.9804 89.247 35.9804 89.2462 35.9804Z"
      fill="currentColor"
    ></path>
    <path
      d="M3.23657 35.9573C3.2359 35.4129 3.22838 34.8684 3.23792 34.3243C3.24901 33.6952 3.52438 33.3538 4.14261 33.2842C4.81281 33.2087 5.49303 33.2054 6.16275 33.2822C6.93149 33.3702 7.46333 34.3248 7.05568 35.0015C6.83218 35.3725 6.2879 35.0799 5.89249 35.1355C5.77506 35.1521 5.58174 35.2285 5.53613 35.0149C5.50991 34.892 5.51627 34.7591 5.52678 34.6322C5.54848 34.3699 5.45398 34.2576 5.17293 34.2598C4.90016 34.2619 4.80172 34.3637 4.80403 34.6285C4.81175 35.525 4.81165 36.4216 4.80403 37.3182C4.80182 37.5771 4.88936 37.7 5.1655 37.6997C5.43219 37.6994 5.56303 37.6023 5.52341 37.331C5.48195 37.0471 5.70438 36.6748 5.15017 36.5723C4.97845 36.5406 5.07882 36.0759 5.09319 35.813C5.10495 35.5979 5.31331 35.6776 5.44078 35.675C5.89037 35.6659 6.34045 35.6806 6.78985 35.668C7.02029 35.6615 7.09954 35.7434 7.09415 35.9736C7.08065 36.5497 7.10485 37.1269 7.08286 37.7024C7.05837 38.3427 6.62826 38.7013 5.9731 38.6878C5.42747 38.6765 4.88117 38.6763 4.33554 38.6868C3.67922 38.6994 3.25846 38.3342 3.24072 37.6863C3.22481 37.1103 3.23725 36.5336 3.23657 35.9573Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.5024 38.6794C24.6423 38.6804 24.7847 38.6815 24.9306 38.6815C24.8275 38.2922 24.7262 37.9065 24.6256 37.5236C24.3712 36.5548 24.1214 35.6035 23.8573 34.6562C23.819 34.5185 23.7954 34.3635 23.7719 34.2082C23.7168 33.8459 23.6616 33.482 23.4173 33.3324C23.163 33.1767 22.7958 33.204 22.4287 33.2313C22.2684 33.2433 22.1082 33.2552 21.9574 33.2519C21.9454 33.2516 21.9333 33.252 21.9212 33.2523C21.901 33.2529 21.8809 33.2535 21.8611 33.2513C21.6705 33.2298 21.571 33.3094 21.5207 33.4995C21.1709 34.8242 20.817 36.1478 20.458 37.4902C20.3524 37.885 20.2464 38.2813 20.1399 38.6799C20.2658 38.6799 20.3881 38.6772 20.5078 38.6747C20.7735 38.6689 21.026 38.6635 21.2756 38.6878C21.6079 38.7202 21.7507 38.5918 21.7623 38.2827C21.7743 37.9594 21.9311 37.828 22.2544 37.8705C22.3965 37.8892 22.5461 37.8928 22.687 37.8701C23.0874 37.8053 23.2869 37.9554 23.3047 38.3673C23.3051 38.3774 23.3054 38.3878 23.3058 38.3983C23.3103 38.5354 23.3155 38.6949 23.5553 38.686C23.8663 38.6745 24.1777 38.6769 24.5024 38.6794ZM22.6343 35.3247C22.5933 35.1822 22.5446 35.0133 22.4725 35.0956C22.4643 35.1549 22.4578 35.2131 22.4516 35.2697C22.4456 35.3234 22.4399 35.3758 22.4328 35.4263C22.4074 35.5279 22.3817 35.6294 22.356 35.7309C22.2882 35.9984 22.2205 36.266 22.1572 36.5346C22.1557 36.541 22.1541 36.5475 22.1525 36.5541C22.1283 36.6534 22.0978 36.7786 22.2645 36.7851C22.3159 36.7871 22.3694 36.7935 22.4233 36.8C22.5834 36.8192 22.7469 36.8388 22.8682 36.744C22.9653 36.6681 22.9189 36.5428 22.8744 36.4224C22.8591 36.3813 22.8442 36.3408 22.8352 36.303C22.8013 36.1609 22.7773 36.0191 22.7533 35.8773C22.7279 35.7269 22.7025 35.5767 22.6654 35.4263C22.6553 35.3976 22.6451 35.362 22.6343 35.3247Z"
      fill="currentColor"
    ></path>
    <path
      d="M47.2138 26.2616C48.6685 26.2616 50.092 26.2625 51.5155 26.2603C51.687 26.26 51.7688 26.3501 51.8336 26.4966C52.2215 27.3726 52.6096 28.2487 53.0119 29.1182C53.1588 29.4357 53.0853 29.554 52.7343 29.5519C51.468 29.5444 50.2015 29.5457 48.9352 29.552C48.7013 29.5532 48.5457 29.4923 48.4509 29.2574C48.0447 28.2528 47.6249 27.2537 47.2138 26.2616Z"
      fill="currentColor"
    ></path>
    <path
      d="M41.659 26.06C42.2358 26.06 42.813 26.0707 43.3893 26.0554C43.6705 26.0479 43.7803 26.1207 43.7727 26.4291C43.7505 27.3233 43.7552 28.2185 43.7698 29.113C43.7752 29.4431 43.6615 29.5623 43.3236 29.557C42.2499 29.5404 41.1755 29.5403 40.1018 29.5571C39.7644 29.5624 39.65 29.4456 39.655 29.1148C39.6693 28.1723 39.6675 27.2294 39.655 26.2869C39.6517 26.0393 39.7159 25.9569 39.9766 25.9672C40.5366 25.9893 41.0982 25.974 41.659 25.974C41.659 26.0027 41.659 26.0313 41.659 26.06Z"
      fill="currentColor"
    ></path>
    <path
      d="M83.3078 27.0351C83.6977 27.0351 84.7101 27.0676 85.385 27.1156C85.5921 27.1141 85.7159 27.1674 85.6709 27.427C85.5646 28.0404 85.4774 28.6572 85.3771 29.2717C85.3433 29.4796 85.2081 29.5544 84.9991 29.5532C83.9715 29.5476 82.9438 29.5463 81.9163 29.5541C81.6844 29.5558 81.5679 29.4688 81.5083 29.2451C81.3398 28.6124 81.1633 27.9817 80.9725 27.3555C80.8902 27.0855 80.9782 27.0256 81.2374 27.0306C81.9273 27.044 82.6176 27.0351 83.3078 27.0351C83.3078 27.0007 83.3079 27.0695 83.3078 27.0351Z"
      fill="currentColor"
    ></path>
    <path
      d="M90.3533 27.3237C91.0429 27.3237 91.7326 27.3268 92.4222 27.3218C92.6453 27.3202 92.7415 27.3601 92.6579 27.6232C92.4887 28.155 92.3509 28.6973 92.2137 29.2388C92.1503 29.489 92.0024 29.5564 91.7587 29.5541C90.7641 29.5445 89.7692 29.5457 88.7745 29.5532C88.533 29.5551 88.3821 29.5004 88.3429 29.2286C88.2567 28.6291 88.1558 28.0315 88.0459 27.4359C87.993 27.1496 88.1797 27.2102 88.333 27.2101C89.0065 27.2096 89.68 27.2099 90.3534 27.2099C90.3533 27.2478 90.3533 27.2857 90.3533 27.3237Z"
      fill="currentColor"
    ></path>
    <path
      d="M56.7545 35.9283C56.7545 35.1456 56.7637 34.3627 56.7492 33.5803C56.7445 33.327 56.8297 33.262 57.0765 33.2519C58.3207 33.2009 58.3203 33.1936 58.3203 34.441C58.3203 35.7188 58.3136 36.9968 58.3256 38.2746C58.3282 38.5559 58.3021 38.6922 57.9517 38.6906C56.7546 38.6854 56.7545 38.7024 56.7545 37.5097C56.7544 36.9826 56.7544 36.4555 56.7545 35.9283Z"
      fill="currentColor"
    ></path>
    <path
      d="M39.7731 23.7901C39.8383 23.8668 39.8549 23.8772 39.8559 23.8889C39.963 25.2383 39.9629 25.2378 38.6467 25.2151C38.4154 25.2111 38.1839 25.2145 37.9473 25.1586C38.2621 24.9058 38.6401 24.8275 38.9483 24.6079C39.262 24.3843 39.5212 24.1075 39.7731 23.7901Z"
      fill="currentColor"
    ></path>
    <path
      d="M41.7204 35.8233C41.703 35.6957 41.6953 35.5718 41.9195 35.4656C41.9195 36.559 41.9195 37.6121 41.9195 38.6652C41.7266 38.5368 41.8389 38.3443 41.8349 38.1874C41.8188 37.5634 41.8335 36.9387 41.8248 36.3145C41.8224 36.1482 41.8919 35.9575 41.7204 35.8233Z"
      fill="currentColor"
    ></path>
    <path
      d="M33.5989 25.0577C34.3393 24.9743 35.0806 25.0755 35.821 25.0457C35.9854 25.039 36.1718 25.1209 36.3089 24.9562C36.4284 24.9862 36.5477 25.0161 36.6672 25.0461C35.638 25.1404 34.6179 25.179 33.5989 25.0577Z"
      fill="currentColor"
    ></path>
    <path
      d="M88.8499 19.9569C88.8499 19.7892 88.8499 19.6215 88.8499 19.4406C89.0918 19.4867 89.0655 19.6264 89.0395 19.7661C88.9763 19.8298 88.913 19.8934 88.8499 19.9569Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-IM"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50 44C60.4934 44 69 35.4934 69 25C69 14.5066 60.4934 6 50 6C39.5066 6 31 14.5066 31 25C31 35.4934 39.5066 44 50 44ZM36.0565 17.8302C35.2438 17.8302 34.5849 18.4988 34.5849 19.3236V30.2757C34.5849 31.1005 35.2438 31.7691 36.0565 31.7691C36.8692 31.7691 37.5281 31.1005 37.5281 30.2757V19.3236C37.5281 18.4988 36.8692 17.8302 36.0565 17.8302ZM43.4144 17.8302C42.6016 17.8302 41.9428 18.4988 41.9428 19.3236V30.2757C41.9428 31.1005 42.6016 31.7691 43.4144 31.7691C44.2271 31.7691 44.8859 31.1005 44.8859 30.2757V23.004L52.5702 31.3386C53.1085 31.9226 54.0047 31.972 54.6022 31.4507C55.2364 30.8974 55.2887 29.9194 54.7174 29.2997L44.6472 18.3771C44.492 18.2088 44.3072 18.0849 44.1083 18.0063C43.9016 17.8939 43.6653 17.8302 43.4144 17.8302ZM52.9161 18.2651C52.282 18.8184 52.2297 19.7963 52.801 20.4161L62.8712 31.3386C63.4096 31.9226 64.3058 31.972 64.9033 31.4507C65.5374 30.8974 65.5898 29.9194 65.0184 29.2997L54.9482 18.3771C54.4099 17.7932 53.5137 17.7438 52.9161 18.2651Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-JDB"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M42.384 8H32.5708L35.9396 12.7454L31.2521 31.8799C31.1056 32.3391 30.579 33.9005 29.0557 35.2476C27.5325 36.5946 25.1011 35.9109 24.0758 35.4007C23.3429 36.4722 21 39.8399 21 39.8399C21 39.8399 24.8837 42.11 30.0809 40.2991C33.1561 39.2276 35.646 35.4007 36.2325 32.7984L42.384 8Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.8229 8.15308L72.702 8C74.7525 8 79 9.98999 79 14.5823C79 18.103 77.0959 20.2461 76.0707 20.8584L76.0773 20.8661C76.5202 21.3804 77.5353 22.559 77.5353 25.9099C77.5353 30.043 72.9949 33.8699 68.4544 33.8699H40.4794L45.8987 12.8984L42.8229 8.15308ZM50.8785 12.7454L46.7775 28.8184L46.8117 28.8214C48.5785 28.9753 51.9227 29.2667 54.8331 27.5938C57.7624 25.9099 60.6917 21.7769 60.5453 17.6438C60.3988 13.5107 57.1766 12.7454 55.2725 12.7454H50.8785ZM70.4134 23.3076H63.914C63.3281 25.7568 61.2776 28.0529 60.2523 28.9714C62.216 28.9714 65.4706 28.8952 67.3863 28.8503L67.3873 28.8503C68.186 28.8316 68.7517 28.8183 68.8938 28.8183C70.0656 28.8184 72.8582 27.8999 72.702 25.4507C72.5848 23.6138 71.2373 23.3077 70.4134 23.3076ZM65.0857 18.4092H70.9993C71.9696 18.4092 74.0202 17.6438 74.0202 15.5007C74.0202 13.3577 72.7477 12.7454 71.3838 12.7454C71.1506 12.7454 70.0853 12.7454 68.7325 12.7454C67.2818 12.7454 65.5005 12.7454 64.0605 12.7454C64.6463 13.8169 65.2322 16.2661 65.0857 18.4092Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-JILI"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25.2238 34.1448V15.0757C25.2238 14.5836 24.7361 14.4605 24.2974 14.4605C23.7827 14.4605 22.7534 14.4605 22.7534 13.5378C22.7534 12.3076 23.371 12.3076 23.6798 12.3076H34.7968C35.1056 12.3076 35.4145 12.6151 35.4145 13.5378C35.4144 14.153 34.7968 14.4605 34.488 14.4605C33.5616 14.4605 33.5616 15.0757 33.5616 15.0757V32.2994C33.5616 34.1448 32.3264 35.3751 30.4735 36.6053C28.1299 38.1615 25.3268 38.1432 23.9886 37.8356V35.3751C23.9886 35.3751 25.2238 34.7599 25.2238 34.1448Z"
      fill="currentColor"
    ></path>
    <path
      d="M16.8861 35.0675C18.1213 36.9129 21.2093 37.8356 22.4446 37.8356V35.6826C21.3123 35.7852 21.0089 35.1341 21.2093 35.0675C23.9886 34.1448 24.2974 31.9918 23.9886 30.7616C23.7639 29.8664 22.1358 26.7632 18.7389 27.9935C15.6132 29.1255 15.4126 32.866 16.8861 35.0675Z"
      fill="currentColor"
    ></path>
    <path
      d="M37.2673 13.2303C37.2673 12.5508 37.8203 12 38.5025 12H49.0019C49.6841 12 50.2372 12.5508 50.2372 13.2303V13.3926C50.2372 13.8586 49.9728 14.2846 49.5544 14.493L48.3843 15.0757V34.7599L49.3926 35.0947C49.897 35.2621 50.2372 35.7323 50.2372 36.2618V36.6053C50.2372 37.2848 49.6841 37.8356 49.0019 37.8356H38.5025C37.8203 37.8356 37.2673 37.2848 37.2673 36.6053V36.2618C37.2673 35.7323 37.6075 35.2621 38.1119 35.0947L39.1201 34.7599V15.0757L37.9501 14.493C37.5316 14.2846 37.2673 13.8586 37.2673 13.3926V13.2303Z"
      fill="currentColor"
    ></path>
    <path
      d="M71.8536 13.2303C71.8536 12.5508 72.4067 12 73.0889 12H83.5883C84.2705 12 84.8235 12.5508 84.8235 13.2303V13.3926C84.8235 13.8586 84.5592 14.2846 84.1407 14.493L82.9707 15.0757V34.7599L83.9789 35.0947C84.4833 35.2621 84.8235 35.7323 84.8235 36.2618V36.6053C84.8235 37.2848 84.2705 37.8356 83.5883 37.8356H73.0889C72.4067 37.8356 71.8536 37.2848 71.8536 36.6053V36.2618C71.8536 35.7323 72.1939 35.2621 72.6983 35.0947L73.7065 34.7599V15.0757L72.5365 14.493C72.118 14.2846 71.8536 13.8586 71.8536 13.3926V13.2303Z"
      fill="currentColor"
    ></path>
    <path
      d="M52.09 13.2303C52.09 12.5508 52.643 12 53.3252 12H63.8247C64.5069 12 65.0599 12.5508 65.0599 13.2303V13.3926C65.0599 13.8586 64.7956 14.2846 64.3771 14.493L63.2071 15.0757V37.8356H53.3252C52.643 37.8356 52.09 37.2848 52.09 36.6053V36.2618C52.09 35.7323 52.4302 35.2621 52.9346 35.0947L53.9429 34.7599V15.0757L52.7728 14.493C52.3544 14.2846 52.09 13.8586 52.09 13.3926V13.2303Z"
      fill="currentColor"
    ></path>
    <path
      d="M67.2215 32.607C68.2297 31.2013 68.8428 29.6645 69.1471 28.767C69.2998 28.3165 69.7181 27.9935 70.1956 27.9935C70.7702 27.9935 71.236 28.4574 71.236 29.0298V37.8356H63.8247V35.3751C63.8247 35.3751 65.6775 34.7599 67.2215 32.607Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-JOKER"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.2252 14.0019C24.5543 13.9231 21.4628 16.3648 20.2814 17.7431C20.254 17.7751 20.2125 17.8179 20.1581 17.8739L20.158 17.8741L20.1579 17.8742L20.1577 17.8744L20.1577 17.8744L20.1576 17.8744L20.1575 17.8746L20.1574 17.8747L20.1568 17.8753C20.1301 17.9028 20.1003 17.9336 20.0676 17.9677L21.069 14.8879H12.2082C11.5951 16.9544 10.4917 20.6866 9.68739 23.4422L7.87627 20.1059C6.89174 20.9264 4.80452 22.6854 4.33195 23.158C4.23896 23.251 4.12645 23.3537 4.00288 23.4664C3.34144 24.07 2.36291 24.963 2.36288 26.2101C2.36286 26.8992 2.85515 27.5884 3.05207 27.6869L2.73525 28.4789L2.55979 28.4745L0 36.2523C0.88608 36.2523 7.08864 36.3508 7.08864 36.3508C7.08864 36.3508 13.3897 36.3508 15.851 30.9358L16.1202 30.1077C16.908 33.3206 19.4031 34.8501 20.0448 35.2435L20.0845 35.2679C21.3644 36.0555 29.4375 38.2215 34.754 32.6096C34.8097 32.5509 34.8646 32.492 34.9188 32.433L33.7695 36.2523H43.1226L44.5994 31.8219L46.8638 36.2523H82.2086L83.9807 30.542H86.3436L87.525 36.2523H96.7796C96.6626 35.638 96.496 34.7952 96.3215 33.9121C95.9084 31.8229 95.4508 29.5079 95.4998 29.459C95.5369 29.4219 95.5975 29.3657 95.6776 29.2916L95.6776 29.2915C96.6597 28.382 100.567 24.7632 99.9302 20.3028C99.3788 16.4434 95.7951 14.8879 93.8261 14.9863H52.5741L48.8329 18.4322L50.0143 14.9863H40.169L38.6578 20.0081C38.6372 19.9032 38.6157 19.8045 38.5937 19.7122C38.1671 17.8416 35.8961 14.0806 30.2252 14.0019ZM84.4732 24.0439L84.473 24.0445H91.3647C91.9786 24.0445 92.905 23.357 93.1 22.4274C92.9047 23.3567 91.9786 24.0439 91.3648 24.0439H84.4732ZM76.1045 22.8625L72.8555 25.6192L74.4308 28.5728L77.7782 25.6192L76.1045 22.8625ZM55.3308 23.0595C53.7525 23.0596 53.493 24.1096 53.5587 24.7331C51.5896 24.3392 51.3411 27.0507 52.6726 27.2929C53.1813 27.3855 53.4407 27.2142 53.5658 27.1317C53.614 27.0998 53.6423 27.0811 53.6571 27.096C53.8039 27.2428 53.2961 27.8838 52.968 28.0807V28.2774H55.0355V28.0807C54.5432 27.4571 54.5687 27.0595 54.6417 27.096C55.9216 27.7368 57.0046 26.8006 57.103 25.8162C57.1934 24.9129 56.5451 24.7332 56.1185 24.7332C56.5123 24.2081 56.6107 23.0594 55.3308 23.0595ZM27.6654 24.2408C27.7967 23.9454 28.2758 23.3744 29.1422 23.4532C30.2252 23.5516 30.3721 24.98 29.7329 25.6192C29.2604 26.0918 27.3701 27.6539 26.484 28.3759C26.484 28.3759 25.2264 26.4737 25.0072 25.8161C24.788 25.1585 24.7709 24.2014 25.7948 23.6501C26.8187 23.0988 27.567 23.7486 27.6654 24.2408ZM8.66435 24.6347C8.55944 24.4948 8.36655 24.2139 8.14427 23.8901L8.14424 23.8901L8.14423 23.8901L8.14421 23.8901C7.86587 23.4847 7.54147 23.0123 7.28603 22.6656C7.19646 22.7328 7.00606 22.8385 6.75815 22.9762C5.91615 23.444 4.41065 24.2803 3.93813 25.2254C3.24901 26.6037 4.92313 27.096 5.41544 27.1944C5.54521 27.2204 5.08726 27.7852 4.72627 27.9821V28.2774H6.89177L6.89219 27.9821C6.89219 27.9821 6.30102 27.5883 6.3995 27.2929C6.41055 27.2598 6.58682 27.2532 6.81945 27.2446H6.81948H6.81949H6.8195C7.16721 27.2316 7.64079 27.214 7.87673 27.096C9.25508 26.4068 9.05817 25.1597 8.66435 24.6347ZM29.8153 15.5791C25.204 15.5792 22.3076 17.5992 21.2954 18.7775C21.2678 18.8095 21.2202 18.8554 21.1551 18.918C20.708 19.3482 19.4383 20.5699 18.2139 23.5522C15.3469 30.5353 19.8705 33.3128 20.9693 33.9875L20.9705 33.9883C22.0672 34.6616 29.3326 36.0961 33.671 31.5269C37.5876 27.4021 37.6652 22.2815 37.2154 20.4018C36.8498 18.8026 34.9509 15.5791 29.8153 15.5791ZM28.8468 19.9095C25.6176 19.752 24.1539 22.7318 23.8257 24.2414C23.3334 26.2761 22.843 30.234 26.1886 30.3455C29.1422 30.444 30.6846 27.5888 31.0128 26.3089C31.6363 24.1758 32.0761 20.067 28.8468 19.9095ZM47.6514 16.4636H41.6458L35.6401 34.6775H41.9411L44.304 27.4904L47.553 34.6775H54.5432L50.605 26.5058L60.7457 16.3651H53.4602L45.2885 23.8476L47.6514 16.4636ZM18.903 16.562H13.1394C12.7589 17.8347 11.9026 20.3856 11.0876 22.8133C10.2885 25.1939 9.52908 27.4561 9.29694 28.2789C8.82804 29.9409 7.76186 30.2456 7.28738 30.1902L3.34741 30.1071L1.96906 34.5944C2.72264 34.5944 7.60391 34.6775 7.60391 34.6775C7.60391 34.6775 12.1098 34.9728 14.4653 30.1071L18.903 16.562ZM81.224 16.4636L75.2184 34.6775H81.1256L82.9962 29.0656H87.4266L88.608 34.6775H94.909L93.6291 28.7703C95.1716 27.8185 97.9581 24.9851 98.158 21.2878C98.3549 17.645 95.2372 16.5292 93.826 16.4636L81.224 16.4636ZM76.3013 21.2878L78.9596 16.4636C75.6122 16.4636 67.3414 16.5176 65.9637 16.562C62.9117 16.6605 60.4503 19.1218 58.8751 22.1739C57.2998 25.2259 56.4138 28.7703 56.5122 31.4285C56.591 33.5551 58.4485 34.6118 59.3674 34.8744H71.9694L74.7261 29.7548C74.1788 29.7548 73.2824 29.7622 72.2179 29.7711C68.4943 29.802 62.7132 29.85 62.6163 29.6563C62.2225 28.8687 62.5179 27.7857 62.8132 27.7857L70.9849 27.7857L73.5446 23.06C73.0194 23.06 72.0517 23.0677 70.9315 23.0767H70.9314C68.062 23.0997 64.1916 23.1308 64.1916 23.06C64.1916 22.1148 65.0777 21.2878 65.4715 21.2878H76.3013Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M84.4722 24.0444L85.4567 21.1892L92.1515 21.2877C92.6438 21.2877 93.1361 21.583 93.1361 22.0753C93.1361 23.178 92.0531 24.0444 91.3639 24.0444H84.4722Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-Lottery"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 220 160"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M110 130.476C137.877 130.476 160.476 107.877 160.476 80C160.476 52.1228 137.877 29.5238 110 29.5238C82.1228 29.5238 59.5238 52.1228 59.5238 80C59.5238 107.877 82.1228 130.476 110 130.476ZM110 133C139.271 133 163 109.271 163 80C163 50.7289 139.271 27 110 27C80.7289 27 57 50.7289 57 80C57 109.271 80.7289 133 110 133Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M76.6496 121.194C83.9231 111.56 96.1469 107.762 110 107.762C123.853 107.762 136.077 111.56 143.35 121.194C154.933 111.806 162.477 97.6313 162.974 81.6808C162.192 82.2271 161.351 82.5241 160.476 82.5241C156.295 82.5241 152.905 75.7443 152.905 67.3811C152.905 61.9503 154.334 57.1872 156.482 54.5147C147.471 38.1151 130.033 27 110 27C89.9666 27 72.5292 38.1151 63.5184 54.5147C65.6658 57.1872 67.0953 61.9503 67.0953 67.3811C67.0953 75.7443 63.7054 82.5241 59.5239 82.5241C58.6487 82.5241 57.8082 82.2271 57.0262 81.6808C57.523 97.6313 65.0675 111.806 76.6496 121.194ZM150.381 66.1192C150.381 86.3303 132.302 102.715 110 102.715C87.6982 102.715 69.6191 86.3303 69.6191 66.1192C69.6191 45.9081 87.6982 29.5238 110 29.5238C132.302 29.5238 150.381 45.9081 150.381 66.1192Z"
      fill="currentColor"
    ></path>
    <path
      d="M109.986 92.619C105.583 92.619 101.666 91.9593 98.2355 90.6398C94.8238 89.3027 92.1459 87.4819 90.2018 85.1772C88.2578 82.8725 87.2857 80.2599 87.2857 77.3394C87.2857 75.0875 87.8384 73.0203 88.9439 71.1379C90.0684 69.2378 91.5932 67.6632 93.5182 66.4141C95.4432 65.1474 97.597 64.3381 99.9794 63.9863V63.6168C96.8536 63.0363 94.3187 61.6376 92.3746 59.4209C90.4305 57.1866 89.4585 54.5916 89.4585 51.6359C89.4585 48.8386 90.3448 46.3492 92.1173 44.1677C93.8899 41.9685 96.32 40.2444 99.4076 38.9953C102.514 37.7286 106.04 37.0952 109.986 37.0952C113.931 37.0952 117.448 37.7286 120.535 38.9953C123.642 40.262 126.082 41.9949 127.854 44.1941C129.627 46.3756 130.522 48.8562 130.541 51.6359C130.522 54.6092 129.531 57.2041 127.568 59.4209C125.605 61.6376 123.089 63.0363 120.021 63.6168V63.9863C122.365 64.3381 124.49 65.1474 126.396 66.4141C128.321 67.6632 129.846 69.2378 130.97 71.1379C132.114 73.0203 132.695 75.0875 132.714 77.3394C132.695 80.2599 131.714 82.8725 129.77 85.1772C127.825 87.4819 125.138 89.3027 121.707 90.6398C118.296 91.9593 114.388 92.619 109.986 92.619ZM109.986 84.2271C111.949 84.2271 113.664 83.9017 115.132 83.2507C116.599 82.5822 117.743 81.6673 118.563 80.5062C119.401 79.3275 119.82 77.9728 119.82 76.4422C119.82 74.8764 119.392 73.4953 118.534 72.299C117.676 71.0851 116.514 70.1351 115.046 69.4489C113.578 68.7452 111.892 68.3934 109.986 68.3934C108.099 68.3934 106.412 68.7452 104.925 69.4489C103.439 70.1351 102.267 71.0851 101.409 72.299C100.57 73.4953 100.151 74.8764 100.151 76.4422C100.151 77.9728 100.561 79.3275 101.38 80.5062C102.2 81.6673 103.353 82.5822 104.84 83.2507C106.326 83.9017 108.042 84.2271 109.986 84.2271ZM109.986 60.0806C111.625 60.0806 113.083 59.7727 114.36 59.157C115.637 58.5412 116.638 57.688 117.362 56.5972C118.086 55.5064 118.448 54.2485 118.448 52.8235C118.448 51.416 118.086 50.1845 117.362 49.1289C116.638 48.0557 115.646 47.2201 114.388 46.6219C113.131 46.0061 111.663 45.6983 109.986 45.6983C108.328 45.6983 106.86 46.0061 105.583 46.6219C104.306 47.2201 103.305 48.0557 102.581 49.1289C101.876 50.1845 101.523 51.416 101.523 52.8235C101.523 54.2485 101.885 55.5064 102.61 56.5972C103.334 57.688 104.335 58.5412 105.612 59.157C106.889 59.7727 108.347 60.0806 109.986 60.0806Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-MG"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50 45C61.0457 45 70 36.0457 70 25C70 13.9543 61.0457 5 50 5C38.9543 5 30 13.9543 30 25C30 27.0918 30.3211 29.1085 30.9168 31.0037C30.9236 30.9921 30.9307 30.9808 30.938 30.9698C33.2837 28.1303 37.2986 22.4097 38.7158 19.8587C40.5677 16.5254 42.4195 12.5748 43.1602 10.9698C43.4072 10.476 44.1973 9.19195 45.3825 9.48825C46.5041 9.76866 46.4979 11.322 46.494 12.2924C46.4938 12.3473 46.4936 12.4004 46.4936 12.4513C46.4936 13.8504 46.4497 15.5277 46.4026 17.3261C46.2128 24.5723 45.9716 33.7832 48.3454 34.6735C49.8962 35.2552 55.0108 26.1548 57.2331 19.1178C57.2534 19.0568 57.2735 18.9959 57.2935 18.9351C57.6388 17.8882 57.966 16.8957 59.0862 16.8957C60.0458 16.8957 60.1791 17.8669 60.3916 19.4162C60.4416 19.7803 60.4959 20.1764 60.5664 20.5993C60.5913 20.7488 60.6179 20.9133 60.6466 21.0911C61.0448 23.5555 61.8521 28.5514 64.2701 30.9696C65.5794 32.279 65.7516 33.5622 62.7886 31.34C62.2948 30.9696 60.5664 29.4882 59.8257 26.5252C59.0849 23.5622 58.4936 23.9324 58.3454 24.6733C57.9751 26.5252 52.7899 38.0069 48.7158 38.0069C42.888 38.0069 43.2868 28.384 43.4794 23.7355C43.5072 23.0664 43.5306 22.5004 43.5306 22.0809C43.5306 18.7476 41.6788 22.0809 40.5677 24.3032C40.4276 24.5833 40.2358 24.9794 40.0038 25.4587C38.5045 28.556 35.323 35.1283 33.5286 36.3475C37.1365 41.5746 43.1682 45 50 45Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-MG_Fish"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50 45C61.0457 45 70 36.0457 70 25C70 13.9543 61.0457 5 50 5C38.9543 5 30 13.9543 30 25C30 27.0918 30.3211 29.1085 30.9168 31.0037C30.9236 30.9921 30.9307 30.9808 30.938 30.9698C33.2837 28.1303 37.2986 22.4097 38.7158 19.8587C40.5677 16.5254 42.4195 12.5748 43.1602 10.9698C43.4072 10.476 44.1973 9.19195 45.3825 9.48825C46.5041 9.76866 46.4979 11.322 46.494 12.2924C46.4938 12.3473 46.4936 12.4004 46.4936 12.4513C46.4936 13.8504 46.4497 15.5277 46.4026 17.3261C46.2128 24.5723 45.9716 33.7832 48.3454 34.6735C49.8962 35.2552 55.0108 26.1548 57.2331 19.1178C57.2534 19.0568 57.2735 18.9959 57.2935 18.9351C57.6388 17.8882 57.966 16.8957 59.0862 16.8957C60.0458 16.8957 60.1791 17.8669 60.3916 19.4162C60.4416 19.7803 60.4959 20.1764 60.5664 20.5993C60.5913 20.7488 60.6179 20.9133 60.6466 21.0911C61.0448 23.5555 61.8521 28.5514 64.2701 30.9696C65.5794 32.279 65.7516 33.5622 62.7886 31.34C62.2948 30.9696 60.5664 29.4882 59.8257 26.5252C59.0849 23.5622 58.4936 23.9324 58.3454 24.6733C57.9751 26.5252 52.7899 38.0069 48.7158 38.0069C42.888 38.0069 43.2868 28.384 43.4794 23.7355C43.5072 23.0664 43.5306 22.5004 43.5306 22.0809C43.5306 18.7476 41.6788 22.0809 40.5677 24.3032C40.4276 24.5833 40.2358 24.9794 40.0038 25.4587C38.5045 28.556 35.323 35.1283 33.5286 36.3475C37.1365 41.5746 43.1682 45 50 45Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-MG_Video"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50 45C61.0457 45 70 36.0457 70 25C70 13.9543 61.0457 5 50 5C38.9543 5 30 13.9543 30 25C30 27.0918 30.3211 29.1085 30.9168 31.0037C30.9236 30.9921 30.9307 30.9808 30.938 30.9698C33.2837 28.1303 37.2986 22.4097 38.7158 19.8587C40.5677 16.5254 42.4195 12.5748 43.1602 10.9698C43.4072 10.476 44.1973 9.19195 45.3825 9.48825C46.5041 9.76866 46.4979 11.322 46.494 12.2924C46.4938 12.3473 46.4936 12.4004 46.4936 12.4513C46.4936 13.8504 46.4497 15.5277 46.4026 17.3261C46.2128 24.5723 45.9716 33.7832 48.3454 34.6735C49.8962 35.2552 55.0108 26.1548 57.2331 19.1178C57.2534 19.0568 57.2735 18.9959 57.2935 18.9351C57.6388 17.8882 57.966 16.8957 59.0862 16.8957C60.0458 16.8957 60.1791 17.8669 60.3916 19.4162C60.4416 19.7803 60.4959 20.1764 60.5664 20.5993C60.5913 20.7488 60.6179 20.9133 60.6466 21.0911C61.0448 23.5555 61.8521 28.5514 64.2701 30.9696C65.5794 32.279 65.7516 33.5622 62.7886 31.34C62.2948 30.9696 60.5664 29.4882 59.8257 26.5252C59.0849 23.5622 58.4936 23.9324 58.3454 24.6733C57.9751 26.5252 52.7899 38.0069 48.7158 38.0069C42.888 38.0069 43.2868 28.384 43.4794 23.7355C43.5072 23.0664 43.5306 22.5004 43.5306 22.0809C43.5306 18.7476 41.6788 22.0809 40.5677 24.3032C40.4276 24.5833 40.2358 24.9794 40.0038 25.4587C38.5045 28.556 35.323 35.1283 33.5286 36.3475C37.1365 41.5746 43.1682 45 50 45Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-Marbles"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Marblesç”µå&shy;">
      <path
        id="Marbles logo"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.3138 25.0006C36.3138 16.0743 43.5499 8.83819 52.4762 8.83819C57.1891 8.83819 61.4279 10.852 64.3859 14.0742C65.3782 15.1552 67.0589 15.227 68.1398 14.2347C69.2208 13.2424 69.2926 11.5617 68.3003 10.4807C64.3783 6.20838 58.7387 3.52441 52.4762 3.52441C40.6152 3.52441 31 13.1396 31 25.0006C31 36.8615 40.6152 46.4767 52.4762 46.4767C58.5825 46.4767 64.0972 43.9248 68.0043 39.8365C69.0181 38.7757 68.9799 37.0939 67.9191 36.0801C66.8583 35.0663 65.1764 35.1044 64.1627 36.1652C61.2165 39.248 57.0722 41.163 52.4762 41.163C43.5499 41.163 36.3138 33.9268 36.3138 25.0006ZM65.542 25.0005C65.542 31.927 59.927 37.542 53.0005 37.542C46.074 37.542 40.459 31.927 40.459 25.0005C40.459 18.074 46.074 12.459 53.0005 12.459C59.927 12.459 65.542 18.074 65.542 25.0005ZM57.5809 16.36L61.6745 31.7196H59.6504L57.1605 22.4696L52.9414 32.427L48.7315 22.4696L46.1832 31.7242H44.1215L48.3212 16.3783L52.9414 27.3472L57.5809 16.36Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-PG"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M71.4286 11H57.9592V13.3636H55.5102V16.9091H51.8367V32.2727H55.5102V34.6364H57.9592V37H75.102V34.6364H77.551V32.2727H80V21.6364H66.5306V26.3636H75.102V28.7273H73.8776V29.9091H71.4286V32.2727H61.6327V29.9091H60.4082V28.7273H57.9592V19.2727H60.4082V15.7273H72.6531V19.2727H77.551V14.5455H76.3265V13.3636H71.4286V11Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 13.3636H22.449V11H45.7143V14.5455H44.4898V16.9091H48.1633V26.3636H44.4898V29.9091H39.5918V32.2727H26.1224V37H20V13.3636ZM24.898 15.7273H39.5918V19.2727H42.0408V24H39.5918V27.5455H24.898V15.7273Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-PP"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M44.0417 9.02619C44.2715 9.04529 44.5012 9.06439 44.7307 9.08548C47.4998 9.33925 50.1173 10.0688 52.4777 11.5842C53.9298 12.5163 55.1381 13.6997 56.0725 15.1559C56.2841 15.4857 56.4796 15.5136 56.775 15.2521C58.2471 13.9485 59.8902 12.9299 61.7487 12.2726C63.4611 11.6668 65.2242 11.4068 67.0371 11.5503C69.0027 11.7059 70.8508 12.2619 72.5687 13.2362C72.7917 13.3626 73.0151 13.4917 73.221 13.6431L73.2295 13.6493C73.3287 13.722 73.4557 13.8151 73.3831 13.983C73.3066 14.1599 73.1283 14.2646 72.9412 14.2557C72.6809 14.2434 72.4206 14.2275 72.1603 14.2115C71.5646 14.1751 70.9688 14.1386 70.3735 14.1457C66.4437 14.1928 62.8353 15.3175 59.5375 17.4484C58.4654 18.1412 57.466 18.928 56.5227 19.7875C56.4473 19.8563 56.3518 19.9138 56.2553 19.9462C56.1359 19.9864 56.0261 19.9839 55.9315 19.8498C54.1034 17.2604 51.6447 15.5227 48.6627 14.5038C46.9942 13.9336 45.2726 13.7112 43.5183 13.8737C40.4003 14.1626 37.6052 15.2543 35.2383 17.343C33.3672 18.9941 32.2284 21.0857 31.607 23.4782C31.2008 25.0423 31.0731 26.635 31.18 28.2444C31.2896 29.8959 31.673 31.4966 32.1329 33.0803C32.3087 33.686 32.4859 34.2914 32.663 34.8968C32.9497 35.8768 33.2366 36.8573 33.518 37.8389C33.6102 38.1604 33.6692 38.4932 33.7188 38.8244C33.7416 38.9765 33.7249 39.1422 33.6897 39.2932C33.6252 39.5696 33.353 39.7481 33.062 39.6613C32.7581 39.5708 32.4404 39.4569 32.1888 39.2717C30.8487 38.285 29.7179 37.0919 28.8009 35.7008C27.5615 33.8207 26.7864 31.7552 26.3495 29.554C26.0017 27.8019 25.9613 26.033 26.0252 24.2554C26.0993 22.1964 26.5246 20.2176 27.3819 18.3426C28.709 15.4397 30.7425 13.159 33.4768 11.5076C35.2076 10.4622 37.0646 9.72977 39.0487 9.34879C39.6037 9.2422 40.1679 9.18378 40.7321 9.12536C40.994 9.09824 41.256 9.07112 41.517 9.03918C41.5701 9.03266 41.6228 9.02306 41.6755 9.01345C41.6999 9.00899 41.7244 9.00453 41.7489 9.00038C42.4091 9 43.069 9 43.7291 9C43.8332 9.00885 43.9376 9.01753 44.0417 9.02619ZM40.996 41C40.9758 40.9972 40.9556 40.994 40.9354 40.9909C40.891 40.9839 40.8466 40.9768 40.8019 40.9741C40.5588 40.9593 40.4702 40.8818 40.4527 40.6385C40.4428 40.501 40.4434 40.3626 40.444 40.2244C40.4442 40.1909 40.4443 40.1574 40.4443 40.1239L40.4447 35.972V35.9642C40.4451 31.3125 40.4455 26.6608 40.4432 22.0091C40.4431 21.7054 40.5719 21.479 40.814 21.3326C41.0487 21.1905 41.3033 21.0746 41.5609 20.9786C42.7339 20.5415 43.949 20.288 45.194 20.1717C46.1669 20.0809 47.1405 20.0102 48.1172 20.0988C49.8071 20.2523 51.3448 20.7578 52.5209 22.0605C53.3191 22.9444 53.7804 24.0014 54.0269 25.1531C54.4337 27.0529 54.4287 28.9503 53.8922 30.826C53.5226 32.1178 52.8982 33.2687 51.8508 34.1458C50.8867 34.9532 49.7631 35.3844 48.5131 35.4897C47.2419 35.597 45.985 35.4876 44.7384 35.2322C44.7223 35.2288 44.7059 35.2272 44.6846 35.2251C44.6726 35.2239 44.659 35.2226 44.6431 35.2207C44.6414 35.241 44.6392 35.2606 44.6372 35.2799C44.6329 35.3197 44.6288 35.3577 44.6286 35.3957L44.6268 35.9559C44.6217 37.4849 44.6167 39.014 44.6158 40.5431C44.6156 40.7233 44.5798 40.8783 44.4412 41H40.996ZM44.6194 31.3881C44.6183 31.5549 44.6721 31.617 44.8277 31.6499C45.5257 31.7974 46.2268 31.9073 46.9432 31.8961C48.264 31.8753 49.1612 31.2682 49.6055 30.0213C50.0835 28.68 50.0754 27.2984 49.7628 25.9284C49.4529 24.5697 48.67 23.8467 47.0613 23.7192C46.2888 23.6579 45.5388 23.7893 44.791 23.9586C44.656 23.9892 44.6136 24.0446 44.6142 24.1836C44.6254 26.5852 44.6362 28.9867 44.6194 31.3881ZM56.0892 40.5577C56.0811 40.7508 56.1475 40.904 56.3229 40.9998C57.5638 40.9998 58.8047 40.9998 60.0456 40.9999C60.0659 40.966 60.0881 40.9327 60.1103 40.8994C60.1616 40.8225 60.2128 40.7457 60.2407 40.6611C60.2692 40.5743 60.2674 40.4763 60.2655 40.38C60.265 40.3557 60.2646 40.3316 60.2646 40.3078C60.2658 38.6976 60.2654 37.0876 60.2654 35.4774V35.2235C60.3058 35.2297 60.3429 35.2351 60.3779 35.2401C60.4439 35.2497 60.5021 35.2581 60.56 35.2687C61.8433 35.5022 63.1316 35.6207 64.4345 35.4519C66.3539 35.2033 67.8112 34.2505 68.7908 32.5833C69.517 31.3472 69.85 29.9884 69.9259 28.5715C70.0043 27.1093 69.9103 25.6573 69.424 24.2578C68.8666 22.6534 67.8809 21.4205 66.3028 20.7134C65.2872 20.2583 64.2097 20.083 63.1088 20.0655C61.4409 20.0391 59.7909 20.2099 58.1807 20.661C57.6628 20.8061 57.1579 21.0058 56.6599 21.2115C56.3118 21.3551 56.0858 21.6088 56.0861 22.0281C56.0901 28.1518 56.0891 34.2756 56.0894 40.3994C56.0894 40.4521 56.0914 40.5051 56.0892 40.5577ZM60.2497 24.2812C60.2479 24.0734 60.302 23.9882 60.5149 23.9412C61.2258 23.7847 61.9366 23.6634 62.6689 23.7161C64.2763 23.8318 65.1349 24.5285 65.4513 26.1034C65.711 27.3966 65.7048 28.7011 65.2766 29.9719C64.9332 30.9912 64.2487 31.645 63.1733 31.8418C62.5426 31.9572 61.9106 31.8904 61.2825 31.8009C61.1518 31.7824 61.0221 31.7561 60.8925 31.7297C60.7639 31.7036 60.6353 31.6775 60.5057 31.659C60.3143 31.6316 60.251 31.5482 60.2527 31.3495C60.2722 28.9942 60.2701 26.6365 60.2497 24.2812Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-SEXY"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M58.6378 27.9743C58.7561 27.9887 58.9218 28.0286 59.064 28.1489C59.2449 28.3021 59.4121 28.4906 59.5179 28.7325C59.6262 28.9801 59.6543 29.2475 59.6112 29.5303C59.5302 30.0628 59.1919 30.6736 58.6355 31.4226C57.7997 32.5477 56.9444 33.0525 56.136 33.2744C55.7416 33.3827 55.3743 33.4192 55.0571 33.438C54.9386 33.4451 54.8341 33.4496 54.7389 33.4537C54.7086 33.455 54.6793 33.4563 54.6507 33.4576C54.6409 33.9671 54.7327 34.3274 54.9021 34.7798C55.0715 35.2322 55.2468 35.3985 55.4103 35.5286C55.5658 35.6523 55.8337 35.7403 56.0877 35.7403C56.3418 35.7403 57.2613 35.6938 58.1339 35.033C59.8483 33.7346 61.7155 31.5502 62.8294 29.9837C62.9921 29.755 63.3093 29.7014 63.538 29.8641C63.7667 30.0267 63.8202 30.3439 63.6576 30.5726C62.5133 32.1818 60.5769 34.4576 58.7474 35.8431C57.848 36.5242 56.8893 37.0572 56.0184 37.101C55.5615 37.124 55.03 37.1006 54.6507 36.7988C54.2794 36.5034 54.0468 36.1836 53.8437 35.6979C52.8698 33.3691 54.1343 30.7419 55.4418 29.5098C56.0886 28.9003 56.8071 28.4708 57.4133 28.2234C57.7152 28.1002 58.0049 28.0157 58.2559 27.982C58.3808 27.9653 58.5118 27.9589 58.6378 27.9743ZM54.793 32.4338C54.8636 32.4306 54.9321 32.4274 54.9968 32.4236C55.2835 32.4066 55.5708 32.3757 55.867 32.2944C56.4396 32.1372 57.1086 31.774 57.8197 30.8166C58.3642 30.0836 58.5659 29.645 58.6066 29.3774C58.6244 29.2603 58.6089 29.1901 58.5868 29.1396C58.5678 29.0961 58.5336 29.0444 58.4706 28.982C58.4506 28.9827 58.4243 28.9847 58.3911 28.9892C58.2502 29.0081 58.0463 29.0627 57.7973 29.1643C57.302 29.3664 56.6907 29.7292 56.1387 30.2494C55.5492 30.8049 55.0331 31.5311 54.793 32.4338ZM58.519 28.9837C58.519 28.9837 58.5177 28.9836 58.5153 28.9831C58.5179 28.9834 58.519 28.9837 58.519 28.9837Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M63.0189 26.6314C63.2995 26.635 63.524 26.8655 63.5203 27.1461C63.5067 28.1943 63.7472 30.7464 64.7679 32.5646C65.4103 33.7089 66.0199 34.2234 66.5146 34.4622C67.0088 34.7008 67.4516 34.6972 67.8562 34.677C68.1487 34.6623 68.9318 34.4225 69.9625 33.7639C70.9712 33.1194 72.1694 32.1032 73.2962 30.6075C73.4651 30.3834 73.7837 30.3386 74.0078 30.5075C74.2319 30.6763 74.2767 30.9949 74.1079 31.219C72.9059 32.8144 71.6173 33.9125 70.5096 34.6203C69.424 35.3139 68.4612 35.6642 67.9069 35.6919C67.4646 35.714 66.8065 35.7316 66.0728 35.3774C65.3397 35.0235 64.5943 34.3312 63.8818 33.062C62.7346 31.0185 62.4896 28.2582 62.5042 27.1329C62.5078 26.8523 62.7383 26.6277 63.0189 26.6314Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M69.7466 27.6102C69.9309 27.8218 69.9088 28.1428 69.6972 28.3271C68.6177 29.2673 66.9411 30.8663 65.4328 32.5958C63.9064 34.3459 62.62 36.1548 62.2307 37.5251C62.154 37.795 61.873 37.9517 61.6031 37.875C61.3331 37.7983 61.1765 37.5173 61.2531 37.2474C61.7107 35.6368 63.1412 33.6773 64.6669 31.9278C66.2108 30.1576 67.9215 28.526 69.0298 27.5608C69.2414 27.3765 69.5623 27.3986 69.7466 27.6102Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M76.0865 27.3011C76.2779 27.5063 76.2666 27.8278 76.0614 28.0192C75.5819 28.4662 74.9256 29.2791 74.541 30.2313C74.1589 31.1772 74.0644 32.2032 74.593 33.1604C74.7178 33.3863 74.8348 33.4897 74.9208 33.5365C74.9997 33.5795 75.0891 33.5955 75.2108 33.573C75.4913 33.5211 75.8802 33.2743 76.3412 32.8073C77.2401 31.8967 78.3428 30.1072 78.8678 29.0502C78.9926 28.7989 79.0966 29.0208 79.3479 29.1456C79.5992 29.2705 79.7018 29.5754 79.5769 29.8267C79.0293 30.9292 78.0709 32.5016 77.0644 33.5212C76.5727 34.0193 75.9977 34.4608 75.3957 34.5722C75.0762 34.6314 74.7448 34.5978 74.4347 34.4289C74.1319 34.264 73.892 33.9932 73.7034 33.6517C72.9788 32.3395 73.1454 30.9731 73.5988 29.8506C74.0497 28.7344 74.8034 27.8027 75.3684 27.2759C75.5736 27.0846 75.8951 27.0958 76.0865 27.3011Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M51.6463 16.5443C53.0342 17.0197 54.3627 17.9057 54.4965 19.4312C54.547 20.0067 54.4318 20.4933 54.1496 20.87C53.8709 21.2419 53.4755 21.445 53.0822 21.5484C52.3162 21.7499 51.419 21.6124 50.8428 21.4456C50.5733 21.3676 50.418 21.0858 50.496 20.8162C50.5741 20.5467 50.8558 20.3914 51.1254 20.4695C51.6218 20.6132 52.3124 20.7001 52.8238 20.5656C53.0691 20.5011 53.2348 20.3961 53.3363 20.2606C53.4342 20.13 53.5184 19.9098 53.4842 19.52C53.4063 18.6319 52.6178 17.9512 51.317 17.5057C50.0492 17.0715 48.4888 16.9374 47.2924 17.0186C46.1272 17.0975 44.6077 17.5669 43.4819 18.4333C42.3763 19.2841 41.6841 20.4809 41.9981 22.088C42.3097 23.6824 43.8561 24.2847 45.714 25.4088C46.0409 25.6066 46.5139 25.8437 46.8572 26.044C47.4473 26.3882 48.1802 26.8784 48.7203 27.2295C49.6941 27.8627 50.3005 28.6028 50.8428 29.3466C51.8785 30.7673 51.9751 33.3535 50.8857 35.546C49.7802 37.7709 47.2437 39.6757 42.6556 40.1778C39.808 40.4894 37.1325 39.5885 35.183 38.1555C33.2512 36.7356 31.945 34.7208 32.0154 32.7528C32.0567 31.5992 32.399 30.0475 33.4661 29.0545C34.5872 28.0113 36.3396 27.7272 38.8597 28.7883C39.1183 28.8972 39.2397 29.1951 39.1308 29.4537C39.0219 29.7124 38.724 29.8337 38.4653 29.7248C36.1584 28.7535 34.8806 29.1264 34.1584 29.7984C33.3823 30.5207 33.0684 31.7424 33.031 32.7891C32.9771 34.2932 34.234 35.9958 36.0177 37.3069C37.7836 38.605 39.3762 39.2923 42.5451 39.1676C45.714 39.043 49.0652 36.9261 49.9757 35.0938C50.9023 33.229 50.5737 31.2102 49.769 30.1063C49.3389 29.5164 48.6623 28.9777 47.8272 28.4348C47.3033 28.0942 46.7502 27.7718 46.1789 27.4388C45.8309 27.236 45.4761 27.0292 45.1172 26.812C43.3011 25.7132 41.4091 24.3723 41.0008 22.2829C40.595 20.2062 41.533 18.6508 42.8621 17.628C44.1709 16.6208 45.8906 16.095 47.2236 16.0047C48.5254 15.9164 50.2253 16.0576 51.6463 16.5443Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M79.5981 25.1503C79.8783 25.1669 80.0918 25.4075 80.0751 25.6877C79.9875 27.1605 79.7188 29.8122 79.2071 32.2659L79.1022 32.9034L80.051 31.8783C81.3688 30.4191 82.6968 28.8723 83.7031 27.6249C83.8793 27.4065 84.1992 27.3723 84.4176 27.5485C84.636 27.7247 84.6702 28.0446 84.494 28.263C83.1304 29.9533 81.1915 32.1771 79.4726 34.0079C79.4093 34.0754 79.3448 34.1428 79.2792 34.2102L79.016 35.0052C78.8356 35.5502 78.6323 36.0676 78.4021 36.5281C77.5274 38.2775 76.1804 40.1483 74.8715 41.6482C74.2145 42.401 73.5528 43.0768 72.9471 43.6078C72.3684 44.1152 71.7541 44.5688 71.1993 44.7748C70.2803 45.1162 69.123 45.1388 68.38 44.3493C67.5794 43.4986 67.7816 42.2986 68.3612 41.3159C68.6783 40.7782 69.271 40.2263 69.889 39.7129C70.5377 39.174 71.3413 38.5771 72.1905 37.9555C72.3654 37.8275 72.5424 37.6982 72.7209 37.5679C74.3017 36.4139 76.0003 35.1739 77.3686 33.9331L78.0513 33.3268C78.7618 30.6448 78.9563 27.3826 79.0607 25.6273C79.0774 25.3472 79.318 25.1336 79.5981 25.1503ZM78.0513 34.6859C77.8093 34.9053 77.5576 35.1245 77.2985 35.3429C77.1421 35.4749 76.9829 35.6066 76.8217 35.7379C76.651 35.8769 76.4779 36.0154 76.3032 36.1533C75.3231 36.9268 74.2903 37.6806 73.3223 38.3871C71.3897 39.7976 70.2859 40.5032 69.8066 41.3159C68.5363 43.2348 69.7173 44.0393 71.1993 43.4889C72.5702 42.9797 75.3265 39.9414 77.0921 36.8245C77.2352 36.572 77.3694 36.3211 77.4932 36.0736C77.5477 35.9646 77.601 35.8509 77.6531 35.7328C77.7945 35.4127 77.9271 35.061 78.0513 34.6859Z"
      fill="currentColor"
    ></path>
    <path
      d="M87.2343 24.0565C87.2283 23.7119 87.6668 23.5609 87.8742 23.8361C87.967 23.9592 88.1285 24.0086 88.2742 23.9584C88.6001 23.8461 88.8793 24.2165 88.6816 24.4988C88.5932 24.6251 88.5962 24.794 88.6889 24.9171C88.8964 25.1923 88.6304 25.5722 88.3008 25.4715C88.1534 25.4264 87.9937 25.4814 87.9053 25.6077C87.7077 25.8901 87.2641 25.7545 87.2581 25.4099C87.2554 25.2558 87.1537 25.1209 87.0063 25.0759C86.6767 24.9751 86.6686 24.5114 86.9944 24.3992C87.1402 24.349 87.237 24.2107 87.2343 24.0565Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.735 14.9028C25.1553 14.9028 25.5714 14.9204 25.9827 14.9549V17.6766C25.5725 17.6343 25.1563 17.6127 24.735 17.6127C18.0937 17.6127 12.7098 22.9965 12.7098 29.6378C12.7098 36.2791 18.0937 41.6629 24.735 41.6629C27.1847 41.6629 29.4633 40.9304 31.3638 39.6725C31.6654 39.4728 31.9576 39.2599 32.2394 39.0345L33.4181 40.6524L33.8366 41.2267C33.5518 41.4507 33.2585 41.6644 32.9573 41.8673C32.7049 42.0374 32.4468 42.1998 32.1836 42.3544C29.9981 43.6373 27.4525 44.3729 24.735 44.3729C16.5971 44.3729 10 37.7758 10 29.6379C10 21.4999 16.5971 14.9028 24.735 14.9028ZM32.6407 20.5765C31.1721 19.2942 29.389 18.363 27.4223 17.9141V15.1473C31.322 15.8659 34.6838 18.1199 36.8576 21.2591L36.3249 21.7377L34.8216 23.0881C34.5821 22.7201 34.3231 22.366 34.0459 22.0274L34.197 21.7252L32.8421 20.1162L32.6407 20.5765Z"
      fill="currentColor"
    ></path>
    <mask
      id="mask0_6245_8860"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="10"
      y="14"
      width="27"
      height="31"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.8366 41.2267C31.3308 43.1974 28.1702 44.3729 24.735 44.3729C16.5971 44.3729 10 37.7758 10 29.6379C10 21.4999 16.5971 14.9028 24.735 14.9028C29.7603 14.9028 34.1981 17.4185 36.8576 21.2591L34.8216 23.0881C32.6769 19.7921 28.9605 17.6127 24.735 17.6127C18.0937 17.6127 12.7098 22.9965 12.7098 29.6378C12.7098 36.2791 18.0937 41.6629 24.735 41.6629C27.5736 41.6629 30.1824 40.6794 32.2394 39.0345L33.8366 41.2267Z"
        fill="#D9D9D9"
      ></path>
    </mask>
    <g mask="url(#mask0_6245_8860)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.5135 41.536L26.5982 44.2459L26.566 44.2476C25.5271 44.3046 23.5736 44.4117 21.8136 44.0765C20.4562 43.818 18.8779 43.145 18.2568 42.8486L19.5271 40.5198C19.9929 40.7738 21.297 41.2904 22.6181 41.4936C23.9391 41.6969 25.7514 41.6207 26.5135 41.536ZM22.4989 42.1043C22.365 41.8748 22.0157 41.9508 21.9891 42.2151C21.9773 42.3334 21.8906 42.4305 21.7745 42.4558C21.5149 42.5122 21.4792 42.8679 21.7224 42.9748C21.8312 43.0226 21.8968 43.1351 21.8849 43.2533C21.8584 43.5176 22.1856 43.6615 22.3625 43.4632C22.4416 43.3746 22.5688 43.3469 22.6775 43.3947C22.9208 43.5016 23.1587 43.2349 23.0248 43.0054C22.9649 42.9028 22.9779 42.7733 23.057 42.6846C23.2338 42.4863 23.0537 42.1776 22.794 42.2341C22.6779 42.2593 22.5588 42.2069 22.4989 42.1043Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1514 36.9193L12.9615 38.2989L12.9444 38.2732C12.3954 37.4455 11.3629 35.8891 10.7881 34.2781C10.3449 33.0357 10.136 31.4111 10.0798 30.7565L12.611 30.6766C12.6269 31.1828 12.8321 32.5061 13.3033 33.6919C13.7746 34.8777 14.7133 36.3328 15.1514 36.9193ZM12.4381 33.8083C12.3099 33.5757 11.9588 33.643 11.9258 33.9066C11.911 34.0245 11.822 34.1195 11.7053 34.1419C11.4444 34.1919 11.3999 34.5466 11.6404 34.6595C11.748 34.71 11.8108 34.824 11.7961 34.9419C11.763 35.2055 12.0866 35.3574 12.2683 35.1635C12.3496 35.0768 12.4774 35.0523 12.5849 35.1028C12.8255 35.2157 13.0699 34.9548 12.9417 34.7221C12.8843 34.6181 12.9005 34.4889 12.9818 34.4022C13.1634 34.2084 12.9909 33.8953 12.73 33.9453C12.6133 33.9677 12.4954 33.9124 12.4381 33.8083Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5116 24.9897L11.248 23.7347L11.2623 23.7074L11.2623 23.7074C11.7233 22.8276 12.5903 21.1732 13.7254 19.8938C14.6009 18.907 15.9242 17.9416 16.4707 17.5772L17.7596 19.7571C17.3237 20.0149 16.2626 20.8319 15.4503 21.8159C14.6379 22.7999 13.8147 24.3233 13.5116 24.9897ZM14.5276 20.7395C14.3993 20.5068 14.0483 20.5741 14.0152 20.8378C14.0005 20.9557 13.9115 21.0506 13.7948 21.073C13.5338 21.1231 13.4894 21.4778 13.7299 21.5906C13.8375 21.6411 13.9003 21.7551 13.8855 21.873C13.8525 22.1366 14.1761 22.2885 14.3578 22.0947C14.439 22.008 14.5669 21.9834 14.6744 22.0339C14.9149 22.1468 15.1594 21.886 15.0311 21.6533C14.9738 21.5492 14.99 21.4201 15.0712 21.3334C15.2529 21.1395 15.0804 20.8264 14.8194 20.8765C14.7028 20.8989 14.5849 20.8436 14.5276 20.7395Z"
        fill="currentColor"
      ></path>
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.8882 11.5576C23.9729 11.3036 23.9729 10.4991 23.9729 9.8216C23.9729 8.97476 25.9207 6.0955 27.0215 5.41803C28.1224 4.74056 30.0834 4.90993 30.8323 5.75677C31.469 6.47658 32.0885 8.32552 32.1873 9.18647H35.8287C36.4638 9.18647 38.7488 9.65224 38.7911 10.7108C38.8335 11.7693 37.6056 14.1405 36.8011 14.945C36.1575 15.5886 34.811 16.8222 34.2182 17.3585V18.2477C34.2182 18.2715 34.2284 18.3626 34.2431 18.4934C34.2645 18.6846 34.2954 18.9607 34.3179 19.2361C34.2775 19.0642 34.2174 18.915 34.1349 18.7982C33.7284 18.2223 33.4856 18.4171 33.4151 18.5865C33.3868 18.897 33.2118 19.7297 32.7376 20.5765C32.1448 21.6351 30.5358 21.8891 30.0701 21.8468C29.6653 21.81 29.4524 21.3574 29.07 20.5447C29.0124 20.4223 28.951 20.2917 28.8845 20.1531C28.6667 19.6994 28.3167 19.3313 27.9878 18.9853C27.5494 18.5242 27.1485 18.1025 27.1485 17.5702C27.1485 16.825 27.0355 15.4814 26.9791 14.9027H26.3863C26.4286 15.6366 26.4879 17.1976 26.3863 17.5702C26.3035 17.8739 25.8426 18.3757 25.4262 18.8289L25.4262 18.8289C25.2041 19.0708 24.9946 19.2988 24.862 19.4756C24.4809 19.9837 23.4647 21.3387 24.862 22.1008C26.0298 22.7378 27.8483 22.5171 28.5871 22.4274C28.7323 22.4098 28.8358 22.3972 28.8845 22.3972C28.9553 22.3972 29.0601 22.3827 29.1819 22.3658C29.5697 22.3121 30.1308 22.2343 30.3241 22.5243C30.5782 22.9053 31.8061 23.9215 32.0178 23.8369C32.0484 23.8246 32.0933 23.8053 32.1493 23.7783C32.0345 23.8762 31.9572 24.1211 31.8509 24.4574C31.6406 25.1229 31.3172 26.1465 30.3666 27.0972C28.8846 28.5791 27.2741 30.8233 27.5705 32.1359C27.8669 33.4485 28.251 40.0538 28.1224 41.2394C28.1087 41.3664 24.227 41.8322 23.9291 41.8322C23.8027 41.4729 23.6581 41.0818 23.5055 40.6692C22.7893 38.7322 21.8982 36.3222 21.8982 34.507C21.8982 33.3207 20.7126 34.8881 20.4162 36.5394C20.2504 37.463 20.1095 38.8129 20.0107 39.7586C19.9682 40.1657 19.9336 40.4979 19.9081 40.689C19.8152 40.6507 19.708 40.6082 19.59 40.5614C18.4894 40.1247 16.4481 39.315 16.2652 38.1061C16.182 37.5556 16.0126 33.3214 16.0973 31.289C16.1389 30.2903 16.4797 29.2041 16.7136 28.4584C16.7698 28.2795 16.8197 28.1202 16.858 27.9863C16.784 28.0502 16.6925 28.1413 16.5834 28.2499C16.2346 28.5973 15.706 29.1236 14.9964 29.5107C14.4158 29.8274 12.733 30.4898 12.7295 30.4476C12.6872 29.9395 12.6874 28.0711 12.8567 27.7746C12.8627 27.7643 12.9254 27.7767 13.0279 27.7972C13.3439 27.8601 14.0383 27.9984 14.6138 27.7746C15.2593 27.5236 16.1414 26.3928 16.7788 25.5756C17.0171 25.2702 17.2212 25.0085 17.366 24.853C17.765 24.4245 18.3689 23.8939 18.8916 23.4346C19.092 23.2585 19.2804 23.0929 19.4408 22.9476C19.9081 22.5242 21.6568 19.4786 21.6018 17.9936C21.5171 15.7071 21.6018 13.8441 22.32 13.5477C23.2624 13.1588 22.9567 12.7855 22.7435 12.7855C22.2977 12.7855 22.5368 12.6509 22.9093 12.4412C23.3184 12.2109 23.8882 11.8901 23.8882 11.5576ZM32.1872 11.0496C32.1448 10.852 32.2295 10.5161 32.907 10.7532C33.4253 10.9346 33.785 10.9574 34.0929 10.9769C34.288 10.9893 34.4624 11.0003 34.643 11.0496C34.7291 11.073 34.8266 11.0951 34.9296 11.1183C35.3843 11.2209 35.9446 11.3473 36.0827 11.7271C36.252 12.1928 35.0241 13.082 34.643 13.2937C34.262 13.5054 33.3304 13.8865 32.9917 14.0135C32.653 14.1405 31.8908 13.2514 31.9332 12.4469C31.9562 12.0085 32.0296 11.7713 32.0916 11.5708C32.1433 11.4034 32.1872 11.2616 32.1872 11.0496ZM23.0836 20.3648C23.1965 20.0825 23.4562 19.6027 23.5917 19.9414C23.7611 20.3648 23.8034 21.6774 23.5917 22.863C23.41 23.8807 22.0114 24.3368 21.4315 24.5259C21.3359 24.5571 21.2625 24.581 21.2206 24.599C20.9242 24.7261 20.8395 24.472 21.2206 23.9216C21.2828 23.8317 21.3676 23.7204 21.467 23.5899C21.9766 22.9208 22.871 21.7466 23.0836 20.3648ZM17.6637 26.8432L18.8916 25.6152C19.0045 25.5588 19.2388 25.4797 19.2727 25.6152C19.2811 25.6487 19.2861 25.7004 19.2925 25.765C19.3181 26.0274 19.3648 26.5034 19.7385 26.8432C19.8068 26.9053 19.9225 27.0125 20.0738 27.1526L20.0739 27.1527C20.9531 27.9671 23.0369 29.8973 24.0573 30.6116C25.7512 31.7972 27.5069 31.8449 27.5069 31.8449C27.5069 31.8449 27.5691 32.2737 27.5916 32.6917C27.4628 32.7273 27.2748 32.7902 27.0472 32.8664L27.0472 32.8664C26.5515 33.0323 25.8681 33.2611 25.2006 33.4062C24.0354 33.6594 22.1946 34.0179 21.8557 33.8296C21.7697 33.7818 21.8077 33.6262 21.8571 33.4236C21.8952 33.2671 21.9402 33.0826 21.9402 32.8981C21.9402 32.4747 21.8416 31.0973 21.3475 30.0188C20.8818 29.0026 20.1619 27.817 19.5267 27.4783C19.4424 27.4333 19.3617 27.3883 19.2839 27.3449L19.2838 27.3448L19.2838 27.3448C18.776 27.0614 18.3892 26.8455 17.8754 27.1396C17.7909 27.1879 17.5367 27.0549 17.6637 26.8432Z"
      fill="currentColor"
    ></path>
    <path
      d="M34.1971 18.8035C34.4512 19.5233 34.4935 21.3016 34.0277 22.1061C33.4728 23.0646 32.3905 23.7151 31.9106 23.8845"
      stroke="#9EA2A8"
    ></path>
  </symbol>
  <symbol
    id="icon-SEXY_Video"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M58.6378 27.9743C58.7561 27.9887 58.9218 28.0286 59.064 28.1489C59.2449 28.3021 59.4121 28.4906 59.5179 28.7325C59.6262 28.9801 59.6543 29.2475 59.6112 29.5303C59.5302 30.0628 59.1919 30.6736 58.6355 31.4226C57.7997 32.5477 56.9444 33.0525 56.136 33.2744C55.7416 33.3827 55.3743 33.4192 55.0571 33.438C54.9386 33.4451 54.8341 33.4496 54.7389 33.4537C54.7086 33.455 54.6793 33.4563 54.6507 33.4576C54.6409 33.9671 54.7327 34.3274 54.9021 34.7798C55.0715 35.2322 55.2468 35.3985 55.4103 35.5286C55.5658 35.6523 55.8337 35.7403 56.0877 35.7403C56.3418 35.7403 57.2613 35.6938 58.1339 35.033C59.8483 33.7346 61.7155 31.5502 62.8294 29.9837C62.9921 29.755 63.3093 29.7014 63.538 29.8641C63.7667 30.0267 63.8202 30.3439 63.6576 30.5726C62.5133 32.1818 60.5769 34.4576 58.7474 35.8431C57.848 36.5242 56.8893 37.0572 56.0184 37.101C55.5615 37.124 55.03 37.1006 54.6507 36.7988C54.2794 36.5034 54.0468 36.1836 53.8437 35.6979C52.8698 33.3691 54.1343 30.7419 55.4418 29.5098C56.0886 28.9003 56.8071 28.4708 57.4133 28.2234C57.7152 28.1002 58.0049 28.0157 58.2559 27.982C58.3808 27.9653 58.5118 27.9589 58.6378 27.9743ZM54.793 32.4338C54.8636 32.4306 54.9321 32.4274 54.9968 32.4236C55.2835 32.4066 55.5708 32.3757 55.867 32.2944C56.4396 32.1372 57.1086 31.774 57.8197 30.8166C58.3642 30.0836 58.5659 29.645 58.6066 29.3774C58.6244 29.2603 58.6089 29.1901 58.5868 29.1396C58.5678 29.0961 58.5336 29.0444 58.4706 28.982C58.4506 28.9827 58.4243 28.9847 58.3911 28.9892C58.2502 29.0081 58.0463 29.0627 57.7973 29.1643C57.302 29.3664 56.6907 29.7292 56.1387 30.2494C55.5492 30.8049 55.0331 31.5311 54.793 32.4338ZM58.519 28.9837C58.519 28.9837 58.5177 28.9836 58.5153 28.9831C58.5179 28.9834 58.519 28.9837 58.519 28.9837Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M63.0189 26.6314C63.2995 26.635 63.524 26.8655 63.5203 27.1461C63.5067 28.1943 63.7472 30.7464 64.7679 32.5646C65.4103 33.7089 66.0199 34.2234 66.5146 34.4622C67.0088 34.7008 67.4516 34.6972 67.8562 34.677C68.1487 34.6623 68.9318 34.4225 69.9625 33.7639C70.9712 33.1194 72.1694 32.1032 73.2962 30.6075C73.4651 30.3834 73.7837 30.3386 74.0078 30.5075C74.2319 30.6763 74.2767 30.9949 74.1079 31.219C72.9059 32.8144 71.6173 33.9125 70.5096 34.6203C69.424 35.3139 68.4612 35.6642 67.9069 35.6919C67.4646 35.714 66.8065 35.7316 66.0728 35.3774C65.3397 35.0235 64.5943 34.3312 63.8818 33.062C62.7346 31.0185 62.4896 28.2582 62.5042 27.1329C62.5078 26.8523 62.7383 26.6277 63.0189 26.6314Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M69.7466 27.6102C69.9309 27.8218 69.9088 28.1428 69.6972 28.3271C68.6177 29.2673 66.9411 30.8663 65.4328 32.5958C63.9064 34.3459 62.62 36.1548 62.2307 37.5251C62.154 37.795 61.873 37.9517 61.6031 37.875C61.3331 37.7983 61.1765 37.5173 61.2531 37.2474C61.7107 35.6368 63.1412 33.6773 64.6669 31.9278C66.2108 30.1576 67.9215 28.526 69.0298 27.5608C69.2414 27.3765 69.5623 27.3986 69.7466 27.6102Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M76.0865 27.3011C76.2779 27.5063 76.2666 27.8278 76.0614 28.0192C75.5819 28.4662 74.9256 29.2791 74.541 30.2313C74.1589 31.1772 74.0644 32.2032 74.593 33.1604C74.7178 33.3863 74.8348 33.4897 74.9208 33.5365C74.9997 33.5795 75.0891 33.5955 75.2108 33.573C75.4913 33.5211 75.8802 33.2743 76.3412 32.8073C77.2401 31.8967 78.3428 30.1072 78.8678 29.0502C78.9926 28.7989 79.0966 29.0208 79.3479 29.1456C79.5992 29.2705 79.7018 29.5754 79.5769 29.8267C79.0293 30.9292 78.0709 32.5016 77.0644 33.5212C76.5727 34.0193 75.9977 34.4608 75.3957 34.5722C75.0762 34.6314 74.7448 34.5978 74.4347 34.4289C74.1319 34.264 73.892 33.9932 73.7034 33.6517C72.9788 32.3395 73.1454 30.9731 73.5988 29.8506C74.0497 28.7344 74.8034 27.8027 75.3684 27.2759C75.5736 27.0846 75.8951 27.0958 76.0865 27.3011Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M51.6463 16.5443C53.0342 17.0197 54.3627 17.9057 54.4965 19.4312C54.547 20.0067 54.4318 20.4933 54.1496 20.87C53.8709 21.2419 53.4755 21.445 53.0822 21.5484C52.3162 21.7499 51.419 21.6124 50.8428 21.4456C50.5733 21.3676 50.418 21.0858 50.496 20.8162C50.5741 20.5467 50.8558 20.3914 51.1254 20.4695C51.6218 20.6132 52.3124 20.7001 52.8238 20.5656C53.0691 20.5011 53.2348 20.3961 53.3363 20.2606C53.4342 20.13 53.5184 19.9098 53.4842 19.52C53.4063 18.6319 52.6178 17.9512 51.317 17.5057C50.0492 17.0715 48.4888 16.9374 47.2924 17.0186C46.1272 17.0975 44.6077 17.5669 43.4819 18.4333C42.3763 19.2841 41.6841 20.4809 41.9981 22.088C42.3097 23.6824 43.8561 24.2847 45.714 25.4088C46.0409 25.6066 46.5139 25.8437 46.8572 26.044C47.4473 26.3882 48.1802 26.8784 48.7203 27.2295C49.6941 27.8627 50.3005 28.6028 50.8428 29.3466C51.8785 30.7673 51.9751 33.3535 50.8857 35.546C49.7802 37.7709 47.2437 39.6757 42.6556 40.1778C39.808 40.4894 37.1325 39.5885 35.183 38.1555C33.2512 36.7356 31.945 34.7208 32.0154 32.7528C32.0567 31.5992 32.399 30.0475 33.4661 29.0545C34.5872 28.0113 36.3396 27.7272 38.8597 28.7883C39.1183 28.8972 39.2397 29.1951 39.1308 29.4537C39.0219 29.7124 38.724 29.8337 38.4653 29.7248C36.1584 28.7535 34.8806 29.1264 34.1584 29.7984C33.3823 30.5207 33.0684 31.7424 33.031 32.7891C32.9771 34.2932 34.234 35.9958 36.0177 37.3069C37.7836 38.605 39.3762 39.2923 42.5451 39.1676C45.714 39.043 49.0652 36.9261 49.9757 35.0938C50.9023 33.229 50.5737 31.2102 49.769 30.1063C49.3389 29.5164 48.6623 28.9777 47.8272 28.4348C47.3033 28.0942 46.7502 27.7718 46.1789 27.4388C45.8309 27.236 45.4761 27.0292 45.1172 26.812C43.3011 25.7132 41.4091 24.3723 41.0008 22.2829C40.595 20.2062 41.533 18.6508 42.8621 17.628C44.1709 16.6208 45.8906 16.095 47.2236 16.0047C48.5254 15.9164 50.2253 16.0576 51.6463 16.5443Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M79.5981 25.1503C79.8783 25.1669 80.0918 25.4075 80.0751 25.6877C79.9875 27.1605 79.7188 29.8122 79.2071 32.2659L79.1022 32.9034L80.051 31.8783C81.3688 30.4191 82.6968 28.8723 83.7031 27.6249C83.8793 27.4065 84.1992 27.3723 84.4176 27.5485C84.636 27.7247 84.6702 28.0446 84.494 28.263C83.1304 29.9533 81.1915 32.1771 79.4726 34.0079C79.4093 34.0754 79.3448 34.1428 79.2792 34.2102L79.016 35.0052C78.8356 35.5502 78.6323 36.0676 78.4021 36.5281C77.5274 38.2775 76.1804 40.1483 74.8715 41.6482C74.2145 42.401 73.5528 43.0768 72.9471 43.6078C72.3684 44.1152 71.7541 44.5688 71.1993 44.7748C70.2803 45.1162 69.123 45.1388 68.38 44.3493C67.5794 43.4986 67.7816 42.2986 68.3612 41.3159C68.6783 40.7782 69.271 40.2263 69.889 39.7129C70.5377 39.174 71.3413 38.5771 72.1905 37.9555C72.3654 37.8275 72.5424 37.6982 72.7209 37.5679C74.3017 36.4139 76.0003 35.1739 77.3686 33.9331L78.0513 33.3268C78.7618 30.6448 78.9563 27.3826 79.0607 25.6273C79.0774 25.3472 79.318 25.1336 79.5981 25.1503ZM78.0513 34.6859C77.8093 34.9053 77.5576 35.1245 77.2985 35.3429C77.1421 35.4749 76.9829 35.6066 76.8217 35.7379C76.651 35.8769 76.4779 36.0154 76.3032 36.1533C75.3231 36.9268 74.2903 37.6806 73.3223 38.3871C71.3897 39.7976 70.2859 40.5032 69.8066 41.3159C68.5363 43.2348 69.7173 44.0393 71.1993 43.4889C72.5702 42.9797 75.3265 39.9414 77.0921 36.8245C77.2352 36.572 77.3694 36.3211 77.4932 36.0736C77.5477 35.9646 77.601 35.8509 77.6531 35.7328C77.7945 35.4127 77.9271 35.061 78.0513 34.6859Z"
      fill="currentColor"
    ></path>
    <path
      d="M87.2343 24.0565C87.2283 23.7119 87.6668 23.5609 87.8742 23.8361C87.967 23.9592 88.1285 24.0086 88.2742 23.9584C88.6001 23.8461 88.8793 24.2165 88.6816 24.4988C88.5932 24.6251 88.5962 24.794 88.6889 24.9171C88.8964 25.1923 88.6304 25.5722 88.3008 25.4715C88.1534 25.4264 87.9937 25.4814 87.9053 25.6077C87.7077 25.8901 87.2641 25.7545 87.2581 25.4099C87.2554 25.2558 87.1537 25.1209 87.0063 25.0759C86.6767 24.9751 86.6686 24.5114 86.9944 24.3992C87.1402 24.349 87.237 24.2107 87.2343 24.0565Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.735 14.9028C25.1553 14.9028 25.5714 14.9204 25.9827 14.9549V17.6766C25.5725 17.6343 25.1563 17.6127 24.735 17.6127C18.0937 17.6127 12.7098 22.9965 12.7098 29.6378C12.7098 36.2791 18.0937 41.6629 24.735 41.6629C27.1847 41.6629 29.4633 40.9304 31.3638 39.6725C31.6654 39.4728 31.9576 39.2599 32.2394 39.0345L33.4181 40.6524L33.8366 41.2267C33.5518 41.4507 33.2585 41.6644 32.9573 41.8673C32.7049 42.0374 32.4468 42.1998 32.1836 42.3544C29.9981 43.6373 27.4525 44.3729 24.735 44.3729C16.5971 44.3729 10 37.7758 10 29.6379C10 21.4999 16.5971 14.9028 24.735 14.9028ZM32.6407 20.5765C31.1721 19.2942 29.389 18.363 27.4223 17.9141V15.1473C31.322 15.8659 34.6838 18.1199 36.8576 21.2591L36.3249 21.7377L34.8216 23.0881C34.5821 22.7201 34.3231 22.366 34.0459 22.0274L34.197 21.7252L32.8421 20.1162L32.6407 20.5765Z"
      fill="currentColor"
    ></path>
    <mask
      id="mask0_6245_8860"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="10"
      y="14"
      width="27"
      height="31"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.8366 41.2267C31.3308 43.1974 28.1702 44.3729 24.735 44.3729C16.5971 44.3729 10 37.7758 10 29.6379C10 21.4999 16.5971 14.9028 24.735 14.9028C29.7603 14.9028 34.1981 17.4185 36.8576 21.2591L34.8216 23.0881C32.6769 19.7921 28.9605 17.6127 24.735 17.6127C18.0937 17.6127 12.7098 22.9965 12.7098 29.6378C12.7098 36.2791 18.0937 41.6629 24.735 41.6629C27.5736 41.6629 30.1824 40.6794 32.2394 39.0345L33.8366 41.2267Z"
        fill="#D9D9D9"
      ></path>
    </mask>
    <g mask="url(#mask0_6245_8860)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.5135 41.536L26.5982 44.2459L26.566 44.2476C25.5271 44.3046 23.5736 44.4117 21.8136 44.0765C20.4562 43.818 18.8779 43.145 18.2568 42.8486L19.5271 40.5198C19.9929 40.7738 21.297 41.2904 22.6181 41.4936C23.9391 41.6969 25.7514 41.6207 26.5135 41.536ZM22.4989 42.1043C22.365 41.8748 22.0157 41.9508 21.9891 42.2151C21.9773 42.3334 21.8906 42.4305 21.7745 42.4558C21.5149 42.5122 21.4792 42.8679 21.7224 42.9748C21.8312 43.0226 21.8968 43.1351 21.8849 43.2533C21.8584 43.5176 22.1856 43.6615 22.3625 43.4632C22.4416 43.3746 22.5688 43.3469 22.6775 43.3947C22.9208 43.5016 23.1587 43.2349 23.0248 43.0054C22.9649 42.9028 22.9779 42.7733 23.057 42.6846C23.2338 42.4863 23.0537 42.1776 22.794 42.2341C22.6779 42.2593 22.5588 42.2069 22.4989 42.1043Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1514 36.9193L12.9615 38.2989L12.9444 38.2732C12.3954 37.4455 11.3629 35.8891 10.7881 34.2781C10.3449 33.0357 10.136 31.4111 10.0798 30.7565L12.611 30.6766C12.6269 31.1828 12.8321 32.5061 13.3033 33.6919C13.7746 34.8777 14.7133 36.3328 15.1514 36.9193ZM12.4381 33.8083C12.3099 33.5757 11.9588 33.643 11.9258 33.9066C11.911 34.0245 11.822 34.1195 11.7053 34.1419C11.4444 34.1919 11.3999 34.5466 11.6404 34.6595C11.748 34.71 11.8108 34.824 11.7961 34.9419C11.763 35.2055 12.0866 35.3574 12.2683 35.1635C12.3496 35.0768 12.4774 35.0523 12.5849 35.1028C12.8255 35.2157 13.0699 34.9548 12.9417 34.7221C12.8843 34.6181 12.9005 34.4889 12.9818 34.4022C13.1634 34.2084 12.9909 33.8953 12.73 33.9453C12.6133 33.9677 12.4954 33.9124 12.4381 33.8083Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5116 24.9897L11.248 23.7347L11.2623 23.7074L11.2623 23.7074C11.7233 22.8276 12.5903 21.1732 13.7254 19.8938C14.6009 18.907 15.9242 17.9416 16.4707 17.5772L17.7596 19.7571C17.3237 20.0149 16.2626 20.8319 15.4503 21.8159C14.6379 22.7999 13.8147 24.3233 13.5116 24.9897ZM14.5276 20.7395C14.3993 20.5068 14.0483 20.5741 14.0152 20.8378C14.0005 20.9557 13.9115 21.0506 13.7948 21.073C13.5338 21.1231 13.4894 21.4778 13.7299 21.5906C13.8375 21.6411 13.9003 21.7551 13.8855 21.873C13.8525 22.1366 14.1761 22.2885 14.3578 22.0947C14.439 22.008 14.5669 21.9834 14.6744 22.0339C14.9149 22.1468 15.1594 21.886 15.0311 21.6533C14.9738 21.5492 14.99 21.4201 15.0712 21.3334C15.2529 21.1395 15.0804 20.8264 14.8194 20.8765C14.7028 20.8989 14.5849 20.8436 14.5276 20.7395Z"
        fill="currentColor"
      ></path>
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.8882 11.5576C23.9729 11.3036 23.9729 10.4991 23.9729 9.8216C23.9729 8.97476 25.9207 6.0955 27.0215 5.41803C28.1224 4.74056 30.0834 4.90993 30.8323 5.75677C31.469 6.47658 32.0885 8.32552 32.1873 9.18647H35.8287C36.4638 9.18647 38.7488 9.65224 38.7911 10.7108C38.8335 11.7693 37.6056 14.1405 36.8011 14.945C36.1575 15.5886 34.811 16.8222 34.2182 17.3585V18.2477C34.2182 18.2715 34.2284 18.3626 34.2431 18.4934C34.2645 18.6846 34.2954 18.9607 34.3179 19.2361C34.2775 19.0642 34.2174 18.915 34.1349 18.7982C33.7284 18.2223 33.4856 18.4171 33.4151 18.5865C33.3868 18.897 33.2118 19.7297 32.7376 20.5765C32.1448 21.6351 30.5358 21.8891 30.0701 21.8468C29.6653 21.81 29.4524 21.3574 29.07 20.5447C29.0124 20.4223 28.951 20.2917 28.8845 20.1531C28.6667 19.6994 28.3167 19.3313 27.9878 18.9853C27.5494 18.5242 27.1485 18.1025 27.1485 17.5702C27.1485 16.825 27.0355 15.4814 26.9791 14.9027H26.3863C26.4286 15.6366 26.4879 17.1976 26.3863 17.5702C26.3035 17.8739 25.8426 18.3757 25.4262 18.8289L25.4262 18.8289C25.2041 19.0708 24.9946 19.2988 24.862 19.4756C24.4809 19.9837 23.4647 21.3387 24.862 22.1008C26.0298 22.7378 27.8483 22.5171 28.5871 22.4274C28.7323 22.4098 28.8358 22.3972 28.8845 22.3972C28.9553 22.3972 29.0601 22.3827 29.1819 22.3658C29.5697 22.3121 30.1308 22.2343 30.3241 22.5243C30.5782 22.9053 31.8061 23.9215 32.0178 23.8369C32.0484 23.8246 32.0933 23.8053 32.1493 23.7783C32.0345 23.8762 31.9572 24.1211 31.8509 24.4574C31.6406 25.1229 31.3172 26.1465 30.3666 27.0972C28.8846 28.5791 27.2741 30.8233 27.5705 32.1359C27.8669 33.4485 28.251 40.0538 28.1224 41.2394C28.1087 41.3664 24.227 41.8322 23.9291 41.8322C23.8027 41.4729 23.6581 41.0818 23.5055 40.6692C22.7893 38.7322 21.8982 36.3222 21.8982 34.507C21.8982 33.3207 20.7126 34.8881 20.4162 36.5394C20.2504 37.463 20.1095 38.8129 20.0107 39.7586C19.9682 40.1657 19.9336 40.4979 19.9081 40.689C19.8152 40.6507 19.708 40.6082 19.59 40.5614C18.4894 40.1247 16.4481 39.315 16.2652 38.1061C16.182 37.5556 16.0126 33.3214 16.0973 31.289C16.1389 30.2903 16.4797 29.2041 16.7136 28.4584C16.7698 28.2795 16.8197 28.1202 16.858 27.9863C16.784 28.0502 16.6925 28.1413 16.5834 28.2499C16.2346 28.5973 15.706 29.1236 14.9964 29.5107C14.4158 29.8274 12.733 30.4898 12.7295 30.4476C12.6872 29.9395 12.6874 28.0711 12.8567 27.7746C12.8627 27.7643 12.9254 27.7767 13.0279 27.7972C13.3439 27.8601 14.0383 27.9984 14.6138 27.7746C15.2593 27.5236 16.1414 26.3928 16.7788 25.5756C17.0171 25.2702 17.2212 25.0085 17.366 24.853C17.765 24.4245 18.3689 23.8939 18.8916 23.4346C19.092 23.2585 19.2804 23.0929 19.4408 22.9476C19.9081 22.5242 21.6568 19.4786 21.6018 17.9936C21.5171 15.7071 21.6018 13.8441 22.32 13.5477C23.2624 13.1588 22.9567 12.7855 22.7435 12.7855C22.2977 12.7855 22.5368 12.6509 22.9093 12.4412C23.3184 12.2109 23.8882 11.8901 23.8882 11.5576ZM32.1872 11.0496C32.1448 10.852 32.2295 10.5161 32.907 10.7532C33.4253 10.9346 33.785 10.9574 34.0929 10.9769C34.288 10.9893 34.4624 11.0003 34.643 11.0496C34.7291 11.073 34.8266 11.0951 34.9296 11.1183C35.3843 11.2209 35.9446 11.3473 36.0827 11.7271C36.252 12.1928 35.0241 13.082 34.643 13.2937C34.262 13.5054 33.3304 13.8865 32.9917 14.0135C32.653 14.1405 31.8908 13.2514 31.9332 12.4469C31.9562 12.0085 32.0296 11.7713 32.0916 11.5708C32.1433 11.4034 32.1872 11.2616 32.1872 11.0496ZM23.0836 20.3648C23.1965 20.0825 23.4562 19.6027 23.5917 19.9414C23.7611 20.3648 23.8034 21.6774 23.5917 22.863C23.41 23.8807 22.0114 24.3368 21.4315 24.5259C21.3359 24.5571 21.2625 24.581 21.2206 24.599C20.9242 24.7261 20.8395 24.472 21.2206 23.9216C21.2828 23.8317 21.3676 23.7204 21.467 23.5899C21.9766 22.9208 22.871 21.7466 23.0836 20.3648ZM17.6637 26.8432L18.8916 25.6152C19.0045 25.5588 19.2388 25.4797 19.2727 25.6152C19.2811 25.6487 19.2861 25.7004 19.2925 25.765C19.3181 26.0274 19.3648 26.5034 19.7385 26.8432C19.8068 26.9053 19.9225 27.0125 20.0738 27.1526L20.0739 27.1527C20.9531 27.9671 23.0369 29.8973 24.0573 30.6116C25.7512 31.7972 27.5069 31.8449 27.5069 31.8449C27.5069 31.8449 27.5691 32.2737 27.5916 32.6917C27.4628 32.7273 27.2748 32.7902 27.0472 32.8664L27.0472 32.8664C26.5515 33.0323 25.8681 33.2611 25.2006 33.4062C24.0354 33.6594 22.1946 34.0179 21.8557 33.8296C21.7697 33.7818 21.8077 33.6262 21.8571 33.4236C21.8952 33.2671 21.9402 33.0826 21.9402 32.8981C21.9402 32.4747 21.8416 31.0973 21.3475 30.0188C20.8818 29.0026 20.1619 27.817 19.5267 27.4783C19.4424 27.4333 19.3617 27.3883 19.2839 27.3449L19.2838 27.3448L19.2838 27.3448C18.776 27.0614 18.3892 26.8455 17.8754 27.1396C17.7909 27.1879 17.5367 27.0549 17.6637 26.8432Z"
      fill="currentColor"
    ></path>
    <path
      d="M34.1971 18.8035C34.4512 19.5233 34.4935 21.3016 34.0277 22.1061C33.4728 23.0646 32.3905 23.7151 31.9106 23.8845"
      stroke="#9EA2A8"
    ></path>
  </symbol>
  <symbol
    id="icon-SPRIBE"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.0777 11.3055C36.8551 10.5866 39.289 10.7395 39.415 16.2593C39.541 21.7791 39.2413 25.6941 32.5309 25.9013V29.9225V34.2044H29.0776C29.0777 26.6692 29.0777 19.071 29.0777 11.3055ZM32.6153 22.2102C35.4513 22.3654 35.8156 22.0272 35.8575 19.3824C35.8677 18.742 35.8669 18.101 35.8582 17.4605C35.8195 14.6403 35.4441 14.3347 32.6153 14.8919V22.2102ZM61.3405 11.0975C61.6053 11.0975 61.9395 11.0832 62.3244 11.0667C64.7917 10.9611 69.3413 10.7665 71.0119 13.6818C72.5615 16.386 71.9707 19.5961 69.817 22.2078C72.8746 24.775 72.5169 28.2863 71.5553 31.5055C71.1702 32.7945 69.1831 34.0206 67.7218 34.3851C65.7535 34.8761 61.3404 34.5069 61.3404 34.5069C61.3405 26.8356 61.3405 19.2014 61.3405 11.0975ZM64.8514 23.7742V31.5093C64.8868 31.5093 64.9271 31.5095 64.9717 31.5098C65.7213 31.5144 67.6819 31.5265 68.0151 30.4901C68.3682 29.392 68.752 26.7925 68.0015 25.1674C67.2511 23.5424 66.3541 23.3047 64.8514 23.7742ZM64.8048 21.137C65.2642 21.137 67.2014 20.9214 67.7587 19.6062C68.316 18.291 68.752 16.9831 67.7073 15.4577C66.6627 13.9324 64.8048 14.5048 64.8048 14.5048V21.137ZM84.4481 35.9482V39H16V35.9482H84.4481ZM45.3352 11.0984C43.9021 11.0984 42.9631 11.0667 41.7225 11.0984V34.1661H45.2984V25.2222C47.8101 24.7687 48.7427 25.7993 48.6796 28.0601C48.6402 29.4718 48.6497 30.8849 48.6592 32.3077L48.6592 32.3085C48.6634 32.9386 48.6676 33.5705 48.6676 34.2051H52.6219C52.3648 32.9226 52.4005 31.6022 52.4359 30.296C52.5065 27.6838 52.5757 25.1287 50.2975 23.0486C52.4583 20.7805 53.1759 16.7441 51.731 13.9452C50.2009 10.9815 47.8084 11.0984 45.3352 11.0984ZM48.6717 16.8885C48.6939 20.8126 48.5951 21.5931 45.2304 21.6571C45.2304 19.3881 45.2304 16.7306 45.2304 14.5048C47.0252 14.5048 48.6592 14.6866 48.6717 16.8885ZM23.8476 17.4073H26.8794C26.6814 13.7142 25.3735 11.5708 22.8953 11.2123C20.631 10.8848 18.5387 11.186 17.1024 13.1453C15.6698 15.0996 15.7605 18.7214 17.3857 20.8592C18.0493 21.7321 18.8059 22.5349 19.5624 23.3376C20.343 24.1658 21.1235 24.9939 21.8016 25.8989C22.5156 26.8519 23.0091 28.1447 23.0961 29.3214C23.142 29.9437 22.7576 31.3712 21.5552 31.3121C20.5777 31.1532 20.1418 30.9353 19.7058 29.8453C19.537 29.3388 19.5854 28.44 19.6159 27.8756C19.6248 27.7113 19.6321 27.5753 19.6321 27.4856H16.1138C16.0995 27.7324 16.079 27.9658 16.0594 28.1898C16.0191 28.6485 15.9823 29.0679 16.0092 29.4832C16.2182 32.6968 18.6357 34.753 22.0229 34.6363C24.9777 34.5346 26.8794 31.3121 26.8329 28.9659C26.7865 26.6196 25.5915 24.8316 24.2512 22.999C23.6338 22.1549 23.0247 21.534 22.4598 20.9583C21.7983 20.2841 21.1974 19.6716 20.7152 18.835C20.1361 17.8301 19.4878 16.5481 19.9238 15.4581C20.3598 14.3682 21.5611 14.0802 22.5473 14.5125C23.5023 14.9312 23.8476 15.7583 23.8476 16.7178C23.8476 16.9871 23.8066 17.2957 23.8476 17.4073ZM74.4219 11.534H84.3986V14.7742H78.193V21.0397H83.0441V24.0929H82.7052H78.3285V31.0495H84.4491V34.2047H74.4217C74.4219 26.7314 74.4219 19.2518 74.4219 11.534ZM54.8039 34.2047H58.2917V11.0984H54.8039V34.2047Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-SaBa"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M48.6816 25.4392H46.8146V27.1964H48.6816C48.915 27.1737 49.1403 27.0986 49.3406 26.9768C49.5603 26.7571 49.5603 26.6473 49.5603 26.3178C49.5375 26.0844 49.4624 25.8592 49.3406 25.6588C49.2538 25.5758 49.1497 25.5131 49.0358 25.4751C48.9218 25.4371 48.8009 25.4248 48.6816 25.4392Z"
      fill="currentColor"
    ></path>
    <path
      d="M36.1619 32.1387C36.7164 33.345 37.3397 34.5184 38.0289 35.6532C38.1387 35.8728 38.2486 35.9827 38.3584 36.2023C38.0011 35.2715 37.7075 34.3175 37.4798 33.3468C37.1503 33.0173 36.6012 32.578 36.1619 32.1387Z"
      fill="currentColor"
    ></path>
    <path
      d="M37.37 32.3584C36.9317 30.4491 36.7106 28.4965 36.711 26.5376C36.711 25.4393 36.8208 24.341 36.9306 23.2428C35.6239 21.2282 34.5898 19.0493 33.8555 16.763C33.3293 21.4859 33.9315 26.2662 35.6127 30.711C36.1619 31.2601 36.711 31.8092 37.37 32.3584Z"
      fill="currentColor"
    ></path>
    <path
      d="M37.3699 24.1214C37.2727 24.9597 37.236 25.8038 37.2601 26.6474C37.2905 28.8282 37.5481 30.9998 38.0289 33.1272C41.3159 35.8226 45.2558 37.6031 49.4509 38.289C50.574 38.4976 51.7132 38.6078 52.8555 38.6185C55.0893 38.0351 57.2326 37.1482 59.2254 35.9827C54.914 35.8271 50.6972 34.6753 46.9054 32.6175C43.1136 30.5596 39.8499 27.6516 37.3699 24.1214Z"
      fill="currentColor"
    ></path>
    <path
      d="M38.3584 34.0058C38.718 35.2919 39.196 36.5419 39.7861 37.7399C42.0445 38.5646 44.4139 39.0459 46.815 39.1676C48.1003 39.2098 49.3868 39.1363 50.659 38.948C50.2489 38.9238 49.8432 38.8501 49.4509 38.7283C45.4247 38.0784 41.6174 36.4575 38.3584 34.0058Z"
      fill="currentColor"
    ></path>
    <path
      d="M50 6C46.2422 6 42.5687 7.11433 39.4442 9.20208C36.3196 11.2898 33.8844 14.2572 32.4463 17.729C31.0082 21.2008 30.632 25.0211 31.3651 28.7067C32.0982 32.3923 33.9078 35.7778 36.565 38.435C39.2222 41.0922 42.6076 42.9018 46.2933 43.6349C49.9789 44.368 53.7992 43.9918 57.271 42.5537C60.7428 41.1156 63.7102 38.6804 65.7979 35.5558C67.8857 32.4313 69 28.7578 69 25C68.9971 19.9618 66.9944 15.1307 63.4318 11.5682C59.8693 8.00562 55.0382 6.00291 50 6ZM63.948 29.3931H61.6416L59.0058 24.5607L53.5145 26.5376L57.9075 18.5202L63.948 29.3931ZM57.2486 10.7225L62.4104 20.1676H60.1041L57.7977 15.9942L53.6243 17.3121L57.2486 10.7225ZM52.7457 18.7399L55.6012 17.8613L54.3931 20.1676H52.0867L52.7457 18.7399ZM52.6358 27.9653L55.4913 27.0867L54.2832 29.3931H51.9769L52.6358 27.9653ZM51.6474 22.5838C51.6654 23.2995 51.4323 23.9989 50.9884 24.5607C51.2323 24.8664 51.4136 25.2171 51.5219 25.5929C51.6302 25.9687 51.6633 26.3621 51.6195 26.7508C51.5756 27.1394 51.4556 27.5155 51.2663 27.8577C51.077 28.1999 50.8221 28.5014 50.5162 28.7451C49.9968 29.1642 49.3495 29.3929 48.6821 29.3931H44.6185V21.9249H46.7052V23.4624H48.6821C48.9155 23.4397 49.1407 23.3646 49.341 23.2428C49.5607 23.0231 49.5607 22.9133 49.5607 22.5838C49.5607 22.3462 49.4836 22.115 49.341 21.9249C50.0453 21.7203 50.6872 21.3428 51.2081 20.8266C51.4845 21.3719 51.6347 21.9725 51.6474 22.5838ZM50.4393 10.6127V12.8092H47.0347C46.8013 12.832 46.5761 12.9071 46.3757 13.0289C46.1561 13.2486 46.1561 13.3584 46.1561 13.6879C46.1788 13.9212 46.2539 14.1465 46.3757 14.3468C46.5954 14.5665 46.7052 14.5665 47.0347 14.5665H48.133C48.9487 14.5773 49.7313 14.8904 50.3295 15.4451C50.6137 15.7351 50.8377 16.0785 50.9885 16.4555C51.1393 16.8325 51.2139 17.2356 51.2081 17.6416C51.1972 18.4573 50.8842 19.24 50.3295 19.8381C50.0395 20.1224 49.6961 20.3463 49.3191 20.4971C48.9421 20.6479 48.539 20.7226 48.133 20.7168H44.7283V18.5202H48.133C48.3663 18.4975 48.5916 18.4224 48.7919 18.3006C49.0116 18.0809 49.0116 17.9711 49.0116 17.6416C48.9888 17.4082 48.9137 17.183 48.7919 16.9827C48.7051 16.8996 48.601 16.8369 48.4871 16.7989C48.3731 16.7609 48.2522 16.7486 48.133 16.763H47.0347C46.219 16.7522 45.4363 16.4391 44.8382 15.8844C44.5539 15.5944 44.33 15.251 44.1792 14.874C44.0284 14.497 43.9537 14.0939 43.9595 13.6879C43.9704 12.8722 44.2835 12.0895 44.8382 11.4913C45.1281 11.2071 45.4715 10.9831 45.8485 10.8323C46.2256 10.6815 46.6287 10.6069 47.0347 10.6127H50.4393ZM65.2659 35.4335C65.0462 35.763 64.7168 36.2023 64.4971 36.5318C61.0413 38.2235 57.252 39.1239 53.4046 39.1676H53.0751C51.2776 39.6056 49.434 39.8268 47.5838 39.8266H46.7052C44.4946 39.7727 42.3069 39.3648 40.2254 38.6185C41.5349 40.2029 43.0492 41.6063 44.7283 42.7919C44.0694 42.5722 43.5202 42.3526 42.9711 42.1329C42.3336 41.6417 41.7452 41.09 41.2139 40.4855C41.4436 40.8695 41.7006 41.2365 41.9827 41.5838C38.8508 40.052 36.1936 37.6985 34.2948 34.7746C35.5794 35.7513 36.9815 36.563 38.4682 37.1907C38.1387 36.7514 37.9191 36.422 37.5896 35.9827C36.5771 34.4281 35.7305 32.7716 35.0636 31.0405C34.0876 29.9844 33.2057 28.8452 32.4278 27.6358C32.0739 27.1607 31.7789 26.6444 31.5491 26.0983V24.8902C31.5608 21.5618 32.4715 18.2985 34.185 15.4451C34.8329 17.9176 35.8314 20.2846 37.1503 22.474C38.0155 16.5682 40.8849 11.1396 45.2775 7.09827L46.4856 6.76879C41.6554 11.0125 38.5328 16.8674 37.6994 23.2428C40.0301 26.9592 43.2708 30.0192 47.1145 32.1333C50.9583 34.2474 55.278 35.3455 59.6647 35.3237H60.2139C62.4033 33.8306 64.2571 31.897 65.6565 29.6466C67.0559 27.3961 67.9703 24.8784 68.341 22.2543C68.4379 23.1661 68.4746 24.0834 68.4509 25C68.4384 28.6812 67.3296 32.2753 65.2659 35.3237C63.64 35.6654 61.9849 35.8493 60.3237 35.8728C58.7341 36.9873 56.9967 37.8744 55.1619 38.5087C58.722 38.2766 62.1801 37.2241 65.2659 35.4335Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-Spribe2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 50"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.0777 11.3055C30.8551 10.5866 33.289 10.7395 33.415 16.2593C33.541 21.7791 33.2413 25.6941 26.5309 25.9013V29.9225V34.2044H23.0776C23.0777 26.6692 23.0777 19.071 23.0777 11.3055ZM26.6153 22.2102C29.4513 22.3654 29.8156 22.0272 29.8575 19.3824C29.8677 18.742 29.8669 18.101 29.8582 17.4605C29.8195 14.6403 29.4441 14.3347 26.6153 14.8919V22.2102ZM55.3405 11.0975C55.6053 11.0975 55.9395 11.0832 56.3244 11.0667C58.7917 10.9611 63.3413 10.7665 65.0119 13.6818C66.5615 16.386 65.9707 19.5961 63.817 22.2078C66.8746 24.775 66.5169 28.2863 65.5553 31.5055C65.1702 32.7945 63.1831 34.0206 61.7218 34.3851C59.7535 34.8761 55.3404 34.5069 55.3404 34.5069C55.3405 26.8356 55.3405 19.2014 55.3405 11.0975ZM58.8514 23.7742V31.5093C58.8868 31.5093 58.9271 31.5095 58.9717 31.5098C59.7213 31.5144 61.6819 31.5265 62.0151 30.4901C62.3682 29.392 62.752 26.7925 62.0015 25.1674C61.2511 23.5424 60.3541 23.3047 58.8514 23.7742ZM58.8048 21.137C59.2642 21.137 61.2014 20.9214 61.7587 19.6062C62.316 18.291 62.752 16.9831 61.7073 15.4577C60.6627 13.9324 58.8048 14.5048 58.8048 14.5048V21.137ZM89.5 35.9482V39H10V35.9482H89.5ZM39.3352 11.0984C37.9021 11.0984 36.9631 11.0667 35.7225 11.0984V34.1661H39.2984V25.2222C41.8101 24.7687 42.7427 25.7993 42.6796 28.0601C42.6402 29.4718 42.6497 30.8849 42.6592 32.3077C42.6634 32.9377 42.6676 33.5705 42.6676 34.2051H46.6219C46.3648 32.9226 46.4005 31.6022 46.4359 30.296C46.5065 27.6838 46.5757 25.1287 44.2975 23.0486C46.4583 20.7805 47.1759 16.7441 45.731 13.9452C44.2009 10.9815 41.8084 11.0984 39.3352 11.0984ZM42.6717 16.8885C42.6939 20.8126 42.5951 21.5931 39.2304 21.6571C39.2304 19.3881 39.2304 16.7306 39.2304 14.5048C41.0252 14.5048 42.6592 14.6866 42.6717 16.8885ZM17.8476 17.4073H20.8794C20.6814 13.7142 19.3735 11.5708 16.8953 11.2123C14.631 10.8848 12.5387 11.186 11.1024 13.1453C9.66978 15.0996 9.76047 18.7214 11.3857 20.8592C12.0493 21.7321 12.8059 22.5349 13.5624 23.3376C14.343 24.1658 15.1235 24.9939 15.8016 25.8989C16.5156 26.8519 17.0091 28.1447 17.0961 29.3214C17.142 29.9437 16.7576 31.3712 15.5552 31.3121C14.5777 31.1532 14.1418 30.9353 13.7058 29.8453C13.537 29.3388 13.5854 28.44 13.6159 27.8756C13.6248 27.7113 13.6321 27.5753 13.6321 27.4856H10.1138C10.0995 27.7324 10.079 27.9658 10.0594 28.1898C10.0191 28.6485 9.98227 29.0679 10.0092 29.4832C10.2182 32.6968 12.6357 34.753 16.0229 34.6363C18.9777 34.5346 20.8794 31.3121 20.8329 28.9659C20.7865 26.6196 19.5915 24.8316 18.2512 22.999C17.6338 22.1549 17.0247 21.534 16.4598 20.9583C15.7983 20.2841 15.1974 19.6716 14.7152 18.835C14.1361 17.8301 13.4878 16.5481 13.9238 15.4581C14.3598 14.3682 15.5611 14.0802 16.5473 14.5125C17.5023 14.9312 17.8476 15.7583 17.8476 16.7178C17.8476 16.9871 17.8066 17.2957 17.8476 17.4073ZM68.4219 11.534H78.3986V14.7742H72.193V21.0397H77.0441V24.0929H76.7052H72.3285V31.0495H78.4491V34.2047H68.4217C68.4219 26.7314 68.4219 19.2518 68.4219 11.534ZM48.8038 34.2047H52.2916V11.0984H48.8038V34.2047Z"
      fill="currentColor"
    ></path>
    <path
      d="M79 31.538C79 29.9182 79.2683 28.5361 79.8049 27.3915C80.3415 26.2253 81.3028 24.9403 82.689 23.5365C84.0528 22.1328 84.9919 20.9342 85.5061 19.9408C86.0427 18.9473 86.311 18.4108 86.311 17.331C86.311 16.3592 86.1433 15.6897 85.8079 15.3225C85.4949 14.9338 85.0254 14.7394 84.3994 14.7394C83.125 14.7394 82.4878 15.4845 82.4878 16.9746V19.4042H79V17.2014C79 15.3657 79.4695 13.962 80.4085 12.9901C81.3476 11.9967 82.7114 11.5 84.5 11.5C86.2886 11.5 87.6524 11.9967 88.5915 12.9901C89.5305 13.962 90 15.3657 90 17.2014C90 18.5836 89.6535 19.4333 88.9604 20.7506C88.2896 22.068 87.1159 23.5797 85.439 25.2858C84.3435 26.4088 83.6057 27.3267 83.2256 28.0394C82.8455 28.7304 82.6555 29.4755 82.6555 30.2746V30.7605H89.6646V33.9999H79V31.538Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-TB"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M68.0002 24.4287C68.0002 34.0544 59.9413 41.8575 50.0001 41.8575C49.0978 41.8575 48.211 41.7932 47.3444 41.6691V38.4839C48.2059 38.6355 49.0935 38.7147 50.0002 38.7147C58.1487 38.7147 64.7544 32.3187 64.7544 24.4289C64.7544 16.539 58.1487 10.143 50.0002 10.143C47.2482 10.143 44.6722 10.8726 42.4672 12.1428H37.2329C40.4934 8.96647 45.0096 7 50.0001 7C59.9413 7 68.0002 14.8031 68.0002 24.4287ZM42.0329 36.4548V40.0615C36.0882 37.2157 32 31.2845 32 24.4287C32 21.8834 32.5635 19.4656 33.5763 17.2857H37.22C35.9645 19.387 35.246 21.8267 35.246 24.4289C35.246 29.4771 37.9504 33.9138 42.0329 36.4548ZM55.6063 12.9997H34.8029L32.7374 16.1426C35.5353 16.1426 39.049 16.1305 42.6227 16.1132V41.8571L46.4588 43V16.0931C53.768 16.0518 60.3277 15.9998 60.3277 15.9998C60.3277 15.9998 59.8851 15.0632 58.8523 14.2855C57.8195 13.5077 56.7867 12.9997 55.6063 12.9997ZM51.4752 17.2855H47.6391V33.7142H56.3441C59.4565 33.7142 61.6556 30.7142 61.9506 28.857V26.2856C61.9506 23.5713 59.4424 22.5712 59.4424 22.5712C59.4424 22.5712 60.9179 21.7141 60.9179 19.4284V17.2855H57.2293V19.4284C57.2293 20.6855 55.9014 21.2855 55.1637 21.2855H51.4752V17.2855ZM55.9014 24.7141H51.4752V30.4285H55.7539C57.5244 30.4285 58.2621 28.857 58.2621 28.1427V26.9999C58.2621 25.7427 56.7867 24.7141 55.9014 24.7141Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-TB_Chess"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M68.0002 24.4287C68.0002 34.0544 59.9413 41.8575 50.0001 41.8575C49.0978 41.8575 48.211 41.7932 47.3444 41.6691V38.4839C48.2059 38.6355 49.0935 38.7147 50.0002 38.7147C58.1487 38.7147 64.7544 32.3187 64.7544 24.4289C64.7544 16.539 58.1487 10.143 50.0002 10.143C47.2482 10.143 44.6722 10.8726 42.4672 12.1428H37.2329C40.4934 8.96647 45.0096 7 50.0001 7C59.9413 7 68.0002 14.8031 68.0002 24.4287ZM42.0329 36.4548V40.0615C36.0882 37.2157 32 31.2845 32 24.4287C32 21.8834 32.5635 19.4656 33.5763 17.2857H37.22C35.9645 19.387 35.246 21.8267 35.246 24.4289C35.246 29.4771 37.9504 33.9138 42.0329 36.4548ZM55.6063 12.9997H34.8029L32.7374 16.1426C35.5353 16.1426 39.049 16.1305 42.6227 16.1132V41.8571L46.4588 43V16.0931C53.768 16.0518 60.3277 15.9998 60.3277 15.9998C60.3277 15.9998 59.8851 15.0632 58.8523 14.2855C57.8195 13.5077 56.7867 12.9997 55.6063 12.9997ZM51.4752 17.2855H47.6391V33.7142H56.3441C59.4565 33.7142 61.6556 30.7142 61.9506 28.857V26.2856C61.9506 23.5713 59.4424 22.5712 59.4424 22.5712C59.4424 22.5712 60.9179 21.7141 60.9179 19.4284V17.2855H57.2293V19.4284C57.2293 20.6855 55.9014 21.2855 55.1637 21.2855H51.4752V17.2855ZM55.9014 24.7141H51.4752V30.4285H55.7539C57.5244 30.4285 58.2621 28.857 58.2621 28.1427V26.9999C58.2621 25.7427 56.7867 24.7141 55.9014 24.7141Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-V8Card"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M37.2572 7.25285L37.5 8L41.5557 21.3042H41.7223L45.9999 8L46.2026 7.25285H50.4999L49.9999 8L44.0891 25.7471H39.1976L33.2504 8L32.4999 7.25285H37.2572Z"
      fill="currentColor"
    ></path>
    <path
      d="M59.031 26C57.681 26 56.48 25.7742 55.4281 25.3227C54.382 24.8652 53.5609 24.2421 52.9648 23.4534C52.3687 22.6648 52.0707 21.7708 52.0707 20.7714C52.0707 20.0008 52.2402 19.2934 52.5791 18.6492C52.9239 17.999 53.3914 17.4602 53.9817 17.0328C54.5719 16.5993 55.2323 16.3224 55.9628 16.202V16.0756C55.0044 15.8769 54.2271 15.3983 53.631 14.6397C53.035 13.8752 52.7369 12.9872 52.7369 11.9758C52.7369 11.0185 53.0087 10.1667 53.5522 9.42015C54.0956 8.66762 54.8408 8.07763 55.7875 7.65019C56.7401 7.21673 57.8212 7 59.031 7C60.2407 7 61.3189 7.21673 62.2657 7.65019C63.2182 8.08365 63.9663 8.67665 64.5098 9.42918C65.0533 10.1757 65.328 11.0246 65.3338 11.9758C65.328 12.9932 65.0241 13.8812 64.4221 14.6397C63.8202 15.3983 63.0488 15.8769 62.1079 16.0756V16.202C62.8267 16.3224 63.4783 16.5993 64.0627 17.0328C64.653 17.4602 65.1205 17.999 65.4653 18.6492C65.8159 19.2934 65.9942 20.0008 66 20.7714C65.9942 21.7708 65.6932 22.6648 65.0971 23.4534C64.501 24.2421 63.677 24.8652 62.6251 25.3227C61.579 25.7742 60.3809 26 59.031 26ZM59.031 23.1283C59.6329 23.1283 60.1589 23.017 60.6089 22.7942C61.0589 22.5654 61.4095 22.2524 61.6608 21.855C61.9179 21.4517 62.0465 20.9881 62.0465 20.4644C62.0465 19.9285 61.915 19.456 61.652 19.0466C61.389 18.6312 61.0326 18.3061 60.5826 18.0713C60.1326 17.8305 59.6154 17.7101 59.031 17.7101C58.4524 17.7101 57.9352 17.8305 57.4794 18.0713C57.0235 18.3061 56.6641 18.6312 56.4011 19.0466C56.144 19.456 56.0154 19.9285 56.0154 20.4644C56.0154 20.9881 56.1411 21.4517 56.3924 21.855C56.6437 22.2524 56.9972 22.5654 57.4531 22.7942C57.9089 23.017 58.4349 23.1283 59.031 23.1283ZM59.031 14.8655C59.5336 14.8655 59.9806 14.7601 60.3722 14.5494C60.7637 14.3387 61.0705 14.0467 61.2926 13.6735C61.5147 13.3002 61.6257 12.8698 61.6257 12.3821C61.6257 11.9005 61.5147 11.4791 61.2926 11.1179C61.0705 10.7506 60.7667 10.4647 60.3809 10.26C59.9952 10.0493 59.5452 9.94392 59.031 9.94392C58.5225 9.94392 58.0725 10.0493 57.681 10.26C57.2894 10.4647 56.9826 10.7506 56.7605 11.1179C56.5443 11.4791 56.4362 11.9005 56.4362 12.3821C56.4362 12.8698 56.5472 13.3002 56.7693 13.6735C56.9914 14.0467 57.2982 14.3387 57.6898 14.5494C58.0813 14.7601 58.5284 14.8655 59.031 14.8655Z"
      fill="currentColor"
    ></path>
    <path
      d="M15 43.7871V28.2129H20.9905C22.1421 28.2129 23.1232 28.4385 23.9338 28.8897C24.7444 29.3359 25.3623 29.9569 25.7873 30.7529C26.2173 31.5437 26.4323 32.4563 26.4323 33.4905C26.4323 34.5247 26.2149 35.4373 25.7799 36.2281C25.345 37.019 24.7148 37.635 23.8894 38.076C23.0689 38.5171 22.0754 38.7376 20.9089 38.7376H17.0907V36.0989H20.39C21.0078 36.0989 21.5169 35.9899 21.9172 35.7719C22.3225 35.5488 22.624 35.2421 22.8217 34.8517C23.0244 34.4563 23.1257 34.0025 23.1257 33.4905C23.1257 32.9734 23.0244 32.5222 22.8217 32.1369C22.624 31.7465 22.3225 31.4449 21.9172 31.2319C21.5119 31.0139 20.9979 30.9049 20.3751 30.9049H18.2103V43.7871H15Z"
      fill="currentColor"
    ></path>
    <path
      d="M42.4706 36C42.4706 37.6984 42.1568 39.1432 41.5291 40.3346C40.9063 41.526 40.0561 42.436 38.9786 43.0646C37.9061 43.6882 36.7001 44 35.3606 44C34.0113 44 32.8003 43.6857 31.7278 43.057C30.6552 42.4284 29.8076 41.5184 29.1848 40.327C28.562 39.1356 28.2506 37.6933 28.2506 36C28.2506 34.3016 28.562 32.8568 29.1848 31.6654C29.8076 30.474 30.6552 29.5665 31.7278 28.943C32.8003 28.3143 34.0113 28 35.3606 28C36.7001 28 37.9061 28.3143 38.9786 28.943C40.0561 29.5665 40.9063 30.474 41.5291 31.6654C42.1568 32.8568 42.4706 34.3016 42.4706 36ZM39.2159 36C39.2159 34.8999 39.0553 33.9721 38.734 33.2167C38.4177 32.4613 37.9703 31.8885 37.3921 31.4981C36.8138 31.1077 36.1366 30.9125 35.3606 30.9125C34.5846 30.9125 33.9075 31.1077 33.3292 31.4981C32.7509 31.8885 32.3011 32.4613 31.9799 33.2167C31.6635 33.9721 31.5054 34.8999 31.5054 36C31.5054 37.1001 31.6635 38.0279 31.9799 38.7833C32.3011 39.5387 32.7509 40.1115 33.3292 40.5019C33.9075 40.8923 34.5846 41.0875 35.3606 41.0875C36.1366 41.0875 36.8138 40.8923 37.3921 40.5019C37.9703 40.1115 38.4177 39.5387 38.734 38.7833C39.0553 38.0279 39.2159 37.1001 39.2159 36Z"
      fill="currentColor"
    ></path>
    <path
      d="M44.8487 43.7871V28.2129H48.0589V35.0798H48.2591L53.7232 28.2129H57.571L51.9364 35.1863L57.6378 43.7871H53.7973L49.6381 37.384L48.0589 39.3612V43.7871H44.8487Z"
      fill="currentColor"
    ></path>
    <path
      d="M59.2429 43.7871V28.2129H69.4742V30.9278H62.4531V34.6388H68.9478V37.3536H62.4531V41.0722H69.5038V43.7871H59.2429Z"
      fill="currentColor"
    ></path>
    <path
      d="M72.0264 43.7871V28.2129H78.0169C79.1636 28.2129 80.1423 28.4233 80.9529 28.8441C81.7684 29.2598 82.3887 29.8504 82.8138 30.616C83.2438 31.3764 83.4588 32.2712 83.4588 33.3004C83.4588 34.3346 83.2413 35.2243 82.8064 35.9696C82.3714 36.7098 81.7412 37.2776 80.9158 37.673C80.0953 38.0684 79.1018 38.2662 77.9354 38.2662H73.9244V35.6198H77.4164C78.0293 35.6198 78.5384 35.5336 78.9437 35.3612C79.349 35.1888 79.6505 34.9303 79.8482 34.5856C80.0508 34.2408 80.1522 33.8124 80.1522 33.3004C80.1522 32.7833 80.0508 32.3473 79.8482 31.9924C79.6505 31.6375 79.3465 31.3688 78.9363 31.1863C78.531 30.9987 78.0194 30.9049 77.4016 30.9049H75.2367V43.7871H72.0264ZM80.2263 36.6996L84 43.7871H80.4561L76.764 36.6996H80.2263Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-WM"
    viewBox="0 0 100 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="WMçœŸäººè§†è®¯">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.2305 9.94264C40.6064 6.87323 45.0886 5 50 5C60.4766 5 69 13.5234 68.9999 24.0001C68.9999 27.5644 68.0125 30.902 66.2982 33.7555C65.7399 34.6846 65.1048 35.5625 64.4011 36.38L60.5296 26.3465L57.055 35.236H56.9975L53.523 26.3598L50.3033 34.6258H47.4335L53.5067 19.0436L53.5106 19.034L53.523 19.0385L53.5353 19.0343L53.5394 19.0444L57.0264 27.9924L60.5134 19.0445L60.5173 19.0344L60.5297 19.0387L60.5421 19.0344L60.546 19.0445L65.0141 30.467C65.8722 28.4825 66.3488 26.296 66.3488 24C66.3488 14.9852 59.0148 7.65114 50 7.65114C45.4048 7.65114 41.2473 9.55742 38.2743 12.6198L37.2305 9.94264ZM50 40.3488C54.4864 40.3488 58.556 38.532 61.513 35.596L62.5491 38.2531C59.1995 41.2058 54.8057 43.0001 50 43.0001C39.5234 43.0001 31 34.4767 31 24C31 20.5145 31.9444 17.2458 33.5893 14.4346C34.1322 13.5067 34.7514 12.6289 35.4385 11.8096L39.3835 21.9325L42.8581 13.0165H42.9155L46.3901 21.9325L49.631 13.6161H52.5033L46.4064 29.2611L46.4025 29.2712L46.3901 29.2669L46.3777 29.2712L46.3738 29.2611L42.8868 20.3131L39.3998 29.2611L39.3959 29.2712L39.3835 29.2669L39.3711 29.2712L39.3672 29.2611L34.8875 17.7657C34.0915 19.6879 33.6511 21.7933 33.6511 23.9999C33.6511 33.0147 40.9852 40.3488 50 40.3488Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-WM_Video"
    viewBox="0 0 100 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="WMçœŸäººè§†è®¯">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.2305 9.94264C40.6064 6.87323 45.0886 5 50 5C60.4766 5 69 13.5234 68.9999 24.0001C68.9999 27.5644 68.0125 30.902 66.2982 33.7555C65.7399 34.6846 65.1048 35.5625 64.4011 36.38L60.5296 26.3465L57.055 35.236H56.9975L53.523 26.3598L50.3033 34.6258H47.4335L53.5067 19.0436L53.5106 19.034L53.523 19.0385L53.5353 19.0343L53.5394 19.0444L57.0264 27.9924L60.5134 19.0445L60.5173 19.0344L60.5297 19.0387L60.5421 19.0344L60.546 19.0445L65.0141 30.467C65.8722 28.4825 66.3488 26.296 66.3488 24C66.3488 14.9852 59.0148 7.65114 50 7.65114C45.4048 7.65114 41.2473 9.55742 38.2743 12.6198L37.2305 9.94264ZM50 40.3488C54.4864 40.3488 58.556 38.532 61.513 35.596L62.5491 38.2531C59.1995 41.2058 54.8057 43.0001 50 43.0001C39.5234 43.0001 31 34.4767 31 24C31 20.5145 31.9444 17.2458 33.5893 14.4346C34.1322 13.5067 34.7514 12.6289 35.4385 11.8096L39.3835 21.9325L42.8581 13.0165H42.9155L46.3901 21.9325L49.631 13.6161H52.5033L46.4064 29.2611L46.4025 29.2712L46.3901 29.2669L46.3777 29.2712L46.3738 29.2611L42.8868 20.3131L39.3998 29.2611L39.3959 29.2712L39.3835 29.2669L39.3711 29.2712L39.3672 29.2611L34.8875 17.7657C34.0915 19.6879 33.6511 21.7933 33.6511 23.9999C33.6511 33.0147 40.9852 40.3488 50 40.3488Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-Wickets9"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.3955 19.4099C31.5576 18.7315 31.7555 17.8605 32.0367 17.1285C33.3081 13.8227 35.2543 10.9423 37.9113 8.56318C39.7459 6.92055 41.8281 5.62745 44.12 4.68695C45.6216 4.07077 47.1788 3.65248 48.7881 3.3717C49.6859 3.21508 50.5891 3.14517 51.4857 3.05807C52.5222 2.95722 53.5837 2.96295 54.6855 3.27734C54.1667 3.55659 53.6305 3.68915 53.1337 3.8706C49.8331 5.07507 46.8048 6.77118 43.9767 8.80652C42.4172 9.92885 40.9117 11.1272 39.4952 12.4379C38.4127 13.4395 37.2785 14.3938 36.2873 15.4802C34.7614 17.153 33.125 18.7341 31.8053 20.5846C31.6632 20.784 31.354 21.234 31.1713 21.4055C31.1712 20.6415 31.2334 20.0883 31.3955 19.4099Z"
      fill="currentColor"
    ></path>
    <path
      d="M30.9781 28.4726C30.8024 27.8702 30.659 27.5658 30.5918 26.9446C30.4817 25.9319 30.8719 24.938 31.4981 24.2091C32.6065 22.9194 33.6263 21.5599 34.7219 20.2576C36.5522 18.0813 38.5432 16.0609 40.6316 14.1424C41.9937 12.891 43.4578 11.74 44.9756 10.6513C46.5444 9.52587 48.1576 8.48604 49.8566 7.58603C51.8673 6.52061 53.9576 5.61068 56.1812 5.04798C57.2033 4.78936 58.2363 4.57124 59.2608 4.32179C59.6116 4.23622 59.8774 4.46466 60.1667 4.55405C60.6376 4.69921 61.0618 4.98991 61.513 5.20307C61.62 5.25349 61.7421 5.26878 61.7204 5.41509C61.7 5.55414 61.5763 5.57171 61.4601 5.58699C58.5512 5.97205 55.854 7.04206 53.248 8.27709C50.7679 9.45214 48.4365 10.9034 46.2261 12.5533C43.4736 14.6077 40.8904 16.8394 38.5278 19.3095C37.0849 20.818 35.7077 22.3884 34.4105 24.0318C33.2462 25.5068 32.1112 26.9985 31.0149 28.5212C30.9936 28.5502 30.9781 28.4726 30.9781 28.4726Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.0273 42.9075C25.9936 43.0364 25.9561 43.3709 26.1486 43.3786C26.4528 42.9221 26.8233 42.4911 27.1911 42.0633C27.2911 41.9469 27.3909 41.8308 27.4891 41.7145C28.8338 40.1227 30.3226 38.6676 31.9281 37.3318C32.0186 37.2565 32.1024 37.1878 32.1826 37.122C32.43 36.9191 32.6427 36.7446 32.9096 36.4948C33.1437 36.2759 33.4904 36.0899 33.7488 36.5158C34.4372 37.6496 35.1832 38.7609 36.0778 39.7441C37.3503 41.1423 38.7507 42.422 40.3658 43.4359C42.2444 44.6147 44.1964 45.6423 46.376 46.2142C46.6209 46.2785 46.887 46.3676 47.1472 46.4547C47.4959 46.5714 47.834 46.6846 48.0966 46.7299C48.555 46.809 49.9071 47 50.6797 47H53.7702C53.9227 47 54.2131 46.974 54.573 46.9418C54.8392 46.918 55.1434 46.8908 55.4581 46.8682C56.0034 46.829 56.5205 46.6823 57.0391 46.5353C57.2244 46.4827 57.41 46.4301 57.597 46.3823C59.658 45.8563 61.5818 45.0323 63.3766 43.9248C64.4995 43.2319 65.5352 42.4213 66.5655 41.5873C67.8484 40.5494 68.8521 39.293 69.8213 38.0312C70.6692 36.9276 71.3638 35.6769 71.9274 34.3746C72.4582 33.148 72.9353 31.916 73.2556 30.6149C73.4571 29.7971 73.5827 28.9731 73.7086 28.1472C73.7466 27.8984 73.7845 27.6494 73.8246 27.4003C74.1317 25.4926 73.988 23.6051 73.7562 21.7359C73.536 19.96 73.0029 18.2272 72.2998 16.5609C71.4372 14.5171 70.2625 12.6579 68.8988 10.9076C68.1951 10.004 67.3485 9.24222 66.5019 8.48049C66.2072 8.21526 65.9124 7.95004 65.6237 7.67883C65.3019 7.37628 64.8951 7.07373 64.5042 7.13906C64.1268 7.2021 63.7479 7.25315 63.3687 7.30422C62.8104 7.37942 62.2516 7.45469 61.6965 7.56843C59.3794 8.04327 57.1705 8.80155 55.018 9.74816C50.5844 11.6979 46.7098 14.4858 43.153 17.6851C40.7166 19.8771 38.4443 22.2455 36.4027 24.8245C34.7741 26.882 33.1863 28.9639 31.7292 31.1406C29.8687 33.9197 28.5545 36.9681 27.2515 40.0245C27.1326 40.3032 26.9824 40.6522 26.8283 41.0104C26.4515 41.8859 26.0512 42.8161 26.0273 42.9075ZM53.7245 31.5618C54.5942 31.5285 55.1205 31.5084 56.088 30.7647C56.2615 30.6314 56.481 30.4538 56.6429 30.2945C56.6609 30.2696 56.6738 30.2524 56.6738 30.2524C56.6738 30.2524 56.6921 30.2618 56.6675 30.3827C56.6429 30.5035 56.4743 30.9557 56.4393 30.9909C56.4267 31.0035 56.3784 31.1255 56.3106 31.2966C56.1897 31.6019 56.0069 32.0633 55.8556 32.3363C55.2985 33.3413 54.5101 34.1802 53.6227 34.89C52.2131 36.0177 50.6833 36.9353 48.7522 36.8657C48.3352 36.8508 47.9175 36.8545 47.4998 36.8582C47.13 36.8615 46.7602 36.8647 46.3907 36.8551C45.9723 36.844 45.7228 36.9372 45.5791 37.388C45.4205 37.8847 45.1974 38.3622 44.9746 38.8388C44.9119 38.9731 44.8491 39.1073 44.7879 39.2418C44.6175 39.6158 44.6836 39.7927 45.1367 39.785C45.9932 39.7705 46.8504 39.7705 47.7068 39.7831C49.4232 39.8083 51.1067 39.5983 52.7319 39.0497C54.3107 38.5168 55.7181 37.6817 57.0697 36.7087C58.9889 35.3274 60.5739 33.6714 61.7097 31.6257C62.2456 30.6601 62.6462 29.6285 63.0467 28.5972C63.1315 28.3789 63.2163 28.1605 63.3024 27.9428C63.7786 26.7384 64.2761 25.5421 64.7736 24.3459C65.3463 22.9686 65.9191 21.5914 66.4593 20.2018C66.8174 19.2812 66.8197 18.2979 66.4075 17.3345C65.718 15.7236 64.2801 15.3805 62.7743 15.298C61.2035 15.2121 59.6248 15.2453 58.0491 15.2784C57.8879 15.2818 57.7268 15.2852 57.5658 15.2884C57.0237 15.2994 56.4793 15.415 55.9434 15.5288C55.9026 15.5375 55.8619 15.5461 55.8212 15.5547C54.621 15.8084 53.5563 16.3837 52.621 17.1305C51.4718 18.0485 50.3812 19.0501 49.7987 20.4505C49.6244 20.8695 49.447 21.2873 49.2697 21.7052C48.802 22.8072 48.3342 23.9091 47.9228 25.0312C47.8356 25.269 47.7388 25.5044 47.642 25.7399C47.2483 26.6979 46.8538 27.6578 47.0972 28.7905C47.4754 30.5508 48.4385 31.4344 50.1896 31.5394C50.7605 31.5736 51.3341 31.5639 51.9078 31.5542C52.47 31.5447 53.0322 31.5352 53.5918 31.5669C53.637 31.5651 53.6812 31.5634 53.7245 31.5618Z"
      fill="currentColor"
    ></path>
    <path
      d="M59.0025 18.3861C60.3689 18.2047 61.3648 19.322 60.6084 20.8837C59.8289 22.4927 59.2073 24.18 58.3682 25.7562C57.5496 27.2942 56.1589 28.1071 54.3588 28.0757C53.2172 28.0559 52.472 26.9397 52.9167 25.9323C53.702 24.1533 54.5361 22.3949 55.3253 20.6178C55.7471 19.6685 57.8606 18.1527 59.0025 18.3861Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-YGG"
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M46.1445 18.5129C42.3913 17.775 39.1313 16.3627 36.2798 14.1038C35.6913 13.6377 35.1737 13.0828 34.569 12.6404C33.6978 12.0027 33.7852 11.4302 34.5749 10.8284C34.603 10.8069 34.6234 10.7758 34.6501 10.7522C35.4502 10.0394 36.1447 8.98273 37.0794 8.70649C38.1137 8.40065 38.6128 9.80744 39.4301 10.365C40.9056 11.3721 42.3936 12.3154 44.3078 12.9522C43.5099 10.8946 42.9813 8.97082 42.5415 7.01792C42.3008 5.94932 42.5517 5.41832 43.6922 5.18443C44.7824 4.96075 46.0262 4.23331 46.9141 4.60299C47.8308 4.9848 47.4498 6.48501 47.7317 7.47444C48.2851 9.41733 48.9212 11.32 49.98 13.221C51.1034 11.3704 51.7331 9.45202 52.2411 7.48976C52.4093 6.84043 52.6153 6.17088 52.6051 5.51346C52.588 4.41357 53.1871 4.42208 53.9722 4.61554C54.7762 4.81368 55.5676 5.07993 56.382 5.2138C57.5128 5.39981 57.6655 6.00955 57.4534 6.98941C57.0293 8.95081 56.5033 10.8803 55.6778 12.9662C58.0078 12.1615 59.8623 11.0133 61.5178 9.53183C62.7602 8.42003 62.8123 8.36341 63.9953 9.49246C66.8368 12.2045 66.862 11.4092 63.8936 13.9418C61.0716 16.3493 57.7095 17.7691 53.8436 18.5022C55.2509 20.0322 56.7426 21.2132 58.3628 22.2454C58.812 22.5317 58.9992 22.0518 59.2344 21.8423C61.8856 19.4827 64.8982 17.7216 68.2477 16.4859C68.937 16.2316 69.2878 16.3206 69.4964 17.0384C69.792 18.0557 70.1382 19.0598 70.4912 20.0599C70.6989 20.6488 70.5417 20.918 69.9114 21.1274C67.7425 21.8483 65.7713 22.9486 63.9636 24.3271C63.8318 24.4278 63.7182 24.5514 63.5087 24.7453C65.6761 25.5557 67.8145 25.9922 70.0088 26.1101C70.8765 26.1567 71.112 26.4198 70.9544 27.2507C70.7633 28.2576 70.594 29.2661 70.3618 30.2671C70.2193 30.8813 69.9689 31.0332 69.3282 30.9762C63.025 30.4152 57.4677 28.1252 52.6355 24.1353C51.9466 23.5664 51.2556 22.9844 50.6624 22.3246C50.155 21.7606 49.8748 21.7887 49.3399 22.3229C45.5431 26.1157 41.0209 28.7207 35.7756 30.0972C34.0668 30.5457 32.3298 30.8347 30.5649 30.9864C30.0213 31.0332 29.801 30.8943 29.67 30.3699C29.3955 29.2689 29.196 28.1601 29.0262 27.0398C28.9267 26.3834 29.0965 26.1695 29.773 26.1342C31.8329 26.0265 33.8459 25.6372 35.8032 24.992C35.999 24.9275 36.2449 24.9385 36.4014 24.6233C34.5781 23.1361 32.5406 21.9773 30.291 21.2056C29.5334 20.9457 29.2383 20.6443 29.5375 19.8662C29.8801 18.9754 30.185 18.0683 30.4543 17.1536C30.6802 16.3867 31.0271 16.2075 31.8376 16.5127C35.1096 17.7444 38.0931 19.4319 40.6467 21.7853C41.2675 22.3574 41.6523 22.298 42.2612 21.8545C43.6105 20.8718 44.9138 19.8509 46.1445 18.5129Z"
      fill="currentColor"
    ></path>
    <path
      d="M49.9974 33.6367C51.5887 31.6098 53.1375 29.7046 54.5987 27.7368C55.0811 27.0872 55.4161 27.0876 56.054 27.4935C56.9573 28.0679 57.9194 28.5702 58.9022 29.0027C59.5866 29.3036 59.53 29.5247 59.1154 30.0429C57.0922 32.573 55.1292 35.1497 53.1043 37.6785C52.6498 38.2459 52.4731 38.8063 52.4904 39.5144C52.5321 41.2095 52.4794 42.9068 52.5165 44.6022C52.5301 45.2272 52.3502 45.5129 51.6797 45.4967C50.5637 45.4699 49.4458 45.4673 48.3297 45.499C47.6725 45.5175 47.4657 45.2741 47.48 44.6307C47.5201 42.8293 47.4774 41.0265 47.5043 39.2247C47.5121 38.6992 47.3686 38.2857 47.0401 37.8709C44.9624 35.2478 42.9206 32.5973 40.8312 29.9831C40.4192 29.4679 40.501 29.2849 41.0708 29.0175C42.1092 28.5306 43.1363 28.0051 44.1068 27.4011C44.6662 27.053 44.9253 27.1257 45.3074 27.6293C46.8124 29.6111 48.3668 31.5566 49.9974 33.6367Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-giftHistory"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 12.0769C15 13.1282 15.8139 14 16.8498 14C17.8857 14 18.6996 13.1282 18.6996 12.0513V7H29.3005V12.0769C29.3005 13.1282 30.1144 14 31.1502 14C32.1861 14 33 13.1282 33 12.0513V7H33.24C34.5191 7 35.7856 7.25193 36.9673 7.74141C38.149 8.23089 39.2228 8.94834 40.1272 9.85278C41.0317 10.7572 41.7491 11.831 42.2386 13.0127C42.7281 14.1944 42.98 15.4609 42.98 16.74V34.26C42.98 35.5391 42.7281 36.8056 42.2386 37.9873C41.7491 39.169 41.0317 40.2428 40.1272 41.1472C39.2228 42.0517 38.149 42.7691 36.9673 43.2586C35.7856 43.7481 34.5191 44 33.24 44H14.74C9.36 44 5 39.64 5 34.24V16.74C5 14.1568 6.02618 11.6794 7.85278 9.85278C9.67938 8.02618 12.1568 7 14.74 7H15V12.0769Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M16.8438 13.6396C16.0038 13.6396 15.3438 12.9596 15.3438 12.1396V6.55957C15.3438 6.16175 15.5018 5.78021 15.7831 5.49891C16.0644 5.21761 16.4459 5.05957 16.8438 5.05957C17.2416 5.05957 17.6231 5.21761 17.9044 5.49891C18.1857 5.78021 18.3438 6.16175 18.3438 6.55957V12.1196C18.3438 12.9596 17.6837 13.6396 16.8438 13.6396Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M31.1406 13.5956C30.3006 13.5956 29.6406 12.9156 29.6406 12.0956V6.51562C29.6406 6.1178 29.7987 5.73627 30.08 5.45496C30.3613 5.17366 30.7428 5.01563 31.1406 5.01562C31.5384 5.01562 31.92 5.17366 32.2013 5.45496C32.4826 5.73627 32.6406 6.1178 32.6406 6.51562V12.0756C32.6406 12.9156 31.9806 13.5956 31.1406 13.5956Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M29.5588 27.4199H14.7188C14.3209 27.4199 13.9394 27.2619 13.6581 26.9806C13.3768 26.6993 13.2188 26.3177 13.2188 25.9199C13.2188 25.5221 13.3768 25.1406 13.6581 24.8593C13.9394 24.578 14.3209 24.4199 14.7188 24.4199H29.5588C29.9566 24.4199 30.3381 24.578 30.6194 24.8593C30.9007 25.1406 31.0588 25.5221 31.0588 25.9199C31.0588 26.3177 30.9007 26.6993 30.6194 26.9806C30.3381 27.2619 29.9566 27.4199 29.5588 27.4199ZM23.9987 34.8439H14.7188C14.3209 34.8439 13.9394 34.6859 13.6581 34.4046C13.3768 34.1233 13.2188 33.7417 13.2188 33.3439C13.2188 32.9461 13.3768 32.5646 13.6581 32.2833C13.9394 32.002 14.3209 31.8439 14.7188 31.8439H23.9987C24.3966 31.8439 24.7781 32.002 25.0594 32.2833C25.3407 32.5646 25.4987 32.9461 25.4987 33.3439C25.4987 33.7417 25.3407 34.1233 25.0594 34.4046C24.7781 34.6859 24.3966 34.8439 23.9987 34.8439Z"
      fill="var(--bg_color_L2)"
    ></path>
  </symbol>
  <symbol
    id="icon-googleValidation"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M39.5 67C54.6878 67 67 54.6878 67 39.5C67 24.3122 54.6878 12 39.5 12C24.3122 12 12 24.3122 12 39.5C12 54.6878 24.3122 67 39.5 67ZM39.4992 48.2601C34.6616 48.2601 30.7399 44.3384 30.7399 39.5008C30.7399 34.6632 34.6616 30.7415 39.4992 30.7415C44.3368 30.7415 48.2585 34.6632 48.2585 39.5008C48.2585 44.3384 44.3368 48.2601 39.4992 48.2601Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M45.9771 12.7737C50.8866 13.9635 55.3735 16.4826 58.9454 20.0546L51.8936 27.1065C49.6169 24.8298 46.7572 23.2243 43.6282 22.466C40.4992 21.7077 37.2217 21.8259 34.1554 22.8076C31.0892 23.7894 28.3526 25.5968 26.2459 28.0315C24.1392 30.4661 22.7438 33.4341 22.2129 36.6096C21.6819 39.7851 22.0359 43.0456 23.236 46.0331C24.4361 49.0207 26.4359 51.62 29.016 53.5459C31.5962 55.4717 34.6569 56.6496 37.8624 56.9505C41.068 57.2513 44.2944 56.6633 47.1878 55.2511L51.5621 64.2135C47.0224 66.4292 41.9601 67.3517 36.9307 66.8797C31.9012 66.4077 27.0989 64.5596 23.0507 61.5379C19.0025 58.5163 15.8648 54.438 13.9818 49.7505C12.0989 45.063 11.5435 39.9474 12.3765 34.965C13.2096 29.9826 15.3989 25.3259 18.7043 21.5059C22.0097 17.6859 26.3034 14.8501 31.1144 13.3097C35.9254 11.7693 41.0677 11.5839 45.9771 12.7737ZM39.7009 18.9243C38.5759 18.9243 37.6639 18.0123 37.6639 16.8873C37.6639 15.7623 38.5759 14.8503 39.7009 14.8503C40.826 14.8503 41.738 15.7623 41.738 16.8873C41.738 18.0123 40.826 18.9243 39.7009 18.9243ZM21.3716 23.6119C21.3716 24.7369 22.2836 25.6489 23.4086 25.6489C24.5336 25.6489 25.4456 24.7369 25.4456 23.6119C25.4456 22.4869 24.5336 21.5749 23.4086 21.5749C22.2836 21.5749 21.3716 22.4869 21.3716 23.6119ZM16.8881 41.5402C15.7631 41.5402 14.8511 40.6282 14.8511 39.5032C14.8511 38.3782 15.7631 37.4661 16.8881 37.4661C18.0131 37.4661 18.9251 38.3782 18.9251 39.5032C18.9251 40.6282 18.0131 41.5402 16.8881 41.5402ZM21.3716 55.7955C21.3716 56.9205 22.2836 57.8325 23.4086 57.8325C24.5336 57.8325 25.4456 56.9205 25.4456 55.7955C25.4456 54.6705 24.5336 53.7585 23.4086 53.7585C22.2836 53.7585 21.3716 54.6705 21.3716 55.7955ZM39.4968 64.353C38.3718 64.353 37.4598 63.441 37.4598 62.316C37.4598 61.191 38.3718 60.279 39.4968 60.279C40.6219 60.279 41.5339 61.191 41.5339 62.316C41.5339 63.441 40.6219 64.353 39.4968 64.353Z"
      fill="var(--main-color)"
    ></path>
    <rect
      x="37.0547"
      y="37.0547"
      width="27.7037"
      height="5.09259"
      rx="2.5463"
      fill="var(--main-color)"
    ></rect>
  </symbol>
  <symbol
    id="icon-hint"
    viewBox="0 0 21 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 10.2679C21.3333 11.0378 21.3333 12.9623 20 13.7321L3.5 23.2583C2.16666 24.0281 0.499999 23.0659 0.499999 21.5263L0.5 2.47372C0.5 0.934117 2.16667 -0.0281317 3.5 0.741669L20 10.2679Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-historyHead"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M41 10H13V44H41V10Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M35 10V4H8C7.44772 4 7 4.44772 7 5V38H13"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M21 22H33"
      stroke="var(--bg_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M21 30H33"
      stroke="var(--bg_color_L2)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-home"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle
      opacity="0.3"
      cx="27"
      cy="28"
      r="18"
      fill="currentColor"
    ></circle>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.6599 5.27799L5.76039 17.3574V42.8644H15.8404V32.4244C15.8404 29.6409 18.0969 27.3844 20.8804 27.3844H27.2404C30.0239 27.3844 32.2804 29.6409 32.2804 32.4244V36.8044H28.9204V32.4244C28.9204 31.4965 28.1682 30.7444 27.2404 30.7444H20.8804C19.9526 30.7444 19.2004 31.4965 19.2004 32.4244V43.5844C19.2004 45.0424 18.0184 46.2244 16.5604 46.2244H5.04039C3.58236 46.2244 2.40039 45.0424 2.40039 43.5844V16.9747C2.40039 16.0973 2.83631 15.2772 3.56361 14.7863L22.4377 2.04925C23.1552 1.56501 24.0926 1.55594 24.8194 2.02622L44.5146 14.7702C45.2664 15.2567 45.7204 16.0911 45.7204 16.9866V43.5844C45.7204 45.0424 44.5384 46.2244 43.0804 46.2244H30.6004V42.8644H42.3604V17.3783L23.6599 5.27799Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.4004 44.5444C32.4004 45.4723 31.6482 46.2244 30.7204 46.2244C29.7926 46.2244 29.0404 45.4723 29.0404 44.5444C29.0404 43.6166 29.7926 42.8644 30.7204 42.8644C31.6482 42.8644 32.4004 43.6166 32.4004 44.5444Z"
      fill="currentColor"
    ></path>
    <path
      d="M32.2804 36.7444C32.2804 37.6723 31.5282 38.4244 30.6004 38.4244C29.6726 38.4244 28.9204 37.6723 28.9204 36.7444C28.9204 35.8166 29.6726 35.0644 30.6004 35.0644C31.5282 35.0644 32.2804 35.8166 32.2804 36.7444Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-hot"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill=""
  >
    <path
      d="M24 29L19.03 33.7099C17.7233 34.9718 17 36.6169 17 38.3746C17 42.0254 20.15 45 24 45C27.85 45 31 42.0254 31 38.3746C31 36.6169 30.2767 34.9493 28.97 33.7099L24 29Z"
      fill="currentColor"
    ></path>
    <path
      d="M33.4993 12.1825L32.4543 13.4451C29.6519 16.8197 23.9995 14.9143 23.9995 10.5756V3C23.9995 3 5 12.1825 5 28.252C5 34.9552 8.7049 40.8091 14.2385 44C12.9085 42.1865 12.1248 39.9597 12.1248 37.5722C12.1248 34.542 13.3598 31.6954 15.616 29.5375L23.9995 21.5946L32.383 29.5605C34.6392 31.6954 35.8742 34.542 35.8742 37.5952C35.8742 39.9367 35.138 42.0946 33.8555 43.9082C38.3441 41.2682 41.669 36.8835 42.6665 31.7413C44.234 23.5918 40.1253 15.9015 33.4993 12.1825Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-hotIcon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Frame" clipPath="url(#clip0_621_12387)">
      <path
        id="Vector"
        d="M24.0001 0H0.000106812V24H24.0001V0Z"
        fill="currentColor"
        fillOpacity="0.01"
      ></path>
      <path
        id="Vector_2"
        d="M12.0001 22C16.1175 22 19.5 18.7371 19.5 14.5491C19.5 13.5209 19.4478 12.4187 18.8779 10.7058C18.308 8.9929 18.1932 8.7718 17.5906 7.71395C17.3331 9.8727 15.9556 10.7724 15.6057 11.0413C15.6057 10.7615 14.7724 7.66795 13.5089 5.81695C12.2686 4 10.5818 2.80796 9.59276 2C9.59276 3.53489 9.16106 5.81695 8.54281 6.9797C7.92456 8.14245 7.80846 8.1848 7.03621 9.0501C6.26401 9.9154 5.90956 10.1826 5.26381 11.2325C4.61809 12.2825 4.50011 13.6809 4.50011 14.7091C4.50011 18.8971 7.88276 22 12.0001 22Z"
        fill="currentColor"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_621_12387">
        <rect width="24" height="24" fill="currentColor"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-howpay"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M45 12.5V35.5C45 42.4 41.5 47 33.3333 47H14.6667C6.5 47 3 42.4 3 35.5V12.5C3 5.6 6.5 1 14.6667 1H33.3333C41.5 1 45 5.6 45 12.5Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M32.675 1V19.3009C32.675 20.3254 31.479 20.8376 30.743 20.1624L25.407 15.1797C25.1954 14.978 24.9157 14.8657 24.625 14.8657C24.3343 14.8657 24.0546 14.978 23.843 15.1797L18.507 20.1624C18.3424 20.3169 18.1368 20.4193 17.9155 20.4569C17.6942 20.4946 17.4668 20.4658 17.2614 20.3742C17.056 20.2826 16.8816 20.1322 16.7596 19.9415C16.6376 19.7508 16.5735 19.5281 16.575 19.3009V1H32.675ZM37.275 30.6866H27.5C26.557 30.6866 25.775 29.8949 25.775 28.9403C25.775 27.9857 26.557 27.194 27.5 27.194H37.275C38.218 27.194 39 27.9857 39 28.9403C39 29.8949 38.218 30.6866 37.275 30.6866ZM37.275 40H17.725C16.782 40 16 39.2084 16 38.2537C16 37.2991 16.782 36.5075 17.725 36.5075H37.275C38.218 36.5075 39 37.2991 39 38.2537C39 39.2084 38.218 40 37.275 40Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-iconservr-r"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.69169 33.991C2.40432 30.3827 0.40443 25.6189 0.40443 20.3957C0.40443 9.13149 9.70091 0 21.1686 0C32.6364 0 41.9329 9.13149 41.9329 20.3957C41.9329 28.3604 37.2834 35.2559 30.5064 38.6136C26.36 40.7753 21.6297 42 16.6083 42C10.4556 42 4.73991 40.1614 0 37.0131C0 37.0131 3.17858 36.6664 5.69087 33.9918L5.69169 33.991ZM30.9227 30.4898C36.2947 25.118 36.2947 16.4085 30.9227 11.0366C28.4317 8.54569 25.2231 7.21059 21.9624 7.02989C21.864 4.58346 23.1809 2.93048 23.1873 2.92242L23.186 2.92268L23.187 2.92138C19.4394 3.64532 15.8608 5.45837 12.9589 8.36029C10.7334 10.5857 9.14881 13.2092 8.20411 16.0014C8.34241 15.6352 8.49661 15.2736 8.66671 14.9178C8.47091 15.4171 8.29401 15.9273 8.13401 16.4493C6.56076 21.2252 7.67121 26.6916 11.4694 30.4898C16.8414 35.8618 25.5509 35.8618 30.9227 30.4898Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.2129 19.3493V22.1965C14.2129 23.3327 15.1339 24.2537 16.2702 24.2537C17.4064 24.2537 18.3273 23.3327 18.3273 22.1965V19.3493C18.3273 18.2133 17.4064 17.292 16.2702 17.292C15.1339 17.292 14.2129 18.2133 14.2129 19.3493Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.3955 19.3493V22.1965C24.3955 23.3327 25.3166 24.2537 26.4527 24.2537C27.5889 24.2537 28.51 23.3327 28.51 22.1965V19.3493C28.51 18.2133 27.5889 17.292 26.4527 17.292C25.3166 17.292 24.3955 18.2133 24.3955 19.3493Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-ifscCode"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.53447 8.53666C14.6009 2.48778 24.4384 2.48778 30.4639 8.53666C34.7063 12.7401 35.977 18.789 34.3374 24.1202L43.97 33.7574C44.6463 34.4545 45.1177 35.8283 44.9742 36.8126L44.3594 41.2826C44.1339 42.7589 42.7608 44.1532 41.2851 44.3583L36.8173 44.9734C35.8335 45.1169 34.4604 44.6658 33.7636 43.9482L32.083 42.2668C31.6731 41.8772 31.6731 41.2211 32.083 40.811L36.059 36.8331C36.6533 36.2384 36.6533 35.2542 36.059 34.6596C35.4646 34.0649 34.4809 34.0649 33.8865 34.6596L29.8901 38.658C29.5007 39.0476 28.8448 39.0476 28.4554 38.658L24.1105 34.3315C18.8023 35.9924 12.7564 34.7006 8.53447 30.4971C2.48851 24.4482 2.48851 14.5855 8.53447 8.53666ZM19.3762 24.4893C22.2045 24.4893 24.4999 22.1927 24.4999 19.3631C24.4999 16.5335 22.2045 14.2369 19.3762 14.2369C16.5479 14.2369 14.2525 16.5335 14.2525 19.3631C14.2525 22.1927 16.5479 24.4893 19.3762 24.4893Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-income"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38 15V7H10V15"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M43 27V15H5V41H43"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M29 27L24 34H43"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M26 21H22"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M16 21H12"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-invitation"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="login_list_icon">
      <path
        id="Vector"
        d="M37.38 23.06C36.24 22.76 34.9 22.6 33.3 22.6C31.08 22.6 30.26 23.14 29.12 24C29.06 24.04 29 24.1 28.94 24.16L27.04 26.18C25.46 27.88 22.56 27.88 20.96 26.18L19.06 24.18C19.0105 24.1103 18.9496 24.0495 18.88 24C17.72 23.14 16.9 22.6 14.7 22.6C13.1 22.6 11.76 22.74 10.62 23.06C5.85998 24.34 5.85999 28.12 5.85999 31.44V33.3C5.85999 38.32 5.85998 44 16.56 44H31.44C38.54 44 42.14 40.4 42.14 33.3V31.44C42.14 28.12 42.14 24.34 37.38 23.06Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_2"
        opacity="0.4"
        d="M29.58 4H18.42C9.58002 4 9.58002 8.7 9.58002 12.84V24.42C9.58002 24.86 9.78002 25.26 10.12 25.52C10.46 25.78 10.92 25.88 11.34 25.76C12.24 25.52 13.36 25.4 14.7 25.4C16.04 25.4 16.32 25.56 17.12 26.16L18.94 28.08C19.591 28.7751 20.3778 29.3293 21.2516 29.7081C22.1254 30.0869 23.0676 30.2824 24.02 30.2824C24.9724 30.2824 25.9146 30.0869 26.7884 29.7081C27.6622 29.3293 28.449 28.7751 29.1 28.08L30.92 26.16C31.72 25.56 32 25.4 33.34 25.4C34.68 25.4 35.8 25.52 36.7 25.76C37.12 25.88 37.56 25.78 37.92 25.52C38.26 25.26 38.46 24.84 38.46 24.42V12.84C38.42 8.7 38.42 4 29.58 4Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_3"
        d="M27.1 19.824H20.9C20.12 19.824 19.5 19.204 19.5 18.424C19.5 17.644 20.12 17.024 20.9 17.024H27.1C27.88 17.024 28.5 17.644 28.5 18.424C28.5 19.184 27.86 19.824 27.1 19.824ZM28.658 14.238H19.338C18.558 14.238 17.938 13.618 17.938 12.838C17.938 12.058 18.558 11.438 19.338 11.438H28.638C29.0093 11.4354 29.3664 11.5803 29.6309 11.841C29.8953 12.1017 30.0453 12.4567 30.048 12.828C30.0506 13.1993 29.9057 13.5565 29.645 13.8209C29.3843 14.0853 29.0293 14.2354 28.658 14.238Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-lottery"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <mask
      id="mask0_2094_41544"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="6"
      y="6"
      width="36"
      height="36"
    >
      <circle cx="24" cy="24" r="18" fill="#D9D9D9"></circle>
    </mask>
    <g mask="url(#mask0_2094_41544)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.4705 12.992C17.2079 14.0478 13.802 13.3906 11.2254 11.5176C8.65115 14.157 6.94305 17.5424 6.35131 21.184C9.24189 22.2447 11.6331 24.5757 12.6547 27.7324C13.6762 30.8888 13.1042 34.1786 11.3832 36.7317C14.3198 39.6583 18.2092 41.4967 22.3564 41.8918C23.627 39.7355 25.661 38.0177 28.2295 37.1865C30.8181 36.3488 33.4945 36.5589 35.7997 37.5825C38.9641 34.833 41.0645 31.0476 41.7397 26.9331C39.0138 25.7686 36.7873 23.4755 35.8028 20.4338C34.7996 17.3337 35.2977 14.1078 36.8953 11.5428C34.2573 8.83606 30.8169 7.02579 27.0991 6.38029C26.1085 9.40788 23.7332 11.9361 20.4705 12.992ZM28.0728 35.9093C33.8105 34.0525 36.9566 27.8958 35.0998 22.158C33.243 16.4202 27.0863 13.2741 21.3485 15.131C15.6107 16.9879 12.4646 23.1445 14.3215 28.8823C16.1784 34.62 22.335 37.7661 28.0728 35.9093Z"
        fill="currentColor"
      ></path>
      <path
        d="M27.0008 29.6018C26.7496 29.841 26.425 30.0249 26.0271 30.1538C25.6331 30.2812 25.2622 30.3223 24.9146 30.2768C24.5659 30.2276 24.2672 30.1024 24.0184 29.9012C23.7686 29.6961 23.5893 29.4254 23.4805 29.0894C23.3692 28.7456 23.3561 28.4148 23.441 28.0971C23.5286 27.7743 23.6987 27.4887 23.9513 27.2406C24.2026 26.9885 24.5195 26.8006 24.9019 26.6768C25.2882 26.5518 25.6551 26.5184 26.0026 26.5767C26.3488 26.6311 26.652 26.7635 26.9122 26.9737C27.171 27.1801 27.3561 27.4554 27.4674 27.7992C27.5761 28.1352 27.5874 28.4602 27.5012 28.774C27.4176 29.0828 27.2508 29.3587 27.0008 29.6018Z"
        fill="currentColor"
      ></path>
      <path
        d="M25.1322 24.3616C24.9171 24.5807 24.6434 24.7439 24.3113 24.8514C23.979 24.959 23.6616 24.987 23.359 24.9356C23.0564 24.8841 22.7929 24.7623 22.5686 24.5703C22.3443 24.3784 22.1815 24.1259 22.0802 23.8129C21.9802 23.5039 21.9642 23.2103 22.0321 22.9322C22.1026 22.6491 22.2461 22.3999 22.4624 22.1849C22.6775 21.9659 22.953 21.802 23.2892 21.6932C23.6291 21.5832 23.9485 21.5546 24.2472 21.6073C24.5447 21.6561 24.805 21.7745 25.0281 21.9627C25.2499 22.147 25.4108 22.3937 25.5108 22.7027C25.612 23.0157 25.6281 23.3157 25.5588 23.6027C25.4895 23.8897 25.3473 24.1427 25.1322 24.3616Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.4489 33.9791C32.1208 32.4673 34.6824 27.4544 33.1705 22.7825C31.6586 18.1106 26.6457 15.549 21.9739 17.0608C17.302 18.5727 14.7403 23.5857 16.2522 28.2575C17.7641 32.9294 22.777 35.4911 27.4489 33.9791ZM24.1012 32.3326C24.8904 32.3974 25.7311 32.2853 26.6234 31.9965C27.5159 31.7077 28.261 31.3066 28.8588 30.793C29.4591 30.2743 29.8745 29.6982 30.1047 29.0647C30.335 28.431 30.3483 27.793 30.1446 27.1504C29.9807 26.6571 29.716 26.2413 29.3504 25.903C28.9874 25.5596 28.5665 25.3138 28.0875 25.1658C27.6112 25.0126 27.123 24.9743 26.6227 25.0509L26.5965 24.9697C27.1772 24.6409 27.5878 24.1688 27.8282 23.5532C28.0686 22.9377 28.085 22.3029 27.8776 21.6487C27.6762 21.0396 27.3183 20.5536 26.8041 20.1909C26.2885 19.8242 25.6709 19.6037 24.9512 19.5294C24.2353 19.4537 23.4775 19.5453 22.6778 19.8041C21.8781 20.0629 21.2084 20.4332 20.6687 20.9152C20.1316 21.392 19.7617 21.9301 19.5586 22.5292C19.3543 23.1245 19.3516 23.7293 19.5504 24.3435C19.7605 24.9926 20.1419 25.4986 20.6947 25.8617C21.2463 26.221 21.8595 26.3619 22.5343 26.2843L22.5605 26.3655C22.1026 26.599 21.7237 26.918 21.4235 27.3224C21.1221 27.723 20.9249 28.1688 20.8319 28.6597C20.7417 29.1456 20.7766 29.6358 20.9366 30.1303C21.1441 30.7716 21.5268 31.2815 22.0846 31.66C22.6425 32.0386 23.3146 32.2628 24.1012 32.3326Z"
        fill="currentColor"
      ></path>
      <path
        d="M-5.27379 33.5341C-3.83367 37.9843 0.941276 40.4243 5.39135 38.9841C9.8414 37.5441 12.2814 32.7691 10.8414 28.319C9.4012 23.869 4.62629 21.4289 0.176219 22.869C-4.27386 24.3092 -6.71391 29.0841 -5.27379 33.5341Z"
        fill="currentColor"
      ></path>
      <path
        d="M14.6506 -4.99372C10.3306 -3.59569 8.01311 1.19803 9.47439 5.71338C10.9356 10.2287 15.6222 12.7558 19.9422 11.3577C24.2622 9.95969 26.5796 5.16597 25.1185 0.650652C23.6572 -3.86467 18.9706 -6.39174 14.6506 -4.99372Z"
        fill="currentColor"
      ></path>
      <path
        d="M34.1591 55.51C29.4706 57.0272 24.4777 54.5736 23.0072 50.0295C21.5368 45.4855 24.1454 40.5719 28.8339 39.0546C33.5223 37.5373 38.5152 39.991 39.9857 44.535C41.4562 49.079 38.8476 53.9928 34.1591 55.51Z"
        fill="currentColor"
      ></path>
      <path
        d="M54.1353 14.5011C55.6056 19.0444 53.1145 23.9194 48.5712 25.3896C44.028 26.8598 39.1531 24.3687 37.6829 19.8255C36.2125 15.2823 38.7036 10.4074 43.2469 8.93712C47.7902 7.46678 52.6651 9.9579 54.1353 14.5011Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-lottyWallet"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      d="M24.7493 6.58594L24.7494 23.2826H10.4327C6.98268 23.2826 4.16602 26.0993 4.16602 29.5493V13.0693C4.16602 11.0859 5.38268 9.31927 7.23268 8.61927L20.466 3.61927C22.5327 2.8526 24.7493 4.36927 24.7493 6.58594ZM37.5977 23.2826V26.7159C37.5977 27.6326 36.8643 28.3826 35.931 28.4159H32.6643C30.8643 28.4159 29.2143 27.0993 29.0643 25.2993C28.9643 24.2493 29.3643 23.2659 30.0643 22.5826C30.681 21.9493 31.531 21.5826 32.4643 21.5826H35.931C36.8643 21.6159 37.5977 22.3659 37.5977 23.2826Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.066 25.2993C28.966 24.2493 29.366 23.266 30.066 22.5827C30.6827 21.9493 31.5327 21.5827 32.466 21.5827H35.8327V19.1827C35.8327 15.7327 33.016 12.916 29.566 12.916H10.4327C6.98268 12.916 4.16602 15.7327 4.16602 19.1827V30.3993C4.16602 33.8493 6.98268 36.666 10.4327 36.666H29.566C33.016 36.666 35.8327 33.8493 35.8327 30.3993V28.416H32.666C30.866 28.416 29.216 27.0993 29.066 25.2993ZM22.4167 22.5H10.75C10.0667 22.5 9.5 21.9333 9.5 21.25C9.5 20.5667 10.0667 20 10.75 20H22.4167C23.1 20 23.6667 20.5667 23.6667 21.25C23.6667 21.9333 23.1 22.5 22.4167 22.5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-main"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle
      opacity="0.3"
      cx="28"
      cy="24"
      r="18"
      fill="currentColor"
    ></circle>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.08 5.27992C13.7412 5.27992 5.36 13.6612 5.36 23.9999C5.36 34.3387 13.7412 42.7199 24.08 42.7199C34.4188 42.7199 42.8 34.3387 42.8 23.9999V15.2399H46.16V23.9999C46.16 36.1944 36.2744 46.0799 24.08 46.0799C11.8856 46.0799 2 36.1944 2 23.9999C2 11.8055 11.8856 1.91992 24.08 1.91992H44.36V5.27992H24.08Z"
      fill="currentColor"
    ></path>
    <path
      d="M46.16 3.59992C46.16 4.52776 45.4078 5.27992 44.48 5.27992C43.5522 5.27992 42.8 4.52776 42.8 3.59992C42.8 2.67208 43.5522 1.91992 44.48 1.91992C45.4078 1.91992 46.16 2.67208 46.16 3.59992Z"
      fill="currentColor"
    ></path>
    <path
      d="M46.16 15.1199C46.16 16.0478 45.4078 16.7999 44.48 16.7999C43.5522 16.7999 42.8 16.0478 42.8 15.1199C42.8 14.1921 43.5522 13.4399 44.48 13.4399C45.4078 13.4399 46.16 14.1921 46.16 15.1199Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.8061 29.5825C16.5007 28.9674 17.5624 29.0317 18.1776 29.7263C19.3272 31.0242 20.9262 32.5202 23.64 32.5202C26.5114 32.5202 28.4968 31.0925 29.4445 29.9868C30.0483 29.2824 31.1089 29.2008 31.8133 29.8046C32.5178 30.4085 32.5994 31.469 31.9956 32.1735C30.5432 33.8679 27.6806 35.8802 23.64 35.8802C19.4418 35.8802 16.9928 33.4562 15.6624 31.9541C15.0472 31.2595 15.1115 30.1977 15.8061 29.5825Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-maintenace"
    viewBox="0 0 464 324"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.7">
      <path
        d="M254.032 284.236H160.858C158.804 284.236 157.138 282.571 157.138 280.519V127.214C157.138 120.176 162.864 114.454 169.907 114.454H244.983C252.026 114.454 257.752 120.176 257.752 127.214V280.519C257.752 282.571 256.085 284.236 254.032 284.236ZM164.573 276.807H250.312V127.214C250.312 124.275 247.919 121.889 244.983 121.889H169.907C166.965 121.889 164.578 124.28 164.578 127.214V276.807H164.573Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M157.138 276.661H257.752V297.911C257.752 300.678 255.505 302.923 252.736 302.923H162.153C159.384 302.923 157.138 300.678 157.138 297.911V276.661Z"
        fill="#CACFE0"
      ></path>
      <path
        d="M207.442 295.723C210.616 295.723 213.189 293.152 213.189 289.98C213.189 286.808 210.616 284.237 207.442 284.237C204.267 284.237 201.694 286.808 201.694 289.98C201.694 293.152 204.267 295.723 207.442 295.723Z"
        fill="#B1B7C6"
      ></path>
      <g opacity="0.7">
        <path
          d="M203.935 138.983H175.914C173.978 138.983 172.408 140.551 172.408 142.486V247.951C172.408 249.885 173.978 251.454 175.914 251.454H203.935C205.871 251.454 207.44 249.885 207.44 247.951V142.486C207.44 140.551 205.871 138.983 203.935 138.983Z"
          fill="#CACFE0"
        ></path>
        <path
          d="M189.574 160.164C193.144 160.164 196.038 157.273 196.038 153.706C196.038 150.139 193.144 147.248 189.574 147.248C186.005 147.248 183.111 150.139 183.111 153.706C183.111 157.273 186.005 160.164 189.574 160.164Z"
          fill="url(#paint0_linear_3021_93)"
        ></path>
        <path
          d="M201.956 175.697H177.791V178.861H201.956V175.697Z"
          fill="url(#paint1_linear_3021_93)"
        ></path>
        <path
          d="M201.956 166.644H177.791V169.808H201.956V166.644Z"
          fill="url(#paint2_linear_3021_93)"
        ></path>
        <path
          d="M201.956 184.75H177.791V187.914H201.956V184.75Z"
          fill="url(#paint3_linear_3021_93)"
        ></path>
        <path
          d="M201.956 194.373H177.791V197.537H201.956V194.373Z"
          fill="url(#paint4_linear_3021_93)"
        ></path>
        <path
          d="M201.956 203.65H177.791V206.814H201.956V203.65Z"
          fill="url(#paint5_linear_3021_93)"
        ></path>
        <path
          d="M201.956 212.928H177.791V216.092H201.956V212.928Z"
          fill="url(#paint6_linear_3021_93)"
        ></path>
        <path
          d="M201.956 221.856H182.268V225.02H201.956V221.856Z"
          fill="url(#paint7_linear_3021_93)"
        ></path>
      </g>
      <g opacity="0.7">
        <path
          d="M240.772 221.856H212.751C210.815 221.856 209.245 223.424 209.245 225.359V247.956C209.245 249.891 210.815 251.459 212.751 251.459H240.772C242.708 251.459 244.278 249.891 244.278 247.956V225.359C244.278 223.424 242.708 221.856 240.772 221.856Z"
          fill="#CACFE0"
        ></path>
        <path
          d="M238.791 231.415H214.626V234.579H238.791V231.415Z"
          fill="url(#paint8_linear_3021_93)"
        ></path>
        <path
          d="M238.79 240.343H219.103V243.507H238.79V240.343Z"
          fill="url(#paint9_linear_3021_93)"
        ></path>
      </g>
      <path
        d="M402.493 259.332H396.866V304.243H402.493V259.332Z"
        fill="#9A9DA7"
      ></path>
      <path
        d="M440.8 259.332H435.173V304.243H440.8V259.332Z"
        fill="#9A9DA7"
      ></path>
      <path
        d="M447.483 261.723H391.139V279.532H447.483V261.723Z"
        fill="#CACFE0"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M405.454 279.532H412.816L418.265 261.723H410.903L405.454 279.532ZM419.17 279.532H426.532L431.981 261.723H424.62L419.17 279.532ZM440.246 279.532H432.884L438.334 261.723H445.695L440.246 279.532ZM391.916 279.532H399.273L404.722 261.723H397.366L391.916 279.532Z"
        fill="url(#paint10_linear_3021_93)"
      ></path>
      <path
        d="M156.769 299.712H129.224C128.488 299.712 127.891 300.308 127.891 301.043V301.048C127.891 301.784 128.488 302.38 129.224 302.38H156.769C157.505 302.38 158.101 301.784 158.101 301.048V301.043C158.101 300.308 157.505 299.712 156.769 299.712Z"
        fill="url(#paint11_linear_3021_93)"
      ></path>
      <path
        d="M140.777 272.463L130.63 299.665H155.365L145.218 272.463C144.45 270.406 141.54 270.406 140.777 272.463Z"
        fill="#CACFE0"
      ></path>
      <path
        d="M133.354 292.361L130.627 299.665H155.361L152.634 292.361H133.354Z"
        fill="url(#paint12_linear_3021_93)"
      ></path>
      <path
        d="M150.133 285.647L147.401 278.322H138.592L135.859 285.647H150.133Z"
        fill="url(#paint13_linear_3021_93)"
      ></path>
      <path
        d="M288.549 299.712H261.004C260.268 299.712 259.672 300.308 259.672 301.043V301.048C259.672 301.784 260.268 302.38 261.004 302.38H288.549C289.285 302.38 289.882 301.784 289.882 301.048V301.043C289.882 300.308 289.285 299.712 288.549 299.712Z"
        fill="url(#paint14_linear_3021_93)"
      ></path>
      <path
        d="M272.558 272.463L262.411 299.665H287.145L276.999 272.463C276.231 270.406 273.32 270.406 272.558 272.463Z"
        fill="#CACFE0"
      ></path>
      <path
        d="M265.137 292.361L262.409 299.665H287.144L284.416 292.361H265.137Z"
        fill="url(#paint15_linear_3021_93)"
      ></path>
      <path
        d="M281.916 285.647L279.183 278.322H270.374L267.641 285.647H281.916Z"
        fill="url(#paint16_linear_3021_93)"
      ></path>
      <path
        d="M357.038 271.675H330.934C330.36 271.675 329.89 271.205 329.89 270.631V14.6126C329.89 14.3411 329.994 14.0852 330.182 13.8868L343.234 0.317402C343.631 -0.0950585 344.347 -0.0950585 344.738 0.317402L357.79 13.8868C357.978 14.08 358.083 14.3411 358.083 14.6126V270.625C358.083 271.2 357.612 271.67 357.038 271.67V271.675ZM331.979 269.586H355.993V15.0355L343.986 2.552L331.979 15.0355V269.586Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M357.039 59.4246H330.936C330.503 59.4246 330.111 59.1531 329.959 58.7511C329.808 58.3439 329.917 57.8844 330.247 57.5972L354.27 36.4678H330.936C330.492 36.4678 330.1 36.1911 329.949 35.7734C329.797 35.3557 329.933 34.891 330.278 34.6143L354.077 15.4427H330.936V13.3543H357.039C357.484 13.3543 357.875 13.631 358.027 14.0487C358.178 14.4664 358.043 14.9311 357.698 15.2078L333.899 34.3794H357.039C357.473 34.3794 357.865 34.6509 358.017 35.0529C358.168 35.4601 358.058 35.9196 357.729 36.2067L333.705 57.3362H357.039V59.4246Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M331.593 271.148L330.271 269.529L354.112 250.023H330.934C330.49 250.023 330.098 249.747 329.952 249.329C329.806 248.911 329.931 248.447 330.276 248.17L354.106 228.742H330.939C330.495 228.742 330.103 228.46 329.952 228.043C329.806 227.625 329.936 227.16 330.281 226.884L354.07 207.77H330.934C330.49 207.77 330.098 207.493 329.952 207.075C329.806 206.657 329.936 206.193 330.281 205.916L354.091 186.645H330.939C330.495 186.645 330.103 186.369 329.957 185.951C329.811 185.533 329.941 185.069 330.286 184.792L354.096 165.521H330.945C330.501 165.521 330.109 165.239 329.957 164.821C329.811 164.404 329.941 163.939 330.286 163.662L354.075 144.548H330.939C330.495 144.548 330.098 144.266 329.952 143.849C329.806 143.431 329.941 142.966 330.286 142.689L354.059 123.711H330.939C330.501 123.711 330.103 123.434 329.957 123.022C329.811 122.609 329.936 122.145 330.276 121.863L354.132 102.232H330.945C330.495 102.232 330.098 101.945 329.952 101.522C329.811 101.094 329.952 100.629 330.312 100.357L353.923 82.559H330.939V80.4706H357.043C357.492 80.4706 357.889 80.7577 358.035 81.1806C358.176 81.6088 358.035 82.0734 357.675 82.3449L334.064 100.143H357.048C357.487 100.143 357.884 100.42 358.03 100.833C358.176 101.245 358.051 101.71 357.711 101.992L333.855 121.623H357.043C357.487 121.623 357.884 121.905 358.03 122.322C358.176 122.74 358.041 123.205 357.696 123.481L333.923 142.46H357.043C357.487 142.46 357.879 142.742 358.03 143.159C358.176 143.577 358.046 144.042 357.701 144.318L333.912 163.433H357.048C357.492 163.433 357.884 163.709 358.035 164.127C358.182 164.545 358.051 165.009 357.706 165.286L333.897 184.557H357.048C357.492 184.557 357.884 184.834 358.035 185.251C358.182 185.669 358.051 186.134 357.706 186.41L333.897 205.681H357.048C357.492 205.681 357.884 205.963 358.035 206.381C358.182 206.798 358.051 207.263 357.706 207.54L333.918 226.654H357.053C357.497 226.654 357.889 226.931 358.035 227.348C358.182 227.766 358.056 228.231 357.711 228.507L333.881 247.935H357.048C357.487 247.935 357.884 248.212 358.03 248.629C358.176 249.047 358.051 249.506 357.706 249.788L331.603 271.148H331.593Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M405.809 59.4245H208.347C207.772 59.4245 207.302 58.9546 207.302 58.3803V36.3842C207.302 35.8099 207.772 35.34 208.347 35.34H405.809C406.383 35.34 406.853 35.8099 406.853 36.3842V58.3803C406.853 58.9546 406.383 59.4245 405.809 59.4245ZM209.392 57.3361H404.764V37.4284H209.392V57.3361Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M379.586 59.4245C379.434 59.4245 379.283 59.3932 379.147 59.3253C378.776 59.153 378.541 58.7823 378.541 58.3803V36.3842H380.631V56.1405L405.135 35.5853C405.449 35.3243 405.882 35.2669 406.248 35.4392C406.619 35.6115 406.854 35.9821 406.854 36.3842V58.3803H404.764V38.624L380.26 59.1791C380.066 59.341 379.826 59.4245 379.586 59.4245Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M357.039 59.4246C356.904 59.4246 356.762 59.3985 356.632 59.341C356.245 59.1792 355.994 58.798 355.994 58.3804V36.3842H358.084V55.9004L378.853 35.6376C379.156 35.3452 379.6 35.2617 379.987 35.4235C380.373 35.5854 380.624 35.9665 380.624 36.3842V58.3804H378.534V38.8642L357.766 59.127C357.567 59.3201 357.301 59.4246 357.034 59.4246H357.039Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M330.936 59.4245C330.784 59.4245 330.638 59.3932 330.497 59.3253C330.126 59.153 329.891 58.7823 329.891 58.3803V36.3842H331.981V56.1301L356.365 35.5853C356.679 35.3243 357.112 35.2669 357.478 35.4392C357.849 35.6115 358.084 35.9821 358.084 36.3842V58.3803H355.994V38.6344L331.61 59.1791C331.417 59.341 331.176 59.4245 330.936 59.4245Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M306.417 59.4246C306.27 59.4246 306.129 59.3932 305.993 59.3358C305.617 59.1687 305.372 58.7928 305.372 58.3804V36.3842H307.462V56.0361L330.237 35.6063C330.545 35.3296 330.984 35.2617 331.36 35.4288C331.736 35.5958 331.982 35.9717 331.982 36.3842V58.3804H329.892V38.7284L307.117 59.1583C306.924 59.3358 306.673 59.4246 306.417 59.4246Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M281.902 59.4246C281.756 59.4246 281.615 59.3932 281.479 59.3358C281.103 59.1687 280.857 58.7928 280.857 58.3804V36.3842H282.947V56.0361L305.722 35.6063C306.03 35.3296 306.469 35.2617 306.845 35.4288C307.222 35.5958 307.467 35.9717 307.467 36.3842V58.3804H305.377V38.7284L282.602 59.1583C282.409 59.3358 282.158 59.4246 281.902 59.4246Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M257.381 59.4246C257.234 59.4246 257.093 59.3932 256.957 59.3358C256.581 59.1687 256.336 58.7928 256.336 58.3804V36.3842H258.425V56.0361L281.2 35.6063C281.509 35.3296 281.948 35.2617 282.324 35.4288C282.7 35.5958 282.946 35.9717 282.946 36.3842V58.3804H280.856V38.7284L258.081 59.1583C257.887 59.3358 257.637 59.4246 257.381 59.4246Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M232.866 59.4246C232.72 59.4246 232.578 59.3932 232.443 59.3358C232.066 59.1687 231.821 58.7928 231.821 58.3804V36.3842H233.911V56.0361L256.686 35.6063C256.994 35.3296 257.433 35.2617 257.809 35.4288C258.185 35.5958 258.431 35.9717 258.431 36.3842V58.3804H256.341V38.7284L233.566 59.1583C233.373 59.3358 233.122 59.4246 232.866 59.4246Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M208.347 59.4246C208.2 59.4246 208.059 59.3932 207.923 59.3358C207.547 59.1687 207.302 58.7928 207.302 58.3804V36.3842H209.392V56.0361L232.167 35.6063C232.475 35.3296 232.914 35.2617 233.29 35.4288C233.666 35.5958 233.912 35.9717 233.912 36.3842V58.3804H231.822V38.7284L209.047 59.1583C208.853 59.3358 208.603 59.4246 208.347 59.4246Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M302.017 76.4956L302.015 76.4937C301.659 76.1495 301.46 75.6788 301.46 75.1817V58.9538H356.459V93.4406H320.14C319.661 93.4406 319.199 93.2503 318.857 92.9159L318.857 92.9157L302.017 76.4956ZM328.317 75.9378C329.457 75.9378 330.38 75.0161 330.38 73.8765V66.0501C330.38 64.9105 329.457 63.9888 328.317 63.9888H313.578C312.438 63.9888 311.515 64.9105 311.515 66.0501V73.8765C311.515 75.0161 312.438 75.9378 313.578 75.9378H328.317ZM350.925 75.9378C352.064 75.9378 352.987 75.0161 352.987 73.8765V66.0501C352.987 64.9105 352.064 63.9888 350.925 63.9888H336.186C335.046 63.9888 334.123 64.9105 334.123 66.0501V73.8765C334.123 75.0161 335.046 75.9378 336.186 75.9378H350.925Z"
        fill="#AFB0B4"
        fillOpacity="0.7"
        stroke="#A0A8BD"
        strokeWidth="1.15714"
      ></path>
      <path
        d="M229.563 37.3814L228.947 35.387L343.679 0.0459015C343.966 -0.0428558 344.279 -0.00108766 344.535 0.155543L401.721 35.4966L400.624 37.2718L343.841 2.1813L229.563 37.3814Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M210.931 58.3805H208.841V80.8727H210.931V58.3805Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M209.886 92.5206C213.935 92.5206 217.217 89.2411 217.217 85.1955C217.217 81.15 213.935 77.8704 209.886 77.8704C205.838 77.8704 202.556 81.15 202.556 85.1955C202.556 89.2411 205.838 92.5206 209.886 92.5206Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M235.033 122.993L211.547 110.703C210.048 109.92 208.318 109.706 206.673 110.108L183.641 115.7L183.375 114.593L206.406 109.001C208.318 108.536 210.335 108.782 212.08 109.695L235.566 121.986L235.038 122.993H235.033Z"
        fill="#9B9FAC"
      ></path>
      <path
        d="M209.887 112.653C205.269 112.653 201.512 108.899 201.512 104.284H203.602C203.602 107.745 206.423 110.565 209.887 110.565C213.351 110.565 216.173 107.745 216.173 104.284C216.173 100.822 213.351 98.0027 209.887 98.0027H208.842V90.9439H210.932V95.977C215.06 96.4939 218.263 100.018 218.263 104.284C218.263 108.899 214.506 112.653 209.887 112.653Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M209.886 59.4246H188.203C187.791 59.4246 187.414 59.1792 187.247 58.8033C187.08 58.4222 187.153 57.9836 187.43 57.6756L207.572 35.6794C207.864 35.3609 208.319 35.2565 208.721 35.4131C209.124 35.5697 209.39 35.9561 209.39 36.3842V57.3362H209.886V59.4246ZM190.581 57.3362H207.3V39.073L190.581 57.3362Z"
        fill="#BAC0D0"
      ></path>
      <path
        d="M382.024 297.691H305.945V302.416H382.024V297.691Z"
        fill="url(#paint17_linear_3021_93)"
      ></path>
      <path
        d="M317.802 270.631H370.176C371.252 270.631 372.13 271.502 372.13 272.583V280.686H315.853V272.583C315.853 271.508 316.726 270.631 317.808 270.631H317.802Z"
        fill="url(#paint18_linear_3021_93)"
      ></path>
      <path
        d="M382.024 297.691H305.945L310.282 283.474C310.81 281.746 312.403 280.566 314.211 280.566H373.764C375.572 280.566 377.165 281.746 377.693 283.474L382.029 297.691H382.024Z"
        fill="#CACFDD"
      ></path>
      <g opacity="0.5">
        <path
          d="M91.7632 299.261V301.837H32.7982V299.261H91.7632Z"
          fill="#9099B1"
          stroke="#5C6C80"
          strokeWidth="1.15714"
        ></path>
        <path
          opacity="0.5"
          d="M83.9411 284.66H40.6193V278.51C40.6193 277.753 41.2335 277.136 41.9948 277.136H82.5656C83.3238 277.136 83.9411 277.75 83.9411 278.51V284.66Z"
          fill="#9099B1"
          stroke="#4A5766"
          strokeWidth="1.15714"
        ></path>
        <path
          d="M91.5607 298.104H33.0014L36.2006 287.617C36.2006 287.617 36.2007 287.617 36.2007 287.617C36.5446 286.496 37.5799 285.729 38.751 285.729H85.811C86.9823 285.729 88.0177 286.496 88.3615 287.617L91.5607 298.104Z"
          fill="#9099B1"
          stroke="#5C6C80"
          strokeWidth="1.15714"
        ></path>
        <path
          d="M51.1445 277.298V56.9778C51.1445 56.7638 51.2281 56.5601 51.3744 56.4035L61.6882 45.6795C62.0017 45.3558 62.566 45.3558 62.8795 45.6795L73.1933 56.4035C73.3396 56.5549 73.4232 56.7638 73.4232 56.9778V277.298C73.4232 277.752 73.0522 278.123 72.5977 278.123H51.97C51.5155 278.123 51.1445 277.752 51.1445 277.298ZM71.7722 57.3068L62.2839 47.4442L52.7956 57.3068V276.467H71.7722V57.3068Z"
          fill="#989FB1"
        ></path>
        <path
          d="M51.9684 110.387H72.596C72.9409 110.387 73.2491 110.173 73.3693 109.854C73.4895 109.531 73.4007 109.17 73.1446 108.946L54.1576 92.2489H72.596C72.9461 92.2489 73.2596 92.0297 73.3745 91.7007C73.4895 91.3718 73.385 91.0011 73.1133 90.7818L54.3091 75.6304H72.596V73.9806H51.9684C51.6183 73.9806 51.3049 74.1999 51.1899 74.5288C51.075 74.8577 51.1795 75.2284 51.4512 75.4477L70.2553 90.5991H51.9684C51.6236 90.5991 51.3153 90.8132 51.1951 91.1317C51.075 91.4554 51.1638 91.8156 51.4198 92.0401L70.4068 108.737H51.9684V110.387Z"
          fill="#989FB1"
        ></path>
        <path
          d="M51.9684 92.4062H72.596C72.9409 92.4062 73.2491 92.1921 73.3693 91.8736C73.4895 91.5499 73.4007 91.1897 73.1446 90.9652L54.1576 74.2684H72.596C72.9461 74.2684 73.2596 74.0491 73.3745 73.7201C73.4895 73.3912 73.385 73.0205 73.1133 72.8013L54.3091 57.6498H72.596V56H51.9684C51.6183 56 51.3049 56.2193 51.1899 56.5482C51.075 56.8771 51.1795 57.2478 51.4512 57.4671L70.2553 72.6185H51.9684C51.6236 72.6185 51.3153 72.8326 51.1951 73.1511C51.075 73.4748 51.1638 73.835 51.4198 74.0595L70.4068 90.7563H51.9684V92.4062Z"
          fill="#989FB1"
        ></path>
        <path
          d="M72.0735 277.705L73.1185 276.426L54.2777 261.013H72.596C72.9461 261.013 73.2543 260.794 73.3745 260.465C73.4894 260.136 73.3902 259.771 73.1185 259.551L54.2882 244.196H72.596C72.9461 244.196 73.2595 243.977 73.3745 243.643C73.4894 243.314 73.3849 242.943 73.1132 242.724L54.3143 227.62H72.596C72.9461 227.62 73.2595 227.4 73.3745 227.071C73.4894 226.743 73.3902 226.377 73.1185 226.153L54.3039 210.923H72.6012C72.9513 210.923 73.2648 210.704 73.3797 210.375C73.4947 210.046 73.3954 209.68 73.1237 209.456L54.3091 194.226H72.6064C72.9565 194.226 73.27 194.007 73.3849 193.673C73.4999 193.344 73.3954 192.973 73.1237 192.754L54.3248 177.649H72.6064C72.9565 177.649 73.27 177.43 73.3849 177.096C73.4999 176.767 73.3954 176.396 73.1185 176.177L54.33 161.182H72.6012C72.9513 161.182 73.2595 160.963 73.3797 160.634C73.4999 160.305 73.3954 159.94 73.1289 159.72L54.2777 144.209H72.6064C72.9617 144.209 73.2752 143.984 73.3902 143.645C73.5051 143.311 73.3902 142.94 73.1028 142.726L54.4449 128.66H72.6064V127.011H51.9788C51.6235 127.011 51.31 127.235 51.1951 127.574C51.0801 127.909 51.1951 128.279 51.4825 128.493L70.1403 142.559H51.9788C51.6287 142.559 51.3205 142.778 51.2003 143.107C51.0801 143.436 51.1846 143.801 51.4511 144.021L70.3023 159.532H51.9736C51.6235 159.532 51.31 159.752 51.1951 160.086C51.0801 160.415 51.1846 160.785 51.4616 161.005L70.25 175.999H51.9788C51.6287 175.999 51.3153 176.219 51.2003 176.553C51.0854 176.882 51.1899 177.252 51.4616 177.472L70.2605 192.576H51.9788C51.6287 192.576 51.3153 192.795 51.2003 193.124C51.0854 193.453 51.1899 193.819 51.4616 194.043L70.2762 209.273H51.9788C51.6287 209.273 51.3153 209.492 51.2003 209.821C51.0854 210.15 51.1899 210.516 51.4616 210.74L70.2762 225.97H51.9788C51.6287 225.97 51.3153 226.189 51.2003 226.523C51.0854 226.852 51.1899 227.223 51.4616 227.442L70.2605 242.547H51.9788C51.6287 242.547 51.3205 242.766 51.2003 243.095C51.0854 243.424 51.1846 243.789 51.4563 244.008L70.2866 259.363H51.9788C51.6287 259.363 51.3205 259.583 51.2003 259.912C51.0801 260.241 51.1846 260.606 51.4563 260.825L72.084 277.705H72.0735Z"
          fill="#989FB1"
        ></path>
        <path
          d="M12.5996 91.562V74.1812C12.5996 73.727 12.9706 73.3563 13.4251 73.3563H169.47C169.924 73.3563 170.295 73.727 170.295 74.1812V91.562C170.295 92.0162 169.924 92.3869 169.47 92.3869H13.4251C12.9706 92.3869 12.5996 92.0162 12.5996 91.562ZM168.644 75.0061H14.2559V90.737H168.65V75.0061H168.644Z"
          fill="#989FB1"
        ></path>
        <path
          d="M34.1461 92.3867C34.2663 92.3867 34.3812 92.3606 34.4962 92.3084C34.7887 92.1726 34.9716 91.8803 34.9716 91.5618V74.181H33.3206V89.7919L13.9574 73.5493C13.7118 73.3404 13.367 73.2987 13.0796 73.4344C12.787 73.5702 12.6041 73.8625 12.6041 74.181V91.5618H14.2552V75.9509L33.6184 92.1935C33.7699 92.3188 33.958 92.3867 34.1513 92.3867H34.1461Z"
          fill="#989FB1"
        ></path>
        <path
          d="M51.9694 92.3868C52.0791 92.3868 52.1888 92.366 52.2881 92.3242C52.5964 92.1937 52.7949 91.8961 52.7949 91.5619V74.1812H51.1439V89.6041L34.7274 73.5912C34.4871 73.3614 34.137 73.2936 33.8288 73.4189C33.5205 73.5494 33.322 73.847 33.322 74.1812V91.5619H34.973V76.139L51.3894 92.1519C51.5462 92.3033 51.7552 92.3868 51.9641 92.3868H51.9694Z"
          fill="#989FB1"
        ></path>
        <path
          d="M72.5948 92.3867C72.715 92.3867 72.83 92.3606 72.9449 92.3084C73.2375 92.1726 73.4204 91.8803 73.4204 91.5618V74.181H71.7693V89.7866L52.5001 73.5493C52.2546 73.3404 51.9097 73.2987 51.6224 73.4344C51.3298 73.5702 51.1469 73.8625 51.1469 74.181V91.5618H52.798V75.9562L72.0671 92.1935C72.2186 92.3241 72.4067 92.3867 72.6001 92.3867H72.5948Z"
          fill="#989FB1"
        ></path>
        <path
          d="M91.9697 92.3868C92.0847 92.3868 92.1996 92.3659 92.3041 92.3137C92.6019 92.1832 92.7953 91.8856 92.7953 91.5619V74.1811H91.1442V89.7137L73.1447 73.5703C72.9043 73.351 72.5543 73.2988 72.2565 73.4293C71.9586 73.5598 71.7653 73.8574 71.7653 74.1811V91.5619H73.4164V76.0294L91.4159 92.1728C91.5726 92.3137 91.766 92.3816 91.9697 92.3816V92.3868Z"
          fill="#989FB1"
        ></path>
        <path
          d="M111.343 92.3868C111.458 92.3868 111.573 92.3659 111.677 92.3137C111.975 92.1832 112.168 91.8856 112.168 91.5619V74.1811H110.517V89.7137L92.5178 73.5703C92.2774 73.351 91.9274 73.2988 91.6296 73.4293C91.3317 73.5598 91.1384 73.8574 91.1384 74.1811V91.5619H92.7895V76.0294L110.789 92.1728C110.946 92.3137 111.139 92.3816 111.343 92.3816V92.3868Z"
          fill="#989FB1"
        ></path>
        <path
          d="M130.72 92.3868C130.835 92.3868 130.95 92.3659 131.055 92.3137C131.353 92.1832 131.546 91.8856 131.546 91.5619V74.1811H129.895V89.7137L111.895 73.5703C111.65 73.351 111.305 73.2988 111.007 73.4293C110.709 73.5598 110.516 73.8574 110.516 74.1811V91.5619H112.167V76.0294L130.167 92.1728C130.323 92.3137 130.517 92.3816 130.72 92.3816V92.3868Z"
          fill="#989FB1"
        ></path>
        <path
          d="M150.096 92.3868C150.211 92.3868 150.326 92.3659 150.43 92.3137C150.728 92.1832 150.921 91.8856 150.921 91.5619V74.1811H149.27V89.7137L131.271 73.5703C131.03 73.351 130.68 73.2988 130.383 73.4293C130.085 73.5598 129.891 73.8574 129.891 74.1811V91.5619H131.542V76.0294L149.542 92.1728C149.699 92.3137 149.892 92.3816 150.096 92.3816V92.3868Z"
          fill="#989FB1"
        ></path>
        <path
          d="M169.471 92.3868C169.586 92.3868 169.701 92.3659 169.806 92.3137C170.103 92.1832 170.297 91.8856 170.297 91.5619V74.1811H168.646V89.7137L150.646 73.5703C150.406 73.351 150.056 73.2988 149.758 73.4293C149.46 73.5598 149.267 73.8574 149.267 74.1811V91.5619H150.918V76.0294L168.917 92.1728C169.074 92.3137 169.267 92.3816 169.471 92.3816V92.3868Z"
          fill="#989FB1"
        ></path>
        <path
          d="M52.5457 110.141H95.763V122.839C95.763 123.202 95.6206 123.543 95.3638 123.792L95.3629 123.793L82.0553 136.772L82.0533 136.774C81.8081 137.016 81.474 137.151 81.1269 137.151H52.5457V110.141ZM74.6638 113.876C73.6968 113.876 72.9096 114.661 72.9096 115.629V121.816C72.9096 122.783 73.6968 123.569 74.6638 123.569H86.3099C87.277 123.569 88.0641 122.783 88.0641 121.816V115.629C88.0641 114.661 87.277 113.876 86.3099 113.876H74.6638ZM56.7949 113.876C55.8279 113.876 55.0407 114.661 55.0407 115.629V121.816C55.0407 122.783 55.8279 123.569 56.7949 123.569H68.441C69.408 123.569 70.1952 122.783 70.1952 121.816V115.629C70.1952 114.661 69.408 113.876 68.441 113.876H56.7949Z"
          fill="#AFB0B4"
          fillOpacity="0.7"
          stroke="#6E7689"
          strokeWidth="1.15714"
        ></path>
        <path
          d="M152.702 74.9696L153.188 73.3928L62.5211 45.4656C62.2965 45.3977 62.0457 45.429 61.8419 45.5543L16.6523 73.4816L17.5197 74.886L62.3905 47.152L152.696 74.9696H152.702Z"
          fill="#989FB1"
        ></path>
        <path
          d="M168.252 90.7371H168.644V74.1812C168.644 73.8418 168.853 73.5338 169.172 73.4137C169.49 73.2884 169.851 73.3772 170.081 73.6278L185.995 91.0085C186.215 91.2487 186.272 91.5985 186.142 91.8961C186.011 92.1937 185.713 92.3869 185.384 92.3869H168.252V90.7371ZM170.295 76.3061V90.7371H183.508L170.295 76.3061Z"
          fill="#989FB1"
        ></path>
      </g>
      <path
        d="M36.7382 253.584H30.3953V304.243H36.7382V253.584Z"
        fill="#9A9DA7"
      ></path>
      <path
        d="M79.948 253.584H73.605V304.243H79.948V253.584Z"
        fill="#9A9DA7"
      ></path>
      <path
        d="M87.4879 256.283H23.9383V276.374H87.4879V256.283Z"
        fill="#CACFE0"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.8107 276.374H33.1129L39.2625 256.283H30.9603L24.8107 276.374ZM40.0884 276.374H48.3855L54.5351 256.283H46.2328L40.0884 276.374ZM55.5584 276.374H63.8555L70.0051 256.283H61.7028L55.5584 276.374ZM79.3262 276.374H71.0239L77.1735 256.283H85.4758L79.3262 276.374Z"
        fill="url(#paint19_linear_3021_93)"
      ></path>
      <path
        d="M461.599 306.071H2.399C1.39061 306.071 0.570312 305.251 0.570312 304.244C0.570312 303.236 1.39061 302.416 2.399 302.416H461.599C462.607 302.416 463.427 303.236 463.427 304.244C463.427 305.251 462.607 306.071 461.599 306.071Z"
        fill="#B6B9BC"
      ></path>
      <path
        d="M376.95 324H129.047C128.039 324 127.219 323.18 127.219 322.172C127.219 321.165 128.039 320.345 129.047 320.345H376.955C377.963 320.345 378.784 321.165 378.784 322.172C378.784 323.18 377.963 324 376.955 324H376.95Z"
        fill="#B6B9BC"
      ></path>
      <path
        d="M75.0336 324H58.0842C57.0759 324 56.2556 323.18 56.2556 322.172C56.2556 321.165 57.0759 320.345 58.0842 320.345H75.0336C76.042 320.345 76.8623 321.165 76.8623 322.172C76.8623 323.18 76.042 324 75.0336 324Z"
        fill="#B6B9BC"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M211.171 110.52L211.172 110.507L212.566 109.949L212.081 109.695C210.336 108.782 208.319 108.536 206.406 109.001L183.375 114.593L183.642 115.699L206.673 110.108C208.182 109.739 209.762 109.889 211.171 110.52Z"
        fill="#B3BACC"
      ></path>
      <g filter="url(#filter0_d_3021_93)">
        <path
          d="M235.745 119.974L180.963 113.281C177.918 112.909 175.148 115.074 174.776 118.117L170.188 155.617C169.816 158.659 171.982 161.427 175.027 161.799L229.809 168.492C232.854 168.863 235.624 166.699 235.996 163.656L240.584 126.156C240.956 123.113 238.79 120.346 235.745 119.974Z"
          fill="#A1A7C0"
        ></path>
      </g>
      <path
        d="M231.679 123.658L184.023 117.836C181.33 117.507 178.881 119.421 178.552 122.112L174.884 152.092C174.555 154.782 176.47 157.23 179.163 157.559L226.819 163.381C229.511 163.71 231.961 161.795 232.29 159.105L235.958 129.125C236.287 126.434 234.371 123.986 231.679 123.658Z"
        fill="#F2F2F1"
      ></path>
      <path
        d="M195.119 129.788L188.329 132.672L189.11 134.508L195.9 131.624L195.119 129.788Z"
        fill="#99A0AE"
      ></path>
      <path
        d="M194.185 142.431C195.812 142.431 197.132 141.113 197.132 139.486C197.132 137.86 195.812 136.542 194.185 136.542C192.557 136.542 191.238 137.86 191.238 139.486C191.238 141.113 192.557 142.431 194.185 142.431Z"
        fill="#99A0AE"
      ></path>
      <path
        d="M216.194 134.114L222.088 138.547L223.288 136.954L217.394 132.52L216.194 134.114Z"
        fill="#99A0AE"
      ></path>
      <path
        d="M215.972 145.094C217.599 145.094 218.919 143.775 218.919 142.149C218.919 140.523 217.599 139.205 215.972 139.205C214.344 139.205 213.025 140.523 213.025 142.149C213.025 143.775 214.344 145.094 215.972 145.094Z"
        fill="#99A0AE"
      ></path>
      <path
        d="M207.719 148.155C207.892 146.735 206.468 145.393 204.537 145.157C202.607 144.922 200.901 145.881 200.728 147.301C200.554 148.721 201.978 150.063 203.909 150.298C205.839 150.534 207.545 149.575 207.719 148.155Z"
        fill="#99A0AE"
      ></path>
    </g>
    <defs>
      <filter
        id="filter0_d_3021_93"
        x="142.375"
        y="90.0967"
        width="139.908"
        height="124.722"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dx="6.94286" dy="11.5714"></feOffset>
        <feGaussianBlur stdDeviation="17.3571"></feGaussianBlur>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.337255 0 0 0 0 0.443137 0 0 0 0 0.6 0 0 0 0.2 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3021_93"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3021_93"
          result="shape"
        ></feBlend>
      </filter>
      <linearGradient
        id="paint0_linear_3021_93"
        x1="183.111"
        y1="153.706"
        x2="196.038"
        y2="153.706"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_3021_93"
        x1="177.791"
        y1="177.279"
        x2="201.951"
        y2="177.279"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_3021_93"
        x1="177.791"
        y1="168.226"
        x2="201.951"
        y2="168.226"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_3021_93"
        x1="177.791"
        y1="186.332"
        x2="201.951"
        y2="186.332"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_3021_93"
        x1="177.791"
        y1="195.955"
        x2="201.951"
        y2="195.955"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint5_linear_3021_93"
        x1="177.791"
        y1="205.232"
        x2="201.951"
        y2="205.232"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint6_linear_3021_93"
        x1="177.791"
        y1="214.51"
        x2="201.951"
        y2="214.51"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint7_linear_3021_93"
        x1="182.268"
        y1="223.438"
        x2="201.95"
        y2="223.438"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint8_linear_3021_93"
        x1="214.626"
        y1="232.997"
        x2="238.786"
        y2="232.997"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint9_linear_3021_93"
        x1="219.103"
        y1="241.925"
        x2="238.785"
        y2="241.925"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint10_linear_3021_93"
        x1="415.407"
        y1="280.029"
        x2="421.193"
        y2="261.514"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B6BBC4"></stop>
        <stop offset="0.99" stopColor="#C8CDD3"></stop>
      </linearGradient>
      <linearGradient
        id="paint11_linear_3021_93"
        x1="142.996"
        y1="302.374"
        x2="142.996"
        y2="299.712"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#CED5E0"></stop>
        <stop offset="0.99" stopColor="#DFE5EC"></stop>
      </linearGradient>
      <linearGradient
        id="paint12_linear_3021_93"
        x1="130.627"
        y1="296.01"
        x2="155.361"
        y2="296.01"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B3B8BE"></stop>
        <stop offset="0.99" stopColor="#808488"></stop>
      </linearGradient>
      <linearGradient
        id="paint13_linear_3021_93"
        x1="135.859"
        y1="281.981"
        x2="150.133"
        y2="281.981"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B3B8BE"></stop>
        <stop offset="0.99" stopColor="#808488"></stop>
      </linearGradient>
      <linearGradient
        id="paint14_linear_3021_93"
        x1="274.777"
        y1="302.374"
        x2="274.777"
        y2="299.712"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#CED5E0"></stop>
        <stop offset="0.99" stopColor="#DFE5EC"></stop>
      </linearGradient>
      <linearGradient
        id="paint15_linear_3021_93"
        x1="262.409"
        y1="296.01"
        x2="287.144"
        y2="296.01"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B3B8BE"></stop>
        <stop offset="0.99" stopColor="#808488"></stop>
      </linearGradient>
      <linearGradient
        id="paint16_linear_3021_93"
        x1="267.641"
        y1="281.981"
        x2="281.916"
        y2="281.981"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B3B8BE"></stop>
        <stop offset="0.99" stopColor="#808488"></stop>
      </linearGradient>
      <linearGradient
        id="paint17_linear_3021_93"
        x1="305.945"
        y1="300.056"
        x2="382.024"
        y2="300.056"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint18_linear_3021_93"
        x1="315.848"
        y1="275.653"
        x2="372.125"
        y2="275.653"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ADB8C9"></stop>
        <stop offset="0.99" stopColor="#98A0B0"></stop>
      </linearGradient>
      <linearGradient
        id="paint19_linear_3021_93"
        x1="51.3095"
        y1="276.933"
        x2="57.8367"
        y2="256.047"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B6BBC4"></stop>
        <stop offset="0.99" stopColor="#C8CDD3"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-menuHome"
    viewBox="0 0 73 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M45.2104 47.6695H36.1491L36.147 47.6715H26.952C25.0998 47.6715 23.2559 47.297 21.5766 46.5129C19.6256 45.6033 17.5676 44.0289 17.1416 41.3741C16.2896 36.0645 14.3757 22.7618 14.3757 22.7618C14.3757 22.7618 13.6328 18.3968 16.5037 15.8079C19.3766 13.219 31.9426 6.30004 31.9426 6.30004C31.9426 6.30004 34.194 4.88621 35.9433 4.78125H36.2191C37.9684 4.88621 40.2198 6.30004 40.2198 6.30004C40.2198 6.30004 52.7878 13.219 55.6587 15.8079C58.5296 18.3968 57.7867 22.7597 57.7867 22.7597C57.7867 22.7597 55.8748 36.0645 55.0207 41.3721C54.5927 44.0269 52.5368 45.6012 50.5858 46.5108C48.9065 47.297 47.0646 47.6695 45.2104 47.6695ZM29.7955 33.453C28.7136 33.0309 27.4944 33.5657 27.0724 34.6476C26.6503 35.7294 27.1851 36.9486 28.267 37.3707L29.2979 37.7729C33.7044 39.4894 38.5996 39.4712 42.9945 37.7242L43.8956 37.3653C44.9745 36.9356 45.5008 35.7127 45.0711 34.6338C44.6414 33.555 43.4185 33.0287 42.3396 33.4584L41.4391 33.817C38.0326 35.1709 34.2387 35.1841 30.8243 33.8544L29.7955 33.453Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-menuLottery"
    viewBox="0 0 73 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_2654_24939"
      style={{maskType: 'luminance'}}
      maskUnits="userSpaceOnUse"
      x="13"
      y="3"
      width="45"
      height="45"
    >
      <path
        d="M57.3233 3.98438H13.4302V47.8775H57.3233V3.98438Z"
        fill="white"
      ></path>
    </mask>
    <g mask="url(#mask0_2654_24939)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.5282 5.49028C35.5882 6.35397 34.9367 7.10277 34.073 7.16277C30.4802 7.41237 27.0346 8.68803 24.1455 10.8383C21.2564 12.9885 19.0453 15.9229 17.7748 19.2928C16.5043 22.6627 16.2279 26.3264 16.9784 29.8488C17.7288 33.3712 19.4747 36.6042 22.0085 39.1635C24.5422 41.7229 27.7574 43.5011 31.2721 44.2869C34.7867 45.0728 38.4531 44.8332 41.8356 43.5966C45.2181 42.3601 48.1745 40.1785 50.3537 37.3112C52.5329 34.4438 53.8431 31.0112 54.1288 27.4211C54.1975 26.5581 54.9528 25.9141 55.8158 25.9828C56.6789 26.0515 57.3228 26.8068 57.2541 27.6698C56.9208 31.8583 55.3922 35.863 52.8499 39.2083C50.3075 42.5535 46.8583 45.0986 42.9121 46.5412C38.9658 47.9839 34.6884 48.2634 30.588 47.3466C26.4875 46.4298 22.7365 44.3552 19.7804 41.3692C16.8243 38.3833 14.7875 34.6116 13.912 30.5022C13.0364 26.3927 13.3589 22.1183 14.8411 18.1868C16.3234 14.2552 18.903 10.8318 22.2736 8.32318C25.6443 5.81458 29.6642 4.32628 33.8557 4.03508C34.7194 3.97508 35.4682 4.62659 35.5282 5.49028Z"
        fill="#768096"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.3339 4.04129C48.8782 4.19205 49.2993 4.62392 49.4363 5.17182L50.7758 10.5298L56.1337 11.8693C56.6816 12.0062 57.1135 12.4274 57.2643 12.9717C57.415 13.5159 57.2613 14.0992 56.862 14.4986L50.5916 20.769C50.2022 21.1583 49.6371 21.3149 49.1029 21.1813L43.6935 19.829L36.4831 27.0394C35.8708 27.6516 34.8783 27.6516 34.2661 27.0394C33.6539 26.4273 33.6539 25.4347 34.2661 24.8225L41.4766 17.6121L40.1242 12.2027C39.9907 11.6685 40.1472 11.1034 40.5365 10.714L46.807 4.44356C47.2064 4.0442 47.7897 3.89054 48.3339 4.04129ZM44.5053 16.8002L49.0022 17.9245L52.6873 14.2394L49.1029 13.3433C48.5412 13.2029 48.1027 12.7643 47.9623 12.2027L47.0662 8.61826L43.3811 12.3033L44.5053 16.8002ZM33.3855 16.6122C33.7012 17.4184 33.3035 18.3278 32.4973 18.6435C31.2841 19.1183 30.2085 19.8882 29.3677 20.8833C28.5268 21.8784 27.9473 23.0675 27.6814 24.3428C27.4156 25.6182 27.4719 26.9398 27.8452 28.188C28.2185 29.4361 28.897 30.5715 29.8194 31.4916C30.7418 32.4116 31.879 33.0872 33.1281 33.4573C34.3773 33.8274 35.6989 33.8802 36.9737 33.6111C38.2484 33.3421 39.4359 32.7594 40.4288 31.9161C41.4218 31.0726 42.1888 29.995 42.6607 28.7807C42.9742 27.9737 43.8825 27.5736 44.6895 27.8872C45.4966 28.2007 45.8966 29.1091 45.583 29.9161C44.9225 31.6162 43.8486 33.1248 42.4585 34.3056C41.0684 35.4864 39.4058 36.302 37.6213 36.6788C35.8367 37.0555 33.9863 36.9815 32.2376 36.4634C30.4888 35.9453 28.8967 34.9994 27.6054 33.7114C26.314 32.4233 25.364 30.8337 24.8414 29.0863C24.3188 27.3388 24.24 25.4887 24.6122 23.7031C24.9844 21.9176 25.7957 20.253 26.9729 18.8598C28.1501 17.4666 29.656 16.3889 31.3544 15.724C32.1606 15.4083 33.07 15.806 33.3855 16.6122Z"
        fill="#768096"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-menuMore"
    viewBox="0 0 73 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="20.7538"
      y="9.15171"
      width="14.3831"
      height="14.3831"
      rx="1.19859"
      stroke="#768096"
      strokeWidth="2.39718"
    ></rect>
    <rect
      x="20.7538"
      y="28.3314"
      width="14.3831"
      height="14.3831"
      rx="1.19859"
      stroke="#768096"
      strokeWidth="2.39718"
    ></rect>
    <rect
      x="39.9315"
      y="28.3314"
      width="14.3831"
      height="14.3831"
      rx="1.19859"
      stroke="#768096"
      strokeWidth="2.39718"
    ></rect>
    <circle
      cx="47.123"
      cy="16.3432"
      r="7.19153"
      stroke="#768096"
      strokeWidth="2.39718"
    ></circle>
  </symbol>
  <symbol
    id="icon-menuOriginals"
    viewBox="0 0 74 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M57.5699 28.3477L58.0524 23.2146C58.4317 19.1856 58.6213 17.169 57.9323 16.3367C57.7585 16.1197 57.5432 15.9395 57.299 15.8067C57.0548 15.674 56.7865 15.5912 56.51 15.5634C55.5079 15.475 54.2513 16.9051 51.738 19.7654L51.7308 19.7735C50.4286 21.257 49.7775 21.9966 49.0526 22.1125C48.648 22.1757 48.2392 22.1104 47.8683 21.9229C47.1961 21.5857 46.7494 20.6712 45.856 18.8379L41.1422 9.17859L41.1402 9.17442C39.4516 5.7151 38.6068 3.98438 37.3219 3.98438C36.037 3.98438 35.1922 5.71502 33.5037 9.1742L33.5015 9.17859L28.7877 18.8379L28.7686 18.8772C27.8858 20.6822 27.4428 21.5881 26.7754 21.9229C26.4105 22.1093 25.996 22.1756 25.5912 22.1125C24.8663 21.9966 24.2152 21.257 22.9129 19.7735L22.9056 19.7652C20.3924 16.905 19.1358 15.475 18.1338 15.5634C17.8572 15.5912 17.589 15.674 17.3447 15.8067C17.1005 15.9395 16.8852 16.1197 16.7115 16.3367C16.0203 17.169 16.2099 19.1856 16.5892 23.2146L17.0739 28.3477L17.0762 28.3719C17.8712 36.8098 18.2689 41.0312 20.7594 43.5784C23.2522 46.1282 26.9861 46.1282 34.4561 46.1282H40.1876C47.6597 46.1282 51.3937 46.1282 53.8822 43.5784C56.3749 41.0311 56.7733 36.8024 57.5697 28.3496L57.5699 28.3477ZM39.8554 36.4375L40.6039 36.7521C41.3187 37.0525 42.0971 36.4869 42.0323 35.7143L41.771 32.5985C41.7477 32.3221 41.8368 32.0479 42.0181 31.8379L44.0609 29.4708C44.5675 28.8838 44.2702 27.9688 43.5154 27.7917L40.4713 27.0773C40.2012 27.014 39.968 26.8446 39.8243 26.6073L38.2043 23.9329C37.8026 23.2698 36.8405 23.2698 36.4388 23.9329L34.8187 26.6073C34.675 26.8446 34.4418 27.014 34.1718 27.0773L31.1277 27.7917C30.3729 27.9688 30.0755 28.8838 30.5821 29.4708L32.625 31.8379C32.8062 32.0479 32.8953 32.3221 32.8721 32.5985L32.6107 35.7143C32.5459 36.4869 33.3243 37.0525 34.0391 36.7521L34.7805 36.4405C34.9676 36.3691 35.1744 36.2809 35.4041 36.1784L36.9216 35.5407C37.1774 35.4332 37.4656 35.4332 37.7214 35.5407L39.2511 36.1836C39.4731 36.2825 39.6735 36.3679 39.8554 36.4375Z"
      fill="#768096"
    ></path>
  </symbol>
  <symbol
    id="icon-menuSlots"
    viewBox="0 0 74 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M37.1975 32.0121C39.1776 32.0474 41.1506 32.2947 42.97 32.7381C46.0294 33.5295 48.9048 34.9513 51.5246 36.7036C52.5598 37.3956 53.5086 38.1202 54.438 38.83L54.4381 38.8301C56.7136 40.5679 58.8731 42.2171 61.9018 43.0837C64.2336 43.7514 67.7275 44.299 69.6636 42.4107C71.4413 40.678 71.0852 37.7984 70.7984 35.4794C70.7694 35.2453 70.7412 35.0169 70.7159 34.7959C69.81 26.8879 67.9379 17.3901 62.165 11.4816C58.9963 8.2385 54.1761 6.23545 50.2155 9.39017C43.7684 14.5268 37.005 14.5409 37.005 14.5409H36.5916C36.5916 14.5409 29.8264 14.525 23.3809 9.39017C19.4207 6.23545 14.6003 8.23677 11.4314 11.4816C5.6589 17.3901 3.78476 26.8861 2.88042 34.7942C2.85505 35.016 2.82666 35.2454 2.79755 35.4806C2.51065 37.7988 2.15465 40.6754 3.93316 42.409C5.87087 44.2972 9.36475 43.7497 11.6946 43.0819C14.7223 42.2153 16.8825 40.5658 19.1587 38.8279L19.1587 38.8279C20.0882 38.1182 21.037 37.3937 22.072 36.7018C24.6915 34.9496 27.5672 33.5295 30.6266 32.7363C32.6791 32.2047 34.9436 31.9697 37.1992 32.0104L37.1975 32.0121ZM22.3734 17.5703C22.3734 18.7147 21.4457 19.6424 20.3012 19.6424C19.1568 19.6424 18.229 18.7147 18.229 17.5703C18.229 16.4258 19.1568 15.498 20.3012 15.498C21.4457 15.498 22.3734 16.4258 22.3734 17.5703ZM22.3734 26.4121C22.3734 27.5565 21.4457 28.4843 20.3012 28.4843C19.1568 28.4843 18.229 27.5565 18.229 26.4121C18.229 25.2676 19.1568 24.3398 20.3012 24.3398C21.4457 24.3398 22.3734 25.2676 22.3734 26.4121ZM15.8813 24.0624C17.0258 24.0624 17.9535 23.1346 17.9535 21.9902C17.9535 20.8457 17.0258 19.918 15.8813 19.918C14.7368 19.918 13.8091 20.8457 13.8091 21.9902C13.8091 23.1346 14.7368 24.0624 15.8813 24.0624ZM26.7992 21.9902C26.7992 23.1346 25.8714 24.0624 24.727 24.0624C23.5825 24.0624 22.6548 23.1346 22.6548 21.9902C22.6548 20.8457 23.5825 19.918 24.727 19.918C25.8714 19.918 26.7992 20.8457 26.7992 21.9902ZM56.6606 16.814C57.4494 16.814 58.0888 17.4534 58.0888 18.2422V21.3394H61.2291C62.0178 21.3394 62.6572 21.9788 62.6572 22.7676C62.6572 23.5563 62.0178 24.1957 61.2291 24.1957H58.0888V27.4014C58.0888 28.1902 57.4494 28.8296 56.6606 28.8296C55.8719 28.8296 55.2325 28.1902 55.2325 27.4014V24.1957H52.0688C51.2801 24.1957 50.6407 23.5563 50.6407 22.7676C50.6407 21.9788 51.2801 21.3394 52.0688 21.3394H55.2325V18.2422C55.2325 17.4534 55.8719 16.814 56.6606 16.814Z"
      fill="#768096"
    ></path>
  </symbol>
  <symbol
    id="icon-message"
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="ä¿¡æ¯">
      <path
        id="Subtract"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.8162 0.537109H5.97017C4.41822 0.538169 2.93015 1.10858 1.83275 2.12308C0.735353 3.13758 0.118333 4.51323 0.117188 5.94795V24.4522C0.118316 25.8835 0.732365 27.2561 1.82509 28.2701C2.91782 29.284 4.40034 29.8567 5.94854 29.8631L12.8305 35.8157C13.4978 36.3929 14.5312 35.886 14.4832 35.0051L14.3182 31.9717C14.2559 30.8262 15.168 29.8631 16.3152 29.8631H30.8162C32.3682 29.862 33.8562 29.2916 34.9536 28.2771C36.051 27.2626 36.668 25.887 36.6692 24.4522V5.94795C36.668 4.51323 36.051 3.13758 34.9536 2.12308C33.8562 1.10858 32.3682 0.538169 30.8162 0.537109ZM8.71766 10.551C8.71766 9.53372 9.54234 8.70904 10.5596 8.70904H16.5685C17.5858 8.70904 18.4105 9.53372 18.4105 10.551C18.4105 11.5683 17.5858 12.393 16.5685 12.393H10.5596C9.54234 12.393 8.71766 11.5683 8.71766 10.551ZM10.7177 16.881C9.61309 16.881 8.71766 17.7764 8.71766 18.881V18.9669C8.71766 20.0715 9.61309 20.9669 10.7177 20.9669H26.0687C27.1733 20.9669 28.0687 20.0715 28.0687 18.9669V18.881C28.0687 17.7764 27.1733 16.881 26.0687 16.881H10.7177Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-messageGarbage"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.75 7.5V33H29.25V7.5H6.75Z"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15 15V24.75"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M21 15V24.75"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 7.5H33"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M12 7.5L14.4667 3H21.5828L24 7.5H12Z"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-messageIconRed"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M34 41H14C8 41 4 38 4 31V17C4 10 8 7 14 7H34C40 7 44 10 44 17V31C44 38 40 41 34 41Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M23.9981 25.744C22.3181 25.744 20.6181 25.224 19.3181 24.164L13.0581 19.164C12.767 18.9112 12.5848 18.5558 12.5493 18.1719C12.5139 17.788 12.628 17.4053 12.8679 17.1035C13.1078 16.8017 13.4549 16.6042 13.8369 16.5521C14.2189 16.5 14.6062 16.5974 14.9181 16.824L21.1781 21.824C22.6981 23.044 25.2781 23.044 26.7981 21.824L33.0581 16.824C33.6981 16.304 34.6581 16.404 35.1581 17.064C35.6781 17.704 35.5781 18.664 34.9181 19.164L28.6581 24.164C27.3781 25.224 25.6781 25.744 23.9981 25.744Z"
      fill="#fff"
    ></path>
    <circle cx="41" cy="7" r="6.5" fill="#FA5B5B" stroke="white"></circle>
  </symbol>
  <symbol
    id="icon-more"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 30"
    fill="none"
  >
    <circle
      cx="15"
      cy="15"
      r="14.25"
      transform="matrix(-1 0 0 1 30 0)"
      stroke="currentColor"
      strokeWidth="1.5"
    ></circle>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7772 6.35976C11.4516 6.03895 10.9286 6.0392 10.6033 6.36031C10.2715 6.68782 10.2717 7.22349 10.6037 7.55075L17.8806 14.722C18.0793 14.9178 18.0793 15.2384 17.8806 15.4343L10.6038 22.6055C10.2717 22.9328 10.2715 23.4684 10.6033 23.7959C10.9287 24.1171 11.4516 24.1173 11.7772 23.7965L19.435 16.2526C20.0897 15.6065 20.0897 14.5498 19.435 13.9036L11.7772 6.35976Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-name"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.0354 24.7852C10.6292 26.8741 6 32.8965 6 40V42C6 43.1046 6.89543 44 8 44H40C41.1046 44 42 43.1046 42 42V40C42 32.8965 37.3708 26.8741 30.9646 24.7852C29.0008 26.1871 26.5967 27.0119 24 27.0119C21.4033 27.0119 18.9992 26.1871 17.0354 24.7852Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M34.5 14.5235C34.5 20.3225 29.799 25.0235 24 25.0235C18.201 25.0235 13.5 20.3225 13.5 14.5235C13.5 8.72455 18.201 4.02354 24 4.02354C29.799 4.02354 34.5 8.72455 34.5 14.5235Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-nbg"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_186_36273"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="1"
      y="1"
      width="68"
      height="68"
    >
      <path
        d="M33.5569 68.5569C52.0898 69.3539 67.7599 54.9761 68.5569 36.4431C69.3539 17.9102 54.9761 2.24013 36.4431 1.44312C17.9102 0.646107 2.24012 15.0239 1.44311 33.5569C0.646096 52.0898 15.0239 67.7599 33.5569 68.5569Z"
        fill="url(#paint0_linear_186_36273)"
      ></path>
    </mask>
    <g mask="url(#mask0_186_36273)">
      <path
        d="M35 68.5879C53.5501 68.5879 68.5879 53.5501 68.5879 35C68.5879 16.4499 53.5501 1.41211 35 1.41211C16.4499 1.41211 1.41211 16.4499 1.41211 35C1.41211 53.5501 16.4499 68.5879 35 68.5879Z"
        fill="url(#paint1_linear_186_36273)"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.8571 54.4386C14.5344 49.7312 10.5774 42.0774 10.9416 33.6084C11.5261 20.0175 23.0175 9.47379 36.6083 10.0583C50.1991 10.6427 60.7429 22.1341 60.1584 35.7249C59.8057 43.9262 55.4813 51.0179 49.1206 55.2243C57.638 50.6342 63.5916 41.8044 64.0375 31.4358C64.7112 15.771 52.5585 2.52612 36.8937 1.85245C21.229 1.17879 7.98407 13.3315 7.3104 28.9962C6.85128 39.6721 12.3497 49.2241 20.8571 54.4386Z"
        fill="url(#paint2_linear_186_36273)"
      ></path>
      <path
        d="M34.4918 59.275C48.0826 59.8595 59.574 49.3158 60.1585 35.725C60.7429 22.1341 50.1992 10.6428 36.6084 10.0583C23.0175 9.47381 11.5262 20.0175 10.9417 33.6084C10.3572 47.1992 20.901 58.6906 34.4918 59.275Z"
        fill="url(#paint3_linear_186_36273)"
      ></path>
      <path
        d="M-27.8454 35.321C-32.8649 44.6572 -29.3655 56.2949 -20.0292 61.3144C-10.693 66.3338 0.944652 62.8344 5.96414 53.4982C10.9836 44.1619 7.4842 32.5243 -1.85205 27.5048C-11.1883 22.4853 -22.8259 25.9847 -27.8454 35.321Z"
        fill="url(#paint4_linear_186_36273)"
      ></path>
      <path
        d="M94.1708 28.2582C100.556 35.7018 99.6987 46.9127 92.2551 53.2983C84.8115 59.6839 73.6007 58.8262 67.215 51.3826C60.8294 43.939 61.6871 32.7282 69.1307 26.3425C76.5743 19.9569 87.7852 20.8146 94.1708 28.2582Z"
        fill="url(#paint5_linear_186_36273)"
      ></path>
      <path
        d="M24.5591 -25.4224C32.3161 -31.4235 43.4692 -30 49.4703 -22.243C55.4713 -14.486 54.0479 -3.33291 46.2909 2.66816C38.5339 8.66923 27.3808 7.24577 21.3797 -0.511225C15.3786 -8.26822 16.8021 -19.4213 24.5591 -25.4224Z"
        fill="url(#paint6_linear_186_36273)"
      ></path>
      <path
        d="M23.1952 79.4598C22.7739 89.2581 30.3753 97.5427 40.1736 97.9641C49.9719 98.3855 58.2566 90.784 58.6779 80.9857C59.0993 71.1875 51.4978 62.9028 41.6996 62.4814C31.9013 62.06 23.6166 69.6615 23.1952 79.4598Z"
        fill="url(#paint7_linear_186_36273)"
      ></path>
      <g filter="url(#filter0_f_186_36273)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.9941 54.2005C33.1553 63.2088 51.9376 59.0322 60.9459 44.8715C62.7462 42.0417 64.0197 39.0272 64.7923 35.9438C64.3629 40.3674 62.913 44.7596 60.3637 48.766C51.7109 62.368 33.6703 66.3801 20.0681 57.7273C13.8697 53.7841 9.66276 47.8911 7.73828 41.3577C10.0995 46.4563 13.9011 50.9604 18.9941 54.2005Z"
          fill="#B6B6B6"
        ></path>
      </g>
      <g filter="url(#filter1_f_186_36273)">
        <path
          d="M31.4826 61.6469C31.5328 62.5288 33.3608 63.142 35.5656 63.0166C37.7704 62.8911 39.517 62.0745 39.4668 61.1925C39.4167 60.3106 37.5886 59.6974 35.3839 59.8229C33.1791 59.9483 31.4325 60.765 31.4826 61.6469Z"
          fill="white"
        ></path>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_186_36273"
        x="4.73828"
        y="32.9438"
        width="63.0542"
        height="32.3481"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="1.5"
          result="effect1_foregroundBlur_186_36273"
        ></feGaussianBlur>
      </filter>
      <filter
        id="filter1_f_186_36273"
        x="25.4814"
        y="53.8066"
        width="19.9863"
        height="15.2263"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="3"
          result="effect1_foregroundBlur_186_36273"
        ></feGaussianBlur>
      </filter>
      <linearGradient
        id="paint0_linear_186_36273"
        x1="20.1375"
        y1="8.34639"
        x2="44.0641"
        y2="66.2072"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F22427"></stop>
        <stop offset="1" stopColor="#960204"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_186_36273"
        x1="28.7079"
        y1="6.55778"
        x2="45.3966"
        y2="65.7889"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BABABA"></stop>
        <stop offset="0.538037" stopColor="#AAAAAA"></stop>
        <stop offset="1" stopColor="#9D9D9D"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_186_36273"
        x1="28.9373"
        y1="3.46916"
        x2="38.5326"
        y2="60.4738"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DCDCDC"></stop>
        <stop offset="0.743552" stopColor="#C2C2C2"></stop>
        <stop offset="1" stopColor="#CDCDCD" stopOpacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_186_36273"
        x1="30.1694"
        y1="11.6563"
        x2="35.5173"
        y2="58.6479"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.349342" stopColor="#FDFDFD"></stop>
        <stop offset="1" stopColor="#E1E1E1"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_186_36273"
        x1="9.74742"
        y1="40.5508"
        x2="-28.0715"
        y2="49.2971"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBF9FD"></stop>
        <stop offset="0.373872" stopColor="#EAEAEA"></stop>
      </linearGradient>
      <linearGradient
        id="paint5_linear_186_36273"
        x1="62.1375"
        y1="40.3055"
        x2="79"
        y2="41.9999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBF9FD"></stop>
        <stop offset="0.744724" stopColor="#CDCDCD"></stop>
      </linearGradient>
      <linearGradient
        id="paint6_linear_186_36273"
        x1="36.9468"
        y1="5.59797"
        x2="36.9468"
        y2="-11.196"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0664686" stopColor="#FBF9FD"></stop>
        <stop offset="1" stopColor="#BFBFBF"></stop>
      </linearGradient>
      <linearGradient
        id="paint7_linear_186_36273"
        x1="41"
        y1="63.5"
        x2="39"
        y2="81.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DBDBDB"></stop>
        <stop offset="0.373872" stopColor="#D6D6D6"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-noticeBarSpeaker"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
  >
    <g clipPath="url(#clip0_9095_3163)">
      <path
        d="M15.9993 4V28C11.3327 28 7.86502 21.8927 7.86502 21.8927H3.99935C3.26297 21.8927 2.66602 21.2958 2.66602 20.5594V11.3405C2.66602 10.6041 3.26297 10.0072 3.99935 10.0072H7.86502C7.86502 10.0072 11.3327 4 15.9993 4Z"
        fill="url(#paint0_linear_9095_3163)"
      ></path>
      <path
        d="M21.334 10C21.7495 10.371 22.1261 10.7865 22.4567 11.2392C23.4265 12.5669 24.0007 14.2149 24.0007 16C24.0007 17.7697 23.4363 19.4045 22.4819 20.7262C22.1452 21.1923 21.7601 21.6195 21.334 22"
        stroke="url(#paint1_linear_9095_3163)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M22.8242 27.4568C26.7227 25.1298 29.3336 20.8696 29.3336 15.9996C29.3336 11.2053 26.8031 7.00197 23.005 4.65234"
        stroke="url(#paint2_linear_9095_3163)"
        strokeWidth="1.8"
        strokeLinecap="round"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_9095_3163"
        x1="9.33268"
        y1="4"
        x2="9.33268"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--blackGoldN,var(--main-color))"></stop>
        <stop offset="0.74876" stopColor="var(--main-color)"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_9095_3163"
        x1="22.6673"
        y1="10"
        x2="22.6673"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--blackGoldN,var(--main-color))"></stop>
        <stop offset="0.74876" stopColor="var(--main-color)"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_9095_3163"
        x1="26.0789"
        y1="4.65234"
        x2="26.0789"
        y2="27.4568"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--blackGoldN,var(--main-color))"></stop>
        <stop offset="0.74876" stopColor="var(--main-color)"></stop>
      </linearGradient>
      <clipPath id="clip0_9095_3163">
        <rect width="32" height="32" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-notificationIcon"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2085_65071)">
      <path
        d="M0 16.9334C0 16.004 0.327564 15.2161 0.982692 14.5725C1.63846 13.9283 2.42628 13.6065 3.34808 13.6065H6.69487V28.686H3.34744C2.42628 28.686 1.63846 28.3642 0.982692 27.72C0.327564 27.0758 0 26.2886 0 25.3584V16.9334ZM37.1942 3.08857C38.7179 1.6219 40.0994 0.816776 41.3397 0.673186C42.5795 0.529597 43.6776 0.861007 44.6346 1.66549C45.5904 2.47062 46.4051 3.65139 47.0782 5.20716C47.7513 6.76357 48.3 8.49883 48.7256 10.4123C49.1618 12.3955 49.4811 14.4026 49.6821 16.4232C49.8942 18.5161 50.0006 20.5104 50.0006 22.4065C50.0006 24.3027 49.868 26.1988 49.6019 28.095C49.3365 29.9911 48.9468 31.7706 48.4333 33.4347C47.9192 35.0982 47.3173 36.5559 46.6263 37.8078C45.9359 39.0604 45.1654 39.9905 44.3154 40.5982C43.4654 41.2072 42.5526 41.4213 41.5782 41.2424C40.6045 41.0636 39.5859 40.3661 38.5237 39.1495C37.4962 37.9334 36.1058 36.9225 34.3526 36.1174C32.5987 35.3129 30.6859 34.6328 28.6141 34.079C26.5396 33.5237 24.4379 33.0757 22.3173 32.7366C20.1917 32.3969 18.2436 32.0931 16.4724 31.8245C14.7013 31.5559 13.2224 31.2969 12.0359 31.0463C10.8494 30.7963 10.1846 30.4918 10.0429 30.1341V13.3379C10.1846 12.8373 10.7429 12.4258 11.7167 12.104C12.691 11.7822 13.9308 11.4777 15.4365 11.1918C16.9417 10.9052 18.6417 10.5924 20.5372 10.2527C22.4927 9.89819 24.4264 9.43226 26.3288 8.85716C28.308 8.26174 30.236 7.50803 32.0942 6.60331C33.9628 5.69708 35.6827 4.51195 37.1949 3.08857H37.1942ZM18.066 35.9841C18.2429 36.4136 18.4558 36.8783 18.7032 37.3796C18.9606 37.9296 19.2444 38.4667 19.5538 38.9892C19.9531 39.6673 20.3786 40.3296 20.8295 40.9745C21.4308 41.8334 22.0423 42.7373 22.6622 43.6847C23.2821 44.6334 23.7519 45.4918 24.0699 46.261C24.3891 47.0302 24.4865 47.6649 24.3622 48.1655C24.2385 48.6668 23.734 48.9168 22.8481 48.9168H19.8192C19.1109 48.9168 18.4558 48.7828 17.8532 48.5149C17.2506 48.2456 16.6756 47.8354 16.1263 47.2802C15.5776 46.7257 15.0109 46.0193 14.4263 45.1604C13.8417 44.3014 13.2128 43.2822 12.5397 42.1014C11.7256 40.7424 11.1583 39.5527 10.8397 38.5334C10.5205 37.5136 10.3077 36.6636 10.2019 35.9841C10.0603 35.1969 10.0603 34.5174 10.2019 33.945C10.4853 33.9809 10.8218 34.052 11.2115 34.1597C11.5301 34.2309 11.9199 34.32 12.3808 34.4277C12.841 34.5354 13.3724 34.6424 13.9744 34.7501C14.5769 34.8931 15.1167 35.027 15.5949 35.152C16.0731 35.2777 16.5071 35.4116 16.8968 35.5546C17.2907 35.6862 17.6806 35.8295 18.066 35.9841Z"
        fill="var(--main-color)"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_2085_65071">
        <rect width="50" height="50" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-oddBg"
    viewBox="0 0 702 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M93.3035 35L112.161 2H589.839L608.696 35L589.839 68H112.161L93.3035 35Z"
      stroke="var(--main-color)"
      strokeWidth="4"
    ></path>
    <path
      d="M121 4H581L597 35L581 66H121L105 35L121 4Z"
      fill="var(--main-color)"
    ></path>
    <path d="M92 35L0 35" stroke="var(--main-color)"></path>
    <path
      d="M52.2228 35L60.7081 26.5147L69.1934 35L60.7081 43.4853L52.2228 35Z"
      stroke="var(--main-color)"
      strokeWidth="2"
    ></path>
    <path
      d="M55 35L60.7081 29.2919L66.4162 35L60.7081 40.7081L55 35Z"
      fill="var(--main-color)"
    ></path>
    <path d="M610 35L702 35" stroke="var(--main-color)"></path>
    <path
      d="M649.777 35L641.292 26.5147L632.807 35L641.292 43.4853L649.777 35Z"
      stroke="var(--main-color)"
      strokeWidth="2"
    ></path>
    <path
      d="M647 35L641.292 29.2919L635.584 35L641.292 40.7081L647 35Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-odds"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M33.8263 47H9.17368C5.2116 47 2 43.7805 2 39.8086V8.19139C2 4.21953 5.2116 1 9.17368 1H33.8263C37.7884 1 41 4.21953 41 8.19139V39.8086C41 43.7805 37.7884 47 33.8263 47Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M29.8868 14.2296H13.1132C11.9457 14.2296 11 13.2832 11 12.1148C11 10.9464 11.9457 10 13.1132 10H29.8868C31.0543 10 32 10.9464 32 12.1148C32 13.2832 31.0543 14.2296 29.8868 14.2296ZM29.8868 22.6148H13.1132C11.9457 22.6148 11 21.6684 11 20.5C11 19.3316 11.9457 18.3852 13.1132 18.3852H29.8868C31.0543 18.3852 32 19.3316 32 20.5C32 21.6684 31.0543 22.6148 29.8868 22.6148ZM21.146 31H13.1132C11.9457 31 11 30.0536 11 28.8852C11 27.7168 11.9457 26.7704 13.1132 26.7704H21.146C22.3136 26.7704 23.2592 27.7168 23.2592 28.8852C23.2592 30.0536 22.3109 31 21.146 31Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.9289 43.0711C27.0536 41.1957 26 38.6522 26 36C26 33.3478 27.0536 30.8043 28.9289 28.9289C30.8043 27.0536 33.3478 26 36 26C38.6522 26 41.1957 27.0536 43.0711 28.9289C44.9464 30.8043 46 33.3478 46 36C46 38.6522 44.9464 41.1957 43.0711 43.0711C41.1957 44.9464 38.6522 46 36 46C33.3478 46 30.8043 44.9464 28.9289 43.0711ZM35.9196 39.658V40.2991C35.9196 40.7858 36.0172 41.235 36.2125 41.6466C36.4077 42.0542 36.6931 42.3807 37.0686 42.626C37.4441 42.8753 37.9078 43 38.4598 43C39.0043 43 39.4661 42.8753 39.8454 42.626C40.2246 42.3807 40.5119 42.0542 40.7071 41.6466C40.9024 41.235 41 40.7858 41 40.2991V39.658C41 39.1673 40.9024 38.7181 40.7071 38.3105C40.5156 37.8989 40.2302 37.5705 39.851 37.3251C39.4755 37.0798 39.0118 36.9571 38.4598 36.9571C37.9153 36.9571 37.4535 37.0817 37.0742 37.331C36.6988 37.5764 36.4115 37.9049 36.2125 38.3164C36.0172 38.724 35.9196 39.1712 35.9196 39.658ZM37.5586 40.2991V39.658C37.5586 39.3691 37.6243 39.1 37.7558 38.8507C37.8872 38.6014 38.1219 38.4767 38.4598 38.4767C38.8128 38.4767 39.0493 38.6014 39.1695 38.8507C39.2896 39.1 39.3497 39.3691 39.3497 39.658V40.2991C39.3497 40.588 39.2859 40.8551 39.1582 41.1005C39.0343 41.3458 38.8015 41.4685 38.4598 41.4685C38.1181 41.4685 37.8815 41.3438 37.7501 41.0945C37.6225 40.8452 37.5586 40.5801 37.5586 40.2991ZM30 32.7009V33.342C30 33.8288 30.0958 34.276 30.2873 34.6836C30.4825 35.0872 30.7679 35.4137 31.1434 35.663C31.5226 35.9084 31.9863 36.0311 32.5346 36.0311C33.0828 36.0311 33.5446 35.9104 33.9201 35.669C34.2994 35.4236 34.5866 35.0971 34.7819 34.6895C34.9809 34.2819 35.0804 33.8327 35.0804 33.342V32.7009C35.0804 32.2102 34.9828 31.761 34.7875 31.3534C34.5923 30.9419 34.3069 30.6134 33.9314 30.368C33.5559 30.1227 33.0903 30 32.5346 30C31.9976 30 31.5395 30.1227 31.1603 30.368C30.7848 30.6134 30.4975 30.9419 30.2985 31.3534C30.0995 31.761 30 32.2102 30 32.7009ZM31.6503 33.342V32.7009C31.6503 32.4199 31.7141 32.1528 31.8418 31.8995C31.9694 31.6463 32.2004 31.5196 32.5346 31.5196C32.8913 31.5196 33.1297 31.6443 33.2499 31.8936C33.37 32.1429 33.4301 32.412 33.4301 32.7009V33.342C33.4301 33.6309 33.3663 33.898 33.2386 34.1434C33.1147 34.3887 32.88 34.5114 32.5346 34.5114C32.2041 34.5114 31.9732 34.3887 31.8418 34.1434C31.7141 33.898 31.6503 33.6309 31.6503 33.342ZM38.6738 30.4215L30.7435 42.5785H32.2192L40.1495 30.4215H38.6738Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-output"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 37L35 32L30.0004 27"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M38 37L43 32L38.0004 27"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M43 22V9C43 7.89543 42.1046 7 41 7H7C5.89543 7 5 7.89543 5 9V39C5 40.1046 5.89543 41 7 41H28.4706"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M19 13V35"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M24.5 15C24.5 15 19.4853 15 17 15C14.5147 15 12.5 17.0147 12.5 19.5C12.5 21.9853 14.5147 24 17 24"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M13.5 33C13.5 33 18.5147 33 21 33C23.4853 33 25.5 30.9853 25.5 28.5C25.5 26.0147 23.4853 24 21 24H17"
      stroke="var(--text_white, var(--text_color_L2))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-p3About"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 61"
    fill="none"
  >
    <path
      d="M60.5 30.8047C60.5 47.3732 47.0685 60.8047 30.5 60.8047C13.9315 60.8047 0.5 47.3732 0.5 30.8047C0.5 14.2361 13.9315 0.804688 30.5 0.804688C47.0685 0.804688 60.5 14.2361 60.5 30.8047Z"
      fill="url(#paint0_linear_6048_105305)"
    ></path>
    <path
      d="M31.4375 25.336C29.375 25.336 28 26.7109 28 28.4297V43.2109C28 44.9297 29.3749 46.3047 31.4375 46.3047C33.4999 46.3047 34.8749 44.9297 34.8749 43.211V28.4297C34.8749 26.711 33.5 25.336 31.4375 25.336ZM31.4375 20.1797C33.4999 20.1797 34.8749 18.8047 34.8749 16.7422C34.8749 14.6797 33.5 13.3047 31.4375 13.3047C29.375 13.3047 28 14.6797 28 16.7422C28 18.8047 29.3749 20.1797 31.4375 20.1797Z"
      fill="white"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_6048_105305"
        x1="30.5"
        y1="0.804687"
        x2="30.5"
        y2="60.8047"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#42BBFF"></stop>
        <stop offset="1" stopColor="#1762F2"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-p3Down"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 61"
    fill="none"
  >
    <g clipPath="url(#clip0_6048_105312)">
      <path
        d="M26.6817 15.5322H34.8635C35.576 15.5322 36.1818 15.9877 36.4064 16.6232H25.1388C25.3635 15.9876 25.9693 15.5322 26.6817 15.5322ZM21.0159 25.2868H25.0454V18.2595H36.4999V25.2868H40.0476C41.5105 25.2868 41.9817 25.5603 40.5934 26.9344L33.0444 34.3873C30.5105 36.8904 30.5415 36.8836 28.0121 34.3873L20.4644 26.9333C19.0761 25.5603 19.3956 25.2868 21.0159 25.2868ZM46.8636 43.0438C46.8636 44.1162 46.019 44.9869 44.9758 44.9869H16.0239C14.9807 44.9869 14.1362 44.1162 14.1362 43.0438V33.3272C14.1362 32.2548 14.9807 31.3842 16.0239 31.3842C17.067 31.3842 17.9136 32.2548 17.9136 33.3272V41.1011H43.0882V33.3272C43.0882 32.2548 43.9349 31.3842 44.9759 31.3842C46.019 31.3842 46.8636 32.2548 46.8636 33.3272V43.0438Z"
        fill="white"
      ></path>
      <path
        d="M30.5001 0.804688C13.9314 0.804688 0.5 14.2362 0.5 30.8047C0.5 47.3734 13.9315 60.8048 30.5001 60.8048C47.0686 60.8048 60.5001 47.3733 60.5001 30.8047C60.5001 14.2362 47.0686 0.804688 30.5001 0.804688ZM26.6819 15.5321H34.8637C35.5762 15.5321 36.1819 15.9875 36.4066 16.623H25.1389C25.3636 15.9874 25.9694 15.5321 26.6819 15.5321ZM21.0161 25.2866H25.0455V18.2593H36.5001V25.2866H40.0477C41.5107 25.2866 41.9818 25.5601 40.5936 26.9342L33.0446 34.3871C30.5106 36.8903 30.5416 36.8835 28.0123 34.3871L20.4645 26.9331C19.0762 25.5601 19.3957 25.2866 21.0161 25.2866ZM46.8637 43.0436C46.8637 44.116 46.0191 44.9867 44.976 44.9867H16.0241C14.9808 44.9867 14.1364 44.116 14.1364 43.0436V33.327C14.1364 32.2546 14.9808 31.384 16.0241 31.384C17.0671 31.384 17.9138 32.2546 17.9138 33.327V41.1009H43.0883V33.327C43.0883 32.2546 43.9351 31.384 44.976 31.384C46.0191 31.384 46.8637 32.2546 46.8637 33.327V43.0436Z"
        fill="url(#paint0_linear_6048_105312)"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6048_105312"
        x1="30.5001"
        y1="0.804687"
        x2="30.5001"
        y2="60.8048"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2DE38B"></stop>
        <stop offset="1" stopColor="#0FB6BC"></stop>
      </linearGradient>
      <clipPath id="clip0_6048_105312">
        <rect
          width="60"
          height="60"
          fill="white"
          transform="translate(0.5 0.804688)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p3Guide"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 61"
    fill="none"
  >
    <g clipPath="url(#clip0_6101_28743)">
      <circle
        cx="30"
        cy="30.8047"
        r="30"
        fill="url(#paint0_linear_6101_28743)"
      ></circle>
      <path
        d="M45.9969 40.8447V41.0788C46.001 41.0031 46.001 40.9273 45.9969 40.8516V40.8447ZM44.2065 17.4108C44.0435 17.3995 43.88 17.423 43.7269 17.4796C43.5738 17.5362 43.4348 17.6245 43.3193 17.7387C43.2037 17.8529 43.1143 17.9903 43.0571 18.1415C42.9998 18.2928 42.9761 18.4544 42.9874 18.6155V42.7103C42.9472 43.3317 42.6811 43.9177 42.2382 44.3605C41.7952 44.8033 41.2053 45.073 40.577 45.1198H19.3224C17.8664 45.1198 16.1805 43.9151 16.1805 42.7103V40.0048C16.1805 38.8001 17.6365 38.0635 19.0855 38.0635H39.3718C39.5348 38.0747 39.6984 38.0512 39.8515 37.9947C40.0045 37.9381 40.1435 37.8497 40.2591 37.7355C40.3746 37.6213 40.4641 37.484 40.5213 37.3327C40.5786 37.1815 40.6023 37.0198 40.591 36.8587V17.1836C40.604 16.5716 40.4842 15.9639 40.2398 15.4014C39.9954 14.839 39.632 14.3347 39.174 13.9225C38.716 13.5104 38.1741 13.1999 37.5846 13.0119C36.995 12.8239 36.3716 12.7628 35.7562 12.8327H19.3224C16.6473 12.8327 14 14.2922 14 17.1836V43.6741C14.2086 44.7626 14.7701 45.7544 15.5996 46.4996C16.4291 47.2448 17.4815 47.7029 18.5979 47.8047H40.591C41.8389 47.8058 43.039 47.3299 43.9401 46.4766C44.8412 45.6234 45.3735 44.4589 45.4257 43.2267V18.6568C45.4074 18.3432 45.2731 18.0471 45.0483 17.825C44.8235 17.6028 44.5239 17.4701 44.2065 17.4521V17.4108ZM39.532 40.528H19.8936C19.5703 40.528 19.2602 40.655 19.0316 40.8809C18.8029 41.1068 18.6745 41.4133 18.6745 41.7328C18.6745 42.0523 18.8029 42.3587 19.0316 42.5847C19.2602 42.8106 19.5703 42.9375 19.8936 42.9375H39.539C39.6991 42.9375 39.8576 42.9064 40.0056 42.8458C40.1535 42.7853 40.2879 42.6965 40.4011 42.5847C40.5143 42.4728 40.6041 42.34 40.6653 42.1938C40.7266 42.0477 40.7581 41.891 40.7581 41.7328C40.7581 41.5746 40.7266 41.4179 40.6653 41.2717C40.6041 41.1256 40.5143 40.9928 40.4011 40.8809C40.2879 40.769 40.1535 40.6803 40.0056 40.6197C39.8576 40.5592 39.6991 40.528 39.539 40.528H39.532Z"
        fill="white"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6101_28743"
        x1="30"
        y1="0.804687"
        x2="30"
        y2="60.8047"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6341"></stop>
        <stop offset="1" stopColor="#FF2524"></stop>
      </linearGradient>
      <clipPath id="clip0_6101_28743">
        <rect
          width="60"
          height="60"
          fill="white"
          transform="translate(0 0.804688)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p3Language"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 61"
    fill="none"
  >
    <g clipPath="url(#clip0_6101_28737)">
      <circle
        cx="30"
        cy="30.8047"
        r="30"
        fill="url(#paint0_linear_6101_28737)"
      ></circle>
      <path
        d="M22.3857 46.3972C22.3333 46.3972 22.2632 46.4322 22.2107 46.4322C18.8157 44.7522 16.0508 41.9697 14.3532 38.5747C14.3532 38.5222 14.3882 38.4522 14.3882 38.3997C16.5233 39.0297 18.7283 39.5022 20.9157 39.8697C21.3007 42.0747 21.7557 44.2622 22.3857 46.3972ZM45.645 38.5922C43.9125 42.0747 41.025 44.8922 37.5075 46.5897C38.1725 44.3672 38.7325 42.1272 39.1 39.8697C41.305 39.5022 43.475 39.0297 45.61 38.3997C45.5925 38.4697 45.645 38.5397 45.645 38.5922ZM45.785 23.2972C43.58 22.6322 41.3575 22.0897 39.1 21.7047C38.7325 19.4472 38.19 17.2072 37.5075 15.0197C41.13 16.7522 44.0525 19.6747 45.785 23.2972ZM22.3875 15.2104C21.7575 17.3454 21.3025 19.5154 20.935 21.7204C18.6775 22.0704 16.4375 22.6304 14.215 23.2954C15.9125 19.7779 18.73 16.8904 22.2125 15.1579C22.265 15.1579 22.335 15.2104 22.3875 15.2104Z"
        fill="white"
      ></path>
      <path
        d="M36.111 21.3372C32.051 20.8822 27.956 20.8822 23.896 21.3372C24.3335 18.9397 24.8935 16.5422 25.681 14.2322C25.716 14.0922 25.6985 13.9872 25.716 13.8472C27.0985 13.5147 28.516 13.3047 30.0035 13.3047C31.4735 13.3047 32.9085 13.5147 34.2735 13.8472C34.291 13.9872 34.291 14.0922 34.326 14.2322C35.1135 16.5597 35.6735 18.9397 36.111 21.3372ZM20.5325 36.9157C18.1175 36.4782 15.7375 35.9182 13.4275 35.1307C13.2875 35.0957 13.1825 35.1132 13.0425 35.0957C12.71 33.7132 12.5 32.2957 12.5 30.8082C12.5 29.3382 12.71 27.9032 13.0425 26.5382C13.1825 26.5207 13.2875 26.5207 13.4275 26.4857C15.755 25.7157 18.1175 25.1382 20.5325 24.7007C20.095 28.7607 20.095 32.8557 20.5325 36.9157ZM47.5 30.8082C47.5 32.2957 47.29 33.7132 46.9575 35.0957C46.8175 35.1132 46.7125 35.0957 46.5725 35.1307C44.245 35.9007 41.865 36.4782 39.4675 36.9157C39.9225 32.8557 39.9225 28.7607 39.4675 24.7007C41.865 25.1382 44.2625 25.6982 46.5725 26.4857C46.7125 26.5207 46.8175 26.5382 46.9575 26.5382C47.29 27.9207 47.5 29.3382 47.5 30.8082ZM36.111 40.2722C35.6735 42.6872 35.1135 45.0672 34.326 47.3772C34.291 47.5172 34.291 47.6222 34.2735 47.7622C32.9085 48.0947 31.4735 48.3047 30.0035 48.3047C28.516 48.3047 27.0985 48.0947 25.716 47.7622C25.6985 47.6222 25.716 47.5172 25.681 47.3772C24.92 45.0537 24.3235 42.6795 23.896 40.2722C25.926 40.4997 27.956 40.6572 30.0035 40.6572C32.051 40.6572 34.0985 40.4997 36.111 40.2722ZM36.5852 37.3899C32.2124 37.9421 27.7876 37.9421 23.4148 37.3899C22.8626 33.0171 22.8626 28.5922 23.4148 24.2194C27.7876 23.6673 32.2124 23.6673 36.5852 24.2194C37.1375 28.5922 37.1375 33.0171 36.5852 37.3899Z"
        fill="white"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6101_28737"
        x1="30"
        y1="0.804687"
        x2="30"
        y2="60.8047"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6CEF1D"></stop>
        <stop offset="1" stopColor="#1AC81F"></stop>
      </linearGradient>
      <clipPath id="clip0_6101_28737">
        <rect
          width="60"
          height="60"
          fill="white"
          transform="translate(0 0.804688)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p3Notification"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 61"
    fill="none"
  >
    <g clipPath="url(#clip0_6048_105291)">
      <path
        d="M17.0595 33.0852H13V23.9051H17.0595V33.0852ZM31.3884 46.8481C30.8154 48.4183 27.0175 48.2485 27.0175 48.2485C22.6469 42.6046 22.0527 37.2156 22.0527 37.2156L26.1901 37.2155C26.7528 40.9497 30.1951 43.8574 30.5821 44.4718C31.7914 45.8084 31.3884 46.8481 31.3884 46.8481ZM41.0244 41.5048C41.0244 41.5048 36.1659 35.2035 19.4262 34.4394L19.4219 22.6814C19.4219 22.6814 33.5527 22.1651 40.9649 13.3388C40.9649 13.3388 47.3047 11.8229 46.8209 28.4456C46.8209 28.4456 47.4953 39.8923 41.0244 41.5048Z"
        fill="white"
      ></path>
      <path
        d="M29.9234 0.701172C13.3126 0.701172 -0.153076 14.1669 -0.153076 30.7777C-0.153076 47.3885 13.3126 60.8542 29.9234 60.8542C46.5343 60.8542 59.9999 47.3885 59.9999 30.7777C59.9999 14.1669 46.5343 0.701172 29.9234 0.701172ZM17.0595 33.0845H13V23.9044H17.0595V33.0845ZM31.3884 46.8475C30.8154 48.4177 27.0175 48.2478 27.0175 48.2478C22.6469 42.604 22.0527 37.2149 22.0527 37.2149L26.19 37.2149C26.7528 40.949 30.195 43.8567 30.5821 44.4712C31.7914 45.8078 31.3884 46.8475 31.3884 46.8475ZM41.0244 41.5041C41.0244 41.5041 36.1658 35.2029 19.4262 34.4388L19.4219 22.6808C19.4219 22.6808 33.5527 22.1645 40.9649 13.3382C40.9649 13.3382 47.3047 11.8223 46.8209 28.445C46.8206 28.4451 47.4953 39.8917 41.0244 41.5041Z"
        fill="url(#paint0_linear_6048_105291)"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6048_105291"
        x1="29.9234"
        y1="60.8542"
        x2="29.9234"
        y2="0.701172"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F26919"></stop>
        <stop offset="1" stopColor="#FFBF22"></stop>
      </linearGradient>
      <clipPath id="clip0_6048_105291">
        <rect
          width="60"
          height="60"
          fill="white"
          transform="translate(0 0.804688)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p3Service"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 61 61"
    fill="none"
  >
    <g clipPath="url(#clip0_6101_28729)">
      <circle
        cx="30.5"
        cy="30.8047"
        r="30"
        fill="url(#paint0_linear_6101_28729)"
      ></circle>
      <path
        d="M30.4427 18.1359C25.1577 18.1359 20.8738 22.3326 20.8738 27.5093C20.8738 32.6858 25.1577 36.8825 30.4427 36.8825C35.7275 36.8825 40.0115 32.6858 40.0115 27.5093C40.0094 22.3326 35.7275 18.1359 30.4427 18.1359ZM19.3926 31.1089V22.4539C19.2715 22.4539 19.1504 22.4581 19.0335 22.4686C20.9948 18.2101 25.3617 15.2437 30.4427 15.2437C35.5235 15.2437 39.8924 18.2101 41.8517 22.4686C41.7327 22.4602 41.6137 22.4539 41.4926 22.4539V31.1089C43.9321 31.1089 45.9126 29.1709 45.9126 26.7825C45.9126 25.159 44.9989 23.7459 43.6495 23.0041C41.7497 17.647 36.5626 13.8008 30.4427 13.8008C24.3226 13.8008 19.1376 17.647 17.2357 23.0041C15.8863 23.7437 14.9725 25.1589 14.9725 26.7803C14.9725 29.1709 16.951 31.1089 19.3926 31.1089ZM39.9902 36.0707C37.4891 38.3573 34.1338 39.7576 30.4427 39.7576C26.758 39.7576 23.4068 38.3637 20.9078 36.0836C17.4132 37.8441 14.8559 40.6808 13.9056 44.4385C13.4459 46.2564 15.0201 47.8008 16.8951 47.8008H44.1049C45.9799 47.8008 47.5544 46.2558 47.0891 44.4393C46.1242 40.6721 43.5251 37.8308 39.9902 36.0707Z"
        fill="white"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6101_28729"
        x1="30.5"
        y1="0.804688"
        x2="30.5"
        y2="60.8047"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#42DDFF"></stop>
        <stop offset="1" stopColor="#198AF3"></stop>
      </linearGradient>
      <clipPath id="clip0_6101_28729">
        <rect
          width="60"
          height="60"
          fill="white"
          transform="translate(0.5 0.804688)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p3_activity"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 38"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.2138 7.95772C18.2139 7.34191 17.9981 6.74166 17.5989 6.27114L14.2509 2.32449C11.8088 -0.554352 7.19912 1.22067 7.19912 5.03992C7.19912 6.89382 8.40058 8.52081 10.138 9.0197L15.0449 10.4287C16.4915 10.8441 17.9649 9.86246 18.1864 8.33581C18.2047 8.20978 18.2137 8.08342 18.2138 7.95772ZM18.2138 7.95772C18.2138 8.08342 18.2228 8.20978 18.2411 8.33581C18.4626 9.86246 19.936 10.8441 21.3826 10.4287L26.2895 9.0197C28.0269 8.52081 29.2284 6.89382 29.2284 5.03992C29.2284 1.22067 24.6188 -0.554352 22.1766 2.32449L18.8286 6.27114C18.4294 6.74166 18.2137 7.34191 18.2138 7.95772Z"
      fill="var(--text_color_L3)"
    ></path>
    <path
      d="M16.1664 18.9561C16.1664 18.4038 15.7187 17.9561 15.1664 17.9561H2.49829C1.94601 17.9561 1.49829 18.4038 1.49829 18.9561V35.331C1.49829 36.8038 2.69221 37.9977 4.16499 37.9977H15.1664C15.7187 37.9977 16.1664 37.55 16.1664 36.9977L16.1664 18.9561Z"
      fill="var(--text_color_L3)"
    ></path>
    <path
      d="M19.8339 36.9977C19.8339 37.55 20.2816 37.9977 20.8339 37.9977H31.8352C33.308 37.9977 34.5019 36.8038 34.5019 35.331V18.9561C34.5019 18.4038 34.0542 17.9561 33.5019 17.9561H20.8339C20.2816 17.9561 19.8339 18.4038 19.8339 18.9561L19.8339 36.9977Z"
      fill="var(--text_color_L3)"
    ></path>
    <path
      d="M-0.00195312 10.2061C-0.00195312 9.37763 0.66962 8.70605 1.49805 8.70605H34.502C35.3304 8.70605 36.002 9.37763 36.002 10.2061V13.3727C36.002 14.2011 35.3304 14.8727 34.502 14.8727H1.49805C0.669622 14.8727 -0.00195312 14.2011 -0.00195312 13.3727V10.2061Z"
      fill="var(--text_color_L3)"
    ></path>
  </symbol>
  <symbol
    id="icon-p3_activity_a"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 38"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.2138 7.95772C18.2139 7.34191 17.9981 6.74166 17.5989 6.27114L14.2509 2.32449C11.8088 -0.554352 7.19912 1.22067 7.19912 5.03992C7.19912 6.89382 8.40058 8.52081 10.138 9.0197L15.0449 10.4287C16.4915 10.8441 17.9649 9.86246 18.1864 8.33581C18.2047 8.20978 18.2137 8.08342 18.2138 7.95772ZM18.2138 7.95772C18.2138 8.08342 18.2228 8.20978 18.2411 8.33581C18.4626 9.86246 19.936 10.8441 21.3826 10.4287L26.2895 9.0197C28.0269 8.52081 29.2284 6.89382 29.2284 5.03992C29.2284 1.22067 24.6188 -0.554352 22.1766 2.32449L18.8286 6.27114C18.4294 6.74166 18.2137 7.34191 18.2138 7.95772Z"
      fill="url(#paint0_linear_6071_102691)"
    ></path>
    <path
      d="M16.1664 18.9561C16.1664 18.4038 15.7187 17.9561 15.1664 17.9561H2.49829C1.94601 17.9561 1.49829 18.4038 1.49829 18.9561V35.331C1.49829 36.8038 2.69221 37.9977 4.16499 37.9977H15.1664C15.7187 37.9977 16.1664 37.55 16.1664 36.9977L16.1664 18.9561Z"
      fill="url(#paint1_linear_6071_102691)"
    ></path>
    <path
      d="M19.8339 36.9977C19.8339 37.55 20.2816 37.9977 20.8339 37.9977H31.8352C33.308 37.9977 34.5019 36.8038 34.5019 35.331V18.9561C34.5019 18.4038 34.0542 17.9561 33.5019 17.9561H20.8339C20.2816 17.9561 19.8339 18.4038 19.8339 18.9561L19.8339 36.9977Z"
      fill="url(#paint2_linear_6071_102691)"
    ></path>
    <path
      d="M-0.00195312 10.2061C-0.00195312 9.37763 0.66962 8.70605 1.49805 8.70605H34.502C35.3304 8.70605 36.002 9.37763 36.002 10.2061V13.3727C36.002 14.2011 35.3304 14.8727 34.502 14.8727H1.49805C0.669622 14.8727 -0.00195312 14.2011 -0.00195312 13.3727V10.2061Z"
      fill="url(#paint3_linear_6071_102691)"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_6071_102691"
        x1="20.7696"
        y1="1.49027"
        x2="20.7696"
        y2="37.4069"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_6071_102691"
        x1="20.7696"
        y1="1.49027"
        x2="20.7696"
        y2="37.4069"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_6071_102691"
        x1="20.7696"
        y1="1.49027"
        x2="20.7696"
        y2="37.4069"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_6071_102691"
        x1="20.7696"
        y1="1.49027"
        x2="20.7696"
        y2="37.4069"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-p3_home"
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="app/game" clipPath="url(#clip0_6131_4738)">
      <g id="Vector">
        <path
          d="M11.4893 13.4156C10.8243 13.4089 10.1723 13.5999 9.61611 13.9645C9.05989 14.329 8.62455 14.8506 8.36537 15.4631C8.10619 16.0755 8.03487 16.7512 8.16046 17.4043C8.28604 18.0573 8.60288 18.6583 9.07072 19.131C9.53857 19.6036 10.1363 19.9266 10.7881 20.0588C11.4398 20.1911 12.1162 20.1267 12.7313 19.8737C13.3463 19.6208 13.8723 19.1908 14.2425 18.6384C14.6128 18.0859 14.8104 17.4359 14.8105 16.7708C14.8083 15.8875 14.4588 15.0405 13.8374 14.4127C13.216 13.785 12.3726 13.4268 11.4893 13.4156Z"
          fill="currentColor"
        ></path>
        <path
          d="M39.9999 11.0313C39.9976 9.10996 39.2334 7.268 37.8748 5.90944C36.5163 4.55088 34.6743 3.78665 32.753 3.7844H27.5329C26.9884 3.77764 26.4535 3.92731 25.9915 4.21562C25.5296 4.50394 25.1602 4.9188 24.9271 5.4109C24.6827 5.93994 24.2925 6.38835 23.8023 6.70357C23.3121 7.01879 22.7423 7.18776 22.1595 7.19068H17.6802C17.1118 7.15527 16.5639 6.96521 16.0956 6.64103C15.6273 6.31685 15.2566 5.87087 15.0233 5.35129C14.7802 4.88251 14.4139 4.4889 13.9637 4.21281C13.5136 3.93672 12.9967 3.7886 12.4686 3.7844H7.08672C5.16542 3.78665 3.32347 4.55088 1.96491 5.90944C0.606346 7.268 -0.157883 9.10996 -0.160137 11.0313V30.7025C-0.162217 31.5434 0.00311668 32.3763 0.326226 33.1526C0.649336 33.929 1.12376 34.6332 1.72183 35.2243C2.32519 35.8167 3.04002 36.2834 3.82495 36.5977C4.60988 36.912 5.44934 37.0675 6.29476 37.0552C9.8458 37.0552 11.4042 35.6161 12.5708 31.4178L13.8993 27.3814H25.949L27.2859 31.4689C28.5207 35.0966 29.9003 37.0637 33.6131 37.0637C35.3056 37.0592 36.9275 36.3849 38.1243 35.1881C39.321 33.9913 39.9954 32.3695 39.9999 30.677V11.0313ZM11.4893 22.536C10.3491 22.536 9.23447 22.1978 8.2864 21.5644C7.33833 20.9309 6.5994 20.0305 6.16305 18.977C5.7267 17.9236 5.61253 16.7644 5.83498 15.6461C6.05743 14.5278 6.60651 13.5005 7.41277 12.6943C8.21904 11.888 9.24629 11.3389 10.3646 11.1165C11.4829 10.894 12.6421 11.0082 13.6955 11.4446C14.749 11.8809 15.6494 12.6198 16.2829 13.5679C16.9163 14.516 17.2545 15.6306 17.2545 16.7708C17.2522 18.2991 16.6441 19.7642 15.5634 20.8449C14.4827 21.9256 13.0176 22.5337 11.4893 22.536ZM32.9148 17.9801H29.5596V21.3267C29.5596 21.4855 29.5284 21.6428 29.4676 21.7895C29.4068 21.9362 29.3177 22.0695 29.2055 22.1818C29.0932 22.2941 28.9599 22.3831 28.8132 22.4439C28.6665 22.5047 28.5092 22.536 28.3504 22.536C28.1916 22.536 28.0344 22.5047 27.8877 22.4439C27.7409 22.3831 27.6076 22.2941 27.4954 22.1818C27.3831 22.0695 27.294 21.9362 27.2332 21.7895C27.1725 21.6428 27.1412 21.4855 27.1412 21.3267V17.9801H23.786C23.4653 17.9801 23.1577 17.8527 22.9309 17.6259C22.7042 17.3991 22.5768 17.0915 22.5768 16.7708C22.5768 16.4501 22.7042 16.1426 22.9309 15.9158C23.1577 15.689 23.4653 15.5616 23.786 15.5616H27.1412V12.2064C27.1412 11.8857 27.2686 11.5781 27.4954 11.3514C27.7221 11.1246 28.0297 10.9972 28.3504 10.9972C28.6711 10.9972 28.9787 11.1246 29.2055 11.3514C29.4322 11.5781 29.5596 11.8857 29.5596 12.2064V15.5616H32.9148C33.2355 15.5616 33.5431 15.689 33.7699 15.9158C33.9966 16.1426 34.124 16.4501 34.124 16.7708C34.124 17.0915 33.9966 17.3991 33.7699 17.6259C33.5431 17.8527 33.2355 17.9801 32.9148 17.9801Z"
          fill="currentColor"
        ></path>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_6131_4738">
        <rect
          width="40"
          height="40"
          fill="white"
          transform="translate(0 0.304688)"
        ></rect>
      </clipPath>
    </defs>
    <linearGradient
      id="paint0_linear_6131_4729"
      x1="23.077"
      y1="3.88199"
      x2="23.077"
      y2="37.7282"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="var(--bgColor-6)"></stop>
      <stop offset="0.985" stopColor="var(--bgColor-6)"></stop>
    </linearGradient>
  </symbol>
  <symbol
    id="icon-p3_home_a"
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="app/game" clipPath="url(#clip0_6131_4738)">
      <g id="Vector">
        <path
          d="M11.4893 13.4156C10.8243 13.4089 10.1723 13.5999 9.61611 13.9645C9.05989 14.329 8.62455 14.8506 8.36537 15.4631C8.10619 16.0755 8.03487 16.7512 8.16046 17.4043C8.28604 18.0573 8.60288 18.6583 9.07072 19.131C9.53857 19.6036 10.1363 19.9266 10.7881 20.0588C11.4398 20.1911 12.1162 20.1267 12.7313 19.8737C13.3463 19.6208 13.8723 19.1908 14.2425 18.6384C14.6128 18.0859 14.8104 17.4359 14.8105 16.7708C14.8083 15.8875 14.4588 15.0405 13.8374 14.4127C13.216 13.785 12.3726 13.4268 11.4893 13.4156Z"
          fill="currentColor"
        ></path>
        <path
          d="M39.9999 11.0313C39.9976 9.10996 39.2334 7.268 37.8748 5.90944C36.5163 4.55088 34.6743 3.78665 32.753 3.7844H27.5329C26.9884 3.77764 26.4535 3.92731 25.9915 4.21562C25.5296 4.50394 25.1602 4.9188 24.9271 5.4109C24.6827 5.93994 24.2925 6.38835 23.8023 6.70357C23.3121 7.01879 22.7423 7.18776 22.1595 7.19068H17.6802C17.1118 7.15527 16.5639 6.96521 16.0956 6.64103C15.6273 6.31685 15.2566 5.87087 15.0233 5.35129C14.7802 4.88251 14.4139 4.4889 13.9637 4.21281C13.5136 3.93672 12.9967 3.7886 12.4686 3.7844H7.08672C5.16542 3.78665 3.32347 4.55088 1.96491 5.90944C0.606346 7.268 -0.157883 9.10996 -0.160137 11.0313V30.7025C-0.162217 31.5434 0.00311668 32.3763 0.326226 33.1526C0.649336 33.929 1.12376 34.6332 1.72183 35.2243C2.32519 35.8167 3.04002 36.2834 3.82495 36.5977C4.60988 36.912 5.44934 37.0675 6.29476 37.0552C9.8458 37.0552 11.4042 35.6161 12.5708 31.4178L13.8993 27.3814H25.949L27.2859 31.4689C28.5207 35.0966 29.9003 37.0637 33.6131 37.0637C35.3056 37.0592 36.9275 36.3849 38.1243 35.1881C39.321 33.9913 39.9954 32.3695 39.9999 30.677V11.0313ZM11.4893 22.536C10.3491 22.536 9.23447 22.1978 8.2864 21.5644C7.33833 20.9309 6.5994 20.0305 6.16305 18.977C5.7267 17.9236 5.61253 16.7644 5.83498 15.6461C6.05743 14.5278 6.60651 13.5005 7.41277 12.6943C8.21904 11.888 9.24629 11.3389 10.3646 11.1165C11.4829 10.894 12.6421 11.0082 13.6955 11.4446C14.749 11.8809 15.6494 12.6198 16.2829 13.5679C16.9163 14.516 17.2545 15.6306 17.2545 16.7708C17.2522 18.2991 16.6441 19.7642 15.5634 20.8449C14.4827 21.9256 13.0176 22.5337 11.4893 22.536ZM32.9148 17.9801H29.5596V21.3267C29.5596 21.4855 29.5284 21.6428 29.4676 21.7895C29.4068 21.9362 29.3177 22.0695 29.2055 22.1818C29.0932 22.2941 28.9599 22.3831 28.8132 22.4439C28.6665 22.5047 28.5092 22.536 28.3504 22.536C28.1916 22.536 28.0344 22.5047 27.8877 22.4439C27.7409 22.3831 27.6076 22.2941 27.4954 22.1818C27.3831 22.0695 27.294 21.9362 27.2332 21.7895C27.1725 21.6428 27.1412 21.4855 27.1412 21.3267V17.9801H23.786C23.4653 17.9801 23.1577 17.8527 22.9309 17.6259C22.7042 17.3991 22.5768 17.0915 22.5768 16.7708C22.5768 16.4501 22.7042 16.1426 22.9309 15.9158C23.1577 15.689 23.4653 15.5616 23.786 15.5616H27.1412V12.2064C27.1412 11.8857 27.2686 11.5781 27.4954 11.3514C27.7221 11.1246 28.0297 10.9972 28.3504 10.9972C28.6711 10.9972 28.9787 11.1246 29.2055 11.3514C29.4322 11.5781 29.5596 11.8857 29.5596 12.2064V15.5616H32.9148C33.2355 15.5616 33.5431 15.689 33.7699 15.9158C33.9966 16.1426 34.124 16.4501 34.124 16.7708C34.124 17.0915 33.9966 17.3991 33.7699 17.6259C33.5431 17.8527 33.2355 17.9801 32.9148 17.9801Z"
          fill="currentColor"
        ></path>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_6131_4738">
        <rect
          width="40"
          height="40"
          fill="white"
          transform="translate(0 0.304688)"
        ></rect>
      </clipPath>
    </defs>
    <linearGradient
      id="paint0_linear_6131_4729"
      x1="23.077"
      y1="3.88199"
      x2="23.077"
      y2="37.7282"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="var(--tab1)"></stop>
      <stop offset="0.985" stopColor="var(--tab2)"></stop>
    </linearGradient>
  </symbol>
  <symbol
    id="icon-p3_main"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      d="M5.49547 32.6242C5.7552 32.2509 6.12989 31.9785 6.56811 31.8569C8.69306 31.2675 15.4021 29.5136 20.0003 29.5136C24.5984 29.5136 31.3075 31.2675 33.4325 31.8569C33.8707 31.9785 34.2454 32.2509 34.5051 32.6242L36.6188 35.6623C37.5414 36.9884 36.5925 38.8045 34.9771 38.8045H5.02348C3.40804 38.8045 2.45914 36.9884 3.38175 35.6623L5.49547 32.6242Z"
      fill="var(--text_color_L3)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.0536 1.3266L19.0599 2.57018C11.5381 3.49927 6.83687 8.90685 6.83687 15.5775C6.83687 22.2481 12.3093 27.6557 19.0599 27.6557C25.2496 27.6557 30.3647 23.1095 31.1721 17.2119L32.8764 11.0433C33.0539 10.3999 32.869 9.71192 32.3918 9.2404L30.9088 7.77494C30.109 6.98461 30.1912 5.68044 31.084 4.99424L32.8764 3.49928C35.044 1.32659 31.9994 0.942053 30.0536 1.3266ZM23.4592 20.3337C22.788 22.4405 21.0715 23.9388 19.0598 23.9388C17.0481 23.9388 15.3315 22.4405 14.6604 20.3337C14.3252 19.2813 15.254 18.3643 16.3586 18.3643H21.761C22.8655 18.3643 23.7944 19.2813 23.4592 20.3337Z"
      fill="var(--text_color_L3)"
    ></path>
  </symbol>
  <symbol
    id="icon-p3_main_a"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.49547 32.6242C5.7552 32.2509 6.12989 31.9785 6.56811 31.8569C8.69306 31.2675 15.4021 29.5136 20.0003 29.5136C24.5984 29.5136 31.3075 31.2675 33.4325 31.8569C33.8707 31.9785 34.2454 32.2509 34.5051 32.6242L36.6188 35.6623C37.5414 36.9884 36.5925 38.8045 34.9771 38.8045H5.02348C3.40804 38.8045 2.45914 36.9884 3.38175 35.6623L5.49547 32.6242Z"
      fill="url(#paint0_linear_6079_60206)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.0536 1.3266L19.0599 2.57018C11.5381 3.49927 6.83687 8.90685 6.83687 15.5775C6.83687 22.2481 12.3093 27.6557 19.0599 27.6557C25.2496 27.6557 30.3647 23.1095 31.1721 17.2119L32.8764 11.0433C33.0539 10.3999 32.869 9.71192 32.3918 9.2404L30.9088 7.77494C30.109 6.98461 30.1912 5.68044 31.084 4.99424L32.8764 3.49928C35.044 1.32659 31.9994 0.942053 30.0536 1.3266ZM23.4592 20.3337C22.788 22.4405 21.0715 23.9388 19.0598 23.9388C17.0481 23.9388 15.3315 22.4405 14.6604 20.3337C14.3252 19.2813 15.254 18.3643 16.3586 18.3643H21.761C22.8655 18.3643 23.7944 19.2813 23.4592 20.3337Z"
      fill="url(#paint1_linear_6079_60206)"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_6079_60206"
        x1="22.6126"
        y1="1.7943"
        x2="22.6126"
        y2="38.2056"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_6079_60206"
        x1="22.6126"
        y1="1.7943"
        x2="22.6126"
        y2="38.2056"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-p3_promotion"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
  >
    <g clipPath="url(#clip0_6079_60205)">
      <path
        d="M18.5142 4.69292L12.4561 10.7451L12.169 11.0459C8.98571 14.6647 9.11851 19.924 12.4132 23.2187C13.9519 24.7574 16.0068 25.6706 18.1801 25.7813C20.3534 25.8921 22.4906 25.1926 24.1778 23.8182L24.3672 23.6561L24.7832 23.2734L26.91 21.1466L32.4349 26.6696L22.7677 36.3367C22.0353 37.0689 21.042 37.4803 20.0063 37.4803C18.9705 37.4803 17.9772 37.0689 17.2448 36.3367L3.43736 22.5293C1.35745 20.452 0.134259 17.6689 0.0104128 14.732C-0.113434 11.795 0.871112 8.9188 2.76876 6.67382C4.66641 4.42885 7.33853 2.97911 10.2551 2.61219C13.1717 2.24526 16.1196 2.98794 18.5142 4.69292ZM36.2783 5.67135L36.6122 5.99359L36.7372 6.12249L37.0107 6.41152C37.3544 6.7943 37.6707 7.19661 37.9559 7.61064L37.7782 7.35871C37.8778 7.49737 37.9754 7.63798 38.0711 7.78055L37.9559 7.61064C38.0633 7.76688 38.1648 7.92311 38.2625 8.07935L38.0711 7.78055C38.1551 7.90749 38.2352 8.03443 38.3133 8.16528L38.2625 8.07935C38.3445 8.2141 38.4246 8.34886 38.5027 8.48556L38.3133 8.16528C38.4129 8.32738 38.5086 8.49338 38.5984 8.65938L38.5008 8.48556C38.573 8.61251 38.6414 8.73945 38.7078 8.86639L38.5984 8.65938C38.6765 8.80585 38.7546 8.95232 38.8269 9.1027L38.7097 8.86834C38.7976 9.03825 38.8796 9.21011 38.9597 9.38393L38.8269 9.1027C38.8913 9.2355 38.9538 9.37025 39.0124 9.50501L38.9597 9.38393C39.0417 9.56555 39.1198 9.74522 39.1921 9.93075L39.0124 9.50501C39.89 11.5108 40.1912 13.7215 39.8821 15.889C39.573 18.0565 38.6659 20.0949 37.2626 21.7754L36.915 22.1778L36.7294 22.3691L36.579 22.5293L33.8156 25.2888L28.2926 19.7658C27.9264 19.3997 27.4298 19.194 26.9119 19.194C26.3941 19.194 25.8974 19.3997 25.5312 19.7658L23.461 21.8379L23.0939 22.1758L22.9435 22.3047C21.6312 23.3734 19.9691 23.9173 18.2789 23.831C16.5887 23.7448 14.9906 23.0346 13.7939 21.8379C11.341 19.385 11.1262 15.5025 13.3193 12.7098L13.583 12.3934L13.8369 12.1259L20.057 5.90766L20.1254 5.84126L20.4496 5.5366C20.6933 5.31651 20.9461 5.10671 21.2073 4.90775L20.9554 5.10695C21.0921 4.99758 21.2288 4.89212 21.3655 4.78862L21.2093 4.90775C21.3323 4.81401 21.4573 4.72222 21.5842 4.63433L21.3675 4.79057C21.5059 4.68853 21.6465 4.58955 21.7893 4.49372L21.5842 4.63433C21.7164 4.54106 21.8506 4.45056 21.9865 4.36287L21.7893 4.49372C21.9299 4.39998 22.0705 4.31014 22.2131 4.22226L21.9865 4.36287C22.1233 4.27694 22.26 4.19297 22.3986 4.11289L22.2131 4.22226C22.3537 4.13633 22.4963 4.05431 22.6408 3.97619L22.3986 4.11289C22.5392 4.03087 22.6818 3.9508 22.8244 3.87659L22.6408 3.97423C22.7775 3.90002 22.9181 3.82581 23.0587 3.7555L22.8244 3.87659C22.965 3.80237 23.1075 3.73011 23.2501 3.66176L23.0587 3.7555L23.4923 3.55044L23.2501 3.66176C23.4005 3.59145 23.5528 3.5231 23.7052 3.4567L23.4923 3.55044C23.6427 3.48404 23.795 3.41959 23.9473 3.35905L23.7052 3.4567C23.8594 3.39225 24.0137 3.32976 24.17 3.27117L23.9473 3.35905C26.0117 2.54426 28.2642 2.3292 30.4455 2.73864C32.6267 3.14808 34.648 4.16536 36.2763 5.67331L36.2783 5.67135Z"
        fill="var(--text_color_L3)"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6079_60205">
        <rect width="40" height="40" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p3_promotion_a"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
  >
    <g clipPath="url(#clip0_6079_60199)">
      <path
        d="M18.5142 4.69292L12.4561 10.7451L12.169 11.0459C8.98571 14.6647 9.11851 19.924 12.4132 23.2187C13.9519 24.7574 16.0068 25.6706 18.1801 25.7813C20.3534 25.8921 22.4906 25.1926 24.1778 23.8182L24.3672 23.6561L24.7832 23.2734L26.91 21.1466L32.4349 26.6696L22.7677 36.3367C22.0353 37.0689 21.042 37.4803 20.0063 37.4803C18.9705 37.4803 17.9772 37.0689 17.2448 36.3367L3.43736 22.5293C1.35745 20.452 0.134259 17.6689 0.0104128 14.732C-0.113434 11.795 0.871112 8.9188 2.76876 6.67382C4.66641 4.42885 7.33853 2.97911 10.2551 2.61219C13.1717 2.24526 16.1196 2.98794 18.5142 4.69292ZM36.2783 5.67135L36.6122 5.99359L36.7372 6.12249L37.0107 6.41152C37.3544 6.7943 37.6707 7.19661 37.9559 7.61064L37.7782 7.35871C37.8778 7.49737 37.9754 7.63798 38.0711 7.78055L37.9559 7.61064C38.0633 7.76688 38.1648 7.92311 38.2625 8.07935L38.0711 7.78055C38.1551 7.90749 38.2352 8.03443 38.3133 8.16528L38.2625 8.07935C38.3445 8.2141 38.4246 8.34886 38.5027 8.48556L38.3133 8.16528C38.4129 8.32738 38.5086 8.49338 38.5984 8.65938L38.5008 8.48556C38.573 8.61251 38.6414 8.73945 38.7078 8.86639L38.5984 8.65938C38.6765 8.80585 38.7546 8.95232 38.8269 9.1027L38.7097 8.86834C38.7976 9.03825 38.8796 9.21011 38.9597 9.38393L38.8269 9.1027C38.8913 9.2355 38.9538 9.37025 39.0124 9.50501L38.9597 9.38393C39.0417 9.56555 39.1198 9.74522 39.1921 9.93075L39.0124 9.50501C39.89 11.5108 40.1912 13.7215 39.8821 15.889C39.573 18.0565 38.6659 20.0949 37.2626 21.7754L36.915 22.1778L36.7294 22.3691L36.579 22.5293L33.8156 25.2888L28.2926 19.7658C27.9264 19.3997 27.4298 19.194 26.9119 19.194C26.3941 19.194 25.8974 19.3997 25.5312 19.7658L23.461 21.8379L23.0939 22.1758L22.9435 22.3047C21.6312 23.3734 19.9691 23.9173 18.2789 23.831C16.5887 23.7448 14.9906 23.0346 13.7939 21.8379C11.341 19.385 11.1262 15.5025 13.3193 12.7098L13.583 12.3934L13.8369 12.1259L20.057 5.90766L20.1254 5.84126L20.4496 5.5366C20.6933 5.31651 20.9461 5.10671 21.2073 4.90775L20.9554 5.10695C21.0921 4.99758 21.2288 4.89212 21.3655 4.78862L21.2093 4.90775C21.3323 4.81401 21.4573 4.72222 21.5842 4.63433L21.3675 4.79057C21.5059 4.68853 21.6465 4.58955 21.7893 4.49372L21.5842 4.63433C21.7164 4.54106 21.8506 4.45056 21.9865 4.36287L21.7893 4.49372C21.9299 4.39998 22.0705 4.31014 22.2131 4.22226L21.9865 4.36287C22.1233 4.27694 22.26 4.19297 22.3986 4.11289L22.2131 4.22226C22.3537 4.13633 22.4963 4.05431 22.6408 3.97619L22.3986 4.11289C22.5392 4.03087 22.6818 3.9508 22.8244 3.87659L22.6408 3.97423C22.7775 3.90002 22.9181 3.82581 23.0587 3.7555L22.8244 3.87659C22.965 3.80237 23.1075 3.73011 23.2501 3.66176L23.0587 3.7555L23.4923 3.55044L23.2501 3.66176C23.4005 3.59145 23.5528 3.5231 23.7052 3.4567L23.4923 3.55044C23.6427 3.48404 23.795 3.41959 23.9473 3.35905L23.7052 3.4567C23.8594 3.39225 24.0137 3.32976 24.17 3.27117L23.9473 3.35905C26.0117 2.54426 28.2642 2.3292 30.4455 2.73864C32.6267 3.14808 34.648 4.16536 36.2763 5.67331L36.2783 5.67135Z"
        fill="url(#paint0_linear_6079_60199)"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6079_60199"
        x1="23.077"
        y1="3.0773"
        x2="23.077"
        y2="36.9235"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
      <clipPath id="clip0_6079_60199">
        <rect width="40" height="40" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p3_wallet"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      d="M37.9143 33.7041C37.9143 34.2039 37.8288 34.6708 37.6578 35.1049C37.4868 35.5389 37.2435 35.9204 36.9278 36.2492C36.6122 36.578 36.2439 36.8345 35.823 37.0186C35.4021 37.2028 34.9418 37.2948 34.442 37.2948H5.79504C5.29523 37.2948 4.82173 37.2028 4.37453 37.0186C3.92734 36.8345 3.53275 36.578 3.19078 36.2492C2.8488 35.9204 2.57917 35.5389 2.38188 35.1049C2.18458 34.6708 2.08594 34.2039 2.08594 33.7041V14.0143C2.08594 13.0147 2.43449 12.1663 3.13159 11.4692C3.82869 10.7721 4.67705 10.4236 5.67667 10.4236H34.3236C35.3232 10.4236 36.1716 10.7721 36.8687 11.4692C37.5658 12.1663 37.9143 13.0147 37.9143 14.0143V19.3806H28.9572C27.9576 19.3806 27.1092 19.7226 26.4121 20.4066C25.715 21.0905 25.3665 21.9323 25.3665 22.9319C25.3928 23.6159 25.5375 24.2209 25.8005 24.747C26.011 25.1942 26.3595 25.6019 26.8462 25.9702C27.3328 26.3385 28.0365 26.5226 28.9572 26.5226H37.9143V33.7041ZM32.5479 8.60846H14.6338C16.0543 7.8719 17.3959 7.16165 18.6585 6.4777C19.7634 5.89897 20.8551 5.32025 21.9336 4.74152C23.0121 4.1628 23.8539 3.7156 24.4589 3.39993C25.3796 2.90013 26.2017 2.66995 26.9251 2.70941C27.6485 2.74887 28.2601 2.87382 28.7599 3.08427C29.3386 3.37363 29.8385 3.75506 30.2593 4.22856L32.5479 8.60846ZM27.1816 22.9319C27.1816 22.4321 27.3526 22.0112 27.6945 21.6692C28.0365 21.3273 28.4574 21.1563 28.9572 21.1563C29.457 21.1563 29.8779 21.3273 30.2199 21.6692C30.5619 22.0112 30.7329 22.4321 30.7329 22.9319C30.7329 23.4317 30.5619 23.8592 30.2199 24.2143C29.8779 24.5694 29.457 24.747 28.9572 24.747C28.4574 24.747 28.0365 24.5694 27.6945 24.2143C27.3526 23.8592 27.1816 23.4317 27.1816 22.9319Z"
      fill="var(--text_color_L3)"
    ></path>
  </symbol>
  <symbol
    id="icon-p3_wallet_a"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Property 1=icon_sel_wallet">
      <path
        id="Vector"
        d="M37.9143 33.7041C37.9143 34.2039 37.8288 34.6708 37.6578 35.1049C37.4868 35.5389 37.2435 35.9204 36.9278 36.2492C36.6122 36.578 36.2439 36.8345 35.823 37.0186C35.4021 37.2028 34.9418 37.2948 34.442 37.2948H5.79504C5.29523 37.2948 4.82173 37.2028 4.37453 37.0186C3.92734 36.8345 3.53275 36.578 3.19078 36.2492C2.8488 35.9204 2.57917 35.5389 2.38188 35.1049C2.18458 34.6708 2.08594 34.2039 2.08594 33.7041V14.0143C2.08594 13.0147 2.43449 12.1663 3.13159 11.4692C3.82869 10.7721 4.67705 10.4236 5.67667 10.4236H34.3236C35.3232 10.4236 36.1716 10.7721 36.8687 11.4692C37.5658 12.1663 37.9143 13.0147 37.9143 14.0143V19.3806H28.9572C27.9576 19.3806 27.1092 19.7226 26.4121 20.4066C25.715 21.0905 25.3665 21.9323 25.3665 22.9319C25.3928 23.6159 25.5375 24.2209 25.8005 24.747C26.011 25.1942 26.3595 25.6019 26.8462 25.9702C27.3328 26.3385 28.0365 26.5226 28.9572 26.5226H37.9143V33.7041ZM32.5479 8.60846H14.6338C16.0543 7.8719 17.3959 7.16165 18.6585 6.4777C19.7634 5.89897 20.8551 5.32025 21.9336 4.74152C23.0121 4.1628 23.8539 3.7156 24.4589 3.39993C25.3796 2.90013 26.2017 2.66995 26.9251 2.70941C27.6485 2.74887 28.2601 2.87382 28.7599 3.08427C29.3386 3.37363 29.8385 3.75506 30.2593 4.22856L32.5479 8.60846ZM27.1816 22.9319C27.1816 22.4321 27.3526 22.0112 27.6945 21.6692C28.0365 21.3273 28.4574 21.1563 28.9572 21.1563C29.457 21.1563 29.8779 21.3273 30.2199 21.6692C30.5619 22.0112 30.7329 22.4321 30.7329 22.9319C30.7329 23.4317 30.5619 23.8592 30.2199 24.2143C29.8779 24.5694 29.457 24.747 28.9572 24.747C28.4574 24.747 28.0365 24.5694 27.6945 24.2143C27.3526 23.8592 27.1816 23.4317 27.1816 22.9319Z"
        fill="url(#paint0_linear_6079_60201)"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_6079_60201"
        x1="22.7562"
        y1="3.25598"
        x2="22.7562"
        y2="36.7439"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--tab1)"></stop>
        <stop offset="0.985" stopColor="var(--tab2)"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-p3a_l"
    viewBox="0 0 58 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Group 1420069276">
      <path
        id="Rectangle 9958"
        d="M10 0H49.4694L53.4498 3.69622L58 7.71924L48 32H8.51783L4.14389 27.7198L0 23.743L10 0Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector"
        d="M35 24.4992C35 25.3665 34.0186 25.8474 33.3382 25.3532L33.2661 25.2965L23.3665 16.797C23.2584 16.7042 23.1702 16.5904 23.1074 16.4625C23.0446 16.3346 23.0085 16.1952 23.0013 16.0529C22.9941 15.9106 23.016 15.7683 23.0655 15.6347C23.1151 15.5011 23.1913 15.379 23.2895 15.2758L23.3665 15.203L33.2661 6.70351C33.9241 6.1393 34.9279 6.5705 34.9965 7.40912L35 7.50012V24.4999V24.4992Z"
        fill="var(--bg_color_L2)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-p3a_r"
    viewBox="0 0 58 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Group 1420069277">
      <path
        id="Rectangle 9958"
        d="M10 0H49.4694L53.4498 3.69622L58 7.71924L48 32H8.51783L4.14389 27.7198L0 23.743L10 0Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector"
        d="M26.6406 24.8112C26.6406 25.6785 27.622 26.1594 28.3025 25.6652L28.3746 25.6085L38.2741 17.109C38.3823 17.0162 38.4704 16.9024 38.5332 16.7745C38.596 16.6466 38.6321 16.5072 38.6393 16.3649C38.6465 16.2226 38.6247 16.0803 38.5751 15.9468C38.5256 15.8132 38.4493 15.691 38.3511 15.5878L38.2741 15.515L28.3746 7.01552C27.7165 6.45131 26.7127 6.88252 26.6441 7.72113L26.6406 7.81213V24.8119V24.8112Z"
        fill="var(--bg_color_L2)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-p3more"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 53"
    fill="none"
  >
    <g clipPath="url(#clip0_6079_59714)">
      <path
        d="M36.9386 50.3403C35.4684 50.3406 34.0126 50.0512 32.6542 49.4887C31.2959 48.9261 30.0617 48.1015 29.0221 47.0619C27.9825 46.0224 27.1579 44.7881 26.5954 43.4298C26.0329 42.0715 25.7435 40.6156 25.7437 39.1454V30.4441C25.7437 30.1175 25.8081 29.794 25.9331 29.4922C26.0582 29.1905 26.2415 28.9163 26.4726 28.6854C26.7037 28.4545 26.978 28.2714 27.2798 28.1465C27.5817 28.0217 27.9052 27.9576 28.2319 27.9578H36.9386C38.6827 27.9584 40.4026 28.3665 41.961 29.1495C43.5195 29.9325 44.8734 31.0689 45.9149 32.4679C46.9563 33.8669 47.6565 35.4899 47.9595 37.2075C48.2626 38.9251 48.1602 40.6897 47.6604 42.3607C47.5841 42.6934 47.4403 43.0069 47.2377 43.2817C47.0351 43.5564 46.7781 43.7866 46.4828 43.9577C46.1875 44.1289 45.8601 44.2375 45.521 44.2767C45.1818 44.316 44.8383 44.285 44.5117 44.1857C44.1851 44.0865 43.8823 43.9211 43.6224 43.6999C43.3624 43.4786 43.1508 43.2062 43.0006 42.8997C42.8504 42.5931 42.7649 42.2589 42.7494 41.9179C42.7339 41.5769 42.7888 41.2364 42.9106 40.9175C43.0752 40.343 43.1589 39.7484 43.159 39.1509C43.159 37.5036 42.5046 35.9237 41.3398 34.7589C40.1749 33.594 38.5951 32.9396 36.9478 32.9396H30.7365V39.1509C30.7399 40.1174 30.9678 41.07 31.4022 41.9334C31.8365 42.7969 32.4655 43.5476 33.2396 44.1264C34.0136 44.7053 34.9116 45.0964 35.8626 45.269C36.8136 45.4416 37.7917 45.391 38.7198 45.121C39.0387 44.9992 39.3792 44.9444 39.7203 44.9599C40.0613 44.9754 40.3955 45.0609 40.702 45.211C41.0086 45.3612 41.281 45.5729 41.5022 45.8328C41.7235 46.0928 41.8888 46.3955 41.9881 46.7221C42.0873 47.0487 42.1183 47.3923 42.0791 47.7314C42.0398 48.0705 41.9313 48.3979 41.7601 48.6933C41.5889 48.9886 41.3588 49.2455 41.084 49.4481C40.8092 49.6507 40.4957 49.7946 40.163 49.8708C39.1226 50.1849 38.0418 50.3443 36.9551 50.344L36.9386 50.3403Z"
        fill="currentColor"
      ></path>
      <path
        d="M40.669 25.4642H28.2319C27.9051 25.4642 27.5816 25.3998 27.2797 25.2748C26.9778 25.1497 26.7035 24.9664 26.4725 24.7354C26.2414 24.5044 26.0582 24.2301 25.9331 23.9282C25.8081 23.6263 25.7437 23.3027 25.7437 22.976V10.5315C25.7456 8.55421 26.5322 6.65848 27.9308 5.26064C29.3293 3.86281 31.2254 3.07714 33.2027 3.07617H40.6654C42.644 3.0752 44.542 3.86001 45.9421 5.25806C47.3422 6.65611 48.1298 8.55294 48.1317 10.5315V17.9942C48.1317 18.9742 47.9387 19.9446 47.5636 20.85C47.1886 21.7554 46.6389 22.5781 45.9459 23.2711C45.253 23.9641 44.4303 24.5138 43.5249 24.8888C42.6195 25.2638 41.649 25.4569 40.669 25.4569V25.4642ZM30.72 20.4897H40.669C41.3289 20.4897 41.9618 20.2275 42.4284 19.7609C42.8951 19.2943 43.1572 18.6614 43.1572 18.0015V10.5315C43.1572 9.87163 42.8951 9.23875 42.4284 8.77213C41.9618 8.30551 41.3289 8.04337 40.669 8.04337H33.2027C32.5436 8.04433 31.9119 8.30697 31.4463 8.77353C30.9808 9.2401 30.7196 9.87243 30.72 10.5315V20.4897ZM15.7929 50.3403H8.33022C7.35021 50.3403 6.37979 50.1473 5.47438 49.7723C4.56897 49.3972 3.74629 48.8475 3.05332 48.1546C2.36035 47.4616 1.81065 46.6389 1.43562 45.7335C1.06058 44.8281 0.867554 43.8577 0.867554 42.8777V35.415C0.867554 33.4358 1.6538 31.5376 3.05332 30.1381C4.45284 28.7386 6.351 27.9523 8.33022 27.9523H20.7692C21.0962 27.9523 21.4199 28.0168 21.722 28.1421C22.024 28.2674 22.2983 28.451 22.5293 28.6825C22.7602 28.914 22.9432 29.1887 23.0679 29.491C23.1925 29.7933 23.2563 30.1172 23.2555 30.4441V42.8831C23.2555 43.8631 23.0625 44.8336 22.6875 45.739C22.3125 46.6444 21.7628 47.4671 21.0698 48.16C20.3768 48.853 19.5541 49.4027 18.6487 49.7777C17.7433 50.1528 16.7729 50.3458 15.7929 50.3458V50.3403ZM8.33022 32.9268C7.67032 32.9268 7.03744 33.189 6.57082 33.6556C6.1042 34.1222 5.84205 34.7551 5.84205 35.415V42.8777C5.84205 43.2043 5.90643 43.5278 6.03149 43.8296C6.15655 44.1313 6.33986 44.4055 6.57093 44.6364C6.802 44.8673 7.07631 45.0504 7.37818 45.1753C7.68004 45.3001 8.00355 45.3642 8.33022 45.364H15.7929C16.1195 45.3642 16.4431 45.3001 16.7449 45.1753C17.0468 45.0504 17.3211 44.8673 17.5522 44.6364C17.7832 44.4055 17.9665 44.1313 18.0916 43.8296C18.2167 43.5278 18.281 43.2043 18.281 42.8777V32.9268H8.33022ZM20.7692 25.4642H8.33022C7.35021 25.4642 6.37979 25.2711 5.47438 24.8961C4.56897 24.5211 3.74629 23.9714 3.05332 23.2784C2.36035 22.5854 1.81065 21.7628 1.43562 20.8573C1.06058 19.9519 0.867554 18.9815 0.867554 18.0015V10.5315C0.869491 8.55357 1.65659 6.65729 3.0559 5.25935C4.45521 3.86141 6.35226 3.07617 8.33022 3.07617H15.7929C17.7708 3.07617 19.6679 3.86141 21.0672 5.25935C22.4665 6.65729 23.2536 8.55357 23.2555 10.5315V22.9687C23.2558 23.2954 23.1917 23.6189 23.0668 23.9207C22.942 24.2226 22.7589 24.4969 22.528 24.728C22.2971 24.9591 22.0229 25.1424 21.7211 25.2674C21.4193 25.3925 21.0959 25.4569 20.7692 25.4569V25.4642ZM8.33022 8.05067C7.67158 8.05067 7.03981 8.31181 6.5734 8.77685C6.10699 9.2419 5.84399 9.87289 5.84205 10.5315V17.9942C5.84205 18.6541 6.1042 19.287 6.57082 19.7536C7.03744 20.2202 7.67032 20.4824 8.33022 20.4824H18.281V10.5315C18.2791 9.87289 18.0161 9.2419 17.5497 8.77685C17.0833 8.31181 16.4515 8.05067 15.7929 8.05067H8.33022Z"
        fill="currentColor"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6079_59714">
        <rect
          width="48.8807"
          height="51.4286"
          fill="white"
          transform="translate(0.499634 0.710938)"
        ></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-p4_activity"
    viewBox="0 0 26 26"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.5 4.32812C20.5 4.80026 20.4182 5.2533 20.268 5.67383H22.5C24.1569 5.67383 25.5 7.01697 25.5 8.67383V11.6738C25.5 13.3307 24.1569 14.3281 22.5 14.3281H14V7.32812H12.0378V14.3281H3.5C1.84315 14.3281 0.5 13.3307 0.5 11.6738V8.67383C0.5 7.01697 1.84315 5.67383 3.5 5.67383H5.732C5.5818 5.2533 5.5 4.80026 5.5 4.32812C5.5 2.11899 7.29086 0.328125 9.5 0.328125C11.006 0.328125 12.3176 1.16041 13 2.39012C13.6824 1.16041 14.994 0.328125 16.5 0.328125C18.7091 0.328125 20.5 2.11899 20.5 4.32812ZM19.5 4.32812C19.5 4.812 19.3854 5.26911 19.182 5.67383H13.818C13.6146 5.26911 13.5 4.812 13.5 4.32812C13.5 2.67127 14.8431 1.32812 16.5 1.32812C18.1569 1.32812 19.5 2.67127 19.5 4.32812ZM12.182 5.67383H6.81802C6.61455 5.26911 6.5 4.812 6.5 4.32812C6.5 2.67127 7.84315 1.32812 9.5 1.32812C11.1569 1.32812 12.5 2.67127 12.5 4.32812C12.5 4.812 12.3854 5.26911 12.182 5.67383Z"
    ></path>
    <path
      d="M1.5 15.6738H12.0378V25.6738H4.5C2.84315 25.6738 1.5 24.3307 1.5 22.6738V15.6738Z"
    ></path>
    <path
      d="M24.5 15.6738H14V25.6738H21.5C23.1569 25.6738 24.5 24.3307 24.5 22.6738V15.6738Z"
    ></path>
  </symbol>
  <symbol
    id="icon-p4_home"
    viewBox="0 0 26 26"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.04921 4.68852C-3.56326 9.80328 0.558943 14.0656 5.04921 15.1311V21.7377C5.04921 24.4656 8.14086 25.7158 9.68669 26V19.8197C9.68669 16.0689 11.895 15.5574 12.9992 15.7705V0L5.04921 4.68852Z"
    ></path>
    <path
      d="M20.9492 4.68852C29.5616 9.80328 25.4394 14.0656 20.9492 15.1311V21.7377C20.9492 24.4656 17.8575 25.7158 16.3117 26V19.8197C16.3117 16.0689 14.1033 15.5574 12.9992 15.7705V0L20.9492 4.68852Z"
    ></path>
  </symbol>
  <symbol
    id="icon-p4_main"
    viewBox="0 0 24 26"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.77118 12.3633C1.99794 13.2941 0 15.9142 0 19.001C0 22.867 3.13401 26.001 7 26.001H17C20.866 26.001 24 22.867 24 19.001C24 15.9142 22.0021 13.2941 19.2288 12.3633C17.5887 14.5707 14.9614 16.001 12 16.001C9.03864 16.001 6.41133 14.5707 4.77118 12.3633Z"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 14C15.866 14 19 10.866 19 7C19 3.13401 15.866 0 12 0C8.13401 0 5 3.13401 5 7C5 10.866 8.13401 14 12 14ZM14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10H14Z"
    ></path>
  </symbol>
  <symbol
    id="icon-p4_promotion"
    viewBox="0 0 28 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.4807 8.17647H4.22426C3.54422 8.17647 2.89203 8.44916 2.41116 8.93455C1.9303 9.41994 1.66016 10.0783 1.66016 10.7647V15.9412C1.66016 16.6276 1.9303 17.2859 2.41116 17.7713C2.89203 18.2567 3.54422 18.5294 4.22426 18.5294H5.50631L6.36289 23.4298C6.59698 24.621 6.36289 23.4298 6.59698 24.621C6.78836 24.9797 6.78836 25 6.78836 25H9.35246C9.69248 25 10.0186 24.8637 10.259 24.621C10.4994 24.3783 10.6345 24.0491 10.6345 23.7059V18.5294H14.4807L20.8909 23.7059V3L14.4807 8.17647ZM26.6602 13.3529C26.6602 15.5659 25.4294 17.5718 23.455 18.5294V8.17647C25.4166 9.14706 26.6602 11.1529 26.6602 13.3529Z"
      fill="#001534"
    ></path>
  </symbol>
  <symbol
    id="icon-p4_wallet"
    viewBox="0 0 26 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0.5C1.79086 0.5 0 2.29086 0 4.5V19.5C0 21.7091 1.79086 23.5 4 23.5H22C24.2091 23.5 26 21.7091 26 19.5V16.5H21.5C19.0147 16.5 17 14.4853 17 12C17 9.51472 19.0147 7.5 21.5 7.5H26V4.5C26 2.29086 24.2091 0.5 22 0.5H4ZM5 5.5C4.44772 5.5 4 5.94772 4 6.5C4 7.05228 4.44772 7.5 5 7.5H12C12.5523 7.5 13 7.05228 13 6.5C13 5.94772 12.5523 5.5 12 5.5H5Z"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26 9.5H21.5C20.1193 9.5 19 10.6193 19 12C19 13.3807 20.1193 14.5 21.5 14.5H26V9.5ZM23 12C23 12.5523 22.5523 13 22 13C21.4477 13 21 12.5523 21 12C21 11.4477 21.4477 11 22 11C22.5523 11 23 11.4477 23 12Z"
    ></path>
  </symbol>
  <symbol
    id="icon-phone"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      opacity="0.6"
      d="M7.20001 9.19999C7.20001 5.88628 9.8863 3.19998 13.2 3.19998H34.8C38.1137 3.19998 40.8 5.88627 40.8 9.19998V28H7.20001V9.19999Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40.8 29.6H7.20001V38.8C7.20001 42.1137 9.88631 44.8 13.2 44.8H34.8C38.1137 44.8 40.8 42.1137 40.8 38.8V29.6ZM20 33.6C19.1164 33.6 18.4 34.3163 18.4 35.2C18.4 36.0836 19.1164 36.8 20 36.8H28C28.8837 36.8 29.6 36.0836 29.6 35.2C29.6 34.3163 28.8837 33.6 28 33.6H20Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-pix"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.7208 7.00916C26.5966 3.88497 21.5313 3.88497 18.4071 7.00916L12.1304 13.2858H14.1409C14.9937 13.2858 15.7612 13.6269 17.1256 14.9913L23.5214 21.3871H24.8006L31.1964 14.9913C31.7649 14.4228 33.1577 13.2858 34.1811 13.2858H35.9974L29.7208 7.00916ZM37.703 14.9913H34.1811C33.8968 15.1335 33.1577 15.5883 32.4755 16.2705C32.2177 16.5284 31.505 17.1801 30.6183 17.991C29.1592 19.3254 27.229 21.0906 26.0797 22.2399C25.6533 22.6663 25.2269 23.0927 23.9478 23.0927C23.095 23.0927 22.2422 22.6663 21.8158 22.2399L15.8464 15.8441C15.4201 15.4177 14.7063 14.9913 13.7145 14.9913H10.4249L7.00623 18.41C3.88204 21.5342 3.88204 26.5995 7.00623 29.7237L10.1821 32.8996H13.7145C14.7063 32.8996 15.4201 32.4732 15.8464 32.0468L21.8158 25.651C22.2422 25.2246 23.095 24.7982 23.9478 24.7982C25.2269 24.7982 25.6533 25.2246 26.0797 25.651C27.229 26.8003 29.1592 28.5655 30.6183 29.8999L30.6184 29.9C31.505 30.7108 32.2177 31.3626 32.4755 31.6204C33.1577 32.3026 33.8968 32.7574 34.1811 32.8996H37.9458L41.1216 29.7237C44.2458 26.5995 44.2458 21.5342 41.1216 18.41L37.703 14.9913ZM36.2402 34.6051H34.1811C33.1577 34.6051 31.7649 33.4681 31.1964 32.8996L24.8006 26.5038H23.5214L17.1256 32.8996C15.7612 34.264 14.9937 34.6051 14.1409 34.6051H11.8876L18.4071 41.1246C21.5313 44.2488 26.5966 44.2488 29.7208 41.1246L36.2402 34.6051Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-point"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48ZM15.0028 11C14.2723 11 13.6 11.3982 13.2489 12.0388L8.69005 20.3575C8.27765 21.11 8.39126 22.0417 8.97239 22.6731L22.5284 37.4012C23.3207 38.262 24.6793 38.262 25.4716 37.4012L39.0276 22.6731C39.6087 22.0418 39.7223 21.11 39.3099 20.3575L34.7511 12.0388C34.4 11.3982 33.7277 11 32.9972 11H15.0028Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-pointCancel"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
  >
    <g clipPath="url(#clip0_4009_102098)">
      <path
        d="M49.7917 91.4583C72.8035 91.4583 91.4583 72.8035 91.4583 49.7917C91.4583 26.7798 72.8035 8.125 49.7917 8.125C26.7798 8.125 8.125 26.7798 8.125 49.7917C8.125 72.8035 26.7798 91.4583 49.7917 91.4583Z"
        fill="var(--norm_red-color)"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 74.167C53.1066 74.167 55.625 71.6486 55.625 68.542C55.625 65.4354 53.1066 62.917 50 62.917C46.8934 62.917 44.375 65.4354 44.375 68.542C44.375 71.6486 46.8934 74.167 50 74.167Z"
        fill="white"
      ></path>
      <path
        d="M45.1195 27.6142C45.0544 26.1901 46.1914 25 47.6169 25H52.3831C53.8086 25 54.9456 26.1901 54.8805 27.6142L53.626 55.0571C53.5954 55.7245 53.0454 56.25 52.3773 56.25H47.6227C46.9546 56.25 46.4046 55.7245 46.374 55.0571L45.1195 27.6142Z"
        fill="white"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_4009_102098">
        <rect width="100" height="100" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-pointCopy"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M6.5 6.2158V3.90625C6.5 3.1296 7.1296 2.5 7.90625 2.5H20.0938C20.8704 2.5 21.5 3.1296 21.5 3.90625V16.0938C21.5 16.8704 20.8704 17.5 20.0938 17.5H17.7582"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M16.0938 6.5H3.90625C3.1296 6.5 2.5 7.1296 2.5 7.90625V20.0938C2.5 20.8704 3.1296 21.5 3.90625 21.5H16.0938C16.8704 21.5 17.5 20.8704 17.5 20.0938V7.90625C17.5 7.1296 16.8704 6.5 16.0938 6.5Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-pointDetail"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M39 6H11C9.89543 6 9 6.89543 9 8V40C9 41.1046 9.89543 42 11 42H39C40.1046 42 41 41.1046 41 40V8C41 6.89543 40.1046 6 39 6Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M17 30H31"
      stroke="var(--text_color_L4)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M17 36H24"
      stroke="var(--text_color_L4)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M31 12H17V22H31V12Z"
      fill="var(--main-color)"
      stroke="var(--text_color_L4)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-pointFrame"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M4 6.17075L16.0057 2.66699L28 6.17075V13.3561C28 20.9085 23.1668 27.6133 16.0017 30.0007C8.83473 27.6133 4 20.907 4 13.3528V6.17075Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M10 15.3333L14.6667 20L22.6667 12"
      stroke="var(--text_color_L4)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-pointMinus"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 51"
    fill="none"
  >
    <circle cx="25" cy="25.5" r="25" fill="var(--main-color)"></circle>
    <line
      x1="12"
      y1="26.5"
      x2="38"
      y2="26.5"
      stroke="var(--text_color_L4)"
      strokeWidth="4"
      strokeLinecap="round"
    ></line>
  </symbol>
  <symbol
    id="icon-pointPlus"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    fill="none"
  >
    <circle cx="25" cy="25" r="25" fill="var(--main-color)"></circle>
    <line
      x1="12"
      y1="25"
      x2="38"
      y2="25"
      stroke="var(--text_color_L4)"
      strokeWidth="4"
      strokeLinecap="round"
    ></line>
    <path
      d="M25 10L25 40"
      stroke="var(--text_color_L4)"
      strokeWidth="4"
      strokeLinecap="round"
    ></path>
  </symbol>
  <symbol
    id="icon-pointRecord"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Frame">
      <path
        id="Vector"
        opacity="0.2"
        d="M49.2019 67.6444H15.7183C10.9987 67.6444 7.17188 63.8176 7.17188 59.098V19.7212C7.17188 15.0016 10.9987 11.1748 15.7183 11.1748H49.2019C53.9215 11.1748 57.7483 15.0016 57.7483 19.7212V59.098C57.7519 63.8176 53.9215 67.6444 49.2019 67.6444Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_2"
        opacity="0.2"
        d="M56.2865 61.1278H24.6245C19.9049 61.1278 16.0781 57.301 16.0781 52.5814V13.2046C16.0781 8.48501 19.9049 4.6582 24.6245 4.6582H56.2901C61.0097 4.6582 64.8365 8.48501 64.8365 13.2046V52.5814C64.8365 57.301 61.0097 61.1278 56.2865 61.1278V61.1278Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_3"
        opacity="0.2"
        d="M48.8339 11.1709H16.3979C16.1855 11.9341 16.0703 12.7369 16.0703 13.5649V52.2181C16.0703 57.1393 20.0591 61.1281 24.9803 61.1281H55.9223C56.4443 61.1281 56.9555 61.0813 57.4523 60.9949C57.6395 60.2713 57.7439 59.5153 57.7439 58.7341V20.0809C57.7439 15.1597 53.7551 11.1709 48.8339 11.1709V11.1709Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_4"
        d="M39.5473 35.7737H16.0753C14.4841 35.7737 13.1953 34.4849 13.1953 32.8937C13.1953 31.3025 14.4841 30.0137 16.0753 30.0137H39.5473C41.1385 30.0137 42.4273 31.3025 42.4273 32.8937C42.4273 34.4849 41.1349 35.7737 39.5473 35.7737ZM32.0737 48.9713H16.0753C14.4841 48.9713 13.1953 47.6825 13.1953 46.0913C13.1953 44.5001 14.4841 43.2113 16.0753 43.2113H32.0737C33.6649 43.2113 34.9537 44.5001 34.9537 46.0913C34.9537 47.6789 33.6649 48.9713 32.0737 48.9713Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-pointRule"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon">
      <path
        id="Vector"
        opacity="0.4"
        d="M63 21V51C63 60 58.5 66 48 66H24C13.5 66 9 60 9 51V21C9 12 13.5 6 24 6H48C58.5 6 63 12 63 21Z"
        fill="var(--main-color)"
        fillOpacity="0.6"
      ></path>
      <path
        id="Vector_2"
        d="M46.5 6V29.58C46.5 30.9 44.94 31.56 43.98 30.69L37.02 24.27C36.744 24.0101 36.3791 23.8654 36 23.8654C35.6209 23.8654 35.256 24.0101 34.98 24.27L28.02 30.69C27.8054 30.8891 27.5372 31.021 27.2485 31.0695C26.9598 31.118 26.6632 31.081 26.3953 30.9629C26.1274 30.8449 25.8999 30.6511 25.7408 30.4054C25.5817 30.1596 25.498 29.8727 25.5 29.58V6H46.5ZM52.5 44.25H39.75C38.52 44.25 37.5 43.23 37.5 42C37.5 40.77 38.52 39.75 39.75 39.75H52.5C53.73 39.75 54.75 40.77 54.75 42C54.75 43.23 53.73 44.25 52.5 44.25ZM52.5 56.25H27C25.77 56.25 24.75 55.23 24.75 54C24.75 52.77 25.77 51.75 27 51.75H52.5C53.73 51.75 54.75 52.77 54.75 54C54.75 55.23 53.73 56.25 52.5 56.25Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-promotion"
    viewBox="0 0 57 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.93876 1.50122C9.69785 0.55236 10.8471 0 12.0622 0H44.2172C45.4324 0 46.5816 0.552359 47.3407 1.50122L55.0792 11.1744C55.5056 11.7073 55.828 12.2943 56.0469 12.9092H0.232598C0.451468 12.2943 0.773925 11.7073 1.20023 11.1744L8.93876 1.50122ZM0 16.091H56.2795C56.0896 17.0496 55.664 17.9709 55.0034 18.7637L31.2126 47.3125C29.6134 49.2316 26.666 49.2316 25.0669 47.3125L1.27612 18.7637C0.615521 17.9709 0.189841 17.0496 0 16.091ZM20.5563 22.0266L27.7513 32.1286C27.9512 32.4093 28.3685 32.4083 28.5671 32.1267L35.6853 22.0338C36.1425 21.3856 36.8863 21 37.6795 21C39.0272 21 40.1198 22.0925 40.1198 23.4403V23.6393H39.8972C39.5712 23.6393 39.1148 23.8877 38.5931 24.5708C38.0874 25.2331 32.1271 33.2938 28.9417 37.6047C28.7578 37.8535 28.467 38 28.1577 38C27.8515 38 27.5632 37.8562 27.379 37.6117L17.3204 24.2603C17.3204 24.2603 16.9258 23.6393 16.2608 23.6393H16.1198V23.445C16.1198 22.0947 17.2144 21 18.5648 21C19.3556 21 20.0975 21.3825 20.5563 22.0266Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-promotionData"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M38.5999 15.84V26.14C38.5999 32.3 35.0799 34.94 29.7999 34.94H12.2199C11.3199 34.94 10.4599 34.86 9.65992 34.68C9.15992 34.6 8.67992 34.46 8.23992 34.3C5.23992 33.18 3.41992 30.58 3.41992 26.14V15.84C3.41992 9.68004 6.93992 7.04004 12.2199 7.04004H29.7999C34.2799 7.04004 37.4999 8.94004 38.3599 13.28C38.4999 14.08 38.5999 14.9 38.5999 15.84Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M44.5963 21.8403V32.1403C44.5963 38.3003 41.0763 40.9403 35.7963 40.9403H18.2162C16.7362 40.9403 15.3962 40.7403 14.2362 40.3003C11.8562 39.4203 10.2362 37.6003 9.65625 34.6803C10.4563 34.8603 11.3162 34.9403 12.2162 34.9403H29.7962C35.0763 34.9403 38.5963 32.3003 38.5963 26.1403V15.8403C38.5963 14.9003 38.5162 14.0603 38.3562 13.2803C42.1562 14.0803 44.5963 16.7603 44.5963 21.8403Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M20.9995 26.2797C22.3999 26.2797 23.7429 25.7234 24.733 24.7333C25.7232 23.7431 26.2795 22.4001 26.2795 20.9997C26.2795 19.5994 25.7232 18.2564 24.733 17.2662C23.7429 16.276 22.3999 15.7197 20.9995 15.7197C19.5992 15.7197 18.2562 16.276 17.266 17.2662C16.2758 18.2564 15.7195 19.5994 15.7195 20.9997C15.7195 22.4001 16.2758 23.7431 17.266 24.7333C18.2562 25.7234 19.5992 26.2797 20.9995 26.2797ZM9.56152 16.4997C8.74152 16.4997 8.06152 17.1797 8.06152 17.9997V23.9997C8.06152 24.8197 8.74152 25.4997 9.56152 25.4997C10.3815 25.4997 11.0615 24.8197 11.0615 23.9997V17.9997C11.0615 17.1797 10.4015 16.4997 9.56152 16.4997ZM32.4195 16.4997C31.5995 16.4997 30.9195 17.1797 30.9195 17.9997V23.9997C30.9195 24.8197 31.5995 25.4997 32.4195 25.4997C33.2395 25.4997 33.9195 24.8197 33.9195 23.9997V17.9997C33.9195 17.1797 33.2595 16.4997 32.4195 16.4997Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-quickpay2"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M42.5 44H5.5C4.68 44 4 43.32 4 42.5C4 41.68 4.68 41 5.5 41H42.5C43.32 41 44 41.68 44 42.5C44 43.32 43.32 44 42.5 44Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M41.1778 27.3975L26.7178 41.8575C26.0471 42.5318 25.25 43.0672 24.3722 43.4331C23.4944 43.7991 22.553 43.9884 21.602 43.9903C20.6509 43.9921 19.7088 43.8065 18.8296 43.4439C17.9503 43.0814 17.1512 42.5491 16.4778 41.8775L7.25781 32.6575L31.9778 7.9375L41.1978 17.1575C41.8694 17.8309 42.4017 18.63 42.7643 19.5093C43.1268 20.3885 43.3124 21.3306 43.3106 22.2816C43.3087 23.2327 43.1194 24.174 42.7534 25.0519C42.3875 25.9297 41.8521 26.7268 41.1778 27.3975Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M31.9775 7.94059L7.23746 32.6606L5.41746 30.8406C4.74583 30.1672 4.21354 29.3681 3.85101 28.4888C3.48849 27.6096 3.30284 26.6675 3.3047 25.7164C3.30656 24.7654 3.49588 23.824 3.86184 22.9462C4.22779 22.0684 4.76321 21.2713 5.43746 20.6006L19.8975 6.14058C20.5682 5.46633 21.3653 4.93092 22.2431 4.56496C23.1209 4.19901 24.0623 4.00968 25.0133 4.00783C25.9644 4.00597 26.9065 4.19161 27.7857 4.55414C28.6649 4.91666 29.4641 5.44896 30.1375 6.12058L31.9775 7.94059ZM25.7795 35.1986L23.0795 37.8986C22.5195 38.4586 21.6195 38.4586 21.0595 37.8986C20.9263 37.7662 20.8206 37.6089 20.7485 37.4355C20.6764 37.2622 20.6393 37.0763 20.6393 36.8886C20.6393 36.7008 20.6764 36.515 20.7485 36.3416C20.8206 36.1683 20.9263 36.0109 21.0595 35.8786L23.7595 33.1786C24.3195 32.6186 25.2195 32.6186 25.7795 33.1786C26.3395 33.7386 26.3395 34.6386 25.7795 35.1986ZM34.5395 26.4406L29.1595 31.8206C28.5995 32.3806 27.6995 32.3806 27.1395 31.8206C27.0063 31.6882 26.9006 31.5309 26.8285 31.3575C26.7564 31.1842 26.7193 30.9983 26.7193 30.8106C26.7193 30.6228 26.7564 30.437 26.8285 30.2636C26.9006 30.0903 27.0063 29.9329 27.1395 29.8006L32.5195 24.4206C33.0795 23.8606 33.9795 23.8606 34.5395 24.4206C35.0795 24.9806 35.0795 25.8806 34.5395 26.4406Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-rebate"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M21.3742 33.0555V37.3185C21.3742 40.9305 18.0143 43.8494 13.8773 43.8494C9.74038 43.8494 6.35938 40.9305 6.35938 37.3185V33.0555C6.35938 36.6675 9.71938 39.2295 13.8773 39.2295C18.0143 39.2295 21.3742 36.6465 21.3742 33.0555Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M21.3737 27.2808C21.3737 28.3308 21.0797 29.2968 20.5757 30.1368C19.3367 32.1738 16.7957 33.4547 13.8557 33.4547C10.9158 33.4547 8.37476 32.1528 7.13578 30.1368C6.63178 29.2968 6.33789 28.3308 6.33789 27.2808C6.33789 25.4748 7.17784 23.8578 8.52183 22.6819C9.88681 21.4849 11.7557 20.7709 13.8347 20.7709C15.9137 20.7709 17.7827 21.5059 19.1477 22.6819C20.5337 23.8368 21.3737 25.4748 21.3737 27.2808Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M21.3742 27.2808V33.0558C21.3742 36.6677 18.0143 39.2297 13.8773 39.2297C9.74038 39.2297 6.35938 36.6467 6.35938 33.0558V27.2808C6.35938 23.6688 9.71938 20.7499 13.8773 20.7499C15.9563 20.7499 17.8254 21.4849 19.1903 22.6609C20.5344 23.8368 21.3742 25.4748 21.3742 27.2808Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M44.9996 20.6867V25.0128C44.9996 26.1678 44.0756 27.1126 42.8996 27.1546H38.7836C36.5157 27.1546 34.4367 25.4956 34.2477 23.2276C34.1217 21.9047 34.6257 20.6657 35.5077 19.8047C36.2847 19.0067 37.3556 18.5448 38.5316 18.5448H42.8996C44.0756 18.5868 44.9996 19.5317 44.9996 20.6867Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M32.4003 5C32.9463 5 33.4713 5.02098 33.9753 5.10498C39.3933 5.73497 42.9002 9.74595 42.9002 15.4999V18.5449H38.5323C37.3563 18.5449 36.2853 19.0069 35.5083 19.8049C34.6263 20.6658 34.1223 21.9048 34.2483 23.2278C34.4373 25.4958 36.5163 27.1548 38.7843 27.1548H42.9002V30.1997C42.9002 36.4997 38.7003 40.6996 32.4003 40.6996H27.1504"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 19.6999V15.4999C3 9.78795 6.44397 5.79799 11.7989 5.126C12.3449 5.042 12.9119 5 13.4999 5H23.9998"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-rebateRealTime"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M28.0751 6.41918L19.6086 3.24285C18.7311 2.91905 17.2995 2.91905 16.4221 3.24285L7.95558 6.41918C6.32385 7.03594 5 8.94791 5 10.6903V23.1797C5 24.4286 5.81586 26.0784 6.81645 26.8186L15.283 33.1558C16.7762 34.2814 19.2237 34.2814 20.7169 33.1558L29.1834 26.8186C30.184 26.063 30.9999 24.4286 30.9999 23.1797V10.6903C31.0153 8.94791 29.6914 7.03594 28.0751 6.41918ZM23.3646 15.0539L16.7454 21.684C16.5145 21.9153 16.222 22.0232 15.9295 22.0232C15.637 22.0232 15.3445 21.9153 15.1136 21.684L12.6506 19.1861C12.2042 18.739 12.2042 17.9988 12.6506 17.5517C13.097 17.1045 13.8359 17.1045 14.2824 17.5517L15.9449 19.217L21.7483 13.404C22.1947 12.9569 22.9336 12.9569 23.38 13.404C23.8264 13.8512 23.8264 14.6067 23.3646 15.0539Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-receivedSuccessfuly"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 31 31"
    fill="none"
  >
    <path
      opacity="0.5"
      d="M18.0625 5.07519L18.0625 17.5977H7.325C4.7375 17.5977 2.625 19.7102 2.625 22.2977V9.93769C2.625 8.45019 3.5375 7.12519 4.925 6.60019L14.85 2.85019C16.4 2.27519 18.0625 3.41269 18.0625 5.07519ZM27.6987 17.5977V20.1727C27.6987 20.8602 27.1487 21.4227 26.4487 21.4477H23.9987C22.6487 21.4477 21.4112 20.4602 21.2987 19.1102C21.2237 18.3227 21.5237 17.5852 22.0487 17.0727C22.5112 16.5977 23.1487 16.3227 23.8487 16.3227H26.4487C27.1487 16.3477 27.6987 16.9102 27.6987 17.5977Z"
      fill="var(--norm_secondary-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.3 19.1117C21.225 18.3242 21.525 17.5867 22.05 17.0742C22.5125 16.5992 23.15 16.3242 23.85 16.3242H26.375V14.5242C26.375 11.9367 24.2625 9.82422 21.675 9.82422H7.325C4.7375 9.82422 2.625 11.9367 2.625 14.5242V22.9367C2.625 25.5242 4.7375 27.6367 7.325 27.6367H21.675C24.2625 27.6367 26.375 25.5242 26.375 22.9367V21.4492H24C22.65 21.4492 21.4125 20.4617 21.3 19.1117ZM16.3145 17.0122H7.56445C7.05195 17.0122 6.62695 16.5872 6.62695 16.0747C6.62695 15.5622 7.05195 15.1372 7.56445 15.1372H16.3145C16.827 15.1372 17.252 15.5622 17.252 16.0747C17.252 16.5872 16.827 17.0122 16.3145 17.0122Z"
      fill="var(--norm_secondary-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-recordFilter"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M44 15.62V32.38C44 39.66 39.66 44 32.38 44H15.62C15.22 44 14.82 43.98 14.44 43.96C11.98 43.8 9.9 43.1 8.26 41.9C7.42 41.32 6.68 40.58 6.1 39.74C4.72 37.84 4 35.36 4 32.38V15.62C4 8.74 7.88 4.48 14.44 4.06C14.82 4.02 15.22 4 15.62 4H32.38C35.36 4 37.84 4.72 39.74 6.1C40.58 6.68 41.32 7.42 41.9 8.26C43.28 10.16 44 12.64 44 15.62Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M16.32 13.2959H31.66C32.94 13.2959 33.98 14.3359 33.98 15.6159V18.1759C33.98 19.1159 33.4 20.2759 32.82 20.8559L27.82 25.2759C27.12 25.8559 26.66 27.0159 26.66 27.9559V32.9559C26.66 33.6559 26.2 34.5759 25.62 34.9359L24 35.9559C22.48 36.8959 20.4 35.8359 20.4 33.9759V27.8159C20.4 26.9959 19.94 25.9559 19.46 25.3759L15.04 20.7159C14.46 20.1559 14 19.0959 14 18.3959V15.7359C14 14.3359 15.04 13.2959 16.32 13.2959Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-refreshBalance"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 43 42"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40.3353 19.3759C40.8118 19.7572 40.889 20.4525 40.5078 20.929L35.3979 27.1654C34.6613 27.902 32.8157 28.1662 31.7148 27.1654L25.8086 21.0111C25.3571 20.6006 25.3238 19.9018 25.7343 19.4503C26.1448 18.9987 26.8436 18.9655 27.2951 19.3759L33.3342 25.7318C33.4915 25.8747 33.7368 25.8553 33.8696 25.6893L38.7822 19.5485C39.1634 19.072 39.8588 18.9947 40.3353 19.3759Z"
      fill="#A3A3A3"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.5563 26.4288C34.1666 26.4288 34.6613 25.9341 34.6613 25.3239V17.5894C34.6613 12.7075 30.7037 8.75 25.8219 8.75H10.7212C10.111 8.75 9.6163 9.24469 9.6163 9.85493C9.6163 10.4652 10.111 10.9599 10.7212 10.9599H25.8219C29.4833 10.9599 32.4514 13.928 32.4514 17.5894V25.3239C32.4514 25.9341 32.9461 26.4288 33.5563 26.4288Z"
      fill="#A3A3A3"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.66472 23.0877C2.18821 22.7064 2.11095 22.0111 2.49216 21.5346L7.60211 15.2982C8.33873 14.5616 10.1843 14.2974 11.2852 15.2982L17.1914 21.4525C17.6429 21.863 17.6762 22.5618 17.2657 23.0133C16.8552 23.4649 16.1564 23.4981 15.7049 23.0877L9.66577 16.7318C9.5085 16.5889 9.2632 16.6083 9.13042 16.7743L4.21777 22.9151C3.83656 23.3916 3.14124 23.4689 2.66472 23.0877Z"
      fill="#A3A3A3"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.44366 16.0348C8.83342 16.0348 8.33873 16.5295 8.33873 17.1397V24.8742C8.33873 29.7561 12.2963 33.7136 17.1781 33.7136H32.2788C32.889 33.7136 33.3837 33.2189 33.3837 32.6087C33.3837 31.9984 32.889 31.5037 32.2788 31.5037H17.1781C13.5167 31.5037 10.5486 28.5356 10.5486 24.8742V17.1397C10.5486 16.5295 10.0539 16.0348 9.44366 16.0348Z"
      fill="#A3A3A3"
    ></path>
  </symbol>
  <symbol
    id="icon-resultanbg"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_1148_26793"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="1"
      y="1"
      width="58"
      height="58"
    >
      <path
        d="M28.7628 58.763C44.6481 59.4462 58.0796 47.1223 58.7628 31.237C59.4459 15.3516 47.1221 1.92012 31.2367 1.23696C15.3513 0.553806 1.91983 12.8777 1.23667 28.763C0.553518 44.6484 12.8774 58.0799 28.7628 58.763Z"
        fill="url(#paint0_linear_1148_26793)"
      ></path>
    </mask>
    <g mask="url(#mask0_1148_26793)">
      <g filter="url(#filter0_d_1148_26793)">
        <path
          d="M28.7628 58.763C44.6481 59.4462 58.0796 47.1223 58.7628 31.237C59.4459 15.3516 47.1221 1.92012 31.2367 1.23696C15.3513 0.553806 1.91983 12.8777 1.23667 28.763C0.553518 44.6484 12.8774 58.0799 28.7628 58.763Z"
          fill="url(#paint1_linear_1148_26793)"
        ></path>
      </g>
      <path
        d="M29.5321 50.2111C42.959 50.7885 54.3118 40.3719 54.8892 26.945C55.4667 13.518 45.0501 2.16525 31.6232 1.58782C18.1962 1.0104 6.84343 11.427 6.266 24.8539C5.68857 38.2809 16.1052 49.6336 29.5321 50.2111Z"
        fill="url(#paint2_linear_1148_26793)"
      ></path>
      <g filter="url(#filter1_f_1148_26793)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2817 46.4576C28.4198 54.179 44.5189 50.599 52.2403 38.4613C53.7834 36.0357 54.875 33.4519 55.5372 30.809C55.1692 34.6006 53.9264 38.3653 51.7413 41.7994C44.3246 53.4583 28.8612 56.8972 17.2022 49.4805C11.8893 46.1006 8.28334 41.0495 6.63379 35.4494C8.65765 39.8197 11.9162 43.6803 16.2817 46.4576Z"
          fill="#F26565"
        ></path>
      </g>
      <path
        d="M29.5638 50.8072C41.2131 51.3082 51.0629 42.2707 51.5638 30.6214C52.0648 18.9721 43.0273 9.12238 31.3781 8.6214C19.7288 8.12042 9.87903 17.1579 9.37805 28.8072C8.87707 40.4565 17.9146 50.3062 29.5638 50.8072Z"
        fill="url(#paint3_linear_1148_26793)"
      ></path>
      <path
        d="M-23.8685 30.2751C-28.1709 38.2776 -25.1714 48.2527 -17.1689 52.5552C-9.16639 56.8576 0.808726 53.8581 5.11115 45.8556C9.41357 37.8531 6.41405 27.878 -1.58845 23.5755C-9.59095 19.2731 -19.5661 22.2726 -23.8685 30.2751Z"
        fill="url(#paint4_linear_1148_26793)"
      ></path>
      <path
        d="M80.7175 24.2214C86.1909 30.6016 85.4558 40.2109 79.0755 45.6843C72.6953 51.1577 63.086 50.4225 57.6126 44.0423C52.1392 37.662 52.8744 28.0527 59.2546 22.5794C65.6349 17.106 75.2442 17.8411 80.7175 24.2214Z"
        fill="url(#paint5_linear_1148_26793)"
      ></path>
      <path
        d="M21.0502 -21.7906C27.6991 -26.9344 37.2589 -25.7143 42.4027 -19.0654C47.5464 -12.4166 46.3263 -2.85677 39.6775 2.28701C33.0286 7.43078 23.4688 6.21067 18.325 -0.438181C13.1813 -7.08703 14.4014 -16.6468 21.0502 -21.7906Z"
        fill="url(#paint6_linear_1148_26793)"
      ></path>
      <path
        d="M19.8815 68.1084C19.5203 76.5069 26.0359 83.6081 34.4344 83.9692C42.8329 84.3304 49.9341 77.8149 50.2952 69.4163C50.6564 61.0178 44.1409 53.9167 35.7423 53.5555C27.3438 53.1943 20.2427 59.7099 19.8815 68.1084Z"
        fill="url(#paint7_linear_1148_26793)"
      ></path>
      <g filter="url(#filter2_f_1148_26793)">
        <path
          d="M26.9853 52.8402C27.0283 53.5961 28.5951 54.1217 30.4849 54.0142C32.3748 53.9067 33.8719 53.2067 33.8289 52.4508C33.7858 51.6948 32.219 51.1692 30.3292 51.2768C28.4394 51.3843 26.9422 52.0843 26.9853 52.8402Z"
          fill="white"
        ></path>
      </g>
      <g style={{mixBlendMode: 'screen'}} filter="url(#filter3_f_1148_26793)">
        <path
          d="M29.3201 21.8121C34.9243 22.3645 39.7834 19.6054 40.1733 15.6495C40.5632 11.6937 36.3362 8.03906 30.7321 7.48669C25.128 6.93432 20.2689 9.69339 19.879 13.6492C19.4891 17.6051 23.716 21.2597 29.3201 21.8121Z"
          fill="#FFCFCE"
        ></path>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_1148_26793"
        x="-2.79004"
        y="-4.79013"
        width="65.5801"
        height="65.5803"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="-2"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 0.630158 0 0 0 0 0.630158 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1148_26793"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1148_26793"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter1_f_1148_26793"
        x="3.63379"
        y="27.809"
        width="54.9033"
        height="28.5841"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="1.5"
          result="effect1_foregroundBlur_1148_26793"
        ></feGaussianBlur>
      </filter>
      <filter
        id="filter2_f_1148_26793"
        x="20.9844"
        y="45.2628"
        width="18.8457"
        height="14.7654"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="3"
          result="effect1_foregroundBlur_1148_26793"
        ></feGaussianBlur>
      </filter>
      <filter
        id="filter3_f_1148_26793"
        x="14.8545"
        y="2.41631"
        width="30.3438"
        height="24.4662"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="2.5"
          result="effect1_foregroundBlur_1148_26793"
        ></feGaussianBlur>
      </filter>
      <linearGradient
        id="paint0_linear_1148_26793"
        x1="17.2604"
        y1="7.15404"
        x2="37.769"
        y2="56.749"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F22427"></stop>
        <stop offset="1" stopColor="#960204"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_1148_26793"
        x1="25.6589"
        y1="5.41173"
        x2="37.769"
        y2="56.749"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FB444C"></stop>
        <stop offset="1" stopColor="#DF242E"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_1148_26793"
        x1="24.8033"
        y1="2.97361"
        x2="33.0278"
        y2="51.8347"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FA999A"></stop>
        <stop offset="0.743552" stopColor="#FE474D"></stop>
        <stop offset="1" stopColor="#DD2223" stopOpacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_1148_26793"
        x1="25.859"
        y1="9.99113"
        x2="30.4428"
        y2="50.2696"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.349342" stopColor="#FBF9FD"></stop>
        <stop offset="0.889385" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint4_linear_1148_26793"
        x1="8.35395"
        y1="34.7578"
        x2="-24.0623"
        y2="42.2546"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBF9FD"></stop>
        <stop offset="0.373872" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint5_linear_1148_26793"
        x1="53.2605"
        y1="34.5476"
        x2="66.6956"
        y2="34.0678"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBF9FD"></stop>
        <stop offset="0.601592" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint6_linear_1148_26793"
        x1="31.6682"
        y1="4.79827"
        x2="31.6682"
        y2="-9.59654"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0664686" stopColor="#FBF9FD"></stop>
        <stop offset="1" stopColor="#EBA3A5"></stop>
      </linearGradient>
      <linearGradient
        id="paint7_linear_1148_26793"
        x1="48.5274"
        y1="58.8661"
        x2="24.5445"
        y2="78.165"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EBA3A6"></stop>
        <stop offset="0.373872" stopColor="#EBA3A5"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-rightCircle"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon">
      <circle
        id="Ellipse 88"
        cx="15"
        cy="15"
        r="14.25"
        transform="matrix(-1 0 0 1 30 0)"
        stroke="var(--main-color)"
        strokeWidth="1.5"
      ></circle>
      <path
        id="Vector"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7772 6.35976C11.4516 6.03895 10.9286 6.0392 10.6033 6.36031C10.2715 6.68782 10.2717 7.22349 10.6037 7.55075L14.1194 11.0154C16.3864 13.2495 16.3864 16.9067 14.1194 19.1408L10.6038 22.6055C10.2717 22.9328 10.2715 23.4684 10.6033 23.7959C10.9287 24.1171 11.4516 24.1173 11.7772 23.7965L19.435 16.2526C20.0897 15.6065 20.0897 14.5498 19.435 13.9036L11.7772 6.35976Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-rightTriangle"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21 24"
    fill="none"
  >
    <path
      d="M20 10.2679C21.3333 11.0378 21.3333 12.9623 20 13.7321L3.5 23.2583C2.16666 24.0281 0.499999 23.0659 0.499999 21.5263L0.5 2.47372C0.5 0.934117 2.16667 -0.0281317 3.5 0.741669L20 10.2679Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-round"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle
      cx="10"
      cy="10"
      r="9.4"
      fill="white"
      stroke="var(--main-color)"
      strokeWidth="1.2"
    ></circle>
    <circle cx="10" cy="10" r="5" fill="var(--main-color)"></circle>
  </symbol>
  <symbol
    id="icon-ruleHead"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 489 60"
    fill="none"
  >
    <path
      d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z"
      fill="var(--sheet_nva_color, var(--bg_color_L3))"
    ></path>
  </symbol>
  <symbol
    id="icon-safeIcon"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Frame">
      <path
        id="Subtract"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.26288 4.9454C3.40437 5.19078 2.8125 5.97551 2.8125 6.8684V12.5036C2.8125 20.0174 7.72278 26.6878 15.0018 29.0624C22.2788 26.6878 27.1875 20.0188 27.1875 12.5069V6.868C27.1875 5.9753 26.5959 5.19069 25.7376 4.94514L15.5557 2.03222C15.1963 1.92941 14.8153 1.92936 14.4559 2.03208L4.26288 4.9454ZM22.2444 12.2443C22.7935 11.6951 22.7935 10.8047 22.2444 10.2555C21.6952 9.70637 20.8048 9.70637 20.2556 10.2555L13.75 16.7612L10.3694 13.3805C9.82019 12.8314 8.92981 12.8314 8.38063 13.3805C7.83146 13.9297 7.83146 14.8201 8.38063 15.3693L12.7556 19.7443C13.3048 20.2935 14.1952 20.2935 14.7444 19.7443L22.2444 12.2443Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-saveWallet"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.7 15.4996V7.89961C29.7 5.71961 27.9 4.09961 25.9 4.09961C25.46 4.09961 25 4.17961 24.56 4.33961L8.68004 10.3396C6.46004 11.1796 5.00004 13.2996 5.00004 15.6796V23.0196C5.00004 20.5596 6.18004 18.3796 8.00004 17.0196V15.6796C8.00004 14.5396 8.68004 13.5396 9.74004 13.1396L25.6 7.15961C25.7 7.11961 25.8 7.09961 25.9 7.09961C26.22 7.09961 26.7 7.35961 26.7 7.89961V15.4996H29.7ZM43 30.9996V28.9996C43 28.4596 42.58 28.0196 42 27.9996H38.98C38.7194 27.9951 38.4606 28.0442 38.2197 28.144C37.9789 28.2438 37.7611 28.3921 37.58 28.5796C37.18 28.9796 36.94 29.5596 37 30.1796C37.08 31.2196 38.04 31.9996 39.1 31.9996H42.02C42.2818 31.9944 42.531 31.8867 42.7142 31.6997C42.8975 31.5128 43.0001 31.2614 43 30.9996ZM5.00004 31.7596C6.38004 30.6596 8.12004 29.9996 10 29.9996C14.42 29.9996 18 33.5796 18 37.9996C18 39.4996 17.58 40.9196 16.84 42.1196C16.42 42.8396 15.88 43.4796 15.26 43.9996C13.86 45.2596 12.02 45.9996 10 45.9996C8.62116 46.0025 7.26531 45.6462 6.06596 44.9659C4.86661 44.2855 3.8651 43.3046 3.16004 42.1196C2.42004 40.9196 2.00004 39.4996 2.00004 37.9996C1.99643 36.8005 2.26448 35.6161 2.78406 34.5354C3.30363 33.4547 4.06125 32.5057 5.00004 31.7596ZM7.62669 34.2867C7.24931 33.8621 6.59918 33.8238 6.17459 34.2012C5.75 34.5786 5.71173 35.2287 6.08911 35.6533L8.22438 38.0557L6.08892 40.4581C5.71152 40.8826 5.74976 41.5328 6.17434 41.9102C6.59892 42.2876 7.24905 42.2493 7.62645 41.8248L10.3693 38.739C10.7157 38.3493 10.7157 37.7621 10.3693 37.3724L7.62669 34.2867ZM11.741 34.2867C11.3636 33.8621 10.7135 33.8238 10.2889 34.2012C9.86428 34.5786 9.82601 35.2287 10.2034 35.6533L12.3387 38.0557L10.2032 40.4581C9.8258 40.8826 9.86405 41.5328 10.2886 41.9102C10.7132 42.2876 11.3633 42.2493 11.7407 41.8248L14.4836 38.739C14.83 38.3493 14.83 37.7621 14.4836 37.3724L11.741 34.2867Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M38.96 25.9H41C42.1 25.9 43 25 43 23.9V23.02C43 18.88 39.62 15.5 35.48 15.5H12.52C10.82 15.5 9.26 16.06 8 17.02C6.18 18.38 5 20.56 5 23.02V26.58C5 27.34 5.8 27.82 6.52 27.58C7.64 27.2 8.82 27 10 27C16.06 27 21 31.94 21 38C21 39.44 20.62 41.02 20.02 42.42C19.7 43.14 20.2 44 20.98 44H35.48C39.62 44 43 40.62 43 36.48V36.1C43 35 42.1 34.1 41 34.1H39.26C37.34 34.1 35.5 32.92 35 31.06C34.6 29.54 35.08 28.06 36.08 27.1C36.82 26.34 37.84 25.9 38.96 25.9V25.9ZM28 25.5H18C17.18 25.5 16.5 24.82 16.5 24C16.5 23.18 17.18 22.5 18 22.5H28C28.82 22.5 29.5 23.18 29.5 24C29.5 24.82 28.82 25.5 28 25.5Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-searchBtn"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 60"
    fill="none"
  >
    <path
      d="M0 30C0 13.4315 13.4315 0 30 0H90C106.569 0 120 13.4315 120 30C120 46.5685 106.569 60 90 60H30C13.4315 60 0 46.5685 0 30Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M57.3763 10.166C47.8724 10.166 40.168 17.8705 40.168 27.3743C40.168 36.8782 47.8724 44.5827 57.3763 44.5827C60.5588 44.5827 63.5396 43.7187 66.0968 42.2126L72.6931 48.8089C74.0599 50.1757 76.276 50.1757 77.6428 48.8089C79.0097 47.442 79.0097 45.2259 77.6428 43.8591L71.2883 37.5046C73.3613 34.6626 74.5846 31.1613 74.5846 27.3743C74.5846 17.8705 66.8802 10.166 57.3763 10.166ZM44.8346 27.3743C44.8346 20.4478 50.4498 14.8327 57.3763 14.8327C64.3028 14.8327 69.918 20.4478 69.918 27.3743C69.918 34.3009 64.3028 39.916 57.3763 39.916C50.4498 39.916 44.8346 34.3009 44.8346 27.3743Z"
      fill="var(--bg_color_L2)"
    ></path>
  </symbol>
  <symbol
    id="icon-serverIcon"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon">
      <g id="Vector">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.60575 36.9871C5.31838 33.3788 3.31849 28.615 3.31849 23.3918C3.31849 12.1276 12.615 2.99609 24.0827 2.99609C35.5505 2.99609 44.847 12.1276 44.847 23.3918C44.847 31.3565 40.1975 38.252 33.4205 41.6097C29.2741 43.7714 24.5438 44.9961 19.5224 44.9961C13.3697 44.9961 7.65397 43.1575 2.91406 40.0092C2.91406 40.0092 6.09264 39.6625 8.60493 36.9879L8.60575 36.9871ZM33.8368 33.4859C39.2088 28.1141 39.2088 19.4046 33.8368 14.0327C31.3458 11.5418 28.1372 10.2067 24.8765 10.026C24.7781 7.57955 26.095 5.92657 26.1014 5.91851L26.1001 5.91877L26.1011 5.91747C22.3535 6.64141 18.7749 8.45446 15.873 11.3564C13.6475 13.5818 12.0629 16.2053 11.1182 18.9975C11.2565 18.6313 11.4107 18.2697 11.5808 17.9139C11.385 18.4132 11.2081 18.9234 11.0481 19.4454C9.47482 24.2213 10.5853 29.6877 14.3835 33.4859C19.7555 38.8579 28.465 38.8579 33.8368 33.4859Z"
          fill="white"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.127 22.3454V25.1926C17.127 26.3288 18.048 27.2498 19.1843 27.2498C20.3205 27.2498 21.2414 26.3288 21.2414 25.1926V22.3454C21.2414 21.2094 20.3205 20.2881 19.1843 20.2881C18.048 20.2881 17.127 21.2094 17.127 22.3454Z"
          fill="white"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27.3096 22.3454V25.1926C27.3096 26.3288 28.2307 27.2498 29.3668 27.2498C30.503 27.2498 31.4241 26.3288 31.4241 25.1926V22.3454C31.4241 21.2094 30.503 20.2881 29.3668 20.2881C28.2307 20.2881 27.3096 21.2094 27.3096 22.3454Z"
          fill="white"
        ></path>
      </g>
    </g>
  </symbol>
  <symbol
    id="icon-serverTicket"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Group 1420069177">
      <path
        id="Union"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.501486 25.2499C0.501486 31.7163 2.98132 37.6138 7.0576 42.0809L7.05658 42.0819C3.94138 45.3931 0 45.8223 0 45.8223C5.87741 49.7199 12.9648 51.9961 20.594 51.9961C26.8205 51.9961 32.686 50.4799 37.8274 47.8037C46.2308 43.6469 51.9961 35.1102 51.9961 25.2499C51.9961 11.3048 40.4686 0 26.2487 0C12.029 0 0.501486 11.3048 0.501486 25.2499ZM38.3417 13.6638C45.0029 20.3143 45.0029 31.0966 38.3417 37.747C31.6808 44.3975 20.8812 44.3975 14.22 37.747C9.51028 33.0448 8.13334 26.2774 10.0841 20.3648C10.2825 19.7185 10.5019 19.0869 10.7447 18.4688C10.5338 18.9093 10.3426 19.3569 10.1711 19.8103C11.3425 16.3535 13.3074 13.1056 16.0669 10.3506C19.6652 6.75799 24.1026 4.51343 28.7496 3.61719L28.7484 3.6188L28.7499 3.61854C28.7366 3.63528 27.1093 5.67989 27.2311 8.70353C31.2743 8.92724 35.2529 10.5801 38.3417 13.6638Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector"
        opacity="0.4"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38.3417 37.747C45.0029 31.0966 45.0029 20.3143 38.3417 13.6638C35.2529 10.5801 31.2743 8.92724 27.2311 8.70353C27.1091 5.67485 28.742 3.62845 28.75 3.61847L28.7484 3.6188L28.7496 3.61719C24.1026 4.51343 19.6652 6.75799 16.0669 10.3506C13.3074 13.1056 11.3425 16.3535 10.1711 19.8103C10.3426 19.3569 10.5338 18.9093 10.7447 18.4688C10.5019 19.0869 10.2825 19.7185 10.0841 20.3648C8.13334 26.2774 9.51028 33.0448 14.22 37.747C20.8812 44.3975 31.6808 44.3975 38.3417 37.747Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.625 23.9571V26.0727V27.4819C17.625 28.8886 18.767 30.0288 20.176 30.0288C21.5849 30.0288 22.7268 28.8886 22.7268 27.4819V26.0706V23.9571C22.7268 22.5507 21.5849 21.4102 20.176 21.4102C18.767 21.4102 17.625 22.5507 17.625 23.9571Z"
        fill="var(--main-color)"
      ></path>
      <path
        id="Vector_3"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.25 23.9571V26.0727V27.4819C30.25 28.8886 31.3921 30.0288 32.8009 30.0288C34.2098 30.0288 35.3519 28.8886 35.3519 27.4819V26.0706V23.9571C35.3519 22.5507 34.2098 21.4102 32.8009 21.4102C31.3921 21.4102 30.25 22.5507 30.25 23.9571Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-serverTicket1"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Frame 1420069151">
      <g id="Group 1420069177">
        <g id="Union">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.6836 59.7951C11.6659 54.2964 8.61339 47.0368 8.61339 39.0771C8.61339 21.9116 22.803 7.99609 40.3066 7.99609C57.8104 7.99609 72 21.9116 72 39.0771C72 51.2146 64.9033 61.7226 54.5593 66.8395C48.2305 70.1337 41.0104 72 33.346 72C23.9549 72 15.2308 69.1982 7.99609 64.4004C7.99609 64.4004 12.8477 63.8721 16.6823 59.7963L16.6836 59.7951Z"
            fill="var(--main-color)"
          ></path>
          <path
            d="M16.6836 59.7951L17.7316 60.8682L18.769 59.8551L17.7916 58.784L16.6836 59.7951ZM54.5593 66.8395L53.8942 65.495L53.8804 65.5018L53.8667 65.5089L54.5593 66.8395ZM7.99609 64.4004L7.8337 62.9093L3.71046 63.3583L7.16709 65.6506L7.99609 64.4004ZM16.6823 59.7963L15.6343 58.7232L15.6116 58.7453L15.5898 58.7684L16.6823 59.7963ZM17.7916 58.784C13.0136 53.5479 10.1134 46.6445 10.1134 39.0771H7.11339C7.11339 47.4291 10.3182 55.0448 15.5755 60.8061L17.7916 58.784ZM10.1134 39.0771C10.1134 22.7675 23.6037 9.49609 40.3066 9.49609V6.49609C22.0023 6.49609 7.11339 21.0557 7.11339 39.0771H10.1134ZM40.3066 9.49609C57.0097 9.49609 70.5 22.7675 70.5 39.0771H73.5C73.5 21.0557 58.6111 6.49609 40.3066 6.49609V9.49609ZM70.5 39.0771C70.5 50.6105 63.7577 60.6159 53.8942 65.495L55.2243 68.184C66.0489 62.8294 73.5 51.8186 73.5 39.0771H70.5ZM53.8667 65.5089C47.7475 68.694 40.7645 70.5 33.346 70.5V73.5C41.2563 73.5 48.7134 71.5733 55.2518 68.17L53.8667 65.5089ZM33.346 70.5C24.2571 70.5 15.8202 67.7891 8.8251 63.1503L7.16709 65.6506C14.6415 70.6072 23.6528 73.5 33.346 73.5V70.5ZM7.99609 64.4004C8.15848 65.8916 8.15904 65.8916 8.15963 65.8915C8.15984 65.8915 8.16044 65.8914 8.16088 65.8914C8.16175 65.8913 8.1627 65.8912 8.16373 65.8911C8.16578 65.8908 8.16812 65.8906 8.17077 65.8903C8.17606 65.8896 8.18254 65.8889 8.19018 65.888C8.20546 65.8861 8.22541 65.8836 8.24984 65.8804C8.29869 65.8738 8.36552 65.8643 8.44886 65.851C8.61546 65.8243 8.84854 65.7825 9.13628 65.7192C9.71099 65.5928 10.5086 65.3798 11.433 65.0294C13.2779 64.3299 15.6626 63.0692 17.7748 60.8241L15.5898 58.7684C13.8674 60.5992 11.909 61.6405 10.3695 62.2242C9.60163 62.5153 8.94666 62.6892 8.49186 62.7892C8.26485 62.8392 8.08894 62.8704 7.97524 62.8886C7.91843 62.8977 7.87728 62.9035 7.85319 62.9067C7.84115 62.9083 7.83339 62.9093 7.83008 62.9097C7.82842 62.9099 7.82788 62.9099 7.82848 62.9098C7.82878 62.9098 7.82936 62.9097 7.83023 62.9096C7.83067 62.9096 7.83117 62.9095 7.83175 62.9095C7.83204 62.9094 7.83253 62.9094 7.83267 62.9094C7.83318 62.9093 7.8337 62.9093 7.99609 64.4004ZM17.7303 60.8694L17.7316 60.8682L15.6355 58.7219L15.6343 58.7232L17.7303 60.8694Z"
            fill="#333333"
          ></path>
        </g>
        <path
          id="Vector"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M55.1905 54.4608C63.39 46.2747 63.39 33.0023 55.1905 24.816C51.3884 21.0201 46.491 18.9856 41.514 18.7102C41.3638 14.9821 43.3739 12.4631 43.3837 12.4508L43.3817 12.4512L43.3832 12.4492C37.6631 13.5524 32.2009 16.3153 27.7716 20.7376C24.3748 24.1289 21.9561 28.1268 20.5142 32.3819C20.7253 31.8238 20.9606 31.2728 21.2203 30.7306C20.9214 31.4915 20.6514 32.269 20.4072 33.0644C18.0059 40.3424 19.7008 48.6727 25.4981 54.4608C33.6977 62.6472 46.9913 62.6472 55.1905 54.4608Z"
          fill="var(--bg_color_L2)"
        ></path>
        <path
          id="Vector_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.6875 37.4847V40.0889V41.8236C29.6875 43.555 31.0933 44.9586 32.8276 44.9586C34.5619 44.9586 35.9675 43.555 35.9675 41.8236V40.0863V37.4847C35.9675 35.7536 34.5619 34.3496 32.8276 34.3496C31.0933 34.3496 29.6875 35.7536 29.6875 37.4847Z"
          fill="var(--main-color)"
        ></path>
        <path
          id="Vector_3"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M45.2305 37.4847V40.0889V41.8236C45.2305 43.5551 46.6364 44.9586 48.3705 44.9586C50.1047 44.9586 51.5106 43.5551 51.5106 41.8236V40.0863V37.4847C51.5106 35.7536 50.1047 34.3496 48.3705 34.3496C46.6364 34.3496 45.2305 35.7536 45.2305 37.4847Z"
          fill="var(--main-color)"
        ></path>
      </g>
    </g>
  </symbol>
  <symbol
    id="icon-share"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.5465 14.8334V12.6765H23.4902C24.239 12.6765 24.9572 12.974 25.4867 13.5035C26.0163 14.033 26.3137 14.7512 26.3137 15.5V28.6765C26.3137 29.4254 26.0163 30.1435 25.4867 30.6731C24.9572 31.2026 24.239 31.5 23.4902 31.5H8.50981C7.76096 31.5 7.04279 31.2026 6.51327 30.6731C5.98376 30.1435 5.68628 29.4254 5.68628 28.6765V15.5C5.68628 14.7512 5.98376 14.033 6.51327 13.5035C7.04279 12.974 7.76096 12.6765 8.50981 12.6765H11.4902V14.8334H8.78432C8.5347 14.8334 8.29531 14.9325 8.11881 15.109C7.9423 15.2855 7.84314 15.5249 7.84314 15.7746V28.402C7.84314 28.6516 7.9423 28.891 8.11881 29.0675C8.29531 29.244 8.5347 29.3432 8.78432 29.3432H23.2157C23.4653 29.3432 23.7047 29.244 23.8812 29.0675C24.0577 28.891 24.1569 28.6516 24.1569 28.402V15.7746C24.1569 15.5249 24.0577 15.2855 23.8812 15.109C23.7047 14.9325 23.4653 14.8334 23.2157 14.8334H20.5465Z"
      fill="var(--text_color_L1)"
    ></path>
    <path
      d="M17.0611 5.72866V22.8525C17.0611 23.1339 16.9493 23.4038 16.7503 23.6028C16.5513 23.8018 16.2814 23.9136 16 23.9136C15.7186 23.9136 15.4487 23.8018 15.2497 23.6028C15.0507 23.4038 14.9389 23.1339 14.9389 22.8525V5.72866L11.7979 8.86959C11.5977 9.06279 11.3296 9.16962 11.0514 9.16707C10.7732 9.16452 10.5071 9.0528 10.3104 8.85596C10.1138 8.65913 10.0023 8.39293 10 8.11471C9.99775 7.83648 10.1048 7.56849 10.2982 7.36845L15.2501 2.41653C15.4491 2.21782 15.7188 2.1062 16 2.1062C16.2812 2.1062 16.5509 2.21782 16.7499 2.41653L21.7018 7.36845C21.8952 7.56849 22.0023 7.83648 22 8.11471C21.9977 8.39293 21.8862 8.65913 21.6896 8.85596C21.4929 9.0528 21.2268 9.16452 20.9486 9.16707C20.6704 9.16962 20.4023 9.06279 20.2021 8.86959L17.0611 5.72795V5.72866Z"
      fill="var(--text_color_L1)"
    ></path>
  </symbol>
  <symbol
    id="icon-shuoming"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 37C7 29.2967 7 11 7 11C7 7.68629 9.68629 5 13 5H35V31C35 31 18.2326 31 13 31C9.7 31 7 33.6842 7 37Z"
      fill="var(--main-color)"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinejoin="round"
    ></path>
    <path
      d="M35 31C35 31 14.1537 31 13 31C9.68629 31 7 33.6863 7 37C7 40.3137 9.68629 43 13 43C15.2091 43 25.8758 43 41 43V7"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M14 37H34"
      stroke="var(--main-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-slot"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M44.3345 12.4706C44.3345 12.5712 44.3284 12.6703 44.3166 12.7677C45.1351 13.5954 45.7981 14.8116 46.551 16.8628C47.3071 18.9227 47.4185 21.2382 47.3249 23.112C47.4636 23.6175 47.5791 24.1858 47.6596 24.8235V26.4706V28.1176C47.6596 31.1373 45.997 33.0588 45.997 33.0588C45.997 33.0588 45.178 33.8702 44.3529 34.1507C43.2807 37.1286 41.7029 38 41.0047 38H32.4196C32.4196 38 34.3592 36.6275 34.3592 26.4706C34.3592 16.3137 32.1425 14.9412 32.1425 14.9412H41.0047C41.7436 14.9412 43.4678 15.9172 44.5351 19.3333H44.8887C44.8887 19.3333 45.1166 19.4463 45.4446 19.7445C45.0423 18.0423 43.024 15.3901 42.1176 14.9412L42.112 14.9355L42.1045 14.9275C42.0178 14.9365 41.9298 14.9412 41.8407 14.9412C40.4634 14.9412 39.3469 13.8351 39.3469 12.4706C39.3469 11.1061 40.4634 10 41.8407 10C43.218 10 44.3345 11.1061 44.3345 12.4706ZM3.19266 34.1086C2.40779 33.7971 1.66254 33.0588 1.66254 33.0588C1.66254 33.0588 0 31.1373 0 28.1176V26.4706V24.8235C0.554181 20.4314 2.77091 19.3333 2.77091 19.3333H3.1877C3.72876 17.677 4.54266 16.2484 5.73962 15.4199C6.2972 15.034 6.97712 14.9412 7.6573 14.9412H15.7942C15.7942 14.9412 13.3003 15.6103 13.3003 26.4706C13.3003 37.3309 15.5171 38 15.5171 38H7.65711C6.97693 38 6.30146 37.9043 5.72691 37.5436C4.54065 36.799 3.73188 35.6083 3.19266 34.1086ZM14.1316 26.4706C14.1316 16.0392 16.3483 14.9412 16.3483 14.9412H31.4844C31.4844 14.9412 33.7011 16.0392 33.7011 26.4706C33.7011 36.902 31.5883 38 31.5883 38H16.0713C16.0713 38 14.1316 36.902 14.1316 26.4706ZM16.6658 18.809C16.9429 18.5345 18.4295 18.8795 19.1595 19.3581C19.2651 19.4274 19.4042 19.3209 19.6288 19.1489C19.997 18.8669 20.5952 18.4088 21.6533 18.26C22.4623 18.1462 23.9874 18.4453 25.3594 18.7143C26.3399 18.9066 27.2422 19.0835 27.7493 19.0835C28.9129 19.0836 29.758 18.7737 30.2448 18.5344C30.6653 18.3276 30.9773 19.2982 31.234 20.0966L31.2341 20.0967L31.2341 20.0968C31.2745 20.2226 31.3136 20.3441 31.3515 20.4561C31.5467 21.0326 31.3319 21.4747 31.091 21.9706C30.9879 22.183 30.8799 22.4053 30.7973 22.6522C30.613 23.203 30.1752 23.9704 29.789 24.6474L29.7889 24.6474L29.7888 24.6476C29.5978 24.9824 29.4195 25.295 29.2906 25.5484C29.2026 25.7216 29.1039 25.9059 28.9999 26.1003L28.9999 26.1003C28.5289 26.9802 27.9487 28.0643 27.7493 29.2404L27.7379 29.3079C27.5295 30.536 27.3821 31.4051 27.6211 33.7554C27.6211 33.8537 27.6236 33.9412 27.6259 34.0181C27.6346 34.3158 27.6387 34.456 27.4722 34.4561C26.4988 34.4567 22.2316 34.4577 20.4469 34.4561C20.2909 34.4559 20.2772 34.0312 20.2706 33.8259L20.2695 33.7923C20.269 33.7783 20.2685 33.7659 20.2679 33.7554C19.9924 28.6912 24.1488 24.5736 26.9181 22.9267C27.4493 22.6108 27.1952 22.6522 27.1952 22.6522C27.1952 22.6522 25.5326 23.4757 24.4242 23.4757C23.5301 23.4757 22.6857 23.1532 21.9679 22.8791C21.3511 22.6435 20.8278 22.4436 20.4469 22.5149C19.7137 22.6522 19.7137 23.4757 19.9908 23.7502C20.0966 23.8551 20.1882 23.9411 20.2664 24.0147C20.3929 24.1336 20.4844 24.2197 20.545 24.2992C20.6869 24.4856 20.1979 25.2068 19.7137 25.3973C19.2295 25.5877 17.4985 25.9463 16.9428 24.8482C16.3171 23.3992 16.7617 22.3209 17.0179 21.6997C17.1014 21.4971 17.1649 21.3431 17.1647 21.2407C17.1645 21.1684 17.1844 21.0557 17.2078 20.9226C17.2628 20.6105 17.3375 20.1863 17.2207 19.9071C17.0687 19.4563 16.8728 19.2136 16.7507 19.0625C16.6497 18.9375 16.5993 18.875 16.6658 18.809ZM37.3923 22.6865C37.0097 22.4273 36.2306 22.2405 36.0854 22.3891C36.0505 22.4248 36.0769 22.4587 36.1298 22.5264C36.1938 22.6082 36.2965 22.7396 36.3762 22.9837C36.4374 23.1349 36.3982 23.3646 36.3694 23.5336C36.3571 23.6057 36.3467 23.6667 36.3468 23.7059C36.3469 23.7614 36.3136 23.8447 36.2699 23.9545C36.1356 24.2909 35.9026 24.8748 36.2305 25.6594C36.5218 26.254 37.429 26.0599 37.6828 25.9567C37.9366 25.8536 38.1928 25.463 38.1184 25.3621C38.0867 25.3191 38.0387 25.2725 37.9724 25.2081L37.9724 25.208L37.9723 25.2079C37.9313 25.1681 37.8834 25.1215 37.828 25.0648C37.6828 24.9162 37.6828 24.4702 38.0671 24.3959C38.2667 24.3573 38.5409 24.4655 38.8642 24.5931C39.2404 24.7415 39.683 24.9162 40.1516 24.9162C40.7325 24.9162 41.6038 24.4702 41.6038 24.4702C41.6038 24.4702 41.737 24.4478 41.4586 24.6189C40.0072 25.5107 37.8289 27.7405 37.9732 30.4828C37.9737 30.4927 37.9741 30.5057 37.9746 30.5209C37.9781 30.6321 37.9853 30.8621 38.0671 30.8622C39.0024 30.8631 41.2389 30.8625 41.749 30.8622C41.8363 30.8622 41.8341 30.7863 41.8296 30.625C41.8284 30.5834 41.8271 30.536 41.8271 30.4828C41.7018 29.2101 41.7791 28.7394 41.8883 28.0744L41.8943 28.0378C41.9987 27.401 42.3029 26.8139 42.5497 26.3375L42.5498 26.3372C42.6043 26.2321 42.656 26.1323 42.7021 26.0386C42.7696 25.9013 42.8631 25.732 42.9633 25.5507C43.1657 25.1841 43.3951 24.7685 43.4917 24.4702C43.535 24.3365 43.5916 24.2162 43.6457 24.1012C43.7719 23.8326 43.8845 23.5932 43.7822 23.281C43.7623 23.2204 43.7418 23.1546 43.7207 23.0865L43.7206 23.0864C43.5861 22.654 43.4225 22.1284 43.2021 22.2404C42.947 22.37 42.5041 22.5378 41.8943 22.5378C41.6285 22.5377 41.1556 22.4419 40.6417 22.3378C39.9226 22.1921 39.1233 22.0302 38.6993 22.0918C38.1448 22.1724 37.8312 22.4205 37.6383 22.5732C37.5205 22.6663 37.4477 22.7239 37.3923 22.6865ZM3.9429 22.3891C4.08813 22.2405 4.86726 22.4273 5.24985 22.6865C5.30519 22.724 5.37806 22.6663 5.49577 22.5732C5.68877 22.4205 6.00231 22.1724 6.55686 22.0918C6.98086 22.0302 7.78014 22.1922 8.49924 22.3378C9.01309 22.442 9.48601 22.5378 9.75179 22.5378C10.3616 22.5378 10.8045 22.37 11.0597 22.2404C11.2801 22.1285 11.4436 22.654 11.5781 23.0864C11.5993 23.1545 11.6198 23.2204 11.6397 23.281C11.742 23.5932 11.6294 23.8326 11.5032 24.1012C11.4491 24.2162 11.3925 24.3366 11.3493 24.4703C11.2527 24.7686 11.0232 25.1841 10.8208 25.5507C10.7207 25.732 10.6271 25.9014 10.5596 26.0386C10.5134 26.1324 10.4617 26.2322 10.4072 26.3375C10.1604 26.8139 9.85626 27.401 9.75179 28.0379L9.7458 28.0744C9.6366 28.7394 9.55932 29.2101 9.68458 30.4828C9.68458 30.536 9.68592 30.5834 9.6871 30.6251C9.69166 30.7863 9.69381 30.8622 9.60657 30.8622C9.09638 30.8625 6.85993 30.8631 5.92459 30.8622C5.84282 30.8622 5.83563 30.6322 5.83215 30.521C5.83167 30.5057 5.83126 30.4927 5.83074 30.4828C5.68638 27.7405 7.86474 25.5107 9.31612 24.6189C9.59454 24.4478 9.46135 24.4703 9.46135 24.4703C9.46135 24.4703 8.59 24.9162 8.00911 24.9162C7.54049 24.9162 7.09793 24.7416 6.72175 24.5931C6.39846 24.4655 6.1242 24.3573 5.92459 24.3959C5.5403 24.4703 5.5403 24.9162 5.68552 25.0649C5.74099 25.1216 5.78896 25.1682 5.82994 25.2081C5.89624 25.2725 5.94421 25.3191 5.97597 25.3622C6.05037 25.4631 5.79407 25.8536 5.5403 25.9568C5.28652 26.0599 4.37932 26.2541 4.08805 25.6595C3.76014 24.8748 3.99315 24.2909 4.12739 23.9545C4.17117 23.8448 4.20444 23.7614 4.20433 23.7059C4.20426 23.6668 4.21466 23.6057 4.22695 23.5336C4.25575 23.3647 4.2949 23.1349 4.23368 22.9837C4.15404 22.7396 4.05135 22.6082 3.98735 22.5264C3.93445 22.4587 3.908 22.4249 3.9429 22.3891Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-sport"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.5807 40.7596C28.5427 41.5603 26.3232 42 24.001 42C21.7102 42 19.5194 41.5721 17.5041 40.7919C17.6912 40.6619 17.8138 40.4454 17.8138 40.2002V33.5958L19.7803 30.9393H28.3478L30.314 33.5952V40.2002C30.314 40.4261 30.418 40.6276 30.5807 40.7596ZM31.7524 40.2503C34.6556 38.8631 37.129 36.7209 38.9183 34.0778H31.7541V40.2002C31.7541 40.217 31.7535 40.2338 31.7524 40.2503ZM39.662 32.8809C41.1105 30.3323 41.9548 27.3955 42 24.2653C41.7916 24.3841 41.5286 24.3962 41.3018 24.2743L34.8635 20.8137L31.6365 22.1214L29.4966 30.0706L31.3971 32.6378H39.1226C39.3373 32.6378 39.5301 32.7318 39.662 32.8809ZM41.9747 23.0011C41.7722 19.2999 40.4515 15.8964 38.3447 13.1227L35.8071 19.686L41.9747 23.0011ZM37.5377 12.1347C37.3057 12.1823 37.1021 12.3433 37.0104 12.5805L34.347 19.4691L31.1511 20.7642L24.7839 15.747V12.5486L31.2539 8.03046C31.3926 7.93355 31.4868 7.79656 31.5316 7.64604C33.8387 8.71005 35.8823 10.2478 37.5377 12.1347ZM30.1192 7.06639L24.0712 11.2899L18.1179 6.98324C19.9615 6.34607 21.9408 6 24.001 6C26.149 6 28.2092 6.37623 30.1192 7.06639ZM16.8033 7.49658C14.47 8.51551 12.3945 10.0147 10.7018 11.8692C10.83 11.9491 10.9343 12.0698 10.9927 12.2216L13.7812 19.4692L16.9767 20.7641L23.3438 15.747V12.541L17.0991 8.0235C16.921 7.89472 16.8193 7.69968 16.8033 7.49658ZM9.74992 13.0018C7.69314 15.6627 6.3651 18.9154 6.06487 22.461L12.3052 19.6433L9.74992 13.0018ZM6 24.0003C6.00005 27.1541 6.81124 30.1184 8.23633 32.6961C8.32354 32.6586 8.41966 32.6378 8.52062 32.6378H16.7308L18.6317 30.0702L16.4919 22.1216L13.2369 20.8026L6.29682 23.9363C6.20036 23.9799 6.09937 24.0004 6 24.0003ZM9.08365 34.0778C10.9002 36.7612 13.4218 38.9283 16.3825 40.3132C16.3767 40.2764 16.3737 40.2386 16.3737 40.2002V34.0778H9.08365ZM28.159 29.4993L30.2154 21.8603L24.0638 17.013L17.9128 21.8598L19.9693 29.4993H28.159Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-subtract"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.0566 25.0562C22.4829 27.6299 18.9273 29.2218 15 29.2218C11.0727 29.2218 7.51711 27.6299 4.94336 25.0562C2.36965 22.4824 0.777771 18.9269 0.777771 14.9996C0.777771 11.0722 2.36965 7.51668 4.94336 4.94293C7.51711 2.36922 11.0727 0.777344 15 0.777344C18.9273 0.777344 22.4829 2.36922 25.0566 4.94293C27.6303 7.51668 29.2222 11.0722 29.2222 14.9996C29.2222 18.9269 27.6303 22.4824 25.0566 25.0562ZM22.7492 11.1747C23.091 10.8222 23.0823 10.2595 22.7299 9.91775C22.3775 9.576 21.8147 9.58465 21.473 9.93709L12.6296 17.279L8.52702 14.826C8.18527 14.4735 7.62252 14.4649 7.27009 14.8066C6.91766 15.1484 6.909 15.7111 7.25076 16.0636L11.9915 20.9525C12.1589 21.1251 12.3891 21.2225 12.6296 21.2225C12.8701 21.2225 13.1003 21.1251 13.2678 20.9525L22.7492 11.1747Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-success"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M60 30C60 46.5684 46.5689 60 30.0003 60C13.4311 60 0 46.5684 0 30C0 13.4316 13.4311 0 30.0003 0C46.5689 0 60 13.4316 60 30ZM12.8438 34.4695L18.0305 28.9754C19.7594 30.3905 23.2172 33.4705 26.675 37.7161C26.7354 37.7902 26.9185 37.3878 27.2718 36.6113C28.8189 33.2115 33.6292 22.6402 45.6929 13.4919C45.8032 13.4083 45.778 14.2746 45.7395 15.601C45.7045 16.8053 45.6586 18.3888 45.6929 19.9848C45.7564 22.9318 46.1869 25.9784 46.1869 25.9784C46.1869 25.9784 39.2713 27.7266 27.4159 46.9562C27.3878 47.0018 27.0549 46.6275 26.474 45.9741C24.3405 43.575 18.8616 37.4137 12.8438 34.4695Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-superJackpotRule"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M30.9477 20.3955C36.0081 20.3955 39.4317 22.2327 39.5877 24.6699L39.5925 24.8451V35.9739C39.5337 38.4795 36.1065 40.3683 30.9477 40.3683C25.8981 40.3683 22.4757 38.5275 22.3185 36.0939L22.3125 35.9199V24.8439C22.3125 22.3239 25.7757 20.3955 30.9477 20.3955ZM25.1157 33.7587V35.9187C25.1157 36.5307 27.7041 37.5807 30.9477 37.5807C34.0869 37.5807 36.6213 36.5955 36.7773 35.9799L36.7845 35.9199V33.7623L36.6345 33.8343C35.2821 34.4343 33.5205 34.7763 31.4349 34.8219L30.9477 34.8267C28.6857 34.8267 26.7561 34.4751 25.2789 33.8331L25.1157 33.7587ZM25.1157 28.2063V30.3783C25.1157 30.9927 27.7017 32.0427 30.9477 32.0427C34.0881 32.0463 36.6213 31.0587 36.7773 30.4383L36.7845 30.3783V28.2075L36.6261 28.2831C35.2581 28.8831 33.4941 29.2287 31.4301 29.2743L30.9477 29.2803C28.6893 29.2803 26.7597 28.9263 25.2801 28.2819L25.1157 28.2063ZM30.9477 23.1783C27.7053 23.1783 25.1157 24.2319 25.1157 24.8451C25.1157 25.4559 27.7041 26.5059 30.9477 26.5059C34.1949 26.5059 36.7845 25.4583 36.7845 24.8451C36.7845 24.2295 34.1973 23.1783 30.9477 23.1783Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M21.0698 7.50098C27.8307 7.50098 33.5211 9.85058 33.7299 13.4458L33.7346 13.651V17.8714C33.7346 18.6418 33.1059 19.2658 32.3307 19.2658C31.6082 19.2658 31.0106 18.7222 30.935 18.0238L30.9266 17.8714V17.6218L30.7994 17.6962C28.6311 18.9082 25.4403 19.6522 22.085 19.777L21.5547 19.7914L21.0698 19.7962C17.4927 19.7962 14.0307 19.0918 11.6858 17.8402L11.3582 17.6578L11.2466 17.5906V22.2526C11.2466 23.6146 14.6906 25.231 19.3106 25.5562L19.6778 25.579L20.0402 25.5958C20.5394 25.615 20.9907 25.897 21.2234 26.3362C21.4574 26.7766 21.437 27.3082 21.1694 27.7282C20.9018 28.1482 20.4303 28.3942 19.931 28.375C16.8182 28.2586 13.859 27.5974 11.7387 26.521L11.3738 26.3266L11.2274 26.2426V30.9022C11.2274 32.2642 14.6726 33.8806 19.2927 34.2058L19.6598 34.2286L20.0222 34.2454C20.5214 34.267 20.9714 34.5514 21.203 34.9918C21.4346 35.4322 21.4118 35.9638 21.143 36.3826C21.0099 36.5887 20.8251 36.7564 20.6069 36.8688C20.3888 36.9812 20.145 37.0345 19.8999 37.0234C13.5555 36.7294 8.60785 34.4686 8.41225 31.0954L8.40625 30.8878V13.651C8.40625 9.93338 14.1734 7.50098 21.0698 7.50098ZM21.0698 10.2898C15.5703 10.2898 11.2094 12.085 11.2094 13.6414C11.2094 15.1978 15.587 17.0026 21.0698 17.0026C26.5562 17.0026 30.9266 15.205 30.9266 13.651C30.9266 12.091 26.567 10.2898 21.0698 10.2898Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-super_1"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_10_105884)">
      <path
        d="M24 48C10.7454 48 0 37.2546 0 24C0 10.7454 10.7454 0 24 0C37.2546 0 48 10.7454 48 24C48 37.2546 37.2546 48 24 48ZM15 12.6C14.0452 12.6 13.1295 12.9793 12.4544 13.6544C11.7793 14.3295 11.4 15.2452 11.4 16.2V20.7276C11.4 21.6824 11.7793 22.5981 12.4544 23.2732C13.1295 23.9483 14.0452 24.3276 15 24.3276H19.485C20.4398 24.3276 21.3555 23.9483 22.0306 23.2732C22.7057 22.5981 23.085 21.6824 23.085 20.7276V16.2C23.085 15.2452 22.7057 14.3295 22.0306 13.6544C21.3555 12.9793 20.4398 12.6 19.485 12.6H15ZM28.146 12.6C27.1912 12.6 26.2755 12.9793 25.6004 13.6544C24.9253 14.3295 24.546 15.2452 24.546 16.2V20.7276C24.546 21.6824 24.9253 22.5981 25.6004 23.2732C26.2755 23.9483 27.1912 24.3276 28.146 24.3276H32.631C33.5858 24.3276 34.5015 23.9483 35.1766 23.2732C35.8517 22.5981 36.231 21.6824 36.231 20.7276V16.2C36.231 15.2452 35.8517 14.3295 35.1766 13.6544C34.5015 12.9793 33.5858 12.6 32.631 12.6H28.146ZM15 25.7934C14.0452 25.7934 13.1295 26.1727 12.4544 26.8478C11.7793 27.5229 11.4 28.4386 11.4 29.3934V33.921C11.4 34.8758 11.7793 35.7915 12.4544 36.4666C13.1295 37.1417 14.0452 37.521 15 37.521H19.485C20.4398 37.521 21.3555 37.1417 22.0306 36.4666C22.7057 35.7915 23.085 34.8758 23.085 33.921V29.3934C23.085 28.4386 22.7057 27.5229 22.0306 26.8478C21.3555 26.1727 20.4398 25.7934 19.485 25.7934H15ZM30.3882 25.7934C27.1614 25.7934 24.546 28.4094 24.546 31.6362V31.6782C24.546 34.905 27.162 37.521 30.3882 37.521C33.615 37.521 36.231 34.905 36.231 31.6782V31.6362C36.231 28.4094 33.615 25.7934 30.3882 25.7934Z"
        fill="#07DDD1"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_10_105884">
        <rect width="48" height="48" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-super_no"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_10_106001)">
      <path
        d="M24 48C10.7454 48 0 37.2546 0 24C0 10.7454 10.7454 0 24 0C37.2546 0 48 10.7454 48 24C48 37.2546 37.2546 48 24 48ZM15 12.6C14.0452 12.6 13.1295 12.9793 12.4544 13.6544C11.7793 14.3295 11.4 15.2452 11.4 16.2V20.7276C11.4 21.6824 11.7793 22.5981 12.4544 23.2732C13.1295 23.9483 14.0452 24.3276 15 24.3276H19.485C20.4398 24.3276 21.3555 23.9483 22.0306 23.2732C22.7057 22.5981 23.085 21.6824 23.085 20.7276V16.2C23.085 15.2452 22.7057 14.3295 22.0306 13.6544C21.3555 12.9793 20.4398 12.6 19.485 12.6H15ZM28.146 12.6C27.1912 12.6 26.2755 12.9793 25.6004 13.6544C24.9253 14.3295 24.546 15.2452 24.546 16.2V20.7276C24.546 21.6824 24.9253 22.5981 25.6004 23.2732C26.2755 23.9483 27.1912 24.3276 28.146 24.3276H32.631C33.5858 24.3276 34.5015 23.9483 35.1766 23.2732C35.8517 22.5981 36.231 21.6824 36.231 20.7276V16.2C36.231 15.2452 35.8517 14.3295 35.1766 13.6544C34.5015 12.9793 33.5858 12.6 32.631 12.6H28.146ZM15 25.7934C14.0452 25.7934 13.1295 26.1727 12.4544 26.8478C11.7793 27.5229 11.4 28.4386 11.4 29.3934V33.921C11.4 34.8758 11.7793 35.7915 12.4544 36.4666C13.1295 37.1417 14.0452 37.521 15 37.521H19.485C20.4398 37.521 21.3555 37.1417 22.0306 36.4666C22.7057 35.7915 23.085 34.8758 23.085 33.921V29.3934C23.085 28.4386 22.7057 27.5229 22.0306 26.8478C21.3555 26.1727 20.4398 25.7934 19.485 25.7934H15ZM30.3882 25.7934C27.1614 25.7934 24.546 28.4094 24.546 31.6362V31.6782C24.546 34.905 27.162 37.521 30.3882 37.521C33.615 37.521 36.231 34.905 36.231 31.6782V31.6362C36.231 28.4094 33.615 25.7934 30.3882 25.7934Z"
        fill="currentColor"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_10_106001">
        <rect width="48" height="48" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-ticket"
    viewBox="0 0 86 51"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_6325_15449)">
      <g filter="url(#filter1_di_6325_15449)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.2706 0H4V3.5459C5.9579 3.54614 7.54501 5.1334 7.54501 7.09135C7.54501 9.04931 5.9579 10.6366 4 10.6368V13C5.9579 13.0002 7.54501 14.5875 7.54501 16.5455C7.54501 18.5034 5.9579 20.0907 4 20.0909V22.4551C5.95788 22.4553 7.54497 24.0426 7.54497 26.0005C7.54497 27.9585 5.95788 29.5457 4 29.546V31.9092C5.9579 31.9094 7.54501 33.4967 7.54501 35.4546C7.54501 37.4126 5.9579 38.9998 4 39.0001V42.5455H17.2706C18.0236 40.1481 20.2633 38.4091 22.9092 38.4091C25.555 38.4091 27.7947 40.1481 28.5477 42.5455H82V39.0001H81.9996C80.0415 39.0001 78.4541 37.4127 78.4541 35.4546C78.4541 33.4965 80.0415 31.9092 81.9996 31.9092H82V29.546H81.9995C80.0414 29.546 78.4541 27.9586 78.4541 26.0005C78.4541 24.0424 80.0414 22.4551 81.9995 22.4551H82V20.0909H81.9996C80.0415 20.0909 78.4541 18.5036 78.4541 16.5455C78.4541 14.5874 80.0415 13 81.9996 13H82V10.6368H81.9996C80.0415 10.6368 78.4541 9.04945 78.4541 7.09135C78.4541 5.13325 80.0415 3.5459 81.9996 3.5459H82V0H28.5477C27.7948 2.3974 25.5551 4.1364 22.9092 4.1364C20.2633 4.1364 18.0235 2.3974 17.2706 0ZM24.091 14.1818C24.091 13.5291 23.5619 13 22.9092 13C22.2565 13 21.7273 13.5291 21.7273 14.1818V16.5454C21.7273 17.1981 22.2565 17.7272 22.9092 17.7272C23.5619 17.7272 24.091 17.1981 24.091 16.5454V14.1818ZM22.9092 7.09091C23.5619 7.09091 24.091 7.62003 24.091 8.27273V10.6364C24.091 11.2891 23.5619 11.8182 22.9092 11.8182C22.2565 11.8182 21.7273 11.2891 21.7273 10.6364V8.27273C21.7273 7.62003 22.2565 7.09091 22.9092 7.09091ZM24.091 20.0909C24.091 19.4382 23.5619 18.9091 22.9092 18.9091C22.2565 18.9091 21.7273 19.4382 21.7273 20.0909V22.4546C21.7273 23.1073 22.2565 23.6364 22.9092 23.6364C23.5619 23.6364 24.091 23.1073 24.091 22.4546V20.0909ZM22.9092 24.8182C23.5619 24.8182 24.091 25.3473 24.091 26V28.3636C24.091 29.0163 23.5619 29.5455 22.9092 29.5455C22.2565 29.5455 21.7273 29.0163 21.7273 28.3636V26C21.7273 25.3473 22.2565 24.8182 22.9092 24.8182ZM24.0908 31.9094C24.0908 31.2567 23.5617 30.7275 22.909 30.7275C22.2563 30.7275 21.7272 31.2567 21.7272 31.9094V34.273C21.7272 34.9257 22.2563 35.4548 22.909 35.4548C23.5617 35.4548 24.0908 34.9257 24.0908 34.273V31.9094Z"
          fill="url(#paint0_linear_6325_15449)"
        ></path>
      </g>
      <g filter="url(#filter2_i_6325_15449)">
        <path
          d="M50.2052 8.55435C50.3549 8.09369 51.0066 8.09369 51.1563 8.55435L53.6198 16.1364C53.6868 16.3424 53.8788 16.4819 54.0954 16.4819H62.0676C62.552 16.4819 62.7534 17.1017 62.3615 17.3864L55.9118 22.0724C55.7366 22.1997 55.6633 22.4254 55.7302 22.6314L58.1938 30.2135C58.3434 30.6741 57.8162 31.0572 57.4243 30.7725L50.9746 26.0865C50.7994 25.9592 50.5621 25.9592 50.3869 26.0865L43.9372 30.7725C43.5453 31.0572 43.0181 30.6741 43.1677 30.2135L45.6313 22.6314C45.6982 22.4254 45.6249 22.1997 45.4497 22.0724L39 17.3864C38.6081 17.1017 38.8095 16.4819 39.2939 16.4819H47.2661C47.4827 16.4819 47.6747 16.3424 47.7417 16.1364L50.2052 8.55435Z"
          fill="url(#paint1_linear_6325_15449)"
        ></path>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_6325_15449"
        x="0"
        y="0"
        width="86"
        height="50.5459"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.976471 0 0 0 0 0.838431 0 0 0 0 0.34902 0 0 0 0.5 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_6325_15449"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_6325_15449"
          result="shape"
        ></feBlend>
      </filter>
      <filter
        id="filter1_di_6325_15449"
        x="4"
        y="0"
        width="78"
        height="43.5459"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="1"></feOffset>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.983333 0 0 0 0 0.580173 0 0 0 0 0.107503 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_6325_15449"
        ></feBlend>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_6325_15449"
          result="shape"
        ></feBlend>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="1"></feOffset>
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        ></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.996078 0 0 0 0 0.992157 0 0 0 0 0.768627 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="shape"
          result="effect2_innerShadow_6325_15449"
        ></feBlend>
      </filter>
      <filter
        id="filter2_i_6325_15449"
        x="38.793"
        y="8.20898"
        width="23.7773"
        height="22.6611"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="2"></feOffset>
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        ></feComposite>
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.829167 0 0 0 0 0.343619 0 0 0 0 0 0 0 0 1 0"
        ></feColorMatrix>
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_6325_15449"
        ></feBlend>
      </filter>
      <linearGradient
        id="paint0_linear_6325_15449"
        x1="4"
        y1="21.2727"
        x2="82"
        y2="21.2727"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FBE46B"></stop>
        <stop offset="0.191469" stopColor="#FEFEC8"></stop>
        <stop offset="0.316469" stopColor="#FAE061"></stop>
        <stop offset="0.889385" stopColor="#E28B25"></stop>
        <stop offset="1" stopColor="#F5C054"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_6325_15449"
        x1="50.6808"
        y1="7.09082"
        x2="50.6808"
        y2="34.2726"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF7F22"></stop>
        <stop offset="1" stopColor="#E36306"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-transf_amount"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="å›¾æ&nbsp;‡">
      <path
        id="Vector"
        d="M45 6.85294C44.3684 5.66667 43.5263 4.48039 42.3684 3.5098C41.2105 2.64706 40.0526 2 38.6842 2C38.4737 2 38.4737 2 38.0526 2.21569L37.2105 9.65686C37.2105 9.87255 37.2105 9.87255 37.4211 9.87255H37.8421L44.5789 7.17647C44.7895 7.17647 45 7.17647 45 6.85294ZM44.3684 27.451C44.3684 26.6961 43.7368 26.1569 43.1053 26.1569H26.2632C25.5263 26.1569 25 26.8039 25 27.451C25 28.2059 25.6316 28.7451 26.2632 28.7451H43.1053C43.7368 28.7451 44.3684 28.2059 44.3684 27.451ZM40.8947 36.0784C40.8947 35.3235 40.2632 34.7843 39.6316 34.7843H26.2632C25.5263 34.7843 25 35.4314 25 36.0784C25 36.8333 25.6316 37.3726 26.2632 37.3726H39.6316C40.3684 37.3726 40.8947 36.8333 40.8947 36.0784ZM33.5263 44.7059C33.5263 43.951 32.8947 43.4118 32.2632 43.4118H26.2632C25.5263 43.4118 25 44.0588 25 44.7059C25 45.4608 25.6316 46 26.2632 46H32.2632C33 46 33.5263 45.3529 33.5263 44.7059Z"
        fill="var(--main-color)"
      ></path>
      <g id="Group 4535476">
        <path
          id="Vector_2"
          opacity="0.5"
          d="M42.7332 10.0921C42.5177 10.0921 40.0392 11.2677 35.2977 13.4051L36.1597 5.71043C36.1597 5.49669 36.1597 5.49669 35.9442 5.06921C35.9442 4.85547 35.7287 4.85547 35.2977 4.85547H34.1123C31.7415 4.85547 29.6941 5.71043 27.8621 7.20661C26.0302 8.7028 24.9526 10.7333 24.5215 13.1913C24.306 15.8631 24.737 18.2142 26.569 20.2448C28.0776 22.2753 30.3406 23.5578 33.1424 23.7715H34.3278C36.6986 23.7715 38.746 22.9165 40.578 21.4204C42.3021 19.9242 43.4875 17.8936 43.9186 15.5425C44.1341 14.0463 43.9186 12.2295 43.272 10.7333C43.1642 10.4127 42.9487 10.0921 42.7332 10.0921Z"
          fill="var(--main-color)"
        ></path>
        <g id="Vector_3">
          <path
            d="M5.44641 5H18.3778C20.3175 5 21.8261 6.60305 21.8261 8.52672V21.3511C21.8261 23.2748 20.2097 24.771 18.27 24.771H5.44641C3.50671 24.771 1.99805 23.1679 1.99805 21.2443V8.52672C1.99805 6.60305 3.50671 5 5.44641 5Z"
            fill="var(--main-color)"
          ></path>
          <path
            d="M5.44641 27.3359H18.3778C20.3175 27.3359 21.8261 28.8321 21.7184 30.7557V43.5802C21.7184 45.5038 20.2097 47 18.27 47H5.44641C3.50671 47 1.99805 45.3969 1.99805 43.4733V30.7557C1.99805 28.8321 3.50671 27.3359 5.44641 27.3359Z"
            fill="var(--main-color)"
          ></path>
        </g>
      </g>
    </g>
  </symbol>
  <symbol
    id="icon-trxGame"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M9.67074 29.1107L9.66322 29.1182L9.65598 29.126C9.02654 29.8017 8.45747 30.2157 7.98006 30.4218C7.50853 30.6254 7.16285 30.6135 6.91422 30.5064C6.6612 30.3975 6.39655 30.1416 6.18925 29.6333C5.98114 29.123 5.85 28.3992 5.85 27.45V10.56C5.85 7.52835 6.21824 5.86758 7.1019 4.92303C7.97224 3.99272 9.4962 3.6 12.33 3.6H23.67C26.5041 3.6 28.0275 3.99282 28.8959 4.92264C29.7774 5.86659 30.1425 7.52679 30.135 10.5585V10.56V27.435C30.135 28.3846 30.0047 29.1087 29.7975 29.6192C29.5911 30.1278 29.3276 30.383 29.076 30.4916C28.8287 30.5983 28.4837 30.6106 28.011 30.4067C27.5326 30.2004 26.9615 29.7861 26.3282 29.1102C25.6005 28.3296 24.6554 27.9468 23.7086 27.9984C22.7618 28.0499 21.8639 28.5332 21.225 29.385L21.2246 29.3856L19.7116 31.4079C19.7113 31.4083 19.711 31.4087 19.7107 31.4091C19.1996 32.0836 18.5725 32.3738 17.9925 32.3738C17.4125 32.3738 16.7854 32.0836 16.2743 31.4091C16.274 31.4087 16.2737 31.4083 16.2734 31.4079L14.7606 29.3858C14.7605 29.3857 14.7605 29.3856 14.7604 29.3856C13.4723 27.6623 11.1634 27.5349 9.67973 29.1017L9.67074 29.1107ZM9.57 16.5C9.57 17.6564 10.5136 18.6 11.67 18.6C12.8264 18.6 13.77 17.6564 13.77 16.5C13.77 15.3436 12.8264 14.4 11.67 14.4C10.5136 14.4 9.57 15.3436 9.57 16.5ZM9.57 10.5C9.57 11.6564 10.5136 12.6 11.67 12.6C12.8264 12.6 13.77 11.6564 13.77 10.5C13.77 9.34363 12.8264 8.4 11.67 8.4C10.5136 8.4 9.57 9.34363 9.57 10.5ZM16.095 18.225H24.345C25.2914 18.225 26.07 17.4464 26.07 16.5C26.07 15.5536 25.2914 14.775 24.345 14.775H16.095C15.1486 14.775 14.37 15.5536 14.37 16.5C14.37 17.4464 15.1486 18.225 16.095 18.225ZM16.095 12.225H24.345C25.2914 12.225 26.07 11.4464 26.07 10.5C26.07 9.55363 25.2914 8.775 24.345 8.775H16.095C15.1486 8.775 14.37 9.55363 14.37 10.5C14.37 11.4464 15.1486 12.225 16.095 12.225Z"
      stroke="currentColor"
      strokeWidth="1.2"
    ></path>
  </symbol>
  <symbol
    id="icon-trxquestion"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M23.5553 1.77783H8.44423C3.91089 1.77783 0.888672 4.75114 0.888672 9.21111V18.131C0.888672 22.591 3.91089 25.5643 8.44423 25.5643V28.7309C8.44423 29.9202 9.78912 30.6338 10.7864 29.9648L17.5109 25.5643H23.5553C28.0887 25.5643 31.1109 22.591 31.1109 18.131V9.21111C31.1109 4.75114 28.0887 1.77783 23.5553 1.77783ZM15.9998 19.8704C15.6992 19.8704 15.4109 19.753 15.1984 19.5439C14.9859 19.3348 14.8664 19.0512 14.8664 18.7554C14.8664 18.4597 14.9859 18.1761 15.1984 17.967C15.4109 17.7579 15.6992 17.6405 15.9998 17.6405C16.3004 17.6405 16.5886 17.7579 16.8012 17.967C17.0137 18.1761 17.1331 18.4597 17.1331 18.7554C17.1331 19.0512 17.0137 19.3348 16.8012 19.5439C16.5886 19.753 16.3004 19.8704 15.9998 19.8704ZM17.9038 13.7008C17.3144 14.0873 17.1331 14.3401 17.1331 14.7563V15.0685C17.1331 15.6781 16.6193 16.1835 15.9998 16.1835C15.3802 16.1835 14.8664 15.6781 14.8664 15.0685V14.7563C14.8664 13.0318 16.1509 12.1844 16.6344 11.8574C17.1936 11.4857 17.3749 11.233 17.3749 10.8464C17.3749 10.1031 16.7553 9.49358 15.9998 9.49358C15.2442 9.49358 14.6247 10.1031 14.6247 10.8464C14.6247 11.456 14.1109 11.9614 13.4913 11.9614C12.8718 11.9614 12.358 11.456 12.358 10.8464C12.358 8.86918 13.99 7.26359 15.9998 7.26359C18.0096 7.26359 19.6416 8.86918 19.6416 10.8464C19.6416 12.5412 18.3722 13.3886 17.9038 13.7008Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-upi"
    viewBox="0 0 101 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.77191 37.2054H5.21241L4.20045 40.2351C4.09647 40.5464 3.92649 40.825 3.69049 41.0707C3.455 41.315 3.17621 41.5079 2.85412 41.6494C2.5341 41.7894 2.19271 41.8594 1.82994 41.8594C1.46875 41.8594 1.17437 41.7887 0.946813 41.6472C0.719255 41.5057 0.569323 41.3128 0.497015 41.0685C0.424708 40.8242 0.440545 40.5464 0.544527 40.2351L1.55648 37.2054H1.99698L0.99473 40.2061C0.913634 40.4489 0.898565 40.6656 0.949523 40.8562C1.00098 41.0454 1.11219 41.1944 1.28317 41.3031C1.45572 41.4118 1.68176 41.4662 1.96129 41.4662C2.24082 41.4662 2.50318 41.4118 2.74837 41.3031C2.99355 41.1944 3.20427 41.0454 3.38053 40.8562C3.55885 40.6656 3.68856 40.4489 3.76965 40.2061L4.77191 37.2054Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M10.2499 37.2054L8.72153 41.7812H8.2928L6.72237 37.9494H6.68468L5.40481 41.7812H4.96431L6.49269 37.2054H6.91906L8.49742 41.0417H8.53511L9.81647 37.2054H10.2499Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M11.973 37.2054L10.4447 41.7812H10.0042L11.5325 37.2054H11.973Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M11.7273 41.7812L13.2557 37.2054H16.0471L15.9217 37.5808H13.5708L12.9954 39.3034H15.1273L15.0019 39.6788H12.8701L12.1678 41.7812H11.7273Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M17.583 37.2054L16.0546 41.7812H15.6141L17.1425 37.2054H17.583Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M17.3372 41.7812L18.8656 37.2054H21.6641L21.5387 37.5808H19.1807L18.6053 39.3034H20.8149L20.6895 39.6788H18.48L17.9031 41.4059H20.3082L20.1828 41.7812H17.3372Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M22.6892 41.7812H21.2758L22.8042 37.2054H24.3024C24.7625 37.2054 25.1255 37.2963 25.3915 37.478C25.659 37.6597 25.8232 37.9204 25.8841 38.26C25.945 38.5996 25.8961 39.007 25.7374 39.4822C25.5772 39.9618 25.3501 40.3736 25.0561 40.7177C24.7642 41.0603 24.4173 41.3232 24.0153 41.5064C23.6149 41.6896 23.1729 41.7812 22.6892 41.7812ZM21.8417 41.4059H22.7887C23.2032 41.4059 23.5762 41.3284 23.9075 41.1735C24.2387 41.0186 24.5223 40.7974 24.7581 40.5099C24.9938 40.2224 25.1782 39.8799 25.311 39.4822C25.4413 39.0874 25.4856 38.7478 25.444 38.4633C25.404 38.1788 25.2758 37.9606 25.0596 37.8087C24.845 37.6567 24.5421 37.5808 24.1511 37.5808H23.1193L21.8417 41.4059Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M27.9028 41.7812L29.4312 37.2054H30.9882C31.3306 37.2054 31.5955 37.268 31.783 37.3931C31.9725 37.5167 32.0899 37.685 32.1349 37.898C32.1816 38.111 32.1603 38.3509 32.0713 38.6175C31.9822 38.8841 31.8438 39.1247 31.6559 39.3392C31.4686 39.5522 31.2394 39.7212 30.9683 39.8463C30.6977 39.97 30.392 40.0318 30.0512 40.0318H28.8263L28.9517 39.6564H30.1648C30.4177 39.6564 30.6423 39.6117 30.8386 39.5224C31.0354 39.4315 31.2007 39.3079 31.3346 39.1515C31.4701 38.9951 31.5712 38.8171 31.6379 38.6175C31.7045 38.4179 31.7224 38.2399 31.6914 38.0835C31.6619 37.9271 31.5781 37.8042 31.44 37.7148C31.3033 37.6255 31.107 37.5808 30.8511 37.5808H29.7463L28.3433 41.7812H27.9028Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M31.5634 41.7812H31.1017L34.385 37.2054H34.8562L35.0827 41.7812H34.621L34.4557 37.7484H34.4228L31.5634 41.7812ZM32.4814 40.0273H34.8747L34.7493 40.4027H32.356L32.4814 40.0273Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M36.4933 37.2054H37.0021L37.7066 39.3771H37.749L39.9043 37.2054H40.4131L37.8058 39.7994L37.1439 41.7812H36.7057L37.3677 39.7994L36.4933 37.2054Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M41.2405 37.2054H41.7493L42.1682 41.1914H42.2106L45.2922 37.2054H45.801L44.2726 41.7812H43.858L45.0916 38.088H45.0539L42.1926 41.7812H41.7921L41.398 38.088H41.3603L40.1267 41.7812H39.7121L41.2405 37.2054Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M45.5552 41.7812L47.0836 37.2054H49.8821L49.7567 37.5808H47.3987L46.8234 39.3034H49.0329L48.9075 39.6788H46.698L46.1211 41.4059H48.5262L48.4008 41.7812H45.5552Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M54.7794 37.2054L53.251 41.7812H52.8223L51.2519 37.9494H51.2142L49.9343 41.7812H49.4938L51.0222 37.2054H51.4486L53.0269 41.0417H53.0646L54.346 37.2054H54.7794Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M55.6446 37.5808L55.77 37.2054H59.2681L59.1427 37.5808H57.6139L56.2109 41.7812H55.7704L57.1734 37.5808H55.6446Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M62.4971 38.3494C62.5555 38.0947 62.5046 37.8921 62.3444 37.7416C62.1842 37.5912 61.9448 37.516 61.626 37.516C61.4014 37.516 61.1913 37.5525 60.9958 37.6255C60.8018 37.6985 60.6345 37.7997 60.4938 37.9293C60.3552 38.0574 60.2586 38.2034 60.2039 38.3672C60.1636 38.4879 60.1557 38.5937 60.1803 38.6845C60.2049 38.7754 60.2526 38.8536 60.3234 38.9191C60.3962 38.9832 60.4815 39.0383 60.5791 39.0845C60.6783 39.1306 60.7808 39.1694 60.8866 39.2006L61.3491 39.3392C61.4896 39.3794 61.6263 39.4308 61.7593 39.4933C61.8923 39.5559 62.0065 39.6348 62.1019 39.7302C62.1993 39.824 62.2636 39.9394 62.2948 40.0765C62.3281 40.212 62.3128 40.3751 62.2492 40.5658C62.1676 40.8101 62.0274 41.0298 61.8288 41.2249C61.6301 41.42 61.3868 41.5749 61.0988 41.6896C60.8113 41.8028 60.4932 41.8594 60.1446 41.8594C59.8164 41.8594 59.5485 41.808 59.341 41.7053C59.134 41.601 58.9919 41.4573 58.9149 41.2741C58.8379 41.0908 58.8311 40.8786 58.8944 40.6373H59.3467C59.3022 40.8175 59.314 40.9702 59.3822 41.0953C59.4503 41.2204 59.5614 41.3158 59.7154 41.3813C59.8699 41.4453 60.0555 41.4774 60.2722 41.4774C60.5125 41.4774 60.7387 41.4394 60.951 41.3634C61.1653 41.286 61.3487 41.1787 61.5013 41.0417C61.6559 40.9032 61.7638 40.7423 61.825 40.5591C61.8768 40.4042 61.8776 40.2746 61.8277 40.1703C61.7782 40.0646 61.6892 39.9759 61.5608 39.9044C61.4339 39.8329 61.2799 39.7696 61.0989 39.7145L60.5755 39.5537C60.2329 39.4464 59.9887 39.2982 59.843 39.109C59.6973 38.9199 59.6735 38.6786 59.7715 38.3851C59.8536 38.1394 59.9949 37.9234 60.1952 37.7372C60.3977 37.5495 60.6349 37.4035 60.9069 37.2993C61.1809 37.1935 61.4663 37.1406 61.7631 37.1406C62.0631 37.1406 62.311 37.1928 62.5071 37.297C62.7031 37.4013 62.838 37.545 62.9119 37.7282C62.9878 37.91 62.9917 38.117 62.9235 38.3494H62.4971Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M66.7377 37.2054L65.2094 41.7812H64.7689L66.2972 37.2054H66.7377Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M71.7776 37.2054L70.2492 41.7812H69.8205L68.2501 37.9494H68.2124L66.9325 41.7812H66.492L68.0204 37.2054H68.4467L70.0251 41.0417H70.0628L71.3442 37.2054H71.7776Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M72.6428 37.5808L72.7681 37.2054H76.2662L76.1409 37.5808H74.6121L73.2091 41.7812H72.7686L74.1716 37.5808H72.6428Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M75.7296 41.7812L77.258 37.2054H80.0564L79.9311 37.5808H77.5731L76.9977 39.3034H79.2073L79.0819 39.6788H76.8723L76.2955 41.4059H78.7005L78.5752 41.7812H75.7296Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M79.6682 41.7812L81.1966 37.2054H82.7536C83.096 37.2054 83.3621 37.2643 83.5521 37.3819C83.7442 37.4981 83.8637 37.6597 83.9108 37.8668C83.9599 38.0723 83.9399 38.3084 83.8509 38.575C83.7618 38.8417 83.6243 39.077 83.4384 39.2811C83.254 39.4851 83.028 39.6445 82.7604 39.7592C82.4928 39.8739 82.1894 39.9312 81.8502 39.9312H80.524L80.6516 39.5492H81.9661C82.2173 39.5492 82.4394 39.5097 82.6322 39.4308C82.8266 39.3518 82.989 39.2394 83.1194 39.0934C83.2514 38.9474 83.3508 38.7746 83.4174 38.575C83.4841 38.3754 83.5007 38.2012 83.4672 38.0522C83.4342 37.9018 83.3474 37.7856 83.2067 37.7037C83.0676 37.6217 82.8709 37.5808 82.6165 37.5808H81.5117L80.1087 41.7812H79.6682ZM82.4849 39.7168L82.9825 41.7812H82.4737L81.9878 39.7168H82.4849Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M83.8529 41.7812L85.3813 37.2054H88.1727L88.0474 37.5808H85.6965L85.1211 39.3034H87.2529L87.1275 39.6788H84.9957L84.2934 41.7812H83.8529Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M87.1443 41.7812H86.6826L89.966 37.2054H90.4371L90.6636 41.7812H90.2019L90.0367 37.7484H90.0037L87.1443 41.7812ZM88.0623 40.0273H90.4556L90.3302 40.4027H87.9369L88.0623 40.0273Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M96.0929 38.6354H95.6501C95.6693 38.479 95.6579 38.3345 95.6158 38.2019C95.5758 38.0679 95.508 37.9509 95.4126 37.8511C95.3172 37.7513 95.197 37.6739 95.0521 37.6188C94.9072 37.5636 94.7397 37.5361 94.5497 37.5361C94.245 37.5361 93.9419 37.6113 93.6404 37.7618C93.3405 37.9122 93.0664 38.1334 92.8181 38.4253C92.5719 38.7158 92.3784 39.0718 92.2376 39.4933C92.0958 39.9178 92.051 40.2753 92.1031 40.5658C92.1569 40.8562 92.2835 41.0767 92.4829 41.2271C92.6844 41.3761 92.9375 41.4506 93.2422 41.4506C93.4322 41.4506 93.6181 41.423 93.7998 41.3679C93.9815 41.3128 94.1532 41.2361 94.3148 41.1378C94.4769 41.038 94.6228 40.921 94.7524 40.787C94.8835 40.6529 94.9917 40.5077 95.0769 40.3513H95.5198C95.4104 40.5613 95.2711 40.7572 95.1021 40.9389C94.9351 41.1191 94.7457 41.277 94.534 41.4126C94.3238 41.5481 94.0985 41.6539 93.8579 41.7298C93.6174 41.8058 93.3684 41.8438 93.1108 41.8438C92.7057 41.8438 92.3781 41.7477 92.1282 41.5556C91.8788 41.3619 91.7233 41.0893 91.6617 40.7378C91.6017 40.3863 91.6515 39.9715 91.8112 39.4933C91.9709 39.0152 92.1982 38.6004 92.4931 38.2488C92.7895 37.8973 93.1269 37.6255 93.5051 37.4333C93.8839 37.2397 94.2758 37.1429 94.681 37.1429C94.9386 37.1429 95.1622 37.1808 95.352 37.2568C95.5423 37.3313 95.697 37.437 95.8161 37.5741C95.9373 37.7096 96.0212 37.8675 96.0678 38.0477C96.1159 38.228 96.1243 38.4238 96.0929 38.6354Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M96.0769 41.7812L97.6052 37.2054H100.404L100.278 37.5808H97.9204L97.345 39.3034H99.5546L99.4292 39.6788H97.2196L96.6427 41.4059H99.0478L98.9224 41.7812H96.0769Z"
      fill="#E6EBF0"
    ></path>
    <path
      d="M12.808 0H7.83297C5.44594 9.2466 0.671875 28.177 0.671875 29.9258C0.671875 31.6746 1.62669 31.9611 2.10409 31.8857H30.5223C31.6078 31.8857 32.2812 30.9309 32.4822 30.4535L39.8694 0H34.819L28.5624 25.7046H6.62689L12.808 0Z"
      fill="#9EA2A8"
    ></path>
    <path
      d="M73.5643 0H43.4877L42.357 5.95501H67.5339C68.9209 5.95501 69.1671 6.35704 69.1169 6.55805L67.5339 13.3422H40.6986L36.2512 31.8857H41.5278L44.4676 19.1465H68.5138C70.2626 19.1465 71.3029 17.9404 71.6044 17.3374C72.5592 13.7443 74.6045 5.93994 75.1472 3.46748C75.69 0.995015 74.3181 0.125633 73.5643 0Z"
      fill="#9EA2A8"
    ></path>
    <path
      d="M84.9466 0H79.5947L72.5089 31.8857H77.7855L84.9466 0Z"
      fill="#9EA2A8"
    ></path>
    <path
      d="M101.001 16.1306L94.7443 0.300781L87.5078 31.5081L101.001 16.1306Z"
      fill="#107938"
    ></path>
    <path
      d="M96.6285 16.2075L82.457 31.8112L89.9196 0.453125L96.6285 16.2075Z"
      fill="#EC7423"
    ></path>
  </symbol>
  <symbol
    id="icon-uploadIcon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 42 42"
    fill="none"
  >
    <g clipPath="url(#clip0_2238_60810)">
      <mask
        id="mask0_2238_60810"
        style={{maskType: 'alpha'}}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="42"
        height="42"
      >
        <path d="M42 0H0V42H42V0Z" fill="#333333"></path>
      </mask>
      <g mask="url(#mask0_2238_60810)">
        <path
          d="M5.25 21.0073V36.75H36.75V21"
          stroke="var(--main-color)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M28.875 13.125L21 5.25L13.125 13.125"
          stroke="var(--main-color)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M20.9922 28V5.25"
          stroke="var(--main-color)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_2238_60810">
        <rect width="42" height="42" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-usdt1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M28.2599 22.6781C28.4475 21.9373 28.4395 21.1605 28.2366 20.4238C28.0337 19.6871 27.643 19.0157 27.1027 18.4754C26.5623 17.935 25.8909 17.5443 25.1542 17.3414C24.4175 17.1386 23.6407 17.1305 22.8999 17.3181C21.3599 17.6981 20.0999 18.9581 19.7199 20.4981C19.5324 21.2389 19.5404 22.0156 19.7433 22.7524C19.9461 23.4891 20.3369 24.1605 20.8772 24.7008C21.4175 25.2412 22.0889 25.6319 22.8257 25.8347C23.5624 26.0376 24.3392 26.0457 25.0799 25.8581C26.6399 25.4781 27.8999 24.2181 28.2599 22.6781Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.5"
      d="M12.0399 35.94C11.6799 35.94 11.2999 35.8 11.0199 35.54C9.09928 33.7565 7.56648 31.5966 6.51701 29.1949C5.46754 26.7931 4.92389 24.201 4.91992 21.58C4.91992 11.06 13.4799 2.5 23.9999 2.5C34.5199 2.5 43.0799 11.06 43.0799 21.58C43.0799 26.9 40.9399 31.82 37.0599 35.48C36.4599 36.04 35.4999 36.02 34.9399 35.42C34.3799 34.82 34.3999 33.86 34.9999 33.3C36.6096 31.807 37.8922 29.9965 38.7666 27.9826C39.641 25.9688 40.0882 23.7955 40.0799 21.6C40.0799 12.74 32.8599 5.52 23.9999 5.52C15.1399 5.52 7.91992 12.74 7.91992 21.6C7.91992 26.12 9.73992 30.28 13.0599 33.36C13.6599 33.92 13.6999 34.88 13.1399 35.48C12.8486 35.7729 12.453 35.9384 12.0399 35.94Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M32 30.5979C31.7083 30.5977 31.423 30.5119 31.1795 30.3511C30.936 30.1904 30.7449 29.9618 30.63 29.6936C30.5151 29.4255 30.4813 29.1295 30.5328 28.8423C30.5844 28.5551 30.719 28.2894 30.92 28.0779C32.58 26.3179 33.5 23.9979 33.5 21.5979C33.5 16.3579 29.24 12.1179 24.02 12.1179C21.5074 12.1232 19.0992 13.1237 17.3225 14.9004C15.5458 16.6771 14.5453 19.0853 14.54 21.5979C14.54 24.0179 15.46 26.3179 17.12 28.0779C17.68 28.6779 17.66 29.6379 17.06 30.1979C16.46 30.7779 15.5 30.7379 14.94 30.1379C12.7596 27.8287 11.5434 24.7739 11.54 21.5979C11.54 14.7179 17.14 9.11792 24.02 9.11792C30.9 9.11792 36.5 14.7179 36.5 21.5979C36.5 24.7779 35.3 27.8179 33.1 30.1379C32.8087 30.4309 32.4131 30.5963 32 30.5979Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M20.6004 33.322L17.7204 36.902C15.4404 39.762 17.4604 43.982 21.1204 43.982H26.8604C30.5204 43.982 32.5604 39.742 30.2604 36.902L27.3804 33.322C25.6604 31.142 22.3404 31.142 20.6004 33.322Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-usdt2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 42 42"
    fill="none"
  >
    <circle
      opacity="0.5"
      cx="21"
      cy="21"
      r="20"
      stroke="var(--main-color)"
      strokeWidth="2"
    ></circle>
    <path
      d="M31.1591 13.9751V9H11.1371V13.9751H18.5185V17.2253C12.5183 17.4999 8 18.7033 8 20.147C8 21.5907 12.5183 22.7942 18.5185 23.0687V33.5H23.7777V23.0664C29.7547 22.7876 34.25 21.5865 34.25 20.147C34.25 18.7075 29.7547 17.506 23.7777 17.2277V13.9751H31.1591ZM31.9895 19.8532C31.9895 20.8027 28.4958 21.5992 23.7777 21.8203L23.4727 21.8334H23.4391L23.153 21.8442H23.1221C22.9096 21.8517 22.6943 21.858 22.4763 21.863H22.4629L22.1704 21.8691H22.0878L21.8571 21.8724H20.3961L20.1677 21.8691H20.0884L19.8157 21.8634H19.7857C19.4625 21.8559 19.144 21.8459 18.8303 21.8334H18.8262L18.5138 21.8198C13.7722 21.602 10.2559 20.8027 10.2559 19.8485C10.2559 18.8943 13.7727 18.0974 18.5138 17.8773V20.8947C19.3369 20.9384 20.2125 20.9623 21.1204 20.9623C22.0431 20.9623 22.9362 20.9379 23.7731 20.8924V17.8862C28.4953 18.1068 31.9895 18.9037 31.9895 19.8532Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-usdt3"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M23.3004 4.69612L12.7004 15.2961C12.3004 15.6961 12.3004 16.3161 12.7004 16.7161L15.2804 19.2961C15.6804 19.6961 16.3004 19.6961 16.7004 19.2961L23.2804 12.7161C23.6804 12.3161 24.3004 12.3161 24.7004 12.7161L31.2804 19.2961C31.6804 19.6961 32.3004 19.6961 32.7004 19.2961L35.2804 16.7161C35.6804 16.3161 35.6804 15.6961 35.2804 15.2961L24.7004 4.71612C24.3204 4.31612 23.6804 4.31612 23.3004 4.69612ZM23.3004 43.3001L12.7204 32.7201C12.3204 32.3201 12.3204 31.7001 12.7204 31.3001L15.3004 28.7201C15.7004 28.3201 16.3204 28.3201 16.7204 28.7201L23.3004 35.3001C23.7004 35.7001 24.3204 35.7001 24.7204 35.3001L31.3004 28.7201C31.7004 28.3201 32.3204 28.3201 32.7204 28.7201L35.3004 31.3001C35.7004 31.7001 35.7004 32.3201 35.3004 32.7201L24.7204 43.3001C24.3204 43.6801 23.6804 43.6801 23.3004 43.3001Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.5"
      d="M40.2004 20.196L43.2804 23.276C43.6804 23.676 43.6804 24.296 43.2804 24.696L40.2004 27.796C39.8004 28.196 39.1804 28.196 38.7804 27.796L35.7004 24.716C35.3004 24.316 35.3004 23.696 35.7004 23.296L38.7804 20.216C39.1804 19.816 39.8204 19.816 40.2004 20.196ZM9.20039 20.2L12.2804 23.28C12.6804 23.68 12.6804 24.3 12.2804 24.7L9.20039 27.8C8.80039 28.2 8.18039 28.2 7.78039 27.8L4.70039 24.72C4.30039 24.32 4.30039 23.7 4.70039 23.3L7.80039 20.2C8.18039 19.82 8.82039 19.82 9.20039 20.2ZM24.7004 19.76L28.2404 23.3C28.6404 23.7 28.6404 24.32 28.2404 24.72L24.7004 28.26C24.3004 28.66 23.6804 28.66 23.2804 28.26L19.7404 24.72C19.3404 24.32 19.3404 23.7 19.7404 23.3L23.2804 19.76C23.6804 19.36 24.3204 19.36 24.7004 19.76Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-usdt4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle cx="24" cy="24" r="24" fill="var(--main-color)"></circle>
    <path
      d="M35.3279 16.1143V10.4355H12.7242V16.1143H21.0574V19.8243C14.2835 20.1377 9.18262 21.5113 9.18262 23.1592C9.18262 24.8071 14.2835 26.1807 21.0574 26.4941V38.4008H26.9947V26.4914C33.7425 26.1732 38.8174 24.8023 38.8174 23.1592C38.8174 21.5161 33.7425 20.1446 26.9947 19.8269V16.1143H35.3279ZM36.2654 22.8238C36.2654 23.9076 32.3212 24.8167 26.9947 25.0691L26.6505 25.0841H26.6125L26.2895 25.0964H26.2546C26.0147 25.105 25.7717 25.1121 25.5255 25.1178H25.5104L25.1802 25.1248H25.087L24.8266 25.1285H23.1771L22.9193 25.1248H22.8297L22.5219 25.1184H22.4881C22.1231 25.1098 21.7636 25.0984 21.4094 25.0841H21.4048L21.0522 25.0685C15.6991 24.82 11.7294 23.9076 11.7294 22.8185C11.7294 21.7293 15.6997 20.8196 21.0522 20.5684V24.0126C21.9813 24.0624 22.9698 24.0898 23.9948 24.0898C25.0364 24.0898 26.0448 24.0619 26.9895 24.0099V20.5786C32.3207 20.8304 36.2654 21.74 36.2654 22.8238Z"
      fill="var(--bg_color_L2)"
    ></path>
  </symbol>
  <symbol
    id="icon-usdtLogo3"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24ZM26.1014 21.2149L32.7316 15.2706L14.4413 11.6125L26.1014 21.2149ZM35.0672 13.7646C34.9557 13.6994 34.8298 13.6506 34.6908 13.6228L11.706 9.02585C11.1479 8.91424 10.6909 9.17665 10.4502 9.57042C10.0728 9.87477 9.86981 10.396 10.0925 10.9501L22.4961 41.8149C22.812 42.6009 23.7011 42.7469 24.2811 42.3681C24.5174 42.3121 24.7439 42.1791 24.9273 41.9546L41.6796 21.4474C41.9048 21.1717 41.9816 20.8526 41.9453 20.553C42.0387 20.1556 41.9351 19.7107 41.5816 19.3908L35.6909 14.0611C35.5104 13.8978 35.2927 13.799 35.0672 13.7646ZM34.8833 16.0275L29.2389 21.0881L38.9707 19.7256L34.8833 16.0275ZM13.1172 13.1131L25.0686 22.9554L23.1715 38.132L13.1172 13.1131ZM38.8388 21.7637L25.1724 38.4932L27.0279 23.4171L38.8388 21.7637Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-user"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M24 24C26.6522 24 29.1957 22.9464 31.0711 21.0711C32.9464 19.1957 34 16.6522 34 14C34 11.3478 32.9464 8.8043 31.0711 6.92893C29.1957 5.05357 26.6522 4 24 4C21.3478 4 18.8043 5.05357 16.9289 6.92893C15.0536 8.8043 14 11.3478 14 14C14 16.6522 15.0536 19.1957 16.9289 21.0711C18.8043 22.9464 21.3478 24 24 24Z"
      fill="currentColor"
    ></path>
    <path
      d="M6 44C6 35.1634 13.1634 28 22 28H26C34.8366 28 42 35.1634 42 44H6Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-verify"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="login_list_icon">
      <path
        id="Vector"
        opacity="0.4"
        d="M36.656 11.34L13.176 34.82C12.296 35.7 10.816 35.58 10.096 34.54C7.61601 30.92 6.15601 26.64 6.15601 22.24V13.46C6.15601 11.82 7.39601 9.96 8.91601 9.34L20.056 4.78C21.2988 4.26503 22.6308 3.99998 23.976 3.99998C25.3212 3.99998 26.6533 4.26503 27.896 4.78L35.976 8.08C37.316 8.62 37.656 10.34 36.656 11.34Z"
        fill="currentColor"
      ></path>
      <path
        id="Vector_2"
        d="M38.54 14.084C39.84 12.984 41.82 13.924 41.82 15.624V22.244C41.82 32.024 34.72 41.184 25.02 43.864C24.36 44.044 23.64 44.044 22.96 43.864C20.1526 43.0755 17.5242 41.7512 15.22 39.964C14.26 39.224 14.16 37.824 15 36.964C19.36 32.504 32.12 19.504 38.54 14.084Z"
        fill="currentColor"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-versionUpdate"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M67 40.5C67 36.8887 66.2887 33.3127 64.9067 29.9762C63.5247 26.6398 61.4991 23.6082 58.9454 21.0546C56.3918 18.501 53.3602 16.4753 50.0238 15.0933C46.6873 13.7113 43.1114 13 39.5 13C35.8887 13 32.3127 13.7113 28.9762 15.0933C25.6398 16.4753 22.6082 18.501 20.0546 21.0546C17.501 23.6082 15.4753 26.6398 14.0933 29.9762C12.7113 33.3127 12 36.8887 12 40.5C12.0004 47.7935 14.8981 54.788 20.0557 59.945C25.2132 65.102 32.2081 67.9989 39.5015 67.9985C46.795 67.9981 53.7896 65.1004 58.9465 59.9428C64.1035 54.7853 67.0004 47.7904 67 40.4969V40.5ZM43.4233 53.1271C39.3587 57.4621 34.2249 58.8538 33.6135 55.5849C33.1496 53.1271 35.5798 44.1867 36.0652 40.8287C36.228 39.7258 34.8363 40.8287 34.8363 40.8287C34.8363 40.8287 30.8485 43.6368 29.9329 42.0577C29.7885 41.8057 30.7716 41.0346 31.1618 40.8287C31.1618 40.8287 39.4816 34.7149 42.2005 35.9069C44.9195 37.099 41.2451 44.6322 40.9716 45.7475C40.7013 46.8627 38.9746 55.3944 44.6522 50.6631C44.6522 50.6631 47.4849 48.7798 43.4233 53.124V53.1271ZM41.3434 32.211C40.2067 32.146 39.1422 31.6326 38.3836 30.7836C37.625 29.9346 37.2343 28.8193 37.2972 27.6824C37.3575 26.5447 37.8671 25.4775 38.714 24.7153C39.5608 23.9531 40.6757 23.5584 41.8134 23.6178C44.1822 23.7468 45.9917 25.7807 45.8627 28.1464C45.8328 28.7103 45.6921 29.2627 45.4487 29.7722C45.2052 30.2817 44.8637 30.7383 44.4437 31.1157C44.0237 31.4932 43.5335 31.7842 43.001 31.9722C42.4685 32.1601 41.9042 32.2412 41.3403 32.211H41.3434Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-video"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M16.6044 8.59427C16.3396 8.03582 16.5807 7.36986 17.1427 7.10682C17.7048 6.84378 18.3751 7.08325 18.6399 7.6417L21.6149 13.9168C21.8796 14.4752 21.6386 15.1412 21.0765 15.4042C20.5144 15.6673 19.8441 15.4278 19.5794 14.8693L16.6044 8.59427Z"
      fill="currentColor"
    ></path>
    <path
      d="M30.9957 8.59427C31.2605 8.03582 31.0194 7.36986 30.4573 7.10682C29.8953 6.84378 29.225 7.08325 28.9602 7.6417L25.9605 13.9689C25.6958 14.5274 25.9368 15.1933 26.4989 15.4564C27.061 15.7194 27.7313 15.4799 27.996 14.9215L30.9957 8.59427Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.625 13.8957C8.5184 13.8957 6 16.3978 6 19.4843V36.2501C6 39.3366 8.5184 41.8387 11.625 41.8387H36.375C39.4816 41.8387 42 39.3366 42 36.2501V19.4843C42 16.3978 39.4816 13.8957 36.375 13.8957H11.625ZM14.4375 16.1312C11.3309 16.1312 8.8125 18.6333 8.8125 21.7198V34.0147C8.8125 37.1012 11.3309 39.6033 14.4375 39.6033H33.5625C36.6691 39.6033 39.1875 37.1012 39.1875 34.0147V21.7198C39.1875 18.6333 36.6691 16.1312 33.5625 16.1312H14.4375Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.8065 17.8086C13.5996 17.8086 11 20.4082 11 23.615V32.1211C11 35.3279 13.5996 37.9275 16.8065 37.9275H31.0685C34.2754 37.9275 36.875 35.3279 36.875 32.1211V23.615C36.875 20.4082 34.2754 17.8086 31.0685 17.8086H16.8065ZM27.3776 29.5791C28.8784 28.6765 28.8784 26.5008 27.3776 25.5982L23.5195 23.2782C21.9715 22.3473 20 23.4623 20 25.2686L20 29.9087C20 31.715 21.9715 32.83 23.5195 31.8991L27.3776 29.5791Z"
      fill="currentColor"
    ></path>
  </symbol>
  <symbol
    id="icon-vipRebateDark"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle
      cx="10"
      cy="10"
      r="9.4"
      fill="white"
      stroke="var(--main-color)"
      strokeWidth="1.2"
    ></circle>
    <circle cx="10" cy="10" r="5" fill="var(--main-color)"></circle>
  </symbol>
  <symbol
    id="icon-vipRebateLight"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle
      cx="10"
      cy="10"
      r="9.4"
      fill="white"
      stroke="var(--main-color)"
      strokeWidth="1.2"
    ></circle>
    <circle cx="10" cy="10" r="5" fill="var(--main-color)"></circle>
  </symbol>
  <symbol
    id="icon-voice"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 13.5467C0 12.8031 0.262051 12.1728 0.786154 11.658C1.31077 11.1426 1.94103 10.8851 2.67846 10.8851H5.3559V22.9487H2.67795C1.94103 22.9487 1.31077 22.6913 0.786154 22.1759C0.262051 21.6605 0 21.0308 0 20.2867V13.5467ZM29.7554 2.47078C30.9744 1.29744 32.0795 0.653342 33.0718 0.53847C34.0636 0.423598 34.9421 0.688726 35.7077 1.33232C36.4723 1.97642 37.1241 2.92103 37.6626 4.16565C38.201 5.41078 38.64 6.79898 38.9805 8.32975C39.3294 9.91631 39.5849 11.522 39.7456 13.1385C39.9154 14.8128 40.0005 16.4082 40.0005 17.9251C40.0005 19.4421 39.8944 20.959 39.6815 22.4759C39.4692 23.9928 39.1574 25.4164 38.7467 26.7477C38.3354 28.0785 37.8538 29.2446 37.301 30.2462C36.7487 31.2482 36.1323 31.9923 35.4523 32.4785C34.7723 32.9656 34.0421 33.1369 33.2626 32.9939C32.4836 32.8508 31.6687 32.2928 30.819 31.3195C29.9969 30.3467 28.8846 29.538 27.4821 28.8939C26.079 28.2503 24.5487 27.7062 22.8913 27.2631C21.2317 26.8189 19.5503 26.4605 17.8538 26.1892C16.1533 25.9174 14.5949 25.6744 13.1779 25.4595C11.761 25.2446 10.5779 25.0374 9.62872 24.8369C8.67949 24.6369 8.14769 24.3933 8.03436 24.1072V10.6703C8.14769 10.2698 8.59436 9.94052 9.37333 9.68309C10.1528 9.42565 11.1446 9.18206 12.3492 8.95334C13.5533 8.72411 14.9133 8.47386 16.4297 8.20206C17.9942 7.91848 19.5412 7.54573 21.0631 7.08565C22.6464 6.60931 24.1888 6.00634 25.6754 5.28257C27.1702 4.55759 28.5461 3.60948 29.7559 2.47078H29.7554ZM14.4528 28.7872C14.5944 29.1308 14.7646 29.5026 14.9626 29.9036C15.1685 30.3436 15.3956 30.7733 15.6431 31.1913C15.9625 31.7338 16.3029 32.2636 16.6636 32.7795C17.1446 33.4667 17.6338 34.1898 18.1297 34.9477C18.6256 35.7067 19.0015 36.3933 19.2559 37.0087C19.5113 37.6241 19.5892 38.1318 19.4897 38.5323C19.3908 38.9333 18.9872 39.1333 18.2785 39.1333H15.8554C15.2887 39.1333 14.7646 39.0262 14.2826 38.8118C13.8005 38.5964 13.3405 38.2682 12.901 37.8241C12.4621 37.3805 12.0087 36.8154 11.541 36.1282C11.0733 35.441 10.5703 34.6256 10.0318 33.681C9.38051 32.5939 8.92667 31.6421 8.67179 30.8267C8.41641 30.0108 8.24615 29.3308 8.16154 28.7872C8.04821 28.1574 8.04821 27.6139 8.16154 27.1559C8.3882 27.1846 8.65744 27.2415 8.96923 27.3277C9.2241 27.3846 9.5359 27.4559 9.90462 27.5421C10.2728 27.6282 10.6979 27.7139 11.1795 27.8C11.6615 27.9144 12.0933 28.0215 12.4759 28.1215C12.8585 28.2221 13.2056 28.3292 13.5174 28.4436C13.8325 28.5489 14.1445 28.6635 14.4528 28.7872Z"
      fill="url(#paint0_linear_19_15864)"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_19_15864"
        x1="20.0003"
        y1="0.512421"
        x2="20.0003"
        y2="39.1333"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F84948"></stop>
        <stop offset="1" stopColor="#FF7857"></stop>
      </linearGradient>
    </defs>
  </symbol>
  <symbol
    id="icon-1"
    viewBox="0 0 62 59"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M42.7474 21.041C43.8798 22.8892 44.446 25.0217 44.5875 27.1542C55.0621 29.8554 62.1395 35.6843 61.9979 42.0819C61.9979 51.4651 48.1262 59 30.999 59C13.8717 59 0 51.4651 0 42.0819C0 35.4 7.21894 29.5711 17.5519 26.8699C17.5519 29.4289 18.1181 31.9879 19.392 34.2626L29.1588 51.1807C29.8666 52.4602 30.4328 53.8819 30.7159 55.3036L31.1405 54.5928C33.5468 50.4699 33.5468 45.2096 31.1405 41.0867L23.3554 27.5807C20.9491 23.3157 20.9491 18.1976 23.3554 14.0747L23.78 13.3639C24.0631 14.7855 24.6293 16.2072 25.337 17.4867L29.8666 25.4482L36.944 37.8169C37.6517 39.0964 38.2179 40.5181 38.501 41.9398L38.9256 41.2289C41.3319 37.106 41.3319 31.8458 38.9256 27.7229L31.1405 14.2169C28.7342 10.094 28.7342 4.83373 31.1405 0.710843L31.5651 0C31.8482 1.42169 32.4144 2.84337 33.1222 4.12289L42.7474 21.041Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-5"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.7208 7.00916C26.5966 3.88497 21.5313 3.88497 18.4071 7.00916L12.1304 13.2858H14.1409C14.9937 13.2858 15.7612 13.6269 17.1256 14.9913L23.5214 21.3871H24.8006L31.1964 14.9913C31.7649 14.4228 33.1577 13.2858 34.1811 13.2858H35.9974L29.7208 7.00916ZM37.703 14.9913H34.1811C33.8968 15.1335 33.1577 15.5883 32.4755 16.2705C32.2177 16.5284 31.505 17.1801 30.6183 17.991C29.1592 19.3254 27.229 21.0906 26.0797 22.2399C25.6533 22.6663 25.2269 23.0927 23.9478 23.0927C23.095 23.0927 22.2422 22.6663 21.8158 22.2399L15.8464 15.8441C15.4201 15.4177 14.7063 14.9913 13.7145 14.9913H10.4249L7.00623 18.41C3.88204 21.5342 3.88204 26.5995 7.00623 29.7237L10.1821 32.8996H13.7145C14.7063 32.8996 15.4201 32.4732 15.8464 32.0468L21.8158 25.651C22.2422 25.2246 23.095 24.7982 23.9478 24.7982C25.2269 24.7982 25.6533 25.2246 26.0797 25.651C27.229 26.8003 29.1592 28.5655 30.6183 29.8999L30.6184 29.9C31.505 30.7108 32.2177 31.3626 32.4755 31.6204C33.1577 32.3026 33.8968 32.7574 34.1811 32.8996H37.9458L41.1216 29.7237C44.2458 26.5995 44.2458 21.5342 41.1216 18.41L37.703 14.9913ZM36.2402 34.6051H34.1811C33.1577 34.6051 31.7649 33.4681 31.1964 32.8996L24.8006 26.5038H23.5214L17.1256 32.8996C15.7612 34.264 14.9937 34.6051 14.1409 34.6051H11.8876L18.4071 41.1246C21.5313 44.2488 26.5966 44.2488 29.7208 41.1246L36.2402 34.6051Z"
      fill="#37B4AA"
    ></path>
  </symbol>
  <symbol
    id="icon-usdtLogo3"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24ZM26.1014 21.2149L32.7316 15.2706L14.4413 11.6125L26.1014 21.2149ZM35.0672 13.7646C34.9557 13.6994 34.8298 13.6506 34.6908 13.6228L11.706 9.02585C11.1479 8.91424 10.6909 9.17665 10.4502 9.57042C10.0728 9.87477 9.86981 10.396 10.0925 10.9501L22.4961 41.8149C22.812 42.6009 23.7011 42.7469 24.2811 42.3681C24.5174 42.3121 24.7439 42.1791 24.9273 41.9546L41.6796 21.4474C41.9048 21.1717 41.9816 20.8526 41.9453 20.553C42.0387 20.1556 41.9351 19.7107 41.5816 19.3908L35.6909 14.0611C35.5104 13.8978 35.2927 13.799 35.0672 13.7646ZM34.8833 16.0275L29.2389 21.0881L38.9707 19.7256L34.8833 16.0275ZM13.1172 13.1131L25.0686 22.9554L23.1715 38.132L13.1172 13.1131ZM38.8388 21.7637L25.1724 38.4932L27.0279 23.4171L38.8388 21.7637Z"
      fill="#221F2E"
    ></path>
  </symbol>
  <symbol
    id="icon-wallet"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle
      opacity="0.3"
      cx="28"
      cy="24"
      r="18"
      fill="currentColor"
    ></circle>
    <path
      d="M3 23C3 17.016 6.526 12.836 12.0085 12.132C12.5675 12.044 13.148 12 13.75 12H35.25C35.809 12 36.3465 12.022 36.8625 12.11C42.4095 12.77 46 16.972 46 23V34C46 40.6 41.7 45 35.25 45H13.75C7.3 45 3 40.6 3 34V31.822"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M46 23.7241H39.548C37.1822 23.7241 35.2466 25.5862 35.2466 27.8621C35.2466 30.1379 37.1822 32 39.548 32H46M37 12C36.4838 11.9172 35.8058 12 35.2466 12H14C13.3978 12 12.5592 11.9172 12 12C12 12 12.7312 11.3517 13.2474 10.8551L20.2371 4.11027C21.6566 2.75836 23.5733 2 25.5708 2C27.5682 2 29.4849 2.75836 30.9044 4.11027L34.6681 7.77235C36.0445 9.0758 39.548 12 37 12Z"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-wallet1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M60.134 45.1654C58.734 46.532 57.934 48.4987 58.134 50.5987C58.434 54.1987 61.734 56.832 65.334 56.832H71.6673V60.7987C71.6673 67.6987 66.034 73.332 59.134 73.332H20.8673C13.9673 73.332 8.33398 67.6987 8.33398 60.7987V38.3654C8.33398 31.4654 13.9673 25.832 20.8673 25.832H59.134C66.034 25.832 71.6673 31.4654 71.6673 38.3654V43.1654H64.934C63.0673 43.1654 61.3673 43.8987 60.134 45.1654Z"
      fill="white"
    ></path>
    <path
      d="M49.5007 13.1719V25.8385H20.8673C13.9673 25.8385 8.33398 31.4719 8.33398 38.3719V26.1385C8.33398 22.1719 10.7673 18.6385 14.4673 17.2385L40.934 7.23854C45.0673 5.7052 49.5007 8.73854 49.5007 13.1719ZM75.1973 46.5652V53.4319C75.1973 55.2652 73.7307 56.7652 71.864 56.8319H65.3307C61.7307 56.8319 58.4306 54.1985 58.1306 50.5985C57.9306 48.4985 58.7307 46.5319 60.1307 45.1652C61.364 43.8985 63.064 43.1652 64.9307 43.1652H71.864C73.7307 43.2319 75.1973 44.7319 75.1973 46.5652ZM46.6673 42.4985H23.334C21.9673 42.4985 20.834 41.3652 20.834 39.9985C20.834 38.6319 21.9673 37.4985 23.334 37.4985H46.6673C48.034 37.4985 49.1673 38.6319 49.1673 39.9985C49.1673 41.3652 48.034 42.4985 46.6673 42.4985Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-wallet2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <g clipPath="url(#clip0_2123_4419)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4844 8.97668L23.8363 3L27.2956 8.99168L13.4844 8.97668Z"
        fill="#80849C"
      ></path>
      <path
        d="M3 10.5C3 9.67155 3.67157 9 4.5 9H31.5C32.3284 9 33 9.67155 33 10.5V31.5C33 32.3284 32.3284 33 31.5 33H4.5C3.67157 33 3 32.3284 3 31.5V10.5Z"
        fill="#001534"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.5625 25.5H27C24.8254 25.5 23.0625 23.8211 23.0625 21.75C23.0625 19.679 24.8254 18 27 18H33.5625V25.5ZM26.3848 22.75C27.0061 22.75 27.5098 22.2463 27.5098 21.625C27.5098 21.0037 27.0061 20.5 26.3848 20.5C25.7634 20.5 25.2598 21.0037 25.2598 21.625C25.2598 22.2463 25.7634 22.75 26.3848 22.75Z"
        fill="#80849C"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_2123_4419">
        <rect width="36" height="36" fill="white"></rect>
      </clipPath>
    </defs>
  </symbol>
  <symbol
    id="icon-warningTriangle"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <path
      d="M35.2336 29.5075L21.1223 5.06815C19.3963 2.08015 16.5755 2.08015 14.8499 5.06815L0.738497 29.5075C-0.987066 32.4986 0.424628 34.9385 3.87335 34.9385H32.0986C35.5475 34.9385 36.9577 32.4984 35.2336 29.5075ZM16.0479 12.0026C16.555 11.4543 17.1997 11.1801 17.9859 11.1801C18.7726 11.1801 19.4167 11.4514 19.9243 11.9916C20.4286 12.533 20.6807 13.2101 20.6807 14.0242C20.6807 14.7247 19.628 19.8758 19.2769 23.6232H16.7414C16.4335 19.8758 15.2912 14.7247 15.2912 14.0242C15.2913 13.2224 15.5438 12.5481 16.0479 12.0026ZM19.8888 29.8216C19.3554 30.341 18.7207 30.5999 17.9861 30.5999C17.2516 30.5999 16.6168 30.341 16.0835 29.8216C15.5517 29.3033 15.2873 28.6756 15.2873 27.9383C15.2873 27.2049 15.5517 26.5704 16.0835 26.0386C16.6168 25.5066 17.2516 25.2406 17.9861 25.2406C18.7207 25.2406 19.3554 25.5066 19.8888 26.0386C20.4203 26.5704 20.6852 27.2049 20.6852 27.9383C20.6852 28.6756 20.4203 29.3033 19.8888 29.8216Z"
      fill="white"
    ></path>
  </symbol>
  <symbol
    id="icon-watchCollection"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M5.82031 6.72656V13.9993H13.0931"
      stroke="var(--text_color_L1)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C16.598 4 10.1351 8.02111 6.67677 13.9981"
      stroke="var(--text_color_L1)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M24.0012 12L24 24.0088L32.4794 32.4882"
      stroke="var(--text_color_L1)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType1"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon">
      <path
        id="Vector"
        opacity="0.8"
        d="M25.7999 5.03627L25.7399 5.17627L19.9399 18.6363H14.2399C12.8799 18.6363 11.5999 18.8963 10.3999 19.4163L13.8999 11.0563L13.9799 10.8763L14.0999 10.5563C14.1599 10.4163 14.1999 10.2963 14.2599 10.1963C16.8799 4.13627 19.8399 2.75627 25.7999 5.03627Z"
        fill="#F87700"
      ></path>
      <path
        id="Vector_2"
        d="M36.5782 19.04C35.6782 18.78 34.7382 18.64 33.7582 18.64H19.9382L25.7382 5.18004L25.7982 5.04004C26.0782 5.14004 26.3782 5.28004 26.6782 5.38004L31.0982 7.24004C33.5582 8.26004 35.2782 9.32004 36.3382 10.6C36.5182 10.84 36.6782 11.06 36.8382 11.32C37.0182 11.6 37.1582 11.88 37.2382 12.18C37.3182 12.36 37.3782 12.52 37.4182 12.7C37.9382 14.4 37.6182 16.46 36.5782 19.04Z"
        fill="#F87700"
      ></path>
      <path
        id="Vector_3"
        opacity="0.4"
        d="M43.5158 28.3996V32.2996C43.5158 32.6996 43.4958 33.0996 43.4758 33.4796C43.0958 40.4796 39.1958 43.9996 31.7958 43.9996H16.1958C15.6958 43.9996 15.2358 43.9597 14.7758 43.8997C8.41583 43.4797 5.01583 40.0797 4.57583 33.7197C4.51583 33.2397 4.47583 32.7796 4.47583 32.2996V28.3996C4.47583 24.3796 6.91583 20.9196 10.3958 19.4196C11.5958 18.8996 12.8758 18.6396 14.2358 18.6396H33.7558C34.7358 18.6396 35.6758 18.7796 36.5758 19.0396C38.582 19.6518 40.3388 20.8914 41.588 22.5762C42.8372 24.261 43.513 26.3022 43.5158 28.3996Z"
        fill="#F87700"
      ></path>
      <path
        id="Vector_4"
        opacity="0.6"
        d="M13.8958 11.0625L10.3958 19.4225C8.64005 20.1778 7.14384 21.4307 6.09182 23.0265C5.03981 24.6223 4.47804 26.4911 4.47583 28.4025V22.5425C4.47583 16.8625 8.51583 12.1225 13.8958 11.0625ZM43.5198 22.5405V28.4005C43.517 26.3031 42.8412 24.2619 41.592 22.577C40.3428 20.8922 38.586 19.6526 36.5798 19.0405C37.6198 16.4605 37.9398 14.4005 37.4198 12.7005C37.3798 12.5205 37.3198 12.3605 37.2398 12.1805C39.1338 13.168 40.7208 14.656 41.828 16.4826C42.9353 18.3092 43.5204 20.4045 43.5198 22.5405Z"
        fill="#F87700"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-weeklyType10"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 44 40"
    fill="none"
  >
    <path
      d="M21.9953 27.2C29.0646 27.2 34.7953 21.4141 34.7953 14.2769V0H9.19531V14.2769C9.19531 21.4141 14.9261 27.2 21.9953 27.2Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.398438 7.00039C0.398438 6.11673 1.11478 5.40039 1.99844 5.40039H9.99844C10.8821 5.40039 11.5984 6.11673 11.5984 7.00039V17.0004C11.5984 17.884 10.8821 18.6004 9.99844 18.6004C4.96038 18.6004 0.398438 14.388 0.398438 7.00039ZM3.68806 8.60039C4.1374 12.4509 6.21008 14.5052 8.39844 15.1627V8.60039H3.68806Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.3984 7.00039C32.3984 6.11673 33.1148 5.40039 33.9984 5.40039H41.9984C42.8821 5.40039 43.5984 6.11673 43.5984 7.00039C43.5984 14.388 39.0365 18.6004 33.9984 18.6004C33.1148 18.6004 32.3984 17.884 32.3984 17.0004V7.00039ZM35.5984 8.60039V15.1627C37.7868 14.5052 39.8595 12.4509 40.3088 8.60039H35.5984Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.9984 24.8008C22.8821 24.8008 23.5984 25.6763 23.5984 26.7563V31.6452C23.5984 32.7252 22.8821 33.6008 21.9984 33.6008C21.1148 33.6008 20.3984 32.7252 20.3984 31.6452V26.7563C20.3984 25.6763 21.1148 24.8008 21.9984 24.8008Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M14.5928 39.6C13.1162 39.6 12.1487 38.0548 12.7936 36.7265L14.5415 33.1265C14.8761 32.4374 15.5747 32 16.3407 32H27.4275C28.1732 32 28.857 32.4149 29.2014 33.0763L31.076 36.6763C31.7693 38.0078 30.8033 39.6 29.3021 39.6H14.5928Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType11"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M41.175 44.2918H6.91875C5.11875 44.2918 3.65625 42.8293 3.65625 41.0293V6.82461C3.65625 4.99648 5.14688 3.50586 6.975 3.50586H41.1562C42.9656 3.50586 44.4375 4.97773 44.4375 6.78711V41.0246C44.4375 42.8246 42.975 44.2918 41.175 44.2918ZM6.97031 5.38086C6.17344 5.38086 5.52656 6.02773 5.52656 6.82461V41.0246C5.52656 41.7887 6.15 42.4121 6.91406 42.4121H41.1703C41.9344 42.4121 42.5578 41.7887 42.5578 41.0246V6.78711C42.5578 6.01367 41.925 5.38086 41.1516 5.38086H6.97031Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M9.01562 8.98047H38.9547V38.9195H9.01562V8.98047Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M7.26562 13.9551H10.7344V20.9535H7.26562V13.9551ZM7.26562 26.9629H10.7344V33.9613H7.26562V26.9629Z"
      fill="#221F2E"
    ></path>
    <path
      d="M38.2703 7.9082H9.8875C8.875 7.9082 8.05937 8.72852 8.05937 9.73633V12.741H7.25781C6.76562 12.741 6.36719 13.1395 6.36719 13.6316V21.0426C6.36719 21.5348 6.76562 21.9332 7.25781 21.9332H8.05937V25.866H7.25781C6.76562 25.866 6.36719 26.2645 6.36719 26.7566V34.1676C6.36719 34.6598 6.76562 35.0582 7.25781 35.0582H8.05937V38.1379C8.05937 39.1035 8.84219 39.891 9.8125 39.891H38.2891C39.2547 39.891 40.0422 39.1082 40.0422 38.1379V9.68008C40.0375 8.70039 39.2453 7.9082 38.2703 7.9082ZM7.77344 20.3395V14.3348C7.77344 14.2316 7.85781 14.1473 7.96094 14.1473H10.075C10.1781 14.1473 10.2625 14.2316 10.2625 14.3348V20.3395C10.2625 20.4426 10.1781 20.527 10.075 20.527H7.96094C7.85781 20.527 7.77344 20.4426 7.77344 20.3395ZM7.77344 33.4645V27.4598C7.77344 27.3566 7.85781 27.2723 7.96094 27.2723H10.075C10.1781 27.2723 10.2625 27.3566 10.2625 27.4598V33.4645C10.2625 33.5676 10.1781 33.652 10.075 33.652H7.96094C7.85781 33.652 7.77344 33.5676 7.77344 33.4645ZM38.1625 38.016H9.92969V35.0582H10.7594C11.2516 35.0582 11.65 34.6598 11.65 34.1676V26.7566C11.65 26.2645 11.2516 25.866 10.7594 25.866H9.92969V21.9332H10.7594C11.2516 21.9332 11.65 21.5348 11.65 21.0426V13.6316C11.65 13.1395 11.2516 12.741 10.7594 12.741H9.92969V9.7832H38.1625V38.016Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M21.5078 23.9574C21.5078 24.7441 21.6628 25.5231 21.9638 26.2499C22.2649 26.9768 22.7061 27.6372 23.2624 28.1934C23.8187 28.7497 24.4791 29.191 25.2059 29.492C25.9327 29.7931 26.7117 29.948 27.4984 29.948C28.2851 29.948 29.0641 29.7931 29.791 29.492C30.5178 29.191 31.1782 28.7497 31.7345 28.1934C32.2907 27.6372 32.732 26.9768 33.0331 26.2499C33.3341 25.5231 33.4891 24.7441 33.4891 23.9574C33.4891 22.3686 32.8579 20.8449 31.7345 19.7214C30.611 18.598 29.0872 17.9668 27.4984 17.9668C25.9096 17.9668 24.3859 18.598 23.2624 19.7214C22.139 20.8449 21.5078 22.3686 21.5078 23.9574Z"
      fill="#221F2E"
    ></path>
    <path
      d="M36.2462 27.591L34.6243 26.6535C34.9759 25.8051 35.1728 24.8723 35.1728 23.8973C35.1728 22.9223 34.9759 21.9895 34.6243 21.141L36.2462 20.2035C36.6962 19.9457 36.8462 19.3691 36.5884 18.9238C36.3306 18.4738 35.754 18.3238 35.3087 18.5816L33.6868 19.5191C32.5524 18.0426 30.8556 17.016 28.9196 16.7629V14.8926C28.9196 14.377 28.4978 13.9551 27.9821 13.9551C27.4665 13.9551 27.0446 14.377 27.0446 14.8926V16.7629C25.1087 17.016 23.4118 18.0426 22.2774 19.5191L20.6556 18.5816C20.2056 18.3238 19.6337 18.4785 19.3759 18.9238C19.1181 19.3738 19.2728 19.9457 19.7181 20.2035L21.3399 21.141C20.9884 21.9895 20.7915 22.9223 20.7915 23.8973C20.7915 24.8723 20.9884 25.8051 21.3399 26.6535L19.7181 27.591C19.2681 27.8488 19.1181 28.4254 19.3759 28.8707C19.5493 29.1707 19.8634 29.3395 20.1868 29.3395C20.3462 29.3395 20.5056 29.2973 20.6556 29.2129L22.2774 28.2754C23.4118 29.752 25.1087 30.7785 27.0446 31.0316V32.9066C27.0446 33.4223 27.4665 33.8441 27.9821 33.8441C28.4978 33.8441 28.9196 33.4223 28.9196 32.9066V31.0363C30.8556 30.7832 32.5524 29.7566 33.6868 28.2801L35.3087 29.2176C35.454 29.302 35.6181 29.3441 35.7774 29.3441C36.1009 29.3441 36.4149 29.1754 36.5884 28.8754C36.8462 28.4207 36.6962 27.8488 36.2462 27.591ZM27.9774 29.2645C25.0149 29.2645 22.6149 26.8645 22.6149 23.902C22.6149 20.9395 25.0149 18.5395 27.9774 18.5395C30.9399 18.5395 33.3399 20.9395 33.3399 23.902C33.3399 26.8645 30.9399 29.2645 27.9774 29.2645Z"
      fill="#221F2E"
    ></path>
    <path
      d="M27.9531 27.7637C25.8203 27.7637 24.0859 26.0293 24.0859 23.8965C24.0859 21.7637 25.8203 20.0293 27.9531 20.0293C30.0859 20.0293 31.8203 21.7637 31.8203 23.8965C31.8203 26.0293 30.0813 27.7637 27.9531 27.7637ZM27.9531 21.909C26.8563 21.909 25.9609 22.7996 25.9609 23.9012C25.9609 24.998 26.8516 25.8934 27.9531 25.8934C29.0547 25.8934 29.9453 25.0027 29.9453 23.9012C29.9406 22.7996 29.05 21.909 27.9531 21.909Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType12"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 43 39"
    fill="none"
  >
    <path
      opacity="0.4"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.7953 28.0008V11.2008C42.7953 5.50158 39.3217 1.52876 33.9553 0.904761C33.4561 0.821561 32.9361 0.800781 32.3953 0.800781H11.5953C11.0129 0.800781 10.4513 0.842381 9.91051 0.925581C4.60651 1.59118 1.19531 5.54318 1.19531 11.2008V13.951C2.85213 11.8076 5.63808 10.4008 8.7957 10.4008C11.3434 10.4008 13.6363 11.308 15.3065 12.7768C16.9625 14.26 17.9957 16.2902 17.9957 18.5366V25.7366V31.0647C17.9957 34.2959 15.8653 37.0877 12.7787 38.4008H32.3953C38.6353 38.4008 42.7953 34.2408 42.7953 28.0008Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M16.3984 26.4004V30.5159C16.3984 33.9863 12.8169 36.8004 8.39844 36.8004C3.97998 36.8004 0.398438 33.9863 0.398438 30.5159V26.4004C0.398438 29.8708 3.97998 32.3512 8.39844 32.3512C12.8169 32.3512 16.3984 29.8708 16.3984 26.4004Z"
      fill="var(--main-color)"
    ></path>
    <path
      opacity="0.4"
      d="M16.3984 19.2012V25.3847C16.3984 29.2433 12.8169 32.0012 8.39844 32.0012C3.97998 32.0012 0.398438 29.2433 0.398438 25.3847V19.2012C0.398438 20.3266 0.70613 21.3654 1.24767 22.2559C2.56459 24.4325 5.27228 25.8176 8.39844 25.8176C11.5246 25.8176 14.2323 24.4325 15.5492 22.2559C16.0907 21.3654 16.3984 20.3266 16.3984 19.2012Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M16.3984 19.7862C16.3984 20.9113 16.0907 21.9499 15.5492 22.8401C14.2323 25.0161 11.5246 26.4008 8.39844 26.4008C5.27228 26.4008 2.56459 25.0161 1.24767 22.8401C0.70613 21.9499 0.398438 20.9113 0.398438 19.7862C0.398438 15.9288 3.97998 12.8008 8.39844 12.8008C10.6138 12.8008 12.6077 13.5797 14.06 14.8408C15.5 16.1142 16.3984 17.8575 16.3984 19.7862Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M42.7953 14.4004H34.6353C31.6433 14.4004 29.1953 16.7404 29.1953 19.6004C29.1953 22.4604 31.6433 24.8004 34.6353 24.8004H42.7953"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType2"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="ICON">
      <path
        id="Vector"
        opacity="0.4"
        d="M44 18V32.92C44 37.5 40.28 41.2 35.7 41.2H12.3C7.72 41.2 4 37.5 4 32.92V18H44Z"
        fill="#5CA6FF"
      ></path>
      <path
        id="Vector_2"
        d="M44 15.0759V17.9959H4V15.0759C4 10.4959 7.72 6.7959 12.3 6.7959H35.7C40.28 6.7959 44 10.4959 44 15.0759ZM16 34.4999H12C11.18 34.4999 10.5 33.8199 10.5 32.9999C10.5 32.1799 11.18 31.4999 12 31.4999H16C16.82 31.4999 17.5 32.1799 17.5 32.9999C17.5 33.8199 16.82 34.4999 16 34.4999ZM29 34.4999H21C20.18 34.4999 19.5 33.8199 19.5 32.9999C19.5 32.1799 20.18 31.4999 21 31.4999H29C29.82 31.4999 30.5 32.1799 30.5 32.9999C30.5 33.8199 29.82 34.4999 29 34.4999Z"
        fill="#5CA6FF"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-weeklyType3"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="none"
  >
    <mask
      id="mask0_6140_40993"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="36"
      height="36"
    >
      <circle cx="18" cy="18" r="18" fill="#D9D9D9"></circle>
    </mask>
    <g mask="url(#mask0_6140_40993)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.4705 6.99197C11.2079 8.0478 7.80195 7.39064 5.22541 5.51765C2.65115 8.15702 0.943046 11.5424 0.351307 15.184C3.24189 16.2447 5.63314 18.5757 6.65472 21.7324C7.6762 24.8888 7.10417 28.1786 5.38322 30.7317C8.31981 33.6583 12.2092 35.4967 16.3564 35.8918C17.627 33.7355 19.661 32.0177 22.2295 31.1865C24.8181 30.3488 27.4945 30.5589 29.7997 31.5825C32.9641 28.833 35.0645 25.0476 35.7397 20.9331C33.0138 19.7686 30.7873 17.4755 29.8028 14.4338C28.7996 11.3337 29.2977 8.10784 30.8953 5.54284C28.2573 2.83606 24.8169 1.02579 21.0991 0.380288C20.1085 3.40788 17.7332 5.93614 14.4705 6.99197ZM22.0728 29.9093C27.8105 28.0525 30.9566 21.8958 29.0998 16.158C27.243 10.4202 21.0863 7.27415 15.3485 9.13101C9.61072 10.9879 6.46464 17.1445 8.3215 22.8823C10.1784 28.62 16.335 31.7661 22.0728 29.9093Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M21.0008 23.6018C20.7496 23.841 20.425 24.0249 20.0271 24.1538C19.6331 24.2812 19.2622 24.3223 18.9146 24.2768C18.5659 24.2276 18.2672 24.1024 18.0184 23.9012C17.7686 23.6961 17.5893 23.4254 17.4805 23.0894C17.3692 22.7456 17.3561 22.4148 17.441 22.0971C17.5286 21.7743 17.6987 21.4887 17.9513 21.2406C18.2026 20.9885 18.5195 20.8006 18.9019 20.6768C19.2882 20.5518 19.6551 20.5184 20.0026 20.5767C20.3488 20.6311 20.652 20.7635 20.9122 20.9737C21.171 21.1801 21.3561 21.4554 21.4674 21.7992C21.5761 22.1352 21.5874 22.4602 21.5012 22.774C21.4176 23.0828 21.2508 23.3587 21.0008 23.6018Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M19.1322 18.3616C18.9171 18.5807 18.6434 18.7439 18.3113 18.8514C17.979 18.959 17.6616 18.987 17.359 18.9356C17.0564 18.8841 16.7929 18.7623 16.5686 18.5703C16.3443 18.3784 16.1815 18.1259 16.0802 17.8129C15.9802 17.5039 15.9642 17.2103 16.0321 16.9322C16.1026 16.6491 16.2461 16.3999 16.4624 16.1849C16.6775 15.9659 16.953 15.802 17.2892 15.6932C17.6291 15.5832 17.9485 15.5546 18.2472 15.6073C18.5447 15.6561 18.805 15.7745 19.0281 15.9627C19.2499 16.147 19.4108 16.3937 19.5108 16.7027C19.612 17.0157 19.6281 17.3157 19.5588 17.6027C19.4895 17.8897 19.3473 18.1427 19.1322 18.3616Z"
        fill="var(--main-color)"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.4489 27.9791C26.1208 26.4673 28.6824 21.4544 27.1705 16.7825C25.6586 12.1106 20.6457 9.54899 15.9739 11.0608C11.302 12.5727 8.74029 17.5857 10.2522 22.2575C11.7641 26.9294 16.777 29.4911 21.4489 27.9791ZM18.1012 26.3326C18.8904 26.3974 19.7311 26.2853 20.6234 25.9965C21.5159 25.7077 22.261 25.3066 22.8588 24.793C23.4591 24.2743 23.8745 23.6982 24.1047 23.0647C24.335 22.431 24.3483 21.793 24.1446 21.1504C23.9807 20.6571 23.716 20.2413 23.3504 19.903C22.9874 19.5596 22.5665 19.3138 22.0875 19.1658C21.6112 19.0126 21.123 18.9743 20.6227 19.0509L20.5965 18.9697C21.1772 18.6409 21.5878 18.1688 21.8282 17.5532C22.0686 16.9377 22.085 16.3029 21.8776 15.6487C21.6762 15.0396 21.3183 14.5536 20.8041 14.1909C20.2885 13.8242 19.6709 13.6037 18.9512 13.5294C18.2353 13.4537 17.4775 13.5453 16.6778 13.8041C15.8781 14.0629 15.2084 14.4332 14.6687 14.9152C14.1316 15.392 13.7617 15.9301 13.5586 16.5292C13.3543 17.1245 13.3516 17.7293 13.5504 18.3435C13.7605 18.9926 14.1419 19.4986 14.6947 19.8617C15.2463 20.221 15.8595 20.3619 16.5343 20.2843L16.5605 20.3655C16.1026 20.599 15.7237 20.918 15.4235 21.3224C15.1221 21.723 14.9249 22.1688 14.8319 22.6597C14.7417 23.1456 14.7766 23.6358 14.9366 24.1303C15.1441 24.7716 15.5268 25.2815 16.0846 25.66C16.6425 26.0386 17.3146 26.2628 18.1012 26.3326Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M-11.2738 27.5341C-9.83367 31.9843 -5.05872 34.4243 -0.608648 32.9841C3.8414 31.5441 6.28144 26.7691 4.84137 22.319C3.4012 17.869 -1.37371 15.4289 -5.82378 16.869C-10.2739 18.3092 -12.7139 23.0841 -11.2738 27.5341Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M8.65058 -10.9937C4.33058 -9.59569 2.01311 -4.80197 3.47439 -0.286625C4.93556 4.22873 9.62217 6.75579 13.9422 5.35774C18.2622 3.95969 20.5796 -0.834025 19.1185 -5.34935C17.6572 -9.86467 12.9706 -12.3917 8.65058 -10.9937Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M28.1591 49.51C23.4706 51.0272 18.4777 48.5736 17.0072 44.0295C15.5368 39.4855 18.1454 34.5719 22.8339 33.0546C27.5223 31.5373 32.5152 33.991 33.9857 38.535C35.4562 43.079 32.8476 47.9928 28.1591 49.51Z"
        fill="var(--main-color)"
      ></path>
      <path
        d="M48.1353 8.50113C49.6056 13.0444 47.1145 17.9194 42.5712 19.3896C38.028 20.8598 33.1531 18.3687 31.6829 13.8255C30.2125 9.28225 32.7036 4.40735 37.2469 2.93712C41.7902 1.46678 46.6651 3.9579 48.1353 8.50113Z"
        fill="var(--main-color)"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-weeklyType4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 28"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M44.3345 2.47059C44.3345 2.57115 44.3284 2.67032 44.3166 2.76773C45.1351 3.5954 45.7981 4.81163 46.551 6.86283C47.3071 8.92275 47.4185 11.2382 47.3249 13.112C47.4636 13.6175 47.5791 14.1858 47.6596 14.8235V16.4706V18.1176C47.6596 21.1373 45.997 23.0588 45.997 23.0588C45.997 23.0588 45.178 23.8702 44.3529 24.1507C43.2807 27.1286 41.7029 28 41.0047 28H32.4196C32.4196 28 34.3592 26.6275 34.3592 16.4706C34.3592 6.31373 32.1425 4.94118 32.1425 4.94118H41.0047C41.7436 4.94116 43.4678 5.9172 44.5351 9.33333H44.8887C44.8887 9.33333 45.1166 9.44625 45.4446 9.74449C45.0423 8.04228 43.024 5.39015 42.1176 4.94115L42.112 4.93551L42.1045 4.92751C42.0178 4.93655 41.9298 4.94118 41.8407 4.94118C40.4634 4.94118 39.3469 3.83506 39.3469 2.47059C39.3469 1.10612 40.4634 0 41.8407 0C43.218 0 44.3345 1.10612 44.3345 2.47059ZM3.19266 24.1086C2.40779 23.7971 1.66254 23.0588 1.66254 23.0588C1.66254 23.0588 0 21.1373 0 18.1176V16.4706V14.8235C0.554181 10.4314 2.77091 9.33333 2.77091 9.33333H3.1877C3.72876 7.67702 4.54266 6.24839 5.73962 5.4199C6.2972 5.03397 6.97712 4.94118 7.6573 4.94118H15.7942C15.7942 4.94118 13.3003 5.61029 13.3003 16.4706C13.3003 27.3309 15.5171 28 15.5171 28H7.65711C6.97693 28 6.30146 27.9043 5.72691 27.5436C4.54065 26.799 3.73188 25.6083 3.19266 24.1086ZM14.1316 16.4706C14.1316 6.03922 16.3483 4.94118 16.3483 4.94118H31.4844C31.4844 4.94118 33.7011 6.03922 33.7011 16.4706C33.7011 26.902 31.5883 28 31.5883 28H16.0713C16.0713 28 14.1316 26.902 14.1316 16.4706ZM16.6658 8.80903C16.9429 8.53452 18.4295 8.87954 19.1595 9.35812C19.2651 9.42735 19.4042 9.32089 19.6288 9.1489C19.997 8.86693 20.5952 8.40882 21.6533 8.26001C22.4623 8.14623 23.9874 8.44527 25.3594 8.71431C26.3399 8.90656 27.2422 9.0835 27.7493 9.08354C28.9129 9.08364 29.758 8.77365 30.2448 8.53435C30.6653 8.32764 30.9773 9.29816 31.234 10.0966L31.2341 10.0967L31.2341 10.0968C31.2745 10.2226 31.3136 10.3441 31.3515 10.4561C31.5467 11.0326 31.3319 11.4747 31.091 11.9706C30.9879 12.183 30.8799 12.4053 30.7973 12.6522C30.613 13.203 30.1752 13.9704 29.789 14.6474L29.7889 14.6474L29.7888 14.6476C29.5978 14.9824 29.4195 15.295 29.2906 15.5484C29.2026 15.7216 29.1039 15.9059 28.9999 16.1003L28.9999 16.1003C28.5289 16.9802 27.9487 18.0643 27.7493 19.2404L27.7379 19.3079C27.5295 20.536 27.3821 21.4051 27.6211 23.7554C27.6211 23.8537 27.6236 23.9412 27.6259 24.0181C27.6346 24.3158 27.6387 24.456 27.4722 24.4561C26.4988 24.4567 22.2316 24.4577 20.4469 24.4561C20.2909 24.4559 20.2772 24.0312 20.2706 23.8259L20.2695 23.7923C20.269 23.7783 20.2685 23.7659 20.2679 23.7554C19.9924 18.6912 24.1488 14.5736 26.9181 12.9267C27.4493 12.6108 27.1952 12.6522 27.1952 12.6522C27.1952 12.6522 25.5326 13.4757 24.4242 13.4757C23.5301 13.4757 22.6857 13.1532 21.9679 12.8791C21.3511 12.6435 20.8278 12.4436 20.4469 12.5149C19.7137 12.6522 19.7137 13.4757 19.9908 13.7502C20.0966 13.8551 20.1882 13.9411 20.2664 14.0147C20.3929 14.1336 20.4844 14.2197 20.545 14.2992C20.6869 14.4856 20.1979 15.2068 19.7137 15.3973C19.2295 15.5877 17.4985 15.9463 16.9428 14.8482C16.3171 13.3992 16.7617 12.3209 17.0179 11.6997C17.1014 11.4971 17.1649 11.3431 17.1647 11.2407C17.1645 11.1684 17.1844 11.0557 17.2078 10.9226C17.2628 10.6105 17.3375 10.1863 17.2207 9.90707C17.0687 9.45625 16.8728 9.21365 16.7507 9.06248C16.6497 8.93749 16.5993 8.87501 16.6658 8.80903ZM37.3923 12.6867C37.0097 12.4275 36.2306 12.2407 36.0854 12.3894C36.0505 12.4251 36.0769 12.4589 36.1298 12.5266C36.1938 12.6085 36.2965 12.7398 36.3762 12.984C36.4374 13.1352 36.3982 13.3649 36.3694 13.5339C36.3571 13.606 36.3467 13.667 36.3468 13.7062C36.3469 13.7616 36.3136 13.845 36.2699 13.9547C36.1356 14.2911 35.9026 14.875 36.2305 15.6597C36.5218 16.2543 37.429 16.0601 37.6828 15.957C37.9366 15.8538 38.1928 15.4633 38.1184 15.3624C38.0867 15.3193 38.0387 15.2727 37.9724 15.2083L37.9724 15.2083L37.9723 15.2081C37.9313 15.1683 37.8834 15.1218 37.828 15.0651C37.6828 14.9164 37.6828 14.4705 38.0671 14.3961C38.2667 14.3575 38.5409 14.4658 38.8642 14.5933C39.2404 14.7418 39.683 14.9164 40.1516 14.9164C40.7325 14.9164 41.6038 14.4705 41.6038 14.4705C41.6038 14.4705 41.737 14.448 41.4586 14.6191C40.0072 15.5109 37.8289 17.7407 37.9732 20.483C37.9737 20.4929 37.9741 20.5059 37.9746 20.5212C37.9781 20.6324 37.9853 20.8624 38.0671 20.8625C39.0024 20.8633 41.2389 20.8628 41.749 20.8625C41.8363 20.8624 41.8341 20.7865 41.8296 20.6253C41.8284 20.5836 41.8271 20.5363 41.8271 20.483C41.7018 19.2103 41.7791 18.7397 41.8883 18.0746L41.8943 18.0381C41.9987 17.4012 42.3029 16.8141 42.5497 16.3377L42.5498 16.3375C42.6043 16.2323 42.656 16.1325 42.7021 16.0388C42.7696 15.9016 42.8631 15.7322 42.9633 15.5509C43.1657 15.1843 43.3951 14.7688 43.4917 14.4705C43.535 14.3368 43.5916 14.2164 43.6457 14.1014C43.7719 13.8329 43.8845 13.5934 43.7822 13.2813C43.7623 13.2206 43.7418 13.1548 43.7207 13.0867L43.7206 13.0866C43.5861 12.6542 43.4225 12.1287 43.2021 12.2406C42.947 12.3702 42.5041 12.5381 41.8943 12.538C41.6285 12.538 41.1556 12.4422 40.6417 12.3381C39.9226 12.1924 39.1233 12.0304 38.6993 12.0921C38.1448 12.1726 37.8312 12.4207 37.6383 12.5734C37.5205 12.6665 37.4477 12.7242 37.3923 12.6867ZM3.9429 12.3891C4.08813 12.2405 4.86726 12.4273 5.24985 12.6865C5.30519 12.724 5.37806 12.6663 5.49577 12.5732C5.68877 12.4205 6.00231 12.1724 6.55686 12.0918C6.98086 12.0302 7.78014 12.1922 8.49924 12.3378C9.01309 12.442 9.48601 12.5378 9.75179 12.5378C10.3616 12.5378 10.8045 12.37 11.0597 12.2404C11.2801 12.1285 11.4436 12.654 11.5781 13.0864C11.5993 13.1545 11.6198 13.2204 11.6397 13.281C11.742 13.5932 11.6294 13.8326 11.5032 14.1012C11.4491 14.2162 11.3925 14.3366 11.3493 14.4703C11.2527 14.7686 11.0232 15.1841 10.8208 15.5507C10.7207 15.732 10.6271 15.9014 10.5596 16.0386C10.5134 16.1324 10.4617 16.2322 10.4072 16.3375C10.1604 16.8139 9.85626 17.401 9.75179 18.0379L9.7458 18.0744C9.6366 18.7394 9.55932 19.2101 9.68458 20.4828C9.68458 20.536 9.68592 20.5834 9.6871 20.6251C9.69166 20.7863 9.69381 20.8622 9.60657 20.8622C9.09638 20.8625 6.85993 20.8631 5.92459 20.8622C5.84282 20.8622 5.83563 20.6322 5.83215 20.521C5.83167 20.5057 5.83126 20.4927 5.83074 20.4828C5.68638 17.7405 7.86474 15.5107 9.31612 14.6189C9.59454 14.4478 9.46135 14.4703 9.46135 14.4703C9.46135 14.4703 8.59 14.9162 8.00911 14.9162C7.54049 14.9162 7.09793 14.7416 6.72175 14.5931C6.39846 14.4655 6.1242 14.3573 5.92459 14.3959C5.5403 14.4703 5.5403 14.9162 5.68552 15.0649C5.74099 15.1216 5.78896 15.1682 5.82994 15.2081C5.89624 15.2725 5.94421 15.3191 5.97597 15.3622C6.05037 15.4631 5.79407 15.8536 5.5403 15.9568C5.28652 16.0599 4.37932 16.2541 4.08805 15.6595C3.76014 14.8748 3.99315 14.2909 4.12739 13.9545C4.17117 13.8448 4.20444 13.7614 4.20433 13.7059C4.20426 13.6668 4.21466 13.6057 4.22695 13.5336C4.25575 13.3647 4.2949 13.1349 4.23368 12.9837C4.15404 12.7396 4.05135 12.6082 3.98735 12.5264C3.93445 12.4587 3.908 12.4249 3.9429 12.3891Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 35"
    fill="none"
  >
    <path
      d="M10.6044 1.59427C10.3396 1.03582 10.5807 0.369864 11.1427 0.10682C11.7048 -0.156224 12.3751 0.08325 12.6399 0.6417L15.6149 6.91678C15.8796 7.47523 15.6386 8.14119 15.0765 8.40423C14.5144 8.66727 13.8441 8.4278 13.5794 7.86935L10.6044 1.59427Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M24.9957 1.59427C25.2605 1.03582 25.0194 0.369864 24.4573 0.10682C23.8953 -0.156224 23.225 0.08325 22.9602 0.6417L19.9605 6.96891C19.6958 7.52736 19.9368 8.19331 20.4989 8.45635C21.061 8.7194 21.7313 8.47992 21.996 7.92147L24.9957 1.59427Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.625 6.89572C2.5184 6.89572 0 9.39782 0 12.4843V29.2501C0 32.3366 2.5184 34.8387 5.625 34.8387H30.375C33.4816 34.8387 36 32.3366 36 29.2501V12.4843C36 9.39782 33.4816 6.89572 30.375 6.89572H5.625ZM8.4375 9.13116C5.3309 9.13116 2.8125 11.6333 2.8125 14.7198V27.0147C2.8125 30.1012 5.3309 32.6033 8.4375 32.6033H27.5625C30.6691 32.6033 33.1875 30.1012 33.1875 27.0147V14.7198C33.1875 11.6333 30.6691 9.13116 27.5625 9.13116H8.4375Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8065 10.8086C7.59964 10.8086 5 13.4082 5 16.615V25.1211C5 28.3279 7.59964 30.9275 10.8065 30.9275H25.0685C28.2754 30.9275 30.875 28.3279 30.875 25.1211V16.615C30.875 13.4082 28.2754 10.8086 25.0685 10.8086H10.8065ZM21.3776 22.5791C22.8784 21.6765 22.8784 19.5008 21.3776 18.5982L17.5195 16.2782C15.9715 15.3473 14 16.4623 14 18.2686L14 22.9087C14 24.715 15.9715 25.83 17.5195 24.8991L21.3776 22.5791Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.5806 40.7597C28.5426 41.5603 26.3231 42 24.001 42C21.7102 42 19.5195 41.5721 17.5042 40.792C17.6913 40.662 17.8138 40.4454 17.8138 40.2003V33.5959L19.7803 30.9395H28.3478L30.314 33.5954V40.2003C30.314 40.4261 30.418 40.6276 30.5806 40.7597ZM31.7524 40.2503C34.6556 38.8631 37.1289 36.721 38.9182 34.0779H31.7541V40.2003C31.7541 40.2171 31.7535 40.2338 31.7524 40.2503ZM39.662 32.881C41.1105 30.3324 41.9547 27.3956 42 24.2655C41.7916 24.3842 41.5286 24.3963 41.3018 24.2744L34.8635 20.8138L31.6365 22.1216L29.4966 30.0707L31.3971 32.6379H39.1226C39.3373 32.6379 39.53 32.7319 39.662 32.881ZM41.9747 23.0012C41.7722 19.3 40.4516 15.8965 38.3447 13.1228L35.8071 19.6861L41.9747 23.0012ZM37.5377 12.1348C37.3058 12.1824 37.1021 12.3434 37.0104 12.5806L34.347 19.4692L31.1511 20.7644L24.7839 15.7471V12.5488L31.2539 8.03058C31.3927 7.93365 31.4868 7.79662 31.5316 7.64606C33.8387 8.71009 35.8824 10.2479 37.5377 12.1348ZM30.1194 7.06644L24.0712 11.29L18.1178 6.98328C19.9614 6.34608 21.9407 6 24.001 6C26.1491 6 28.2093 6.37625 30.1194 7.06644ZM16.8033 7.49658C14.47 8.51553 12.3945 10.0148 10.7017 11.8693C10.83 11.9491 10.9343 12.0699 10.9927 12.2217L13.7812 19.4693L16.9767 20.7642L23.3438 15.7471V12.5412L17.0991 8.02363C16.921 7.89482 16.8193 7.69973 16.8033 7.49658ZM9.74989 13.0018C7.6931 15.6627 6.36507 18.9155 6.06486 22.4612L12.3052 19.6434L9.74989 13.0018ZM6 24.0004C6.00007 27.1542 6.81127 30.1185 8.23638 32.6962C8.32358 32.6587 8.41968 32.6379 8.52062 32.6379H16.7308L18.6317 30.0703L16.4919 22.1218L13.2369 20.8027L6.29682 23.9364C6.20036 23.98 6.09937 24.0005 6 24.0004ZM9.08373 34.0779C10.9003 36.7612 13.4219 38.9283 16.3825 40.3132C16.3767 40.2764 16.3737 40.2387 16.3737 40.2003V34.0779H9.08373ZM28.159 29.4995L30.2154 21.8604L24.0638 17.0131L17.9128 21.86L19.9693 29.4995H28.159Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType7"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <ellipse
      cx="24"
      cy="24.005"
      rx="18"
      ry="17.8488"
      stroke="var(--main-color)"
    ></ellipse>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 41.8538C33.9411 41.8538 42 33.8626 42 24.005C42 14.1474 33.9411 6.15625 24 6.15625C14.0589 6.15625 6 14.1474 6 24.005C6 33.8626 14.0589 41.8538 24 41.8538ZM27.695 20.2582C29.1348 21.6473 30.605 23.0657 30.9686 24.2357C31.8261 26.9953 30.214 29.1047 27.5731 29.1047C26.3543 29.1047 25.5007 28.5988 24.9348 28.0538C24.8988 28.3954 24.9022 28.8583 25.0286 29.3597C25.2343 30.1757 25.8001 30.8896 26.0572 31.1446V31.6546H21.9429V31.1446C22.2001 30.8896 22.6806 30.2252 22.9715 29.3597C23.1357 28.8713 23.1601 28.383 23.1117 28.0273C22.5608 28.5822 21.7345 29.1047 20.5764 29.1047C18.107 29.1047 16.0833 27.1281 17.0437 24.2357C17.4482 23.0175 18.9112 21.6047 20.3334 20.2313C20.6173 19.9571 20.8996 19.6846 21.1715 19.4154C22.613 17.9885 23.7554 16.6492 23.9699 16.3978C23.9935 16.3701 24.0058 16.3556 24.0061 16.3556C24.0064 16.3556 24.0181 16.3694 24.0404 16.3959C24.2493 16.6429 25.3886 17.9907 26.8286 19.4154C27.1097 19.6935 27.4019 19.9754 27.695 20.2582Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M18.4797 7.06917C18.444 6.91493 18.5358 6.76114 18.6883 6.72516C19.2212 6.59948 20.5013 6.32678 22.2273 6.15328C23.9533 5.97978 25.2626 5.99219 25.81 6.00927C25.9667 6.01417 26.0878 6.14656 26.084 6.30476L25.9992 9.91235C25.9961 10.0424 25.909 10.1543 25.7839 10.185C25.3094 10.3016 24.087 10.5796 22.6941 10.7196C21.3013 10.8596 20.0475 10.8306 19.559 10.8108C19.4302 10.8055 19.3223 10.7133 19.293 10.5865L18.4797 7.06917Z"
      fill="white"
    ></path>
    <path
      d="M29.4974 40.9561C29.5324 41.1105 29.44 41.2639 29.2874 41.2993C28.754 41.423 27.4729 41.6908 25.7462 41.8577C24.0196 42.0247 22.7104 42.0073 22.163 41.9881C22.0063 41.9826 21.8858 41.8498 21.8901 41.6916L21.9889 38.0844C21.9925 37.9543 22.08 37.8428 22.2052 37.8125C22.6802 37.6977 23.9037 37.4244 25.2971 37.2897C26.6905 37.155 27.9441 37.1888 28.4325 37.2104C28.5613 37.2162 28.6689 37.3089 28.6977 37.4358L29.4974 40.9561Z"
      fill="white"
    ></path>
    <path
      d="M41.4839 28.0003C41.6328 28.0476 41.7161 28.2035 41.6691 28.3532C41.506 28.8727 41.0896 30.1027 40.3604 31.6618C39.6312 33.2209 38.9531 34.3306 38.6586 34.7896C38.5737 34.9219 38.3998 34.9595 38.2673 34.8774L35.1728 32.9594C35.0633 32.8915 35.0122 32.76 35.0498 32.6359C35.1914 32.1699 35.5735 30.9877 36.1615 29.7307C36.7494 28.4737 37.4128 27.4207 37.6801 27.0126C37.7512 26.9039 37.8856 26.8576 38.0085 26.8967L41.4839 28.0003Z"
      fill="white"
    ></path>
    <path
      d="M40.5726 17.1763C40.7119 17.1047 40.7682 16.9368 40.6967 16.7973C40.4482 16.3124 39.8299 15.1688 38.8475 13.7526C37.865 12.3364 37.009 11.3549 36.6412 10.9514C36.5353 10.8353 36.3571 10.8275 36.2399 10.9309L33.5144 13.3345C33.4176 13.4199 33.3892 13.5581 33.4471 13.6738C33.6652 14.1094 34.2418 15.2119 35.0341 16.3538C35.8263 17.4958 36.6584 18.424 36.9907 18.7817C37.079 18.8767 37.2193 18.8998 37.3343 18.8407L40.5726 17.1763Z"
      fill="white"
    ></path>
    <path
      d="M7.53066 31.2649C7.3933 31.3402 7.34138 31.5095 7.41662 31.6471C7.67806 32.1251 8.327 33.252 9.34734 34.6417C10.3677 36.0313 11.2499 36.9898 11.6284 37.3834C11.7374 37.4966 11.9158 37.4996 12.0302 37.3931L14.6897 34.9182C14.7842 34.8303 14.8089 34.6914 14.7479 34.5773C14.5182 34.1477 13.912 33.0609 13.0892 31.9402C12.2664 30.8196 11.4095 29.9138 11.0677 29.5651C10.977 29.4724 10.836 29.4531 10.7227 29.5153L7.53066 31.2649Z"
      fill="white"
    ></path>
    <path
      d="M6.40816 20.1019C6.25952 20.054 6.17679 19.8977 6.22441 19.7482C6.38965 19.2295 6.81106 18.0011 7.5467 16.445C8.28233 14.8888 8.96491 13.7819 9.26132 13.3241C9.34673 13.1921 9.52082 13.1552 9.65301 13.2379L12.7396 15.1683C12.8488 15.2366 12.8994 15.3684 12.8612 15.4922C12.7178 15.9577 12.3308 17.1384 11.7377 18.393C11.1446 19.6476 10.4769 20.6979 10.2079 21.105C10.1363 21.2133 10.0018 21.2591 9.87898 21.2195L6.40816 20.1019Z"
      fill="white"
    ></path>
    <mask
      id="mask0_6140_37956"
      style={{maskType: 'alpha'}}
      maskUnits="userSpaceOnUse"
      x="11"
      y="11"
      width="26"
      height="26"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.9978 36.7541C31.0986 36.7541 36.8549 31.0461 36.8549 24.005C36.8549 16.9638 31.0986 11.2559 23.9978 11.2559C16.897 11.2559 11.1406 16.9638 11.1406 24.005C11.1406 31.0461 16.897 36.7541 23.9978 36.7541ZM23.9978 35.7342C30.5305 35.7342 35.8263 30.4828 35.8263 24.005C35.8263 17.5271 30.5305 12.2758 23.9978 12.2758C17.465 12.2758 12.1692 17.5271 12.1692 24.005C12.1692 30.4828 17.465 35.7342 23.9978 35.7342Z"
        fill="white"
      ></path>
    </mask>
    <g mask="url(#mask0_6140_37956)">
      <path
        d="M21.4299 11.0021L24.5148 10.9336L24.5609 12.9729L21.4759 13.0415L21.4299 11.0021Z"
        fill="white"
      ></path>
      <path
        d="M28.3322 11.3949L31.1971 12.5315L30.4329 14.4254L27.568 13.2888L28.3322 11.3949Z"
        fill="white"
      ></path>
      <path
        d="M17.4308 12.2151L14.9296 14.007L16.1343 15.6604L18.6355 13.8685L17.4308 12.2151Z"
        fill="white"
      ></path>
      <path
        d="M12.3368 17.3762L11.14 20.1965L13.0361 20.9876L14.2329 18.1673L12.3368 17.3762Z"
        fill="white"
      ></path>
      <path
        d="M10.8828 23.7507L10.8828 26.8105L12.94 26.8105V23.7507L10.8828 23.7507Z"
        fill="white"
      ></path>
      <path
        d="M12.5203 30.4231L14.2092 32.9839L15.9309 31.8674L14.242 29.3066L12.5203 30.4231Z"
        fill="white"
      ></path>
      <path
        d="M16.7971 35.5881L19.6607 36.7279L20.427 34.8348L17.5634 33.6951L16.7971 35.5881Z"
        fill="white"
      ></path>
      <path
        d="M23.4828 37.2646L26.5682 37.3118L26.5999 35.2722L23.5146 35.225L23.4828 37.2646Z"
        fill="white"
      ></path>
      <path
        d="M30.5929 35.8649L33.1037 34.0863L31.9079 32.4264L29.3971 34.205L30.5929 35.8649Z"
        fill="white"
      ></path>
      <path
        d="M35.2458 31.0912L36.5971 28.3404L34.7477 27.4471L33.3964 30.1979L35.2458 31.0912Z"
        fill="white"
      ></path>
      <path
        d="M37.392 24.5156L37.3686 21.4559L35.3115 21.4714L35.335 24.5311L37.392 24.5156Z"
        fill="white"
      ></path>
      <path
        d="M35.824 17.7544L34.0818 15.2289L32.3839 16.3806L34.1261 18.9061L35.824 17.7544Z"
        fill="white"
      ></path>
    </g>
  </symbol>
  <symbol
    id="icon-weeklyType8"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      opacity="0.4"
      d="M42.1803 43C42.1803 43.56 41.7403 44 41.1803 44H6.82031C6.26031 44 5.82031 43.56 5.82031 43C5.82031 34.72 13.9803 28 24.0003 28C26.0603 28 28.0603 28.28 29.9003 28.82C28.7203 30.22 28.0003 32.04 28.0003 34C28.0003 35.5 28.4203 36.92 29.1603 38.12C29.5603 38.8 30.0803 39.42 30.6803 39.94C32.0803 41.22 33.9403 42 36.0003 42C38.2403 42 40.2603 41.08 41.7003 39.6C42.0203 40.68 42.1803 41.82 42.1803 43Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M41.94 28.66C41.1961 27.8195 40.2815 27.1475 39.2571 26.6888C38.2328 26.2301 37.1224 25.9953 36 26C34.9491 25.9987 33.9082 26.2047 32.937 26.6063C31.9658 27.0079 31.0833 27.5971 30.3402 28.3402C29.5971 29.0833 29.0079 29.9658 28.6063 30.937C28.2047 31.9082 27.9987 32.9491 28 34C28 35.5 28.42 36.92 29.16 38.12C29.56 38.8 30.08 39.42 30.68 39.94C32.08 41.22 33.94 42 36 42C38.92 42 41.46 40.44 42.84 38.12C43.26 37.44 43.58 36.66 43.76 35.86C43.92 35.26 44 34.64 44 34C44 31.96 43.22 30.08 41.94 28.66ZM39 35.46H37.5V37.02C37.5 37.84 36.82 38.52 36 38.52C35.18 38.52 34.5 37.84 34.5 37.02V35.46H33C32.18 35.46 31.5 34.78 31.5 33.96C31.5 33.14 32.18 32.46 33 32.46H34.5V31.04C34.5 30.22 35.18 29.54 36 29.54C36.82 29.54 37.5 30.22 37.5 31.04V32.46H39C39.82 32.46 40.5 33.14 40.5 33.96C40.5 34.78 39.82 35.46 39 35.46ZM24 24C26.6522 24 29.1957 22.9464 31.0711 21.0711C32.9464 19.1957 34 16.6522 34 14C34 11.3478 32.9464 8.8043 31.0711 6.92893C29.1957 5.05357 26.6522 4 24 4C21.3478 4 18.8043 5.05357 16.9289 6.92893C15.0536 8.8043 14 11.3478 14 14C14 16.6522 15.0536 19.1957 16.9289 21.0711C18.8043 22.9464 21.3478 24 24 24Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
  <symbol
    id="icon-weeklyType9"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 7H31V10C31 11.1046 31.8954 12 33 12C34.1046 12 35 11.1046 35 10V7H39C41.2091 7 43 8.79086 43 11V16H5V11C5 8.79086 6.79086 7 9 7H13V10C13 11.1046 13.8954 12 15 12C16.1046 12 17 11.1046 17 10V7ZM5 18V39C5 41.2091 6.79086 43 9 43H39C41.2091 43 43 41.2091 43 39V18H5Z"
      fill="var(--main-color)"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.6961 24.2821C33.0926 24.6666 33.1024 25.2997 32.7179 25.6961L22.0512 36.6961C21.8629 36.8904 21.6039 37 21.3333 37C21.0628 37 20.8038 36.8904 20.6154 36.6961L15.2821 31.1961C14.8976 30.7997 14.9074 30.1666 15.3039 29.7821C15.7003 29.3976 16.3334 29.4074 16.7179 29.8039L21.3333 32.5635L31.2821 24.3039C31.6666 23.9074 32.2997 23.8976 32.6961 24.2821Z"
      fill="#221F2E"
    ></path>
    <path
      d="M13.5 6C13.5 5.17157 14.1716 4.5 15 4.5C15.8284 4.5 16.5 5.17157 16.5 6V10C16.5 10.8284 15.8284 11.5 15 11.5C14.1716 11.5 13.5 10.8284 13.5 10V6Z"
      fill="var(--main-color)"
    ></path>
    <path
      d="M31.5 6C31.5 5.17157 32.1716 4.5 33 4.5C33.8284 4.5 34.5 5.17157 34.5 6V10C34.5 10.8284 33.8284 11.5 33 11.5C32.1716 11.5 31.5 10.8284 31.5 10V6Z"
      fill="var(--main-color)"
    ></path>
  </symbol>
</svg>

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
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAdVBMVEVHcEz5WkXaGxboNyv4WUTlOCv7X0nmOCvnOSzUDwznOCvhOTLaGxbZGhX5W0b////qOy7sQTL0UT7UEA3nNSnXFRH3VkLyTDrRCQjvRzf9Y0zbHBbeIxvkMCX6XEfgJx/iLCL96Of3q6X4x8TzjYXsW1HtcWqX28DLAAAAD3RSTlMA743clTDcG2vnQ/vDpLsaydEZAAAHJ0lEQVRo3rVah6KyOgwG5QhuUBwoIPv9H/G2TUdSiso5//1aOpI0XwcbPO9LhJtosd+t13eG9Xq3W0Sb0PuXCKO9cG5jvY9+/g3DZuEkMESbP49hsbt/xDr6y8T9vB8Ewv63NOHuPgO/ogkX95mYTxOt77OxjmbO1Jk1Ot/PZ77dVcCQEqRkcRfOGsYZcKeR4q6Su6zOGEy4MN0nPs5YdCcybXRffDtVf8L6iykL1+fz/83yQzgusF1Q5aIEFxmlCMnWPx85LhxnnvHWl1EBcpFdEI3WfWT5WV9kc5UZd1qhxWdLYrJ3LOH6QjxbHoqha1qOphv6HGvPdn+m10VxuJAPTX0kaLt+2nyaZZqj7ywGQN1sp1o8Jw7+BVOhYGLfHifBaZ6OcLk4j8pIq6n5qzu+BaPBDU0SuRbkyTQ8PqV7yPr6+AH1AG1kelE1x7LslO5i7Bm64xfoUEPZOR53o8lSXp+kW83xK9TbpwP2hPHJGqNqj8e/sFgTtnfZPL/mcLPkT7KHhUzAokxUaI7HWSympY4hHUg+Co41b5th6Pt+6BxjrKunpshFZAGtfZjnIMyhIOJ2xDBUuZyGZ14NI55GNgZPEHNzptxLrdKI1D5V9bmF0RHUodYqX5CB2KCTVfcum4HS1MXYRO9g0Vj32lqr6uJgVvV4wqjFSw1lySomvoSW7FltIeRcA1ay8HoVdGWMnbaRS78RCmjEN55t6TSAwmy5tt4Slk670LY5PFnsX0QlEjyQOjFtTKYKZMbqVGpQn2C+lq8RErt7b9Bj22Gkzpfi5kGUK53ybcC9A1mlbMBOWbIEj7qVSq1m4PtXxGXchVBC2pLOSTHXpF1bt+2QKD+8YVqTHkkOyLien4v3lcRLJyk5W1SKoqrUgVEPuA0eSq/FL+V3z5eEijjwNHdGXHROsW1OXLHRsEUJqzHw0Z4Z8XB0k1dovhqHu9Db8C7yqEOBl6QtOEBPDu86rsCYqRt8THHzotKRJRsvAi9gLcuIpAFejsE6HaqGBZ7G2thXQFdUkbcw3jVRbbviSK1rWGOaYfpi5K1YeLu0GAHvLUZqXUBqo+ndJKp3e2/HUlUTgUV8lBh5PSZJoS0dSVroDfwtvaWspJqCkGRFKpQstUbSSnKm6vHZSwlV34pi6W3Bh1II4JGkgoWRp9Y1v0klyEhq6QQ6DsWtJw1TjBqTaCSU5GY0iL4de0tTSbLFMrJ3IXnjHAhVNKkDHipv3zSK+VDwmfCkm8X2yOMxSbxlUhlkgrsshUKR1YhDi9MTMk84hVRwx8K5t+VCLkEseImHGLlL4Ymr7sBUivGSxKarsSpvvSWUSYK71sYYadyze0jLHC+hkmoKhqUg0fYKNRlKjBrwInLCgY+SLLbBjA7ePnagmRzKGAneTZwWOy9gZsIWi8kJdwB1ggwTJMAnrj6OlVb3IU4CLxJ5kqgUIrnP6blIeAUlCqxOB2L0xijyNkQsY0KOuzrDSmmhMjKQxDKEdOOFyQhMcyOn3DaZBr70Cr/EkQC7J1paIkBj3dRPcTR0IC7wu7vAqTlZTwWD2wGerMZtwvZgdnMH5UxEtsmC/TDX9MoGzEaTxUZL9Jnyy2/uQpCooAujx7W2O4FFkgkLljb2QDKHJ/FEt4QWOkkgOznedzTYKMnwA11tnJhO8ChuuL0gQ1q9ZZnjrUqnOyPQWqqEaKHEDkXxEJRNYBhNGNV30yoE+XllOaG+WYtf90RNRtpP+ViqB9PsxgKXiChqIKGPtw0YqNDaqkw11wxsUy9xQp+1YWDSm4oZZGRpbxrcHA+TqDJTZkX94iNQyszYANvtavbSXg+Cq8lkdVh1w5XAvA6+vYF6x9lSMZ6sdqIpHojnHW4faeqeyvBi9RMNT2ggbFW4wARaYdWuZTOCpWSyGtoAebiRt2rB6ST1PMpMVgTKk9IIEZ6sWtvekBMRAvp60JfOJIWBYjIJA5ms7jQC2N1W1vvU6DQDZLLaabvRm+HDDBJygn5Mmh3GL5/5hF1hE1EmKpg6nayG6KEIme94Wx9dr0wlkhNKVDBJSW5lrlhPOuX8UBcIU2JuAfpALv+dsjLZCbLA/WljdXWCctHJaq8TOK2mPtKsrp/xIJP1mDJbTX8K8qVJqaKsINDHreuElf/mM+CPz4xLIICk5FnJC1AjV8v6qtUqQOa//zznl7gRai2pyFWsMyY4K/1PHxr9UlmXMlHgFfqSFZlgc//j3xnhqpwGvbV4lHYfRLb65uPvGxZrspxYffdNPpjiaN5wqGEF3373j3zWxhEaA0bxwLoScn/GHwzhQTcnLBqKwkRRPcz7FyNaGQLwDo40W/mwe1D6837E4IMJcM+VX1ylkscj+NWfK8FjBg6//gfnWxo/+MvfUSFbm49YBX/+02sTrN4z/PnXK3lCiw4rN0H0b/9W8zZRcDisfLEEq9UhmPE73H8phJ3sS9dyggAAAABJRU5ErkJggg=="
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
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAdVBMVEVHcEz5WkXaGxboNyv4WUTlOCv7X0nmOCvnOSzUDwznOCvhOTLaGxbZGhX5W0b////qOy7sQTL0UT7UEA3nNSnXFRH3VkLyTDrRCQjvRzf9Y0zbHBbeIxvkMCX6XEfgJx/iLCL96Of3q6X4x8TzjYXsW1HtcWqX28DLAAAAD3RSTlMA743clTDcG2vnQ/vDpLsaydEZAAAHJ0lEQVRo3rVah6KyOgwG5QhuUBwoIPv9H/G2TUdSiso5//1aOpI0XwcbPO9LhJtosd+t13eG9Xq3W0Sb0PuXCKO9cG5jvY9+/g3DZuEkMESbP49hsbt/xDr6y8T9vB8Ewv63NOHuPgO/ogkX95mYTxOt77OxjmbO1Jk1Ot/PZ77dVcCQEqRkcRfOGsYZcKeR4q6Su6zOGEy4MN0nPs5YdCcybXRffDtVf8L6iykL1+fz/83yQzgusF1Q5aIEFxmlCMnWPx85LhxnnvHWl1EBcpFdEI3WfWT5WV9kc5UZd1qhxWdLYrJ3LOH6QjxbHoqha1qOphv6HGvPdn+m10VxuJAPTX0kaLt+2nyaZZqj7ywGQN1sp1o8Jw7+BVOhYGLfHifBaZ6OcLk4j8pIq6n5qzu+BaPBDU0SuRbkyTQ8PqV7yPr6+AH1AG1kelE1x7LslO5i7Bm64xfoUEPZOR53o8lSXp+kW83xK9TbpwP2hPHJGqNqj8e/sFgTtnfZPL/mcLPkT7KHhUzAokxUaI7HWSympY4hHUg+Co41b5th6Pt+6BxjrKunpshFZAGtfZjnIMyhIOJ2xDBUuZyGZ14NI55GNgZPEHNzptxLrdKI1D5V9bmF0RHUodYqX5CB2KCTVfcum4HS1MXYRO9g0Vj32lqr6uJgVvV4wqjFSw1lySomvoSW7FltIeRcA1ay8HoVdGWMnbaRS78RCmjEN55t6TSAwmy5tt4Slk670LY5PFnsX0QlEjyQOjFtTKYKZMbqVGpQn2C+lq8RErt7b9Bj22Gkzpfi5kGUK53ybcC9A1mlbMBOWbIEj7qVSq1m4PtXxGXchVBC2pLOSTHXpF1bt+2QKD+8YVqTHkkOyLien4v3lcRLJyk5W1SKoqrUgVEPuA0eSq/FL+V3z5eEijjwNHdGXHROsW1OXLHRsEUJqzHw0Z4Z8XB0k1dovhqHu9Db8C7yqEOBl6QtOEBPDu86rsCYqRt8THHzotKRJRsvAi9gLcuIpAFejsE6HaqGBZ7G2thXQFdUkbcw3jVRbbviSK1rWGOaYfpi5K1YeLu0GAHvLUZqXUBqo+ndJKp3e2/HUlUTgUV8lBh5PSZJoS0dSVroDfwtvaWspJqCkGRFKpQstUbSSnKm6vHZSwlV34pi6W3Bh1II4JGkgoWRp9Y1v0klyEhq6QQ6DsWtJw1TjBqTaCSU5GY0iL4de0tTSbLFMrJ3IXnjHAhVNKkDHipv3zSK+VDwmfCkm8X2yOMxSbxlUhlkgrsshUKR1YhDi9MTMk84hVRwx8K5t+VCLkEseImHGLlL4Ymr7sBUivGSxKarsSpvvSWUSYK71sYYadyze0jLHC+hkmoKhqUg0fYKNRlKjBrwInLCgY+SLLbBjA7ePnagmRzKGAneTZwWOy9gZsIWi8kJdwB1ggwTJMAnrj6OlVb3IU4CLxJ5kqgUIrnP6blIeAUlCqxOB2L0xijyNkQsY0KOuzrDSmmhMjKQxDKEdOOFyQhMcyOn3DaZBr70Cr/EkQC7J1paIkBj3dRPcTR0IC7wu7vAqTlZTwWD2wGerMZtwvZgdnMH5UxEtsmC/TDX9MoGzEaTxUZL9Jnyy2/uQpCooAujx7W2O4FFkgkLljb2QDKHJ/FEt4QWOkkgOznedzTYKMnwA11tnJhO8ChuuL0gQ1q9ZZnjrUqnOyPQWqqEaKHEDkXxEJRNYBhNGNV30yoE+XllOaG+WYtf90RNRtpP+ViqB9PsxgKXiChqIKGPtw0YqNDaqkw11wxsUy9xQp+1YWDSm4oZZGRpbxrcHA+TqDJTZkX94iNQyszYANvtavbSXg+Cq8lkdVh1w5XAvA6+vYF6x9lSMZ6sdqIpHojnHW4faeqeyvBi9RMNT2ggbFW4wARaYdWuZTOCpWSyGtoAebiRt2rB6ST1PMpMVgTKk9IIEZ6sWtvekBMRAvp60JfOJIWBYjIJA5ms7jQC2N1W1vvU6DQDZLLaabvRm+HDDBJygn5Mmh3GL5/5hF1hE1EmKpg6nayG6KEIme94Wx9dr0wlkhNKVDBJSW5lrlhPOuX8UBcIU2JuAfpALv+dsjLZCbLA/WljdXWCctHJaq8TOK2mPtKsrp/xIJP1mDJbTX8K8qVJqaKsINDHreuElf/mM+CPz4xLIICk5FnJC1AjV8v6qtUqQOa//zznl7gRai2pyFWsMyY4K/1PHxr9UlmXMlHgFfqSFZlgc//j3xnhqpwGvbV4lHYfRLb65uPvGxZrspxYffdNPpjiaN5wqGEF3373j3zWxhEaA0bxwLoScn/GHwzhQTcnLBqKwkRRPcz7FyNaGQLwDo40W/mwe1D6837E4IMJcM+VX1ylkscj+NWfK8FjBg6//gfnWxo/+MvfUSFbm49YBX/+02sTrN4z/PnXK3lCiw4rN0H0b/9W8zZRcDisfLEEq9UhmPE73H8phJ3sS9dyggAAAABJRU5ErkJggg=="
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
              className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={()=> navigate('/index')}>
                </i>
          </div>
          <div data-v-12a80a3e="" className="navbar__content-center">
            <div
              data-v-12a80a3e=""
              className="headLogo"
              style={{
                backgroundImage: `url('images/png/h5setting_20230714005938hfia.png')`
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
          <div data-v-7dd1adab="">Withdraw</div>
          <div data-v-7dd1adab="">Deposit</div>
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
      <div data-v-17d56002="" className="GameList__C-item " onClick={() => {
    navigate('/wingo');
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
      <div data-v-17d56002="" className="GameList__C-item active" onClick={() => {
    navigate('/wingo10');
  }}>
        <div data-v-17d56002="">Win Go<br />10Min</div>
      </div>
    </div>
    <div data-v-3e4c6499="" className="TimeLeft__C">
      <div data-v-3e4c6499="" className="TimeLeft__C-rule">
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
        <div data-v-3e4c6499="">{time.minute}</div>
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
      <div data-v-4aca9bd1="" className="Betting__C-mark"         style={{ display: showMark ? '' : 'none' }}
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
    <img
      className=""
      data-origin="/assets/png/icon_sevice-9f0c8455.png"
      src="/assets/png/icon_sevice-9f0c8455.png"
    />
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
              <div data-v-7f36fe93="" className="Betting__Popup-foot-s bgcolor"  onClick={handleJoin} >Total amount ₹{quantity*balance}</div>
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
{ lastBet && lastBet.result !== undefined ? (
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
