import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import Title from '@timo/common/components/Title';
import StatusMessage from '@timo/common/components/StatusMessage';
import useSystemMachine from '../../hooks/useSystemMachine';
import useSystemMachineState from '../../hooks/useSystemMachineState';

import styles from './Login.module.css';

const Login = () => {
    const statusMessage = useSystemMachineState('login', (state) => state.context.statusMessage);
    const loginMachine = useSystemMachine('login');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (action == 'login') {
            loginMachine.send({
                type: 'login',
                username,
                password
            });
        }

        if (action == 'register') {
            loginMachine.send({
                type: 'register',
                username,
                password
            });
        }
    };

    return (
        <div className={styles['body']}>
            <Title className={styles['title']}>Login</Title>
            <form className={styles['form']} action="" onSubmit={handleFormSubmit}>
                <Input label="Username" name="username" type="text" placeholder="Username" required />
                <Input label="Password" name="password" type="password" placeholder="Password" autoComplete="current-password" required />
                {statusMessage && <StatusMessage className={styles['status']} message={statusMessage} />}
                <div className={styles['button']}>
                    <Button value="login" type="submit">Login</Button>
                    <Button variant={ButtonVariants.SECONDARY} value="register" type="submit">Register</Button>
                </div>
            </form>
        </div>
    );
};

export default Login;