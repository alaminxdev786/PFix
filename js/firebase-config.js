/* ========================================================
   PFix - Firebase Cloud Firestore Configuration & Sync
   ========================================================
   এই ফাইলটিতে আপনার Firebase প্রজেক্টের তথ্য বসিয়ে দিলে
   সরাসরি রিয়েল-টাইম ক্লাউড ডাটাবেজ (Cloud Firestore) সক্রিয় হবে।
   
   যদি এখনো Firebase সেটআপ না থাকে, তবে কোডটি স্বয়ংক্রিয়ভাবে
   LocalStorage মোডে স্মুথলি চলবে।
   ======================================================== */

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const PFixDB = {
  isConfigured: false,
  firestore: null,

  init() {
    // Check if user has replaced placeholder credentials
    if (
      typeof firebase !== 'undefined' &&
      FIREBASE_CONFIG.apiKey &&
      FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY' &&
      FIREBASE_CONFIG.projectId !== 'YOUR_PROJECT_ID'
    ) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.firestore = firebase.firestore();
        this.isConfigured = true;
        console.log('🔥 [PFix] Cloud Firebase Firestore সফলভাবে কানেক্ট হয়েছে!');
      } catch (err) {
        console.warn('⚠️ [PFix] Firebase ইনিশিয়ালাইজেশন ত্রুটি:', err);
        this.isConfigured = false;
      }
    } else {
      console.log('ℹ️ [PFix] Firebase ক্রেডেনশিয়াল দেওয়া নেই। অ্যাপটি LocalStorage মোডে চলছে।');
      this.isConfigured = false;
    }
  },

  // Save or update booking
  async saveBooking(booking) {
    // Always keep LocalStorage in sync as backup
    let localList = this.getLocalBookings();
    const idx = localList.findIndex(b => b.id === booking.id);
    if (idx >= 0) {
      localList[idx] = booking;
    } else {
      localList.unshift(booking);
    }
    localStorage.setItem('pfix_bookings', JSON.stringify(localList));

    // If Cloud Firestore is enabled, save to cloud
    if (this.isConfigured && this.firestore) {
      try {
        await this.firestore.collection('bookings').doc(booking.id).set(booking, { merge: true });
        console.log('☁️ [PFix Cloud] Booking saved to Cloud Firestore:', booking.id);
        return true;
      } catch (err) {
        console.error('❌ Cloud Firestore save error:', err);
      }
    }
    return true;
  },

  // Update booking fields
  async updateBooking(bookingId, updates) {
    let localList = this.getLocalBookings();
    const idx = localList.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      localList[idx] = { ...localList[idx], ...updates };
      localStorage.setItem('pfix_bookings', JSON.stringify(localList));
    }

    if (this.isConfigured && this.firestore) {
      try {
        await this.firestore.collection('bookings').doc(bookingId).update(updates);
        console.log('☁️ [PFix Cloud] Booking updated in Cloud Firestore:', bookingId);
      } catch (err) {
        console.error('❌ Cloud Firestore update error:', err);
      }
    }
  },

  // Real-time listener for bookings
  onBookingsChange(callback) {
    if (this.isConfigured && this.firestore) {
      return this.firestore.collection('bookings')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          const cloudBookings = [];
          snapshot.forEach(doc => {
            cloudBookings.push(doc.data());
          });
          // Update local cache
          localStorage.setItem('pfix_bookings', JSON.stringify(cloudBookings));
          callback(cloudBookings);
        }, (err) => {
          console.warn('⚠️ Cloud Firestore listener fallback to local:', err);
          callback(this.getLocalBookings());
        });
    } else {
      // LocalStorage mode: listen for cross-tab storage events
      window.addEventListener('storage', (e) => {
        if (e.key === 'pfix_bookings') {
          callback(this.getLocalBookings());
        }
      });
      callback(this.getLocalBookings());
      return () => {};
    }
  },

  // Helper to read local bookings
  getLocalBookings() {
    try {
      return JSON.parse(localStorage.getItem('pfix_bookings') || '[]');
    } catch {
      return [];
    }
  }
};

// Initialize DB right away
if (typeof window !== 'undefined') {
  window.PFixDB = PFixDB;
  document.addEventListener('DOMContentLoaded', () => {
    PFixDB.init();
  });
}
