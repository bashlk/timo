import { useMutation } from '@tanstack/react-query';
import Input from '@timo/common/components/Input';
import useUser from '@timo/common/hooks/useUser';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import { updatePassword } from '@timo/common/api';
import styles from '../Profile.module.css';

const ChangePassword = () => {
    const user = useUser();

    const { mutate: updatePasswordM , error: updatePasswordError, isPending: isUpdatingPassword, isSuccess: passwordUpdated } = useMutation({
        mutationFn: updatePassword
    });

    const updatePasswordStatus =
        updatePasswordError ? updatePasswordError.message :
            isUpdatingPassword ? 'Loading...' :
                passwordUpdated ? 'Password updated' : '';

    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const newPassword = formData.get('newPassword');
        updatePasswordM({
            username: user?.data?.username,
            password,
            newPassword
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
                    <Button type="submit">Change password</Button>
                </div>
            </div>
        </form>
    );
};

export default ChangePassword;
