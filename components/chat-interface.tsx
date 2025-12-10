"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronUp, Send, Sparkles, X } from "lucide-react"

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
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors text-left group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{getAssistantName()}</span>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-muted-foreground transition-transform ${showModelSelector ? "rotate-180" : ""}`}
            />
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

        {/* Model Selector Modal */}
        {showModelSelector && (
          <>
            {/* Modal Background */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowModelSelector(false)}
            />

            {/* Modal Content */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-96 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
                <h3 className="text-sm font-semibold text-foreground">Select an AI Model</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowModelSelector(false)}
                  className="hover:bg-muted -mr-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content - Categories */}
              <div className="overflow-y-auto flex-1">
                <div className="p-3 space-y-3">
                  {Object.entries(categories).map(([category, assistants]) => (
                    <div key={category}>
                      {/* Category Header */}
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                        className="w-full flex items-center justify-between p-2.5 rounded hover:bg-muted transition-colors text-left"
                      >
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category}
                        </span>
                        <ChevronUp
                          className={`w-3 h-3 text-muted-foreground transition-transform ${
                            expandedCategory === category ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Assistants List */}
                      {expandedCategory === category && (
                        <div className="space-y-1.5 mt-2 ml-2">
                          {assistants.map((assistant) => (
                            <button
                              key={assistant.id}
                              onClick={() => handleSelectAssistant(assistant.id)}
                              className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                                selectedAssistant === assistant.id
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted text-foreground"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                                    selectedAssistant === assistant.id ? "bg-primary-foreground/20" : "bg-muted"
                                  }`}
                                >
                                  {selectedAssistant === assistant.id && "✓"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold leading-tight">{assistant.name}</p>
                                  <p
                                    className={`text-xs leading-tight mt-0.5 ${
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
            </div>
          </>
        )}
      </div>
    </div>
  )
}
