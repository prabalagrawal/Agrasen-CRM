/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Trash2, Printer, CheckCircle, FileText, Download, Share2, Mail } from 'lucide-react';
import { Quotation, Invoice, Customer, QuoteItem } from '../types';
import { jsPDF } from 'jspdf';
import { api } from '../services/api';

// Indian Currency Format helper for converting numbers to words
function numberToWords(num: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = Math.round(num)) === 0) return 'Zero';
  
  let str = '';
  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  const hundreds = Math.floor(num / 100);
  num %= 100;
  
  const getTensOnes = (n: number) => {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10].trim() : '') + ' ';
  };

  if (crores > 0) str += getTensOnes(crores) + 'Crore ';
  if (lakhs > 0) str += getTensOnes(lakhs) + 'Lakh ';
  if (thousands > 0) str += getTensOnes(thousands) + 'Thousand ';
  if (hundreds > 0) str += getTensOnes(hundreds) + 'Hundred ';
  if (num > 0) {
    if (str !== '') str += 'and ';
    str += getTensOnes(num);
  }
  return str.trim() + ' Rupees Only';
}

// Draw custom high-res vector Indian Rupee symbol (₹)
function drawRupeeSymbol(doc: any, x: number, y: number, fontSize: number = 9) {
  const h = fontSize * 0.65;
  const w = fontSize * 0.42;
  const thickness = fontSize * 0.08;
  doc.setLineWidth(thickness);
  
  // Neutral dark slate-800 line draw color
  doc.setDrawColor(30, 41, 59);
  
  // Top bar
  doc.line(x, y - h, x + w, y - h);
  // Middle bar
  doc.line(x, y - h * 0.62, x + w * 0.8, y - h * 0.62);
  // Left vertical spine
  doc.line(x + w * 0.12, y - h, x + w * 0.12, y - h * 0.28);
  // Loop curve segments
  doc.line(x + w * 0.12, y - h, x + w * 0.65, y - h);
  doc.line(x + w * 0.65, y - h, x + w * 0.65, y - h * 0.28);
  doc.line(x + w * 0.65, y - h * 0.28, x + w * 0.12, y - h * 0.28);
  // Slanted tail
  doc.line(x + w * 0.25, y - h * 0.28, x + w * 0.72, y);
}

// Wrapper to parse text and inject Rupee vector rendering at correct positions
function drawTextWithRupee(doc: any, text: string, x: number, y: number, align: 'left' | 'right' = 'left') {
  const hasRupee = text.includes('₹');
  if (!hasRupee) {
    if (align === 'right') {
      doc.text(text, x, y, { align: 'right' });
    } else {
      doc.text(text, x, y);
    }
    return;
  }
  
  const parts = text.split('₹');
  const isNegative = text.startsWith('-');
  const numberPart = parts[1] || '';
  const displayStr = (isNegative ? '-' : '') + '   ' + numberPart;
  
  if (align === 'right') {
    doc.text(displayStr, x, y, { align: 'right' });
    const numberWidth = doc.getTextWidth(numberPart);
    const spaceWidth = doc.getTextWidth('   ');
    const rupeeX = x - numberWidth - spaceWidth * 0.85;
    drawRupeeSymbol(doc, rupeeX, y, doc.getFontSize());
  } else {
    const prefix = isNegative ? '-' : '';
    if (prefix) {
      doc.text(prefix, x, y);
      const prefixWidth = doc.getTextWidth(prefix);
      drawRupeeSymbol(doc, x + prefixWidth + 1.5, y, doc.getFontSize());
      doc.text(numberPart, x + prefixWidth + doc.getTextWidth('   ') + 1.5, y);
    } else {
      drawRupeeSymbol(doc, x, y, doc.getFontSize());
      doc.text(numberPart, x + doc.getTextWidth('   '), y);
    }
  }
}

interface QuotationInvoiceProps {
  customers: Customer[];
  quotations: Quotation[];
  invoices: Invoice[];
  onAddQuotation: (q: Quotation) => void;
  onAddInvoice: (inv: Invoice) => void;
  lang: 'EN' | 'HI';
}

export default function QuotationInvoice({
  customers,
  quotations,
  invoices,
  onAddQuotation,
  onAddInvoice,
  lang,
}: QuotationInvoiceProps) {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'list_q' | 'list_i'>('create');
  
  // Create Form States
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [docType, setDocType] = useState<'quote' | 'invoice'>('quote');
  const [items, setItems] = useState<QuoteItem[]>([
    { description: 'Star Flex Backdrop Banner with Eyelets', quantity: 1, rate: 2500, amount: 2500 }
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(18);

  // New Item States
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemRate, setNewItemRate] = useState<number>(100);

  // Selected document preview states
  const [selectedDoc, setSelectedDoc] = useState<{
    id: string;
    date: string;
    customerName: string;
    items: QuoteItem[];
    subtotal: number;
    discount: number;
    gstAmount: number;
    total: number;
    type: 'QUOTATION' | 'INVOICE';
  } | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!selectedDoc) return;
    setIsDownloading(true);
    try {
      // 1. Authorize on backend and log audit trace
      await api.verifyPDFAccess(
        selectedDoc.id,
        selectedDoc.type,
        Math.round(selectedDoc.total),
        selectedDoc.customerName
      );

      // 2. Generate PDF document using jsPDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Page parameters
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // Header Brand Accent Bar (Red)
      doc.setFillColor(220, 38, 38);
      doc.rect(margin, 12, contentWidth, 1.5, 'F');

      // Title & Company details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(220, 38, 38);
      doc.text('AGRASEN FLEX PRINTERS', margin, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text([
        'Gali No. 4, Rohini Industrial Area, Delhi-110085',
        'Phone: +91 98765-43210 | Email: contact@agrasenflex.com',
        'GSTIN: 07AGRPF1234M1ZX'
      ], margin, 27);

      // Document Type & Metadata (Right side)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(selectedDoc.type === 'INVOICE' ? 'TAX INVOICE' : 'QUOTATION / ESTIMATE', pageWidth - margin, 22, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text([
        `Doc Number: ${selectedDoc.id}`,
        `Date: ${selectedDoc.date}`,
        selectedDoc.type === 'INVOICE' 
          ? `Due Date: ${new Date(new Date(selectedDoc.date).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`
          : `Valid Until: ${new Date(new Date(selectedDoc.date).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`
      ], pageWidth - margin, 27, { align: 'right' });

      // Solid dividing line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, 43, pageWidth - margin, 43);

      // Client Bill To Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('BILLED TO / CUSTOMER LEDGER:', margin, 49);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(selectedDoc.customerName, margin, 55);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text([
        'Active Registered Ledger Customer',
        'GSTIN: Verified Customer GST / Exempt',
        'Place of Supply: Delhi (07), India'
      ], margin, 60);

      // Line Items Table Header
      const tableHeaderY = 78;
      doc.setFillColor(30, 41, 59); // Slate-800
      doc.rect(margin, tableHeaderY, contentWidth, 7, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Line Item Description / Specifications', margin + 3, tableHeaderY + 4.8);
      doc.text('Qty', 130, tableHeaderY + 4.8, { align: 'right' });
      doc.text('Rate', 160, tableHeaderY + 4.8, { align: 'right' });
      doc.text('Amount (INR)', pageWidth - margin - 3, tableHeaderY + 4.8, { align: 'right' });

      // Table Rows
      let rowY = tableHeaderY + 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      selectedDoc.items.forEach((item, index) => {
        // Automatic page split protection if too long
        if (rowY > pageHeight - 85) {
          doc.addPage();
          rowY = 20;
          // Re-draw table header
          doc.setFillColor(30, 41, 59);
          doc.rect(margin, rowY, contentWidth, 7, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.text('Line Item Description / Specifications', margin + 3, rowY + 4.8);
          doc.text('Qty', 130, rowY + 4.8, { align: 'right' });
          doc.text('Rate', 160, rowY + 4.8, { align: 'right' });
          doc.text('Amount (INR)', pageWidth - margin - 3, rowY + 4.8, { align: 'right' });
          rowY += 7;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
        }

        // Alternating background
        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, rowY, contentWidth, 8, 'F');
        }

        // Row contents
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(item.description, margin + 3, rowY + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(item.quantity.toLocaleString(), 130, rowY + 5.5, { align: 'right' });
        
        // Draw prices using custom Rupee symbol vector helper
        drawTextWithRupee(doc, `₹${item.rate.toLocaleString()}`, 160, rowY + 5.5, 'right');
        drawTextWithRupee(doc, `₹${item.amount.toLocaleString()}`, pageWidth - margin - 3, rowY + 5.5, 'right');

        // Border line under row
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.3);
        doc.line(margin, rowY + 8, pageWidth - margin, rowY + 8);

        rowY += 8;
      });

      // Calculation summary block
      let summaryY = rowY + 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);

      doc.text('Subtotal:', 145, summaryY, { align: 'right' });
      drawTextWithRupee(doc, `₹${Math.round(selectedDoc.subtotal).toLocaleString()}`, pageWidth - margin - 3, summaryY, 'right');

      if (selectedDoc.discount > 0) {
        summaryY += 6;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129); // Emerald-500
        doc.text('Discount Coupon:', 145, summaryY, { align: 'right' });
        drawTextWithRupee(doc, `-₹${Math.round(selectedDoc.discount).toLocaleString()}`, pageWidth - margin - 3, summaryY, 'right');
      }

      summaryY += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('SGST + CGST (18%):', 145, summaryY, { align: 'right' });
      drawTextWithRupee(doc, `₹${Math.round(selectedDoc.gstAmount).toLocaleString()}`, pageWidth - margin - 3, summaryY, 'right');

      // Thick divider line for Grand Total
      summaryY += 8;
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.5);
      doc.line(125, summaryY - 4, pageWidth - margin, summaryY - 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('Grand Total (INR):', 145, summaryY, { align: 'right' });
      drawTextWithRupee(doc, `₹${Math.round(selectedDoc.total).toLocaleString()}`, pageWidth - margin - 3, summaryY, 'right');

      // Amount in Words
      const amtWords = numberToWords(selectedDoc.total);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Amount in Words: ${amtWords}`, margin, summaryY + 5);

      // Footnotes & Signature area (Sticky bottom layout)
      const footerY = 245;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Terms & Conditions:', margin, footerY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text([
        '1. 50% advance along with approved layout layout design.',
        '2. Dynamic delivery subject to installation bounds and site readiness.',
        '3. Under laws of NCT, Delhi.'
      ], margin, footerY + 4);

      // Signature line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Authorized Signatory', pageWidth - margin - 25, footerY + 16, { align: 'center' });
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.4);
      doc.line(pageWidth - margin - 50, footerY + 12, pageWidth - margin, footerY + 12);

      // Bottom footer greeting
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Thank you for choosing Agrasen Flex Printers!', pageWidth / 2, 282, { align: 'center' });

      // Save PDF
      const docCodeName = selectedDoc.id.replace(/\//g, '-');
      const docPrefixName = selectedDoc.type.toLowerCase() === 'invoice' ? 'Invoice' : 'Quotation';
      const fileName = `${docPrefixName}-${docCodeName}.pdf`;
      doc.save(fileName);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred while validating permissions and exporting PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddItem = () => {
    if (!newItemDesc) return;
    const itemAmt = newItemQty * newItemRate;
    setItems([...items, { description: newItemDesc, quantity: newItemQty, rate: newItemRate, amount: itemAmt }]);
    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemRate(100);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Please select a customer first.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one line item.');
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) return;

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = (subtotal - discount) * (gstPercent / 100);
    const total = subtotal - discount + gstAmount;

    if (docType === 'quote') {
      const newQuote: Quotation = {
        id: `QT-00${quotations.length + 2}`,
        date: new Date().toISOString().split('T')[0],
        customerId: customer.id,
        customerName: customer.name,
        items,
        subtotal,
        discount,
        gstPercent,
        gstAmount,
        total,
        status: 'Sent',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      onAddQuotation(newQuote);
      alert('Quotation generated successfully!');
      
      // Select for print preview instantly
      setSelectedDoc({
        id: newQuote.id,
        date: newQuote.date,
        customerName: newQuote.customerName,
        items: newQuote.items,
        subtotal: newQuote.subtotal,
        discount: newQuote.discount,
        gstAmount: newQuote.gstAmount,
        total: newQuote.total,
        type: 'QUOTATION',
      });
    } else {
      const newInv: Invoice = {
        id: `INV-100${invoices.length + 2}`,
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: `AFP/2026-27/0${invoices.length + 46}`,
        customerId: customer.id,
        customerName: customer.name,
        items,
        subtotal,
        discount,
        gstPercent,
        gstAmount,
        total,
        amountPaid: 0,
        status: 'Unpaid',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      onAddInvoice(newInv);
      alert('GST Invoice generated successfully!');

      setSelectedDoc({
        id: newInv.invoiceNumber,
        date: newInv.date,
        customerName: newInv.customerName,
        items: newInv.items,
        subtotal: newInv.subtotal,
        discount: newInv.discount,
        gstAmount: newInv.gstAmount,
        total: newInv.total,
        type: 'INVOICE',
      });
    }

    // Reset Creation form
    setItems([]);
    setDiscount(0);
    setSelectedCustomerId('');
  };

  const currentSubtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const currentGstAmt = (currentSubtotal - discount) * (gstPercent / 100);
  const currentTotal = currentSubtotal - discount + currentGstAmt;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Forms & Lists Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          {/* Sub-tab switcher */}
          <div className="flex border-b border-slate-100 mb-6 bg-slate-50 p-1.5 rounded-xl">
            {[
              { id: 'create', label: lang === 'EN' ? 'Create New Document' : 'नया बिल / कोटेशन बनाएं' },
              { id: 'list_q', label: lang === 'EN' ? 'Quotations Directory' : 'कोटेशन सूची' },
              { id: 'list_i', label: lang === 'EN' ? 'GST Invoices Register' : 'इनवॉइस रजिस्टर' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`flex-1 py-2 text-center rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  activeSubTab === sub.id
                    ? 'bg-white shadow-2xs border border-slate-200 text-red-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {activeSubTab === 'create' && (
            <form onSubmit={handleCreateDocument} className="space-y-5">
              {/* Customer selection & type */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Select Customer Ledger</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Document Format Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDocType('quote')}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        docType === 'quote'
                          ? 'border-red-600 bg-red-50 text-red-700 font-extrabold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Quotation / Estimate
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocType('invoice')}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        docType === 'invoice'
                          ? 'border-red-600 bg-red-50 text-red-700 font-extrabold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Tax Invoice (GST)
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Table Creator */}
              <div className="pt-5 border-t border-slate-100">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3 font-display">
                  Document Line Items
                </h4>

                {/* Listing added items */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden mb-5">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80">
                        <th className="p-3 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Description</th>
                        <th className="p-3 font-bold text-slate-700 text-right uppercase tracking-wider text-[10px]">Qty</th>
                        <th className="p-3 font-bold text-slate-700 text-right uppercase tracking-wider text-[10px]">Rate</th>
                        <th className="p-3 font-bold text-slate-700 text-right uppercase tracking-wider text-[10px]">Amount</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-55/5 transition-colors">
                          <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                          <td className="p-3 text-right font-mono text-slate-800">{item.quantity}</td>
                          <td className="p-3 text-right font-mono text-slate-800">₹{item.rate.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-extrabold text-slate-900">₹{item.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-mono text-[11px]">
                            No items added yet. Formulate line items below.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Form to append new item */}
                <div className="grid sm:grid-cols-4 gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Item Description / Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. 10ft x 4ft Star Flex banner print"
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Qty</label>
                    <input
                      type="number"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Rate (₹)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newItemRate}
                        onChange={(e) => setNewItemRate(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="p-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shrink-0 cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adjust totals */}
              <div className="grid sm:grid-cols-3 gap-5 pt-5 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Apply Coupon Discount (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">GST Surcharge (%)</label>
                  <select
                    value={gstPercent}
                    onChange={(e) => setGstPercent(parseInt(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="0">Exempt (0%)</option>
                    <option value="5">GST 5% (Paper)</option>
                    <option value="12">GST 12% (Service)</option>
                    <option value="18">GST Standard Signage (18%)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-sm transition-all cursor-pointer"
                  >
                    Generate Document
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeSubTab === 'list_q' && (
            <div className="space-y-3.5">
              {quotations.map((q) => (
                <div
                  key={q.id}
                  onClick={() =>
                    setSelectedDoc({
                      id: q.id,
                      date: q.date,
                      customerName: q.customerName,
                      items: q.items,
                      subtotal: q.subtotal,
                      discount: q.discount,
                      gstAmount: q.gstAmount,
                      total: q.total,
                      type: 'QUOTATION',
                    })
                  }
                  className="p-4.5 border border-slate-200 rounded-2xl hover:bg-slate-55/10 cursor-pointer transition-all flex justify-between items-center"
                >
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm font-display">{q.customerName}</div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-1">
                      Quote Code: {q.id} — date: {q.date}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold font-mono text-red-600">₹{Math.round(q.total).toLocaleString()}</div>
                    <span className="text-[10px] font-mono text-emerald-600 uppercase font-extrabold mt-1 inline-block">
                      ✓ {q.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'list_i' && (
            <div className="space-y-3.5">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() =>
                    setSelectedDoc({
                      id: inv.invoiceNumber,
                      date: inv.date,
                      customerName: inv.customerName,
                      items: inv.items,
                      subtotal: inv.subtotal,
                      discount: inv.discount,
                      gstAmount: inv.gstAmount,
                      total: inv.total,
                      type: 'INVOICE',
                    })
                  }
                  className="p-4.5 border border-slate-200 rounded-2xl hover:bg-slate-55/10 cursor-pointer transition-all flex justify-between items-center"
                >
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm font-display">{inv.customerName}</div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-1">
                      GST Bill: {inv.invoiceNumber} — Date: {inv.date}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold font-mono text-slate-900">₹{Math.round(inv.total).toLocaleString()}</div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border mt-1.5 inline-block ${
                        inv.status === 'Paid'
                          ? 'bg-green-50 border-green-200 text-green-750 font-extrabold'
                          : 'bg-orange-50 border-orange-200 text-orange-750 font-extrabold'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Print PDF Document Layout preview */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        {selectedDoc ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-sans font-extrabold text-slate-900 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-red-600" />
                Live PDF Print Preview
              </span>
              <button
                onClick={() => window.print()}
                className="text-slate-500 hover:text-red-600 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Frame wrapper */}
            <div className="border border-slate-300 p-6 bg-white font-sans text-slate-900 text-[11px] rounded-2xl shadow-2xs select-none">
              <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                <div>
                  <h4 className="font-black text-red-600 text-xs uppercase font-sans tracking-tight">
                    AGRASEN FLEX PRINTERS
                  </h4>
                  <p className="text-[9px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                    Gali No. 4, Rohini Industrial Area, Delhi-110085
                    <br />
                    Phone: +91 98765-43210
                    <br />
                    GSTIN: 07AGRPF1234M1ZX
                  </p>
                </div>
                <div className="text-right font-mono text-[9px] text-slate-550 font-semibold">
                  <div className="font-extrabold text-slate-900 text-xs tracking-wide">{selectedDoc.type}</div>
                  <div className="mt-1">Doc Code: {selectedDoc.id}</div>
                  <div>Date: {selectedDoc.date}</div>
                </div>
              </div>

              {/* Bill To */}
              <div className="py-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">BILLED TO:</span>
                <div className="font-extrabold text-slate-900 text-xs">{selectedDoc.customerName}</div>
                <div className="text-slate-500 text-[9px] mt-1 font-semibold">GSTIN: Active Ledger Customer</div>
              </div>

              {/* Items directory */}
              <div className="border-t border-slate-200 pt-3">
                <table className="w-full text-left text-[9px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 font-bold text-slate-600">
                      <th className="py-1 uppercase">Description</th>
                      <th className="py-1 text-right uppercase">Qty</th>
                      <th className="py-1 text-right uppercase">Rate</th>
                      <th className="py-1 text-right uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDoc.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 text-slate-700 font-medium">
                        <td className="py-2 font-bold text-slate-900">{item.description}</td>
                        <td className="py-2 text-right font-mono">{item.quantity}</td>
                        <td className="py-2 text-right font-mono">₹{item.rate}</td>
                        <td className="py-2 text-right font-mono">₹{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Block */}
              <div className="border-t border-slate-200 pt-3.5 space-y-1.5 text-right font-mono text-[10px]">
                <div className="flex justify-between pl-12 text-slate-500 font-medium">
                  <span>Subtotal:</span>
                  <span>₹{Math.round(selectedDoc.subtotal).toLocaleString()}</span>
                </div>
                {selectedDoc.discount > 0 && (
                  <div className="flex justify-between pl-12 text-emerald-600 font-bold">
                    <span>Discount Coupon:</span>
                    <span>-₹{Math.round(selectedDoc.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pl-12 text-slate-500 font-medium">
                  <span>SGST + CGST (18%):</span>
                  <span>₹{Math.round(selectedDoc.gstAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pl-12 border-t border-slate-900 pt-2 text-slate-900 font-black text-xs">
                  <span>Grand Total (INR):</span>
                  <span>₹{Math.round(selectedDoc.total).toLocaleString()}</span>
                </div>
              </div>

              {/* Legalities */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-end text-[8px] text-slate-400 font-medium">
                <div>
                  <div className="font-bold text-slate-700">Terms & Conditions:</div>
                  <div className="mt-1 leading-snug">
                    1. 50% advance along with approved layout.
                    <br />
                    2. Dynamic delivery subject to installation bounds.
                    <br />
                    3. Under laws of NCT, Delhi.
                  </div>
                </div>
                <div className="text-center w-24 border-t border-slate-300 pt-2 font-mono uppercase text-[7px] text-slate-700 font-bold">
                  Authorized Signatory
                </div>
              </div>
            </div>

            {/* Document Actions Panel */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Download PDF Action */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all shadow-xs hover:shadow-md col-span-2"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  {isDownloading 
                    ? (lang === 'EN' ? 'Verifying & Generating...' : 'सत्यापित और जनरेट किया जा रहा है...') 
                    : (lang === 'EN' ? 'Download Professional PDF' : 'प्रोफेशनल पीडीएफ डाउनलोड करें')}
                </button>

                {/* Print Invoice Action */}
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  {lang === 'EN' ? 'Print Document' : 'दस्तावेज़ प्रिंट करें'}
                </button>

                {/* WhatsApp Action (Future Integration) */}
                <button
                  disabled
                  title="WhatsApp Integration Coming Soon"
                  className="py-2.5 px-4 bg-slate-50 text-slate-400 border border-slate-200 font-sans text-[11px] font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  WhatsApp
                  <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded-sm font-medium scale-90">Soon</span>
                </button>
              </div>

              {/* Email Send Action (Future Integration) */}
              <button
                disabled
                title="Email Integration Coming Soon"
                className="w-full py-2.5 px-4 bg-slate-50 text-slate-400 border border-slate-200 font-sans text-[11px] font-semibold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                {lang === 'EN' ? 'Send via Email (Future Integration)' : 'ईमेल द्वारा भेजें (भविष्य एकीकरण)'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 space-y-3 my-auto">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300" />
            <div>
              <p className="text-sm font-bold text-slate-700">No Document Selected</p>
              <p className="text-[10px] text-slate-500 max-w-[180px] mx-auto mt-1 leading-relaxed">
                Select any Quotation code or Invoice Number from the lists on the left to show the printable company GST receipt template here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
