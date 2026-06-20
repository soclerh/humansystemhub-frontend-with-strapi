"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundForward, IoIosArrowDown } from "react-icons/io";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { getStrapiURL } from "@/utils/get-strapi-url";

export default function Header({ data }: { data?: any }) {
  const lastScroll = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      setIsScrolled(current > 50);

      if (current > lastScroll.current && current > 80 && !mobileOpen) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  // UPDATED: Added logic to reset mobile dropdown state when mobile menu closes
  useEffect(() => {
    // TypeScript ko batane ke liye ki ye setTimeout ka timer hai
    let timer: ReturnType<typeof setTimeout>;

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset dropdown with a delay to let the menu closing animation finish
      timer = setTimeout(() => {
        setMobileDropdownOpen(false);
      }, 500);
    }

    return () => {
      document.body.style.overflow = "";
      if (timer) clearTimeout(timer);
    };
  }, [mobileOpen]);

  const defaultNavLinks = [
    { name: "About", href: "/about" },
    // { name: "Modules", href: "/modules" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    {
      name: "Resources",
      href: "#",
      dropdown: [
        { name: "HR Toolkit", href: "/resources/hr-toolkit" },
        { name: "Use Cases", href: "/resources/use-cases" },
        { name: "Compliance", href: "/resources/compliance" },
      ],
    },
    { name: "Contact Us", href: "/contact" },
  ];

  const { logo, navigation, cta } = data || {};

  const displayNavLinks =
    navigation && navigation.length > 0
      ? navigation.map((navItem: any) => ({
          name: navItem.name || navItem.text,
          href: navItem.href === null ? "#" : `/${navItem.href || ""}`,
          dropdown:
            navItem.sub_links && navItem.sub_links.length > 0
              ? navItem.sub_links.map((sub: any) => ({
                  name: sub.text || sub.name,
                  href: `/${sub.href || ""}`,
                }))
              : null,
        }))
      : defaultNavLinks;

  const logoUrl = logo?.data?.attributes?.url || logo?.url;
  const fullLogoSrc = logoUrl ? `${getStrapiURL()}${logoUrl}` : "/logo-3.svg";

  return (
    <>
      <header
        // FIX: Reverted 'absolute top-0' back to 'relative' so it stays in flow!
        className={`w-full transition-transform duration-300 z-[100] py-3 ${
          isScrolled ? "bg-[#013228] shadow-md fixed top-0" : "relative"
        } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="relative z-[101] flex items-center justify-between max-w-7xl mx-auto px-6">
          {/* Logo */}
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Image
              src={fullLogoSrc}
              alt="Logo"
              width={180}
              height={40}
              className="w-32 sm:w-40"
              unoptimized={!!logoUrl}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {displayNavLinks.map((link: any, index: number) =>
              link.dropdown ? (
                <div key={index} className="relative group py-4">
                  <button className="flex items-center gap-1 font-semibold text-white/90 hover:text-[#E3FFCD] transition-colors cursor-pointer">
                    {link.name}
                    <IoIosArrowDown
                      size={16}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  </button>
                  <div className="absolute top-12 ltr:left-0 rtl:right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform ltr:origin-top-left rtl:origin-top-right translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    <div className="py-2 flex flex-col">
                      {link.dropdown.map((sublink: any, i: number) => (
                        <Link
                          key={i}
                          href={sublink.href}
                          className="px-4 py-3 text-sm font-medium text-[#013228] hover:bg-gray-50 hover:text-[#013228] transition-colors"
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  href={link.href}
                  className="font-semibold text-white/90 hover:text-[#E3FFCD] transition-colors py-4"
                >
                  {link.name}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/get-started" className="hidden sm:block">
              <button className="flex items-center gap-2 bg-white rounded-full py-3 px-6 text-xs uppercase tracking-[0.1em] font-bold text-[#013228] cursor-pointer hover:bg-[#d4ffb8] transition-colors group">
                {cta?.text || "Get Started"}
                <IoIosArrowRoundForward
                  size={24}
                  className="transition-transform duration-300 ltr:group-hover:translate-x-2 rtl:group-hover:-translate-x-2 rtl:-scale-x-100"
                />
              </button>
            </Link>

            {/* Hamburger button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <HiOutlineX size={22} />
              ) : (
                <HiOutlineMenuAlt3 size={22} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#013228] z-[99] transition-all duration-500 ease-in-out lg:hidden ${
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-8 pb-8">
          <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
            {displayNavLinks.map((link: any, index: number) =>
              link.dropdown ? (
                <div
                  key={index}
                  className="flex flex-col border-b border-white/5 py-4"
                >
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className={`flex items-center justify-between w-full text-left text-3xl font-bold text-white/90 hover:text-[#E3FFCD] transition-all duration-300 ${
                      mobileOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 75}ms` }}
                  >
                    <span>{link.name}</span>
                    <IoIosArrowDown
                      size={24}
                      className={`transition-transform duration-300 ${
                        mobileDropdownOpen ? "rotate-180 text-[#E3FFCD]" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`flex flex-col pl-4 overflow-hidden transition-all duration-300 ${
                      mobileDropdownOpen
                        ? "max-h-[200px] mt-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {link.dropdown.map((sublink: any, i: number) => (
                      <Link
                        key={i}
                        href={sublink.href}
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileDropdownOpen(false);
                        }}
                        className={`text-xl font-medium text-white/70 hover:text-[#E3FFCD] py-2 transition-colors ${
                          mobileOpen
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-4 opacity-0"
                        }`}
                        style={{
                          transitionDelay: `${index * 75 + (i + 1) * 75}ms`,
                        }}
                      >
                        {sublink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-3xl font-bold text-white/90 hover:text-[#E3FFCD] transition-all duration-300 py-4 border-b border-white/5 ${
                    mobileOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  {link.name}
                </Link>
              ),
            )}
          </nav>

          <div className="pt-6 border-t border-white/10">
            <Link href="/get-started" onClick={() => setMobileOpen(false)}>
              <button className="group w-full flex items-center justify-center gap-2 bg-white rounded-2xl py-4 px-6 text-sm uppercase tracking-[0.1em] font-bold text-[#013228] hover:bg-[#013228] hover:text-[#E3FFCD] transition-all duration-300 border border-transparent hover:border-[#E3FFCD]">
                {cta?.text || "Get Started"}
                <IoIosArrowRoundForward
                  size={24}
                  className="transition-transform duration-300 ltr:group-hover:translate-x-2 rtl:group-hover:-translate-x-2 rtl:-scale-x-100"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
