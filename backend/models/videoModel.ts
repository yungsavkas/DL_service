import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
    folder_name: string;
    status: "pending" | "completed" | "failed";
    results: any;
    createdAt: Date;
    updatedAt: Date;
    load: number;
    fps: number;
}

const videoSchema: Schema = new mongoose.Schema({
    folder_name: {
        type: String,
        required: true,
    },
    classes: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    results: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    load : {
        type: Number,
        default: 0,
    },
    fps: {
        type: Number
    }
},{
    timestamps: true
})

const Video = mongoose.model<IVideo>("Video", videoSchema, "jobs");

export default Video;
