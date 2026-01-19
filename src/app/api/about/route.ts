import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
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

        return NextResponse.json(content)
    } catch (error) {
        console.error("Error fetching about content:", error)
        return NextResponse.json({ error: "Failed to fetch about content" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { greeting, name, introText, focusText } = body

        const existing = await prisma.aboutContent.findFirst()

        if (existing) {
            const updated = await prisma.aboutContent.update({
                where: { id: existing.id },
                data: {
                    greeting: greeting ?? existing.greeting,
                    name: name ?? existing.name,
                    introText: introText ?? existing.introText,
                    focusText: focusText ?? existing.focusText,
                },
            })
            return NextResponse.json(updated)
        }

        const created = await prisma.aboutContent.create({
            data: {
                greeting: greeting ?? "Hi, I'm",
                name: name ?? "Gaza Chansa",
                introText: introText ?? "A Software Engineer...",
                focusText: focusText ?? "Currently focusing on...",
            },
        })

        return NextResponse.json(created)
    } catch (error) {
        console.error("Error updating about content:", error)
        return NextResponse.json({ error: "Failed to update about content" }, { status: 500 })
    }
}
