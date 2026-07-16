/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tag, AlertOctagon, HelpCircle, UserPlus, CheckSquare, MessageSquare } from 'lucide-react';
import { Ticket, TicketType, TicketStatus } from '../types';

interface TicketSystemProps {
  tickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus, note?: string) => void;
  lang: 'EN' | 'HI';
}

export default function TicketSystem({ tickets, onAddTicket, onUpdateTicketStatus, lang }: TicketSystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TicketType>('Machine Issue');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');

  // Selected ticket notes sidebar state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTicket: Ticket = {
      id: `TCK-00${tickets.length + 1}`,
      title,
      type,
      description,
      raisedBy: 'Rahul Verma (Operator)',
      raisedByRole: 'Operator',
      status: 'Open',
      priority,
      createdDate: new Date().toISOString().split('T')[0],
      notes: [],
    };

    onAddTicket(newTicket);
    setShowAddForm(false);
    // Reset Form
    setTitle('');
    setDescription('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote || !selectedTicketId) return;

    onUpdateTicketStatus(selectedTicketId, selectedTicket?.status || 'Open', newNote);
    setNewNote('');
  };

  const handleStatusChange = (status: TicketStatus) => {
    if (!selectedTicketId) return;
    onUpdateTicketStatus(selectedTicketId, status);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Ticket List directory column */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-5 h-5 text-red-600" />
              {lang === 'EN' ? 'Active Floor Tickets & Issues' : 'सक्रिय फ़्लोर टिकट और शिकायतें'}
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm"
            >
              Raise Ticket
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4 animate-fadeIn">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Raise New Machine or Stock Alert</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Printer head 2 jammed"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ticket Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Machine Issue">Machine/Hardware Damage</option>
                    <option value="Printer Error">Plotter Calibration Error</option>
                    <option value="Need Material">Material Shortage / Stock Alert</option>
                    <option value="Site Issue">On-site Fitment Problem</option>
                    <option value="Electricity Issue">Power Cut / Backup Issue</option>
                    <option value="Customer Complaint">Customer Direct Rejection</option>
                    <option value="Other">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Spec</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Explain exactly what happened, and if production is completely stopped."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white resize-none focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-semibold text-slate-700">Urgency Level:</span>
                  {['Low', 'Medium', 'High'].map((p) => (
                    <label key={p} className="flex items-center gap-1.5 cursor-pointer text-xs select-none font-medium text-slate-800">
                      <input
                        type="radio"
                        name="priority"
                        checked={priority === p}
                        onChange={() => setPriority(p as any)}
                        className="accent-red-600"
                      />
                      {p}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-xs">
                    File Ticket
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Ticket Listing Grid */}
          <div className="space-y-3.5">
            {tickets.map((t) => {
              const isOpen = t.status === 'Open' || t.status === 'Assigned' || t.status === 'In Progress';
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4.5 border rounded-2xl cursor-pointer transition-all ${
                    selectedTicketId === t.id
                      ? 'border-red-600 bg-red-50/5 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-55/10'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{t.title}</span>
                        <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md font-bold">
                          {t.id}
                        </span>
                        {t.priority === 'High' && (
                          <span className="bg-red-50 border border-red-100 text-red-700 font-extrabold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Critical Alert
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1.5 font-medium">
                        Category: {t.type} — raised by {t.raisedBy}
                      </span>
                    </div>

                    {/* Status Pill color mapping */}
                    <span
                      className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border shrink-0 ${
                        t.status === 'Open'
                          ? 'bg-orange-50 border-orange-200 text-orange-700'
                          : t.status === 'In Progress'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-green-50 border-green-200 text-green-700'
                      }`}
                    >
                      ● {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-655 mt-2.5 pl-3 border-l-2 border-slate-200 line-clamp-2">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                    <span className="font-mono">Date Filed: {t.createdDate}</span>
                    <span>•</span>
                    <span>Notes: {t.notes.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ticket Sidebar detailing notes and resolution logs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        {selectedTicket ? (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <span className="font-mono text-[9px] text-slate-550 bg-slate-100 px-1.5 py-0.5 rounded-md font-bold">
                Active Ticket Code: {selectedTicket.id}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-3 font-display">{selectedTicket.title}</h3>
              <p className="text-xs text-slate-600 mt-2.5 font-mono bg-slate-50 p-3 rounded-xl border border-slate-150">
                {selectedTicket.description}
              </p>
            </div>

            {/* Change Status Admin Box */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-700 block">Move Ticket Status Workflow:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'] as TicketStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-1 px-2.5 border rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      selectedTicket.status === st
                        ? 'bg-red-600 border-red-600 text-white shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes history thread */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                Comments & Resolution Updates
              </h4>
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                {selectedTicket.notes.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 font-mono">No comments posted yet. Add logs below.</p>
                ) : (
                  selectedTicket.notes.map((n) => (
                    <div key={n.id} className="p-3 border border-slate-150 rounded-xl bg-slate-50 text-[11px]">
                      <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
                        <span className="font-bold text-slate-800">{n.author}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment logging form */}
            <form onSubmit={handleAddNote} className="pt-4 border-t border-slate-100 space-y-2">
              <input
                type="text"
                required
                placeholder="Log progress, or close remarks..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Log Update
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 space-y-3 my-auto">
            <AlertOctagon className="w-12 h-12 mx-auto text-slate-300" />
            <div>
              <p className="text-sm font-bold text-slate-700">No Ticket Selected</p>
              <p className="text-[10px] text-slate-500 max-w-[180px] mx-auto mt-1 leading-relaxed">
                Select any active ticket from the directory list on the left to edit its status or post resolution comments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
