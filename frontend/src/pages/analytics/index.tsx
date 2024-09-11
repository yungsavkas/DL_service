import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { IVideo } from '../../types/interfaces';
import { CircularProgress, Progress, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, Spacer, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";

const COLORS = ['#0088FE', '#00C49F']; // Цвета для классов

const prepareDataForPieChart = (classes: string[], framesData: Record<string, number>, totalFrames: number, colorMap: Record<string, string>) => {
    return classes.map((item) => ({
        name: item,
        value: framesData[item],
        percentage: ((framesData[item] / totalFrames) * 100).toFixed(2),
        color: colorMap[item] || '#000', // Привязываем цвет к классу через colorMap
    }));
};

interface FrameData {
    all: any[];
    nude: any[];
    [key: string]: any[];
}

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [video, setVideo] = useState<IVideo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showProgress, setShowProgress] = useState<boolean>(true);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]); // Храним выбранные классы
    const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
    const canvasRefs = useRef<Map<string, HTMLCanvasElement | null>>(new Map());
    const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState('5xl');

    // Маппинг цветов для классов
    const colorMap: Record<string, string> = video ? video.classes.reduce((acc, className, index) => {
        acc[className] = COLORS[index % COLORS.length];
        return acc;
    }, {} as Record<string, string>) : {};

    useEffect(() => {
        const eventSource = new EventSource(`http://79.175.45.64:8000/api/video/${id}`);
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setVideo(data.video);
            if (isLoading) {
                setIsLoading(false);
            }
            if (data.video.load === 100) {
                setShowProgress(false);
            }
            if (data.video.status === 'completed' && data.video.load === 100) {
                eventSource.close();
                setTimeout(() => {
                    setShowProgress(false);
                }, 500);
                setSelectedClasses(data.video.classes); // Устанавливаем выбранными все классы по умолчанию
            }
        };
        return () => {
            eventSource.close();
        };
    }, [id, isLoading]);

    const drawBoxes = (frameData: FrameData, imageUrl: string, canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d');
        const image = new Image();
    
        image.src = imageUrl;
        image.onload = () => {
            context!.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = image.width;
            canvas.height = image.height;
            context!.drawImage(image, 0, 0);
    
            // Перебор объектов по классам
            Object.entries(frameData).forEach(([className, objects]: [string, any[]]) => {
                if (selectedClasses.includes(className)) {
                    objects.forEach((obj: any) => {
                        const [x1, y1, x2, y2] = obj.box;
                        
                        // Рассчитываем ширину и высоту
                        const width = x2 - x1;
                        const height = y2 - y1;
    
                        // Назначаем цвет для объекта в зависимости от его типа через colorMap
                        const color = colorMap[className] || '#000';
    
                        // Рисуем прямоугольник
                        context!.strokeStyle = color;
                        context!.lineWidth = 4;
                        context!.strokeRect(x1, y1, width, height);
    
                        // Подпись объекта
                        const labelText = `${obj.name} (${(obj.confidence * 100).toFixed(2)}%)`;
                        context!.font = '16px Arial';
                        const textWidth = context!.measureText(labelText).width;
                        const textHeight = 20; // Высота текста
    
                        // Рисуем залитый фон под текстом
                        context!.fillStyle = color;
                        context!.fillRect(x1, y1 - textHeight - 4, textWidth + 6, textHeight);
    
                        // Рисуем сам текст черным цветом
                        context!.fillStyle = '#000000';
                        context!.fillText(labelText, x1 + 3, y1 - 6);
                    });
                }
            });
        };
    };
    

    const handleOpen = (frame: string) => {
        setSelectedFrame(frame);
        const imageUrl = `http://79.175.45.64:8000/${video?.folder_name}${frame}`;
        const frameData = video?.results.filteredResults[frame];

        if (frameData && modalCanvasRef.current) {
            drawBoxes(frameData, imageUrl, modalCanvasRef.current);
        }
        setSize(size);
        onOpen();
    };

    useEffect(() => {
        if (isOpen && selectedFrame) {
            const imageUrl = `http://79.175.45.64:8000/${video?.folder_name}${selectedFrame}`;
            const frameData = video?.results.filteredResults[selectedFrame];
            if (frameData && modalCanvasRef.current) {
                drawBoxes(frameData, imageUrl, modalCanvasRef.current);
            }
        }
    }, [isOpen, selectedFrame]);

    useEffect(() => {
        if (video) {
            Object.keys(video.results.filteredResults).forEach((frameName) => {
                const frameData = video.results.filteredResults[frameName];
                const canvas = canvasRefs.current.get(frameName);

                if (canvas && frameData) {
                    const imageUrl = `http://79.175.45.64:8000/${video.folder_name}${frameName}`;
                    drawBoxes(frameData, imageUrl, canvas);
                }
            });
        }
    }, [video, selectedClasses]);

    if (isLoading) {
        return (
            <div style={{ height: 'calc(100vh - 65px)', padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
                <CircularProgress style={{ margin: '0 auto' }} size="lg" aria-label="Loading..." />
            </div>
        );
    }

    if (!video) {
        return <h2>Video not found</h2>;
    }

    const data = prepareDataForPieChart(video.classes, video.results.total.frames, video.framesCount, colorMap);

    // Фильтруем фреймы, оставляя только те, в которых есть боксы
    const filteredFrames = Object.keys(video.results.filteredResults).filter((frameName) => {
        const frameData = video.results.filteredResults[frameName];
        return Object.keys(frameData).some((className) => frameData[className].length > 0);
    });

    return (
        <div style={{ height: 'calc(100vh - 65px)', padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
            {video.load && showProgress && video.load < 100 && (
                <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: video.load === 100 ? 0 : 1, scale: video.load === 100 ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={() => {
                        if (video.load === 100) {
                            setShowProgress(false);
                        }
                    }}
                >
                    <Progress
                        size="md"
                        radius="md"
                        style={{ width: '100%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
                        label="Progress"
                        value={video.load}
                        showValueLabel={true}
                    />
                </motion.div>
            )}

            {video.status === 'completed' && (
                <>
                    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#0070F3' }}>Video Analysis Statistics</h1>
                        <Spacer y={3} />

                        <Card style={{ padding: '20px', marginBottom: '30px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
                        
                            <div style={{ display: 'flex', gap:'20px' }}>
                                <div style={{ padding: '20px', width: '40%' }}>
                                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: 'rgb(108 181 242)' }}>Total Frames: {video.framesCount}</h2>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(108 181 242)' }}>Detected Frames: {filteredFrames.length} ({(filteredFrames.length * 100 / video.framesCount).toFixed(2)}%)</h3>
                                    <Spacer y={1} />
                                    <div>
                                        {video.classes.map((item, index) => (
                                            <div key={index} style={{ marginBottom: '10px' }}>
                                                <p><strong>{item}:</strong> {video.results.total.frames[item]}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: 'rgb(108 181 242)' }}> Total Objects: {Object.values(video.results.total.objects).reduce((sum: number, item: any) => sum + item, 0)}</h2>
                                    <Spacer y={1} />
                                    <div>
                                        {video.classes.map((item, index) => (
                                            <div key={index} style={{ marginBottom: '10px' }}>
                                                <p><strong>{item}: </strong> {video.results.total.objects[item]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                               
                                <PieChart width={600} height={400}>
                                <Pie
                                    data={data}
                                    cx={300}
                                    cy={200}
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle" 
                                    wrapperStyle={{ paddingLeft: '30px' }} 
                                />
                            </PieChart>


                              
                            </div>
                        </Card>

                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0070F3' }}>Select Classes to Display</h3>
                            <CheckboxGroup
                                orientation="horizontal"
                                value={selectedClasses}
                                onChange={setSelectedClasses}
                            >
                                {video.classes.map((className, index) => (
                                    <Checkbox key={index} value={className} color="primary" size="lg">
                                        {className}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {filteredFrames.map((frameName, index) => (
                                <div
                                key={index}
                                style={{
                                    flex: '1 1 calc(20% - 10px)', // 20% ширины для каждого кадра
                                    minWidth: 'calc(20% - 10px)', // Минимальная ширина, чтобы избежать расширения
                                    flexGrow: 0, // Отключаем возможность расширения
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleOpen(frameName)}
                                >
                                <Card style={{ padding: '10px' }}>
                                    <canvas
                                    ref={(el) => {
                                        canvasRefs.current.set(frameName, el);
                                    }}
                                    style={{ width: '100%', borderRadius: '10px' }}
                                    />
                                </Card>
                                </div>
                            ))}
                        </div>


                        <Modal isOpen={isOpen} onClose={onClose} size='full'>
                        <ModalContent>
                            <ModalHeader>
                                {/*@ts-ignore*/}
                                <h2 id="modal-title">Frame: {selectedFrame} - {selectedFrame && (video?.results?.filteredResults[selectedFrame]['time']).toFixed(2)} sec</h2>
                            </ModalHeader>
                            <ModalBody className="flex justify-center items-center">  {/* Центрируем изображение */}
                                <canvas
                                    ref={modalCanvasRef}
                                    style={{
                                        maxWidth: '100%', // Ограничиваем максимальную ширину
                                        maxHeight: '85vh', // Ограничиваем максимальную высоту на весь экран
                                        objectFit: 'contain', // Сохраняем пропорции и не обрезаем изображение
                                        borderRadius: '10px'
                                    }}
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoPage;
