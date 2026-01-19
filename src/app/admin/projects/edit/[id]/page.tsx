import { getProject } from "@/actions/projects";
import AdminProjectForm from "../AdminProjectComponents";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

    if (!project) {
        redirect("/admin/projects");
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <a href="/admin/projects" className="text-muted-foreground hover:text-white font-mono text-sm">&larr; Back to List</a>
                <h1 className="text-3xl font-bold font-mono tracking-tighter text-white">Edit Project</h1>
            </div>

            <AdminProjectForm projectToEdit={project} />
        </div>
    );
}
