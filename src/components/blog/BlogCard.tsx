import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getStrapiURL } from "@/utils/get-strapi-url";

// Added 'lang' to the props interface
export default function BlogCard({ blog, lang }: { blog: any; lang: string }) {
  // Extract the Strapi image URL
  const imageUrl = blog.image?.data?.attributes?.url || blog.image?.url;
  const fullImageUrl = imageUrl
    ? `${getStrapiURL()}${imageUrl}`
    : "/fallback.jpg";

  // Format date if needed (assuming 'date' from Strapi is YYYY-MM-DD)
  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group relative bg-white border border-gray-300 p-5 rounded-[40px] flex flex-col transition-all duration-500 ease-in-out hover:border-[#013228] hover:shadow-xl h-full cursor-pointer">
      {/* Category/Tag Badge */}
      <div className="absolute top-8 right-8 z-10 bg-[#E3FFCD] text-[#013228] text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full shadow-sm opacity-90 group-hover:opacity-100 transition-opacity uppercase border border-[#013228]/10">
        {blog.tag}
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-16/10 rounded-[32px] overflow-hidden mb-6 bg-gray-100 border border-gray-100">
        <Image
          src={fullImageUrl}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col grow px-2">
        <div className="flex items-center gap-3 text-gray-500 text-xs font-semibold mb-4 uppercase tracking-wider">
          <span>{formattedDate}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1.5 text-gray-500">
            <Clock size={14} className="opacity-70" />
            {blog.read}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#013228] mb-3 line-clamp-2 leading-tight">
          {/* Corrected: Added the /${lang} prefix to the link */}
          <Link href={`/${lang}/blog/${blog.slug}`}>
            <span className="absolute inset-0" />
            {blog.title}
          </Link>
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 grow font-medium">
          {blog.content_title}
        </p>

        {/* Footer section */}
        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 relative z-20">
            <span className="text-[#013228] text-sm font-bold">
              By {blog.author}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#013228] group-hover:border-[#013228] group-hover:text-[#E3FFCD] transition-all duration-500">
            <ArrowRight
              size={18}
              className="group-hover:-rotate-45 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
