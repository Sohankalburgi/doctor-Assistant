"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Heart, ArrowLeft, Upload } from "lucide-react"

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
    const [certificateFile, setCertificateFile] = useState<File | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setCertificateFile(e.target.files[0])
            setFormData({
                ...formData,
                certificateId: e.target.files[0].name,
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!formData.certificateId) {
            setError("Please upload your medical certificate")
            return
        }

        setLoading(true)

        try {
            // TODO: Replace with actual API call to your backend
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    certificateId: formData.certificateId,
                    location: formData.location,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.message || "Signup failed")
            } else {
                const data = await response.json()
                // Store token and redirect to dashboard
                localStorage.setItem("token", data.token)
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
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                    </div>
                    <span className="font-bold text-lg text-foreground">Svasthya</span>
                </Link>

                {/* Signup Card */}
                <Card className="p-8 border-border">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h1>
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
                                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Dr. Raj Kumar"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="bg-muted/50 border-border"
                                />
                            </div>

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
                                <label htmlFor="location" className="block text-sm font-medium text-foreground">
                                    Location / City
                                </label>
                                <Input
                                    id="location"
                                    name="location"
                                    type="text"
                                    placeholder="Your city or region"
                                    value={formData.location}
                                    onChange={handleChange}
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

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="bg-muted/50 border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Medical Certificate / License</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        id="certificate"
                                        required
                                    />
                                    <label
                                        htmlFor="certificate"
                                        className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                                    >
                                        <Upload className="w-5 h-5 text-muted-foreground" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-foreground">
                                                {certificateFile ? certificateFile.name : "Click to upload certificate"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">PDF, JPG, or PNG</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground text-center">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    Sign in here
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
