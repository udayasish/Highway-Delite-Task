# Highway Delite Frontend

A React-based frontend application with authentication and note management features.

## Features

- **Authentication**: Sign up and sign in using Clerk authentication
- **Dashboard**: User dashboard with note management capabilities
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Note Management**: Create, view, and delete notes

## Routes

- `/` - Sign up page (redirects to dashboard if authenticated)
- `/signup` - Sign up page
- `/dashboard` - User dashboard with notes (requires authentication)

## Dashboard Features

The dashboard includes:

- User information display with masked email
- Create new notes with title and content
- View existing notes
- Delete notes with confirmation
- Sign out functionality
- Responsive design that adapts to mobile and desktop

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up Clerk authentication:

   - Create a Clerk account and get your publishable key
   - Add the key to your environment variables as `VITE_CLERK_PUBLISHABLE_KEY`

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Technologies Used

- React 19
- TypeScript
- Material-UI (MUI)
- Clerk Authentication
- React Router DOM
- Vite

## Design

The application features a clean, modern design with:

- Blue accent colors (#1976d2)
- Card-based layout
- Responsive typography
- Mobile-first approach
- Consistent spacing and shadows
