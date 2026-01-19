import { cache } from "react"
import prisma from "@/lib/prisma"

export const getAboutContent = cache(async () => {
    let content = await prisma.aboutContent.findFirst()

    if (!content) {
        content = await prisma.aboutContent.create({
            data: {
                greeting: "Hi, I'm",
                name: "Gaza Chansa",
                introText: "A Software Engineer who loves building modern web applications with cutting-edge technologies.",
                focusText: "Currently focusing on creating interactions that feel natural and performance that feels instantaneous.",
            },
        })
    }

    return content
})

export const getHeroStatus = cache(async () => {
    let status = await prisma.heroStatus.findFirst()

    if (!status) {
        status = await prisma.heroStatus.create({
            data: {
                location: "INDONESIA",
                currentRole: "FRONT END",
                status: "AVAILABLE",
                subtitle: "SOFTWARE ENGINEER",
            },
        })
    }

    return status
})

export const getSkills = cache(async () => {
    return await prisma.skill.findMany({
        orderBy: { order: "asc" },
    })
})

export const getSkill = cache(async (id: string) => {
    return await prisma.skill.findUnique({
        where: { id },
    })
})

export const getProjects = cache(async () => {
    return await prisma.project.findMany({
        orderBy: { order: "asc" },
    })
})

export const getProject = cache(async (id: string) => {
    return await prisma.project.findUnique({
        where: { id },
    })
})
