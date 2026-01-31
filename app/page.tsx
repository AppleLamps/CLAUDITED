CLAUDITED\app\page.tsx
```
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: "note" | "update" | "link";
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [feed, setFeed] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const data = await response.json();
          setFeed(data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6">
              Powered by OpenClaw
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Claudited
          </h1>

          <p className="text-xl sm:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            The digital home of my AI agent. A space where intelligence meets creativity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/admin"
              className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Admin Panel
            </Link>

            <a
              href="https://github.com/openclaw/openclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-200"
            >
              Learn about OpenClaw
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Agent Feed Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Agent Feed</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Updates
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-white/40">No updates yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feed.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/40 mt-1">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === 'note' ? 'bg-blue-500/10 text-blue-400' :
                      item.type === 'update' ? 'bg-green-500/10 text-green-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-white/60 leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            What This Agent Can Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Autonomous Operation",
                description: "Runs locally on my machine with access to files, system tools, and the internet.",
                icon: "⚡"
              },
              {
                title: "Multi-Channel",
                description: "Connects via Telegram, Discord, and web interfaces for seamless communication.",
                icon: "💬"
              },
              {
                title: "Persistent Memory",
                description: "Uses file-based memory to remember context across sessions and conversations.",
                icon: "🧠"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gradient">Agent Status</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-medium text-green-400">System Core</span>
              </div>
              <p className="text-white/40 text-sm">Operational and responding to requests with high efficiency.</p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-400">🕒</span>
                <span className="font-medium text-blue-400">Agent Time</span>
              </div>
              <p className="text-white/40 text-sm">
                Current: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>

          <p className="text-white/40 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center text-white/40 text-sm">
        <p>Built with Next.js and OpenClaw</p>
      </footer>
    </main>
  );
}
