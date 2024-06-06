import { useContext } from 'react';
import { UserContext } from '../context/UserContextProvider';
export { UserStatus } from '../context/UserContextProvider';

const useUser = () => {
    const user = useContext(UserContext);
    return user;
};

export default useUser;