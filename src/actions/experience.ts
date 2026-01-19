"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ExperienceData {
    role: string;
    company: string;
    location: string;
    workType: string;
    period: string;
    description: string;
    order: number;
}

// Create a new experience
export async function createExperience(data: ExperienceData) {
    try {
        const experience = await prisma.experience.create({
            data: {
                role: data.role,
                company: data.company,
                location: data.location,
                workType: data.workType,
                period: data.period,
                description: data.description,
                order: data.order,
            },
        });
        revalidatePath("/admin/experience");
        revalidatePath("/");
        return { success: true, data: experience };
    } catch (error) {
        console.error("Error creating experience:", error);
        return { success: false, error: "Failed to create experience" };
    }
}

// Get all experiences
export async function getExperiences() {
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

// Get single experience by ID
export async function getExperienceById(id: string) {
    try {
        const experience = await prisma.experience.findUnique({
            where: { id },
        });
        return experience;
    } catch (error) {
        console.error("Error fetching experience:", error);
        return null;
    }
}

// Update an experience
export async function updateExperience(id: string, data: ExperienceData) {
    try {
        const experience = await prisma.experience.update({
            where: { id },
            data: {
                role: data.role,
                company: data.company,
                location: data.location,
                workType: data.workType,
                period: data.period,
                description: data.description,
                order: data.order,
            },
        });
        revalidatePath("/admin/experience");
        revalidatePath("/");
        return { success: true, data: experience };
    } catch (error) {
        console.error("Error updating experience:", error);
        return { success: false, error: "Failed to update experience" };
    }
}

// Delete an experience
export async function deleteExperience(id: string) {
    try {
        await prisma.experience.delete({
            where: { id },
        });
        revalidatePath("/admin/experience");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error deleting experience:", error);
        return { success: false, error: "Failed to delete experience" };
    }
}
