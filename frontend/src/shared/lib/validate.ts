import { useRecoilValue } from 'recoil';
import {
    selectedOutputFormat,
    selectedDetectionClasses,
} from '../../features/checkboxGroup/model/state';

import { selectedSpeed } from '../../features/radioGroup/model/state';

export const useValidateForm = (): boolean => {
    const speed = useRecoilValue(selectedSpeed);
    const outputFormat = useRecoilValue(selectedOutputFormat);
    const detectionClasses = useRecoilValue(selectedDetectionClasses);

    return (
        speed.length > 0 &&
        outputFormat.length > 0 &&
        detectionClasses.length > 0
    );
};
