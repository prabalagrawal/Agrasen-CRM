/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Briefcase, RefreshCw, Star } from 'lucide-react';

interface ReportsPanelProps {
  lang: 'EN' | 'HI';
}

export default function ReportsPanel({ lang }: ReportsPanelProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visual Analytics top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: lang === 'EN' ? 'Monthly Target Revenue' : 'मासिक राजस्व लक्ष्य', val: '₹12,45,000', change: '+14% target', color: 'text-red-650' },
          { label: lang === 'EN' ? 'Net Operating Margin' : 'शुद्ध परिचालन लाभ', val: '32.4%', change: '+2.5% YoY', color: 'text-emerald-600' },
          { label: lang === 'EN' ? 'Active Repeat Customers' : 'नियमित ग्राहक संख्या', val: '86%', change: 'High loyalty', color: 'text-blue-600' },
          { label: lang === 'EN' ? 'Avg Execution Time' : 'औसत कार्य समापन समय', val: '1.8 Days', change: '-4 hours shift', color: 'text-purple-600' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider">{kpi.label}</div>
            <div className={`text-xl md:text-2xl font-black mt-2 font-display ${kpi.color}`}>{kpi.val}</div>
            <div className="text-[9px] font-mono text-slate-400 mt-2 font-semibold">✓ {kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Revenue Trend custom SVG Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-display">
              <TrendingUp className="w-4.5 h-4.5 text-red-600" />
              {lang === 'EN' ? 'Revenue Progression (Last 6 Months)' : 'राजस्व प्रगति (पिछले 6 महीने)'}
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">Values in Lakhs</span>
          </div>

          {/* SVG Line & Bar Chart Combo */}
          <div className="relative h-48 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Chart bars for monthly sales */}
              {/* Feb (4L) */}
              <rect x="70" y="100" width="30" height="70" fill="#f87171" rx="4" opacity="0.3" />
              {/* Mar (5.5L) */}
              <rect x="140" y="75" width="30" height="95" fill="#f87171" rx="4" opacity="0.3" />
              {/* Apr (7L) */}
              <rect x="210" y="50" width="30" height="120" fill="#f87171" rx="4" opacity="0.3" />
              {/* May (6L) */}
              <rect x="280" y="65" width="30" height="105" fill="#f87171" rx="4" opacity="0.3" />
              {/* Jun (9.5L) */}
              <rect x="350" y="30" width="30" height="140" fill="#dc2626" rx="4" />
              {/* Jul (Current - 12.4L) */}
              <rect x="420" y="15" width="30" height="155" fill="#ef4444" rx="4" />

              {/* Data Trend line */}
              <path
                d="M 85 100 L 155 75 L 225 50 L 295 65 L 365 30 L 435 15"
                fill="none"
                stroke="#0f172a"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="85" cy="100" r="4.5" fill="#0f172a" />
              <circle cx="155" cy="75" r="4.5" fill="#0f172a" />
              <circle cx="225" cy="50" r="4.5" fill="#0f172a" />
              <circle cx="295" cy="65" r="4.5" fill="#0f172a" />
              <circle cx="365" cy="30" r="4.5" fill="#0f172a" />
              <circle cx="435" cy="15" r="4.5" fill="#0f172a" />

              {/* Labels */}
              <text x="85" y="190" textAnchor="middle" className="text-[10px] font-mono fill-slate-400 font-bold">Feb</text>
              <text x="155" y="190" textAnchor="middle" className="text-[10px] font-mono fill-slate-400 font-bold">Mar</text>
              <text x="225" y="190" textAnchor="middle" className="text-[10px] font-mono fill-slate-400 font-bold">Apr</text>
              <text x="295" y="190" textAnchor="middle" className="text-[10px] font-mono fill-slate-400 font-bold">May</text>
              <text x="365" y="190" textAnchor="middle" className="text-[10px] font-mono fill-slate-400 font-bold">Jun</text>
              <text x="435" y="190" textAnchor="middle" className="text-[10px] font-mono fill-slate-500 font-extrabold">Jul</text>

              {/* Y-axis metrics */}
              <text x="30" y="24" textAnchor="end" className="text-[9px] font-mono fill-slate-400 font-bold">₹15L</text>
              <text x="30" y="74" textAnchor="end" className="text-[9px] font-mono fill-slate-400 font-bold">₹10L</text>
              <text x="30" y="124" textAnchor="end" className="text-[9px] font-mono fill-slate-400 font-bold">₹5L</text>
              <text x="30" y="174" textAnchor="end" className="text-[9px] font-mono fill-slate-400 font-bold">0</text>
            </svg>
          </div>
        </div>

        {/* Product Sales Share Donut SVG Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-display">
              <BarChart3 className="w-4.5 h-4.5 text-red-600" />
              {lang === 'EN' ? 'Product Revenue Distribution' : 'उत्पाद राजस्व वितरण शेयर'}
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">FY 2026-27</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* SVG Donut Circle */}
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                
                {/* ACP/LED Letters segment (45%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#dc2626" strokeWidth="4"
                        strokeDasharray="45 55" strokeDashoffset="0" />
                
                {/* Flex Banners (30%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0f172a" strokeWidth="4"
                        strokeDasharray="30 70" strokeDashoffset="-45" />

                {/* Vinyl Filming (15%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="4"
                        strokeDasharray="15 85" strokeDashoffset="-75" />

                {/* Commercial Cards & Stationery (10%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cbd5e1" strokeWidth="4"
                        strokeDasharray="10 90" strokeDashoffset="-90" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-slate-900 leading-none">₹52.4L</span>
                <span className="text-[8px] font-mono font-bold uppercase text-slate-400 mt-1">Total Sales</span>
              </div>
            </div>

            {/* Custom legends list */}
            <div className="space-y-2.5 text-xs font-mono font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-red-600 block shrink-0" />
                <span className="text-slate-600 text-[11px]">ACP & LED Board (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-900 block shrink-0" />
                <span className="text-slate-600 text-[11px]">Flex Banners (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-500 block shrink-0" />
                <span className="text-slate-600 text-[11px]">Vinyl Printing (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-200 block shrink-0" />
                <span className="text-slate-400 text-[11px]">Cards & Pamphlets (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of secondary statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Repeat Customer Rate */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-3 font-display">Customer Return Rate</h4>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-red-600 rounded-full" style={{ width: '86%' }} />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            86% of monthly banner and offset printing clients are repeat corporate accounts (Mittal Sarees, Sharma Sweets).
          </p>
        </div>

        {/* Employee Productivity */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-3 font-display">Floor Printer Uptime</h4>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-slate-900 rounded-full" style={{ width: '92%' }} />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Spectra & Roland plotters operated at 92% planned schedule capacity, limited only by reported calibration tickets.
          </p>
        </div>

        {/* Material Usage Index */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-3 font-display">Material Yield / Scrap Ratio</h4>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '94%' }} />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Yield stands at 94.2% following scrap roll reuse locks, keeping raw waste below standard industry limits.
          </p>
        </div>
      </div>
    </div>
  );
}
