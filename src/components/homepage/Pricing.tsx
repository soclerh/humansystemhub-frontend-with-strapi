"use client";
import Link from "next/link";
import React, { useState } from "react";
import { HiCheck } from "react-icons/hi";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

export default function Pricing({ pricingData, fallbackData }: any) {
  const [isAnnual, setIsAnnual] = useState(true);

  const { tag, title, description, discount, cards } = pricingData || {};
  const plans = (cards && cards.length > 0) ? cards : fallbackData;

  if (!Array.isArray(plans) || plans.length === 0) return null;

  return (
    <div className="w-full min-h-screen bg-white">
      <section
        style={{ backgroundImage: `url("/pricing-bg-1.svg")` }}
        className="w-full bg-[#04231d] bg-cover bg-center rounded-t-[50px] min-h-screen py-20 px-6 text-white overflow-hidden"
      >
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            {/* Fixed Badge Contrast */}
            <div className="w-fit px-4 py-1.5 border border-emerald-500/30 bg-emerald-500/10 rounded-full">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {tag || "Pricing Plans"}
              </span>
            </div>
            {/* Fixed Heading Contrast: Changed to white/emerald-50 */}
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {title || "Choose Your Ideal HR Plan"}
            </h2>
            <p className="text-emerald-100/60 text-lg max-w-2xl mx-auto">
              {description || "Flexible pricing tailored for businesses of all sizes — from startups to enterprise. All plans include multi-tenant security and GDPR compliance."}
            </p>
          </div>

          {/* --- Toggle Switch --- */}
          <div className="flex items-center justify-center mt-12 gap-6">
            <span className="text-xs font-bold text-emerald-400 tracking-wider">
              {discount || "SAVE 20%"}
            </span>
            <div className="bg-[#062d26] p-1 rounded-full flex items-center border border-emerald-800/50 shadow-inner">
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isAnnual
                    ? "bg-[#d1e5c4] text-[#04231d]"
                    : "text-emerald-100/50 hover:text-white"
                }`}
              >
                BILL ANNUALLY
              </button>
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  !isAnnual
                    ? "bg-[#d1e5c4] text-[#04231d]"
                    : "text-emerald-100/50 hover:text-white"
                }`}
              >
                BILL MONTHLY
              </button>
            </div>
          </div>
        </div>

        {/* --- Pricing Cards Grid --- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {plans.map((plan: any) => (
            <div
              key={plan.id || plan.title}
              className={`relative bg-[#0a2e26]/80 backdrop-blur-md rounded-[32px] p-8 border transition-all duration-300 hover:scale-[1.02] flex flex-col ${
                plan.highlight || plan.highlighted
                  ? "border-emerald-400/50 shadow-2xl shadow-emerald-900/20"
                  : "border-emerald-800/30"
              }`}
            >
              {/* Badge Ribbon */}
              {plan.badge && (
                <div className="absolute top-6 right-0 bg-[#d1e5c4] text-[#04231d] text-[10px] font-black px-4 py-1.5 rounded-l-md shadow-lg z-10">
                  {plan.badge.toUpperCase()}
                  <div className="absolute right-0 top-full w-0 h-0 border-t-4 border-t-[#a7bc9b] border-r-4 border-r-transparent"></div>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-4 text-white">
                {plan.title}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl font-bold tracking-tighter text-white">
                  {isAnnual ? plan.yearly : plan.monthly}
                </span>
                {plan.title !== "Enterprise" && (
                  <span className="text-sm text-emerald-100/50">
                    / Per Employee/Month
                  </span>
                )}
              </div>

              <p className="text-emerald-100/70 text-sm mb-8 leading-relaxed min-h-[40px]">
                {plan.description}
              </p>

              <div className="h-px bg-emerald-800/40 mb-8" />

              <div className="grow">
                <h4 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-white">
                  Core Features
                </h4>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature: any) => (
                    <li
                      key={feature.id || feature.text}
                      className="flex items-start gap-3 text-emerald-50 text-sm leading-snug"
                    >
                      <HiCheck
                        size={18}
                        className="text-emerald-400 mt-0.5 shrink-0"
                      />
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={plan.cta_link || "/contact"}>
                <button
                  className={`w-full group py-4 px-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
                    plan.highlight || plan.highlighted
                      ? "bg-[#d1e5c4] text-[#04231d] hover:bg-white"
                      : "bg-transparent text-white border border-emerald-700 hover:bg-[#d1e5c4] hover:text-[#04231d] cursor-pointer"
                  }`}
                >
                  {plan.cta || "GET STARTED"}
                  <HiOutlineArrowNarrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
