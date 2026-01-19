"use client";

import { useActionState, useState } from "react";
import { createProject, updateProject, deleteProject } from "@/actions/projects";

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string;
    imageUrl?: string | null;
    projectUrl?: string | null;
    githubUrl?: string | null;
    order: number;
}

export default function AdminProjectForm({
    initialData,
    projectToEdit
}: {
    initialData?: Project[],
    projectToEdit?: Project | null
}) {
    // Mode Add or Edit determined by projectToEdit
    const isEditMode = !!projectToEdit;

    // Form State
    const [formData, setFormData] = useState({
        title: projectToEdit?.title || "",
        description: projectToEdit?.description || "",
        tags: projectToEdit?.tags || "",
        imageUrl: projectToEdit?.imageUrl || "",
        projectUrl: projectToEdit?.projectUrl || "",
        githubUrl: projectToEdit?.githubUrl || "",
        order: projectToEdit?.order || 0,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditMode && projectToEdit) {
                await updateProject(projectToEdit.id, formData);
            } else {
                await createProject(formData);
            }
            // Reset or redirect logic could be here, for now simpler is page refresh or parent handler
            window.location.href = "/admin/projects"; // Simple redirect to clear state/refresh list
        } catch (error) {
            console.error("Failed to save project", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a2e] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white font-mono mb-4">
                {isEditMode ? "Edit Project" : "Add New Project"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Title
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                {/* Order */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Order
                    </label>
                    <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="React, TypeScript, Next.js"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Description
                    </label>
                    <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                </div>

                {/* Links */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Live Project URL
                    </label>
                    <input
                        type="url"
                        value={formData.projectUrl || ""}
                        onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        GitHub URL
                    </label>
                    <input
                        type="url"
                        value={formData.githubUrl || ""}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                {/* Image URL (Simple input for now, could be File Upload later) */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Image URL
                    </label>
                    <input
                        type="text"
                        value={formData.imageUrl || ""}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="/projects/example.png or https://..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {isEditMode && (
                    <a href="/admin/projects" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-mono rounded-lg transition-colors">
                        Cancel
                    </a>
                )}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : (isEditMode ? "Update Project" : "Create Project")}
                </button>
            </div>
        </form>
    );
}

export function ProjectList({ projects }: { projects: Project[] }) {
    const [isDeleting, setIsDeleting] = useState("");

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            setIsDeleting(id);
            await deleteProject(id);
            setIsDeleting("");
        }
    }

    return (
        <div className="space-y-4 font-mono">
            {projects.map((p) => (
                <div key={p.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-[#1a1a2e] border border-white/10 rounded-lg gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                        <p className="text-xs text-muted-foreground truncate max-w-md">{p.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {p.tags.split(',').map((tag, i) => (
                                <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/70">{tag.trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/projects/edit/${p.id}`} className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-500/30 text-xs">Edit</a>
                        <button
                            onClick={() => handleDelete(p.id)}
                            disabled={isDeleting === p.id}
                            className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 text-xs"
                        >
                            {isDeleting === p.id ? "..." : "Delete"}
                        </button>
                    </div>
                </div>
            ))}
            {projects.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No projects found. Create one above!
                </div>
            )}
        </div>
    );
}
