import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// ⚠️  REPLACE THESE VALUES with your own Firebase project config
// Go to Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Firebase Realtime Database expected structure:
// {
//   "categories": [
//     { "id": "cricket", "name": "Cricket", "icon": "baseball", "color": "#e63946", "order": 1 },
//     { "id": "football", "name": "Football", "icon": "football", "color": "#2196f3", "order": 2 },
//     { "id": "tennis",   "name": "Tennis",   "icon": "tennisball", "color": "#4caf50", "order": 3 }
//   ],
//   "channels": {
//     "cricket": [
//       { "id": "star1", "name": "Star Sports 1", "logo": "https://...", "streamUrl": "https://live.m3u8", "isLive": true },
//       { "id": "star2", "name": "Star Sports 2", "logo": "https://...", "streamUrl": "https://live.m3u8", "isLive": true }
//     ],
//     "football": [
//       { "id": "sony1", "name": "Sony Ten 1",   "logo": "https://...", "streamUrl": "https://live.m3u8", "isLive": true }
//     ]
//   }
// }

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export default app;
