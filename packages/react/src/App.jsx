import PropTypes from 'prop-types';
import Router from '@timo/common/components/Router';
import ProtectedRoute from '@timo/common/components/ProtectedRoute';
import UserContextProvider from '@timo/common/context/UserContextProvider';

import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import Profile from './routes/Profile/Profile';
import Container from '@timo/common/components/Container';
import Title from '@timo/common/components/Title';
import useUser from '@timo/common/hooks/useUser';

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' },
    { path: '/profile', name: 'Profile' }
];

const ContainerWithUser = ({ history, children }) => {
    const user = useUser();
    return (
        <Container
            avatar={{
                character: user?.data?.avatar_character,
                background: user?.data?.avatar_background
            }}
            onTopBarIconClick={() => history.push('./')}
            onAvatarClick={() => history.push('./profile')}
        >
            {children}
        </Container>
    );
};

ContainerWithUser.propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node
};

const App = () => {
    return (
        <>
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
                            <ContainerWithUser history={history}>
                                {pageComponent}
                            </ContainerWithUser>
                        );
                    }}
                </Router>
            </UserContextProvider>
        </>
    );
};

export default App;
