"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ChevronUp, Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  selectedAssistant: string | null
  messages: Message[]
  onSendMessage: (message: string) => void
  onSelectAssistant: (id: string) => void
  categories: Record<string, Array<{ id: string; name: string; description: string }>>
}

export default function ChatInterface({
  selectedAssistant,
  messages,
  onSendMessage,
  onSelectAssistant,
  categories,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setIsLoading(true)
    onSendMessage(input)
    setInput("")
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectAssistant = (id: string) => {
    onSelectAssistant(id)
    setShowModelSelector(false)
  }

  // Get assistant display name
  const getAssistantName = () => {
    if (!selectedAssistant) return "Select a model"
    for (const assistants of Object.values(categories)) {
      const found = assistants.find((a) => a.id === selectedAssistant)
      if (found) return found.name
    }
    return selectedAssistant
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {selectedAssistant ? "Start your conversation" : "Select an assistant"}
              </h2>
              <p className="text-muted-foreground max-w-sm">
                {selectedAssistant
                  ? "Type a message to get started with your selected AI assistant."
                  : "Choose an LLM model from the selector at the bottom to begin."}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}
                >
                  {message.role === "user" ? "U" : "✨"}
                </div>

                <div
                  className={`max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border border-border text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area & Model Selector */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto w-full px-4 py-4 space-y-3">
          <button
            onClick={() => setShowModelSelector(true)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-left group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{getAssistantName()}</span>
            </div>
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Chat Input */}
          <div className="flex gap-3">
            <Input
              placeholder={selectedAssistant ? "Type your message..." : "Select an assistant first..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || !selectedAssistant}
              className="bg-background border-border placeholder:text-muted-foreground/50"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !selectedAssistant}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Enter to send • Shift+Enter for new line</p>
        </div>

        <Drawer open={showModelSelector} onOpenChange={setShowModelSelector}>
          <DrawerContent className="w-full h-screen">
            <DrawerHeader className="border-b">
              <DrawerTitle>Select an AI Model</DrawerTitle>
            </DrawerHeader>

            {/* Drawer Content - Categories */}
            <div className="overflow-y-auto flex-1 px-4 md:px-8 py-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {Object.entries(categories).map(([category, assistants]) => (
                  <div key={category}>
                    {/* Category Header */}
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                        {category}
                      </span>
                      <ChevronUp
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          expandedCategory === category ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Assistants List */}
                    {expandedCategory === category && (
                      <div className="space-y-2 mt-3 ml-3">
                        {assistants.map((assistant) => (
                          <button
                            key={assistant.id}
                            onClick={() => handleSelectAssistant(assistant.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                              selectedAssistant === assistant.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                                  selectedAssistant === assistant.id ? "bg-primary-foreground/20" : "bg-muted"
                                }`}
                              >
                                {selectedAssistant === assistant.id && "✓"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold leading-tight">{assistant.name}</p>
                                <p
                                  className={`text-sm leading-snug mt-1 ${
                                    selectedAssistant === assistant.id
                                      ? "text-primary-foreground/80"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {assistant.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
