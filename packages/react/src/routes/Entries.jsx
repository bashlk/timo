import { useEffect, useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { listEntries, updateEntry, deleteEntry } from '@timer-app/common/api';
import Tabs from '@timer-app/common/components/Tabs';
import Entry from '@timer-app/common/components/Entry';
import { TABS } from '../constants';

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
                <ul>
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
                        {entries.map((entry) => (
                            <Entry
                                key={entry.id}
                                id={entry.id}
                                description={entry.description}
                                duration={entry.duration}
                                start_time={entry.start_time}
                                end_time={entry.end_time}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </>
                </ul>
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
