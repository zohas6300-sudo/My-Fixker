import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getUserBookings, 
  updateBookingStatus, 
  addReview, 
  updateUserProfile, 
  getProfessionals, 
  UserProfile, 
  Booking 
} from '../firebase/dbService';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Star, 
  CheckCircle, 
  MessageCircle, 
  X, 
  Edit, 
  Save, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import ChatCenter from '../components/ChatCenter';

export default function CustomerDashboard() {
  const { user, userProfile, refreshProfile } = useAuth();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'profile'>('bookings');

  // Bookings Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Favorite Pros Data
  const [favoritePros, setFavoritePros] = useState<UserProfile[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  // Review Submitting State
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phoneNumber || '');
  const [editCity, setEditCity] = useState(userProfile?.city || 'Lahore');
  const [editPhoto, setEditPhoto] = useState(userProfile?.photoURL || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  const fetchBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    const data = await getUserBookings(user.uid, 'customer');
    setBookings(data);
    setLoadingBookings(false);
  };

  const fetchFavPros = async () => {
    if (!user || !userProfile?.favorites || userProfile.favorites.length === 0) {
      setFavoritePros([]);
      return;
    }
    setLoadingFavs(true);
    const allPros = await getProfessionals('all', 'all');
    const favs = allPros.filter(p => userProfile.favorites?.includes(p.uid));
    setFavoritePros(favs);
    setLoadingFavs(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavPros();
    }
  }, [activeTab, userProfile]);

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      await updateBookingStatus(bookingId, 'cancelled', 'customer');
      await fetchBookings();
    }
  };

  const handleMarkCompleted = async (bookingId: string) => {
    await updateBookingStatus(bookingId, 'completed', 'customer');
    await fetchBookings();
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking || !reviewComment) return;

    setSubmittingReview(true);
    try {
      await addReview(
        reviewingBooking.id,
        user!.uid,
        userProfile?.displayName || 'Client',
        reviewingBooking.professionalId,
        reviewRating,
        reviewComment
      );
      
      // Reset
      setReviewingBooking(null);
      setReviewComment('');
      setReviewRating(5);
      await fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    setProfileSuccess('');
    try {
      await updateUserProfile(user.uid, {
        displayName: editName,
        phoneNumber: editPhone,
        city: editCity,
        photoURL: editPhoto || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.uid}`
      });
      await refreshProfile();
      setIsEditingProfile(false);
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleWhatsAppChat = (whatsAppNum?: string, proName?: string) => {
    if (!whatsAppNum) return;
    const cleanNumber = whatsAppNum.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${proName}, I am contacting you regarding our booking on FixKer.pk.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return (
      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-8 text-left">
      
      {/* Welcome banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="space-y-1 z-10">
          <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block">Customer Center</span>
          <h1 className="text-2xl sm:text-3xl font-black">Asalam-o-Alaikum, {userProfile?.displayName || 'User'}!</h1>
          <p className="text-xs text-slate-400 max-w-md">Manage your service appointments, submit reviews, and adjust your personal options.</p>
        </div>
        <div className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-md z-10 shrink-0">
          <button onClick={() => window.location.hash = '#category'} className="cursor-pointer">Book a New Professional</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          My Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'favorites' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Favorite Professionals ({userProfile?.favorites?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'chats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Real-Time Chats
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Profile Settings
        </button>
      </div>

      {/* Bookings View */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loadingBookings ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-2xl space-y-4">
              <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No Bookings Yet</h3>
              <p className="text-xs text-slate-500">You haven\'t scheduled any professional appointments yet.</p>
              <button 
                onClick={() => window.location.hash = '#category'}
                className="bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-lg"
              >
                Book Your First Visit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="bg-white p-6 rounded-2xl border border-slate-150 flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex items-start space-x-4 text-left">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-black text-slate-800 text-base">{booking.professionalName}</h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <p className="text-xs text-slate-400">
                        Category: <strong className="text-slate-600">{booking.professionalCategory.replace('-', ' ').toUpperCase()}</strong>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>📅 {booking.bookingDate}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>🕒 {booking.bookingTime}</span>
                        </span>
                        <span className="flex items-center space-x-1.5 sm:col-span-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>📍 {booking.address}</span>
                        </span>
                      </div>

                      {booking.notes && (
                        <p className="text-xs bg-slate-50 text-slate-500 p-2 rounded-lg italic">
                          "{booking.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Charged PKR</span>
                      <span className="text-base font-black text-slate-800">{booking.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* WhatsApp option if booking approved */}
                      {(booking.status === 'approved' || booking.status === 'in_progress') && booking.professionalWhatsApp && (
                        <button
                          onClick={() => handleWhatsAppChat(booking.professionalWhatsApp, booking.professionalName)}
                          className="flex items-center space-x-1 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs px-3 py-2 rounded-lg font-bold"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      {/* Cancel Booking option */}
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="border border-red-200 hover:bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg font-bold"
                        >
                          Cancel booking
                        </button>
                      )}

                      {/* Complete Booking option */}
                      {(booking.status === 'approved' || booking.status === 'in_progress') && (
                        <button
                          onClick={() => handleMarkCompleted(booking.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg font-bold flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      {/* Review writing triggers */}
                      {booking.status === 'completed' && !booking.hasReview && (
                        <button
                          onClick={() => setReviewingBooking(booking)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg font-bold flex items-center space-x-1"
                        >
                          <Star className="h-4 w-4 fill-white" />
                          <span>Write a Review</span>
                        </button>
                      )}

                      {booking.status === 'completed' && booking.hasReview && (
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">✓ Reviewed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorite Professionals View */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          {loadingFavs ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : favoritePros.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-2xl space-y-4">
              <Heart className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No Saved Professionals</h3>
              <p className="text-xs text-slate-500 font-medium">Keep track of your favorite technicians for immediate bookings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePros.map(pro => (
                <div 
                  key={pro.uid}
                  className="bg-white p-6 rounded-2xl border border-slate-150 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={pro.photoURL} 
                      alt={pro.displayName} 
                      className="h-12 w-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">{pro.displayName}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded font-bold uppercase tracking-wider block mt-0.5">{pro.category?.replace('-', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">PKR {pro.price}/hr</span>
                    <button
                      onClick={() => window.location.hash = `#profile?id=${pro.uid}`}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings View */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 max-w-2xl">
          <form onSubmit={handleProfileSave} className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-800">Edit Your Profile Settings</h3>
            
            {profileSuccess && (
              <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg">
                {profileSuccess}
              </div>
            )}

            <div className="space-y-4">
              {/* Avatar Photo Selection */}
              <div className="flex items-center space-x-4">
                <img 
                  src={editPhoto || userProfile?.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.uid}`} 
                  alt="Avatar" 
                  className="h-16 w-16 rounded-full border border-blue-100 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 text-left flex-grow">
                  <label className="text-xs font-bold text-slate-700">Profile Photo URL</label>
                  <input 
                    type="text" 
                    value={editPhoto}
                    onChange={(e) => setEditPhoto(e.target.value)}
                    placeholder="Provide image link / https://..."
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden"
                  />
                  <span className="text-[9px] text-slate-400 block">Or leave empty to use auto-generated avatar avatar seed.</span>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden text-slate-700"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number (WhatsApp Preferred)</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. 03001234567"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden text-slate-700"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Base City</label>
                <select
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden bg-white text-slate-700"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{savingProfile ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Real-Time Chats Tab */}
      {activeTab === 'chats' && user && (
        <ChatCenter currentUserId={user.uid} userRole="customer" />
      )}

      {/* Review overlay box */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-slate-800 text-lg">Leave a Professional Review</h4>
              <button onClick={() => setReviewingBooking(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">How was your service experience with <strong>{reviewingBooking.professionalName}</strong>?</p>
              
              {/* Rating Choice Stars */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Rating Score</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className="p-1 focus:outline-hidden"
                    >
                      <Star className={`h-8 w-8 ${num <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Write your feedback</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="e.g., Fantastic work! Arrived on time and solved the leakage issue in minutes. Very respectful."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-hidden text-slate-700"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingBooking(null)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
