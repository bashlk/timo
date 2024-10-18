import { assign, fromPromise, setup } from 'xstate';
import { getUser, login, register, logout } from '@timo/common/api';

export const USER_STATES = {
    UNKNOWN: 'unknown',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    REFRESHING: 'refreshing',
    LOGGING_IN: 'logging_in',
    LOGGING_OUT: 'logging_out',
    REGISTERING: 'registering'
};

export const USER_AUTHENTICATED_STATES = {
    IDLE: 'idle',
    REFRESHING: 'refreshing'
};

export const USER_EVENTS = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    REGISTER: 'register',
    REFRESH: 'refresh'
};

const userMachine = setup({
    actors: {
        getUser: fromPromise(getUser),
        login: fromPromise(async ({ input }) => login(input)),
        logout: fromPromise(logout),
        register: fromPromise(async ({ input }) => register(input))
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
                        data: ({ event }) => event.output
                    })
                },
                onError: {
                    target: USER_STATES.UNAUTHENTICATED
                }
            }
        },
        [USER_STATES.AUTHENTICATED]: {
            initial: USER_AUTHENTICATED_STATES.IDLE,
            states: {
                [USER_AUTHENTICATED_STATES.IDLE]: {
                    on: {
                        [USER_EVENTS.REFRESH]: {
                            target: USER_AUTHENTICATED_STATES.REFRESHING
                        }
                    }
                },
                [USER_AUTHENTICATED_STATES.REFRESHING]: {
                    invoke: {
                        src: 'getUser',
                        onDone: {
                            target: USER_AUTHENTICATED_STATES.IDLE,
                            actions: assign({
                                data: ({ event }) => event.output
                            })
                        },
                        onError: {
                            target: USER_AUTHENTICATED_STATES.IDLE,
                            actions: assign({
                                error: ({ event }) => ({
                                    src: USER_EVENTS.REFRESH,
                                    message: event.error.message
                                })
                            })
                        }
                    }
                }
            },
            on: {
                [USER_EVENTS.LOGOUT]: {
                    target: USER_STATES.LOGGING_OUT
                }
            }
        },
        [USER_STATES.UNAUTHENTICATED]: {
            on: {
                [USER_EVENTS.LOGIN]: {
                    target: USER_STATES.LOGGING_IN
                },
                [USER_EVENTS.REGISTER]: {
                    target: USER_STATES.REGISTERING
                }
            }
        },
        [USER_STATES.LOGGING_IN]: {
            invoke: {
                src: 'login',
                input: ({ event }) => ({ username: event.username, password: event.password }),
                onDone: {
                    target: USER_STATES.AUTHENTICATED,
                    actions: assign({
                        data: ({ event }) => event.output,
                        error: null
                    })
                },
                onError: {
                    target: USER_STATES.UNAUTHENTICATED,
                    actions: assign({
                        data: null,
                        error: ({ event }) => ({
                            src: USER_STATES.LOGGING_IN,
                            message: event.error.message
                        })
                    })
                }
            }
        },
        [USER_STATES.LOGGING_OUT]: {
            invoke: {
                src: 'logout',
                onDone: {
                    target: USER_STATES.UNAUTHENTICATED,
                    actions: assign({
                        data: null,
                        error: null
                    })
                },
                onError: {
                    target: USER_STATES.AUTHENTICATED,
                    actions: assign({
                        error: ({ event }) => ({
                            src: USER_STATES.LOGGING_OUT,
                            message: event.error.message
                        })
                    })
                }
            }
        },
        [USER_STATES.REGISTERING]: {
            invoke: {
                src: 'register',
                input: ({ event }) => ({ username: event.username, password: event.password }),
                onDone: {
                    target: USER_STATES.AUTHENTICATED,
                    actions: assign({
                        data: ({ event }) => event.output,
                        error: null
                    })
                },
                onError: {
                    target: USER_STATES.UNAUTHENTICATED,
                    actions: assign({
                        data: null,
                        error: ({ event }) => ({
                            src: USER_STATES.REGISTERING,
                            message: event.error.message
                        })
                    })
                }
            }
        }
    }
});

export default userMachine;