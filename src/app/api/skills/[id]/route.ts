import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { serverCache } from "@/lib/cache"

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        const skill = await serverCache.getOrFetch(
            `api:skill:${id}`,
            () => prisma.skill.findUnique({ where: { id } }),
            120,
            ["skills"]
        )

        if (!skill) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 })
        }

        return NextResponse.json(skill, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            },
        })
    } catch (error) {
        console.error("Error fetching skill:", error)
        return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, category, iconName, order } = body

        const skill = await prisma.skill.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(category !== undefined && { category }),
                ...(iconName !== undefined && { iconName }),
                ...(order !== undefined && { order }),
            },
        })

        serverCache.invalidateByTags(["skills"])
        return NextResponse.json(skill)
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 })
        }
        console.error("Error updating skill:", error)
        return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        await prisma.skill.delete({ where: { id } })

        serverCache.invalidateByTags(["skills"])
        return NextResponse.json({ message: "Skill deleted successfully" })
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 })
        }
        console.error("Error deleting skill:", error)
        return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
    }
}
