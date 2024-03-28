import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createEntry } from '@timer-app/common/api';
import Timer from '@timer-app/common/components/Timer';
import Container from '@timer-app/common/components/Container/Container';
import Title from '@timer-app/common/components/Title';
import Input from '@timer-app/common/components/Input';
import Button from '@timer-app/common/components/Button';
import StatusMessage from '@timer-app/common/components/StatusMessage';
import styles from './LogTime.module.css';
import { ButtonVariants } from '@timer-app/common/components/Button/Button';

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
            }).catch(() => {
                setStatusMessage('Error saving time log');
            });
        }
    });

    return (
        <Container>
            <Title>Log time</Title>
            <div className={styles['log-time__center']}>
                <Timer
                    value={duration}
                    active={timerState === TimerState.ACTIVE}
                    onPaused={setDuration}
                />
                <Input
                    type="text"
                    placeholder="What are you working on?"
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <StatusMessage
                message={statusMessage}
                className={styles['log-time__status']}
            />
            <div className={styles['log-time__buttons']}>
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
        </Container>
    );
};

LogTime.propTypes = {
    history: PropTypes.object.isRequired
};

export default LogTime;