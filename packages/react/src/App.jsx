import Router from '@timer-app/common/components/Router';
import ProtectedRoute from '@timer-app/common/components/ProtectedRoute';
import UserContextProvider from '@timer-app/common/context/UserContextProvider';

import Login from './routes/Login';
import Timer from './routes/Timer';
import Entries from './routes/Entries';

const routes = [
    { path: '/', name: 'Timer' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/entries', name: 'Entries' }
];

const App = () => {
    return (
        <UserContextProvider>
            <Router routes={routes}>
                {(routeName, history) => {
                    switch (routeName) {
                    case 'Login':
                        return <Login history={history} />;
                    case 'Timer':
                        return (
                            <ProtectedRoute>
                                <Timer />
                            </ProtectedRoute>
                        );
                    case 'Entries':
                        return (
                            <ProtectedRoute>
                                <Entries />
                            </ProtectedRoute>
                        );
                    default:
                        return <h1>404</h1>;
                    }
                }}
            </Router>
        </UserContextProvider>
    );
};

export default App;
