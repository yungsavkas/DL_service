import React from 'react';
import {useVideo, VideoUploadForm} from '../../features/videoUpload';
import { motion } from 'framer-motion';
import { DetectionClassesCheckboxes} from "../../features/checkboxGroup";
import {ProcessingSpeedRadio} from "../../features/radioGroup";
import {Button} from "@nextui-org/react";
import { useValidateForm } from '../../shared/lib/validate';

const VideoUploadPage: React.FC = () => {

    const { video, loading, uploadVideo, submitLoading } = useVideo();
    const isFormValid = useValidateForm();

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] p-6">
            <motion.div
                className="flex justify-center p-[20px] w-full lg:w-[40%]"
                initial={{ width: '100%'}}
                animate={{ width: video && !loading ? '100%' : '100%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            >
                <VideoUploadForm />
            </motion.div>

            {video && !loading && (
                <motion.div
                    className="flex flex-col gap-[28px] p-[20px] w-full lg:w-[60%]"
                    initial={{ width: '0%', opacity: 0, x: 100 }}
                    animate={{ width: '100%', opacity: 1, x: 0  }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <DetectionClassesCheckboxes />
                    <ProcessingSpeedRadio />

                    <Button
                        isLoading={submitLoading}
                        onClick={uploadVideo}
                        isDisabled={!isFormValid}
                        size="lg"
                        color="secondary"
                        variant="shadow"
                        className="font-medium w-[220px] bg-gradient-to-tr from-blue-700 to-purple-950 text-white shadow-lg"
                    >
                        Start analyze
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default VideoUploadPage;
