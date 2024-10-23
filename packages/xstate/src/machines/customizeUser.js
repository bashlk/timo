import { setup, assign, fromPromise } from 'xstate';
import { updateUser } from '@timo/common/api';

export const CUSTOMIZE_USER_STATES = {
    IDLE: 'idle',
    SAVING: 'saving'
};

export const CUSTOMIZE_USER_EVENTS = {
    CHANGE_AVATAR_CHARACTER: 'changeAvatarCharacter',
    CHANGE_AVATAR_BACKGROUND: 'changeAvatarBackground',
    SAVE: 'save'
};

const customizeUserMachine = setup({
    actors: {
        updateUser: fromPromise(async ({ input }) => updateUser(input))
    }
}).createMachine({
    id: 'customizeUser',
    initial: CUSTOMIZE_USER_STATES.IDLE,
    context: {
        userId: null,
        avatar: {
            character: null,
            background: null
        },
        statusMessage: null
    },
    states: {
        [CUSTOMIZE_USER_STATES.IDLE]: {
            on: {
                [CUSTOMIZE_USER_EVENTS.CHANGE_AVATAR_CHARACTER]: {
                    actions: assign({
                        avatar: ({ event, context }) => ({
                            ...context.avatar,
                            character: event.character
                        })
                    })
                },
                [CUSTOMIZE_USER_EVENTS.CHANGE_AVATAR_BACKGROUND]: {
                    actions: assign({
                        avatar: ({ event, context }) => ({
                            ...context.avatar,
                            background: event.background
                        })
                    })
                },
                [CUSTOMIZE_USER_EVENTS.SAVE]: {
                    target: CUSTOMIZE_USER_STATES.SAVING
                }
            }
        },
        [CUSTOMIZE_USER_STATES.SAVING]: {
            entry: [
                assign({
                    statusMessage: 'Loading...'
                })
            ],
            invoke: [
                {
                    src: 'updateUser',
                    input: ({ event, context }) => ({
                        id: context.userId,
                        username: event.username,
                        avatar_character: event.avatarCharacter,
                        avatar_background: event.avatarBackground
                    }),
                    onDone: {
                        target: CUSTOMIZE_USER_STATES.IDLE,
                        actions: [
                            assign({
                                statusMessage: 'Profile updated'
                            })
                        ]
                    },
                    onError: {
                        target: CUSTOMIZE_USER_STATES.IDLE,
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