import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Timer.module.css';

const Timer = ({ value, active, onPaused }) => {
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        let interval;
        if (active) {
            setCurrentValue(value);
            interval = setInterval(() => {
                setCurrentValue((val) => val + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [active, value]);

    useEffect(() => {
        if (!active) {
            onPaused(currentValue);
        }
    }, [active, currentValue, onPaused]);

    // Format duration to HH:MM:SS
    const formattedValue = new Date(currentValue * 1000).toISOString().slice(11, 19);

    return (
        <div className={styles.timer}>
            {formattedValue}
        </div>
    );
};

Timer.propTypes = {
    value: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    onPaused: PropTypes.func.isRequired
};

export default Timer;