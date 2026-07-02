# Auto-Booking Application

This project consists of a React frontend and a Node.js (Express) backend, containerized using Docker.

## TO Run both Front-end and Back-end:
** `npm run dev` **

## Setup Database in your local machine
RUN `server/db_schema/schema_override.sh` from project directory
* This will drop and recreate the database schema, then load all services with their popup questions and answers
* Make sure to update `.env` credentials if needed (default: `localhost`, user: `postgres`, password: `postgres`)

## GitHub Secrets for CI/CD

For deployment and continuous integration (CI/CD) workflows, this project uses environment variables that should not be committed to source control (e.g., API keys, database credentials). For automated workflows on GitHub, we use **GitHub Secrets**.

### Adding Secrets to Your Repository

You will need to add the variables from your local `.env` file as secrets in your GitHub repository settings. For each variable, follow these steps:

1.  Navigate to your GitHub repository and go to **Settings** > **Secrets and variables** > **Actions**.
2.  Click the **New repository secret** button.
3.  For the **Name**, enter the name of the environment variable (e.g., `DATABASE_URL`).
4.  For the **Value**, copy the corresponding value from your `.env` file.
5.  Click **Add secret**.

Repeat this for all the necessary environment variables.

### Example: Using Secrets in GitHub Actions

Once the secrets are added, you can use them in your GitHub Actions workflows (e.g., in `.github/workflows/deploy.yml`). The secrets are securely injected as environment variables during the workflow run.

Here is an example of how to use the secrets in a workflow step:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          secrets: |
            "DATABASE_URL=${{ secrets.DATABASE_URL }}"
            "API_KEY=${{ secrets.API_KEY }}"
```


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