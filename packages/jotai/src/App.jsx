import Container from '@timo/common/components/Container';
import Title from '@timo/common/components/Title';

import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import Profile from './routes/Profile/Profile';
import TopBarWithUser from './contextualComponents/TopBarWithUser';
import ProtectedRoute from './contextualComponents/ProtectedRoute';
import Router from './components/Router';

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' },
    { path: '/profile', name: 'Profile' }
];

const App = () => (
    <Router base="/jotai" routes={routes}>
        {(routeName, locationAtom) => {
            let pageComponent = null;
            switch (routeName) {
            case 'Login':
                pageComponent = <Login locationAtom={locationAtom} />;
                break;
            case 'NewEntry':
                pageComponent = (
                    <ProtectedRoute locationAtom={locationAtom}>
                        <NewEntry locationAtom={locationAtom} />
                    </ProtectedRoute>
                );
                break;
            case 'Entries':
                pageComponent = (
                    <ProtectedRoute locationAtom={locationAtom}>
                        <Entries locationAtom={locationAtom} />
                    </ProtectedRoute>
                );
                break;
            case 'Profile':
                pageComponent = (
                    <ProtectedRoute locationAtom={locationAtom}>
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
                    <TopBarWithUser locationAtom={locationAtom} />
                    {pageComponent}
                </Container>
            );
        }}
    </Router>
);

export default App;
