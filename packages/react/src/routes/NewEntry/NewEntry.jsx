import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createEntry } from '@timo/common/api';
import Timer from '@timo/common/components/Timer';
import Title from '@timo/common/components/Title';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import styles from './NewEntry.module.css';

const TimerState = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    STOPPED: 'stopped'
};

const LogTime = () => {
    const [duration, setDuration] = useState(0);
    const [timerState, setTimerState] = useState(TimerState.STOPPED);
    const [description, setDescription] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleStartClick = () => {
        if (description.length === 0) {
            setStatusMessage('Description is required');
        } else {
            setTimerState(TimerState.ACTIVE);
            setStatusMessage('');
        }
    };

    const handleStopClick = () => {
        setTimerState(TimerState.STOPPED);
    };

    const handlePauseClick = () => {
        setTimerState(TimerState.PAUSED);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    useEffect(() => {
        if (timerState === TimerState.STOPPED && duration > 0) {
            setDuration(0);
            const endTimestamp = Math.floor(Date.now() / 1000);
            createEntry({
                description,
                start_time: `@${endTimestamp - duration}`,
                end_time: `@${endTimestamp}`
            }).then(() => {
                setStatusMessage('Time logged successfully');
            }).catch((error) => {
                setStatusMessage(error.message);
            });
        }
    });

    return (
        <>
            <Title>New time entry</Title>
            <div className={styles['center']}>
                <Timer
                    value={duration}
                    active={timerState === TimerState.ACTIVE}
                    onPaused={setDuration}
                />
                <Input
                    className={styles['description']}
                    label="Time entry description"
                    type="text"
                    placeholder="What are you working on?"
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <StatusMessage
                message={statusMessage}
                className={styles['status']}
            />
            <div className={styles['buttons']}>
                {(timerState === TimerState.STOPPED && duration === 0) && (
                    <Button onClick={handleStartClick}>
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
        </>
    );
};

LogTime.propTypes = {
    history: PropTypes.object.isRequired
};

export default LogTime;