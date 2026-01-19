import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: "asc" },
        })
        return NextResponse.json(projects)
    } catch (error) {
        console.error("Error fetching projects:", error)
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, description, tags, imageUrl, projectUrl, githubUrl, order } = body

        if (!title || !description || !tags) {
            return NextResponse.json(
                { error: "Title, description, and tags are required" },
                { status: 400 }
            )
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                tags,
                imageUrl: imageUrl || null,
                projectUrl: projectUrl || null,
                githubUrl: githubUrl || null,
                order: order ?? 0,
            },
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}
