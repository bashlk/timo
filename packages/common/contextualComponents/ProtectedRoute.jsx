import { useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import useUser from '@timo/common/hooks/useUser';

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
    userHook: PropTypes.func,
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;