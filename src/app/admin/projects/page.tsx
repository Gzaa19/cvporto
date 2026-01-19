import { getProjects } from "@/actions/projects";
import AdminProjectForm, { ProjectList } from "./AdminProjectComponents";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold font-mono tracking-tighter text-white">Project Settings</h1>

            {/* Add New Form */}
            <AdminProjectForm />

            {/* List */}
            <div>
                <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-3">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    Existing Projects
                </h2>
                <ProjectList projects={projects} />
            </div>
        </div>
    );
}
