import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-architect-900 rounded-none text-white">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl font-heading font-bold text-architect-900">Privacy Policy</h1>
        </div>
        <p className="text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="lead text-xl text-gray-600 mb-8">
          PlanMorph ("us", "we", or "our") operates the PlanMorph website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-architect-900 mb-4">1. Compliance with Kenyan Law</h2>
          <p className="text-gray-600 mb-4">
            This Privacy Policy is drafted in compliance with the Constitution of Kenya, 2010, and the Data Protection Act, 2019. We are committed to protecting your privacy and ensuring that your personal data is collected and processed lawfully, fairly, and transparently.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-architect-900 mb-4">2. Information Collection and Use</h2>
          <p className="text-gray-600 mb-4">
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <h3 className="text-xl font-bold text-architect-900 mb-2">Types of Data Collected</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.</li>
            <li><strong>Usage Data:</strong> We may also collect information how the Service is accessed and used ("Usage Data").</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-architect-900 mb-4">3. Use of Data</h2>
          <p className="text-gray-600 mb-4">
            PlanMorph uses the collected data for various purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-architect-900 mb-4">4. Your Rights Under the Data Protection Act, 2019</h2>
          <p className="text-gray-600 mb-4">
            Under the Data Protection Act, 2019 of Kenya, you have the following rights:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li><strong>Right to be informed:</strong> You have the right to be informed of the use to which your personal data is to be put.</li>
            <li><strong>Right of access:</strong> You have the right to access your personal data in our custody.</li>
            <li><strong>Right to object:</strong> You have the right to object to the processing of all or part of your personal data.</li>
            <li><strong>Right to correction:</strong> You have the right to correction of false or misleading data.</li>
            <li><strong>Right to deletion:</strong> You have the right to deletion of false or misleading data about you.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-architect-900 mb-4">5. Data Security</h2>
          <p className="text-gray-600 mb-4">
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-architect-900 mb-4">6. Service Providers</h2>
          <p className="text-gray-600 mb-4">
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-architect-900 mb-4">7. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>By email: planmorph@gmail.com</li>
            <li>By phone: +254 748 767 396</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
