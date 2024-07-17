import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import Router from '@timo/common/components/Router';
import ProtectedRoute from '@timo/common/components/ProtectedRoute';
import UserContextProvider from '@timo/common/context/UserContextProvider';
import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import Profile from './routes/Profile/Profile';
import Container from '@timo/common/components/Container';
import Title from '@timo/common/components/Title';

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' },
    { path: '/profile', name: 'Profile' }
];

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <Router base="/zustand" routes={routes}>
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
                            <Container onTopBarIconClick={() => history.push('./')} onAvatarClick={() => history.push('./profile')}>
                                {pageComponent}
                            </Container>
                        );
                    }}
                </Router>
            </UserContextProvider>
        </QueryClientProvider>
    );
};

export default App;
