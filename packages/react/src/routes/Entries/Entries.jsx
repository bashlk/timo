import { useEffect, useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { listEntries, updateEntry, deleteEntry } from '@timer-app/common/api';
import Tabs from '@timer-app/common/components/Tabs';
import Entry from '@timer-app/common/components/Entry';
import { TABS } from '../../constants';

const getTotalDuration = (entries) => {
    return entries.reduce((total, entry) => {
        const diff = new Date(entry.end_time) - new Date(entry.start_time);
        return total + diff;
    }, 0);
};

const getEntriesGroupedByDate = (entries) => {
    const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'medium' });
    // Entries are sorted by id which is ascending, so we need to reverse them
    return entries.toReversed().reduce((grouped, entry) => {
        const date = formatter.format(new Date(entry.start_time));
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(entry);
        return grouped;
    }, {});
};

const Entries = ({ history }) => {
    const [entries, setEntries] = useState(null);
    const [filtered, setFiltered] = useState(false);
    const formRef = createRef(null);

    useEffect(() => {
        if (entries === null) {
            listEntries().then((entries) => {
                setEntries(entries);
            });
        }
    }, [entries]);

    const handleEdit = (updatedEntry) => {
        updateEntry(updatedEntry).then(() => {
            setEntries(null);
        });
    };

    const handleDelete = (entryId) => {
        deleteEntry(entryId).then(() => {
            setEntries(null);
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const from = formData.get('from');
        const to = formData.get('to');
        listEntries({ from, to }).then((entries) => {
            setFiltered(true);
            setEntries(entries);
        });
    };

    const handleFilterReset = () => {
        formRef.current.reset();
        setFiltered(false);
        setEntries(null);
    };

    return (
        <div>
            <h1>Entries</h1>
            {entries ? (
                <>
                    <form ref={formRef} action="" onSubmit={handleFilter}>
                        <label htmlFor="from">From:</label>
                        <input type="datetime-local" name="from" />
                        <label htmlFor="to">To:</label>
                        <input type="datetime-local" name="to" />
                        <button type="submit">Filter</button>
                        {filtered && (
                            <button onClick={handleFilterReset}>Reset</button>
                        )}
                    </form>
                    {Object.entries(getEntriesGroupedByDate(entries)).map(([date, entries]) => (
                        <div key={date}>
                            <h2>{date}</h2>
                            {/* Entries are descending after being grouped, reverse them */}
                            {entries.toReversed().map((entry) => (
                                <Entry
                                    key={entry.id}
                                    id={entry.id}
                                    description={entry.description}
                                    start_time={entry.start_time}
                                    end_time={entry.end_time}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                            <div>
                                <b>Total: </b>
                                {new Date(getTotalDuration(entries)).toISOString().slice(11, 19)}
                            </div>
                        </div>
                    ))}
                    <p>
                        <b>Total: </b>
                        {new Date(getTotalDuration(entries)).toISOString().slice(11, 19)}
                    </p>
                </>
            ) : (
                <p>Loading...</p>
            )}
            <Tabs tabs={TABS} history={history} />
        </div>
    );
};

Entries.propTypes = {
    history: PropTypes.object.isRequired
};

export default Entries;
