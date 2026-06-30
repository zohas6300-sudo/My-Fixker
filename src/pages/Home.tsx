import React, { useState } from 'react';
import { CATEGORIES, CITIES } from '../data/constants';
import { 
  Search, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Star, 
  MessageSquareCode, 
  ArrowRight, 
  Users, 
  ThumbsUp, 
  Wrench,
  ShieldAlert
} from 'lucide-react';
import * as Icons from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('LaHore');
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hash = `#category?city=${selectedCity}`;
    if (selectedCategory) hash += `&type=${selectedCategory}`;
    if (searchQuery) hash += `&search=${encodeURIComponent(searchQuery)}`;
    navigateTo(hash);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6 text-blue-600" />;
    }
    return <Wrench className="h-6 w-6 text-blue-600" />;
  };

  return (
    <div className="flex flex-col space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[2.5rem] shadow-xl">
        {/* Subtle decorative background blur shapes */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-8 animate-fade-in">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-xs font-bold tracking-wider text-blue-200 uppercase shadow-md">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
            <span>100% Verified Local Professionals in Pakistan</span>
          </div>

          {/* Main Headings */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-5xl leading-tight">
            Your Trusted Partner For <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 font-extrabold">On-Demand Home Services</span>
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl font-medium">
            FixKer.pk connects you instantly with certified local plumbers, electricians, AC technicians, carpenters, and painters. Fast, secure, and hassle-free.
          </p>

          {/* Search Box Engine */}
          <form 
            onSubmit={handleSearchSubmit}
            className="w-full max-w-4xl bg-white p-3 rounded-2xl border border-slate-100 shadow-2xl flex flex-col md:flex-row gap-2.5 text-slate-800"
            id="search-form"
          >
            {/* City Selection */}
            <div className="flex items-center space-x-2 border-b md:border-b-0 md:border-r border-slate-150 px-3 py-2 md:w-1/4">
              <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs font-bold uppercase focus:outline-hidden text-slate-800"
              >
                {CITIES.map((city) => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Category selection */}
            <div className="flex items-center space-x-2 border-b md:border-b-0 md:border-r border-slate-150 px-3 py-2 md:w-1/3">
              <Wrench className="h-5 w-5 text-blue-600 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-bold uppercase focus:outline-hidden text-slate-800"
              >
                <option value="">All Services</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center space-x-2 px-3 py-2 flex-grow">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search plumber, wiring expert, deep clean..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs focus:outline-hidden font-semibold text-slate-700"
              />
            </div>

            {/* Find Button */}
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-8 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              <span>SEARCH NOW</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Popular Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-blue-200">
            <span className="font-bold text-white uppercase tracking-wider">Popular:</span>
            <button onClick={() => navigateTo('#category?type=ac-technician')} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded-full font-bold transition-all">AC General Service</button>
            <button onClick={() => navigateTo('#category?type=electrician')} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded-full font-bold transition-all">UPS Repair</button>
            <button onClick={() => navigateTo('#category?type=plumber')} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded-full font-bold transition-all">Water Pump Fix</button>
            <button onClick={() => navigateTo('#category?type=cleaner')} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded-full font-bold transition-all">Sofa Cleaning</button>
          </div>

        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-3 text-center items-center mb-12">
          <h2 className="text-3xl font-black text-slate-900">Our Premium Services</h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl font-medium">
            Choose from our highly-rated categories. All technicians are verified and background-checked by FixKer team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigateTo(`#category?type=${cat.id}`)}
              className="card-bold p-6 rounded-2xl cursor-pointer group flex flex-col space-y-4"
            >
              <div className="h-12 w-12 bg-blue-50 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300">
                <div className="group-hover:scale-110 group-hover:text-white transition-transform text-blue-600">
                  {renderIcon(cat.icon)}
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors uppercase">{cat.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">{cat.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Starts PKR {cat.basePrice}</span>
                <span className="text-blue-600 font-extrabold group-hover:translate-x-1 transition-transform flex items-center">
                  <span>BOOK NOW</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-50/50 border border-slate-100 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col space-y-3 mb-16">
            <h2 className="text-3xl font-black text-slate-900">How FixKer Works</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-xl mx-auto">
              Get your home issues fixed in four incredibly simple steps. No upfront fees, no complex procedures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="card-bold p-6 rounded-2xl flex flex-col items-center text-center space-y-4 relative hover:scale-[1.02]">
              <span className="absolute -top-4 bg-blue-600 text-white font-extrabold h-8 w-8 rounded-full flex items-center justify-center text-xs shadow-md">01</span>
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Icons.SlidersHorizontal className="h-5.5 w-5.5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Select Category</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Select the exact service category and specify your city filters.</p>
            </div>

            {/* Step 2 */}
            <div className="card-bold p-6 rounded-2xl flex flex-col items-center text-center space-y-4 relative hover:scale-[1.02]">
              <span className="absolute -top-4 bg-blue-600 text-white font-extrabold h-8 w-8 rounded-full flex items-center justify-center text-xs shadow-md">02</span>
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Icons.UserCheck className="h-5.5 w-5.5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Choose Pro</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Compare ratings, prices, experience, and past customer reviews.</p>
            </div>

            {/* Step 3 */}
            <div className="card-bold p-6 rounded-2xl flex flex-col items-center text-center space-y-4 relative hover:scale-[1.02]">
              <span className="absolute -top-4 bg-blue-600 text-white font-extrabold h-8 w-8 rounded-full flex items-center justify-center text-xs shadow-md">03</span>
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Icons.CalendarCheck className="h-5.5 w-5.5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Schedule Slot</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Book a timing slot. Coordinate instantly over WhatsApp if needed.</p>
            </div>

            {/* Step 4 */}
            <div className="card-bold p-6 rounded-2xl flex flex-col items-center text-center space-y-4 relative hover:scale-[1.02]">
              <span className="absolute -top-4 bg-blue-600 text-white font-extrabold h-8 w-8 rounded-full flex items-center justify-center text-xs shadow-md">04</span>
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Icons.BadgeCheck className="h-5.5 w-5.5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Get Job Done!</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">The expert completes the job. Pay cash, EasyPaisa, or bank transfer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-black text-blue-600 uppercase tracking-wider block">THE FIXKER PROMISE</span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Why Households Choose FixKer.pk For Technical Help
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            Finding high-quality, reliable, and trustworthy workers in Pakistan can be difficult. FixKer.pk solves this by implementing a rigorous background checking system and a community-driven rating ecosystem.
          </p>

          <div className="space-y-5">
            <div className="flex space-x-3 items-start">
              <div className="h-8.5 w-8.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 stroke-[2px]" />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-900 text-sm">Strict CNIC & Experience Audits</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">We audit every professional's National ID Card (CNIC) and verify their certifications and past history before approval.</p>
              </div>
            </div>

            <div className="flex space-x-3 items-start">
              <div className="h-8.5 w-8.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 stroke-[2px]" />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-900 text-sm">Real-time Booking & WhatsApp Sync</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">No intermediary delay. Book on the web app and directly chat with the professional on WhatsApp to speed up communication.</p>
              </div>
            </div>

            <div className="flex space-x-3 items-start">
              <div className="h-8.5 w-8.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <ThumbsUp className="h-5 w-5 stroke-[2px]" />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-900 text-sm">0% Commission For Professionals</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">Unlike international gig apps, we don't grab a percentage from hard-working local laborers. All money goes directly to them!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual collage */}
        <div className="relative h-96 bg-blue-50/30 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center p-8 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-650/5 to-transparent"></div>
          <div className="card-bold p-6 rounded-2xl max-w-md flex flex-col space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150" 
                alt="Kamran" 
                className="h-12 w-12 rounded-full border border-slate-100 object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-900 text-sm uppercase">Kamran Khan</span>
                  <span className="bg-amber-100 text-amber-800 text-[9px] px-2.5 py-0.5 rounded-full font-bold">Verified Pro</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold block">AC Service Expert • Lahore</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-amber-500 text-xs">
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <span className="text-xs font-bold text-slate-700 ml-1">4.9 (24 reviews)</span>
            </div>
            <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
              "Outstanding AC compressor repairs! Extremely professional, arrived on time with a ladder, and charged exactly what was listed on the app. No argument. Exceptional service."
            </p>
            <div className="text-[10px] text-slate-400 text-right font-bold uppercase">
              — Reviewed by <strong>Zohaib A.</strong>, Johar Town
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white rounded-[2rem] p-10 sm:p-14 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-lg border border-white/5">
        <div>
          <span className="text-5xl font-black block tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">1,500+</span>
          <span className="text-xs text-blue-200 uppercase tracking-wider font-bold mt-2.5 block">Jobs Completed</span>
        </div>
        <div>
          <span className="text-5xl font-black block tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">250+</span>
          <span className="text-xs text-blue-200 uppercase tracking-wider font-bold mt-2.5 block">Verified Professionals</span>
        </div>
        <div>
          <span className="text-5xl font-black block tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">4.8 / 5</span>
          <span className="text-xs text-blue-200 uppercase tracking-wider font-bold mt-2.5 block">Average Satisfaction</span>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2rem] p-10 sm:p-14 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-3 max-w-lg">
            <h2 className="text-3xl font-black leading-tight">Are You a Skilled Pro Looking For Extra Work?</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Register as an expert on FixKer.pk. Build your reputation, connect with thousands of local households in Pakistan, and enjoy <strong>0% commissions</strong>. Keep 100% of your earnings!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 relative z-10">
            <button 
              onClick={() => navigateTo('#signup')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3.5 px-8 rounded-xl text-center text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Register as Professional
            </button>
            <button 
              onClick={() => navigateTo('#about')}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold py-3.5 px-8 rounded-xl text-center text-sm transition-all cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
