"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get hero status (or create default if not exists)
export async function getHeroStatus() {
    let status = await prisma.heroStatus.findFirst();

    if (!status) {
        status = await prisma.heroStatus.create({
            data: {
                location: "INDONESIA",
                currentRole: "FRONT END",
                status: "AVAILABLE",
                subtitle: "SOFTWARE ENGINEER",
            },
        });
    }

    return status;
}

// Update hero status
export async function updateHeroStatus(data: {
    location?: string;
    currentRole?: string;
    status?: string;
    subtitle?: string;
}) {
    const existing = await prisma.heroStatus.findFirst();

    if (existing) {
        const updated = await prisma.heroStatus.update({
            where: { id: existing.id },
            data: {
                location: data.location ?? existing.location,
                currentRole: data.currentRole ?? existing.currentRole,
                status: data.status ?? existing.status,
                subtitle: data.subtitle ?? existing.subtitle,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin");
        return updated;
    }

    // Create if not exists
    const created = await prisma.heroStatus.create({
        data: {
            location: data.location ?? "INDONESIA",
            currentRole: data.currentRole ?? "FRONT END",
            status: data.status ?? "AVAILABLE",
            subtitle: data.subtitle ?? "SOFTWARE ENGINEER",
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return created;
}
