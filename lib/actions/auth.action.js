"use server";

import { auth, db } from "../../firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function getCurrentUser() {
  if (
    typeof window === "undefined" &&
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL
  ) {
    console.log("Build time detected - skipping getCurrentUser");
    return null;
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie || !sessionCookie.value) {
      console.log("No session cookie found");
      return null;
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie.value);

    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userDoc.exists) {
      console.warn("No user document in Firestore for UID:", decodedClaims.uid);

      try {
        const userRecord = await auth.getUser(decodedClaims.uid);

        return {
          uid: userRecord.uid,
          email: userRecord.email,
          name: userRecord.displayName || "Hello User",
          photoURL: userRecord.photoURL || null,
        };
      } catch (authError) {
        console.error("Error getting user from Firebase Auth:", authError);
        return null;
      }
    }

    const userData = userDoc.data();

    return {
      uid: decodedClaims.uid,
      email: userData.email,
      name: userData.displayName || userData.name,
      photoURL: userData.photoURL || null,
    };
  } catch (error) {
    console.error("Error verifying session cookie:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name,
    });

    if (
      error.message?.includes("Dynamic server usage") ||
      error.message?.includes("couldn't be rendered statically")
    ) {
      console.log("Build-time error detected, returning null");
      return null;
    }

    if (error.code === "auth/session-cookie-expired") {
      console.log("Session cookie expired, clearing...");
      await clearInvalidSession();
      return null;
    } else if (error.code === "auth/session-cookie-revoked") {
      console.log("Session cookie revoked, clearing...");
      await clearInvalidSession();
      return null;
    } else if (error.code === "auth/invalid-session-cookie-duration") {
      console.log("Invalid session cookie duration, clearing...");
      await clearInvalidSession();
      return null;
    } else if (error.code === "auth/argument-error") {
      console.log("Invalid session cookie format, clearing...");
      await clearInvalidSession();
      return null;
    }

    if (error.code && error.code.startsWith("auth/")) {
      console.log("Auth error detected, clearing session");
      await clearInvalidSession();
    }

    return null;
  }
}

export async function isAuthenticated() {
  if (
    typeof window === "undefined" &&
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL
  ) {
    return false;
  }

  const user = await getCurrentUser();
  return user !== null;
}

export async function logout() {
  if (
    typeof window === "undefined" &&
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL
  ) {
    return { success: true, message: "Build time - no logout needed" };
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie && sessionCookie.value) {
      try {
        const decodedClaims = await auth.verifySessionCookie(
          sessionCookie.value
        );
        await auth.revokeRefreshTokens(decodedClaims.uid);
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
    cookieStore.delete("session", {
      path: "/",
      sameSite: "lax",
    });
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      success: false,
      message: "Failed to log out",
    };
  }
}

export async function setSessionCookies(idToken) {
  if (
    typeof window === "undefined" &&
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL
  ) {
    console.log("Build time - skipping cookie setting");
    return;
  }

  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

async function clearInvalidSession() {
  if (
    typeof window === "undefined" &&
    process.env.NODE_ENV === "production" &&
    !process.env.VERCEL
  ) {
    console.log("Build time - skipping session clear");
    return;
  }

  try {
    const cookieStore = await cookies();
    cookieStore.delete("session", {
      path: "/",
      sameSite: "lax",
    });
    console.log("Invalid session cookie cleared");
  } catch (error) {
    console.error("Error clearing invalid session:", error);
  }
}

export async function signUp(data) {
  const { uid, email, name } = data;

  try {
    // Add timeout and better error handling for Firestore operations
    const userRecord = await Promise.race([
      db.collection("users").doc(uid).get(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore operation timeout')), 10000)
      )
    ]);

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please log in.",
      };
    }

    await Promise.race([
      db.collection("users").doc(uid).set({
        email: email,
        displayName: name,
        createdAt: new Date().toISOString(),
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore operation timeout')), 10000)
      )
    ]);

    return {
      success: true,
      message: "User signed up successfully.",
    };
  } catch (error) {
    console.error("Error during sign up:", error);
    
    // Handle specific Firebase/Firestore errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists. Please use a different email.",
      };
    }
    
    if (error.message?.includes('DECODER routines::unsupported') || 
        error.message?.includes('Getting metadata from plugin failed')) {
      return {
        success: false,
        message: "Database connection error. Please check your configuration and try again.",
      };
    }
    
    if (error.message === 'Firestore operation timeout') {
      return {
        success: false,
        message: "Request timeout. Please try again.",
      };
    }
    
    return {
      success: false,
      message: "An error occurred during sign up. Please try again later.",
    };
  }
}

export async function SignIn(data) {
  try {
    const { email, idToken } = data;

    const decodedToken = await auth.verifyIdToken(idToken);

    const userResponse = await auth.getUserByEmail(email);

    if (!userResponse) {
      return {
        success: false,
        message: "Failed to Log In",
      };
    }

    await setSessionCookies(idToken);

    return {
      success: true,
      message: "Login Successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to log in Account",
    };
  }
}
