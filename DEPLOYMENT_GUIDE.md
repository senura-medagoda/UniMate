# UniMate Deployment Guide for Vercel

This project is structured as a monorepo containing both the Frontend (Vite/React) and Backend (Express/Node). For the best experience on Vercel, we recommend deploying them as two separate Vercel projects.

## Prerequisite
- Push your code to a GitHub, GitLab, or Bitbucket repository.

---

## 🚀 Step 1: Deploy the Backend (First)

1.  Log in to your Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import your **UniMate** repository.
3.  **Configure Project**:
    *   **Project Name**: e.g., `unimate-backend`
    *   **Root Directory**: Click "Edit" and select `backend`.
    *   **Framework Preset**: Select **Other** (or let it detect, but Vercel might not Auto-detect Express).
    *   **Build & Output Settings**: Leave default.
4.  **Environment Variables**:
    Copy the values from `backend/.env.example` and paste them into the "Environment Variables" section.
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secure random string.
    *   `CLOUDINARY_...`: Your Cloudinary credentials.
    *   `CLIENT_URL`: **Leave this empty for now**, or set it to `http://localhost:5173` temporarily. You will update this after deploying the frontend.
5.  Click **Deploy**.

> **Note on PDF Generation**: The backend uses `puppeteer` for generating PDFs. This library is very large and may exceed Vercel's serverless function size limits (50MB). If you encounter errors related to size or missing libraries, consider using a specialized service for PDFs or deploying the backend to a VPS/Container service (like Render or Railway) instead of Vercel Serverless.

6.  **Copy the Backend URL**: Once deployed, copy the domain assign by Vercel (e.g., `https://unimate-backend.vercel.app`).

---

## 🎨 Step 2: Deploy the Frontend

1.  Go back to Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import the **SAME** UniMate repository again.
3.  **Configure Project**:
    *   **Project Name**: e.g., `unimate-frontend`
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: **Vite**.
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
4.  **Environment Variables**:
    *   `VITE_API_URL`: Paste the **Backend URL** you copied in Step 1.
        *   **Important**: Do NOT include `/api` at the end. The frontend code is configured to append `/api` automatically or use the base URL for other resources.
        *   Example: `https://unimate-backend.vercel.app`
5.  Click **Deploy**.

---

## 🔗 Step 3: Connect Frontend to Backend

1.  Copy the new **Frontend URL** (e.g., `https://unimate-frontend.vercel.app`).
2.  Go to your **Backend Project** in Vercel -> **Settings** -> **Environment Variables**.
3.  Edit the `CLIENT_URL` variable and set it to your Frontend URL.
4.  **Redeploy** the Backend (Go to Deployments -> Redeploy) for changes to take effect.

---

## ✅ Verification
- Open your Frontend URL.
- Login and check if data is loading.
- If images are missing, check `CLOUDINARY` credentials.
- If you see "Network Error", check `VITE_API_URL` and `CLIENT_URL` settings.

---

## 🛠 Troubleshooting
- **CORS Errors**: Ensure `CLIENT_URL` in backend matches your frontend domain exactly (no trailing slash).
- **Hardcoded Localhost**: The system was successfully scanned and 70+ hardcoded `localhost` URLs were replaced with dynamic environment variables. If you added new code, ensure you use `import.meta.env.VITE_API_URL`.
