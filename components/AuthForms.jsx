"use client";
import React from "react";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function AuthForms({ type }) {
  return (
    <>
      <Card className="p-4 shadow-lg flex flex-col border-2 w-100 pt-4">
        <div className="flex flex-col items-center mb-4 justify-center">
          <h1 className="text-3xl font-bold mb-4">{type}</h1>
          <p className="text-1xl font-bold">Practice Job Interview</p>
        </div>

        <form className="flex flex-col gap-4">
          {type != "Login" && (
            <div className="form-item">
              <Label htmlFor="email" className="block mb-2">
                Full Name
              </Label>
              <Input type={"text"} />
            </div>
          )}

          <div className="form-item">
            <Label htmlFor="password" className="block mb-2">
              Email
            </Label>
            <Input type={"email"}  />
          </div>
          <div className="form-item">
            <Label htmlFor="password" className="block mb-2">
              Password
            </Label>
            <Input type={"password"} />
          </div>
          <div>
            <Button className="w-full btn-primary" type="submit">
              {type === "Login" ? "Submit" : "Create Account"}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}

export default AuthForms;
