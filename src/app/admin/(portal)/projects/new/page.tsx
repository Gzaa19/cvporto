import AdminProjectForm from "../AdminProjectComponents";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <a href="/admin/projects" className="text-muted-foreground hover:text-white font-mono text-sm">&larr; Back to List</a>
                <h1 className="text-3xl font-bold font-mono tracking-tighter text-white">Add New Project</h1>
            </div>

            <AdminProjectForm />
        </div>
    );
}
