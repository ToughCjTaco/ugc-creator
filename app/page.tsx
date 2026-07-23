"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ActorSelector from "@/components/ActorSelector";
import PromptGenerator from "@/components/PromptGenerator";
import Documentation from "@/components/Documentation";

type Tab = "actors" | "generator" | "docs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("generator");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "generator"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Prompt Generator
          </button>
          <button
            onClick={() => setActiveTab("actors")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "actors"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Actors
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "docs"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Documentation
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "generator" && <PromptGenerator />}
          {activeTab === "actors" && <ActorSelector />}
          {activeTab === "docs" && <Documentation />}
        </div>
      </div>
    </main>
  );
}
