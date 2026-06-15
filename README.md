# BatteryQC Pro 🔋

Professional Li-ion Battery Inspection System — React frontend + FastAPI backend + MongoDB + Context-Aware AI Chatbot assistant.

---

## 📺 Project Demo Video

## 📺 Project Demo Video

Ensure you check out our execution pipeline in action:

[▶ Watch Project Execution Demo Video](demo.mp4)
---

## Project Structure
```
batteryqc/
├── frontend/                  # React app (Create React App)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── UI.jsx         # Shared components (Icon, StatCard, Gauge, etc.)
│   │   │   ├── Navbar.jsx     # Top navigation bar
│   │   │   ├── InspectionForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── Chatbot.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InspectPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── hooks/
│   │   │   ├── useInspections.js
│   │   │   └── useChat.js
│   │   ├── utils/
│   │   │   ├── constants.js   # Battery specs, thresholds, icons
│   │   │   └── api.js         # Axios API calls
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── backend/                   # FastAPI app
    ├── routers/
    │   ├── inspections.py     # CRUD for inspection records
    │   └── chat.py            # Claude AI chat endpoint
    ├── models/
    │   └── schemas.py         # Pydantic models
    ├── database/
    │   └── connection.py      # Motor async MongoDB client
    ├── utils/
    │   ├── config.py          # Settings from .env
    │   └── inspection_logic.py
    ├── main.py                # FastAPI entry point
    ├── requirements.txt
    └── .env.example
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- MongoDB (local or Atlas)
- Anthropic API key → https://console.anthropic.com

---

## Setup & Run

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your ANTHROPIC_API_KEY and MONGODB_URL

# Start server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# REACT_APP_API_URL=http://localhost:8000

# Start dev server
npm start
```

Frontend runs at: http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/inspections | List all inspections |
| POST | /api/inspections | Create new inspection |
| GET | /api/inspections/{id} | Get single inspection |
| DELETE | /api/inspections/{id} | Delete inspection |
| GET | /api/inspections/stats/summary | Aggregate stats |
| POST | /api/chat | AI chat (Claude) |

---

## Inspection Thresholds

| Parameter | Requirement | Fail Condition |
|-----------|-------------|----------------|
| Voltage | > 3.0 V | ≤ 3.0 V |
| Temperature | < 60 °C | ≥ 60 °C |
| Internal Impedance | < 0.07 Ω | ≥ 0.07 Ω |
| Physical Condition | No cracks/leaks | Any damage |

---

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Recharts, date-fns
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic v2
- **Database**: MongoDB
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)


