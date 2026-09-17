import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { DashboardLayout } from "@/app/dashboard-layout";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Sidebar />
      <TopNavbar />
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
} 