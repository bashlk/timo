import { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@tanstack/react-query';
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
    const formRef = createRef(null);
    const [params, setParams] = useState({
        from: getDateString(firstDateOfMonth),
        to: getDateString(lastDateOfMonth)
    });

    const { data: entries, isFetching, isError, error, refetch } = useQuery({
        queryKey: ['entries', params],
        queryFn: () => listEntries(params)
    });
    const statusMessage =
        isFetching ? 'Loading...' :
            isError ? error.message :
                entries?.length === 0 ? 'No entries found' : null;

    const { mutate: update, error: updateError, variables: updateVariables, isPending: isUpdating } = useMutation({
        mutationFn: updateEntry,
        onSuccess: () => {
            refetch();
        }
    });
    const updateStatus = updateError ? updateError.message : isUpdating ? 'Saving...' : null;

    const { mutate: deleteEntryM, error: deleteError, variables: deleteVariables, isPending: isDeleting } = useMutation({
        mutationFn: deleteEntry,
        onSuccess: () => {
            refetch();
        }
    });
    const deleteStatus = deleteError ? deleteError.message : isDeleting ? 'Deleting...' : null;

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        setParams({
            from: formData.get('from'),
            to: formData.get('to')
        });
    };

    const handleNewClick = () => {
        history.push('./new');
    };

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
                                {dayEntries.toReversed().map((entry) => {
                                    const updatingEntry = updateVariables?.id === entry.id;
                                    const deletingEntry = deleteVariables === entry.id;
                                    const status = updatingEntry ? updateStatus : deletingEntry ? deleteStatus : null;

                                    return (
                                        <Entry
                                            key={entry.id}
                                            id={entry.id}
                                            description={entry.description}
                                            start_time={entry.start_time}
                                            end_time={entry.end_time}
                                            onEdit={update}
                                            onDelete={deleteEntryM}
                                            status={status}
                                        />
                                    );
                                })}
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
