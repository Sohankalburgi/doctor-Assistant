"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from "lucide-react"

interface Message {
    id: string
    text: string
    sender: "user" | "specialist"
    timestamp: Date
}

export default function ChatbotSection() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I am your AI Specialist Assistant. I can help you with medical consultations, diagnoses, and treatment recommendations. How can I assist you today?",
            sender: "specialist",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setLoading(true)

        // Simulate specialist response
        setTimeout(() => {
            const specialistMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Based on your description, I recommend considering the following differential diagnoses and treatment options. Please provide more clinical details for a more accurate assessment.",
                sender: "specialist",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, specialistMessage])
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col border-border/50 backdrop-blur-sm bg-card/80">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle>AI Specialist Consultation</CardTitle>
                        <CardDescription>Get expert medical guidance powered by AI</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-4">
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg animate-in fade-in-50 slide-in-from-bottom-2 ${msg.sender === "user"
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-secondary text-foreground rounded-bl-none border border-border"
                                                }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                            <span className="text-xs opacity-70 mt-1 block">
                                                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-secondary text-foreground px-4 py-3 rounded-lg rounded-bl-none border border-border">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <div className="border-t border-border/50 p-4 bg-card/50">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                placeholder="Describe patient symptoms or ask for guidance..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={loading}
                                className="flex-1 bg-input border-border"
                            />
                            <Button
                                type="submit"
                                disabled={loading || !inputValue.trim()}
                                size="icon"
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>

            {/* Quick Tips */}
            <div className="lg:col-span-1">
                <Card className="border-border/50 backdrop-blur-sm bg-card/80 sticky top-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-sm space-y-2">
                            <p className="font-semibold text-primary">For better guidance:</p>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Provide patient age & gender</li>
                                <li>Mention relevant symptoms</li>
                                <li>Include vital signs</li>
                                <li>Describe medication history</li>
                                <li>Note any allergies</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
