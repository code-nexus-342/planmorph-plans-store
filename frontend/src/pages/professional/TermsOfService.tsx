import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-text-secondary text-lg">Last Updated: December 2025</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-surface/50 space-y-8 text-text-secondary">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-accent" size={24} />
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using the PlanMorph Professional Portal, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Professional Accounts</h2>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Content and Intellectual Property</h2>
          <p className="mb-4">
            By uploading designs, CAD drawings, images, or other content ("User Content") to PlanMorph, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content on our platform.
          </p>
          <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-accent" />
              AI Training Consent
            </h3>
            <p className="text-white/90">
              You explicitly acknowledge and agree that any CAD drawings (uploaded as PDF) to the platform may be used by PlanMorph for the purpose of training our artificial intelligence models. This helps us improve our services, such as automated design analysis, cost estimation, and optimization suggestions. You represent and warrant that you have the necessary rights to grant this permission.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Termination</h2>
          <p>
            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall PlanMorph, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
