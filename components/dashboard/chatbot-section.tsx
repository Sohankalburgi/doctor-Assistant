"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from "lucide-react"
import ChatMarkdown from "./chat-markdown"

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

        try {
            // Call the deep agent API
            const response = await fetch("/api/deepagent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: inputValue,
                }),
            })

            const data = await response.json()

            if (data.status) {
                const specialistMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.message || "Unable to generate a response. Please try again.",
                    sender: "specialist",
                    timestamp: new Date(),
                }
                setMessages((prev) => [...prev, specialistMessage])
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Error: ${data.message || "An error occurred while processing your request."}`,
                    sender: "specialist",
                    timestamp: new Date(),
                }
                setMessages((prev) => [...prev, errorMessage])
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error instanceof Error ? error.message : "Failed to connect to the server."}`,
                sender: "specialist",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            {/* Chat Area */}
            <div className="w-full">
                <Card className="h-[calc(100vh-200px)] flex flex-col border-border/50 backdrop-blur-sm bg-card/80">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle>AI Specialist Consultation</CardTitle>
                        <CardDescription>Get expert medical guidance powered by AI</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-4">
                        <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`${msg.sender === "user" ? "max-w-xs lg:max-w-md bg-primary text-primary-foreground rounded-br-none" : "w-full"}`}>
                                            {msg.sender === "user" ? (
                                                <div className="px-4 py-3 rounded-lg animate-in fade-in-50 slide-in-from-bottom-2">
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                            ) : (
                                                <ChatMarkdown text={msg.text} />
                                            )}
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

        </div>
    )
}
