import React, { useState } from 'react';
import { FAQS } from '../data/constants';
import { HelpCircle, ChevronDown, ChevronUp, UserCheck, Briefcase } from 'lucide-react';

export default function FAQPage() {
  const [filterRole, setFilterRole] = useState<'all' | 'customer' | 'professional'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(faq => {
    if (filterRole === 'all') return true;
    return faq.role === filterRole || faq.role === 'all';
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col space-y-12 text-left">
      
      {/* Header */}
      <section className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">SUPPORT CENTER</span>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Everything you need to know about scheduling a handyman, verification badges, payment modes, and platform guidelines on FixKer.pk.
        </p>
      </section>

      {/* Role Filters */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setFilterRole('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${filterRole === 'all' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All Questions
        </button>
        <button
          onClick={() => setFilterRole('customer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${filterRole === 'customer' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <UserCheck className="h-4 w-4" />
          <span>For Customers</span>
        </button>
        <button
          onClick={() => setFilterRole('professional')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${filterRole === 'professional' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <Briefcase className="h-4 w-4" />
          <span>For Professionals</span>
        </button>
      </div>

      {/* FAQ Accordion List */}
      <section className="space-y-4 max-w-3xl mx-auto w-full">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div 
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors focus:outline-hidden cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5.5 w-5.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">{faq.question}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-50 text-slate-600 text-xs sm:text-sm leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Didn't solve helper CTA */}
      <section className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-4">
        <h4 className="font-extrabold text-slate-800 text-lg">Still have questions?</h4>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          Can\'t find the answer you\'re looking for? Contact our active helpline directly on WhatsApp, or raise a support ticket on our Contact page.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.hash = '#contact'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Submit Support Ticket
          </button>
          <button
            onClick={() => window.open('https://wa.me/923000000000', '_blank')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            WhatsApp Helpline
          </button>
        </div>
      </section>

    </div>
  );
}
