import { assign, fromPromise, sendTo, setup } from 'xstate';
import { getUser, login, register, logout } from '@timo/common/api';
import { ROOT_EVENTS } from './root';

const userMachine = setup({
    actors: {
        getUser: fromPromise(getUser),
        login: fromPromise(async ({ input }) => login(input)),
        logout: fromPromise(logout),
        register: fromPromise(async ({ input }) => register(input))
    },
    actions: {
        authenticate: sendTo(
            ({ system }) => system.getActor('root'),
            ({ event }) => ({ type: ROOT_EVENTS.AUTHENTICATE, userData: event.userData })
        ),
        unauthenticate: sendTo(
            ({ system }) => system.getActor('root'),
            { type: ROOT_EVENTS.UNAUTHENTICATE }
        )
    }
}).createMachine({
    initial: 'idle',
    context: {
        error: {}
    },
    states: {
        'idle': {
            on: {
                'get': {
                    target: 'getting'
                },
                'login': {
                    target: 'logging-in'
                },
                'logout': {
                    target: 'logging-out'
                },
                'register': {
                    target: 'registering'
                }
            }
        },
        'getting': {
            entry: [
                assign({
                    error: ({ context }) => ({
                        ...context.error,
                        'get': null
                    })
                })
            ],
            invoke: {
                src: 'getUser',
                onDone: {
                    target: 'idle',
                    actions: {
                        type: 'authenticate',
                        userData: ({ event }) => event.output
                    }
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        error: ({ context, event }) => ({
                            ...context.error,
                            'get': event.error.message
                        })
                    })
                }
            }
        },
        'logging-in': {
            entry: [
                assign({
                    error: ({ context }) => ({
                        ...context.error,
                        'login': null
                    })
                })
            ],
            invoke: {
                src: 'login',
                input: ({ event }) => ({ username: event.username, password: event.password }),
                onDone: {
                    target: 'idle',
                    actions: {
                        type: 'authenticate',
                        userData: ({ event }) => event.output
                    }
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        error: ({ context, event }) => ({
                            ...context.error,
                            'login': event.error.message
                        })
                    })
                }
            }
        },
        'logging-out': {
            entry: [
                assign({
                    error: ({ context }) => ({
                        ...context.error,
                        'logout': null
                    })
                })
            ],
            invoke: {
                src: 'logout',
                onDone: {
                    target: 'idle',
                    actions: 'unauthenticate'
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        error: ({ context, event }) => ({
                            ...context.error,
                            'logout': event.error.message
                        })
                    })
                }
            }
        },
        'registering': {
            entry: [
                assign({
                    error: ({ context }) => ({
                        ...context.error,
                        'register': null
                    })
                })
            ],
            invoke: {
                src: 'register',
                input: ({ event }) => ({ username: event.username, password: event.password }),
                onDone: {
                    target: 'idle',
                    actions: {
                        type: 'authenticate',
                        userData: ({ event }) => event.output
                    }
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        error: ({ context, event }) => ({
                            ...context.error,
                            'register': event.error.message
                        })
                    })
                }
            }
        }
    }
});

export default userMachine;