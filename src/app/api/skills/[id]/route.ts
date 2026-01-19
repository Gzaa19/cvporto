import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const skill = await prisma.skill.findUnique({
            where: { id },
        })

        if (!skill) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 })
        }

        return NextResponse.json(skill)
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

        const existing = await prisma.skill.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 })
        }

        const skill = await prisma.skill.update({
            where: { id },
            data: {
                name: name ?? existing.name,
                category: category ?? existing.category,
                iconName: iconName ?? existing.iconName,
                order: order ?? existing.order,
            },
        })

        return NextResponse.json(skill)
    } catch (error) {
        console.error("Error updating skill:", error)
        return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const existing = await prisma.skill.findUnique({ where: { id } })

        if (!existing) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 })
        }

        await prisma.skill.delete({ where: { id } })

        return NextResponse.json({ message: "Skill deleted successfully" })
    } catch (error) {
        console.error("Error deleting skill:", error)
        return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
    }
}
