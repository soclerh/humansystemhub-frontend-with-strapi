import React from "react";
import Image from "next/image";
import { getStrapiURL } from "@/utils/get-strapi-url";

export default function AboutHero({ data }: { data?: any }) {
  const { tag, title, description, image } = data || {};

  const heroImage = image?.data?.attributes?.url || image?.url;
  const fullHeroImage = heroImage
    ? `${getStrapiURL()}${heroImage}`
    : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80";

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={fullHeroImage}
          alt={title || "Modern Office Background"}
          fill
          priority
          className="object-cover"
          unoptimized
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="w-fit mx-auto px-4 py-1 border border-gray-100 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-100">
            {tag || "Our Story"}
          </p>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-[#D4AF37] leading-tight tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {title ? (
            title.split("\\n").map((line: string, i: number) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))
          ) : (
            <>
              Redefining the <br />
              <span className="text-[#013228]">Employee Experience.</span>
            </>
          )}
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-100 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {description ||
            "Human Systems was founded on a simple belief: HR technology should empower people, not complicate processes. We build tools that make work better for everyone."}
        </p>
      </div>

      {/* Decorative blur (Adjusted opacity for image background) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E3FFCD]/40 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 z-0"></div>
    </section>
  );
}
