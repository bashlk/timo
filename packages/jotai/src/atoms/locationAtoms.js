import { atom } from 'jotai';
import { atomWithLocation } from 'jotai-location';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const locationAtom = atomWithLocation();

const baseAwareLocationAtom = atom(
    (get) => ({
        ...get(locationAtom),
        pathname: get(locationAtom).pathname.split(BASE_URL)[1]
    }),
    (get, set, update) => {
        const updatedWithBase = { ...update, pathname: `${BASE_URL}${update.pathname}` };
        set(locationAtom, updatedWithBase);
    }
);

export {
    locationAtom,
    baseAwareLocationAtom
};