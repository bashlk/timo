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
        <Container>
            <Title>Entries</Title>
            {entries ? (
                <div className={styles['entries__body']}>
                    <form className={styles['entries__filters']} ref={formRef} action="" onSubmit={handleFilter}>
                        <Input type="datetime-local" name="from" />
                        <Input type="datetime-local" name="to" />
                        <Button type="submit">Filter</Button>
                    </form>
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
                </div>
            ) : (
                <StatusMessage message="Loading" />
            )}
        </Container>
    );
};

Entries.propTypes = {
    history: PropTypes.object.isRequired
};

export default Entries;
