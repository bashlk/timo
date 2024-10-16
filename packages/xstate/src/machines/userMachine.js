import { assign, fromPromise, setup } from 'xstate';
import { getUser } from '@timo/common/api';

const USER_STATES = {
    UNKNOWN: 'unknown',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated'
};

const userMachine = setup({
    actors: {
        getUser: fromPromise(getUser)
    }
}).createMachine({
    id: 'user',
    initial: 'unknown',
    context: {
        data: null,
        error: null
    },
    states: {
        [USER_STATES.UNKNOWN]: {
            invoke: {
                src: 'getUser',
                onDone: {
                    target: USER_STATES.AUTHENTICATED,
                    actions: assign({
                        data: (_, event) => event.data
                    })
                },
                onError: {
                    target: USER_STATES.UNAUTHENTICATED,
                    actions: assign({
                        error: (_, event) => event.error
                    })
                }
            }
        },
        [USER_STATES.AUTHENTICATED]: {
            type: 'final'
        },
        [USER_STATES.UNAUTHENTICATED]: {
            type: 'final'
        }
    }
});

export default userMachine;