import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAtomValue, useSetAtom } from 'jotai';
import { UserStatus, userStatusAtom } from '../atoms/userAtoms';
import { baseAwareLocationAtom } from '../atoms/locationAtoms';

const FALLBACK_ROUTE = '/login';

const ProtectedRoute = ({ children }) => {
    const status = useAtomValue(userStatusAtom);
    const setLocation = useSetAtom(baseAwareLocationAtom);

    useEffect(() => {
        if (status === UserStatus.UNAUTHENTICATED) {
            setLocation({
                pathname: FALLBACK_ROUTE
            });
        }
    });

    if (status === UserStatus.UNKNOWN) {
        return null;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;