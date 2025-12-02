# Implementation Details: Audio Recording + STT Integration

## Overview
The translator section now includes real-time audio recording with instant transcription and translation using the backend STT API route.

---

## Modified Component: `translator-section.tsx`

### New Imports Added
```typescript
import { useState, useRef, useEffect } from "react"
import { Mic, Square, Loader2, AlertCircle } from "lucide-react"
```

### New State Variables
```typescript
const [isRecording, setIsRecording] = useState(false)              // Recording active state
const [recordingTime, setRecordingTime] = useState(0)             // Elapsed seconds
const [isProcessing, setIsProcessing] = useState(false)           // API processing state
const [recordingStatus, setRecordingStatus] = useState("idle")    // idle|recording|processing|success|error
const [statusMessage, setStatusMessage] = useState("")            // User feedback message
```

### New Refs (for DOM manipulation & timers)
```typescript
const mediaRecorderRef = useRef<MediaRecorder | null>(null)       // MediaRecorder instance
const audioChunksRef = useRef<BlobPart[]>([])                     // Audio data chunks
const streamRef = useRef<MediaStream | null>(null)                // MediaStream from microphone
const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)      // Recording timer interval
```

---

## Core Functions

### 1. Recording Timer Effect
```typescript
useEffect(() => {
  if (isRecording) {
    // Increment timer every 1 second during recording
    timerIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  } else {
    // Clear timer when not recording
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }

  return () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }
}, [isRecording])  // Re-run when isRecording changes
```

### 2. Time Formatter
```typescript
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}
// Example: 5 seconds → "00:05", 125 seconds → "02:05"
```

### 3. Start Recording Function
```typescript
const startRecording = async () => {
  try {
    setRecordingStatus("recording")
    setStatusMessage("Starting recording...")
    audioChunksRef.current = []  // Reset audio chunks

    // Request microphone access (user must allow)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream

    // Create MediaRecorder with the audio stream
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    // Collect audio data as it's recorded
    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data)
    }

    // Handle recording errors
    mediaRecorder.onerror = (error) => {
      setRecordingStatus("error")
      setStatusMessage(`Recording error: ${error.error}`)
      stopRecording()
    }

    // Start recording
    mediaRecorder.start()
    setIsRecording(true)
    setRecordingTime(0)
    setStatusMessage("Recording... Speak now")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to access microphone"
    setRecordingStatus("error")
    setStatusMessage(message)
  }
}
```

### 4. Stop Recording Function
```typescript
const stopRecording = () => {
  if (mediaRecorderRef.current && isRecording) {
    // Stop the MediaRecorder
    mediaRecorderRef.current.stop()
    setIsRecording(false)

    // When recording stops, process the audio
    mediaRecorderRef.current.onstop = async () => {
      try {
        await processAudio()
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to process audio"
        setRecordingStatus("error")
        setStatusMessage(message)
      }
    }

    // Stop all tracks in the microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }
}
```

### 5. Process Audio Function (Main Backend Integration)
```typescript
const processAudio = async () => {
  try {
    setIsProcessing(true)
    setRecordingStatus("processing")
    setStatusMessage("Processing audio... This may take a moment")

    // 1. Create blob from audio chunks
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
    const file = new File(
      [audioBlob],
      `recording-${Date.now()}.webm`,
      { type: "audio/webm" }
    )

    // 2. Validate file size (max 25MB for Groq API)
    const maxSize = 25 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 25MB limit`)
    }

    // 3. Prepare FormData for API request
    const formData = new FormData()
    formData.append("file", file)                          // Audio file
    formData.append("language", sourceLang)                // e.g., "en"
    formData.append("convertLanguage", targetLang)         // e.g., "hi"

    // 4. Send to backend STT API
    const response = await fetch("/api/stt", {
      method: "POST",
      body: formData,  // FormData auto-sets Content-Type: multipart/form-data
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.details || errorData.error || "Transcription failed")
    }

    // 5. Parse response
    const data = await response.json()
    // Response contains:
    // - transcription: "original spoken text"
    // - translatedTranscription: "translated text"
    // - language: source language
    // - convertLanguage: target language

    // 6. Populate text fields with results
    setSourceText(data.transcription)           // Source text field
    setTranslatedText(data.translatedTranscription)  // Translated field
    setRecordingStatus("success")
    setStatusMessage("Transcription successful!")

    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      setRecordingStatus("idle")
      setStatusMessage("")
    }, 3000)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process audio"
    setRecordingStatus("error")
    setStatusMessage(message)
  } finally {
    setIsProcessing(false)
  }
}
```

---

## UI Components

### Recording Status Display
```tsx
<div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg border border-border/50">
  <div className="flex items-center gap-3">
    {isRecording && (
      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
    )}
    <div>
      <p className="text-sm font-semibold text-foreground">
        {isRecording ? "Recording..." : "Ready to record"}
      </p>
      <p className="text-xs text-muted-foreground">
        {isRecording ? `Time: ${formatTime(recordingTime)}` : "Click the button below to start"}
      </p>
    </div>
  </div>
</div>
```

**Renders:**
- When idle: "Ready to record" + "Click the button below to start"
- When recording: "Recording..." + Timer "00:15" + Red pulsing dot

### Status Messages
```tsx
{statusMessage && (
  <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
    recordingStatus === "error" ? "bg-red-500/10 text-red-600 border border-red-500/20" :
    recordingStatus === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" :
    "bg-blue-500/10 text-blue-600 border border-blue-500/20"
  }`}>
    {recordingStatus === "error" && <AlertCircle className="w-4 h-4" />}
    {recordingStatus === "processing" && <Loader2 className="w-4 h-4 animate-spin" />}
    {statusMessage}
  </div>
)}
```

**Color Coding:**
- 🔵 Blue: Recording or Processing
- 🟢 Green: Success
- 🔴 Red: Error

### Recording Button
```tsx
<Button
  onClick={isRecording ? stopRecording : startRecording}
  disabled={isProcessing}
  className={`w-full ${
    isRecording
      ? "bg-red-500 hover:bg-red-600"        // Red when recording
      : "bg-primary hover:bg-primary/90"     // Primary color normally
  }`}
>
  {isRecording ? (
    <>
      <Square className="w-4 h-4 mr-2" />
      Stop Recording
    </>
  ) : (
    <>
      <Mic className="w-4 h-4 mr-2" />
      Start Recording
    </>
  )}
</Button>
```

**States:**
- Idle: "🎤 Start Recording" (Primary color)
- Recording: "⏹️ Stop Recording" (Red)
- Processing: Disabled

---

## API Endpoint Reference

### Request Format
```
POST /api/stt
Content-Type: multipart/form-data

Parameters:
- file: File (required) - WebM audio file
- language: string (optional, default: "en") - Speech language
- convertLanguage: string (optional, default: "en") - Translation target

Example:
POST /api/stt
file: [WebM blob]
language: "en"
convertLanguage: "hi"
```

### Response Format
```typescript
// Success (200 OK)
{
  "success": true,
  "transcription": "Does it hurt when I press here?",
  "translatedTranscription": "क्या यह दर्द होता है जब मैं यहाँ दबाता हूँ?",
  "language": "en",
  "convertLanguage": "hi",
  "fileName": "recording-1702631234567.webm",
  "fileSize": 12345
}

// Error (400 Bad Request / 500 Server Error)
{
  "error": "Failed to process speech-to-text",
  "details": "File size exceeds maximum limit of 25MB"
}
```

---

## Audio Processing Details

### MediaRecorder Setup
```typescript
const mediaRecorder = new MediaRecorder(stream)
// Automatically uses WebM format with Opus codec
// - Quality: Lossless
// - Sample Rate: 48kHz (or system default)
// - Codec: opus
```

### Audio Format Conversion
```
Recorded Audio (WebM) 
    ↓
File object created
    ↓
FormData appended
    ↓
Sent to Backend
    ↓
Backend receives & validates
    ↓
Groq Whisper processes
    ↓
Returns transcription
```

### File Size Estimation
```
Duration    | Typical Size
5 seconds   | 0.5 MB
10 seconds  | 1.0 MB
30 seconds  | 3.0 MB
60 seconds  | 6.0 MB
Max 25MB    | ~150 seconds
```

---

## Error Handling Flow

```
Error Occurs
    ↓
Catch block triggered
    ↓
Extract error message
    ↓
setRecordingStatus("error")
    ↓
setStatusMessage(message)
    ↓
Display red error box with message
    ↓
User can retry by clicking "Start Recording" again
```

### Common Error Messages

| Message | Cause | User Action |
|---------|-------|-------------|
| "Failed to access microphone" | Browser permission denied | Allow in browser settings |
| "Recording error: ..." | Microphone disconnected | Reconnect microphone |
| "File size exceeds 25MB limit" | Recording too long | Record shorter audio |
| "Transcription failed" | Groq API error | Retry or check internet |
| "Network error" | Server unreachable | Check internet connection |

---

## State Management Flow

```
Initial State:
isRecording: false
recordingStatus: "idle"
statusMessage: ""

User clicks "Start Recording":
→ isRecording: true
→ recordingStatus: "recording"
→ statusMessage: "Recording... Speak now"

User clicks "Stop Recording":
→ isRecording: false
→ recordingStatus: "processing"
→ statusMessage: "Processing audio..."

API Response (Success):
→ recordingStatus: "success"
→ statusMessage: "Transcription successful!"
→ sourceText: [transcription]
→ translatedText: [translation]
→ Auto-reset after 3 seconds to "idle"

API Response (Error):
→ recordingStatus: "error"
→ statusMessage: [error message]
→ User must retry
```

---

## Performance Optimization

### Lazy Processing
- Audio chunks are only combined when recording stops
- File is only sent to API after validation
- API call happens asynchronously, doesn't block UI

### Memory Management
- `audioChunksRef.current = []` resets on each new recording
- Stream tracks are properly stopped
- Timer intervals are cleared

### Network Efficiency
- Single API call (multipart/form-data is efficient)
- No redundant requests
- Proper error handling prevents retries

---

## Security Considerations

1. **Microphone Permission**: Handled by browser - user must explicitly allow
2. **File Validation**: 
   - Size check: < 25MB
   - Type check: Audio files only
3. **API Key**: Stored server-side, not exposed to frontend
4. **Timeout**: 60 seconds to prevent hanging requests

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| MediaRecorder | ✅ 49+ | ✅ 25+ | ✅ 14.1+ | ✅ 79+ |
| getUserMedia | ✅ 53+ | ✅ 36+ | ✅ 11+ | ✅ 79+ |
| FormData | ✅ All | ✅ All | ✅ All | ✅ All |
| Fetch API | ✅ 40+ | ✅ 39+ | ✅ 10.1+ | ✅ 14+ |

---

## Testing Code

```typescript
// Manual test in browser console
const test = async () => {
  const formData = new FormData()
  const audioBlob = new Blob([], { type: "audio/webm" })
  formData.append("file", new File([audioBlob], "test.webm"))
  formData.append("language", "en")
  formData.append("convertLanguage", "hi")
  
  const response = await fetch("/api/stt", {
    method: "POST",
    body: formData
  })
  console.log(await response.json())
}

// test()
```

---

## Deployment Checklist

- [ ] Verify Groq API key is in `.env.local`
- [ ] Translation service is running
- [ ] STT API route is accessible
- [ ] CORS is properly configured (if needed)
- [ ] Max duration is set (60 seconds in route.ts)
- [ ] Error logging is configured
- [ ] Rate limiting is considered (if needed)
- [ ] Test with actual audio recording
- [ ] Test error scenarios (no mic, large file)
- [ ] Test with different languages
- [ ] Test translation quality

---

## Debugging Tips

1. **Check browser console** for JavaScript errors
2. **Check network tab** to see API requests/responses
3. **Use Chrome DevTools** to monitor MediaRecorder state
4. **Log state changes** with `console.log(recordingStatus)`
5. **Test microphone** separately with online recording tools
6. **Verify API response** with Postman or curl

Example curl test:
```bash
curl -X POST http://localhost:3000/api/stt \
  -F "file=@recording.webm" \
  -F "language=en" \
  -F "convertLanguage=hi"
```

---

## Future Enhancements

1. **Audio Playback**: Play back recorded audio before sending
2. **Recording History**: Save past recordings and transcriptions
3. **Batch Processing**: Handle multiple files at once
4. **Real-time Streaming**: Use WebSocket for live transcription
5. **Custom Dictionary**: Medical terminology customization
6. **Audio Download**: Save recordings as file
7. **Confidence Score**: Show transcription confidence
8. **Alternative Transcriptions**: Show multiple possible interpretations
