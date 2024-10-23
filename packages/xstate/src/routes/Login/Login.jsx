import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import Title from '@timo/common/components/Title';
import StatusMessage from '@timo/common/components/StatusMessage';
import useMachine from '../../hooks/useMachine';
import useMachineState from '../../hooks/useMachineState';

import styles from './Login.module.css';

const Login = ({ history }) => {
    const authState = useMachineState('root', (state) => state.value);
    const statusMessage = useMachineState('login', (state) => state.context.statusMessage);
    const loginMachine = useMachine('login');

    useEffect(() => {
        if (authState === 'authenticated') {
            history.replace('./');
        }
    }, [history, authState]);

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

Login.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired
};

export default Login;