import React from 'react';
import { Input } from '@nextui-org/react';

interface FileInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ onChange }) => {
    return <Input type="file" accept="video/*" onChange={onChange} />;
};
