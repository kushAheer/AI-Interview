

import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

async function layout({ children }) {
  const isUserAuthenticated = await isAuthenticated();



  if (isUserAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="auth-layout">
        {children}
      </div>
    </>
  );
}

export default layout;
