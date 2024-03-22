import { createEntry } from '@timer-app/common/api';
import { useEffect, useState } from 'react';

const Timer = () => {
    const [duration, setDuration] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [description, setDescription] = useState('');
    const [entryStatus, setEntryStatus] = useState('');

    useEffect(() => {
        let interval;
        if (timerActive) {
            interval = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive]);

    // Format duration to HH:MM:SS
    const formattedDuration = new Date(duration * 1000).toISOString().slice(11, 19);

    const handleStartClick = () => {
        setTimerActive(true);
        setEntryStatus('');
    };

    const handleStopClick = () => {
        setDuration(0);
        setTimerActive(false);
        const endTimestamp = Math.floor(Date.now() / 1000);
        createEntry({
            description,
            start_time: `@${endTimestamp - duration}`,
            end_time: `@${endTimestamp}`
        }).then(() => {
            setEntryStatus('Time entry saved successfully');
        }).catch(() => {
            setEntryStatus('Error saving time entry');
        });
    };

    const handlePauseClick = () => {
        setTimerActive(false);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    return (
        <div>
            <h1>Timer</h1>
            <p>{formattedDuration}</p>
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={handleDescriptionChange}
            />
            <div>
                {(!timerActive && duration === 0) && (
                    <button onClick={handleStartClick}>
                        Start
                    </button>
                )}
                {(!timerActive && duration !== 0) && (
                    <>
                        <button onClick={handleStartClick}>
                            Resume
                        </button>
                        <button onClick={handleStopClick}>
                            Finish
                        </button>
                    </>
                )}
                {timerActive && (
                    <>
                        <button onClick={handlePauseClick}>
                            Pause
                        </button>
                        <button onClick={handleStopClick}>
                            Stop
                        </button>
                    </>
                )}
            </div>
            {entryStatus && <p>{entryStatus}</p>}
        </div>
    );
};

export default Timer;
