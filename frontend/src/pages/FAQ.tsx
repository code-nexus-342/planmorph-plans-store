import React from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-architect-900 group-hover:text-accent-teal transition-colors">{question}</span>
        <ChevronDown 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What is included in the plan package?",
      answer: "Our standard package includes detailed floor plans, elevations (front, rear, and sides), building sections, and a roof plan. Some packages also include 3D renderings and door/window schedules."
    },
    {
      question: "Are these plans approved for construction in Kenya?",
      answer: "Our plans are designed to meet general building codes. However, local county regulations vary. We recommend having a local architect or engineer review the plans for site-specific compliance and submission to your county government."
    },
    {
      question: "Can I modify a plan I purchased?",
      answer: "Yes! We offer modification services for an additional fee. You can also purchase the CAD files (if available) and have your own architect make changes."
    },
    {
      question: "How do I receive my plans?",
      answer: "Once your payment is confirmed, you will receive an email with a download link. You can also access your purchased plans anytime from your 'My Purchases' dashboard."
    },
    {
      question: "Do you offer refunds?",
      answer: "Due to the digital nature of our products, we generally do not offer refunds once files have been downloaded. However, if there is a technical issue with the file, please contact support and we will resolve it."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 pt-24 max-w-3xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-heading font-bold text-architect-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-500">
          Find answers to common questions about buying and building with PlanMorph.
        </p>
      </div>

      <div className="bg-white border border-gray-200 shadow-soft p-8">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
