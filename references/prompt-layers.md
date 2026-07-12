# The 6-Layer Prompt Assembler

This is the engine room. Every shot prompt is built from six **ordered** layers.
The order is load-bearing, not cosmetic: the character lock comes first so that
everything downstream (scenario, lighting, camera) bends around *who she is*
instead of being free to renegotiate her face.

Assemble the layers into one positive prompt, then emit the negative prompt
separately. Most image models take both.

## Why order matters

The most common way a build drifts is letting a dramatic scenario or a flashy
camera angle override the identity: you ask for "low golden-hour backlight" and
the model happily reshapes the jaw to make a prettier silhouette. Putting the
character lock first, complete, and verbatim from the card makes the face the
fixed point the rest of the prompt orbits.

---

## Layer 1: Character lock (always first, always complete)

Pull **every field** from the actor's JSON card, verbatim. Do not paraphrase, do
not drop fields, do not "improve" them. Lead with an explicit instruction that
this is a fixed synthetic person.

**Template:**
```
Photorealistic photo of {name}, a {age_range} year old {origin} woman, the exact
same synthetic person every time, do not beautify or alter her features.
Face: {face}. Eyes: {eyes}. Skin tone exactly {skin_tone_hex}, {skin_notes}.
Hair: {hair}. Jawline: {jawline}. Distinguishing marks (keep visible): {distinguishing_marks}.
Preserve her natural asymmetry and these marks exactly; they are who she is.
```

## Layer 2: Scenario (action + physical consequences)

State the single thing she's doing, then add the *physical consequences* of it.
This is where realism is won or lost: "just out of the sea" without consequences
gives a dry model standing near water; with consequences it gives wet skin.

**Template:**
```
She is {action}. {physical consequences: e.g. skin wet and glistening, hair
dripping and clumped, faint goosebumps, salt sheen on shoulders, relaxed easy
expression}.
```

## Layer 3: Environment (place + the light it implies)

Name the place AND the lighting physics that place produces. The environment
dictates the light; don't describe light in the abstract.

**Template:**
```
Location: {place}. Lighting: {physics implied by the place, e.g. low warm
golden-hour sun from camera left, long soft shadows, bright rim light on the hair,
gentle lens flare}.
```

## Layer 4: Camera (the chosen iPhone profile)

Choose one profile from `camera-profiles.md` and inline its character. This is
what makes it read "shot on a phone" rather than "rendered."

**Template:**
```
Shot on {profile name}: {focal feel, framing, distance, handheld behavior}.
{aspect ratio, e.g. vertical 9:16}.
```

## Layer 5: Realism injection (all 10 anchors)

Append the full anchor block from `realism-anchors.md`. Every shot gets all ten.
This is the layer that kills the "AI demo" smell. Phrase them as present detail,
not as requests.

## Layer 6: Negative prompt (emit separately)

Everything we refuse. Start from the standard block below and add the actor's
`negative_defaults`.

**Standard negative block:**
```
plastic skin, airbrushed, poreless, waxy, perfectly symmetric face, beauty filter,
smoothed skin, doll-like, CGI sheen, over-saturated, HDR glow, extra fingers,
deformed hands, mangled jewelry, warped background, text artifacts, watermark,
over-whitened teeth, uncanny eyes, glossy mannequin look
```

---

## Worked example

**Brief:** `Lila, just out of the sea, wet hair, golden hour`

**Positive prompt (assembled):**
```
Photorealistic photo of Lila, a 21-23 year old Swedish woman, the exact same
synthetic person every time, do not beautify or alter her features. Face: soft
oval, high cheekbones, small straight nose, gentle rounded chin. Eyes: pale
blue-grey, slightly hooded, left eye 2% smaller. Skin tone exactly #F8C4AE, fair,
rosy undertone, faint freckling across nose bridge, natural sun-kissed warmth on
cheeks. Hair: golden blonde, natural wave, mid-chest length, center part. Jawline:
delicate, soft, slightly asymmetric, left side a touch softer. Distinguishing
marks (keep visible): small mole below right jaw, faint scar through left eyebrow,
freckle on left collarbone. Preserve her natural asymmetry and these marks exactly.

She has just walked out of the sea: skin wet and glistening, hair dripping and
clumped into wet strands, faint goosebumps on her arms, salt sheen on her
shoulders, relaxed half-smile, slightly squinting into the sun.

Location: shallow surf on a quiet beach, wet sand, turquoise water behind her.
Lighting: low warm golden-hour sun from camera left, long soft shadows, bright rim
light catching the wet hair, gentle natural lens flare.

Shot on iPhone front selfie camera: arm's-length framing, slight upward tilt,
mild wide-lens distortion, soft front-sensor character, natural handheld micro-shake.
Vertical 9:16.

Realism: visible skin pores, fine flyaway and baby hairs, faint under-eye texture
and natural shadow, slightly uneven skin tone with mild redness, water droplets on
skin, real-lens softness and mild grain, a touch of motion blur, natural cuticles
and slightly worn nails, a thin gold chain resting and hanging with real weight,
faint background noise of distant beachgoers slightly out of focus.
```

**Negative prompt:**
```
plastic skin, airbrushed, poreless, waxy, perfectly symmetric face, beauty filter,
smoothed skin, doll-like, CGI sheen, over-saturated, HDR glow, extra fingers,
deformed hands, mangled jewelry, warped background, text artifacts, watermark,
over-whitened teeth, uncanny eyes, glossy mannequin look, heavy makeup, visible
tattoos
```

---

## Batch consistency protocol (the thing that makes it a business)

When generating several shots (a content calendar), the goal is that every frame
is *obviously* the same human. The protocol:

1. **Layer 1 is byte-identical across every shot.** Copy it; never re-type it
   from memory. Re-typing is where a field quietly changes.
2. **Lock the same seed** (`prompt_seed`) on every generation where the model
   supports seeds.
3. **The asymmetry, marks, and `skin_tone_hex` never move.** If the model
   "fixes" them, regenerate. Don't accept the cleaned-up version.
4. **Only Layers 2-4 change** between shots. Scenario, environment, camera vary;
   identity does not.
5. **Spot-check pairs.** Put two finished shots side by side: same mole, same
   eye asymmetry, same hairline? If not, the lock leaked. Find which field you
   paraphrased.

Drift is almost always a Layer-1 problem: a dropped field, a paraphrased
descriptor, or accepting a "beautified" generation. Treat the card as immutable
and the locks hold.
