import React from 'react';
import { Lock, Eye } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-text-secondary text-lg">Last Updated: December 2025</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-surface/50 space-y-8 text-text-secondary">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="text-accent" size={24} />
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, update your profile, upload designs, or communicate with us. This may include your name, email address, phone number, professional credentials, and payment information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, including to process transactions, verify your professional status, and send you related information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="text-accent" size={24} />
            3. Data Usage for AI Training
          </h2>
          <p className="mb-4">
            As part of our commitment to innovation, we use certain data to train and improve our artificial intelligence models.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">CAD Drawings (PDF):</strong> Technical drawings uploaded to the platform are analyzed to improve our design recognition and optimization algorithms.
            </li>
            <li>
              <strong className="text-white">Anonymization:</strong> We take steps to anonymize data used for training where possible, removing personally identifiable information from the training datasets.
            </li>
            <li>
              <strong className="text-white">Security:</strong> All data used for training is stored securely and is not shared with third parties for their own training purposes without your explicit consent.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy or with your consent. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You may also object to the processing of your personal data, restrict its processing, or request portability of your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@planmorph.com" className="text-accent hover:underline">privacy@planmorph.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
