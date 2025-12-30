import React, { useState, useEffect } from 'react';
import { MessageSquare, Zap, Shield, BarChart3, Check, ArrowRight, Menu, X, Sparkles, Users, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navigate = useNavigate();
  const features = [
    {
      icon: MessageSquare,
      title: "Smart Q&A System",
      description: "Manage unlimited Q&A pairs with intelligent matching and instant responses"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Deploy in minutes with our embeddable widget that loads in milliseconds"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and isolated data storage for each company"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track conversations, user engagement, and chatbot performance"
    },
    {
      icon: Users,
      title: "Multi-tenant Ready",
      description: "Manage multiple companies with role-based access control"
    },
    {
      icon: Code,
      title: "Easy Integration",
      description: "One line of code to add the chatbot to any website"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "49",
      description: "Perfect for small businesses",
      features: [
        "Up to 100 Q&As",
        "1,000 conversations/month",
        "Basic analytics",
        "Email support",
        "Custom branding"
      ]
    },
    {
      name: "Professional",
      price: "149",
      description: "For growing companies",
      features: [
        "Unlimited Q&As",
        "10,000 conversations/month",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
        "API access",
        "Team collaboration"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Unlimited conversations",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Training & onboarding"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}>
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ChatBot Pro
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Demo</a>

              <a
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Login
              </a>

              <a
                href="/onboarding"
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Get Started
              </a>
            </div>


            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-5">
              <a href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#pricing" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#demo" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">Demo</a>
              <button className="w-full px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium">
                Get Started
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>New: AI-Powered Responses Coming Soon</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Customer Support
              </span>
              <br />
              <span className="text-gray-900">Made Simple</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Deploy intelligent chatbots in minutes. Manage multiple clients with ease.
              Deliver exceptional customer experiences 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick = {()=>navigate('/login')}className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
                Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick = {() => navigate('/register')} className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200">
                Register
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-indigo-600/20 blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect fill='%23f8fafc' width='800' height='500'/%3E%3Ctext x='400' y='250' text-anchor='middle' fill='%2394a3b8' font-family='system-ui' font-size='20'%3EChatbot Dashboard Preview%3C/text%3E%3C/svg%3E"
                  alt="Dashboard Preview"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern customer support teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-linear-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${plan.popular
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 text-white shadow-2xl scale-105 hover:scale-110'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-2'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className={`${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>/month</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-blue-50' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg'
                    : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-1'
                  }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-linear-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of companies delivering exceptional customer experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent text-white rounded-xl font-semibold text-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">ChatBot Pro</span>
              </div>
              <p className="text-sm">
                Making customer support simple and effective for businesses worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 ChatBot Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}