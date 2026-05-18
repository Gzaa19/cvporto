import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    return (
        // h-screen + overflow-hidden on wrapper = body never scrolls
        // sidebar stays fixed, only content area scrolls independently
        <div className="flex h-screen w-full overflow-hidden bg-background text-white">
            {/* SIDEBAR: fixed height, scrolls only its own content */}
            <div className="w-64 shrink-0 hidden md:flex flex-col h-full">
                <AdminSidebar />
            </div>

            {/* CONTENT AREA: independent native scroll container */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
                <main className="flex-1 p-4 md:p-8">
                    <div className="pb-16">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
