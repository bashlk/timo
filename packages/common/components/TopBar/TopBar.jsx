import PropTypes from 'prop-types';
import { IconClockHour8 } from '@tabler/icons-react';
import useUser, { UserStatus } from '@timo/common/hooks/useUser';
import Avatar from '../Avatar/Avatar';
import styles from './TopBar.module.css';

const TopBar = ({ onIconClick = () => {}, onAvatarClick = () => {} }) => {
    const user = useUser();
    return (
        <div className={styles['top-bar']}>
            <IconClockHour8 className={styles['icon']} size={64} onClick={onIconClick} />
            {user?.status === UserStatus.AUTHENTICATED && (
                <Avatar
                    className={styles['avatar']}
                    character={user?.data?.avatar_character}
                    background={user?.data?.avatar_background}
                    onClick={onAvatarClick}
                />
            )}
        </div>
    );
};

TopBar.propTypes = {
    onIconClick: PropTypes.func,
    onAvatarClick: PropTypes.func
};

export default TopBar;
