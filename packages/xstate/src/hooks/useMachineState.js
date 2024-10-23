import { useContext } from 'react';
import { useSelector } from '@xstate/react';
import { MachineContext } from '../context/MachineContext';

const useMachineState = (systemId, selector) => {
    const machine = useContext(MachineContext);
    return useSelector(machine.system.get(systemId), selector);
};

export default useMachineState;