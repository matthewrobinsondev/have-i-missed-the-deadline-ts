"use client";

import { useState, useEffect } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function NavigationBar() {
  const { isSignedIn } = useAuth();

  const storedTheme = localStorage.getItem("theme");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  return (
    <div className="md:max-w-5xl md:mx-auto">
      <nav className="flex items-center justify-between flex-wrap py-6 px-2 sm:p-6">
        {isSignedIn ? (
          <div>
            <Button className="md:mr-6" variant={"ghost"}>
              <Link href="/">Home</Link>
            </Button>
            <Button className="md:mr-6" variant={"ghost"}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button className="md:mr-6" variant={"ghost"}>
              <Link href="/register-phone">Phone</Link>
            </Button>
          </div>
        ) : (
          <></>
        )}
        <div className="flex items-center ml-auto space-x-4 lg:space-x-10">
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6 fill-gray-500 hover:fill-gray-700" />
            )}
          </button>
          {!isSignedIn ? (
            <div className="dark:text-white">
              <SignInButton />
            </div>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </nav>
    </div>
  );
}
export default NavigationBar;
