# Node.js Express Server (`app.js`)

This directory contains a simple Node.js server built with Express, located in `app.js`.
It serves a basic "Hello World" JSON response.

## Prerequisites

Before you can run this server, you need to have the following installed:

-   **Node.js**: It's recommended to use a recent LTS version. You can download it from nodejs.org.
-   **npm** (Node Package Manager) or **yarn**: These usually come bundled with Node.js.

## Setup

This server depends on the `express` package.

1.  **Ensure `express` is a project dependency**:
    If `express` is not already listed in the `dependencies` section of the main `package.json` file (located in the parent `auto-booking/` directory), you'll need to add it.
    Navigate to the root directory of the `auto-booking` project (one level up from this `server` directory) and run:
    ```bash
    npm install express
    ```
    or if you are using yarn:
    ```bash
    yarn add express
    ```

2.  **Install all project dependencies**:
    From the root `auto-booking/` directory, run:
    ```bash
    npm install
    ```
    or with yarn:
    ```bash
    yarn install
    ```

## Running the Server

You can start the server in one of the following ways:

-   **From the `auto-booking/server/` directory:**
    ```bash
    node app.js
    ```
-   **From the root `auto-booking/` directory:**
    ```bash
    node server/app.js
    ```

Upon successful startup, you will see the following message in your console:
```
Server is listening on port 4201
```
(The port number might be different if the `PORT` environment variable is set.)

## Testing the Server

Once the server is running, you can test it by:

1.  Opening your web browser and navigating to `http://localhost:4201/`.
2.  Or, using a command-line tool like `curl`:
    ```bash
    curl http://localhost:4201/
    ```

You should receive the following JSON response:
```json
{
  "message": "Hello World"
}