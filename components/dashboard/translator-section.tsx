"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Copy, Check, Mic, Square, Loader2, AlertCircle, Download } from "lucide-react"
import { exportTranslation } from "@/lib/pdf-export"

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
]

const SAMPLE_TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        "Does it hurt when I press here?": "Does it hurt when I press here?",
        "Please open your mouth": "Please open your mouth",
        "Take this medicine twice a day": "Take this medicine twice a day",
    },
    hi: {
        "Does it hurt when I press here?": "क्या यह दर्द होता है जब मैं यहाँ दबाता हूँ?",
        "Please open your mouth": "कृपया अपना मुँह खोलें",
        "Take this medicine twice a day": "इस दवा को दिन में दो बार लें",
    },
    ta: {
        "Does it hurt when I press here?": "நான் இங்கே அழுத்தும்போது வலிக்கிறதா?",
        "Please open your mouth": "தயவுசெய்து உங்கள் வாயைத் திறக்கவும்",
        "Take this medicine twice a day": "இந்த மருந்தை நாளுக்கு இரண்டு முறை எடுத்துக் கொள்ளுங்கள்",
    },
}

export default function TranslatorSection() {
    const [sourceText, setSourceText] = useState("")
    const [sourceLang, setSourceLang] = useState("en")
    const [targetLang, setTargetLang] = useState("hi")
    const [translatedText, setTranslatedText] = useState("")
    const [copied, setCopied] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "processing" | "success" | "error">("idle")
    const [statusMessage, setStatusMessage] = useState("")

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<BlobPart[]>([])
    const streamRef = useRef<MediaStream | null>(null)
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Timer effect for recording
    useEffect(() => {
        if (isRecording) {
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1)
            }, 1000)
        } else {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
        }
    }, [isRecording])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const startRecording = async () => {
        try {
            setRecordingStatus("recording")
            setStatusMessage("Starting recording...")
            audioChunksRef.current = []

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream

            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data)
            }

            mediaRecorder.onerror = (error) => {
                setRecordingStatus("error")
                setStatusMessage(`Recording error: ${error.error}`)
                stopRecording()
            }

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

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)

            mediaRecorderRef.current.onstop = async () => {
                try {
                    await processAudio()
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Failed to process audio"
                    setRecordingStatus("error")
                    setStatusMessage(message)
                }
            }

            // Clean up stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }
        }
    }

    const processAudio = async () => {
        try {
            setIsProcessing(true)
            setRecordingStatus("processing")
            setStatusMessage("Processing audio... This may take a moment")

            // Create blob from audio chunks
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
            const file = new File(
                [audioBlob],
                `recording-${Date.now()}.webm`,
                { type: "audio/webm" }
            )

            // Validate file size
            const maxSize = 25 * 1024 * 1024 // 25MB
            if (file.size > maxSize) {
                throw new Error(`File size exceeds 25MB limit`)
            }

            // Send to STT API
            const formData = new FormData()
            formData.append("file", file)
            formData.append("language", sourceLang)
            formData.append("convertLanguage", targetLang)

            const response = await fetch("/api/stt", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.details || errorData.error || "Transcription failed")
            }

            const data = await response.json()

            setSourceText(data.transcription)
            setTranslatedText(data.translatedTranscription)
            setRecordingStatus("success")
            setStatusMessage("Transcription successful!")

            // Reset after 3 seconds
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

    const handleTranslate = () => {
        // Simulate translation
        if (sourceText.trim()) {
            const translated =
                SAMPLE_TRANSLATIONS[targetLang]?.[sourceText] ||
                `[Translated to ${LANGUAGES.find((l) => l.code === targetLang)?.name}]: ${sourceText}`
            setTranslatedText(translated)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(translatedText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePresetPhrase = (phrase: string) => {
        setSourceText(phrase)
        const translated =
            SAMPLE_TRANSLATIONS[targetLang]?.[phrase] ||
            `[Translated to ${LANGUAGES.find((l) => l.code === targetLang)?.name}]: ${phrase}`
        setTranslatedText(translated)
    }

    const handleExportPDF = async () => {
        if (sourceText || translatedText) {
            const sourceLangName = LANGUAGES.find((l) => l.code === sourceLang)?.name || sourceLang
            const targetLangName = LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang
            await exportTranslation(
                sourceText || "(No source text)",
                translatedText || "(No translation)",
                sourceLangName,
                targetLangName,
                `translation-${Date.now()}.pdf`
            )
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audio Recorder Section */}
            <div className="lg:col-span-2 space-y-4">
                <Card className="border-border/50 backdrop-blur-sm bg-card/80">
                    <CardHeader>
                        <CardTitle>Audio Recorder & Translator</CardTitle>
                        <CardDescription>Record speech and get instant transcription with translation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Language Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Recording Language</label>
                                <Select value={sourceLang} onValueChange={setSourceLang} disabled={isRecording}>
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGES.map((lang) => (
                                            <SelectItem key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Translate To</label>
                                <Select value={targetLang} onValueChange={setTargetLang} disabled={isRecording}>
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGES.map((lang) => (
                                            <SelectItem key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Recording Status */}
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

                        {/* Status Message */}
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

                        {/* Recording Button */}
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isProcessing}
                            className={`w-full ${
                                isRecording
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-primary hover:bg-primary/90"
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
                    </CardContent>
                </Card>

                {/* Text Translation Section */}
                <Card className="border-border/50 backdrop-blur-sm bg-card/80">
                    <CardHeader>
                        <CardTitle>Manual Text Translation</CardTitle>
                        <CardDescription>Or type/paste text to translate</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Text Areas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Source Text</label>
                                <Textarea
                                    placeholder="Enter text to translate..."
                                    value={sourceText}
                                    onChange={(e) => setSourceText(e.target.value)}
                                    className="min-h-32 bg-input border-border resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Translated Text</label>
                                <Textarea
                                    placeholder="Translation appears here..."
                                    value={translatedText}
                                    readOnly
                                    className="min-h-32 bg-secondary border-border resize-none"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-between">
                            <Button onClick={handleTranslate} className="flex-1 bg-primary hover:bg-primary/90">
                                Translate
                            </Button>
                            {translatedText && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => window.speechSynthesis.speak(new SpeechSynthesisUtterance(translatedText))}
                                        title="Speak"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={handleCopy}>
                                        {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={handleExportPDF} title="Export as PDF">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Common Medical Phrases */}
            <div>
                <Card className="border-border/50 backdrop-blur-sm bg-card/80 sticky top-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Common Phrases</CardTitle>
                        <CardDescription>Quick medical translations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.keys(SAMPLE_TRANSLATIONS.en).map((phrase) => (
                                <button
                                    key={phrase}
                                    onClick={() => handlePresetPhrase(phrase)}
                                    className="w-full text-left text-sm p-3 rounded-lg bg-secondary hover:bg-secondary/80 border border-border/50 hover:border-accent/50 transition-all text-foreground hover:text-accent"
                                >
                                    {phrase}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}