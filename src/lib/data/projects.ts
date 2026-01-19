import prisma from "@/lib/prisma";

export async function getProjectsData() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: 'asc' }
        });
        return projects;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}
