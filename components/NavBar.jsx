import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  FileText, 
  LayoutDashboard, 
  User, 
  Menu,
  X
} from "lucide-react";
import NavProfile from "./NavProfile";

async function NavBar() {
  const user = await getCurrentUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">
              HireSmart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/resume/analyser" 
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    Resume Analyzer
                  </Link>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-px h-4 bg-zinc-200"></div>
                  <NavProfile user={user} />
                </div>
              </>
            ) : (
              <>
                {/* Guest Navigation */}
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/sign-in" 
                    className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Button asChild size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-full px-5">
                    <Link href="/sign-up">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-zinc-500 hover:text-zinc-900"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;