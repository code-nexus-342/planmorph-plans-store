import React from 'react';
import { ScrollText } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-4xl">
      <div className="mb-12 border-b border-white/10 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary/10 rounded-xl text-primary shadow-glow">
            <ScrollText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Terms of Service</h1>
        </div>
        <p className="text-text-secondary font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <p className="lead text-xl text-text-secondary mb-10 leading-relaxed">
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the PlanMorph website (the "Service") operated by PlanMorph ("us", "we", or "our").
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-text-secondary mb-4">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section className="mb-10 p-8 glass-panel rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">2. Governing Law & Consumer Protection</h2>
          <p className="text-text-secondary mb-4">
            These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
          </p>
          <p className="text-text-secondary mb-4">
            We acknowledge and uphold your rights under the <strong>Consumer Protection Act, 2012</strong>. Nothing in these Terms is intended to limit any rights you may have under this Act. Specifically:
          </p>
          <ul className="list-disc pl-6 text-text-secondary space-y-2">
            <li>We are committed to providing clear and accurate information about our products and services.</li>
            <li>We do not engage in unfair trade practices or unconscionable conduct.</li>
            <li>Any ambiguity in this agreement will be interpreted to the benefit of the consumer.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">3. Digital Products & Refunds</h2>
          <p className="text-text-secondary mb-4">
            PlanMorph sells digital architectural plans ("Digital Goods"). Due to the nature of digital content, all sales are final. We do not offer refunds once the digital files have been downloaded or accessed, unless the files are proven to be defective or not as described, in accordance with the Consumer Protection Act.
          </p>
          <p className="text-text-secondary mb-4">
            By purchasing a plan, you are granted a non-exclusive, non-transferable license to use the design for a single construction project. You may not resell, redistribute, or reproduce the plans for commercial sale.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">4. Custom Design Services</h2>
          <p className="text-text-secondary mb-4">
            For custom design requests, a separate agreement will be provided detailing the scope of work, timelines, and payment terms. All custom designs are subject to local building codes and regulations. While we strive for compliance, it is the client's responsibility to ensure final approval from relevant local authorities (e.g., County Governments in Kenya).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">5. User Accounts</h2>
          <p className="text-text-secondary mb-4">
            When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
          <p className="text-text-secondary mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property of PlanMorph and its licensors. The Service is protected by copyright, trademark, and other laws of both Kenya and foreign countries.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">7. Changes</h2>
          <p className="text-text-secondary mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section className="mb-10 p-8 glass-panel rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
          <p className="text-text-secondary mb-4">
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc pl-6 text-text-secondary space-y-2">
            <li>By email: <a href="mailto:planmorph@gmail.com" className="text-primary hover:text-white transition-colors">planmorph@gmail.com</a></li>
            <li>By phone: <a href="tel:+254748767396" className="text-primary hover:text-white transition-colors">+254 748 767 396</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
