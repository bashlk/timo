// API endpoints for php-crud-api
import ky from 'ky';

const api = ky.create({
    prefixUrl: 'https://timer-app-api.frontendundefined.com'
});

export const getUser = async () => {
    return api.get('me');
};

export const login = async (username, password) => {
    return api.post('login', {
        json: {
            username,
            password
        }
    });
};

export const register = async (username, password) => {
    return api.post('register', {
        json: {
            username,
            password
        }
    });
};

export const listEntries = async () => {
    return api.get('records/entries');
};

export const createEntry = async ({ start_time, description, projectid }) => {
    return api.post('records/entries', {
        json: {
            start_time,
            description,
            projectid
        }
    });
};

export const updateEntry = async ({ id, start_time, end_time, description, projectid }) => {
    return api.put(`records/entries/${id}`, {
        json: {
            start_time,
            end_time,
            description,
            projectid
        }
    });
};

export const createProject = async ({ name }) => {
    return api.post('records/projects', {
        json: {
            name
        }
    });
};