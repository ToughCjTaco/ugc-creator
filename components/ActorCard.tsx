import Image from "next/image";

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

interface ActorCardProps {
  actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
  const imagePath = `/assets/actors/${actor.id}.png`;

  return (
    <div className="rounded-lg border border-border bg-surface p-4 hover:border-primary transition-colors">
      <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-gradient-to-b from-primary/10 to-secondary/10 flex items-center justify-center">
        <Image
          src={imagePath}
          alt={actor.name}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{actor.name}</h3>
          <p className="text-sm text-muted">
            {actor.age} years old • {actor.ethnicity}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted">Hair:</span>
            <p className="font-medium text-foreground">{actor.appearance.hairColor}</p>
          </div>
          <div>
            <span className="text-muted">Eyes:</span>
            <p className="font-medium text-foreground">{actor.appearance.eyeColor}</p>
          </div>
        </div>

        <div>
          <span className="text-muted text-xs">Aesthetic</span>
          <p className="font-medium text-primary capitalize">{actor.aesthetic}</p>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted">
            <span className="font-medium">Traits:</span> {actor.appearance.distinctiveFeatures.slice(0, 2).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
