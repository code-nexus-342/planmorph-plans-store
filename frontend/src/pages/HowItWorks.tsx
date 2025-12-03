import React from 'react';
import { Search, ShoppingCart, Download, Hammer } from 'lucide-react';
import ProcessStep from '../components/ProcessStep';

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-heading font-bold text-architect-900 mb-4">How It Works</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Your journey from dream to reality is simple and streamlined. Here is how you can get your construction-ready plans today.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ProcessStep 
          number={1}
          title="Browse & Select"
          description="Explore our curated collection of architectural designs. Filter by style, size, and budget to find your perfect match."
          icon={Search}
        />
        <ProcessStep 
          number={2}
          title="Purchase Securely"
          description="Add your chosen plan to the cart and checkout securely using M-Pesa or Credit Card. Instant processing."
          icon={ShoppingCart}
        />
        <ProcessStep 
          number={3}
          title="Download Instantly"
          description="Receive immediate access to high-resolution PDFs and CAD files. All documents are ready for local authority submission."
          icon={Download}
        />
        <ProcessStep 
          number={4}
          title="Start Building"
          description="Hand over the detailed drawings to your contractor and watch your vision come to life."
          icon={Hammer}
          isLast
        />
      </div>
    </div>
  );
};

export default HowItWorks;
