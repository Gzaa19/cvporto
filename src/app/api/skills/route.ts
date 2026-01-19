import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: "asc" },
        })
        return NextResponse.json(skills)
    } catch (error) {
        console.error("Error fetching skills:", error)
        return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, category, iconName, order } = body

        if (!name || !category || !iconName) {
            return NextResponse.json(
                { error: "Name, category, and iconName are required" },
                { status: 400 }
            )
        }

        const skill = await prisma.skill.create({
            data: {
                name,
                category,
                iconName,
                order: order ?? 0,
            },
        })

        return NextResponse.json(skill, { status: 201 })
    } catch (error) {
        console.error("Error creating skill:", error)
        return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
    }
}
