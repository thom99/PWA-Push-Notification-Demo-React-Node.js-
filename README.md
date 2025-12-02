🚀 PWA Push Notification Demo (React + Node.js)

This repository contains a complete and working example of implementing Web Push Notifications in a Progressive Web App (PWA).

The project is divided into two parts:

Frontend (Client):
A React + Vite application that handles Service Worker registration, notification permission requests, and subscription to the Push service (using VAPID keys).

Backend (Server):
A Node.js + Express server that stores subscriptions and uses the web-push library to actually send notifications.

🌟 Main Features

Complete Setup: From client subscription to sending notifications from the server.

VAPID Management: Fetching the VAPID public key from the server and converting it to a Uint8Array on the client for subscription.

Real-Time Communication: Uses BroadcastChannel to send notification data from the Service Worker directly to the open React app, enabling immediate UI updates.

Essential Service Worker: public/sw.js is configured to intercept push events (displaying desktop notifications) and handle notificationclick.

Vite Proxy Setup: Uses Vite’s proxy to route API calls (/api/*) to the Node.js server.

Improved Security: Private VAPID keys are managed via environment variables (.env).

🛠️ How to Run the Project
Prerequisites

Node.js (version 14+)

A set of VAPID keys (public and private)

dotenv library (install with npm install dotenv on the server)

1. Backend Setup (Security)

⚠️ WARNING:
server.js now reads secret keys from environment variables to ensure the published code remains secure.

Create the .env file

In the Node.js project root, create a file named .env.

Add your keys

Insert your real VAPID public/private keys inside .env:

VAPID_PUBLIC_KEY="YOUR_PUBLIC_KEY"
VAPID_PRIVATE_KEY="YOUR_PRIVATE_SECRET_KEY"

Protect the keys

Make sure .env is added to .gitignore so private keys are never pushed to GitHub.

2. Run the Project

Run the server and the frontend in two separate terminals.

Terminal 1: Start the Node.js Server
# Assuming server dependencies are already installed
node server.js

Terminal 2: Start the Frontend App (Vite/React)
# Inside the React project folder
npm install
npm run dev

3. Test Push Notification Sending

Open the app in your browser (e.g., http://localhost:5173).

Accept the notification permission request.

Check the browser console to confirm the subscription was sent to the server.

To send a test notification, open a new browser tab and visit:

http://localhost:3000/api/push


The server will attempt to send the notification to all stored subscriptions (in-memory).
If everything is set up correctly, you will see the notification appear on your desktop!

📜 File Structure

src/App.tsx → Main React component. Handles VAPID key fetching, Push subscription, and listening to real-time notifications via BroadcastChannel.

public/sw.js → Service Worker. intercepts push events, handles notificationclick, and sends in-app messages via BroadcastChannel.

server.js → Node.js + Express server. Provides the VAPID public key and handles sending notifications.

vite.config.ts → Proxy configuration to connect frontend (:5173) with backend (:3000).

.env → Contains VAPID public/private keys, kept out of version control (Git).
