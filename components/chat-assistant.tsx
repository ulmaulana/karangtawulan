"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const QUICK_REPLIES = [
  "Rekomendasi paket",
  "Itinerary 2 jam",
  "Harga tiket",
  "Akomodasi terdekat",
  "Booking sekarang",
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([
        {
          role: "assistant",
          content:
            "Halo! Saya Asisten Karangtawulan. Ada yang bisa saya bantu? Pilih pertanyaan di bawah atau ketik pertanyaan Anda.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi admin via WhatsApp.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const formatMessage = (content: string) => {
    // Split by double newlines for paragraphs
    const paragraphs = content.split(/\n\n+/);

    return paragraphs.map((paragraph, pIndex) => {
      // Process single paragraph
      let formatted = paragraph;

      // Convert **bold** to <strong>
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

      // Convert *italic* to <em>
      formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

      // Convert WhatsApp numbers to clickable links
      formatted = formatted.replace(
        /(?:nomor |wa |whatsapp )?(\d{10,15})/gi,
        (match, number) => {
          return `<a href="https://wa.me/${number}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-semibold">${number}</a>`;
        }
      );

      // Check if this is a list
      const lines = formatted.split('\n');
      const isList = lines.some(line => line.trim().match(/^[-*•]\s/));

      if (isList) {
        return (
          <ul key={pIndex} className="list-disc list-inside space-y-1 my-2">
            {lines.map((line, lIndex) => {
              const listMatch = line.trim().match(/^[-*•]\s(.+)/);
              if (listMatch) {
                return (
                  <li
                    key={lIndex}
                    dangerouslySetInnerHTML={{ __html: listMatch[1] }}
                    className="ml-2"
                  />
                );
              }
              return null;
            }).filter(Boolean)}
          </ul>
        );
      }

      // Regular paragraph with line breaks
      const withBreaks = formatted.split('\n').map((line, lIndex, arr) => (
        <span key={lIndex}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          {lIndex < arr.length - 1 && <br />}
        </span>
      ));

      return (
        <p key={pIndex} className="mb-2 last:mb-0">
          {withBreaks}
        </p>
      );
    });
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
            Tanya AI
          </span>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Chat Assistant</h3>
                <p className="text-xs opacity-90">Asisten Karangtawulan</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <div className="text-sm">
                    {message.role === "assistant"
                      ? formatMessage(message.content)
                      : message.content
                    }
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="p-3 bg-white border-t flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => (
                <Button
                  key={reply}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleQuickReply(reply)}
                  disabled={isLoading}
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t rounded-b-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
