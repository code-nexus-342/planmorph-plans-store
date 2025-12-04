import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const design = location.state?.design;

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  if (!design) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">No plan selected</h2>
        <Button onClick={() => navigate('/designs')}>Browse Plans</Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setStep(3); // Success step
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-24 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div className="bg-white border border-gray-200 shadow-soft p-8">
              <h2 className="text-2xl font-heading font-bold text-architect-900 mb-6">Billing Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Phone Number (M-Pesa)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="07XX XXX XXX"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-gray-200 shadow-soft p-8">
              <h2 className="text-2xl font-heading font-bold text-architect-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-8">
                <div 
                  className={`border p-4 cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'mpesa' ? 'border-accent-teal bg-accent-teal/5' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-500 text-white rounded">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-architect-900">M-Pesa</h3>
                      <p className="text-sm text-gray-500">Pay directly from your phone</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'mpesa' ? 'border-accent-teal' : 'border-gray-300'}`}>
                    {paymentMethod === 'mpesa' && <div className="w-3 h-3 rounded-full bg-accent-teal" />}
                  </div>
                </div>

                <div 
                  className={`border p-4 cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'border-accent-teal bg-accent-teal/5' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600 text-white rounded">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-architect-900">Credit / Debit Card</h3>
                      <p className="text-sm text-gray-500">Secure payment via Stripe</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-accent-teal' : 'border-gray-300'}`}>
                    {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-accent-teal" />}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handlePayment} isLoading={isLoading}>
                  Pay KES {design.price.toLocaleString()}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white border border-gray-200 shadow-soft p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-architect-900 mb-4">Payment Successful!</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Thank you for your purchase. Your plans are now available for download in your library. A receipt has been sent to your email.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate('/purchases')}>Go to My Library</Button>
                <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-architect-900 mb-4 uppercase tracking-wider">Order Summary</h3>
            
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <img src={design.image_url} alt={design.title} className="w-20 h-20 object-cover border border-gray-200" />
              <div>
                <h4 className="font-bold text-architect-900">{design.title}</h4>
                <p className="text-sm text-gray-500">{design.category}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-architect-900">KES {design.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (16% VAT)</span>
                <span className="font-bold text-architect-900">KES {(design.price * 0.16).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-architect-900 mb-8">
              <span>Total</span>
              <span>KES {(design.price * 1.16).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={16} className="text-green-600" />
              <span>Secure Checkout. 100% Money Back Guarantee.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
