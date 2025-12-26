"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Card from "../ui/Card";

const faqs = [
	{
		question: "Who can join HCL Academy?",
		answer:
			"Anyone interested in digital skills, regardless of background or experience, can join our programs. We welcome beginners and career switchers!",
	},
	{
		question: "Are the courses online or in-person?",
		answer:
			"All our courses are delivered online with live sessions, hands-on projects, and community support.",
	},
	{
		question: "Do I need prior experience?",
		answer:
			"No prior experience is required for our beginner programs. Advanced courses may have prerequisites, which are clearly stated in the course details.",
	},
	{
		question: "How do I register?",
		answer:
			"Click any 'Register' button on this page or visit our registration page to get started! It's quick and easy.",
	},
	{
		question: "Is there a certificate?",
		answer:
			"Yes, you will receive a certificate of completion for each program you finish. This can be shared on your resume",
	},
];

export default function FAQs() {
	const [open, setOpen] = useState(null);

	return (
		<section className="bg-white py-12 px-2 md:px-0">
			<div className="max-w-3xl mx-auto text-left">
				<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-left">
					FAQs
				</h2>
				<div className="space-y-3">
					{faqs.map((faq, idx) => (
						<Card
							key={idx}
							className="bg-white border-gray-200 shadow-md text-left p-0"
						>
							<button
								className="w-full flex items-center justify-between px-4 py-3 focus:outline-none text-left"
								onClick={() => setOpen(open === idx ? null : idx)}
								aria-expanded={open === idx}
								aria-controls={`faq-${idx}`}
							>
								<span className="text-base font-semibold text-gray-900 text-left">
									{faq.question}
								</span>
								<ChevronDown
									className={`ml-4 transition-transform ${
										open === idx ? "rotate-180" : "rotate-0"
									}`}
								/>
							</button>
							{open === idx && (
								<div
									id={`faq-${idx}`}
									className="px-4 pb-3 text-gray-700 animate-fade-in text-left"
								>
									{faq.answer}
								</div>
							)}
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
