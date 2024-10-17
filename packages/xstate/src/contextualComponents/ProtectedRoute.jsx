import { useEffect } from 'react';
import PropTypes from 'prop-types';
import UserMachineContext from '../context/UserMachineContext';
import { USER_STATES } from '../machines/userMachine';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ history, children }) => {
    const userState = UserMachineContext.useSelector((state) => state.value);

    useEffect(() => {
        if (userState === USER_STATES.UNAUTHENTICATED) {
            history.replace(FALLBACK_ROUTE);
        }
    });

    if (userState === USER_STATES.UNKNOWN) {
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