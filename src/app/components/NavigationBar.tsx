"use client";

import { useState, useEffect } from "react";
import { SignInButton } from "@clerk/nextjs";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";

function NavigationBar() {
  const storedTheme = localStorage.getItem("theme");
  const [darkMode, setDarkMode] = useState(
    storedTheme ? storedTheme === "dark" : false
  );

  useEffect(() => {
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
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
    <nav className="flex items-center justify-between flex-wrap p-6">
      <div className="flex items-center ml-auto space-x-4 lg:space-x-10 lg:mx-10">
        <button
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
        <SignInButton />
      </div>
    </nav>
  );
}
export default NavigationBar;
