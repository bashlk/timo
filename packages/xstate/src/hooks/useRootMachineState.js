import { useSelector } from '@xstate/react';
import useRootMachine from './useRootMachine';

const useRootMachineState = (selector) => {
    const rootMachine = useRootMachine();
    return useSelector(rootMachine, selector);
};

export default useRootMachineState;