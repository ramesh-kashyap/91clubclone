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
import Paymentpage from './pages/wallet/PaymentPage';
import Rule from'./pages/activity/Rule';
import InvitationBonu from './pages/activity/InvitationBonu';
import Laundry from './pages/activity/Laundry';
import SuperJackpot from './pages/activity/SuperJackpot';
import RedeemGift from './pages/activity/RedeemGift';
import DailySignI from './pages/activity/DailySignI';
import Rules from './pages/activity/Rules';
import Record from './pages/activity/Record';
import Records from './pages/activity/Records';
import Superjackpot_rule from './pages/activity/Superjackpot_rule';
import SuperJackpot_star from './pages/activity/SuperJackpot_star';
import DailyTasks from './pages/activity/DailyTasks';
import LaundryRecord from './pages/activity/LaundryRecord';
import ActivityDetail from './pages/activity/ActivityDetail';
import FirstRecharge from './pages/activity/FirstRecharge';
import RebateRatio from './pages/promotion/RebateRatio';
import Server from './pages/promotion/Server';
import AddUSDT from './pages/wallet/AddUSDT';





import Receive from './pages/activity/Receive';
import Wingo3 from  './pages/bet/wingo/Wingo3';
import Wingo5 from  './pages/bet/wingo/Wingo5';
import Wingo10 from  './pages/bet/wingo/Wingo10';
import AllLotteryGames from  './pages/bet/k3/AllLotteryGames';




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
        <Route path="/wingo3" element={<PrivateRoute><Wingo3/></PrivateRoute>}/>
        <Route path="/wingo5" element={<PrivateRoute><Wingo5/></PrivateRoute>}/>
        <Route path="/wingo10" element={<PrivateRoute><Wingo10/></PrivateRoute>}/>

        <Route path="/wallet" element={<PrivateRoute><Withdraw/></PrivateRoute>}/>
        <Route path="/wallet" element={<PrivateRoute><WithdrawHistory/></PrivateRoute>}/>
        <Route path="/wallet/paymentPage" element={<PrivateRoute><Paymentpage/></PrivateRoute>}/>
        <Route path="/activity/Rule" element={<PrivateRoute><Rule/></PrivateRoute>}/>
        <Route path="/main/InvitationBonus" element={<PrivateRoute><InvitationBonu/></PrivateRoute>}/>
        <Route path="/main/Laundry" element={<PrivateRoute><Laundry/></PrivateRoute>}/>
        <Route path="/main/SuperJackpot" element={<PrivateRoute><SuperJackpot/></PrivateRoute>}/>
        <Route path="/main/RedeemGift" element={<PrivateRoute><RedeemGift/></PrivateRoute>}/>
        <Route path="/activity/DailySignIn" element={<PrivateRoute><DailySignI/></PrivateRoute>}/>
        <Route path="/activity/DailySignIn/Rules" element={<PrivateRoute><Rules/></PrivateRoute>}/>
        <Route path="/activity/DailySignIn/Record" element={<PrivateRoute><Record/></PrivateRoute>}/>
        <Route path="/main/InvitationBonus/Record" element={<PrivateRoute><Records/></PrivateRoute>}/>
        <Route path="/main/SuperJackpot/rule" element={<PrivateRoute><Superjackpot_rule/></PrivateRoute>}/>
        <Route path="/main/SuperJackpot/star" element={<PrivateRoute><SuperJackpot_star/></PrivateRoute>}/>
        <Route path="/activity/DailyTasks" element={<PrivateRoute><DailyTasks/></PrivateRoute>}/>
        <Route path="/activity/DailyTasks/Record" element={<PrivateRoute><Receive/></PrivateRoute>}/>
        <Route path="/main/Laundry/LaundryRecord" element={<PrivateRoute><LaundryRecord/></PrivateRoute>}/>
        <Route path="/activity/ActivityDetail" element={<PrivateRoute><ActivityDetail/></PrivateRoute>}/>
        <Route path="/activity/FirstRecharge" element={<PrivateRoute><FirstRecharge/></PrivateRoute>}/>
        <Route path="/promotion/RebateRatio" element={<PrivateRoute><RebateRatio/></PrivateRoute>}/>
        <Route path="/promotion/Server" element={<PrivateRoute><Server/></PrivateRoute>}/>
        <Route path="/wallet/Withdraw/AddUSDT" element={<PrivateRoute><AddUSDT/></PrivateRoute>}/>
        <Route path="/home/AllLotteryGames" element={<PrivateRoute><AllLotteryGames/></PrivateRoute>}/>










        <Route path="/AllLotteryGames/K3" element={<PrivateRoute><K3/></PrivateRoute>}/>
       
        <Route path="/wallet/deposit" element={<PrivateRoute><Deposit/></PrivateRoute>}/>
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
