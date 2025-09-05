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
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HireSmart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/resume/analyser" 
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    Resume Analyzer
                  </Link>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="w-px h-6 bg-gray-300"></div>
                  <NavProfile user={user} />
                </div>
              </>
            ) : (
              <>
                {/* Guest Navigation */}
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/sign-in" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
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
              className="text-gray-700 hover:text-blue-600"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (you can expand this with a dropdown/sidebar) */}
      <div className="md:hidden border-t bg-white">
        <div className="px-4 py-3 space-y-3">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/resume/analyser" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium py-2"
              >
                <FileText className="w-4 h-4" />
                Resume Analyzer
              </Link>
              <div className="pt-2 border-t">
                <NavProfile user={user} />
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/sign-in" 
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
              >
                Sign In
              </Link>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                <Link href="/sign-up">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;