import React from 'react';
import { Routes, Route,  Navigate} from 'react-router-dom'
import Auth from './screens/Auth';
import Root from './screens/Root';
import { Suspense } from 'react';
import Loading from './components/Loading';

const SportsEvents = React.lazy(() => import('./screens/events/SportsEvents'));
const MyBets = React.lazy(() => import('./screens/events/MyBets'));

const App = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate replace to="/events" />} />
        <Route path="/" element={<Root />} >
          <Route path="events" element={<Suspense fallback={<Loading/>}><SportsEvents/></Suspense>} /> 
          <Route path="my-bets" element={<Suspense fallback={<Loading/>}><MyBets/></Suspense>} /> 
        </Route>
        <Route path="/auth/login" element={<Auth isRegistering={false} />} />
        <Route path="/auth/register" element={<Auth isRegistering={true} />} />
        <Route path="*" element={<Navigate to="/events" />} />
      </Routes>
    </div>
  );
};

export default App;
