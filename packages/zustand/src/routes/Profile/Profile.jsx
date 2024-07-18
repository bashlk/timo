import Title from '@timo/common/components/Title';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import styles from './Profile.module.css';
import ChangePassword from './sections/ChangePassword';
import CustomizeUser from './sections/CustomizeUser';
import useUserStore from '../../zustand/useUserStore';

const Profile = () => {
    const clearUser = useUserStore((state) => state.clearUser);

    return (
        <div className={styles['profile']}>
            <Title>My profile</Title>
            <CustomizeUser />
            <ChangePassword />
            <Button
                className={styles['sign-out']}
                value="login"
                variant={ButtonVariants.SECONDARY}
                onClick={clearUser}
            >
                Sign out
            </Button>
        </div>
    );
};

export default Profile;
