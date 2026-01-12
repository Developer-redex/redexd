# WhatsCap - Build & Run Instructions

## 1. Prerequisites
- Node.js installed.
- Internet connection (for first-time WebRTC/Socket connections).

## 2. Running the App
### Option A: Development Mode (Recommended for testing code)
1. Open terminal in project folder.
2. Run: 
   ```powershell
   npm run electron:dev
   ```
   This starts the React server, Electron app, and you must run the backend implementation manually if not integrated.

### Option B: Production Build (.exe)
The build output is located in:
`dist-electron/win-unpacked/WhatsCap.exe` (or `whatscap.exe`)
OR inside `dist-electron/` as an installer (depending on configuration).

**IMPORTANT**:
The current version requires the backend server to be running separately for messaging to work!

## 3. Starting the Server
1. Open a new terminal.
2. Run:
   ```powershell
   node src/server/server.js
   ```
   (Server runs on port 3000)

## 4. Features
- **Blue Theme / Dark Mode**: Toggle in settings.
- **RTL Support**: Arabic by default.
- **Messaging**: Real-time via Socket.io.
- **Calls**: WebRTC signaling implemented (requires two running instances).
