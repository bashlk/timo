import { useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';
import { useAtomValue } from 'jotai';
import { UserStatus, userStatusAtom } from '../atoms/userAtoms';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ children }) => {
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
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;