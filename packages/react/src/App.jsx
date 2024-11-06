import Router from '@timo/common/components/Router';
import UserContextProvider from '@timo/common/context/UserContextProvider';
import Container from '@timo/common/components/Container';
import Title from '@timo/common/components/Title';
import TopBarWithUser from '@timo/common/contextualComponents/TopBarWithUser';
import ProtectedRoute from '@timo/common/contextualComponents/ProtectedRoute';

import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import Profile from './routes/Profile/Profile';

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/new', name: 'NewEntry' },
    { path: '/profile', name: 'Profile' }
];

const App = () => (
    <UserContextProvider>
        <Router routes={routes}>
            {(routeName, history) => {
                let pageComponent = null;
                switch (routeName) {
                case 'Login':
                    pageComponent = <Login history={history} />;
                    break;
                case 'NewEntry':
                    pageComponent = (
                        <ProtectedRoute history={history}>
                            <NewEntry history={history} />
                        </ProtectedRoute>
                    );
                    break;
                case 'Entries':
                    pageComponent = (
                        <ProtectedRoute history={history}>
                            <Entries history={history} />
                        </ProtectedRoute>
                    );
                    break;
                case 'Profile':
                    pageComponent = (
                        <ProtectedRoute history={history}>
                            <Profile />
                        </ProtectedRoute>
                    );
                    break;
                default:
                    pageComponent = (
                        <Title>Page not found</Title>
                    );
                }
                return (
                    <Container>
                        <TopBarWithUser history={history} />
                        {pageComponent}
                    </Container>
                );
            }}
        </Router>
    </UserContextProvider>
);

export default App;
