import { NextResponse } from "next/server";
import { supervisorAgent } from "@/deep-agent/supervisiorAgent";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log(body);
        const { prompt } = body;
        const result = await supervisorAgent.invoke({
            messages: [new HumanMessage(prompt)]
        });

        // Extract the final message from the agent
        const messages = result.messages || [];
        const finalMessage = messages[messages.length - 1];
        
        const output = finalMessage?.content || "No output generated";

        return NextResponse.json({ 
            status: true, 
            message: output
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { 
                status: false, 
                message: error instanceof Error ? error.message : "An error occurred"
            },
            { status: 500 }
        );
    }
}