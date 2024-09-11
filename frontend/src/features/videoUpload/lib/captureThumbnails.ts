import { captureFrame } from './captureFrame';

const timeCode = [0.1, 0.25, 0.5, 0.75, 1];

export const captureThumbnails = async (
    videoUrl: string,
    setThumbnails: (frames: string[]) => void,
    setLoading: (loading: boolean) => void
) => {
    const videoElement = document.createElement('video');
    videoElement.src = videoUrl;
    videoElement.crossOrigin = 'anonymous'; // Убедитесь, что видео доступно для кросс-доменного доступа, если нужно

    videoElement.onloadedmetadata = async () => {
        console.log('onloadedmetadata');
        const duration = videoElement.duration;
        const times = timeCode.map(factor => duration * factor);
        const frames: string[] = [];

        for (const time of times) {
            try {
                const frame = await captureFrame(videoElement, time);
                frames.push(frame);
            } catch (error) {
                console.error(`Error capturing frame at time ${time}:`, error);
            }
        }

        setThumbnails(frames);
        setLoading(false);
    };

    videoElement.onerror = (error) => {
        console.error('Error loading video metadata:', error);
        setLoading(false);
    };
};