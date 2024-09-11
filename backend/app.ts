import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import videoRoutes from "./routes/videoRoutes";
import cors from 'cors';
import path from "path";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, '/uploads');
app.use('/uploads', express.static(uploadsDir));

app.use(videoRoutes);

const PORT =  8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
