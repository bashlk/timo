import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { getUser, logout } from '@timo/common/api';
import { UserStatus } from '@timo/common/context/UserContextProvider';

const getUserAtom = loadable(atomWithQuery(() => ({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false
})));

const logoutAtom = atomWithMutation(() => ({
    mutationFn: logout
}));

export const UserAtomActions = {
    Refresh: 'refresh',
    Logout: 'logout'
};

const userStatusAtom = atom(
    (get) => {
        const { data } = get(getUserAtom);
        if (data?.error?.message === 'Authentication required') {
            return UserStatus.UNAUTHENTICATED;
        }
        // Stale data is present during refetching, even if it errors out
        if (!data.isFetching && data?.data) {
            return UserStatus.AUTHENTICATED;
        }
        return UserStatus.UNKNOWN;
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

const userActionAtom = atom(
    null,
    async (get, set, update) => {
        const { data } = get(getUserAtom);
        if (update?.action === UserAtomActions.Refresh) {
            await data.refetch();
        }
        if (update?.action === UserAtomActions.Logout) {
            const { mutateAsync } = get(logoutAtom);
            await mutateAsync();
            await data.refetch();
        }
    }
);

export {
    UserStatus,
    userStatusAtom,
    userIdAtom,
    usernameAtom,
    userAvatarAtom,
    userActionAtom
};