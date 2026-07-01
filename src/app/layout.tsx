import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"), // Replace after deployment

  title: {
    default: "AI Resume Reviewer | ATS Resume Analyzer & Career Assistant",
    template: "%s | AI Resume Reviewer",
  },

  description:
    "Analyze your resume with AI, improve ATS score, optimize resume content, compare against job descriptions, and generate personalized cover letters—all in one platform.",

  keywords: [
    "AI Resume Reviewer",
    "ATS Resume Checker",
    "Resume Optimizer",
    "Resume Analysis",
    "Resume Scanner",
    "Resume ATS Score",
    "Job Description Match",
    "AI Cover Letter",
    "Career Assistant",
    "Resume Builder",
    "Resume Feedback",
    "Next.js AI Project",
  ],

  authors: [
    {
      name: "Nikhil Singh Kaintura",
    },
  ],

  creator: "Nikhil Singh Kaintura",

  publisher: "AI Resume Reviewer",

  applicationName: "AI Resume Reviewer",

  category: "Career",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Resume Reviewer",
    description:
      "Analyze, optimize and improve your resume using AI. Compare with Job Descriptions and generate professional Cover Letters.",
    url: "https://your-domain.com",
    siteName: "AI Resume Reviewer",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Resume Reviewer",
    description:
      "AI-powered Resume Analysis, ATS Optimization, JD Matching and Cover Letter Generation.",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}