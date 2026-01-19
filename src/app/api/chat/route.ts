import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

interface ChatMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

async function buildRAGContext() {
    const [about, skills, projects, hero] = await Promise.all([
        prisma.aboutContent.findFirst(),
        prisma.skill.findMany({ orderBy: { order: 'asc' } }),
        prisma.project.findMany({ orderBy: { order: 'asc' } }),
        prisma.heroStatus.findFirst()
    ])

    const skillsByCategory = skills.reduce((acc: Record<string, string[]>, skill: { category: string; name: string }) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category].push(skill.name)
        return acc
    }, {})

    const skillsFormatted = (Object.entries(skillsByCategory) as [string, string[]][])
        .map(([cat, names]) => `**${cat}:** ${names.join(", ")}`)
        .join("\n")

    const projectsFormatted = projects.map((p: { title: string; description: string; tags: string; projectUrl: string | null; githubUrl: string | null }, idx: number) => {
        const links: string[] = []
        if (p.projectUrl) links.push(`Live: ${p.projectUrl}`)
        if (p.githubUrl) links.push(`GitHub: ${p.githubUrl}`)
        return `${idx + 1}. **${p.title}**
   - Description: ${p.description}
   - Tech Stack: ${p.tags}
   - Links: ${links.length > 0 ? links.join(" | ") : "N/A"}`
    }).join("\n\n")

    return `
You are an intelligent AI assistant for ${about?.name || "Gaza Chansa"}'s personal portfolio website.
Your role is to answer visitor questions about Gaza, his skills, projects, and experience based ONLY on the provided context below.
Be friendly, professional, and concise. Use markdown formatting.

═══════════════════════════════════════
📋 PROFILE INFORMATION
═══════════════════════════════════════
• **Name:** ${about?.name || "Gaza Chansa"}
• **Greeting:** ${about?.greeting || "Hi, I'm"}
• **Current Role:** ${hero?.currentRole || "Front End Developer"}
• **Availability Status:** ${hero?.status || "Available"}
• **Location:** ${hero?.location || "Indonesia"}
• **Subtitle:** ${hero?.subtitle || "Software Engineer"}

═══════════════════════════════════════
📝 ABOUT ME
═══════════════════════════════════════
${about?.introText || "A Software Engineer who loves building modern web applications with cutting-edge technologies."}

${about?.focusText || "Currently focusing on creating interactions that feel natural and performance that feels instantaneous."}

═══════════════════════════════════════
🛠️ TECHNICAL SKILLS
═══════════════════════════════════════
${skillsFormatted || "Various modern web technologies"}

═══════════════════════════════════════
🚀 PROJECTS
═══════════════════════════════════════
${projectsFormatted || "No projects listed yet."}

═══════════════════════════════════════
📫 CONTACT INFORMATION
═══════════════════════════════════════
• **Email:** gaza0alghozali@gmail.com
• **LinkedIn:** [gazaalghozali](https://www.linkedin.com/in/gazaalghozali/)
• **GitHub:** [Gzaa19](https://github.com/Gzaa19)

═══════════════════════════════════════
📌 INSTRUCTIONS FOR AI
═══════════════════════════════════════
1. Answer questions based ONLY on the context above.
2. If asked about something not in context, politely say you don't have that information and suggest contacting Gaza directly.
3. Highlight strengths in modern web development, interactions, and performance.
4. Be enthusiastic about Gaza's work but stay professional.
5. Do NOT make up facts or information not provided above.
6. Keep responses concise but helpful.
`.trim()
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { messages } = body as { messages: ChatMessage[] }

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { success: false, error: "Messages array is required" },
                { status: 400 }
            )
        }

        const systemPrompt = await buildRAGContext()

        // Filter messages: remove system messages from client, ensure alternation
        // Perplexity requires: system -> user -> assistant -> user -> assistant...
        const filteredMessages = messages
            .filter(m => m.role !== 'system')
            .filter(m => m.content.trim() !== '')

        // If first message is assistant (greeting), skip it
        let conversationMessages = filteredMessages
        if (conversationMessages.length > 0 && conversationMessages[0].role === 'assistant') {
            conversationMessages = conversationMessages.slice(1)
        }

        // Ensure alternating pattern
        const validMessages: ChatMessage[] = []
        let lastRole: string | null = null

        for (const msg of conversationMessages) {
            if (msg.role !== lastRole) {
                validMessages.push(msg)
                lastRole = msg.role
            }
        }

        // If no valid user messages, return early
        if (validMessages.length === 0 || validMessages[0].role !== 'user') {
            return NextResponse.json({
                success: true,
                message: "Please send a message to start the conversation."
            })
        }

        const apiMessages = [
            { role: "system", content: systemPrompt },
            ...validMessages.map(m => ({ role: m.role, content: m.content }))
        ]

        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar-pro",
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 1024,
                stream: false
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Perplexity API Error:", response.status, errorText)
            return NextResponse.json(
                { success: false, error: `API Error: ${response.status}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        const assistantMessage = data.choices?.[0]?.message?.content || "I couldn't generate a response."

        return NextResponse.json({
            success: true,
            message: assistantMessage,
            usage: data.usage || null
        })

    } catch (error) {
        console.error("Chat API Error:", error)
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const context = await buildRAGContext()

        return NextResponse.json({
            success: true,
            message: "Chat API is ready",
            model: "sonar-pro",
            contextPreview: context.substring(0, 500) + "..."
        })
    } catch (error) {
        console.error("Chat API Health Check Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to build context" },
            { status: 500 }
        )
    }
}
