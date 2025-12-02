import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function stt(file: File, language : string): Promise<string> {
    try {
        // Convert File to Buffer for Groq API
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const transcription = await groq.audio.transcriptions.create({
            file: new File([buffer], file.name, { type: file.type }),
            model: "whisper-large-v3",
<<<<<<< HEAD
            temperature: 0.2,
=======
            temperature: 0,
>>>>>>> 3facdbc (sst)
            language: language,
            response_format: "verbose_json",
        });

        return transcription.text;
    } catch (error) {
        console.error("STT Error:", error);
        throw new Error(`Speech-to-text conversion failed: ${error}`);
    }
}

export default stt;
