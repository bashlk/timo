import { useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';
import { UserStatus } from '../context/UserContextProvider';
import useUser from '../hooks/useUser';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ children }) => {
    const user = useUser();

    useEffect(() => {
        if (user?.status === UserStatus.UNAUTHENTICATED) {
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