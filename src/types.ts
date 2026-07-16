/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'EN' | 'HI';

export type UserRole =
  | 'Owner'
  | 'Manager'
  | 'Reception'
  | 'Designer'
  | 'Operator'
  | 'Delivery'
  | 'Customer';

export type JobStatus =
  | 'Quotation'
  | 'Approved'
  | 'Design'
  | 'Printing'
  | 'Finishing'
  | 'Installation'
  | 'Delivered'
  | 'Completed';

export type JobPriority = 'Low' | 'Medium' | 'High';

export interface JobNote {
  id: string;
  author: string;
  role: UserRole;
  text: string;
  date: string;
}

export interface JobHistoryItem {
  status: JobStatus;
  timestamp: string;
  changedBy: string;
  role: UserRole;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  assignedToId?: string;
  assignedToName?: string;
  status: JobStatus;
  priority: JobPriority;
  deadline: string;
  designFiles: string[];
  completionPhotos: string[];
  notes: JobNote[];
  cost: number;
  history: JobHistoryItem[];
  installationRequired: boolean;
  installationAddress?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gst: string;
  address: string;
  email: string;
  notes: string;
  outstandingBalance: number;
  ordersCount: number;
  outstandingInvoices: number;
}

export interface StockHistory {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  qty: number;
  reason: string;
  user: string;
}

export interface Material {
  id: string;
  name: string;
  category: 'Roll' | 'Vinyl' | 'ACP' | 'Acrylic' | 'LED' | 'Ink' | 'Hardware' | 'Board';
  stockLevel: number;
  minStockLevel: number;
  unit: string;
  supplier: string;
  lastPurchasePrice: number;
  history: StockHistory[];
}

export type TicketType =
  | 'Machine Issue'
  | 'Inventory Request'
  | 'Customer Complaint'
  | 'Site Issue'
  | 'Printer Error'
  | 'Need Material'
  | 'Delivery Problem'
  | 'Electricity Issue'
  | 'Other';

export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface TicketNote {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Ticket {
  id: string;
  title: string;
  type: TicketType;
  description: string;
  raisedBy: string;
  raisedByRole: UserRole;
  assignedTo?: string;
  status: TicketStatus;
  priority: JobPriority;
  createdDate: string;
  notes: TicketNote[];
}

export type DeliveryType = 'Incoming' | 'Outgoing';
export type DeliveryStatus = 'Scheduled' | 'Transit' | 'Delivered' | 'Delayed' | 'Failed';

export interface Delivery {
  id: string;
  type: DeliveryType;
  jobId?: string;
  jobTitle?: string;
  customerName?: string;
  supplierName?: string;
  carrierName: string;
  status: DeliveryStatus;
  expectedDate: string;
  address: string;
  photos: string[];
  signature?: string;
  quantityVerified: boolean;
  remarks: string;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  date: string;
  notes: string;
  isCompleted: boolean;
  type: 'Call' | 'Meeting' | 'Payment' | 'Installation';
}

export interface QuoteItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Quotation {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected';
  validUntil: string;
}

export interface Invoice {
  id: string;
  date: string;
  invoiceNumber: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
  amountPaid: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Unpaid' | 'Partial';
  dueDate: string;
}

export interface CalculatorRates {
  // Rates in INR
  flexStandard: number;
  flexStar: number;
  flexBacklit: number;
  vinylStandard: number;
  vinylGlossy: number;
  vinylOneWay: number;
  acpStandard: number;
  acpPremium: number;
  acrylicStandard: number;
  acrylicLed: number;
  ledModuleSingle: number;
  ledPowerSupply: number;
  sunboardStandard: number;
  visitingCardStandard: number; // rate per card (min 100)
  visitingCardPremium: number;
  weddingCardStandard: number;
  brochureStandard: number;
  stickerStandard: number;
  labourRatePerHour: number;
  transportBaseRate: number;
  installationBaseRate: number;
  defaultProfitMargin: number; // percentage (e.g. 25)
}
