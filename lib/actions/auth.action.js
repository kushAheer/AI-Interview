"use server";

import { auth, db } from "../../firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(data) {
  const { uid, email, name } = data;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please log in.",
      };
    }

    await db.collection("users").doc(uid).set({
      email: email,
      name: name,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "User signed up successfully.",
    };
  } catch (error) {
    console.error("Error during sign up:", error);
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists. Please use a different email.",
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

    const userResponse = await auth.getUserByEmail(email);

    if (!userResponse) {
      return {
        success: false,
        message: "Falied to Log In",
      };
    }

    await setSessionCookies(idToken);

    return {
      success: true,
      message: "Login Successfull",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to log in Account ",
    };
  }
}

export async function setSessionCookies(idToken) {
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

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(
      sessionCookie.value,
      true
    );
    const userRecord = await auth.getUser(decodedClaims.uid);

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || "User",
    };
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

export async function getUserInterview(userId) {
  const interview = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("date", "desc")
    .get();

  if (interview.empty) {
    return null;
  }

  return interview.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAllInterviews(){
  const interviewsSnapshot = await db.collection("interviews").get();

  if (interviewsSnapshot.empty) {
    return [];
  }

  return interviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}