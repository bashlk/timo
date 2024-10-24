import { setup, assign, fromPromise } from 'xstate';
import { updatePassword } from '@timo/common/api';

const changePasswordMachine = setup({
    actors: {
        updatePassword: fromPromise(async ({ input }) => updatePassword(input))
    }
}).createMachine({
    id: 'changePassword',
    initial: 'idle',
    context: {
        username: null,
        statusMessage: null
    },
    states: {
        'idle': {
            on: {
                'initialize': {
                    actions: assign(({ event }) => ({
                        username: event.username
                    }))
                },
                'save': {
                    target: 'saving'
                }
            }
        },
        'saving': {
            entry: [
                assign({
                    statusMessage: 'Saving...'
                })
            ],
            invoke: [
                {
                    src: 'updatePassword',
                    input: ({ context, event }) => ({
                        username: context.username,
                        password: event.password,
                        newPassword: event.newPassword
                    }),
                    onDone: {
                        target: 'idle',
                        actions: assign({
                            statusMessage: 'Password updated'
                        })
                    },
                    onError: {
                        target: 'idle',
                        actions: assign({
                            statusMessage: ({ event }) => event.error.message
                        })
                    }
                }
            ]
        }
    }
});

export default changePasswordMachine;