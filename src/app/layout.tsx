import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AxiomWebVitals } from "next-axiom";
import dynamic from "next/dynamic";
import TrpcProvider from "./trpc/provider";

export const metadata: Metadata = {
  title: "Have I missed the deadline?",
  description: "FPL Deadline tracker application.",
};

const DynamicNavigationBar = dynamic(
  () => import("./components/NavigationBar"),
  { ssr: false },
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // bree / bison
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans bg-slate-50 bg-gradient-to-r from-purple-300 via-pink-200 to-red-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 dark:text-white">
          <TrpcProvider>
            <DynamicNavigationBar />
            {children}
            <AxiomWebVitals />
          </TrpcProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
