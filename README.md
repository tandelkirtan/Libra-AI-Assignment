# Expense Tracker Application

A premium, highly responsive, full-stack Expense Tracker application. Built with React (Vite) and Tailwind CSS on the frontend, and Node.js + Express + MongoDB on the backend.

---

## Project Overview

This Expense Tracker application helps users manage their personal finances by tracking expenses, viewing spending patterns through interactive charts, and maintaining a comprehensive expense history. The application features a modern, responsive UI with dark mode support and secure JWT-based authentication.

**Tech Stack:**
- **Frontend:** React.js (Vite), Tailwind CSS, Recharts, Axios, Lucide React
- **Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT Authentication, Express Validator

---

## Features

### Authentication
- User registration with Name, Email, Password, and Confirm Password
- Login with Email and Password only
- JWT token-based authentication with automatic token management
- Protected routes for authenticated users only

### Dashboard
- Quick overview of total expenses and monthly spending
- Recent transactions list
- Interactive charts:
  - Monthly Expense Trend Chart (Area Chart)
  - Category-wise Expense Chart (Pie Chart)
- Summary cards with key metrics

### Expense Management
- Add new expenses with title, amount, category, and date
- Edit existing expenses
- Delete expenses
- View complete expense history
- Form validation for all expense operations

### Search & Filter
- Search expenses by title
- Filter expenses by category dropdown
- Pagination (10 items per page) for expense history

### User Experience
- Responsive design (mobile-first approach)
- Dark mode toggle with persistence
- Clean, modern UI with smooth transitions
- Real-time data updates

---

## Setup Steps

### Prerequisites
- [Node.js](https://nodejs.org/) installed locally (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` OR a remote MongoDB Atlas connection string

### 1. Backend Server Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Duplicate `.env.example` to create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - In `.env`, ensure the `MONGO_URI` and `JWT_SECRET` are set correctly:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
     JWT_SECRET=super_secret_jwt_key_change_me
     ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5000](http://localhost:5000).*

### 2. Frontend Client Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client development server:
   ```bash
   npm run dev
   ```
   *The client runs on [http://localhost:5173](http://localhost:5173).*

---

## API Documentation

All routes expect JSON payloads. Authenticated routes require an `Authorization: Bearer <TOKEN>` header.

### Authentication Endpoints

#### POST `/api/auth/register` (Public)
Registers a new user and returns a JWT token.
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### POST `/api/auth/login` (Public)
Logs a user in and returns a JWT token.
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### GET `/api/auth/me` (Protected)
Retrieves current logged-in user details.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:**
  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### GET `/api/auth/dashboard` (Protected)
Get dashboard data including user info, stats, and recent expenses.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:**
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "stats": {
      "totalAllTime": 5000.00,
      "thisMonthTotal": 1500.00,
      "totalTransactions": 25
    },
    "recentExpenses": [...]
  }
  ```

### Expense Management Endpoints (All Protected)

#### GET `/api/expenses` (Protected)
Fetches user expenses with pagination and filters.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Parameters:**
  - `search` (optional): Search by title
  - `category` (optional): Filter by category
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response:**
  ```json
  {
    "expenses": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```

#### GET `/api/expenses/stats` (Protected)
Returns expense statistics and breakdowns.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:**
  ```json
  {
    "totalAllTime": 5000.00,
    "thisMonthTotal": 1500.00,
    "totalTransactions": 25,
    "monthlyBreakdown": [
      { "month": "Jan 24", "amount": 1200.00 },
      { "month": "Feb 24", "amount": 1800.00 }
    ],
    "categoryBreakdown": [
      { "category": "Food", "amount": 2000.00 },
      { "category": "Transport", "amount": 1000.00 }
    ]
  }
  ```

#### GET `/api/expenses/:id` (Protected)
Get a single expense by ID.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:**
  ```json
  {
    "_id": "expense_id",
    "userId": "user_id",
    "title": "Grocery Shopping",
    "amount": 150.00,
    "category": "Food",
    "expenseDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
  ```

#### POST `/api/expenses` (Protected)
Creates a new expense record.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
  ```json
  {
    "title": "Grocery Shopping",
    "amount": 150.00,
    "category": "Food",
    "expenseDate": "2024-01-15"
  }
  ```
- **Allowed Categories:** `Food`, `Transport`, `Shopping`, `Bills`, `Health`, `Entertainment`, `Other`
- **Response:** Returns the created expense object

#### PUT `/api/expenses/:id` (Protected)
Updates an existing expense. Verifies ownership.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:** Any expense field (optional)
  ```json
  {
    "title": "Updated Title",
    "amount": 200.00
  }
  ```
- **Response:** Returns the updated expense object

#### DELETE `/api/expenses/:id` (Protected)
Deletes an expense. Verifies ownership.
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response:**
  ```json
  {
    "message": "Expense removed"
  }
  ```

---

## Screenshots

*(Add screenshots of your application here)*

- **Login Page:** User authentication interface
- **Register Page:** New user registration form
- **Dashboard:** Overview with charts and recent transactions
- **History Page:** Complete expense history with search and filters
- **Dark Mode:** Application in dark theme
