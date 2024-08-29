import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/account/Login';
import Register from './pages/account/Register';
import Dashboard from './pages/home/Dashboard';
import Logout from './pages/account/Logout'; // Import the Logout component
import Activity from './pages/activity/Activity';
import Promotion from './pages/promotion/Promotion';
import PromotionShare from './pages/promotion/PromotionShare';
import TeamPartner from './pages/promotion/TeamPartner';
import TeamReport from './pages/promotion/TeamReport';
import Commission from './pages/promotion/Commission';
import Promotionrule from './pages/promotion/PromotionRule';
import Wallet from './pages/wallet/Wallet';
import Wingo from  './pages/bet/wingo/Wingo';
import K3 from './pages/bet/wingo/K3';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import Account from './pages/account/Account';
import Withdraw from'./pages/wallet/Withdraw';
import WithdrawHistory from'./pages/wallet/WithdrawHistory';
import Deposit from './pages/wallet/Deposit';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />        
        <Route
          path="/index"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <PrivateRoute>
              <Activity />
            </PrivateRoute>
          }
        />
        <Route path="/wallet" element={<PrivateRoute><Wallet/></PrivateRoute>}/>
        <Route path="/promotion" element={<PrivateRoute><Promotion/></PrivateRoute>}/>
        <Route path="/promotion/PromotionShare" element={<PrivateRoute><PromotionShare/></PrivateRoute>}/>
        <Route path="/promotion/TeamPartner" element={<PrivateRoute><TeamPartner/></PrivateRoute>}/>
        <Route path="/promotion/TeamReport" element={<PrivateRoute><TeamReport/></PrivateRoute>}/>
        <Route path="/promotion/MyCommission" element={<PrivateRoute><Commission/></PrivateRoute>}/>
        <Route path="/promotion/PromotionRule" element={<PrivateRoute><Promotionrule/></PrivateRoute>}/>
        <Route path="/wingo" element={<PrivateRoute><Wingo/></PrivateRoute>}/>
        <Route path="/AllLotteryGames/K3" element={<PrivateRoute><K3/></PrivateRoute>}/>
       
        <Route path="/deposit" element={<PrivateRoute><Deposit/></PrivateRoute>}/>
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/withdraw"
          element={
            <PrivateRoute>
              <Withdraw />
            </PrivateRoute>
          }
        />
          <Route
          path="/wallet/WithdrawHistory"
          element={
            <PrivateRoute>
              <WithdrawHistory/>
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
