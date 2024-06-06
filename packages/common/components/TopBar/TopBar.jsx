import PropTypes from 'prop-types';
import { IconClockHour8 } from '@tabler/icons-react';
import Avatar from '../Avatar/Avatar';
import styles from './TopBar.module.css';

const TopBar = ({ onIconClick = () => {} }) => (
    <div className={styles['top-bar']}>
        <IconClockHour8 className={styles['icon']} size={48} onClick={onIconClick} />
        <Avatar className={styles['avatar']} character="B" background="light" />
    </div>
);

TopBar.propTypes = {
    onIconClick: PropTypes.func
};

export default TopBar;
