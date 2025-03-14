"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, CreditCard, Landmark, Shield } from "lucide-react"
import LoginForm from "@/components/login-form"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Y-Wait Banking</h1>
          <p className="text-xl text-slate-600">Skip the line, not the service</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Banking without the wait</h2>
            <p className="text-lg text-slate-600">
              Y-Wait Banking transforms your branch experience with accurate wait time predictions, virtual queuing, and
              scheduled appointments for all your financial needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              >
                Learn More
              </Button>
              <Button size="lg" variant="outline">
                See Demo
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <LoginForm />
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Banking Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={<CreditCard className="h-10 w-10 text-blue-500" />}
              title="Account Services"
              description="Open accounts, order cards, or update your information without the wait."
            />
            <ServiceCard
              icon={<Landmark className="h-10 w-10 text-blue-500" />}
              title="Loans & Mortgages"
              description="Schedule consultations for loans, mortgages, and financing options."
            />
            <ServiceCard
              icon={<Shield className="h-10 w-10 text-blue-500" />}
              title="Wealth Management"
              description="Meet with financial advisors to discuss investments and retirement."
            />
            <ServiceCard
              icon={<Building2 className="h-10 w-10 text-blue-500" />}
              title="Business Banking"
              description="Business account services, merchant solutions, and commercial lending."
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              step="1"
              title="Tell us what you need"
              description="Our AI assistant understands your banking needs and places you in the right queue."
            />
            <FeatureCard
              step="2"
              title="Get real-time updates"
              description="Track your position in line and receive accurate wait time predictions."
            />
            <FeatureCard
              step="3"
              title="Skip the wait"
              description="Schedule appointments or use virtual queuing to minimize your time in the branch."
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
        <p className="text-slate-600 text-center">{description}</p>
      </div>
    </Card>
  )
}

function FeatureCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
            {step}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
        <p className="text-slate-600 text-center">{description}</p>
      </div>
    </Card>
  )
}

