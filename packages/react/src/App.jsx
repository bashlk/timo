import Router from '@timo/common/components/Router';
import ProtectedRoute from '@timo/common/components/ProtectedRoute';
import UserContextProvider from '@timo/common/context/UserContextProvider';

import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import TopBar from '@timo/common/components/TopBar';
import Container from '@timo/common/components/Container';
import Title from '@timo/common/components/Title';

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' }
];

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
                        default:
                            pageComponent = (
                                <Container>
                                    <Title>Page not found</Title>
                                </Container>
                            );
                        }
                        return (
                            <>
                                <TopBar onIconClick={() => history.push('./')} />
                                {pageComponent}
                            </>
                        );
                    }}
                </Router>
            </UserContextProvider>
        </>
    );
};

export default App;
