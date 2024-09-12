import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://bigdadypro.com',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

Api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Include token in request headers
  }
  return config;
}, error => {
  return Promise.reject(error);
});

Api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; // Redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);

export default Api;
