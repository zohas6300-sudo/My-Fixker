import React, { useState, useEffect } from 'react';
import { CATEGORIES, CITIES } from '../data/constants';
import { getProfessionals, UserProfile, toggleFavorite, getOrCreateChat } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import { 
  Search, 
  MapPin, 
  Star, 
  SlidersHorizontal, 
  CheckCircle, 
  MessageCircle, 
  AlertTriangle,
  User,
  Heart,
  CalendarDays,
  DollarSign,
  Calendar,
  Clock,
  Wrench
} from 'lucide-react';

export default function CategoryPage() {
  const { user, userProfile, refreshProfile } = useAuth();
  
  // Parse dynamic URL parameters from window.location.hash in an SEO-friendly manner
  const getHashParams = () => {
    const hash = window.location.hash;
    const queryStr = hash.split('?')[1] || '';
    const params = new URLSearchParams(queryStr);
    return {
      city: params.get('city') || 'all',
      type: params.get('type') || 'all',
      search: params.get('search') || '',
      minPrice: Number(params.get('minPrice')) || 0,
      maxPrice: Number(params.get('maxPrice')) || 99999,
      minRating: Number(params.get('minRating')) || 0,
      day: params.get('day') || 'any',
      time: params.get('time') || 'any',
      skills: params.get('skills') ? params.get('skills')!.split(',').filter(Boolean) : []
    };
  };

  const hashParams = getHashParams();

  // Filter States
  const [selectedCity, setSelectedCity] = useState(hashParams.city);
  const [selectedCategory, setSelectedCategory] = useState(hashParams.type);
  const [searchInput, setSearchInput] = useState(hashParams.search);
  const [searchQuery, setSearchQuery] = useState(hashParams.search);
  const [minRating, setMinRating] = useState(hashParams.minRating);
  const [minPrice, setMinPrice] = useState(hashParams.minPrice);
  const [maxPrice, setMaxPrice] = useState(hashParams.maxPrice);
  const [availabilityDay, setAvailabilityDay] = useState(hashParams.day);
  const [availabilityTime, setAvailabilityTime] = useState(hashParams.time);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(hashParams.skills);

  // Data States
  const [professionals, setProfessionals] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // Booking Modal State
  const [bookingPro, setBookingPro] = useState<UserProfile | null>(null);

  // Debouncing search queries for performant searches
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle browser back/forward and dynamic hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const params = getHashParams();
      setSelectedCity(params.city);
      setSelectedCategory(params.type);
      setSearchInput(params.search);
      setMinPrice(params.minPrice);
      setMaxPrice(params.maxPrice);
      setMinRating(params.minRating);
      setAvailabilityDay(params.day);
      setAvailabilityTime(params.time);
      setSelectedSkills(params.skills);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash dynamically for search engine crawler crawlability (SEO optimization)
  const syncHashParams = () => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('type', selectedCategory);
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    if (searchQuery) params.set('search', searchQuery);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 99999) params.set('maxPrice', maxPrice.toString());
    if (minRating > 0) params.set('minRating', minRating.toString());
    if (availabilityDay && availabilityDay !== 'any') params.set('day', availabilityDay);
    if (availabilityTime && availabilityTime !== 'any') params.set('time', availabilityTime);
    if (selectedSkills && selectedSkills.length > 0) params.set('skills', selectedSkills.join(','));

    const newHash = `#category?${params.toString()}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  };

  // Dynamically aggregate all unique specialties/skills of professionals inside this category
  useEffect(() => {
    const collectSkills = async () => {
      const data = await getProfessionals(selectedCategory, 'all');
      const skillsSet = new Set<string>();
      data.forEach(p => {
        if (p.skills) {
          p.skills.forEach(s => {
            if (s && s.trim()) {
              skillsSet.add(s.trim());
            }
          });
        }
      });
      setAvailableSkills(Array.from(skillsSet));
    };
    collectSkills();
  }, [selectedCategory]);

  // Fetch matched professionals
  const fetchPros = async () => {
    setLoading(true);
    syncHashParams();
    const data = await getProfessionals(
      selectedCategory,
      selectedCity,
      minRating,
      maxPrice,
      searchQuery,
      minPrice,
      selectedSkills,
      availabilityDay,
      availabilityTime
    );
    setProfessionals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPros();
  }, [
    selectedCity,
    selectedCategory,
    minRating,
    minPrice,
    maxPrice,
    searchQuery,
    availabilityDay,
    availabilityTime,
    selectedSkills
  ]);

  const handleFavoriteClick = async (proId: string) => {
    if (!user) {
      alert("Please login to save favorite professionals!");
      return;
    }
    const isAlreadyFav = userProfile?.favorites?.includes(proId) || false;
    await toggleFavorite(user.uid, proId, isAlreadyFav);
    await refreshProfile();
  };

  const navigateToProfile = (uid: string) => {
    window.location.hash = `#profile?id=${uid}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = (whatsAppNum: string, proName: string) => {
    const message = encodeURIComponent(`Hello ${proName}, I saw your professional profile on FixKer.pk and would like to inquire about your services.`);
    window.open(`https://wa.me/${whatsAppNum}?text=${message}`, '_blank');
  };

  const handleDirectChat = async (pro: UserProfile) => {
    if (!user) {
      alert("Please login to chat directly with professionals!");
      return;
    }
    try {
      await getOrCreateChat(
        user.uid,
        userProfile?.displayName || user.displayName || 'Customer',
        userProfile?.photoURL || user.photoURL || '',
        pro.uid,
        pro.displayName,
        pro.photoURL || ''
      );
      // Navigate to customer dashboard chat tab
      window.location.hash = '#customer-dashboard';
    } catch (err) {
      console.error(err);
      alert("Could not start chat channel.");
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const renderStars = (rating: number = 5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-slate-200 shrink-0" />);
      }
    }
    return stars;
  };

  const resetAllFilters = () => {
    setSelectedCity('all');
    setSelectedCategory('all');
    setMinRating(0);
    setMinPrice(0);
    setMaxPrice(99999);
    setSearchInput('');
    setSearchQuery('');
    setAvailabilityDay('any');
    setAvailabilityTime('any');
    setSelectedSkills([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-8">
      
      {/* Search Header */}
      <div className="bg-slate-50 border border-slate-150 p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="space-y-1 w-full md:w-auto text-left">
          <h1 className="text-2xl font-black text-slate-800 flex flex-wrap items-center gap-2">
            <span>Find Verified Help</span>
            {selectedCategory !== 'all' && (
              <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg text-xs border border-blue-100 uppercase font-extrabold">
                {selectedCategory?.replace('-', ' ')}
              </span>
            )}
            {selectedCity !== 'all' && (
              <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs border border-slate-200 uppercase font-bold">
                {selectedCity}
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500">Compare verified local experts, negotiate visiting charges, and chat directly.</p>
        </div>

        {/* Dynamic Search Box */}
        <div className="w-full md:w-1/2 flex bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs items-center gap-2">
          <Search className="h-5 w-5 text-slate-400 ml-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search specialties, brand names, services..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-sm focus:outline-hidden text-slate-700 py-1"
          />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer">Clear</button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-150 space-y-6 h-fit shrink-0 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-800 flex items-center space-x-2 text-sm">
              <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600" />
              <span>Filter Options</span>
            </h4>
            <button 
              onClick={resetAllFilters}
              className="text-[11px] text-blue-600 font-extrabold hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* City Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Location / City</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Pakistan</option>
              {CITIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <span>Category</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-3 border-t border-slate-50">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
              <span>Hourly Visiting Charge (PKR)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Min Price</span>
                <input 
                  type="number" 
                  placeholder="0"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden text-slate-700"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Max Price</span>
                <input 
                  type="number" 
                  placeholder="99999"
                  value={maxPrice === 99999 ? '' : maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : 99999)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Rating Selection */}
          <div className="space-y-2 pt-3 border-t border-slate-50">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Minimum Rating</span>
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="0">Any Rating</option>
              <option value="4.8">Excellent (4.8★ & Above)</option>
              <option value="4.5">Great (4.5★ & Above)</option>
              <option value="4.0">Good (4.0★ & Above)</option>
            </select>
          </div>

          {/* Availability (Day of Week) */}
          <div className="space-y-2 pt-3 border-t border-slate-50">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Availability Day</span>
            </label>
            <select
              value={availabilityDay}
              onChange={(e) => setAvailabilityDay(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="any">Any Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          {/* Availability (Time of Day) */}
          <div className="space-y-2 pt-3 border-t border-slate-50">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Availability Time</span>
            </label>
            <select
              value={availabilityTime}
              onChange={(e) => setAvailabilityTime(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="any">Any Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          {/* Category-Specific Skill Checkboxes */}
          {availableSkills.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-50">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Wrench className="h-3.5 w-3.5 text-slate-400" />
                <span>Specialties & Services</span>
              </label>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {availableSkills.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 text-xs text-slate-600 font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Results Listings Column */}
        <div className="lg:col-span-3 space-y-6 text-left">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-slate-400 text-sm">Searching verified local experts...</p>
            </div>
          ) : professionals.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
              <h3 className="font-extrabold text-slate-800 text-lg">No Professionals Found</h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                No active verified professionals matched your exact filtering criteria in Lahore/Karachi. Try expanding your price thresholds, selecting different cities, or resetting the filters.
              </p>
              <button 
                onClick={resetAllFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                  Found {professionals.length} Verified Expert{professionals.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {professionals.map((pro) => {
                  const isFav = userProfile?.favorites?.includes(pro.uid) || false;
                  return (
                    <div 
                      key={pro.uid}
                      className="bg-white p-6 rounded-3xl border border-slate-150 hover:border-blue-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6 relative"
                    >
                      {/* Left Block: Avatar & Detailed Bio */}
                      <div className="flex items-start space-x-4">
                        <button onClick={() => navigateToProfile(pro.uid)} className="focus:outline-hidden cursor-pointer shrink-0">
                          <img 
                            src={pro.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${pro.uid}`} 
                            alt={pro.displayName} 
                            className="h-16 w-16 rounded-2xl object-cover border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                        
                        <div className="space-y-2 text-left">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button 
                                onClick={() => navigateToProfile(pro.uid)}
                                className="font-extrabold text-slate-800 hover:text-blue-600 text-base transition-colors focus:outline-hidden cursor-pointer"
                              >
                                {pro.displayName}
                              </button>
                              {pro.isVerified && (
                                <span className="inline-flex items-center space-x-0.5 bg-blue-50 text-blue-700 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase border border-blue-100 shrink-0">
                                  <CheckCircle className="h-2.5 w-2.5 fill-blue-600 text-white" />
                                  <span>Verified Pro</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {pro.category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • {pro.city}
                            </span>
                          </div>

                          {/* Ratings */}
                          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                            <div className="flex items-center">
                              {renderStars(pro.rating)}
                            </div>
                            <span className="font-extrabold text-slate-800 text-sm">{pro.rating ?? 5.0}</span>
                            <span>({pro.reviewCount ?? 0} customer reviews)</span>
                          </div>

                          {/* Biography */}
                          <p className="text-xs text-slate-500 line-clamp-2 max-w-lg leading-relaxed">
                            {pro.bio || 'Verified Pakistan home operations technician. Reliable workmanship, fair competitive billing rates and immediate cleanup guaranteed.'}
                          </p>

                          {/* Specialty tags */}
                          {pro.skills && pro.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {pro.skills.slice(0, 4).map((skill, i) => (
                                <span key={i} className="bg-slate-50 text-slate-500 text-[10px] px-2.5 py-0.5 rounded-lg border border-slate-100 font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Block: Price & CTA Cluster */}
                      <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3.5 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Visit / Hour</span>
                          <span className="text-lg font-black text-blue-600">PKR {pro.price || 1000}</span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {/* Favorite trigger */}
                          <button
                            onClick={() => handleFavoriteClick(pro.uid)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isFav ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50'}`}
                            title={isFav ? "Remove from Saved" : "Save Professional"}
                          >
                            <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500' : ''}`} />
                          </button>

                          {/* Direct In-App Chat */}
                          <button
                            onClick={() => handleDirectChat(pro)}
                            className="p-2.5 rounded-xl border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Direct Chat In-App"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>

                          {/* WhatsApp chat link */}
                          {pro.whatsApp && (
                            <button
                              onClick={() => openWhatsApp(pro.whatsApp!, pro.displayName)}
                              className="p-2.5 rounded-xl border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Chat directly on WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4 text-emerald-600" />
                            </button>
                          )}

                          {/* Appointment Booking */}
                          <button
                            onClick={() => setBookingPro(pro)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center space-x-1 cursor-pointer"
                          >
                            <CalendarDays className="h-4 w-4" />
                            <span>Book</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Booking Form Overlay */}
      {bookingPro && (
        <BookingModal 
          professional={bookingPro} 
          onClose={() => setBookingPro(null)}
          onSuccess={() => {
            setBookingPro(null);
            window.location.hash = '#customer-dashboard';
          }}
        />
      )}

    </div>
  );
}
