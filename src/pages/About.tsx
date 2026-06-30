import React from 'react';
import { ShieldCheck, Target, Users, Globe, Award } from 'lucide-react';

export default function About() {
  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">OUR MISSION & VISION</span>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Pioneering Trust in Pakistan\'s Home Service Industry
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          FixKer.pk was founded in 2026 to bridge the massive gap between households looking for quick, high-quality technical support and certified local professionals looking for stable jobs.
        </p>
      </section>

      {/* Main Vision Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Why We Exist</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Finding a plumber, an AC technician, or an electrician in Pakistan has historically relied on word of mouth or visiting local bazaars. There was no way to check price standards, verify identity, or ensure quality of work.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            FixKer.pk fixes this by providing an online platform built on transparency, review scores, CNIC auditing, and direct communication. We empower local workers with technical toolkits and digital reputation engines, while giving clients immediate access to verified help.
          </p>
          <div className="pt-2 flex space-x-4">
            <button
              onClick={() => navigateTo('#services')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-lg transition-colors cursor-pointer"
            >
              Explore Our Services
            </button>
            <button
              onClick={() => navigateTo('#contact')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-3 rounded-lg transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Visual Info Block */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <h3 className="font-bold text-xl mb-4">FixKer Core Values</h3>
          <div className="space-y-4">
            <div className="flex space-x-3 items-start">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm">Strict Honesty</h5>
                <p className="text-xs text-slate-300">Absolute integrity in ratings, prices, and CNIC audit reviews.</p>
              </div>
            </div>
            <div className="flex space-x-3 items-start">
              <Target className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm">Professional Support</h5>
                <p className="text-xs text-slate-300">Empowering local micro-entrepreneurs by charging 0% platform commission fees.</p>
              </div>
            </div>
            <div className="flex space-x-3 items-start">
              <Users className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm">Safety First</h5>
                <p className="text-xs text-slate-300">Continuous review monitoring and client feedback checks for peace of mind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Expansion Roadmap */}
      <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Globe className="h-8 w-8 text-blue-600 mx-auto" />
          <h3 className="text-2xl font-black text-slate-800">Our Future Expansion Roadmap</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            While we are currently serving major cities in Pakistan (Lahore, Karachi, Islamabad), our ultimate goal is to scale this secure, community-driven service globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center">
            <span className="text-2xl mb-2">🇵🇰</span>
            <h5 className="font-bold text-slate-800 text-sm">Pakistan</h5>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase mt-2">Active</span>
            <p className="text-[11px] text-slate-400 mt-2">Currently live in 10 major cities including Karachi, Lahore, and Islamabad.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center">
            <span className="text-2xl mb-2">🇺🇦</span>
            <h5 className="font-bold text-slate-800 text-sm">UAE</h5>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase mt-2">Q1 2027</span>
            <p className="text-[11px] text-slate-400 mt-2">Planned launch for Dubai & Sharjah, catering to Pakistani & South Asian expatriates.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center">
            <span className="text-2xl mb-2">🇮🇳</span>
            <h5 className="font-bold text-slate-800 text-sm">India</h5>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase mt-2">Q3 2027</span>
            <p className="text-[11px] text-slate-400 mt-2">Expansion to Delhi NCR, Mumbai and Bengaluru following local regulations setup.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center">
            <span className="text-2xl mb-2">🇬🇧</span>
            <h5 className="font-bold text-slate-800 text-sm">United Kingdom</h5>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase mt-2">2028 Plan</span>
            <p className="text-[11px] text-slate-400 mt-2">Providing a localized handyman scheduling service across London, Manchester and Birmingham.</p>
          </div>
        </div>
      </section>

      {/* Leadership / Founder section */}
      <section className="text-center space-y-6">
        <Award className="h-8 w-8 text-blue-600 mx-auto" />
        <h3 className="text-2xl font-black text-slate-800">Our Founding Visionaries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 flex flex-col items-center space-y-3">
            <img 
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=founder1" 
              alt="Co-Founder" 
              className="h-20 w-20 rounded-full border border-blue-100"
              referrerPolicy="no-referrer"
            />
            <div>
              <h5 className="font-bold text-slate-800">Muhammad Zohaib</h5>
              <span className="text-xs text-blue-600 block">Founder & CEO</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Passionate software product designer focused on transforming daily utility problems using accessible mobile and web solutions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-150 flex flex-col items-center space-y-3">
            <img 
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=founder2" 
              alt="Co-Founder" 
              className="h-20 w-20 rounded-full border border-blue-100"
              referrerPolicy="no-referrer"
            />
            <div>
              <h5 className="font-bold text-slate-800">Amna Bibi</h5>
              <span className="text-xs text-blue-600 block">Head of Pro Auditing</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supervises national ID verification, safety protocols compliance, and user protection policies in Lahore HQ.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
