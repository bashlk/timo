import PropTypes from 'prop-types';
import { useAtomValue } from 'jotai';
import { baseAwareLocationAtom } from '../atoms/locationAtoms';

const Router = ({ routes, children }) => {
    const location = useAtomValue(baseAwareLocationAtom);
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
    children: PropTypes.func.isRequired
};

export default Router;