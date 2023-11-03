import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AxiomWebVitals } from "next-axiom";
import NavigationBar from "./components/NavigationBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Have I missed the deadline?",
  description: "FPL Deadline tracker application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // bree / bison
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans bg-slate-50 dark:bg-slate-700">
          <NavigationBar />
          {children}
          <AxiomWebVitals />
        </body>
      </html>
    </ClerkProvider>
  );
}
