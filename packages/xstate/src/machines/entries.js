import { setup, fromPromise, assign } from 'xstate';
import { listEntries, updateEntry, deleteEntry } from '@timo/common/api';
import getDateString from '@timo/common/utils/getDateString';

const now = new Date();
const firstDateOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDateOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

const getTotalDuration = (entries) => {
    return entries.reduce((total, entry) => {
        const diff = new Date(entry.end_time) - new Date(entry.start_time);
        return total + diff;
    }, 0);
};

const getEntriesGroupedByDate = (entries) => {
    const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'medium' });
    const groupedEntries = entries
        .toReversed() // Entries are sorted by id which is ascending, so we need to reverse them
        .reduce((grouped, entry) => {
            const date = formatter.format(new Date(entry.start_time));
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(entry); // Order of object keys is not guaranteed but YOLO
            return grouped;
        }, {});
    return Object.entries(groupedEntries)
        .map(([date, dayEntries]) => [
            date,
            dayEntries.toReversed(), // Day entries are descending after being grouped, reverse them
            getTotalDuration(dayEntries)
        ]);
};

const entriesMachine = setup({
    actors: {
        getEntries: fromPromise(async ({ input }) => listEntries(input)),
        updateEntry: fromPromise(async ({ input }) => updateEntry(input)),
        deleteEntry: fromPromise(async ({ input }) => deleteEntry(input))
    }
}).createMachine({
    initial: 'loading',
    context: {
        groupedEntries: [],
        totalDuration: 0,
        statusMessage: null,
        filter: {
            startDate: getDateString(firstDateOfMonth),
            endDate: getDateString(lastDateOfMonth)
        },
        itemStatusMessage: {}
    },
    states: {
        'loading': {
            invoke: {
                src: 'getEntries',
                input: ({ context }) => ({
                    from: context.filter.startDate,
                    to: context.filter.endDate
                }),
                onDone: {
                    target: 'idle',
                    actions: assign(({ event }) => ({
                        groupedEntries: getEntriesGroupedByDate(event.output),
                        totalDuration: getTotalDuration(event.output),
                        statusMessage: event.output.length === 0 ? 'No entries found' : null
                    }))
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        statusMessage: ({ event }) => event.error.message
                    })
                }
            }
        },
        'idle': {
            on: {
                'filter': {
                    target: 'loading',
                    actions: assign(({ event }) => ({
                        filter: {
                            startDate: event.startDate,
                            endDate: event.endDate
                        }
                    }))
                },
                'refresh': {
                    target: 'loading'
                },
                'updateEntry': {
                    target: 'updating-entry'
                },
                'deleteEntry': {
                    target: 'deleting-entry'
                }
            }
        },
        'updating-entry': {
            entry: [
                assign({
                    itemStatusMessage: ({ context, event }) => ({
                        ...context.itemStatusMessage,
                        [event.id]: 'Saving...'
                    })
                })
            ],
            invoke: {
                src: 'updateEntry',
                input: ({ event }) => event.updatedEntry,
                onDone: {
                    target: 'loading',
                    actions: assign({
                        itemStatusMessage: ({ context, event }) => ({
                            ...context.itemStatusMessage,
                            [event.updatedEntry.id]: null
                        })
                    })
                },
                onError: {
                    target: 'idle',
                    actions: assign({
                        statusMessage: ({ event }) => event.error.message
                    })
                }
            }
        },
        'deleting-entry': {
            entry: [
                assign({
                    itemStatusMessage: ({ context, event }) => ({
                        ...context.itemStatusMessage,
                        [event.entryId]: 'Deleting...'
                    })
                })
            ],
            invoke: {
                src: 'deleteEntry',
                input: ({ event }) => event.entryId,
                onDone: {
                    target: 'loading',
                    actions: assign({
                        itemStatusMessage: ({ context, event }) => ({
                            ...context.itemStatusMessage,
                            [event.id]: null
                        })
                    })
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

export default entriesMachine;