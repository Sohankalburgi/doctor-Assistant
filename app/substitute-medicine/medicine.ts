import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { z } from "zod";

const llm = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.2,
    maxTokens: 700
});

// TOOL FIXED
const getMedicines = tool(
    async ({ name }) => {
        const url = `https://www.1mg.com/api/v1/search/autocomplete?name=${encodeURIComponent(name)}`;
        const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!response.ok) return "API request failed";

        const { results } = await response.json();

        const medicines = results.slice(0, 5).map((item: any) => ({
            name: item.name,
            price: item.price ?? "N/A",
        }));

        return JSON.stringify(medicines); // MUST BE STRING
    },
    {
        name: "search_medicine_price", // YOUR TOOL NAME
        description: "Fetch price for Indian medicines matching the name",
        schema: z.object({
            name: z.string(),
        }),
    }
);

// FINAL WORKING AGENT
export const medicineAgent = createAgent({
    model: llm,
    tools: [getMedicines],    // ONLY this tool will be registered
    toolChoice: {             // <---- THIS FIXES YOUR ISSUE
        type: "required",
        name: "search_medicine_price"
    },
    systemPrompt: `
You are an Indian medicine expert.
You MUST ONLY use the tool "search_medicine_price" when fetching price.
Do NOT use or call any other tools like brave_search or web search.
Generate the final output ONLY after receiving tool result.

Task:
1. Provide use-case of the requested medicine.
2. Provide 5 alternative Indian medicines with:
   - dosage
   - qty
   - pricing (via tool) with range for example "200-220 INR"
   - rating
   - side effects
3. Return everything in a clean table.
4. The price must be limited to some error range of +20 INR on the Indian medicine Industry
`,
    name: "medicine-alternative-prescriber",
    description: "Prescribes Indian medicine alternatives",
});
