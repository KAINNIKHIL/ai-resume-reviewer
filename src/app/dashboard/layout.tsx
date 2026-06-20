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
    <div className="flex min-h-screen">
      <aside className="w-64 border-r">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}