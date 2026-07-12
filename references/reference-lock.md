# Reference lock: latching identity beyond the card

The identity card kills the drift **you** cause: prompt variance. Same
description, same asymmetry, same marks, every shot. What it cannot do is latch
identity **inside the sampler**. Text has no primary key: change the scenario
and the model re-rolls the face within whatever variance is left. That residual
drift is killed by a second layer, reference conditioning, and this file is the
ladder for it.

The rule that holds the whole system together: **the reference never replaces
the card.** The card is the spec; references are compiled artifacts *of* the
card. If a reference and the card ever disagree, regenerate the reference from
the card. Never patch the reference by hand.

## The ladder (climb only as far as the job needs)

| Tier | What | When it's enough |
|------|------|------------------|
| 0 | Card only (6-layer prompt) | Single hero shots, moodboards, style tests |
| 1 | Card + face pack | You're about to do Tier 2 or 3 (the pack feeds them) |
| 2 | Face reference at generation | Any recurring stills: a feed, a campaign, a batch |
| 3 | Kling v3 `elements` for video | Any video where she must stay herself in motion |
| 4 | LoRA trained on the face pack | A permanent roster, ads at scale, max fidelity |

## Tier 1: build the face pack

The face pack is 4-6 canonical portraits generated FROM the card, once, right
after the base portrait is validated (Workflow A, step 4). It becomes the
reference input for every tier above it.

Shots to generate (same card, same seed, neutral styling):

```
1. frontal, neutral expression, studio light   (the anchor)
2. three-quarter left, soft smile
3. three-quarter right, neutral
4. profile left, hair tucked
5. laughing, candid, eyes half closed          (expression range)
6. full body, standing, simple background      (proportions)
```

Store as `assets/actors/<actor_id>/facepack/01_frontal.png ...`. Version them
with the card: bump the card, regenerate the pack. The pack is a build output,
not a source.

## Tier 2: face reference for stills

Every serious image model now takes an identity reference alongside the prompt.
The 6-layer prompt stays exactly the same; the reference rides along:

- **Midjourney:** `--cref <frontal url>` with `--cw 60-100`. Lower `--cw` keeps
  outfit/scene freedom, higher locks harder.
- **Flux / SDXL pipelines (fal, ComfyUI):** PuLID, InstantID, or IP-Adapter
  FaceID. Feed the frontal (and one 3/4) from the face pack. Identity weight
  0.6-0.8: below 0.6 she drifts, above ~0.85 the scenario stops landing because
  the reference bulldozes the pose and lighting.
- **gpt-image edits:** pass the frontal as the input image and edit the scene
  around her, instead of generating from text alone.

Failure modes to expect: an over-weighted reference kills the scenario layer
(same stiff head-on face in every scene), and a reference that disagrees with
the card (old pack after a card edit) reintroduces drift with extra steps.
Both fixes are in the rule at the top: card first, pack regenerated from it.

## Tier 3: Kling v3 elements (video)

Kling 3.0 on fal has a first-class identity mechanism: **elements**. You pass
the character as an image set, then address her in the prompt as `@Element1`.

Exact fal parameters (`fal-ai/kling-video/v3/standard/image-to-video`):

```
elements: [
  {
    "frontal_image_url":    <face pack 01_frontal>,
    "reference_image_urls": [<face pack 02>, <face pack 03>]
  }
]
prompt: "@Element1 looks into the camera and speaks, natural lip sync.
         Subtle blinking and breathing. Static shot. The camera remains
         completely static."
```

`scripts/generate_video.py` exposes this as `--element-frontal` and
`--element-ref` (repeatable). The director rules from `video-kling.md` still
apply unchanged: one main action, small motion, say "static camera" twice.

## Tier 4: LoRA, when the roster is permanent

When an actor earns real volume (a client campaign, months of a feed), train a
LoRA: 20-40 images derived from the face pack across angles, lighting, and
outfits, captioned with the card's own field values. From then on the LoRA
carries identity and the card keeps carrying everything else (marks, styling,
realism layers, negative defaults). Training happens on fal, Replicate, or
locally; that choice is infrastructure, not identity.

## The honest claim, stated once

The card does not guarantee the same face by itself. It guarantees the same
*spec*, which kills prompt-side variance and makes every reference and LoRA
downstream of it consistent and reproducible. The latch is card + reference
together: data pins what the model is told, the reference pins what the sampler
does with it.
