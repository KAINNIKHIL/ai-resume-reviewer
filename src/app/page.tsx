
import Link from "next/link";
import {
  FileText,
  ScanSearch,
  Sparkles,
  Mail,
  ArrowRight,
} from "lucide-react";
import { ReactNode } from "react";
import { auth, signIn } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

if (session) {
  redirect("/dashboard");
}

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-blue-600" />
            AI Career Assistant
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Build Better Resumes.
            <br />
            Land More Interviews.
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Analyze your resume with AI, optimize it for ATS,
            compare it with any Job Description, generate
            personalized cover letters, and prepare for interviews—
            all from one modern platform.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <form
  action={async () => {
    "use server";

    await signIn("google", {
      redirectTo: "/dashboard",
    });
  }}
>
  <button
    type="submit"
    className="inline-flex items-center gap-2 rounded-xl bg-black px-8 py-4 font-medium text-white transition hover:opacity-90"
  >
    Get Started
    <ArrowRight className="h-5 w-5" />
  </button>
</form>

<form
  action={async () => {
    "use server";

    await signIn("google", {
      redirectTo: "/dashboard",
    });
  }}
>
  <button
    type="submit"
    className="rounded-xl border px-8 py-4 font-medium transition hover:bg-muted"
  >
    Sign In
  </button>
</form>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold">
            Everything You Need
          </h2>

          <p className="text-muted-foreground mt-3">
            One platform for every stage of your job application.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <FeatureCard
            icon={<FileText className="h-8 w-8" />}
            title="Resume Review"
            description="Get ATS score, strengths, weaknesses and actionable AI suggestions."
          />

          <FeatureCard
            icon={<Sparkles className="h-8 w-8" />}
            title="Resume Optimizer"
            description="Rewrite your resume into an ATS-friendly professional version."
          />

          <FeatureCard
            icon={<ScanSearch className="h-8 w-8" />}
            title="JD Match"
            description="Compare your resume with any job description and identify skill gaps."
          />

          <FeatureCard
            icon={<Mail className="h-8 w-8" />}
            title="Cover Letter"
            description="Generate personalized AI cover letters tailored for every application."
          />

        </div>

      </section>

    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

    </div>
  );
}
