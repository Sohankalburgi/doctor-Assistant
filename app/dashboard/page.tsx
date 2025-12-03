"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/dashboard/sidebar"
import ChatbotSection from "@/components/dashboard/chatbot-section"
import MedicineAlternatives from "@/components/dashboard/medicine-alternative"
import TranslatorSection from "@/components/dashboard/translator-section"
import PatientRecords from "@/components/dashboard/patient-records"

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("chat")

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex">
            <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">Svasthya Dashboard</h1>
                        <p className="text-muted-foreground">AI-Powered Healthcare Support for Rural Physicians</p>
                    </div>

                    {/* Main Content Area */}
                    <div>
                        {activeTab === "chat" && <ChatbotSection />}
                        {activeTab === "medicines" && <MedicineAlternatives />}
                        {activeTab === "translator" && <TranslatorSection />}
                        {activeTab === "patient-records" && <PatientRecords />}
                    </div>
                </div>
            </div>
        </div>
    )
}
