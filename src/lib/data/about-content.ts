import prisma from "@/lib/prisma";

export async function getAboutContentData() {
    try {
        let content = await prisma.aboutContent.findFirst();

        if (!content) {
            return {
                greeting: "Hi, I'm",
                name: "Gaza Chansa",
                introText: "A Software Engineer who loves building modern web applications with cutting-edge technologies.",
                focusText: "Currently focusing on creating interactions that feel natural and performance that feels instantaneous.",
            };
        }

        return {
            greeting: content.greeting,
            name: content.name,
            introText: content.introText,
            focusText: content.focusText,
        };
    } catch (error) {
        console.error("Error fetching about content:", error);
        return {
            greeting: "Hi, I'm",
            name: "Gaza Chansa",
            introText: "A Software Engineer who loves building modern web applications with cutting-edge technologies.",
            focusText: "Currently focusing on creating interactions that feel natural and performance that feels instantaneous.",
        };
    }
}
