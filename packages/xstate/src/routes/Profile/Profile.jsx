import Title from '@timo/common/components/Title';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import styles from './Profile.module.css';
import ChangePassword from './sections/ChangePassword';
import CustomizeUser from './sections/CustomizeUser';
import UserMachineContext from '../../context/UserMachineContext';
import { USER_EVENTS } from '../../machines/userMachine';

const Profile = () => {
    const userMachine = UserMachineContext.useActorRef();

    const handleLogoutClick = () => {
        userMachine.send({
            type: USER_EVENTS.LOGOUT
        });
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
