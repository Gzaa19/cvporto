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
        // WRAPPER UTAMA: Let window scroll naturally (Lenis) - Inherited from RootLayout
        <div className="flex min-h-screen w-full bg-background text-white">

            {/* 2. SIDEBAR: Wrapper for sticky sidebar */}
            <div className="w-64 shrink-0 hidden md:block relative">
                <AdminSidebar />
            </div>

            {/* 3. AREA KONTEN */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* 4. MAIN CONTENT */}
                <main className="flex-1 p-4 md:p-8 relative">
                    <div className="pb-32">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}
