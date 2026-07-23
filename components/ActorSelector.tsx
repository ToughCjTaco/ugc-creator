"use client";

import { useEffect, useState } from "react";
import ActorCard from "./ActorCard";

interface Actor {
  id: string;
  name: string;
  age: string;
  ethnicity: string;
  gender: string;
  aesthetic: string;
  appearance: {
    hairColor: string;
    eyeColor: string;
    skinTone: string;
    distinctiveFeatures: string[];
  };
}

export default function ActorSelector() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActors() {
      try {
        const response = await fetch("/api/actors");
        if (!response.ok) throw new Error("Failed to fetch actors");
        const data = await response.json();
        setActors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchActors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted">Loading actors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (actors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-muted mb-4">No actors found</div>
        <p className="text-sm text-muted">
          Add actors to get started with UGC prompt generation
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Actors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actors.map((actor) => (
            <ActorCard key={actor.id} actor={actor} />
          ))}
        </div>
      </div>
    </div>
  );
}
