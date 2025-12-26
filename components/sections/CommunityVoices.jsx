
import Card from "../ui/Card";
import { Button } from "../ui/button";
import Image from "next/image";

const CommunityVoices = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      quote:
        "HCL Academy didn’t just teach me to code. It taught me how to think like a creator in the digital age.",
    },
    {
      name: "David Lee",
      quote:
        "The community at HCL Academy is so supportive. I found mentors and friends who helped me grow my skills and confidence.",
    },
    {
      name: "Amina Yusuf",
      quote:
        "Project-based learning made all the difference. I graduated with a portfolio I’m truly proud of!",
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
          Community Voices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="bg-white border-gray-200 shadow-md p-8 flex flex-col items-center">
              <blockquote className="text-lg text-gray-700 italic mb-4 text-center">
                “{t.quote}”
              </blockquote>
              <div className="text-center">
                <p className="text-gray-900 font-semibold">{t.name}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityVoices;
