import { cache } from "react"
import prisma from "@/lib/prisma"
import { serverCache } from "@/lib/cache"

export const getAboutContent = cache(async () => {
    return serverCache.getOrFetch(
        "queries:about",
        async () => {
            let content = await prisma.aboutContent.findFirst({
                select: {
                    id: true,
                    greeting: true,
                    name: true,
                    introText: true,
                    focusText: true,
                },
            })

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
        },
        300,
        ["about-content"]
    )
})

export const getHeroStatus = cache(async () => {
    return serverCache.getOrFetch(
        "queries:hero",
        async () => {
            let status = await prisma.heroStatus.findFirst({
                select: {
                    id: true,
                    location: true,
                    currentRole: true,
                    status: true,
                    subtitle: true,
                },
            })

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
        },
        300,
        ["hero-status"]
    )
})

export const getSkills = cache(async () => {
    return serverCache.getOrFetch(
        "queries:skills",
        async () => {
            return await prisma.skill.findMany({
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    iconName: true,
                    order: true,
                },
            })
        },
        120,
        ["skills"]
    )
})

export const getSkill = cache(async (id: string) => {
    return serverCache.getOrFetch(
        `queries:skill:${id}`,
        async () => {
            return await prisma.skill.findUnique({
                where: { id },
            })
        },
        120,
        ["skills"]
    )
})

export const getProjects = cache(async () => {
    return serverCache.getOrFetch(
        "queries:projects",
        async () => {
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
            })
        },
        120,
        ["projects"]
    )
})

export const getProject = cache(async (id: string) => {
    return serverCache.getOrFetch(
        `queries:project:${id}`,
        async () => {
            return await prisma.project.findUnique({
                where: { id },
            })
        },
        120,
        ["projects"]
    )
})

export const getExperiences = cache(async () => {
    return serverCache.getOrFetch(
        "queries:experiences",
        async () => {
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
            })
        },
        120,
        ["experiences"]
    )
})
