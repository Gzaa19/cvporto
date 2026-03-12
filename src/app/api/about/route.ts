import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { serverCache } from "@/lib/cache"

export async function GET() {
    try {
        const content = await serverCache.getOrFetch(
            "api:about",
            async () => {
                let data = await prisma.aboutContent.findFirst()
                if (!data) {
                    data = await prisma.aboutContent.create({
                        data: {
                            greeting: "Hi, I'm",
                            name: "Gaza Chansa",
                            introText: "A Software Engineer who loves building modern web applications with cutting-edge technologies.",
                            focusText: "Currently focusing on creating interactions that feel natural and performance that feels instantaneous.",
                        },
                    })
                }
                return data
            },
            300,
            ["about-content"]
        )

        return NextResponse.json(content, {
            headers: {
                "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
            },
        })
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

        let result
        if (existing) {
            result = await prisma.aboutContent.update({
                where: { id: existing.id },
                data: {
                    ...(greeting !== undefined && { greeting }),
                    ...(name !== undefined && { name }),
                    ...(introText !== undefined && { introText }),
                    ...(focusText !== undefined && { focusText }),
                },
            })
        } else {
            result = await prisma.aboutContent.create({
                data: {
                    greeting: greeting ?? "Hi, I'm",
                    name: name ?? "Gaza Chansa",
                    introText: introText ?? "A Software Engineer...",
                    focusText: focusText ?? "Currently focusing on...",
                },
            })
        }

        serverCache.invalidateByTags(["about-content"])
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error updating about content:", error)
        return NextResponse.json({ error: "Failed to update about content" }, { status: 500 })
    }
}
