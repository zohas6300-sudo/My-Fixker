import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getUserProfile, 
  getProfessionalReviews, 
  toggleFavorite, 
  getOrCreateChat, 
  sendMessage, 
  listenToMessages, 
  UserProfile, 
  Review 
} from '../firebase/dbService';
import BookingModal from '../components/BookingModal';
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  MessageCircle, 
  CalendarDays, 
  Heart, 
  ArrowLeft, 
  ShieldAlert, 
  Sparkles,
  Award,
  Image as ImageIcon,
  Send,
  X
} from 'lucide-react';

export default function ProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth();
  
  // Parse dynamic ID from Hash parameter: #profile?id=pro-ac-1
  const getProId = () => {
    const hash = window.location.hash;
    const queryStr = hash.split('?')[1] || '';
    const params = new URLSearchParams(queryStr);
    return params.get('id') || '';
  };

  const proId = getProId();

  // Data States
  const [pro, setPro] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking modal
  const [bookingOpen, setBookingOpen] = useState(false);

  // Chat Overlay States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Initialize and load chat messages
  useEffect(() => {
    if (!chatOpen || !chatId) return;
    const unsubscribe = listenToMessages(chatId, (messages) => {
      setChatMessages(messages);
    });
    return () => unsubscribe();
  }, [chatOpen, chatId]);

  const handleInAppChatClick = async () => {
    if (!user) {
      alert("Please log in to chat with professionals!");
      return;
    }
    if (!pro) return;
    try {
      const cid = await getOrCreateChat(
        user.uid,
        userProfile?.displayName || user.displayName || 'Customer',
        userProfile?.photoURL || user.photoURL || '',
        pro.uid,
        pro.displayName,
        pro.photoURL || ''
      );
      setChatId(cid);
      setChatOpen(true);
    } catch (err) {
      console.error("Failed to start in-app chat:", err);
      alert("Failed to establish in-app chat channel.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || !newMessageText.trim() || !user) return;
    setSendingMessage(true);
    try {
      await sendMessage(chatId, user.uid, newMessageText.trim());
      setNewMessageText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    const fetchProDetails = async () => {
      if (!proId) {
        setError('No professional ID provided.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const profile = await getUserProfile(proId);
        if (profile && profile.role === 'professional') {
          setPro(profile);
          const revs = await getProfessionalReviews(proId);
          setReviews(revs);
        } else {
          setError('Professional profile not found.');
        }
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProDetails();
  }, [proId]);

  const handleGoBack = () => {
    window.location.hash = '#category';
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Please login to save favorites!");
      return;
    }
    if (!pro) return;
    const isAlreadyFav = userProfile?.favorites?.includes(pro.uid) || false;
    await toggleFavorite(user.uid, pro.uid, isAlreadyFav);
    await refreshProfile();
  };

  const openWhatsApp = () => {
    if (!pro?.whatsApp) return;
    const message = encodeURIComponent(`Hello ${pro.displayName}, I saw your professional profile on FixKer.pk and would like to inquire about your services.`);
    window.open(`https://wa.me/${pro.whatsApp}?text=${message}`, '_blank');
  };

  const renderStars = (rating: number = 5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400 shrink-0" />);
      } else {
        stars.push(<Star key={i} className="h-4.5 w-4.5 text-slate-200 shrink-0" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-slate-400 text-sm">Loading professional profile...</p>
      </div>
    );
  }

  if (error || !pro) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">Profile Error</h3>
        <p className="text-sm text-slate-500">{error || 'An unexpected error occurred.'}</p>
        <button
          onClick={handleGoBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const isFav = userProfile?.favorites?.includes(pro.uid) || false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-8">
      
      {/* Back Button */}
      <button 
        onClick={handleGoBack}
        className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-blue-600 font-bold self-start focus:outline-hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Professional Listings</span>
      </button>

      {/* Profile Header Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center space-x-5">
          <img 
            src={pro.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${pro.uid}`} 
            alt={pro.displayName} 
            className="h-20 w-20 rounded-2xl object-cover border border-slate-150 shadow-xs shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-800">{pro.displayName}</h1>
              {pro.isVerified && (
                <span className="inline-flex items-center space-x-0.5 bg-blue-50 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase border border-blue-100">
                  <CheckCircle className="h-3 w-3 fill-blue-600 text-white" />
                  <span>Verified Pro</span>
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md uppercase font-bold text-[10px]">
                {pro.category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{pro.city}, Pakistan</span>
              </span>
            </div>

            {/* Rating Stars Summary */}
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <div className="flex items-center">
                {renderStars(pro.rating)}
              </div>
              <span className="font-extrabold text-slate-800 text-sm">{pro.rating ?? 5.0}</span>
              <span>({pro.reviewCount ?? 0} customer reviews)</span>
            </div>
          </div>
        </div>

        {/* Action Button cluster */}
        <div className="flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Visit / Hour</span>
            <span className="text-xl font-black text-blue-600">PKR {pro.price || 1000}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-3 rounded-xl border transition-all ${isFav ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50'}`}
              title={isFav ? "Saved" : "Save as Favorite"}
            >
              <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-red-500' : ''}`} />
            </button>

            {pro.whatsApp && (
              <button
                onClick={openWhatsApp}
                className="p-3 rounded-xl border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Chat directly on WhatsApp"
              >
                <MessageCircle className="h-4.5 w-4.5" />
              </button>
            )}

            <button
              onClick={handleInAppChatClick}
              className="p-3 rounded-xl border border-blue-250 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer flex items-center space-x-1"
              title="Chat In-App"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              <span className="text-xs font-bold">Chat In-App</span>
            </button>

            <button
              onClick={() => setBookingOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer flex-grow sm:flex-grow-0"
            >
              <CalendarDays className="h-4.5 w-4.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Bio & Portfolio vs Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bio & Portfolio Column (2/3) */}
        <div className="lg:col-span-2 space-y-8 text-left">
          
          {/* Biography Block */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-800 flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span>About Me & Experience</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {pro.bio || `Hello! I am a verified ${pro.category?.replace('-', ' ')} based in ${pro.city}. I provide high-speed, standard quality solutions. I specialize in home installations, repairs, and annual maintenance contracts. Customer satisfaction and cleanliness are my primary guarantees.`}
            </p>

            {/* Skills checklist */}
            {pro.skills && pro.skills.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Specialties & Skills</span>
                <div className="flex flex-wrap gap-2">
                  {pro.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-blue-50/50 text-blue-700 border border-blue-100 px-3 py-1 rounded-xl text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Portfolio Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-800 flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              <span>My Project Gallery / Portfolio</span>
            </h3>
            
            {pro.portfolio && pro.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pro.portfolio.map((imgUrl, i) => (
                  <div key={i} className="relative h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img 
                      src={imgUrl} 
                      alt={`Project ${i}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-xs">No project images uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Column (1/3) */}
        <div className="lg:col-span-1 space-y-6 text-left">
          <div className="bg-white p-6 rounded-3xl border border-slate-150 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-800">Customer Testimonials</h3>
            
            {reviews.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Star className="h-8 w-8 text-slate-200 mx-auto" />
                <p className="text-slate-400 text-xs font-medium">No reviews received yet.</p>
                <p className="text-[10px] text-slate-400">Be the first to hire this professional and write a review!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-120 overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 text-xs block">{rev.customerName}</span>
                        <div className="flex items-center">
                          {renderStars(rev.rating)}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Booking Form modal */}
      {bookingOpen && (
        <BookingModal 
          professional={pro} 
          onClose={() => setBookingOpen(false)}
          onSuccess={() => {
            setBookingOpen(false);
            window.location.hash = '#customer-dashboard';
          }}
        />
      )}

      {/* Floating Chat Box Panel */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-3xl border border-slate-250 shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2.5 text-left">
              <img 
                src={pro.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${pro.uid}`} 
                alt={pro.displayName} 
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-extrabold text-xs text-white">{pro.displayName}</h4>
                <span className="text-[10px] text-slate-400 block">Verified Provider</span>
              </div>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer focus:outline-hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 flex flex-col">
            {chatMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <MessageCircle className="h-8 w-8 text-slate-300" />
                <p className="text-xs text-slate-400">No messages yet. Send a message to start direct communication!</p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === user?.uid;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div 
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-none text-right' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none text-left'}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2 shrink-0">
            <input 
              type="text" 
              placeholder="Type your message here..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-hidden text-slate-700 bg-slate-50"
              required
            />
            <button 
              type="submit" 
              disabled={sendingMessage || !newMessageText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
