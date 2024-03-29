import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getUser } from '../api';

export const UserStatus = {
    UNKNOWN: 'unknown',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated'
};

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        status: UserStatus.UNKNOWN
    });

    useEffect(() => {
        if (user.status === UserStatus.UNKNOWN) {
            getUser().then((remoteUser) => {
                setUser(user => ({ ...user, status: UserStatus.AUTHENTICATED, ...remoteUser }));
            }).catch(() => {
                setUser(user => ({ ...user, status: UserStatus.UNAUTHENTICATED }));
            });
        }
    }, [user]);

    const clearUser = useCallback(() => {
        setUser({
            status: 'unknown'
        });
    }, []);

    const setAuthenticatedUser = useCallback((newUser) => {
        setUser(user => ({ ...user, status: UserStatus.AUTHENTICATED, ...newUser }));
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