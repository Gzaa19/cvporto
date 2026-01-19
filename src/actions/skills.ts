"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get All Skills
export async function getSkills() {
    return await prisma.skill.findMany({
        orderBy: { order: "asc" },
    });
}

// Get Single Skill
export async function getSkill(id: string) {
    return await prisma.skill.findUnique({
        where: { id },
    });
}

// Create Skill
export async function createSkill(data: {
    name: string;
    category: string;
    iconName: string;
    order?: number;
}) {
    const skill = await prisma.skill.create({
        data: {
            name: data.name,
            category: data.category,
            iconName: data.iconName,
            order: data.order ?? 0,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return skill;
}

// Update Skill
export async function updateSkill(id: string, data: {
    name?: string;
    category?: string;
    iconName?: string;
    order?: number;
}) {
    const skill = await prisma.skill.update({
        where: { id },
        data: {
            name: data.name,
            category: data.category,
            iconName: data.iconName,
            order: data.order,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return skill;
}

// Delete Skill
export async function deleteSkill(id: string) {
    await prisma.skill.delete({
        where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
}
