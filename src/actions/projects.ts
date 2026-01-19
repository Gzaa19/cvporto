"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get All Projects
export async function getProjects() {
    return await prisma.project.findMany({
        orderBy: { order: "asc" },
    });
}

// Get Single Project
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

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return project;
}

// Delete Project
export async function deleteProject(id: string) {
    await prisma.project.delete({
        where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
}
