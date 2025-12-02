# Audio Recording & Translation Integration Guide

## Overview
The translator section has been enhanced with integrated audio recording functionality that connects directly to the backend STT (Speech-to-Text) API route.

## Components Involved

### Frontend: `translator-section.tsx`
**Location:** `d:\Hackbites\doctor-assistant\components\dashboard\translator-section.tsx`

#### New Features Added:
1. **Audio Recording UI**
   - Start/Stop recording buttons with visual feedback
   - Recording timer display
   - Recording status indicator with pulsing dot animation
   - Real-time status messages (recording, processing, success, error)

2. **Language Selection**
   - Recording Language dropdown (source language for speech)
   - Translate To dropdown (target language for translation)
   - Disabled during active recording

3. **Integration with STT API**
   - Records audio from microphone using Web Audio API (MediaRecorder)
   - Sends audio file to backend `/api/stt` endpoint
   - Receives transcribed and translated text
   - Populates source and translated text fields automatically

4. **Manual Translation Section**
   - Still supports manual text input and translation
   - Copy to clipboard buttons
   - Text-to-speech functionality for translations
   - Common medical phrases for quick selection

#### State Management:
```typescript
- sourceText: string (transcribed text)
- sourceLang: string (recording language)
- targetLang: string (target translation language)
- translatedText: string (translated result)
- isRecording: boolean (recording state)
- recordingTime: number (elapsed seconds)
- isProcessing: boolean (processing state)
- recordingStatus: "idle" | "recording" | "processing" | "success" | "error"
- statusMessage: string (user feedback messages)
```

#### Key Functions:
1. **startRecording()** - Initiates audio capture from microphone
2. **stopRecording()** - Stops recording and triggers processing
3. **processAudio()** - Sends audio to STT API and handles response
4. **formatTime()** - Formats recording time (MM:SS)
5. **handleTranslate()** - Processes manual text translation
6. **handleCopy()** - Copies translated text to clipboard
7. **handlePresetPhrase()** - Uses predefined medical phrases

### Backend: `/api/stt/route.ts`
**Location:** `d:\Hackbites\doctor-assistant\app\api\stt\route.ts`

#### Functionality:
- **POST /api/stt**
  - Accepts multipart form data with audio file
  - Required parameters:
    - `file` (File): Audio file to transcribe
    - `language` (string, default: "en"): Language of speech
    - `convertLanguage` (string, default: "en"): Target translation language

#### Processing Steps:
1. Validates file exists
2. Checks file type (supports: mp3, wav, ogg, flac, m4a, mp4, webm)
3. Validates file size (max 25MB)
4. Calls `stt()` function to transcribe audio using Groq Whisper API
5. Calls `translateWithLanguageCode()` to translate transcription
6. Returns JSON response with:
   - `success`: boolean
   - `transcription`: string (original text)
   - `translatedTranscription`: string (translated text)
   - `language`: source language code
   - `convertLanguage`: target language code
   - `fileName`: name of uploaded file
   - `fileSize`: size of uploaded file

#### Supported Languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)
- Bengali (bn)
- Marathi (mr)

### Dependency Functions

#### Speech-to-Text: `/speech-to-text/stt.ts`
- **Function:** `stt(file: File, language: string): Promise<string>`
- Uses Groq API with Whisper-large-v3 model
- Handles language-specific transcription
- Returns plain text transcription

#### Translation: `/text-translation/tts.ts`
- **Function:** `translateWithLanguageCode(text: string, languageCode: string): Promise<string>`
- Translates transcribed text to target language
- Supports all specified language codes

## User Flow

```
┌─────────────────────────────────────────┐
│  User opens Translator Section          │
└────────────┬────────────────────────────┘
             │
             ├──────────────┬──────────────┐
             │              │              │
         [Audio Path]   [Manual Path] [Phrases]
             │
    ┌────────▼─────────┐
    │ Select Languages │
    │ Recording & Translate │
    └────────┬──────────┘
             │
    ┌────────▼──────────────┐
    │ Click Start Recording │
    │ Allow Microphone      │
    └────────┬──────────────┘
             │
    ┌────────▼──────────────┐
    │ Speak into Microphone │
    │ (Recording Timer)     │
    └────────┬──────────────┘
             │
    ┌────────▼──────────────┐
    │ Click Stop Recording  │
    │ (Processes audio)     │
    └────────┬──────────────┘
             │
    ┌────────▼──────────────────────┐
    │ POST /api/stt                 │
    │ - Sends WebM audio file       │
    │ - Language params             │
    └────────┬──────────────────────┘
             │
    ┌────────▼──────────────────┐
    │ Backend Processing:       │
    │ - Validate file           │
    │ - Groq Whisper STT        │
    │ - Translation API         │
    └────────┬──────────────────┘
             │
    ┌────────▼──────────────────────┐
    │ Response with:                │
    │ - transcription               │
    │ - translatedTranscription     │
    │ - language metadata           │
    └────────┬──────────────────────┘
             │
    ┌────────▼──────────────────────┐
    │ Display Results:              │
    │ - Source text field           │
    │ - Translated text field       │
    │ - Copy/Speak buttons          │
    └──────────────────────────────┘
```

## Error Handling

The component handles the following error scenarios:

1. **Microphone Access Denied**
   - Shows: "Failed to access microphone"
   - Status: Error (red)

2. **Recording Error**
   - Shows: "Recording error: [error.error]"
   - Status: Error (red)

3. **File Size Exceeded**
   - Shows: "File size exceeds 25MB limit"
   - Status: Error (red)

4. **Invalid File Type**
   - Backend rejects with error message
   - Status: Error (red)

5. **Transcription Failed**
   - Shows: Error from API response
   - Status: Error (red)

6. **Network Error**
   - Shows: Network error message
   - Status: Error (red)

All errors display with:
- Red background with transparency
- AlertCircle icon
- Clear error message
- User can retry by starting a new recording

## Status Indicators

1. **Idle** (Initial state)
   - "Ready to record" text
   - No status message
   - Start button enabled

2. **Recording** (During capture)
   - "Recording..." text
   - Recording timer (MM:SS format)
   - Red pulsing dot indicator
   - Stop button enabled
   - Status message: "Recording... Speak now"

3. **Processing** (After recording stops)
   - Status message: "Processing audio... This may take a moment"
   - Blue progress indicator with spinning icon
   - Buttons disabled

4. **Success** (After successful transcription)
   - Status message: "Transcription successful!"
   - Green success indicator
   - Auto-clears after 3 seconds

5. **Error** (If something fails)
   - Red error indicator with AlertCircle icon
   - Error message displayed
   - User can retry

## Code Example: Integration Usage

```typescript
// The translator section is used in the dashboard:
// app/dashboard/page.tsx

import TranslatorSection from "@/components/dashboard/translator-section"

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("translator")
    
    return (
        <div>
            {activeTab === "translator" && <TranslatorSection />}
        </div>
    )
}
```

## API Request/Response Examples

### Request:
```
POST /api/stt
Content-Type: multipart/form-data

file: [WebM audio blob]
language: "en"
convertLanguage: "hi"
```

### Success Response (200):
```json
{
    "success": true,
    "transcription": "Does it hurt when I press here?",
    "translatedTranscription": "क्या यह दर्द होता है जब मैं यहाँ दबाता हूँ?",
    "language": "en",
    "convertLanguage": "hi",
    "fileName": "recording-1702631234567.webm",
    "fileSize": 12345
}
```

### Error Response (400/500):
```json
{
    "error": "Failed to process speech-to-text",
    "details": "File size exceeds maximum limit of 25MB"
}
```

## Browser Compatibility

Required APIs:
- **MediaRecorder API** - Audio recording
- **getUserMedia API** - Microphone access
- **Fetch API** - HTTP requests
- **Web Audio API** - Audio processing

Supported browsers:
- Chrome 49+
- Firefox 25+
- Safari 14.1+
- Edge 79+

## Performance Notes

1. **Audio Recording**: Uses WebM codec (lossless quality)
2. **File Size**: Typically 2-5MB for 30 seconds of speech
3. **Processing Time**: 5-15 seconds depending on audio length and complexity
4. **API Timeout**: 60 seconds (set in route.ts: `export const maxDuration = 60`)

## Testing Checklist

- [ ] Start recording with microphone permission
- [ ] Record for 5+ seconds
- [ ] Stop recording and verify processing
- [ ] Check transcription appears in source text field
- [ ] Check translation appears in translated text field
- [ ] Verify language selection affects transcription
- [ ] Test translation with different target languages
- [ ] Copy transcription to clipboard
- [ ] Copy translation to clipboard
- [ ] Text-to-speech on translation
- [ ] Test error handling (deny microphone, large file, etc.)
- [ ] Test reset/new recording after success
- [ ] Verify manual text translation still works
- [ ] Test common phrases buttons

## Future Enhancements

1. Audio playback of recorded speech
2. Download transcription/translation as file
3. Real-time transcription streaming
4. Multiple recording history
5. Save transcriptions to database
6. Audio file upload support
7. Advanced translation options
8. Custom medical terminology dictionary
