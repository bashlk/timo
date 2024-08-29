import PropTypes from 'prop-types';
import { useAtomValue } from 'jotai';

const Router = ({ locationAtom, routes, children }) => {
    const location = useAtomValue(locationAtom);
    const currentRoute = routes.find(route => route.path === location.pathname);

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
    children: PropTypes.func.isRequired,
    locationAtom: PropTypes.object.isRequired
};

export default Router;