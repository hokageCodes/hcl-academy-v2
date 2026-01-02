"use client";
import CommunityVoices from "@/components/sections/CommunityVoices";
import FAQs from "@/components/sections/FAQs";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";

// Calendly Widget Loader
function CalendlyWidgetLoader() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Calendly) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  return null;
}

// CTA Button with Calendly popup
function TalkToAdvisorCTA() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    const tryOpen = () => {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ 
          url: "https://calendly.com/hokagecreativelabs001/30mins" 
        });
        setLoading(false);
      } else {
        setTimeout(tryOpen, 100);
      }
    };
    
    tryOpen();
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 font-semibold px-8 py-4 rounded-xl transition-all duration-300 min-w-[180px]"
      type="button"
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Loading…
        </span>
      ) : (
        <span>Talk to an Advisor</span>
      )}
    </button>
  );
}

// Payment Modal Component
function PaymentModal({ isOpen, onClose, program }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ firstName: "", lastName: "", email: "", phone: "" });
      setErrors({});
      setSubmitError("");
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting, onClose]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name contains invalid characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name contains invalid characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (Nigerian format)
    const cleanPhone = formData.phone.replace(/\s/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+234|234|0)[789][01]\d{8}$/.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid Nigerian phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.replace(/\s/g, ""),
          programId: program.programId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      if (data.success && data.data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error("Invalid response from payment server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setSubmitError(error.message || "An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#1a1425] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1425] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Enroll Now</h2>
            <p className="text-gray-500 text-sm">{program?.title}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Program Info */}
          <div className="bg-[#7FF41A]/10 border border-[#7FF41A]/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7FF41A] text-sm font-medium">Program Fee</p>
                <p className="text-white text-2xl font-bold">{program?.price}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-white font-semibold">{program?.duration}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                    errors.firstName 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                      : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-red-400 text-xs">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  disabled={isSubmitting}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                    errors.lastName 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                      : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-red-400 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={isSubmitting}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                  errors.email 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                    : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-red-400 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08012345678"
                disabled={isSubmitting}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${
                  errors.phone 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                    : "border-white/10 focus:border-[#7FF41A]/50 focus:ring-[#7FF41A]/50"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-red-400 text-xs">{errors.phone}</p>
              )}
              <p className="mt-1 text-gray-500 text-xs">Nigerian phone number format</p>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <svg className="w-5 h-5 text-[#7FF41A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-gray-400 text-xs">
                Your payment is secured by Paystack. We never store your card details.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7FF41A] hover:bg-[#6ad815] text-[#0f0a19] font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </Button>
          </form>

          {/* Payment Methods */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-gray-500 text-xs mb-3">Accepted payment methods</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-gray-400 text-xs bg-white/5 px-3 py-1 rounded-full">Cards</span>
              <span className="text-gray-400 text-xs bg-white/5 px-3 py-1 rounded-full">Bank Transfer</span>
              <span className="text-gray-400 text-xs bg-white/5 px-3 py-1 rounded-full">USSD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROGRAM_TABS = [
  { key: "all", label: "All Programs" },
  { key: "development", label: "Development" },
  { key: "design", label: "Design" },
  { key: "ai", label: "AI" },
];

const PROGRAMS = [
  {
    id: 1,
    programId: "intro-to-web-development",
    category: ["development", "all"],
    featured: true,
    title: "Intro to Web Development",
    desc: "Master the foundations of the web. Learn HTML5, CSS3, JavaScript ES6+, and Responsive Design. Build real-world projects and launch your portfolio in just 2 months.",
    duration: "8 Weeks",
    tags: ["Beginner Friendly", "Frontend"],
    skills: [
      { label: "HTML5", icon: "html" },
      { label: "CSS3", icon: "css" },
      { label: "JavaScript", icon: "js" },
      { label: "Responsive", icon: "responsive" },
    ],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    bestSeller: true,
    price: "₦50,000",
    priceValue: 50000,
    available: true,
  },
  {
    id: 2,
    programId: "ui-ux-design-fundamentals",
    category: ["design", "all"],
    featured: false,
    title: "UI/UX Design Fundamentals",
    desc: "Learn the basics of user interface and user experience design. Master Figma, wireframing, prototyping, and design systems.",
    duration: "6 Weeks",
    tags: ["Beginner Friendly", "Design"],
    skills: [
      { label: "Figma", icon: "figma" },
      { label: "Wireframing", icon: "wireframe" },
      { label: "Prototyping", icon: "prototype" },
      { label: "Design Systems", icon: "system" },
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    bestSeller: false,
    price: "₦45,000",
    priceValue: 45000,
    available: false, // Coming soon
  },
  {
    id: 3,
    programId: "vibe-coding-essentials",
    category: ["ai", "all"],
    featured: false,
    title: "Vibe Coding Essentials",
    desc: "Speed up your workflow using what you already know in web development. Learn essential patterns, shortcuts, and tools to code faster and smarter.",
    duration: "4 Weeks",
    tags: ["Coding Essentials", "Workflow"],
    skills: [
      { label: "Web Dev Knowledge", icon: "web" },
      { label: "Patterns", icon: "pattern" },
      { label: "Tools & Shortcuts", icon: "tools" },
    ],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    bestSeller: false,
    price: "₦35,000",
    priceValue: 35000,
    available: false, // Coming soon
  },
];

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const filteredPrograms = activeTab === "all" 
    ? PROGRAMS 
    : PROGRAMS.filter((p) => p.category.includes(activeTab));

  const handleApplyClick = (program) => {
    if (!program.available) return;
    setSelectedProgram(program);
    setIsPaymentModalOpen(true);
  };

  return (
    <main>
      <CalendlyWidgetLoader />
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
      />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-36 pb-20 px-6 flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Learn. Build. Launch.
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Choose from our carefully designed programs that take you from
                  a complete beginner to "i can fix your printers" in no time
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <TalkToAdvisorCTA />
                <a
                  href="/mentorship"
                  className="inline-flex items-center justify-center gap-2 bg-lime-400 text-black hover:bg-lime-500 font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                >
                  <span>Book 1:1 Mentorship</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                  <div className="text-sm text-gray-600">Weeks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Students collaborating on projects"
                  className="w-full h-[600px] object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Section */}
      <section className="max-w-7xl mx-auto w-full mt-12 px-2 md:px-0 mb-24">
        {/* Tabs */}
        <div className="flex gap-4 mb-10 flex-wrap">
          {PROGRAM_TABS.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full font-semibold text-base px-6 py-3 ${
                activeTab === tab.key
                  ? "bg-white text-black shadow-lg"
                  : "bg-black/80 text-white hover:bg-black"
              }`}
              variant={activeTab === tab.key ? "default" : "outline"}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {filteredPrograms.map((program) => (
            <Card
              key={program.id}
              className={`relative flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-105 p-0 ${
                program.featured ? "border-2 border-lime-400/80" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full h-64 sm:h-56 md:h-64 lg:h-72 flex-shrink-0">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                {program.bestSeller && (
                  <span className="absolute left-4 top-4 bg-lime-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    BEST SELLER
                  </span>
                )}
                {!program.available && (
                  <span className="absolute right-4 top-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    COMING SOON
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 bg-black/90 flex flex-col flex-1 justify-between text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {program.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto flex items-center gap-1 text-lime-400 text-xs font-bold">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="currentColor" />
                    </svg>
                    {program.duration}
                  </span>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                  <h2 className="text-2xl font-bold">{program.title}</h2>
                  <p className="text-gray-300 text-sm md:text-base">{program.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {program.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/10"
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  {program.available ? (
                    <Button
                      onClick={() => handleApplyClick(program)}
                      variant="link"
                      className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 text-base p-0"
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="link"
                      className="text-gray-400 font-semibold underline underline-offset-4 text-base cursor-not-allowed opacity-60 p-0"
                    >
                      Coming Soon
                    </Button>
                  )}
                  {program.price && (
                    <span className="bg-lime-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                      {program.price}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <CommunityVoices />
	  <FAQs />
    </main>
  );
}
