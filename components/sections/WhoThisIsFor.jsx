"use client"; 
import { PenTool, Rocket, Lightbulb, Target, Compass } from 'lucide-react';

export default function WhoThisIsFor() {

const audiences = [
  {
    icon: <PenTool className="w-7 h-7" />, 
    title: "Aspiring Creatives",
    description: "You have ideas and vision. We'll give you the technical toolkit to bring them to life.",
    highlight: "Start from scratch"
  },
  {
    icon: <Rocket className="w-7 h-7" />,
    title: "Career Pivots",
    description: "Ready for a change? Tech welcomes diverse backgrounds, your unique perspective is your advantage.",
    highlight: "Reinvent yourself"
  },
  {
    icon: <Target className="w-7 h-7" />,
    title: "Ambitious Students",
    description: "Theory is one thing. We'll teach you the real-world skills that make you stand out before graduation.",
    highlight: "Get ahead early"
  },
  {
    icon: <Compass className="w-7 h-7" />,
    title: "Recent Graduates",
    description: "NYSC complete? Let's turn this transition period into your launchpad for a thriving tech career.",
    highlight: "Chart your course"
  },
  {
    icon: <Lightbulb className="w-7 h-7" />,
    title: "Curious Minds",
    description: "You're drawn to tech but don't know where to start. This is your on-ramp to the digital economy.",
    highlight: "Explore with purpose"
  }
];

  return (
    <section className="bg-white py-20 px-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Is This Program For You?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            We've designed this program for driven individuals ready to invest in their future. 
            If you're motivated to learn and willing to put in the work, you belong here.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-4">
          {audiences.map((audience, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                {audience.icon}
              </div>

              {/* Badge */}
              <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {audience.highlight}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {audience.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}