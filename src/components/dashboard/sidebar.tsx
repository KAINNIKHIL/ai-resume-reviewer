import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-6">
        AI Resume Reviewer
      </h2>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="block"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/resumes"
          className="block"
        >
          Resumes
        </Link>

        <Link
          href="/dashboard/compare"
          className="block"
        >
          Compare JD
        </Link>
      </nav>
    </div>
  );
}