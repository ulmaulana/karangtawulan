"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Sparkles, MapPin, Ticket, Home, Calendar } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const QUICK_REPLIES = [
  { text: "Rekomendasi paket", icon: Sparkles },
  { text: "Rencana Perjalanan 2 jam", icon: Calendar },
  { text: "Harga tiket", icon: Ticket },
  { text: "Akomodasi terdekat", icon: MapPin },
  { text: "Booking sekarang", icon: Home },
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
      {/* Chat Bubble Button - Clean Design */}
      {!isOpen && (
        <div className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 group">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 pl-4 pr-3 py-3 lg:pl-5 lg:pr-4 lg:py-3.5"
          >
            <span className="font-semibold text-sm lg:text-base whitespace-nowrap">
              Tanya AI
            </span>
            <div className="relative">
              <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
              {/* Online Indicator */}
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
          </button>
          
          {/* Tooltip on Hover (Desktop) */}
          <div className="hidden lg:block absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Butuh bantuan? Chat dengan AI Assistant
              <div className="absolute top-full right-6 -mt-1 w-2 h-2 bg-gray-900 transform rotate-45" />
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 lg:bottom-6 right-2 lg:right-6 w-[calc(100vw-16px)] sm:w-[420px] h-[500px] lg:h-[640px] flex flex-col shadow-2xl z-50 rounded-2xl overflow-hidden border-0">
          {/* Header - Enhanced */}
          <div className="bg-gradient-to-r from-sea-ocean to-sea-teal text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Chat Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <p className="text-xs opacity-90">Online • Asisten Karangtawulan</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sea-ocean to-sea-teal flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-sea-ocean to-sea-teal text-white rounded-br-md"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.role === "assistant"
                      ? formatMessage(message.content)
                      : message.content
                    }
                  </div>
                  <p
                    className={`text-[10px] mt-2 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-gray-400"
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
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sea-ocean to-sea-teal flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies - Enhanced */}
          {messages.length <= 2 && (
            <div className="p-4 bg-white border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-3">Saran pertanyaan:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => {
                  const Icon = reply.icon;
                  return (
                    <button
                      key={reply.text}
                      onClick={() => handleQuickReply(reply.text)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-sea-ocean/10 border border-gray-200 hover:border-sea-ocean/30 rounded-full text-xs font-medium text-gray-700 hover:text-sea-ocean transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {reply.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input - Enhanced */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan..."
                  disabled={isLoading}
                  className="pr-10 h-11 rounded-full border-gray-300 focus:border-sea-ocean focus:ring-sea-ocean"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-sea-ocean to-sea-teal hover:from-sea-teal hover:to-sea-ocean text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
