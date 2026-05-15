import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { getAllBlogsData } from "@/data/loader";
import { getStrapiURL } from "@/utils/get-strapi-url";

export const metadata = {
  title: "Blog — Socle RH | Human Systems",
  description:
    "Read our latest insights on HR tech, company culture, and performance management.",
};

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Fetch dynamic localized blogs
  const strapiData = await getAllBlogsData(lang);
  const allBlogs = strapiData?.data || [];

  const featuredBlog = allBlogs[0]?.attributes || allBlogs[0];
  const remainingBlogs = allBlogs.slice(1);

  // Helper for the featured image
  const featuredImageUrl =
    featuredBlog?.image?.data?.attributes?.url || featuredBlog?.image?.url;
  const fullFeaturedImageUrl = featuredImageUrl
    ? `${getStrapiURL()}${featuredImageUrl}`
    : "/fallback-image.jpg";

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <section className="relative pt-32 pb-20 overflow-hidden rounded-b-[50px] min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80"
            alt="Blog Journal Background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#F9FBF8]/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="w-fit mx-auto px-4 py-1 border border-[#013228] rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#013228]">
              Our Journal
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Insights on <br />
            <span className="text-[#013228]">Human Systems.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-700 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Thought leadership and practical guides for modern HR professionals
            and cultural architects.
          </p>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E3FFCD]/40 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 z-0"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#E3FFCD]/30 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 z-0"></div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        {/* Featured Post */}
        {featuredBlog && (
          <div className="mb-32">
            {/* Corrected: Added the /${lang} prefix to the link */}
            <Link
              href={`/${lang}/blog/${featuredBlog.slug}`}
              className="block group relative border border-gray-500 hover:border-[#013228] rounded-[40px] overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                <div className="lg:col-span-7 aspect-video lg:aspect-auto border-b lg:border-b-0 lg:border-r border-gray-200 group-hover:border-[#013228] transition-colors duration-300 overflow-hidden">
                  <img
                    src={fullFeaturedImageUrl}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-[#E3FFCD] text-[#013228] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#013228]">
                      Featured
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} /> {featuredBlog.read}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#013228]">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-gray-600 mb-10 leading-relaxed line-clamp-4">
                    {featuredBlog.content_title}
                  </p>

                  <div className="inline-flex w-max items-center justify-center gap-3 bg-[#013228] text-[#E3FFCD] px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest group-hover:scale-[1.02] group-hover:bg-[#024a3c] transition-all">
                    Read Article <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-6 mb-16">
          <h3 className="text-2xl font-black text-[#013228] uppercase tracking-tighter">
            Latest Updates
          </h3>
          <div className="h-[2px] grow bg-[#013228]"></div>
          <span className="text-sm font-bold text-gray-400">
            {remainingBlogs.length} ARTICLES
          </span>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {remainingBlogs.map((blogItem: any) => {
            const blog = blogItem.attributes || blogItem;
            {
              /* Corrected: Passed the lang prop to BlogCard */
            }
            return <BlogCard key={blog.slug} blog={blog} lang={lang} />;
          })}
        </div>
      </section>
    </main>
  );
}
