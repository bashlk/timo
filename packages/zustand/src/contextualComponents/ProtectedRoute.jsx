import { useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import useUserStore from '../zustand/useUserStore';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ children }) => {
    const userStatus = useUserStore((state) => state.status);

    useEffect(() => {
        if (userStatus === UserStatus.UNAUTHENTICATED) {
            history.replace(FALLBACK_ROUTE);
        }
    });

    return children;
};

ProtectedRoute.propTypes = {
    userHook: PropTypes.func,
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;