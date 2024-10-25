import { setup, spawnChild, sendTo, assign, fromPromise, fromCallback } from 'xstate';
import history from 'history/browser';
import { getUser } from '@timo/common/api';
import customizeUserMachine from './customizeUser';
import loginMachine from './login';
import changePasswordMachine from './changePassword';
import profileMachine from './profile';
import entriesMachine from './entries';
import newEntryMachine from './newEntry';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const routes = {
    login: `${BASE_URL}/login`,
    entries: `${BASE_URL}/`,
    newEntry: `${BASE_URL}/new`,
    profile: `${BASE_URL}/profile`
};

const rootMachine = setup({
    actors: {
        getUser: fromPromise(getUser),
        history: fromCallback(({ sendBack, receive }) => {
            history.listen(({ location }) => {
                sendBack({
                    type: 'locationChanged',
                    location
                });
            });
            receive((event) => {
                if (event.type === 'getLocation') {
                    sendBack({
                        type: 'locationChanged',
                        location: history.location
                    });
                }
                if (event.type === 'pushLocation') {
                    history.push(event.location);
                }
                if (event.type === 'replaceLocation') {
                    history.push(event.location);
                }
            });
        }),
        customizeUser: customizeUserMachine,
        login: loginMachine,
        changePassword: changePasswordMachine,
        profile: profileMachine,
        entries: entriesMachine,
        newEntry: newEntryMachine
    },
    guards: {
        isNewEntryRoute: ({ event }) => {
            return event.location.pathname === routes.newEntry;
        },
        isProfileRoute: ({ event }) => {
            return event.location.pathname === routes.profile;
        }
    }
}).createMachine({
    entry: [
        spawnChild('history', { id: 'history' })
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
            invoke: {
                // Invoke entries here so that it doesn't reload as we navigate across routes
                src: 'entries',
                id: 'entries',
                systemId: 'entries'
            },
            initial: 'unknown',
            states: {
                'unknown': {
                    entry: [
                        sendTo('history', { type: 'getLocation' })
                    ]
                },
                'entries': {},
                'newEntry': {
                    invoke: {
                        src: 'newEntry',
                        id: 'newEntry'
                    }
                },
                'profile': {
                    invoke: [
                        {
                            src: 'profile',
                            id: 'profile'
                        },
                        {
                            src: 'customizeUser',
                            id: 'customizeUser'
                        },
                        {
                            src: 'changePassword',
                            id: 'changePassword'
                        }
                    ],
                    entry: [
                        sendTo(
                            'customizeUser',
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
                            'changePassword',
                            ({ context }) => ({
                                type: 'initialize',
                                username: context.userData.username
                            })
                        )
                    ]
                }
            },
            on: {
                'locationChanged': [
                    {
                        target: '.newEntry',
                        guard: 'isNewEntryRoute'
                    },
                    {
                        target: '.profile',
                        guard: 'isProfileRoute'
                    },
                    // Fallback to entries route if non specified or not found
                    {
                        target: '.entries'
                    }
                ],
                'pushRoute': {
                    actions: sendTo('history', ({ event }) => ({
                        type: 'pushLocation',
                        location: routes[event.route]
                    }))
                },
                'unauthenticate': {
                    target: 'unauthenticated'
                }
            }
        },
        'unauthenticated': {
            initial: 'login',
            states: {
                'login': {
                    entry: [
                        sendTo('history', {
                            type: 'replaceLocation',
                            location: routes.login
                        })
                    ],
                    invoke: {
                        src: loginMachine,
                        id: 'login'
                    }
                }
            },
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
