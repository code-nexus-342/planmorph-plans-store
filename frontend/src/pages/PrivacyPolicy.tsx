import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-4xl">
      <div className="mb-12 border-b border-white/10 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-primary/10 rounded-xl text-primary shadow-glow">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Privacy Policy</h1>
        </div>
        <p className="text-text-secondary font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <p className="lead text-xl text-text-secondary mb-10 leading-relaxed">
          PlanMorph ("us", "we", or "our") operates the PlanMorph website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>

        <section className="mb-12 p-8 glass-panel rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">1. Compliance with Kenyan Law</h2>
          <p className="text-text-secondary mb-4">
            This Privacy Policy is drafted in compliance with the <strong>Constitution of Kenya, 2010</strong>, and the <strong>Data Protection Act, 2019</strong>. We are committed to protecting your privacy and ensuring that your personal data is collected and processed lawfully, fairly, and transparently.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">2. Lawful Basis for Processing</h2>
          <p className="text-text-secondary mb-4">
            Under the Data Protection Act, 2019, we process your personal data under the following lawful bases:
          </p>
          <ul className="list-disc pl-6 text-text-secondary space-y-2">
            <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for a specific purpose (e.g., subscribing to newsletters).</li>
            <li><strong>Contract:</strong> The processing is necessary for a contract we have with you, or because you have asked us to take specific steps before entering into a contract (e.g., purchasing a plan).</li>
            <li><strong>Legal Obligation:</strong> The processing is necessary for us to comply with the law (e.g., tax records).</li>
            <li><strong>Legitimate Interests:</strong> The processing is necessary for our legitimate interests or the legitimate interests of a third party, unless there is a good reason to protect your personal data which overrides those legitimate interests.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">3. Information Collection and Use</h2>
          <p className="text-text-secondary mb-4">
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <h3 className="text-xl font-bold text-white mb-3">Types of Data Collected</h3>
          <ul className="list-disc pl-6 text-text-secondary mb-4 space-y-2">
            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.</li>
            <li><strong>Usage Data:</strong> We may also collect information how the Service is accessed and used ("Usage Data").</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">4. Use of Data</h2>
          <p className="text-text-secondary mb-4">
            PlanMorph uses the collected data for various purposes:
          </p>
          <ul className="list-disc pl-6 text-text-secondary space-y-2">
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights Under the Data Protection Act, 2019</h2>
          <p className="text-text-secondary mb-4">
            Under the Data Protection Act, 2019 of Kenya, you have the following rights:
          </p>
          <ul className="list-disc pl-6 text-text-secondary space-y-2">
            <li><strong>Right to be informed:</strong> You have the right to be informed of the use to which your personal data is to be put.</li>
            <li><strong>Right of access:</strong> You have the right to access your personal data in our custody.</li>
            <li><strong>Right to object:</strong> You have the right to object to the processing of all or part of your personal data.</li>
            <li><strong>Right to correction:</strong> You have the right to correction of false or misleading data.</li>
            <li><strong>Right to deletion:</strong> You have the right to deletion of false or misleading data about you.</li>
            <li><strong>Right to data portability:</strong> You have the right to receive personal data concerning you in a structured, commonly used and machine-readable format.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
          <p className="text-text-secondary mb-4">
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">7. Service Providers</h2>
          <p className="text-text-secondary mb-4">
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="mb-10 p-8 glass-panel rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
          <p className="text-text-secondary mb-4">
            If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
