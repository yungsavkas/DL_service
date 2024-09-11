import {useRecoilState} from 'recoil';
import { videoState, thumbnailsState, loadingState } from './state';
import { captureThumbnails } from '../lib/captureThumbnails';
import {selectedSpeed} from "../../radioGroup/model/state";
import {selectedDetectionClasses, selectedOutputFormat} from "../../checkboxGroup/model/state";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const useVideo = () => {
    const [video, setVideo] = useRecoilState(videoState);
    const [thumbnails, setThumbnails] = useRecoilState(thumbnailsState);
    const [loading, setLoading] = useRecoilState(loadingState);

    const [speed, setSpeed] = useRecoilState(selectedSpeed);
    const [detectionClasses, setClasses] = useRecoilState(selectedDetectionClasses);

    const [submitLoading, setSubLoading] = useState(false);

    const navigate = useNavigate();

    const handleVideoChange = async (file: File) => {
        setVideo(file);
        const url = URL.createObjectURL(file);
        
       // setLoading(true);
       // await captureThumbnails(url, setThumbnails, setLoading);
    };

    const uploadVideo = async () => {
        try {

            setSubLoading(true);
            const formData = new FormData();
            
            // @ts-ignore
            formData.append('video', video); // Где 'video' — это файл видео
            formData.append('speed', speed); // Например, если это строка или число
            formData.append('classes', JSON.stringify(detectionClasses)); // Если это массив или объект, преобразуем в JSON

            const response = await axios.post('http://79.175.45.64:8000/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setVideo(null);
            setThumbnails([]);
            setSpeed('optimized');
            setClasses([]);
            setSubLoading(false);
            navigate(`/history/${response.data.id}`);

        } catch (error) {
            console.error('Ошибка при отправке видео:', error);
        } finally {
            setSubLoading(false);
        }
    };


    return { video, thumbnails, loading, handleVideoChange, uploadVideo, submitLoading };
};
