import { useMutation } from '@tanstack/react-query';
import Title from '@timo/common/components/Title';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import { logout } from '@timo/common/api';
import styles from './Profile.module.css';
import ChangePassword from './sections/ChangePassword';
import CustomizeUser from './sections/CustomizeUser';
import { clearUser } from '../../../store/userStore';

const Profile = () => {
    const { mutate: logoutM } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            clearUser();
        }
    });

    return (
        <div className={styles['profile']}>
            <Title>My profile</Title>
            <CustomizeUser />
            <ChangePassword />
            <Button
                className={styles['sign-out']}
                variant={ButtonVariants.SECONDARY}
                onClick={logoutM}
            >
                Sign out
            </Button>
        </div>
    );
};

export default Profile;
