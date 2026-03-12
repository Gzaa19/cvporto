import prisma from "@/lib/prisma";
import { serverCache } from "@/lib/cache";

export async function getAboutContentData() {
    return serverCache.getOrFetch(
        "about-content",
        async () => {
            try {
                const content = await prisma.aboutContent.findFirst({
                    select: {
                        greeting: true,
                        name: true,
                        introText: true,
                        focusText: true,
                    },
                });

                if (!content) {
                    return {
                        greeting: "Hi, I'm",
                        name: "Gaza Chansa",
                        introText: "A Software Engineer who loves building modern web applications with cutting-edge technologies.",
                        focusText: "Currently focusing on creating interactions that feel natural and performance that feels instantaneous.",
                    };
                }

                return content;
            } catch (error) {
                console.error("Error fetching about content:", error);
                return {
                    greeting: "Hi, I'm",
                    name: "Gaza Chansa",
                    introText: "A Software Engineer who loves building modern web applications with cutting-edge technologies.",
                    focusText: "Currently focusing on creating interactions that feel natural and performance that feels instantaneous.",
                };
            }
        },
        300, // 5 minutes TTL - rarely changes
        ["about-content"]
    );
}
