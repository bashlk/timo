import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';
import { UserContext } from '../context/UserContextProvider';

const FALLBACK_ROUTE = '/login';

const ProtectedRoute = ({ children }) => {
    const user = useContext(UserContext);

    useEffect(() => {
        if (user?.status === 'unauthenticated') {
            history.replace(FALLBACK_ROUTE);
        }
    });

    if (!user) {
        return null;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;