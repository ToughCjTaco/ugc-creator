#!/usr/bin/env python3
"""
generate_video.py: animate a UGC still into a vertical clip with Kling 3.0 on fal.ai.

This is the image->video step of the ugc-creator skill. You give it a generated
start frame (from the 6-layer image prompt) plus a motion prompt that follows the
director rules in references/video-kling.md (one main action, small human motion),
and it returns a video. Aspect ratio follows the start frame, so render the still
in 9:16.

Identity lock (recommended): pass the actor's face pack as a Kling v3 "element"
and address her in the prompt as @Element1. See references/reference-lock.md.

Setup (once):
    pip install fal-client
    export FAL_KEY="your_fal_api_key"        # Windows PowerShell: $env:FAL_KEY="..."

Usage:
    python generate_video.py \
        --image start_frame.png \
        --prompt "@Element1 looks into the camera and speaks, natural lip sync.
                  Subtle blinking and breathing. Static shot. The camera remains
                  completely static." \
        --element-frontal facepack/01_frontal.png \
        --element-ref facepack/02_left.png --element-ref facepack/03_right.png \
        --duration 5 --out out/clip.mp4

Notes:
  * Pass --start-image-url / --element-*-url variants if your frames are hosted.
  * Native audio (--generate-audio) costs extra per second; voice usually comes
    from your TTS step instead, so it defaults to off.
  * fal.ai changes Kling endpoint slugs as new versions ship. If you get a 404,
    set --model to the current slug from https://fal.ai/models (search "Kling").
"""

import argparse
import os
import sys
import urllib.request

# Kling 3.0 Standard: ~$0.084/s audio off, ~$0.126/s audio on.
# Pro tier: fal-ai/kling-video/v3/pro/image-to-video.
# If this 404s, check the current slug at https://fal.ai/models (search "Kling").
DEFAULT_MODEL = "fal-ai/kling-video/v3/standard/image-to-video"


def log(msg):
    print(f"[ugc-creator] {msg}", file=sys.stderr)


def parse_args():
    p = argparse.ArgumentParser(
        description="Animate a UGC still into a clip via Kling 3.0 on fal.ai."
    )
    src = p.add_mutually_exclusive_group(required=True)
    src.add_argument("--image", help="Local path to the start frame (will be uploaded).")
    src.add_argument("--start-image-url", help="URL of an already-hosted start frame.")
    p.add_argument("--prompt", required=True,
                   help="Motion prompt (see director rules). Use @Element1 to "
                        "address the character when an element is passed.")
    p.add_argument("--element-frontal",
                   help="Local path to the actor's frontal face-pack image "
                        "(passed as a Kling v3 identity element).")
    p.add_argument("--element-frontal-url",
                   help="Hosted URL variant of --element-frontal.")
    p.add_argument("--element-ref", action="append", default=[],
                   help="Local path to an extra face-pack reference image. Repeatable.")
    p.add_argument("--element-ref-url", action="append", default=[],
                   help="Hosted URL variant of --element-ref. Repeatable.")
    p.add_argument("--duration", default="5", help="Clip length in seconds (3-15).")
    p.add_argument("--generate-audio", action="store_true",
                   help="Enable Kling native audio (costs extra; off by default).")
    p.add_argument("--cfg-scale", type=float, default=None,
                   help="Guidance scale (fal default 0.5). Leave unset unless tuning.")
    p.add_argument("--model", default=DEFAULT_MODEL, help="fal.ai Kling i2v model slug.")
    p.add_argument("--out", default="ugc_clip.mp4", help="Where to save the result.")
    p.add_argument("--negative-prompt",
                   default="blur, distort, warped face, melting hands, extra limbs, "
                           "morphing, identity drift",
                   help="Things to avoid during motion.")
    return p.parse_args()


def upload_or_url(fal_client, local_path, url, label):
    if url:
        return url
    if local_path:
        if not os.path.isfile(local_path):
            log(f"ERROR: {label} not found: {local_path}")
            sys.exit(2)
        log(f"Uploading {label}: {local_path}")
        return fal_client.upload_file(local_path)
    return None


def main():
    args = parse_args()

    if not os.environ.get("FAL_KEY"):
        log("ERROR: FAL_KEY environment variable is not set. Get a key at fal.ai "
            "and `export FAL_KEY=...` (PowerShell: $env:FAL_KEY=\"...\").")
        sys.exit(2)

    try:
        import fal_client
    except ImportError:
        log("ERROR: fal-client is not installed. Run: pip install fal-client")
        sys.exit(2)

    start_url = upload_or_url(fal_client, args.image, args.start_image_url, "start frame")

    arguments = {
        "start_image_url": start_url,
        "prompt": args.prompt,
        "duration": str(args.duration),
        "generate_audio": bool(args.generate_audio),
        "negative_prompt": args.negative_prompt,
    }
    if args.cfg_scale is not None:
        arguments["cfg_scale"] = args.cfg_scale

    # Identity element (Kling v3): frontal + optional extra references.
    frontal_url = upload_or_url(fal_client, args.element_frontal,
                                args.element_frontal_url, "element frontal")
    if frontal_url:
        ref_urls = list(args.element_ref_url)
        for pth in args.element_ref:
            ref_urls.append(upload_or_url(fal_client, pth, None, "element reference"))
        element = {"frontal_image_url": frontal_url}
        if ref_urls:
            element["reference_image_urls"] = ref_urls
        arguments["elements"] = [element]
        if "@element" not in args.prompt.lower():
            log("NOTE: an element is attached but the prompt never says @Element1. "
                "Address the character as @Element1 for the identity lock to bind.")

    log(f"Submitting to {args.model} ...")

    def on_update(update):
        logs = getattr(update, "logs", None)
        if logs:
            for entry in logs:
                msg = entry.get("message") if isinstance(entry, dict) else str(entry)
                if msg:
                    log(msg)

    try:
        result = fal_client.subscribe(
            args.model,
            arguments=arguments,
            with_logs=True,
            on_queue_update=on_update,
        )
    except Exception as e:  # noqa: BLE001, surface any fal/runtime error plainly
        log(f"ERROR during generation: {e}")
        log("If this is a 404/model error, set --model to the current Kling "
            "image-to-video slug from https://fal.ai/models. If it names an "
            "unexpected parameter, the endpoint schema changed: compare with "
            "the slug's /api page.")
        sys.exit(1)

    video = result.get("video") if isinstance(result, dict) else None
    video_url = video.get("url") if isinstance(video, dict) else None
    if not video_url:
        log(f"ERROR: no video URL in result. Raw result: {result}")
        sys.exit(1)

    log(f"Video ready: {video_url}")

    out_dir = os.path.dirname(os.path.abspath(args.out))
    os.makedirs(out_dir, exist_ok=True)
    log(f"Downloading to {args.out} ...")
    urllib.request.urlretrieve(video_url, args.out)
    log("Done.")
    print(args.out)


if __name__ == "__main__":
    main()
