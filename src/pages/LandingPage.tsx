import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  AlertCircle, 
  Gavel,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-text tracking-tight">DigiShield</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-text-muted hover:text-text font-medium transition-colors">Features</a>
          <a href="#solutions" className="text-text-muted hover:text-text font-medium transition-colors">Solutions</a>
          <a href="#about" className="text-text-muted hover:text-text font-medium transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-text font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Real-time Breach Monitoring
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-text mb-8 leading-tight">
            Protect Your Identity with <br />
            <span className="text-primary">Intelligence and Law</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
            A comprehensive platform for citizens, legal professionals, and government officials to monitor data breaches and manage cyber intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Start Free Monitoring <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/legal" className="px-8 py-4 border border-gray-200 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
              Access Legal Resources
            </Link>
          </div>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-20 relative px-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-5xl mx-auto overflow-hidden">
             <div className="h-4 flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-100"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
                <div className="w-3 h-3 rounded-full bg-green-100"></div>
             </div>
             <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-2">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-gray-50 rounded italic"></div>)}
                </div>
                <div className="col-span-9 space-y-4">
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-50 border border-gray-100 rounded-xl"></div>)}
                   </div>
                   <div className="h-64 bg-gray-50 border border-gray-100 rounded-xl"></div>
                </div>
             </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent pointer-events-none"></div>
        </motion.div>
      </header>

      {/* Benefits */}
      <section id="features" className="bg-secondary py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text mb-4">Comprehensive Solutions</h2>
            <p className="text-text-muted">Designed for clarity, efficiency, and compliance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Asset Monitoring", desc: "Monitor emails, phone numbers, and domains for any signs of exposure in real-time." },
              { icon: AlertCircle, title: "Instant Alerts", desc: "Receive immediate notifications when your data is found in a new breach with severity ratings." },
              { icon: Gavel, title: "Legal Intelligence", desc: "Access CERT-In advisories and legal frameworks to understand your rights and next steps." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof/Trust */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-text mb-6">Built for Everyone</h2>
            <ul className="space-y-6">
              {[
                { title: "For Citizens", desc: "Easy one-click monitoring for personal assets and family protection." },
                { title: "For Legal Professionals", desc: "Track client impacts and stay updated on latest cyber law changes." },
                { title: "For Government Officials", desc: "Domain-wide monitoring and intelligence aggregation." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text text-lg">{item.title}</h4>
                    <p className="text-text-muted">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                <div>
                   <p className="font-bold text-text text-lg">CERT-In Compliance</p>
                   <p className="text-sm text-text-muted">Intelligence Aggregator</p>
                </div>
             </div>
             <p className="text-text-muted italic text-lg leading-relaxed mb-6">
               "DigiShield provides the essential bridge between technical exposure and legal recourse, making it indispensable for modern digital safety."
             </p>
             <div className="h-1 bg-primary w-12 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-text tracking-tight">DigiShield</span>
            </div>
            <p className="text-text-muted max-w-sm mb-8">
              Protecting the digital lives of Indian citizens through advanced intelligence and proactive monitoring.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-text mb-6">Platform</h4>
            <ul className="space-y-4 text-text-muted">
              <li><Link to="/monitoring" className="hover:text-primary transition-colors">Monitoring</Link></li>
              <li><Link to="/alerts" className="hover:text-primary transition-colors">Alerts</Link></li>
              <li><Link to="/analytics" className="hover:text-primary transition-colors">Analytics</Link></li>
              <li><Link to="/legal" className="hover:text-primary transition-colors">Legal Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-text mb-6">Legal</h4>
            <ul className="space-y-4 text-text-muted">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Compliance Documents</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 text-center text-text-muted text-sm">
          © {new Date().getFullYear()} DigiShield. All rights reserved. Professional Real-time Cyber Intelligence Platform.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
