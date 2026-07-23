import { NextResponse } from "next/server";

interface PromptRequest {
  actor: any;
  shotType: string;
  scenario: string;
  environment?: string;
  product?: string;
  customElements?: string;
}

const SHOT_TYPES: Record<string, string> = {
  "medium-shot": "Medium shot (waist up, direct to camera)",
  "close-up": "Close-up (face and shoulders, intimate)",
  "full-body": "Full body shot (standing, dynamic)",
  "pov": "POV (first-person perspective, looking at product)",
  "action-shot": "Action shot (moving, active demonstration)",
  "product-focus": "Product focus (hand-held, detail oriented)",
  "lifestyle": "Lifestyle (natural environment, contextual)",
};

const REALISM_ANCHORS = [
  "skin texture with subtle imperfections",
  "realistic light reflection in eyes",
  "natural hair movement and flyaways",
  "authentic facial expressions and micro-expressions",
  "realistic clothing wrinkles and fabric movement",
  "genuine engagement and eye contact with viewer",
];

const NEGATIVE_PROMPTS = [
  "no filters",
  "no airbrushing",
  "no artificial smoothing",
  "no CGI",
  "no watermarks",
  "no logos",
  "no text overlays",
];

export async function POST(request: Request) {
  try {
    const {
      actor,
      shotType,
      scenario,
      environment,
      product,
      customElements,
    }: PromptRequest = await request.json();

    if (!actor || !shotType || !scenario) {
      return NextResponse.json(
        { error: "Missing required fields: actor, shotType, scenario" },
        { status: 400 }
      );
    }

    // Extract actor properties (handle both old and new schema)
    const actorName = actor.name || "Actor";
    const actorAge = actor.age || actor.age_range || "20-25";
    const actorOrigin = actor.origin || actor.ethnicity || "European";
    const actorHair = actor.appearance?.hairColor || actor.hair || "golden hair";
    const actorEyes = actor.appearance?.eyeColor || actor.eyes || "blue eyes";
    const actorSkin = actor.appearance?.skinTone || actor.skin_tone_hex || "fair skin";
    const actorFeatures = actor.appearance?.distinctiveFeatures || actor.distinguishing_marks || ["delicate features"];
    const actorAesthetic = actor.aesthetic || "natural";

    // Layer 1: Character Lock
    const characterLock = `${actorName}, a ${actorAge} ${actorOrigin}, with ${actorHair} and ${actorEyes}. Skin: ${actorSkin}. Distinctive features: ${Array.isArray(actorFeatures) ? actorFeatures.join(", ") : actorFeatures}.`;

    // Layer 2: Scenario
    const scenarioLayer = scenario;

    // Layer 3: Environment
    const environmentLayer = environment || `${actorAesthetic}-inspired environment`;

    // Layer 4: Camera Direction
    const cameraDirection = SHOT_TYPES[shotType] || SHOT_TYPES["medium-shot"];

    // Layer 5: Realism Anchors
    const realismAnchors = REALISM_ANCHORS.join(", ");

    // Layer 6: Negative Prompts
    const negativePrompts = NEGATIVE_PROMPTS.join(", ");

    // Assemble final prompt
    const finalPrompt = `${characterLock}. ${scenarioLayer}. Setting: ${environmentLayer}. ${cameraDirection}. Include: ${realismAnchors}. Negative: ${negativePrompts}${product ? ` Product mentioned: ${product}.` : ""}${customElements ? ` Additional: ${customElements}.` : ""}`;

    return NextResponse.json(
      {
        layers: {
          characterLock,
          scenario: scenarioLayer,
          environment: environmentLayer,
          camera: cameraDirection,
          realismAnchors,
          negativePrompts,
        },
        finalPrompt,
        shotType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
