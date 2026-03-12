import prisma from "@/lib/prisma";
import { serverCache } from "@/lib/cache";

export async function getProjectsData() {
    return serverCache.getOrFetch(
        "projects:all",
        async () => {
            try {
                return await prisma.project.findMany({
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        title: true,
                        subtitle: true,
                        description: true,
                        tags: true,
                        imageUrl: true,
                        projectUrl: true,
                        githubUrl: true,
                        order: true,
                    },
                });
            } catch (error) {
                console.error("Error fetching projects:", error);
                return [];
            }
        },
        120, // 2 minutes TTL
        ["projects"]
    );
}
