import styles from './TopBar.module.css';
import { IconClockHour8 } from '@tabler/icons-react';

const TopBar = () => (
    <div className={styles['top-bar']}>
        <IconClockHour8 size={48} />
    </div>
);


export default TopBar;
