import { prisma } from "@/lib/prisma";
import { serverCache } from "@/lib/cache";

export async function getExperiencesData() {
    return serverCache.getOrFetch(
        "experiences:all",
        async () => {
            try {
                return await prisma.experience.findMany({
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        role: true,
                        company: true,
                        location: true,
                        workType: true,
                        period: true,
                        description: true,
                        order: true,
                    },
                });
            } catch (error) {
                console.error("Error fetching experiences:", error);
                return [];
            }
        },
        120, // 2 minutes TTL
        ["experiences"]
    );
}
