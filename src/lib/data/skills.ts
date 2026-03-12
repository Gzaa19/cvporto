import prisma from "@/lib/prisma";
import { serverCache } from "@/lib/cache";

export async function getSkillsData() {
    return serverCache.getOrFetch(
        "skills:all",
        async () => {
            try {
                return await prisma.skill.findMany({
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        iconName: true,
                        order: true,
                    },
                });
            } catch (error) {
                console.error("Error fetching skills:", error);
                return [];
            }
        },
        120, // 2 minutes TTL
        ["skills"]
    );
}
