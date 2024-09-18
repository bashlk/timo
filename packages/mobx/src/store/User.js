import { getUser } from '@timo/common/api';
import { UserStatus } from '@timo/common/context/UserContextProvider';
import { makeAutoObservable } from 'mobx';

class User {
    status = UserStatus.UNKNOWN;
    data = null;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetch() {
        getUser()
            .then((user) => {
                this.status = UserStatus.AUTHENTICATED;
                this.data = user;
                this.error = null;
            })
            .catch((error) => {
                this.status = UserStatus.UNAUTHENTICATED;
                this.error = error;
            });
    }

    clear() {
        this.status = UserStatus.UNKNOWN;
        this.data = null;
        this.error = null;
    }
}

export default User;