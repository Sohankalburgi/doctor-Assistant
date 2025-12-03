import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Heart,
  Pill,
  MessageCircle,
  Users,
  Zap,
  Shield,
  CheckCircle,
  Brain,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen ">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-lg text-foreground">Svasthya</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-muted">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Modern Design */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 
  bg-gradient-to-br from-[#3477a3] via-[#c9d7dd] to-[#B8FFD9]">


        <div className="absolute inset-0 -z-10">
          {/* Your blur effects */}
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/2 via-transparent to-accent/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-full border border-primary/20 backdrop-blur">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground">Trusted by rural healthcare providers</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                  <span className="text-foreground">Healthcare</span>{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Expert medical insights, affordable medications, and multilingual for removing language barrier support—all designed for rural
                  doctors who care.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 flex-wrap pt-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-base h-12 px-8"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/40">
                <div>
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Doctors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">10K+</p>
                  <p className="text-sm text-muted-foreground">Patients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Medications</p>
                </div>
              </div>
            </div>

            {/* Right Visual - Modern Card Stack */}
            <div className="relative hidden lg:block h-96">
              <div className="absolute inset-0 space-y-4">
                {/* Card 1 - Top */}
                <div className="absolute top-0 right-0 w-full max-w-sm bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl border border-primary/20 p-6 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-accent" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">AI Diagnosis Support</h3>
                  <p className="text-sm text-muted-foreground">Get expert-level insights instantly</p>
                </div>

                {/* Card 2 - Middle */}
                <div className="absolute top-36 right-12 w-full max-w-sm bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl border border-accent/20 p-6 shadow-2xl shadow-accent/10 hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Pill className="w-6 h-6 text-primary" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Medicine Database</h3>
                  <p className="text-sm text-muted-foreground">Affordable alternatives at your fingertips</p>
                </div>

                {/* Card 3 - Bottom */}
                <div className="absolute top-72 right-24 w-full max-w-sm bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl border border-primary/20 p-6 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-accent" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Multi-Language</h3>
                  <p className="text-sm text-muted-foreground">Support in your preferred language to break language barrier between patient and doctor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Svasthya's Solution</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforming rural healthcare with intelligent technology and expert support
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">

            {/* LEFT CONTENT */}
            <div className="space-y-6">

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Specialist-Level Insights</h3>
                  <p className="text-muted-foreground">
                    AI-powered clinical decision support system that assists general practitioners with specialist-level
                    medical recommendations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Pill className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Affordable Medications</h3>
                  <p className="text-muted-foreground">
                    Comprehensive database of generic alternatives and cost-effective treatment options for every
                    prescribed medication.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Multilingual Support</h3>
                  <p className="text-muted-foreground">
                    Access information and support in your native language, breaking down communication barriers in
                    rural healthcare.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Secure & Scalable</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade security with scalable infrastructure designed for remote areas with varying
                    connectivity.
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT IMAGE */}
            <div className="flex items-center justify-center">
              <Image
                src="/dashboard.png"
                alt="Svasthya platform illustration"
                width={750}
                height={650}
                className="rounded-2xl shadow-lg object-cover"
              />
            </div>

          </div>
        </div>
      </section>


      {/* Challenges Section with Modern Cards */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">The Problem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">Rural Healthcare Challenges</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Critical gaps in healthcare delivery that impact patient outcomes and doctor capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 rounded-2xl transition-all duration-500" />
              <Card className="relative p-8 border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Specialist Shortage</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rural physicians make critical decisions without expert consultation, compromising care quality and
                  patient outcomes.
                </p>
              </Card>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-primary/0 group-hover:from-accent/10 group-hover:to-primary/10 rounded-2xl transition-all duration-500" />
              <Card className="relative p-8 border-accent/20 bg-card/50 backdrop-blur hover:border-accent/50 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Pill className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Medication Costs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  High dependence on branded medicines makes quality healthcare unaffordable for most rural patients.
                </p>
              </Card>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 rounded-2xl transition-all duration-500" />
              <Card className="relative p-8 border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Language Barriers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Communication challenges in diverse languages prevent access to critical healthcare information.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section with Modern Layout */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-primary/20 mb-6">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Our Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">Svasthya's Intelligent System</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforming rural healthcare with technology, expertise, and accessibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: Brain,
                title: "Specialist-Level Insights",
                desc: "AI-powered clinical decision support that assists doctors with expert recommendations",
              },
              {
                icon: Pill,
                title: "Affordable Medications",
                desc: "Comprehensive database of generic alternatives and cost-effective treatment options",
              },
              {
                icon: MessageCircle,
                title: "Multilingual Support",
                desc: "Access information in your native language, breaking down communication barriers",
              },
              {
                icon: Shield,
                title: "Secure & Scalable",
                desc: "Enterprise-grade security with infrastructure designed for remote areas",
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 rounded-2xl transition-all duration-500 blur" />
                <Card className="relative p-8 border-primary/10 bg-card/80 backdrop-blur hover:border-primary/30 transition-all duration-500 hover:shadow-xl">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            <div className="text-center p-6 rounded-xl border border-border/40 bg-card/30 backdrop-blur hover:border-primary/30 transition-all duration-300">
              <p className="text-3xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground">Support Available</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border/40 bg-card/30 backdrop-blur hover:border-accent/30 transition-all duration-300">
              <p className="text-3xl font-bold text-accent mb-2">7+</p>
              <p className="text-muted-foreground">Languages</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border/40 bg-card/30 backdrop-blur hover:border-primary/30 transition-all duration-300">
              <p className="text-3xl font-bold text-primary mb-2">100%</p>
              <p className="text-muted-foreground">Data Secure</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border/40 bg-card/30 backdrop-blur hover:border-accent/30 transition-all duration-300">
              <p className="text-3xl font-bold text-accent mb-2">2M+</p>
              <p className="text-muted-foreground">Lives Supported</p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Ready to Transform Rural Healthcare?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Join healthcare providers already using Svasthya to deliver better patient care and outcomes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 h-12 px-8 text-base"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-bold text-foreground">Svasthya</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Svasthya. Healthcare for everyone, everywhere.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
