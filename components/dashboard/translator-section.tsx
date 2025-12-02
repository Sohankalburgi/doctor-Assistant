"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Copy, Check } from "lucide-react"

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Translator */}
            <div className="lg:col-span-2 space-y-4">
                <Card className="border-border/50 backdrop-blur-sm bg-card/80">
                    <CardHeader>
                        <CardTitle>Multi-Language Translator</CardTitle>
                        <CardDescription>Break language barriers in rural healthcare</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Language Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">From</label>
                                <Select value={sourceLang} onValueChange={setSourceLang}>
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
                                <label className="text-sm font-semibold text-foreground">To</label>
                                <Select value={targetLang} onValueChange={setTargetLang}>
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
