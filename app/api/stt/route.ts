import { NextRequest, NextResponse } from "next/server";
import { stt } from "@/speech-to-text/stt";
import { translateWithLanguageCode } from "@/text-translation/tts";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        // Get the form data from the request
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const language = formData.get("language") as string || "en";
        const convertLanguage = formData.get("convertLanguage") as string || "en";

        // Validate the file
        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type (audio files)
        const allowedTypes = [
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/ogg",
            "audio/flac",
            "audio/m4a",
            "audio/mp4",
            "audio/webm",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    error: `Invalid file type. Supported types: ${allowedTypes.join(", ")}`
                },
                { status: 400 }
            );
        }

        // Validate file size (max 25MB for Groq)
        const maxSize = 25 * 1024 * 1024; // 25MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File size exceeds maximum limit of 25MB` },
                { status: 400 }
            );
        }

        // Process the audio file with STT
        const transcription = await stt(file, language);

        // Translate the transcription if a different language is requested
        const translatedTranscription = await translateWithLanguageCode(transcription, convertLanguage);

        return NextResponse.json(
            {
                success: true,
                transcription,
                translatedTranscription,
                language,
                convertLanguage,
                fileName: file.name,
                fileSize: file.size,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("STT API Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json(
            {
                error: "Failed to process speech-to-text",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

// Optional: Health check endpoint
export async function GET() {
    return NextResponse.json(
        {
            status: "ok",
            message: "Speech-to-text API is running",
            supportedFormats: [
                "audio/mpeg",
                "audio/mp3",
                "audio/wav",
                "audio/ogg",
                "audio/flac",
                "audio/m4a",
                "audio/mp4",
                "audio/webm",
            ],
        },
        { status: 200 }
    );
}
