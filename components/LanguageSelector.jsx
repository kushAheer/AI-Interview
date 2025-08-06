"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/constants";
function LanguageSelector({ onLanguageChange }) {
  return (
    <>
      <Select onValueChange={onLanguageChange} defaultValue="cpp">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(LANGUAGES).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {key} {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

export default LanguageSelector;
