"use client";

import { useState } from "react";
import { createSkill, updateSkill, deleteSkill } from "@/actions/skills";
import { AVAILABLE_ICONS, ICON_MAP } from "@/lib/icons-map";

interface Skill {
    id: string;
    name: string;
    category: string;
    iconName: string;
    order: number;
}

export default function AdminSkillForm({
    initialData,
    skillToEdit
}: {
    initialData?: Skill[],
    skillToEdit?: Skill | null
}) {
    const isEditMode = !!skillToEdit;

    const [formData, setFormData] = useState({
        name: skillToEdit?.name || "",
        category: skillToEdit?.category || "",
        iconName: skillToEdit?.iconName || AVAILABLE_ICONS[0],
        order: skillToEdit?.order || 0,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditMode && skillToEdit) {
                await updateSkill(skillToEdit.id, formData);
            } else {
                await createSkill(formData);
            }
            window.location.href = "/admin/skills";
        } catch (error) {
            console.error("Failed to save skill", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to visualize selected icon
    const selectedIconUrl = ICON_MAP[formData.iconName] || ICON_MAP["React"];

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a2e] border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white font-mono mb-4">
                {isEditMode ? "Edit Skill" : "Add New Skill"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Skill Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. React"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Category
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. Library, Framework"
                    />
                </div>

                {/* Icon Selection */}
                <div>
                    <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                        Icon
                    </label>
                    <div className="flex gap-4">
                        <select
                            value={formData.iconName}
                            onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                            className="flex-1 px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                        >
                            {AVAILABLE_ICONS.map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                            ))}
                        </select>
                        <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded border border-white/10 p-2">
                            <img src={selectedIconUrl} alt="Selected" className="w-full h-full object-contain" />
                        </div>
                    </div>
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
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {isEditMode && (
                    <a href="/admin/skills" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-mono rounded-lg transition-colors">
                        Cancel
                    </a>
                )}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : (isEditMode ? "Update" : "Create")}
                </button>
            </div>
        </form>
    );
}

export function SkillList({ skills }: { skills: Skill[] }) {
    const [isDeleting, setIsDeleting] = useState("");

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this skill?")) {
            setIsDeleting(id);
            await deleteSkill(id);
            setIsDeleting("");
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            {skills.map((skill) => {
                const iconUrl = ICON_MAP[skill.iconName] || ICON_MAP["React"];
                return (
                    <div key={skill.id} className="p-4 bg-[#1a1a2e] border border-white/10 rounded-lg flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded text-primary w-10 h-10 flex items-center justify-center">
                                    <img src={iconUrl} alt={skill.name} className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{skill.name}</h3>
                                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                                </div>
                            </div>
                            <span className="text-xs text-white/30">#{skill.order}</span>
                        </div>

                        <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/5">
                            <a href={`/admin/skills/edit/${skill.id}`} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-500/20 text-xs">Edit</a>
                            <button
                                onClick={() => handleDelete(skill.id)}
                                disabled={isDeleting === skill.id}
                                className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 text-xs"
                            >
                                {isDeleting === skill.id ? "..." : "Delete"}
                            </button>
                        </div>
                    </div>
                );
            })}
            {skills.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground bg-[#1a1a2e] border border-white/10 rounded-lg">
                    No skills found. Add your tech stack above!
                </div>
            )}
        </div>
    );
}
