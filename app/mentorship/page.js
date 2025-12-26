"use client";
import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

export default function MentorshipPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    goals: "",
    background: "",
    availability: "",
  });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((s) => s + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Your Story" },
    { number: 3, title: "Review" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center py-40 px-4">
      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            1-on-1 Mentorship Application
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Apply for personalized mentorship with an expert. 
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {submitted ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Thank you for applying! We'll review your application and get back to you within 2-3 business days.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setForm({
                    name: "",
                    email: "",
                    goals: "",
                    background: "",
                    availability: "",
                  });
                }}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  {steps.map((s, idx) => (
                    <div key={s.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            step > s.number
                              ? "bg-green-400 text-white"
                              : step === s.number
                              ? "bg-black text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium ${
                            step >= s.number ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {s.title}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                            step > s.number ? "bg-green-400" : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="space-y-6 mb-8">
                  {step === 1 && (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div>
                        <label htmlFor="background" className="block text-sm font-semibold text-gray-900 mb-2">
                          Your Background *
                        </label>
                        <textarea
                          id="background"
                          name="background"
                          rows={4}
                          required
                          value={form.background}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all resize-none"
                          placeholder="Tell us about your experience, education, or current role..."
                        />
                      </div>
                      <div>
                        <label htmlFor="goals" className="block text-sm font-semibold text-gray-900 mb-2">
                          Mentorship Goals *
                        </label>
                        <textarea
                          id="goals"
                          name="goals"
                          rows={4}
                          required
                          value={form.goals}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all resize-none"
                          placeholder="What do you hope to achieve through mentorship?"
                        />
                      </div>
                      <div>
                        <label htmlFor="availability" className="block text-sm font-semibold text-gray-900 mb-2">
                          Your Availability *
                        </label>
                        <input
                          type="text"
                          id="availability"
                          name="availability"
                          required
                          value={form.availability}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:outline-none transition-all"
                          placeholder="e.g. Weekends, Evenings, Flexible"
                        />
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        Review Your Application
                      </h2>
                      <div className="space-y-3">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-32">Name:</span>
                          <span className="text-gray-900">{form.name}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-32">Email:</span>
                          <span className="text-gray-900">{form.email}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-32">Background:</span>
                          <span className="text-gray-900">{form.background}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-32">Goals:</span>
                          <span className="text-gray-900">{form.goals}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-32">Availability:</span>
                          <span className="text-gray-900">{form.availability}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all duration-300"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                  )}
                  <button
                    onClick={step === 3 ? handleSubmit : handleNext}
                    className={`flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                      step === 1 ? "w-full" : "flex-1"
                    }`}
                  >
                    <span>{step === 3 ? "Submit Application" : "Continue"}</span>
                    {step < 3 && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Note */}
        {!submitted && (
          <p className="text-center text-sm text-gray-500 mt-6">
            We typically respond within 2-3 business days. Your information is secure and confidential.
          </p>
        )}
      </div>
    </main>
  );
}