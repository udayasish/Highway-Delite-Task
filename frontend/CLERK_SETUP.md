# Clerk Setup Guide

This project now includes Google signup functionality using Clerk authentication.

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application in your Clerk dashboard

### 2. Configure Google OAuth

1. In your Clerk dashboard, go to "User & Authentication" → "Social Connections"
2. Enable Google OAuth
3. Configure your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Copy the Client ID and Client Secret to Clerk

### 3. Get Your Publishable Key

1. In your Clerk dashboard, go to "API Keys"
2. Copy your "Publishable Key" (starts with `pk_test_` or `pk_live_`)

### 4. Set Environment Variable

Create a `.env` file in the frontend directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-publishable-key-here
```

### 5. Configure Redirect URLs

In your Clerk dashboard, go to "User & Authentication" → "Redirect URLs" and add:

- `http://localhost:5173/signup` (for development)
- `http://localhost:5173/dashboard` (for development)
- Your production URLs when deploying

### 6. Run the Application

```bash
cd frontend
pnpm dev
```

## Features Added

1. **Google Signup Button**: Users can sign up using their Google account
2. **Email/Password Signup**: Traditional signup form with OTP verification
3. **Error Handling**: Proper error messages for failed authentication
4. **Loading States**: Visual feedback during authentication processes
5. **Responsive Design**: Maintains the existing beautiful UI design

## How It Works

- The Google signup button uses Clerk's OAuth flow
- The email form uses Clerk's email/password authentication with OTP
- Both methods integrate seamlessly with your existing signup page design
- After successful authentication, users are redirected to `/dashboard`

## Next Steps

1. Create a dashboard page at `/dashboard` to handle successful signups
2. Add sign-in functionality
3. Implement user profile management
4. Add protected routes using Clerk's authentication guards
