import PropTypes from 'prop-types';
import useRootMachine from '../hooks/useRootMachine';
import { useSelector } from '@xstate/react';

const Router = ({ children }) => {
    const rootMachine = useRootMachine();
    const state = useSelector(rootMachine, state => state.value);
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