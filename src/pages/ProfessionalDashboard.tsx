import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getUserBookings, 
  updateBookingStatus, 
  updateUserProfile, 
  getProfessionalReviews,
  updateCommissionStatus,
  Booking, 
  Review 
} from '../firebase/dbService';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  User, 
  Edit, 
  Save, 
  Star, 
  TrendingUp, 
  Award,
  AlertTriangle,
  Upload,
  Plus,
  Trash,
  DollarSign,
  Info
} from 'lucide-react';
import { CATEGORIES } from '../data/constants';
import ChatCenter from '../components/ChatCenter';

export default function ProfessionalDashboard() {
  const { user, userProfile, refreshProfile } = useAuth();
  
  // Tab Controller
  const [activeTab, setActiveTab] = useState<'requests' | 'history' | 'setup' | 'reviews' | 'chats' | 'commissions'>('requests');

  // Bookings Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Reviews Data
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Configuration Setup Edit States
  const [isEditingSetup, setIsEditingSetup] = useState(false);
  const [setupCategory, setSetupCategory] = useState(userProfile?.category || 'ac-technician');
  const [setupPrice, setSetupPrice] = useState(userProfile?.price || 1000);
  const [setupBio, setSetupBio] = useState(userProfile?.bio || '');
  const [setupWhatsApp, setSetupWhatsApp] = useState(userProfile?.whatsApp || '');
  const [setupCnic, setSetupCnic] = useState(userProfile?.cnic || '');
  
  // Skills builder states
  const [skillsList, setSkillsList] = useState<string[]>(userProfile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [savingSetup, setSavingSetup] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState('');

  const fetchBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    const data = await getUserBookings(user.uid, 'professional');
    setBookings(data);
    setLoadingBookings(false);
  };

  const fetchReviews = async () => {
    if (!user) return;
    setLoadingReviews(true);
    const data = await getProfessionalReviews(user.uid);
    setReviews(data);
    setLoadingReviews(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab]);

  const handleBookingAction = async (bookingId: string, action: 'approved' | 'rejected' | 'in_progress' | 'completed') => {
    if (confirm(`Are you sure you want to mark this booking as ${action}?`)) {
      await updateBookingStatus(bookingId, action, 'professional');
      await fetchBookings();
    }
  };

  const handleAddSkill = () => {
    if (!newSkill) return;
    if (!skillsList.includes(newSkill)) {
      setSkillsList(prev => [...prev, newSkill]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSetupSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingSetup(true);
    setSetupSuccess('');
    try {
      await updateUserProfile(user.uid, {
        category: setupCategory,
        price: Number(setupPrice),
        bio: setupBio,
        whatsApp: setupWhatsApp,
        cnic: setupCnic,
        skills: skillsList
      });
      await refreshProfile();
      setIsEditingSetup(false);
      setSetupSuccess('Professional configuration updated successfully! Admin team has been notified.');
    } catch (err) {
      console.error(err);
      alert("Failed to update professional setup.");
    } finally {
      setSavingSetup(false);
    }
  };

  const handleCustomerWhatsApp = (customerPhone?: string) => {
    if (!customerPhone) return;
    const cleanNumber = customerPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello! I am ${userProfile?.displayName || 'your professional'} from FixKer.pk regarding your service request.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleMarkCommissionPaid = async (bookingId: string) => {
    try {
      await updateCommissionStatus(bookingId, 'paid');
      alert("Commission payment request sent! Admin team will verify your payment.");
      await fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to submit commission payment request.");
    }
  };

  // Calculate earnings from completed visits
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);
  
  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const activeJobs = bookings.filter(b => b.status === 'approved' || b.status === 'in_progress');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-8 text-left">
      
      {/* Upper info profile box */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="flex items-center space-x-4 z-10 text-left">
          <img 
            src={userProfile?.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.uid}`} 
            alt="Pro avatar" 
            className="h-16 w-16 rounded-2xl object-cover border border-slate-700 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{userProfile?.displayName}</h1>
              {userProfile?.status === 'approved' ? (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/20 uppercase tracking-wider">Approved & Live</span>
              ) : (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/20 uppercase tracking-wider">Awaiting Verification</span>
              )}
            </div>
            <span className="text-xs text-slate-400 block mt-1">
              Category: <strong className="text-slate-200">{(userProfile?.category || 'Unassigned').replace('-', ' ').toUpperCase()}</strong> • Lahore HQ Auditor Verified
            </span>
          </div>
        </div>

        {/* Dynamic Metric cards */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center min-w-[90px] sm:min-w-[110px]">
            <span className="text-xs text-slate-400 block">Total Earnings</span>
            <span className="text-sm sm:text-base font-extrabold text-blue-400 block mt-0.5">PKR {totalEarnings}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center min-w-[90px] sm:min-w-[110px]">
            <span className="text-xs text-slate-400 block">Rating Score</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400 flex items-center justify-center mt-0.5">
              <Star className="h-4 w-4 fill-amber-400 mr-0.5" />
              <span>{userProfile?.rating ?? 5.0}</span>
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center min-w-[90px] sm:min-w-[110px]">
            <span className="text-xs text-slate-400 block">Completed</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 block mt-0.5">{completedBookings.length} Jobs</span>
          </div>
        </div>
      </div>

      {/* Verification warning block if pending */}
      {userProfile?.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3">
          <AlertTriangle className="h-5.5 w-5.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-amber-800 text-sm">Profile Verification Required</h5>
            <p className="text-xs text-amber-700 leading-relaxed">
              Your profile is currently awaiting administrator review. To speed up approval, click the "Configure Professional Setup" tab below, fill out your bio, skills, hourly visiting charges and provide your CNIC number. Approvals typically take 12–24 business hours.
            </p>
          </div>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'requests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Booking Requests ({pendingRequests.length + activeJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Completed History ({completedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'commissions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Platform Commissions (10%)
        </button>
        <button
          onClick={() => setActiveTab('setup')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'setup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Configure Professional Setup
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Client Reviews ({userProfile?.reviewCount ?? 0})
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'chats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Inbox / Chats
        </button>
      </div>

      {/* Booking Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {loadingBookings ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : pendingRequests.length === 0 && activeJobs.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-2xl space-y-3">
              <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No Booking Requests</h3>
              <p className="text-xs text-slate-400">You don\'t have any pending or active service bookings right now.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sub-Section 1: Pending Action */}
              {pendingRequests.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-amber-800 bg-amber-50 border border-amber-100 py-1.5 px-3 rounded-lg w-fit">⚡ Action Needed: New Booking Requests</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {pendingRequests.map(booking => (
                      <div key={booking.id} className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-3">
                          <h4 className="font-black text-slate-800 text-base">{booking.customerName}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 font-medium">
                            <span className="flex items-center space-x-1.5"><span>📅 Date:</span> <strong>{booking.bookingDate}</strong></span>
                            <span className="flex items-center space-x-1.5"><span>🕒 Time Slot:</span> <strong>{booking.bookingTime}</strong></span>
                            <span className="flex items-center space-x-1.5 sm:col-span-2"><span>📍 Location:</span> <strong>{booking.address}</strong></span>
                          </div>
                          {booking.notes && <p className="text-xs bg-slate-50 text-slate-500 p-2 rounded-lg italic">"{booking.notes}"</p>}
                        </div>

                        {/* Booking Approval CTAs */}
                        <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-slate-400 block">Est. Revenue</span>
                            <strong className="text-base text-blue-600">PKR {booking.price}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleBookingAction(booking.id, 'rejected')}
                              className="border border-red-200 hover:bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg font-bold flex items-center space-x-1"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject Request</span>
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, 'approved')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-bold flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Approve & Accept</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 2: Active / In Progress */}
              {activeJobs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">💼 Accepted / Active Visits</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {activeJobs.map(booking => (
                      <div key={booking.id} className="bg-white p-6 rounded-2xl border border-slate-150 flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-black text-slate-800 text-base">{booking.customerName}</h4>
                            <span className="text-[9px] bg-blue-55 text-blue-700 px-2 py-0.2 rounded font-extrabold uppercase">Accepted</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 font-medium">
                            <span className="flex items-center space-x-1.5"><span>📅 Date:</span> <strong>{booking.bookingDate}</strong></span>
                            <span className="flex items-center space-x-1.5"><span>🕒 Slot:</span> <strong>{booking.bookingTime}</strong></span>
                            <span className="flex items-center space-x-1.5 sm:col-span-2"><span>📍 Location:</span> <strong>{booking.address}</strong></span>
                          </div>
                        </div>

                        {/* Action details */}
                        <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                          {booking.customerPhone && (
                            <button
                              onClick={() => handleCustomerWhatsApp(booking.customerPhone)}
                              className="flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs px-3.5 py-2 rounded-lg font-bold"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>WhatsApp Client</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleBookingAction(booking.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-lg font-bold flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark Completed</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {completedBookings.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-2xl">
              <p className="text-slate-400 text-xs font-medium">No completed bookings history yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {completedBookings.map(booking => (
                <div key={booking.id} className="bg-white p-5 rounded-xl border border-slate-150 flex justify-between items-center">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800">{booking.customerName}</h5>
                    <p className="text-xs text-slate-400">📅 {booking.bookingDate} • Completed Visit</p>
                  </div>
                  <strong className="text-sm font-black text-green-700">PKR {booking.price}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Setup Tab */}
      {activeTab === 'setup' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 max-w-3xl">
          <form onSubmit={handleSetupSave} className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-800">Configure Professional Listing Info</h3>

            {setupSuccess && (
              <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg">
                {setupSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service Category <span className="text-red-500">*</span></label>
                <select
                  value={setupCategory}
                  onChange={(e) => setSetupCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-hidden"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Estimated Hourly Visit Charge (PKR) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 1200"
                  value={setupPrice}
                  onChange={(e) => setSetupPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">WhatsApp Helpline Number (with 92 format) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 923001234567"
                  value={setupWhatsApp}
                  onChange={(e) => setSetupWhatsApp(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden text-slate-700"
                />
              </div>

              {/* CNIC */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">CNIC Number (for background screening audit) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 35202-1234567-1"
                  value={setupCnic}
                  onChange={(e) => setSetupCnic(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden text-slate-700"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Professional Bio / Overview <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={3}
                placeholder="Tell clients about your years of experience, specialized certifications, tools, etc."
                value={setupBio}
                onChange={(e) => setSetupBio(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden text-slate-700 resize-none"
              />
            </div>

            {/* Skills builder */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-left">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Specialties & Skills List</span>
              <div className="flex bg-white border border-slate-200 rounded-lg p-1 max-w-md items-center">
                <input 
                  type="text" 
                  placeholder="Add skill (e.g. Inverter Repair, Leakage Test)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full text-xs focus:outline-hidden text-slate-700 p-2"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-bold text-xs"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Skills tags list */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skillsList.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center bg-slate-50 text-slate-600 border border-slate-150 px-2.5 py-1 rounded-lg text-[11px] font-semibold space-x-1"
                  >
                    <span>{skill}</span>
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-red-500 focus:outline-hidden">
                      <Trash className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSetup}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{savingSetup ? 'Updating setup info...' : 'Save Configuration'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {loadingReviews ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-2xl">
              <p className="text-slate-400 text-xs font-medium">No customer reviews received yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-150 flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-slate-800 text-xs block">{rev.customerName}</span>
                      <div className="flex items-center text-amber-400 text-xs mt-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} className={`h-3.5 w-3.5 ${n <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                  </div>
                  <p className="text-xs text-slate-500 italic leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-start space-x-3 text-slate-700">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Platform Commission Terms (10%)</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  As a registered service provider on FixKer.pk, a <strong>10% commission</strong> is charged on the total booking fee of all completed jobs. Please transfer your pending commissions to keep your account active and avoid automated suspension.
                </p>
                <div className="bg-white border border-slate-150 p-3.5 rounded-xl text-xs space-y-1.5 mt-3">
                  <span className="font-bold text-slate-800 block">How to Pay Commission:</span>
                  <p className="text-slate-500">
                    1. Send the pending commission amount via <strong>Easypaisa</strong> or <strong>JazzCash</strong> to our official helpline phone: <strong className="text-blue-600 font-extrabold">+92 300 6347836</strong>.
                  </p>
                  <p className="text-slate-500">
                    2. After transferring the funds, click the <strong>"Mark as Paid"</strong> button on the booking item below.
                  </p>
                  <p className="text-slate-500">
                    3. Our administrator team will verify the payment and update the status in your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          {(() => {
            const commissionsList = completedBookings.map(b => {
              const amount = b.commissionAmount !== undefined ? b.commissionAmount : Math.round((b.price || 0) * 0.1);
              const status = b.commissionStatus || 'pending';
              return { ...b, amount, status };
            });
            const totalPaid = commissionsList.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
            const totalPending = commissionsList.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-700 font-semibold block uppercase">Total Commissions Paid</span>
                      <span className="text-2xl font-black text-emerald-900 mt-1 block">PKR {totalPaid}</span>
                    </div>
                    <CheckCircle className="h-10 w-10 text-emerald-500/30" />
                  </div>
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-rose-700 font-semibold block uppercase">Commissions Owed (Pending)</span>
                      <span className="text-2xl font-black text-rose-900 mt-1 block">PKR {totalPending}</span>
                    </div>
                    <DollarSign className="h-10 w-10 text-rose-500/30" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-extrabold text-sm text-slate-800">Job Commission Ledger</h3>
                  </div>
                  {commissionsList.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      No completed bookings or commissions logged yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Job Date</th>
                            <th className="p-4">Service Fee</th>
                            <th className="p-4">10% Commission</th>
                            <th className="p-4">Payment Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                          {commissionsList.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-bold text-slate-800">{item.customerName}</td>
                              <td className="p-4">📅 {item.bookingDate}</td>
                              <td className="p-4 font-extrabold text-slate-700">PKR {item.price}</td>
                              <td className="p-4 font-black text-blue-600">PKR {item.amount}</td>
                              <td className="p-4">
                                {item.status === 'paid' ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Paid</span>
                                ) : (
                                  <span className="bg-rose-100 text-rose-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Pending</span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                {item.status === 'pending' ? (
                                  <button
                                    onClick={() => handleMarkCommissionPaid(item.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Mark as Paid
                                  </button>
                                ) : (
                                  <span className="text-emerald-500 font-bold flex items-center justify-end space-x-1">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    <span>Submitted</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Real-Time Chats Tab */}
      {activeTab === 'chats' && user && (
        <ChatCenter currentUserId={user.uid} userRole="professional" />
      )}

    </div>
  );
}
