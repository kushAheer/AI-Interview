import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";

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
          <div className={`flex flex-wrap items-center gap-2 justify-around  ${user ? "w-[50%]" : "w-[20%]"}`}>
            {user && (
              <>
                <Link
                  href="/"
                  className="text-lg font-semibold hover:text-blue-500"
                >
                  Dashboard
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-semibold hover:text-blue-500"
                >
                  Resume Analyzer
                </Link>
                <div>
                  <h1 className="text-lg font-semibold">
                    {user ? `Welcome, ${user.name}` : "Welcome, Guest"}
                  </h1>
                </div>
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/sign-up"
                  className="hover:text-blue-500"
                >
                  Login
                </Link>
                <Link
                  href="/sign-in"
                  className=" hover:text-blue-500"
                >
                  Sign
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
