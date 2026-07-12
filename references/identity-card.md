# Building the Identity Card

The identity card is the single source of truth for a synthetic person. Every shot
inherits from it, so precision here pays off on every future generation, and
sloppiness here drifts on every future generation. The schema lives in
`assets/actor-card.schema.json`; this file explains *how to fill it well*.

## The golden rule: define, don't describe

"Describing" a person gives the model room to interpret, and interpretation drifts
between generations. "Defining" a person pins values the model can't reinterpret.

- ❌ Describe: `"fair skin"` → reads differently every time.
- ✅ Define: `"skin_tone_hex": "#F8C4AE"` → compiles to the same skin every time.

Apply this to every field you can. Where a hex isn't possible (face shape), be
specific and concrete rather than evocative.

## Field-by-field

**`actor_id`**: lowercase, underscores, e.g. `lila_v1`. The filename and the
handle you'll use in briefs. Version it (`_v1`) so you can fork later.

**`origin`**: name it explicitly. Models default an ambiguous face toward a
generic Instagram average; an origin ("Swedish", "Brazilian", "Korean") anchors
the features and is a big consistency lever.

**`age_range`**: keep it tight, e.g. `21-23`. Wide ranges let the face wander.

**`face`**: shape + 2-3 standout features. Concrete nouns: "soft oval, high
cheekbones, small straight nose."

**`eyes`**: color + shape + **a deliberate asymmetry**. The asymmetry
("left eye 2% smaller") is deliberate. It is the single most powerful "this is a
real individual" signal in the card. Symmetric faces read as rendered.

**`skin_tone_hex`**: the most important field. An actual hex. Pick one and never
change it. This is what stops her skin sliding warmer under one light and cooler
under another.

**`skin_notes`**: undertone + texture: "rosy undertone, faint freckling across
nose bridge." Pairs with the realism anchors.

**`hair`**: color + texture + length + part. All four. Hair is the second-most
common drift ("golden blonde" → "dishwater blonde") so pin it hard.

**`jawline`**: shape + a deliberate asymmetry, like the eyes.

**`distinguishing_marks`**: moles/scars/freckles pinned to **specific
locations**: "mole below right jaw, scar through left eyebrow, freckle on left
collarbone." Models love to "clean" these away; the character lock explicitly
keeps them. They are identity anchors disguised as flaws.

**`prompt_seed`**: a fixed integer. Reuse it on every generation where the model
supports seeds.

**`outfit_variations`**: a small wardrobe she cycles through, so outfits stay
on-brand without you inventing clothes each time.

**`voice_notes`** (optional): direction for the audio layer.

**`negative_defaults`** (optional): per-actor negative-prompt additions ("no
heavy makeup", "no tattoos").

## Creating from reference images (mixing, not copying)

If the user supplies reference faces, the goal is a **new** synthetic person built
from separate traits: not a copy of any real person.

1. Describe each reference separately (hair, eyes, face, lips, vibe). Number them.
2. Let the user assign traits: "hair from #1, eyes from #2, jaw from #3."
3. Synthesize the picked traits into the card fields.
4. Add a deliberate asymmetry and marks that belong to *this* new person.

This produces a controlled, consistent synthetic character instead of a random
"AI beauty" average, and avoids cloning a real individual.

## Validate before you scale

Generate one neutral base portrait from the finished card (simple background,
actor at rest, front selfie cam). Check the hair, face structure, skin, and marks.
Do not generate scenes, outfits, or video until the base face is right. Every
later shot inherits this face, so fixing it now is cheap and fixing it later is
expensive.
