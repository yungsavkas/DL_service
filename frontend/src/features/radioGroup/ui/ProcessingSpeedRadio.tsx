import React from 'react';
import {RadioGroup, Radio} from "@nextui-org/react";
import {useRecoilState} from "recoil";
import {selectedSpeed} from "../model/state";

export const ProcessingSpeedRadio: React.FC = () => {
    const [selectedValue, setSelectedValue] = useRecoilState(selectedSpeed);

    const handleChange = (value: string) => {
        setSelectedValue(value);
    };
    return (
        <RadioGroup
            label="Processing Speed"
            orientation="horizontal"
            defaultValue="optimized"
            value={selectedValue}
            onValueChange={handleChange}
        >
            <Radio value="slow">Slow <span className={"opacity-50"}>(1 fps)</span></Radio>
            <Radio value="optimized">Optimized  <span className={"opacity-50"}>(3 fps)</span></Radio>
            <Radio value="fast">Fast  <span className={"opacity-50"}>(5 fps)</span></Radio>
        </RadioGroup>
    );
};
