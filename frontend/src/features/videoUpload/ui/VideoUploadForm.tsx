import React from 'react';
import { Input, Button, CircularProgress } from '@nextui-org/react';
import { useVideo } from '../model/events';

export const VideoUploadForm: React.FC = () => {
    const { video, loading, handleVideoChange } = useVideo();
    const [dragging, setDragging] = React.useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('enter upload');
        if (event.target.files && event.target.files.length > 0) {
            handleVideoChange(event.target.files[0]);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            handleVideoChange(event.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full max-w-[500px]">
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={"shadow-lg p-[40px]"}
                style={{
                    border: dragging ? '2px dashed #0070f3' : !video ? '2px dashed #cccccc' : '1px solid rgb(243, 244, 246)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'border-color 0.3s ease-in-out',
                    backgroundColor: dragging ? 'rgba(0,190,255,0.2)' : '',
                }}
            >
                {loading ? (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size="lg" aria-label="Loading..." style={{marginBottom: '20px'}}/>
                    </div>
                ) : video ? (
                    // Здесь выводим загруженное видео
                    <video 
                        controls 
                        style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
                        src={URL.createObjectURL(video)}
                    />
                ) : (
                    <>
                        <svg className="w-[48px] fill-[#989eaa] inline mb-[12px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M14 13v4h-4v-4H7l5-5 5 5z"></path>
                        </svg>
                        <p className={"mb-[20px]"} style={{ color: dragging ? '#0070f3' : '#888' }}>
                            {dragging ? 'Drop your video here' : 'Drag & Drop your video here or click to upload'}
                        </p>
                    </>

                )}

                <Button className={"font-medium"} color="primary" variant="shadow" onClick={() => document.getElementById('file-upload-input')?.click()}>
                    {!video ? 'Choose file' : 'Choose new file'}
                </Button>

                <Input
                    id="file-upload-input"
                    type="file"
                    accept="video/*,video/quicktime"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};
