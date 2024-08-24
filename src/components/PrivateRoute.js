import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Api from '../services/Api'; // Import your Axios instance
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await Api.get('/api/webapi/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
<<<<<<< HEAD
      <div className="spinner-container">
        <ThreeDots
  visible={true}
  height="80"
  width="80"
  color="#4fa94d"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
      </div>
=======
      <div className="spinner-container" style={{ position:'absolute',top:'50%' }}>
      <ThreeDots
    visible={true}
    height="80"
    width="80"
    color="#f95959"
    radius="9"
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    wrapperClass=""
    />
    </div>
>>>>>>> 358282a (ok)
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
