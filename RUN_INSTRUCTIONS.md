# Run Instructions

Since you encountered network errors, it's best to run the frontend and backend in separate terminals to monitor their logs directly.

## Prerequisites
Ensure no other Node.js processes are blocking ports 3000 or 3001.

### 1. Start the Backend
Open a **new terminal**, navigate to the backend folder, and start the server:

```powershell
cd "g:\Product Data Explorer\backend"
npm run start:dev
```

**Wait** until you see the message: 
`LOG [NestApplication] Nest application successfully started`
`Application is running on: http://127.0.0.1:3001` (or similar)

### 2. Start the Frontend
Open a **second terminal**, navigate to the frontend folder, and start the app:

```powershell
cd "g:\Product Data Explorer\frontend"
npm run dev
```

**Wait** until you see:
`Ready in ...ms`
`- Local: http://localhost:3000`

### 3. Verify
Open your browser to [http://localhost:3000](http://localhost:3000).

- **Health Check**: If you still get errors, try visiting [http://127.0.0.1:3001/api](http://127.0.0.1:3001/api) in your browser. You should see the Swagger API documentation. If this load, the backend is working perfectly.
