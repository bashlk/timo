import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import Router from '@timo/common/components/Router';
import ProtectedRoute from '@timo/common/components/ProtectedRoute';
import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import Profile from './routes/Profile/Profile';
import Container from '@timo/common/components/Container';
import Title from '@timo/common/components/Title';
import useUserStore from './zustand/useUserStore';

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' },
    { path: '/profile', name: 'Profile' }
];

const queryClient = new QueryClient();

const App = () => {
    const userData = useUserStore(state => state.data);
    return (
        <QueryClientProvider client={queryClient}>
            <Router base="/zustand" routes={routes}>
                {(routeName, history) => {
                    let pageComponent = null;
                    switch (routeName) {
                    case 'Login':
                        pageComponent = <Login history={history} />;
                        break;
                    case 'NewEntry':
                        pageComponent = (
                            <ProtectedRoute userHook={useUserStore}>
                                <NewEntry history={history} />
                            </ProtectedRoute>
                        );
                        break;
                    case 'Entries':
                        pageComponent = (
                            <ProtectedRoute userHook={useUserStore}>
                                <Entries history={history} />
                            </ProtectedRoute>
                        );
                        break;
                    case 'Profile':
                        pageComponent = (
                            <ProtectedRoute userHook={useUserStore}>
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
                        <Container
                            avatar={{
                                character: userData?.avatar_character,
                                background: userData?.avatar_background
                            }}
                            onTopBarIconClick={() => history.push('./')}
                            onAvatarClick={() => history.push('./profile')}
                        >
                            {pageComponent}
                        </Container>
                    );
                }}
            </Router>
        </QueryClientProvider>
    );
};

export default App;
