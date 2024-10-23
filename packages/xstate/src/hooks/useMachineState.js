import { useSelector } from '@xstate/react';
import useMachine from './useMachine';

const useMachineState = (systemId, selector) => {
    const machine = useMachine(systemId);
    return useSelector(machine, selector);
};

export default useMachineState;