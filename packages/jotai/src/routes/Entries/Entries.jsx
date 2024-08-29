import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Entry from '@timo/common/components/Entry';
import Title from '@timo/common/components/Title';
import Input from '@timo/common/components/Input';
import Button from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import { ButtonVariants } from '@timo/common/components/Button/Button';
import styles from './Entries.module.css';
import {
    entriesGroupedByDateAtom,
    entriesDurationAtom,
    entriesStartDateAtom,
    entriesEndDateAtom,
    entriesStatusAtom,
    entriesDurationsGroupedByDateAtom,
    updateEntryAtom,
    deleteEntryAtom,
    entriesCountAtom
} from '../../atoms/entryAtoms';
import { baseAwareLocationAtom } from '../../atoms/locationAtoms';

const Entries = () => {
    const setLocation = useSetAtom(baseAwareLocationAtom);
    const [startDate, setStartDate] = useAtom(entriesStartDateAtom);
    const [endDate, setEndDate] = useAtom(entriesEndDateAtom);
    const entries = useAtomValue(entriesGroupedByDateAtom);
    const entriesDuration = useAtomValue(entriesDurationAtom);
    const entriesCount = useAtomValue(entriesCountAtom);
    const { isLoading, isError, error } = useAtomValue(entriesStatusAtom);
    const entryDurationsGroupedByDate = useAtomValue(entriesDurationsGroupedByDateAtom);

    const statusMessage =
        isLoading === 'loading' ? 'Loading...' :
            isError ? error.message :
                entriesCount === 0 ? 'No entries found' : null;

    const { mutate: updateEntry, error: updateError, isPending: isUpdating, variables: updateVariables } = useAtomValue(updateEntryAtom);
    const updateStatus = updateError ? updateError.message : isUpdating ? 'Saving...' : null;

    const { mutate: deleteEntry, error: deleteError, isPending: isDeleting, variables: deleteVariables } = useAtomValue(deleteEntryAtom);
    const deleteStatus = deleteError ? deleteError.message : isDeleting ? 'Deleting...' : null;

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setStartDate(formData.get('from'));
        setEndDate(formData.get('to'));
    };

    const handleNewClick = () => {
        setLocation({ pathname: '/new' });
    };

    return (
        <>
            <Title>Time entries</Title>
            <div className={styles['body']}>
                <div className={styles['new']}>
                    <Button onClick={handleNewClick}>New entry</Button>
                </div>
                <form className={styles['filters']} action="" onSubmit={handleFilter}>
                    <Input label="Filter entries start time" type="datetime-local" name="from" defaultValue={startDate} />
                    <Input label="Filter entries end time" type="datetime-local" name="to" defaultValue={endDate} />
                    <Button variant={ButtonVariants.SECONDARY} type="submit">Filter</Button>
                </form>
                {statusMessage && <StatusMessage className={styles['message']} message={statusMessage} />}
                {entriesCount > 0 && (
                    <>
                        <div className={styles['total-row']}>
                            <h2 className={styles['total-label']}>Total</h2>
                            <div>{entriesDuration}</div>
                        </div>
                        {Object.entries(entries).map(([date, dayEntries]) => (
                            <div className={styles['day']} key={date}>
                                <div className={styles['day-header']}>
                                    <h2 className={styles['day-name']}>{date}</h2>
                                    <div>{entryDurationsGroupedByDate[date]}</div>
                                </div>
                                {dayEntries.map((entry) => {
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
                                            onEdit={updateEntry}
                                            onDelete={deleteEntry}
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

export default Entries;
