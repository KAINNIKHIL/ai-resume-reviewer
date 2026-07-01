import { auth } from "../auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="h-screen bg-background">

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Scrollable Content */}
      <main className="ml-64 h-screen overflow-y-auto p-8">
        {children}
      </main>

    </div>
  );
}