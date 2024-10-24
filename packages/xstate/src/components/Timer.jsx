import styles from '@timo/common/components/Timer/Timer.module.css';
import useSystemMachineState from '../hooks/useSystemMachineState';

const Timer = () => {
    const timerValue = useSystemMachineState('newEntry', state => state.context.timerValue);

    // Format duration to HH:MM:SS
    const formattedValue = new Date(timerValue * 1000).toISOString().slice(11, 19);

    return (
        <div className={styles.timer}>
            {formattedValue}
        </div>
    );
};

export default Timer;