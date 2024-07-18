import Title from '@timo/common/components/Title';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import useUser from '@timo/common/hooks/useUser';
import { logout } from '@timo/common/api';
import styles from './Profile.module.css';
import ChangePassword from './sections/ChangePassword';
import CustomizeUser from './sections/CustomizeUser';

const Profile = () => {
    const user = useUser();

    const handleLogoutClick = () => {
        logout().then(() => {
            user.clearUser();
        });
    };

    return (
        <div className={styles['profile']}>
            <Title>My profile</Title>
            <CustomizeUser />
            <ChangePassword />
            <Button
                className={styles['sign-out']}
                value="login"
                variant={ButtonVariants.SECONDARY}
                onClick={handleLogoutClick}
            >
                Sign out
            </Button>
        </div>
    );
};

export default Profile;
