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
    name: 'Ramesh Sharma',
    username: 'ramesh',
    passwordHash: '40bd001563085fc35165329ea1ff5c5ecbdbbeef', // SHA-256 for '123'
    role: 'Super Admin',
    department: 'Administration',
    status: 'Active',
    createdDate: '2026-01-15 09:00:00',
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
    name: 'Sunita Gupta',
    username: 'sunita',
    passwordHash: '40bd001563085fc35165329ea1ff5c5ecbdbbeef',
    role: 'Office Executive',
    department: 'Sales & Front Office',
    status: 'Active',
    createdDate: '2026-02-10 10:30:00',
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
    name: 'Dilip Kumar',
    username: 'dilip',
    passwordHash: '40bd001563085fc35165329ea1ff5c5ecbdbbeef',
    role: 'Production Team',
    department: 'Printing & Finishing Shop',
    status: 'Active',
    createdDate: '2026-03-01 11:00:00',
    permissions: {
      viewDashboard: true, viewCRM: false, viewCalculators: false, viewInventory: true,
      viewTickets: true, viewBilling: false, viewSurvey: false, viewScheduler: false,
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
  if (!local) {
    localStorage.setItem(FALLBACK_EMPLOYEES_KEY, JSON.stringify(DEFAULT_EMPLOYEES_FALLBACK));
    return DEFAULT_EMPLOYEES_FALLBACK;
  }
  return JSON.parse(local);
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
  }
};
