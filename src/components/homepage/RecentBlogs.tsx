import Link from "next/link";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import BlogCard from "@/components/blog/BlogCard";
import { getAllBlogsData } from "@/data/loader";

export default async function RecentBlogs({ data, lang }: any) {
  const { tag, title, cta } = data || {};
  const strapiData = await getAllBlogsData(lang || "en");
  const recentBlogs = strapiData?.data?.slice(0, 3) || [];

  return (
    <section className="relative w-full py-24 px-6 md:px-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-[#013228]" />
              <span className="text-sm font-bold uppercase tracking-widest text-[#013228]">
                {tag || "Latest Insights"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#013228] leading-tight">
              {title ? (
                title.split("\\n").map((t: string, i: number) => (
                  <span key={i}>
                    {t}
                    <br className="hidden md:block" />
                  </span>
                ))
              ) : (
                <>
                  Read Our <br className="hidden md:block" /> Latest Blogs
                </>
              )}
            </h2>
          </div>

          {/* Corrected: Added the /${lang} prefix to the "View All" link */}
          <Link
            href={cta ? `/${lang}/${cta.href}` : `/${lang}/blog`}
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#013228] uppercase tracking-widest hover:text-emerald-700 transition-colors"
          >
            {cta?.text || "VIEW ALL POSTS"}
            <HiOutlineArrowNarrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentBlogs.map((blogItem: any) => {
            const blog = blogItem.attributes || blogItem;
            return (
              <div key={blog.id || blog.slug} className="h-full">
                {/* Corrected: Passed the lang prop to BlogCard */}
                <BlogCard blog={blog} lang={lang} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
