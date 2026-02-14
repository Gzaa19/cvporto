import { getSkill } from "@/actions/skills";
import AdminSkillForm from "../../AdminSkillComponents";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({ params }: { params: { id: string } }) {
    const skill = await getSkill(params.id);

    if (!skill) {
        redirect("/admin/skills");
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <a href="/admin/skills" className="text-muted-foreground hover:text-white font-mono text-sm">&larr; Back to List</a>
                <h1 className="text-3xl font-bold font-mono tracking-tighter text-white">Edit Skill</h1>
            </div>

            <AdminSkillForm skillToEdit={skill} />
        </div>
    );
}
