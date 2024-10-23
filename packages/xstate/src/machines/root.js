import { setup, spawnChild, sendTo } from 'xstate';
import user, { USER_EVENTS } from './user';
import customizeUser from './customizeUser';

const rootMachine = setup({
    actions: {
        getUser: sendTo(
            ({ system }) => system.getActor('user'),
            { type: USER_EVENTS.GET }
        )
    }
}).createMachine({
    systemId: 'root',
    entry: [
        spawnChild(user, { systemId: 'user' }),
        spawnChild(customizeUser, { systemId: 'customizeUser' })
    ],
    initial: 'unknown',
    states: {
        'unknown': {
            entry: 'getUser',
            on: {
                authenticate: {
                    target: 'authenticated'
                },
                unauthenticate: {
                    target: 'unauthenticated'
                }
            }
        },
        'authenticated': {
            on: {
                unauthenticate: {
                    target: 'unauthenticated'
                }
            }
        },
        'unauthenticated': {
            on: {
                authenticate: {
                    target: 'authenticated'
                }
            }
        }
    }
});

export default rootMachine;
