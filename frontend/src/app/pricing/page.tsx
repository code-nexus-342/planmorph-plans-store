"use client";
import { useState } from 'react';
import { Check, X, Star, Crown, Shield, Zap, Download, Users, Clock, Phone, Mail, MessageCircle } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  badge?: string;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'premium';
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'forever',
    description: 'Perfect for browsing and getting started with home planning.',
    features: [
      'Browse all house plans',
      'View basic plan details',
      'Access to image galleries',
      'Basic search and filters',
      'Save up to 5 favorites',
      'Email support'
    ],
    limitations: [
      'No plan downloads',
      'No customization requests',
      'Limited support'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'secondary'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 29,
    period: 'month',
    description: 'Ideal for homeowners ready to start their building project.',
    features: [
      'Everything in Basic',
      'Download up to 3 plans per month',
      'High-resolution plan images',
      'Basic customization requests',
      'Priority email support',
      'Access to exclusive plans',
      'Material lists included',
      'Build guides and tips'
    ],
    popular: true,
    buttonText: 'Start Standard Plan',
    buttonVariant: 'primary'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    period: 'month',
    description: 'Complete solution for serious builders and professionals.',
    features: [
      'Everything in Standard',
      'Unlimited plan downloads',
      'CAD files included',
      'Custom modification requests',
      'Direct architect consultation',
      'Phone support',
      '3D renderings available',
      'Construction timeline support',
      'Contractor network access',
      'Project management tools'
    ],
    badge: 'Most Popular',
    buttonText: 'Go Premium',
    buttonVariant: 'premium'
  }
];

const enterpriseFeatures = [
  'Volume licensing for multiple projects',
  'Dedicated account manager',
  'Custom plan development',
  'White-label solutions',
  'API access',
  'Priority feature requests',
  'On-site training',
  'Advanced analytics'
];

const faqs = [
  {
    question: 'Can I change my plan at any time?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
  },
  {
    question: 'What happens to my downloads if I cancel?',
    answer: 'Any plans you\'ve downloaded remain yours to keep. However, you won\'t be able to download new plans or access premium features after cancellation.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.'
  },
  {
    question: 'Can I get a custom plan designed?',
    answer: 'Yes! Premium subscribers can request custom modifications, and Enterprise customers get access to our full custom design services.'
  },
  {
    question: 'Are there any setup fees?',
    answer: 'No setup fees ever. The price you see is exactly what you pay, with no hidden charges.'
  },
  {
    question: 'Do you offer discounts for annual payments?',
    answer: 'Yes! Annual subscribers get 2 months free. Contact us for current pricing on yearly plans.'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'premium':
        return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700';
      default:
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
    }
  };

  const PricingCard = ({ plan }: { plan: PricingPlan }) => (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
    }`}>
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            {plan.badge}
          </div>
        </div>
      )}
      
      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-6">{plan.description}</p>
          
          <div className="mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600 ml-1">/{plan.period}</span>
            </div>
            {billingPeriod === 'yearly' && plan.price > 0 && (
              <div className="text-green-600 text-sm mt-2">
                Save ${Math.round(plan.price * 12 * 0.17)} per year
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
          
          {plan.limitations && plan.limitations.map((limitation, index) => (
            <div key={index} className="flex items-start">
              <X className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-500">{limitation}</span>
            </div>
          ))}
        </div>

        <button
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${getButtonStyles(plan.buttonVariant)}`}
        >
          {plan.buttonText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your home building journey. From browsing to building, 
              we have options that scale with your needs.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-white' : 'text-blue-200'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-blue-500 rounded-full p-1 transition-colors duration-200"
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-lg ${billingPeriod === 'yearly' ? 'text-white' : 'text-blue-200'}`}>
                Yearly
              </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                Save 17%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map(plan => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-white mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Crown className="w-8 h-8 text-yellow-400 mr-3" />
                <h3 className="text-3xl font-bold">Enterprise</h3>
              </div>
              <p className="text-gray-300 text-lg mb-6">
                Custom solutions for large-scale projects, development companies, and organizations 
                with specific requirements.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {enterpriseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Shield className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Sales
              </button>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-4xl font-bold mb-2">Custom</div>
              <div className="text-gray-300 mb-8">Pricing based on your needs</div>
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-end text-gray-300">
                  <Phone className="w-5 h-5 mr-2" />
                  +1 (555) 123-PLAN
                </div>
                <div className="flex items-center justify-center lg:justify-end text-gray-300">
                  <Mail className="w-5 h-5 mr-2" />
                  enterprise@planmorph.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See exactly what's included in each plan to find the perfect fit for your project.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Basic</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Standard</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Plan Downloads</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">3/month</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Customization Requests</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">CAD Files</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Architect Consultation</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Support</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">Email</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">Priority Email</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">Phone + Email</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our pricing? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <div className={`transform transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team is here to help you find the perfect plan for your needs. 
              Get in touch and we'll guide you through the options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
              <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
