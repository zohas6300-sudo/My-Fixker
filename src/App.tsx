import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPages from './pages/AuthPages';
import LegalPages from './pages/LegalPages';
import FAQPage from './pages/FAQPage';
import BlogPage from './pages/BlogPage';

function AppContent() {
  const { loading, user, userProfile } = useAuth();
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#home');

  // Listen to hash changes for robust routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // SEO & Schema Markup Injection engine
  useEffect(() => {
    const route = currentHash.split('?')[0];
    let title = 'FixKer.pk | Verified On-Demand Local Professionals in Pakistan';
    let description = 'Connect with verified local plumbers, electricians, AC technicians, cleaners, painters, and carpenters in Lahore, Karachi, Islamabad.';
    let schema = {};

    switch (route) {
      case '#home':
        title = 'FixKer.pk | Verified On-Demand Local Professionals in Pakistan';
        description = 'Connect with verified local plumbers, electricians, AC technicians, cleaners, painters, and carpenters in Lahore, Karachi, Islamabad.';
        schema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "FixKer.pk",
          "url": "https://fixker.pk",
          "description": "On-Demand Household Services Directory for Pakistan",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://fixker.pk/#category?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        break;
      case '#about':
        title = 'Our Mission & Story | FixKer.pk';
        description = 'Discover why FixKer was created: bridging the safety gap in on-demand services across Pakistan while charging 0% platform commissions.';
        schema = {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About FixKer.pk",
          "description": "Our mission, core values, and founding team story."
        };
        break;
      case '#contact':
        title = 'Contact Helpline & Support | FixKer.pk';
        description = 'Reach out to Multan headquarters for professional profile registration help or submit customer service inquiries.';
        schema = {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact FixKer.pk Support",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+92-300-6347836",
            "contactType": "Customer Support",
            "areaServed": "PK"
          }
        };
        break;
      case '#services':
        title = 'Verified Household Services Directory | FixKer.pk';
        description = 'Explore professional AC general services, short-circuit troubleshooting, geyser repair, home paint, door fixing, and vacuuming.';
        schema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Handyman and AC Repair Services",
          "provider": {
            "@type": "LocalBusiness",
            "name": "FixKer.pk",
            "address": "Shop No.472, Mubeen Market, Gulgasht, Multan, Pakistan"
          }
        };
        break;
      case '#category':
        title = 'Find Verified Professionals & Handymen | FixKer.pk';
        description = 'Compare pricing rates, customer rating stars, CNIC status and book immediate appointments in Lahore, Karachi, Islamabad.';
        break;
      case '#faq':
        title = 'Help & FAQ Guide | FixKer.pk';
        description = 'Answers about CNIC verification audits, service hourly rate estimates, and direct WhatsApp contact guidelines.';
        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do you verify professionals?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Every technician undergoes identity audits, CNIC collection, and history screening before approval."
              }
            }
          ]
        };
        break;
      case '#blog':
        title = 'Home Maintenance Tips & Expert Advice | FixKer.pk Hub';
        description = 'Read tutorials written by certified Pakistani technicians about fixing AC cooling leaks, monsoon home safety, and seem damp prevention.';
        break;
      case '#login':
      case '#signup':
        title = 'Secure Member Authentication Portal | FixKer.pk';
        break;
      case '#customer-dashboard':
        title = 'My Customer Dashboard | FixKer.pk';
        break;
      case '#professional-dashboard':
        title = 'My Professional Workspace | FixKer.pk';
        break;
      case '#admin-dashboard':
        title = 'Master Admin Control Panel | FixKer.pk';
        break;
    }

    // Apply Meta updates to HTML Header dynamically
    document.title = title;
    
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', description);

    // Inject dynamic JSON-LD Schema Script
    let schemaScript = document.getElementById('jsonld-schema');
    if (schemaScript) {
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'jsonld-schema');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

  }, [currentHash]);

  // Route resolver helper
  const renderPage = () => {
    const route = currentHash.split('?')[0];

    switch (route) {
      case '#home':
        return <Home />;
      case '#about':
        return <About />;
      case '#contact':
        return <Contact />;
      case '#services':
        return <Services />;
      case '#category':
        return <CategoryPage />;
      case '#profile':
        return <ProfilePage />;
      case '#customer-dashboard':
        return <CustomerDashboard />;
      case '#professional-dashboard':
        return <ProfessionalDashboard />;
      case '#admin-dashboard':
        return <AdminDashboard />;
      case '#login':
      case '#signup':
      case '#forgot':
        return <AuthPages />;
      case '#privacy':
      case '#terms':
      case '#sitemap':
      case '#robots':
        return <LegalPages />;
      case '#faq':
        return <FAQPage />;
      case '#blog':
        return <BlogPage />;
      default:
        return <Home />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        {/* Spinner element */}
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <span className="absolute font-black text-blue-600 text-sm">F</span>
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-extrabold text-slate-800 text-lg">FixKer.pk</h3>
          <p className="text-xs text-slate-400">Loading verified household professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="applet-viewport">
      <div>
        <Navbar />
        <main className="transition-all duration-300">
          {renderPage()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
