/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ShieldAlert,
  Sparkles,
  PlusCircle,
  Truck,
  MapPin,
  Menu,
  X,
  Lock,
  Unlock,
  LogOut,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  History,
  Activity,
  Terminal,
  Clock,
  Check,
  UserPlus,
  RefreshCw,
  Search
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
  TicketStatus,
  Employee,
  EmployeePermissions,
  AuditLog,
  TimelineEvent
} from './types';

import { api } from './services/api';

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
import SiteSurveyJobSystem from './components/SiteSurveyJobSystem';
import UXRedesignPortal from './components/UXRedesignPortal';

export default function App() {
  // --- STATE STORES ---
  const [lang, setLang] = useState<Language>('EN');
  const [activeTab, setActiveTab] = useState<string>('ux_redesign_portal');
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState<boolean>(false);

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

  // --- NEW RBAC STATES ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Login Screen Input States
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Custom Session Lock timer
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(15);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  // --- COMPACT MANAGER CONTROLS FOR SUPER ADMIN ---
  const [mgmtSearch, setMgmtSearch] = useState<string>('');
  const [mgmtTab, setMgmtTab] = useState<'employees' | 'permissions' | 'audit_log'>('employees');
  const [selectedMgmtEmployee, setSelectedMgmtEmployee] = useState<string>('EMP-001');

  // New Employee fields
  const [newEmpName, setNewEmpName] = useState<string>('');
  const [newEmpUser, setNewEmpUser] = useState<string>('');
  const [newEmpPass, setNewEmpPass] = useState<string>('');
  const [newEmpRole, setNewEmpRole] = useState<'Super Admin' | 'Office Executive' | 'Production Team' | 'Field Team'>('Office Executive');
  const [newEmpDept, setNewEmpDept] = useState<string>('');

  // Intelligent Workspace Tab Transition Skeleton Trigger
  useEffect(() => {
    setIsWorkspaceLoading(true);
    const timer = setTimeout(() => {
      setIsWorkspaceLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Client state synchronizer to full-stack Express backend
  const syncStateToServer = async (
    updatedJobs = jobs,
    updatedMaterials = materials,
    updatedTickets = tickets,
    updatedDeliveries = deliveries,
    updatedFollowUps = followUps,
    updatedQuotations = quotations,
    updatedInvoices = invoices,
    updatedRates = rates
  ) => {
    try {
      await api.syncClientState({
        jobs: updatedJobs,
        materials: updatedMaterials,
        tickets: updatedTickets,
        deliveries: updatedDeliveries,
        followUps: updatedFollowUps,
        quotations: updatedQuotations,
        invoices: updatedInvoices,
        rates: updatedRates
      });
    } catch (e) {
      console.warn('Sync failed:', e);
    }
  };

  // Initial Data Seed & Sync Loader
  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const data = await api.getSession();
        
        // Populate core business states from central backend
        setJobs(data.jobs && data.jobs.length > 0 ? data.jobs : JSON.parse(localStorage.getItem('abms_jobs') || '[]') || INITIAL_JOBS);
        setCustomers(data.customers && data.customers.length > 0 ? data.customers : JSON.parse(localStorage.getItem('abms_customers') || '[]') || INITIAL_CUSTOMERS);
        setMaterials(data.materials && data.materials.length > 0 ? data.materials : JSON.parse(localStorage.getItem('abms_materials') || '[]') || INITIAL_MATERIALS);
        setTickets(data.tickets && data.tickets.length > 0 ? data.tickets : JSON.parse(localStorage.getItem('abms_tickets') || '[]') || INITIAL_TICKETS);
        setDeliveries(data.deliveries && data.deliveries.length > 0 ? data.deliveries : JSON.parse(localStorage.getItem('abms_deliveries') || '[]') || INITIAL_DELIVERIES);
        setFollowUps(data.followUps && data.followUps.length > 0 ? data.followUps : JSON.parse(localStorage.getItem('abms_followups') || '[]') || INITIAL_FOLLOW_UPS);
        setQuotations(data.quotations && data.quotations.length > 0 ? data.quotations : JSON.parse(localStorage.getItem('abms_quotations') || '[]') || INITIAL_QUOTATIONS);
        setInvoices(data.invoices && data.invoices.length > 0 ? data.invoices : JSON.parse(localStorage.getItem('abms_invoices') || '[]') || INITIAL_INVOICES);
        
        if (data.rates) {
          setRates(data.rates);
        } else {
          const savedRates = localStorage.getItem('abms_rates');
          if (savedRates) setRates(JSON.parse(savedRates));
        }

        // Active authenticated employee
        setCurrentEmployee(data.employee);
        
        // Pull latest employee directory
        const directory = await api.getEmployees();
        setEmployees(directory);
        
        setAuditLogs(data.auditLogs || []);

        // Route to respective screen
        if (data.employee.role === 'Super Admin') {
          setActiveTab('owner_dashboard');
        } else if (data.employee.role === 'Office Executive') {
          setActiveTab('crm');
        } else {
          setActiveTab('staff_portal');
        }
      } catch (err) {
        console.warn('Bootstrap: Unauthenticated or server offline. Defaulting to client gate.');
        setJobs(JSON.parse(localStorage.getItem('abms_jobs') || '[]') || INITIAL_JOBS);
        setCustomers(JSON.parse(localStorage.getItem('abms_customers') || '[]') || INITIAL_CUSTOMERS);
        setMaterials(JSON.parse(localStorage.getItem('abms_materials') || '[]') || INITIAL_MATERIALS);
        setTickets(JSON.parse(localStorage.getItem('abms_tickets') || '[]') || INITIAL_TICKETS);
        setDeliveries(JSON.parse(localStorage.getItem('abms_deliveries') || '[]') || INITIAL_DELIVERIES);
        setFollowUps(JSON.parse(localStorage.getItem('abms_followups') || '[]') || INITIAL_FOLLOW_UPS);
        setQuotations(JSON.parse(localStorage.getItem('abms_quotations') || '[]') || INITIAL_QUOTATIONS);
        setInvoices(JSON.parse(localStorage.getItem('abms_invoices') || '[]') || INITIAL_INVOICES);
        
        const savedRates = localStorage.getItem('abms_rates');
        if (savedRates) setRates(JSON.parse(savedRates));

        api.getEmployees().then(setEmployees).catch(() => {});
      }
    };
    bootstrapSession();
  }, []);

  // Save changes helper (synced back to local storage and full-stack Express)
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    
    // Sync update back to central backend Express layer
    if (key === 'abms_jobs') syncStateToServer(data);
    else if (key === 'abms_materials') syncStateToServer(undefined, data);
    else if (key === 'abms_tickets') syncStateToServer(undefined, undefined, data);
    else if (key === 'abms_deliveries') syncStateToServer(undefined, undefined, undefined, data);
    else if (key === 'abms_followups') syncStateToServer(undefined, undefined, undefined, undefined, data);
    else if (key === 'abms_quotations') syncStateToServer(undefined, undefined, undefined, undefined, undefined, data);
    else if (key === 'abms_invoices') syncStateToServer(undefined, undefined, undefined, undefined, undefined, undefined, data);
    else if (key === 'abms_rates') syncStateToServer(undefined, undefined, undefined, undefined, undefined, undefined, undefined, data);
  };

  // --- DETAILED AUDIT LOG GENERATOR ---
  const writeAuditLog = (action: string, details: string, beforeValue = '', afterValue = '', actorOverride?: Employee) => {
    const actor = actorOverride || currentEmployee;
    const newLog: AuditLog = {
      id: `AUDIT-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
      username: actor ? `${actor.name} (${actor.role})` : 'System Workspace',
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      device: navigator.userAgent.includes('Android') ? 'Android Mobile Device' : 'Desktop Admin Terminal',
      beforeValue,
      afterValue
    };

    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('abms_system_audit_logs', JSON.stringify(updatedLogs));

    // Sync back to employee individual activity log
    if (actor) {
      const updatedEmployees = employees.map(emp => {
        if (emp.id === actor.id) {
          return {
            ...emp,
            activityLogs: [{ timestamp: newLog.timestamp, action, details }, ...emp.activityLogs]
          };
        }
        return emp;
      });
      setEmployees(updatedEmployees);
      localStorage.setItem('abms_employees', JSON.stringify(updatedEmployees));
    }
  };

  // Keep Track of Session Timeout
  useEffect(() => {
    const checkTimeout = setInterval(() => {
      if (currentEmployee && sessionTimeoutMinutes > 0) {
        const timeDiff = Date.now() - lastActivityTime;
        if (timeDiff > sessionTimeoutMinutes * 60 * 1000) {
          handleLogout('Session Inactivity Lockout Triggered');
        }
      }
    }, 15000);
    return () => clearInterval(checkTimeout);
  }, [currentEmployee, lastActivityTime, sessionTimeoutMinutes]);

  // Update last activity timer on click / keydown
  const handleUserActivity = () => {
    setLastActivityTime(Date.now());
  };

  // --- CORE LOGIN HANDLERS ---
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);

    try {
      const { employee } = await api.login(loginUsername, loginPassword);
      setCurrentEmployee(employee);
      
      // Load fully synced server datasets on successful login
      const data = await api.getSession();
      if (data.jobs && data.jobs.length > 0) setJobs(data.jobs);
      if (data.customers && data.customers.length > 0) setCustomers(data.customers);
      if (data.materials && data.materials.length > 0) setMaterials(data.materials);
      if (data.tickets && data.tickets.length > 0) setTickets(data.tickets);
      if (data.deliveries && data.deliveries.length > 0) setDeliveries(data.deliveries);
      if (data.followUps && data.followUps.length > 0) setFollowUps(data.followUps);
      if (data.quotations && data.quotations.length > 0) setQuotations(data.quotations);
      if (data.invoices && data.invoices.length > 0) setInvoices(data.invoices);
      if (data.rates) setRates(data.rates);
      setAuditLogs(data.auditLogs || []);
      
      const directory = await api.getEmployees();
      setEmployees(directory);

      // Route based on role
      if (employee.role === 'Super Admin') {
        setActiveTab('owner_dashboard');
      } else if (employee.role === 'Office Executive') {
        setActiveTab('crm');
      } else {
        setActiveTab('staff_portal');
      }

      setLoginUsername('');
      setLoginPassword('');
      setLastActivityTime(Date.now());

      // Log success
      writeAuditLog('User Login Success', `Logged in as ${employee.name} from UI`, '', `Active: ${employee.name}`, employee);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication Failed');
    }
  };

  const handleLogout = async (reason = 'Manual Logout') => {
    if (currentEmployee) {
      writeAuditLog('User Logout', reason, `Active: ${currentEmployee.name}`, '');
    }
    await api.logout();
    setCurrentEmployee(null);
    setActiveTab('ux_redesign_portal');
  };

  const handleQuickDemoLogin = async (username: string) => {
    setLoginError(null);
    try {
      // Clear values first
      setLoginUsername(username);
      setLoginPassword('123'); // fallback default
      
      const { employee } = await api.login(username, '123');
      setCurrentEmployee(employee);
      
      const data = await api.getSession();
      if (data.jobs && data.jobs.length > 0) setJobs(data.jobs);
      if (data.customers && data.customers.length > 0) setCustomers(data.customers);
      if (data.materials && data.materials.length > 0) setMaterials(data.materials);
      if (data.tickets && data.tickets.length > 0) setTickets(data.tickets);
      if (data.deliveries && data.deliveries.length > 0) setDeliveries(data.deliveries);
      if (data.followUps && data.followUps.length > 0) setFollowUps(data.followUps);
      if (data.quotations && data.quotations.length > 0) setQuotations(data.quotations);
      if (data.invoices && data.invoices.length > 0) setInvoices(data.invoices);
      if (data.rates) setRates(data.rates);
      setAuditLogs(data.auditLogs || []);
      
      const directory = await api.getEmployees();
      setEmployees(directory);

      if (employee.role === 'Super Admin') {
        setActiveTab('owner_dashboard');
      } else if (employee.role === 'Office Executive') {
        setActiveTab('crm');
      } else {
        setActiveTab('staff_portal');
      }

      setLoginUsername('');
      setLoginPassword('');
      setLastActivityTime(Date.now());
      writeAuditLog('User Quick Demo Login', `Logged in via Quick Profile: ${employee.name}`, '', `Active: ${employee.name}`, employee);
    } catch (err: any) {
      setLoginError(err.message || 'Quick login failed');
    }
  };

  // --- AUDIT-LOG WRAPPED MUTATORS ---
  const handleUpdateJobStatus = (id: string, status: JobStatus, photoUrl?: string, note?: string) => {
    const beforeJob = jobs.find(j => j.id === id);
    const updatedJobs = jobs.map((j) => {
      if (j.id === id) {
        const historyItem = {
          status,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          changedBy: currentEmployee ? `${currentEmployee.name} (${currentEmployee.role})` : 'System Duty',
          role: currentEmployee ? currentEmployee.role : 'Super Admin'
        };
        
        const updatedNotes = [...j.notes];
        if (note) {
          updatedNotes.push({
            id: `N-${Date.now()}`,
            author: currentEmployee ? currentEmployee.name : 'System Duty',
            role: currentEmployee ? currentEmployee.role : 'Super Admin',
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

    // Audit logs entry
    writeAuditLog(
      'Updated Job Status', 
      `Job ${id} status moved to ${status}`, 
      beforeJob ? beforeJob.status : 'None', 
      status
    );
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
          changedBy: currentEmployee ? `${currentEmployee.name} (${currentEmployee.role})` : 'System Duty',
          role: currentEmployee ? currentEmployee.role : 'Super Admin'
        }
      ],
      installationRequired: false
    };

    const updated = [newJob, ...jobs];
    setJobs(updated);
    saveState('abms_jobs', updated);

    writeAuditLog('Added New Job', `Created Job ${newJob.id}: "${job.title}" for ₹${job.cost}`, '', job.title);
  };

  const handleAddCustomer = async (c: Customer) => {
    try {
      const created = await api.createCustomer({
        name: c.name,
        companyName: c.companyName,
        phone: c.phone,
        whatsapp: c.whatsapp,
        email: c.email,
        gst: c.gst,
        address: c.address,
        notes: c.notesList?.[0]?.text || ''
      });
      const freshCustomers = await api.getCustomers();
      setCustomers(freshCustomers);
      localStorage.setItem('abms_customers', JSON.stringify(freshCustomers));
      writeAuditLog('Added New Customer', `Created CRM record for "${created.name}"`, '', created.name);
    } catch (err: any) {
      alert(err.message || 'Failed to register customer profile');
    }
  };

  const handleUpdateCustomer = async (id: string, updatedFields: Partial<Customer>) => {
    try {
      await api.updateCustomer(id, updatedFields);
      const freshCustomers = await api.getCustomers();
      setCustomers(freshCustomers);
      localStorage.setItem('abms_customers', JSON.stringify(freshCustomers));
      writeAuditLog('Updated Customer Profile', `Modified attributes for Customer ${id}`, '', JSON.stringify(updatedFields));
    } catch (err: any) {
      alert(err.message || 'Failed to update customer');
    }
  };

  const handleUpdateStock = (materialId: string, type: 'IN' | 'OUT', qty: number, reason: string) => {
    const materialObj = materials.find(m => m.id === materialId);
    const beforeLevel = materialObj ? materialObj.stockLevel : 0;
    
    const updated = materials.map((m) => {
      if (m.id === materialId) {
        const newLevel = type === 'IN' ? m.stockLevel + qty : Math.max(0, m.stockLevel - qty);
        const log = {
          id: `H-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type,
          qty,
          reason,
          user: currentEmployee ? `${currentEmployee.name} (${currentEmployee.role})` : 'System Duty'
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

    writeAuditLog(
      'Updated Material Stock', 
      `Stock adjustment ${type} by ${qty} units: "${reason}"`, 
      `${beforeLevel} Units`, 
      `${type === 'IN' ? beforeLevel + qty : Math.max(0, beforeLevel - qty)} Units`
    );
  };

  const handleAddMaterial = (m: Material) => {
    const updated = [m, ...materials];
    setMaterials(updated);
    saveState('abms_materials', updated);

    writeAuditLog('Added Raw Material Catalog', `Created material block ${m.name}`, '', m.name);
  };

  const handleAddTicket = (tkt: Ticket) => {
    const updated = [tkt, ...tickets];
    setTickets(updated);
    saveState('abms_tickets', updated);

    writeAuditLog('Raised Support Ticket', `Ticket ${tkt.id} filed: "${tkt.title}"`, '', tkt.title);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: TicketStatus, note?: string) => {
    const beforeTicket = tickets.find(t => t.id === ticketId);
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const updatedNotes = [...t.notes];
        if (note) {
          updatedNotes.push({
            id: `TN-${Date.now()}`,
            author: currentEmployee ? currentEmployee.name : 'System Duty',
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

    writeAuditLog(
      'Updated Ticket Status', 
      `Ticket ${ticketId} status resolved to "${status}"`, 
      beforeTicket ? beforeTicket.status : 'None', 
      status
    );
  };

  const handleToggleFollowUp = (id: string) => {
    const followObj = followUps.find(f => f.id === id);
    const updated = followUps.map((f) => {
      if (f.id === id) {
        return { ...f, isCompleted: !f.isCompleted };
      }
      return f;
    });

    setFollowUps(updated);
    saveState('abms_followups', updated);

    writeAuditLog(
      'Toggled Follow-up Check', 
      `Follow-up check for ${followObj ? followObj.customerName : 'Client'} toggled`, 
      followObj && followObj.isCompleted ? 'Completed' : 'Pending', 
      followObj && followObj.isCompleted ? 'Pending' : 'Completed'
    );
  };

  const handleAddFollowUp = (flp: FollowUp) => {
    const updated = [flp, ...followUps];
    setFollowUps(updated);
    saveState('abms_followups', updated);

    writeAuditLog('Created Follow-up Task', `Follow-up title: "${flp.title}"`, '', flp.title);
  };

  const handleAddQuotation = (q: Quotation) => {
    const updated = [q, ...quotations];
    setQuotations(updated);
    saveState('abms_quotations', updated);

    writeAuditLog('Generated Sales Quotation', `Quotation ${q.id} drafted for ₹${q.total}`, '', q.id);
  };

  const handleAddInvoice = (inv: Invoice) => {
    const updated = [inv, ...invoices];
    setInvoices(updated);
    saveState('abms_invoices', updated);

    writeAuditLog('Generated Commercial Invoice', `Invoice ${inv.invoiceNumber} drafted for ₹${inv.total}`, '', inv.invoiceNumber);
  };

  const handleUpdateRates = (newRates: CalculatorRates) => {
    setRates(newRates);
    saveState('abms_rates', newRates);

    writeAuditLog('Configured Base Calculator Rates', 'Modified default product margins or installation base pricing', '', 'CalculatorRates');
  };

  const handleRaiseTicketFromStaff = (title: string, desc: string, type: string) => {
    const newTicket: Ticket = {
      id: `TCK-0${tickets.length + 1}`,
      title,
      type: type as any,
      description: desc || 'Raised automatically on duty.',
      raisedBy: currentEmployee ? `${currentEmployee.name} (${currentEmployee.role})` : 'System Staff',
      raisedByRole: currentEmployee ? currentEmployee.role : 'Production Team',
      status: 'Open',
      priority: 'High',
      createdDate: new Date().toISOString().split('T')[0],
      notes: []
    };
    handleAddTicket(newTicket);
  };

  // --- ADMIN PERMISSION MUTATORS ---
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpUser.trim() || !newEmpPass.trim() || !newEmpDept.trim()) {
      alert('All employee parameters must be filled');
      return;
    }

    const checkExist = employees.find(emp => emp.username.toLowerCase() === newEmpUser.toLowerCase().trim());
    if (checkExist) {
      alert('Username already registered in database');
      return;
    }

    const defaultPerms: EmployeePermissions = {
      viewDashboard: true,
      viewCRM: newEmpRole !== 'Production Team' && newEmpRole !== 'Field Team',
      viewCalculators: newEmpRole !== 'Production Team' && newEmpRole !== 'Field Team',
      viewInventory: newEmpRole !== 'Field Team',
      viewTickets: true,
      viewBilling: newEmpRole !== 'Production Team' && newEmpRole !== 'Field Team',
      viewSurvey: newEmpRole !== 'Production Team',
      viewScheduler: newEmpRole !== 'Production Team',
      viewFollowups: newEmpRole !== 'Production Team' && newEmpRole !== 'Field Team',
      viewReports: newEmpRole === 'Super Admin',
      viewUserManagement: newEmpRole === 'Super Admin',
      viewAuditLog: newEmpRole === 'Super Admin',
      createQuotation: newEmpRole === 'Super Admin' || newEmpRole === 'Office Executive',
      deleteRecords: newEmpRole === 'Super Admin',
      viewPricing: newEmpRole === 'Super Admin' || newEmpRole === 'Office Executive',
      changeSettings: newEmpRole === 'Super Admin'
    };

    try {
      const created = await api.createEmployee({
        name: newEmpName.trim(),
        username: newEmpUser.trim().toLowerCase(),
        password: newEmpPass,
        role: newEmpRole,
        department: newEmpDept.trim(),
        permissions: defaultPerms
      });

      setEmployees([...employees, created]);
      writeAuditLog('Registered New Employee Profile', `Added ${created.name} as ${created.role} inside ${created.department}`, '', created.name);

      // Reset fields
      setNewEmpName('');
      setNewEmpUser('');
      setNewEmpPass('');
      setNewEmpDept('');
      alert(`🎉 Successfully registered: ${created.name} (Role: ${created.role})`);
    } catch (err: any) {
      alert(err.message || 'Failed to register employee');
    }
  };

  const handleToggleEmployeeStatus = async (empId: string) => {
    const target = employees.find(e => e.id === empId);
    if (!target) return;
    if (target.id === 'EMP-001') {
      alert('Cannot deactivate the root Super Admin Ramesh Sharma');
      return;
    }

    try {
      const updated = await api.toggleEmployeeStatus(empId);
      setEmployees(employees.map(emp => emp.id === empId ? updated : emp));
      writeAuditLog('Modified Employee Account Status', `Moved ${updated.name} to ${updated.status}`, target.status, updated.status);

      // If deactivating current logged in employee, force logout
      if (currentEmployee && currentEmployee.id === empId && updated.status === 'Deactivated') {
        handleLogout('Session Terminated: Deactivated by Administration');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleResetEmployeePassword = async (empId: string) => {
    const target = employees.find(e => e.id === empId);
    if (!target) return;
    const nextPass = prompt(`Enter new password for ${target.name}:`, '123');
    if (!nextPass) return;

    try {
      await api.resetPassword(empId, nextPass);
      // Refresh directory list
      const freshEmps = await api.getEmployees();
      setEmployees(freshEmps);
      writeAuditLog('Reset Employee Password', `Modified credential hashes for ${target.name}`, '', 'UPDATED');
      alert(`Password reset successful for ${target.name}`);
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    }
  };

  const handleTogglePermission = async (empId: string, permissionKey: keyof EmployeePermissions) => {
    if (empId === 'EMP-001') {
      alert('Root Super Admin permissions cannot be modified.');
      return;
    }

    const target = employees.find(e => e.id === empId);
    if (!target) return;

    const nextVal = !target.permissions[permissionKey];
    const updatedPerms = {
      ...target.permissions,
      [permissionKey]: nextVal
    };

    try {
      const updated = await api.updateEmployee(empId, { permissions: updatedPerms });
      const updatedDirectory = employees.map(emp => emp.id === empId ? updated : emp);
      setEmployees(updatedDirectory);

      // If modifying currently logged in user, immediately update active session state
      if (currentEmployee && currentEmployee.id === empId) {
        setCurrentEmployee(updated);
      }

      writeAuditLog(
        'Updated Role Permissions Matrix', 
        `Toggled "${permissionKey}" for ${updated.name}`, 
        'Toggled', 
        'Commit'
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update permissions');
    }
  };

  // Helper dictionary lookup
  const t = (key: keyof typeof translations.EN) => {
    return translations[lang][key] || translations['EN'][key];
  };

  // --- ROLE AND BACKWARD COMPATIBILITY MAPS ---
  const getSubcomponentRole = (): UserRole => {
    if (!currentEmployee) return 'Customer';
    const r = currentEmployee.role;
    if (r === 'Super Admin') return 'Owner';
    if (r === 'Office Executive') return 'Reception';
    if (r === 'Production Team') return 'Operator';
    if (r === 'Field Team') return 'Delivery';
    return 'Customer';
  };

  const activeSubRole = getSubcomponentRole();

  // Filter Search
  const filteredMgmtEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(mgmtSearch.toLowerCase()) || 
    emp.role.toLowerCase().includes(mgmtSearch.toLowerCase()) ||
    emp.department.toLowerCase().includes(mgmtSearch.toLowerCase())
  );

  const selectedMgmtEmpObj = employees.find(emp => emp.id === selectedMgmtEmployee);

  // --- RENDER FLOWS ---

  // FLOW 1: AUTHENTICATION GATE (Extremely Minimal, Modern, Clean & Premium)
  if (!currentEmployee) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center p-6 antialiased font-sans" id="rbac-auth-gate">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Company Logo Emblem */}
          <div className="space-y-2 text-center">
            <div className="inline-flex w-12 h-12 rounded-xl bg-zinc-950 items-center justify-center text-white mb-2 shadow-sm">
              <span className="text-xl font-black font-mono tracking-tighter">A</span>
            </div>
            <h2 className="text-sm font-bold tracking-widest text-zinc-900 uppercase">
              AGRASEN FLEX PRINTERS
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              Enterprise Operating System
            </p>
          </div>

          {/* Error notifications */}
          {loginError && (
            <div className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-xl text-xs text-zinc-700 font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-650 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Credential Inputs Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Username</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200/60 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-hidden transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200/60 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-hidden transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Unlock Workspace
            </button>
          </form>

        </div>
      </div>
    );
  }

  // FLOW 2: FULLY AUTHENTICATED WORKSPACE
  return (
    <div 
      className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col md:flex-row antialiased" 
      id="authenticated-workspace-root"
      onMouseMove={handleUserActivity}
      onKeyDown={handleUserActivity}
    >
      
      {/* LEFT SIDEBAR WORKSPACE NAVIGATION (Notion / Linear / ClickUp inspired) */}
      <aside className="w-full md:w-64 bg-[#fcfcfd] border-r border-zinc-200/40 shrink-0 flex flex-col justify-between p-5 md:sticky md:top-0 md:h-screen">
        
        {/* Top: Branding & Intelligent Spotlight Trigger */}
        <div className="space-y-6">
          
          {/* Elegant Display Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <span className="text-sm font-black font-display tracking-tight">A</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-900">
                AGRASEN OS
              </h1>
              <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Business Workspace</p>
            </div>
          </div>

          {/* Clean Module Selectors (एक्सेस मॉड्यूल) */}
          <div className="space-y-1">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-2 mb-2">
              Workspaces
            </span>

            {/* Dashboard permission toggle */}
            {currentEmployee.permissions.viewDashboard && (currentEmployee.role === 'Super Admin' || currentEmployee.role === 'Office Executive') && (
              <button
                onClick={() => setActiveTab('owner_dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'owner_dashboard' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                {t('dashboard')}
              </button>
            )}

            {/* CRM permission toggle */}
            {currentEmployee.permissions.viewCRM && (
              <button
                onClick={() => setActiveTab('crm')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'crm' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                {t('crm')}
              </button>
            )}

            {/* Estimate Builder permission toggle */}
            {currentEmployee.permissions.viewCalculators && (
              <button
                onClick={() => setActiveTab('calculators')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'calculators' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5 shrink-0" />
                {t('calculatorHub')}
              </button>
            )}

            {/* Inventory permission toggle */}
            {currentEmployee.permissions.viewInventory && (
              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'inventory' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                {t('inventory')}
              </button>
            )}

            {/* Ticket System permission toggle */}
            {currentEmployee.permissions.viewTickets && (
              <button
                onClick={() => setActiveTab('tickets')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'tickets' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 shrink-0" />
                {t('ticketSystem')}
              </button>
            )}

            {/* Billing permission toggle */}
            {currentEmployee.permissions.viewBilling && (
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'billing' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                {t('billingTab')}
              </button>
            )}

            {/* Site Survey permission toggle */}
            {currentEmployee.permissions.viewSurvey && (
              <button
                onClick={() => setActiveTab('site_survey')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'site_survey' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {t('siteSurvey')}
              </button>
            )}

            {/* Scheduler permission toggle */}
            {currentEmployee.permissions.viewScheduler && (
              <button
                onClick={() => setActiveTab('scheduler')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'scheduler' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                {t('scheduler')}
              </button>
            )}

            {/* Follow Ups permission toggle */}
            {currentEmployee.permissions.viewFollowups && (
              <button
                onClick={() => setActiveTab('followups')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'followups' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                {t('followUpSystem')}
              </button>
            )}

            {/* Reports permission toggle */}
            {currentEmployee.permissions.viewReports && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'reports' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                {t('reports')}
              </button>
            )}

            {/* Combined staff checkin portal */}
            {(currentEmployee.role === 'Production Team' || currentEmployee.role === 'Field Team') && (
              <button
                onClick={() => setActiveTab('staff_portal')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'staff_portal' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                Check-In Portal
              </button>
            )}

            {/* SUPER ADMIN CONSOLE: Employee Management & Audit Logs */}
            {currentEmployee.permissions.viewUserManagement && (
              <button
                onClick={() => setActiveTab('user_management')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'user_management' 
                    ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                    : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                Users & Auditing
              </button>
            )}

          </div>

          {/* Evaluation Anchors (Styled beautifully) */}
          <div className="space-y-1">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-2 mb-2">
              Redesign Review
            </span>
            <button
              onClick={() => setActiveTab('ux_redesign_portal')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'ux_redesign_portal' 
                  ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                  : 'hover:bg-zinc-100/50 text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-zinc-700" />
              11 Redesign Deliverables
            </button>
            <button
              onClick={() => setActiveTab('blueprints')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'blueprints' 
                  ? 'bg-zinc-100 text-zinc-900 font-semibold' 
                  : 'hover:bg-zinc-100/50 text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
              {t('blueprints')}
            </button>
          </div>

        </div>

        {/* Bottom: Minimalist Session & Employee Widget Card (No bulky outlines) */}
        <div className="pt-4 mt-6 border-t border-zinc-100 space-y-3.5">
          
          {/* Compact Employee details */}
          <div className="flex items-center gap-2.5 px-1.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentEmployee.name[0]}
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-zinc-900 truncate">{currentEmployee.name}</span>
              <span className="block text-[10px] text-zinc-400 font-mono truncate">{currentEmployee.role}</span>
            </div>
          </div>

          {/* Dynamic Language Toggle & Lock Options */}
          <div className="grid grid-cols-2 gap-1.5">
            
            {/* Lang toggles */}
            <div className="bg-zinc-100/50 p-0.5 rounded-lg border border-zinc-200/20 flex shrink-0">
              <button
                onClick={() => setLang('EN')}
                className={`flex-1 py-1 rounded-md font-mono font-bold text-[9px] transition-all cursor-pointer ${lang === 'EN' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('HI')}
                className={`flex-1 py-1 rounded-md font-mono font-bold text-[9px] transition-all cursor-pointer ${lang === 'HI' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                HI
              </button>
            </div>

            {/* Lock options select */}
            <select
              value={sessionTimeoutMinutes}
              onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value))}
              className="bg-zinc-50/50 hover:bg-zinc-100/40 border border-zinc-200/40 px-2 py-1 rounded-lg text-[9px] font-mono cursor-pointer focus:outline-none w-full text-zinc-600"
              title="Session Auto Lock Inactivity Timeout"
            >
              <option value={5}>Lock: 5m</option>
              <option value={15}>Lock: 15m</option>
              <option value={60}>Lock: 1h</option>
              <option value={0}>No Lock</option>
            </select>

          </div>

          {/* Clean, Non-Outlined Logout Action */}
          <button
            onClick={() => handleLogout()}
            className="w-full h-8 bg-zinc-900 hover:bg-zinc-850 text-white font-semibold text-[10px] uppercase tracking-wide rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-3xs"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>

        </div>
      </aside>


      {/* Main Content Area & Footer Column Wrapper */}
      <div className="flex-1 flex flex-col min-w-0" id="main-content-column">
        
        {/* Modern Interactive Top Bar */}
        <header className="h-16 border-b border-zinc-200/40 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30" id="workspace-top-bar">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-zinc-900 tracking-tight font-sans">
              {(() => {
                const mapping: Record<string, string> = {
                  owner_dashboard: lang === 'HI' ? 'डैशबोर्ड' : 'Dashboard',
                  crm: lang === 'HI' ? 'ग्राहक संबंध (CRM)' : 'Customer Directory (CRM)',
                  calculators: lang === 'HI' ? 'कैलकुलेटर' : 'Estimate Builder',
                  inventory: lang === 'HI' ? 'इन्वेंट्री' : 'Inventory Stock',
                  tickets: lang === 'HI' ? 'टिकट' : 'Job Tickets',
                  billing: lang === 'HI' ? 'बिलिंग' : 'Invoices & Payments',
                  site_survey: lang === 'HI' ? 'साइट सर्वे' : 'Site Survey Logs',
                  scheduler: lang === 'HI' ? 'शेड्यूलर' : 'Production Scheduler',
                  followups: lang === 'HI' ? 'फॉलो-अप' : 'Payment Followups',
                  reports: lang === 'HI' ? 'रिपोर्ट्स' : 'Performance Reports',
                  staff_portal: lang === 'HI' ? 'स्टाफ पोर्टल' : 'Staff Workspace',
                  user_management: lang === 'HI' ? 'कर्मचारी प्रबंधन' : 'Employee Management',
                  blueprints: lang === 'HI' ? 'ब्लूप्रिंट' : 'System Blueprints'
                };
                return mapping[activeTab] || activeTab.replace('_', ' ').toUpperCase();
              })()}
            </span>
            <span className="text-[10px] bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">
              {currentEmployee.role}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Logged in as: <strong className="text-zinc-850 font-bold">{currentEmployee.name}</strong></span>
            </div>
            <button
              onClick={() => handleLogout()}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all border border-red-200/30 shadow-3xs"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content Panel Screen Renderer */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {isWorkspaceLoading ? (
            <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-pulse" id="workspace-skeleton-shimmer">
              {/* Breadcrumbs and Section Title */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-zinc-200/60 rounded-md animate-pulse" />
                <div className="h-8 w-56 bg-zinc-200/80 rounded-lg animate-pulse" />
                <div className="h-3.5 w-1/2 bg-zinc-200/40 rounded-md animate-pulse" />
              </div>

              {/* Stats Card Shimmer Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-zinc-50 border border-zinc-200/20 rounded-2xl space-y-3">
                    <div className="h-2 w-16 bg-zinc-200/60 rounded" />
                    <div className="h-6 w-24 bg-zinc-200 rounded animate-pulse" />
                    <div className="h-2 w-32 bg-zinc-200/40 rounded" />
                  </div>
                ))}
              </div>

              {/* Master-Detail Layout Shimmer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-5 bg-zinc-50 border border-zinc-200/20 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                      <div className="h-4 w-36 bg-zinc-200/80 rounded animate-pulse" />
                      <div className="h-6 w-16 bg-zinc-200/60 rounded" />
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-50">
                          <div className="space-y-1">
                            <div className="h-3 w-40 bg-zinc-200 rounded" />
                            <div className="h-2 w-24 bg-zinc-200/40 rounded" />
                          </div>
                          <div className="h-6 w-12 bg-zinc-100 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-zinc-50 border border-zinc-200/20 rounded-2xl space-y-4">
                    <div className="h-4 w-28 bg-zinc-200/80 rounded animate-pulse" />
                    <div className="h-24 bg-zinc-200/20 rounded-xl animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-zinc-100 rounded" />
                      <div className="h-3 w-4/5 bg-zinc-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {/* Dashboard Module */}
          {activeTab === 'owner_dashboard' && currentEmployee.permissions.viewDashboard && (
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

          {/* CRM Module */}
          {activeTab === 'crm' && currentEmployee.permissions.viewCRM && (
            <CRMPanel
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              lang={lang}
              currentUser={currentEmployee}
            />
          )}

          {/* Estimate Builder / Calculator Module */}
          {activeTab === 'calculators' && currentEmployee.permissions.viewCalculators && (
            <CalculatorHub
              rates={rates}
              onUpdateRates={handleUpdateRates}
              onAddJobFromCalc={handleAddJob}
              userRole={activeSubRole}
              lang={lang}
              customers={customers}
              onAddQuotation={handleAddQuotation}
            />
          )}

          {/* Inventory Manager Module */}
          {activeTab === 'inventory' && currentEmployee.permissions.viewInventory && (
            <InventoryManager
              materials={materials}
              onAddMaterial={handleAddMaterial}
              onUpdateStock={handleUpdateStock}
              lang={lang}
            />
          )}

          {/* Ticket System Module */}
          {activeTab === 'tickets' && currentEmployee.permissions.viewTickets && (
            <TicketSystem
              tickets={tickets}
              onAddTicket={handleAddTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              lang={lang}
            />
          )}

          {/* Billing & Invoice Module */}
          {activeTab === 'billing' && currentEmployee.permissions.viewBilling && (
            <QuotationInvoice
              customers={customers}
              quotations={quotations}
              invoices={invoices}
              onAddQuotation={handleAddQuotation}
              onAddInvoice={handleAddInvoice}
              lang={lang}
            />
          )}

          {/* Site Survey Module */}
          {activeTab === 'site_survey' && currentEmployee.permissions.viewSurvey && (
            <SiteSurveyJobSystem
              lang={lang}
              userRole={activeSubRole}
              customers={customers}
              jobs={jobs}
              onUpdateJobStatus={handleUpdateJobStatus}
            />
          )}

          {/* Scheduler Module */}
          {activeTab === 'scheduler' && currentEmployee.permissions.viewScheduler && (
            <SmartScheduler lang={lang} />
          )}

          {/* Follow Ups Module */}
          {activeTab === 'followups' && currentEmployee.permissions.viewFollowups && (
            <FollowUpPanel
              followUps={followUps}
              onToggleFollowUp={handleToggleFollowUp}
              onAddFollowUp={handleAddFollowUp}
              lang={lang}
            />
          )}

          {/* Reports Panel */}
          {activeTab === 'reports' && currentEmployee.permissions.viewReports && (
            <ReportsPanel lang={lang} />
          )}

          {/* Staff Check-In Portal */}
          {activeTab === 'staff_portal' && (currentEmployee.role === 'Production Team' || currentEmployee.role === 'Field Team') && (
            <StaffPortal
              jobs={jobs}
              role={activeSubRole}
              onUpdateJobStatus={handleUpdateJobStatus}
              onRaiseTicketFromStaff={handleRaiseTicketFromStaff}
              lang={lang}
            />
          )}

          {/* Public Website */}
          {activeTab === 'public_website' && (
            <PublicWebsite onAddJob={handleAddJob} lang={lang} />
          )}

          {/* System Blueprints */}
          {activeTab === 'blueprints' && (
            <SystemBlueprints />
          )}

          {/* UX Redesign Proposal */}
          {activeTab === 'ux_redesign_portal' && (
            <UXRedesignPortal lang={lang} userRole={activeSubRole} />
          )}

          {/* INTERACTIVE USER MANAGEMENT & AUDIT LOG PANEL */}
          {activeTab === 'user_management' && currentEmployee.permissions.viewUserManagement && (
            <div className="space-y-6" id="user-management-control-panel">
              
              {/* Header card */}
              <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute right-0 top-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white font-mono shadow-md">
                      <Shield className="w-3.5 h-3.5" />
                      Security Console
                    </span>
                    <h2 className="text-xl font-extrabold tracking-tight">
                      Access Control & Permissions Directory
                    </h2>
                    <p className="text-xs text-slate-300 leading-normal max-w-xl font-medium">
                      Configure custom employee permission matrices, activate/deactivate accounts, audit active login history sessions, and monitor the global system ledger.
                    </p>
                  </div>

                  <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850">
                    <button
                      onClick={() => setMgmtTab('employees')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        mgmtTab === 'employees' ? 'bg-red-600 text-white font-black' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Employees
                    </button>
                    <button
                      onClick={() => setMgmtTab('permissions')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        mgmtTab === 'permissions' ? 'bg-red-600 text-white font-black' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Permissions Grid
                    </button>
                    <button
                      onClick={() => setMgmtTab('audit_log')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        mgmtTab === 'audit_log' ? 'bg-red-600 text-white font-black' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      Audit Ledger
                    </button>
                  </div>
                </div>
              </div>

              {/* SEARCH FILTER BAR FOR ADMIN PANEL */}
              {mgmtTab === 'employees' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-4 flex items-center gap-3 shadow-xs">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search employees by name, role, department..."
                    value={mgmtSearch}
                    onChange={(e) => setMgmtSearch(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-850 outline-hidden placeholder-slate-400"
                  />
                </div>
              )}

              {/* TAB CONTAINER 1: EMPLOYEE DIRECTORY & CREATION */}
              {mgmtTab === 'employees' && (
                <div className="grid lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Register Employee Form (4 cols) */}
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs h-fit">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <UserPlus className="w-4 h-4 text-red-600" />
                      Register New Employee
                    </h3>

                    <form onSubmit={handleCreateEmployee} className="space-y-3.5 text-xs font-bold text-slate-700">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newEmpName}
                          onChange={(e) => setNewEmpName(e.target.value)}
                          placeholder="e.g. Dilip Soni"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Username</label>
                          <input
                            type="text"
                            required
                            value={newEmpUser}
                            onChange={(e) => setNewEmpUser(e.target.value)}
                            placeholder="dilip_soni"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Password</label>
                          <input
                            type="password"
                            required
                            value={newEmpPass}
                            onChange={(e) => setNewEmpPass(e.target.value)}
                            placeholder="e.g. 123"
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Default Base Role</label>
                        <select
                          value={newEmpRole}
                          onChange={(e) => setNewEmpRole(e.target.value as any)}
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Office Executive">Office Executive</option>
                          <option value="Production Team">Production Team</option>
                          <option value="Field Team">Field Team</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Department / Desk</label>
                        <input
                          type="text"
                          required
                          value={newEmpDept}
                          onChange={(e) => setNewEmpDept(e.target.value)}
                          placeholder="e.g. Printing Desk, Survey Desk"
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" /> Register Employee
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Employees Directory (8 cols) */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Users className="w-4 h-4 text-red-600" />
                      Registered Employee Directory ({filteredMgmtEmployees.length})
                    </h3>

                    <div className="space-y-3">
                      {filteredMgmtEmployees.map((emp) => (
                        <div key={emp.id} className="border border-slate-200 rounded-2xl bg-slate-50 p-4 space-y-3 shadow-3xs">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                                {emp.name[0]}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-850 flex items-center gap-2">
                                  {emp.name}
                                  <span className="text-[9px] bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-lg font-bold">
                                    {emp.role}
                                  </span>
                                </h4>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  User: <span className="font-bold text-slate-700">{emp.username}</span> • Dept: {emp.department} • Status:{' '}
                                  <span className={`font-black uppercase tracking-wider ${emp.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {emp.status}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleEmployeeStatus(emp.id)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer border ${
                                  emp.status === 'Active'
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>

                              <button
                                onClick={() => handleResetEmployeePassword(emp.id)}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-700 rounded-xl cursor-pointer"
                              >
                                Reset Pass
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedMgmtEmployee(emp.id);
                                  setMgmtTab('permissions');
                                }}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] uppercase font-black tracking-wider rounded-xl cursor-pointer"
                              >
                                Edit Permissions
                              </button>
                            </div>
                          </div>

                          {/* Login Hist block */}
                          {emp.loginHistory.length > 0 ? (
                            <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-[9px] text-slate-500 font-mono flex justify-between items-center">
                              <span>Last active login logged:</span>
                              <span className="font-bold text-slate-700">
                                {emp.loginHistory[0].timestamp} via {emp.loginHistory[0].device}
                              </span>
                            </div>
                          ) : (
                            <div className="p-2 bg-slate-100 rounded-xl text-[9px] text-slate-400 font-mono text-center">
                              No recent active sessions logged in local cache history.
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB CONTAINER 2: GRANULAR PERMISSIONS MATRIX GRID */}
              {mgmtTab === 'permissions' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-red-600" />
                        Granular Employee Access Permissions Matrix
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium">Toggle individual checkboxes in real-time. Immediately saved and locked.</p>
                    </div>

                    {/* Selector of which employee to manage */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Configure For:</span>
                      <select
                        value={selectedMgmtEmployee}
                        onChange={(e) => setSelectedMgmtEmployee(e.target.value)}
                        className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer"
                      >
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>
                            👤 {e.name} ({e.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedMgmtEmpObj ? (
                    <div className="space-y-6">
                      <div className="bg-red-50 border border-red-100/70 p-4 rounded-2xl flex items-center gap-3">
                        <Shield className="w-5 h-5 text-red-600 animate-pulse shrink-0" />
                        <div className="text-xs font-bold text-red-950">
                          Editing Permissions of: {selectedMgmtEmpObj.name} ({selectedMgmtEmpObj.role})
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            Standard restrictions apply. Unchecking view options automatically collapses and hides corresponding links completely.
                          </p>
                        </div>
                      </div>

                      {/* Main checklist Grid */}
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 font-bold text-xs text-slate-700">
                        
                        {/* MODULE VIEWS CHECKLIST */}
                        <div className="border border-slate-150 p-4 rounded-2xl space-y-3 bg-slate-50">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                            🖥️ View Module Screens
                          </span>

                          <div className="space-y-2.5">
                            {[
                              { key: 'viewDashboard', label: 'Owner/Manager Dashboard' },
                              { key: 'viewCRM', label: 'CRM / Customers' },
                              { key: 'viewCalculators', label: 'Estimate Builder (Calculator)' },
                              { key: 'viewInventory', label: 'Raw Materials Inventory' },
                              { key: 'viewTickets', label: 'Support & Floor Tickets' },
                              { key: 'viewBilling', label: 'Billing / Invoice Register' },
                              { key: 'viewSurvey', label: 'Site Measurements & Survey' },
                              { key: 'viewScheduler', label: 'Smart Calendar Scheduler' },
                              { key: 'viewFollowups', label: 'Customer Follow-ups Panel' },
                              { key: 'viewReports', label: 'Revenue Analytics & Reports' },
                            ].map((item) => (
                              <label key={item.key} className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!selectedMgmtEmpObj.permissions[item.key as keyof EmployeePermissions]}
                                  onChange={() => handleTogglePermission(selectedMgmtEmpObj.id, item.key as any)}
                                  className="w-4 h-4 text-red-600 rounded-md cursor-pointer"
                                />
                                <span className={selectedMgmtEmpObj.permissions[item.key as keyof EmployeePermissions] ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'}>
                                  {item.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* TRANSACTION ACTIONS CHECKLIST */}
                        <div className="border border-slate-150 p-4 rounded-2xl space-y-3 bg-slate-50">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                            ⚡ Operations & Granular Rights
                          </span>

                          <div className="space-y-2.5">
                            {[
                              { key: 'createQuotation', label: 'Draft Estimates & Quotes' },
                              { key: 'deleteRecords', label: 'Delete System Ledger Records' },
                              { key: 'viewPricing', label: 'View Cost & Profit Margins' },
                              { key: 'changeSettings', label: 'Configure Global Rates & Settings' },
                              { key: 'viewUserManagement', label: 'Manage Employees & Access Logs' },
                              { key: 'viewAuditLog', label: 'Access Global Security Audit Logs' },
                            ].map((item) => (
                              <label key={item.key} className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!selectedMgmtEmpObj.permissions[item.key as keyof EmployeePermissions]}
                                  onChange={() => handleTogglePermission(selectedMgmtEmpObj.id, item.key as any)}
                                  className="w-4 h-4 text-red-600 rounded-md cursor-pointer"
                                />
                                <span className={selectedMgmtEmpObj.permissions[item.key as keyof EmployeePermissions] ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'}>
                                  {item.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* ACTIVE EMPLOYEE DIRECT HISTORY LOG */}
                        <div className="border border-slate-150 p-4 rounded-2xl space-y-3 bg-slate-50 h-[380px] overflow-y-auto">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block flex items-center gap-1 font-mono">
                            <Activity className="w-3.5 h-3.5 text-red-600" />
                            Activity Log History
                          </span>

                          <div className="space-y-2 font-mono text-[9px]">
                            {selectedMgmtEmpObj.activityLogs.map((log, lidx) => (
                              <div key={lidx} className="bg-white border border-slate-250 p-2 rounded-xl space-y-1">
                                <div className="flex justify-between font-bold text-slate-700">
                                  <span>{log.action}</span>
                                  <span>{log.timestamp.substring(11, 16)}</span>
                                </div>
                                <p className="text-slate-500 leading-normal">{log.details}</p>
                              </div>
                            ))}
                            {selectedMgmtEmpObj.activityLogs.length === 0 && (
                              <p className="text-center text-slate-400 py-6">No activity records registered for this employee profile.</p>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-4">Please register or select an employee from directory.</p>
                  )}
                </div>
              )}

              {/* TAB CONTAINER 3: GLOBAL SYSTEM AUDIT LEDGER */}
              {mgmtTab === 'audit_log' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Terminal className="w-4 h-4 text-red-600 animate-pulse" />
                    Global System Auditing Registers (Every single action logged)
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 font-black text-slate-500">
                          <th className="py-2.5 font-mono">Timestamp</th>
                          <th className="py-2.5">User Role Actor</th>
                          <th className="py-2.5">Action Executed</th>
                          <th className="py-2.5">Device Agent</th>
                          <th className="py-2.5 font-mono">Before Value</th>
                          <th className="py-2.5 font-mono">After Value</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-[10px]">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="py-3 text-slate-500">{log.timestamp}</td>
                            <td className="py-3 font-bold text-slate-800">{log.username}</td>
                            <td className="py-3 font-semibold text-slate-900">{log.action}</td>
                            <td className="py-3 text-slate-600">{log.device}</td>
                            <td className="py-3 text-rose-600 truncate max-w-[140px]" title={log.beforeValue}>
                              {log.beforeValue || '-'}
                            </td>
                            <td className="py-3 text-emerald-600 truncate max-w-[140px]" title={log.afterValue}>
                              {log.afterValue || '-'}
                            </td>
                          </tr>
                        ))}
                        {auditLogs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-slate-400 font-medium">
                              System audit log database is completely empty. Initiate transactions above to trigger log hooks.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

              </motion.div>
            </AnimatePresence>
          )}

        </main>
 
        {/* Footer System Credits */}
        <footer className="bg-zinc-50 border-t border-zinc-200/40 text-zinc-400 py-5 px-6 text-center text-[10px] font-mono flex flex-col md:flex-row justify-between items-center gap-2 z-25">
          <span>© 2026 Agrasen Flex Printers Operating System</span>
          <span>Secure Active License: Ramesh Sharma • Delhi, India</span>
        </footer>
      </div>

    </div>
  );
}
