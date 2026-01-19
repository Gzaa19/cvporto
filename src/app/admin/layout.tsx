import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />
            <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
