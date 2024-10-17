import { createActorContext } from '@xstate/react';
import userMachine from '../machines/userMachine';

const UserMachineContext = createActorContext(userMachine);

export default UserMachineContext;