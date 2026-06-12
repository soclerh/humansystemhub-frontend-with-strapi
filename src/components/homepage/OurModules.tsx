import Link from "next/link";
import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { getStrapiURL } from "@/utils/get-strapi-url";
import { getAllModulesData } from "@/data/loader";

export default async function OurModules({ data, lang = "en" }: any) {
  const { tag, title, description } = data || {};
  const strapiData = await getAllModulesData(lang);
  const modulesList = [...(strapiData?.data || [])].sort((a: any, b: any) => {
    const getNum = (m: any) => {
      const attrs = m.attributes || m;
      const match = String(attrs.module_count || "").match(/\d+/);
      return match ? parseInt(match[0], 10) : Number(attrs.moduleNumber) || 999;
    };
    return getNum(a) - getNum(b);
  });

  return (
    <section className="py-20 px-6 bg-[#FCFDFB]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-fit px-6 py-1.5 border border-gray-900 rounded-full mb-6">
            <span className="text-sm font-semibold uppercase tracking-widest">
              {tag}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="max-w-2xl text-gray-500 text-lg leading-relaxed">
            {description ||
              "Discover our comprehensive suite of HR modules designed to streamline your workforce management and enhance employee experience."}
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modulesList.map((moduleItem: any, index: number) => {
            const module = moduleItem.attributes || moduleItem;
            const iconUrl = module.icon?.data?.attributes?.url || module.icon?.url;
            const fullIconUrl = iconUrl ? `${getStrapiURL()}${iconUrl}` : null;

            return (
            <Link
              href={`/modules/${module.slug}`}
              key={index}
              className="group relative bg-white border border-gray-300 p-10 rounded-[40px] 
                         transition-all hover:border-[#013228] cursor-pointer flex flex-col h-full"
            >
              {/* Icon */}
              <div className="mb-8 transition-all duration-500 transform group-hover:scale-110 origin-left h-8 w-8 relative text-gray-900">
                {fullIconUrl ? (
                  <img src={fullIconUrl} alt={module.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
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

              {/* The "Read More" Full Button Transformation (Removed inner Link) */}
              <div
                className="w-fit inline-flex items-center gap-3 px-0 py-2 rounded-full transition-all duration-500 ease-in-out
                           group-hover:bg-[#013228] group-hover:px-6 group-hover:py-3 mt-auto"
              >
                <span className="text-sm font-bold uppercase tracking-wider text-gray-900 group-hover:text-white transition-colors duration-500">
                  Read More
                </span>

                <HiOutlineArrowNarrowRight
                  size={20}
                  className="text-gray-900 group-hover:text-white transition-all duration-500 group-hover:translate-x-1"
                />
              </div>
            </Link>
          )})}
        </div>
      </div>
    </section>
  );
}
