import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import PropTypes from 'prop-types';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import userStore from '../../store/userStore';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ history, children }) => {
    const user = useSnapshot(userStore);

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
    children: PropTypes.node.isRequired,
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired
};

export default ProtectedRoute;