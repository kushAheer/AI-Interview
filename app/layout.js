import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InterviewByte",
  description: "Your AI Interview Buddy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body
        className={``}
      >
        <div className="">
          <NavBar />
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  );
}
