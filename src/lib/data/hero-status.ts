import prisma from "@/lib/prisma";
import { serverCache } from "@/lib/cache";

export async function getHeroStatusData() {
    return serverCache.getOrFetch(
        "hero-status",
        async () => {
            try {
                const status = await prisma.heroStatus.findFirst({
                    select: {
                        location: true,
                        currentRole: true,
                        status: true,
                        subtitle: true,
                    },
                });

                if (!status) {
                    return {
                        location: "INDONESIA",
                        currentRole: "FRONT END",
                        status: "AVAILABLE",
                        subtitle: "SOFTWARE ENGINEER",
                    };
                }

                return status;
            } catch (error) {
                console.error("Error fetching hero status:", error);
                return {
                    location: "INDONESIA",
                    currentRole: "FRONT END",
                    status: "AVAILABLE",
                    subtitle: "SOFTWARE ENGINEER",
                };
            }
        },
        300, // 5 minutes TTL - rarely changes
        ["hero-status"]
    );
}
