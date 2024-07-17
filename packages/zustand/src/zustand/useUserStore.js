import { create } from 'zustand';

import { UserStatus } from '@timo/common/context/UserContextProvider';
import { getUser, logout } from '@timo/common/api';

const useUserStore = create((set) => ({
    status: UserStatus.UNKNOWN,
    data: null,
    error: null,
    fetchUser: async () => {
        try {
            const user = await getUser();
            set({ status: UserStatus.AUTHENTICATED, data: user, error: null });
        } catch (error) {
            set({ status: UserStatus.UNAUTHENTICATED, error });
        }
    },
    setUser: (user) => {
        set({ status: UserStatus.AUTHENTICATED, data: user });
    },
    clearUser: async () => {
        try {
            await logout();
            set({ status: UserStatus.UNAUTHENTICATED, data: null });
        } catch (error) {
            set({ error });
        }
    }
}));

// Initially fetch the user
useUserStore.getState().fetchUser();

export default useUserStore;