import { getSkills } from "@/actions/skills";
import AdminSkillForm, { SkillList } from "./AdminSkillComponents";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
    const skills = await getSkills();

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold font-mono tracking-tighter text-white">Tech Stack Settings</h1>

            {/* Add New Form */}
            <AdminSkillForm />

            {/* List */}
            <div>
                <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-3">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    Current Tech Stack
                </h2>
                <SkillList skills={skills} />
            </div>
        </div>
    );
}
