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







