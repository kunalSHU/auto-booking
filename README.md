# Auto-Booking Application

This project consists of a React frontend and a Node.js (Express) backend, containerized using Docker.

## TO Run both Front-end and Back-end:
** `npm run dev` **

## Setup Database in your local machine
RUN `server/db_schema/schema_override.sh` from project directory
* Make sure to change .env credentials to yours


# EXTRA INFO:
## Project Structure

-   `Dockerfile.frontend`: Defines the Docker image for the React frontend.
-   `Dockerfile.backend`: Defines the Docker image for the Node.js backend.
-   `docker-compose.yml`: Configures the services for Docker Compose.
-   `src/`: Contains the React frontend application code.
-   `server/`: Contains the Node.js backend application code.

## Building Docker Images
You can build the Docker images for the frontend and backend services individually using the `docker build` command.

**1. Build the Frontend Image:**
Navigate to the project root directory (`/Users/kunalshukla/auto-booking/`) and run:

```bash
docker build -t auto-booking-frontend -f Dockerfile.frontend .
```

This command:
-   `-t auto-booking-frontend`: Tags the image as `auto-booking-frontend`.
-   `-f Dockerfile.frontend`: Specifies that `Dockerfile.frontend` should be used for building.
-   `.`: Sets the build context to the current directory.

**2. Build the Backend Image:**
From the project root directory, run:

```bash
docker build -t auto-booking-backend -f Dockerfile.backend .
```

This command:
-   `-t auto-booking-backend`: Tags the image as `auto-booking-backend`.
-   `-f Dockerfile.backend`: Specifies that `Dockerfile.backend` should be used for building.
-   `.`: Sets the build context to the current directory.

**Note**: If you plan to use Docker Compose (recommended), it can also build these images for you.

## Running the Application with Docker Compose

Docker Compose is the recommended way to run both the frontend and backend services together.

1.  **Start the services:**
    Navigate to the project root directory and run:
    ```bash
    docker-compose up
    ```
    If the images `auto-booking-frontend` and `auto-booking-backend` do not exist locally, Docker Compose will build them automatically based on the `build` instructions in `docker-compose.yml`.

    To force a rebuild of the images (e.g., after code changes), use:
    ```bash
    docker-compose up --build
    ```

    To run the services in detached mode (in the background):
    ```bash
    docker-compose up -d
    ```

## Stopping the Application
To stop the running services managed by Docker Compose, navigate to the project root directory and run:
```bash
docker-compose down
```
This will stop and remove the containers. If you want to remove the volumes as well (if any are defined and you want to clear data), you can use `docker-compose down -v`.