"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Assistant {
  id: string
  name: string
  description: string
}

interface AssistantSelectorProps {
  categories: Record<string, Assistant[]>
  onSelectAssistant: (id: string) => void
}

export default function AssistantSelector({ categories, onSelectAssistant }: AssistantSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(Object.keys(categories)[0])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Choose Your Assistant</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Select a specialized AI assistant trained for your specific needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {Object.entries(categories).map(([category, assistants]) => (
            <Card
              key={category}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{category}</CardTitle>
                <CardDescription>
                  {assistants.length} available assistant{assistants.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              {expandedCategory === category && (
                <CardContent>
                  <div className="space-y-3">
                    {assistants.map((assistant) => (
                      <div
                        key={assistant.id}
                        className="p-4 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{assistant.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{assistant.description}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectAssistant(assistant.id)
                            }}
                            className="whitespace-nowrap"
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 rounded-lg bg-card border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            💡 Each assistant is fine-tuned for specific use cases. Switch between them anytime from the chat interface.
          </p>
        </div>
      </div>
    </div>
  )
}
