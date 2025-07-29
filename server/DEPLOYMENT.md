# Deployment Guide

## Production Build Steps

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Start Production Server

```bash
npm start
```

## Common Issues and Solutions

### TypeScript Compilation Errors

If you encounter TypeScript errors like:

- "Cannot find module 'express'"
- "Cannot find name 'console'"
- "Cannot find name 'process'"

**Solution:**

1. Ensure all dependencies are installed:

   ```bash
   npm install
   ```

2. Check that `node_modules` directory exists and contains `@types` folder

3. Verify TypeScript configuration in `tsconfig.json`

### Environment Variables

Make sure to set up your `.env` file with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Docker Deployment (Optional)

If using Docker, ensure your Dockerfile includes:

```dockerfile
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```

## Troubleshooting

1. **Clear cache and reinstall:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check TypeScript version:**

   ```bash
   npx tsc --version
   ```

3. **Verify build output:**
   ```bash
   ls -la dist/
   ```
