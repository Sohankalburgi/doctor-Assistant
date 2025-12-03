"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, Calendar, User, Activity } from "lucide-react"
import { handleExportPDFRecords } from "@/lib/export-pdf-record"
import MarkdownRenderer from "@/components/dashboard/react-markdown";
import { redirect } from "next/dist/server/api-utils"


interface Chat {
    id: number
    patientName: string
    patientAge: number
    patientGender: string
    createdAt: string
    chats: Array<{
        text?: string
        role?: string
        content?: string
        sender?: string
        timestamp?: string
    }>
}

export default function PatientRecords() {
    const [records, setRecords] = useState<Chat[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [selectedRecord, setSelectedRecord] = useState<Chat | null>(null)

    useEffect(() => {
        // Fetch patient records from API
        const fetchRecords = async () => {
            try {
                setLoading(true)
                const user = localStorage.getItem("user")
                if (!user) {
                    window.location.href = "/login"
                    return
                }

                const id = JSON.parse(user).id
                const response = await fetch(`/api/getchat?userId=${id}}`)
                const data = await response.json()
                setRecords(data)
            } catch (error) {
                console.error("Failed to fetch patient records:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecords()
    }, [])

    const filteredRecords = records.filter(
        (record) =>
            record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.patientAge.toString().includes(searchTerm),
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                    <p className="text-muted-foreground">Loading patient records...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by patient name or age..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card/60 border-border/50 backdrop-blur-sm"
                />
            </div>

            {/* Records Grid */}
            {filteredRecords.length === 0 ? (
                <Card className="p-8 text-center border-border/30 bg-card/40 backdrop-blur-sm">
                    <Activity className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">No patient records found</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRecords.map((record) => (
                        <Card
                            key={record.id}
                            className="p-5 border-border/30 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                            onClick={() => setSelectedRecord(record)}
                        >
                            <div className="space-y-4">
                                {/* Patient Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-foreground">{record.patientName}</h3>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${record.patientGender === "male"
                                                    ? "bg-blue-500/10 text-blue-700 border-blue-500/30"
                                                    : "bg-pink-500/10 text-pink-700 border-pink-500/30"
                                                    }`}
                                            >
                                                {record.patientGender === "male" ? "M" : "F"}, {record.patientAge}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(record.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Consultation Summary */}
                                <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">Last Consultation</p>
                                    <p className="text-sm text-foreground line-clamp-2">
                                        {record.chats.length > 0
                                            ? record.chats[record.chats.length - 1].text ||
                                            record.chats[record.chats.length - 1].content ||
                                            "No messages"
                                            : "No consultation data"}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-primary/10 rounded-lg p-2 text-center">
                                        <p className="text-xl font-bold text-primary">{record.chats.length}</p>
                                        <p className="text-xs text-muted-foreground">Messages</p>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg p-2 text-center">
                                        <p className="text-xl font-bold text-emerald-600">1</p>
                                        <p className="text-xs text-muted-foreground">Consultation</p>
                                    </div>
                                    <div className="bg-amber-500/10 rounded-lg p-2 text-center">
                                        <p className="text-xl font-bold text-amber-600">{record.patientAge}</p>
                                        <p className="text-xs text-muted-foreground">Age</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                                        onClick={() => setSelectedRecord(record)}
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        View Details
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 bg-transparent"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents opening the sidebar when clicking Export
                                            handleExportPDFRecords(record);
                                        }}
                                    >
                                        <Download className="w-3 h-3 mr-1" />
                                        Export
                                    </Button>

                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detailed View Modal */}
            {selectedRecord && (
                <Card className="p-6 border-border/30 bg-card/60 backdrop-blur-sm">
                    <div className="mb-6">
                        <Button variant="outline" size="sm" onClick={() => setSelectedRecord(null)} className="mb-4">
                            ← Back
                        </Button>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    {selectedRecord.patientName}
                                </h2>
                                <p className="text-muted-foreground mt-1 ml-12">
                                    {selectedRecord.patientAge} years old • {selectedRecord.patientGender}
                                </p>
                            </div>
                            <Badge variant="outline">{formatDate(selectedRecord.createdAt)}</Badge>
                        </div>
                    </div>

                    {/* Consultation Transcript */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Consultation Transcript</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {selectedRecord.chats.map((chat, idx) => {
                                const isUser = chat.sender === "user" || chat.role === "user" || (chat.text && idx % 2 === 1)

                                return (
                                    <div key={idx} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
                                                    ? "bg-primary/20 border border-primary/30 text-foreground"
                                                    : "bg-secondary/50 border border-border/30 text-foreground"
                                                }`}
                                        >
                                            <MarkdownRenderer content={chat.text || chat.content || ""} />

                                            {chat.timestamp && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(chat.timestamp).toLocaleTimeString("en-IN", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
