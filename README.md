# Highway Delite Task - Setup Instructions

## 🔧 Backend Setup

### 1. **Install Dependencies**

```bash
cd server
npm install
# or
pnpm install
```

### 2. **Environment Variables**

Create a `.env` file in the `server` directory by copying the example:

```bash
cp env.example .env
```

### 3. **Start Backend Server**

```bash
# Development mode
npm run dev
# or
pnpm dev

# Production mode
npm start
# or
pnpm start
```

The server will start on `http://localhost:3000`

## 🎨 Frontend Setup

### 1. **Install Dependencies**

```bash
cd frontend
npm install
# or
pnpm install
```

### 2. **Start Frontend Development Server**

```bash
npm run dev
# or
pnpm dev
```

The frontend will start on `http://localhost:5173`

## ✅ Features Implemented

### **Authentication System**

- ✅ Email and OTP-based signup
- ✅ Email and OTP-based login
- ✅ JWT token-based authentication
- ✅ Protected routes and middleware

### **OTP Flow**

- ✅ Email OTP generation and verification
- ✅ OTP verification page with countdown
- ✅ Error handling for invalid/expired OTP
- ✅ Secure OTP storage and expiration

### **User Management**

- ✅ User registration with validation (name, email, date of birth)
- ✅ User login with validation (email + OTP)
- ✅ User information display on dashboard
- ✅ Email verification status tracking

### **Notes Management**

- ✅ Create notes with title and content
- ✅ Delete notes with confirmation
- ✅ View all user notes with sorting
- ✅ Notes persistence in MongoDB
- ✅ User-specific note isolation

### **Security**

- ✅ JWT token authentication
- ✅ OTP-based authentication
- ✅ Protected API endpoints
- ✅ Input validation and sanitization
- ✅ Secure password handling

## 🔌 API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/send-otp` - Send OTP for login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login

### **Notes** (Protected Routes)

- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create note
- `DELETE /api/notes/:id` - Delete note

## 🗄️ Database Schema

### **User Collection**

```javascript
{
  name: String (required),
  email: String (required, unique),
  dateOfBirth: String (required),
  isEmailVerified: Boolean (default: false),
  otp: String,
  otpExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Note Collection**

```javascript
{
  userId: ObjectId (ref: User, required),
  title: String (required),
  content: String (required),
  createdAt: Date,
  updatedAt: Date
}
```
