import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serverCache } from "@/lib/cache";

// GET - Fetch hero status
export async function GET() {
    try {
        const status = await serverCache.getOrFetch(
            "api:hero-status",
            async () => {
                let data = await prisma.heroStatus.findFirst();
                if (!data) {
                    data = await prisma.heroStatus.create({
                        data: {
                            location: "INDONESIA",
                            currentRole: "FRONT END",
                            status: "AVAILABLE",
                            subtitle: "SOFTWARE ENGINEER",
                        },
                    });
                }
                return data;
            },
            300,
            ["hero-status"]
        );

        return NextResponse.json(status, {
            headers: {
                "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
            },
        });
    } catch (error) {
        console.error("Error fetching hero status:", error);
        return NextResponse.json({ error: "Failed to fetch hero status" }, { status: 500 });
    }
}

// PUT - Update hero status
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { location, currentRole, status, subtitle } = body;

        const existing = await prisma.heroStatus.findFirst();

        let result;
        if (existing) {
            result = await prisma.heroStatus.update({
                where: { id: existing.id },
                data: {
                    ...(location !== undefined && { location }),
                    ...(currentRole !== undefined && { currentRole }),
                    ...(status !== undefined && { status }),
                    ...(subtitle !== undefined && { subtitle }),
                },
            });
        } else {
            result = await prisma.heroStatus.create({
                data: {
                    location: location ?? "INDONESIA",
                    currentRole: currentRole ?? "FRONT END",
                    status: status ?? "AVAILABLE",
                    subtitle: subtitle ?? "SOFTWARE ENGINEER",
                },
            });
        }

        serverCache.invalidateByTags(["hero-status"]);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating hero status:", error);
        return NextResponse.json({ error: "Failed to update hero status" }, { status: 500 });
    }
}
