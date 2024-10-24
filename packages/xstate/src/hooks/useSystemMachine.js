import { useContext } from 'react';
import { MachineContext } from '../context/MachineContext';

const useSystemMachine = (systemId) => {
    const machine = useContext(MachineContext);
    return machine.system.get(systemId);
};

export default useSystemMachine;