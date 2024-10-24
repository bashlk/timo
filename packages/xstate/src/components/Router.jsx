import PropTypes from 'prop-types';
import useSystemMachineState from '../hooks/useSystemMachineState';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Router = ({ routes, children }) => {
    const currentPath = useSystemMachineState('root', (state) => state.context.currentPath);
    if (!currentPath) {
        return null;
    }

    const currentRoute = routes.find(route => `${BASE_URL}${route.path}` === currentPath);
    if (!currentRoute) {
        return children(null);
    }
    return children(currentRoute.name);
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