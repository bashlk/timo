import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { listEntries, updateEntry, deleteEntry } from '@timer-app/common/api';
import Tabs from '@timer-app/common/components/Tabs';
import Entry from '@timer-app/common/components/Entry';
import { TABS } from '../constants';

const Entries = ({ history }) => {
    const [entries, setEntries] = useState(null);

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

    return (
        <div>
            <h1>Entries</h1>
            {entries ? (
                <ul>
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
