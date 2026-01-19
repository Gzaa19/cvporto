"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get About Content (or create default)
export async function getAboutContent() {
    let content = await prisma.aboutContent.findFirst();

    if (!content) {
        content = await prisma.aboutContent.create({
            data: {
                greeting: "Hi, I'm",
                name: "Gaza Chansa",
                introText: "A Software Engineer who loves building modern web applications with cutting-edge technologies.",
                focusText: "Currently focusing on creating interactions that feel natural and performance that feels instantaneous.",
            },
        });
    }

    return content;
}

// Update About Content
export async function updateAboutContent(data: {
    greeting?: string;
    name?: string;
    introText?: string;
    focusText?: string;
}) {
    const existing = await prisma.aboutContent.findFirst();

    if (existing) {
        const updated = await prisma.aboutContent.update({
            where: { id: existing.id },
            data: {
                greeting: data.greeting ?? existing.greeting,
                name: data.name ?? existing.name,
                introText: data.introText ?? existing.introText,
                focusText: data.focusText ?? existing.focusText,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin/about");
        return updated;
    }

    // Create if not exists
    const created = await prisma.aboutContent.create({
        data: {
            greeting: data.greeting ?? "Hi, I'm",
            name: data.name ?? "Gaza Chansa",
            introText: data.introText ?? "A Software Engineer...",
            focusText: data.focusText ?? "Currently focusing on...",
        },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    return created;
}
