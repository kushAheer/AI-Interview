"use client";
import React from "react";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
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
import { loginStreakCount, streakCount } from "@/lib/actions/general.action";
import { Brain, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

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
        console.log("Login successful:", result);
        await loginStreakCount(userCredential.user.uid);
        console.log("Login streak count updated:", userCredential.user.uid);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HireSmart
            </span>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Interview Platform
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {type === "Login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {type === "Login" 
                ? "Sign in to your account to continue practicing" 
                : "Join thousands of professionals improving their interview skills"
              }
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {type !== "Login" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    placeholder="Enter your password"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base group"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {type === "Login" ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {type === "Login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Switch Form Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {type === "Login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <Link
                    href={type === "Login" ? "/sign-up" : "/sign-in"}
                    className="ml-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    {type === "Login" ? "Sign up" : "Sign in"}
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}

export default AuthForms;