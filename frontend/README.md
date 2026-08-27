# DentalStock Frontend

The web user interface for **DentalStock**, a Dental Inventory Management & Demand Forecasting System clinic application built in React. It connects to the Express/Node backend API.

## Technology Stack

- **Framework:** React + Vite
- **Router:** React Router DOM (v6)
- **HTTP Client:** Axios (configured with automated headers & 401 session-expiration interceptors)
- **Visual Design:** Vanilla CSS (Refined healthcare typography, grids, layout frames)
- **Icons:** lucide-react
- **Data Graphs:** Recharts

---

## Installation & Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## Environment Configuration

Create a `.env` configuration file in the `frontend/` directory (see `.env.example` for reference). Add the following parameters:

```env
VITE_API_URL=http://localhost:5050/api
```

---

## Running the Application

Start the Vite hot-reloading development server locally:

```bash
npm run dev
```

The application will start, typically on `http://localhost:5173`. You can log in using either administrative or staff accounts created in the backend.

---

## Folder Structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/         # Reusable widgets
│   │   ├── AdminRoute.jsx      # Admin guard
│   │   ├── Layout.jsx          # Sidebar + Topbar wrapper shell
│   │   ├── Modal.jsx           # Backdropped popup Modal
│   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   ├── Sidebar.jsx         # Navigation sidebar panel
│   │   ├── Toast.jsx           # Floating status notification popup
│   │   └── Topbar.jsx          # Header details banner
│   ├── context/
│   │   └── AuthContext.jsx     # Handles credentials & login/logout state
│   ├── pages/              # Screen components
│   │   ├── AddInventory.jsx
│   │   ├── Alerts.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditInventory.jsx
│   │   ├── Forecast.jsx
│   │   ├── Inventory.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Unauthorized.jsx
│   │   ├── Usage.jsx
│   │   └── Users.jsx
│   ├── services/           # Backend endpoint handlers
│   │   ├── api.js              # Base Axios client with request/response interceptors
│   │   ├── alertService.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── forecastService.js
│   │   ├── inventoryService.js
│   │   ├── usageService.js
│   │   └── userService.js
│   ├── utils/              # Helper utilities
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── errorHandler.js
│   ├── App.jsx             # React router config mapping
│   ├── index.css           # Global custom style definitions
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Verification Test Flows

### Admin Account Flow:
1. Log in.
2. View analytics on **Dashboard**.
3. Go to **Inventory** -> click **+ Add Inventory** -> fill and submit form.
4. **Edit** or **Delete** items (triggering confirmation modal).
5. Add or view procedure consumption details on **Usage**.
6. View dynamic shortages/forecasts on **Forecast**.
7. Create staff accounts or view user lists on **Users**.

### Staff Account Flow:
1. Log in.
2. View dashboard and read inventory lists.
3. Edit, Add, and Delete item buttons are hidden from UI.
4. Accessing `/users` or `/inventory/add` manually triggers **Access Restricted** redirection.
5. Record stock usage on **Usage**.
6. Inspect alerts on **Alerts** and run demand averages on **Forecast**.
