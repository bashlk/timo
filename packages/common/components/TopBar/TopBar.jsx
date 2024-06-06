import PropTypes from 'prop-types';
import { IconClockHour8 } from '@tabler/icons-react';
import Avatar from '../Avatar/Avatar';
import styles from './TopBar.module.css';

const TopBar = ({ onIconClick = () => {}, onAvatarClick = () => {} }) => (
    <div className={styles['top-bar']}>
        <IconClockHour8 className={styles['icon']} size={64} onClick={onIconClick} />
        <Avatar className={styles['avatar']} character="B" background="light" onClick={onAvatarClick} />
    </div>
);

TopBar.propTypes = {
    onIconClick: PropTypes.func,
    onAvatarClick: PropTypes.func
};

export default TopBar;
