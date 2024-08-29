import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Router = ({ routes, children }) => {
    const [currentPath, setCurrentPath] = useState(history.location.pathname);

    useEffect(() => {
        return history.listen(({ location }) => {
            setCurrentPath(location.pathname);
        });
    }, []);

    const currentRoute = routes.find(route => `${BASE_URL}${route.path}` === currentPath);

    if (!currentRoute) {
        return children(null);
    }

    return children(currentRoute.name, history);
};

Router.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    children: PropTypes.func.isRequired
};

export default Router;