import { getProjects } from "@/actions/projects";
import { ProjectList } from "./AdminProjectComponents";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="max-w-6xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-mono tracking-tighter text-white mb-2">Project Settings</h1>
                    <p className="text-muted-foreground text-sm font-mono">
                        Manage and monitor your portfolio projects.
                    </p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} /> Add New Project
                </Link>
            </div>

            {/* List */}
            <div>
                <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <h2 className="text-sm font-bold text-white font-mono uppercase tracking-widest">
                        Monitoring ({projects.length} Projects)
                    </h2>
                </div>
                <ProjectList projects={projects} />
            </div>
        </div>
    );
}
