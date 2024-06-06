import PropTypes from 'prop-types';
import styles from './TopBar.module.css';
import { IconClockHour8 } from '@tabler/icons-react';

const TopBar = ({ onIconClick = () => {} }) => (
    <div className={styles['top-bar']}>
        <IconClockHour8 className={styles['top-bar__icon']} size={48} onClick={onIconClick} />
        <IconClockHour8 className={styles['top-bar__avatar']} size={32} onClick={onIconClick} />
    </div>
);

TopBar.propTypes = {
    onIconClick: PropTypes.func
};

export default TopBar;
