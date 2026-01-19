import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch hero status
export async function GET() {
    try {
        let status = await prisma.heroStatus.findFirst();

        if (!status) {
            status = await prisma.heroStatus.create({
                data: {
                    location: "INDONESIA",
                    currentRole: "FRONT END",
                    status: "AVAILABLE",
                    subtitle: "SOFTWARE ENGINEER",
                },
            });
        }

        return NextResponse.json(status);
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

        if (existing) {
            const updated = await prisma.heroStatus.update({
                where: { id: existing.id },
                data: {
                    location: location ?? existing.location,
                    currentRole: currentRole ?? existing.currentRole,
                    status: status ?? existing.status,
                    subtitle: subtitle ?? existing.subtitle,
                },
            });
            return NextResponse.json(updated);
        }

        // Create if not exists
        const created = await prisma.heroStatus.create({
            data: {
                location: location ?? "INDONESIA",
                currentRole: currentRole ?? "FRONT END",
                status: status ?? "AVAILABLE",
                subtitle: subtitle ?? "SOFTWARE ENGINEER",
            },
        });

        return NextResponse.json(created);
    } catch (error) {
        console.error("Error updating hero status:", error);
        return NextResponse.json({ error: "Failed to update hero status" }, { status: 500 });
    }
}
