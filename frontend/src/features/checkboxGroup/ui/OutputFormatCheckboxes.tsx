import React from 'react';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import {useRecoilState} from "recoil";
import {selectedOutputFormat} from "../model/state";

export const OutputFormatCheckboxes: React.FC = () => {
    const [selectedValues, setSelectedValues] = useRecoilState(selectedOutputFormat);

    const handleChange = (values: string[]) => {
        setSelectedValues(values);
    };

    return (
            <CheckboxGroup
                orientation="horizontal"
                label="Output format"
                value={selectedValues}
                onChange={handleChange}
            >
                <Checkbox value="frames">Frames</Checkbox>
                <Checkbox value="json">JSON</Checkbox>
            </CheckboxGroup>
    );
};
