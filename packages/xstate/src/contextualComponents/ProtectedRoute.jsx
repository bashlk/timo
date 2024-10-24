import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useSystemMachineState from '../hooks/useSystemMachineState';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ history, children }) => {
    const authState = useSystemMachineState('root', (state) => state.value);

    useEffect(() => {
        if (authState === 'unauthenticated') {
            history.replace(FALLBACK_ROUTE);
        }
    });

    if (authState === 'unknown') {
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