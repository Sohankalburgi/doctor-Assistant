"use client"

import { MessageSquare, Pill, Languages, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface DashboardSidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
    const menuItems = [
        {
            id: "chat",
            label: "Specialist Chat",
            icon: MessageSquare,
            description: "AI-powered medical consultation",
        },
        {
            id: "medicines",
            label: "Medicine Alternatives",
            icon: Pill,
            description: "Find affordable substitutes",
        },
        {
            id: "translator",
            label: "Translator",
            icon: Languages,
            description: "Multi-language support",
        },
    ]

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    useEffect(()=>{
        const user = localStorage.getItem("user");

        if(!user){
            //redirect to login page
            window.location.href = "/login";
        }

        const userObj = JSON.parse(user || "{}");
        setEmail(userObj.email);
        setName(userObj.name);

    },[])

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
    

    return (
        <div className="w-64 border-r border-border/50 bg-card/40 backdrop-blur-sm flex flex-col h-screen sticky top-0">
            {/* Svasthya Logo/Header */}
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-foreground">Svasthya</h2>
                        <p className="text-xs text-muted-foreground">Healthcare Platform</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-primary/10 border border-primary/30 text-primary"
                                    : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon
                                    className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : ""
                                        }`}
                                />
                                <div>
                                    <p className="font-semibold text-sm">{item.label}</p>
                                    <p className="text-xs opacity-60 mt-0.5">{item.description}</p>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-t border-border/50 space-y-2">
                <Card className="p-3 bg-secondary/30 border-border/30">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                            <p className="text-xs text-muted-foreground truncate">{email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs flex items-center justify-center gap-1 bg-transparent"
                        onClick={()=> handleLogout()}
                    >
                        <LogOut className="w-3 h-3" />
                        Logout
                    </Button>
                </Card>
            </div>
        </div>
    )
}
