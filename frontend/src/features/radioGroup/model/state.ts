import {atom} from "recoil";

export const selectedSpeed = atom<string>({
    key: 'detectionSpeed',
    default: 'optimized',
});