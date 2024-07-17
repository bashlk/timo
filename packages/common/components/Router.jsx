import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import history from 'history/browser';

const Router = ({ base = '', routes, children }) => {
    const [currentPath, setCurrentPath] = useState(history.location.pathname);

    useEffect(() => {
        return history.listen(({ location }) => {
            setCurrentPath(location.pathname);
        });
    }, []);

    const currentRoute = routes.find(route => `${base}${route.path}` === currentPath);

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
    children: PropTypes.func.isRequired,
    base: PropTypes.string
};

export default Router;