"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

interface Actor {
  actor_id?: string;
  id?: string;
  name: string;
  age_range?: string;
  age?: string;
  origin?: string;
  ethnicity?: string;
  gender?: string;
  aesthetic?: string;
  appearance?: {
    hairColor: string;
    eyeColor: string;
    skinTone: string;
    distinctiveFeatures: string[];
  };
  eyes?: string;
  skin_tone_hex?: string;
  [key: string]: any;
}

interface GeneratedPrompt {
  layers: {
    characterLock: string;
    scenario: string;
    environment: string;
    camera: string;
    realismAnchors: string;
    negativePrompts: string;
  };
  finalPrompt: string;
  shotType: string;
}

const SHOT_TYPES = [
  { id: "medium-shot", label: "Medium Shot", desc: "Waist up, direct to camera" },
  { id: "close-up", label: "Close-up", desc: "Face and shoulders, intimate" },
  { id: "full-body", label: "Full Body", desc: "Standing, dynamic" },
  { id: "pov", label: "POV", desc: "First-person perspective" },
  { id: "action-shot", label: "Action Shot", desc: "Moving, demonstration" },
  { id: "product-focus", label: "Product Focus", desc: "Hand-held, detail" },
  { id: "lifestyle", label: "Lifestyle", desc: "Natural environment" },
];

export default function PromptGenerator() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [selectedShotType, setSelectedShotType] = useState("medium-shot");
  const [scenario, setScenario] = useState("");
  const [environment, setEnvironment] = useState("");
  const [product, setProduct] = useState("");
  const [customElements, setCustomElements] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchActors() {
      try {
        const response = await fetch("/api/actors");
        if (!response.ok) throw new Error("Failed to fetch actors");
        const data = await response.json();
        setActors(data);
        if (data.length > 0) {
          setSelectedActor(data[0]);
        }
      } catch (err) {
        console.error("Error fetching actors:", err);
      }
    }

    fetchActors();
  }, []);

  const handleGeneratePrompt = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedActor || !scenario) {
      alert("Please select an actor and enter a scenario");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor: selectedActor,
          shotType: selectedShotType,
          scenario,
          environment,
          product,
          customElements,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate prompt");
      const data = await response.json();
      setGeneratedPrompt(data);
    } catch (err) {
      console.error("Error generating prompt:", err);
      alert("Failed to generate prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;

    await navigator.clipboard.writeText(generatedPrompt.finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <form onSubmit={handleGeneratePrompt} className="space-y-6">
          {/* Actor Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Actor *
            </label>
            <select
              value={selectedActor?.actor_id || selectedActor?.id || ""}
              onChange={(e) => {
                const actor = actors.find((a) => (a.actor_id || a.id) === e.target.value);
                setSelectedActor(actor || null);
              }}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground focus:border-primary focus:outline-none"
              required
            >
              <option value="">Choose an actor...</option>
              {actors.map((actor) => (
                <option key={actor.actor_id || actor.id} value={actor.actor_id || actor.id}>
                  {actor.name} ({actor.age}, {actor.ethnicity})
                </option>
              ))}
            </select>
          </div>

          {/* Shot Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Shot Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SHOT_TYPES.map((shot) => (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => setSelectedShotType(shot.id)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    selectedShotType === shot.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium text-sm text-foreground">{shot.label}</div>
                  <div className="text-xs text-muted">{shot.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Scenario *
            </label>
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="E.g., 'Using the product in a morning skincare routine, sitting on a bed with natural sunlight'"
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder-muted focus:border-primary focus:outline-none resize-none"
              rows={4}
              required
            />
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Environment
            </label>
            <input
              type="text"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="E.g., 'Bright bedroom with white walls and soft furnishings'"
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground placeholder-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product/Brand Name
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="E.g., 'Skincare serum bottle'"
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground placeholder-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Custom Elements */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Custom Elements
            </label>
            <input
              type="text"
              value={customElements}
              onChange={(e) => setCustomElements(e.target.value)}
              placeholder="Any additional details or props"
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-foreground placeholder-muted focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-foreground font-medium rounded-lg transition-colors"
          >
            {loading ? "Generating..." : "Generate Prompt"}
          </button>
        </form>
      </div>

      {/* Result Section */}
      <div className="space-y-4">
        {generatedPrompt && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-6 bg-surface/50 space-y-4">
              <h3 className="font-semibold text-foreground">Generated Prompt Layers</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted block mb-1">Character Lock</span>
                  <p className="text-foreground bg-surface p-2 rounded border border-border">
                    {generatedPrompt.layers.characterLock}
                  </p>
                </div>

                <div>
                  <span className="text-muted block mb-1">Scenario</span>
                  <p className="text-foreground bg-surface p-2 rounded border border-border">
                    {generatedPrompt.layers.scenario}
                  </p>
                </div>

                <div>
                  <span className="text-muted block mb-1">Environment</span>
                  <p className="text-foreground bg-surface p-2 rounded border border-border">
                    {generatedPrompt.layers.environment}
                  </p>
                </div>

                <div>
                  <span className="text-muted block mb-1">Camera Direction</span>
                  <p className="text-foreground bg-surface p-2 rounded border border-border">
                    {generatedPrompt.layers.camera}
                  </p>
                </div>
              </div>
            </div>

            {/* Final Prompt */}
            <div className="border border-primary rounded-lg p-6 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Final Prompt</h4>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-primary hover:bg-primary-dark text-foreground rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-foreground text-sm leading-relaxed bg-surface/50 p-4 rounded border border-border">
                {generatedPrompt.finalPrompt}
              </p>
            </div>
          </div>
        )}

        {!generatedPrompt && (
          <div className="flex flex-col items-center justify-center h-96 border border-dashed border-border rounded-lg bg-surface/30">
            <div className="text-center">
              <div className="text-muted mb-2">Fill out the form to generate a prompt</div>
              <p className="text-sm text-muted">
                Your AI UGC influencer prompt will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
