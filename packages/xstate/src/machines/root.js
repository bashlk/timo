import { setup, spawnChild, sendTo, assign, fromPromise } from 'xstate';
import { getUser } from '@timo/common/api';
import customizeUserMachine from './customizeUser';
import loginMachine from './login';
import changePasswordMachine from './changePassword';
import profileMachine from './profile';
import entriesMachine from './entries';
import newEntriesMachine from './newEntry';

const rootMachine = setup({
    actors: {
        getUser: fromPromise(getUser)
    }
}).createMachine({
    entry: [
        spawnChild(loginMachine, { systemId: 'login' }),
        spawnChild(customizeUserMachine, { systemId: 'customizeUser' }),
        spawnChild(changePasswordMachine, { systemId: 'changePassword' }),
        spawnChild(profileMachine, { systemId: 'profile' }),
        spawnChild(entriesMachine, { systemId: 'entries' }),
        spawnChild(newEntriesMachine, { systemId: 'newEntry' })
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
            entry: [
                sendTo(
                    ({ system }) => system.get('customizeUser'),
                    ({ context }) => ({
                        type: 'initialize',
                        params: {
                            userId: context.userData.id,
                            username: context.userData.username,
                            avatar_character: context.userData.avatar_character,
                            avatar_background: context.userData.avatar_background
                        }
                    })
                ),
                sendTo(
                    ({ system }) => system.get('changePassword'),
                    ({ context }) => ({
                        type: 'initialize',
                        username: context.userData.username
                    })
                )
            ],
            on: {
                updateUserData: {
                    actions: assign({
                        userData: ({ event, context }) => ({
                            id: context.userData.id,
                            username: event.params.username,
                            avatar_character: event.params.avatar_character,
                            avatar_background: event.params.avatar_background
                        })
                    })
                },
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
                    actions: assign({
                        userData:({ event }) => ({
                            id: event.params.id,
                            username: event.params.username,
                            avatar_character: event.params.avatar_character,
                            avatar_background: event.params.avatar_background
                        })
                    })
                }
            }
        }
    }
});

export default rootMachine;
