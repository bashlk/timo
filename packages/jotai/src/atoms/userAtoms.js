import { atom } from 'jotai';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { getUser, logout, login, register, updateUser, updatePassword } from '@timo/common/api';
import { UserStatus } from '@timo/common/context/UserContextProvider';

const userAtom = atomWithQuery(() => ({
    queryKey: ['user'],
    queryFn: getUser,
    // Retry will keep repeating the query when the user is unauthenticated and the BE returns a 401
    retry: false
}));

const mutationSuccessHandler = (get) => () => {
    const { refetch } = get(userAtom);
    refetch();
};

const loginAtom = atomWithMutation((get) => ({
    mutationFn: login,
    onSuccess: mutationSuccessHandler(get)
}));

const registerAtom = atomWithMutation((get) => ({
    mutationFn: register,
    onSuccess: mutationSuccessHandler(get)
}));

const updateUserAtom = atomWithMutation((get) => ({
    mutationFn: updateUser,
    onSuccess: mutationSuccessHandler(get)
}));

const updatePasswordAtom = atomWithMutation((get) => ({
    mutationFn: updatePassword,
    onSuccess: mutationSuccessHandler(get)
}));

const logoutAtom = atomWithMutation((get) => ({
    mutationFn: logout,
    onSuccess: mutationSuccessHandler(get)
}));

const userStatusAtom = atom(
    (get) => {
        const { data, error } = get(userAtom);
        if (error?.message === 'Authentication required') {
            return UserStatus.UNAUTHENTICATED;
        }
        if (!data) {
            return UserStatus.UNKNOWN;
        }
        // Stale data is present during refetching, even if it errors out
        if (data) {
            return UserStatus.AUTHENTICATED;
        }
    }
);

const userIdAtom = atom(
    (get) => {
        const { data } = get(userAtom);
        return data?.id;
    }
);

const usernameAtom = atom(
    (get) => {
        const { data } = get(userAtom);
        return data?.username;
    }
);

const userAvatarAtom = atom(
    (get) => {
        const { data } = get(userAtom);
        return {
            character: data?.avatar_character,
            background: data?.avatar_background
        };
    }
);

const UserAtomActions = {
    Login: 'login',
    Register: 'register',
    Update: 'update',
    UpdatePassword: 'updatePassword',
    Logout: 'logout'
};

export {
    UserStatus,
    UserAtomActions,
    userStatusAtom,
    userIdAtom,
    usernameAtom,
    userAvatarAtom,
    loginAtom,
    registerAtom,
    updateUserAtom,
    updatePasswordAtom,
    logoutAtom
};