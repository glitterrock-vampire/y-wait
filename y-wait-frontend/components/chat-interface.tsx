"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Send } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  options?: string[]
}

type ChatInterfaceProps = {
  userName: string
}

export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const [chatFlow, setChatFlow] = useState<{
    stage:
      | "greeting"
      | "purpose"
      | "service"
      | "branch"
      | "date"
      | "time"
      | "confirmation"
      | "completed"
      | "waittime"
      | "alternatives"
    data: Record<string, string>
  }>({
    stage: "greeting",
    data: {},
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initial greeting
  useEffect(() => {
    const initialGreeting = `Hello ${userName}! Welcome to Y-Wait Banking. I'm your virtual assistant and I'll help you with all your banking needs.

I can help you:
1. Schedule a branch appointment
2. Join a virtual queue to minimize wait time
3. Check current branch wait times
4. View your position in active queues
5. Learn about our banking services

How can I assist you today?`

    // Add a small delay to make it feel more natural
    const timer = setTimeout(() => {
      setMessages([
        {
          id: Date.now().toString(),
          content: initialGreeting,
          sender: "bot",
          options: [
            "Schedule appointment",
            "Join virtual queue",
            "Check wait times",
            "View my queue position",
            "Learn about services",
          ],
        },
      ])
    }, 500)

    return () => clearTimeout(timer)
  }, [userName])

  const handleSendMessage = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user" as const,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsWaitingForResponse(true)

    // Process the user's message
    processUserMessage(messageText)
  }

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()

    // Simulate processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now().toString(),
        content: "",
        sender: "bot",
      }

      switch (chatFlow.stage) {
        case "greeting":
          if (
            lowerMessage.includes("schedule") ||
            lowerMessage.includes("appointment") ||
            lowerMessage.includes("book")
          ) {
            botResponse.content = `I'll help you schedule a branch appointment. What type of banking service do you need?`
            botResponse.options = [
              "Account Services",
              "Loan/Mortgage Consultation",
              "Wealth Management",
              "Business Banking",
            ]
            setChatFlow({
              stage: "service",
              data: {},
            })
          } else if (lowerMessage.includes("wait") || lowerMessage.includes("time") || lowerMessage.includes("check")) {
            botResponse.content = `I can help you check current wait times. Which branch location are you interested in?`
            botResponse.options = ["Downtown Branch", "Westside Branch", "Northgate Branch", "Eastside Branch"]
            setChatFlow({
              stage: "waittime",
              data: {},
            })
          } else if (lowerMessage.includes("queue") || lowerMessage.includes("join")) {
            botResponse.content = `I can help you join a virtual queue. What banking service do you need today?`
            botResponse.options = ["Account Services", "Teller Services", "Loan Inquiry", "Card Services"]
            setChatFlow({
              stage: "service",
              data: { purpose: "queue" },
            })
          } else if (
            lowerMessage.includes("position") ||
            lowerMessage.includes("my queue") ||
            lowerMessage.includes("view queue")
          ) {
            setChatFlow({
              stage: "completed",
              data: { purpose: "queue_position" },
            })

            botResponse.content = `You are currently in the following queues:

1. Account Services at Downtown Branch
   Current position: 3 of 12
   Estimated wait time: 12 minutes
   
2. Loan Inquiry at Westside Branch
   Current position: 7 of 15
   Estimated wait time: 25 minutes

Would you like to:
1. Receive SMS notifications for these queues
2. Leave a queue
3. Join another queue`
            botResponse.options = ["Receive SMS notifications", "Leave a queue", "Join another queue"]
          } else if (lowerMessage.includes("learn") || lowerMessage.includes("services")) {
            botResponse.content = `We offer a wide range of banking services including:

• Personal Banking: Checking, savings, credit cards, and personal loans
• Mortgage Services: Home loans, refinancing, and home equity lines
• Wealth Management: Investment advice, retirement planning, and estate planning
• Business Banking: Business accounts, merchant services, and commercial lending

Which service would you like to learn more about?`
            botResponse.options = ["Personal Banking", "Mortgage Services", "Wealth Management", "Business Banking"]
            setChatFlow({
              stage: "completed",
              data: { purpose: "learn" },
            })
          } else {
            botResponse.content = `I'm not sure I understood. As your banking assistant, I can help you schedule appointments, join virtual queues, check wait times, view your queue positions, or learn about our services. What would you like to do?`
            botResponse.options = [
              "Schedule appointment",
              "Join virtual queue",
              "Check wait times",
              "View my queue position",
              "Learn about services",
            ]
          }
          break

        case "service":
          setChatFlow((prev) => ({
            stage: "branch",
            data: { ...prev.data, service: message },
          }))

          if (chatFlow.data.purpose === "queue") {
            botResponse.content = `You've selected ${message}. Which branch would you like to visit?`
          } else {
            botResponse.content = `Great! You've selected ${message}. Which branch location would you prefer for your appointment?`
          }

          botResponse.options = ["Downtown Branch", "Westside Branch", "Northgate Branch", "Eastside Branch"]
          break

        case "branch":
          setChatFlow((prev) => ({
            stage: chatFlow.data.purpose === "queue" ? "confirmation" : "date",
            data: { ...prev.data, branch: message },
          }))

          if (chatFlow.data.purpose === "queue") {
            const estimatedWait = Math.floor(Math.random() * 30) + 10
            botResponse.content = `The current estimated wait time for ${chatFlow.data.service} at ${message} is approximately ${estimatedWait} minutes.

Would you like to join the virtual queue? You'll receive updates about your position and can arrive just before your turn.`
            botResponse.options = ["Join queue", "Schedule for later", "Cancel"]
          } else {
            botResponse.content = `When would you like to schedule your appointment at ${message}?`
            botResponse.options = ["Today", "Tomorrow", "This week", "Next week"]
          }
          break

        case "date":
          setChatFlow((prev) => ({
            stage: "time",
            data: { ...prev.data, date: message },
          }))
          botResponse.content = `What time would you prefer on ${message.toLowerCase()}?`
          botResponse.options = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"]
          break

        case "time":
          setChatFlow((prev) => ({
            stage: "confirmation",
            data: { ...prev.data, time: message },
          }))

          const serviceName = chatFlow.data.service
          const branchName = chatFlow.data.branch
          const date = chatFlow.data.date

          botResponse.content = `Perfect! Let me confirm your appointment details:

Service: ${serviceName}
Branch: ${branchName}
Date: ${date}
Time: ${message}

Would you like to confirm this appointment?`
          botResponse.options = ["Confirm appointment", "Change details", "Cancel"]
          break

        case "confirmation":
          if (chatFlow.data.purpose === "queue") {
            if (lowerMessage.includes("join") || lowerMessage.includes("yes") || lowerMessage === "y") {
              setChatFlow((prev) => ({
                stage: "completed",
                data: prev.data,
              }))

              const queueNumber = Math.floor(1000 + Math.random() * 9000)

              botResponse.content = `You've been added to the virtual queue for ${chatFlow.data.service} at ${chatFlow.data.branch}.

Your queue number is: #${queueNumber}
Current position: 4 of 15
Estimated wait time: 25 minutes

You can track your position in real-time from the dashboard's "Active Queues" tab. I'll also send you notifications as your turn approaches.

Would you like to receive SMS notifications about your position in the queue?`
              botResponse.options = ["Yes, send SMS", "No, just app notifications"]
            } else if (lowerMessage.includes("schedule") || lowerMessage.includes("later")) {
              setChatFlow({
                stage: "date",
                data: chatFlow.data,
              })
              botResponse.content = `Let's schedule an appointment for later. When would you like to come in?`
              botResponse.options = ["Today", "Tomorrow", "This week", "Next week"]
            } else {
              setChatFlow({
                stage: "greeting",
                data: {},
              })
              botResponse.content = `I've cancelled the queue request. Is there anything else I can help you with today?`
              botResponse.options = [
                "Schedule appointment",
                "Join virtual queue",
                "Check wait times",
                "View my queue position",
                "Learn about services",
              ]
            }
          } else {
            if (lowerMessage.includes("confirm") || lowerMessage.includes("yes") || lowerMessage === "y") {
              setChatFlow((prev) => ({
                stage: "completed",
                data: prev.data,
              }))

              const confirmationCode = `BNK-${Math.floor(10000 + Math.random() * 90000)}`

              botResponse.content = `Great! Your appointment for ${chatFlow.data.service} has been confirmed. You'll receive a confirmation email shortly with all the details.

Your confirmation code is: ${confirmationCode}

Please arrive 5 minutes before your scheduled time. Would you like to add this appointment to your calendar?`
              botResponse.options = ["Add to calendar", "No thanks"]
            } else if (lowerMessage.includes("change") || lowerMessage.includes("edit")) {
              setChatFlow((prev) => ({
                stage: "service",
                data: {},
              }))
              botResponse.content = `No problem! Let's start over. What type of banking service do you need?`
              botResponse.options = [
                "Account Services",
                "Loan/Mortgage Consultation",
                "Wealth Management",
                "Business Banking",
              ]
            } else {
              setChatFlow((prev) => ({
                stage: "greeting",
                data: {},
              }))
              botResponse.content = `I've cancelled the appointment process. Is there anything else I can help you with today?`
              botResponse.options = [
                "Schedule appointment",
                "Join virtual queue",
                "Check wait times",
                "View my queue position",
                "Learn about services",
              ]
            }
          }
          break

        case "waittime":
          setChatFlow((prev) => ({
            stage: "completed",
            data: { ...prev.data, branch: message },
          }))

          // Simulate different wait times for different branches
          let waitTime = "15-20 minutes"
          let status = "moderate"

          if (message.includes("Downtown")) {
            waitTime = "15-20 minutes"
            status = "moderate"
          } else if (message.includes("Westside")) {
            waitTime = "30-45 minutes"
            status = "busy"
          } else if (message.includes("Northgate")) {
            waitTime = "5-10 minutes"
            status = "light"
          } else if (message.includes("Eastside")) {
            waitTime = "20-25 minutes"
            status = "moderate"
          }

          botResponse.content = `Current wait time at ${message} is ${waitTime} (${status}).

Would you like to:
1. Join the virtual queue
2. Schedule an appointment for later
3. Find a branch with shorter wait times`
          botResponse.options = ["Join virtual queue", "Schedule appointment", "Find shorter wait"]
          break

        case "completed":
          if (lowerMessage.includes("leave") && lowerMessage.includes("queue")) {
            botResponse.content = `Which queue would you like to leave?

1. Account Services at Downtown Branch
2. Loan Inquiry at Westside Branch`
            botResponse.options = ["Leave Account Services queue", "Leave Loan Inquiry queue", "Cancel"]
          } else if (lowerMessage.includes("leave account") || lowerMessage.includes("1")) {
            botResponse.content = `You have been removed from the Account Services queue at Downtown Branch.

You are still in the Loan Inquiry queue at Westside Branch (position 7).

Is there anything else I can help you with?`
            botResponse.options = ["Join another queue", "Schedule appointment", "Check wait times"]
          } else if (lowerMessage.includes("leave loan") || lowerMessage.includes("2")) {
            botResponse.content = `You have been removed from the Loan Inquiry queue at Westside Branch.

You are still in the Account Services queue at Downtown Branch (position 3).

Is there anything else I can help you with?`
            botResponse.options = ["Join another queue", "Schedule appointment", "Check wait times"]
          } else if (lowerMessage.includes("sms") || lowerMessage.includes("notification")) {
            botResponse.content = `Great! We'll send SMS notifications as your turn approaches for both queues. You'll receive updates when:

1. You move up in the queue
2. You're 5 positions away
3. You're next in line
4. It's your turn

Is there anything else I can help you with?`
            botResponse.options = ["Join another queue", "Leave a queue", "No thanks"]
          } else if (lowerMessage.includes("calendar") || lowerMessage.includes("add")) {
            botResponse.content = `I've sent a calendar invitation to your email. You'll receive it shortly.

Is there anything else I can help you with today?`
          } else if (lowerMessage.includes("queue") || lowerMessage.includes("join")) {
            setChatFlow({
              stage: "service",
              data: { purpose: "queue" },
            })
            botResponse.content = `I'd be happy to help you join a virtual queue. What banking service do you need today?`
            botResponse.options = ["Account Services", "Teller Services", "Loan Inquiry", "Card Services"]
          } else if (lowerMessage.includes("appointment") || lowerMessage.includes("schedule")) {
            setChatFlow({
              stage: "service",
              data: {},
            })
            botResponse.content = `I'd be happy to help you schedule an appointment. What type of banking service do you need?`
            botResponse.options = [
              "Account Services",
              "Loan/Mortgage Consultation",
              "Wealth Management",
              "Business Banking",
            ]
          } else if (
            lowerMessage.includes("personal") ||
            lowerMessage.includes("checking") ||
            lowerMessage.includes("savings")
          ) {
            botResponse.content = `Our Personal Banking services include:

• Checking accounts with no monthly fees
• High-yield savings accounts
• Credit cards with competitive rewards
• Personal loans with flexible terms
• Mobile and online banking

Would you like to join a queue or schedule an appointment to discuss these services?`
            botResponse.options = [
              "Join queue for Personal Banking",
              "Schedule appointment",
              "Learn about other services",
            ]
          } else if (
            lowerMessage.includes("mortgage") ||
            lowerMessage.includes("home") ||
            lowerMessage.includes("loan")
          ) {
            botResponse.content = `Our Mortgage Services include:

• Fixed and adjustable rate mortgages
• First-time homebuyer programs
• Refinancing options
• Home equity lines of credit
• Construction loans

Would you like to schedule a consultation with a mortgage specialist?`
            botResponse.options = [
              "Schedule mortgage consultation",
              "Join queue for loan inquiry",
              "Learn about other services",
            ]
          } else {
            botResponse.content = `Is there anything else I can help you with today?`
            botResponse.options = [
              "Schedule appointment",
              "Join virtual queue",
              "Check wait times",
              "View my queue position",
              "Learn about services",
            ]
          }
          break

        default:
          botResponse.content = `I'm not sure how to respond to that. Can you please clarify?`
          botResponse.options = [
            "Schedule appointment",
            "Check wait times",
            "Join virtual queue",
            "Learn about services",
          ]
      }

      setMessages((prev) => [...prev, botResponse])

      setIsWaitingForResponse(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full ${
                    message.sender === "user" ? "bg-primary" : "bg-slate-200"
                  }`}
                >
                  {message.sender === "user" ? userName[0].toUpperCase() : "Y"}
                </div>
              </Avatar>
              <div
                className={`rounded-lg p-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-900"
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>

                {message.options && message.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                        onClick={() => handleSendMessage(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isWaitingForResponse && (
          <div className="flex justify-start">
            <div className="flex flex-row">
              <Avatar className="h-8 w-8 mr-2">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200">Y</div>
              </Avatar>
              <div className="rounded-lg p-3 bg-slate-200 text-slate-900">
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isWaitingForResponse) {
                handleSendMessage()
              }
            }}
            disabled={isWaitingForResponse}
            className="flex-1"
          />
          <Button onClick={() => handleSendMessage()} disabled={!input.trim() || isWaitingForResponse} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

