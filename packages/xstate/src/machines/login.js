import { setup, fromPromise, assign, sendTo } from 'xstate';
import { login, register } from '@timo/common/api';

const loginMachine = setup({
    actors: {
        login: fromPromise(async ({ input }) => login(input)),
        register: fromPromise(async ({ input }) => register(input))
    },
    actions: {
        authenticate: sendTo(
            ({ system }) => system.get('root'),
            ({ event }) => ({ type: 'authenticate', params: event.output })
        )
    }
}).createMachine({
    context: {
        statusMessage: null
    },
    initial: 'idle',
    states: {
        'idle': {
            on: {
                'login': {
                    target: 'logging-in',
                    actions: assign({
                        statusMessage: 'Logging in...'
                    })
                },
                'register': {
                    target: 'registering',
                    actions: assign({
                        statusMessage: 'Registering...'
                    })
                }
            }
        },
        'logging-in': {
            invoke: {
                src: 'login',
                input: ({ event }) => ({ username: event.username, password: event.password }),
                onDone: {
                    target: 'idle',
                    actions: { type: 'authenticate' }
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        statusMessage: ({ event }) => event.error.message
                    })
                }
            }
        },
        'registering': {
            invoke: {
                src: 'register',
                input: ({ event }) => ({ username: event.username, password: event.password }),
                onDone: {
                    target: 'idle',
                    actions: { type: 'authenticate'}
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        statusMessage: ({ event }) => event.error.message
                    })
                }
            }
        }
    }
});

export default loginMachine;