import { makeAutoObservable } from 'mobx';
import { getUser } from '@timo/common/api';
import { UserStatus } from '@timo/common/context/UserContextProvider';

export class User {
    status = UserStatus.UNKNOWN;
    // has to be a normal property and not private for makeAutoObservable to make it observable
    data = {
        id: null,
        username: null,
        avatar_character: null,
        avatar_background: null
    };
    error = null;

    constructor() {
        makeAutoObservable(this);
        this.fetch();
    }

    // MobX in React strict mode requires all mutations to happen within actions
    setUser = (user) => {
        this.status = UserStatus.AUTHENTICATED;
        this.error = null;

        // Mutate the object so that MobX doesn't update everything subscribed to data
        this.data.id = user.id;
        this.data.username = user.username;
        this.data.avatar_character = user.avatar_character;
        this.data.avatar_background = user.avatar_background;
    };

    // Promise callbacks also need to be wrapped like this to prevent strict mode warning
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
        this.status = UserStatus.UNAUTHENTICATED;
        this.error = null;

        this.data.id = null;
        this.data.username = null;
        this.data.avatar_character = null;
        this.data.avatar_background = null;
    };
}

class UserSingleton {
    static #instance = new User();

    static get instance() {
        return this.#instance;
    }
}

export default UserSingleton;
