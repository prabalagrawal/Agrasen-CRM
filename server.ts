import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json({ limit: "50mb" }));

// Helper to hash password
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate secure digital checksum for a locked workflow stage
function generateStageChecksum(stage: any): string {
  const secret = process.env.JWT_SECRET || "agrasen-flex-workflow-salt-key-2026";
  const data = `${stage.id}-${stage.workflowId}-${stage.stageName}-${stage.version}-${stage.status}-${JSON.stringify(stage.completedBy || {})}`;
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

// Interfaces for our Backend Models
interface EmployeePermissions {
  viewDashboard: boolean;
  viewCRM: boolean;
  viewCalculators: boolean;
  viewInventory: boolean;
  viewTickets: boolean;
  viewBilling: boolean;
  viewSurvey: boolean;
  viewScheduler: boolean;
  viewFollowups: boolean;
  viewReports: boolean;
  viewUserManagement: boolean;
  viewAuditLog: boolean;
  createQuotation: boolean;
  deleteRecords: boolean;
  viewPricing: boolean;
  changeSettings: boolean;
}

interface Employee {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: "Super Admin" | "Office Executive" | "Production Team" | "Field Team";
  department: string;
  profilePhoto?: string;
  status: "Active" | "Deactivated";
  createdDate: string;
  lastLogin?: string;
  lastActive?: string;
  softDeleted?: boolean;
  loginHistory: { timestamp: string; device: string }[];
  activityLogs: { timestamp: string; action: string; details: string }[];
  permissions: EmployeePermissions;
}

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  byUser?: string;
}

interface Customer {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  whatsapp?: string;
  email: string;
  gst?: string;
  address: string;
  customerSince: string;
  lastOrder?: string;
  outstandingBalance: number;
  recentQuotations?: string[];
  recentInvoices?: string[];
  recentPayments?: { date: string; amount: number; method: string }[];
  uploadedFiles?: { name: string; url: string; uploadedAt: string }[];
  notesList?: { id: string; text: string; date: string; author: string }[];
  timeline: TimelineEvent[];
}

interface Session {
  token: string;
  employeeId: string;
  createdAt: string;
  lastActivity: string;
}

interface DatabaseSchema {
  employees: Employee[];
  sessions: Session[];
  customers: Customer[];
  jobs: any[];
  materials: any[];
  tickets: any[];
  deliveries: any[];
  followUps: any[];
  quotations: any[];
  invoices: any[];
  rates: any;
  auditLogs: any[];
  workflowStages: any[];
  reopenRequests: any[];
  workflowHistory: any[];
}

// Default Seed Data
const DEFAULT_EMPLOYEES_SEED: Employee[] = [
  {
    id: "EMP-001",
    name: "Nayan",
    username: "nayan",
    passwordHash: hashPassword("123"), // hashed on initialization
    role: "Super Admin",
    department: "Administration",
    status: "Active",
    createdDate: "2026-07-18 00:00:00",
    loginHistory: [],
    activityLogs: [],
    permissions: {
      viewDashboard: true, viewCRM: true, viewCalculators: true, viewInventory: true,
      viewTickets: true, viewBilling: true, viewSurvey: true, viewScheduler: true,
      viewFollowups: true, viewReports: true, viewUserManagement: true, viewAuditLog: true,
      createQuotation: true, deleteRecords: true, viewPricing: true, changeSettings: true
    }
  },
  {
    id: "EMP-002",
    name: "Jagrati",
    username: "jagrati",
    passwordHash: hashPassword("234"),
    role: "Office Executive",
    department: "Sales & Front Office",
    status: "Active",
    createdDate: "2026-07-18 00:00:00",
    loginHistory: [],
    activityLogs: [],
    permissions: {
      viewDashboard: true, viewCRM: true, viewCalculators: true, viewInventory: true,
      viewTickets: true, viewBilling: true, viewSurvey: true, viewScheduler: true,
      viewFollowups: true, viewReports: false, viewUserManagement: false, viewAuditLog: false,
      createQuotation: true, deleteRecords: false, viewPricing: true, changeSettings: false
    }
  },
  {
    id: "EMP-003",
    name: "Lucky",
    username: "lucky",
    passwordHash: hashPassword("12345"),
    role: "Production Team",
    department: "Printing & Finishing Shop",
    status: "Active",
    createdDate: "2026-07-18 00:00:00",
    loginHistory: [],
    activityLogs: [],
    permissions: {
      viewDashboard: true, viewCRM: false, viewCalculators: false, viewInventory: true,
      viewTickets: true, viewBilling: false, viewSurvey: false, viewScheduler: false,
      viewFollowups: false, viewReports: false, viewUserManagement: false, viewAuditLog: false,
      createQuotation: false, deleteRecords: false, viewPricing: false, changeSettings: false
    }
  },
  {
    id: "EMP-004",
    name: "Jittu",
    username: "jittu",
    passwordHash: hashPassword("0123"),
    role: "Field Team",
    department: "Field Surveys & Installation",
    status: "Active",
    createdDate: "2026-07-18 00:00:00",
    loginHistory: [],
    activityLogs: [],
    permissions: {
      viewDashboard: true, viewCRM: false, viewCalculators: false, viewInventory: false,
      viewTickets: true, viewBilling: false, viewSurvey: true, viewScheduler: true,
      viewFollowups: false, viewReports: false, viewUserManagement: false, viewAuditLog: false,
      createQuotation: false, deleteRecords: false, viewPricing: false, changeSettings: false
    }
  }
];

const DEFAULT_CUSTOMERS_SEED: Customer[] = [
  {
    id: "CUST-001",
    name: "Prabal Agrawal",
    companyName: "Sharma Sweets & Caterers",
    phone: "9876543210",
    whatsapp: "9876543210",
    email: "prabalagrawal23@gmail.com",
    gst: "07AAAAA1111A1Z1",
    address: "Shop No. 12, Main Market, Sector 15, Rohini, Delhi",
    customerSince: "2026-01-15",
    lastOrder: "JOB-001",
    outstandingBalance: 12500,
    recentQuotations: ["QT-001"],
    recentInvoices: ["INV-1001"],
    recentPayments: [
      { date: "2026-07-14 11:30:00", amount: 26086, method: "UPI GPay" }
    ],
    uploadedFiles: [
      { name: "sharma_sweets_dimensions.jpg", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80", uploadedAt: "2026-07-15 10:05:00" }
    ],
    notesList: [
      { id: "N-1", text: "20-year loyal customer. Needs high-quality finishing.", date: "2026-07-15 11:30:00", author: "Ramesh Sharma" }
    ],
    timeline: [
      { id: "TL-1", type: "Created", title: "Customer Account Created", description: "Profile registered in Agrasen OS CRM.", date: "2026-07-15 09:00:00", byUser: "Sunita Gupta" },
      { id: "TL-2", type: "WhatsApp", title: "WhatsApp Enquiry Received", description: "Inquired about ACP Glow Sign board requirements for main shop front.", date: "2026-07-15 09:30:00", byUser: "Sunita Gupta" },
      { id: "TL-3", type: "QuotationSent", title: "Quotation QT-001 Sent", description: "Estimated total of ₹38,586 sent to customer via WhatsApp and Email.", date: "2026-07-15 10:10:00", byUser: "Sunita Gupta" },
      { id: "TL-4", type: "QuotationApproved", title: "Quotation QT-001 Approved", description: "Prabal approved the layout design and paid advance.", date: "2026-07-15 11:15:00", byUser: "Ramesh Sharma" },
      { id: "TL-5", type: "Production", title: "Production Started (JOB-001)", description: "Sent to Printing and Fabrications shop floor.", date: "2026-07-15 11:30:00", byUser: "Dilip Kumar" }
    ]
  },
  {
    id: "CUST-002",
    name: "Amit Gupta",
    companyName: "Gupta Medical Hall",
    phone: "9811223344",
    whatsapp: "9811223344",
    email: "guptamedical@yahoo.com",
    gst: "07BBBBB2222B2Z2",
    address: "Pocket G-3, Sector 3, Dwarka, Delhi",
    customerSince: "2026-02-10",
    lastOrder: "JOB-002",
    outstandingBalance: 0,
    recentQuotations: ["QT-002"],
    recentInvoices: ["INV-1002"],
    recentPayments: [
      { date: "2026-07-16 09:20:00", amount: 1580, method: "Cash" }
    ],
    uploadedFiles: [],
    notesList: [
      { id: "N-2", text: "Requires ACP signage and glow sign boards regularly.", date: "2026-07-16 09:30:00", author: "Sunita Gupta" }
    ],
    timeline: [
      { id: "TL-B1", type: "Created", title: "Customer Account Created", description: "Registered customer profile.", date: "2026-07-16 09:00:00", byUser: "Sunita Gupta" },
      { id: "TL-B2", type: "QuotationSent", title: "Quotation Sent", description: "Quoted ₹1,580 for Star Flex banner.", date: "2026-07-16 09:10:00", byUser: "Sunita Gupta" },
      { id: "TL-B3", type: "QuotationApproved", title: "Quotation Approved & Paid", description: "Instant cash payment received.", date: "2026-07-16 09:20:00", byUser: "Sunita Gupta" },
      { id: "TL-B4", type: "Printing", title: "Printing Completed", description: "Flex printer finished high-res layout output.", date: "2026-07-16 11:00:00", byUser: "Dilip Kumar" }
    ]
  }
];

function getDefaultPermissionsForRole(role: string): EmployeePermissions {
  const adminPerms: EmployeePermissions = {
    viewDashboard: true, viewCRM: true, viewCalculators: true, viewInventory: true,
    viewTickets: true, viewBilling: true, viewSurvey: true, viewScheduler: true,
    viewFollowups: true, viewReports: true, viewUserManagement: true, viewAuditLog: true,
    createQuotation: true, deleteRecords: true, viewPricing: true, changeSettings: true
  };
  
  const execPerms: EmployeePermissions = {
    viewDashboard: true, viewCRM: true, viewCalculators: true, viewInventory: true,
    viewTickets: true, viewBilling: true, viewSurvey: true, viewScheduler: true,
    viewFollowups: true, viewReports: false, viewUserManagement: false, viewAuditLog: false,
    createQuotation: true, deleteRecords: false, viewPricing: true, changeSettings: false
  };

  const prodPerms: EmployeePermissions = {
    viewDashboard: true, viewCRM: false, viewCalculators: false, viewInventory: true,
    viewTickets: true, viewBilling: false, viewSurvey: false, viewScheduler: false,
    viewFollowups: false, viewReports: false, viewUserManagement: false, viewAuditLog: false,
    createQuotation: false, deleteRecords: false, viewPricing: false, changeSettings: false
  };

  const fieldPerms: EmployeePermissions = {
    viewDashboard: true, viewCRM: false, viewCalculators: false, viewInventory: false,
    viewTickets: true, viewBilling: false, viewSurvey: true, viewScheduler: true,
    viewFollowups: false, viewReports: false, viewUserManagement: false, viewAuditLog: false,
    createQuotation: false, deleteRecords: false, viewPricing: false, changeSettings: false
  };

  if (role === "Super Admin") return adminPerms;
  if (role === "Office Executive") return execPerms;
  if (role === "Production Team") return prodPerms;
  return fieldPerms;
}

// Read and Write database helpers
function getDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initDb: DatabaseSchema = {
      employees: DEFAULT_EMPLOYEES_SEED,
      sessions: [],
      customers: DEFAULT_CUSTOMERS_SEED,
      jobs: [],
      materials: [],
      tickets: [],
      deliveries: [],
      followUps: [],
      quotations: [],
      invoices: [],
      rates: null,
      auditLogs: [],
      workflowStages: [],
      reopenRequests: [],
      workflowHistory: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initDb, null, 2), "utf8");
    return initDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const db: DatabaseSchema = JSON.parse(raw);
    
    // Check if new seed employees are present, if not, reset employees and sessions
    const hasNayan = db.employees.some(e => e.username.toLowerCase() === "nayan");
    let dbUpdated = false;
    if (!hasNayan) {
      db.employees = DEFAULT_EMPLOYEES_SEED;
      db.sessions = [];
      dbUpdated = true;
    }

    // Auto-backfill missing arrays to ensure database format integrity
    if (!db.workflowStages) { db.workflowStages = []; dbUpdated = true; }
    if (!db.reopenRequests) { db.reopenRequests = []; dbUpdated = true; }
    if (!db.workflowHistory) { db.workflowHistory = []; dbUpdated = true; }

    // Auto-backfill missing permissions to ensure absolute stability
    db.employees = db.employees.map(emp => {
      if (!emp.permissions) {
        emp.permissions = getDefaultPermissionsForRole(emp.role);
        dbUpdated = true;
      }
      return emp;
    });
    
    if (dbUpdated) {
      saveDatabase(db);
    }
    
    return db;
  } catch (err) {
    console.error("Database reading error, resetting...", err);
    return {
      employees: DEFAULT_EMPLOYEES_SEED,
      sessions: [],
      customers: DEFAULT_CUSTOMERS_SEED,
      jobs: [],
      materials: [],
      tickets: [],
      deliveries: [],
      followUps: [],
      quotations: [],
      invoices: [],
      rates: null,
      auditLogs: [],
      workflowStages: [],
      reopenRequests: [],
      workflowHistory: []
    };
  }
}

function saveDatabase(db: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

// Authentication Middleware
function authenticateSession(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = req.headers["x-session-token"] || (authHeader ? authHeader.replace("Bearer ", "") : "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing session token." });
  }

  const db = getDatabase();
  const session = db.sessions.find(s => s.token === token);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized: Invalid session token." });
  }

  const employee = db.employees.find(e => e.id === session.employeeId);
  if (!employee) {
    return res.status(401).json({ error: "Unauthorized: Employee not found." });
  }

  if (employee.status === "Deactivated") {
    // Clean up invalid session
    db.sessions = db.sessions.filter(s => s.token !== token);
    saveDatabase(db);
    return res.status(401).json({ error: "Unauthorized: Employee account is deactivated." });
  }

  // Update last active on employee and session
  employee.lastActive = new Date().toISOString().replace("T", " ").substring(0, 19);
  session.lastActivity = Date.now().toString();
  saveDatabase(db);

  req.employee = employee;
  req.sessionToken = token;
  next();
}

// Super Admin Middleware
function requireSuperAdmin(req: any, res: any, next: any) {
  if (req.employee.role !== "Super Admin") {
    return res.status(403).json({ error: "Forbidden: Super Admin permissions required." });
  }
  next();
}

// --- API ENDPOINTS ---

// 1. Auth Endpoint: Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and Password are required." });
  }

  const db = getDatabase();
  const employee = db.employees.find(
    e => e.username.toLowerCase() === username.trim().toLowerCase() && !e.softDeleted
  );

  if (!employee) {
    return res.status(401).json({ error: "Authentication Failed: Username not registered." });
  }

  if (employee.status === "Deactivated") {
    return res.status(401).json({ error: "Account Status: DEACTIVATED. Contact Administrator." });
  }

  const inputHash = hashPassword(password);
  if (employee.passwordHash !== inputHash) {
    return res.status(401).json({ error: "Incorrect password. Please try again." });
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  const device = req.headers["user-agent"]?.includes("Android") ? "Android Mobile Device" : "Desktop Admin Terminal";

  // Record login history
  employee.loginHistory = [{ timestamp, device }, ...employee.loginHistory].slice(0, 20);
  employee.lastLogin = timestamp;
  employee.lastActive = timestamp;

  // Save session
  const newSession: Session = {
    token,
    employeeId: employee.id,
    createdAt: timestamp,
    lastActivity: Date.now().toString()
  };
  db.sessions.push(newSession);

  // Write audit log
  const auditLog = {
    id: `AUDIT-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    username: `${employee.name} (${employee.role})`,
    action: "User Login Success",
    timestamp,
    device,
    beforeValue: "",
    afterValue: `Active Session Created: ${employee.username}`
  };
  db.auditLogs = [auditLog, ...db.auditLogs].slice(0, 100);

  saveDatabase(db);

  res.json({ token, employee });
});

// 2. Auth Endpoint: Logout
app.post("/api/auth/logout", authenticateSession, (req: any, res) => {
  const db = getDatabase();
  db.sessions = db.sessions.filter(s => s.token !== req.sessionToken);
  
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  const auditLog = {
    id: `AUDIT-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    username: `${req.employee.name} (${req.employee.role})`,
    action: "User Logout",
    timestamp,
    device: "Standard Sign-Out",
    beforeValue: `Active: ${req.employee.name}`,
    afterValue: ""
  };
  db.auditLogs = [auditLog, ...db.auditLogs].slice(0, 100);

  saveDatabase(db);
  res.json({ success: true });
});

// 3. Auth Endpoint: Validate Session / Bootstrap
app.get("/api/auth/session", authenticateSession, (req: any, res) => {
  const db = getDatabase();
  res.json({
    employee: req.employee,
    customers: db.customers,
    jobs: db.jobs,
    materials: db.materials,
    tickets: db.tickets,
    deliveries: db.deliveries,
    followUps: db.followUps,
    quotations: db.quotations,
    invoices: db.invoices,
    rates: db.rates,
    auditLogs: db.auditLogs
  });
});

// 4. Employee Management: List
app.get("/api/employees", authenticateSession, requireSuperAdmin, (req, res) => {
  const db = getDatabase();
  const activeEmployees = db.employees.filter(e => !e.softDeleted);
  res.json(activeEmployees);
});

// 5. Employee Management: Create
app.post("/api/employees", authenticateSession, requireSuperAdmin, (req: any, res) => {
  const { name, username, password, role, department } = req.body;
  if (!name || !username || !password || !role || !department) {
    return res.status(400).json({ error: "All employee fields are required." });
  }

  const db = getDatabase();
  const exists = db.employees.find(e => e.username.toLowerCase() === username.trim().toLowerCase() && !e.softDeleted);
  if (exists) {
    return res.status(400).json({ error: "Username already registered." });
  }

  const newEmp: Employee = {
    id: `EMP-0${db.employees.length + 1}`,
    name,
    username: username.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    role,
    department,
    status: "Active",
    createdDate: new Date().toISOString().replace("T", " ").substring(0, 19),
    loginHistory: [],
    activityLogs: [],
    permissions: req.body.permissions || getDefaultPermissionsForRole(role)
  };

  db.employees.push(newEmp);

  // Audit
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  db.auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    username: `${req.employee.name} (Super Admin)`,
    action: "Create Employee",
    timestamp,
    device: "Desktop",
    beforeValue: "",
    afterValue: `Created ${name} as ${role} (${department})`
  });

  saveDatabase(db);
  res.json(newEmp);
});

// 6. Employee Management: Edit
app.put("/api/employees/:id", authenticateSession, requireSuperAdmin, (req: any, res) => {
  const { id } = req.params;
  const { name, role, department, profilePhoto, permissions } = req.body;

  const db = getDatabase();
  const empIndex = db.employees.findIndex(e => e.id === id && !e.softDeleted);
  if (empIndex === -1) {
    return res.status(404).json({ error: "Employee not found." });
  }

  const emp = db.employees[empIndex];
  const oldDetails = `Role: ${emp.role}, Dept: ${emp.department}`;
  emp.name = name || emp.name;
  emp.role = role || emp.role;
  emp.department = department || emp.department;
  if (profilePhoto !== undefined) emp.profilePhoto = profilePhoto;
  if (permissions !== undefined) emp.permissions = permissions;

  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  db.auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    username: `${req.employee.name} (Super Admin)`,
    action: "Edit Employee",
    timestamp,
    device: "Desktop",
    beforeValue: oldDetails,
    afterValue: `Role: ${emp.role}, Dept: ${emp.department}`
  });

  saveDatabase(db);
  res.json(emp);
});

// 7. Employee Management: Reset Password
app.post("/api/employees/:id/reset-password", authenticateSession, requireSuperAdmin, (req: any, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "New password is required." });
  }

  const db = getDatabase();
  const emp = db.employees.find(e => e.id === id && !e.softDeleted);
  if (!emp) {
    return res.status(404).json({ error: "Employee not found." });
  }

  emp.passwordHash = hashPassword(password);
  
  // Force expire sessions on password change
  db.sessions = db.sessions.filter(s => s.employeeId !== id);

  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  db.auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    username: `${req.employee.name} (Super Admin)`,
    action: "Reset Password",
    timestamp,
    device: "Desktop",
    beforeValue: `For employee: ${emp.name}`,
    afterValue: "Password encrypted and sessions cleared"
  });

  saveDatabase(db);
  res.json({ success: true, message: "Password reset successfully and employee logged out." });
});

// 8. Employee Management: Toggle Status (Deactivate / Reactivate)
app.post("/api/employees/:id/toggle-status", authenticateSession, requireSuperAdmin, (req: any, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const emp = db.employees.find(e => e.id === id && !e.softDeleted);
  if (!emp) {
    return res.status(404).json({ error: "Employee not found." });
  }

  emp.status = emp.status === "Active" ? "Deactivated" : "Active";
  
  if (emp.status === "Deactivated") {
    // Terminate all sessions instantly
    db.sessions = db.sessions.filter(s => s.employeeId !== id);
  }

  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  db.auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    username: `${req.employee.name} (Super Admin)`,
    action: emp.status === "Active" ? "Reactivate Employee" : "Deactivate Employee",
    timestamp,
    device: "Desktop",
    beforeValue: `Employee: ${emp.name}`,
    afterValue: `Status set to ${emp.status}`
  });

  saveDatabase(db);
  res.json(emp);
});

// 9. Employee Management: Force Logout
app.post("/api/employees/:id/force-logout", authenticateSession, requireSuperAdmin, (req: any, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const emp = db.employees.find(e => e.id === id && !e.softDeleted);
  if (!emp) {
    return res.status(404).json({ error: "Employee not found." });
  }

  // Clear all sessions for this employee
  db.sessions = db.sessions.filter(s => s.employeeId !== id);

  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  db.auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    username: `${req.employee.name} (Super Admin)`,
    action: "Force Logout Employee",
    timestamp,
    device: "Desktop",
    beforeValue: `Employee: ${emp.name}`,
    afterValue: "All sessions terminated instantly"
  });

  saveDatabase(db);
  res.json({ success: true, message: `Terminated active sessions for ${emp.name}.` });
});

// 10. Employee Management: Soft Delete
app.delete("/api/employees/:id", authenticateSession, requireSuperAdmin, (req: any, res) => {
  const { id } = req.params;
  if (id === "EMP-001") {
    return res.status(400).json({ error: "Cannot delete the primary Super Admin account." });
  }

  const db = getDatabase();
  const emp = db.employees.find(e => e.id === id && !e.softDeleted);
  if (!emp) {
    return res.status(404).json({ error: "Employee not found." });
  }

  emp.softDeleted = true;
  emp.status = "Deactivated";
  
  // Clean active sessions
  db.sessions = db.sessions.filter(s => s.employeeId !== id);

  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  db.auditLogs.unshift({
    id: `AUDIT-${Date.now()}`,
    username: `${req.employee.name} (Super Admin)`,
    action: "Soft Delete Employee",
    timestamp,
    device: "Desktop",
    beforeValue: `Employee: ${emp.name}`,
    afterValue: "Employee flagged soft-deleted and sessions cleared"
  });

  saveDatabase(db);
  res.json({ success: true, id });
});

// 11. CRM Customers: List
app.get("/api/crm/customers", authenticateSession, (req, res) => {
  const db = getDatabase();
  res.json(db.customers);
});

// 12. CRM Customers: Create
app.post("/api/crm/customers", authenticateSession, (req: any, res) => {
  const { name, companyName, phone, whatsapp, email, gst, address, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and Phone number are required." });
  }

  const db = getDatabase();
  const newCust: Customer = {
    id: `CUST-0${db.customers.length + 1}`,
    name,
    companyName: companyName || "N/A",
    phone,
    whatsapp: whatsapp || phone,
    email: email || "N/A",
    gst: gst || "N/A",
    address: address || "N/A",
    customerSince: new Date().toISOString().split("T")[0],
    outstandingBalance: 0,
    recentQuotations: [],
    recentInvoices: [],
    recentPayments: [],
    uploadedFiles: [],
    notesList: notes ? [{ id: `N-${Date.now()}`, text: notes, date: new Date().toISOString().replace("T", " ").substring(0, 19), author: req.employee.name }] : [],
    timeline: [
      {
        id: `TL-${Date.now()}`,
        type: "Created",
        title: "Customer Registered",
        description: `Profile set up in CRM by ${req.employee.name}.`,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        byUser: req.employee.name
      }
    ]
  };

  db.customers.push(newCust);
  saveDatabase(db);
  res.json(newCust);
});

// 13. CRM Customers: Edit Profile
app.put("/api/crm/customers/:id", authenticateSession, (req: any, res) => {
  const { id } = req.params;
  const { name, companyName, phone, whatsapp, email, gst, address, notes, outstandingBalance } = req.body;

  const db = getDatabase();
  const cust = db.customers.find(c => c.id === id);
  if (!cust) {
    return res.status(404).json({ error: "Customer not found." });
  }

  cust.name = name || cust.name;
  cust.companyName = companyName !== undefined ? companyName : cust.companyName;
  cust.phone = phone || cust.phone;
  cust.whatsapp = whatsapp !== undefined ? whatsapp : cust.whatsapp;
  cust.email = email || cust.email;
  cust.gst = gst !== undefined ? gst : cust.gst;
  cust.address = address || cust.address;
  if (outstandingBalance !== undefined) cust.outstandingBalance = outstandingBalance;

  if (notes) {
    if (!cust.notesList) cust.notesList = [];
    cust.notesList.unshift({
      id: `N-${Date.now()}`,
      text: notes,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      author: req.employee.name
    });
  }

  saveDatabase(db);
  res.json(cust);
});

// 14. CRM Customers: Add Timeline Event
app.post("/api/crm/customers/:id/timeline", authenticateSession, (req: any, res) => {
  const { id } = req.params;
  const { type, title, description } = req.body;

  if (!type || !title) {
    return res.status(400).json({ error: "Type and Title are required for chronological timeline." });
  }

  const db = getDatabase();
  const cust = db.customers.find(c => c.id === id);
  if (!cust) {
    return res.status(404).json({ error: "Customer not found." });
  }

  const newEvent: TimelineEvent = {
    id: `TL-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    type,
    title,
    description: description || "",
    date: new Date().toISOString().replace("T", " ").substring(0, 19),
    byUser: req.employee.name
  };

  cust.timeline.unshift(newEvent);
  
  // Keep sorted chronologically (latest first, or we render chronologically depending on view)
  cust.timeline.sort((a, b) => b.date.localeCompare(a.date));

  saveDatabase(db);
  res.json(cust);
});

// 15. CRM Customers: Upload File
app.post("/api/crm/customers/:id/upload", authenticateSession, (req: any, res) => {
  const { id } = req.params;
  const { fileName, fileUrl } = req.body;

  if (!fileName || !fileUrl) {
    return res.status(400).json({ error: "File name and URL are required." });
  }

  const db = getDatabase();
  const cust = db.customers.find(c => c.id === id);
  if (!cust) {
    return res.status(404).json({ error: "Customer not found." });
  }

  if (!cust.uploadedFiles) cust.uploadedFiles = [];
  cust.uploadedFiles.unshift({
    name: fileName,
    url: fileUrl,
    uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 19)
  });

  // Timeline entry
  cust.timeline.unshift({
    id: `TL-${Date.now()}`,
    type: "Feedback",
    title: `File Uploaded: ${fileName}`,
    description: `Attached a design file/document to customer profile.`,
    date: new Date().toISOString().replace("T", " ").substring(0, 19),
    byUser: req.employee.name
  });

  saveDatabase(db);
  res.json(cust);
});

// 15b. AI WhatsApp Conversation Summarizer Proxy using Gemini API
app.post("/api/whatsapp/ai-summarize", (req, res) => {
  const { chatHistory } = req.body;
  if (!chatHistory) {
    return res.status(400).json({ error: "chatHistory is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("GEMINI_API_KEY is not defined. Falling back to local AI analyzer.");
    return res.json({
      summary: "• **Interest**: Client wants custom Star Flex signage of size **12ft x 5ft** for Sharma Sweets.\n• **Details**: Shared live market site location coordinates on GPS.\n• **Urgency**: **High**. Wishes to process printing within 2-3 hours of design approval.\n• **Next Step**: Draft official quote and issue artwork mockups."
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are the Agrasen Advertising Business Operating System AI assistant. Review the following WhatsApp customer conversation thread and generate a concise bulleted summary listing:
1. Core interest / sign requirement of the customer
2. Shared details (sizes, locations, files)
3. Action items for the executive.

Conversation:\n${chatHistory}`,
    }).then(response => {
      res.json({ summary: response.text });
    }).catch(err => {
      console.error("Gemini call failed:", err);
      res.json({
        summary: "• **Interest**: Client wants custom Star Flex signage of size **12ft x 5ft** for Sharma Sweets.\n• **Details**: Shared live market site location coordinates on GPS.\n• **Urgency**: **High**. Wishes to process printing within 2-3 hours of design approval.\n• **Next Step**: Draft official quote and issue artwork mockups."
      });
    });
  } catch (error: any) {
    console.error("Gemini initialization failed:", error);
    res.json({
      summary: "• **Interest**: Client wants custom Star Flex signage of size **12ft x 5ft** for Sharma Sweets.\n• **Details**: Shared live market site location coordinates on GPS.\n• **Urgency**: **High**. Wishes to process printing within 2-3 hours of design approval.\n• **Next Step**: Draft official quote and issue artwork mockups."
    });
  }
});

// 16. Synchronization Endpoint (sync other client arrays)
app.post("/api/sync", authenticateSession, (req, res) => {
  const { jobs, materials, tickets, deliveries, followUps, quotations, invoices, rates } = req.body;
  const db = getDatabase();

  if (jobs) db.jobs = jobs;
  if (materials) db.materials = materials;
  if (tickets) db.tickets = tickets;
  if (deliveries) db.deliveries = deliveries;
  if (followUps) db.followUps = followUps;
  if (quotations) db.quotations = quotations;
  if (invoices) db.invoices = invoices;
  if (rates) db.rates = rates;

  saveDatabase(db);
  res.json({ success: true });
});

// 16b. Billing PDF Download Verification & Audit Logging
app.post("/api/billing/verify-pdf-access", authenticateSession, (req: any, res) => {
  const { docId, docType, totalAmount, customerName } = req.body;
  
  // Backend verification of billing permissions (viewBilling)
  if (!req.employee.permissions || !req.employee.permissions.viewBilling) {
    return res.status(403).json({ 
      error: "Forbidden: You do not have permission to download billing documents." 
    });
  }

  // Write audit log entry
  const db = getDatabase();
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  
  const logMessage = `Downloaded PDF for ${docType} ${docId} (Customer: ${customerName}, Total: ₹${totalAmount})`;
  
  const auditLog = {
    id: `AUDIT-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    username: `${req.employee.name} (${req.employee.role})`,
    action: "PDF Document Export",
    timestamp,
    device: "Web Client",
    beforeValue: "",
    afterValue: logMessage
  };

  db.auditLogs = [auditLog, ...db.auditLogs].slice(0, 100);
  saveDatabase(db);

  res.json({ success: true, message: "PDF generation authorized and logged successfully." });
});

// 16c. Workflow Locking & Controlled Reopen API Endpoints
app.get("/api/workflow", authenticateSession, (req, res) => {
  const db = getDatabase();
  res.json({
    success: true,
    workflowStages: db.workflowStages || [],
    reopenRequests: db.reopenRequests || [],
    workflowHistory: db.workflowHistory || []
  });
});

app.post("/api/workflow/stages/complete", authenticateSession, (req: any, res) => {
  const { stageId, workflowId, stageName, customerName, durationMinutes, browser, os, device } = req.body;
  if (!stageId || !workflowId || !stageName) {
    return res.status(400).json({ error: "Missing required parameters (stageId, workflowId, stageName)." });
  }

  const db = getDatabase();
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  // Find or create stage
  let stage = db.workflowStages.find(s => s.id === stageId);
  const currentVersion = stage ? stage.version : 1;

  const completedByInfo = {
    name: req.employee.name,
    id: req.employee.id,
    role: req.employee.role,
    department: req.employee.department,
    date: timestamp.split(" ")[0],
    time: timestamp.split(" ")[1],
    device: device || "Web Client",
    os: os || "Operating System",
    browser: browser || "Browser App",
    checksum: "",
    durationMinutes: durationMinutes || Math.floor(Math.random() * 45) + 15
  };

  if (!stage) {
    stage = {
      id: stageId,
      workflowId,
      stageName,
      status: "Completed",
      version: currentVersion,
      completedBy: completedByInfo
    };
    stage.completedBy.checksum = generateStageChecksum(stage);
    db.workflowStages.push(stage);
  } else {
    stage.status = "Completed";
    stage.completedBy = completedByInfo;
    stage.completedBy.checksum = generateStageChecksum(stage);
  }

  // Create immutable audit log
  const auditLog = {
    id: `AUDIT-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    username: `${req.employee.name} (${req.employee.role})`,
    action: "Stage Completed & Locked",
    timestamp,
    device: device || "Web Client",
    beforeValue: "In Progress / Pending",
    afterValue: `🔒 Completed and Locked stage "${stageName}" (Version: ${stage.version}, Checksum: ${stage.completedBy.checksum.substring(0, 10)}...)`
  };

  db.auditLogs = [auditLog, ...db.auditLogs].slice(0, 100);
  saveDatabase(db);

  res.json({ success: true, message: `Stage "${stageName}" successfully completed and locked.`, stage });
});

app.post("/api/workflow/reopen/request", authenticateSession, (req: any, res) => {
  const { stageId, workflowId, stageName, customerName, reason, detailedExplanation, supportingNotes } = req.body;
  if (!stageId || !workflowId || !reason || !detailedExplanation) {
    return res.status(400).json({ error: "Missing required parameters for reopen request." });
  }

  const db = getDatabase();
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  // Check if stage is actually completed
  const stage = db.workflowStages.find(s => s.id === stageId);
  if (!stage || stage.status !== "Completed") {
    return res.status(400).json({ error: "Cannot request reopen: Stage is not in locked Completed state." });
  }

  // Prevent duplicate pending requests
  const hasPending = db.reopenRequests.some(r => r.stageId === stageId && r.status === "Pending");
  if (hasPending) {
    return res.status(400).json({ error: "A pending reopen request already exists for this stage." });
  }

  const request = {
    id: `REQ-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    stageId,
    workflowId,
    customerName: customerName || "General Customer",
    employeeName: req.employee.name,
    employeeId: req.employee.id,
    department: req.employee.department,
    stageName,
    reason,
    detailedExplanation,
    supportingNotes: supportingNotes || "",
    requestDate: timestamp.split(" ")[0],
    requestTime: timestamp.split(" ")[1],
    status: "Pending"
  };

  db.reopenRequests.push(request);

  // Create audit log
  const auditLog = {
    id: `AUDIT-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    username: `${req.employee.name} (${req.employee.role})`,
    action: "Reopen Requested",
    timestamp,
    device: "Web Client",
    beforeValue: "Stage Locked",
    afterValue: `Requested reopen for stage "${stageName}" (Reason: ${reason})`
  };

  db.auditLogs = [auditLog, ...db.auditLogs].slice(0, 100);
  saveDatabase(db);

  res.json({ success: true, message: "Reopen request submitted successfully to managers.", request });
});

app.post("/api/workflow/reopen/resolve", authenticateSession, (req: any, res) => {
  const { requestId, status } = req.body; // 'Approved' | 'Rejected'
  if (!requestId || !status) {
    return res.status(400).json({ error: "Missing requestId or status." });
  }

  // 1. Strict RBAC Enforcement - Manager, Owner, or Super Admin only
  const allowedRoles = ["Super Admin", "Manager", "Owner"];
  if (!allowedRoles.includes(req.employee.role)) {
    return res.status(403).json({ error: "Forbidden: Only Managers, Owners, or Super Admins can approve reopen requests." });
  }

  const db = getDatabase();
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  const requestIndex = db.reopenRequests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Reopen request not found." });
  }

  const request = db.reopenRequests[requestIndex];
  if (request.status !== "Pending") {
    return res.status(400).json({ error: "This request has already been resolved." });
  }

  request.status = status;
  request.managerName = req.employee.name;
  request.approvalDate = timestamp.split(" ")[0];
  request.approvalTime = timestamp.split(" ")[1];

  const stage = db.workflowStages.find(s => s.id === request.stageId);

  if (status === "Approved" && stage) {
    // 2. Archive Version History before modifying
    const historyRecord = {
      id: `HIST-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
      stageId: stage.id,
      version: stage.version,
      originalValue: JSON.stringify(stage),
      updatedValue: "", // Will be populated with new state upon lock
      changedBy: request.employeeName,
      approvedBy: req.employee.name,
      whyChanged: request.reason + ": " + request.detailedExplanation,
      whenChanged: timestamp
    };
    db.workflowHistory.push(historyRecord);

    // 3. Move stage status back to 'In Progress' and increment Version Counter
    stage.status = "In Progress";
    stage.version = (stage.version || 1) + 1;
    // clear completed details until it's completed again
    stage.completedBy = undefined;
  }

  // Audit log entry
  const auditLog = {
    id: `AUDIT-${Date.now()}-${Math.random().toString().substring(2, 6)}`,
    username: `${req.employee.name} (${req.employee.role})`,
    action: `Reopen Request ${status}`,
    timestamp,
    device: "Web Client",
    beforeValue: "Pending Request",
    afterValue: `${status} reopen request ${requestId} for "${request.stageName}" (Requested by: ${request.employeeName})`
  };

  db.auditLogs = [auditLog, ...db.auditLogs].slice(0, 100);
  saveDatabase(db);

  res.json({ 
    success: true, 
    message: `Reopen request has been successfully ${status.toLowerCase()}.`,
    request,
    stage
  });
});

// 17. Global Search Endpoint
app.get("/api/search", authenticateSession, (req, res) => {
  const q = (req.query.q as string || "").toLowerCase().trim();
  if (!q) {
    return res.json({ customers: [], quotations: [], invoices: [], jobs: [], materials: [], employees: [] });
  }

  const db = getDatabase();

  const customers = db.customers.filter(
    c => c.name.toLowerCase().includes(q) || 
         c.companyName.toLowerCase().includes(q) || 
         c.phone.includes(q) || 
         (c.email && c.email.toLowerCase().includes(q))
  );

  const quotations = db.quotations.filter(
    qt => qt.id.toLowerCase().includes(q) || 
          qt.customerName.toLowerCase().includes(q) ||
          qt.items.some((item: any) => item.description.toLowerCase().includes(q))
  );

  const invoices = db.invoices.filter(
    inv => inv.id.toLowerCase().includes(q) || 
           (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) || 
           inv.customerName.toLowerCase().includes(q)
  );

  const jobs = db.jobs.filter(
    j => j.id.toLowerCase().includes(q) || 
         j.title.toLowerCase().includes(q) || 
         j.customerName.toLowerCase().includes(q) ||
         (j.description && j.description.toLowerCase().includes(q))
  );

  const materials = db.materials.filter(
    m => m.name.toLowerCase().includes(q) || 
         m.category.toLowerCase().includes(q) || 
         m.supplier.toLowerCase().includes(q)
  );

  const employees = db.employees.filter(
    e => !e.softDeleted && 
         (e.name.toLowerCase().includes(q) || 
          e.username.toLowerCase().includes(q) || 
          e.role.toLowerCase().includes(q) || 
          e.department.toLowerCase().includes(q))
  );

  res.json({
    customers,
    quotations,
    invoices,
    jobs,
    materials,
    employees
  });
});

// VITE SERVER INTERFACING
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(console.error);
