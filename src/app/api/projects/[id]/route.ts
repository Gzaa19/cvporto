import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { serverCache } from "@/lib/cache"

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        const project = await serverCache.getOrFetch(
            `api:project:${id}`,
            () => prisma.project.findUnique({ where: { id } }),
            120,
            ["projects"]
        )

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        return NextResponse.json(project, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            },
        })
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

        // Update directly — Prisma will throw if record not found
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(tags !== undefined && { tags }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(projectUrl !== undefined && { projectUrl }),
                ...(githubUrl !== undefined && { githubUrl }),
                ...(order !== undefined && { order }),
            },
        })

        serverCache.invalidateByTags(["projects"])
        return NextResponse.json(project)
    } catch (error: unknown) {
        // Handle record not found
        if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }
        console.error("Error updating project:", error)
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        await prisma.project.delete({ where: { id } })

        serverCache.invalidateByTags(["projects"])
        return NextResponse.json({ message: "Project deleted successfully" })
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }
        console.error("Error deleting project:", error)
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }
}
