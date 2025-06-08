"use client";
import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";

export default function DashboardProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shadow hover:bg-purple-200 transition border border-purple-200 focus:outline-none"
        aria-label="Profile menu"
      >
        <User className="w-6 h-6 text-purple-700" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-purple-100 py-2 z-40 animate-fade-in">
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-[#212121] hover:bg-purple-50 rounded-lg transition text-base"
            onClick={() => {
              setOpen(false);
              // Implement your logout logic here
              alert("Logged out!");
            }}
          >
            <LogOut className="w-5 h-5 text-purple-700" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
