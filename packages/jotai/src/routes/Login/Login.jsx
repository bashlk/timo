import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import Title from '@timo/common/components/Title';
import StatusMessage from '@timo/common/components/StatusMessage';
import { loginAtom, registerAtom, userStatusAtom, UserStatus } from '../../atoms/userAtoms';
import { baseAwareLocationAtom } from '../atoms/locationAtoms';
import styles from './Login.module.css';

const Login = () => {
    const setLocation = useSetAtom(baseAwareLocationAtom);
    const userStatus = useAtomValue(userStatusAtom);
    const { error: loginError, isPending: isLoginPending, mutate: login } = useAtomValue(loginAtom);
    const { error: registerError, isPending: isRegisterPending, mutate: register } = useAtomValue(registerAtom);

    useEffect(() => {
        if (userStatus === UserStatus.AUTHENTICATED) {
            setLocation({ pathname: '/' });
        }
    }, [setLocation, userStatus]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (action == 'login') {
            login({ username, password });
        }

        if (action == 'register') {
            register({ username, password });
        }
    };

    const isPending = isLoginPending || isRegisterPending;
    const error = loginError || registerError;
    const statusMessage = error ? error.message : isPending ? 'Loading...' : null;

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