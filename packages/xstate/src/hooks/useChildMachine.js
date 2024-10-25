import { useSelector } from '@xstate/react';
import useRootMachine from './useRootMachine';

const useChildMachine = (childId) => {
    const rootMachine = useRootMachine();
    const childMachines = useSelector(rootMachine, (state) => state.children);
    return childMachines[childId];
};

export default useChildMachine;