import { useEffect, useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { listEntries, updateEntry, deleteEntry } from '@timer-app/common/api';
import Entry from '@timer-app/common/components/Entry';
import Container from '@timer-app/common/components/Container';
import Title from '@timer-app/common/components/Title';
import Input from '@timer-app/common/components/Input';
import Button from '@timer-app/common/components/Button';
import StatusMessage from '@timer-app/common/components/StatusMessage';
import formatDuration from '@timer-app/common/utils/formatDuration';
import styles from './Entries.module.css';
import { ButtonVariants } from '@timer-app/common/components/Button/Button';

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
    const formRef = createRef(null);

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

    const handleListEntriesResponse = (entries) => {
        setEntries(entries);
        if (entries.length === 0) {
            setStatusMessage('No entries found');
        } else {
            setStatusMessage(null);
        }
    };

    const handleListEntriesError = (error) => {
        if (error instanceof TypeError) {
            setStatusMessage('Failed to connect to server. Please try again later.');
        } else {
            error.response.json().then((data) => {
                setStatusMessage(data.message);
            });
        }
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

    useEffect(() => {
        if (entries === null) {
            setStatusMessage('Loading...');
            listEntries({
                from: firstDateOfMonth.toISOString(),
                to: lastDateOfMonth.toISOString()
            }).then(handleListEntriesResponse)
                .catch(handleListEntriesError);
        }
    }, [entries]);

    return (
        <Container>
            <Title>Time entries</Title>
            <div className={styles['entries__body']}>
                <div className={styles['entries__new']}>
                    <Button onClick={() => history.push('/timer')}>New Entry</Button>
                </div>
                <form className={styles['entries__filters']} ref={formRef} action="" onSubmit={handleFilter}>
                    <Input type="datetime-local" name="from" defaultValue={getDateString(firstDateOfMonth)} />
                    <Input type="datetime-local" name="to" defaultValue={getDateString(lastDateOfMonth)} />
                    <Button variant={ButtonVariants.SECONDARY} type="submit">Filter</Button>
                </form>
                {statusMessage && <StatusMessage className={styles['entries__message']} message={statusMessage} />}
                {entries?.length > 0 && (
                    <>
                        <div className={styles['entries__total-row']}>
                            <h2 className={styles['entries__total-label']}>Total</h2>
                            <div>{formatDuration(getTotalDuration(entries))}</div>
                        </div>
                        {Object.entries(getEntriesGroupedByDate(entries)).map(([date, dayEntries]) => (
                            <div className={styles['entries__day']} key={date}>
                                <div className={styles['entries__day-header']}>
                                    <h2 className={styles['entries__day-name']}>{date}</h2>
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
                                    />
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </Container>
    );
};

Entries.propTypes = {
    history: PropTypes.object.isRequired
};

export default Entries;
