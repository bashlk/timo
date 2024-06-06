import { useEffect, useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { listEntries, updateEntry, deleteEntry } from '@timo/common/api';
import Entry from '@timo/common/components/Entry';
import Title from '@timo/common/components/Title';
import Input from '@timo/common/components/Input';
import Button from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import formatDuration from '@timo/common/utils/formatDuration';
import styles from './Entries.module.css';
import { ButtonVariants } from '@timo/common/components/Button/Button';

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

const getDateString = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, -8);
};

const now = new Date();
const firstDateOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDateOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

const Entries = ({ history }) => {
    const [entries, setEntries] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [entryStatusMessage, setEntryStatusMessage] = useState({ id: null, message: null });
    const formRef = createRef(null);

    const handleEdit = (updatedEntry) => {
        setEntryStatusMessage({ id: updatedEntry.id, message: 'Saving...' });
        updateEntry(updatedEntry).then(() => {
            setEntries(null);
            setEntryStatusMessage({ id: null, message: null });
        }).catch((error) => {
            setEntryStatusMessage({ id: updatedEntry.id, message: error.message });
        });
    };

    const handleDelete = (entryId) => {
        setEntryStatusMessage({ id: entryId, message: 'Deleting...' });
        deleteEntry(entryId).then(() => {
            setEntries(null);
            setEntryStatusMessage({ id: null, message: null });
        }).catch((error) => {
            setEntryStatusMessage({ id: entryId, message: error.message });
        });
    };

    const handleListEntriesResponse = (entries) => {
        setEntries(entries);
        if (entries.length === 0) {
            setStatusMessage('No entries found');
        } else {
            setStatusMessage(null);
        }
    };

    const handleListEntriesError = (error) => {
        setStatusMessage(error.message);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const from = formData.get('from');
        const to = formData.get('to');
        setStatusMessage('Loading...');
        listEntries({ from, to })
            .then(handleListEntriesResponse)
            .catch(handleListEntriesError);
    };

    const handleNewClick = () => {
        history.push('./new');
    };

    useEffect(() => {
        const formData = new FormData(formRef.current);
        const from = formData.get('from');
        const to = formData.get('to');

        if (entries === null) {
            setStatusMessage('Loading...');
            listEntries({
                from,
                to
            }).then(handleListEntriesResponse)
                .catch(handleListEntriesError);
        }
    }, [entries]);

    return (
        <>
            <Title>Time entries</Title>
            <div className={styles['body']}>
                <div className={styles['new']}>
                    <Button onClick={handleNewClick}>New entry</Button>
                </div>
                <form className={styles['filters']} ref={formRef} action="" onSubmit={handleFilter}>
                    <Input label="Filter entries start time" type="datetime-local" name="from" defaultValue={getDateString(firstDateOfMonth)} />
                    <Input label="Filter entries end time" type="datetime-local" name="to" defaultValue={getDateString(lastDateOfMonth)} />
                    <Button variant={ButtonVariants.SECONDARY} type="submit">Filter</Button>
                </form>
                {statusMessage && <StatusMessage className={styles['message']} message={statusMessage} />}
                {entries?.length > 0 && (
                    <>
                        <div className={styles['total-row']}>
                            <h2 className={styles['total-label']}>Total</h2>
                            <div>{formatDuration(getTotalDuration(entries))}</div>
                        </div>
                        {Object.entries(getEntriesGroupedByDate(entries)).map(([date, dayEntries]) => (
                            <div className={styles['day']} key={date}>
                                <div className={styles['day-header']}>
                                    <h2 className={styles['day-name']}>{date}</h2>
                                    <div>{formatDuration(getTotalDuration(dayEntries))}</div>
                                </div>
                                {/* Entries are descending after being grouped, reverse them */}
                                {dayEntries.toReversed().map((entry) => (
                                    <Entry
                                        key={entry.id}
                                        id={entry.id}
                                        description={entry.description}
                                        start_time={entry.start_time}
                                        end_time={entry.end_time}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        status={entryStatusMessage.id === entry.id ? entryStatusMessage.message : null}
                                    />
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
};

Entries.propTypes = {
    history: PropTypes.object.isRequired
};

export default Entries;
