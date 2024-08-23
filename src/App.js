import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/account/Login';
import Register from './pages/account/Register';
import Dashboard from './pages/home/Dashboard';
import Logout from './pages/account/Logout'; // Import the Logout component
import Activity from './pages/activity/Activity';
import Promotion from './pages/promotion/Promotion';
// import Wallet from '/pages/wallet/Wallet';
import Wingo from  './pages/bet/wingo/Wingo';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import Account from './pages/account/Account';
import Account from './pages/account/Account';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home/index"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/activity/activity"
          element={
            <PrivateRoute>
              <Activity />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} /> {/* Add the Logout route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
