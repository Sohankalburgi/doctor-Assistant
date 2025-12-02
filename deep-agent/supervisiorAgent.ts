import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain"
import { CardioExpertTool, SkinExpertTool } from "./Tools";
const SUPERVISOR_PROMPT = `
You are a helpful personal moderately general doctor assistant.
You can diagnose the patient condition based on the symptoms.
if the symptoms show general health issues, please address the diagnosis report by yourself,else
Break down user requests into appropriate tool calls and coordinate the results.
When a request involves multiple actions, use multiple tools in sequence.
the tools exist are expertised in cardiologist and dermatalogist
finally it must report the diagonize disease.
Don't show this statement "It's essential to consult a doctor for a proper diagnosis and treatment plan. They may recommend further testing, such as an endoscopy, to rule out any underlying conditions." instead tell the general doctor about what to take care and how as suggestion.

`.trim();

const llm = new ChatGroq({
    model: "qwen/qwen3-32b",
    apiKey: process.env.GROQ_API_KEY,
    maxRetries: 1,
    maxTokens: 1500,
})

export const supervisorAgent = createAgent({
    model: llm,
    tools: [SkinExpertTool, CardioExpertTool],
    systemPrompt: SUPERVISOR_PROMPT,
});