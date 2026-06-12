import React from "react";
import Link from "next/link";
import {
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineArrowNarrowRight,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineServer,
} from "react-icons/hi";
import { getStrapiURL } from "@/utils/get-strapi-url";
import { getAllModulesData } from "@/data/loader";

const iconMap: Record<string, React.ReactElement> = {
  users: <HiOutlineUserGroup size={32} />,
  shield: <HiOutlineShieldCheck size={32} />,
  calendar: <HiOutlineCalendar size={32} />,
  layout: <HiOutlineViewGrid size={32} />,
  chart: <HiOutlineChartBar size={32} />,
  receipt: <HiOutlineClipboardList size={32} />,
  dollar: <HiOutlineCurrencyDollar size={32} />,
  settings: <HiOutlineCog size={32} />,
  server: <HiOutlineServer size={32} />,
};

const ModuleCard = ({ module }: { module: any }) => {
  const iconUrl = module.icon?.data?.attributes?.url || module.icon?.url;
  const fullIconUrl = iconUrl ? `${getStrapiURL()}${iconUrl}` : null;

  return (
  <Link href={`/modules/${module.slug}`}>
    <div
      className="group relative bg-white border border-gray-300 p-10 rounded-[40px] 
                 transition-all duration-500 ease-in-out
                 hover:border-[#013228] 
                 cursor-pointer flex flex-col h-full"
    >
      {/* Module Number */}
      <span className="absolute top-6 right-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 transition-colors duration-500">
        {module.module_count || `Module ${String(module.moduleNumber || "").padStart(2, "0")}`}
      </span>

      {/* Icon */}
      <div className="mb-8 transition-all duration-500 transform group-hover:scale-110 origin-left h-8 w-8 relative text-gray-900">
        {fullIconUrl ? (
          <img src={fullIconUrl} alt={module.title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-900 w-full h-full">
            {iconMap[module.icon] || <div className="w-8 h-8 bg-gray-200 rounded-full" />}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-500">
        {module.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 mb-10 leading-relaxed transition-colors duration-500 grow">
        {module.description}
      </p>

      {/* Feature count badge */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {module.tags ? (
          module.tags.map((tag: any, i: number) => (
            <span key={i} className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-full transition-colors duration-500">
              {tag.text}
            </span>
          ))
        ) : (
          <>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-full transition-colors duration-500">
              {(module.features || []).length} Features
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-full transition-colors duration-500">
              {(module.featureGroups || []).reduce((acc: number, g: any) => acc + (g.stories?.length || 0), 0)}{" "}
              User Stories
            </span>
          </>
        )}
      </div>

      {/* Explore button */}
      <div
        className="w-fit inline-flex items-center gap-3 px-0 py-2 rounded-full transition-all duration-500 ease-in-out
                    group-hover:bg-[#013228] group-hover:px-6 group-hover:py-3"
      >
        <span className="text-sm font-bold uppercase tracking-wider text-gray-900 group-hover:text-white transition-colors duration-500">
          Explore Module
        </span>
        <HiOutlineArrowNarrowRight
          size={20}
          className="text-gray-900 group-hover:text-white transition-all duration-500 group-hover:translate-x-1"
        />
      </div>
    </div>
  </Link>
  );
};

export default async function ModuleGrid({ lang = "en", data }: { lang?: string, data?: any }) {
  const { tag, title, description } = data || {};
  
  const allModulesData = await getAllModulesData(lang);
  const modulesList = [...(allModulesData?.data || [])].sort((a: any, b: any) => {
    const getNum = (m: any) => {
      const attrs = m.attributes || m;
      const match = String(attrs.module_count || "").match(/\d+/);
      return match ? parseInt(match[0], 10) : Number(attrs.moduleNumber) || 999;
    };
    return getNum(a) - getNum(b);
  });

  return (
    <section className="py-20 px-6 bg-[#FCFDFB]">
      <div className="max-w-340 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#013228]" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#013228]">
              {tag || "All Modules"}
            </span>
            <div className="h-px w-8 bg-[#013228]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 whitespace-pre-line">
            {title || "Core HR & Platform Modules"}
          </h2>
          <p className="max-w-2xl text-gray-500 text-lg leading-relaxed whitespace-pre-line">
            {description || `${modulesList.length} powerful modules covering every aspect of HR management — from employee records and payroll processing to platform administration.`}
          </p>
        </div>

        {/* Yahan saare modules ek hi grid mein aayenge */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modulesList.map((module: any) => (
            <ModuleCard key={module.slug} module={module.attributes || module} />
          ))}
        </div>
      </div>
    </section>
  );
}
