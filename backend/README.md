# DentalStock Backend

A simple, clean, and beginner-friendly Dental Inventory Management & Demand Forecasting System backend built as a college assignment. It features REST APIs, JWT authentication, Mongoose-based data models, stock tracking, moving-average forecasting, and dynamic alerts.

## Technology Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose ODM)
- **Security:** Helmet, CORS, bcryptjs (password hashing), JSON Web Tokens (JWT authentication)
- **Configuration:** dotenv
- **Development Tooling:** nodemon

---

## Folder Structure

```
Dental Stock/
└── backend/
    ├── config/             # Database configuration
    │   └── db.js
    ├── controllers/        # Express controllers (business logic)
    │   ├── alertController.js
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── forecastController.js
    │   ├── inventoryController.js
    │   ├── usageController.js
    │   └── userController.js
    ├── middleware/         # Security and authentication middlewares
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── roleMiddleware.js
    ├── models/             # Mongoose schemas
    │   ├── Inventory.js
    │   ├── UsageHistory.js
    │   └── User.js
    ├── routes/             # Express API routes
    │   ├── alertRoutes.js
    │   ├── authRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── forecastRoutes.js
    │   ├── inventoryRoutes.js
    │   ├── usageRoutes.js
    │   └── userRoutes.js
    ├── seed/               # Initial database seed scripts
    │   └── createAdmin.js
    ├── utils/              # Helper utilities
    │   ├── forecast.js
    │   └── inventoryStatus.js
    ├── .env                # Environment variables (Excluded from git)
    ├── .env.example        # Reference environment variables
    ├── .gitignore          # Git exclusion rules
    ├── package.json        # Dependencies & package configurations
    ├── server.js           # Server entry point
    └── README.md
```

---

## Installation & Setup

1. **Clone or open the directory** in your workspace.
2. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## Environment Variables

Create a file named `.env` in the `backend/` directory (see `.env.example` for reference). Add the following parameters:

```env
PORT=5050
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/DentalStock?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# Admin Seed Credentials
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@dentalstock.com
ADMIN_PASSWORD=AdminPassword123
```

---

## Database Seeding (First Admin Account)

To bootstrap the database with the initial Admin account using the credentials defined in `.env`, run the seed script:

```bash
npm run seed:admin
```

---

## Running the Server

Start the application in development mode with hot-reloading:

```bash
npm run dev
```

The server runs on `http://localhost:5050` by default.

Start in production mode:

```bash
npm start
```

---

## User Roles & Permissions

- **ADMIN**:
  - Full access to inventory CRUD (Create, Read, Update, Delete items).
  - Ability to create and delete `STAFF` accounts (prevented from self-deletion or deleting the last admin).
  - View dashboards, reports, and alerts.
  - Record inventory usage.
- **STAFF**:
  - Read-only access to the inventory list and details (cannot edit details directly, delete items, or add items).
  - Ability to log inventory usage (e.g. usage automatically decreases item stock level).
  - View forecasts, alerts, and usage history logs.

---

## Demand Forecasting Logic

The demand forecasting feature calculates predictions using a simple **Moving Average Forecast**:
1. Groups usage logs by month (`YYYY-MM`).
2. Calculates the total quantity used per month.
3. Averages the monthly quantities over the latest 3 months (or all available months if fewer than 3 months exist).
4. **Formula**:
   $$\text{Predicted Demand} = \frac{\text{Month}_1 + \text{Month}_2 + \text{Month}_3}{3}$$
   $$\text{Recommended Order} = \max(0, \text{Predicted Demand} - \text{Current Stock})$$
5. Sets status to `POTENTIAL_SHORTAGE` if current stock is less than predicted demand, or `SUFFICIENT_STOCK` otherwise.

---

## API Endpoints List

### Health & Meta
- `GET /` - Root status message
- `GET /api/health` - Health check (confirms API running & MongoDB state)

### Authentication
- `POST /api/auth/login` - Authenticate credentials and return JWT token
- `POST /api/auth/register` - Public staff registration

### Users (Admin Only)
- `GET /api/users` - Get list of users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete staff user

### Inventory (Auth Required)
- `GET /api/inventory` - Get all inventory items (supports `search`, `category`, `status`, and `sort` query filters)
- `GET /api/inventory/:id` - Get specific item details
- `POST /api/inventory` - Create item (Admin Only)
- `PUT /api/inventory/:id` - Update item (Admin Only)
- `DELETE /api/inventory/:id` - Delete item (Admin Only)

### Usage Logs (Auth Required)
- `POST /api/usage` - Record usage of an item (automatically decreases inventory stock)
- `GET /api/usage` - Get all usage logs (supports `item`, `startDate`, and `endDate` query filters)
- `GET /api/usage/:inventoryId` - Get usage logs for specific item

### Forecast (Auth Required)
- `GET /api/forecast/:inventoryId` - Get moving average forecast (supports `months` query parameter)

### Alerts (Auth Required)
- `GET /api/alerts` - Get low stock, expiring, expired, and forecast shortages

### Dashboard (Auth Required)
- `GET /api/dashboard` - Get total value, item counts, category stats, and monthly usage charts
