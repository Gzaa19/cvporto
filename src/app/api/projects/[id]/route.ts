import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const project = await prisma.project.findUnique({
            where: { id },
        })

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error("Error fetching project:", error)
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()
        const { title, description, tags, imageUrl, projectUrl, githubUrl, order } = body

        const existing = await prisma.project.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                title: title ?? existing.title,
                description: description ?? existing.description,
                tags: tags ?? existing.tags,
                imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
                projectUrl: projectUrl !== undefined ? projectUrl : existing.projectUrl,
                githubUrl: githubUrl !== undefined ? githubUrl : existing.githubUrl,
                order: order ?? existing.order,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("Error updating project:", error)
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const existing = await prisma.project.findUnique({ where: { id } })

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        await prisma.project.delete({ where: { id } })

        return NextResponse.json({ message: "Project deleted successfully" })
    } catch (error) {
        console.error("Error deleting project:", error)
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }
}
