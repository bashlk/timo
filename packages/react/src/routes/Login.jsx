import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login } from '@timer-app/common/api';
import { UserContext } from '@timer-app/common/context/UserContextProvider';

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
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        login(username, password).then((response) => {
            user.setAuthenticatedUser(response);
            history.replace('/');
        }).catch(() => {
            setLoginError('Invalid username or password');
        });
    };

    return (
        <div>
            <h1>Login</h1>
            <form action="" onSubmit={handleFormSubmit}>
                <input name="username" type="text" placeholder="Username" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
                {loginError && <p>{loginError}</p>}
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