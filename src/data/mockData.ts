/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Customer,
  Job,
  Material,
  Ticket,
  Delivery,
  FollowUp,
  Quotation,
  Invoice,
  CalculatorRates,
} from '../types';

export const INITIAL_RATES: CalculatorRates = {
  flexStandard: 12, // per sqft
  flexStar: 22, // per sqft
  flexBacklit: 45, // per sqft
  vinylStandard: 25, // per sqft
  vinylGlossy: 35, // per sqft
  vinylOneWay: 50, // per sqft
  acpStandard: 180, // per sqft
  acpPremium: 280, // per sqft
  acrylicStandard: 120, // per sqft
  acrylicLed: 240, // per sqft
  ledModuleSingle: 15, // per module
  ledPowerSupply: 450, // per unit
  sunboardStandard: 40, // per sqft
  visitingCardStandard: 1.5, // per card
  visitingCardPremium: 3.5, // per card
  weddingCardStandard: 15, // per card
  brochureStandard: 8, // per card
  stickerStandard: 3, // per sticker
  labourRatePerHour: 150,
  transportBaseRate: 500,
  installationBaseRate: 1000,
  defaultProfitMargin: 30, // 30% margin
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Sharma Sweets & Caterers',
    companyName: 'Sharma Sweets & Caterers',
    phone: '9876543210',
    whatsapp: '9876543210',
    email: 'sharmasweets@gmail.com',
    gst: '07AAAAA1111A1Z1',
    address: 'Shop No. 12, Main Market, Sector 15, Rohini, Delhi',
    customerSince: '2025-01-10',
    lastOrder: 'JOB-001',
    outstandingBalance: 12500,
    recentQuotations: ['QT-001'],
    recentInvoices: ['INV-1001'],
    recentPayments: [
      { date: '2026-07-14 11:30:00', amount: 26086, method: 'UPI GPay' }
    ],
    uploadedFiles: [
      { name: 'sharma_sweets_dimensions.jpg', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80', uploadedAt: '2026-07-15 10:05:00' }
    ],
    notesList: [
      { id: 'N-1', text: '20-year loyal customer. Needs high-quality finishing.', date: '2026-07-15 11:30:00', author: 'Ramesh Sharma' }
    ],
    timeline: [
      { id: 'TL-1', type: 'Created', title: 'Customer Account Created', description: 'Profile registered in Agrasen OS CRM.', date: '2026-07-15 09:00:00', byUser: 'Sunita Gupta' }
    ]
  },
  {
    id: 'CUST-002',
    name: 'Amit Gupta',
    companyName: 'Gupta Medical Hall',
    phone: '9811223344',
    whatsapp: '9811223344',
    email: 'guptamedical@yahoo.com',
    gst: '07BBBBB2222B2Z2',
    address: 'Pocket G-3, Sector 3, Dwarka, Delhi',
    customerSince: '2026-02-10',
    lastOrder: 'JOB-002',
    outstandingBalance: 0,
    recentQuotations: ['QT-002'],
    recentInvoices: ['INV-1002'],
    recentPayments: [
      { date: '2026-07-16 09:20:00', amount: 1580, method: 'Cash' }
    ],
    uploadedFiles: [],
    notesList: [
      { id: 'N-2', text: 'Requires ACP signage and glow sign boards regularly.', date: '2026-07-16 09:30:00', author: 'Sunita Gupta' }
    ],
    timeline: [
      { id: 'TL-B1', type: 'Created', title: 'Customer Account Created', description: 'Registered customer profile.', date: '2026-07-16 09:00:00', byUser: 'Sunita Gupta' }
    ]
  },
  {
    id: 'CUST-003',
    name: 'Anil Mittal',
    companyName: 'Mittal Saree Emporium',
    phone: '9988776655',
    whatsapp: '9988776655',
    email: 'mittalsarees@outlook.com',
    gst: '07CCCCC3333C3Z3',
    address: '45, Chandni Chowk, Delhi',
    customerSince: '2025-06-15',
    lastOrder: 'JOB-003',
    outstandingBalance: 32000,
    recentQuotations: ['QT-003'],
    recentInvoices: ['INV-1003'],
    recentPayments: [],
    uploadedFiles: [],
    notesList: [
      { id: 'N-3', text: 'Very strict on color matching. Often requests sample prints.', date: '2026-07-16 10:00:00', author: 'Sunita Gupta' }
    ],
    timeline: [
      { id: 'TL-C1', type: 'Created', title: 'Customer Account Created', description: 'Registered customer profile.', date: '2026-07-16 10:00:00', byUser: 'Sunita Gupta' }
    ]
  },
  {
    id: 'CUST-004',
    name: 'Apex Academy',
    companyName: 'Apex Academy',
    phone: '9311223344',
    whatsapp: '9311223344',
    email: 'info@apexacademy.edu.in',
    gst: '07DDDDD4444D4Z4',
    address: 'B-12, GT Karnal Road, Industrial Area, Delhi',
    customerSince: '2026-03-01',
    lastOrder: 'JOB-004',
    outstandingBalance: 4500,
    recentQuotations: ['QT-004'],
    recentInvoices: ['INV-1004'],
    recentPayments: [],
    uploadedFiles: [],
    notesList: [
      { id: 'N-4', text: 'Educational institution. Requests flexible flex banners and brochures.', date: '2026-07-16 10:15:00', author: 'Sunita Gupta' }
    ],
    timeline: [
      { id: 'TL-D1', type: 'Created', title: 'Customer Account Created', description: 'Registered customer profile.', date: '2026-07-16 10:15:00', byUser: 'Sunita Gupta' }
    ]
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'JOB-001',
    title: 'Sharma Sweets Front Glow Sign Board',
    description: 'ACP Board backing in Red with acrylic 3D raised LED illuminated letters. Size 10ft x 4ft.',
    customerId: 'CUST-001',
    customerName: 'Sharma Sweets & Caterers',
    assignedToId: 'EMP-003',
    assignedToName: 'Amit Kumar (Designer)',
    status: 'Design',
    priority: 'High',
    deadline: '2026-07-20',
    designFiles: ['sharma_sweets_v1_draft.pdf', 'sharma_sweets_dimensions.jpg'],
    completionPhotos: [],
    notes: [
      {
        id: 'N-1',
        author: 'Ramesh Sharma (Owner)',
        role: 'Owner',
        text: 'Customer wants standard warm white LEDs behind Red acrylic letters.',
        date: '2026-07-15 11:30 AM',
      },
      {
        id: 'N-2',
        author: 'Amit Kumar (Designer)',
        role: 'Designer',
        text: 'Initial draft sent to customer. Waiting for design approval on font spacing.',
        date: '2026-07-15 04:15 PM',
      },
    ],
    cost: 38500,
    history: [
      {
        status: 'Quotation',
        timestamp: '2026-07-15 10:00 AM',
        changedBy: 'Sunita Mishra (Reception)',
        role: 'Reception',
      },
      {
        status: 'Approved',
        timestamp: '2026-07-15 11:15 AM',
        changedBy: 'Ramesh Sharma (Owner)',
        role: 'Owner',
      },
      {
        status: 'Design',
        timestamp: '2026-07-15 11:30 AM',
        changedBy: 'Ramesh Sharma (Owner)',
        role: 'Owner',
      },
    ],
    installationRequired: true,
    installationAddress: 'Shop No. 12, Main Market, Sector 15, Rohini, Delhi',
  },
  {
    id: 'JOB-002',
    title: 'Gupta Medical Star Flex Banner',
    description: 'Star Flex Banner with eyelets for medical camp. Size 12ft x 6ft.',
    customerId: 'CUST-002',
    customerName: 'Gupta Medical Hall',
    assignedToId: 'EMP-004',
    assignedToName: 'Rahul Verma (Operator)',
    status: 'Printing',
    priority: 'Medium',
    deadline: '2026-07-17',
    designFiles: ['gupta_med_camp_approved.cdr'],
    completionPhotos: [],
    notes: [
      {
        id: 'N-3',
        author: 'Sunita Mishra (Reception)',
        role: 'Reception',
        text: 'Customer provided their own print-ready CDR file. Print layout verified.',
        date: '2026-07-16 09:30 AM',
      },
    ],
    cost: 1580,
    history: [
      {
        status: 'Quotation',
        timestamp: '2026-07-16 09:10 AM',
        changedBy: 'Sunita Mishra (Reception)',
        role: 'Reception',
      },
      {
        status: 'Approved',
        timestamp: '2026-07-16 09:20 AM',
        changedBy: 'Sunita Mishra (Reception)',
        role: 'Reception',
      },
      {
        status: 'Printing',
        timestamp: '2026-07-16 09:30 AM',
        changedBy: 'Sunita Mishra (Reception)',
        role: 'Reception',
      },
    ],
    installationRequired: false,
  },
  {
    id: 'JOB-003',
    title: 'Mittal Sarees Festive Vinyl Glass Film',
    description: 'One Way Vision Vinyl print and installation for front glass door. Size 8ft x 7ft.',
    customerId: 'CUST-003',
    customerName: 'Mittal Saree Emporium',
    assignedToId: 'EMP-005',
    assignedToName: 'Sanjay Dutt (Installation)',
    status: 'Approved',
    priority: 'High',
    deadline: '2026-07-19',
    designFiles: ['mittal_wedding_festive_v2.pdf'],
    completionPhotos: [],
    notes: [],
    cost: 5200,
    history: [
      {
        status: 'Quotation',
        timestamp: '2026-07-15 02:00 PM',
        changedBy: 'Sunita Mishra (Reception)',
        role: 'Reception',
      },
      {
        status: 'Approved',
        timestamp: '2026-07-16 10:15 AM',
        changedBy: 'Ramesh Sharma (Owner)',
        role: 'Owner',
      },
    ],
    installationRequired: true,
    installationAddress: '45, Chandni Chowk, Delhi',
  },
  {
    id: 'JOB-004',
    title: 'Apex Academy Promotion Leaflets',
    description: '1000 Leaflets Double-side printing on 130 GSM Glossy Paper. A4 Size.',
    customerId: 'CUST-004',
    customerName: 'Apex Academy',
    assignedToId: 'EMP-004',
    assignedToName: 'Rahul Verma (Operator)',
    status: 'Completed',
    priority: 'Low',
    deadline: '2026-07-14',
    designFiles: ['apex_pamphlet_final.pdf'],
    completionPhotos: ['apex_bundle_pack.jpg'],
    notes: [
      {
        id: 'N-4',
        author: 'Rahul Verma (Operator)',
        role: 'Operator',
        text: 'Printed, bundled, and moved to front desk dispatch.',
        date: '2026-07-14 03:30 PM',
      },
    ],
    cost: 4500,
    history: [
      {
        status: 'Quotation',
        timestamp: '2026-07-12 11:00 AM',
        changedBy: 'Sunita Mishra (Reception)',
        role: 'Reception',
      },
      {
        status: 'Approved',
        timestamp: '2026-07-12 01:15 PM',
        changedBy: 'Ramesh Sharma (Owner)',
        role: 'Owner',
      },
      {
        status: 'Printing',
        timestamp: '2026-07-13 10:00 AM',
        changedBy: 'Rahul Verma (Operator)',
        role: 'Operator',
      },
      {
        status: 'Completed',
        timestamp: '2026-07-14 03:45 PM',
        changedBy: 'Rahul Verma (Operator)',
        role: 'Operator',
      },
    ],
    installationRequired: false,
  },
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'MAT-001',
    name: 'Normal Flex Roll 10ft',
    category: 'Roll',
    stockLevel: 1500, // sqft
    minStockLevel: 500,
    unit: 'SqFt',
    supplier: 'Pioneer Media House',
    lastPurchasePrice: 6.5,
    history: [
      { id: 'H-1', date: '2026-07-01', type: 'IN', qty: 2000, reason: 'Monthly Stock Purchase', user: 'Ramesh Sharma' },
      { id: 'H-2', date: '2026-07-14', type: 'OUT', qty: 500, reason: 'Job 104 Banner Printing', user: 'Rahul Verma' },
    ],
  },
  {
    id: 'MAT-002',
    name: 'Star Flex Roll 10ft',
    category: 'Roll',
    stockLevel: 300, // sqft (low stock alert!)
    minStockLevel: 600,
    unit: 'SqFt',
    supplier: 'Pioneer Media House',
    lastPurchasePrice: 12.0,
    history: [
      { id: 'H-3', date: '2026-07-02', type: 'IN', qty: 1000, reason: 'Stock replenishment', user: 'Ramesh Sharma' },
      { id: 'H-4', date: '2026-07-15', type: 'OUT', qty: 700, reason: 'Exhibition Backdrops', user: 'Rahul Verma' },
    ],
  },
  {
    id: 'MAT-003',
    name: 'ACP Sheets Silver 8x4ft',
    category: 'ACP',
    stockLevel: 45, // sheets
    minStockLevel: 15,
    unit: 'Sheets',
    supplier: 'Aludecor India',
    lastPurchasePrice: 1450.0,
    history: [],
  },
  {
    id: 'MAT-004',
    name: 'Samsung LED Modules White',
    category: 'LED',
    stockLevel: 120, // modules (low stock alert!)
    minStockLevel: 500,
    unit: 'Modules',
    supplier: 'Acro Lightings',
    lastPurchasePrice: 9.5,
    history: [
      { id: 'H-5', date: '2026-07-10', type: 'OUT', qty: 450, reason: 'Sign Board Installation', user: 'Sanjay Dutt' },
    ],
  },
  {
    id: 'MAT-005',
    name: 'Solvent Ink Yellow 5L',
    category: 'Ink',
    stockLevel: 3, // bottles
    minStockLevel: 2,
    unit: 'Bottles',
    supplier: 'TechInk Corp',
    lastPurchasePrice: 3200.0,
    history: [],
  },
  {
    id: 'MAT-006',
    name: 'Solvent Ink Cyan 5L',
    category: 'Ink',
    stockLevel: 1, // bottle (low stock!)
    minStockLevel: 2,
    unit: 'Bottles',
    supplier: 'TechInk Corp',
    lastPurchasePrice: 3200.0,
    history: [],
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TCK-001',
    title: 'Spectra Plotter Calibration Issue',
    type: 'Printer Error',
    description: 'Cyan printing with banding lines on standard flex media. Print head cleaning did not resolve.',
    raisedBy: 'Rahul Verma (Operator)',
    raisedByRole: 'Operator',
    assignedTo: 'Vikram Singh (Manager)',
    status: 'In Progress',
    priority: 'High',
    createdDate: '2026-07-15',
    notes: [
      {
        id: 'TN-1',
        author: 'Vikram Singh (Manager)',
        text: 'Technician called. Scheduled to visit today evening.',
        date: '2026-07-16 10:00 AM',
      },
    ],
  },
  {
    id: 'TCK-002',
    title: 'Acrylic Sheet stock short for Sharma Board',
    type: 'Need Material',
    description: 'We need Red 3mm acrylic sheet urgently for CUST-001 raised letters. Vendor is quoting high price.',
    raisedBy: 'Rahul Verma (Operator)',
    raisedByRole: 'Operator',
    assignedTo: 'Ramesh Sharma (Owner)',
    status: 'Open',
    priority: 'Medium',
    createdDate: '2026-07-16',
    notes: [],
  },
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'DLV-001',
    type: 'Incoming',
    supplierName: 'Aludecor India',
    carrierName: 'Safe Express Cargo',
    status: 'Transit',
    expectedDate: '2026-07-17',
    address: 'Agrasen Flex Printers Warehouse, Gali No. 4, Industrial Area, Rohini, Delhi',
    photos: [],
    quantityVerified: false,
    remarks: 'Prepaid order of 20 Premium Gold ACP sheets.',
  },
  {
    id: 'DLV-002',
    type: 'Outgoing',
    jobId: 'JOB-004',
    jobTitle: 'Apex Academy Leaflets Delivery',
    customerName: 'Apex Academy',
    carrierName: 'Ramu E-Rickshaw Service',
    status: 'Delivered',
    expectedDate: '2026-07-14',
    address: 'B-12, GT Karnal Road, Industrial Area, Delhi',
    photos: ['apex_delivery_front_gate.jpg'],
    signature: 'S. K. Gupta (Registrar)',
    quantityVerified: true,
    remarks: 'Handed over directly to reception. Signature obtained.',
  },
];

export const INITIAL_FOLLOW_UPS: FollowUp[] = [
  {
    id: 'FLP-001',
    customerId: 'CUST-003',
    customerName: 'Mittal Saree Emporium',
    title: 'Payment Reminder for Outstanding ₹32,000',
    date: '2026-07-16',
    notes: 'Call Mr. Mittal after 2 PM. He promised check payment this week.',
    isCompleted: false,
    type: 'Payment',
  },
  {
    id: 'FLP-002',
    customerId: 'CUST-001',
    customerName: 'Sharma Sweets & Caterers',
    title: 'Confirm Design Alignment on Whatsapp',
    date: '2026-07-17',
    notes: 'Ensure they approve the spacing of the warm-white LEDs behind Red letters.',
    isCompleted: false,
    type: 'Call',
  },
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'QT-001',
    date: '2026-07-15',
    customerId: 'CUST-001',
    customerName: 'Sharma Sweets & Caterers',
    items: [
      { description: 'ACP Sheet standard backing 10x4ft (40 sqft @ ₹180)', quantity: 1, rate: 7200, amount: 7200 },
      { description: 'Raised Acrylic letters with waterproof Samsung LED (₹240/sqft base)', quantity: 40, rate: 600, amount: 24000 },
      { description: 'Professional Installation & Framing with Iron pipe', quantity: 1, rate: 3500, amount: 3500 },
    ],
    subtotal: 34700,
    discount: 2000,
    gstPercent: 18,
    gstAmount: 5886,
    total: 38586,
    status: 'Approved',
    validUntil: '2026-07-30',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-1001',
    date: '2026-07-14',
    invoiceNumber: 'AFP/2026-27/045',
    quotationId: 'QT-001',
    customerId: 'CUST-001',
    customerName: 'Sharma Sweets & Caterers',
    items: [
      { description: 'ACP Sheet standard backing 10x4ft (40 sqft @ ₹180)', quantity: 1, rate: 7200, amount: 7200 },
      { description: 'Raised Acrylic letters with waterproof Samsung LED (₹240/sqft base)', quantity: 40, rate: 600, amount: 24000 },
      { description: 'Professional Installation & Framing with Iron pipe', quantity: 1, rate: 3500, amount: 3500 },
    ],
    subtotal: 34700,
    discount: 2000,
    gstPercent: 18,
    gstAmount: 5886,
    total: 38586,
    amountPaid: 26086,
    status: 'Partial',
    dueDate: '2026-07-31',
  },
];
