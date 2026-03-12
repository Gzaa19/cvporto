"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { serverCache } from "@/lib/cache";

// Get All Projects (cached via data layer, this is for admin)
export async function getProjects() {
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
}

// Get Single Project by ID
export async function getProject(id: string) {
    return await prisma.project.findUnique({
        where: { id },
    });
}

// Create Project
export async function createProject(data: {
    title: string;
    subtitle: string;
    description: string;
    tags: string;
    imageUrl?: string;
    projectUrl?: string;
    githubUrl?: string;
    order?: number;
}) {
    const project = await prisma.project.create({
        data: {
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            tags: data.tags,
            imageUrl: data.imageUrl,
            projectUrl: data.projectUrl,
            githubUrl: data.githubUrl,
            order: data.order ?? 0,
        },
    });

    // Invalidate cache
    serverCache.invalidateByTags(["projects"]);
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return project;
}

// Update Project
export async function updateProject(id: string, data: {
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    imageUrl?: string;
    projectUrl?: string;
    githubUrl?: string;
    order?: number;
}) {
    const project = await prisma.project.update({
        where: { id },
        data: {
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            tags: data.tags,
            imageUrl: data.imageUrl,
            projectUrl: data.projectUrl,
            githubUrl: data.githubUrl,
            order: data.order,
        },
    });

    // Invalidate cache
    serverCache.invalidateByTags(["projects"]);
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return project;
}

// Delete Project
export async function deleteProject(id: string) {
    await prisma.project.delete({
        where: { id },
    });

    // Invalidate cache
    serverCache.invalidateByTags(["projects"]);
    revalidatePath("/");
    revalidatePath("/admin/projects");
}
