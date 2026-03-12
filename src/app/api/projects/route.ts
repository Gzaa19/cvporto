import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { serverCache } from "@/lib/cache"

export async function GET() {
    try {
        const projects = await serverCache.getOrFetch(
            "api:projects",
            () => prisma.project.findMany({
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
            }),
            120,
            ["projects"]
        )

        return NextResponse.json(projects, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            },
        })
    } catch (error) {
        console.error("Error fetching projects:", error)
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, description, tags, subtitle, imageUrl, projectUrl, githubUrl, order } = body

        if (!title || !description || !tags) {
            return NextResponse.json(
                { error: "Title, description, and tags are required" },
                { status: 400 }
            )
        }

        const project = await prisma.project.create({
            data: {
                title,
                subtitle: subtitle || "",
                description,
                tags,
                imageUrl: imageUrl || null,
                projectUrl: projectUrl || null,
                githubUrl: githubUrl || null,
                order: order ?? 0,
            },
        })

        serverCache.invalidateByTags(["projects"])
        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}
