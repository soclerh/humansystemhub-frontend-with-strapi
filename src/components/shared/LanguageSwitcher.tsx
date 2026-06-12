"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = pathname.split("/")[1] || "en";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (langCode: string) => {
    // Persist the choice so middleware keeps it across pages
    document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const segments = pathname.split("/");
    if (segments.length > 1) {
      segments[1] = langCode;
    }
    const newPath = segments.join("/");
    router.push(newPath || "/");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    // { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-full text-white transition-all cursor-pointer"
      >
        <span className="text-sm font-medium uppercase">{currentLang}</span>
        <IoIosArrowDown
          className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-12 ltr:right-0 rtl:left-0 w-32 bg-white rounded-xl shadow-2xl z-[111] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                currentLang === lang.code
                  ? "text-[#013228] font-bold bg-[#E3FFCD]/20"
                  : "text-gray-600"
              }`}
            >
              <span>{lang.name}</span>
              <span>{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
