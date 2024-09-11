import { Request, Response } from "express";
import Video from "../models/videoModel";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import ffmpeg from 'fluent-ffmpeg';
import axios from "axios";

interface AIResponse {
    job_id: string;
}

const getFps = (speed: string): number => {
    switch (speed) {
        case "slow":
            return 1;
        case "optimized":
            return 3;
        case "fast":
            return 5;
        default:
            return 3;
    }
};

const videoCrop = (inputPath: string, framesDir: string, fps: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .fps(fps)
            .on('end', () => {
                console.log('Successful cropped');
                resolve(); // Успешное завершение
            })
            .on('error', (err: Error) => {
                console.error('Error processing video:', err.message);
                reject(err); // Обработка ошибки
            })
            .save(path.join(framesDir, '%d.png'));
    });
};

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
    const { speed = "optimized", classes } = req.body;

    if (!req.file) {
        res.status(400).json({ status: 'error', message: "No video file provided" });
        return;
    }
    if (!classes) {
        res.status(400).json({ status: 'error', message: "No classes provided" });
        return;
    }
    try {
        const dir = req.file?.destination.split('/').pop();
        const fps = getFps(speed);
        const obj = await Video.create({folder_name: `uploads/${dir}/frames/`, fps: fps, classes: JSON.parse(classes)});
        console.log('SEND ID')
        res.status(200).json({ status: 'success', id: obj._id });

        const framesDir = path.join(req.file.destination, 'frames');

        if (!fs.existsSync(framesDir)) {
            fs.mkdirSync(framesDir, { recursive: true });
        }

       
        console.log('START CROP')
        await videoCrop(req.file.path, framesDir, fps);
        console.log('END CROP')
        const formData = new FormData();
        console.log('START SEND TO AI');
        formData.append('folder_path', `uploads/${dir}/frames/`);
        formData.append('job_id', `${obj._id}`);
        const aiResponse = await axios.post<AIResponse>('http://web_service:5000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('END SEND TO AI');
        
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error" });
    }

};

export const getStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
             res.status(400).json({ message: "Invalid video ID" });
            return;
        }
        const video = await Video.findById(id);

        if (!video) {
            res.status(404).json({ message: "Video not found" });
            return;
        }

        res.status(200).json({ status: video.status , load: video.load });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" });
    }
};

export const getResults = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid video ID" });
            return;
        }

        const video = await Video.findById(id);

        if (!video) {
            res.status(404).json({ message: "Video not found" });
            return;
        }

        if (video.status !== "completed") {
            res.status(400).json({ message: "Analysis not completed yet" });
            return;
        }

        res.status(200).json(video);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {

    try {
        const video = await Video.find();
        res.status(200).json({ video });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" });
    }
};
export const getVideo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
       
        const video = await Video.findById(id);
        if (!video) {
             res.status(404).json({message: 'Video not found'});
             return
        }
        res.status(200).json({ video });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" });
    }
};