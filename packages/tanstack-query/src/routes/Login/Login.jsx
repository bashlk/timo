import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login, register } from '@timo/common/api';
import { UserContext } from '@timo/common/context/UserContextProvider';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import Title from '@timo/common/components/Title';
import StatusMessage from '@timo/common/components/StatusMessage';
import styles from './Login.module.css';

const Login = ({ history }) => {
    const user = useContext(UserContext);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        if (user.status === 'authenticated') {
            history.replace('./');
        }
    }, [history, user]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        setStatusMessage('Loading...');

        if (action == 'login') {
            login(username, password).then((response) => {
                user.setAuthenticatedUser(response);
                history.replace('./');
            }).catch((error) => {
                setStatusMessage(error.message);
            });
        }

        if (action == 'register') {
            register(username, password).then((response) => {
                user.setAuthenticatedUser(response);
                history.replace('./');
            }).catch((error) => {
                setStatusMessage(error.message);
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