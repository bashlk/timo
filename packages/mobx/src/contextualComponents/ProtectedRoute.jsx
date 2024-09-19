import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import UserSingleton from '../store/User';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = observer(({ history, children }) => {
    const userStatus = UserSingleton.instance.status;

    useEffect(() => {
        if (userStatus === UserStatus.UNAUTHENTICATED) {
            history.replace(FALLBACK_ROUTE);
        }
    });

    if (userStatus === UserStatus.UNKNOWN) {
        return null;
    }

    return children;
});

ProtectedRoute.propTypes = {
    userHook: PropTypes.func,
    children: PropTypes.node.isRequired,
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired
};

export default ProtectedRoute;