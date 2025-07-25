"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

function NavBar() {
  return (
    <>
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src={`/logo.svg`} alt="Logo" width={38} height={32} />
          <span className="text-2xl font-bold">InterviewByte</span>
        </Link>
      </nav>
    </>
  );
}

export default NavBar;
