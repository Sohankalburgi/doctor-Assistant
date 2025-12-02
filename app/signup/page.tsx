"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Heart, ArrowLeft } from "lucide-react"

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        certificateId: "",
        location: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        // Validate required fields
        if (!formData.certificateId || !formData.location) {
            setError("Please enter your certificate ID and location")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                    certificateId: formData.certificateId,
                    location: formData.location,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || "Signup failed")
            } else {
                const data = await response.json()
                // Signup successful - redirect to dashboard or login
                router.push("/login")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-8">

                {/* Header */}
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                    </div>
                    <span className="font-bold text-lg text-foreground">Svasthya</span>
                </Link>

                <Card className="p-8 border-border">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                            <p className="text-muted-foreground text-sm">
                                Join the Svasthya community of healthcare providers transforming rural medicine.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Full Name</label>
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="Dr. Raj Kumar"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Email Address</label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="you@hospital.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Location / City</label>
                                <Input
                                    name="location"
                                    type="text"
                                    placeholder="Your city or region"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Certificate ID</label>
                                <Input
                                    name="certificateId"
                                    type="text"
                                    placeholder="Enter your medical certificate ID"
                                    value={formData.certificateId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Password</label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Confirm Password</label>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </div>
        </main>
    )
}
