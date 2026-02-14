"use client";

import { useState } from "react";
import { createExperience, updateExperience, deleteExperience } from "@/actions/experience";
import { Edit, Trash2, Briefcase } from "lucide-react";

interface Experience {
    id: string;
    role: string;
    company: string;
    location: string;
    workType: string;
    period: string;
    description: string;
    order: number;
}

export default function AdminExperienceForm({
    experienceToEdit
}: {
    experienceToEdit?: Experience | null
}) {
    const isEditMode = !!experienceToEdit;

    const [formData, setFormData] = useState({
        role: experienceToEdit?.role || "",
        company: experienceToEdit?.company || "",
        location: experienceToEdit?.location || "",
        workType: experienceToEdit?.workType || "On-site",
        period: experienceToEdit?.period || "",
        description: experienceToEdit?.description || "",
        order: experienceToEdit?.order || 0,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditMode && experienceToEdit) {
                await updateExperience(experienceToEdit.id, formData);
            } else {
                await createExperience(formData);
            }
            window.location.href = "/admin/experience";
        } catch (error) {
            console.error("Failed to save experience", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a2e] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white font-mono mb-4">
                {isEditMode ? "Edit Experience" : "Add New Experience"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Role / Position
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. Senior Frontend Engineer"
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

                {/* Company */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Company
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. TechCorp Inc."
                    />
                </div>

                {/* Period */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Period
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. 2023 - Present"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Location
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. Jakarta, Indonesia"
                    />
                </div>

                {/* Work Type */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Work Type
                    </label>
                    <select
                        value={formData.workType}
                        onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    >
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
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
                        placeholder="Describe your responsibilities and achievements..."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {isEditMode && (
                    <a href="/admin/experience" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-mono rounded-lg transition-colors">
                        Cancel
                    </a>
                )}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : (isEditMode ? "Update Experience" : "Create Experience")}
                </button>
            </div>
        </form>
    );
}

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
    const [isDeleting, setIsDeleting] = useState("");

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this experience? This action cannot be undone.")) {
            setIsDeleting(id);
            await deleteExperience(id);
            setIsDeleting("");
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {experiences.map((exp) => (
                    <div
                        key={exp.id}
                        className="group relative flex flex-col md:flex-row gap-6 bg-[#1a1a2e] border border-white/10 p-5 rounded-xl hover:border-primary/50 transition-all duration-300 shadow-lg shadow-black/20"
                    >
                        {/* Order Badge */}
                        <div className="absolute top-4 right-4 md:static md:w-16 md:flex md:items-center md:justify-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white/50 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                                {exp.order}
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="w-full md:w-16 flex items-center justify-center shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                            <div>
                                <h3 className="text-xl font-bold text-white font-mono tracking-tight mb-1 group-hover:text-primary transition-colors">
                                    {exp.role}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="text-primary/80 font-mono">{exp.company}</span>
                                    <span className="text-white/30">•</span>
                                    <span className="text-muted-foreground font-mono">{exp.period}</span>
                                    {exp.location && (
                                        <>
                                            <span className="text-white/30">•</span>
                                            <span className="text-muted-foreground font-mono">{exp.location}</span>
                                        </>
                                    )}
                                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full font-mono">
                                        {exp.workType}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {exp.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col items-center gap-2 md:border-l md:border-white/5 md:pl-4">
                            <a
                                href={`/admin/experience/edit/${exp.id}`}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 text-xs font-mono font-bold uppercase tracking-wider transition-all"
                            >
                                <Edit size={14} /> Edit
                            </a>
                            <button
                                onClick={() => handleDelete(exp.id)}
                                disabled={isDeleting === exp.id}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                            >
                                <Trash2 size={14} /> {isDeleting === exp.id ? "..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {experiences.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <div className="p-4 rounded-full bg-white/5 mb-4">
                        <Briefcase className="text-white/20 w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-mono mb-2">No Experience Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-sm text-center mb-6">
                        Start adding your work experience by clicking the button above.
                    </p>
                </div>
            )}
        </div>
    );
}
