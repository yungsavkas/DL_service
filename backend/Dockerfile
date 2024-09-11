# Устанавливаем образ Node.js (можете использовать конкретную версию для стабильности, например, 18)
FROM node:latest

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если есть) в рабочую директорию
COPY package*.json ./
RUN apt-get update && apt-get install -y ffmpeg
# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Открываем порт 8000 для связи с контейнером
EXPOSE 8000

# Команда для запуска приложения
CMD ["npm", "run", "start"]
