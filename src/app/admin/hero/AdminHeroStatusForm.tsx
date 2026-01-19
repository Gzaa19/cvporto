"use client";

import { useState, useTransition } from "react";
import { updateHeroStatus } from "@/actions/hero-status";

interface HeroStatus {
    id: string;
    location: string;
    currentRole: string;
    status: string;
    subtitle: string;
}

export default function AdminHeroStatusForm({ initialData }: { initialData: HeroStatus }) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        location: initialData.location,
        currentRole: initialData.currentRole,
        status: initialData.status,
        subtitle: initialData.subtitle,
    });
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            await updateHeroStatus(formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subtitle */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Subtitle (Role Title)
                </label>
                <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g. SOFTWARE ENGINEER"
                />
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Location
                </label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g. INDONESIA"
                />
            </div>

            {/* Current Role */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Current Role
                </label>
                <input
                    type="text"
                    value={formData.currentRole}
                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                    placeholder="e.g. FRONT END"
                />
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Status
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BUSY">BUSY</option>
                    <option value="OPEN TO WORK">OPEN TO WORK</option>
                    <option value="NOT AVAILABLE">NOT AVAILABLE</option>
                </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </button>

                {saved && (
                    <span className="text-green-500 font-mono text-sm animate-pulse">
                        ✓ Saved successfully!
                    </span>
                )}
            </div>

            {/* Preview */}
            <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">
                    Preview
                </h3>

                {/* Subtitle Preview */}
                <div className="mb-6">
                    <p className="text-lg md:text-2xl font-medium tracking-[0.2em] text-muted-foreground font-mono">
                        {formData.subtitle}
                    </p>
                </div>

                {/* Cards Preview */}
                <div className="flex flex-wrap gap-4">
                    <div className="p-4 border border-white/20 bg-background/30 min-w-[140px]">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-mono">Location</p>
                        <p className="text-lg font-bold text-white font-mono">{formData.location}</p>
                    </div>
                    <div className="p-4 border border-white/20 bg-background/30 min-w-[140px]">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-mono">Current Role</p>
                        <p className="text-lg font-bold text-white font-mono">{formData.currentRole}</p>
                    </div>
                    <div className="p-4 bg-primary text-primary-foreground min-w-[140px]">
                        <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-mono">Status</p>
                        <p className="text-lg font-bold font-mono">{formData.status}</p>
                    </div>
                </div>
            </div>
        </form>
    );
}
