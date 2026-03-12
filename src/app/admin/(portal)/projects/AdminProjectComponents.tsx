"use client";

import { useRef, useState, useCallback } from "react";
import { createProject, updateProject, deleteProject } from "@/actions/projects";
import { ICON_MAP } from "@/lib/icons-map";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/compress-image";

interface Project {
    id: string;
    title: string;
    subtitle: string;
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
    const isEditMode = !!projectToEdit;

    const [formData, setFormData] = useState({
        title: projectToEdit?.title || "",
        subtitle: projectToEdit?.subtitle || "",
        description: projectToEdit?.description || "",
        tags: projectToEdit?.tags || "",
        imageUrl: projectToEdit?.imageUrl || "",
        projectUrl: projectToEdit?.projectUrl || "",
        githubUrl: projectToEdit?.githubUrl || "",
        order: projectToEdit?.order || 0,
    });

    const [isSaving, setIsSaving] = useState(false);

    // Image upload states
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload to Cloudinary via /api/upload
    const handleFileUpload = async (file: File) => {
        setUploadError(null);

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
        if (!allowedTypes.includes(file.type)) {
            setUploadError("Format tidak didukung. Gunakan JPEG, PNG, WebP, GIF, atau SVG.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError("File terlalu besar. Maksimal 10MB.");
            return;
        }

        setIsUploading(true);

        try {
            // Compress image client-side before upload
            const originalSize = file.size;
            const compressed = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1080,
                quality: 0.8,
            });
            const savedPercent = Math.round((1 - compressed.size / originalSize) * 100);
            if (savedPercent > 0) {
                console.log(
                    `Image compressed: ${(originalSize / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB (-${savedPercent}%)`
                );
            }

            const uploadForm = new FormData();
            uploadForm.append("file", compressed);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadForm,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload gagal");
            }

            const result = await response.json();
            setFormData((prev) => ({ ...prev, imageUrl: result.url }));
        } catch (error) {
            console.error("Upload error:", error);
            setUploadError(error instanceof Error ? error.message : "Gagal mengupload gambar");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
        setUploadError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditMode && projectToEdit) {
                await updateProject(projectToEdit.id, formData);
            } else {
                await createProject(formData);
            }
            window.location.href = "/admin/projects";
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

                {/* Subtitle */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Subtitle
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. A web app for managing projects"
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
                    {/* Live Preview of Icons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.split(',').filter(t => t.trim()).map((tag, i) => {
                            const tagName = tag.trim();
                            const matchedKey = Object.keys(ICON_MAP).find(k => k.toLowerCase() === tagName.toLowerCase());
                            const iconUrl = matchedKey ? ICON_MAP[matchedKey] : null;
                            const isNextJs = matchedKey === "Next.js" || tagName.toLowerCase() === "next.js";

                            if (iconUrl) {
                                return (
                                    <div key={i} className="w-6 h-6 p-1 bg-white/5 border border-white/10 rounded flex items-center justify-center" title={tagName}>
                                        <img
                                            src={iconUrl}
                                            alt={tagName}
                                            className={`w-full h-full object-contain ${isNextJs ? 'invert' : ''}`}
                                        />
                                    </div>
                                );
                            }
                            return (
                                <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/50 border border-white/5">{tagName}</span>
                            );
                        })}
                    </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Description
                    </label>
                    <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors min-h-[120px] overflow-y-auto scrollbar-thin overscroll-contain"
                        data-lenis-prevent
                    />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Project Image
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {formData.imageUrl ? (
                        <div className="relative group/preview rounded-lg overflow-hidden border border-white/10 bg-black/50">
                            <img
                                src={formData.imageUrl}
                                alt="Project preview"
                                className="w-full max-h-[300px] object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-lg border border-white/20 transition-colors flex items-center gap-2"
                                >
                                    <Upload size={14} /> Ganti
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-mono text-xs uppercase tracking-wider rounded-lg border border-red-500/30 transition-colors flex items-center gap-2"
                                >
                                    <X size={14} /> Hapus
                                </button>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                                <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-mono text-white/50 truncate">
                                    {formData.imageUrl}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center py-12 px-6 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragOver
                                    ? "border-primary bg-primary/10 scale-[1.02]"
                                    : "border-white/20 bg-background hover:border-white/40 hover:bg-white/5"
                                } ${isUploading ? "pointer-events-none" : ""}`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={40} className="text-primary animate-spin mb-3" />
                                    <p className="text-sm font-mono text-white/70">Mengupload...</p>
                                </>
                            ) : (
                                <>
                                    <div className={`p-4 rounded-full mb-4 transition-colors ${isDragOver ? "bg-primary/20" : "bg-white/5"
                                        }`}>
                                        <ImageIcon size={32} className={`transition-colors ${isDragOver ? "text-primary" : "text-white/30"
                                            }`} />
                                    </div>
                                    <p className="text-sm font-mono text-white/70 mb-1">
                                        <span className="text-primary font-bold">Klik untuk upload</span> atau drag & drop
                                    </p>
                                    <p className="text-xs font-mono text-white/30">
                                        JPEG, PNG, WebP, GIF, SVG • Maks 10MB
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {uploadError && (
                        <div className="mt-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono flex items-center gap-2">
                            <X size={14} className="shrink-0" />
                            {uploadError}
                        </div>
                    )}
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
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {isEditMode && (
                    <a href="/admin/projects" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-mono rounded-lg transition-colors">
                        Cancel
                    </a>
                )}
                <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : (isEditMode ? "Update Project" : "Create Project")}
                </button>
            </div>
        </form>
    );
}

import { Edit, Trash2, ExternalLink, Github, GripVertical, Eye } from "lucide-react";
import ProjectDetailModal from "@/components/ui/ProjectDetailModal";

// ... (keep previous imports)

export function ProjectList({ projects }: { projects: Project[] }) {
    const [isDeleting, setIsDeleting] = useState("");
    const [previewProject, setPreviewProject] = useState<Project | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            setIsDeleting(id);
            await deleteProject(id);
            setIsDeleting("");
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {projects.map((p) => (
                    <div
                        key={p.id}
                        className="group relative flex flex-col md:flex-row gap-6 bg-[#1a1a2e] border border-white/10 p-5 rounded-xl hover:border-primary/50 transition-all duration-300 shadow-lg shadow-black/20"
                    >
                        {/* Order Badge */}
                        <div className="absolute top-4 right-4 md:static md:w-16 md:flex md:items-center md:justify-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white/50 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                                {p.order}
                            </div>
                        </div>

                        {/* Image Preview */}
                        <div className="w-full md:w-48 aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/5 relative shrink-0">
                            {p.imageUrl ? (
                                <img
                                    src={p.imageUrl}
                                    alt={p.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 font-mono text-xs uppercase tracking-widest">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white font-mono tracking-tight mb-1 group-hover:text-primary transition-colors">
                                    {p.title}
                                </h3>
                                <p className="text-sm font-mono text-primary/80 uppercase tracking-wider mb-2">
                                    {p.subtitle}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {p.tags.split(',').map((tag, i) => {
                                    const tagName = tag.trim();
                                    const matchedKey = Object.keys(ICON_MAP).find(k => k.toLowerCase() === tagName.toLowerCase());
                                    const iconUrl = matchedKey ? ICON_MAP[matchedKey] : null;
                                    const isNextJs = matchedKey === "Next.js" || tagName.toLowerCase() === "next.js";

                                    if (iconUrl) {
                                        return (
                                            <div key={i} className="w-8 h-8 p-1.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group/icon" title={tagName}>
                                                <img
                                                    src={iconUrl}
                                                    alt={tagName}
                                                    className={`w-full h-full object-contain opacity-70 group-hover/icon:opacity-100 transition-opacity ${isNextJs ? 'invert' : ''}`}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <span key={i} className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-white/60 border border-white/10 hover:text-white transition-colors">
                                            {tagName}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Links & Actions Mobile */}
                            <div className="flex md:hidden items-center gap-3 pt-4 border-t border-white/5">
                                <a href={`/admin/projects/edit/${p.id}`} className="flex-1 py-2 text-center bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                                    Edit
                                </a>
                                <button
                                    onClick={() => setPreviewProject(p)}
                                    className="flex-1 py-2 text-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    disabled={isDeleting === p.id}
                                    className="flex-1 py-2 text-center bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50"
                                >
                                    {isDeleting === p.id ? "..." : "Delete"}
                                </button>
                            </div>
                        </div>

                        {/* Actions Desktop */}
                        < div className="hidden md:flex flex-col items-end gap-2 pl-4 border-l border-white/5 min-w-[140px]" >
                            <div className="flex gap-2 mb-auto">
                                {p.projectUrl && (
                                    <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Live Site">
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                                {p.githubUrl && (
                                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="GitHub Repo">
                                        <Github size={18} />
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 w-full mt-auto">
                                <a
                                    href={`/admin/projects/edit/${p.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 text-xs font-mono font-bold uppercase tracking-wider transition-all"
                                >
                                    <Edit size={14} /> Edit
                                </a>
                                <button
                                    onClick={() => setPreviewProject(p)}
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider transition-all"
                                >
                                    <Eye size={14} /> Preview
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    disabled={isDeleting === p.id}
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                                >
                                    <Trash2 size={14} /> {isDeleting === p.id ? "..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div >

            {
                projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                        <div className="p-4 rounded-full bg-white/5 mb-4">
                            <GripVertical className="text-white/20 w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-mono mb-2">No Projects Yet</h3>
                        <p className="text-muted-foreground text-sm max-w-sm text-center mb-6">
                            Start building your portfolio by adding your first project above.
                        </p>
                    </div>
                )
            }

            < ProjectDetailModal
                isOpen={!!previewProject}
                onClose={() => setPreviewProject(null)}
                project={previewProject}
            />
        </div >
    );
}
