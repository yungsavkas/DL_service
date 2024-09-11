import os
import json
import threading
from flask import Flask, request, jsonify
from ultralytics import YOLO
import torch
import numpy as np
from PIL import Image
from tqdm import tqdm
from pymongo import MongoClient
from bson.objectid import ObjectId
import time

app = Flask(__name__)

# Подключение к MongoDB
client = MongoClient("mongodb://root:example@mongo:27017/?authSource=admin")
db = client.image_processing  # Используем базу данных image_processing
collection = db.jobs  # Коллекция для хранения задач

# Загрузка моделей YOLO
model_yolov5 = torch.hub.load('ultralytics/yolov5', 'yolov5s', force_reload=False)  # YOLOv5
model_yolov8m_custom = YOLO("640m.pt")  # Кастомная YOLOv8

def load_images_from_folder(folder_path):
    images = []
    for filename in os.listdir(folder_path):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(folder_path, filename)
            try:
                img = Image.open(img_path).convert('RGB')
                images.append((filename, img))
            except Exception as e:
                print(f"Не удалось загрузить изображение {filename}: {e}")
    return images


def process_images(folder_path, job_id, model_type='all'):
    images = load_images_from_folder(folder_path)
    results = {}
    count = 0

    for filename, img in tqdm(images, desc="Processing images", unit="image"):
        result_info = {}
        percent_complete = int((count + 1) / len(images) * 100)
        count = count + 1

        collection.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': {'load': percent_complete}}
        )

        if model_type in ['all', 'yolov5']:
            results_yolov5 = model_yolov5(img)
            result_info['yolov5'] = []
            for *box, conf, cls in results_yolov5.xyxy[0]:
                result_info['yolov5'].append({
                    'box': [float(x) for x in box],
                    'confidence': float(conf),
                    'class': int(cls),
                    'name': model_yolov5.names[int(cls)]
                })

        if model_type in ['all', 'yolov8']:
            results_yolov8m_custom = model_yolov8m_custom(img)
            result_info['yolov8m_custom'] = []
            for i, box in enumerate(results_yolov8m_custom[0].boxes.xyxy):
                x1, y1, x2, y2 = map(int, box[:4])
                result_info['yolov8m_custom'].append({
                    'box': [x1, y1, x2, y2],
                    'confidence': float(results_yolov8m_custom[0].boxes.conf[i]),
                    'class': int(results_yolov8m_custom[0].boxes.cls[i]),
                    'name': results_yolov8m_custom[0].names[int(results_yolov8m_custom[0].boxes.cls[i])]
                })

        results[filename] = result_info

    collection.update_one(
        {'_id': ObjectId(job_id)},
        {'$set': {'status': 'completed', 'results': results}}
    )


def process_images_async(folder_path, job_id):
    try:
        process_images(folder_path, job_id)
    except console as e:
        collection.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': {'status': 'failed', 'error': str(e)}}
        )


@app.route('/upload', methods=['POST'])
def upload_images():
    folder_path = request.form.get('folder_path')
    job_id = request.form.get('job_id')

    if not folder_path or not os.path.isdir(folder_path):
        return "Invalid or missing folder path", 400

    # Создаем запись в БД с начальным статусом
    # job_id = collection.insert_one({
    #     'create_time': time.time(),
    #     'folder_name': str(folder_path),
    #     'status': 'pending',
    #     'results': None
    # }).inserted_id

    # Отправляем ответ с job_id сразу
    response = jsonify({'status': 'Job создан.', 'job_id': str(job_id)})
    
    # Запускаем асинхронную обработку изображений
    threading.Thread(target=process_images_async, args=(folder_path, job_id)).start()

    return response, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
