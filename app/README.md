# Image Processing API with YOLO and MongoDB

This repository contains a Flask-based API that processes images using YOLOv5 and a custom YOLOv8 model. The processed data is stored in a MongoDB database, and the processing happens asynchronously, allowing the user to upload image folders and receive results in real-time.

## Features

- **Image Processing with YOLOv5**: Detects objects in images using the pre-trained YOLOv5 model.
- **Custom YOLOv8 Model**: Supports object detection using a custom-trained YOLOv8 model.
- **Asynchronous Processing**: Images are processed asynchronously, and the status is updated in the database.
- **MongoDB Integration**: Stores job status, processing progress, and results in a MongoDB database.

## Requirements

- **Python 3.8+**
- **Flask**: Web framework for the API.
- **Ultralytics YOLO**: Library for YOLO model handling.
- **PIL**: For image loading and processing.
- **MongoDB**: For storing job statuses and results.
- **TQDM**: For progress tracking.
- **PyTorch**: Required by the YOLO models.
- **torchvision**: Required by YOLOv5.

## Setup

<!-- 1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/image-processing-api
    cd image-processing-api
    ``` -->

2. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Set up MongoDB (ensure it's running and accessible):
    ```bash
    docker run -d -p 27017:27017 --name mongo -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo
    ```

4. Run the Flask application:
    ```bash
    python app.py
    ```

## API Endpoints

### `/upload` (POST)

- **Description**: Starts the asynchronous processing of images from a folder.
- **Request**:
  - `folder_path` (string): Path to the folder containing the images.
  - `job_id` (string): ID for the job (used to track progress).
  
- **Response**: 
  - `status` (string): Message indicating that the job has been created.
  - `job_id` (string): The ID of the job.

### MongoDB Collection Structure

The MongoDB collection `jobs` stores the following information:

- `create_time`: Timestamp of when the job was created.
- `folder_name`: The folder path for the images.
- `status`: The current status of the job (`pending`, `completed`, or `failed`).
- `load`: Percentage of the job completed.
- `results`: A dictionary containing the detection results for each image.

## YOLO Models

This project uses two YOLO models:

- **YOLOv5**: Loaded from the `ultralytics/yolov5` repository via `torch.hub`.
- **Custom YOLOv8**: A custom-trained model loaded using the `ultralytics` library. The model file is named `640m.pt`.

## Usage

1. Upload images by sending a `POST` request to `/upload` with the path to the image folder and a job ID. Example:
    ```bash
    curl -X POST -F "folder_path=/path/to/images" -F "job_id=your-job-id" http://localhost:5000/upload
    ```

2. The server will process the images asynchronously and update the job status in the MongoDB database.

## Error Handling

If there is an issue processing the images, the job status is updated to `failed`, and the error is logged in the database under the `error` field.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Ultralytics](https://github.com/ultralytics/yolov5) for providing the YOLO models.
- [Flask](https://flask.palletsprojects.com/en/2.1.x/) for the web framework.
- [MongoDB](https://www.mongodb.com/) for database management.
