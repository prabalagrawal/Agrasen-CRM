/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  Briefcase,
  Layers,
  HelpCircle,
  UserCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Job, Material, Ticket, FollowUp, JobStatus } from '../types';

interface OwnerDashboardProps {
  jobs: Job[];
  materials: Material[];
  tickets: Ticket[];
  followUps: FollowUp[];
  onUpdateJobStatus: (id: string, status: JobStatus) => void;
  onAddJob: (job: { title: string; description: string; cost: number; customerName: string }) => void;
  lang: 'EN' | 'HI';
}

export default function OwnerDashboard({
  jobs,
  materials,
  tickets,
  followUps,
  onUpdateJobStatus,
  onAddJob,
  lang,
}: OwnerDashboardProps) {
  // New Quick Job states
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCust, setQuickCust] = useState('');
  const [quickCost, setQuickCost] = useState(2500);
  const [quickDesc, setQuickDesc] = useState('');

  const handleCreateQuickJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle || !quickCust) return;

    onAddJob({
      title: quickTitle,
      description: quickDesc || 'Quick job logged from Owner dashboard.',
      cost: quickCost,
      customerName: quickCust,
    });

    setQuickTitle('');
    setQuickCust('');
    setQuickDesc('');
    setShowAddJobForm(false);
  };

  const activeJobs = jobs.filter((j) => j.status !== 'Completed');
  const completedJobs = jobs.filter((j) => j.status === 'Completed');
  const totalRevenue = jobs.reduce((sum, j) => sum + j.cost, 0);
  const pendingPayments = jobs.filter((j) => j.status !== 'Completed').reduce((sum, j) => sum + j.cost, 0);

  // Filter low stock rolls
  const lowStocks = materials.filter((m) => m.stockLevel <= m.minStockLevel);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI statistics block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          {
            label: lang === 'EN' ? 'Revenue' : 'कुल आय',
            val: `₹${totalRevenue.toLocaleString()}`,
            desc: lang === 'EN' ? 'Invoice Value Generated' : 'कुल जनरेट इनवॉइस',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          },
          {
            label: lang === 'EN' ? 'Pending Jobs' : 'सक्रिय कार्य (Pending)',
            val: activeJobs.length.toString(),
            desc: lang === 'EN' ? 'Currently in work pipelines' : 'पाइपलाइन में जारी काम',
            icon: Briefcase,
            color: 'text-red-600 bg-red-50 border-red-100',
          },
          {
            label: lang === 'EN' ? 'Stock Warnings' : 'स्टॉक चेतावनी',
            val: lowStocks.length.toString(),
            desc: lang === 'EN' ? 'Items under safe minimum' : 'न्यूनतम स्टॉक से कम',
            icon: Layers,
            color: 'text-amber-600 bg-amber-50 border-amber-100',
          },
          {
            label: lang === 'EN' ? 'Outstanding Payments' : 'बकाया भुगतान',
            val: `₹${pendingPayments.toLocaleString()}`,
            desc: lang === 'EN' ? 'Dues from pending jobs' : 'लंबित कार्यों से वसूली',
            icon: Clock,
            color: 'text-slate-900 bg-slate-50 border-slate-200',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs transition-all hover:shadow-xs">
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider">{kpi.label}</div>
                <div className="text-xl md:text-2xl font-display font-extrabold text-slate-900 mt-1.5">{kpi.val}</div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{kpi.desc}</p>
              </div>
              <div className={`p-3 rounded-xl border ${kpi.color} shadow-3xs`}>
                <Icon className="w-5.5 h-5.5 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of panels (Jobs pipeline, low stocks, tickets) */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Core Jobs Pipeline Kanban list */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-red-600" />
              {lang === 'EN' ? 'Operational Jobs Pipeline' : 'कार्य प्रवाह नियंत्रण (Jobs)'}
            </h3>
            <button
              onClick={() => setShowAddJobForm(!showAddJobForm)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-sm"
            >
              Quick Log Job
            </button>
          </div>

          {showAddJobForm && (
            <form onSubmit={handleCreateQuickJob} className="mb-6 p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4 animate-fadeIn">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" />
                Log Approved Signage/Flex order
              </h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohini Sec 3 ACP Signage Board"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={quickCost}
                    onChange={(e) => setQuickCost(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Customer / Client *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Sweets & Caterers"
                    value={quickCust}
                    onChange={(e) => setQuickCust(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Brief Description</label>
                  <input
                    type="text"
                    placeholder="Size parameters, materials, etc..."
                    value={quickDesc}
                    onChange={(e) => setQuickDesc(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-xs cursor-pointer">
                  Log Job
                </button>
              </div>
            </form>
          )}

          {/* Jobs Timeline list */}
          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {activeJobs.map((j) => (
              <div key={j.id} className="p-4 border border-slate-200/80 rounded-2xl hover:shadow-2xs hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm leading-tight">{j.title}</span>
                    <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold border border-slate-200">
                      {j.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">Client: <span className="font-semibold text-slate-800">{j.customerName}</span></div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Deadline: <strong className="text-red-600">{j.deadline}</strong> — Cost: <span className="font-bold text-slate-800">₹{j.cost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Workflow state adjustment controller */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Move to:</span>
                  <select
                    value={j.status}
                    onChange={(e) => onUpdateJobStatus(j.id, e.target.value as any)}
                    className="text-[10px] font-sans font-bold bg-white border border-slate-200 text-slate-700 rounded-xl p-2 focus:ring-2 focus:ring-red-500 focus:outline-hidden shadow-3xs cursor-pointer hover:bg-slate-50"
                  >
                    <option value="Quotation">Quotation</option>
                    <option value="Approved">Approved</option>
                    <option value="Design">Designing</option>
                    <option value="Printing">Printing</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Installation">Installation</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}

            {activeJobs.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-12 font-mono">All jobs executed! No active pipelines.</p>
            )}
          </div>
        </div>

        {/* Side Panel: Low Stock & Active tickets */}
        <div className="space-y-6">
          {/* Low stock indicators */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              Low Stock Alert Ledgers
            </h3>

            <div className="space-y-3.5">
              {lowStocks.map((m) => (
                <div key={m.id} className="p-3 border border-amber-100 bg-amber-50/25 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">Threshold: {m.minStockLevel} {m.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-red-600 text-sm">
                      {m.stockLevel} {m.unit}
                    </span>
                    {/* Log supplier order simulated button */}
                    <button
                      onClick={() => alert(`Supplier purchase email auto-drafted to ${m.supplier} for standard 1000 ${m.unit} restocking.`)}
                      className="text-[9px] font-bold font-mono bg-slate-950 text-white rounded-lg px-2.5 py-1 mt-1.5 block hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Reorder Alert
                    </button>
                  </div>
                </div>
              ))}

              {lowStocks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6 font-mono">Stock levels normal. All materials safe.</p>
              )}
            </div>
          </div>

          {/* Floor tickets */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600 shrink-0" />
              Unresolved Floor Tickets ({tickets.filter((t) => t.status !== 'Closed').length})
            </h3>

            <div className="space-y-3.5">
              {tickets
                .filter((t) => t.status !== 'Closed')
                .map((t) => (
                  <div key={t.id} className="p-3.5 border border-slate-200/80 rounded-xl bg-slate-50/50 text-xs space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-900 truncate max-w-[140px]">{t.title}</span>
                      <span className="text-[8px] font-mono font-bold text-red-600 uppercase bg-red-50 border border-red-100 px-2 py-0.5 rounded-md shrink-0">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{t.description}</p>
                    <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                      <span>By: {t.raisedBy}</span>
                      <span>Filed: {t.createdDate}</span>
                    </div>
                  </div>
                ))}

              {tickets.filter((t) => t.status !== 'Closed').length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6 font-mono">All machine tickets closed and resolved.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
