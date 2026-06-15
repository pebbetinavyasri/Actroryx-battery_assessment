# BatteryQC Pro 🔋

An advanced, full-stack 3.7V Li-ion Battery Quality Control system featuring real-time data plotting analytics dashboards and an interactive, context-aware AI Battery Expert assistant.

---
## 📺 Project Demo Video

Ensure you check out our execution pipeline in action:

<video src="https://github.com/pebbetinavyasri/Actroryx-battery_assessment/blob/main/demo.mp4?raw=true" width="100%" controls></video>

---

## 🚀 Key Features

### 📊 Real-Time Dashboard Analytics
* **Mean Performance Monitoring:** Interactive Bar Charts powered by `recharts` mapping historical averages for core testing limits.
* **Smart Alert Flags:** Visual warnings tracking out-of-spec voltage limits, high temperature spikes, or structural physical casing damage.
* **Data Log Table:** Organized inspection logs displaying status tags (`PASS`/`FAIL`) formatted smoothly using `date-fns`.

### 🤖 AI Battery Expert (Persistent Chat)
* **Local Llama 3 Processing:** Context-aware terminal queries parsing hardware architectures, battery chemistry safety, and operational standards.
* **Persistent Memory State:** Integrated `localStorage` pipeline caching chat arrays so history is preserved flawlessly during page transitions.
* **Pre-Loaded Hardware Specs:** Automated systemic background context ensuring response synchronization with your custom testing profiles (3.7V Li-ion, 2.6 Ah).

---

## 📂 Project Repository Directory Layout

```text
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
    │   └── chat.py            # Local Llama 3 chat endpoint
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