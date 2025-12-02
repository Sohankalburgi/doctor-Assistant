import Groq from "groq-sdk";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function translateText(
    text: string,
    targetLanguage: string
): Promise<string> {
    try {
        const message = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `Translate the following text to ${targetLanguage}. Only provide the translated text with correct meaning without any explanation or extra information.\n\nText to translate: "${text}"`,
                },
            ],
        });

        // Extract the text content from the response
        const translatedText = message.choices[0].message.content || "";

        return translatedText;
    } catch (error) {
        console.error("Translation error:", error);
        throw new Error(`Failed to translate text to ${targetLanguage}`);
    }
}

export async function translateWithLanguageCode(
    text: string,
    languageCode: string
): Promise<string> {
    // Map language codes to language names
    const languageMap: Record<string, string> = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        it: "Italian",
        pt: "Portuguese",
        ru: "Russian",
        ja: "Japanese",
        zh: "Chinese",
        hi: "Hindi",
        ar: "Arabic",
        ko: "Korean",
        nl: "Dutch",
        pl: "Polish",
        tr: "Turkish",
    };

    const targetLanguage = languageMap[languageCode] || languageCode;
    return translateText(text, targetLanguage);
}
