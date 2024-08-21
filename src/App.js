import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Api from './services/Api';
import Login from './pages/account/Login';
// import Register from './pages/account/Register';
// import Dashboard from './pages/dashboard/Dashboard';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const [authenticated, setAuthenticated] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await Api.get('/api/webapi/check-auth');
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>; // or a spinner while checking auth
  }

  return authenticated ? <Element {...rest} /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
