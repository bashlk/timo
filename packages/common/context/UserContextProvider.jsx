import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getUser } from '../api';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        status: 'unknown'
    });

    useEffect(() => {
        getUser().then((remoteUser) => {
            setUser(user => ({ ...user, status: 'authenticated', ...remoteUser }));
        }).catch(() => {
            setUser(user => ({ ...user, status: 'unauthenticated' }));
        });
    }, []);

    const clearUser = useCallback(() => {
        setUser(null);
    }, []);

    const value = useMemo(() => ({ ...user, clearUser }), [user, clearUser]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserContextProvider;