import prisma from "@/lib/prisma";

export async function getHeroStatusData() {
    try {
        let status = await prisma.heroStatus.findFirst();

        if (!status) {
            return {
                location: "INDONESIA",
                currentRole: "FRONT END",
                status: "AVAILABLE",
                subtitle: "SOFTWARE ENGINEER",
            };
        }

        return {
            location: status.location,
            currentRole: status.currentRole,
            status: status.status,
            subtitle: status.subtitle,
        };
    } catch (error) {
        console.error("Error fetching hero status:", error);
        return {
            location: "INDONESIA",
            currentRole: "FRONT END",
            status: "AVAILABLE",
            subtitle: "SOFTWARE ENGINEER",
        };
    }
}
