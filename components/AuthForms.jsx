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
    <div className="min-h-screen bg-zinc-50/50 flex flex-col items-center justify-center p-6 pb-20 selection:bg-zinc-200">
      <div className="w-full max-w-sm">
        {/* Logo and Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              HireSmart
            </span>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 text-zinc-600 rounded-full text-xs font-medium mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Interview Platform
          </div>
        </div>

        <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden">
          <div className="p-8 text-center border-b border-zinc-100 bg-zinc-50/50">
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              {type === "Login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {type === "Login" 
                ? "Sign in to your account to continue" 
                : "Join professionals to improve your skills"
              }
            </p>
          </div>

          <CardContent className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {type !== "Login" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className="pl-10 h-11 border-zinc-200 focus:border-zinc-400 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    className="pl-10 h-11 border-zinc-200 focus:border-zinc-400 focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                    Password
                  </Label>
                  {type === "Login" && (
                    <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="pl-10 h-11 border-zinc-200 focus:border-zinc-400 focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <Button
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-all group mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    {type === "Login" ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {type === "Login" ? "Sign in" : "Create account"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-semibold">
                  <span className="px-2 bg-white text-zinc-400">or</span>
                </div>
              </div>

              {/* Switch Form Link */}
              <div className="text-center">
                <p className="text-sm text-zinc-500">
                  {type === "Login"
                    ? "New to HireSmart?"
                    : "Already have an account?"}
                  <Link
                    href={type === "Login" ? "/sign-up" : "/sign-in"}
                    className="ml-1.5 text-zinc-900 hover:text-zinc-700 font-semibold transition-colors"
                  >
                    {type === "Login" ? "Create an account" : "Sign in instead"}
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