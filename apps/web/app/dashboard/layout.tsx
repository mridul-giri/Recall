import { getServerSession } from "next-auth";
import DashboardNavbar from "../../components/DashboardNavbar";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    redirect("/auth/register");
  }
  return (
    <div>
      <DashboardNavbar session={session} />
      {children}
    </div>
  );
}
