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
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' },
    { path: '/profile', name: 'Profile' }
];

const App = () => (
    <UserContextProvider>
        <Router base="/react" routes={routes}>
            {(routeName, history) => {
                let pageComponent = null;
                switch (routeName) {
                case 'Login':
                    pageComponent = <Login history={history} />;
                    break;
                case 'NewEntry':
                    pageComponent = (
                        <ProtectedRoute>
                            <NewEntry history={history} />
                        </ProtectedRoute>
                    );
                    break;
                case 'Entries':
                    pageComponent = (
                        <ProtectedRoute>
                            <Entries history={history} />
                        </ProtectedRoute>
                    );
                    break;
                case 'Profile':
                    pageComponent = (
                        <ProtectedRoute>
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
