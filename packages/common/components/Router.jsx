import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Router = ({ routes, children }) => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener('popstate', onLocationChange);
        return () => {
            window.removeEventListener('popstate', onLocationChange);
        };
    }, []);

    const currentRoute = routes.find(route => route.path === currentPath);

    if (!currentRoute) {
        return children(null);
    }

    return children(currentRoute.name);
};

Router.propTypes = {
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    children: PropTypes.func.isRequired,
  };

export default Router;