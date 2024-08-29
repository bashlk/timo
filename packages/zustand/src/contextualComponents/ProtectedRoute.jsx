import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import useUserStore from '../zustand/useUserStore';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ history, children }) => {
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
    children: PropTypes.node.isRequired,
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired
};

export default ProtectedRoute;