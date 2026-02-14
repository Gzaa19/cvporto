import { getHeroStatus } from "@/actions/hero-status";
import AdminHeroStatusForm from "./hero/AdminHeroStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const heroStatus = await getHeroStatus();

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white font-mono mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground font-mono">
                        Manage your portfolio content
                    </p>
                </div>

                {/* Hero Status Card */}
                <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white font-mono mb-6 flex items-center gap-3">
                        <span className="w-3 h-3 bg-primary rounded-full"></span>
                        Hero Status Cards
                    </h2>

                    <AdminHeroStatusForm initialData={heroStatus} />
                </div>

                {/* Back to Home */}
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
                >
                    ← Back to Portfolio
                </a>
            </div>
        </div>
    );
}
