/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Phone, FileText, PlusCircle, AlertCircle, Search, Mail, MapPin } from 'lucide-react';
import { Customer } from '../types';

interface CRMPanelProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  lang: 'EN' | 'HI';
}

export default function CRMPanel({ customers, onAddCustomer, lang }: CRMPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New customer states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gst, setGst] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.gst && c.gst.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert(lang === 'EN' ? 'Please fill in Name and Phone number' : 'कृपया नाम और फोन नंबर दर्ज करें।');
      return;
    }

    const newCustomer: Customer = {
      id: `CUST-0${customers.length + 1}`,
      name,
      phone,
      gst: gst || 'N/A',
      address: address || 'N/A',
      email: email || 'N/A',
      notes: notes || 'No internal notes provided.',
      outstandingBalance: 0,
      ordersCount: 0,
      outstandingInvoices: 0,
    };

    onAddCustomer(newCustomer);
    setShowAddForm(false);
    // Reset Form
    setName('');
    setPhone('');
    setGst('');
    setAddress('');
    setEmail('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Search & Action bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4.5 border border-slate-200/85 rounded-2xl shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'EN' ? 'Search customers by name, phone or GST...' : 'नाम, फोन या जीएसटी से ग्राहक खोजें...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-sm shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {lang === 'EN' ? 'Register New Customer' : 'नया ग्राहक पंजीकृत करें'}
        </button>
      </div>

      {/* Add Customer Form Modal overlay */}
      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeIn">
          <h3 className="font-sans font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Users className="w-5 h-5 text-red-600" />
            {lang === 'EN' ? 'Add Customer Details' : 'ग्राहक विवरण जोड़ें'}
          </h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'EN' ? 'Customer Name' : 'ग्राहक का नाम'} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sharma Sweets / Mittal Sarees"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'EN' ? 'Phone Number' : 'मोबाइल नंबर'} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9811223344"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'EN' ? 'GSTIN Code' : 'जीएसटी नंबर (GSTIN)'}
              </label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                placeholder="07AAAAA1111A1Z1"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'EN' ? 'Email Address' : 'ईमेल आईडी'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'EN' ? 'Physical Billing Address' : 'बिलिंग पता (Address)'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No, Sector, Area, Delhi"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'EN' ? 'Internal Customer Notes' : 'ग्राहक के बारे में आंतरिक नोट'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any special pricing agreements or references..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 resize-none focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button type="submit" className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all cursor-pointer">
                {lang === 'EN' ? 'Save Customer' : 'ग्राहक सुरक्षित करें'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer list Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200/80 rounded-2xl p-5.5 hover:shadow-2xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-tight">{c.name}</h4>
                  <span className="font-mono text-[9px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 mt-1 inline-block">
                    {c.id}
                  </span>
                </div>
                {c.outstandingBalance > 0 ? (
                  <span className="inline-flex items-center gap-1 bg-red-50 border border-red-100 text-red-700 text-[10px] font-mono font-bold px-2 py-1 rounded-md">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    ₹{c.outstandingBalance.toLocaleString()} Dues
                  </span>
                ) : (
                  <span className="bg-green-50 border border-green-100 text-green-700 text-[10px] font-mono font-bold px-2 py-1 rounded-md">
                    No Outstanding
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>GST: <span className="font-mono font-bold text-slate-700">{c.gst || 'N/A'}</span></span>
                </div>
                {c.email && c.email !== 'N/A' && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                {c.address && c.address !== 'N/A' && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug line-clamp-2">{c.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-semibold">
                {lang === 'EN' ? `Total Jobs: ${c.ordersCount}` : `कुल कार्य: ${c.ordersCount}`}
              </span>
              <div className="font-mono text-slate-400 text-[10px]">
                {c.notes && c.notes !== 'N/A' ? (
                  <span className="truncate max-w-[200px] block" title={c.notes}>
                    💬 {c.notes}
                  </span>
                ) : (
                  'No notes logged'
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-2 text-center p-12 bg-white border border-slate-200/80 rounded-2xl text-slate-400 shadow-3xs">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No customers matched your search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
