import { useState } from 'react';
import Input from '@timo/common/components/Input';
import useUser from '@timo/common/hooks/useUser';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import { updatePassword } from '@timo/common/api';
import styles from '../Profile.module.css';

const ChangePassword = () => {
    const user = useUser();
    const [passwordStatus, setPasswordStatus] = useState(null);

    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const password = formData.get('password');
        const newPassword = formData.get('newPassword');

        setPasswordStatus('Loading...');

        updatePassword({
            username: user?.data?.username,
            password,
            newPassword
        }).then(() => {
            setPasswordStatus('Password updated');
        }).catch((error) => {
            setPasswordStatus(error.message);
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
                {passwordStatus && <StatusMessage className={styles['status']} message={passwordStatus} />}
                <div className={styles['button']}>
                    <Button type="submit">Change password</Button>
                </div>
            </div>
        </form>
    );
};

export default ChangePassword;
