import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Inquiry');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setTicketId(`FK-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitting(false);
      setSuccess(true);
      
      // Reset
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  const handleWhatsAppChat = () => {
    window.open('https://wa.me/923006347836?text=Hello%20FixKer%20Support!%20I%20need%20help.', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col space-y-16">
      
      {/* Headings */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">CONTACT US</span>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">We Are Here to Assist You!</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Have a question about booking, CNIC audits, or commission-free listings? Fill out the form or chat directly with our active support desk.
        </p>
      </section>

      {/* Main Grid: Form vs Info */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
            
            <h3 className="font-bold text-xl">Headquarters</h3>
            
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Shop No.472, Mubeen Market, Gulgasht, Multan</span>
              </div>
              <a href="tel:+923006347836" className="flex items-center space-x-3 hover:text-white transition-colors">
                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                <span>+92 300 6347836</span>
              </a>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <span>support@fixker.pk</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Support Timings</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monday to Saturday: 09:00 AM – 06:00 PM (PKT)<br />
                Sunday Support: Emergency AC/Plumbing Only
              </p>
            </div>
          </div>

          {/* Quick WhatsApp Support Call */}
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
                <MessageCircle className="h-3 w-3" />
                <span>WhatsApp Desk</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Need Instant Support?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chat directly with our Multan helpline desk. Get quick answers about registration issues or user disputes.
              </p>
            </div>
            <button
              onClick={handleWhatsAppChat}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Message Helpline</span>
            </button>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-2">
          {success ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-150 text-center space-y-4 shadow-xs flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-800">Inquiry Submitted!</h4>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                Thank you for contacting FixKer.pk. Your message was processed successfully and we have created a dynamic help ticket for your record:
              </p>
              <div className="bg-slate-50 border border-slate-200 py-2.5 px-6 rounded-lg font-mono font-bold text-slate-700 text-sm">
                Ticket ID: {ticketId}
              </div>
              <p className="text-xs text-slate-400">
                Our customer coordination desk will email or WhatsApp you at your provided details within 12–24 business hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg text-xs transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-150 shadow-xs space-y-6">
              <h3 className="font-bold text-xl text-slate-800">Send an Inquiry or Feedback</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Ali Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. ali@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Phone Number (WhatsApp Preferred)</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Inquiry Subject <span className="text-red-500">*</span></label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
                  >
                    <option value="Inquiry">General Inquiry</option>
                    <option value="Professional Support">Professional Registration Issue</option>
                    <option value="Verification help">CNIC Verification Dispute</option>
                    <option value="Booking dispute">Booking / Payment Complaint</option>
                    <option value="Feedback">App Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Message Details <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe your inquiry, issue, or feedback in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <HelpCircle className="h-4 w-4 text-slate-300" />
                <span>By submitting, you agree to allow FixKer support team to contact you via provided details.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Submitting Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

      </section>

    </div>
  );
}
