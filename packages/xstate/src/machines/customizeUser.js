import { setup, assign, fromPromise, sendTo } from 'xstate';
import { updateUser } from '@timo/common/api';

const customizeUserMachine = setup({
    actors: {
        updateUser: fromPromise(async ({ input }) => updateUser(input))
    }
}).createMachine({
    id: 'customizeUser',
    initial: 'idle',
    context: ({ input }) => ({
        userId: input.userId,
        username: input.username,
        avatar_background: input.avatar_background,
        avatar_character: input.avatar_character,
        statusMessage: null
    }),
    states: {
        'idle': {
            on: {
                'changeAvatarCharacter': {
                    actions: assign(({ event }) => ({
                        avatar_character: event.value
                    }))
                },
                'changeAvatarBackground': {
                    actions: assign(({ event }) => ({
                        avatar_background: event.value
                    }))
                },
                'changeUsername': {
                    actions: assign(({ event }) => ({
                        username: event.value
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
                    src: 'updateUser',
                    input: ({ context }) => ({
                        id: context.userId,
                        username: context.username,
                        avatar_character: context.avatar_character,
                        avatar_background: context.avatar_background
                    }),
                    onDone: {
                        target: 'idle',
                        actions: [
                            assign({
                                statusMessage: 'Profile updated'
                            }),
                            sendTo(
                                ({ system }) => system.get('root'),
                                ({ context }) => ({
                                    type: 'updateUserData',
                                    params: {
                                        username: context.username,
                                        avatar_character: context.avatar_character,
                                        avatar_background: context.avatar_background
                                    }
                                })
                            )
                        ]
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

export default customizeUserMachine;