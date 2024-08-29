import PropTypes from 'prop-types';
import { atom, useAtomValue } from 'jotai';
import { atomWithLocation } from 'jotai-location';

const locationAtom = atomWithLocation();

const Router = ({ base = '', routes, children }) => {
    const location = useAtomValue(locationAtom);
    const locationWithBase = atom(
        (get) => (get(locationAtom)),
        (get, set, update) => {
            const updatedWithBase = { ...update, pathname: `${base}${update.pathname}` };
            set(locationAtom, updatedWithBase);
        }
    );

    const currentRoute = routes.find(route => `${base}${route.path}` === location.pathname);

    if (!currentRoute) {
        return children(null);
    }

    return children(currentRoute.name, locationWithBase);
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