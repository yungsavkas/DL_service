import { uploadVideo, getStatus, getResults, getHistory , getVideo} from "../controllers/videoController";
import multer from "multer";
import express from "express";
import fs from "fs";
import path from "path";
import Video from "../models/videoModel";
import { filterResults } from "../utils/arrayUtils";

const router = express.Router();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Начало создания директории');
        const timestamp = Date.now();
        const videoDir = path.join(uploadsDir, `video-${timestamp}`);

        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }
        console.log('Директория создана:', videoDir);
        cb(null, videoDir);
    },
    filename: (req, file, cb) => {
        console.log('Начало сохранения файла');
        cb(null, `video.${file.originalname.split('.')[1]}`);
    },
});

const upload = multer({ storage });

router.post("/api/analyze", (req, res, next) => {
    console.log('Начало загрузки файла');
    next();
}, upload.single("video"), uploadVideo);
router.get("/api/video", getHistory);
router.get("/api/status/:id", getStatus);
router.get("/api/results/:id", getResults);

router.get('/api/video/:id', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { id } = req.params;

    try {
        const video = await Video.findById(id);

        // Если видео не найдено, отправляем 404
        if (!video) {
            res.status(404).json({ message: 'Video not found' });
            return;
        }

        if (video.status === 'completed') {
           
            const filteredResults = filterResults(video.results || {}, video.fps);
            const filteredVideo = { 
                ...video.toObject(), 
                results: filteredResults, 
                framesCount: video.results ? Object.keys(video.results).length : 0 
            }; 
            res.write(`data: ${JSON.stringify({ video: filteredVideo })}\n\n`);
            res.end();
            return;
        }
        
        // Если видео в статусе pending, начинаем отправлять обновления
        const interval = setInterval(async () => {
            const updatedVideo = await Video.findById(id);
    
            if (updatedVideo) {
                const filteredResults = filterResults(updatedVideo.results || {}, updatedVideo.fps);
                const filteredVideo = { 
                    ...updatedVideo.toObject(), 
                    results: filteredResults, 
                    framesCount: updatedVideo.results ? Object.keys(updatedVideo.results).length : 0 
                }; 
                res.write(`data: ${JSON.stringify({ video: filteredVideo })}\n\n`);
            
                if (updatedVideo.status === 'completed') {
                    clearInterval(interval);
                    res.end();
                }
            }
            
        }, 500);

        // Очищаем интервал, если соединение закрыто клиентом
        req.on('close', () => {
            clearInterval(interval);
        });

    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
