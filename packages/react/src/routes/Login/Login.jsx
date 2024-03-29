import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login, register } from '@timer-app/common/api';
import { UserContext } from '@timer-app/common/context/UserContextProvider';
import Container from '@timer-app/common/components/Container';
import Input from '@timer-app/common/components/Input';
import Button from '@timer-app/common/components/Button';
import Title from '@timer-app/common/components/Title';
import { ButtonVariants } from '@timer-app/common/components/Button/Button';
import StatusMessage from '@timer-app/common/components/StatusMessage';
import styles from './Login.module.css';

const Login = ({ history }) => {
    const user = useContext(UserContext);
    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        if (user.status === 'authenticated') {
            history.replace('/');
        }
    }, [history, user]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (action == 'login') {
            login(username, password).then((response) => {
                user.setAuthenticatedUser(response);
                history.replace('/');
            }).catch(() => {
                setLoginError('Invalid username or password');
            });
        }

        if (action == 'register') {
            register(username, password).then((response) => {
                user.setAuthenticatedUser(response);
                history.replace('/');
            }).catch(() => {
                setLoginError('Username already exists');
            });
        }
    };

    return (
        <Container>
            <Title className={styles['login__title']}>Login</Title>
            <form className={styles['login__form']} action="" onSubmit={handleFormSubmit}>
                <Input name="username" type="text" placeholder="Username" required />
                <Input name="password" type="password" placeholder="Password" required />
                {loginError && <StatusMessage className={styles['login__status']} message={loginError} />}
                <div className={styles['login__button']}>
                    <Button value="login" type="submit">Login</Button>
                    <Button variant={ButtonVariants.SECONDARY} value="register" type="submit">Register</Button>
                </div>
            </form>
        </Container>
    );
};

Login.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired
};

export default Login;