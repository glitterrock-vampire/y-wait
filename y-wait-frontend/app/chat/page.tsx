"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import ChatInterface from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function ChatPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

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
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Banking Assistant</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">Logged in as {user.name}</div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-blue-800">
          <h2 className="font-semibold mb-1">Banking Assistant</h2>
          <p className="text-sm">
            Use this chat to schedule appointments, join virtual queues, and check your position in line. All booking is
            done through this assistant.
          </p>
        </div>
        <ChatInterface userName={user.name} />
      </main>
    </div>
  )
}

