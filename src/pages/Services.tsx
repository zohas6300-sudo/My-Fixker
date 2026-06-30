import React from 'react';
import { CATEGORIES } from '../data/constants';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Wrench } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function Services() {
  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-8 w-8 text-blue-600" />;
    }
    return <Wrench className="h-8 w-8 text-blue-600" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col space-y-16">
      
      {/* Headings */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">OUR SERVICE DIRECTORY</span>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Explore Our Verified Service Categories
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          From fixing a minor plumbing leakage to a complex solar UPS installation, we connect you with specialized technicians who charge standard and pocket-friendly hourly rates.
        </p>
      </section>

      {/* Services Grid with Extended Details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id}
            className="bg-white p-8 rounded-3xl border border-slate-150 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                  {renderIcon(cat.icon)}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Base visit charges</span>
                  <span className="text-lg font-black text-blue-600">PKR {cat.basePrice}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              {/* Sub services / popular services */}
              <div className="pt-4 border-t border-slate-50 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popular Jobs & Sub-services:</span>
                <div className="flex flex-wrap gap-2">
                  {cat.popularServices.map((service, index) => (
                    <span 
                      key={index} 
                      className="bg-slate-50 text-slate-600 border border-slate-150 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigateTo(`#category?type=${cat.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Find {cat.name}s in My City</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Safety Standard CTA */}
      <section className="bg-blue-50 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2 text-blue-800">
            <ShieldCheck className="h-6 w-6 shrink-0" />
            <h4 className="font-extrabold text-lg">FixKer Safety & Satisfaction Standard</h4>
          </div>
          <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
            All prices are estimated on hourly basis or mutual consensus. If a professional requests any platform processing charges or upfront CNIC fee, please report it immediately to our helpline.
          </p>
        </div>
        <button
          onClick={() => navigateTo('#contact')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          Report an Issue
        </button>
      </section>

    </div>
  );
}
