# Social Media Scheduler

A full-stack social media management platform for creating content, connecting social accounts, scheduling posts, and tracking publishing activity from one dashboard.

## Overview

Social Media Scheduler brings common publishing workflows into one product experience: authenticated account management, AI-assisted content creation, media uploads, scheduling, and publishing history. It is designed as a modern client-server application with managed cloud services for persistence, storage, and third-party social publishing.

## Key Features

- **Authentication and protected routes** using JWT-based sessions.
- **Social account connection** through Zernio-powered OAuth flows.
- **Post scheduling** for one or more connected platforms.
- **Automated publishing workflow** for due posts, with status updates and failure tracking.
- **AI content assistant** that generates post copy and image prompts with Groq.
- **Media uploads** stored in Supabase Storage, supporting images and videos.
- **Activity feed** that records publishing events and recent account activity.
- **Responsive dashboard** for posts, accounts, and AI-generated content.

## Technical Highlights

- Built a TypeScript React single-page application using React Router, Axios, Tailwind CSS, and Vite.
- Developed an Express API with modular controllers, routes, middleware, and services.
- Integrated Supabase PostgreSQL for application data and Supabase Storage for media assets.
- Implemented JWT authorization middleware to secure user-specific resources.
- Integrated external APIs for social publishing (Zernio) and AI-assisted content generation (Groq).
- Used Inngest functions to process scheduled publishing jobs and support event-driven automation.
- Containerized the frontend and backend independently with Docker; Nginx serves the production frontend and proxies API requests to the Express service.

## Architecture

```text
React + Vite client
        |
        | HTTP / API requests
        v
Express + TypeScript API
   |        |        |
   v        v        v
Supabase  Zernio    Groq / Inngest
Database  Publishing  AI / Scheduling
Storage
```

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, TypeScript, `tsx` |
| Data and storage | Supabase PostgreSQL, Supabase Storage |
| Authentication | JWT, bcrypt |
| Integrations | Zernio, Groq, Inngest |
| Deployment and containers | Vercel, Docker, Docker Compose, Nginx |

## Repository Structure

```text
client/                 React frontend
  src/                  pages, components, API client, and application state
  Dockerfile            production frontend image

server/                 Express API
  controllers/          request handling and application logic
  routes/               API route definitions
  services/             storage and scheduled publishing logic
  inngest/              scheduled and event-driven functions
  Dockerfile            backend image

docker-compose.yml      runs client and server together
```

## Containerization

The project supports separate frontend and backend Docker images coordinated with Docker Compose. The frontend is served by Nginx, which also forwards `/api` requests to the backend container over Docker's internal network.

## Author

Built as a full-stack social media scheduling project showcasing frontend development, API design, third-party integrations, cloud data services, and containerized deployment.
