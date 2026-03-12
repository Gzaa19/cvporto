import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { serverCache } from "@/lib/cache"

export async function GET() {
    try {
        const skills = await serverCache.getOrFetch(
            "api:skills",
            () => prisma.skill.findMany({
                orderBy: { order: "asc" },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    iconName: true,
                    order: true,
                },
            }),
            120,
            ["skills"]
        )

        return NextResponse.json(skills, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            },
        })
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

        serverCache.invalidateByTags(["skills"])
        return NextResponse.json(skill, { status: 201 })
    } catch (error) {
        console.error("Error creating skill:", error)
        return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
    }
}
