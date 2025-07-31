
import NavBar from "@/components/NavBar";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";


async function layout({ children }) {
  const isUserAuthenticated = await isAuthenticated();

  

  if (!isUserAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <>
      <div>
        
        {children}
      </div>
    </>
  );
}

export default layout;
