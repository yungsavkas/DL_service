export const captureFrame = (videoElement: HTMLVideoElement, time: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log('Setting currentTime to:', time);

        videoElement.currentTime = time;

        const handleCanPlay = () => {
            console.log('canplay event fired at time:', videoElement.currentTime);
            videoElement.removeEventListener('canplay', handleCanPlay);

            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                console.log('Drawing frame on canvas');
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const frameData = canvas.toDataURL('image/png');
                resolve(frameData);
            } else {
                reject('Failed to get canvas context');
            }
        };

        videoElement.addEventListener('canplay', handleCanPlay);

        videoElement.onerror = (error) => {
            reject(`Error while seeking video: ${error}`);
        };

        // Пробуем кратковременно запустить воспроизведение и сразу остановить
        videoElement.play().then(() => {
            videoElement.pause();
        }).catch((error) => {
            console.error('Error playing video:', error);
            reject(error);
        });
    });
};