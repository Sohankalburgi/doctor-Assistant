import { tool } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import { z } from "zod";

export const internetSearch = tool(
    async ({
        query,
        maxResults = 5,
        topic = "health",
        includeRawContent = false,
    }: {
        query: string;
        maxResults?: number;
        topic?: "general" | "news" | "medicine" | "health";
        includeRawContent?: boolean;
    }) => {
        const tavilyTopic = topic === "news" ? "news" : "general";

        const tavilySearch = new TavilySearch({
            maxResults,
            tavilyApiKey: process.env.TAVILY_API_KEY,
            includeRawContent,
            topic: tavilyTopic,
        });
        return await tavilySearch._call({ query });
    },
    {
        name: "internet_search",
        description: "Run a web search",
        schema: z.object({
            query: z.string().describe("The search query"),
            maxResults: z.number().optional().default(5),
            topic: z
                .enum(["general", "news", "medicine", "health"])
                .optional()
                .default("general"),
            includeRawContent: z.boolean().optional().default(false),
        }),
    },
);
