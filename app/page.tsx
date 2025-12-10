"use client"

import { useState } from "react"
import ChatInterface from "@/components/chat-interface"

const ASSISTANT_CATEGORIES = {
  "Content Creation & Copywriting": [
    { id: "copy-expert", name: "Copy Expert", description: "Specializes in compelling marketing copy" },
    { id: "blog-writer", name: "Blog Writer", description: "Creates engaging long-form content" },
    { id: "social-media", name: "Social Media Pro", description: "Optimizes content for social platforms" },
  ],
  "Content Repurpose & Extraction": [
    { id: "repurpose-master", name: "Repurpose Master", description: "Transforms content across formats" },
    { id: "summarizer", name: "Smart Summarizer", description: "Extracts key insights efficiently" },
  ],
  "Strategic Planning": [
    { id: "strategist", name: "Strategic Advisor", description: "Develops business strategies" },
    { id: "market-analyst", name: "Market Analyst", description: "Analyzes market trends" },
  ],
  "Business Communication": [
    { id: "email-pro", name: "Email Pro", description: "Crafts professional communications" },
    { id: "presenter", name: "Presentation Expert", description: "Creates compelling presentations" },
  ],
  "Internal Client Tools": [
    { id: "qa-helper", name: "QA Assistant", description: "Quality assurance and testing" },
    { id: "doc-builder", name: "Doc Builder", description: "Generates documentation" },
  ],
}

export default function Home() {
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([])

  const handleSendMessage = (message: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
    }
    setMessages([...messages, userMessage])

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `Response from ${selectedAssistant}. This is a placeholder response. In a real implementation, this would call your API with the selected LLM model.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  const handleSelectAssistant = (assistantId: string) => {
    setSelectedAssistant(assistantId)
  }

  return (
    <main className="h-screen w-screen bg-background">
      <ChatInterface
        selectedAssistant={selectedAssistant}
        messages={messages}
        onSendMessage={handleSendMessage}
        onSelectAssistant={handleSelectAssistant}
        categories={ASSISTANT_CATEGORIES}
      />
    </main>
  )
}
