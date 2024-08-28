import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { getUser, logout, login, register, updateUser, updatePassword } from '@timo/common/api';
import { UserStatus } from '@timo/common/context/UserContextProvider';

const getUserAtom = loadable(atomWithQuery(() => ({
    queryKey: ['user'],
    queryFn: getUser,
    // Retry will keep repeating the query when the user is unauthenticated and the BE returns a 401
    retry: false
})));

const loginAtom = atomWithMutation(() => ({
    mutationFn: login
}));

const registerAtom = atomWithMutation(() => ({
    mutationFn: register
}));

const updateUserAtom = atomWithMutation(() => ({
    mutationFn: updateUser
}));

const updatePasswordAtom = atomWithMutation(() => ({
    mutationFn: updatePassword
}));

const logoutAtom = atomWithMutation(() => ({
    mutationFn: logout
}));

const userStatusAtom = atom(
    (get) => {
        const { data } = get(getUserAtom);
        if (data?.error?.message === 'Authentication required') {
            return UserStatus.UNAUTHENTICATED;
        }
        if (!data?.data) {
            return UserStatus.UNKNOWN;
        }
        // Stale data is present during refetching, even if it errors out
        if (data?.data) {
            return UserStatus.AUTHENTICATED;
        }
    }
);

const userIdAtom = atom(
    (get) => {
        const { data } = get(getUserAtom);
        return data?.data?.id;
    }
);

const usernameAtom = atom(
    (get) => {
        const { data } = get(getUserAtom);
        return data?.data?.username;
    }
);

const userAvatarAtom = atom(
    (get) => {
        const { data } = get(getUserAtom);
        return {
            character: data?.data?.avatar_character,
            background: data?.data?.avatar_background
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

const userActionAtom = atom(
    // Returns the status of the last mutation atom that was submitted
    (get) => {
        const actions = [
            [UserAtomActions.Login, get(loginAtom)],
            [UserAtomActions.Register, get(registerAtom)],
            [UserAtomActions.Update, get(updateUserAtom)],
            [UserAtomActions.UpdatePassword, get(updatePasswordAtom)],
            [UserAtomActions.Logout, get(logoutAtom)]
        ];

        const sortedActions =  actions.sort(([, { submittedAt: a }], [, { submittedAt: b }]) => b - a);

        if (sortedActions[0][1]?.isPending) {
            return {
                action: sortedActions[0][0],
                isPending: sortedActions[0][1]?.isPending,
                error: null
            };
        }

        if (sortedActions[0][1]?.error) {
            return {
                action: sortedActions[0][0],
                error: sortedActions[0][1]?.error,
                isPending: false
            };
        }

        return {
            action: null,
            error: null,
            isPending: false
        };
    },
    async (get, set, update) => {
        if (update?.action === UserAtomActions.Login) {
            const { mutateAsync } = get(loginAtom);
            await mutateAsync(update.data);
        }

        if (update?.action === UserAtomActions.Register) {
            const { mutateAsync } = get(registerAtom);
            await mutateAsync(update.data);
        }

        if (update?.action === UserAtomActions.Update) {
            const { mutateAsync } = get(updateUserAtom);
            await mutateAsync(update.data);
        }

        if (update?.action === UserAtomActions.UpdatePassword) {
            const { mutateAsync } = get(updatePasswordAtom);
            await mutateAsync(update.data);
        }

        if (update?.action === UserAtomActions.Logout) {
            const { mutateAsync } = get(logoutAtom);
            await mutateAsync();
        }

        const { data } = get(getUserAtom);
        await data.refetch();
    }
);

export {
    UserStatus,
    UserAtomActions,
    userStatusAtom,
    userIdAtom,
    usernameAtom,
    userAvatarAtom,
    userActionAtom
};