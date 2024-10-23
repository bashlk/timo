import PropTypes from 'prop-types';
import { createActor } from 'xstate';
import { createContext } from 'react';
import root from '../machines/root';

const rootActor = createActor(root, { systemId: 'root' });
rootActor.start();

export const MachineContext = createContext();

const MachineContextProvider = ({ children }) => {
    return (
        <MachineContext.Provider value={rootActor}>
            {children}
        </MachineContext.Provider>
    );
};

MachineContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default MachineContextProvider;