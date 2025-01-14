import Title from '@timo/common/components/Title';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import styles from './Profile.module.css';
import ChangePassword from './sections/ChangePassword';
import CustomizeUser from './sections/CustomizeUser';
import useChildMachine from '../../hooks/useChildMachine';

const Profile = () => {
    const profileMachine = useChildMachine('profile');

    const handleLogoutClick = () => {
        profileMachine.send({ type: 'logout' });
    };

    return (
        <div className={styles['profile']}>
            <Title>My profile</Title>
            <CustomizeUser />
            <ChangePassword />
            <Button
                className={styles['sign-out']}
                variant={ButtonVariants.SECONDARY}
                onClick={handleLogoutClick}
            >
                Sign out
            </Button>
        </div>
    );
};

export default Profile;
