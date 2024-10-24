import Entry from '@timo/common/components/Entry';
import Title from '@timo/common/components/Title';
import Input from '@timo/common/components/Input';
import Button from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import formatDuration from '@timo/common/utils/formatDuration';
import styles from './Entries.module.css';
import { ButtonVariants } from '@timo/common/components/Button/Button';
import useSystemMachine from '../../hooks/useSystemMachine';
import useSystemMachineState from '../../hooks/useSystemMachineState';

const Entries = () => {
    const {
        groupedEntries,
        totalDuration,
        statusMessage,
        filter,
        itemStatusMessage
    } = useSystemMachineState('entries', state => state.context);
    const entriesMachine = useSystemMachine('entries');
    const rootMachine = useSystemMachine('root');

    const handleEdit = (updatedEntry) => {
        entriesMachine.send({
            type: 'updateEntry',
            updatedEntry
        });
    };

    const handleDelete = (entryId) => {
        entriesMachine.send({
            type: 'deleteEntry',
            entryId
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        entriesMachine.send({
            type: 'filter',
            startDate: formData.get('from'),
            endDate: formData.get('to')
        });
    };

    const handleNewClick = () => {
        rootMachine.send({
            type: 'pushLocation',
            location: './new'
        });
    };

    return (
        <>
            <Title>Time entries</Title>
            <div className={styles['body']}>
                <div className={styles['new']}>
                    <Button onClick={handleNewClick}>New entry</Button>
                </div>
                <form className={styles['filters']} action="" onSubmit={handleFilter}>
                    <Input label="Filter entries start time" type="datetime-local" name="from" defaultValue={filter.startDate} />
                    <Input label="Filter entries end time" type="datetime-local" name="to" defaultValue={filter.endDate} />
                    <Button variant={ButtonVariants.SECONDARY} type="submit">Filter</Button>
                </form>
                {statusMessage && <StatusMessage className={styles['message']} message={statusMessage} />}
                {totalDuration > 0 && (
                    <>
                        <div className={styles['total-row']}>
                            <h2 className={styles['total-label']}>Total</h2>
                            <div>{formatDuration(totalDuration)}</div>
                        </div>
                        {groupedEntries.map(([date, dayEntries, dayEntriesDuration]) => (
                            <div className={styles['day']} key={date}>
                                <div className={styles['day-header']}>
                                    <h2 className={styles['day-name']}>{date}</h2>
                                    <div>{formatDuration(dayEntriesDuration)}</div>
                                </div>
                                {dayEntries.map((entry) => (
                                    <Entry
                                        key={entry.id}
                                        id={entry.id}
                                        description={entry.description}
                                        start_time={entry.start_time}
                                        end_time={entry.end_time}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        status={itemStatusMessage[entry.id]}
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

export default Entries;
