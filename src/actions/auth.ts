"use server";

import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Please enter both email and password." };
    }

    try {
        const user = await prisma.adminUser.findUnique({
            where: { email },
        });

        // For initial setup: if no user exists and credentials match default, create the admin
        // Default: admin@gaza.com / admin123
        if (!user) {
            const count = await prisma.adminUser.count();
            if (count === 0 && email === "admin@gaza.com" && password === "admin123") {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await prisma.adminUser.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name: "Super Admin",
                    }
                });
                // Login success with new user
                const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                const session = await encrypt({ user: { id: newUser.id, email: newUser.email }, expires });
                (await cookies()).set("session", session, { expires, httpOnly: true });
                redirect("/admin");
            }
            return { error: "Invalid credentials." };
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return { error: "Invalid credentials." };
        }

        // Login success
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({ user: { id: user.id, email: user.email }, expires });

        (await cookies()).set("session", session, { expires, httpOnly: true });

    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error("Login error details:", error);
        return {
            error: process.env.NODE_ENV === "development"
                ? `Login failed: ${(error as Error).message}`
                : "Something went wrong."
        };
    }

    redirect("/admin/dashboard");
}

export async function logoutAction() {
    (await cookies()).set("session", "", { expires: new Date(0) });
    redirect("/login");
}
