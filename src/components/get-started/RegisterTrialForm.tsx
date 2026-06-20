"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

// Trial registration endpoint
const REGISTER_TRIAL_URL =
  "https://app.humansystemhub.com/api/v1/register-trial";

// Public API returning a flat array of all IANA timezone names
const TIMEZONE_API_URL = "https://timeapi.io/api/timezone/availabletimezones";

// Offline fallback if the timezone API (and Intl) are unavailable.
// The field is optional, so a short curated list is acceptable as a last resort.
const FALLBACK_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Casablanca",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

type TrialFormData = {
  company_name: string;
  admin_name: string;
  company_email: string;
  company_phone: string;
  password: string;
  timezone: string;
};

const EMPTY_FORM: TrialFormData = {
  company_name: "",
  admin_name: "",
  company_email: "",
  company_phone: "",
  password: "",
  timezone: "",
};

export default function RegisterTrialForm() {
  const [formData, setFormData] = useState<TrialFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timezones, setTimezones] = useState<string[]>(FALLBACK_TIMEZONES);

  // Load the full list of world timezones from a public API, falling back to
  // the browser's Intl data and finally the curated list if anything fails.
  useEffect(() => {
    let active = true;

    const loadTimezones = async () => {
      try {
        const response = await fetch(TIMEZONE_API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (active && Array.isArray(data) && data.length > 0) {
          setTimezones(data);
          return;
        }
      } catch (error) {
        console.error("Error fetching timezones", error);
      }

      // Fallback: the browser's own IANA timezone list (also "all timezones")
      if (active && typeof Intl.supportedValuesOf === "function") {
        try {
          setTimezones(Intl.supportedValuesOf("timeZone"));
        } catch {
          // keep the curated FALLBACK_TIMEZONES already in state
        }
      }
    };

    loadTimezones();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // timezone is optional — only send it when provided
    const payload: Record<string, string> = {
      company_name: formData.company_name,
      company_email: formData.company_email,
      password: formData.password,
      admin_name: formData.admin_name,
      company_phone: formData.company_phone,
    };
    if (formData.timezone) payload.timezone = formData.timezone;

    try {
      const response = await fetch(REGISTER_TRIAL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 200) {
        setIsSubmitted(true);
      } else {
        // Surface the server-provided error message when available
        const message =
          result?.message ||
          result?.error ||
          (typeof result === "string" ? result : null) ||
          `Something went wrong (HTTP ${response.status}).`;
        setErrorMessage(message);
      }
    } catch (error) {
      console.error("Error submitting trial registration", error);
      setErrorMessage(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#E3FFCD] rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-10 h-10 text-[#013228]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Thank you!
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            We will reach out within 48 hours.
          </p>
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all placeholder:text-gray-400";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#013228]" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#013228]">
              Start your free trial
            </span>
            <div className="h-px w-8 bg-[#013228]" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Get started with{" "}
            <span className="text-[#013228]">Human Systems</span>
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Tell us about your company and we&apos;ll set up your trial.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#F9FBF8] border border-gray-200 rounded-[32px] p-8 lg:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company_name" className={labelClass}>
                Company Name
              </label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Company Name"
              />
            </div>
            <div>
              <label htmlFor="admin_name" className={labelClass}>
                Admin Name
              </label>
              <input
                id="admin_name"
                type="text"
                name="admin_name"
                value={formData.admin_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Admin Name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company_email" className={labelClass}>
              Company Email
            </label>
            <input
              id="company_email"
              type="email"
              name="company_email"
              value={formData.company_email}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="admin@company.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company_phone" className={labelClass}>
                Company Phone
              </label>
              <input
                id="company_phone"
                type="tel"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="timezone" className={labelClass}>
              Timezone{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="timezone"
              type="text"
              name="timezone"
              list="timezone-options"
              value={formData.timezone}
              onChange={handleChange}
              autoComplete="off"
              className={inputClass}
              placeholder="Search your timezone"
            />
            <datalist id="timezone-options">
              {timezones.map((tz) => (
                <option key={tz} value={tz} />
              ))}
            </datalist>
          </div>

          {errorMessage && (
            <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-2xl px-5 py-3">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#013228] text-[#E3FFCD] py-4 rounded-2xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#013228]/10 transition-all ${
              isSubmitting
                ? "opacity-75 cursor-not-allowed"
                : "hover:scale-[1.02]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Start Free Trial"}
            {!isSubmitting && <HiOutlineArrowNarrowRight size={18} />}
          </button>
        </form>
      </div>
    </section>
  );
}
