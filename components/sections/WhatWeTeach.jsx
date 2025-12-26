
import { Figma, Code2 } from "lucide-react";
import Image from "next/image";
import Card from "../ui/Card";
import { Button } from "../ui/button";

function WhatWeTeach() {

const courses = [
  {
    title: "Intro to Web Development",
    desc: "Learn HTML, CSS, JavaScript, the fundamentals of web design, and deploy your first website from scratch. No prior experience needed.",
    icon: <Code2 className="w-10 h-10 text-blue-400" />,
    featured: true,
    duration: "6 - 8 Weeks",
    level: "Beginner ONLY",
    mode: "Part-time / Full-time"
  },
  {
    title: "UI/UX Design Fundamentals",
    desc: "Master the basics of user interface and user experience design. Learn Figma, wireframing, prototyping, and design systems.",
    icon: <Figma className="w-10 h-10 text-pink-400" />,
    duration: "8 Weeks",
    level: "All Levels",
    mode: "Part-time"
  },
//   {
//     title: "Creative Coding & Animation",
//     desc: "Explore the intersection of code and art. Learn to create interactive visuals, generative art, and motion graphics.",
//     icon: "/images/creative-coding-icon.png",
//     duration: "10 Weeks",
//     level: "Intermediate",
//     mode: "Part-time"
//   },
];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">Our Curriculum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, idx) => (
            <Card
              key={idx}
              className={`bg-white border-gray-200 shadow-md flex flex-col gap-4 relative ${course.featured ? "ring-2 ring-green-400" : ""}`}
            >
              <div className="flex items-center gap-4 mb-2">
                {typeof course.icon === "string" ? (
                  <Image src={course.icon} alt="" width={40} height={40} className="rounded-lg" />
                ) : (
                  course.icon
                )}
                {course.featured && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Featured Program</span>
                )}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.desc}</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="bg-gray-100 px-3 py-1 rounded-full">{course.duration}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">{course.mode}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">{course.level}</span>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Button asChild size="lg" className="bg-primary text-white font-bold text-lg rounded-xl px-10 py-6 shadow-card hover:bg-primary/90 min-h-[56px]">
            <a href="/programs">Register for a Course</a>
          </Button>
        </div>
      </div>
    </section>          
  );
}

export default WhatWeTeach;
