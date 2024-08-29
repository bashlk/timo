import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAtomValue } from 'jotai';
import { UserStatus, userStatusAtom } from '../atoms/userAtoms';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ history, children }) => {
    const status = useAtomValue(userStatusAtom);

    useEffect(() => {
        if (status === UserStatus.UNAUTHENTICATED) {
            history.replace(FALLBACK_ROUTE);
        }
    });

    if (status === UserStatus.UNKNOWN) {
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