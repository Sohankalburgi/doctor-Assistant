import { medicineAgent } from "@/app/substitute-medicine/medicine";
import { HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        const result = await medicineAgent.invoke({
            messages: [new HumanMessage(prompt)]
        });

        // Extract the final message from the agent
        const messages = result.messages || [];
        const finalMessage = messages[messages.length - 1];
        
        const output = finalMessage?.content || "No output generated";

        return NextResponse.json({ 
            success: true, 
            message: output
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : "An error occurred"
            },
            { status: 500 }
        );
    }
}