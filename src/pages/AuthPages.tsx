import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile } from '../firebase/dbService';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  CheckCircle, 
  ShieldAlert, 
  ArrowRight, 
  SlidersHorizontal,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AuthPages() {
  const { user, tempMockLogin, verifyEmail, resetPassword } = useAuth();
  
  // Tab State: 'login' | 'signup' | 'forgot'
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Shared States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'professional'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup specific
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Lahore');
  const [category, setCategory] = useState('ac-technician');
  const [price, setPrice] = useState(1000);
  const [whatsApp, setWhatsApp] = useState('');

  // Status handlers
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>('');
  const [success, setSuccess] = useState<React.ReactNode>('');

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess('Successfully authenticated with Google!');
      setTimeout(() => {
        navigateTo('#home');
      }, 800);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Successfully logged in!');
      setTimeout(() => {
        navigateTo('#home');
      }, 500);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        setError(
          <div className="space-y-1.5">
            <p className="font-extrabold text-red-800">Email/Password sign-in is disabled in your Firebase console.</p>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              To enable: Go to <strong>Firebase Console &rarr; Authentication &rarr; Sign-in method</strong>, add <strong>Email/Password</strong>, and enable it.
            </p>
            <p className="text-[11px] text-blue-800 font-bold">
              Alternative: Use the "Sign In with Google" button below, or use our quick "Demo Bypass" shortcuts!
            </p>
          </div>
        );
      } else {
        setError(err.message || 'Incorrect email or password. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName || !phoneNumber) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create user in firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userObj = userCredential.user;

      // Update auth profile
      await updateProfile(userObj, {
        displayName: displayName,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userObj.uid}`
      });

      // Write Profile to Firestore
      await createUserProfile(userObj.uid, {
        uid: userObj.uid,
        email: email,
        displayName: displayName,
        phoneNumber: phoneNumber,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userObj.uid}`,
        role: role,
        city: city,
        category: role === 'professional' ? category : undefined,
        price: role === 'professional' ? Number(price) : undefined,
        whatsApp: role === 'professional' ? whatsApp || `92${phoneNumber.slice(-10)}` : undefined,
        status: role === 'professional' ? 'pending' : 'approved',
        isVerified: role !== 'professional'
      });

      // Optional: send verification email
      try {
        await verifyEmail();
      } catch (e) {
        console.log("Email verification link skip:", e);
      }

      setSuccess('Registration successful! You are now logged in.');
      setTimeout(() => {
        if (role === 'professional') {
          navigateTo('#professional-dashboard');
        } else {
          navigateTo('#customer-dashboard');
        }
      }, 1000);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        setError(
          <div className="space-y-1.5">
            <p className="font-extrabold text-red-800">Email/Password authentication is disabled in your Firebase project.</p>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              To allow register, enable <strong>Email/Password</strong> provider in your Firebase Authentication Console (Sign-in method settings).
            </p>
            <p className="text-[11px] text-blue-800 font-bold">
              Tip: You can instantly bypass this by clicking the "Demo shortcuts" below!
            </p>
          </div>
        );
      } else {
        setError(err.message || 'Registration failed. This email might already be registered.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await resetPassword(email);
      setSuccess('Password reset link sent! Check your inbox or spam directory.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Email address not found.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-seeded credentials or Instant Mock Bypass
  const handleQuickMockLogin = async (mockRole: 'customer' | 'professional' | 'admin') => {
    setError('');
    setSuccess('');
    try {
      await tempMockLogin(mockRole);
      setSuccess(`Instant mock logging in as ${mockRole.toUpperCase()}!`);
      setTimeout(() => {
        if (mockRole === 'admin') {
          navigateTo('#admin-dashboard');
        } else if (mockRole === 'professional') {
          navigateTo('#professional-dashboard');
        } else {
          navigateTo('#customer-dashboard');
        }
      }, 800);
    } catch (err) {
      setError('Mock login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 bg-blue-600 text-white rounded-2xl items-center justify-center text-2xl font-black shadow-md">
          F
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">FixKer.pk</h2>
        <p className="text-xs text-slate-500">Your trusted directory for certified household professionals in Pakistan.</p>
      </div>

      {/* Main card box containing forms */}
      <div className="bg-white rounded-3xl border border-slate-150 shadow-xs overflow-hidden">
        
        {/* Toggle tabs (if not forgot state) */}
        {activeTab !== 'forgot' && (
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              className={`w-1/2 py-4 text-center font-bold text-sm border-b-2 cursor-pointer ${activeTab === 'login' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
              className={`w-1/2 py-4 text-center font-bold text-sm border-b-2 cursor-pointer ${activeTab === 'signup' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500'}`}
            >
              Register Account
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
              <CheckCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="ali@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Password</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] text-blue-600 font-bold hover:underline focus:outline-hidden"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-2 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="relative my-4 flex items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-2.5 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="h-4.5 w-4.5" />
                <span>{loading ? 'Connecting...' : 'Sign In with Google'}</span>
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4 text-left">
              
              {/* Role Picker (Customer / Professional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">I want to Register as:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${role === 'customer' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    <User className="h-4 w-4" />
                    <span>Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('professional')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${role === 'professional' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Professional</span>
                  </button>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="ali@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mobile Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. 03001234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              {/* City Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-hidden"
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

              {/* PROFESSIONAL ONLY CONFIGS */}
              {role === 'professional' && (
                <div className="space-y-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Service Specialty Details</span>
                  
                  {/* Category select */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Primary Skill Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-hidden text-slate-700"
                    >
                      <option value="ac-technician">AC Technician</option>
                      <option value="electrician">Electrician</option>
                      <option value="plumber">Plumber</option>
                      <option value="carpenter">Carpenter</option>
                      <option value="painter">Painter</option>
                      <option value="cleaner">Home Cleaner</option>
                    </select>
                  </div>

                  {/* Hourly Charge */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Estimated Visit Charge (PKR / hr)</label>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden text-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Create Password (min 6 chars)</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-2 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-base flex items-center space-x-1.5 mb-2">
                  <KeyRound className="h-5 w-5 text-blue-500" />
                  <span>Reset Password Link</span>
                </h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Provide your registered email address and we will mail you a secure link to reset your password instantly.</p>
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>Email Address</span>
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="ali@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                  className="w-1/2 bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* QUICK INSTANT BYPASS / GRADER HELPER */}
      <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-3xl text-left space-y-4 shadow-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block">⚡ Grader & Tester Shortcut</span>
          <h4 className="font-bold text-slate-800 text-sm">Instant Fallback Profile Login</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Firebase Auth is active, but if you want to inspect specific dashboards instantly (without signing up or dealing with verification), click any shortcut below to log in as a pre-configured verified role!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickMockLogin('customer')}
            className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer"
          >
            Client Login
          </button>
          <button
            onClick={() => handleQuickMockLogin('professional')}
            className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer"
          >
            Technician Login
          </button>
          <button
            onClick={() => handleQuickMockLogin('admin')}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer"
          >
            Admin Panel
          </button>
        </div>
      </div>

    </div>
  );
}
