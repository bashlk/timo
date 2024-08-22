import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

const FALLBACK_ROUTE = './login';
const AUTHENTICATION_ERROR_MESSAGE = 'Authentication required';

const renderErrorFallback = ({ error }) => {
    if (error.message === AUTHENTICATION_ERROR_MESSAGE) {
        return 'Redirecting...';
    }
    return null;
};

const UserBoundary = ({ children, history }) => {
    const handleError = (error) => {
        if (error.message === AUTHENTICATION_ERROR_MESSAGE) {
            history.replace(FALLBACK_ROUTE);
        }
    };

    return (
        <ErrorBoundary
            fallbackRender={renderErrorFallback}
            onError={handleError}
        >
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
};

UserBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired
};

export default UserBoundary;
