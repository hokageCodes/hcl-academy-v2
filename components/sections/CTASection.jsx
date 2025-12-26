import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="bg-white py-20 px-6 flex items-center justify-center border-t border-gray-100">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Ready to start your journey?
        </h2>
        <p className="text-gray-700 text-lg mb-8">
          Join a vibrant community, learn practical skills, and unlock new opportunities in tech. Take the first step today!
        </p>
        <Button asChild size="lg" className="bg-primary text-white font-bold text-lg rounded-xl px-10 py-6 hover:bg-primary/90">
          <a href="/programs">Get Started</a>
        </Button>
      </div>
    </section>
  );
}
