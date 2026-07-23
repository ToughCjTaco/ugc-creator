"use client";

export default function Documentation() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-foreground">UGC Creator Studio</h2>
        <p className="text-foreground leading-relaxed">
          The UGC Creator Studio is a hyper-realistic AI UGC influencer generation system designed to create authentic, 
          on-brand user-generated content. This tool uses a 6-layer prompt architecture to generate precise instructions 
          for image generation models.
        </p>
      </section>

      {/* How It Works */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">How It Works: The 6-Layer Prompt Architecture</h3>
        <div className="space-y-3">
          {[
            {
              num: "1",
              title: "Character Lock",
              desc: "Defines the UGC actor with precise appearance details: age, ethnicity, hair color, eye color, skin tone, and distinctive features. This ensures visual consistency across all generated content.",
            },
            {
              num: "2",
              title: "Scenario",
              desc: "Describes the specific action or behavior the actor performs. Examples: 'applying skincare product', 'unboxing package', 'using product in daily routine'.",
            },
            {
              num: "3",
              title: "Environment",
              desc: "Specifies the physical setting and lighting conditions. Creates contextual authenticity: bedroom, kitchen, outdoor beach, minimalist studio, etc.",
            },
            {
              num: "4",
              title: "Camera Direction",
              desc: "Defines the shot type and framing. Options include medium shot, close-up, full body, POV, action shot, product focus, and lifestyle.",
            },
            {
              num: "5",
              title: "Realism Anchors",
              desc: "Emphasizes human authenticity: skin texture, light reflection, hair movement, micro-expressions, fabric wrinkles, and genuine engagement.",
            },
            {
              num: "6",
              title: "Negative Prompts",
              desc: "Explicitly excludes unrealistic elements: no filters, airbrushing, CGI, watermarks, logos, or text overlays.",
            },
          ].map((layer) => (
            <div key={layer.num} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-foreground flex items-center justify-center font-semibold text-sm">
                {layer.num}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{layer.title}</h4>
                <p className="text-sm text-muted mt-1">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shot Types */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Shot Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Medium Shot", desc: "Waist up, direct camera engagement. Best for product interaction and brand messaging." },
            { title: "Close-up", desc: "Face and shoulders, intimate connection. Perfect for emotional storytelling and product details." },
            { title: "Full Body", desc: "Standing shot with dynamic positioning. Ideal for lifestyle and fashion content." },
            { title: "POV", desc: "First-person perspective, looking at product. Creates immersive product discovery experience." },
            { title: "Action Shot", desc: "Moving, active demonstration. Shows product in use with energy and authenticity." },
            { title: "Product Focus", desc: "Hand-held, detail-oriented framing. Emphasizes product quality and features." },
            { title: "Lifestyle", desc: "Natural environment, contextual setting. Shows product as part of daily routine." },
          ].map((shot, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border bg-surface/50">
              <h4 className="font-semibold text-foreground text-sm">{shot.title}</h4>
              <p className="text-sm text-muted mt-2">{shot.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Actor Details */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Actor Cards</h3>
        <p className="text-foreground text-sm">
          Each UGC actor has a detailed card containing:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
          <li><span className="font-medium">Profile Image</span> - High-quality portrait for reference</li>
          <li><span className="font-medium">Demographic Data</span> - Age, ethnicity, gender</li>
          <li><span className="font-medium">Appearance Details</span> - Hair color, eye color, skin tone</li>
          <li><span className="font-medium">Distinctive Features</span> - Unique characteristics for recognition</li>
          <li><span className="font-medium">Aesthetic Style</span> - Overall vibe and brand fit (e.g., beachy, minimalist, edgy)</li>
          <li><span className="font-medium">Wardrobe Options</span> - Available outfit variations</li>
          <li><span className="font-medium">Voice Direction</span> - Communication style guidance</li>
        </ul>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Best Practices</h3>
        <div className="space-y-3">
          {[
            {
              title: "Specificity Matters",
              desc: "The more detailed your scenario, environment, and product information, the more precise the generated prompt.",
            },
            {
              title: "Consistency is Key",
              desc: "Use the same actor across multiple prompts to maintain visual brand identity and audience recognition.",
            },
            {
              title: "Iterate and Refine",
              desc: "Generate multiple prompts with slight variations to find the perfect direction for your content.",
            },
            {
              title: "Consider Context",
              desc: "Match the shot type and environment to your product type. Skincare → close-ups; fashion → full body.",
            },
            {
              title: "Authenticity Over Perfection",
              desc: "The system emphasizes realistic, human details over artificial polish to increase engagement.",
            },
          ].map((practice, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <h4 className="font-semibold text-foreground text-sm">{practice.title}</h4>
              <p className="text-sm text-muted mt-2">{practice.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="space-y-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
        <h3 className="text-xl font-semibold text-foreground">Getting Started</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
          <li>Navigate to <span className="font-medium">Prompt Generator</span> tab</li>
          <li>Select a UGC actor from the dropdown</li>
          <li>Choose your desired shot type</li>
          <li>Enter a detailed scenario for the actor&apos;s action</li>
          <li>Optionally add environment, product, and custom element details</li>
          <li>Click <span className="font-medium">Generate Prompt</span></li>
          <li>Copy the final prompt and use it with your image generation model</li>
        </ol>
      </section>
    </div>
  );
}
