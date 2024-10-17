import { assign, fromPromise, setup } from 'xstate';
import { getUser, login, register, logout, updatePassword, updateUser } from '@timo/common/api';

export const USER_STATES = {
    UNKNOWN: 'unknown',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    LOGGING_IN: 'logging_in',
    LOGGING_OUT: 'logging_out',
    REGISTERING: 'registering'
};

export const USER_AUTHENTICATED_STATES = {
    IDLE: 'idle',
    CHANGING_PASSWORD: 'changing_password',
    UPDATING: 'updating'
};

export const USER_EVENTS = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    REGISTER: 'register',
    CHANGE_PASSWORD: 'change_password',
    UPDATE: 'update'
};

const userMachine = setup({
    actors: {
        getUser: fromPromise(getUser),
        login: fromPromise(async ({ input }) => login(input)),
        logout: fromPromise(logout),
        register: fromPromise(async ({ input }) => register(input)),
        changePassword: fromPromise(async ({ input }) => updatePassword(input)),
        updateUser: fromPromise(async ({ input }) => updateUser(input))
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
                        data: ({ event }) => event.data
                    })
                },
                onError: {
                    target: USER_STATES.UNAUTHENTICATED
                }
            }
        },
        [USER_STATES.AUTHENTICATED]: {
            initial: 'idle',
            states: {
                [USER_AUTHENTICATED_STATES.IDLE]: {
                    on: {
                        [USER_EVENTS.CHANGE_PASSWORD]: {
                            target: USER_AUTHENTICATED_STATES.CHANGING_PASSWORD
                        },
                        [USER_EVENTS.UPDATE]: {
                            target: USER_AUTHENTICATED_STATES.UPDATING
                        },
                        [USER_EVENTS.LOGOUT]: {
                            target: USER_STATES.LOGGING_OUT
                        }
                    }
                },
                [USER_AUTHENTICATED_STATES.CHANGING_PASSWORD]: {
                    invoke: {
                        src: 'changePassword',
                        onDone: {
                            target: USER_AUTHENTICATED_STATES.IDLE,
                            actions: assign({
                                error: null
                            })
                        },
                        onError: {
                            target: USER_AUTHENTICATED_STATES.IDLE,
                            actions: assign({
                                error: ({ event }) => ({
                                    src: USER_AUTHENTICATED_STATES.CHANGING_PASSWORD,
                                    message: event.error.message
                                })
                            })
                        }
                    }
                },
                [USER_AUTHENTICATED_STATES.UPDATING]: {
                    invoke: {
                        src: 'updateUser',
                        onDone: {
                            target: USER_AUTHENTICATED_STATES.IDLE,
                            actions: assign({
                                error: null
                            })
                        },
                        onError: {
                            target: USER_AUTHENTICATED_STATES.IDLE,
                            actions: assign({
                                error: ({ event }) => ({
                                    src: USER_AUTHENTICATED_STATES.UPDATING,
                                    message: event.error.message
                                })
                            })
                        }
                    }
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
                        data: ({ event }) => event.data,
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
                        data: ({ event }) => event.data,
                        error: null
                    })
                },
                onError: {
                    target: USER_STATES.UNAUTHENTICATED,
                    actions: assign({
                        data: null,
                        error: ({ event }) => event.error.message
                    })
                }
            }
        }
    }
});

export default userMachine;