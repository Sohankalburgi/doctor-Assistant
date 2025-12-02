import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Medical terminology glossary for context
const MEDICAL_CONTEXT = `Medical terminology context: Include accurate transcription of medical terms including medications, procedures, diagnoses, anatomical terms, and symptoms.`;

export async function stt(file: File, language: string): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const transcription = await groq.audio.transcriptions.create({
            file: new File([buffer], file.name, { type: file.type }),
            model: "whisper-large-v3",
            temperature: 0.0, // Lower temperature for more deterministic output
            language: language,
            response_format: "verbose_json",
            prompt: MEDICAL_CONTEXT, // Add medical context
        });

        return transcription.text;
    } catch (error) {
        console.error("STT Error:", error);
        throw new Error(`Speech-to-text conversion failed: ${error}`);
    }
}

// Post-process STT output to fix common medical term errors
export async function medicalSTT(file: File, language: string): Promise<string> {
    const rawTranscription = await stt(file, language);

    // Use LLM to refine medical terminology
    const refinedText = await refineMedicalTranscription(rawTranscription, language);

    return refinedText;
}

async function refineMedicalTranscription(
    text: string,
    language: string
): Promise<string> {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            messages: [
                {
                    role: "system",
                    content: `You are a medical transcription specialist. Your task is to correct any errors in medical terminology, drug names, anatomical terms, and procedures while preserving the exact meaning and context. Only fix obvious errors in medical terms - do not change the overall content or add information.`,
                },
                {
                    role: "user",
                    content: `Language: ${language}\n\nRefine this medical transcription, correcting only medical terminology errors:\n\n${text}`,
                },
            ],
        });

        return response.choices[0].message.content || text;
    } catch (error) {
        console.error("Refinement error:", error);
        return text; // Return original if refinement fails
    }
}

// Enhanced translation for medical content
export async function translateMedicalText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
): Promise<string> {
    try {
        const message = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.1, // Lower temperature for consistency
            max_tokens: 2048,
            messages: [
                {
                    role: "system",
                    content: `You are a professional medical translator with expertise in medical terminology across multiple languages. Ensure accurate translation of:
- Medication names (use generic names when applicable)
- Anatomical terms
- Medical procedures
- Diagnoses and symptoms
- Dosages and measurements
Maintain clinical accuracy and clarity.`,
                },
                {
                    role: "user",
                    content: `Translate the following medical text to ${targetLanguage}${sourceLanguage ? ` from ${sourceLanguage}` : ''}. Provide only the translated text without explanations.

Text: "${text}"`,
                },
            ],
        });

        return message.choices[0].message.content || "";
    } catch (error) {
        console.error("Translation error:", error);
        throw new Error(`Failed to translate medical text to ${targetLanguage}`);
    }
}

// Language code mapping with medical language support
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
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    th: "Thai",
    vi: "Vietnamese",
};

export async function translateMedicalWithLanguageCode(
    text: string,
    targetCode: string,
    sourceCode?: string
): Promise<string> {
    const targetLanguage = languageMap[targetCode] || targetCode;
    const sourceLanguage = sourceCode ? languageMap[sourceCode] : undefined;

    return translateMedicalText(text, targetLanguage, sourceLanguage);
}

// Validate medical transcription with confidence scoring
export async function validateMedicalTranscription(
    transcription: string,
    language: string
): Promise<{ text: string; warnings: string[] }> {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a medical quality assurance specialist. Review the transcription and identify potential errors or ambiguities in medical terms. Return a JSON object with: { "validated_text": "corrected text", "warnings": ["list of potential issues"] }`,
                },
                {
                    role: "user",
                    content: `Language: ${language}\n\nValidate this medical transcription:\n\n${transcription}`,
                },
            ],
        });

        const result = JSON.parse(response.choices[0].message.content || "{}");
        return {
            text: result.validated_text || transcription,
            warnings: result.warnings || [],
        };
    } catch (error) {
        console.error("Validation error:", error);
        return { text: transcription, warnings: ["Validation unavailable"] };
    }
}

export default stt;
