import prisma from "@/lib/prisma";

export async function getSkillsData() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: 'asc' }
        });
        return skills;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
}
