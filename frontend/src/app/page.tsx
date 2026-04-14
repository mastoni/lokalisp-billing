'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  CreditCard,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Menu,
  X,
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Billing Sembok
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 font-medium transition">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 font-medium transition">
                About
              </a>
              <Link
                href="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-primary-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              >
                Pricing
              </a>
              <a
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              >
                About
              </a>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-primary-600 font-bold"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 lg:py-32">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400 blur-[100px]"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
              Simplify Your <span className="text-primary-200">ISP Billing</span>
            </h1>
            <p className="text-base md:text-2xl lg:text-3xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              The complete billing and management solution for Internet Service Providers. 
              Automate invoicing, track payments, and grow your business with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition inline-flex items-center justify-center shadow-2xl shadow-black/20"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="bg-primary-500/20 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition inline-flex items-center justify-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-10 sm:-mt-16 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8">
            <div className="text-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
              <div className="text-3xl md:text-6xl font-extrabold text-primary-600 mb-2">500+</div>
              <div className="text-gray-500 font-medium text-sm md:text-lg uppercase tracking-wider">Active ISPs</div>
            </div>
            <div className="text-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
              <div className="text-3xl md:text-6xl font-extrabold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-500 font-medium text-sm md:text-lg uppercase tracking-wider">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-6xl font-extrabold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-500 font-medium text-sm md:text-lg uppercase tracking-wider">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-20">
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-sm md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to streamline your ISP billing and management, designed for modern ISPs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary-600" />}
              title="Customer Management"
              description="Easily manage customer accounts, subscriptions, and service plans in one integrated dashboard."
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary-600" />}
              title="Invoice Generation"
              description="Automatically generate professional invoices with customizable templates and automated delivery."
            />
            <FeatureCard
              icon={<CreditCard className="h-10 w-10 text-primary-600" />}
              title="Payment Tracking"
              description="Record and monitor all payments with real-time status updates and payment gateway integration."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary-600" />}
              title="Analytics & Reports"
              description="Gain deep business insights with comprehensive reports and visual real-time analytics."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary-600" />}
              title="Secure & Reliable"
              description="Enterprise-grade security with multi-factor authentication and bank-level data encryption."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary-600" />}
              title="Automated Workflows"
              description="Save hours each week with automated billing cycles, grace periods, and late notifications."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-20">
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees. Scale your business with our flexible pricing plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <PricingCard
              name="Starter"
              price="$29"
              description="Perfect for small local ISPs"
              features={[
                'Up to 100 customers',
                'Basic invoicing',
                'Payment tracking',
                'Email support',
              ]}
            />
            <PricingCard
              name="Professional"
              price="$79"
              description="Best for growing ISP businesses"
              features={[
                'Up to 500 customers',
                'Advanced invoicing',
                'Analytics & reports',
                'Priority support',
                'Automated workflows',
              ]}
              highlighted={true}
            />
            <PricingCard
              name="Enterprise"
              price="$199"
              description="For large-scale ISP operations"
              features={[
                'Unlimited customers',
                'Full feature access',
                'Custom integrations',
                '24/7 dedicated support',
                'Dedicated account manager',
                'REST API access',
              ]}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-20 right-20 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              
              <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Built for ISPs,<br /> <span className="text-primary-600">by ISP Experts</span>
              </h2>
              <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                We understand the unique challenges that Internet Service Providers face because we've lived them.
                Billing Sembok is designed specifically to solve those headaches with intuitive
                tools and powerful automation that just works.
              </p>
              <ul className="space-y-4 mb-8">
                <ListItem>Easy setup and onboarding in under 30 minutes</ListItem>
                <ListItem>Scalable infrastructure that grows with your business</ListItem>
                <ListItem>Regular feature updates based on user feedback</ListItem>
                <ListItem>Community and dedicated enterprise support teams</ListItem>
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-8 sm:p-12 rounded-2xl shadow-2xl">
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 p-3 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-xl font-bold text-gray-900">Quick Integration</h3>
                      <p className="text-gray-600 mt-1">Connect with Mikrotik, OLTs, and your existing network stack in minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 p-3 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-xl font-bold text-gray-900">Seamless Migration</h3>
                      <p className="text-gray-600 mt-1">Our team helps you port your existing data from spreadsheets or old software.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 p-3 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-5">
                      <h3 className="text-xl font-bold text-gray-900">Expert Support</h3>
                      <p className="text-gray-600 mt-1">Get help from people who actually know what a 'PPPoE session' is.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary-600/30">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
                Ready to Streamline Your Billing?
              </h2>
              <p className="text-lg sm:text-xl mb-10 text-primary-100 max-w-2xl mx-auto">
                Join hundreds of ISPs who have already eliminated billing headaches with Billing Sembok.
                "Jangan Ambil Pusing" - let us handle the hard work.
              </p>
              <Link
                href="/login"
                className="bg-white text-primary-600 px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-gray-100 transition inline-flex items-center shadow-xl"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
              <p className="mt-6 text-primary-200/80 text-sm font-medium">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Zap className="h-10 w-10 text-primary-400" />
                <span className="ml-3 text-2xl font-bold">Billing Sembok</span>
              </div>
              <p className="text-gray-400 text-lg max-w-sm mb-8">
                The complete billing and management solution for Internet Service Providers. 
                Automate your business and focus on what matters.
              </p>
              <div className="flex space-x-6">
                {/* Social placeholders */}
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition cursor-pointer"><Globe className="w-5 h-5" /></div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition cursor-pointer"><Mail className="w-5 h-5" /></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl md:text-2xl mb-6">Product</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl md:text-2xl mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-3 text-primary-400" />
                  support@sembokbill.com
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-3 text-primary-400" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center text-gray-400">
                  <Globe className="h-5 w-5 mr-3 text-primary-400" />
                  www.sembokbill.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500">
            <p className="text-sm md:text-base">&copy; 2026 Billing Sembok. "Jangan Ambil Pusing". All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="mb-6 bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:rotate-6 transition-all duration-300">
        <div className="group-hover:text-white transition-colors duration-300">{icon}</div>
      </div>
      <h3 className="text-xl md:text-3xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm md:text-xl">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative bg-white rounded-[2rem] p-10 transition-all duration-300 ${
        highlighted
          ? 'shadow-2xl border-4 border-primary-600 md:scale-105 z-10'
          : 'shadow-lg border border-gray-100 hover:shadow-xl'
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white text-center py-2 px-6 rounded-full text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary-600/40">
          Most Popular
        </div>
      )}
      <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-6 flex items-baseline">
        <span className="text-4xl md:text-7xl font-extrabold text-gray-900">{price}</span>
        <span className="text-gray-500 ml-2 font-medium text-sm md:text-lg">/month</span>
      </div>
      <p className="text-gray-600 mb-8 font-medium text-base md:text-xl leading-snug">{description}</p>
      <ul className="space-y-4 mb-10">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <span className="text-gray-700 ml-3 font-medium text-sm md:text-lg">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={`block text-center py-5 px-8 rounded-2xl font-extrabold text-lg transition-all duration-300 ${
          highlighted
            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-600/30'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Get Started
      </Link>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <div className="bg-primary-100 p-1 rounded-full">
          <CheckCircle className="h-5 w-5 text-primary-600" />
        </div>
      </div>
      <span className="text-gray-700 ml-4 font-medium text-sm md:text-lg tracking-wide">{children}</span>
    </li>
  );
}

