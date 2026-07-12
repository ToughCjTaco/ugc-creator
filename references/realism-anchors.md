# The 10 Realism Anchors

The counterintuitive core of the whole system: **realism doesn't come from
beauty, it comes from imperfection.** AI images fail the eye not because they're
ugly but because they're *too clean*: poreless skin, perfect symmetry, flawless
light, airbrushed hair. The brain clocks "rendered" in a quarter of a second. The
"AI demo" smell is the smell of zero flaws.

So we don't let the generator produce zero flaws. We inject ten of them into
**every** shot (Layer 5 of the assembler). Phrase each as present, observed
detail: "visible skin pores," not "please add pores."

## The anchors

1. **Skin pores**: visible texture and slight oiliness in the T-zone, not
   airbrushed plastic.
2. **Stray hairs**: flyaways and baby hairs at the hairline breaking the
   silhouette; a few strands out of place.
3. **Under-eye texture**: faint fine lines and the natural soft shadow nobody
   photoshops out.
4. **Uneven skin tone**: mild redness around the nose, a warmer patch on the
   cheeks, the natural mottling of real skin.
5. **Fabric texture**: visible weave, small wrinkles and folds, the way real
   cloth creases and pills; bikini/strap indentation on skin.
6. **Environmental noise**: a smudge on the mirror, clutter at the frame edge, a
   coffee ring, a slightly messy background; nothing staged-perfect.
7. **Lighting imperfection**: one slightly blown highlight, a mildly crushed
   shadow, uneven fill; not studio-even.
8. **Camera artifacts**: mild sensor grain, a touch of motion blur, real-lens
   softness and slight chromatic aberration at the edges.
9. **Nail detail**: real cuticles, slight wear, maybe a tiny chip; never glossy
   CGI nails.
10. **Jewelry physics**: chains, earrings, rings that rest, hang, and catch
    light with real metal weight; a necklace that follows the collarbone.

## Drop-in block

Adapt to the scene (a bathroom mirror selfie swaps "distant beachgoers" for
"toothbrush and skincare bottles at the edge"), but keep all ten represented:

```
Realism: visible skin pores and slight T-zone shine, fine flyaway and baby hairs
at the hairline, faint under-eye texture and natural shadow, slightly uneven skin
tone with mild redness around the nose, real fabric texture with small wrinkles
and strap indentation, a little environmental clutter at the frame edge, one
slightly blown highlight and uneven natural fill light, mild sensor grain and
real-lens softness with a touch of motion blur, natural cuticles and slightly worn
nails, jewelry that hangs and catches light with real metal weight.
```

## The principle to keep in mind

You are not making her prettier to look real. You are making her *flawed on
purpose*. A real photo is full of tiny accidents. If the output has no accidents
in it, you've made a render, not a person yet. Pores over polish. The
mole stays. The asymmetric jaw stays. The flyaway stays.
