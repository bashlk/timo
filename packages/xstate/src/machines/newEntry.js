import { setup, fromPromise, fromCallback, assign, sendTo } from 'xstate';
import { createEntry } from '@timo/common/api';

const newEntryMachine = setup({
    actors: {
        createEntry: fromPromise(async ({ input }) => createEntry(input)),
        timer: fromCallback(({ sendBack, receive}) => {
            const interval = setInterval(() => {
                sendBack({
                    type: 'tick'
                });
            }, 1000);
            receive((event) => {
                if (event.type === 'stop') {
                    clearInterval(interval);
                }
            });
        })
    }
}).createMachine({
    initial: 'idle',
    context: {
        timerValue: 0,
        statusMessage: null
    },
    states: {
        'idle': {
            entry: [
                assign({
                    timerValue: 0
                })
            ],
            on: {
                'start': {
                    target: 'active'
                }
            }
        },
        'active': {
            entry: [
                assign({
                    statusMessage: null
                })
            ],
            invoke: {
                src: 'timer',
                id: 'timer'
            },
            on: {
                'tick': {
                    actions: assign({
                        timerValue: ({ context }) => context.timerValue + 1
                    })
                },
                'pause': {
                    target: 'paused'
                },
                'finish': {
                    target: 'finishing'
                }
            },
            exit: [
                sendTo('timer', {
                    type: 'stop'
                })
            ]
        },
        'paused': {
            on: {
                'resume': {
                    target: 'active'
                },
                'finish': {
                    target: 'finishing'
                }
            }
        },
        'finishing': {
            entry: [
                assign({
                    statusMessage: 'Saving...'
                })
            ],
            invoke: {
                src: 'createEntry',
                input: ({ event, context }) => {
                    const endTimestamp = Math.floor(Date.now() / 1000);
                    return {
                        description: event.description,
                        start_time: `@${endTimestamp - context.timerValue}`,
                        end_time: `@${endTimestamp}`
                    };
                },
                onDone: {
                    target: 'finished'
                },
                onError: {
                    target: 'paused',
                    actions: assign({
                        statusMessage: ({ event }) => event.error.message
                    })
                }
            }
        },
        'finished': {
            entry: [
                assign({
                    statusMessage: 'Time logged successfully'
                }),
                sendTo(
                    ({ system }) => system.get('entries'),
                    {
                        type: 'refresh'
                    }
                )
            ],
            after: {
                2000: {
                    target: 'idle',
                    actions: assign({
                        statusMessage: null
                    })
                }
            }
        }
    }
});

export default newEntryMachine;