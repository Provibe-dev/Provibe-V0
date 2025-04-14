"use client"

export default function WhyProVibeSection() {
  const reasons = [
    {
      title: "Structure Before You Build",
      description:
        "Provibe helps you define your product clearly—before you hand it to a no-code tool. No more guessing or re-prompting.",
    },
    {
      title: "Smarter No-Code Outputs",
      description:
        "Feeding AI structured docs results in more accurate, aligned builds from tools like Bubble, Glide, or Canva Code.",
    },
    {
      title: "Time-Saving Automation",
      description:
        "Skip writing your PRDs, user flows, or architecture by hand. Provibe does it in minutes so you can focus on building.",
    },
  ]

  return (
    <section className="relative w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-cyan-100 opacity-20 rounded-xl blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Why Provibe?</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Because your idea deserves structure, speed, and clarity—without writing a single line of code.
        </p>
      </div>

      {/* Features grid */}
      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all text-left"
          >
            <h3 className="text-xl font-semibold mb-2 text-foreground">{reason.title}</h3>
            <p className="text-muted-foreground text-sm">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
