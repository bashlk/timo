import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login, register } from '@timo/common/api';
import { UserContext } from '@timo/common/context/UserContextProvider';
import Container from '@timo/common/components/Container';
import Input from '@timo/common/components/Input';
import Button from '@timo/common/components/Button';
import Title from '@timo/common/components/Title';
import { ButtonVariants } from '@timo/common/components/Button/Button';
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
                if (error instanceof TypeError) {
                    setStatusMessage('Failed to connect to server. Please try again later.');
                } else {
                    error.response.json().then((data) => {
                        setStatusMessage(data.message);
                    });
                }
            });
        }

        if (action == 'register') {
            register(username, password).then((response) => {
                user.setAuthenticatedUser(response);
                history.replace('./');
            }).catch((error) => {
                if (error instanceof TypeError) {
                    setStatusMessage('Failed to connect to server. Please try again later.');
                } else {
                    error.response.json().then((data) => {
                        setStatusMessage(data.message);
                    });
                }
            });
        }
    };

    return (
        <Container>
            <Title className={styles['login__title']}>Login</Title>
            <form className={styles['login__form']} action="" onSubmit={handleFormSubmit}>
                <Input label="Username" name="username" type="text" placeholder="Username" required />
                <Input label="Password" name="password" type="password" placeholder="Password" required />
                {statusMessage && <StatusMessage className={styles['login__status']} message={statusMessage} />}
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