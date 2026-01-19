import { getExperiences } from "@/actions/experience";
import AdminExperienceForm, { ExperienceList } from "./AdminExperienceComponents";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminExperiencePage() {
    const experiences = await getExperiences();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-mono">Experience</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage your work experience timeline
                    </p>
                </div>
                <Link
                    href="/admin/experience/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Add Experience
                </Link>
            </div>

            {/* Experience List */}
            <ExperienceList experiences={experiences} />
        </div>
    );
}
