# Pizza Management System

A full-stack pizza management system built with React, Node.js, and MongoDB.

## Features

- User and Admin Authentication
- Email Verification
- Password Reset
- Pizza Customization
- Order Management
- Inventory Management
- Real-time Order Status Updates
- Razorpay Integration
- Stock Alert System

## Project Structure

```
pizza-management-system/
├── client/                 # React frontend
├── server/                 # Node.js backend
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_email
   SMTP_PASS=your_smtp_password
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   REACT_APP_API_URL=https://pizzamania.com
   REACT_APP_API_URL=https://api.pizzamania.com
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Technologies Used

- Frontend:
  - React
  - Redux Toolkit
  - React Router
  - Axios
  - Material-UI
  - Razorpay

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT
  - Nodemailer
  - Razorpay
  - Node-cron

## API Documentation

The API documentation will be available at `/api-docs` when running the server. 

## Loading Component Usage

```jsx
import Loading from '../components/common/Loading';

// Basic usage
<Loading />

// With custom message
<Loading message="Fetching orders..." />
``` 

## ErrorBoundary Component Usage

```jsx
import ErrorBoundary from '../components/common/ErrorBoundary';

// Wrap components that might throw errors
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// You can also wrap the entire app
<ErrorBoundary>
  <App />
</ErrorBoundary>
``` 

## Toast Component Usage

```jsx
import { Toast } from './components/common/Toast';

function App() {
  return (
    <>
      <Router>
        {/* Your routes */}
      </Router>
      <Toast />
    </>
  );
}

// Anywhere in your components
import { showToast } from './components/common/Toast';
showToast.success('Operation successful!');
``` 

## Security Notes

- Keep your MongoDB connection string and JWT secret key secure
- Never share or expose your `.env` file
- Use environment variables for all sensitive configuration
- Regularly rotate your JWT secret key