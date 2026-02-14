"use client";

import { useState, useTransition } from "react";
import { updateAboutContent } from "@/actions/about-content";

interface AboutContent {
    id: string;
    greeting: string;
    name: string;
    introText: string;
    focusText: string;
}

export default function AdminAboutForm({ initialData }: { initialData: AboutContent }) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        greeting: initialData.greeting,
        name: initialData.name,
        introText: initialData.introText,
        focusText: initialData.focusText,
    });
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await updateAboutContent(formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Greeting */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Greeting (Small Text)
                </label>
                <input
                    type="text"
                    value={formData.greeting}
                    onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                />
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Name (Highlighted)
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors"
                />
            </div>

            {/* Intro Text */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Intro Text (Main Description)
                </label>
                <textarea
                    rows={5}
                    value={formData.introText}
                    onChange={(e) => setFormData({ ...formData, introText: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors min-h-[120px]"
                />
            </div>

            {/* Focus Text */}
            <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                    Focus Text (Secondary Description)
                </label>
                <textarea
                    rows={5}
                    value={formData.focusText}
                    onChange={(e) => setFormData({ ...formData, focusText: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg text-white font-mono focus:border-primary focus:outline-none transition-colors min-h-[120px]"
                />
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
                <div className="p-6 border border-white/10 bg-background/50 rounded-lg font-mono text-muted-foreground">
                    <p className="text-xl md:text-3xl leading-relaxed">
                        {formData.greeting} <span className="text-white relative inline-block">
                            <span className="relative z-10">{formData.name}</span>
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10"></span>
                        </span>. {formData.introText}
                    </p>
                    <p className="text-xl md:text-3xl leading-relaxed mt-8">
                        {formData.focusText}
                    </p>
                </div>
            </div>
        </form>
    );
}
