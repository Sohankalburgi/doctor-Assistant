# Speech-to-Text (STT) Integration Guide

## Overview
The Speech-to-Text (STT) feature has been successfully integrated into the backend using the Groq Whisper API. This guide explains the implementation and how to use it.

## Files Created/Modified

### 1. **Backend Implementation**

#### `/app/api/stt/route.ts` - API Endpoint
- **Method**: POST
- **Endpoint**: `/api/stt`
- **Features**:
  - Accepts audio file uploads via FormData
  - Validates file type and size (max 25MB)
  - Supports multiple audio formats (MP3, WAV, OGG, FLAC, M4A, MP4, WEBM)
  - Returns transcription text in JSON format
  - Includes error handling and detailed error messages
  - Health check via GET request

#### `/speech-to-text/stt.ts` - Core STT Logic
- Improved version of the original STT module
- Properly handles File objects from the browser
- Converts File to Buffer for Groq API
- Error handling with meaningful messages
- Supports Kannada language transcription
- Exports as a reusable function

### 2. **Client-Side Utility**

#### `/lib/stt-client.ts` - Client Utility Functions
- `uploadAudioForTranscription(file: File)` - Upload audio file
- `recordAndTranscribe()` - Record and transcribe in real-time
- `getSupportedAudioFormats()` - Get list of supported formats
- TypeScript interfaces for type safety
- Error handling with meaningful messages

## Installation

The Groq SDK has been installed:
```bash
npm install groq-sdk
```

## Configuration

### Environment Variables
Add the following to your `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from: https://console.groq.com/keys

## API Usage

### Upload Audio File (POST)

**Request:**
```typescript
const formData = new FormData();
formData.append("file", audioFile);

const response = await fetch("/api/stt", {
  method: "POST",
  body: formData,
});

const data = await response.json();
```

**Successful Response (200):**
```json
{
  "success": true,
  "transcription": "नमस्ते, डॉक्टर",
  "fileName": "audio.m4a",
  "fileSize": 524288
}
```

**Error Response (400/500):**
```json
{
  "error": "Failed to process speech-to-text",
  "details": "Error message"
}
```

### Health Check (GET)

**Request:**
```bash
GET /api/stt
```

**Response:**
```json
{
  "status": "ok",
  "message": "Speech-to-text API is running",
  "supportedFormats": [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/flac",
    "audio/m4a",
    "audio/mp4",
    "audio/webm"
  ]
}
```

## Client-Side Integration

### Using the Client Utility

```typescript
import { uploadAudioForTranscription, recordAndTranscribe } from "@/lib/stt-client";

// Method 1: Upload existing audio file
const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
try {
  const result = await uploadAudioForTranscription(audioFile);
  console.log("Transcription:", result.transcription);
} catch (error) {
  console.error("Upload failed:", error);
}

// Method 2: Record and transcribe
try {
  const result = await recordAndTranscribe();
  console.log("Transcription:", result.transcription);
} catch (error) {
  console.error("Recording failed:", error);
}
```

### Integration in React Components

```typescript
"use client";

import { useState } from "react";
import { uploadAudioForTranscription } from "@/lib/stt-client";

export function STTComponent() {
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const result = await uploadAudioForTranscription(file);
      setTranscription(result.transcription);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />
      {loading && <p>Transcribing...</p>}
      {transcription && <p>Result: {transcription}</p>}
    </div>
  );
}
```

## Features

✅ **Multiple Audio Format Support**
- MP3, WAV, OGG, FLAC, M4A, MP4, WEBM

✅ **Language Support**
- Configured for Kannada (kn)
- Can be customized for other languages

✅ **Error Handling**
- File validation
- Size limit enforcement (25MB)
- Type checking
- Detailed error messages

✅ **Real-time Recording**
- Browser-based audio recording
- Automatic transcription

✅ **Type Safety**
- Full TypeScript support
- Type-safe interfaces

## Limitations

- Maximum file size: 25MB (Groq API limit)
- Supported audio formats as listed above
- Language: Currently configured for Kannada

## Customization

### Change Language
To support other languages, modify `/speech-to-text/stt.ts`:

```typescript
const transcription = await groq.audio.transcriptions.create({
  file: new File([buffer], file.name, { type: file.type }),
  model: "whisper-large-v3",
  temperature: 0,
  language: "en", // Change language code
  response_format: "verbose_json",
});
```

### Supported Language Codes
- `en` - English
- `kn` - Kannada
- `hi` - Hindi
- `ta` - Tamil
- And many more...

## Testing

### Test the Health Check
```bash
curl http://localhost:3000/api/stt
```

### Test File Upload
```bash
curl -X POST -F "file=@audio.m4a" http://localhost:3000/api/stt
```

## Troubleshooting

### "No file provided" Error
- Ensure the file is being sent as FormData
- Check that the field name is "file"

### "Invalid file type" Error
- Verify the audio file format is supported
- Check the file's MIME type

### "API Key not found" Error
- Ensure `GROQ_API_KEY` is set in `.env.local`
- Restart the development server after adding the env variable

### File size exceeds limit
- Use audio compression before uploading
- Split long audio files into segments

## Next Steps

1. Add Groq API key to `.env.local`
2. Test the API endpoint
3. Integrate with your frontend components
4. Add error handling and user feedback
5. Consider adding audio format conversion for better compatibility
