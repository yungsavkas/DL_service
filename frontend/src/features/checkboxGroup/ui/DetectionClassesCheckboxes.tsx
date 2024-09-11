import React from 'react';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { useRecoilState } from 'recoil';
import { selectedDetectionClasses } from '../model/state';

export const DetectionClassesCheckboxes: React.FC = () => {
    const [selectedValues, setSelectedValues] = useRecoilState(selectedDetectionClasses);

    const handleChange = (values: string[]) => {
        setSelectedValues(values);
        console.log(selectedValues);
    };

    return (
        <CheckboxGroup
            label="Detection classes"
            value={selectedValues}
            onChange={handleChange}
        >
            <Checkbox  value="all">Yolo classes</Checkbox>
            <Checkbox  value="nude">Nudity scenes</Checkbox>

            <Checkbox isDisabled value="class1">Weapons</Checkbox>
            <Checkbox isDisabled value="class2">Alcohol</Checkbox>
            <Checkbox isDisabled value="class3">Tobacco</Checkbox>
            <Checkbox isDisabled value="class4">Violence</Checkbox>
            <Checkbox isDisabled value="class6">Forbidden texts or symbols</Checkbox>

            <p className="text-default-500 text-small pl-[28px]">Fintech</p>

            <Checkbox isDisabled value="class7">Crypto</Checkbox>
            <Checkbox isDisabled value="class8">Financial documents (credit cards, bank statements)</Checkbox>
            <Checkbox isDisabled value="class9">Financial institution logos</Checkbox>
            <Checkbox isDisabled value="class10">Transaction screens</Checkbox>
            <Checkbox isDisabled value="class11">Deceptive offers (“Fast loans”, “Easy money”)</Checkbox>
        </CheckboxGroup>
    );
};
