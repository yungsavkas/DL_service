## Running with Docker Compose

To simplify deployment and run the service using Docker Compose, follow the steps below:

### Steps to Run

1. Make sure you have Docker and Docker Compose installed. You can download Docker from the [official website](https://www.docker.com/get-started).

2. Clone the repository:
    ```bash
    git clone https://github.com/yungsavkas/DL_service.git
    cd DL_service
    ```

3. Ensure the `docker-compose.yml` file is present in the repository. This file defines how the service will be configured and run with Docker Compose.

4. Run the service using Docker Compose:
    ```bash
    docker-compose up -d
    ```

5. The service will be available at `http://localhost:3000`.

### Stopping the Service

To stop the service, run the following command:
```bash
docker-compose down
