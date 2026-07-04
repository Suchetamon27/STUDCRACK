import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, addDoc, 
  onSnapshot, updateDoc, increment 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';
import { 
  Home, Search, Trophy, User, Bell, Plus, BookOpen, PlayCircle, 
  GraduationCap, Wallet, Users, Share2, Settings, ChevronRight, 
  Heart, Eye, Bookmark, Database, Play, RotateCw, MessageSquare, 
  Smartphone, X, CreditCard, History, CheckCircle2, TrendingUp, 
  Filter, ArrowLeft, Trash2, Gift, Clock, ExternalLink,
  Edit3, Image as ImageIcon, Sparkles, DownloadCloud, CheckSquare,
  Copy, Crown, Info, Landmark, HelpCircle, ArrowUpRight, LayoutGrid,
  MessageCircle, FileText, Feather, ToggleLeft, ToggleRight,
  UserPlus, Headphones, Handshake, ShieldCheck, FileCheck, UserCircle,
  Trash, ChevronDown, Lightbulb, FileQuestion, Send, Check, AlertCircle,
  QrCode, CreditCard as CardIcon
} from 'lucide-react';
/**
* STUDCRACK - OFFICIAL V 3.0.1 (Unified Responsive & Enhanced Payments)
 * Direct Deployment Ready
 */
// --- GLOBAL CONSTANTS ---
const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/StudcrackOfficialHub";
const EXAMS_LIST = ["GATE", "WBJEE", "JEE Mains", "NEET", "B.Tech", "Board", "UPSC", "CAT"];
const COLLEGES_LIST = ["NSEC", "IIT", "NIT", "JU", "CU", "MAKAUT", "MSIT", "TIST"];
const FEED_CATEGORIES = ["Notes", "Courses", "Playlists", "Following", "Quizzes"];
const WHEEL_PRIZES = [
  { emd: 10, color: 'bg-[#FFD700]', label: '10 Emeralds', icon: '👑' },
  { emd: 0, color: 'bg-[#94a3b8]', label: '0 Emeralds', icon: '💎' },
  { emd: 1, color: 'bg-[#22c55e]', label: '1 Emerald', icon: '💎' },
  { emd: 2, color: 'bg-[#3b82f6]', label: '2 Emeralds', icon: '💎' },
  { emd: 3, color: 'bg-[#a855f7]', label: '3 Emeralds', icon: '💎' },
  { emd: 4, color: 'bg-[#f59e0b]', label: '4 Emeralds', icon: '💎' },
  { emd: 5, color: 'bg-[#ec4899]', label: '5 Emeralds', icon: '💎' },
  { emd: 6, color: 'bg-[#ef4444]', label: '6 Emeralds', icon: '💎' },
];
const DEFAULT_PROFILES = [
  { uid: "author_rohan", username: "rohan_cse", displayName: "Rohan Sen", balance: 1250, referrals: 15, avatarSeed: "rohan" },
  { uid: "author_ananya", username: "ananya_phy", displayName: "Ananya Roy", balance: 940, referrals: 8, avatarSeed: "ananya" },
  { uid: "author_vikram", username: "chem_vikram", displayName: "Vikram Dev", balance: 750, referrals: 6, avatarSeed: "vikram" }
];
const DEFAULT_NOTES = [
  {
    id: "note_1",
    title: "GATE CSE: Algorithms & Asymptotic Complexities Cheat Sheet",
    exam: "GATE",
    authorName: "Rohan Sen",
    authorId: "author_rohan",
    views: 1240,
    likes: 85,
    timestamp: Date.now() - 3600000 * 2,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    type: 'NOTE'
  },
  {
   id: "note_2",
    title: "WBJEE Physics: Electromagnetism Mindmap and Key Formulas",
    exam: "WBJEE",
    authorName: "Ananya Roy",
    authorId: "author_ananya",
    views: 890,
    likes: 64,
    timestamp: Date.now() - 3600000 * 12,
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80",
    type: 'NOTE'
  },
  {
    id: "note_3",
    title: "JEE Mains: Organic Chemistry Reaction Mechanisms Summary",
    exam: "JEE Mains",
    authorName: "Vikram Dev",
    authorId: "author_vikram",
    views: 1540,
    likes: 110,
    timestamp: Date.now() - 3600000 * 24,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    type: 'NOTE',
    isPremium: true,
    priceEmd: 2450,
    priceInr: 49
  }
];
const COURSES_DATA = [
  { id: "c1", title: "Complete Calculus for Engineering Entrance Exams", provider: "Academy Hub", lessons: 14, enrollments: 342, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80", level: "Intermediate" },
  { id: "c2", title: "GATE CSE: Database Management Systems (DBMS) Course", provider: "EduCrack", lessons: 18, enrollments: 521, image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80", level: "Advanced", isPremium: true, priceEmd: 9950, priceInr: 199 }
];
const PLAYLISTS_DATA = [
  { id: "p1", title: "JEE Physics: Ultimate Electromagnetism Series", count: 12, views: "3.4k", image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80" },
  { id: "p2", title: "GATE Math: Linear Algebra Made Simple", count: 8, views: "2.1k", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80" }
];
const QUIZZES_DATA = [
  {
    id: "quiz_1",
    title: "GATE CSE: Graph Theory Basics",
    category: "GATE",
    questions: [
      {
        question: "What is the maximum number of edges in a bipartite graph with n vertices?",
        options: ["n^2 / 4", "n(n-1) / 2", "n^2 / 2", "n log n"],
        answer: 0
      },
      {
        question: "Which traversal technique is used to find shortest paths in an unweighted graph?",
        options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Inorder Traversal", "Dijkstra's Algorithm"],
        answer: 1
      }
    ],
    reward: 50
  },
  {
    id: "quiz_2",
    title: "WBJEE Chemistry: Key Organic Reagents",
    category: "WBJEE",
    questions: [
      {
        question: "Which reagent is used in the Clemmensen reduction of aldehydes and ketones?",
        options: ["Zn-Hg / conc. HCl", "LiAlH4 in dry ether", "NaBH4 in ethanol", "NH2NH2 / KOH"],
        answer: 0
      },
      {
        question: "What is the hybridisation state of the carbon atom in a carbocation?",
        options: ["sp", "sp2", "sp3", "dsp2"],
        answer: 1
      }
    ],
    reward: 40
  }
];
const TOP_UP_PACKS = [
  { emd: 500, inr: 10, title: "Starter Pack" },
  { emd: 2500, inr: 45, title: "Scholar Pack" },
  { emd: 10000, inr: 160, title: "Super Saver Pack" }
];
// --- FIREBASE INITIALIZATION & DUAL-MODE DETECTION ---
let app, auth, db;
let isFirebaseFallback = false;
let appId = 'studcrack-prod-v3';
try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const config = JSON.parse(__firebase_config);
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof __app_id !== 'undefined') appId = __app_id;
  } else {
    throw new Error("No config injected");
  }
} catch (e) {
  console.warn("Firebase config not found. Falling back to LocalStorage mode.");
  isFirebaseFallback = true;
}
export default function App() {
  // Initialization Lifecycle
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);
  const [dataReady, setDataReady] = useState(false);
  // UI State
 const [activeTab, setActiveTab] = useState('feed');
  const [feedCategory, setFeedCategory] = useState('Notes');
  const [rankingTab, setRankingTab] = useState('emeralds');
  const [contentFilter, setContentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
  
  // Game & Ad State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [adTimer, setAdTimer] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(true);
  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  // Dynamic UPI Payment & Purchase State
  const [purchaseItem, setPurchaseItem] = useState(null);
  const [upiPaymentDetail, setUpiPaymentDetail] = useState(null); // { type: 'content' | 'topup', item, amount, emdReward }
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
 // Modals
  const [modals, setModals] = useState({
    upload: false, ad: false, withdraw: false, viewNote: null,
    search: false, notifications: false, settings: false,
    editProfile: false, notebook: false, planner: false,
    library: false, wallet: false, spin: false, referral: false,
    supportGroup: false, manageExams: false, manageColleges: false,
    purchaseContent: false, upiPayment: false
  });
  // --- AUTHENTICATION ---
  useEffect(() => {
    if (isFirebaseFallback) {
      let localUid = localStorage.getItem('studcrack_local_uid');
      if (!localUid) {
        localUid = `local_user_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('studcrack_local_uid', localUid);
      }
      setUser({ uid: localUid, isAnonymous: true });
    } else {
      const initAuth = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (err) {
          console.error("Auth Failure, falling back:", err);
          isFirebaseFallback = true;
          let localUid = localStorage.getItem('studcrack_local_uid');
          if (!localUid) {
            localUid = `local_user_${Math.random().toString(36).substring(7)}`;
            localStorage.setItem('studcrack_local_uid', localUid);
          }
          setUser({ uid: localUid, isAnonymous: true });
        }
      };
      initAuth();
      return onAuthStateChanged(auth, setUser);
    }
  }, []);
  // --- DATA SYNC ---
  useEffect(() => {
    if (!user) return;
    if (isFirebaseFallback) {
      const localKey = `studcrack_user_${user.uid}`;
      let localUser = JSON.parse(localStorage.getItem(localKey));
      if (!localUser) {
        localUser = {
          uid: user.uid,
          username: `student_${user.uid.slice(0, 5)}`,
          displayName: "Scholar Profile",
          balance: 150,
          referrals: 0,
          streak: 1,
          lastActive: Date.now(),
          exams: ["WBJEE", "GATE"],
          colleges: ["NSEC"],
          followers: 5,
          following: 12,
          profileColor: 'from-blue-600 via-blue-400 to-blue-50',
          avatarSeed: user.uid,
          isPremium: false,
          joinedAt: Date.now(),
          notebook: [],
          planner: [],
          library: [],
          transactions: [],
          notifications: [
           { id: "welcome", title: "Welcome to Studcrack! 🎓", content: "You've successfully launched the platform. Complete tasks, answer quizzes, and refer friends to earn EMD!", read: false, timestamp: Date.now() }
          ],
          completedQuizzes: [],
          followingUids: [],
          purchasedContent: []
        };
        localStorage.setItem(localKey, JSON.stringify(localUser));
      }
      setUserData(localUser);
      let localProfiles = JSON.parse(localStorage.getItem('studcrack_public_profiles'));
      if (!localProfiles || localProfiles.length === 0) {
        localProfiles = DEFAULT_PROFILES;
        localStorage.setItem('studcrack_public_profiles', JSON.stringify(localProfiles));
      }
      if (!localProfiles.some(p => p.uid === user.uid)) {
        localProfiles.push({
          uid: user.uid, username: localUser.username, balance: localUser.balance,
          referrals: localUser.referrals, avatarSeed: localUser.avatarSeed, displayName: localUser.displayName
        });
        localStorage.setItem('studcrack_public_profiles', JSON.stringify(localProfiles));
      }
      setAllProfiles(localProfiles);
      let localNotes = JSON.parse(localStorage.getItem('studcrack_public_notes'));
      if (!localNotes || localNotes.length === 0) {
        localNotes = DEFAULT_NOTES;
        localStorage.setItem('studcrack_public_notes', JSON.stringify(localNotes));
      }
      setNotes(localNotes);
      setDataReady(true);
    } else {
      // Private Profile live firestore listener
      const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
      const unsubUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          const initialProfile = {
            uid: user.uid,
            username: `user_${user.uid.slice(0, 5)}`,
            displayName: "Active Learner",
            balance: 150,
            referrals: 0,
            streak: 1,
            lastActive: Date.now(),
            exams: ["WBJEE", "GATE"],
            colleges: ["NSEC"],
            followers: 5,
            following: 12,
            profileColor: 'from-blue-600 via-blue-400 to-blue-50',
            avatarSeed: user.uid,
            isPremium: false,
            joinedAt: Date.now(),
            notebook: [],
            planner: [],
            library: [],
            transactions: [],
            notifications: [
 { id: "welcome", title: "Welcome to Studcrack! 🎓", content: "You've successfully launched the platform. Complete tasks, answer quizzes, and refer friends to earn EMD!", read: false, timestamp: Date.now() }
            ],
            completedQuizzes: [],
            followingUids: [],
            purchasedContent: []
          };
          setDoc(userRef, initialProfile);
        }
      });
      // Public Profiles listener
      const unsubProfiles = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'profiles'), (snap) => {
        setAllProfiles(snap.docs.map(d => d.data()));
      });
      // Public Notes listener
      const unsubNotes = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'notes'), (snap) => {
        setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.timestamp - a.timestamp));
        setDataReady(true);
      });
      // Sync public presence
      if (userData) {
        setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'profiles', user.uid), {
          uid: user.uid, username: userData.username, balance: userData.balance,
          referrals: userData.referrals, avatarSeed: userData.avatarSeed, displayName: userData.displayName
        }, { merge: true });
      }
      return () => { unsubUser(); unsubProfiles(); unsubNotes(); };
    }
  }, [user, userData?.username, dataReady]);
  // --- SPLASH CONTROLLER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setSplashProgress(prev => (prev < 100 ? prev + 4 : 100));
    }, 40);
    if (splashProgress >= 100 && dataReady) {
      setTimeout(() => setShowSplash(false), 400);
    }
    return () => clearInterval(timer);
  }, [splashProgress, dataReady]);
  // --- DAILY STREAK MECHANICS ---
  useEffect(() => {
    if (!userData || !user) return;
    const now = Date.now();
    const lastActive = userData.lastActive || now;
    const diffTime = now - lastActive;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      const newStreak = (userData.streak || 0) + 1;
      const reward = 10 * newStreak;
      updateProfile({
        streak: newStreak,
        lastActive: now,
        balance: increment(reward)
      });
      addNotification("Streak Active! 🔥", `You maintained your streak for ${newStreak} days! Added ${reward} EMD bonus.`);
    } else if (diffDays > 1) {
      updateProfile({
        streak: 1,
        lastActive: now
      });
      addNotification("Streak Reset ⏳", "It's been more than 24 hours since your last session. Your streak reset to 1 day.");
    } else {
      if (!userData.lastActive) {
        updateProfile({ lastActive: now });
      }
    }
  }, [user, userData?.streak]);
  // --- GENERAL ACTIONS WRAPPERS ---
  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
  
  const handleCopy = (text) => {
    const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el); notify("Copied!");
  };
  const updateProfile = async (fields) => {
    if (!user || !userData) return;
    const updated = { ...userData };
    Object.keys(fields).forEach(key => {
      const val = fields[key];
      if (val && typeof val === 'object' && val.operand !== undefined) {
        updated[key] = (updated[key] || 0) + val.operand;
      } else {
        updated[key] = val;
      }
    });
    if (isFirebaseFallback) {
      setUserData(updated);
      localStorage.setItem(`studcrack_user_${user.uid}`, JSON.stringify(updated));
      
      if (updated.username) {
        const publicProfiles = JSON.parse(localStorage.getItem('studcrack_public_profiles') || '[]');
        const idx = publicProfiles.findIndex(p => p.uid === user.uid);
        const pObj = {
          uid: user.uid, username: updated.username, balance: updated.balance,
          referrals: updated.referrals, avatarSeed: updated.avatarSeed, displayName: updated.displayName
        };
        if (idx > -1) publicProfiles[idx] = pObj;
        else publicProfiles.push(pObj);
        localStorage.setItem('studcrack_public_profiles', JSON.stringify(publicProfiles));
        setAllProfiles(publicProfiles);
      }
    } else {
      try {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid), fields);
      } catch (err) { console.error("Firestore sync fail", err); }
    }
  };
  const addNotification = (title, content) => {
    if (!userData) return;
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(5)}`,
      title,
      content,
      read: false,
      timestamp: Date.now()
    };
    updateProfile({
      notifications: [newNotif, ...(userData.notifications || [])]
    });
  };
  const handleSpin = async () => {
    if (isSpinning || !user) return;
    setIsSpinning(true);
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const rotation = (10 * 360) + (WHEEL_PRIZES.length - prizeIndex) * (360 / WHEEL_PRIZES.length);
    setSpinRotation(prev => prev + rotation);
    setTimeout(async () => {
      const prize = WHEEL_PRIZES[prizeIndex];
      await updateProfile({ balance: increment(prize.emd) });
      setIsSpinning(false); 
      notify(`Landed on ${prize.emd} Emeralds!`);
      addNotification("Lucky Wheel Reward 🎡", `You spun the wheel and landed on ${prize.label}!`);
    }, 4000);
  };
  const handleWatchAd = () => {
    if (adTimer > 0) return;
    setModals(p => ({...p, ad: true}));
    let left = 10; setAdTimer(left);
    const timer = setInterval(() => {
      left -= 1; setAdTimer(left);
      if (left <= 0) {
        clearInterval(timer); setModals(p => ({...p, ad: false}));
        updateProfile({ balance: increment(25) });
        notify("Earned 25 Emeralds!");
        addNotification("Ad Reward Credited 📺", "You watched an ad study-break and earned 25 EMD.");
      }
    }, 1000);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    const titleVal = e.target.title.value;
    const examVal = e.target.exam.value;
    
    const newNote = {
      title: titleVal, exam: examVal, authorName: userData.displayName, authorId: user.uid,
      views: 0, likes: 0, timestamp: Date.now(), image: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/600/400`, type: 'NOTE'
    };
    if (isFirebaseFallback) {
      newNote.id = `local_note_${Date.now()}`;
      const localNotes = [newNote, ...notes];
      localStorage.setItem('studcrack_public_notes', JSON.stringify(localNotes));
      setNotes(localNotes);
      setModals(p => ({...p, upload: false})); 
      notify("Published locally!");
    } else {
      try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'notes'), newNote);
        setModals(p => ({...p, upload: false})); 
        notify("Published!");
      } catch(err) { notify("Error."); }
    }
  };
  const handleCopyNoteLink = (note) => {
    handleCopy(`${window.location.origin}/?note=${note.id}`);
  };
  const toggleFollowUser = (authorId, authorName) => {
    if (!userData || authorId === user.uid) return;
    const currentFollowing = userData.followingUids || [];
    let updated;
    let isFollowing = currentFollowing.includes(authorId);
    if (isFollowing) {
      updated = currentFollowing.filter(id => id !== authorId);
      updateProfile({
        following: increment(-1),
        followingUids: updated
      });
      notify(`Unfollowed @${authorName}`);
    } else {
      updated = [...currentFollowing, authorId];
      updateProfile({
        following: increment(1),
        followingUids: updated
      });
      notify(`Following @${authorName}`);
      addNotification("New Connection 🤝", `You are now following @${authorName} and will see their notes in your Feed.`);
    }
  };
  // Content Selection triggers (Premium content locking checker)
  const handleSelectNote = (note) => {
    const isOwned = note.authorId === user.uid || userData?.purchasedContent?.includes(note.id);
    if (note.isPremium && !isOwned) {
      setPurchaseItem(note);
      setModals(p => ({ ...p, purchaseContent: true }));
    } else {
      setModals(p => ({ ...p, viewNote: note }));
    }
  };
  const handleSelectCourse = (course) => {
    const isOwned = userData?.purchasedContent?.includes(course.id);
    if (course.isPremium && !isOwned) {
      setPurchaseItem({ ...course, type: 'COURSE' });
      setModals(p => ({ ...p, purchaseContent: true }));
    } else {
      notify(`Accessing course lectures for "${course.title}"`);
    }
  };
  const unreadNotificationsCount = userData?.notifications?.filter(n => !n.read).length || 0;
  // --- RENDER SCREEN CONFIG ---
  if (showSplash) return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-10 relative overflow-hidden font-sans">
       <div className="w-24 h-24 bg-blue-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-100 mb-20 animate-pulse">
          <Feather size={48} className="text-white" />
       </div>
       <div className="space-y-6 w-full max-w-xs text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tighter uppercase Outfit">
             Elevate<br/>your <span className="text-blue-500 italic">study</span><br/>experience.
          </h2>
          <div className="flex items-center justify-center space-x-4 pt-4">
             <div className="h-[2px] w-12 bg-blue-500"></div>
             <h4 className="text-md font-bold tracking-[0.4em] text-blue-500 uppercase Outfit">Studcrack</h4>
          </div>
       </div>
       <div className="absolute bottom-20 w-full max-w-[280px] space-y-4">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center">Launching Platform...</p>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${splashProgress}%` }}></div>
          </div>
       </div>
       <div className="absolute bottom-8 text-[10px] font-bold text-gray-400 tracking-widest uppercase">V 3.0.1 BUILD-CORE</div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-gray-900 overflow-x-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-bold uppercase tracking-tight">{notification}</span>
        </div>
      )}
      {/* DESKTOP SIDEBAR NAV */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen z-50 p-6">
        <div className="mb-10 flex items-center space-x-3">
          <div className="p-2 bg-blue-500 text-white rounded-xl">
            <Feather size={20} />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">STUDCRACK</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarBtn icon={Home} label="Feed" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
          <SidebarBtn icon={Search} label="Discover" active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
          <SidebarBtn icon={Trophy} label="Ranking" active={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')} />
          <SidebarBtn icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setContentFilter('All'); }} />
        </nav>
        <div className="pt-6 border-t border-gray-50 space-y-3">
          {userData && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.avatarSeed}`} className="w-10 h-10 rounded-full bg-white border border-gray-200" />
              <div className="truncate">
                <p className="font-extrabold text-xs text-gray-900 truncate">@{userData.username}</p>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{Math.floor(userData.balance)} EMD</p>
              </div>
            </div>
          )}
          <button onClick={() => setModals(m => ({...m, upload: true}))} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs uppercase tracking-widest shadow-xl transition-all">
            <Plus size={16} /> <span>Upload Material</span>
          </button>
        </div>
      </aside>
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* MOBILE & MOBILE-COMPATIBLE HEADER */}
        <header className="px-5 py-4 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 md:px-8">
          <h1 onClick={() => setActiveTab('feed')} className="text-2xl font-black text-gray-900 cursor-pointer tracking-tighter uppercase italic md:hidden">Studcrack</h1>
          <div className="hidden md:flex flex-col">
            <h2 className="text-2xl font-black tracking-tight uppercase Outfit">{activeTab} View</h2>
            <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">official cloud synchronization active</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={() => setModals(p => ({...p, search: true}))} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"><Search size={22} /></button>
            <div className="relative">
              <button onClick={() => setModals(p => ({...p, notifications: true}))} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"><Bell size={22} /></button>
              {unreadNotificationsCount > 0 && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white animate-bounce">
                  {unreadNotificationsCount}
                </div>
              )}
            </div>
            {activeTab === 'profile' && <button onClick={() => setModals(p => ({...p, settings: true}))} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"><Settings size={22} /></button>}
          </div>
        </header>
        {/* Dynamic Inner Layout */}
        <main className="flex-1 pb-24 md:pb-8 p-4 md:p-8 max-w-4xl w-full mx-auto overflow-y-auto no-scrollbar">
          {activeTab === 'feed' && (
            <FeedView 
              notes={notes} category={feedCategory} setCategory={setFeedCategory} 
              onView={handleSelectNote} 
              userData={userData}
              setActiveQuiz={setActiveQuiz}
              onSelectCourse={handleSelectCourse}
            />
          )}
          {activeTab === 'discover' && <DiscoverView notes={notes} onSearch={t => { setSearchQuery(t); setModals(p => ({...p, search: true})); }} onView={handleSelectNote} />}
          {activeTab === 'ranking' && <RankingView users={allProfiles} tab={rankingTab} setTab={setRankingTab} />}
          {activeTab === 'profile' && (
            <ProfileView 
              userData={userData} onModal={m => setModals(prev => ({...prev, [m]: true}))} 
              onWatchAd={handleWatchAd} adTimer={adTimer} notes={notes}
              filter={contentFilter} setFilter={setContentFilter} onCopy={handleCopy}
              onSelectNote={handleSelectNote}
            />
          )}
        </main>
      </div>
      {/* MOBILE FAB */}
      <button onClick={() => setModals(m => ({...m, upload: true}))} className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl z-35 active:scale-95 transition-transform md:hidden"><Plus size={32}/></button>
      {/* MOBILE NAV BAR */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 h-20 flex items-center justify-around z-45 md:hidden">
        <NavBtn icon={Home} label="Feed" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
        <NavBtn icon={Search} label="Discover" active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
        <NavBtn icon={Trophy} label="Ranking" active={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')} />
        <NavBtn icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setContentFilter('All'); }} />
      </nav>
      {/* Full Modal Ecosystem */}
      <ModalSystem 
        modals={modals} setModals={setModals} userData={userData} notes={notes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        onCopy={handleCopy} onSpin={handleSpin} isSpinning={isSpinning} spinRotation={spinRotation} adTimer={adTimer} handleUpload={handleUpload}
        pushEnabled={pushEnabled} setPushEnabled={setPushEnabled} user={user} appId={appId} notify={notify}
        updateProfile={updateProfile} addNotification={addNotification} toggleFollowUser={toggleFollowUser} handleCopyNoteLink={handleCopyNoteLink}
        isFirebaseFallback={isFirebaseFallback} allProfiles={allProfiles} setAllProfiles={setAllProfiles}
        quizScore={quizScore} setQuizScore={setQuizScore} activeQuiz={activeQuiz} setActiveQuiz={setActiveQuiz}
        quizQuestionIndex={quizQuestionIndex} setQuizQuestionIndex={setQuizQuestionIndex}
        quizSelectedOption={quizSelectedOption} setQuizSelectedOption={setQuizSelectedOption}
        quizFinished={quizFinished} setQuizFinished={setQuizFinished}
        purchaseItem={purchaseItem} setPurchaseItem={setPurchaseItem}
        upiPaymentDetail={upiPaymentDetail} setUpiPaymentDetail={setUpiPaymentDetail}
        isVerifyingUpi={isVerifyingUpi} setIsVerifyingUpi={setIsVerifyingUpi}
      />
    </div>
  );
                                                          }
// --- SHARED NAVIGATION ELEMENTS ---
const SidebarBtn = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="uppercase tracking-wider text-xs">{label}</span>
  </button>
);
const NavBtn = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-all ${active ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
    <Icon size={22} strokeWidth={active ? 2.5 : 2} /><span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);
// --- TABS VIEWS ---
const FeedView = ({ notes, category, setCategory, onView, userData, setActiveQuiz, onSelectCourse }) => {
  const displayedNotes = useMemo(() => {
    if (category === 'Following') {
      const followingUids = userData?.followingUids || [];
      return notes.filter(n => followingUids.includes(n.authorId));
    }
    return notes;
  }, [notes, category, userData?.followingUids]);
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex space-x-3 overflow-x-auto py-2 no-scrollbar">
        {FEED_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-black text-white shadow-xl' : 'bg-gray-100 text-gray-500'}`}>{cat}</button>
        ))}
      </div>
      <div className="space-y-6">
        {category === 'Notes' && (
          displayedNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayedNotes.map(note => (
                <NoteCard key={note.id} note={note} onView={onView} userData={userData} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-gray-300 font-bold uppercase tracking-[0.2em]">No notes found.</div>
          )
        )}
        {category === 'Courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {COURSES_DATA.map(course => {
              const owned = userData?.purchasedContent?.includes(course.id);
              return (
                <div key={course.id} onClick={() => onSelectCourse(course)} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-4 group cursor-pointer active:scale-[0.98] transition-all">
                  <div className="relative rounded-[24px] overflow-hidden aspect-video bg-gray-50">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {course.isPremium && (
                      <div className={`absolute top-4 right-4 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${owned ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'}`}>
                        {owned ? 'Unlocked' : 'Premium'}
                      </div>
                    )}
                    {!course.isPremium && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{course.level}</div>
                    )}
                  </div>
                  <div className="pt-4 px-1">
                    <h3 className="font-extrabold text-md text-gray-900 leading-tight uppercase tracking-tight">{course.title}</h3>
                    <div className="flex items-center justify-between mt-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                      <span>{course.provider}</span>
                      {course.isPremium && !owned ? (
                        <span className="text-amber-500 font-black">₹{course.priceInr} / {course.priceEmd} EMD</span>
                      ) : (
                        <span>{course.lessons} Lectures</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {category === 'Playlists' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PLAYLISTS_DATA.map(pl => (
              <div key={pl.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-4 group cursor-pointer flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={pl.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-gray-900 truncate uppercase tracking-tight">{pl.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{pl.count} Videos • {pl.views} Views</p>
                </div>
                <PlayCircle className="text-blue-500" size={24} />
              </div>
            ))}
          </div>
        )}
        {category === 'Following' && (
          displayedNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayedNotes.map(note => (
                <NoteCard key={note.id} note={note} onView={onView} userData={userData} />
              ))}
            </div>
          ) : (
            <div className="py-24 px-10 text-center text-gray-300 font-black uppercase tracking-widest leading-relaxed">
              Not following anyone yet, or followed scholars haven't uploaded any content.
            </div>
          )
        )}
        {category === 'Quizzes' && (
          <div className="space-y-4">
            {QUIZZES_DATA.map(quiz => {
              const completed = userData?.completedQuizzes?.includes(quiz.id);
              return (
                <div key={quiz.id} className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="bg-orange-100 text-orange-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">{quiz.category} Target</span>
                    <h3 className="font-extrabold text-md text-gray-900 leading-tight uppercase tracking-tight">{quiz.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Reward: {quiz.reward} EMD</p>
                  </div>
                  <button 
                    onClick={() => setActiveQuiz(quiz)}
                    className={`px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center space-x-2 transition-all ${completed ? 'bg-green-50 text-green-600 cursor-default' : 'bg-blue-600 text-white shadow-md active:scale-95'}`}
                  >
                    {completed ? <CheckSquare size={12} /> : <Play size={12} />}
                    <span>{completed ? 'Passed' : 'Start'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
const NoteCard = ({ note, onView, userData }) => {
  const isOwned = userData?.uid === note.authorId || userData?.purchasedContent?.includes(note.id);
  return (
    <div onClick={() => onView(note)} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-3 group cursor-pointer active:scale-[0.98] transition-all">
      <div className="relative rounded-[24px] overflow-hidden aspect-video bg-gray-50">
        <img src={note.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        {note.isPremium ? (
          <div className={`absolute top-4 right-4 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md ${isOwned ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'}`}>
            {isOwned ? 'Unlocked' : 'Premium'}
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">NOTE</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-extrabold text-md text-gray-900 leading-tight uppercase tracking-tight line-clamp-2">{note.title}</h3>
        <div className="flex items-center justify-between mt-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest font-mono">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 overflow-hidden shadow-sm">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${note.authorName}`} />
            </div>
            <span className="text-gray-800 font-sans">{note.authorName}</span>
          </div>
          {note.isPremium && !isOwned ? (
            <span className="text-amber-500 font-black">₹{note.priceInr} / {note.priceEmd} EMD</span>
          ) : (
            <div className="flex items-center space-x-3 font-sans">
              <span className="flex items-center"><Eye size={12} className="mr-1" /> {note.views}</span>
              <span className="flex items-center"><Heart size={12} className="mr-1" /> {note.likes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const DiscoverView = ({ notes, onSearch, onView }) => (
  <div className="space-y-8 animate-in fade-in">
    <div onClick={() => onSearch("")} className="bg-gray-100 p-4 rounded-3xl flex items-center space-x-3 cursor-pointer"><Search className="text-gray-400" size={20} /><span className="text-gray-400 font-bold text-sm uppercase tracking-tight">Search material...</span></div>
    <div><h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Trending Targets</h3><div className="flex flex-wrap gap-2">{EXAMS_LIST.map(tag => (<span key={tag} onClick={() => onSearch(tag)} className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-[9px] font-black text-gray-700 shadow-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-colors uppercase tracking-widest">#{tag}</span>))}</div></div>
    <div>
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">New Contributions</h3>
      <div className="grid grid-cols-2 gap-4">
        {notes.slice(0, 4).map(note => (
          <div key={note.id} onClick={() => onView(note)} className="bg-white border border-gray-100 p-3 rounded-[24px] shadow-sm cursor-pointer group">
            <div className="aspect-square bg-gray-50 rounded-2xl mb-3 overflow-hidden shadow-inner">
              <img src={note.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-[10px] font-black line-clamp-1 group-hover:text-blue-600 uppercase tracking-tighter">{note.title}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
const RankingView = ({ users, tab, setTab }) => {
  const sorted = [...users].sort((a,b) => tab === 'emeralds' ? b.balance - a.balance : b.referrals - a.referrals);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-gray-100 p-1.5 rounded-2xl flex shadow-inner"><button onClick={() => setTab('emeralds')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'emeralds' ? 'bg-white shadow-lg text-blue-600' : 'text-gray-400'}`}>Emeralds</button><button onClick={() => setTab('referrals')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${tab === 'referrals' ? 'bg-white shadow-lg text-blue-600' : 'text-gray-400'}`}>Referrals</button></div>
      <div className="flex items-end justify-center pt-10 pb-4 space-x-3">{podium.map((p, i) => (<div key={p.uid} className={`flex flex-col items-center ${i === 0 ? '-mt-10 order-2' : i === 1 ? 'order-1' : 'order-3'}`}><div className={`rounded-full border-4 overflow-hidden mb-3 shadow-xl ${i === 0 ? 'w-24 h-24 border-yellow-400' : 'w-16 h-16 border-white'}`}><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.avatarSeed || p.username}`} className="bg-white" /></div><div className={`bg-white rounded-t-3xl flex flex-col items-center justify-center shadow-sm border-t border-x px-4 py-6 ${i === 0 ? 'w-32 h-36 border-yellow-100' : 'w-24 h-28'}`}><span className={`font-black ${i === 0 ? 'text-4xl text-yellow-500' : 'text-2xl text-gray-300'}`}>#{i + 1}</span><span className="text-[9px] font-black truncate w-16 text-center uppercase tracking-tighter mt-1">{p.username}</span><span className="text-xs font-bold text-green-500 uppercase tracking-tighter">{tab === 'emeralds' ? `${Math.floor(p.balance)} EMD` : `${p.referrals} Refs`}</span></div></div>))}</div>
      <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm space-y-4">{rest.map((p, i) => (<div key={p.uid} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"><div className="flex items-center space-x-4"><span className="text-gray-300 font-black w-6">{i + 4}</span><div className="w-10 h-10 rounded-full bg-blue-50 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.avatarSeed || p.username}`} /></div><span className="text-sm font-black uppercase tracking-tighter">{p.username}</span></div><span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">{tab === 'emeralds' ? `${Math.floor(p.balance)} EMD` : `${p.referrals} Refs`}</span></div>))}</div>
    </div>
  );
};
const ProfileView = ({ userData, onModal, onWatchAd, adTimer, notes, filter, setFilter, onCopy, onSelectNote }) => {
  const myNotes = notes.filter(n => n.authorId === userData.uid);
  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      <div className="space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase px-1">@{userData.username}</h2>
        <div className={`relative rounded-[40px] h-48 bg-gradient-to-br ${userData.profileColor} shadow-xl overflow-hidden group`}>
          <div className="absolute -bottom-10 left-8 w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white z-10">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.avatarSeed}`} alt="profile" />
          </div>
          <button onClick={() => onModal('editProfile')} className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-xl text-white text-[10px] font-black px-6 py-2.5 rounded-full border border-white/20 uppercase tracking-tighter shadow-xl">
            <Sparkles size={12} className="inline mr-2" /> Edit Design
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mt-12 px-1">
        <div>
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{userData.displayName}</h3>
          <div className="flex space-x-6 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span><b className="text-gray-900">{userData.followers}</b> followers</span>
            <span><b className="text-gray-900">{userData.following}</b> following</span>
            <span><b className="text-orange-500">{userData.streak}</b> streak 🔥</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onModal('editProfile')} className="p-3 bg-white border border-gray-100 rounded-full shadow-sm shadow-black/5 active:bg-blue-50"><Edit3 size={20}/></button>
          <button onClick={() => onCopy(userData.username)} className="p-3 bg-white border border-gray-100 rounded-full shadow-sm shadow-black/5 active:bg-blue-50"><Share2 size={20} /></button>
        </div>
      </div>
      <div className="space-y-4"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Academy Hub</h4><div className="flex flex-wrap gap-2">{userData.colleges.map(c => (<div key={c} className="bg-white border px-5 py-2.5 rounded-2xl flex items-center space-x-2 text-[10px] font-black shadow-sm text-gray-800 uppercase tracking-widest"><Landmark size={14} className="text-blue-500" /> <span>{c}</span></div>))}<button onClick={() => onModal('manageColleges')} className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm"><Plus size={18}/></button></div></div>
      <div className="space-y-4"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Engagement</h4><ActivityItem icon={BookOpen} label="My Notebook" sub="Store private formulas" color="from-[#00CCAB] to-[#00BFA5]" onClick={() => onModal('notebook')} /><ActivityItem icon={RotateCw} label="Study Planner" sub="Daily syllabus tracker" color="from-[#7E57C2] to-[#673AB7]" onClick={() => onModal('planner')} /><ActivityItem icon={DownloadCloud} label="Offline Library" sub="Cache saved material" color="from-[#2196F3] to-[#1976D2]" onClick={() => onModal('library')} /></div>
      <div className="space-y-4"><MenuItem icon={Wallet} label="My Wallet" sub="Withdraw EMD via UPI" val={`${Math.floor(userData.balance)} EMD`} onClick={() => onModal('wallet')} /><MenuItem icon={Users} label="Refer & Earn" sub="Invite for Emeralds" onClick={() => onModal('referral')} /><MenuItem icon={RotateCw} label="Spin the Wheel" sub="Daily lucky rewards" onClick={() => onModal('spin')} /><MenuItem icon={MessageCircle} label="Support Group" sub="WhatsApp Hub" onClick={() => onModal('supportGroup')} /></div>
      <div className="pt-6 space-y-6"><div className="flex items-center justify-between px-1"><h4 className="text-2xl font-black italic uppercase tracking-tighter">Content</h4><span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{myNotes.length} items</span></div><div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">{['All', 'Notes', 'Playlists', 'Courses'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${filter === f ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white border border-gray-100 text-gray-500'}`}>{f === 'All' && <LayoutGrid size={12}/>}{f === 'Notes' && <FileText size={12}/>}{f === 'Playlists' && <PlayCircle size={12}/>}{f === 'Courses' && <GraduationCap size={12}/>}<span>{f}</span></button>))}</div><div className="space-y-4">{myNotes.length > 0 ? myNotes.map(n => (<div key={n.id} onClick={() => onSelectNote(n)} className="bg-white border border-gray-100 p-4 rounded-[32px] flex items-center justify-between shadow-sm active:scale-95 transition-transform group cursor-pointer"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner"><FileText size={24}/></div><div className="max-w-[180px]"><p className="text-sm font-black truncate uppercase tracking-tighter">{n.title}</p><div className="flex items-center space-x-3 mt-1"><span className="bg-orange-100 text-orange-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">medium</span><span className="text-gray-300 text-[10px] font-bold flex items-center uppercase"><Eye size={10} className="mr-1"/> {n.views}</span></div></div></div><div className="flex space-x-2"><button onClick={(e) => { e.stopPropagation(); onCopy(n.title); }} className="p-2 text-gray-300 hover:text-blue-500"><Share2 size={18}/></button><ChevronRight className="text-gray-200" size={20}/></div></div>)) : <div className="p-16 border-4 border-dashed border-gray-100 rounded-[40px] text-center opacity-40 grayscale"><FileText className="mx-auto mb-2 text-gray-300" size={40}/><p className="font-black text-[10px] uppercase tracking-widest">Workspace Empty</p></div>}</div></div>
  );
};
const ActivityItem = ({ icon: Icon, label, sub, color, onClick }) => (
  <div onClick={onClick} className={`p-5 rounded-[28px] bg-gradient-to-br ${color} text-white flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-black/5`}><div className="flex items-center space-x-4"><div className="bg-white/20 p-3 rounded-2xl shadow-inner border border-white/10"><Icon size={24} /></div><div className="text-left"><p className="font-black text-sm uppercase tracking-tight">{label}</p><p className="text-[9px] opacity-70 font-black uppercase leading-tight tracking-tighter mt-0.5">{sub}</p></div></div><ChevronRight size={20} className="opacity-50" /></div>
);
const MenuItem = ({ icon: Icon, label, sub, val, onClick, highlight }) => (
  <div onClick={onClick} className="p-4 bg-white border border-gray-100 rounded-[28px] flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors shadow-sm"><div className="flex items-center space-x-4"><div className={`p-3 rounded-2xl ${highlight ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400'}`}><Icon size={22} /></div><div className="text-left"><p className="text-sm font-black uppercase tracking-tight">{label}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{sub}</p></div></div><div className="flex items-center space-x-2">{val && <span className="font-black text-blue-600 text-sm uppercase tracking-tight">{val}</span>}<ChevronRight size={18} className="text-gray-200" /></div></div>
);
// --- MODAL SYSTEMS ---
const ModalSystem = ({ 
  modals, setModals, userData, notes, searchQuery, setSearchQuery, 
  onCopy, onSpin, isSpinning, spinRotation, adTimer, handleUpload, 
  pushEnabled, setPushEnabled, user, appId, notify,
  updateProfile, addNotification, toggleFollowUser, handleCopyNoteLink,
  isFirebaseFallback, allProfiles, setAllProfiles,
  quizScore, setQuizScore, activeQuiz, setActiveQuiz,
  quizQuestionIndex, setQuizQuestionIndex,
  quizSelectedOption, setQuizSelectedOption,
  quizFinished, setQuizFinished,
  purchaseItem, setPurchaseItem,
  upiPaymentDetail, setUpiPaymentDetail,
  isVerifyingUpi, setIsVerifyingUpi
}) => {
  const close = () => { 
    const newState = {}; 
    Object.keys(modals).forEach(k => newState[k] = false); 
    setModals(newState); 
    setActiveQuiz(null);
  };
  const ModalWrapper = ({ title, children, dark = false }) => (
    <div className={`fixed inset-0 z-[1000] flex flex-col animate-in slide-in-from-right duration-300 ${dark ? 'bg-black text-white' : 'bg-[#F9FBFF] text-gray-900'}`}>
       <header className={`p-6 flex items-center justify-between border-b ${dark ? 'border-white/10' : 'border-gray-50 bg-white'}`}><button onClick={close} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={20} /> <span>BACK</span></button><h3 className="font-black text-[10px] uppercase tracking-widest">{title}</h3><div className="w-10"></div></header>
       <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
    </div>
  );
 // --- SUB-MODAL ACTION HANDLERS ---
  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const upi = formData.get('upi');
    const amount = parseInt(formData.get('amount'), 10);
    if (!amount || amount < 500) {
      notify("Minimum 500 EMD Required");
      return;
    }
    if (userData.balance < amount) {
      notify("Insufficient EMD balance!");
      return;
    }
    // Deduct EMD immediately and log transaction
    const newTxId = `tx_${Date.now()}`;
    const newTx = {
      id: newTxId,
      amount,
      upi,
      timestamp: Date.now(),
      status: 'Pending'
    };
    updateProfile({
      balance: increment(-amount),
      transactions: [newTx, ...(userData.transactions || [])]
    });
    notify(`Withdrawal request of ${amount} EMD submitted!`);
    addNotification("Withdrawal Initiated 💸", `Redemption of ${amount} EMD (₹${(amount * 0.02).toFixed(2)}) is pending.`);
    setModals(p => ({ ...p, withdraw: false, wallet: true }));
    // Simulate complete transaction payout after 15 seconds
    setTimeout(() => {
      // In LocalStorage fallback, mock completion. In Firebase live, update the document transaction field.
      if (isFirebaseFallback) {
        const localKey = `studcrack_user_${user.uid}`;
        const localUser = JSON.parse(localStorage.getItem(localKey));
        if (localUser && localUser.transactions) {
          localUser.transactions = localUser.transactions.map(t => 
            t.id === newTxId ? { ...t, status: 'Completed' } : t
          );
          localStorage.setItem(localKey, JSON.stringify(localUser));
          // Trigger local update
          updateProfile({ transactions: localUser.transactions });
        }
      } else {
        // Firebase live update - fetch current transactions list, update target tx to completed
        const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
        onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const txs = data.transactions || [];
            const updatedTxs = txs.map(t => t.id === newTxId ? { ...t, status: 'Completed' } : t);
            updateDoc(userRef, { transactions: updatedTxs });
          }
        }, { once: true });
      }
      addNotification("Withdrawal Successful 💰", `Redemption of ${amount} EMD has been successfully disbursed to UPI ${upi}.`);
    }, 15000);
  };
  const handleRedeemReferral = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get('refCode').trim().toLowerCase();
    if (!code) return;
    if (userData.redeemedReferralCode) {
      notify("You already claimed referral credit!");
      return;
    }
    if (code === userData.username.toLowerCase()) {
      notify("Cannot redeem your own code!");
      return;
    }
    const targetUser = allProfiles.find(p => p.username.toLowerCase() === code);
    if (!targetUser) {
      notify("Invalid Referral Code");
      return;
    }
    updateProfile({
      balance: increment(25),
      redeemedReferralCode: code
    });
    notify("Claimed 25 EMD Referral Credit!");
    addNotification("Referral Code Redeemed 🎉", `You claimed 25 EMD using code from @${targetUser.username}.`);
    // Credit reward to referrer
    if (isFirebaseFallback) {
      const publicProfiles = JSON.parse(localStorage.getItem('studcrack_public_profiles') || '[]');
      const refIdx = publicProfiles.findIndex(p => p.uid === targetUser.uid);
      if (refIdx > -1) {
        publicProfiles[refIdx].balance += 25;
        publicProfiles[refIdx].referrals += 1;
        localStorage.setItem('studcrack_public_profiles', JSON.stringify(publicProfiles));
        setAllProfiles(publicProfiles);
        const refKey = `studcrack_user_${targetUser.uid}`;
        const refUserData = JSON.parse(localStorage.getItem(refKey));
        if (refUserData) {
          refUserData.balance += 25;
          refUserData.referrals += 1;
          refUserData.notifications = [
            { id: `ref_${Date.now()}`, title: "Referral Reward Claimed! 👑", content: `Your friend @${userData.username} redeemed your code. +25 EMD credited.`, read: false, timestamp: Date.now() },
            ...(refUserData.notifications || [])
          ];
          localStorage.setItem(refKey, JSON.stringify(refUserData));
        }
      }
    } else {
      try {
        updateDoc(doc(db, 'artifacts', appId, 'users', targetUser.uid), {
          balance: increment(25),
          referrals: increment(1)
        });
      } catch (err) { console.error("Referrer update failed", err); }
    }
    e.target.reset();
  };
  const handleAddFormula = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    const category = formData.get('category');
    const content = formData.get('content');
    const newFormula = {
      id: `formula_${Date.now()}`,
      title,
      category,
      content,
      timestamp: Date.now()
    };
    updateProfile({
      notebook: [newFormula, ...(userData.notebook || [])]
    });
    e.target.reset();
    notify("Formula saved to Notebook!");
  };
  const handleDeleteFormula = (id) => {
    const updated = (userData.notebook || []).filter(f => f.id !== id);
    updateProfile({ notebook: updated });
    notify("Formula deleted.");
  };
  const handleAddTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    const category = formData.get('category');
    const targetDate = formData.get('targetDate');
    const newTask = {
      id: `task_${Date.now()}`,
      title,
      category,
      targetDate,
      status: 'Todo',
      timestamp: Date.now()
    };
    updateProfile({
      planner: [newTask, ...(userData.planner || [])]
    });
    e.target.reset();
    notify("Target added to Study Planner!");
  };
  const toggleTaskStatus = (id) => {
    const updated = (userData.planner || []).map(t => {
      if (t.id === id) {
        let nextStatus = 'Todo';
        if (t.status === 'Todo') nextStatus = 'In Progress';
        else if (t.status === 'In Progress') nextStatus = 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    updateProfile({ planner: updated });
  };
  const handleDeleteTask = (id) => {
    const updated = (userData.planner || []).filter(t => t.id !== id);
    updateProfile({ planner: updated });
    notify("Target deleted.");
  };
  const handleQuizComplete = (quizId, score, total) => {
    const isPerfect = score === total;
    const quiz = QUIZZES_DATA.find(q => q.id === quizId);
    if (!quiz) return;
    const completed = userData.completedQuizzes || [];
    if (completed.includes(quizId)) {
      notify(`Quiz completed! Score: ${score}/${total}`);
      return;
    }
    if (isPerfect) {
      updateProfile({
        balance: increment(quiz.reward),
        completedQuizzes: [...completed, quizId]
      });
      notify(`Perfect Score! Claimed ${quiz.reward} EMD.`);
      addNotification("Quiz Mastery 🏆", `You scored perfect on "${quiz.title}" and earned ${quiz.reward} EMD!`);
    } else {
      notify(`Quiz complete! Score: ${score}/${total}. Retake to score 100% and earn EMD.`);
    }
  };
  const handleQuizAnswerSubmit = () => {
    if (quizSelectedOption === null || !activeQuiz) return;
    
    const currentQuestion = activeQuiz.questions[quizQuestionIndex];
    let nextScore = quizScore;
    if (quizSelectedOption === currentQuestion.answer) {
      nextScore += 1;
      setQuizScore(nextScore);
    }
    if (quizQuestionIndex + 1 < activeQuiz.questions.length) {
      setQuizQuestionIndex(prev => prev + 1);
      setQuizSelectedOption(null);
    } else {
      setQuizFinished(true);
      handleQuizComplete(activeQuiz.id, nextScore, activeQuiz.questions.length);
    }
  };
  const resetQuizState = () => {
    setQuizScore(0);
    setQuizQuestionIndex(0);
    setQuizSelectedOption(null);
    setQuizFinished(false);
    setActiveQuiz(null);
  };
  const savedNotes = useMemo(() => {
    return notes.filter(n => userData?.library?.includes(n.id));
  }, [notes, userData?.library]);
  const toggleSaveOffline = (noteId) => {
    const currentLib = userData.library || [];
    let updated;
    if (currentLib.includes(noteId)) {
      updated = currentLib.filter(id => id !== noteId);
      notify("Removed from offline cache");
    } else {
      updated = [...currentLib, noteId];
      notify("Saved to Offline Library!");
    }
    updateProfile({ library: updated });
  };
  // --- EMD CREDIT CONVERSION & UPI TOP-UPS ---
  const triggerTopupPayment = (pack) => {
    setUpiPaymentDetail({
      type: 'topup',
      item: pack,
      amount: pack.inr,
      emdReward: pack.emd
    });
    setModals(p => ({ ...p, wallet: false, upiPayment: true }));
  };
  const triggerContentPayment = (item) => {
    setUpiPaymentDetail({
      type: 'content',
      item: item,
      amount: item.priceInr,
      emdReward: 0
    });
    setModals(p => ({ ...p, purchaseContent: false, upiPayment: true }));
  };
  const handlePurchaseWithEmd = (item) => {
    if (userData.balance < item.priceEmd) {
      notify("Insufficient EMD balance! Choose UPI or top up.");
      return;
    }
    const purchased = userData.purchasedContent || [];
    updateProfile({
      balance: increment(-item.priceEmd),
      purchasedContent: [...purchased, item.id]
    });
    notify("Unlocked with EMD successfully!");
    addNotification("Content Unlocked 🎓", `You purchased and unlocked "${item.title}" using ${item.priceEmd} EMD.`);
    setModals(p => ({ ...p, purchaseContent: false }));
    
    if (item.type === 'NOTE') {
      setModals(p => ({ ...p, viewNote: item }));
    } else {
      notify("Course lectures unlocked! Access directly in Courses tab.");
    }
  };
  const handleUpiVerificationSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const utr = formData.get('utr').trim();
    if (!/^\d{12}$/.test(utr)) {
      notify("Invalid UTR. Enter 12-digit transaction number.");
      return;
    }
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      if (upiPaymentDetail.type === 'content') {
        const purchased = userData.purchasedContent || [];
        updateProfile({
          purchasedContent: [...purchased, upiPaymentDetail.item.id]
        });
        notify("Payment Verified! Content Unlocked.");
        addNotification("Payment Verified ✅", `Your payment of ₹${upiPaymentDetail.amount} for "${upiPaymentDetail.item.title}" has been credited.`);
        setModals(p => ({ ...p, upiPayment: false }));
        
        if (upiPaymentDetail.item.type === 'NOTE') {
          setModals(p => ({ ...p, viewNote: upiPaymentDetail.item }));
        } else {
          notify("Course unlocked! Accessible in Courses tab.");
        }
      } else if (upiPaymentDetail.type === 'topup') {
        const currentTx = userData.transactions || [];
        const newTx = {
          id: `tx_topup_${Date.now()}`,
          amount: upiPaymentDetail.emdReward,
          type: 'Top-up Credit',
          timestamp: Date.now(),
          status: 'Completed',
          upi: 'UPI Deposit Gateway'
        };
        updateProfile({
          balance: increment(upiPaymentDetail.emdReward),
          transactions: [newTx, ...currentTx]
        });
        notify(`Top-up complete! +${upiPaymentDetail.emdReward} EMD.`);
        addNotification("Deposit Successful 💎", `Your account was credited with ${upiPaymentDetail.emdReward} EMD via UPI.`);
        setModals(p => ({ ...p, upiPayment: false, wallet: true }));
      }
    }, 2000);
  };







