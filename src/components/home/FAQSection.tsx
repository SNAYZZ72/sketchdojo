import { useState } from "react"

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "What is SketchDojo.AI?",
      answer: "SketchDojo.AI is a cutting-edge platform that uses artificial intelligence to help you create manga and comics. Our tools simplify the drawing and storytelling process, making manga creation accessible to everyone regardless of artistic skill level."
    },
    {
      question: "Do I need drawing skills to use SketchDojo.AI?",
      answer: "Not at all! Our AI-powered tools can generate high-quality illustrations based on your text descriptions. You can focus on creating your story while our AI handles the visuals. Of course, if you do have drawing skills, you can use our tools to enhance your workflow."
    },
    {
      question: "How does the manga generation process work?",
      answer: "Simply describe your characters, scenes, and storylines using our intuitive interface. Our AI will generate matching illustrations that you can refine with simple adjustments. You can then arrange these into panels and pages, add dialogue, and export your finished manga in various formats."
    },
    {
      question: "Can I export my manga for printing or publishing?",
      answer: "Yes! SketchDojo.AI allows you to export your manga in high-resolution formats suitable for both digital publishing and print. We support PDF, PNG sequences, CBZ, and other industry-standard formats."
    },
    {
      question: "What's the difference between subscription tiers?",
      answer: "Our subscription tiers differ in the number of manga pages you can create per month, access to premium AI models, export options, and commercial usage rights. Higher tiers also offer priority processing for faster generation times and dedicated support."
    }
  ];
  
  return (
    <section id="faq" className="py-24 px-6 bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light">
      <div className="max-w-3xl mx-auto">
        <span className="block text-center text-xs font-semibold tracking-widest text-sketchdojo-primary uppercase mb-3">Questions & Answers</span>
        <h3 className="font-italianno text-6xl md:text-7xl text-white text-center mb-6">
          Frequently Asked Questions
        </h3>
        <p className="text-white/80 text-lg text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          Have a question? We've got answers. If you don't see what you're looking for, feel free to contact our support team.
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10"
            >
              <button
                className="w-full text-left px-6 py-5 flex justify-between items-center text-white font-medium"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-sketchdojo-primary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div 
                className={`transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 py-5 text-white/80 border-t border-white/10">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}