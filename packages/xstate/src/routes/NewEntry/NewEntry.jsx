import Title from '@timo/common/components/Title';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import useChildMachine from '../../hooks/useChildMachine';
import useChildMachineState from '../../hooks/useChildMachineState';
import Timer from '../../components/Timer';
import styles from './NewEntry.module.css';

const NewEntry = () => {
    const timerState = useChildMachineState('newEntry', state => state.value);
    const statusMessage = useChildMachineState('newEntry', state => state.context.statusMessage);
    const newEntryMachine = useChildMachine('newEntry');

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;
        const formData = new FormData(e.target);
        newEntryMachine.send({
            type: action,
            description: formData.get('description')
        });
    };

    return (
        <>
            <Title>New time entry</Title>
            <form action="" onSubmit={handleSubmit}>
                <div className={styles['center']}>
                    <Timer />
                    <Input
                        className={styles['description']}
                        label="Time entry description"
                        type="text"
                        name="description"
                        placeholder="What are you working on?"
                        required
                    />
                </div>
                {statusMessage && (
                    <StatusMessage
                        message={statusMessage}
                        className={styles['status']}
                    />
                )}
                <div className={styles['buttons']}>
                    {timerState === 'idle' && (
                        <Button value="start">
                            Start
                        </Button>
                    )}
                    {timerState === 'paused' && (
                        <>
                            <Button value="resume">
                                Resume
                            </Button>
                            <Button value="finish" variant={ButtonVariants.SECONDARY}>
                                Finish
                            </Button>
                        </>
                    )}
                    {timerState === 'active' && (
                        <>
                            <Button value="pause">
                                Pause
                            </Button>
                            <Button value="finish" variant={ButtonVariants.SECONDARY}>
                                Finish
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </>
    );
};

export default NewEntry;