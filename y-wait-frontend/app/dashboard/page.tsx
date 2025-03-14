"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  LogOut,
  Clock,
  Calendar,
  MessageSquare,
  Plus,
  ArrowRight,
  MapPin,
  CreditCard,
  Landmark,
  Shield,
} from "lucide-react"
import ChatInterface from "@/components/chat-interface"

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-2">Y-Wait Banking</h1>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Personal Banking
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600 hidden sm:block">Welcome, {user.name}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4">
        <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="queues">Active Queues</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="chat">Get Help</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Current Branch Wait Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <BranchWaitTime name="Downtown Branch" time="15-20 min" status="low" />
                    <BranchWaitTime name="Westside Branch" time="30-45 min" status="medium" />
                    <BranchWaitTime name="Northgate Branch" time="5-10 min" status="low" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("appointments")}>
                    Schedule an Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AppointmentCard
                      service="Mortgage Consultation"
                      date="Today"
                      time="2:30 PM"
                      branch="Downtown Branch"
                      status="confirmed"
                    />
                    <AppointmentCard
                      service="Account Services"
                      date="Tomorrow"
                      time="10:00 AM"
                      branch="Westside Branch"
                      status="pending"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("appointments")}>
                    View All Appointments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" onClick={() => setActiveTab("chat")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat with Banking Assistant
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("chat")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Book via Chat
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("queues")}>
                      <Clock className="mr-2 h-4 w-4" />
                      View My Queue Positions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-blue-800">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Active Queue Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* First queue position */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Account Services</span>
                      <p className="text-sm text-blue-700">Downtown Branch</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-blue-700">3</span>
                        <span className="text-xs text-blue-600 block">position</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-blue-700">~12 min</span>
                        <span className="text-xs text-blue-600 block">wait time</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-700 border-blue-300"
                        onClick={() => setActiveTab("queues")}
                      >
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Second queue position */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Loan Inquiry</span>
                      <p className="text-sm text-blue-700">Westside Branch</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-blue-700">7</span>
                        <span className="text-xs text-blue-600 block">position</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-blue-700">~25 min</span>
                        <span className="text-xs text-blue-600 block">wait time</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-700 border-blue-300"
                        onClick={() => setActiveTab("queues")}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full text-blue-700" onClick={() => setActiveTab("chat")}>
                  Join Another Queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
                <CardDescription>Banking services you can schedule or join a queue for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ServiceCard
                    icon={<CreditCard className="h-8 w-8 text-blue-500" />}
                    name="Account Services"
                    waitTime="15-20 min"
                    description="Open accounts, order cards, or update your information"
                  />
                  <ServiceCard
                    icon={<Landmark className="h-8 w-8 text-blue-500" />}
                    name="Mortgage Consultation"
                    waitTime="By appointment"
                    description="Discuss home loan options and pre-approvals"
                  />
                  <ServiceCard
                    icon={<Shield className="h-8 w-8 text-blue-500" />}
                    name="Wealth Management"
                    waitTime="By appointment"
                    description="Investment advice and retirement planning"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Active Queues</CardTitle>
                <CardDescription>Track your position in real-time for services you're waiting for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <QueuePositionCard
                    service="Account Services"
                    branch="Downtown Branch"
                    position={3}
                    estimatedTime="12 minutes"
                    joinedAt="10:45 AM"
                  />
                  <QueuePositionCard
                    service="Loan Inquiry"
                    branch="Westside Branch"
                    position={7}
                    estimatedTime="25 minutes"
                    joinedAt="11:20 AM"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Manage Appointments</CardTitle>
                <CardDescription>Schedule new appointments or modify existing ones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Upcoming Appointments</h3>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Appointment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <AppointmentCardDetailed
                      service="Mortgage Consultation"
                      date="Today"
                      time="2:30 PM"
                      branch="Downtown Branch"
                      status="confirmed"
                      address="123 Main St, Anytown"
                      confirmation="APT-12345"
                      advisor="Sarah Johnson"
                    />
                    <AppointmentCardDetailed
                      service="Account Services"
                      date="Tomorrow"
                      time="10:00 AM"
                      branch="Westside Branch"
                      status="pending"
                      address="456 Oak Ave, Anytown"
                      confirmation="APT-67890"
                      advisor="Michael Chen"
                    />
                    <AppointmentCardDetailed
                      service="Wealth Management"
                      date="Next Friday"
                      time="1:00 PM"
                      branch="Downtown Branch"
                      status="confirmed"
                      address="123 Main St, Anytown"
                      confirmation="APT-24680"
                      advisor="Robert Williams"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
                <CardDescription>View your past banking appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <HistoryCard
                    service="Account Opening"
                    date="March 10, 2025"
                    time="11:30 AM"
                    branch="Downtown Branch"
                    waitTime="5 min"
                  />
                  <HistoryCard
                    service="Loan Application"
                    date="February 28, 2025"
                    time="2:45 PM"
                    branch="Westside Branch"
                    waitTime="12 min"
                  />
                  <HistoryCard
                    service="Credit Card Services"
                    date="February 14, 2025"
                    time="10:00 AM"
                    branch="Northgate Branch"
                    waitTime="0 min"
                  />
                  <HistoryCard
                    service="Investment Consultation"
                    date="January 25, 2025"
                    time="3:00 PM"
                    branch="Downtown Branch"
                    waitTime="0 min"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="h-[calc(100vh-220px)]">
              <CardHeader className="pb-0">
                <CardTitle>Chat with Banking Assistant</CardTitle>
                <CardDescription>Get help with appointments, wait times, or banking services</CardDescription>
              </CardHeader>
              <CardContent className="h-full pt-6">
                <ChatInterface userName={user.name} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function BranchWaitTime({ name, time, status }: { name: string; time: string; status: "low" | "medium" | "high" }) {
  const statusColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{name}</span>
      <div className="flex items-center">
        <span className={`text-sm px-2 py-1 rounded ${statusColors[status]}`}>{time}</span>
      </div>
    </div>
  )
}

function AppointmentCard({
  service,
  date,
  time,
  branch,
  status,
}: {
  service: string
  date: string
  time: string
  branch: string
  status: "confirmed" | "pending" | "cancelled"
}) {
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="p-3 border rounded-md">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{service}</h4>
          <div className="text-sm text-slate-500">
            {date} at {time}
          </div>
          <div className="text-sm text-slate-500">{branch}</div>
        </div>
        <Badge className={statusColors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      </div>
    </div>
  )
}

function AppointmentCardDetailed({
  service,
  date,
  time,
  branch,
  status,
  address,
  confirmation,
  advisor,
}: {
  service: string
  date: string
  time: string
  branch: string
  status: "confirmed" | "pending" | "cancelled"
  address: string
  confirmation: string
  advisor: string
}) {
  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h4 className="text-lg font-semibold">{service}</h4>
            <p className="text-slate-500">
              {branch} - {address}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                {date} at {time}
              </div>
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Advisor: {advisor}
              </div>
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Confirmation: {confirmation}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <Badge className={`mb-4 ${statusColors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function HistoryCard({
  service,
  date,
  time,
  branch,
  waitTime,
}: {
  service: string
  date: string
  time: string
  branch: string
  waitTime: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h4 className="text-lg font-semibold">{service}</h4>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                {date} at {time}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                {branch}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-slate-400" />
                Wait time: {waitTime}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <Button variant="outline" size="sm">
              Schedule Similar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QueuePositionCard({
  service,
  branch,
  position,
  estimatedTime,
  joinedAt,
}: {
  service: string
  branch: string
  position: number
  estimatedTime: string
  joinedAt: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h4 className="text-lg font-semibold">{service}</h4>
            <p className="text-slate-500">{branch}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-slate-400" />
                Joined at {joinedAt}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <div className="mb-2 text-center">
              <span className="text-3xl font-bold text-primary">{position}</span>
              <span className="text-sm text-slate-500 block">in queue</span>
            </div>
            <Badge className="mb-2 bg-blue-100 text-blue-800">~{estimatedTime} wait</Badge>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
              Leave Queue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ServiceCard({
  icon,
  name,
  waitTime,
  description,
}: {
  icon: React.ReactNode
  name: string
  waitTime: string
  description: string
}) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-center mb-4">{icon}</div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {waitTime}
          </Badge>
        </div>
        <div className="mt-4">
          <Button size="sm" className="w-full" onClick={() => router.push("/dashboard?tab=chat")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat to Book
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

