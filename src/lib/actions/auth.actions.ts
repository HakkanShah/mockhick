
"use server";

import {
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseServices } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

export async function createUserProfile(uid: string, name: string, email: string) {
  const { auth, db } = getFirebaseServices();
  try {
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      email: email,
      displayName: name,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Could not create user profile.");
  }
}

export async function signOut() {
  try {
    const { auth } = getFirebaseServices();
  } catch (error: any) {
    console.error("Error during server-side sign-out cleanup:", error);
  }
  redirect("/");
}
