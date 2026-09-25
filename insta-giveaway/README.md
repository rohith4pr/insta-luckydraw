# Lucky Draw

Angular giveaway picker with a local Python import service for Instagram account CSV and Excel files.

## Start the app

Run the frontend and API in separate terminals from the project directory.

Frontend:

```powershell
npm install
npm start
```

Open `http://localhost:4200/` and choose **Import entries**.

Python API (Windows PowerShell):

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

The upload screen accepts `.csv` and `.xlsx` files up to 10 MB. The first row must contain a username column (`username`, `instagram_username`, `instagram`, `handle`, or `account`). An avatar column is optional (`avatar_url`, `profile_picture_url`, `profile_picture`, `profile_pic`, `image_url`, or `avatar`). Each non-empty username row becomes one entry. The Python service downloads supplied public HTTP/HTTPS image URLs and serves cached files from `/avatars/`.

Imported entries live in the current browser session; refreshing the page clears them. Avatar downloads are stored under `backend/avatar_cache/` and are ignored by Git.

## Run with Docker

With Docker Desktop running, start the frontend and API together from the project directory:

```powershell
docker compose up --build
```

Open `http://localhost:8080/`. Nginx serves Angular and proxies `/api` and `/avatars` to FastAPI. Downloaded avatars persist in a named Docker volume. Original spreadsheets are not saved, and entrant lists remain in browser memory and clear on refresh.

## Checks

```powershell
npm run build
npm test -- --watch=false
python -m unittest discover -s backend
```
