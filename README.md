#  Voice Assistant 

Beginner-friendly learning project that runs only on your PC.

## Features

- Voice to text with browser Web Speech API
- Gemini-powered intent parsing (strict JSON)
- Safe action whitelist only
- React frontend + Express backend + WebSocket updates
- Optional browser TTS
- Optional Python runner (disabled by default)

## Project Structure

```text
voice-assistant/
  backend/
    .env.example
    package.json
    src/
      server.js
      app.js
      config/
      routes/
      controllers/
      services/
      providers/
      actions/
      websocket/
      middleware/
      utils/
  frontend/
    .env.example
    package.json
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      App.css
      components/
      hooks/
      services/
      utils/
  optional-python-runner/
    requirements.txt
    main.py
  README.md
```

## Safe Actions Implemented

- `open_website(url)`
- `google_search(query)`
- `get_time()`
- `clipboard_copy(text)`
- `system_info()`

Anything unsafe is blocked and converted to `unknown/none`.

## Backend API

- `GET /api/health`
- `POST /api/command`

Request body for `/api/command`:

```json
{
  "text": "what time is it"
}
```

## Environment Setup

### Backend

Copy `.env.example` to `.env` in `backend/` and set values:

```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_key
CONFIDENCE_THRESHOLD=0.70
OPTIONAL_PYTHON_RUNNER_URL=http://127.0.0.1:8001
```

### Frontend

Copy `.env.example` to `.env` in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Run Commands (Windows PowerShell)

### Backend

```powershell
cd backend
npm install
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Optional Python Runner

```powershell
cd optional-python-runner
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

## Manual End-to-End Testing

1. Open frontend at `http://127.0.0.1:5173`
2. Verify WebSocket status shows connected
3. Test commands:
   - "what time is it" -> returns local time
   - "google React docs" -> opens browser search
   - "open https://example.com" -> opens website
   - "copy hello world" -> copies text to clipboard
   - "system info" -> returns platform, memory, uptime, CPU load

## Troubleshooting

- Mic permission denied:
  - Allow microphone in browser site settings, then refresh page.
- SpeechRecognition unsupported:
  - Use latest Chrome or Edge on desktop.
- CORS blocked:
  - Match `FRONTEND_ORIGIN` in backend `.env` with frontend URL.
- WebSocket not connecting:
  - Ensure backend is running on `127.0.0.1:5000` and frontend uses correct `VITE_BACKEND_URL`.
- Gemini key missing:
  - Set `GEMINI_API_KEY` in `backend/.env`, restart backend.
- Port already in use:
  - Change backend `PORT` or frontend Vite port and update env values.
- Clipboard copy issue:
  - Keep copied text under max length and run app with normal desktop permissions.

## Security Notes

- Backend binds only to `127.0.0.1`
- Action whitelist only, no shell execution
- URL protocol validation (http/https only)
- Input length checks + rate limiting
- Unsafe instructions are explicitly denied
