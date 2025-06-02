# Auto-Booking Application

This project consists of a React frontend and a Node.js (Express) backend, containerized using Docker.

## How to run locally
 To run this project locally, here are the details below:
    1. Frontend - 
        a. First run npm install which will generate the node_modules folder which will have all the dependencies
        b. Then do npm start
        c. Then go to this link in the browser http://localhost:3000. By default react apps run on port 3000
    1. Backend - 
        a. Run node server.js 
        b. Then go to this link in the browser http://localhost:4201. By default react apps run on port 4201
        c. You should see Hello World
    

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js and npm (or yarn)**: Required for installing project dependencies. You can download Node.js from [nodejs.org](https://nodejs.org/).
-   **Docker**: Required for building and running the application containers. You can download Docker Desktop from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).
-   **Docker Compose**: Usually comes bundled with Docker Desktop. This is used to manage multi-container Docker applications.

### Backend Dependencies

The Node.js backend server (`server/app.js`) requires the `express` package. Ensure it is listed in the `dependencies` section of the main `package.json` file. If not, install it from the project root:

```bash
npm install express
# or if you use yarn:
# yarn add express
```

Then, install all project dependencies (if you haven't already):
```bash
npm install
# or
# yarn install
```

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

## Verifying the Application

Once the containers are running, you can access the services:

*   **Frontend (React App):**
    Open your web browser and navigate to:
    http://localhost:3000
    You should see your React application.

*   **Backend (Node.js API):**
    Open your web browser or use a tool like `curl` or Postman to access:
    http://localhost:4201/
    You should receive a JSON response:
    ```json
    {
      "message": "Hello World"
    }
    ```
    The React frontend is configured via `REACT_APP_BACKEND_URL` to communicate with the backend at `http://auto-booking-backend:4201` (this hostname is resolved within Docker's internal network).

## Stopping the Application

To stop the running services managed by Docker Compose, navigate to the project root directory and run:

```bash
docker-compose down
```
This will stop and remove the containers. If you want to remove the volumes as well (if any are defined and you want to clear data), you can use `docker-compose down -v`.