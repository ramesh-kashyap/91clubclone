import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Api = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

Api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default Api;
