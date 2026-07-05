# VEO Learning Management System (LMS) - Backend API Documentation

Welcome to the backend repository of the **VEO Learning Management System**. This is a robust, production-ready RESTful API built to power an entire e-learning platform. It securely handles user authentication, course management, dynamic video processing pipelines, progress tracking, and student enrollments.

---

## 🏛️ Platform Architecture

```mermaid
graph LR
    %% ── Browser ──────────────────────────────────────────
    subgraph Browser["🌐 Browser"]
        direction TB
        FE["React SPA"]
        PLAYER["hls.js Player"]
    end

    %% ── AWS EC2 t3.small ─────────────────────────────────
    subgraph EC2["🖥️ AWS EC2 t3.small"]
        direction TB
        NGINX["Nginx\n(serves React SPA)"]
        API["Express API\n(PM2 · veolms-api)"]
        WORKER["Transcoding Worker\n(PM2 · veolms-worker)"]
        FFMPEG["FFmpeg\n360p / 480p / 720p / 1080p"]
        WORKER --> FFMPEG
    end

    %% ── External Services ────────────────────────────────
    subgraph Cloud["☁️ Managed Services"]
        direction TB
        MONGO["MongoDB Atlas"]
        REDIS["Redis Cloud"]
        R2_RAW["Cloudflare R2\nRaw Bucket"]
        R2_HLS["Cloudflare R2\nHLS Bucket"]
        IMAGEKIT["ImageKit\nThumbnails"]
    end

    %% ── Flows ────────────────────────────────────────────
    FE -->|"loads app"| NGINX
    FE -->|"API calls"| API
    PLAYER -->|"HLS + token"| API

    API -->|"reads / writes"| MONGO
    API -->|"thumbnails"| IMAGEKIT
    API -->|"presigned URL"| R2_RAW
    API -->|"enqueue job"| REDIS
    API -->|"stream HLS"| R2_HLS

    FE -->|"PUT raw video"| R2_RAW

    REDIS -->|"dequeue job"| WORKER
    WORKER -->|"download .mp4"| R2_RAW
    WORKER -->|"upload HLS segments"| R2_HLS
    WORKER -->|"update videoUrl"| MONGO
```

---

## 🔑 Key Features

- **Robust Authentication & Authorization**: Secure JWT-based authentication with access and refresh tokens. Role-based access control (RBAC) specifically separating standard users and Admins/Instructors.
- **Hierarchical Curriculum**: Data models cleanly structured into `Courses -> Sections -> Lessons`.
- **Advanced Aggregation Pipelines**: Leveraging MongoDB's `$lookup` and aggregation features to fetch fully-populated, deeply nested course structures efficiently.
- **Background Processing**: Utilizing BullMQ and Redis to offload heavy tasks (see the Transcoding Pipeline docs below).
- **Secure Video/Asset Delivery**: Integrated with ImageKit and AWS S3 for secure, optimized media distribution.
- **Strict Validation**: All API inputs are rigorously validated using Zod schemas to ensure absolute data integrity.
- **Progress Tracking**: Sophisticated user progress monitoring to track lesson completion and course milestones.

---

## 🚀 Backend Tech Stack

- **Node.js & Express.js**: High-performance backend web framework.
- **TypeScript**: Strict static typing for maintainability and scalability.
- **MongoDB & Mongoose**: Flexible NoSQL database and elegant object data modeling.
- **Redis**: In-memory data structure store used for caching and as a BullMQ message broker.
- **BullMQ**: Production-grade queue system for managing and processing background jobs reliably.
- **Cloudflare R2**: S3-compatible object storage for storing raw video uploads and finalized HLS streams.
- **AWS SDK v3 (`@aws-sdk/client-s3`)**: Used to interact with Cloudflare R2's S3-compatible API — generating presigned upload URLs and uploading processed assets.
- **FFmpeg**: Industry-standard media processing tool used by the transcoding worker to convert raw video uploads into multi-resolution HLS adaptive bitrate streams.
- **ImageKit**: Optimized cloud storage and content delivery for course thumbnails and static assets.
- **Zod**: Type-safe schema validation for all incoming API payloads.

---

## 🚀 Frontend Tech Stack

- **React 19**: Latest stable version of React with concurrent rendering capabilities.
- **TypeScript ~5.8**: Strict static typing enforced across the entire codebase.
- **Vite 7**: Next-generation build tooling providing near-instant HMR and optimized production builds.
- **Redux Toolkit 2 & React-Redux 9**: Predictable, normalized global state management with a modern slice-based pattern.
- **React Router 8**: Declarative client-side routing with data-mode support.
- **Tailwind CSS 4**: Utility-first CSS framework for consistent, responsive design.
- **Framer Motion 12**: Production-grade animation library for fluid UI transitions.
- **Axios 1**: Promise-based HTTP client with interceptor support for authenticated requests.
- **React Hook Form 7**: Performant, flexible form state management with minimal re-renders.
- **hls.js 1**: Client-side HLS adaptive bitrate streaming playback engine, used in the course video player.
- **@dnd-kit**: Accessible, modern drag-and-drop toolkit used for interactive curriculum reordering.
- **React Hot Toast**: Lightweight notification system for user feedback.
- **Razorpay / Razorpay Checkout**: Integrated payment processing for course purchases.

---

## 📁 Backend Project Structure

The project strictly follows a domain-driven, modular architecture to separate concerns, making the codebase highly scalable and readable.

```
backend/
├── src/
│   ├── app.ts                  # Express application setup, middleware, and route mounting
│   ├── server.ts               # Application entry point and DB connection
│   ├── middlewares/            # Custom middlewares (auth, admin, error-handling, validation)
│   ├── utils/                  # Helper utilities (ApiError, ApiResponse, asyncHandler)
│   ├── infrastructure/         # External service integrations (ImageKit, etc.)
│   ├── worker/                 # BullMQ workers for background jobs (e.g., processing videos)
│   └── modules/                # Feature modules containing Models, Routes, and Controllers
│       ├── auth/               # User registration, login, token refresh, and Google OAuth
│       ├── user/               # User profiles and role management
│       ├── course/             # Course creation, modification, and content aggregation
│       ├── section/            # Course curriculum sections
│       ├── lesson/             # Individual lessons and video resources
│       ├── enrollments/        # Student enrollments to courses
│       └── progress/           # Tracking lesson completions and user progress
├── .env.example                # Sample environment variables configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 📐 Frontend Architecture Overview

> **The VEO LMS frontend follows a production-grade, scalable, feature-based folder structure combined with a strict 4-Layer Architecture that enforces a clear separation of concerns across every domain of the application.**

---

## ⭐ 4-Layer Architecture — Separation of Concerns

> **This is the foundational design principle of the entire frontend codebase. Every feature module is independently organized into exactly four layers, each with a distinct, non-overlapping responsibility.**

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer                         │
│         (pages/, components/) — Rendering only      │
├─────────────────────────────────────────────────────┤
│                   Hook Layer                        │
│          (hook/) — Bridge between UI & State        │
├─────────────────────────────────────────────────────┤
│                   State Layer                       │
│     (state/) — Redux slices, actions, selectors     │
├─────────────────────────────────────────────────────┤
│                  Service Layer                      │
│     (service/) — API calls, external integrations   │
└─────────────────────────────────────────────────────┘
```

### Service Layer — `service/`
The service layer is the only layer authorized to communicate with the backend API. It contains pure, framework-agnostic functions that make HTTP requests using Axios. No component or Redux action ever calls the API directly — all network traffic is routed exclusively through this layer. This makes it trivially easy to mock services in tests, swap out endpoints, or introduce request/response transformations without touching any UI or state logic.

```typescript
// Example: course.service.ts
export const fetchAllCourses = () => axiosInstance.get('/api/course');
export const fetchCourseById  = (id: string) => axiosInstance.get(`/api/course/${id}`);
```

### State Layer — `state/`
The state layer contains Redux Toolkit slices that manage domain-specific application state. Each slice defines the shape of the data, reducers for synchronous state transitions, and `createAsyncThunk` actions that delegate API calls to the service layer. This layer is entirely decoupled from the UI — it has no knowledge of components and no direct access to the DOM.

```typescript
// Example: course.slice.ts
export const getCourses = createAsyncThunk('course/getAll', async () => {
  const res = await fetchAllCourses();
  return res.data;
});
```

### Hook Layer — `hook/`
The hook layer acts as the bridge between the UI and the Redux state. Custom React hooks in this layer abstract `useSelector`, `useDispatch`, and any derived state logic away from the component layer. A component never imports Redux primitives directly — it only consumes a clean, domain-specific hook. This isolates components from state implementation details and makes refactoring the state layer entirely transparent to the UI.

```typescript
// Example: course.hook.ts
export const useCourse = () => {
  const dispatch = useAppDispatch();
  const courses  = useAppSelector(selectAllCourses);
  const load     = () => dispatch(getCourses());
  return { courses, load };
};
```

### UI Layer — `pages/` & `components/`
The UI layer is responsible solely for rendering. Pages and components consume data and actions exclusively through the hook layer. They contain no business logic, no direct API calls, and no raw Redux imports. This strict boundary ensures that UI components remain dumb, testable, and reusable.

---

## 📁 Frontend Feature-Based Folder Structure

The codebase is organized by business domain rather than by technical type. This is the feature-based (also known as domain-driven) approach to frontend architecture. Each self-contained feature module encapsulates all four layers specific to that domain, making it possible to develop, test, and reason about each feature in complete isolation.

```
frontend/
├── src/
│   ├── app/                        # Application bootstrap layer
│   │   ├── App.tsx                 # Root component and router configuration
│   │   ├── AppLayout.tsx           # Shared application shell layout
│   │   ├── app.routes.tsx          # Centralized route definitions
│   │   ├── index.css               # Global base styles
│   │   └── store/
│   │       └── app.store.ts        # Redux store configuration and root reducer
│   │
│   ├── features/                   # Feature modules (domain-driven)
│   │   ├── auth/                   # Authentication & authorization domain
│   │   │   ├── components/         # [UI Layer] Route guard components
│   │   │   │   ├── Protected.tsx   # Authenticated-user-only guard
│   │   │   │   ├── GuestOnly.tsx   # Unauthenticated-user-only guard
│   │   │   │   ├── AdminOnly.tsx   # Admin RBAC guard
│   │   │   │   └── AdminGuestOnly.tsx
│   │   │   ├── hook/               # [Hook Layer] Auth state bridge
│   │   │   │   └── auth.hook.ts
│   │   │   ├── pages/              # [UI Layer] Auth screens
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── SignUp.tsx
│   │   │   │   ├── AdminLogin.tsx
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   ├── UserDashboard.tsx
│   │   │   │   └── VeoDashboard.tsx
│   │   │   ├── service/            # [Service Layer] Auth API calls
│   │   │   │   └── authService.ts
│   │   │   └── state/              # [State Layer] Auth Redux slice
│   │   │       └── auth.slice.ts
│   │   │
│   │   ├── course/                 # Course management domain
│   │   │   ├── hook/               # [Hook Layer]
│   │   │   │   └── course.hook.ts
│   │   │   ├── pages/              # [UI Layer] Course screens
│   │   │   │   ├── CoursesPage.tsx
│   │   │   │   ├── CourseDetail.tsx
│   │   │   │   ├── CourseEditor.tsx
│   │   │   │   ├── CoursePlayer.tsx
│   │   │   │   └── Checkout.tsx
│   │   │   ├── service/            # [Service Layer]
│   │   │   │   └── course.service.ts
│   │   │   └── state/              # [State Layer]
│   │   │       └── course.slice.ts
│   │   │
│   │   ├── lesson/                 # Lesson & video management domain
│   │   │   ├── hook/               # [Hook Layer]
│   │   │   │   ├── lesson.hook.ts
│   │   │   │   └── useVideoPolling.ts  # Reactive video processing status polling
│   │   │   ├── service/            # [Service Layer]
│   │   │   │   └── lesson.service.ts
│   │   │   └── state/              # [State Layer]
│   │   │       └── lesson.slice.ts
│   │   │
│   │   ├── section/                # Course curriculum section domain
│   │   │   ├── hook/               # [Hook Layer]
│   │   │   │   └── section.hook.ts
│   │   │   ├── service/            # [Service Layer]
│   │   │   │   └── section.service.ts
│   │   │   └── state/              # [State Layer]
│   │   │       └── section.slice.ts
│   │   │
│   │   └── userDashboard/          # Student dashboard domain (in progress)
│   │
│   ├── shared/                     # Cross-cutting reusable UI elements
│   │   └── components/
│   │       └── Navbar.tsx          # Shared navigation bar component
│   │
│   ├── components/                 # Page-level composed components
│   │   ├── LandingPage.tsx         # Marketing landing page composition
│   │   └── landing/                # Landing page section components
│   │       ├── Hero.tsx
│   │       ├── Navbar.tsx
│   │       ├── CoursesSection.tsx
│   │       ├── CourseCard.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── Testimonials.tsx
│   │       ├── StatsBar.tsx
│   │       ├── CTABanner.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/                        # Core infrastructure and utilities
│   │   └── authInstance.ts         # Axios instance with auth interceptors
│   │
│   └── types/                      # Global TypeScript type definitions
│       ├── auth.type.ts
│       └── course.type.ts
│
├── public/                         # Static assets
├── index.html                      # Application HTML entry point
├── vite.config.ts                  # Vite build configuration
├── tsconfig.json                   # TypeScript compiler configuration
└── package.json                    # Project dependencies and scripts
```

---

## ✨ Key Frontend Features

- **Role-Based Access Control (RBAC)**: Declarative route guard components (`Protected`, `AdminOnly`, `GuestOnly`) enforce authentication and authorization at the routing level, ensuring that students, admins, and unauthenticated users each access only the surfaces appropriate to their role.
- **HLS Adaptive Video Playback**: The course player integrates `hls.js` directly with the secure Token-Based HLS Proxy from the backend, delivering adaptive bitrate streaming (360p through 1080p) with full segment-level content protection — no direct CDN links are ever exposed to the client.
- **Reactive Video Processing Status**: A dedicated `useVideoPolling` hook monitors the asynchronous transcoding pipeline in real time, providing live feedback to administrators after a video upload is dispatched for processing.
- **Interactive Curriculum Editor**: The admin Course Editor leverages `@dnd-kit` to provide an accessible, keyboard-navigable drag-and-drop interface for reordering curriculum sections and lessons — reflecting changes optimistically while persisting them to the backend.
- **Integrated Payment Flow**: The checkout experience is built on top of the Razorpay SDK, handling the full course purchase lifecycle including order creation, payment modal orchestration, and enrollment confirmation.
- **Performant Form Management**: All user-facing forms — registration, login, course creation, and profile editing — use `react-hook-form` for zero-overhead validation and minimal re-renders, paired with field-level error messaging for a polished user experience.
- **Animated Interfaces**: `framer-motion` is used for production-quality page transitions, component mount/unmount animations, and interactive feedback, contributing to a cohesive and professional visual character across the application.
- **Centralized Axios Configuration**: A dedicated Axios instance in `lib/authInstance.ts` handles JWT injection into request headers and transparent token refresh logic via interceptors, ensuring all authenticated API calls remain consistent and secure without any per-request boilerplate.
- **Type-Safe Throughout**: TypeScript interfaces for all API payloads, Redux state shapes, and component props are maintained in a dedicated `types/` directory, providing compile-time guarantees across the entire feature surface.
- **Marketing Landing Page**: A fully composed, animated public-facing marketing experience including hero section, course listings, testimonials, statistics, and a call-to-action banner — all built with modular, independently testable section components.

---

## 🛠 Backend Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v18 or higher)
- MongoDB (Running locally or a MongoDB Atlas URI)
- Redis Server (Redis Cloud managed instance or any Redis provider)
- FFmpeg (Required for the video transcoding worker)

### 2. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory based on the provided `.env.example`:

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/veolms
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REDIS_URL=redis://:<password>@<host>.redis.cloud:port
SALT_VALUE=10
MEETING_WINDOW_LIMIT=100
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```
*Note: Be sure to fill in your actual API keys for ImageKit and Google OAuth if you intend to test these features.*

### 5. Start the Development Server
```bash
# Terminal 1 — API server
npm run dev

# Terminal 2 — BullMQ worker (separate process)
npm run worker:dev
```
The server should now be running on `http://localhost:3000`.

> **Note:** The API server and worker are fully independent processes. The worker can be stopped, restarted, or crash without affecting the API server.

### 6. Building for Production
```bash
npm run build

# Terminal 1 — API server
npm run start

# Terminal 2 — BullMQ worker
npm run worker
```

---

## 🏗️ Frontend Setup & Installation

### 1. Prerequisites
Ensure you have Node.js v18 or higher installed.

### 2. Navigate to the Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file based on the provided `.env.example`. The critical variable is:

```env
VITE_BACKEND_URL=http://localhost:4002
```

### 5. Start the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 6. Building for Production
```bash
npm run build
```
The optimized, tree-shaken output will be written to the `dist/` directory, ready for static hosting or CDN deployment.

---

## 📡 API Module Overview

All endpoints are prefixed with `/api`.

- **`/api/auth`**: Endpoints for signing up, logging in, logging out, and refreshing tokens.
- **`/api/user`**: Manage current user profiles and fetch user information.
- **`/api/course`**: Endpoints to list courses, retrieve full course curriculums (using aggregation), and Admin-only endpoints for creating, updating, publishing, and deleting courses.
- **`/api/section`**: Admin-only endpoints for adding and managing curriculum sections within a course.
- **`/api/lesson`**: Admin-only endpoints for adding individual lessons to sections, managing video URLs, durations, and preview access.
- **`/api/enrollment`**: Endpoints for users to enroll in published courses, retrieve their enrollments, and Admin endpoints to view all enrollments across a specific course.
- **`/api/progress`**: Endpoints to track and mark specific lessons as completed, and to fetch progress across courses.

---

## 🛡 Error Handling

The application leverages a unified error-handling approach.
- `ApiError` utility throws structured HTTP exceptions.
- The global `errorHandler.ts` middleware traps all synchronous and asynchronous exceptions (managed seamlessly via `asyncHandler`), preventing crashes and consistently formatting the response payload:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "stack": "..." // (Only in development)
}
```

---

# Video Transcoding Pipeline Documentation

> [!IMPORTANT]  
> This document details the entire video processing pipeline, from the client's initial upload request to the final HLS (HTTP Live Streaming) generation and database update.

## High-Level Architecture Overview

The VEO Learning Management System (VEOLMS) utilizes a distributed, asynchronous video transcoding pipeline to handle large video uploads and process them into an adaptive bitrate streaming format (HLS). This ensures that video playback is fast, scalable, and optimized for various network conditions.

The architecture relies on the following core components:
*   **Express REST API:** Handles authentication, presigned URL generation, and queue dispatching.
*   **Cloudflare R2 (S3-compatible object storage):** Provides two distinct buckets:
    *   `R2_RAW_BUCKET`: Temporary storage for raw user-uploaded videos (`.mp4`).
    *   `R2_HLS_BUCKET`: Permanent public storage for the transcoded HLS segmented videos (`.ts` and `.m3u8`).
*   **BullMQ & Redis:** A robust queue system used to asynchronously offload heavy processing (FFmpeg) to a separate worker process.
*   **Node.js Worker & FFmpeg:** A dedicated process responsible for downloading raw videos, converting them into multiple resolutions, segmenting them for HLS, and uploading the finalized files to R2.

---

## 1. Sequence & Data Flow

The following Mermaid diagram maps out the step-by-step sequence of operations across the Client, Backend API, Cloudflare R2, and the Background Worker.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant API as Backend API Server
    participant R2 as Cloudflare R2 Storage
    participant Queue as Redis / BullMQ
    participant Worker as Transcoding Worker
    participant DB as MongoDB

    %% Upload Flow
    rect rgb(30, 40, 50)
    Note over Client, DB: Phase 1: Secure Direct Upload
    Client->>API: GET /api/lesson/:lessonId/upload-url?fileName=video.mp4&fileType=video/mp4
    API-->>Client: 200 OK (signedUrl, rawKey)
    Client->>R2: PUT <signedUrl> (Upload raw video directly to raw bucket)
    R2-->>Client: 200 OK
    end

    %% Queue Dispatch
    rect rgb(30, 40, 50)
    Note over Client, DB: Phase 2: Trigger Processing
    Client->>API: POST /api/lesson/:lessonId/process { rawKey, fileName }
    API->>Queue: Enqueue Job (video-transcoding)
    API-->>Client: 200 OK (Job ID)
    end

    %% Worker Execution
    rect rgb(30, 40, 50)
    Note over Client, DB: Phase 3: Background Transcoding (Asynchronous)
    Queue-->>Worker: Dequeue Job
    Worker->>R2: Download raw video (Stream into /tmp)
    R2-->>Worker: video.mp4 stream
    
    Worker->>Worker: Execute FFmpeg (Scale to 360p, 480p, 720p, 1080p)
    Worker->>Worker: Generate .ts segments & resolution playlists
    Worker->>R2: Upload all HLS segments & playlists to HLS bucket
    R2-->>Worker: Upload Success
    
    Worker->>Worker: Generate master.m3u8 playlist
    Worker->>R2: Upload master.m3u8 to HLS bucket
    R2-->>Worker: Upload Success
    
    Worker->>DB: Update Lesson document (videoUrl = R2_PUBLIC_URL/master.m3u8)
    DB-->>Worker: Update Success
    Worker->>Worker: Clean up /tmp directory
    Worker->>Queue: Mark Job as Completed
    end
```

---

## 2. API Endpoint Specifications

### Step 1: Request an Upload URL
The client must securely request an upload URL. This ensures the server never has to buffer the initial heavy video upload.

*   **Endpoint:** `GET /api/lesson/:lessonId/upload-url`
*   **Query Parameters:**
    *   `fileName` (string): The name of the file being uploaded (e.g., `intro.mp4`).
    *   `fileType` (string): The MIME type of the file (e.g., `video/mp4`).
*   **Access Control:** Requires a valid authentication token and Admin privileges (`isAdmin`).
*   **Behavior:** 
    1. Generates a unique `rawKey` mapping to the `R2_RAW_BUCKET`.
    2. Utilizes `@aws-sdk/s3-request-presigner` to create a `signedUrl` valid for 1 hour.
*   **Response:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Upload URL ready",
      "data": {
        "signedUrl": "https://<cloudflare-r2-endpoint>/raw/123/1782...-intro.mp4?X-Amz-Signature=...",
        "rawKey": "raw/123/1782...-intro.mp4"
      }
    }
    ```

### Step 2: Trigger Processing
Once the client successfully PUTs the video file to the `signedUrl` and receives a 200 OK from R2, it must notify the backend.

*   **Endpoint:** `POST /api/lesson/:lessonId/process`
*   **Body:**
    ```json
    {
      "rawKey": "raw/123/1782...-intro.mp4",
      "fileName": "intro.mp4"
    }
    ```
*   **Access Control:** Requires a valid authentication token and Admin privileges (`isAdmin`).
*   **Behavior:** 
    1. Queues a new job onto the `video-transcoding` BullMQ queue.
    2. Responds immediately with the Job ID.

---

## 3. Worker Process Deep Dive

The background worker operates entirely independently from the main Express API instance, ensuring CPU-intensive FFmpeg tasks do not block the event loop or affect API latency. 

> [!TIP]  
> The worker leverages `concurrency: 1` per instance to prevent running out of memory/CPU, as FFmpeg is extremely resource-intensive. If scaling is needed, you can spawn additional worker containers horizontally.

### Processing Steps (`transcode.processor.ts`)

#### 1. File Ingestion
The worker receives the `rawKey` and streams the file from the `R2_RAW_BUCKET` directly to a newly created temporary directory (`/tmp/lesson-{id}-{timestamp}/input.mp4`).

#### 2. Resolution Transcoding (FFmpeg)
The video is then parsed and transcoded via `child_process.spawn` into four standard resolutions.

### Why `spawn` over `exec`/`execSync`

When executing FFmpeg in a production environment, `spawn` is the **recommended choice** over `exec` or `execSync` for several critical reasons:

**1. Streaming Output (No Buffering)**
- `spawn` returns streams (`stdout`, `stderr`) that emit data as it becomes available
- `exec`/`execSync` buffers the entire output in memory, which can cause issues with long-running video processing
- FFmpeg can generate substantial log output during transcoding; `spawn` handles this efficiently

**2. Memory Efficiency**
- `spawn` does not buffer output, making it suitable for large video files
- `exec`/`execSync` stores entire output in memory, potentially causing `OutOfMemory` errors for large files
- With `spawn`, you can process videos of any size without memory concerns

**3. Real-time Progress Monitoring**
- `spawn` allows real-time parsing of FFmpeg progress updates from stderr
- You can extract percentage complete, current FPS, encoding speed in real-time
- Enables live progress reporting to clients or monitoring dashboards

**4. Non-blocking Execution**
- `spawn` is asynchronous and non-blocking by default
- `execSync` blocks the Node.js event loop, preventing concurrent request handling
- Even `exec` (async) buffers everything, while `spawn` streams data

**5. Better Error Handling**
- `spawn` emits `error` events for process-level issues
- You can capture both `stdout` and `stderr` separately
- Allows for better cleanup on process termination

**Example of how `spawn` is used in practice:**
```typescript
import { spawn } from 'child_process';

const ffmpeg = spawn('ffmpeg', [
  '-i', inputPath,
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '22',
  '-hls_time', '6',
  '-hls_playlist_type', 'vod',
  outputSegmentPattern
]);

ffmpeg.stderr.on('data', (data) => {
  // Parse FFmpeg progress in real-time
  const output = data.toString();
  if (output.includes('time=')) {
    // Extract current encoding time and calculate percentage
    console.log('Transcoding in progress:', output.trim());
  }
});

ffmpeg.on('close', (code) => {
  if (code !== 0) {
    console.error(`FFmpeg process exited with code ${code}`);
  }
});
```

**When to use `exec`/`execSync`:**
- Short-running commands with predictable, small output
- When you need the complete output as a single string
- Simple shell commands where streaming isn't important

**When to use `spawn`:**
- Long-running processes like video/audio transcoding
- Commands that may produce large amounts of output
- When real-time progress monitoring is needed
- Production environments where memory efficiency matters

For the VEO LMS video transcoding pipeline, `spawn` ensures reliable, memory-efficient processing of videos of any size while providing visibility into the transcoding progress. 

| Name | Width x Height | Video Bitrate | Audio Bitrate |
| :--- | :--- | :--- | :--- |
| `360p` | 640 x 360 | 800 kbps | 96 kbps |
| `480p` | 854 x 480 | 1400 kbps | 128 kbps |
| `720p` | 1280 x 720 | 2800 kbps | 128 kbps |
| `1080p` | 1920 x 1080 | 5000 kbps | 192 kbps |

The FFmpeg parameters are optimized for HLS:
*   `-c:v libx264 -preset fast -crf 22`: Fast CPU encoding with constant rate factor 22 for excellent visual quality.
*   `-hls_time 6`: Divides the video into perfectly sized 6-second chunk `.ts` files.
*   `-hls_playlist_type vod`: Marks the playlist as Video-On-Demand (meaning the playlist is static and won't change).

#### 3. Segment & Playlist Upload
All resulting folders (e.g., `360p/`, `480p/`) containing `.ts` segments and their respective `index.m3u8` variant playlists are uploaded to the `R2_HLS_BUCKET`.

#### 4. Master Playlist Creation
The worker generates a `master.m3u8` file mapping out the bandwidths and resolutions, allowing adaptive streaming protocols in the browser (like `hls.js` or `video.js`) to seamlessly switch resolutions based on the user's internet speed. This is uploaded to `hls/{lessonId}/master.m3u8`.

#### 5. Database Commit & Cleanup
Finally, the MongoDB connection (established upon worker start) is utilized to execute a `findByIdAndUpdate` on the Lesson document, injecting the finalized, public `videoUrl`. The `finally` block ensures that the `/tmp/` directory is recursively destroyed whether the job succeeds or fails, preventing storage bloat.

---

## 4. Configuration & Environment

The following environment variables are critical for the pipeline to function correctly:

*   **R2_RAW_BUCKET**: Bucket designated for initial MP4 uploads.
*   **R2_HLS_BUCKET**: Publicly accessible bucket designated for the finalized HLS streams.
*   **R2_PUBLIC_URL**: The custom domain attached to the HLS bucket (e.g., `https://pub-XXXX.r2.dev`).
    > [!WARNING]  
    > Ensure that `R2_PUBLIC_URL` has **no trailing slash** or path segments, as it is directly appended to. (e.g. `https://pub-XXXX.r2.dev`, not `https://pub-XXXX.r2.dev/veolms`)
*   **R2_ACCESS_KEY / R2_SECRET_KEY**: API tokens configured in Cloudflare with `Object Read & Write` scope covering *both* buckets.

---

## 5. BullMQ Options & Resilience

The `videoQueue` is configured with robust failover and retention policies:

```typescript
defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 50,  // Keep last 50 successful logs
    removeOnFail: 50,      // Keep last 50 failure logs
}
```
If an upload to R2 fails or FFmpeg crashes, the job is retried up to 3 times using exponential backoff (e.g., 5s, 25s, 125s) before marking the job as permanently failed.

---

## 🔒 Secure Video Delivery Pipeline

To protect premium video content from unauthorized access and direct downloads, VEOLMS implements a sophisticated **Token-Based HLS Proxy** architecture.

### How It Works

1. **Short-Lived JWT Generation**: When an authenticated user attempts to play a lesson, the frontend requests a secure token from `GET /api/lesson/:lessonId/video-token`. This token encodes the specific `lessonId` and is signed using `ACCESS_TOKEN_SECRET` with a 6-hour expiration.
2. **Backend Video Proxy**: Instead of loading the Cloudflare R2 bucket URL directly, the frontend video player hits the backend proxy at `GET /api/lesson/:lessonId/video/master.m3u8?token=...`.
3. **Dynamic Playlist Rewriting**: The backend authenticates the JWT. Once verified, it fetches the `.m3u8` playlist from the private R2 bucket using the AWS S3 SDK. Crucially, the backend parses the playlist and dynamically appends the `?token=...` parameter to every relative `.ts` chunk and sub-playlist URI.
4. **Secure Segment Streaming**: As the video player (e.g., `hls.js`) requests individual `.ts` chunks, those requests automatically include the token. The backend verifies the token and securely pipes the binary video stream directly from R2 to the client without buffering it in memory.

### Security Benefits

*   **No Public R2 Access**: The Cloudflare `R2_HLS_BUCKET` can remain completely private. The backend orchestrates all fetches using `R2_ACCESS_KEY` credentials.
*   **Segment-Level Protection**: Even if a user extracts a direct URL for a video chunk from the network tab, they cannot share it permanently—the token will expire, and the backend will reject any unauthenticated requests with a `403 Forbidden` error.
*   **Cross-Browser Compatibility**: Because the token is embedded in the stream URL itself (rather than relying on HTTP Cookies), native video players on iOS Safari and smart TVs work flawlessly without cross-origin cookie restrictions.

---

## 🚢 Deployment Strategy

The entire platform — frontend and backend — is deployed on a single **AWS EC2 t3.small** instance with a **20 GB EBS** volume. Both the API server and the transcoding worker run as **separate, independent PM2 processes** on the same machine.

### Infrastructure at a Glance

| Component | Details |
| :--- | :--- |
| Cloud Provider | AWS |
| Instance Type | EC2 t3.small (2 vCPU, 2 GB RAM) |
| Storage | 20 GB EBS (gp2) |
| OS | Ubuntu 22.04 LTS |
| Process Manager | PM2 |
| Frontend Serving | Nginx (static files from `/var/www/learnsphere`) |
| Backend API | Node.js Express — managed by PM2 as `veolms-api` |
| Transcoding Worker | Node.js BullMQ Worker — managed by PM2 as `veolms-worker` |
| Message Broker | Redis Cloud (managed, external) |
| Database | MongoDB Atlas (managed cloud) |
| Object Storage | Cloudflare R2 (raw uploads + HLS output) |
| Media CDN | ImageKit (thumbnails & static assets) |

### Process Isolation — Why It Matters

The API server and the transcoding worker are deliberately run as **two completely separate PM2 processes**, not threads or in-process workers.

When an admin uploads a video, the API immediately hands off the job to Redis (BullMQ queue) and returns a response. The worker picks it up independently and runs FFmpeg in the background. This means:

- If FFmpeg runs out of memory processing a large video and the worker crashes, **the API server keeps running without any interruption** — students can still browse courses, stream videos, and make purchases.
- If the worker is restarted or redeployed, **no in-flight API requests are affected**.
- The two processes communicate exclusively through Redis. There is no shared memory, no shared event loop, and no shared crash domain.

```
EC2 t3.small
├── PM2
│   ├── veolms-api      → node dist/server.js         (Express REST API)
│   └── veolms-worker   → node dist/worker/worker.js  (BullMQ + FFmpeg)
└── Nginx               → serves /var/www/learnsphere  (React SPA)

Redis Cloud (external managed service) → message broker for BullMQ queue
```

### Starting the Processes

```bash
# API server
pm2 start dist/server.js --name veolms-api

# Transcoding worker (separate process)
pm2 start dist/worker/worker.js --name veolms-worker

# Persist across reboots
pm2 save
pm2 startup
```

### Frontend — Served by Nginx

The React app is built and copied to `/var/www/learnsphere/`. Nginx serves it as static files on port 80/443, with a catch-all rule to support client-side routing:

```nginx
server {
    listen 80;
    root /var/www/learnsphere;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

---

### ⚠️ MVP Note — Transcoding Scalability

> For the current MVP, video transcoding runs on the same EC2 instance as the API server. This works fine at low volume, but **running FFmpeg on a t3.small is CPU and memory intensive** — under high load it could slow down the entire machine and degrade the experience for all users, not just the admin uploading a video.

**The planned upgrade path when the user base grows:**

Spin up an **isolated Docker container** dedicated solely to transcoding. The container connects to the same Redis Cloud instance (BullMQ), picks up jobs from the queue, runs FFmpeg, and pushes the finished HLS output to Cloudflare R2 — exactly as the current worker does, but fully isolated from the API server's machine.

This can be done in two ways:

- **[Dockerode](https://github.com/apocas/dockerode)** — programmatically spin up a transcoding container on-demand from within Node.js when a new job arrives. Zero idle cost — the container lives only for the duration of the job.
- **AWS ECS + ECR** — push the worker Docker image to ECR and run it as an ECS task (Fargate). ECS handles container lifecycle, auto-scaling based on queue depth, and retries natively. This is the production-grade path.

Either approach means the API server on EC2 becomes **completely unaware of transcoding** — it just enqueues a job to Redis and forgets. The transcoding load is offloaded entirely to external compute. The EC2 instance stays fast and responsive regardless of how many videos are being processed simultaneously.

---

## 💰 Infrastructure Pricing

All costs are approximate AWS/service list prices as of 2025.

| Service | Plan / Tier | Est. Monthly Cost |
| :--- | :--- | :--- |
| AWS EC2 t3.small | On-Demand, `us-east-1` | ~$15.18 |
| AWS EBS 20 GB gp2 | Attached to EC2 | ~$2.00 |
| Cloudflare R2 Storage | First 10 GB free, then $0.015/GB | ~$0 – $1.50 |
| Cloudflare R2 Egress | Free (no egress fees) | $0 |
| MongoDB Atlas | M0 Free Cluster (512 MB) | $0 |
| ImageKit | Free tier (20 GB storage, 20 GB bandwidth) | $0 |
| Redis Cloud | Free tier (30 MB, managed) | $0 |
| GitHub Actions | Free tier (2,000 min/month) | $0 |
| **Total (est.)** | | **~$17 – $19 / month** |

> **Note:** These figures cover the MVP deployment running on a single EC2 instance. Costs will scale if you move to separate worker instances, upgrade the EC2 type for heavier FFmpeg workloads, or exceed Cloudflare R2/ImageKit free tiers.

---

## ⚙️ CI/CD Pipeline — GitHub Actions

The project uses a fully automated **GitHub Actions** workflow that deploys the entire stack (backend + frontend) to an AWS EC2 instance on every push to `main`.

### Workflow File
Located at `.github/workflows/deploy.yaml`.

### Trigger
```yaml
on:
  push:
    branches:
      - main
```
Any push (or merged PR) to the `main` branch kicks off the pipeline automatically.

### What the Pipeline Does

1. **Checkout** — Clones the latest source code on the runner.
2. **SSH into EC2** — Connects to the production EC2 instance via `appleboy/ssh-action`.
3. **Pull latest changes** — Runs `git pull origin main` on the server to sync the codebase.
4. **Build Backend** — Runs `npm ci && npm run build` inside `backend/`, then restarts the API process via PM2 (`pm2 restart veolms-api`).
5. **Restart Worker** — Restarts the BullMQ transcoding worker independently (`pm2 restart veolms-worker`).
6. **Build Frontend** — Runs `npm ci && npm run build` inside `frontend/`, copies the `dist/` output to `/var/www/learnsphere/`, and reloads Nginx to serve the new build.

### Required GitHub Secrets

The following secrets must be configured under **Settings → Secrets and variables → Actions** in your GitHub repository:

| Secret | Description |
| :--- | :--- |
| `EC2_HOST` | Public IP or hostname of your EC2 instance |
| `EC2_USER` | SSH username (e.g., `ubuntu` or `ec2-user`) |
| `EC2_SSH_KEY` | Private SSH key (PEM) for authenticating with the EC2 instance |

### Production Process Management (PM2)

The backend API and worker are managed as persistent processes via **PM2** on the EC2 instance. The workflow restarts them with `--update-env` to pick up any new environment variable changes without a full server reboot.

```bash
pm2 restart veolms-api --update-env     # Express API server
pm2 restart veolms-worker --update-env  # BullMQ transcoding worker
```

### Static Frontend Serving (Nginx)

The compiled React app (`dist/`) is copied to `/var/www/learnsphere/` and served by **Nginx**. The workflow reloads Nginx (`sudo systemctl reload nginx`) to apply the new build with zero downtime.

---

## 🤝 Backend Contribution Guidelines

1. **Typescript First**: Any new feature or module must have explicit interfaces or types (e.g., `feature.type.ts`).
2. **Controller/Service Separation**: Keep controllers as thin as possible. Delegate heavy business logic to dedicated services if complexity grows.
3. **Zod Validation**: Ensure every new request body/params structure is validated by a Zod schema in a `.validation.ts` file before it hits the controller. 
4. **Follow the Structure**: Create a dedicated directory inside `src/modules/` for any distinct new entity.

---

## 🤝 Frontend Contribution Guidelines

1. **Feature-First, Always**: Every new domain belongs in its own dedicated directory under `src/features/`. Do not add domain logic to `shared/` or `components/`.
2. **Respect the Layer Boundaries**: Components must only call hooks. Hooks must only interact with Redux. Redux actions must only call services. Services must only call the API. Crossing these boundaries violates the architectural contract.
3. **TypeScript is Non-Negotiable**: All new files must be fully typed. No `any` types without explicit justification.
4. **State via Redux Only**: Application-level state must live in Redux slices. Component-local ephemeral state (e.g., open/closed toggles) is the only acceptable use of raw `useState`.
5. **Service Abstraction**: Never use `axios` or `fetch` directly inside a component or hook. All HTTP communication must be routed through a `*.service.ts` file.
