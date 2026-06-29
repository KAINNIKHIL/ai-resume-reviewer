"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  GitCompare,
  FilePenLine,
} from "lucide-react";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/resumes",
    label: "Resumes",
    icon: FileText,
  },
  {
    href: "/dashboard/compare",
    label: "Compare JD",
    icon: GitCompare,
  },
  {
    href: "/dashboard/cover-letter",
    label: "Cover Letter",
    icon: FilePenLine,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white">
          AI Resume Reviewer
        </h1>

        <p className="text-sm text-zinc-400 mt-1">
          Land more interviews
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-800 p-5">
        <div className="rounded-xl bg-zinc-900 p-4">
          <p className="text-sm text-white font-medium">
            Free Plan
          </p>

          <p className="text-xs text-zinc-400 mt-1">
            Upgrade to unlock unlimited AI reviews.
          </p>
        </div>
      </div>
    </aside>
  );
}