/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, BookOpen, ShieldAlert, Check, CheckCircle2, 
  AlertTriangle, TrendingUp, Plus, Search, Compass, Layers, 
  Settings, Calendar, Users, Phone, MapPin, Image, Mic, 
  FileText, CheckCircle, MessageSquare, Clock, ArrowRight, 
  Lock, Unlock, Send, ThumbsUp, ThumbsDown, Sparkles, 
  RefreshCw, Sliders, Eye, Database, Cpu, Play, HelpCircle
} from 'lucide-react';

interface RedesignPortalProps {
  lang: 'EN' | 'HI';
  userRole: string;
}

export default function UXRedesignPortal({ lang, userRole }: RedesignPortalProps) {
  const [activeSection, setActiveSection] = useState<
    'audit' | 'pain_points' | 'ia' | 'personas' | 'flows' | 'wireframes' | 'design_system' | 'high_fidelity' | 'approval'
  >('audit');

  // Simulated state for mobile wireframe previewer
  const [wireframeMobileScreen, setWireframeMobileScreen] = useState<'home' | 'calc' | 'survey' | 'job'>('home');
  // Guided Calculator Wizard States in Wireframe
  const [calcStep, setCalcStep] = useState<number>(1);
  const [calcProduct, setCalcProduct] = useState<string>('Flex Banner');
  const [calcWidth, setCalcWidth] = useState<number>(10);
  const [calcHeight, setCalcHeight] = useState<number>(4);
  const [calcQty, setCalcQty] = useState<number>(1);
  const [calcFrame, setCalcFrame] = useState<boolean>(true);
  const [calcInstallation, setCalcInstallation] = useState<boolean>(false);
  const [calcTransport, setCalcTransport] = useState<boolean>(false);

  // Site Survey Wizard States in Wireframe
  const [surveyStep, setSurveyStep] = useState<number>(1);
  const [surveyPhotos, setSurveyPhotos] = useState<string[]>([]);
  const [surveyWidth, setSurveyWidth] = useState<string>('');
  const [surveyHeight, setSurveyHeight] = useState<string>('');
  const [surveyVoiceMemo, setSurveyVoiceMemo] = useState<boolean>(false);
  const [surveyNotes, setSurveyNotes] = useState<string>('');

  // Job Execution States in Wireframe
  const [jobStep, setJobStep] = useState<number>(1);
  const [jobBeforePhoto, setJobBeforePhoto] = useState<boolean>(false);
  const [jobAfterPhoto, setJobAfterPhoto] = useState<boolean>(false);

  // Global Spotlight Search simulation
  const [showSpotlight, setShowSpotlight] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Approval Form Persistence
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'revisions'>('pending');
  const [approvalComments, setApprovalComments] = useState<string>('');
  const [approvalName, setApprovalName] = useState<string>('');
  const [approvalRole, setApprovalRole] = useState<string>('Owner');
  const [savedLogs, setSavedLogs] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('abms_ux_approval_logs');
    if (saved) {
      setSavedLogs(JSON.parse(saved));
    }
  }, []);

  const handleSaveApproval = (status: 'approved' | 'revisions') => {
    if (!approvalName.trim()) {
      alert(lang === 'EN' ? 'Please enter your name to sign the proposal' : 'प्रस्ताव पर हस्ताक्षर करने के लिए कृपया अपना नाम दर्ज करें');
      return;
    }

    const newLog = {
      id: `APP-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      name: approvalName,
      role: approvalRole,
      status: status === 'approved' ? 'APPROVED' : 'REVISIONS_REQUESTED',
      comments: approvalComments || 'No comments provided.'
    };

    const updated = [newLog, ...savedLogs];
    setSavedLogs(updated);
    localStorage.setItem('abms_ux_approval_logs', JSON.stringify(updated));
    setApprovalStatus(status);
    
    if (status === 'approved') {
      alert(lang === 'EN' 
        ? '🎉 Fantastic! The Redesign Proposal has been APPROVED. The development team is authorized to implement the high-fidelity UI design.' 
        : '🎉 शानदार! रीडिजाइन प्रस्ताव को मंजूरी दे दी गई है।'
      );
    } else {
      alert(lang === 'EN'
        ? 'Feedback saved! The design team has been notified to adjust wireframes according to your recommendations.'
        : 'प्रतिक्रिया सुरक्षित की गई! आपके सुझावों के अनुसार संशोधन किया जाएगा।'
      );
    }
  };

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSpotlight(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn" id="ux-proposal-portal">
      {/* Banner and Interactive Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-slate-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white font-mono shadow-xs">
              <Sparkles className="w-3 h-3" />
              Strategic UX/UI Redesign Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              Agrasen Business OS: Next-Gen Mobile-First Redesign
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
              Rethinking our production, installation, and sales management from the ground up. 
              Built with high-contrast tactical readability, responsive bottom sheets, and single-hand operability for field staff on Android.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowSpotlight(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-xl text-xs font-mono font-bold flex items-center justify-between gap-6 cursor-pointer transition-all"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Quick Search Redesign...</span>
              </span>
              <kbd className="bg-slate-950 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-850">Ctrl K</kbd>
            </button>
          </div>
        </div>

        {/* Global Nav for specifications */}
        <div className="flex flex-wrap gap-1.5 mt-8 pt-6 border-t border-slate-800/80">
          {[
            { id: 'audit', label: '1. UX Audit', icon: AlertTriangle },
            { id: 'pain_points', label: '2. Pain Points', icon: Sliders },
            { id: 'ia', label: '3. Info Architecture', icon: Compass },
            { id: 'personas', label: '4. User Personas', icon: Users },
            { id: 'flows', label: '5. Role Flows', icon: Layers },
            { id: 'wireframes', label: '6 & 7. Wireframes', icon: Smartphone },
            { id: 'design_system', label: '8. Design System', icon: Settings },
            { id: 'high_fidelity', label: '9. High-Fi Mockups', icon: Monitor },
            { id: 'approval', label: '10. Interactive Feedback', icon: CheckCircle2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSection === item.id
                    ? 'bg-red-650 text-white shadow-xs font-black'
                    : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SPOTLIGHT SEARCH SIMULATION MODAL --- */}
      {showSpotlight && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-[10vh] p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-scaleUp">
            <div className="flex items-center gap-3 px-4.5 py-3 border-b border-slate-100">
              <Search className="w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search across customers, estimates, jobs, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-hidden font-sans font-medium text-slate-800"
                autoFocus
              />
              <button 
                onClick={() => { setShowSpotlight(false); setSearchQuery(''); }}
                className="text-xs font-mono font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>

            <div className="p-2.5 max-h-80 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="space-y-1">
                  <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono p-2">Recent Searches / Shortcuts</span>
                  {[
                    { title: 'New Customer Order', desc: 'Jump to dynamic quotation wizard', tag: 'Shortcut' },
                    { title: 'Active Print Queue', desc: 'View high-visibility shop floor printing schedule', tag: 'Printing' },
                    { title: 'Flex Roll 10x100 Star', desc: 'Material Card & current yardage audit', tag: 'Inventory' },
                    { title: 'Vijay Nagar ACP Site Survey', desc: 'Task check-in & before/after uploads', tag: 'Survey' },
                  ].map((res, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        alert(`Spotlight shortcut selected: "${res.title}"`);
                        setShowSpotlight(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div>
                        <span className="block text-xs font-extrabold text-slate-800">{res.title}</span>
                        <span className="block text-[10px] text-slate-500">{res.desc}</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{res.tag}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="block text-[10px] font-black uppercase text-slate-450 tracking-wider font-mono p-2">Filtered Results for "{searchQuery}"</span>
                  {[
                    { title: `"${searchQuery}" Customer Card`, desc: 'Instant WhatsApp call & outstanding ledger', category: 'CRM' },
                    { title: `"${searchQuery}" Estimate Line Item`, desc: 'Step-by-step cost analysis & configuration', category: 'Calculator' },
                    { title: `"${searchQuery}" Site Survey Entry`, desc: 'Measurement sheets & voice logs', category: 'Installation' },
                    { title: `"${searchQuery}" Supplier Invoice`, desc: 'Draft invoice verification', category: 'Business' },
                  ].map((res, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        alert(`Spotlight match selected: ${res.title}`);
                        setShowSpotlight(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer transition-all animate-fadeIn"
                    >
                      <div>
                        <span className="block text-xs font-black text-slate-800">{res.title}</span>
                        <span className="block text-[10px] text-slate-500">{res.desc}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-red-50 text-red-750 px-2 py-0.5 rounded border border-red-100">{res.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-slate-50 p-2.5 border-t border-slate-100 text-[9px] text-slate-400 font-mono text-center flex justify-center gap-4">
              <span>↑↓ Navigation</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}

      {/* 1. UX AUDIT */}
      {activeSection === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <AlertTriangle className="w-5.5 h-5.5 text-red-650" />
              1. UX Audit of Current Design
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Identifying critical interface constraints, cognitive overhead, and ergonomic barriers in the legacy layout.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 font-mono">
                CRITICAL COGNITIVE LOAD ISSUES
              </span>
              <ul className="space-y-3.5 text-xs text-slate-700 font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-650 font-black mt-0.5">✕</span>
                  <div>
                    <strong>Desktop-Heavy Layout Paralyzes Field Staff:</strong> Large multi-column database tables, sliders, and fine inputs assume high precision mouse clicks. Site survey personnel on ladders cannot operate these.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-650 font-black mt-0.5">✕</span>
                  <div>
                    <strong>Excel-Style "Everything Everywhere" Presentation:</strong> All fields are presented simultaneously. A single banner calculation requires selecting from 12+ dropdowns/inputs, introducing immediate decision fatigue.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-650 font-black mt-0.5">✕</span>
                  <div>
                    <strong>Lack of Context-Specific Role Isolation:</strong> A delivery staff member or printing operator sees revenue trackers and complex blueprints. This adds visual noise and security liabilities.
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-emerald-50/50 border border-emerald-200/85 rounded-2xl space-y-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 font-mono">
                TACTICAL MOBILE-FIRST RECONSTRUCTS
              </span>
              <ul className="space-y-3.5 text-xs text-slate-700 font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-650 font-black mt-0.5">✓</span>
                  <div>
                    <strong>Progressive Disclosure Wizards:</strong> Replacing complex forms with a sequential single-question questionnaire (e.g. "What are you making?" → "Enter Dimensions" → "Add-ons" → "Review").
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-650 font-black mt-0.5">✓</span>
                  <div>
                    <strong>Touch-Target Ergo-Optimization:</strong> Converting all text fields and small options into massive, easily tappable visual blocks (minimum height 48px, target 54px for field staff).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-650 font-black mt-0.5">✓</span>
                  <div>
                    <strong>Role-Driven Dashboard Isolation:</strong> Automatically serving customized dashboard widgets containing only essential daily workflows depending on who logs in.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-xs font-black uppercase text-slate-800 mb-3 tracking-wide">Ergonomic Analysis Chart (One-Hand Android Mobile Comfort Range)</h4>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-3xs">
                <span className="block text-lg font-black text-slate-900">72%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">A Thumb-Comfort Zone</span>
                <p className="text-[9px] text-slate-400 mt-1">Actions must lie in the lower 40% of the screen. No stretch required.</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-3xs">
                <span className="block text-lg font-black text-amber-600">18%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">B Stretch Area</span>
                <p className="text-[9px] text-slate-400 mt-1">Needs hand repositioning. Reserved for passive stats and non-destructive reads.</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-3xs">
                <span className="block text-lg font-black text-red-650">10%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">C Dead/High Zone</span>
                <p className="text-[9px] text-slate-400 mt-1">Reachable only with two hands. Ideal for high-risk deletions or settings.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAIN POINT ANALYSIS */}
      {activeSection === 'pain_points' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Sliders className="w-5.5 h-5.5 text-red-650" />
              2. Pain Point & Friction Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Deep dive into operational friction on the shop floor and in the field.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Site Survey Staff',
                pain: 'Unstable ladder operations make mobile typing impossible. Stains and glare prevent screen visibility.',
                impact: 'Inaccurate tape measurements, lost scribbles, wrong paper grade selections, delayed orders.',
                redesign: 'Giant measurement selectors, quick mic/voice note records, and instant camera attachment.'
              },
              {
                title: 'Printing Operators',
                pain: 'Hands dirty with solvent ink and frame grease. Cannot navigate nested menus or filters.',
                impact: 'Machine queue mistakes, delayed prints, printing wrong files or quantities.',
                redesign: 'Immutable high-contrast print cards, massive "Check-In" & "Done" buttons, low stock flash.'
              },
              {
                title: 'Delivery & Installation',
                pain: 'Operating delivery vans in heavy Indian traffic. Hard to copy addresses to external maps.',
                impact: 'Delivery delay, calling customer repeatedly for route, unresolved payment collection disputes.',
                redesign: 'Single-tap Google Maps Navigation launch, quick dial phone actions, mandatory delivery photo check-in.'
              }
            ].map((pt, i) => (
              <div key={i} className="border border-slate-150 p-5 rounded-2xl bg-slate-50/50 space-y-3">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-1.5">{pt.title}</h3>
                <div className="space-y-2">
                  <p className="text-xs text-slate-600"><strong className="text-red-650 uppercase font-mono text-[9px] block">FRUSTRATION:</strong> {pt.pain}</p>
                  <p className="text-xs text-slate-600"><strong className="text-amber-700 uppercase font-mono text-[9px] block">BUSINESS IMPACT:</strong> {pt.impact}</p>
                  <p className="text-xs text-slate-750 font-bold bg-white p-2.5 rounded-xl border border-slate-150"><strong className="text-emerald-700 uppercase font-mono text-[9px] block">MOBILE REDESIGN FIX:</strong> {pt.redesign}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INFORMATION ARCHITECTURE */}
      {activeSection === 'ia' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Compass className="w-5.5 h-5.5 text-red-650" />
              3. Information Architecture (Mobile-First Paradigm)
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Reorganizing features from wide tables into compact, role-specific hubs.</p>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-850 space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">Structured Navigation Hierarchy</h3>

            <div className="grid md:grid-cols-2 gap-6 font-mono text-[11px]">
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-emerald-500 font-bold">1. Bottom Navigation Bar (Mobile Primary)</span>
                  <p className="text-slate-400 text-[10px]">A persistent tactile grid on Android, fully reachable with a single hand:</p>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                    <li><strong className="text-white">Home Tab:</strong> Smart widgets based on authorized staff role.</li>
                    <li><strong className="text-white">Jobs Tab:</strong> Active production & installation checklists.</li>
                    <li><strong className="text-white">Quick FAB (+):</strong> Global quick action trigger (Instant menu).</li>
                    <li><strong className="text-white">Inventory Tab:</strong> Low stock alert trackers & stock checkouts.</li>
                    <li><strong className="text-white">Profile Tab:</strong> Role swapper, localized language selector (EN/HI).</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-red-500 font-bold">2. Sidebar Groups (Desktop Expanded Hub)</span>
                  <p className="text-slate-400 text-[10px]">Visible only on wide desktop monitors, divided by operation zones:</p>
                  <ul className="space-y-1 pl-4 list-disc text-slate-300">
                    <li><strong>OPERATIONS:</strong> Job cards, Site surveys, Calendar scheduler.</li>
                    <li><strong>CRM & BUSINESS:</strong> Customer lists, Invoices, Outstandings, Profit analyses.</li>
                    <li><strong>MANUFACTURING:</strong> Raw materials inventory, Machine statuses, Supplier lists.</li>
                    <li><strong>SYSTEM OS:</strong> User management, Settings, Blueprints.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Visual IA Graph */}
            <div className="bg-slate-950 rounded-xl p-4.5 border border-slate-800 font-mono text-[10px]">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-4">Tactical Data flow schematic</span>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg w-full sm:w-1/4">
                  <span className="block font-black text-red-500">Estimator Quiz</span>
                  <span className="text-slate-400">Step-by-step sizing</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 rotate-90 sm:rotate-0" />
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg w-full sm:w-1/4">
                  <span className="block font-black text-emerald-500">Quotation Ledger</span>
                  <span className="text-slate-400">Locked margins with GST</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 rotate-90 sm:rotate-0" />
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg w-full sm:w-1/4">
                  <span className="block font-black text-amber-500">Site Survey Flow</span>
                  <span className="text-slate-400">Task check-in</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 rotate-90 sm:rotate-0" />
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg w-full sm:w-1/4">
                  <span className="block font-black text-blue-500">Job Delivery & POD</span>
                  <span className="text-slate-400">Mandatory photos check</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. USER PERSONAS */}
      {activeSection === 'personas' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Users className="w-5.5 h-5.5 text-red-650" />
              4. Core User Personas
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">6 key personas designed to ensure maximum field, warehouse, and office utility.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajesh Kumar (48)',
                role: 'Business Owner & Founder',
                goal: 'Ensure zero margin leakages on orders, clear outstanding collections, and inspect real-time shop performance.',
                frustrate: 'Scribbled cost estimates, manual calculators, and verbal pricing compromises.'
              },
              {
                name: 'Amit Sharma (26)',
                role: 'Senior Graphic Designer',
                goal: 'Fast customer art uploads, tracking revision tickets, clear resolution requirements.',
                frustrate: 'Feedback verbal mismatch, printing wrong old designs by accident.'
              },
              {
                name: 'Pappu Yadav (34)',
                role: 'Solvent & LED Printer Operator',
                goal: 'High speed queue sorting, clear height/width instructions, instant low ink feedback.',
                frustrate: 'Complex multi-column spreadsheets with dirty grease on fingers.'
              },
              {
                name: 'Sanjay Singh (31)',
                role: 'Site Surveyor & Installer',
                goal: 'Easy measure uploads, quick photo proofs, instant material checkouts.',
                frustrate: 'Writing down sizes on paper packets, ladder balance typing limits.'
              },
              {
                name: 'Karan Verma (24)',
                role: 'Logistics & Delivery Representative',
                goal: 'Clear optimized route mappings, quick phone dialing, digital sign capturing.',
                frustrate: 'Address confusion in traffic, verbal client delivery disputes.'
              },
              {
                name: 'Neelam Gupta (29)',
                role: 'Front-Desk Reception & Billing',
                goal: 'Fast walk-in order estimation, GST invoice logging, dynamic quote builder.',
                frustrate: 'Excel lookup sheets for raw rate parameters while client waits.'
              }
            ].map((p, i) => (
              <div key={i} className="border border-slate-200 p-5 rounded-2xl bg-slate-50/40 space-y-3 hover:border-slate-350 hover:shadow-2xs transition-all">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900">{p.name}</h3>
                  <span className="inline-block text-[10px] font-mono font-bold bg-red-50 text-red-750 px-2.5 py-0.5 rounded border border-red-100">{p.role}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-600"><strong>🎯 Core Goal:</strong> {p.goal}</p>
                  <p className="text-slate-600"><strong>⚠️ Pain Point:</strong> {p.frustrate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ROLE-BASED USER FLOWS */}
      {activeSection === 'flows' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Layers className="w-5.5 h-5.5 text-red-650" />
              5. Role-Based User Flows (Task-Driven Checklists)
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Step-by-step task tracking designed for high efficiency.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Field Installation Workflow Flow</h3>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Task Dispatch', desc: 'Installer Sanjay receives push alert on phone indicating new flex mount job.' },
                  { step: '2', title: 'Tap Google Map Navigation', desc: 'Sanjay clicks "NAVIGATE" button inside task, instantly opening routing.' },
                  { step: '3', title: 'Before-Photo Upload (Mandatory)', desc: 'Upon reaching location, he snaps a photo of the bare iron truss frame.' },
                  { step: '4', title: 'Fitting & Wiring Installation', desc: 'Performs mounting, back lighting connection, and tension adjustments.' },
                  { step: '5', title: 'After-Photo Upload (Mandatory)', desc: 'Uploads illuminated banner photo. Completion button unlocks.' },
                  { step: '6', title: 'One-Tap Customer Signature', desc: 'Customer marks on touch-screen with finger to authorize final bill release.' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-850">{item.title}</span>
                      <p className="text-[11px] text-slate-500 leading-normal font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Printing Operator Workflow Flow</h3>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Incoming Queue Notification', desc: 'Operator Pappu sees a clean cards list of newly approved designs.' },
                  { step: '2', title: 'Dimensions Lock & Preview', desc: 'Inspects specific vinyl dimensions (10x4 ft) and grade requirements.' },
                  { step: '3', title: 'Direct Source Artwork Download', desc: 'Clicks "DOWNLOAD HIGH-RES" button, pulling files from cloud instantly.' },
                  { step: '4', title: 'Print execution Check-In', desc: 'Taps "START PRINTING", notifying management that machine is running.' },
                  { step: '5', title: 'Low Inventory Fast-Track', desc: 'If vinyl rolls run dry, taps "REPORT ISSUE" to alert supplier immediately.' },
                  { step: '6', title: 'Quality Verification', desc: 'Confirms printing completed without stripes or color gaps, marks job "READY".' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-850">{item.title}</span>
                      <p className="text-[11px] text-slate-500 leading-normal font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 & 7. INTERACTIVE MOBILE WIREFRAME SIMULATOR */}
      {activeSection === 'wireframes' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Smartphone className="w-5.5 h-5.5 text-red-650" />
              6 & 7. Interactive Wireframes (Touch & Desktop Simulation)
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Click the interactive phone buttons below to experience the redesign flows live.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Selector controls */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono block">Choose Wireframe Flow Screen</span>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'home', title: '1. Mobile Home Dashboard', desc: 'Custom widgets, outstanding logs, critical inventory warnings' },
                  { id: 'calc', title: '2. Guided quotation builder', desc: 'Step-by-step sizing questionnaire with margin locks' },
                  { id: 'survey', title: '3. Field Site Survey task', desc: 'One-hand measurements, voice recorder, and camera upload' },
                  { id: 'job', title: '4. Active Installation execution', desc: 'Maps nav tracker, check-in, before/after photo audits' }
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setWireframeMobileScreen(sc.id as any)}
                    className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                      wireframeMobileScreen === sc.id
                        ? 'border-red-600 bg-red-50 text-red-800 font-extrabold ring-1 ring-red-150'
                        : 'border-slate-150 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block text-xs">{sc.title}</span>
                    <p className="text-[10px] text-slate-450 font-medium leading-normal mt-0.5">{sc.desc}</p>
                  </button>
                ))}
              </div>

              {/* Reset simulator inputs helper */}
              <button 
                onClick={() => {
                  setCalcStep(1);
                  setSurveyStep(1);
                  setJobStep(1);
                  setJobBeforePhoto(false);
                  setJobAfterPhoto(false);
                  setSurveyPhotos([]);
                  setSurveyVoiceMemo(false);
                  setSurveyNotes('');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Screen Simulation Parameters
              </button>
            </div>

            {/* Right side: Interactive Simulated Phone */}
            <div className="lg:col-span-8 flex justify-center">
              <div className="w-[325px] h-[610px] bg-slate-950 rounded-[44px] p-3.5 border-[6px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
                {/* Speaker Grill & Camera Cutout */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 z-10">
                  <div className="w-10 h-1 bg-slate-800 rounded-full" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                </div>

                {/* Simulated Screen Inner Canvas */}
                <div className="bg-slate-50 w-full h-full rounded-[30px] overflow-hidden flex flex-col relative text-slate-800 pt-5">
                  
                  {/* Status Bar */}
                  <div className="px-5 py-1 text-[9px] font-mono font-extrabold flex justify-between items-center text-slate-500 bg-white border-b border-slate-100 shrink-0">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1">
                      <span>4G VoLTE</span>
                      <span className="font-sans">🔋 98%</span>
                    </div>
                  </div>

                  {/* ACTIVE SCREEN INNER CONTENTS */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 relative">

                    {/* WIREFRAME: HOME TAB */}
                    {wireframeMobileScreen === 'home' && (
                      <div className="space-y-3 animate-fadeIn">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[8px] font-black uppercase text-slate-400 font-mono">Welcome back</span>
                            <span className="block text-xs font-black text-slate-900">Rajesh Kumar (Owner)</span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">● LIVE</span>
                        </div>

                        {/* Search Simulation Trigger */}
                        <button 
                          onClick={() => setShowSpotlight(true)}
                          className="w-full py-1.5 px-2.5 bg-white border border-slate-200/80 rounded-lg text-[10px] text-slate-400 flex items-center gap-2 cursor-pointer shadow-3xs"
                        >
                          <Search className="w-3 h-3" />
                          <span>Search everything...</span>
                        </button>

                        {/* Statistics Widget Cards */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-3xs">
                            <span className="text-[8px] font-black uppercase text-slate-450 tracking-wider font-mono block">Today's Sales</span>
                            <span className="text-sm font-black text-slate-900">₹1,82,400</span>
                            <span className="text-[8px] text-emerald-600 font-bold block">↑ 14% vs yesterday</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-3xs">
                            <span className="text-[8px] font-black uppercase text-slate-450 tracking-wider font-mono block">Outstanding Dues</span>
                            <span className="text-sm font-black text-red-600">₹85,000</span>
                            <span className="text-[8px] text-slate-450 font-bold block">6 invoices pending</span>
                          </div>
                        </div>

                        {/* Low stock indicators widget */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 space-y-1">
                          <span className="text-[8px] font-mono font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                            CRITICAL SYSTEM INVENTORY WARNING
                          </span>
                          <p className="text-[9px] text-slate-700 leading-normal font-medium">Solvent Cyan Ink running dry. Star Flex 10ft roll below threshold limit.</p>
                        </div>

                        {/* Quick Interactive Actions Menu */}
                        <div className="space-y-1.5">
                          <span className="text-[8px] font-black uppercase text-slate-450 tracking-wider font-mono block">Quick Actions</span>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button onClick={() => setWireframeMobileScreen('calc')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-center cursor-pointer hover:bg-slate-50 shadow-3xs transition-all">
                              <span className="block text-[14px]">📝</span>
                              <span className="text-[7px] font-black block mt-1 uppercase">Order Quote</span>
                            </button>
                            <button onClick={() => setWireframeMobileScreen('survey')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-center cursor-pointer hover:bg-slate-50 shadow-3xs transition-all">
                              <span className="block text-[14px]">📐</span>
                              <span className="text-[7px] font-black block mt-1 uppercase">New Survey</span>
                            </button>
                            <button onClick={() => setWireframeMobileScreen('job')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-center cursor-pointer hover:bg-slate-50 shadow-3xs transition-all">
                              <span className="block text-[14px]">🔧</span>
                              <span className="text-[7px] font-black block mt-1 uppercase">Jobs List</span>
                            </button>
                          </div>
                        </div>

                        {/* Recent Job Activity logs */}
                        <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5 shadow-3xs">
                          <span className="text-[8px] font-black uppercase text-slate-450 tracking-wider font-mono block">Recent activity logs</span>
                          <div className="space-y-1 text-[8px] font-medium text-slate-650">
                            <div className="flex justify-between border-b border-slate-50 pb-1">
                              <span>Sanjay approved Vijay survey</span>
                              <span className="text-slate-400">2m ago</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-1">
                              <span>Pappu started vinyl print #2390</span>
                              <span className="text-slate-400">14m ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WIREFRAME: GUIDED CALC WIZARD */}
                    {wireframeMobileScreen === 'calc' && (
                      <div className="space-y-3.5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1">
                            <Sliders className="w-3.5 h-3.5 text-red-650" />
                            Quotation Wizard
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-slate-200 px-2 py-0.5 rounded">Step {calcStep} of 5</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-600 h-full transition-all duration-300" 
                            style={{ width: `${(calcStep / 5) * 100}%` }}
                          />
                        </div>

                        {/* Step 1: Product Selection */}
                        {calcStep === 1 && (
                          <div className="space-y-2.5 animate-fadeIn">
                            <span className="block text-[10px] font-extrabold text-slate-700">What is the required product?</span>
                            <div className="grid grid-cols-2 gap-2">
                              {['Flex Banner', 'ACP Board', 'LED Board', 'Glow Sign Box', 'Standee Display', 'Visiting Card'].map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setCalcProduct(p)}
                                  className={`p-2 border rounded-xl text-[9px] font-bold text-center cursor-pointer transition-all ${
                                    calcProduct === p
                                      ? 'border-red-600 bg-red-50 text-red-800 font-black ring-1 ring-red-150'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Step 2: Sizing inputs */}
                        {calcStep === 2 && (
                          <div className="space-y-3 animate-fadeIn">
                            <span className="block text-[10px] font-extrabold text-slate-700">Specify dimensions in Feet:</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] text-slate-450 font-bold mb-1 uppercase">Width (ft)</label>
                                <input
                                  type="number"
                                  value={calcWidth}
                                  onChange={(e) => setCalcWidth(Math.max(1, parseInt(e.target.value) || 0))}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] text-slate-450 font-bold mb-1 uppercase">Height (ft)</label>
                                <input
                                  type="number"
                                  value={calcHeight}
                                  onChange={(e) => setCalcHeight(Math.max(1, parseInt(e.target.value) || 0))}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                                />
                              </div>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-lg text-center">
                              <span className="text-[9px] text-slate-500 font-semibold uppercase font-mono">Calculated Total Area:</span>
                              <span className="block text-xs font-black text-slate-800">{calcWidth * calcHeight} SqFt</span>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Quantities */}
                        {calcStep === 3 && (
                          <div className="space-y-3 animate-fadeIn text-center">
                            <span className="block text-[10px] font-extrabold text-slate-700">Quantity Needed:</span>
                            <div className="flex items-center justify-center gap-4 py-2">
                              <button 
                                onClick={() => setCalcQty(Math.max(1, calcQty - 1))}
                                className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-center flex items-center justify-center cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-lg font-black text-slate-900 font-mono w-12">{calcQty}</span>
                              <button 
                                onClick={() => setCalcQty(calcQty + 1)}
                                className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-center flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Step 4: Addons */}
                        {calcStep === 4 && (
                          <div className="space-y-2.5 animate-fadeIn">
                            <span className="block text-[10px] font-extrabold text-slate-700">Include Add-on Services:</span>
                            
                            <div className="space-y-1.5">
                              {[
                                { state: calcFrame, setter: setCalcFrame, title: 'Fabricated Truss Frame', desc: 'Saves iron raw materials calculation' },
                                { state: calcInstallation, setter: setCalcInstallation, title: 'On-Site Installation Crew', desc: 'Adds base labour charges' },
                                { state: calcTransport, setter: setCalcTransport, title: 'Tempo Logistics Delivery', desc: 'Adds fuel distance metrics' },
                              ].map((add, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => add.setter(!add.state)}
                                  className={`w-full p-2 border rounded-xl text-left flex items-center justify-between cursor-pointer transition-all ${
                                    add.state
                                      ? 'border-red-600 bg-red-55/15'
                                      : 'border-slate-200 bg-white'
                                  }`}
                                >
                                  <div>
                                    <span className="block text-[9px] font-extrabold text-slate-800">{add.title}</span>
                                    <span className="block text-[7px] text-slate-400 font-medium leading-none">{add.desc}</span>
                                  </div>
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${add.state ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'}`}>
                                    {add.state && <Check className="w-3 h-3" />}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Step 5: Final Estimate Preview */}
                        {calcStep === 5 && (
                          <div className="space-y-2.5 animate-fadeIn">
                            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-450 font-mono text-center">Estimate Summary Preview</span>
                            
                            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1.5 shadow-3xs text-[9px] font-medium leading-relaxed">
                              <div className="flex justify-between border-b border-slate-100 pb-1 font-bold">
                                <span>Product Type:</span>
                                <span>{calcProduct}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1">
                                <span>Sizing Dimensions:</span>
                                <span className="font-mono">{calcWidth} x {calcHeight} ft ({calcWidth * calcHeight} sqft)</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1">
                                <span>Total Quantity:</span>
                                <span className="font-mono">x{calcQty}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-100 pb-1 font-semibold">
                                <span>Include Addons:</span>
                                <span>{calcFrame ? 'Frame ' : ''}{calcInstallation ? 'Fit ' : ''}{calcTransport ? 'Tempo' : ''}</span>
                              </div>
                              <div className="flex justify-between pt-1 text-xs font-black text-red-650">
                                <span>Estimated Selling Price:</span>
                                <span className="font-mono">₹{((calcWidth * calcHeight * 45 * calcQty) + (calcFrame ? 1800 : 0) + (calcInstallation ? 600 : 0) + (calcTransport ? 350 : 0)).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Wizard footer navigation */}
                        <div className="flex justify-between gap-2 pt-2 border-t border-slate-150 mt-auto shrink-0">
                          <button
                            disabled={calcStep === 1}
                            onClick={() => setCalcStep(prev => prev - 1)}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-[9px] font-bold disabled:opacity-40 cursor-pointer"
                          >
                            Back
                          </button>

                          {calcStep < 5 ? (
                            <button
                              onClick={() => setCalcStep(prev => prev + 1)}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-bold cursor-pointer"
                            >
                              Next Step
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                alert('Proposal saved! This mock item has been added to our temporary simulation quotation storage.');
                                setCalcStep(1);
                                setWireframeMobileScreen('home');
                              }}
                              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-black cursor-pointer shadow-3xs"
                            >
                              Confirm Quote
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* WIREFRAME: FIELD SURVEY TASK */}
                    {wireframeMobileScreen === 'survey' && (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-650 animate-pulse" />
                            Vijay Nagar Survey #4
                          </span>
                          <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-55/15 px-2 py-0.5 rounded">Active Draft</span>
                        </div>

                        {/* Step checklist indicator */}
                        <div className="flex gap-1 justify-between">
                          {[
                            { id: 1, label: 'Photos' },
                            { id: 2, label: 'Measure' },
                            { id: 3, label: 'Voice Notes' },
                          ].map((s) => (
                            <button 
                              key={s.id} 
                              onClick={() => setSurveyStep(s.id)}
                              className={`flex-1 text-center py-1 text-[8px] font-bold rounded-md border ${
                                surveyStep === s.id 
                                  ? 'border-red-650 bg-red-50 text-red-800' 
                                  : 'border-slate-200 text-slate-400 bg-white'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>

                        {/* Step 1 Content: Photos */}
                        {surveyStep === 1 && (
                          <div className="space-y-2.5 animate-fadeIn">
                            <span className="block text-[9px] font-extrabold text-slate-700 uppercase tracking-wide">Attach Site Context Images</span>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => {
                                  if (surveyPhotos.length < 2) {
                                    setSurveyPhotos(prev => [...prev, `IMG-${Date.now()}`]);
                                  }
                                }}
                                className="aspect-video bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-all p-2"
                              >
                                <span className="text-lg">📷</span>
                                <span className="text-[7px] font-black uppercase text-slate-500 mt-1">Capture Image</span>
                              </button>

                              <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-2 relative">
                                {surveyPhotos.length > 0 ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center font-mono text-[7px] text-slate-450 text-center font-bold">
                                    <span className="text-emerald-600 block text-sm">✓</span>
                                    <span>Captured Frame</span>
                                    <button onClick={() => setSurveyPhotos([])} className="text-red-500 hover:text-red-700 text-[6px] block mt-1 uppercase">Clear</button>
                                  </div>
                                ) : (
                                  <span className="text-[7px] text-slate-400 font-mono text-center font-bold">No images captured yet</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2 Content: Sizing Tape measurements */}
                        {surveyStep === 2 && (
                          <div className="space-y-3.5 animate-fadeIn">
                            <span className="block text-[9px] font-extrabold text-slate-700 uppercase tracking-wide">Input Physical Measurements</span>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[7px] text-slate-450 font-bold mb-0.5">Width Feet</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 15.5 ft"
                                  value={surveyWidth}
                                  onChange={(e) => setSurveyWidth(e.target.value)}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[7px] text-slate-450 font-bold mb-0.5">Height Feet</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 8.2 ft"
                                  value={surveyHeight}
                                  onChange={(e) => setSurveyHeight(e.target.value)}
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 3 Content: Voice logs */}
                        {surveyStep === 3 && (
                          <div className="space-y-2.5 animate-fadeIn text-center">
                            <span className="block text-[9px] font-extrabold text-slate-700 uppercase tracking-wide">Record Site Voice Notes</span>
                            <p className="text-[8px] text-slate-400 font-medium">Record climbing challenges, mounting surface details (brick, cement, iron truss).</p>
                            
                            <div className="flex justify-center py-2">
                              <button 
                                onClick={() => setSurveyVoiceMemo(!surveyVoiceMemo)}
                                className={`w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all border shadow-xs ${
                                  surveyVoiceMemo 
                                    ? 'bg-red-600 border-red-700 text-white animate-pulse' 
                                    : 'bg-white border-slate-250 text-slate-750 hover:bg-slate-50'
                                }`}
                              >
                                {surveyVoiceMemo ? <Mic className="w-5 h-5 shrink-0" /> : <Mic className="w-5 h-5 text-slate-400 shrink-0" />}
                                <span className="text-[6px] font-black uppercase mt-1">{surveyVoiceMemo ? 'Recording' : 'Record'}</span>
                              </button>
                            </div>

                            <textarea
                              placeholder="Type brief optional structural challenges here..."
                              value={surveyNotes}
                              onChange={(e) => setSurveyNotes(e.target.value)}
                              className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white h-12"
                            />
                          </div>
                        )}

                        {/* Submit Survey */}
                        <button
                          onClick={() => {
                            if (!surveyWidth || !surveyHeight) {
                              alert('Please input measurements first');
                              return;
                            }
                            alert('🎉 Site survey measurements successfully logged! System alert generated for designers.');
                            setWireframeMobileScreen('home');
                            setSurveyPhotos([]);
                            setSurveyWidth('');
                            setSurveyHeight('');
                            setSurveyVoiceMemo(false);
                            setSurveyNotes('');
                          }}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-black rounded-lg cursor-pointer mt-auto shrink-0 shadow-3xs uppercase tracking-wider"
                        >
                          Submit Survey Entry
                        </button>
                      </div>
                    )}

                    {/* WIREFRAME: JOB INSTALLATION FLOW */}
                    {wireframeMobileScreen === 'job' && (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            Vijay Road Board Mount
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">FITTER DUTY</span>
                        </div>

                        {/* Map Navigation Quick Launch widget */}
                        <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex justify-between items-center shadow-3xs">
                          <div>
                            <span className="block text-[8px] font-black uppercase text-slate-400 font-mono">Location address</span>
                            <span className="block text-[9px] font-extrabold text-slate-800 truncate w-36">Chanakyapuri Commercial Complex</span>
                          </div>
                          <button 
                            onClick={() => alert('Simulating Google Maps deep link redirection: "https://maps.google.com/?q=Chanakyapuri"')}
                            className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white text-[8px] font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-3xs"
                          >
                            Navigate
                          </button>
                        </div>

                        {/* Step check in checklist */}
                        <div className="space-y-2">
                          <span className="block text-[8px] font-black uppercase text-slate-450 tracking-wider font-mono">Installation Milestones</span>
                          
                          {/* Step 1: Check In */}
                          <button
                            onClick={() => { if (jobStep === 1) setJobStep(2); }}
                            className={`w-full p-2.5 border rounded-xl text-left flex items-center justify-between cursor-pointer transition-all ${
                              jobStep > 1 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : jobStep === 1 
                                  ? 'border-red-600 bg-red-55/10 text-slate-850' 
                                  : 'border-slate-200 bg-white text-slate-450'
                            }`}
                          >
                            <div>
                              <span className="block text-[9px] font-black uppercase">1. Check in at Site location</span>
                              <span className="block text-[7px] text-slate-400 mt-0.5">Locks GPS coordinate to verify physical presence</span>
                            </div>
                            {jobStep > 1 && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </button>

                          {/* Step 2: Upload Before Photo */}
                          <button
                            onClick={() => {
                              if (jobStep === 2) {
                                setJobBeforePhoto(true);
                                setJobStep(3);
                              }
                            }}
                            className={`w-full p-2.5 border rounded-xl text-left flex items-center justify-between cursor-pointer transition-all ${
                              jobStep > 2 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : jobStep === 2 
                                  ? 'border-red-600 bg-red-55/10 text-slate-850 animate-pulse' 
                                  : 'border-slate-200 bg-white text-slate-400'
                            }`}
                            disabled={jobStep < 2}
                          >
                            <div>
                              <span className="block text-[9px] font-black uppercase">2. Upload Truss "Before" Photo</span>
                              <span className="block text-[7px] text-slate-400 mt-0.5">Required before starting fabrication fitting</span>
                            </div>
                            {jobBeforePhoto ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Image className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                          </button>

                          {/* Step 3: Upload After Photo */}
                          <button
                            onClick={() => {
                              if (jobStep === 3) {
                                setJobAfterPhoto(true);
                                setJobStep(4);
                              }
                            }}
                            className={`w-full p-2.5 border rounded-xl text-left flex items-center justify-between cursor-pointer transition-all ${
                              jobStep > 3 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : jobStep === 3 
                                  ? 'border-red-600 bg-red-55/10 text-slate-850 animate-pulse' 
                                  : 'border-slate-200 bg-white text-slate-400'
                            }`}
                            disabled={jobStep < 3}
                          >
                            <div>
                              <span className="block text-[9px] font-black uppercase">3. Upload Mounted "After" Photo</span>
                              <span className="block text-[7px] text-slate-400 mt-0.5">Required for final billing audit release</span>
                            </div>
                            {jobAfterPhoto ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Image className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                          </button>
                        </div>

                        {/* Finish trigger */}
                        <button
                          onClick={() => {
                            if (!jobAfterPhoto) {
                              alert('Before & After photos are strictly mandatory before marking job completed!');
                              return;
                            }
                            alert('🎉 Job marked successfully completed! Accounts team notified to generate final GST ledger invoice.');
                            setWireframeMobileScreen('home');
                            setJobStep(1);
                            setJobBeforePhoto(false);
                            setJobAfterPhoto(false);
                          }}
                          className={`w-full py-2 text-white text-[9px] font-black rounded-lg cursor-pointer mt-auto shrink-0 shadow-3xs uppercase tracking-wider transition-all ${
                            jobStep === 4 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-350 cursor-not-allowed opacity-50'
                          }`}
                          disabled={jobStep < 4}
                        >
                          Complete Job Order
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Simulated Mobile Bottom Navigation Bar */}
                  <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex justify-between items-center shrink-0">
                    <button 
                      onClick={() => setWireframeMobileScreen('home')}
                      className={`flex flex-col items-center justify-center cursor-pointer transition-all ${wireframeMobileScreen === 'home' ? 'text-red-600' : 'text-slate-400'}`}
                    >
                      <span className="text-sm">🏠</span>
                      <span className="text-[7px] font-black uppercase tracking-wider block mt-0.5">Home</span>
                    </button>

                    <button 
                      onClick={() => setWireframeMobileScreen('job')}
                      className={`flex flex-col items-center justify-center cursor-pointer transition-all ${wireframeMobileScreen === 'job' ? 'text-red-600' : 'text-slate-400'}`}
                    >
                      <span className="text-sm">🔧</span>
                      <span className="text-[7px] font-black uppercase tracking-wider block mt-0.5">Jobs</span>
                    </button>

                    {/* Central Quick FAB Button */}
                    <button 
                      onClick={() => {
                        alert('Interactive Quick Action Overlay triggered! Allows adding customer, surveys, estimates instantly on mobile.');
                      }}
                      className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md relative -top-3 border-2 border-white hover:scale-105 transition-all cursor-pointer"
                    >
                      <Plus className="w-5 h-5 shrink-0" />
                    </button>

                    <button 
                      onClick={() => {
                        alert('Simulating inventory quick scanning feature using phone camera barcodes!');
                      }}
                      className="flex flex-col items-center justify-center cursor-pointer text-slate-400"
                    >
                      <span className="text-sm">📦</span>
                      <span className="text-[7px] font-black uppercase tracking-wider block mt-0.5">Inventory</span>
                    </button>

                    <button 
                      onClick={() => {
                        alert('Simulating mobile profile dashboard with local Hindi language toggles!');
                      }}
                      className="flex flex-col items-center justify-center cursor-pointer text-slate-400"
                    >
                      <span className="text-sm">👤</span>
                      <span className="text-[7px] font-black uppercase tracking-wider block mt-0.5">Profile</span>
                    </button>
                  </div>

                  {/* Simulated Android Home Button Pill */}
                  <div className="bg-white py-1 flex justify-center shrink-0">
                    <div className="w-24 h-1 bg-slate-300 rounded-full" />
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. COMPLETE DESIGN SYSTEM PLAYGROUND */}
      {activeSection === 'design_system' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Settings className="w-5.5 h-5.5 text-red-650" />
              8. Unified Design System & Component Token Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Fully reusable atomic UI components with exact touch target scaling guidelines.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Component: Buttons */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block border-b border-slate-100 pb-1.5">Action Buttons (Min 48px target)</span>
              
              <div className="space-y-2.5">
                <button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-3xs">
                  Primary Action Button
                </button>
                <button className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-250 text-slate-750 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-3xs">
                  Secondary Slate Button
                </button>
                <button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-3xs">
                  Dark Tactical Button
                </button>
              </div>
            </div>

            {/* Component: Inputs */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block border-b border-slate-100 pb-1.5">Input Field Controls</span>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] text-slate-450 font-bold mb-1 uppercase tracking-wide">Standard Numeric Sizer</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="e.g. 15" 
                      className="w-full h-12 px-3 bg-white border border-slate-250 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                    <span className="absolute right-3.5 top-3.5 text-[9px] font-mono font-bold text-slate-400 uppercase">Feet</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] text-slate-450 font-bold mb-1 uppercase tracking-wide">Dropdown Selector Option</label>
                  <select className="w-full h-12 px-3 bg-white border border-slate-250 rounded-xl text-xs font-bold outline-hidden">
                    <option>Star Premium Grade Flex</option>
                    <option>Standard Solvent Flex</option>
                    <option>Matt Glass Poly Vinyl</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Component: Tags & Status chips */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block border-b border-slate-100 pb-1.5">State Badges & Chips</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-800">Job Approved</span>
                  <span className="block text-[11px] font-extrabold text-slate-800 mt-1">Ready</span>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-800">Production</span>
                  <span className="block text-[11px] font-extrabold text-slate-800 mt-1">In-Progress</span>
                </div>
                <div className="p-2.5 bg-red-50 border border-red-150 rounded-xl text-center">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-red-750">Outstanding Dues</span>
                  <span className="block text-[11px] font-extrabold text-slate-800 mt-1">Unpaid</span>
                </div>
                <div className="p-2.5 bg-slate-105 border border-slate-200 rounded-xl text-center">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-slate-650">System Spec</span>
                  <span className="block text-[11px] font-extrabold text-slate-800 mt-1">Draft</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 9. HIGH FIDELITY MOCKUPS PREVIEW */}
      {activeSection === 'high_fidelity' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Monitor className="w-5.5 h-5.5 text-red-650" />
              9. Role-Specific High-Fidelity UI Screens
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Sleek, high-contrast layouts tailored to specific company roles.</p>
          </div>

          <div className="space-y-6">
            
            {/* Owner Visual Mockup */}
            <div className="p-5.5 bg-slate-950 text-white rounded-2xl border border-slate-850 space-y-4 shadow-md">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-850">
                <span className="text-[10px] uppercase tracking-wider text-red-500 font-bold font-mono">1. Owner Executive Dashboard High-Fidelity Mockup</span>
                <span className="text-[9px] bg-slate-850 text-slate-400 px-2 py-0.5 rounded font-mono">AUTHORIZED SECURE</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[8px] font-mono uppercase text-slate-400 block">System net profits</span>
                  <span className="text-xl font-black tracking-tight text-white font-display">₹1,45,200</span>
                  <p className="text-[8px] text-emerald-500 mt-1">32% margin ceiling protected successfully</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[8px] font-mono uppercase text-slate-400 block">Pending Outstanding collectables</span>
                  <span className="text-xl font-black tracking-tight text-red-500 font-display">₹12,400</span>
                  <p className="text-[8px] text-slate-400 mt-1">Under collections cycle trigger</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[8px] font-mono uppercase text-slate-400 block">Critical stock items alert</span>
                  <span className="text-xl font-black tracking-tight text-amber-500 font-display">4 Items</span>
                  <p className="text-[8px] text-slate-400 mt-1">Reorder sequence initiated in backend</p>
                </div>
              </div>
            </div>

            {/* Designer Queue Mockup */}
            <div className="p-5.5 bg-white border border-slate-200 rounded-2xl space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-black font-mono">2. Graphic Designer Queue workstation Mockup</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">Today's Designs</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4.5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Vijay Sales Board Backdrop</h4>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">Approved Survey measurements: 15.5 x 8.2 ft</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-mono font-bold rounded">Pending Approval</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-normal font-medium"><strong>Customer feedback:</strong> Wants deeper red corporate match on borders. Standard resolution required.</p>
                  
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-bold rounded-lg cursor-pointer">
                      Download Raw Art
                    </button>
                    <button className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black rounded-lg cursor-pointer">
                      Upload Proof
                    </button>
                  </div>
                </div>

                <div className="p-4.5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Apollo Hospital Lightbox Vinyl</h4>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">Size parameters: 10 x 4 ft</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-mono font-bold rounded">Artwork Approved</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-normal font-medium"><strong>Verification status:</strong> Client authorized sign on proof at 12:44 PM. Dispatched to print queue.</p>
                  
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button className="w-full py-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-[9px] font-bold rounded-lg cursor-pointer">
                      View approved proof image
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 10. INTERACTIVE APPROVAL & FEEDBACK FORM */}
      {activeSection === 'approval' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 font-display">
              <CheckCircle2 className="w-5.5 h-5.5 text-red-650 animate-pulse" />
              10. Interactive Redesign Approval & Feedback Tracker
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Submit your feedback directly to the implementation queue to authorize the development phase.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Form inputs */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono block">Design Proposal Feedback form</span>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase">Signatory Name (Required)</label>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={approvalName}
                    onChange={(e) => setApprovalName(e.target.value)}
                    className="w-full h-12 px-4 border border-slate-255 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase">Company Role</label>
                    <select
                      value={approvalRole}
                      onChange={(e) => setApprovalRole(e.target.value)}
                      className="w-full h-12 px-3 border border-slate-255 rounded-xl text-xs font-bold bg-white outline-hidden"
                    >
                      <option value="Owner">Owner / Director</option>
                      <option value="Manager">Manager</option>
                      <option value="Designer">Graphic Designer</option>
                      <option value="Staff">Field / Operator Staff</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase">Action Status Selection</label>
                    <div className="flex gap-2 h-12">
                      <button
                        onClick={() => handleSaveApproval('approved')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 shrink-0" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleSaveApproval('revisions')}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 shrink-0" />
                        Revise
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-700 mb-1.5 uppercase">Additional design recommendations</label>
                  <textarea
                    placeholder="Write your specific revision suggestions or comments here..."
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    className="w-full p-4 border border-slate-255 rounded-xl text-xs font-medium h-24 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Immutable audit trail logging */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 font-mono block">Action Log Audit Trail</span>
              
              <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 max-h-[310px] overflow-y-auto space-y-3 font-mono text-[10px]">
                {savedLogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-bold">
                    <span>No approval logs recorded yet.</span>
                    <p className="text-[9px] font-normal mt-1 leading-normal">Submit the form on the left to authorize the next engineering phase.</p>
                  </div>
                ) : (
                  savedLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-white border border-slate-150 rounded-xl space-y-1.5 shadow-3xs animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-slate-800">{log.name} ({log.role})</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          log.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-normal font-semibold">Comments: "{log.comments}"</p>
                      <span className="block text-[8px] text-slate-450 text-right">{log.timestamp} IST</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
