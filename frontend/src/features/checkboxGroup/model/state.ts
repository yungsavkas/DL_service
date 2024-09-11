import { atom } from 'recoil';

export const selectedDetectionClasses = atom<string[]>({
    key: 'detectionClasses',
    default: [],
});

export const selectedOutputFormat = atom<string[]>({
    key: 'outputFormat',
    default: ['frames'],
});


