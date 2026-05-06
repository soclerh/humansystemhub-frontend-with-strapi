"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";

// Helper components for the table icons
const CheckIcon = () => (
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E3FFCD]">
    <Check size={14} className="text-[#013228]" />
  </div>
);

const XIcon = () => (
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
    <X size={14} className="text-gray-300" />
  </div>
);

export default function PricingComparison({ data }: { data?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Destructure dynamic data from Strapi API
  const { title, description, comparisonData, th1, th2, th3, th4 } = data || {};

  // If no comparison data is returned from the API, we don't render the section
  if (!comparisonData || comparisonData.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-[#F9FBF8]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title || "Compare Plans"}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            {description ||
              "A detailed breakdown of features across all plans."}
          </p>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#013228] text-[#013228] font-bold text-sm hover:bg-[#013228] hover:text-[#E3FFCD] transition-all"
          >
            {isOpen ? "Hide Comparison" : "Show Full Comparison"}
          </button>
        </div>

        {/* Dynamic Comparison Table */}
        {isOpen && (
          <div className="overflow-x-auto rounded-[32px] border border-gray-200 bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-widest w-[40%]">
                    {th1 || "Feature"}
                  </th>
                  <th className="p-6 text-center text-sm font-bold text-gray-900 uppercase tracking-widest">
                    {th2 || "Starter"}
                  </th>
                  <th className="p-6 text-center text-sm font-bold text-[#013228] uppercase tracking-widest bg-[#E3FFCD]/20">
                    {th3 || "Professional"}
                  </th>
                  <th className="p-6 text-center text-sm font-bold text-gray-900 uppercase tracking-widest">
                    {th4 || "Enterprise"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((group: any, index: number) => (
                  <React.Fragment key={index}>
                    {/* Category Row */}
                    <tr className="bg-gray-50/50">
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-[#013228]"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {/* Feature Rows */}
                    {group.features.map((feature: any, fi: number) => (
                      <tr
                        key={fi}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {feature.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {feature.starter ? <CheckIcon /> : <XIcon />}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center bg-[#E3FFCD]/10">
                          <div className="flex justify-center">
                            {feature.pro ? <CheckIcon /> : <XIcon />}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {feature.enterprise ? <CheckIcon /> : <XIcon />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
