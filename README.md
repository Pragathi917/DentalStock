# 🦷 DentalStock

> **Smarter inventory. Better care.**

DentalStock is a web-based **Dental Hospital Inventory Management and Demand Forecasting System** built using the MERN stack.

It helps dental hospitals and clinics manage dental supplies, monitor stock levels, track material usage, identify low-stock and expiring items, and estimate future inventory requirements using historical usage data.

---

## ✨ Features

### 🔐 Authentication & Role-Based Access
- JWT-based authentication
- Admin and Staff roles
- Protected routes
- Role-based access control
- Secure logout and session handling

### 📦 Inventory Management
- Add, view, edit and delete inventory items
- Track quantity and minimum stock levels
- Manage suppliers, prices and batch numbers
- Track expiry dates
- Search and filter inventory

### 📝 Usage Tracking
- Record inventory consumption
- Automatically update stock quantities
- Maintain usage history
- Track purpose and user responsible for usage
- Prevent usage beyond available stock

### 🔮 Demand Forecasting
- Forecast future demand using historical usage
- Calculate average consumption
- Display predicted demand
- Provide recommended order quantities
- Visualize usage trends

### 🚨 Inventory Alerts
- Low-stock alerts
- Expiry alerts
- Expired item alerts
- Forecast-based shortage warnings

### 👥 User Management
- Admin can view staff accounts
- Admin can create staff accounts
- Admin can remove staff accounts
- Staff cannot access administrative functions

---

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- React Router
- Axios
- Recharts
- CSS

**Backend**
- Node.js
- Express.js
- Mongoose
- JWT
- bcrypt

**Database**
- MongoDB Atlas

---

## 📁 Project Structure

```text
Dental Stock/
├── backend/
└── frontend/
