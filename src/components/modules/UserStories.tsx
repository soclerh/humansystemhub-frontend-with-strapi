import React from "react";
import type { Module } from "@/data/modules";

const roleColors: Record<
  string,
  { bg: string; text: string; hoverBg: string }
> = {
  "HR Admin": {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    hoverBg: "bg-emerald-800/20",
  },
  Employee: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    hoverBg: "bg-blue-800/20",
  },
  Manager: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    hoverBg: "bg-amber-800/20",
  },
  "Super Admin": {
    bg: "bg-purple-100",
    text: "text-purple-800",
    hoverBg: "bg-purple-800/20",
  },
  System: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    hoverBg: "bg-gray-800/20",
  },
};

export default function UserStories({ module }: { module: any }) {
  const groups = module.userStories?.points || module.featureGroups || [];

  return (
    <section className="py-20 px-6 bg-[#F9FBF8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#013228]" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#013228]">
              User Stories
            </span>
            <div className="h-px w-8 bg-[#013228]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="max-w-2xl text-gray-500 text-lg leading-relaxed">
            Real-world scenarios showing how each role interacts with{" "}
            <strong>{module.shortTitle}</strong>.
          </p>
        </div>

        <div className="space-y-12 max-w-5xl mx-auto">
          {groups.map((group: any, gi: number) => {
            const groupName =
              group.groupName || group.title || group.name || `Group ${gi + 1}`;
            const stories = group.cards || group.stories || [];

            return (
              <div key={gi}>
                {/* Group header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#013228] text-[#E3FFCD] font-bold text-sm">
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {groupName}
                  </h3>
                </div>

                {/* Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-14">
                  {stories.map((story: any, si: number) => {
                    const role = story.role || "System";
                    const storyText =
                      story.story || story.text || story.description;
                    const colors = roleColors[role] || roleColors["System"];
                    return (
                      <div
                        key={si}
                        className="bg-white border border-gray-200 rounded-[20px] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${colors.bg} ${colors.text}`}
                        >
                          {role}
                        </span>
                        <p className="text-gray-600 leading-relaxed">
                          {storyText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
