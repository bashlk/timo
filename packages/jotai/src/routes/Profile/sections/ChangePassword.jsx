import { useAtomValue, useAtom } from 'jotai';
import Input from '@timo/common/components/Input';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import { usernameAtom, userActionAtom, UserAtomActions } from '../../../atoms/userAtoms';
import styles from '../Profile.module.css';

const ChangePassword = () => {
    const username = useAtomValue(usernameAtom);
    const [userAtomActionStatus, runUserAtomAction] = useAtom(userActionAtom);

    const isUserAtomActionUpdatePassword = userAtomActionStatus.action === UserAtomActions.UpdatePassword;
    const updatePasswordStatus = isUserAtomActionUpdatePassword && (userAtomActionStatus.error ? userAtomActionStatus.error.message :
        userAtomActionStatus.isPending ? 'Loading...' :
            userAtomActionStatus.isSuccess ? 'Password updated' : '');

    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const newPassword = formData.get('newPassword');
        runUserAtomAction({
            action: UserAtomActions.UpdatePassword,
            data: {
                username,
                password,
                newPassword
            }
        });
    };

    return (
        <form className={styles['form']} action="" onSubmit={handlePasswordFormSubmit}>
            <h2 className={styles['subheading']}>Change password</h2>
            <div className={styles['form-controls']}>
                <Input
                    label="Old password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    labelVisible
                    required
                />
                <Input
                    label="New password"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    labelVisible
                    required
                />
                {updatePasswordStatus && <StatusMessage className={styles['status']} message={updatePasswordStatus} />}
                <div className={styles['button']}>
                    <Button value="login" type="submit">Change password</Button>
                </div>
            </div>
        </form>
    );
};

export default ChangePassword;
