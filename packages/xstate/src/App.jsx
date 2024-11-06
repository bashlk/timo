import Container from '@timo/common/components/Container';

import Login from './routes/Login/Login';
import Entries from './routes/Entries/Entries';
import NewEntry from './routes/NewEntry/NewEntry';
import Profile from './routes/Profile/Profile';
import TopBarWithUser from './contextualComponents/TopBarWithUser';
import MachineContextProvider from './context/MachineContext';
import Router from './components/Router';

const App = () => (
    <MachineContextProvider>
        <Router>
            {(routeName) => {
                let pageComponent = null;
                switch (routeName) {
                case 'login':
                    pageComponent = <Login />;
                    break;
                case 'newEntry':
                    pageComponent = (
                        <NewEntry />
                    );
                    break;
                case 'entries':
                    pageComponent = (
                        <Entries />
                    );
                    break;
                case 'profile':
                    pageComponent = (
                        <Profile />
                    );
                    break;
                }
                return (
                    <Container>
                        <TopBarWithUser />
                        {pageComponent}
                    </Container>
                );
            }}
        </Router>
    </MachineContextProvider>
);

export default App;
