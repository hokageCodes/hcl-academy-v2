
import Hero from "@/components/sections/Hero";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import WhatWeTeach from "@/components/sections/WhatWeTeach";
import CommunityVoices from "@/components/sections/CommunityVoices";
import FAQs from "@/components/sections/FAQs";
import WhoThisIsFor from "@/components/sections/WhoThisIsFor";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhoThisIsFor />
      <WhyChooseUs />
      <WhatWeTeach />
      <CommunityVoices />
      <FAQs />
    </> 
  );
}

