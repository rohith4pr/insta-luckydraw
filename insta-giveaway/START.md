# Starting Lucky Draw

## Prerequisites

- Node.js and npm
- Python 3.10 or newer

Run all commands below from the project folder: `insta-giveaway`.

## 1. Start the Angular app

Open a PowerShell terminal in the project folder and run:

```powershell
npm install
npm start
```

Keep this terminal running. Open the app at <http://localhost:4200/>.

## 2. Start the Python import API

Open a second PowerShell terminal in the same project folder and run:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

Keep this terminal running too. The API health check is <http://localhost:8000/api/health>.

If PowerShell blocks virtual-environment activation, run the environment's Python directly instead:

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```

## Import accounts

In the app, choose **Import Entries**. Select or drop a `.csv` or `.xlsx` file, then click **Import Entries**. The first row needs a username column, such as `username` or `instagram_username`. An avatar URL column is optional. After import, the entrants appear on the draw page.

Both terminals must remain running while using the app and importing files. Imported entrants are held for the current browser session and are cleared if the page is refreshed.

## Deploy the frontend and API separately

Set `CORS_ORIGINS` on the API to a comma-separated list of exact frontend origins, including the scheme and optional port. For example:

```text
CORS_ORIGINS=https://giveaway.example.com,https://www.giveaway.example.com
```

Set `apiBaseUrl` in `public/app-config.json` to the API origin, without a trailing slash, before building/deploying the frontend:

```json
{
	"apiBaseUrl": "https://api.example.com"
}
```

The API serves both `/api` requests and `/avatars` images. Keep the CORS allowlist limited to trusted frontend origins.

## Start with Docker

Make sure Docker Desktop is running, then open PowerShell in the project folder and run:

```powershell
docker compose up --build
```

Open <http://localhost:8080/>. The web container serves Angular and proxies `/api` and `/avatars` to the Python API container. Press `Ctrl+C` to stop the services, or run `docker compose down` in another terminal. Downloaded avatars are stored in a Docker volume and survive container recreation. The original spreadsheet is not retained; entrant lists remain in browser memory and clear when the page is refreshed.
