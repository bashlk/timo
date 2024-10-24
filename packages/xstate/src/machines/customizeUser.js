import { setup, assign, fromPromise, sendTo } from 'xstate';
import { updateUser } from '@timo/common/api';

const customizeUserMachine = setup({
    actors: {
        updateUser: fromPromise(async ({ input }) => updateUser(input))
    }
}).createMachine({
    id: 'customizeUser',
    initial: 'idle',
    context: {
        userId: null,
        username: null,
        avatar_background: null,
        avatar_character: null,
        statusMessage: null
    },
    states: {
        'idle': {
            on: {
                'initialize': {
                    actions: assign(({ event }) => ({
                        userId: event.params.userId,
                        username: event.params.username,
                        avatar_background: event.params.avatar_background,
                        avatar_character: event.params.avatar_character
                    }))
                },
                'changeAvatarCharacter': {
                    actions: assign(({ context, event }) => ({
                        ...context,
                        avatar_character: event.value
                    }))
                },
                'changeAvatarBackground': {
                    actions: assign(({ context, event }) => ({
                        ...context,
                        avatar_background: event.value
                    }))
                },
                'changeUsername': {
                    actions: assign(({ context, event }) => ({
                        ...context,
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