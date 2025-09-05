import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
    const apps = getApps();

    if (apps.length === 0) {
        try {
            // Ensure the private key is properly formatted
            const privateKey = process.env.FIREBASE_PRIVATE_KEY
                ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
                : null;

            if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
                throw new Error('Missing required Firebase environment variables');
            }

            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: privateKey,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                }),
            });
        } catch (error) {
            console.error('Error initializing Firebase Admin:', error);
            throw error;
        }
    }

    return {
        auth: getAuth(),
        db: getFirestore()
    }
}

export const { auth, db } = initFirebaseAdmin();