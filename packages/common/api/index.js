// API endpoints for php-crud-api
import ky from 'ky';

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_PATH
});

const requestWrapper = (request) => {
    return request
        .then(response => response.json())
        .catch(error => {
            if (error instanceof TypeError) {
                throw new Error('Failed to connect to server. Please try again later.');
            } else {
                return error.response.json().then(data => {
                    throw new Error(data.message);
                });
            }
        });
};

export const login = async ({ username, password }) => {
    return requestWrapper(
        api.post('login', {
            json: {
                username,
                password
            }
        })
    );
};

export const getUser = async () => {
    return requestWrapper(
        api.get('records/users')
    ).then(data => data.records[0]);
};

export const register = async ({ username, password }) => {
    return requestWrapper(
        api.post('register', {
            json: {
                username,
                password
            }
        })
    );
};

export const updateUser = async ({ id, username, avatar_character, avatar_background }) => {
    return requestWrapper(
        api.put(`records/users/${id}`, {
            json: {
                username,
                avatar_character,
                avatar_background
            }
        })
    );
};

export const updatePassword = async ({ username, password, newPassword }) => {
    return requestWrapper(
        api.post('password', {
            json: {
                username,
                password,
                newPassword
            }
        })
    );
};

export const logout = async () => {
    return requestWrapper(
        api.post('logout')
    );
};

export const listEntries = async ({ from, to } = {}) => {
    const searchParams = [];
    if (from) {
        searchParams.push(['filter', `start_time,ge,${from}`]);
    }
    if (to) {
        searchParams.push(['filter', `end_time,le,${to}`]);
    }
    return requestWrapper(
        api.get('records/entries', { searchParams })
    ).then(data => data.records);
};

export const createEntry = async ({ start_time, end_time, description, projectid }) => {
    return requestWrapper(
        api.post('records/entries', {
            json: {
                start_time,
                end_time,
                description,
                projectid
            }
        })
    );
};

export const updateEntry = async ({ id, start_time, end_time, description, projectid }) => {
    return requestWrapper(
        api.put(`records/entries/${id}`, {
            json: {
                start_time,
                end_time,
                description,
                projectid
            }
        })
    );
};

export const deleteEntry = async (id) => {
    return requestWrapper(
        api.delete(`records/entries/${id}`)
    );
};

export const createProject = async ({ name }) => {
    return requestWrapper(
        api.post('records/projects', {
            json: {
                name
            }
        })
    );
};