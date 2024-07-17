import PropTypes from 'prop-types';
import { IconClockHour8 } from '@tabler/icons-react';
import Avatar from '../Avatar/Avatar';
import styles from './TopBar.module.css';

const TopBar = ({ avatar, onIconClick = () => {}, onAvatarClick = () => {} }) => (
    <div className={styles['top-bar']}>
        <IconClockHour8 className={styles['icon']} size={64} onClick={onIconClick} />
        {avatar && (
            <Avatar
                className={styles['avatar']}
                character={avatar?.character}
                background={avatar?.background}
                onClick={onAvatarClick}
            />
        )}
    </div>
);

TopBar.propTypes = {
    avatar: PropTypes.shape({
        character: PropTypes.string,
        background: PropTypes.string
    }),
    onIconClick: PropTypes.func,
    onAvatarClick: PropTypes.func
};

export default TopBar;
