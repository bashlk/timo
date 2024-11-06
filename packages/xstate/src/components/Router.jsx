import PropTypes from 'prop-types';
import useRootMachineState from '../hooks/useRootMachineState';

const Router = ({ children }) => {
    const state = useRootMachineState(state => state.value);
    const route = state?.authenticated || state?.unauthenticated;
    if (route && route !== 'unknown') {
        return children(route);
    }
    return null;
};

Router.propTypes = {
    children: PropTypes.func.isRequired
};

export default Router;