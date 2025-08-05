import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function NavBar() {
  const user = await getCurrentUser();

  return (
    <>
      <nav className="p-[1%]  border-b-2 border-gray-600 shadow-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src={`/logo.svg`} alt="Logo" width={38} height={32} />
            <span className="text-2xl font-bold">InterviewByte</span>
          </Link>
          <div
            className={`flex-wrap items-center gap-2 justify-around hidden md:flex ${
              user ? "w-[50%]" : "w-[20%]"
            }`}
          >
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className=" font-semibold hover:text-blue-500"
                >
                  Dashboard
                </Link>
                <Link
                  href="/resume/analyser"
                  className=" font-semibold hover:text-blue-500"
                >
                  Resume Analyser
                </Link>
                <div className="flex flex-row items-center gap-2">
                  {user && (
                    <>
                      <div>Welcome, {user.name || "User"}</div>

                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </>
                  )}
                </div>
              </>
            )}
            {!user && (
              <>
                <Link href="/sign-in" className="hover:text-blue-500">
                  Login
                </Link>
                <Link href="/sign-up" className=" hover:text-blue-500">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
