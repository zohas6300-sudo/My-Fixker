import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Globe, FileCheck, HelpCircle } from 'lucide-react';
import { CATEGORIES } from '../data/constants';

export default function LegalPages() {
  const getHash = () => {
    return window.location.hash.split('?')[0] || '#privacy';
  };

  const [activeTab, setActiveTab] = useState(getHash());

  useEffect(() => {
    setActiveTab(getHash());
  }, [window.location.hash]);

  const handleNavigate = (hash: string) => {
    window.location.hash = hash;
  };

  // Simulated Robots.txt
  const robotsTxt = `# robots.txt for FixKer.pk
User-agent: *
Allow: /
Disallow: /admin-dashboard
Disallow: /customer-dashboard
Disallow: /professional-dashboard

# Sitemap URL
Sitemap: https://fixker.pk/sitemap.xml`;

  // Simulated XML Sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://fixker.pk/</loc>
    <lastmod>2026-06-29</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fixker.pk/#about</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://fixker.pk/#services</loc>
    <lastmod>2026-06-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://fixker.pk/#faq</loc>
    <lastmod>2026-06-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://fixker.pk/#blog</loc>
    <lastmod>2026-06-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${CATEGORIES.map(cat => `
  <url>
    <loc>https://fixker.pk/#category?type=${cat.id}</loc>
    <lastmod>2026-06-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col space-y-8 text-left">
      
      {/* Selector Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2">
        <button
          onClick={() => handleNavigate('#privacy')}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${activeTab === '#privacy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => handleNavigate('#terms')}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${activeTab === '#terms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => handleNavigate('#sitemap')}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${activeTab === '#sitemap' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          XML Sitemap
        </button>
        <button
          onClick={() => handleNavigate('#robots')}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${activeTab === '#robots' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          robots.txt
        </button>
      </div>

      {/* Content Rendering */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-150 shadow-xs">
        
        {/* Privacy Policy */}
        {activeTab === '#privacy' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-800 flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              <span>Privacy Policy</span>
            </h1>
            <p className="text-xs text-slate-400">Last updated: June 29, 2026</p>
            
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>Welcome to FixKer.pk. We are highly committed to protecting your privacy. This policy details how we handle information supplied by customers, professionals, and partners in Pakistan.</p>
              
              <h3 className="font-extrabold text-slate-800 text-base">1. Information We Collect</h3>
              <p>When you register as a user, we collect personal variables such as your full name, email, phone number, city, and profile picture. For professionals, we also collect optional National ID Cards (CNIC) and certification details to complete our safety verification audit.</p>

              <h3 className="font-extrabold text-slate-800 text-base">2. How We Use Your Data</h3>
              <p>We use your details to connect customers with matching professionals. Professionals\' phone numbers, categories, and bio information are visible to the public to facilitate scheduling. If you book an expert, your address and contact phone are securely shared with them to execute the visit.</p>

              <h3 className="font-extrabold text-slate-800 text-base">3. WhatsApp Direct Sync</h3>
              <p>Our marketplace features direct WhatsApp redirection. By using this service, you understand that your chat and contact details are managed independently by WhatsApp Inc. in conformance with their terms.</p>

              <h3 className="font-extrabold text-slate-800 text-base">4. Data Security</h3>
              <p>Your passwords and profile data are stored and protected securely in Google Firebase infrastructure. We implement rigorous Firestore security rules to prevent unauthorized reads and edits.</p>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        {activeTab === '#terms' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-800 flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span>Terms & Conditions</span>
            </h1>
            <p className="text-xs text-slate-400">Last updated: June 29, 2026</p>
            
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>These terms govern your usage of FixKer.pk platform. By accessing or scheduling any handyman through our marketplace, you agree to these legal obligations.</p>
              
              <h3 className="font-extrabold text-slate-800 text-base">1. Platform Services</h3>
              <p>FixKer.pk is an on-demand listing directory and scheduling tool. We do not act as an employer or subcontractor. All contract agreements, service hours, and monetary payments are agreed upon directly between the customer and the professional.</p>

              <h3 className="font-extrabold text-slate-800 text-base">2. Professional Verification</h3>
              <p>While our team performs diligent CNIC checks, customers are advised to check credentials and practice standard domestic safety measures when inviting any technician inside their premises.</p>

              <h3 className="font-extrabold text-slate-800 text-base">3. platform Payments</h3>
              <p>FixKer.pk is currently 100% free with 0% commissions! Customers pay the professionals directly via cash on service, EasyPaisa, JazzCash, or bank transfer.</p>

              <h3 className="font-extrabold text-slate-800 text-base">4. Acceptable Conduct</h3>
              <p>Harassment, posting false review scores, or sharing invalid CNIC documents is strictly forbidden. The admin reserves absolute authority to suspend any user violating this code.</p>
            </div>
          </div>
        )}

        {/* XML Sitemap */}
        {activeTab === '#sitemap' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
              <Globe className="h-7 w-7 text-blue-600" />
              <span>Dynamic XML Sitemap Viewer</span>
            </h1>
            <p className="text-xs text-slate-400">Generated dynamically for Google Search Console crawlers to ensure full page indexing indexation.</p>
            <pre className="bg-slate-900 text-emerald-400 p-5 rounded-2xl text-[11px] overflow-x-auto font-mono select-all leading-relaxed max-h-96">
              {sitemapXml}
            </pre>
          </div>
        )}

        {/* robots.txt */}
        {activeTab === '#robots' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
              <FileCheck className="h-7 w-7 text-blue-600" />
              <span>robots.txt Configuration</span>
            </h1>
            <p className="text-xs text-slate-400">Directives configured for organic search engine spiders (Googlebot, Bingbot) to prevent indexing private dashboard folders.</p>
            <pre className="bg-slate-900 text-indigo-400 p-5 rounded-2xl text-xs overflow-x-auto font-mono select-all leading-relaxed">
              {robotsTxt}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
}
