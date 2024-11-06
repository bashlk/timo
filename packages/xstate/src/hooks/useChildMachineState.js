import { useSelector } from '@xstate/react';
import useChildMachine from './useChildMachine';

const useChildMachineState = (childId, selector) => {
    const machine = useChildMachine(childId);
    return useSelector(machine, selector);
};

export default useChildMachineState;