import { useSetAtom } from 'jotai';
import Title from '@timo/common/components/Title';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import styles from './Profile.module.css';
import ChangePassword from './sections/ChangePassword';
import CustomizeUser from './sections/CustomizeUser';
import { userActionAtom } from '../../atoms/userAtoms';

const Profile = () => {
    const runUserAtomAction = useSetAtom(userActionAtom);

    return (
        <div className={styles['profile']}>
            <Title>My profile</Title>
            <CustomizeUser />
            <ChangePassword />
            <Button
                className={styles['sign-out']}
                value="login"
                variant={ButtonVariants.SECONDARY}
                onClick={() => runUserAtomAction({ action: 'logout' })}
            >
                Sign out
            </Button>
        </div>
    );
};

export default Profile;
