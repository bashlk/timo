import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import { login, register } from '@timo/common/api';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import Title from '@timo/common/components/Title';
import StatusMessage from '@timo/common/components/StatusMessage';
import { userActionAtom, userStatusAtom, UserStatus, UserAtomActions } from '../../atoms/userAtoms';
import styles from './Login.module.css';

const Login = ({ history }) => {
    const userStatus = useAtomValue(userStatusAtom);
    const runUserAtomAction = useSetAtom(userActionAtom);

    useEffect(() => {
        if (userStatus === UserStatus.AUTHENTICATED) {
            history.replace('./');
        }
    }, [history, userStatus]);

    const handleSuccess = () => {
        runUserAtomAction({ action: UserAtomActions.Refresh });
        history.replace('./');
    };

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: handleSuccess
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: handleSuccess
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (action == 'login') {
            loginMutation.mutate({ username, password });
        }

        if (action == 'register') {
            registerMutation.mutate({ username, password });
        }
    };

    const error = loginMutation.error || registerMutation.error;
    const pending = loginMutation.isPending || registerMutation.isPending;
    const statusMessage = error ? error.message : pending ? 'Loading...' : null;

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

Login.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired
};

export default Login;