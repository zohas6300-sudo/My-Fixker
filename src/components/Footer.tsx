import React from 'react';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  FileText,
  FileCheck
} from 'lucide-react';

export default function Footer() {
  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" id="main-footer">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Col 1: About & Info */}
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => navigateTo('#home')} 
              className="flex items-center space-x-2 text-2xl font-black tracking-tight text-white focus:outline-hidden text-left"
            >
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-lg font-bold">F</span>
              <span>FixKer<span className="text-blue-500">.pk</span></span>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pakistan\'s premium, most trusted on-demand marketplace connecting households and corporate offices with verified, top-tier technical professionals.
            </p>
            
            {/* Supported Regions */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Regional Expansion</span>
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="flex items-center space-x-1" title="Active">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>Pakistan 🇵🇰</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center space-x-1 text-slate-500" title="Coming Soon">
                  <span>India 🇮🇳</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center space-x-1 text-slate-500" title="Coming Soon">
                  <span>UAE 🇦🇪</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center space-x-1 text-slate-500" title="Coming Soon">
                  <span>UK 🇬🇧</span>
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Services</h4>
            <div className="flex flex-col space-y-2 text-sm text-slate-400">
              <button onClick={() => navigateTo('#category?type=ac-technician')} className="hover:text-white transition-colors text-left">AC Service & Repair</button>
              <button onClick={() => navigateTo('#category?type=electrician')} className="hover:text-white transition-colors text-left">Electrician Services</button>
              <button onClick={() => navigateTo('#category?type=plumber')} className="hover:text-white transition-colors text-left">Plumbing & Sanitary</button>
              <button onClick={() => navigateTo('#category?type=carpenter')} className="hover:text-white transition-colors text-left">Woodwork & Carpentry</button>
              <button onClick={() => navigateTo('#category?type=painter')} className="hover:text-white transition-colors text-left">Professional Painting</button>
              <button onClick={() => navigateTo('#category?type=cleaner')} className="hover:text-white transition-colors text-left">Deep Home Cleaning</button>
            </div>
          </div>

          {/* Col 3: Company & Information */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resources</h4>
            <div className="flex flex-col space-y-2 text-sm text-slate-400">
              <button onClick={() => navigateTo('#about')} className="hover:text-white transition-colors text-left">Our Mission & Story</button>
              <button onClick={() => navigateTo('#blog')} className="hover:text-white transition-colors text-left">Maintenance Blog</button>
              <button onClick={() => navigateTo('#faq')} className="hover:text-white transition-colors text-left">Frequently Asked Questions</button>
              <button onClick={() => navigateTo('#privacy')} className="hover:text-white transition-colors text-left flex items-center space-x-1">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>Privacy Policy</span>
              </button>
              <button onClick={() => navigateTo('#terms')} className="hover:text-white transition-colors text-left flex items-center space-x-1">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Terms & Conditions</span>
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Help */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Get in Touch</h4>
            <div className="flex flex-col space-y-3 text-sm text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Shop No.472, Mubeen Market, Gulgasht, Multan</span>
              </div>
              <a href="tel:+923006347836" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <span>+92 300 6347836</span>
              </a>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <span>support@fixker.pk</span>
              </div>
              
              <button 
                onClick={() => navigateTo('#contact')}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors mt-2"
              >
                Inquire or Give Feedback
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Footer (Sitemap, SEO, and copyright info) */}
      <div className="border-t border-slate-800 bg-slate-950/50 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500">
            <span>© {new Date().getFullYear()} FixKer.pk. All rights reserved.</span>
            <span>•</span>
            <button onClick={() => navigateTo('#sitemap')} className="hover:text-slate-300">XML Sitemap</button>
            <span>•</span>
            <button onClick={() => navigateTo('#robots')} className="hover:text-slate-300">robots.txt</button>
            <span>•</span>
            <span>SEO Optimized Marketplace Scheme</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Designed with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for households in Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
