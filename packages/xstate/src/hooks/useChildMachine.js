import { useSelector } from '@xstate/react';
import useRootMachine from './useRootMachine';

const useChildMachine = (childId) => {
    const rootMachine = useRootMachine();
    return useSelector(rootMachine, (state) => state.children[childId]);
};

export default useChildMachine;