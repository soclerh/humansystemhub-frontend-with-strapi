"use client";

import React, { useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

// Your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx2VAM0ajMYMUATrQhEUJBqyKdIrd-T6SfWRwPHFFOrIMcfIUbppKFV9oar--ml3GoiFA/exec";

export default function ContactForm({ data }: any) {
  const email = data?.contacts[1];
  const number = data?.contacts[2];
  const address = data?.contacts[0];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    employees: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state

  console.log("from contact form: ", data);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert the form data into URL encoded string for Google Apps Script
    const formBody = new URLSearchParams(
      formData as Record<string, string>,
    ).toString();

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert(
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
              className="w-10 h-10 text-[#013228] "
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
            Message Sent!
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8">
            Thank you for reaching out. Our team will get back to you within 24
            hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                company: "",
                employees: "",
                subject: "",
                message: "",
              });
            }}
            className="px-8 py-3 rounded-full border-2 border-[#013228] text-[#013228] font-bold text-sm hover:bg-[#013228] hover:text-[#E3FFCD] transition-all"
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#013228]" />
                <span className="text-sm font-bold uppercase tracking-widest text-[#013228]">
                  Contact Info
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
                We&apos;d love to <br />
                <span className="text-[#013228]">hear from you.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Fill out the form and our team will respond within 24 hours, or
                reach us directly through the channels below.
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-[20px] bg-[#F9FBF8] border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-[#013228] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Email Us</p>
                  <p className="text-sm text-gray-500">{email?.text}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-[20px] bg-[#F9FBF8] border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-[#013228] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Call Us</p>
                  <p className="text-sm text-gray-500">{number?.text}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-[20px] bg-[#F9FBF8] border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-[#013228] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Visit Us</p>
                  <p className="text-sm text-gray-500">{address?.text}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-[#F9FBF8] border border-gray-200 rounded-[32px] p-8 lg:p-10 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all placeholder:text-gray-400"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all placeholder:text-gray-400"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all placeholder:text-gray-400"
                  placeholder="john@company.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all placeholder:text-gray-400"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Number of Employees
                  </label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Select range</option>
                    <option value="1-25">1 – 25</option>
                    <option value="26-100">26 – 100</option>
                    <option value="101-500">101 – 500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all appearance-none"
                >
                  <option value="">Select a subject</option>
                  <option value="demo">Request a Demo</option>
                  <option value="pricing">Pricing Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#013228] focus:border-transparent transition-all resize-none placeholder:text-gray-400"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#013228] text-[#E3FFCD] py-4 rounded-2xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#013228]/10 transition-all ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:scale-[1.02]"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                {!isSubmitting && <HiOutlineArrowNarrowRight size={18} />}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By submitting this form, you agree to our Privacy Policy and
                Terms of Service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
