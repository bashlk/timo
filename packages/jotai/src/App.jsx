import { atom } from 'jotai';
import { atomWithLocation } from 'jotai-location';
import Container from '@timo/common/components/Container';
import Title from '@timo/common/components/Title';

import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import Profile from './routes/Profile/Profile';
import TopBarWithUser from './contextualComponents/TopBarWithUser';
import ProtectedRoute from './contextualComponents/ProtectedRoute';
import Router from './components/Router';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const routes = [
    { path: '/', name: 'Entries' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/new', name: 'NewEntry' },
    { path: '/profile', name: 'Profile' }
];

const locationAtom = atomWithLocation();

const baseAwareLocationAtom = atom(
    (get) => ({
        ...get(locationAtom),
        pathname: get(locationAtom).pathname.split(BASE_URL)[1]
    }),
    (get, set, update) => {
        const updatedWithBase = { ...update, pathname: `${BASE_URL}${update.pathname}` };
        set(locationAtom, updatedWithBase);
    }
);

const App = () => (
    <Router routes={routes} locationAtom={baseAwareLocationAtom}>
        {(routeName) => {
            let pageComponent = null;
            switch (routeName) {
            case 'Login':
                pageComponent = <Login locationAtom={baseAwareLocationAtom} />;
                break;
            case 'NewEntry':
                pageComponent = (
                    <ProtectedRoute locationAtom={baseAwareLocationAtom}>
                        <NewEntry locationAtom={baseAwareLocationAtom} />
                    </ProtectedRoute>
                );
                break;
            case 'Entries':
                pageComponent = (
                    <ProtectedRoute locationAtom={baseAwareLocationAtom}>
                        <Entries locationAtom={baseAwareLocationAtom} />
                    </ProtectedRoute>
                );
                break;
            case 'Profile':
                pageComponent = (
                    <ProtectedRoute locationAtom={baseAwareLocationAtom}>
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
                    <TopBarWithUser locationAtom={baseAwareLocationAtom} />
                    {pageComponent}
                </Container>
            );
        }}
    </Router>
);

export default App;
