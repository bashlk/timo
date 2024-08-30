import { atom } from 'jotai';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { listEntries, updateEntry, deleteEntry, createEntry } from '@timo/common/api';
import getDateString from '@timo/common/utils/getDateString';
import formatDuration from '@timo/common/utils/formatDuration';

const getTotalDuration = (entries) => (
    formatDuration(entries.reduce((total, entry) => {
        const diff = new Date(entry.end_time) - new Date(entry.start_time);
        return total + diff;
    }, 0))
);

const now = new Date();

const entriesStartDateAtom = atom(
    getDateString(new Date(now.getFullYear(), now.getMonth(), 1))
);

const entriesEndDateAtom = atom(
    getDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59))
);

const entriesAtom = atomWithQuery((get) => ({
    queryKey: ['entries', get(entriesStartDateAtom), get(entriesEndDateAtom)],
    queryFn: async () => {
        const from = get(entriesStartDateAtom);
        const to = get(entriesEndDateAtom);
        return await listEntries({ from, to });
    }
}));

const entriesStatusAtom = atom(
    (get) => {
        const { isLoading, isError, error, isSuccess } = get(entriesAtom);
        return { isLoading, isError, isSuccess, error };
    }
);

const entriesCountAtom = atom(
    (get) => {
        const { data } = get(entriesAtom);
        return data?.length || 0;
    }
);

const entriesGroupedByDateAtom = atom(
    (get) => {
        const { data } = get(entriesAtom);
        if (data) {
            const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'medium' });
            // Entries are sorted by id which is ascending, so we need to reverse them
            const groupedEntries = data.toReversed().reduce((grouped, entry) => {
                const date = formatter.format(new Date(entry.start_time));
                if (!grouped[date]) {
                    grouped[date] = [];
                }
                grouped[date].push(entry);
                return grouped;
            }, {});
            // Entries within a day are in descending after being grouped, reverse them
            return Object.entries(groupedEntries).reduce((grouped, [date, dayEntries]) => {
                grouped[date] = dayEntries.toReversed();
                return grouped;
            }, {});
        }
        return {};
    }
);

const entriesDurationsGroupedByDateAtom = atom(
    (get) => {
        const entries = get(entriesGroupedByDateAtom);
        if (entries) {
            return Object.entries(entries).reduce((grouped, [date, dayEntries]) => {
                grouped[date] = getTotalDuration(dayEntries);
                return grouped;
            }, {});
        }
        return [];
    }
);

const entriesDurationAtom = atom(
    (get) => {
        const { data } = get(entriesAtom);
        if (data) {
            return getTotalDuration(data);
        }
        return 0;
    }
);

const mutationSuccessHandler = (get) => () => {
    const { refetch } = get(entriesAtom);
    refetch();
};

const createEntryAtom = atomWithMutation((get) => ({
    mutationFn: createEntry,
    onSuccess: mutationSuccessHandler(get)
}));

const updateEntryAtom = atomWithMutation((get) => ({
    mutationFn: updateEntry,
    onSuccess: mutationSuccessHandler(get)
}));

const deleteEntryAtom = atomWithMutation((get) => ({
    mutationFn: deleteEntry,
    onSuccess: mutationSuccessHandler(get)
}));

export {
    entriesStartDateAtom,
    entriesEndDateAtom,
    entriesAtom,
    entriesCountAtom,
    entriesStatusAtom,
    entriesGroupedByDateAtom,
    entriesDurationsGroupedByDateAtom,
    entriesDurationAtom,
    createEntryAtom,
    updateEntryAtom,
    deleteEntryAtom
};