import { proxy } from 'valtio';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import { getUser } from '@timo/common/api';

const userStore = proxy({
    status: UserStatus.UNKNOWN,
    data: {
        id: null,
        username: null,
        avatar_character: null,
        avatar_background: null
    },
    error: null
});

export const setUser = (user) => {
    userStore.status = UserStatus.AUTHENTICATED;
    userStore.data = user;

    userStore.data.id = user.id;
    userStore.data.username = user.username;
    userStore.data.avatar_character = user.avatar_character;
    userStore.data.avatar_background = user.avatar_background;
};

export const fetchUser = () => {
    getUser()
        .then(setUser)
        .catch((error) => {
            userStore.status = UserStatus.UNAUTHENTICATED;
            userStore.error = error;
        });
};

export const clearUser = () => {
    userStore.status = UserStatus.UNAUTHENTICATED;
    userStore.error = null;

    userStore.data = {
        id: null,
        username: null,
        avatar_character: null,
        avatar_background: null
    };
};

// Fetch the user during app startup
fetchUser();

export { UserStatus };
export default userStore;