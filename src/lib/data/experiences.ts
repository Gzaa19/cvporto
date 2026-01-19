import { prisma } from "@/lib/prisma";

export async function getExperiencesData() {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { order: "asc" },
        });
        return experiences;
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }
}
