import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookProfessional, UserProfile } from '../firebase/dbService';
import { X, Calendar, Clock, MapPin, Phone, FileText, CheckCircle, MessageCircle } from 'lucide-react';

interface BookingModalProps {
  professional: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ professional, onClose, onSuccess }: BookingModalProps) {
  const { user, userProfile } = useAuth();
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(userProfile?.phoneNumber || '');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  // Pre-configured typical time slots
  const TIME_SLOTS = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in or register to book a professional.');
      return;
    }

    if (!date || !time || !address || !phone) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bid = await bookProfessional({
        customerId: user.uid,
        customerName: userProfile?.displayName || user.displayName || 'Client',
        customerPhone: phone,
        professionalId: professional.uid,
        professionalName: professional.displayName,
        professionalCategory: professional.category || '',
        city: professional.city,
        bookingDate: date,
        bookingTime: time,
        status: 'pending',
        address,
        notes,
        price: professional.price || 1000,
        professionalWhatsApp: professional.whatsApp
      });

      setBookingId(bid);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to place booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!professional.whatsApp) return;
    const cleanNumber = professional.whatsApp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Asalam-o-Alaikum ${professional.displayName}, I have just requested a booking with you on FixKer.pk!\n\n` +
      `📅 Date: ${date}\n` +
      `🕒 Time: ${time}\n` +
      `📍 Location: ${address}\n\n` +
      `Please review the booking request on your FixKer Dashboard. JazakAllah!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Book Professional</h3>
            <p className="text-xs text-slate-500">Connecting you with {professional.displayName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5.5 w-5.5" />
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xs">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-800">Booking Requested!</h4>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Your service request has been submitted successfully to <strong>{professional.displayName}</strong>. You will receive an in-app notification once they accept or reject it.
            </p>

            {professional.whatsApp && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl max-w-sm text-left">
                <span className="text-xs font-bold text-green-800 block mb-1">⚡ Instant Confirmation</span>
                <p className="text-xs text-green-700 leading-relaxed mb-3">
                  You can also message the professional directly on WhatsApp to coordinate and confirm the visit immediately!
                </p>
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Send WhatsApp Message</span>
                </button>
              </div>
            )}

            <div className="pt-4 flex space-x-3 w-full">
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Quick Pricing Summary */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Service Category</span>
                <span className="font-bold text-blue-900 text-sm">{professional.category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Est. Visit Charge</span>
                <span className="font-extrabold text-blue-600 text-base">PKR {professional.price} / hr</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            {/* Date Picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                <span>Appointment Date <span className="text-red-500">*</span></span>
              </label>
              <input 
                type="date" 
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>Preferred Time Slot <span className="text-red-500">*</span></span>
              </label>
              <select
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="">-- Select a Time Slot --</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-blue-500" />
                <span>Contact Number <span className="text-red-500">*</span></span>
              </label>
              <input 
                type="tel" 
                required
                placeholder="e.g. 03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Full Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                <span>Full Address / House Location <span className="text-red-500">*</span></span>
              </label>
              <textarea 
                required
                rows={2}
                placeholder="House No, Street, Sector, Area Name, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <FileText className="h-3.5 w-3.5 text-blue-500" />
                <span>Special Notes / Describe Issue (Optional)</span>
              </label>
              <textarea 
                rows={2}
                placeholder="e.g., AC is making rattling noise, need ladder, or gas leakage check"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Confirm Booking'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
