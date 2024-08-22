import { useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';
import { useAtomValue } from 'jotai';
import userAtom, { UserStatus } from '../atoms/userAtom';

const FALLBACK_ROUTE = './login';

const ProtectedRoute = ({ children }) => {
    const user = useAtomValue(userAtom);

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