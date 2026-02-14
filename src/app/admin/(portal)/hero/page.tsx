import { getHeroStatus } from "@/actions/hero-status";
import AdminHeroStatusForm from "./AdminHeroStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
    const heroStatus = await getHeroStatus();

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold font-mono tracking-tighter text-white mb-8">Hero Settings</h1>

            <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white font-mono mb-6 flex items-center gap-3">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    Status Cards Data
                </h2>

                <AdminHeroStatusForm initialData={heroStatus} />
            </div>
        </div>
    );
}
