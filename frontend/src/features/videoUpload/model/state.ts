import { atom } from 'recoil';

export const videoState = atom<File | null>({
    key: 'videoState',
    default: null,
});

export const thumbnailsState = atom<string[]>({
    key: 'thumbnailsState',
    default: [],
});

export const loadingState = atom<boolean>({
    key: 'loadingState',
    default: false,
});
