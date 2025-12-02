import { tool } from "@langchain/core/tools";
import { cardioAgent, skinAgent } from "./subAgent";
import { z } from "zod";

export const CardioExpertTool = tool(
    async ({ age, gender, symptoms, history }) => {
        const prompt = `
You are receiving patient details.

Age: ${age}
Gender: ${gender}
Symptoms: ${symptoms}
Medical History: ${history ?? "None"}

Diagnose the condition and respond according to instructions.
`.trim();

        const result = await cardioAgent.invoke({
            messages: [{ role: "user", content: prompt }]
        });

        const lastMessage = result.messages.at(-1);
        return lastMessage.text;
    },
    {
        name: "cardio_Agent",
        description: `
Use this agent for diagnosing heart-related conditions.
Provide symptoms, age, gender, and medical history.
 `.trim(),
        schema: z.object({
            age: z.number(),
            gender: z.enum(["male", "female", "other"]),
            symptoms: z.string(),
            history: z.string().optional(),
        }),
    }
);

export const SkinExpertTool = tool(
    async ({ age, gender, symptoms, history }) => {
        const prompt = `
You are receiving patient details.

Age: ${age}
Gender: ${gender}
Symptoms: ${symptoms}
Medical History: ${history ?? "None"}

Diagnose the skin condition and respond according to instructions.
`.trim();

        const result = await skinAgent.invoke({
            messages: [{ role: "user", content: prompt }]
        });

        const lastMessage = result.messages.at(-1);
        return lastMessage.text;
    },
    {
        name: "skin_Agent",
        description: `
Use this agent for diagnosing skin-related conditions.
Provide symptoms, age, gender, and medical history.
 `.trim(),
        schema: z.object({
            age: z.number(),
            gender: z.enum(["male", "female", "other"]),
            symptoms: z.string(),
            history: z.string().optional(),
        }),
    }
);
