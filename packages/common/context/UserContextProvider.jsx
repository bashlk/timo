import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getUser } from '../api';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        status: 'unknown'
    });

    useEffect(() => {
        if (user.status === 'unknown') {
            getUser().then((remoteUser) => {
                setUser(user => ({ ...user, status: 'authenticated', ...remoteUser }));
            }).catch(() => {
                setUser(user => ({ ...user, status: 'unauthenticated' }));
            });
        }
    }, [user]);

    const clearUser = useCallback(() => {
        setUser({
            status: 'unknown'
        });
    }, []);

    const setAuthenticatedUser = useCallback((newUser) => {
        setUser(user => ({ ...user, status: 'authenticated', ...newUser }));
    }, []);

    const value = useMemo(
        () => ({ ...user, setAuthenticatedUser, clearUser }),
        [user, clearUser, setAuthenticatedUser]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default UserContextProvider;