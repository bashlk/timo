import { logout } from '@timo/common/api';
import { fromPromise, sendTo, setup } from 'xstate';

const profileMachine = setup({
    actors: {
        logout: fromPromise(logout)
    }
}).createMachine({
    id: 'profile',
    initial: 'idle',
    states: {
        'idle': {
            on: {
                'logout': {
                    target: 'logging-out'
                }
            }
        },
        'logging-out': {
            invoke: {
                src: 'logout',
                onDone: {
                    target: 'idle',
                    actions: sendTo(
                        ({ system }) => system.get('root'),
                        { type: 'unauthenticate' }
                    )
                },
                onError: {
                    target: 'idle'
                }
            }
        }
    }
});

export default profileMachine;