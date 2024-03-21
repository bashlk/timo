import Router from '@timer-app/common/components/Router';
import ProtectedRoute from '@timer-app/common/components/ProtectedRoute';

import Login from './routes/Login';
import Timer from './routes/Timer';
import UserContextProvider from '@timer-app/common/context/UserContextProvider';

const routes = [
  { path: '/', name: 'Timer' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/entries', name: 'Entries' },
];

const App = () => {
  return (
    <UserContextProvider>
      <Router routes={routes}>
        {(routeName) => {
          switch (routeName) {
            case 'Login':
              return <Login />;
            case 'Timer':
              return (
                <ProtectedRoute>
                 <Timer />
                </ProtectedRoute>
              );
            default:
              return <h1>404</h1>;
          }
        }}
      </Router>
    </UserContextProvider>
  )
}

export default App
