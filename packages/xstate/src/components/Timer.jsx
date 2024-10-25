import styles from '@timo/common/components/Timer/Timer.module.css';
import useChildMachineState from '../hooks/useChildMachineState';

const Timer = () => {
    const timerValue = useChildMachineState('newEntry', state => state.context.timerValue);

    // Format duration to HH:MM:SS
    const formattedValue = new Date(timerValue * 1000).toISOString().slice(11, 19);

    return (
        <div className={styles.timer}>
            {formattedValue}
        </div>
    );
};

export default Timer;