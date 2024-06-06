import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createEntry } from '@timo/common/api';
import Timer from '@timo/common/components/Timer';
import Title from '@timo/common/components/Title';
import Input from '@timo/common/components/Input';
import Button from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import { ButtonVariants } from '@timo/common/components/Button/Button';
import styles from './NewEntry.module.css';

const TimerState = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    STOPPED: 'stopped'
};

const LogTime = ({ history }) => {
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

    const handleViewEntriesClick = () => {
        history.push('./');
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
                if (error instanceof TypeError) {
                    setStatusMessage('Failed to connect to server. Please try again later.');
                } else {
                    error.response.json().then((data) => {
                        setStatusMessage(data.message);
                    });
                }
            });
        }
    });

    return (
        <>
            <Title>New time entry</Title>
            <div className={styles['new-entry__center']}>
                <Timer
                    value={duration}
                    active={timerState === TimerState.ACTIVE}
                    onPaused={setDuration}
                />
                <Input
                    label="Time entry description"
                    type="text"
                    placeholder="What are you working on?"
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <StatusMessage
                message={statusMessage}
                className={styles['new-entry__status']}
            />
            <div className={styles['new-entry__buttons']}>
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
            <div className={styles['new-entry__back']}>
                <Button className={styles['new-entry__entries']} variant={ButtonVariants.SECONDARY} onClick={handleViewEntriesClick}>
                    View time entries
                </Button>
            </div>
        </>
    );
};

LogTime.propTypes = {
    history: PropTypes.object.isRequired
};

export default LogTime;