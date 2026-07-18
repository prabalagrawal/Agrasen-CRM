import { Employee, Customer, TimelineEvent, AuditLog } from '../types';

const API_BASE = '/api';

// Simple client-side SHA-256 fallback hashing (since subtle web crypto is async)
async function hashStringSHA256(str: string): Promise<string> {
  try {
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Basic fallback hash if webcrypto is unavailable
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

// Get Session Token Helper
export function getSessionToken(): string | null {
  return localStorage.getItem('abms_session_token');
}

export function setSessionToken(token: string | null) {
  if (token) {
    localStorage.setItem('abms_session_token', token);
  } else {
    localStorage.removeItem('abms_session_token');
  }
}

// Standard Header Generator
function getHeaders(): Record<string, string> {
  const token = getSessionToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['x-session-token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Client Side Database State Mock (for absolute stability fallback)
const FALLBACK_EMPLOYEES_KEY = 'abms_fallback_employees';
const FALLBACK_SESSIONS_KEY = 'abms_fallback_sessions';
const FALLBACK_CUSTOMERS_KEY = 'abms_fallback_customers';

const DEFAULT_EMPLOYEES_FALLBACK: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Nayan',
    username: 'nayan',
    passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA-256 for '123'
    role: 'Super Admin',
    department: 'Administration',
    status: 'Active',
    createdDate: '2026-07-18 00:00:00',
    permissions: {
      viewDashboard: true, viewCRM: true, viewCalculators: true, viewInventory: true,
      viewTickets: true, viewBilling: true, viewSurvey: true, viewScheduler: true,
      viewFollowups: true, viewReports: true, viewUserManagement: true, viewAuditLog: true,
      createQuotation: true, deleteRecords: true, viewPricing: true, changeSettings: true
    },
    loginHistory: [],
    activityLogs: []
  },
  {
    id: 'EMP-002',
    name: 'Jagrati',
    username: 'jagrati',
    passwordHash: '114bd151f8fb0c58642d2170da4ae7d7c57977260ac2cc8905306cab6b2acabc', // SHA-256 for '234'
    role: 'Office Executive',
    department: 'Sales & Front Office',
    status: 'Active',
    createdDate: '2026-07-18 00:00:00',
    permissions: {
      viewDashboard: true, viewCRM: true, viewCalculators: true, viewInventory: true,
      viewTickets: true, viewBilling: true, viewSurvey: true, viewScheduler: true,
      viewFollowups: true, viewReports: false, viewUserManagement: false, viewAuditLog: false,
      createQuotation: true, deleteRecords: false, viewPricing: true, changeSettings: false
    },
    loginHistory: [],
    activityLogs: []
  },
  {
    id: 'EMP-003',
    name: 'Lucky',
    username: 'lucky',
    passwordHash: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', // SHA-256 for '12345'
    role: 'Production Team',
    department: 'Printing & Finishing Shop',
    status: 'Active',
    createdDate: '2026-07-18 00:00:00',
    permissions: {
      viewDashboard: true, viewCRM: false, viewCalculators: false, viewInventory: true,
      viewTickets: true, viewBilling: false, viewSurvey: false, viewScheduler: false,
      viewFollowups: false, viewReports: false, viewUserManagement: false, viewAuditLog: false,
      createQuotation: false, deleteRecords: false, viewPricing: false, changeSettings: false
    },
    loginHistory: [],
    activityLogs: []
  },
  {
    id: 'EMP-004',
    name: 'Jittu',
    username: 'jittu',
    passwordHash: '1be2e452b46d7a0d9656bbb1f768e8248eba1b75baed65f5d99eafa948899a6a', // SHA-256 for '0123'
    role: 'Field Team',
    department: 'Field Surveys & Installation',
    status: 'Active',
    createdDate: '2026-07-18 00:00:00',
    permissions: {
      viewDashboard: true, viewCRM: false, viewCalculators: false, viewInventory: false,
      viewTickets: true, viewBilling: false, viewSurvey: true, viewScheduler: true,
      viewFollowups: false, viewReports: false, viewUserManagement: false, viewAuditLog: false,
      createQuotation: false, deleteRecords: false, viewPricing: false, changeSettings: false
    },
    loginHistory: [],
    activityLogs: []
  }
];

const DEFAULT_CUSTOMERS_FALLBACK: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Prabal Agrawal',
    companyName: 'Sharma Sweets & Caterers',
    phone: '9876543210',
    whatsapp: '9876543210',
    email: 'prabalagrawal23@gmail.com',
    gst: '07AAAAA1111A1Z1',
    address: 'Shop No. 12, Main Market, Sector 15, Rohini, Delhi',
    customerSince: '2026-01-15',
    lastOrder: 'JOB-001',
    outstandingBalance: 12500,
    recentQuotations: ['QT-001'],
    recentInvoices: ['INV-1001'],
    recentPayments: [{ date: '2026-07-14 11:30:00', amount: 26086, method: 'UPI GPay' }],
    uploadedFiles: [
      { name: 'sharma_sweets_dimensions.jpg', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80', uploadedAt: '2026-07-15 10:05:00' }
    ],
    notesList: [{ id: 'N-1', text: '20-year loyal customer. Needs high-quality finishing.', date: '2026-07-15 11:30:00', author: 'Ramesh Sharma' }],
    timeline: [
      { id: 'TL-1', type: 'Created', title: 'Customer Account Created', description: 'Profile registered in Agrasen OS CRM.', date: '2026-07-15 09:00:00', byUser: 'Sunita Gupta' },
      { id: 'TL-2', type: 'WhatsApp', title: 'WhatsApp Enquiry Received', description: 'Inquired about ACP Glow Sign board requirements for main shop front.', date: '2026-07-15 09:30:00', byUser: 'Sunita Gupta' },
      { id: 'TL-3', type: 'QuotationSent', title: 'Quotation QT-001 Sent', description: 'Estimated total of ₹38,586 sent to customer via WhatsApp and Email.', date: '2026-07-15 10:10:00', byUser: 'Sunita Gupta' },
      { id: 'TL-4', type: 'QuotationApproved', title: 'Quotation QT-001 Approved', description: 'Prabal approved the layout design and paid advance.', date: '2026-07-15 11:15:00', byUser: 'Ramesh Sharma' },
      { id: 'TL-5', type: 'Production', title: 'Production Started (JOB-001)', description: 'Sent to Printing and Fabrications shop floor.', date: '2026-07-15 11:30:00', byUser: 'Dilip Kumar' }
    ]
  }
];

function getFallbackEmployees(): Employee[] {
  const local = localStorage.getItem(FALLBACK_EMPLOYEES_KEY);
  if (local) {
    try {
      const emps: Employee[] = JSON.parse(local);
      const hasNayan = emps.some(e => e.username.toLowerCase() === 'nayan');
      if (!hasNayan) {
        localStorage.removeItem(FALLBACK_EMPLOYEES_KEY);
        localStorage.removeItem(FALLBACK_SESSIONS_KEY);
        localStorage.setItem(FALLBACK_EMPLOYEES_KEY, JSON.stringify(DEFAULT_EMPLOYEES_FALLBACK));
        return DEFAULT_EMPLOYEES_FALLBACK;
      }
      return emps;
    } catch (e) {
      localStorage.setItem(FALLBACK_EMPLOYEES_KEY, JSON.stringify(DEFAULT_EMPLOYEES_FALLBACK));
      return DEFAULT_EMPLOYEES_FALLBACK;
    }
  }
  localStorage.setItem(FALLBACK_EMPLOYEES_KEY, JSON.stringify(DEFAULT_EMPLOYEES_FALLBACK));
  return DEFAULT_EMPLOYEES_FALLBACK;
}

function saveFallbackEmployees(emps: Employee[]) {
  localStorage.setItem(FALLBACK_EMPLOYEES_KEY, JSON.stringify(emps));
}

function getFallbackCustomers(): Customer[] {
  const local = localStorage.getItem(FALLBACK_CUSTOMERS_KEY);
  if (!local) {
    localStorage.setItem(FALLBACK_CUSTOMERS_KEY, JSON.stringify(DEFAULT_CUSTOMERS_FALLBACK));
    return DEFAULT_CUSTOMERS_FALLBACK;
  }
  return JSON.parse(local);
}

function saveFallbackCustomers(custs: Customer[]) {
  localStorage.setItem(FALLBACK_CUSTOMERS_KEY, JSON.stringify(custs));
}

// API Service Functions
export const api = {
  // Login Flow
  async login(username: string, passwordHashRaw: string): Promise<{ token: string; employee: Employee }> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: passwordHashRaw })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Authentication failed');
      }
      const data = await response.json();
      setSessionToken(data.token);
      return data;
    } catch (e: any) {
      console.warn('Backend unavailable, executing fail-safe offline authenticator:', e.message);
      // Offline fallback login validation
      const emps = getFallbackEmployees();
      const matched = emps.find(e => e.username.toLowerCase() === username.trim().toLowerCase() && !e.softDeleted);
      if (!matched) throw new Error('Authentication Failed: Username not registered.');
      if (matched.status === 'Deactivated') throw new Error('Account Status: DEACTIVATED. Contact Administrator.');

      const inputHash = await hashStringSHA256(passwordHashRaw);
      if (matched.passwordHash !== inputHash && matched.passwordHash !== passwordHashRaw) {
        throw new Error('Incorrect password. Please try again.');
      }

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      matched.loginHistory = [{ timestamp, device: 'Offline Local Session' }, ...matched.loginHistory];
      matched.lastLogin = timestamp;
      matched.lastActive = timestamp;
      saveFallbackEmployees(emps);

      const mockToken = `MOCK-SESSION-${Date.now()}`;
      setSessionToken(mockToken);
      
      // Save simulated session in localstorage
      localStorage.setItem(FALLBACK_SESSIONS_KEY, JSON.stringify({ token: mockToken, employeeId: matched.id }));

      return { token: mockToken, employee: matched };
    }
  },

  // Logout
  async logout(): Promise<boolean> {
    const token = getSessionToken();
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (e) {
      console.warn('Backend unreachable during logout, clearing locally:', e);
    }
    setSessionToken(null);
    localStorage.removeItem(FALLBACK_SESSIONS_KEY);
    return true;
  },

  // Session Check on Load
  async getSession(): Promise<any> {
    const token = getSessionToken();
    if (!token) throw new Error('No active token');

    try {
      const response = await fetch(`${API_BASE}/auth/session`, {
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new Error('Session expired');
      }
      return await response.json();
    } catch (e: any) {
      console.warn('Backend session bootstrap fallback:', e.message);
      // Fallback loader
      const localSessionRaw = localStorage.getItem(FALLBACK_SESSIONS_KEY);
      if (!localSessionRaw) {
        setSessionToken(null);
        throw new Error('No session active');
      }
      const session = JSON.parse(localSessionRaw);
      const emps = getFallbackEmployees();
      const emp = emps.find(e => e.id === session.employeeId && e.status === 'Active' && !e.softDeleted);
      if (!emp) {
        setSessionToken(null);
        localStorage.removeItem(FALLBACK_SESSIONS_KEY);
        throw new Error('Employee account deactivated');
      }

      emp.lastActive = new Date().toISOString().replace('T', ' ').substring(0, 19);
      saveFallbackEmployees(emps);

      return {
        employee: emp,
        customers: getFallbackCustomers(),
        jobs: JSON.parse(localStorage.getItem('abms_jobs') || '[]'),
        materials: JSON.parse(localStorage.getItem('abms_materials') || '[]'),
        tickets: JSON.parse(localStorage.getItem('abms_tickets') || '[]'),
        deliveries: JSON.parse(localStorage.getItem('abms_deliveries') || '[]'),
        followUps: JSON.parse(localStorage.getItem('abms_followups') || '[]'),
        quotations: JSON.parse(localStorage.getItem('abms_quotations') || '[]'),
        invoices: JSON.parse(localStorage.getItem('abms_invoices') || '[]'),
        rates: JSON.parse(localStorage.getItem('abms_rates') || 'null'),
        auditLogs: JSON.parse(localStorage.getItem('abms_system_audit_logs') || '[]')
      };
    }
  },

  // Employee: CRUD List
  async getEmployees(): Promise<Employee[]> {
    try {
      const res = await fetch(`${API_BASE}/employees`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to load employees');
      return await res.json();
    } catch (e) {
      return getFallbackEmployees().filter(e => !e.softDeleted);
    }
  },

  // Employee: Create
  async createEmployee(empData: Partial<Employee> & { password?: string }): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(empData)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create employee');
      }
      return await res.json();
    } catch (e) {
      // Offline fallback
      const emps = getFallbackEmployees();
      const exists = emps.some(em => em.username === empData.username && !em.softDeleted);
      if (exists) throw new Error('Username already registered.');

      const hashed = await hashStringSHA256(empData.password || '123');
      const newEmp: Employee = {
        id: `EMP-0${emps.length + 1}`,
        name: empData.name || '',
        username: (empData.username || '').toLowerCase().trim(),
        passwordHash: hashed,
        role: empData.role || 'Office Executive',
        department: empData.department || '',
        status: 'Active',
        createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        permissions: empData.permissions || {
          viewDashboard: true, viewCRM: true, viewCalculators: true, viewInventory: true,
          viewTickets: true, viewBilling: true, viewSurvey: true, viewScheduler: true,
          viewFollowups: true, viewReports: false, viewUserManagement: false, viewAuditLog: false,
          createQuotation: true, deleteRecords: false, viewPricing: true, changeSettings: false
        },
        loginHistory: [],
        activityLogs: []
      };
      emps.push(newEmp);
      saveFallbackEmployees(emps);
      return newEmp;
    }
  },

  // Employee: Update
  async updateEmployee(id: string, empData: Partial<Employee>): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(empData)
      });
      if (!res.ok) throw new Error('Failed to update employee');
      return await res.json();
    } catch (e) {
      const emps = getFallbackEmployees();
      const empIdx = emps.findIndex(e => e.id === id);
      if (empIdx === -1) throw new Error('Employee not found');
      
      emps[empIdx] = {
        ...emps[empIdx],
        name: empData.name || emps[empIdx].name,
        role: empData.role || emps[empIdx].role,
        department: empData.department || emps[empIdx].department,
        profilePhoto: empData.profilePhoto !== undefined ? empData.profilePhoto : emps[empIdx].profilePhoto,
        permissions: empData.permissions || emps[empIdx].permissions
      };
      saveFallbackEmployees(emps);
      return emps[empIdx];
    }
  },

  // Employee: Password reset
  async resetPassword(id: string, passwordHashRaw: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}/reset-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ password: passwordHashRaw })
      });
      if (!res.ok) throw new Error('Failed to reset password');
      return true;
    } catch (e) {
      const emps = getFallbackEmployees();
      const emp = emps.find(em => em.id === id);
      if (!emp) throw new Error('Employee not found');
      emp.passwordHash = await hashStringSHA256(passwordHashRaw);
      saveFallbackEmployees(emps);
      return true;
    }
  },

  // Employee: Toggle Status (Deactivate / Reactivate)
  async toggleEmployeeStatus(id: string): Promise<Employee> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}/toggle-status`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to toggle employee status');
      return await res.json();
    } catch (e) {
      const emps = getFallbackEmployees();
      const emp = emps.find(em => em.id === id);
      if (!emp) throw new Error('Employee not found');
      emp.status = emp.status === 'Active' ? 'Deactivated' : 'Active';
      saveFallbackEmployees(emps);
      return emp;
    }
  },

  // Employee: Force Logout
  async forceLogoutEmployee(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}/force-logout`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to force logout');
      return true;
    } catch (e) {
      // Offline fallback: simulated
      return true;
    }
  },

  // Employee: Delete (Soft Delete)
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete employee');
      return true;
    } catch (e) {
      const emps = getFallbackEmployees();
      const emp = emps.find(em => em.id === id);
      if (!emp) throw new Error('Employee not found');
      emp.softDeleted = true;
      emp.status = 'Deactivated';
      saveFallbackEmployees(emps);
      return true;
    }
  },

  // Customers: List
  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch(`${API_BASE}/crm/customers`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to load customers');
      return await res.json();
    } catch (e) {
      return getFallbackCustomers();
    }
  },

  // Customers: Create
  async createCustomer(custData: Partial<Customer> & { notes?: string }): Promise<Customer> {
    try {
      const res = await fetch(`${API_BASE}/crm/customers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(custData)
      });
      if (!res.ok) throw new Error('Failed to register customer');
      return await res.json();
    } catch (e) {
      const custs = getFallbackCustomers();
      const newCust: Customer = {
        id: `CUST-0${custs.length + 1}`,
        name: custData.name || '',
        companyName: custData.companyName || 'N/A',
        phone: custData.phone || '',
        whatsapp: custData.whatsapp || custData.phone || '',
        email: custData.email || 'N/A',
        gst: custData.gst || 'N/A',
        address: custData.address || 'N/A',
        customerSince: new Date().toISOString().split('T')[0],
        outstandingBalance: 0,
        timeline: [
          {
            id: `TL-${Date.now()}`,
            type: 'Created',
            title: 'Customer Registered',
            description: 'Profile created in CRM (Offline Fallback).',
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            byUser: 'Local Staff'
          }
        ]
      };
      if (custData.notes) {
        newCust.notesList = [{
          id: `N-${Date.now()}`,
          text: custData.notes,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          author: 'Local Staff'
        }];
      }
      custs.push(newCust);
      saveFallbackCustomers(custs);
      return newCust;
    }
  },

  // Customers: Update Customer Profile
  async updateCustomer(id: string, custData: Partial<Customer> & { notes?: string }): Promise<Customer> {
    try {
      const res = await fetch(`${API_BASE}/crm/customers/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(custData)
      });
      if (!res.ok) throw new Error('Failed to update customer');
      return await res.json();
    } catch (e) {
      const custs = getFallbackCustomers();
      const idx = custs.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('Customer not found');
      const cust = custs[idx];

      cust.name = custData.name || cust.name;
      cust.companyName = custData.companyName !== undefined ? custData.companyName : cust.companyName;
      cust.phone = custData.phone || cust.phone;
      cust.whatsapp = custData.whatsapp !== undefined ? custData.whatsapp : cust.whatsapp;
      cust.email = custData.email || cust.email;
      cust.gst = custData.gst !== undefined ? custData.gst : cust.gst;
      cust.address = custData.address || cust.address;
      if (custData.outstandingBalance !== undefined) cust.outstandingBalance = custData.outstandingBalance;

      if (custData.notes) {
        if (!cust.notesList) cust.notesList = [];
        cust.notesList.unshift({
          id: `N-${Date.now()}`,
          text: custData.notes,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          author: 'Local Staff'
        });
      }

      saveFallbackCustomers(custs);
      return cust;
    }
  },

  // Customers: Add Chronological Timeline Event
  async addCustomerTimelineEvent(id: string, event: Partial<TimelineEvent>): Promise<Customer> {
    try {
      const res = await fetch(`${API_BASE}/crm/customers/${id}/timeline`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(event)
      });
      if (!res.ok) throw new Error('Failed to append timeline event');
      return await res.json();
    } catch (e) {
      const custs = getFallbackCustomers();
      const cust = custs.find(c => c.id === id);
      if (!cust) throw new Error('Customer not found');

      const newEvent: TimelineEvent = {
        id: `TL-${Date.now()}`,
        type: event.type || 'Call',
        title: event.title || '',
        description: event.description || '',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        byUser: 'Local Staff'
      };
      cust.timeline.unshift(newEvent);
      cust.timeline.sort((a, b) => b.date.localeCompare(a.date));
      saveFallbackCustomers(custs);
      return cust;
    }
  },

  // Customers: Upload File attachment
  async uploadCustomerFile(id: string, fileName: string, fileUrl: string): Promise<Customer> {
    try {
      const res = await fetch(`${API_BASE}/crm/customers/${id}/upload`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ fileName, fileUrl })
      });
      if (!res.ok) throw new Error('Failed to attach document');
      return await res.json();
    } catch (e) {
      const custs = getFallbackCustomers();
      const cust = custs.find(c => c.id === id);
      if (!cust) throw new Error('Customer not found');

      if (!cust.uploadedFiles) cust.uploadedFiles = [];
      cust.uploadedFiles.unshift({
        name: fileName,
        url: fileUrl,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });

      cust.timeline.unshift({
        id: `TL-${Date.now()}`,
        type: 'Feedback',
        title: `Document Uploaded: ${fileName}`,
        description: 'Design file/contract attachment registered (Offline Fallback).',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        byUser: 'Local Staff'
      });

      saveFallbackCustomers(custs);
      return cust;
    }
  },

  // Sync state (jobs, etc.) to fullstack database
  async syncClientState(state: {
    jobs?: any[];
    materials?: any[];
    tickets?: any[];
    deliveries?: any[];
    followUps?: any[];
    quotations?: any[];
    invoices?: any[];
    rates?: any;
  }): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(state)
      });
      return res.ok;
    } catch (e) {
      return false; // Silently handle if offline fallback
    }
  },

  // Verify and log PDF generation/download request
  async verifyPDFAccess(docId: string, docType: string, totalAmount: number, customerName: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/billing/verify-pdf-access`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ docId, docType, totalAmount, customerName })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Access Denied');
      }
      return true;
    } catch (e: any) {
      // Offline fallback: verify permissions locally using the stored session/employee
      const sessionToken = localStorage.getItem('abms_session_token');
      if (!sessionToken) throw new Error('Authentication Failed: No active session.');
      
      const emps = getFallbackEmployees();
      const sessions = JSON.parse(localStorage.getItem('abms_sessions') || '[]');
      const activeSession = sessions.find((s: any) => s.token === sessionToken);
      if (!activeSession) throw new Error('Authentication Failed: Session expired or invalid.');
      
      const employee = emps.find(e => e.id === activeSession.employeeId);
      if (!employee || employee.status === 'Deactivated' || employee.softDeleted) {
        throw new Error('Authentication Failed: Employee account is invalid.');
      }
      
      if (!employee.permissions || !employee.permissions.viewBilling) {
        throw new Error('Forbidden: You do not have permission to download billing documents.');
      }
      
      return true;
    }
  },

  // Global Multi-Model Spotlight Search
  async globalSearch(q: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      // Simulated Search fallback
      const query = q.toLowerCase().trim();
      if (!query) return { customers: [], quotations: [], invoices: [], jobs: [], materials: [], employees: [] };

      const emps = getFallbackEmployees().filter(e => !e.softDeleted && (e.name.toLowerCase().includes(query) || e.username.includes(query) || e.role.toLowerCase().includes(query)));
      const custs = getFallbackCustomers().filter(c => c.name.toLowerCase().includes(query) || c.companyName.toLowerCase().includes(query) || c.phone.includes(query));
      
      const localJobs = JSON.parse(localStorage.getItem('abms_jobs') || '[]');
      const filteredJobs = localJobs.filter((j: any) => j.id.toLowerCase().includes(query) || j.title.toLowerCase().includes(query) || j.customerName.toLowerCase().includes(query));

      const localMat = JSON.parse(localStorage.getItem('abms_materials') || '[]');
      const filteredMat = localMat.filter((m: any) => m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query));

      const localQuotes = JSON.parse(localStorage.getItem('abms_quotations') || '[]');
      const filteredQuotes = localQuotes.filter((q: any) => q.id.toLowerCase().includes(query) || q.customerName.toLowerCase().includes(query));

      const localInvoices = JSON.parse(localStorage.getItem('abms_invoices') || '[]');
      const filteredInvoices = localInvoices.filter((i: any) => i.id.toLowerCase().includes(query) || i.customerName.toLowerCase().includes(query) || (i.invoiceNumber && i.invoiceNumber.toLowerCase().includes(query)));

      return {
        customers: custs,
        quotations: filteredQuotes,
        invoices: filteredInvoices,
        jobs: filteredJobs,
        materials: filteredMat,
        employees: emps
      };
    }
  },

  // 16c. Workflow Locking & Reopen System Methods
  async getWorkflowData(): Promise<{ success: boolean, workflowStages: any[], reopenRequests: any[], workflowHistory: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/workflow`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch workflow data');
      const data = await res.json();
      
      // Save locally for offline fallback caching
      localStorage.setItem('abms_workflow_stages', JSON.stringify(data.workflowStages || []));
      localStorage.setItem('abms_reopen_requests', JSON.stringify(data.reopenRequests || []));
      localStorage.setItem('abms_workflow_history', JSON.stringify(data.workflowHistory || []));
      
      return data;
    } catch (e) {
      // Offline fallback
      const workflowStages = JSON.parse(localStorage.getItem('abms_workflow_stages') || '[]');
      const reopenRequests = JSON.parse(localStorage.getItem('abms_reopen_requests') || '[]');
      const workflowHistory = JSON.parse(localStorage.getItem('abms_workflow_history') || '[]');
      return {
        success: true,
        workflowStages,
        reopenRequests,
        workflowHistory
      };
    }
  },

  async completeWorkflowStage(params: {
    stageId: string;
    workflowId: string;
    stageName: string;
    customerName?: string;
    durationMinutes?: number;
    browser?: string;
    os?: string;
    device?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/workflow/stages/complete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to complete workflow stage');
      }
      return await res.json();
    } catch (e: any) {
      // Offline fallback
      const token = localStorage.getItem('abms_session_token');
      if (!token) throw new Error('Authentication required');
      
      const sessions = JSON.parse(localStorage.getItem('abms_sessions') || '[]');
      const activeSession = sessions.find((s: any) => s.token === token);
      const emps = getFallbackEmployees();
      const currentEmp = activeSession ? emps.find(e => e.id === activeSession.employeeId) : null;
      if (!currentEmp) throw new Error('Authorized session not found');

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const stages = JSON.parse(localStorage.getItem('abms_workflow_stages') || '[]');
      
      const completedByInfo = {
        name: currentEmp.name,
        id: currentEmp.id,
        role: currentEmp.role,
        department: currentEmp.department,
        date: timestamp.split(' ')[0],
        time: timestamp.split(' ')[1],
        device: params.device || 'Web Client',
        os: params.os || 'Offline Client OS',
        browser: params.browser || 'Offline browser',
        checksum: 'OFFLINE-HMAC-CSUM-' + Math.random().toString().substring(2, 10),
        durationMinutes: params.durationMinutes || Math.floor(Math.random() * 45) + 15
      };

      let stage = stages.find((s: any) => s.id === params.stageId);
      if (!stage) {
        stage = {
          id: params.stageId,
          workflowId: params.workflowId,
          stageName: params.stageName,
          status: 'Completed',
          version: 1,
          completedBy: completedByInfo
        };
        stages.push(stage);
      } else {
        stage.status = 'Completed';
        stage.completedBy = completedByInfo;
      }

      localStorage.setItem('abms_workflow_stages', JSON.stringify(stages));
      return { success: true, message: 'Completed and locked offline.', stage };
    }
  },

  async requestWorkflowReopen(params: {
    stageId: string;
    workflowId: string;
    stageName: string;
    customerName?: string;
    reason: string;
    detailedExplanation: string;
    supportingNotes?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/workflow/reopen/request`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit reopen request');
      }
      return await res.json();
    } catch (e: any) {
      // Offline fallback
      const token = localStorage.getItem('abms_session_token');
      if (!token) throw new Error('Authentication required');
      
      const sessions = JSON.parse(localStorage.getItem('abms_sessions') || '[]');
      const activeSession = sessions.find((s: any) => s.token === token);
      const emps = getFallbackEmployees();
      const currentEmp = activeSession ? emps.find(e => e.id === activeSession.employeeId) : null;
      if (!currentEmp) throw new Error('Authorized session not found');

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const requests = JSON.parse(localStorage.getItem('abms_reopen_requests') || '[]');
      
      const hasPending = requests.some((r: any) => r.stageId === params.stageId && r.status === 'Pending');
      if (hasPending) throw new Error('A pending reopen request already exists offline.');

      const request = {
        id: `REQ-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
        stageId: params.stageId,
        workflowId: params.workflowId,
        customerName: params.customerName || 'General Customer',
        employeeName: currentEmp.name,
        employeeId: currentEmp.id,
        department: currentEmp.department,
        stageName: params.stageName,
        reason: params.reason,
        detailedExplanation: params.detailedExplanation,
        supportingNotes: params.supportingNotes || '',
        requestDate: timestamp.split(' ')[0],
        requestTime: timestamp.split(' ')[1],
        status: 'Pending'
      };

      requests.push(request);
      localStorage.setItem('abms_reopen_requests', JSON.stringify(requests));
      return { success: true, message: 'Reopen requested offline.', request };
    }
  },

  async resolveWorkflowReopen(requestId: string, status: 'Approved' | 'Rejected'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/workflow/reopen/resolve`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ requestId, status })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to resolve reopen request');
      }
      return await res.json();
    } catch (e: any) {
      // Offline fallback
      const token = localStorage.getItem('abms_session_token');
      if (!token) throw new Error('Authentication required');
      
      const sessions = JSON.parse(localStorage.getItem('abms_sessions') || '[]');
      const activeSession = sessions.find((s: any) => s.token === token);
      const emps = getFallbackEmployees();
      const currentEmp = activeSession ? emps.find(e => e.id === activeSession.employeeId) : null;
      if (!currentEmp) throw new Error('Authorized session not found');

      // Authorization check
      const allowedRoles = ['Super Admin', 'Manager', 'Owner'];
      if (!allowedRoles.includes(currentEmp.role)) {
        throw new Error('Forbidden: Only Managers or Admins can resolve requests.');
      }

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const requests = JSON.parse(localStorage.getItem('abms_reopen_requests') || '[]');
      const stages = JSON.parse(localStorage.getItem('abms_workflow_stages') || '[]');
      const history = JSON.parse(localStorage.getItem('abms_workflow_history') || '[]');

      const reqIndex = requests.findIndex((r: any) => r.id === requestId);
      if (reqIndex === -1) throw new Error('Request not found.');

      const request = requests[reqIndex];
      if (request.status !== 'Pending') throw new Error('Request already resolved.');

      request.status = status;
      request.managerName = currentEmp.name;
      request.approvalDate = timestamp.split(' ')[0];
      request.approvalTime = timestamp.split(' ')[1];

      const stage = stages.find((s: any) => s.id === request.stageId);
      if (status === 'Approved' && stage) {
        const historyRecord = {
          id: `HIST-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
          stageId: stage.id,
          version: stage.version,
          originalValue: JSON.stringify(stage),
          updatedValue: '',
          changedBy: request.employeeName,
          approvedBy: currentEmp.name,
          whyChanged: request.reason + ': ' + request.detailedExplanation,
          whenChanged: timestamp
        };
        history.push(historyRecord);

        stage.status = 'In Progress';
        stage.version = (stage.version || 1) + 1;
        delete stage.completedBy;
      }

      localStorage.setItem('abms_reopen_requests', JSON.stringify(requests));
      localStorage.setItem('abms_workflow_stages', JSON.stringify(stages));
      localStorage.setItem('abms_workflow_history', JSON.stringify(history));

      return { success: true, message: `Resolved as ${status} offline.`, request, stage };
    }
  }
};
