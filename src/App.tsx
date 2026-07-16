/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Layers,
  Settings,
  Calendar,
  TrendingUp,
  Globe,
  FileText,
  Tag,
  PhoneCall,
  Mail,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  PlusCircle,
  Truck
} from 'lucide-react';

import {
  Language,
  UserRole,
  Job,
  Customer,
  Material,
  Ticket,
  Delivery,
  FollowUp,
  Quotation,
  Invoice,
  CalculatorRates,
  JobStatus,
  TicketStatus
} from './types';

import {
  INITIAL_RATES,
  INITIAL_CUSTOMERS,
  INITIAL_JOBS,
  INITIAL_MATERIALS,
  INITIAL_TICKETS,
  INITIAL_DELIVERIES,
  INITIAL_FOLLOW_UPS,
  INITIAL_QUOTATIONS,
  INITIAL_INVOICES
} from './data/mockData';

import { translations } from './data/translations';

// Subcomponents
import PublicWebsite from './components/PublicWebsite';
import CalculatorHub from './components/CalculatorHub';
import CRMPanel from './components/CRMPanel';
import InventoryManager from './components/InventoryManager';
import TicketSystem from './components/TicketSystem';
import QuotationInvoice from './components/QuotationInvoice';
import ReportsPanel from './components/ReportsPanel';
import SmartScheduler from './components/SmartScheduler';
import FollowUpPanel from './components/FollowUpPanel';
import StaffPortal from './components/StaffPortal';
import OwnerDashboard from './components/OwnerDashboard';
import SystemBlueprints from './components/SystemBlueprints';

export default function App() {
  // Global states (Language and Access Control Role)
  const [lang, setLang] = useState<Language>('EN');
  const [userRole, setUserRole] = useState<UserRole>('Owner');
  const [activeTab, setActiveTab] = useState<string>('owner_dashboard');

  // Core business models loaded from local storage or mock files
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [rates, setRates] = useState<CalculatorRates>(INITIAL_RATES);

  // Initialize and load from localStorage
  useEffect(() => {
    const localJobs = localStorage.getItem('abms_jobs');
    const localCust = localStorage.getItem('abms_customers');
    const localMat = localStorage.getItem('abms_materials');
    const localTickets = localStorage.getItem('abms_tickets');
    const localDlv = localStorage.getItem('abms_deliveries');
    const localFollows = localStorage.getItem('abms_followups');
    const localQuotes = localStorage.getItem('abms_quotations');
    const localInvs = localStorage.getItem('abms_invoices');
    const localRates = localStorage.getItem('abms_rates');

    setJobs(localJobs ? JSON.parse(localJobs) : INITIAL_JOBS);
    setCustomers(localCust ? JSON.parse(localCust) : INITIAL_CUSTOMERS);
    setMaterials(localMat ? JSON.parse(localMat) : INITIAL_MATERIALS);
    setTickets(localTickets ? JSON.parse(localTickets) : INITIAL_TICKETS);
    setDeliveries(localDlv ? JSON.parse(localDlv) : INITIAL_DELIVERIES);
    setFollowUps(localFollows ? JSON.parse(localFollows) : INITIAL_FOLLOW_UPS);
    setQuotations(localQuotes ? JSON.parse(localQuotes) : INITIAL_QUOTATIONS);
    setInvoices(localInvs ? JSON.parse(localInvs) : INITIAL_INVOICES);
    if (localRates) setRates(JSON.parse(localRates));
  }, []);

  // Save changes to localStorage helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // State mutators synced to localStorage
  const handleUpdateJobStatus = (id: string, status: JobStatus, photoUrl?: string, note?: string) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === id) {
        const historyItem = {
          status,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          changedBy: `Logged User (${userRole})`,
          role: userRole
        };
        
        const updatedNotes = [...j.notes];
        if (note) {
          updatedNotes.push({
            id: `N-${Date.now()}`,
            author: `Logged User (${userRole})`,
            role: userRole,
            text: note,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16)
          });
        }

        const updatedPhotos = [...j.completionPhotos];
        if (photoUrl) {
          updatedPhotos.push(photoUrl);
        }

        return {
          ...j,
          status,
          notes: updatedNotes,
          completionPhotos: updatedPhotos,
          history: [...j.history, historyItem]
        };
      }
      return j;
    });
    setJobs(updatedJobs);
    saveState('abms_jobs', updatedJobs);
  };

  const handleAddJob = (job: { title: string; description: string; cost: number; customerName: string }) => {
    const newJob: Job = {
      id: `JOB-0${jobs.length + 1}`,
      title: job.title,
      description: job.description,
      customerId: 'CUST-GEN',
      customerName: job.customerName,
      status: 'Quotation',
      priority: 'Medium',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      designFiles: [],
      completionPhotos: [],
      notes: [],
      cost: job.cost,
      history: [
        {
          status: 'Quotation',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          changedBy: `Logged User (${userRole})`,
          role: userRole
        }
      ],
      installationRequired: false
    };

    const updated = [newJob, ...jobs];
    setJobs(updated);
    saveState('abms_jobs', updated);
  };

  const handleAddCustomer = (c: Customer) => {
    const updated = [c, ...customers];
    setCustomers(updated);
    saveState('abms_customers', updated);
  };

  const handleUpdateStock = (materialId: string, type: 'IN' | 'OUT', qty: number, reason: string) => {
    const updated = materials.map((m) => {
      if (m.id === materialId) {
        const newLevel = type === 'IN' ? m.stockLevel + qty : Math.max(0, m.stockLevel - qty);
        const log = {
          id: `H-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type,
          qty,
          reason,
          user: `Duty staff (${userRole})`
        };
        return {
          ...m,
          stockLevel: newLevel,
          history: [log, ...m.history]
        };
      }
      return m;
    });
    setMaterials(updated);
    saveState('abms_materials', updated);
  };

  const handleAddMaterial = (m: Material) => {
    const updated = [m, ...materials];
    setMaterials(updated);
    saveState('abms_materials', updated);
  };

  const handleAddTicket = (tkt: Ticket) => {
    const updated = [tkt, ...tickets];
    setTickets(updated);
    saveState('abms_tickets', updated);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: TicketStatus, note?: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const updatedNotes = [...t.notes];
        if (note) {
          updatedNotes.push({
            id: `TN-${Date.now()}`,
            author: `Duty staff (${userRole})`,
            text: note,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16)
          });
        }
        return {
          ...t,
          status,
          notes: updatedNotes
        };
      }
      return t;
    });
    setTickets(updated);
    saveState('abms_tickets', updated);
  };

  const handleToggleFollowUp = (id: string) => {
    const updated = followUps.map((f) => {
      if (f.id === id) {
        return { ...f, isCompleted: !f.isCompleted };
      }
      return f;
    });
    setFollowUps(updated);
    saveState('abms_followups', updated);
  };

  const handleAddFollowUp = (flp: FollowUp) => {
    const updated = [flp, ...followUps];
    setFollowUps(updated);
    saveState('abms_followups', updated);
  };

  const handleAddQuotation = (q: Quotation) => {
    const updated = [q, ...quotations];
    setQuotations(updated);
    saveState('abms_quotations', updated);
  };

  const handleAddInvoice = (inv: Invoice) => {
    const updated = [inv, ...invoices];
    setInvoices(updated);
    saveState('abms_invoices', updated);
  };

  const handleUpdateRates = (newRates: CalculatorRates) => {
    setRates(newRates);
    saveState('abms_rates', newRates);
  };

  // Staff raises ticket through portal helper
  const handleRaiseTicketFromStaff = (title: string, desc: string, type: string) => {
    const newTicket: Ticket = {
      id: `TCK-0${tickets.length + 1}`,
      title,
      type: type as any,
      description: desc || 'Raised automatically on duty.',
      raisedBy: `Workspace Staff (${userRole})`,
      raisedByRole: userRole,
      status: 'Open',
      priority: 'High',
      createdDate: new Date().toISOString().split('T')[0],
      notes: []
    };
    handleAddTicket(newTicket);
  };

  // Helper dictionary lookup
  const t = (key: keyof typeof translations.EN) => {
    return translations[lang][key] || translations['EN'][key];
  };

  // Dynamically set default view when switching userRole to match RBAC guidelines
  useEffect(() => {
    if (userRole === 'Owner') setActiveTab('owner_dashboard');
    else if (userRole === 'Manager') setActiveTab('owner_dashboard');
    else if (userRole === 'Reception') setActiveTab('crm');
    else if (userRole === 'Designer' || userRole === 'Operator' || userRole === 'Delivery') setActiveTab('staff_portal');
    else if (userRole === 'Customer') setActiveTab('public_website');
  }, [userRole]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Header bar */}
      <header className="bg-white text-slate-900 border-b border-slate-200 shadow-sm px-6 py-4 sticky top-0 z-30 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-red-600 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900">
              {t('appName')} <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">ERP v1.0</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono font-medium">Agrasen Flex Printers Digital Operating Command Center</p>
          </div>
        </div>

        {/* Global Controls: Language and Role Switching */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">{t('langLabel')}</span>
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex">
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition-all ${lang === 'EN' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLang('HI')}
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition-all ${lang === 'HI' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🇮🇳 हिन्दी
              </button>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">{t('roleLabel')}</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:outline-hidden font-mono text-xs cursor-pointer transition-all hover:bg-slate-200"
            >
              <option value="Owner">{t('owner')}</option>
              <option value="Manager">{t('manager')}</option>
              <option value="Reception">{t('reception')}</option>
              <option value="Designer">{t('designer')}</option>
              <option value="Operator">{t('operator')}</option>
              <option value="Delivery">{t('delivery')}</option>
              <option value="Customer">{t('customer')}</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Rail tailored to active Role permissions */}
        <nav className="w-full md:w-64 bg-white border-r border-slate-200 py-6 text-slate-700 shrink-0 shadow-2xs">
          <div className="px-4 mb-6">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-sans font-extrabold text-center flex items-center justify-center shadow-sm">
                {userRole[0]}
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">{userRole} Session</div>
                <div className="text-[9px] text-emerald-600 font-mono font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Online & Secure
                </div>
              </div>
            </div>
          </div>

          {/* Tab lists */}
          <div className="space-y-1 px-3 font-sans">
            {/* Owner/Manager Tabs */}
            {(userRole === 'Owner' || userRole === 'Manager') && (
              <>
                <button
                  onClick={() => setActiveTab('owner_dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'owner_dashboard' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-4.5 h-4.5 shrink-0" />
                  {t('dashboard')}
                </button>
                <button
                  onClick={() => setActiveTab('crm')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'crm' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4.5 h-4.5 shrink-0" />
                  {t('crm')}
                </button>
                <button
                  onClick={() => setActiveTab('calculators')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'calculators' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4.5 h-4.5 shrink-0" />
                  {t('calculatorHub')}
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'inventory' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-4.5 h-4.5 shrink-0" />
                  {t('inventory')}
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'tickets' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Tag className="w-4.5 h-4.5 shrink-0" />
                  {t('ticketSystem')}
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'billing' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4.5 h-4.5 shrink-0" />
                  {t('billingTab')}
                </button>
                <button
                  onClick={() => setActiveTab('scheduler')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'scheduler' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-4.5 h-4.5 shrink-0" />
                  {t('scheduler')}
                </button>
                <button
                  onClick={() => setActiveTab('followups')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'followups' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <PhoneCall className="w-4.5 h-4.5 shrink-0" />
                  {t('followUpSystem')}
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'reports' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4.5 h-4.5 shrink-0" />
                  {t('reports')}
                </button>
              </>
            )}

            {/* Receptionist Tabs */}
            {userRole === 'Reception' && (
              <>
                <button
                  onClick={() => setActiveTab('crm')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'crm' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4.5 h-4.5 shrink-0" />
                  {t('crm')}
                </button>
                <button
                  onClick={() => setActiveTab('calculators')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'calculators' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4.5 h-4.5 shrink-0" />
                  {t('calculatorHub')}
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'billing' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4.5 h-4.5 shrink-0" />
                  {t('billingTab')}
                </button>
                <button
                  onClick={() => setActiveTab('scheduler')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'scheduler' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-4.5 h-4.5 shrink-0" />
                  {t('scheduler')}
                </button>
                <button
                  onClick={() => setActiveTab('followups')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'followups' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <PhoneCall className="w-4.5 h-4.5 shrink-0" />
                  {t('followUpSystem')}
                </button>
              </>
            )}

            {/* Designer / Operator / Delivery Tabs */}
            {(userRole === 'Designer' || userRole === 'Operator' || userRole === 'Delivery') && (
              <>
                <button
                  onClick={() => setActiveTab('staff_portal')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'staff_portal' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-4.5 h-4.5 shrink-0" />
                  {t('staffPortal')}
                </button>
                <button
                  onClick={() => setActiveTab('calculators')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'calculators' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4.5 h-4.5 shrink-0" />
                  {t('calculatorHub')}
                </button>
                <button
                  onClick={() => setActiveTab('scheduler')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'scheduler' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-4.5 h-4.5 shrink-0" />
                  {t('scheduler')}
                </button>
              </>
            )}

            {/* Customer Portal Tabs */}
            {userRole === 'Customer' && (
              <>
                <button
                  onClick={() => setActiveTab('public_website')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'public_website' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-4.5 h-4.5 shrink-0" />
                  {t('publicWebsite')}
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'billing' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4.5 h-4.5 shrink-0" />
                  {t('billingTab')}
                </button>
              </>
            )}

            {/* Blueprints and interactive specifications tab (available globally) */}
            <div className="pt-4 mt-4 border-t border-slate-200">
              <button
                onClick={() => setActiveTab('blueprints')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'blueprints' ? 'bg-red-600 text-white shadow-xs' : 'hover:bg-slate-50 text-red-600 hover:bg-slate-100 hover:text-red-700'
                }`}
              >
                <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-500" />
                {t('blueprints')}
              </button>
            </div>
          </div>
        </nav>

        {/* Content Panel Area */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'owner_dashboard' && (userRole === 'Owner' || userRole === 'Manager') && (
            <OwnerDashboard
              jobs={jobs}
              materials={materials}
              tickets={tickets}
              followUps={followUps}
              onUpdateJobStatus={handleUpdateJobStatus}
              onAddJob={handleAddJob}
              lang={lang}
            />
          )}

          {activeTab === 'crm' && (
            <CRMPanel customers={customers} onAddCustomer={handleAddCustomer} lang={lang} />
          )}

          {activeTab === 'calculators' && (
            <CalculatorHub
              rates={rates}
              onUpdateRates={handleUpdateRates}
              onAddJobFromCalc={handleAddJob}
              userRole={userRole}
              lang={lang}
            />
          )}

          {activeTab === 'inventory' && (userRole === 'Owner' || userRole === 'Manager') && (
            <InventoryManager
              materials={materials}
              onAddMaterial={handleAddMaterial}
              onUpdateStock={handleUpdateStock}
              lang={lang}
            />
          )}

          {activeTab === 'tickets' && (userRole === 'Owner' || userRole === 'Manager') && (
            <TicketSystem
              tickets={tickets}
              onAddTicket={handleAddTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              lang={lang}
            />
          )}

          {activeTab === 'billing' && (
            <QuotationInvoice
              customers={customers}
              quotations={quotations}
              invoices={invoices}
              onAddQuotation={handleAddQuotation}
              onAddInvoice={handleAddInvoice}
              lang={lang}
            />
          )}

          {activeTab === 'scheduler' && (
            <SmartScheduler lang={lang} />
          )}

          {activeTab === 'followups' && (
            <FollowUpPanel
              followUps={followUps}
              onToggleFollowUp={handleToggleFollowUp}
              onAddFollowUp={handleAddFollowUp}
              lang={lang}
            />
          )}

          {activeTab === 'reports' && (userRole === 'Owner' || userRole === 'Manager') && (
            <ReportsPanel lang={lang} />
          )}

          {activeTab === 'staff_portal' && (userRole === 'Designer' || userRole === 'Operator' || userRole === 'Delivery') && (
            <StaffPortal
              jobs={jobs}
              role={userRole}
              onUpdateJobStatus={handleUpdateJobStatus}
              onRaiseTicketFromStaff={handleRaiseTicketFromStaff}
              lang={lang}
            />
          )}

          {activeTab === 'public_website' && (
            <PublicWebsite onAddJob={handleAddJob} lang={lang} />
          )}

          {activeTab === 'blueprints' && (
            <SystemBlueprints />
          )}
        </main>
      </div>

      {/* Footer System Credits */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 py-5 px-6 text-center text-xs font-mono flex flex-col md:flex-row justify-between items-center gap-2">
        <span>© 2026 Agrasen Flex Printers ERP Operating System. All Rights Reserved.</span>
        <span>Registered to Owner Ramesh Sharma • Delhi, India</span>
      </footer>
    </div>
  );
}
