// API endpoints for php-crud-api
import ky from 'ky';

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_PATH
});

export const getUser = async () => {
    // /me doesn't update when the user data is updated
    return api.get('records/users')
        .then(response => response.json())
        .then(data => data.records[0]);
};

export const login = async (username, password) => {
    return api.post('login', {
        json: {
            username,
            password
        }
    }).then(response => response.json());
};

export const register = async (username, password) => {
    return api.post('register', {
        json: {
            username,
            password
        }
    }).then(response => response.json());
};

export const updateUser = async ({ id, username, avatar_character, avatar_background }) => {
    return api.put(`records/users/${id}`, {
        json: {
            username,
            avatar_character,
            avatar_background
        }
    }).then(response => response.json());
};

export const updatePassword = async ({ username, password, newPassword }) => {
    return api.post('password', {
        json: {
            username,
            password,
            newPassword
        }
    }).then(response => response.json());
};

export const listEntries = async ({ from, to } = {}) => {
    const searchParams = [];
    if (from) {
        searchParams.push(['filter', `start_time,ge,${from}`]);
    }
    if (to) {
        searchParams.push(['filter', `end_time,le,${to}`]);
    }
    return api.get('records/entries', { searchParams })
        .then(response => response.json())
        .then(data => data.records);
};

export const createEntry = async ({ start_time, end_time, description, projectid }) => {
    return api.post('records/entries', {
        json: {
            start_time,
            end_time,
            description,
            projectid
        }
    }).then(response => response.json());
};

export const updateEntry = async ({ id, start_time, end_time, description, projectid }) => {
    return api.put(`records/entries/${id}`, {
        json: {
            start_time,
            end_time,
            description,
            projectid
        }
    }).then(response => response.json());
};

export const deleteEntry = async (id) => {
    return api.delete(`records/entries/${id}`);
};

export const createProject = async ({ name }) => {
    return api.post('records/projects', {
        json: {
            name
        }
    }).then(response => response.json());
};