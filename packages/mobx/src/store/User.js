import { makeAutoObservable } from 'mobx';
import { getUser } from '@timo/common/api';
import { UserStatus } from '@timo/common/context/UserContextProvider';

export class User {
    status = UserStatus.UNKNOWN;
    // has to be a normal property and not private for makeAutoObservable to make it observable
    data = null;
    error = null;

    constructor() {
        makeAutoObservable(this);
        this.fetch();
    }

    // MobX in React strict mode requires all mutations to happen within actions
    setUser = (user) => {
        this.status = UserStatus.AUTHENTICATED;
        this.data = user;
        this.error = null;
    };

    // Promise callbacks also need to be wrapped like this to prevent warning
    setError = (error) => {
        this.status = UserStatus.UNAUTHENTICATED;
        this.error = error;
    };

    fetch = () => {
        getUser()
            .then(this.setUser)
            .catch(this.setError);
    };

    clear = () => {
        this.status = UserStatus.UNKNOWN;
        this.data = null;
        this.error = null;
    };
}

class UserSingleton {
    static #instance = new User();

    static get instance() {
        return this.#instance;
    }
}

export default UserSingleton;
