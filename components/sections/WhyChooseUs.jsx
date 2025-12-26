
import Card from "../ui/Card";
import { Button } from "../ui/button";
import Image from "next/image";

const reasons = [
  {
    title: "Industry-Driven Curriculum",
    desc: "Our syllabus is co-created with tech practitioners to ensure you learn exactly what the market needs.",
  },
  {
    title: "Project-Based Learning",
    desc: "Learn using real products as our guide from day one. Finish strong with a professional portfolio that proves your newly acquired superpowers.",
  },
  {
    title: "Community-Based Learning",
    desc: "Join a vibrant, supportive community of learners, mentors, and industry leaders who help you grow.",
  },
];

function WhyChooseUs() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LEFT — Image only */}
        <Card className="bg-white border-gray-200 shadow-md p-0 flex items-center justify-center min-h-[520px] lg:min-h-[600px]">
          <Image
            src="/hcl-about.jpeg"
            alt="Students collaborating"
            width={700}
            height={600}
            className="object-cover w-full h-full min-h-[520px] lg:min-h-[600px] rounded-3xl"
            priority
            loading="eager"
          />
        </Card>

        {/* RIGHT — Text Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Why HCL Academy?
          </h2>

          <div className="space-y-6 mb-8">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {reason.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="bg-primary text-white font-bold text-lg rounded-xl px-10 py-6 shadow-card hover:bg-primary/90 mt-4 min-h-[56px]">
            <a href="/programs">Register Now</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;