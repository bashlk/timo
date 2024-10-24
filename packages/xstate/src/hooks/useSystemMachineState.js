import { useSelector } from '@xstate/react';
import useSystemMachine from './useSystemMachine';

const useSystemMachineState = (systemId, selector) => {
    const machine = useSystemMachine(systemId);
    return useSelector(machine, selector);
};

export default useSystemMachineState;