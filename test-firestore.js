import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';

// simple parse
const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
for (const line of lines) {
  if (line.includes('=')) {
    const [key, ...valParts] = line.split('=');
    let val = valParts.join('=');
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key.trim()] = val.trim();
  }
}

try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  console.log("PRIVATE KEY START:", privateKey ? privateKey.substring(0, 30) : null);
  console.log("PROJECT ID:", process.env.FIREBASE_PROJECT_ID);

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });

  const db = getFirestore(app);
  db.collection("users").limit(1).get()
    .then(() => {
      console.log("Firestore connection successful!");
      process.exit(0);
    })
    .catch(e => {
      console.error("Firestore connection failed:", e);
      process.exit(1);
    });

} catch(e) {
  console.error("Init failed:", e);
  process.exit(1);
}
