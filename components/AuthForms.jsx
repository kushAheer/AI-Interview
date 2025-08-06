"use client";
import React from "react";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SignIn, signUp } from "../lib/actions/auth.action";
import Link from "next/link";
import { useState } from "react";
import { streakCount } from "@/lib/actions/general.action";

function AuthForms({ type }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (type === "Login") {
      const email = formData.get("email");
      const password = formData.get("password");

      try {
        setLoading(true);

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to get user token. Please try again.");
          return;
        }
        

        const result = await SignIn({
          email: userCredential.user.email,
          idToken,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }
        await streakCount(userCredential.user.uid);

        toast.success(result.message);
        router.push("/dashboard");
      } catch (error) {
        toast.error(error.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    } else {
      const email = formData.get("email");
      const password = formData.get("password");
      const name = formData.get("name");

      try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: name,
          password: password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);

        router.push("/sign-in");
      } catch (error) {
        toast.error(error.message || "Sign up failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Card className="p-4 shadow-lg flex flex-col border-2 w-full pt-4 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-4 justify-center">
          <h1 className="text-3xl font-bold mb-4">{type}</h1>
          <p className="text-1xl font-bold">Practice Job Interview</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {type !== "Login" && (
            <div className="form-item">
              <Label htmlFor="name" className="block mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-item">
            <Label htmlFor="email" className="block mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-item">
            <Label htmlFor="password" className="block mb-2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Enter your password"
            />
          </div>
          <div>
            <Button
              className="w-full btn-primary"
              type="submit"
              disabled={loading}
            >
              {type === "Login"
                ? loading
                  ? "Loading..."
                  : "Submit"
                : loading
                ? "Loading..."
                : "Create Account"}
            </Button>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">
              {type === "Login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "Login" ? "/sign-up" : "/sign-in"}
              className="text-sm text-blue-500 hover:underline"
            >
              {type === "Login" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Card>
    </>
  );
}

export default AuthForms;
