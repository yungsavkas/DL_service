export interface IVideo {
    _id: string;
    folder_name: string;
    status: "pending" | "completed" | "failed";
    results: any;
    createdAt: Date;
    updatedAt: Date;
    load: number;
    fps: number;
    framesCount: number;
    classes: [];
}
