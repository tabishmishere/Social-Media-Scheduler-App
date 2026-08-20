# Run the app with Docker

This project has two containers:

- `client`: builds the React application and serves it on port `5173`.
- `server`: runs the Express API internally on port `3000`.

Docker creates two named images: `social-scheduler-client:latest` and `social-scheduler-server:latest`.

The client forwards requests that start with `/api` to the server automatically. That means you use one address in the browser: `http://localhost:5173`.

## Before you start

1. Install and open [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Put your real API keys in `server/.env`.
3. Do not put secrets in `client/.env`; Vite values are visible in the browser.

## Start both containers

From the project root, run:

```powershell
docker compose up --build
```

Then open `http://localhost:5173`.

Only the frontend port is published to your computer. The backend remains private inside Docker and is available through `http://localhost:5173/api/...`. This avoids conflicts if another program already uses port `3000`.

To stop the app, press `Ctrl+C`. To remove the stopped containers, run:

```powershell
docker compose down
```

## Build and run separately

Build the backend image:

```powershell
docker build -t social-scheduler-server ./server
```

Run the backend image (PowerShell reads the environment file):

```powershell
docker run --env-file ./server/.env -p 3000:3000 social-scheduler-server
```

Build the frontend image:

```powershell
docker build --build-arg VITE_API_BASE_URL=http://localhost:3000 -t social-scheduler-client ./client
```

Run the frontend image in another terminal:

```powershell
docker run -p 5173:80 social-scheduler-client
```

For separate containers, the frontend uses `http://localhost:3000` because this URL is opened by your browser. For `docker compose`, the Nginx proxy lets the frontend use `/api` instead.

The frontend Dockerfile uses Node 24 because one of the current client packages requires it. It uses `npm install` because the existing `client/package-lock.json` is not currently synchronized with `client/package.json`. You can later run `npm install` inside `client/` to refresh the lockfile and then change the Dockerfile back to `npm ci`.

## Useful commands

```powershell
docker compose ps
docker compose logs -f
docker compose down
```
