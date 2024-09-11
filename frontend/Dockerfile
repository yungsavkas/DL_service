# Используем node для сборки приложения
FROM node:latest as build

# Устанавливаем рабочую директорию
WORKDIR /app


COPY . ./


FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Копируем файл конфигурации nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Проверяем, что файлы корректно скопированы в Nginx
RUN ls -la /usr/share/nginx/html

# Открываем порт 80 для сервера nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
