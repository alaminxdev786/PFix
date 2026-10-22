/* ============================================
   PFix - Services Data Configuration
   This file contains all service definitions,
   pricing, and categories. Edit this file to
   update services and prices on the website.
   ============================================ */

const PFIX_SERVICES = {
  categories: [
    {
      id: "plumber",
      name: "Plumber",
      nameBn: "প্লাম্বার",
      icon: "🔧",
      color: "#3b82f6",
      bgGradient: "linear-gradient(135deg, #dbeafe, #93c5fd)",
      description: "Professional plumbing services for your home and office. From leaky faucets to complete bathroom installations.",
      descriptionBn: "আপনার বাড়ি ও অফিসের জন্য পেশাদার প্লাম্বিং সেবা।",
      services: [
        { id: "p1", name: "Basin Fitting", nameBn: "বেসিন ফিটিং", price: 400, unit: "per piece" },
        { id: "p2", name: "Commode Fitting", nameBn: "কমোড ফিটিং", price: 600, unit: "per piece" },
        { id: "p3", name: "Tap/Faucet Fitting", nameBn: "ট্যাপ/ফসেট ফিটিং", price: 250, unit: "per piece" },
        { id: "p4", name: "Pipe Leakage Repair", nameBn: "পাইপ লিকেজ মেরামত", price: 300, unit: "per point" },
        { id: "p5", name: "Water Pump Setup", nameBn: "ওয়াটার পাম্প সেটআপ", price: 800, unit: "per unit" },
        { id: "p6", name: "Bathroom Fitting Complete", nameBn: "বাথরুম ফিটিং সম্পূর্ণ", price: 2500, unit: "per bathroom" },
        { id: "p7", name: "Drain Cleaning", nameBn: "ড্রেইন পরিষ্কার", price: 350, unit: "per drain" },
        { id: "p8", name: "Water Tank Cleaning", nameBn: "পানির ট্যাংক পরিষ্কার", price: 500, unit: "per tank" },
        { id: "p9", name: "Pipe Line Installation", nameBn: "পাইপ লাইন ইনস্টলেশন", price: 150, unit: "per feet" },
      ]
    },
    {
      id: "electrician",
      name: "Electrician",
      nameBn: "ইলেক্ট্রিশিয়ান",
      icon: "⚡",
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, #fff7ed, #fed7aa)",
      description: "Expert electrical services. Safe, reliable, and professional electrical solutions.",
      descriptionBn: "বিশেষজ্ঞ ইলেকট্রিক্যাল সেবা। নিরাপদ ও নির্ভরযোগ্য।",
      services: [
        { id: "e1", name: "Switch/Socket Fitting", nameBn: "সুইচ/সকেট ফিটিং", price: 100, unit: "per point" },
        { id: "e2", name: "Fan Installation", nameBn: "ফ্যান ইনস্টলেশন", price: 300, unit: "per unit" },
        { id: "e3", name: "Light Fitting", nameBn: "লাইট ফিটিং", price: 150, unit: "per point" },
        { id: "e4", name: "Wiring (New)", nameBn: "ওয়ারিং (নতুন)", price: 80, unit: "per feet" },
        { id: "e5", name: "MCB/DB Box Setup", nameBn: "এমসিবি/ডিবি বক্স সেটআপ", price: 500, unit: "per unit" },
        { id: "e6", name: "Electrical Troubleshoot", nameBn: "ইলেক্ট্রিক্যাল ট্রাবলশুট", price: 300, unit: "visiting charge" },
        { id: "e7", name: "Generator Setup", nameBn: "জেনারেটর সেটআপ", price: 1500, unit: "per unit" },
        { id: "e8", name: "Chandelier Installation", nameBn: "ঝাড়বাতি ইনস্টলেশন", price: 500, unit: "per unit" },
      ]
    },
    {
      id: "mason",
      name: "Mason",
      nameBn: "রাজমিস্ত্রী",
      icon: "🧱",
      color: "#ef4444",
      bgGradient: "linear-gradient(135deg, #fef3c7, #fde68a)",
      description: "Skilled masonry work including wall construction, plastering, and general repairs.",
      descriptionBn: "দক্ষ রাজমিস্ত্রীর কাজ - দেয়াল নির্মাণ, প্লাস্টার ও সাধারণ মেরামত।",
      services: [
        { id: "m1", name: "Wall Construction", nameBn: "দেয়াল নির্মাণ", price: 200, unit: "per sqft" },
        { id: "m2", name: "Plastering", nameBn: "প্লাস্টারিং", price: 120, unit: "per sqft" },
        { id: "m3", name: "Wall Crack Repair", nameBn: "দেয়ালের ফাটল মেরামত", price: 300, unit: "per repair" },
        { id: "m4", name: "Waterproofing", nameBn: "ওয়াটারপ্রুফিং", price: 150, unit: "per sqft" },
        { id: "m5", name: "Concrete Work", nameBn: "কংক্রিট কাজ", price: 250, unit: "per sqft" },
        { id: "m6", name: "Boundary Wall", nameBn: "বাউন্ডারি ওয়াল", price: 300, unit: "per rft" },
      ]
    },
    {
      id: "painter",
      name: "Painter",
      nameBn: "রঙ মিস্ত্রী",
      icon: "🎨",
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, #dcfce7, #86efac)",
      description: "Transform your space with professional painting services. Interior, exterior, and decorative painting.",
      descriptionBn: "পেশাদার রঙের কাজ। ইন্টেরিয়র, এক্সটেরিয়র ও ডেকোরেটিভ পেইন্টিং।",
      services: [
        { id: "pt1", name: "Interior Painting", nameBn: "ইন্টেরিয়র পেইন্টিং", price: 12, unit: "per sqft" },
        { id: "pt2", name: "Exterior Painting", nameBn: "এক্সটেরিয়র পেইন্টিং", price: 15, unit: "per sqft" },
        { id: "pt3", name: "Wood Polishing", nameBn: "কাঠের পলিশিং", price: 25, unit: "per sqft" },
        { id: "pt4", name: "Wall Putty", nameBn: "ওয়াল পুটি", price: 10, unit: "per sqft" },
        { id: "pt5", name: "Texture Painting", nameBn: "টেক্সচার পেইন্টিং", price: 35, unit: "per sqft" },
        { id: "pt6", name: "Primer Coating", nameBn: "প্রাইমার কোটিং", price: 8, unit: "per sqft" },
      ]
    },
    {
      id: "tiles",
      name: "Tiles Mason",
      nameBn: "টাইলস মিস্ত্রী",
      icon: "🔲",
      color: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, #f3e8ff, #c4b5fd)",
      description: "Expert tile installation for floors, walls, and bathrooms with precision finishing.",
      descriptionBn: "মেঝে, দেয়াল ও বাথরুমে দক্ষ টাইলস ইনস্টলেশন।",
      services: [
        { id: "t1", name: "Floor Tiles Fitting", nameBn: "ফ্লোর টাইলস ফিটিং", price: 45, unit: "per sqft" },
        { id: "t2", name: "Wall Tiles Fitting", nameBn: "ওয়াল টাইলস ফিটিং", price: 50, unit: "per sqft" },
        { id: "t3", name: "Bathroom Tiles", nameBn: "বাথরুম টাইলস", price: 55, unit: "per sqft" },
        { id: "t4", name: "Kitchen Backsplash", nameBn: "কিচেন ব্যাকস্প্ল্যাশ", price: 60, unit: "per sqft" },
        { id: "t5", name: "Tile Grouting", nameBn: "টাইল গ্রাউটিং", price: 15, unit: "per sqft" },
        { id: "t6", name: "Tile Removal", nameBn: "টাইল অপসারণ", price: 20, unit: "per sqft" },
      ]
    },
    {
      id: "cleaner",
      name: "Cleaner",
      nameBn: "ক্লিনার",
      icon: "🧹",
      color: "#06b6d4",
      bgGradient: "linear-gradient(135deg, #e0f2fe, #7dd3fc)",
      description: "Professional cleaning services for homes, offices, and post-construction cleanup.",
      descriptionBn: "বাড়ি, অফিস ও নির্মাণ-পরবর্তী পরিষ্কার-পরিচ্ছন্নতা সেবা।",
      services: [
        { id: "c1", name: "Home Deep Clean", nameBn: "হোম ডিপ ক্লিন", price: 2000, unit: "per room" },
        { id: "c2", name: "Office Cleaning", nameBn: "অফিস পরিষ্কার", price: 3000, unit: "per 1000 sqft" },
        { id: "c3", name: "Bathroom Deep Clean", nameBn: "বাথরুম ডিপ ক্লিন", price: 500, unit: "per bathroom" },
        { id: "c4", name: "Kitchen Deep Clean", nameBn: "কিচেন ডিপ ক্লিন", price: 800, unit: "per kitchen" },
        { id: "c5", name: "Post-Construction Clean", nameBn: "নির্মাণ-পরবর্তী পরিষ্কার", price: 5, unit: "per sqft" },
        { id: "c6", name: "Sofa Cleaning", nameBn: "সোফা পরিষ্কার", price: 600, unit: "per seat" },
        { id: "c7", name: "Carpet Cleaning", nameBn: "কার্পেট পরিষ্কার", price: 10, unit: "per sqft" },
      ]
    },
    {
      id: "ac-fridge",
      name: "AC & Fridge Repair",
      nameBn: "এসি ও ফ্রিজ মেরামত",
      icon: "❄️",
      color: "#0ea5e9",
      bgGradient: "linear-gradient(135deg, #ecfdf5, #6ee7b7)",
      description: "AC and Refrigerator servicing, repair, and installation by certified technicians.",
      descriptionBn: "সার্টিফাইড টেকনিশিয়ান দ্বারা এসি ও ফ্রিজ সার্ভিসিং, মেরামত ও ইনস্টলেশন।",
      services: [
        { id: "ac1", name: "AC Checkup/Diagnosis", nameBn: "এসি চেকআপ/ডায়াগনোসিস", price: 300, unit: "visiting charge" },
        { id: "ac2", name: "AC Gas Refill", nameBn: "এসি গ্যাস রিফিল", price: 2500, unit: "per unit" },
        { id: "ac3", name: "AC Servicing", nameBn: "এসি সার্ভিসিং", price: 800, unit: "per unit" },
        { id: "ac4", name: "AC Installation", nameBn: "এসি ইনস্টলেশন", price: 2000, unit: "per unit" },
        { id: "ac5", name: "AC Uninstallation", nameBn: "এসি আনইনস্টলেশন", price: 1000, unit: "per unit" },
        { id: "ac6", name: "Fridge Checkup", nameBn: "ফ্রিজ চেকআপ", price: 300, unit: "visiting charge" },
        { id: "ac7", name: "Fridge Gas Refill", nameBn: "ফ্রিজ গ্যাস রিফিল", price: 2000, unit: "per unit" },
        { id: "ac8", name: "Fridge Compressor Repair", nameBn: "ফ্রিজ কম্প্রেসর মেরামত", price: 3000, unit: "per unit" },
        { id: "ac9", name: "Fridge Servicing", nameBn: "ফ্রিজ সার্ভিসিং", price: 600, unit: "per unit" },
      ]
    }
  ],

  // Company info - easily editable
  company: {
    name: "PFix",
    tagline: "Your Problem, Our Solution.",
    phone: "+880 1XXXXXXXXX",
    email: "info@pfix.com.bd",
    address: "Dhaka, Bangladesh",
    whatsapp: "+8801XXXXXXXXX",
    facebook: "#",
    instagram: "#",
    workingHours: "Saturday - Thursday: 8:00 AM - 10:00 PM",
    emergencyNote: "Emergency services available 24/7"
  },

  // Workers data (for demo - in production this would be in a database)
  workers: [
    { id: "w1", name: "Rahim Uddin", phone: "01712345678", category: "plumber", rating: 4.8, jobs: 156, pin: "1234" },
    { id: "w2", name: "Karim Mia", phone: "01812345678", category: "electrician", rating: 4.9, jobs: 203, pin: "1234" },
    { id: "w3", name: "Abdul Hannan", phone: "01912345678", category: "mason", rating: 4.7, jobs: 98, pin: "1234" },
    { id: "w4", name: "Jamal Hossain", phone: "01612345678", category: "painter", rating: 4.6, jobs: 127, pin: "1234" },
    { id: "w5", name: "Salam Ahmed", phone: "01512345678", category: "tiles", rating: 4.8, jobs: 89, pin: "1234" },
    { id: "w6", name: "Rony Das", phone: "01312345678", category: "cleaner", rating: 4.9, jobs: 175, pin: "1234" },
    { id: "w7", name: "Milon Khan", phone: "01412345678", category: "ac-fridge", rating: 4.7, jobs: 112, pin: "1234" },
  ],

  // Admin credentials (change these!)
  admin: {
    username: "admin",
    password: "pfix2024"
  }
};

// Make it globally available
if (typeof window !== 'undefined') {
  window.PFIX_SERVICES = PFIX_SERVICES;
}
