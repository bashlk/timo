import { proxy } from 'valtio';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import { getUser } from '@timo/common/api';

const userStore = proxy({
    status: UserStatus.UNKNOWN,
    data: {},
    error: null
});

export const fetchUser = () => {
    getUser()
        .then((user) => {
            userStore.status = UserStatus.AUTHENTICATED;
            userStore.data = user;
            userStore.error = null;
        })
        .catch((error) => {
            userStore.status = UserStatus.UNAUTHENTICATED;
            userStore.error = error;
        });
};

export const setUser = (user) => {
    userStore.status = UserStatus.AUTHENTICATED;
    userStore.data = user;
};

export const clearUser = () => {
    userStore.status = UserStatus.UNAUTHENTICATED;
    userStore.data = null;
    userStore.error = null;
};

// Fetch the user during app startup
fetchUser();

export { UserStatus };
export default userStore;