import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  limit,
  Timestamp,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  photoURL: string;
  role: 'customer' | 'professional' | 'admin';
  city: string;
  createdAt: any;
  status: 'pending' | 'approved' | 'suspended';
  isVerified?: boolean;
  // Professional-specific fields
  category?: string;
  bio?: string;
  price?: number;
  cnic?: string;
  skills?: string[];
  portfolio?: string[];
  rating?: number;
  reviewCount?: number;
  whatsApp?: string;
  favorites?: string[]; // for customers
  availabilityDays?: string[]; // e.g., ['Monday', 'Tuesday', etc.]
  availabilityTimes?: string[]; // e.g., ['Morning', 'Afternoon', 'Evening']
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  professionalId: string;
  professionalName: string;
  professionalCategory: string;
  city: string;
  bookingDate: string;
  bookingTime: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  address: string;
  notes: string;
  price: number;
  createdAt: any;
  hasReview?: boolean;
  professionalWhatsApp?: string;
  commissionAmount?: number;
  commissionStatus?: 'pending' | 'paid';
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  professionalId: string;
  rating: number;
  comment: string;
  createdAt: any;
}

// User Profile Services
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function createUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    const defaultData: any = {
      uid,
      createdAt: Timestamp.now(),
      status: profile.role === 'professional' ? 'pending' : 'approved',
      isVerified: profile.role !== 'professional',
      rating: profile.role === 'professional' ? 5.0 : undefined,
      reviewCount: profile.role === 'professional' ? 0 : undefined,
      favorites: profile.role === 'customer' ? [] : undefined,
      ...profile
    };

    // Explicitly delete any undefined properties to prevent firestore setDoc/merge errors
    Object.keys(defaultData).forEach(key => {
      if (defaultData[key] === undefined) {
        delete defaultData[key];
      }
    });

    await setDoc(docRef, defaultData, { merge: true });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Toggle Favorite Professionals
export async function toggleFavorite(customerId: string, proId: string, isFavorited: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'users', customerId);
    if (isFavorited) {
      await updateDoc(docRef, {
        favorites: arrayRemove(proId)
      });
    } else {
      await updateDoc(docRef, {
        favorites: arrayUnion(proId)
      });
    }
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    throw error;
  }
}

// Fetch Professionals list
export async function getProfessionals(
  category?: string,
  city?: string,
  minRating: number = 0,
  maxPrice: number = 999999,
  searchQuery: string = '',
  minPrice: number = 0,
  selectedSkills: string[] = [],
  availabilityDay: string = 'any',
  availabilityTime: string = 'any'
): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    // Basic filter: only professionals who are approved and not suspended
    let q = query(
      usersRef, 
      where('role', '==', 'professional'),
      where('status', '==', 'approved')
    );

    const querySnapshot = await getDocs(q);
    let pros: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      pros.push(doc.data() as UserProfile);
    });

    // Client-side filtration for robust query capabilities (no firestore indexes required)
    return pros.filter(pro => {
      if (category && category !== 'all' && pro.category !== category) return false;
      if (city && city !== 'all' && pro.city?.toLowerCase() !== city.toLowerCase()) return false;
      if ((pro.rating ?? 5) < minRating) return false;
      if ((pro.price ?? 0) < minPrice || (pro.price ?? 0) > maxPrice) return false;
      
      // Filter by skills if selected
      if (selectedSkills && selectedSkills.length > 0) {
        const proSkills = pro.skills || [];
        const hasMatchingSkill = selectedSkills.some(skill => 
          proSkills.some(ps => ps.toLowerCase() === skill.toLowerCase())
        );
        if (!hasMatchingSkill) return false;
      }

      // Filter by availability day
      if (availabilityDay && availabilityDay !== 'any') {
        const proDays = pro.availabilityDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!proDays.some(d => d.toLowerCase() === availabilityDay.toLowerCase())) return false;
      }

      // Filter by availability time
      if (availabilityTime && availabilityTime !== 'any') {
        const proTimes = pro.availabilityTimes || ['Morning', 'Afternoon', 'Evening'];
        if (!proTimes.some(t => t.toLowerCase() === availabilityTime.toLowerCase())) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = pro.displayName?.toLowerCase().includes(query);
        const matchesBio = pro.bio?.toLowerCase().includes(query);
        const matchesSkills = pro.skills?.some(skill => skill.toLowerCase().includes(query));
        const matchesCategory = pro.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesBio && !matchesSkills && !matchesCategory) return false;
      }
      return true;
    });
  } catch (error) {
    console.error("Error getting professionals:", error);
    return [];
  }
}

// Booking Services
export async function bookProfessional(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const commissionAmount = Math.round((bookingData.price || 0) * 0.10);
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      commissionAmount,
      commissionStatus: 'pending',
      createdAt: Timestamp.now()
    });
    
    // Add professional notification
    await addNotification(bookingData.professionalId, {
      title: 'New Booking Request',
      message: `You have received a new booking from ${bookingData.customerName} on ${bookingData.bookingDate}.`
    });

    return docRef.id;
  } catch (error) {
    console.error("Error booking professional:", error);
    throw error;
  }
}

export async function getUserBookings(uid: string, role: 'customer' | 'professional' | 'admin'): Promise<Booking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    let q;
    if (role === 'customer') {
      q = query(bookingsRef, where('customerId', '==', uid), orderBy('createdAt', 'desc'));
    } else if (role === 'professional') {
      q = query(bookingsRef, where('professionalId', '==', uid), orderBy('createdAt', 'desc'));
    } else {
      q = query(bookingsRef, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...(doc.data() as any) } as Booking);
    });
    return bookings;
  } catch (error) {
    console.error("Error getting user bookings, attempting fallback query without orderBy:", error);
    // Fallback if index is not created yet
    try {
      const bookingsRef = collection(db, 'bookings');
      let q;
      if (role === 'customer') {
        q = query(bookingsRef, where('customerId', '==', uid));
      } else if (role === 'professional') {
        q = query(bookingsRef, where('professionalId', '==', uid));
      } else {
        q = query(bookingsRef);
      }
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...(doc.data() as any) } as Booking);
      });
      return bookings.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    } catch (fallbackError) {
      console.error("Fallback query failed as well:", fallbackError);
      return [];
    }
  }
}

export async function updateBookingStatus(
  bookingId: string, 
  status: Booking['status'],
  senderRole?: 'customer' | 'professional' | 'admin'
): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, { status });

    // Fetch booking to send notification
    const bookingSnap = await getDoc(docRef);
    if (bookingSnap.exists()) {
      const booking = bookingSnap.data() as Booking;
      const targetUserId = senderRole === 'customer' ? booking.professionalId : booking.customerId;
      const senderName = senderRole === 'customer' ? booking.customerName : booking.professionalName;

      let title = 'Booking Updated';
      let message = `Your booking status with ${senderName} has been updated to ${status}.`;

      if (status === 'approved') {
        title = 'Booking Approved!';
        message = `Good news! ${booking.professionalName} has approved your booking for ${booking.bookingDate}.`;
      } else if (status === 'completed') {
        title = 'Booking Completed';
        message = `${senderName} has marked your booking on ${booking.bookingDate} as completed. Please leave a review!`;
      } else if (status === 'cancelled') {
        title = 'Booking Cancelled';
        message = `Your booking on ${booking.bookingDate} has been cancelled by ${senderName}.`;
      }

      await addNotification(targetUserId, { title, message });
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
}

// Review Services
export async function addReview(
  bookingId: string,
  customerId: string,
  customerName: string,
  professionalId: string,
  rating: number,
  comment: string
): Promise<void> {
  try {
    const reviewsRef = collection(db, 'reviews');
    await addDoc(reviewsRef, {
      bookingId,
      customerId,
      customerName,
      professionalId,
      rating,
      comment,
      createdAt: Timestamp.now()
    });

    // Mark booking as reviewed
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { hasReview: true });

    // Recalculate average rating of professional
    const proRef = doc(db, 'users', professionalId);
    const proSnap = await getDoc(proRef);
    if (proSnap.exists()) {
      const proData = proSnap.data();
      const currentRating = proData.rating ?? 5.0;
      const currentReviewCount = proData.reviewCount ?? 0;
      
      const newReviewCount = currentReviewCount + 1;
      const newRating = parseFloat(((currentRating * currentReviewCount + rating) / newReviewCount).toFixed(1));

      await updateDoc(proRef, {
        rating: newRating,
        reviewCount: newReviewCount
      });
    }

    // Add notification
    await addNotification(professionalId, {
      title: 'New Review Received!',
      message: `${customerName} left you a ${rating}-star review: "${comment.substring(0, 30)}..."`
    });

  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

export async function getProfessionalReviews(professionalId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('professionalId', '==', professionalId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...(doc.data() as any) } as Review);
    });
    return reviews;
  } catch (error) {
    console.error("Error getting professional reviews, executing fallback query:", error);
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, where('professionalId', '==', professionalId));
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...(doc.data() as any) } as Review);
      });
      return reviews.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    } catch (fallbackError) {
      console.error("Fallback review query failed:", fallbackError);
      return [];
    }
  }
}

// Notifications Service
export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: any;
}

export async function addNotification(userId: string, data: { title: string; message: string }): Promise<void> {
  try {
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      userId,
      title: data.title,
      message: data.message,
      isRead: false,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error adding notification:", error);
  }
}

export async function getUserNotifications(userId: string): Promise<NotificationItem[]> {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const notifications: NotificationItem[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...(doc.data() as any) } as NotificationItem);
    });
    return notifications;
  } catch (error) {
    console.error("Error getting notifications, applying fallback:", error);
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const notifications: NotificationItem[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...(doc.data() as any) } as NotificationItem);
      });
      return notifications.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    } catch (fallbackError) {
      console.error("Fallback notifications query failed:", fallbackError);
      return [];
    }
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

// Admin Services
export async function getPendingProfessionals(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef, 
      where('role', '==', 'professional'),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    const pros: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      pros.push(doc.data() as UserProfile);
    });
    return pros;
  } catch (error) {
    console.error("Error getting pending professionals:", error);
    return [];
  }
}

export async function getAllUsersAdmin(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserProfile);
    });
    return users;
  } catch (error) {
    console.error("Error getting all users for admin:", error);
    return [];
  }
}

export async function verifyProfessional(uid: string, approve: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    if (approve) {
      await updateDoc(docRef, { 
        status: 'approved',
        isVerified: true
      });
      await addNotification(uid, {
        title: 'Profile Approved!',
        message: 'Congratulations! Your professional profile on FixKer.pk has been approved. You are now visible to clients!'
      });
    } else {
      await updateDoc(docRef, { 
        status: 'pending',
        isVerified: false
      });
      await addNotification(uid, {
        title: 'Profile Needs Verification',
        message: 'Your profile status has been set to pending. Please review your documents or contact support.'
      });
    }
  } catch (error) {
    console.error("Error verifying professional:", error);
    throw error;
  }
}

export async function suspendUser(uid: string, suspend: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      status: suspend ? 'suspended' : 'approved',
      isVerified: !suspend
    });
    await addNotification(uid, {
      title: suspend ? 'Account Suspended' : 'Account Re-activated',
      message: suspend 
        ? 'Your account has been suspended by the administrator due to policy violations.' 
        : 'Your account has been successfully re-activated by the administrator.'
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    throw error;
  }
}

// Seeding initial high-quality mock data for testing and valuation
const MOCK_PROS = [
  {
    uid: "pro-ac-1",
    email: "kamran.ac@fixker.pk",
    displayName: "Kamran Khan",
    phoneNumber: "03001234567",
    photoURL: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150",
    role: "professional" as const,
    city: "Lahore",
    createdAt: Timestamp.now(),
    status: "approved" as const,
    isVerified: true,
    category: "ac-technician",
    bio: "Certified HVAC engineer with 8+ years of experience in AC servicing, installing and compressor repairing. Expert in both split and inverter type AC units. Fast and clean work guaranteed.",
    price: 1500,
    cnic: "35202-1234567-1",
    skills: ["Inverter AC Expert", "Gas Refilling", "Leakage Fixing", "Compressor Overhaul"],
    portfolio: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300"
    ],
    rating: 4.9,
    reviewCount: 24,
    whatsApp: "923001234567"
  },
  {
    uid: "pro-elec-1",
    email: "bilal.elec@fixker.pk",
    displayName: "Muhammad Bilal",
    phoneNumber: "03217654321",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    role: "professional" as const,
    city: "Karachi",
    createdAt: Timestamp.now(),
    status: "approved" as const,
    isVerified: true,
    category: "electrician",
    bio: "Professional home and industrial electrician. Expert in complete house wiring, UPS installation, DB box fixing, and LED lighting setup. Dedicated to home safety regulations.",
    price: 800,
    cnic: "42201-7654321-1",
    skills: ["House Wiring", "UPS Installation", "Short Circuit Fixing", "Three-Phase DB Panel"],
    portfolio: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300"
    ],
    rating: 4.8,
    reviewCount: 38,
    whatsApp: "923217654321"
  },
  {
    uid: "pro-plum-1",
    email: "sajid.plum@fixker.pk",
    displayName: "Ustad Sajid Ali",
    phoneNumber: "03129876543",
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    role: "professional" as const,
    city: "Islamabad",
    createdAt: Timestamp.now(),
    status: "approved" as const,
    isVerified: true,
    category: "plumber",
    bio: "Senior plumber with 15 years of solid experience fixing leakage, bathroom sanitaryware, gas geysers, water boring, and underground drainage problems.",
    price: 1000,
    cnic: "37405-9876543-1",
    skills: ["Sanitary Fitting", "Gas Geyser repair", "Water Boring", "Leakage pressure test"],
    portfolio: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300"
    ],
    rating: 4.7,
    reviewCount: 41,
    whatsApp: "923129876543"
  },
  {
    uid: "pro-carp-1",
    email: "tariq.carp@fixker.pk",
    displayName: "Tariq Mahmood",
    phoneNumber: "03334445555",
    photoURL: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    role: "professional" as const,
    city: "Rawalpindi",
    createdAt: Timestamp.now(),
    status: "approved" as const,
    isVerified: true,
    category: "carpenter",
    bio: "Skilled carpenter offering custom kitchen making, wood polish, door fittings, lock repairs, and custom furniture assembly. Quality wood selection and fair pricing.",
    price: 1200,
    cnic: "37405-4445555-1",
    skills: ["Kitchen Cabinetry", "Door Installation", "Furniture Polishing", "Smart Lock Installation"],
    portfolio: [],
    rating: 4.6,
    reviewCount: 15,
    whatsApp: "923334445555"
  },
  {
    uid: "pro-paint-1",
    email: "akram.paint@fixker.pk",
    displayName: "Akram Painter",
    phoneNumber: "03456667777",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    role: "professional" as const,
    city: "Lahore",
    createdAt: Timestamp.now(),
    status: "approved" as const,
    isVerified: true,
    category: "painter",
    bio: "Premium painting services including standard interior wall painting, premium exterior weathering coats, custom wallpaper installation, and specialized damp wall treatment.",
    price: 2000,
    cnic: "35202-6667777-1",
    skills: ["Wall Painting", "Seem/Damp treatment", "Wallpaper installation", "Wood Polish"],
    portfolio: [],
    rating: 4.9,
    reviewCount: 19,
    whatsApp: "923456667777"
  },
  {
    uid: "pro-clean-1",
    email: "clean.pro@fixker.pk",
    displayName: "Saima Bibi",
    phoneNumber: "03118889999",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    role: "professional" as const,
    city: "Karachi",
    createdAt: Timestamp.now(),
    status: "approved" as const,
    isVerified: true,
    category: "cleaner",
    bio: "Provide premium deep house cleaning, sofa washing, kitchen degreasing, and window pane washing. High-speed vacuuming tools and imported echo-friendly cleaners used.",
    price: 2500,
    cnic: "42201-8889999-1",
    skills: ["Deep House Cleaning", "Sofa Vacuuming", "Bathroom Sanitization", "Kitchen Degreasing"],
    portfolio: [],
    rating: 5.0,
    reviewCount: 12,
    whatsApp: "923118889999"
  }
];

export async function seedMockProfessionals(): Promise<number> {
  if (!auth.currentUser) {
    console.log("Database seeding skipped: User is not authenticated.");
    return 0;
  }
  let seededCount = 0;
  try {
    for (const pro of MOCK_PROS) {
      const docRef = doc(db, 'users', pro.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const fullPro = {
          ...pro,
          availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          availabilityTimes: ['Morning', 'Afternoon', 'Evening']
        };
        await setDoc(docRef, fullPro);
        seededCount++;
        // Add a sample review for the seeded pro
        const reviewsRef = collection(db, 'reviews');
        const revId = `review-seed-${pro.uid}`;
        await setDoc(doc(reviewsRef, revId), {
          bookingId: `booking-seed-${pro.uid}`,
          customerId: "customer-test-1",
          customerName: "Zohaib Ahmad",
          professionalId: pro.uid,
          rating: Math.floor(pro.rating),
          comment: `Great service by ${pro.displayName}. Highly recommended for anyone looking for standard and affordable quality!`,
          createdAt: Timestamp.now()
        });
      }
    }
    return seededCount;
  } catch (error) {
    console.warn("Skipped or failed seeding:", error);
    return 0;
  }
}

// ==========================================
// Firestore Hardened Error Handler & Chat Services
// ==========================================

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}



export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Chat {
  id: string;
  customerId: string;
  customerName: string;
  customerPhoto: string;
  professionalId: string;
  professionalName: string;
  professionalPhoto: string;
  lastMessage: string;
  lastMessageAt: any;
  lastMessageSenderId: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

export async function getOrCreateChat(
  customerId: string,
  customerName: string,
  customerPhoto: string,
  professionalId: string,
  professionalName: string,
  professionalPhoto: string
): Promise<string> {
  const chatId = `${customerId}_${professionalId}`;
  const path = `chats/${chatId}`;
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        id: chatId,
        customerId,
        customerName,
        customerPhoto: customerPhoto || `https://api.dicebear.com/7.x/adventurer/svg?seed=${customerId}`,
        professionalId,
        professionalName,
        professionalPhoto: professionalPhoto || `https://api.dicebear.com/7.x/adventurer/svg?seed=${professionalId}`,
        lastMessage: "Chat started",
        lastMessageAt: Timestamp.now(),
        lastMessageSenderId: "system"
      });
    }
    return chatId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<void> {
  const path = `chats/${chatId}/messages`;
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      senderId,
      text,
      createdAt: Timestamp.now()
    });

    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageAt: Timestamp.now(),
      lastMessageSenderId: senderId
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function listenToMessages(chatId: string, callback: (messages: Message[]) => void): () => void {
  const path = `chats/${chatId}/messages`;
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...(doc.data() as any) } as Message);
    });
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export function listenToUserChats(
  userId: string,
  role: 'customer' | 'professional',
  callback: (chats: Chat[]) => void
): () => void {
  const path = 'chats';
  const chatsRef = collection(db, 'chats');
  const field = role === 'customer' ? 'customerId' : 'professionalId';
  const q = query(chatsRef, where(field, '==', userId), orderBy('lastMessageAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const chats: Chat[] = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...(doc.data() as any) } as Chat);
    });
    callback(chats);
  }, (error) => {
    try {
      const fallbackQuery = query(chatsRef, where(field, '==', userId));
      onSnapshot(fallbackQuery, (snapshot) => {
        const chats: Chat[] = [];
        snapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...(doc.data() as any) } as Chat);
        });
        chats.sort((a, b) => {
          const tA = a.lastMessageAt?.seconds || 0;
          const tB = b.lastMessageAt?.seconds || 0;
          return tB - tA;
        });
        callback(chats);
      }, (fallbackError) => {
        handleFirestoreError(fallbackError, OperationType.GET, path);
      });
    } catch (err) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  });
}

export async function updateCommissionStatus(bookingId: string, commissionStatus: 'pending' | 'paid'): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, { commissionStatus });
  } catch (error) {
    console.error("Error updating commission status:", error);
    throw error;
  }
}
