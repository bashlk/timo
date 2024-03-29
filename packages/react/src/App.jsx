import Router from '@timer-app/common/components/Router';
import ProtectedRoute from '@timer-app/common/components/ProtectedRoute';
import UserContextProvider from '@timer-app/common/context/UserContextProvider';

import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import TopBar from '@timer-app/common/components/TopBar';

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' }
];

const App = () => {
    return (
        <>
            <TopBar />
            <UserContextProvider>
                <Router base="/react" routes={routes}>
                    {(routeName, history) => {
                        switch (routeName) {
                        case 'Login':
                            return <Login history={history} />;
                        case 'NewEntry':
                            return (
                                <ProtectedRoute>
                                    <NewEntry history={history} />
                                </ProtectedRoute>
                            );
                        case 'Entries':
                            return (
                                <ProtectedRoute>
                                    <Entries history={history} />
                                </ProtectedRoute>
                            );
                        default:
                            return <h1>404</h1>;
                        }
                    }}
                </Router>
            </UserContextProvider>
        </>
    );
};

export default App;
