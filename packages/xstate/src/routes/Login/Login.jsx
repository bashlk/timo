import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import Title from '@timo/common/components/Title';
import StatusMessage from '@timo/common/components/StatusMessage';
import styles from './Login.module.css';
import { USER_EVENTS, USER_STATES } from '../../machines/userMachine';
import UserMachineContext from '../../context/UserMachineContext';

const Login = ({ history }) => {
    const userState = UserMachineContext.useSelector((state) => state.value);
    const error = UserMachineContext.useSelector((state) => state.context.error);
    const userMachine = UserMachineContext.useActorRef();

    const isLoading = userState === USER_STATES.REGISTERING || userState === USER_STATES.LOGGING_IN;
    const statusMessage = isLoading ? 'Loading...' : error;

    useEffect(() => {
        if (userState === USER_STATES.AUTHENTICATED) {
            history.replace('./');
        }
    }, [history, userState]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (action == 'login') {
            userMachine.send({
                type: USER_EVENTS.LOGIN,
                username,
                password
            });
        }

        if (action == 'register') {
            userMachine.send({
                type: USER_EVENTS.REGISTER,
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