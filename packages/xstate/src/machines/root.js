import { setup, spawnChild, sendTo, assign, fromPromise } from 'xstate';
import { getUser } from '@timo/common/api';
import customizeUserMachine from './customizeUser';
import loginMachine from './login';

const rootMachine = setup({
    actors: {
        getUser: fromPromise(getUser)
    },
    actions: {
        getUser: sendTo(
            ({ system }) => system.get('user'),
            { type: 'get' }
        )
    }
}).createMachine({
    entry: [
        spawnChild(loginMachine, { systemId: 'login' }),
        spawnChild(customizeUserMachine, { systemId: 'customizeUser' })
    ],
    initial: 'unknown',
    context: {
        userData: null
    },
    states: {
        'unknown': {
            invoke: {
                src: 'getUser',
                onDone: {
                    target: 'authenticated',
                    actions: assign({
                        userData: ({ event }) => ({
                            id: event.output.id,
                            username: event.output.username,
                            avatar_character: event.output.avatar_character,
                            avatar_background: event.output.avatar_background
                        })
                    })
                },
                onError: {
                    target: 'unauthenticated'
                }
            }
        },
        'authenticated': {
            on: {
                unauthenticate: {
                    target: 'unauthenticated',
                    actions: assign({
                        userData: null
                    })
                }
            }
        },
        'unauthenticated': {
            on: {
                authenticate: {
                    target: 'authenticated',
                    actions:[
                        assign({
                            userData:({ event }) => ({
                                id: event.params.id,
                                username: event.params.username,
                                avatar_character: event.params.avatar_character,
                                avatar_background: event.params.avatar_background
                            })
                        })
                    ]
                }
            }
        }
    }
});

export default rootMachine;
