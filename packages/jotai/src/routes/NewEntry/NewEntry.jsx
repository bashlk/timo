import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import PropTypes from 'prop-types';
import Timer from '@timo/common/components/Timer';
import Title from '@timo/common/components/Title';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import { createEntryAtom } from '../../atoms/entryAtoms';
import styles from './NewEntry.module.css';

const TimerState = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    STOPPED: 'stopped'
};

const LogTime = () => {
    const descriptionRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [timerState, setTimerState] = useState(TimerState.STOPPED);

    const { mutate: createEntry, error, isPending, isSuccess } = useAtomValue(createEntryAtom);
    const statusMessage =
        error ? error.message :
            isPending ? 'Saving...' :
                isSuccess ? 'Time logged successfully' : '';

    const handleStartClick = (e) => {
        e.preventDefault();
        setTimerState(TimerState.ACTIVE);
    };

    const handleStopClick = () => {
        setTimerState(TimerState.STOPPED);
    };

    const handlePauseClick = () => {
        setTimerState(TimerState.PAUSED);
    };

    useEffect(() => {
        if (timerState === TimerState.STOPPED && duration > 0) {
            setDuration(0);
            const endTimestamp = Math.floor(Date.now() / 1000);
            createEntry({
                description: descriptionRef.current.value,
                start_time: `@${endTimestamp - duration}`,
                end_time: `@${endTimestamp}`
            });
        }
    });

    return (
        <form action="" onSubmit={handleStartClick}>
            <Title>New time entry</Title>
            <div className={styles['center']}>
                <Timer
                    value={duration}
                    active={timerState === TimerState.ACTIVE}
                    onPaused={setDuration}
                />
                <Input
                    name="description"
                    ref={descriptionRef}
                    className={styles['description']}
                    label="Time entry description"
                    type="text"
                    placeholder="What are you working on?"
                    required
                />
            </div>
            <StatusMessage
                message={statusMessage}
                className={styles['status']}
            />
            <div className={styles['buttons']}>
                {(timerState === TimerState.STOPPED && duration === 0) && (
                    <Button type="submit">
                        Start
                    </Button>
                )}
                {(timerState === TimerState.PAUSED && duration !== 0) && (
                    <>
                        <Button onClick={handleStartClick}>
                            Resume
                        </Button>
                        <Button variant={ButtonVariants.SECONDARY} onClick={handleStopClick}>
                            Finish
                        </Button>
                    </>
                )}
                {timerState === TimerState.ACTIVE && (
                    <>
                        <Button onClick={handlePauseClick}>
                            Pause
                        </Button>
                        <Button variant={ButtonVariants.SECONDARY} onClick={handleStopClick}>
                            Stop
                        </Button>
                    </>
                )}
            </div>
        </form>
    );
};

LogTime.propTypes = {
    history: PropTypes.object.isRequired
};

export default LogTime;