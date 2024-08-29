import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAtomValue, useSetAtom } from 'jotai';
import { UserStatus, userStatusAtom } from '../atoms/userAtoms';

const FALLBACK_ROUTE = '/login';

const ProtectedRoute = ({ locationAtom, children }) => {
    const status = useAtomValue(userStatusAtom);
    const setLocation = useSetAtom(locationAtom);

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
    userHook: PropTypes.func,
    children: PropTypes.node.isRequired,
    locationAtom: PropTypes.object.isRequired
};

export default ProtectedRoute;