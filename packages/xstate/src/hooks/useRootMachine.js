import { useContext } from 'react';
import { MachineContext } from '../context/MachineContext';

const useRootMachine = () => {
    return useContext(MachineContext);
};

export default useRootMachine;