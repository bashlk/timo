import Input from '@timo/common/components/Input';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import styles from '../Profile.module.css';
import useMachineState from '../../../hooks/useMachineState';
import useMachine from '../../../hooks/useMachine';

const ChangePassword = () => {
    const { statusMessage } = useMachineState('changePassword', state => state.context);
    const changePasswordMachine = useMachine('changePassword');

    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        changePasswordMachine.send({
            type: 'save',
            password: formData.get('password'),
            newPassword: formData.get('newPassword')
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
                {statusMessage && <StatusMessage className={styles['status']} message={statusMessage} />}
                <div className={styles['button']}>
                    <Button type="submit">Change password</Button>
                </div>
            </div>
        </form>
    );
};

export default ChangePassword;
