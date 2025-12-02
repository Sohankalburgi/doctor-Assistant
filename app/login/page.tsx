"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Heart, ArrowLeft } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || "Login failed")
            } else {
                const data = await response.json()
                // Store user data and redirect to dashboard
                localStorage.setItem("user", JSON.stringify(data.user))
                router.push("/dashboard")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                    </div>
                    <span className="font-bold text-lg text-foreground">Svasthya</span>
                </Link>

                {/* Login Card */}
                <Card className="p-8 border-border">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
                            <p className="text-muted-foreground">
                                Sign in to access your Svasthya dashboard and continue supporting your patients.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@hospital.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-muted/50 border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="bg-muted/50 border-border"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground text-center">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-primary hover:underline font-medium">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </div>
        </main>
    )
}
