# Video: Kling 3.0 via fal.ai

Stills get you a feed; video gets you a creator. But motion is where most AI
influencers fall apart: faces warp, hands melt, the illusion collapses in the
first second. The fix is **restraint**: video models reward small, controlled
motion and punish ambition.

The pipeline is image→video: you take a generated still (from Workflow B) as the
start frame and animate it with **Kling 3.0** hosted on **fal.ai**.

## The director rules (non-negotiable)

1. **One main action per clip.** One. Not "she waves, turns, smiles, and sips
   coffee." She picks up the bottle, *or* tucks her hair, *or* smiles. Never all
   three. Every extra action is another chance for the model to break the face.
2. **Say "static camera" twice** when you want a locked frame. Models ignore it
   said once: `"Static front-camera iPhone shot. The camera remains completely
   static."`
3. **Keep movement small and human.** Blinks, micro head tilts, a breath, natural
   lip sync, hair moving slightly in wind. Small motion preserves identity; big
   motion reads as a glitch.
4. **Vertical 9:16, ~5s.** That's the feed's canvas and a safe clip length.
5. **Describe the start state, not a story.** The still already defines the
   character; the motion prompt only says what *moves*.

## Motion prompt template

```
{one main action, stated simply}. {small secondary life: natural blinking, subtle
breathing, slight hair movement, realistic lip sync if speaking}. Handheld iPhone
{front selfie / rear} feel with tiny natural shake. Soft natural lighting
consistent with the start frame. Vertical 9:16.
[If locked frame:] Static shot. The camera remains completely static.
```

**Example (talking testimonial):**
```
She looks into the camera and speaks a short friendly sentence, natural lip sync.
Subtle blinking, gentle breathing, a few hair strands moving in the breeze.
Handheld iPhone front-selfie feel with tiny natural shake. Warm golden-hour light
matching the start frame. Vertical 9:16.
```

**Example (locked product shot):**
```
She slowly raises the serum bottle toward the camera and gives a soft smile.
Subtle blinking and breathing only. Static front-camera iPhone shot. The camera
remains completely static. Vertical 9:16.
```

## The identity element (the video-side latch)

Kling v3 takes the character as a first-class input: `elements`. You pass the
face-pack frontal plus 1-2 reference angles, then address her in the prompt as
`@Element1`. This is what keeps the face hers through motion; the card and the
start frame alone leave the sampler room to re-roll. Build the face pack first
(`references/reference-lock.md`), then attach it to every clip of a recurring
actor.

## Generating with the script

`scripts/generate_video.py` calls Kling 3.0 image-to-video on fal.ai
(`fal-ai/kling-video/v3/standard/image-to-video`; Standard ~$0.084/s with audio
off, ~$0.126/s with audio on; Pro tier costs more).

**Setup (once):**
```bash
pip install fal-client
export FAL_KEY="your_fal_api_key"   # get it from fal.ai dashboard
```

**Run (with the identity element):**
```bash
python scripts/generate_video.py \
  --image "path/to/start_frame.png" \
  --prompt "@Element1 looks into the camera and speaks a short friendly
            sentence, natural lip sync. Subtle blinking and breathing.
            Static shot. The camera remains completely static." \
  --element-frontal "assets/actors/lila/facepack/01_frontal.png" \
  --element-ref "assets/actors/lila/facepack/02_left.png" \
  --duration 5 \
  --out "out/lila_testimonial.mp4"
```

Notes: aspect ratio follows the start frame, so render the still in 9:16.
Native audio is off by default (voice usually comes from your TTS step);
enable with `--generate-audio` if you want Kling's own sound. The script
accepts `--start-image-url` / `--element-frontal-url` variants if your frames
are already hosted. It prints the resulting video URL and downloads it to
`--out`.

> **Model slug note:** fal.ai updates Kling endpoint slugs as new versions ship.
> The script defaults to a Kling image-to-video endpoint but exposes
> `--model` so you can point it at the current slug from
> <https://fal.ai/models> (search "Kling"). If a run 404s, that's the first thing
> to check.

## Stitching a clip into content

For a day-in-the-life, generate 4-6 clips (each one main action), keep the same
actor card and start-frame style, then cut them together in any editor. The
consistency protocol from `prompt-layers.md` applies to the start frames; the
director rules keep each clip from breaking the face.
