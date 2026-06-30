import React, { useState, useEffect } from 'react';
import { 
  getPendingProfessionals, 
  getAllUsersAdmin, 
  getUserBookings, 
  verifyProfessional, 
  suspendUser, 
  updateBookingStatus, 
  seedMockProfessionals,
  updateCommissionStatus,
  UserProfile, 
  Booking 
} from '../firebase/dbService';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Check, 
  X, 
  Slash, 
  UserX, 
  AlertTriangle, 
  Database,
  RefreshCw,
  Search,
  MessageCircle,
  DollarSign,
  CheckCircle,
  Percent,
  TrendingUp,
  Wallet
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'verify' | 'users' | 'bookings' | 'commissions'>('verify');
  
  // Data States
  const [pendingPros, setPendingPros] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const pending = await getPendingProfessionals();
      setPendingPros(pending);
      
      const users = await getAllUsersAdmin();
      setAllUsers(users);

      const bookings = await getUserBookings('all', 'admin');
      setAllBookings(bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (uid: string, approve: boolean) => {
    if (confirm(`Are you sure you want to ${approve ? 'approve' : 'reject'} this professional?`)) {
      await verifyProfessional(uid, approve);
      await fetchData();
    }
  };

  const handleSuspend = async (uid: string, suspend: boolean) => {
    if (confirm(`Are you sure you want to ${suspend ? 'suspend' : 'unsuspend'} this user account?`)) {
      await suspendUser(uid, suspend);
      await fetchData();
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      await updateBookingStatus(bookingId, 'cancelled', 'admin');
      await fetchData();
    }
  };

  const handleToggleCommission = async (bookingId: string, currentStatus: 'pending' | 'paid') => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    if (confirm(`Are you sure you want to mark this commission as ${nextStatus.toUpperCase()}?`)) {
      await updateCommissionStatus(bookingId, nextStatus);
      await fetchData();
    }
  };

  const handleSeedDatabase = async () => {
    setSeedingLoading(true);
    try {
      const seeded = await seedMockProfessionals();
      alert(`Successfully seeded database with ${seeded} verified professionals and mock reviews!`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Seeding skip or failed. Most profiles may already exist.");
    } finally {
      setSeedingLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.displayName?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.role?.toLowerCase().includes(q) ||
      user.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-8 text-left">
      
      {/* Admin Title Bar */}
      <div className="bg-red-950/20 border border-red-900/10 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs text-red-700 font-extrabold uppercase tracking-widest block flex items-center space-x-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Master Administration Controller</span>
          </span>
          <h1 className="text-2xl font-black text-slate-800 mt-1">Admin Dashboard Panel</h1>
          <p className="text-xs text-slate-500">Approve new handymen, suspend abusive profiles, audit transactions, or run system seed data.</p>
        </div>

        {/* Database Seeder Button */}
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl border border-slate-200 font-semibold text-xs flex items-center space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleSeedDatabase}
            disabled={seedingLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Database className="h-4 w-4" />
            <span>{seedingLoading ? 'Seeding...' : 'Seed Mock Professionals'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('verify')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'verify' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Verify Professionals ({pendingPros.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'users' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Manage All Users ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'bookings' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          All System Bookings ({allBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'commissions' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Platform Commissions (10%)
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Verify Professionals Tab */}
          {activeTab === 'verify' && (
            <div className="space-y-4">
              {pendingPros.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-2xl">
                  <p className="text-slate-400 text-xs font-semibold">No pending professionals awaiting verification.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {pendingPros.map(pro => (
                    <div key={pro.uid} className="bg-white p-6 rounded-2xl border border-slate-150 flex flex-col sm:flex-row justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <img src={pro.photoURL} alt={pro.displayName} className="h-12 w-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-bold text-slate-800">{pro.displayName}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold">{pro.email} • {pro.phoneNumber}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-500">
                          <span>Province/City: <strong className="text-slate-700">{pro.city}</strong></span>
                          <span>Category: <strong className="text-slate-700">{pro.category?.toUpperCase()}</strong></span>
                          <span>CNIC Number: <strong className="text-slate-700">{pro.cnic || 'N/A'}</strong></span>
                          <span>Hourly Rate: <strong className="text-slate-700">PKR {pro.price}</strong></span>
                        </div>

                        <p className="text-xs bg-slate-50 text-slate-500 p-3 rounded-xl italic">"{pro.bio || 'No bio written yet.'}"</p>
                      </div>

                      {/* Approval buttons */}
                      <div className="flex items-center gap-2 self-center sm:self-auto shrink-0">
                        <button
                          onClick={() => handleVerify(pro.uid, false)}
                          className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 flex items-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleVerify(pro.uid, true)}
                          className="p-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center space-x-1"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve & Live</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manage All Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="flex bg-white border border-slate-200 rounded-xl p-2 items-center gap-2 max-w-md">
                <Search className="h-4.5 w-4.5 text-slate-400 ml-1" />
                <input 
                  type="text" 
                  placeholder="Filter users by name, email, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs focus:outline-hidden text-slate-700"
                />
              </div>

              {/* Table / List */}
              <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">City</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {filteredUsers.map(u => (
                        <tr key={u.uid} className="hover:bg-slate-50/50">
                          <td className="p-4 flex items-center space-x-2.5">
                            <img src={u.photoURL} className="h-8 w-8 rounded-full border border-slate-100 object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <span className="font-bold text-slate-800 block">{u.displayName}</span>
                              <span className="text-[10px] text-slate-400">{u.email}</span>
                            </div>
                          </td>
                          <td className="p-4 uppercase font-extrabold text-[10px] text-slate-500">{u.role}</td>
                          <td className="p-4">{u.city || 'N/A'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${u.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                              {u.status || 'approved'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {u.status === 'suspended' ? (
                              <button 
                                onClick={() => handleSuspend(u.uid, false)}
                                className="text-green-600 font-bold hover:underline"
                              >
                                Re-activate
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleSuspend(u.uid, true)}
                                className="text-red-500 font-bold hover:underline flex items-center space-x-1 ml-auto text-right"
                              >
                                <UserX className="h-3.5 w-3.5" />
                                <span>Suspend</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* All Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Professional</th>
                        <th className="p-4">Schedule</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Fee</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {allBookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">{b.customerName}</td>
                          <td className="p-4 flex flex-col">
                            <span className="font-bold text-slate-800">{b.professionalName}</span>
                            <span className="text-[10px] text-slate-400 block">{b.professionalCategory.toUpperCase()}</span>
                          </td>
                          <td className="p-4 flex flex-col">
                            <span>📅 {b.bookingDate}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">🕒 {b.bookingTime}</span>
                          </td>
                          <td className="p-4 uppercase font-bold text-[9px]">{b.status}</td>
                          <td className="p-4 font-extrabold text-slate-800">PKR {b.price}</td>
                          <td className="p-4 text-right">
                            {b.status !== 'cancelled' && b.status !== 'completed' ? (
                              <button 
                                onClick={() => handleCancelBooking(b.id)}
                                className="text-red-500 font-bold hover:underline flex items-center space-x-1 ml-auto text-right"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Cancel Booking</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 italic">No action</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Commissions Tab */}
          {activeTab === 'commissions' && (() => {
            const completedBookings = allBookings.filter(b => b.status === 'completed');
            const totalBusinessVolume = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);
            const totalCommissionsEarned = completedBookings.reduce((sum, b) => sum + (b.commissionAmount !== undefined ? b.commissionAmount : Math.round((b.price || 0) * 0.1)), 0);
            const totalCommissionsPaid = completedBookings.filter(b => b.commissionStatus === 'paid').reduce((sum, b) => sum + (b.commissionAmount !== undefined ? b.commissionAmount : Math.round((b.price || 0) * 0.1)), 0);
            const totalCommissionsPending = completedBookings.filter(b => b.commissionStatus !== 'paid').reduce((sum, b) => sum + (b.commissionAmount !== undefined ? b.commissionAmount : Math.round((b.price || 0) * 0.1)), 0);

            return (
              <div className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Total Comm. Expected</span>
                      <span className="text-xl sm:text-2xl font-black mt-1 block">PKR {totalCommissionsEarned}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">From PKR {totalBusinessVolume} volume</span>
                    </div>
                    <Wallet className="h-9 w-9 text-slate-700" />
                  </div>
                  <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-emerald-700 text-xs font-semibold block uppercase tracking-wider">Total Comm. Received</span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-900 mt-1 block">PKR {totalCommissionsPaid}</span>
                      <span className="text-[10px] text-emerald-600 mt-1 block">Successfully Verified</span>
                    </div>
                    <CheckCircle className="h-9 w-9 text-emerald-500/30" />
                  </div>
                  <div className="bg-rose-50 border border-rose-150 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-rose-700 text-xs font-semibold block uppercase tracking-wider">Outstanding (Pending)</span>
                      <span className="text-xl sm:text-2xl font-black text-rose-900 mt-1 block">PKR {totalCommissionsPending}</span>
                      <span className="text-[10px] text-rose-600 mt-1 block">Due from Professionals</span>
                    </div>
                    <DollarSign className="h-9 w-9 text-rose-500/30" />
                  </div>
                </div>

                {/* Ledger */}
                <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden">
                  <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-slate-800">Professional Commission Ledger (10%)</h3>
                    <span className="text-[10px] bg-red-100 text-red-800 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">10% Platform Rate Active</span>
                  </div>
                  {completedBookings.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 text-xs italic">
                      No completed bookings are currently recorded on the platform to extract commission from.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Professional</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Job Date</th>
                            <th className="p-4">Service Fee</th>
                            <th className="p-4">10% Commission</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                          {completedBookings.map(b => {
                            const commAmount = b.commissionAmount !== undefined ? b.commissionAmount : Math.round((b.price || 0) * 0.1);
                            const commStatus = b.commissionStatus || 'pending';
                            return (
                              <tr key={b.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-bold text-slate-800">{b.professionalName}</td>
                                <td className="p-4">{b.customerName}</td>
                                <td className="p-4">📅 {b.bookingDate}</td>
                                <td className="p-4 font-extrabold text-slate-700">PKR {b.price}</td>
                                <td className="p-4 font-black text-blue-600">PKR {commAmount}</td>
                                <td className="p-4">
                                  {commStatus === 'paid' ? (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Paid</span>
                                  ) : (
                                    <span className="bg-rose-100 text-rose-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Pending</span>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleToggleCommission(b.id, commStatus)}
                                    className={`font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                      commStatus === 'paid' 
                                        ? 'border border-rose-200 text-rose-600 hover:bg-rose-50' 
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                  >
                                    {commStatus === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
}
