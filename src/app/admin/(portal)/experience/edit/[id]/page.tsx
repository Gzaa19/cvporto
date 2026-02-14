import { getExperienceById } from "@/actions/experience";
import AdminExperienceForm from "../../AdminExperienceComponents";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const experience = await getExperienceById(id);

    if (!experience) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/experience"
                    className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white font-mono">Edit Experience</h1>
            </div>

            {/* Form */}
            <AdminExperienceForm experienceToEdit={experience} />
        </div>
    );
}
