/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Database, ShieldAlert, Cpu, Calendar, ChevronRight, CheckCircle, HelpCircle } from 'lucide-react';

export default function SystemBlueprints() {
  const [activeTab, setActiveTab] = useState<'srs' | 'db' | 'arch' | 'wireframe' | 'roadmap'>('srs');

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden" id="blueprints-container">
      {/* Blueprint Header */}
      <div className="bg-slate-900 p-6.5 text-white border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <BookOpen className="w-8.5 h-8.5 text-red-500" />
          <div>
            <h2 className="text-2xl font-black tracking-tight font-display">ABMS: System Blueprint & SRS</h2>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">Agrasen Business Management System — Software Architecture Design & Specifications</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50 px-4">
        {[
          { id: 'srs', label: '1. SRS & Business Analysis', icon: BookOpen },
          { id: 'db', label: '2. Database & Roles', icon: Database },
          { id: 'arch', label: '3. Architecture & Security', icon: Cpu },
          { id: 'roadmap', label: '4. Development Roadmap', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-red-650 text-red-650 bg-white shadow-2xs font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-8">
        {activeTab === 'srs' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">1.1</span> Business Analysis & Challenges
              </h3>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                <strong>Agrasen Flex Printers</strong> has stood as a reliable name in the printing, branding, and signage ecosystem for over 20 years. 
                However, scaling operations has reached a ceiling due to reliance on manual processing channels: phone logs, paper ledger logs, 
                untracked WhatsApp messages, and unrecorded pricing calculations. This results in missing invoices, scheduling conflicts, printing errors (wrong dimensions/materials), and inventory black holes.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-red-50 border border-red-200/60 rounded-2xl">
                  <h4 className="text-sm font-black text-red-950 mb-2.5 uppercase tracking-wide font-sans">Key Operational Friction Points</h4>
                  <ul className="space-y-2 text-xs text-red-900/95 list-disc list-inside font-bold">
                    <li><strong>Pricing Leakage:</strong> Custom pricing calculated verbally, leading to inconsistent margins or under-billing.</li>
                    <li><strong>Tracking Blind Spots:</strong> No real-time status of design approvals. Designers print without customer approval.</li>
                    <li><strong>Inventory Bottlenecks:</strong> Solvent ink, LED modules, and special flex rolls running dry mid-job.</li>
                    <li><strong>Delivery Gaps:</strong> Outgoing shipments lack dispatch signatures, leading to payment disputes.</li>
                  </ul>
                </div>
                
                <div className="p-5 bg-green-50 border border-green-200/60 rounded-2xl">
                  <h4 className="text-sm font-black text-green-950 mb-2.5 uppercase tracking-wide font-sans">Strategic Improvements Proposed</h4>
                  <ul className="space-y-2 text-xs text-green-900/95 list-disc list-inside font-bold">
                    <li><strong>Configurable Dynamic Calculators:</strong> Standardize pricing across estimators with lockable margins.</li>
                    <li><strong>Automated Job Lifecycle Workflows:</strong> Strict pipeline transition locks (Approved → Design → Printing).</li>
                    <li><strong>Low-Stock Interlocks:</strong> Jobs requiring specific materials are automatically flagged if stock levels are critical.</li>
                    <li><strong>Two-Phase Delivery Auditing:</strong> Verification of materials inbound and recipient signature outbound.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">1.2</span> Missing & Identified Requirements
              </h3>
              <p className="text-sm text-slate-600 mb-4.5 leading-relaxed font-medium">
                During deep-dive product scoping, we identified several critical real-world requirements that were not included in the initial spec but are vital for a modern heavy-duty signage operation:
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="p-4.5 border border-slate-200 rounded-2xl bg-slate-50/50">
                  <h5 className="text-xs font-black font-mono text-slate-900 mb-1.5 uppercase tracking-wide">1. Scrap/Waste Tracking</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Flex rolls and ACP sheets are often cut into odd sizes. Tracking off-cut scrap sizes preserves material for future small jobs and blocks unauthorized material sales.
                  </p>
                </div>
                <div className="p-4.5 border border-slate-200 rounded-2xl bg-slate-50/50">
                  <h5 className="text-xs font-black font-mono text-slate-900 mb-1.5 uppercase tracking-wide">2. Power Outage Logging</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Industrial printing machines suffer damages if power drops mid-print. Logging electricity cuts allows managers to reschedule shifts and audit UPS/Generator health.
                  </p>
                </div>
                <div className="p-4.5 border border-slate-200 rounded-2xl bg-slate-50/50">
                  <h5 className="text-xs font-black font-mono text-slate-900 mb-1.5 uppercase tracking-wide">3. Customer Proofing Portal</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    A simple mobile link for customers to approve or reject designs with a timestamp. This creates an unshakeable audit trail before printing starts.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">1.3</span> Functional Specifications (SRS Highlights)
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'SRS-F-01: Multi-role Bilingual Adaptive UI',
                    desc: 'Instant toggle between English (🇬🇧) and Hindi (🇮🇳). Screens reflow based on the role logged in, suppressing administrative panels from print-room and installation staff.'
                  },
                  {
                    title: 'SRS-F-02: Structured Estimator Hub with Formula Configurator',
                    desc: '11 material-specific calculators tied to a central rate ledger. Admin panel can rewrite sheet rates and base costs dynamically without editing application code.'
                  },
                  {
                    title: 'SRS-F-03: Real-time Ticket Dispatch & Work Order Pipeline',
                    desc: 'Enables floor staff to report printer errors or stock depletions immediately, pausing associated jobs and notifying the manager on priority.'
                  },
                  {
                    title: 'SRS-F-04: Dispatch Logistics with Multi-Phase Audit Trails',
                    desc: 'Logs incoming supplier supplies with photographic verification, and logs outgoing jobs with delivery verification and signatures.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                    <CheckCircle className="w-5.5 h-5.5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'db' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Relational Database Design */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">2.1</span> Relational Database Design (PostgreSQL / Cloud SQL Schema)
              </h3>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                The database is structured to support strong referential integrity, cascading updates, and extensive logging. Below are the key tables designed for production deployment:
              </p>
              
              <div className="space-y-4">
                {/* Tables Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 border border-slate-800 rounded-2xl font-mono text-xs bg-slate-950 text-slate-300 leading-relaxed shadow-lg">
                    <span className="text-yellow-500 font-bold">CREATE TABLE</span> customers (
                    <br />&nbsp;&nbsp;id <span className="text-teal-400">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,
                    <br />&nbsp;&nbsp;name <span className="text-teal-400">VARCHAR(255) NOT NULL</span>,
                    <br />&nbsp;&nbsp;phone <span className="text-teal-400">VARCHAR(15) UNIQUE NOT NULL</span>,
                    <br />&nbsp;&nbsp;gstin <span className="text-teal-400">VARCHAR(15)</span>,
                    <br />&nbsp;&nbsp;address <span className="text-teal-400">TEXT</span>,
                    <br />&nbsp;&nbsp;email <span className="text-teal-400">VARCHAR(255)</span>,
                    <br />&nbsp;&nbsp;created_at <span className="text-teal-400">TIMESTAMP DEFAULT CURRENT_TIMESTAMP</span>
                    <br />);
                  </div>
                  
                  <div className="p-5 border border-slate-800 rounded-2xl font-mono text-xs bg-slate-950 text-slate-300 leading-relaxed shadow-lg">
                    <span className="text-yellow-500 font-bold">CREATE TABLE</span> jobs (
                    <br />&nbsp;&nbsp;id <span className="text-teal-400">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,
                    <br />&nbsp;&nbsp;title <span className="text-teal-400">VARCHAR(255) NOT NULL</span>,
                    <br />&nbsp;&nbsp;customer_id <span className="text-teal-400">UUID REFERENCES customers(id) ON DELETE RESTRICT</span>,
                    <br />&nbsp;&nbsp;assigned_to <span className="text-teal-400">UUID REFERENCES users(id)</span>,
                    <br />&nbsp;&nbsp;status <span className="text-teal-400">VARCHAR(50) NOT NULL</span>,
                    <br />&nbsp;&nbsp;priority <span className="text-teal-400">VARCHAR(20) DEFAULT 'Medium'</span>,
                    <br />&nbsp;&nbsp;deadline <span className="text-teal-400">DATE</span>,
                    <br />&nbsp;&nbsp;total_cost <span className="text-teal-400">NUMERIC(10,2) DEFAULT 0.00</span>
                    <br />);
                  </div>

                  <div className="p-5 border border-slate-800 rounded-2xl font-mono text-xs bg-slate-950 text-slate-300 leading-relaxed shadow-lg">
                    <span className="text-yellow-500 font-bold">CREATE TABLE</span> materials (
                    <br />&nbsp;&nbsp;id <span className="text-teal-400">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,
                    <br />&nbsp;&nbsp;name <span className="text-teal-400">VARCHAR(255) NOT NULL</span>,
                    <br />&nbsp;&nbsp;category <span className="text-teal-400">VARCHAR(50) NOT NULL</span>,
                    <br />&nbsp;&nbsp;stock_qty <span className="text-teal-400">NUMERIC(10,2) DEFAULT 0.00</span>,
                    <br />&nbsp;&nbsp;min_stock_qty <span className="text-teal-400">NUMERIC(10,2) NOT NULL</span>,
                    <br />&nbsp;&nbsp;unit <span className="text-teal-400">VARCHAR(20) NOT NULL</span>,
                    <br />&nbsp;&nbsp;last_price <span className="text-teal-400">NUMERIC(10,2)</span>
                    <br />);
                  </div>

                  <div className="p-5 border border-slate-800 rounded-2xl font-mono text-xs bg-slate-950 text-slate-300 leading-relaxed shadow-lg">
                    <span className="text-yellow-500 font-bold">CREATE TABLE</span> tickets (
                    <br />&nbsp;&nbsp;id <span className="text-teal-400">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,
                    <br />&nbsp;&nbsp;title <span className="text-teal-400">VARCHAR(255) NOT NULL</span>,
                    <br />&nbsp;&nbsp;type <span className="text-teal-400">VARCHAR(50) NOT NULL</span>,
                    <br />&nbsp;&nbsp;raised_by <span className="text-teal-400">UUID REFERENCES users(id)</span>,
                    <br />&nbsp;&nbsp;status <span className="text-teal-400">VARCHAR(30) NOT NULL</span>,
                    <br />&nbsp;&nbsp;priority <span className="text-teal-400">VARCHAR(20)</span>,
                    <br />&nbsp;&nbsp;created_at <span className="text-teal-400">TIMESTAMP DEFAULT CURRENT_TIMESTAMP</span>
                    <br />);
                  </div>
                </div>
              </div>
            </div>

            {/* Role-Based Permissions Matrix */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">2.2</span> User Roles & Permissions Matrix
              </h3>
              
              <div className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80">
                      <th className="p-3.5 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Module / Asset</th>
                      <th className="p-3.5 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Owner (Ramesh)</th>
                      <th className="p-3.5 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Manager (Vikram)</th>
                      <th className="p-3.5 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Reception (Sunita)</th>
                      <th className="p-3.5 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Designer (Amit)</th>
                      <th className="p-3.5 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Operator (Rahul)</th>
                      <th className="p-3.5 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Delivery (Ramu)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-55/5">
                      <td className="p-3.5 font-extrabold text-slate-900">Owner KPIs & Analytics</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                    </tr>
                    <tr className="hover:bg-slate-55/5">
                      <td className="p-3.5 font-extrabold text-slate-900">CRM / Customer Directory</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-slate-500 font-bold">Read Only</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-slate-500 font-bold">Read Only</td>
                    </tr>
                    <tr className="hover:bg-slate-55/5">
                      <td className="p-3.5 font-extrabold text-slate-900">Job Assignment & Deadline</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-blue-600 font-extrabold">Create/View Only</td>
                      <td className="p-3.5 text-slate-500 font-bold">View Only</td>
                      <td className="p-3.5 text-slate-500 font-bold">View Only</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                    </tr>
                    <tr className="hover:bg-slate-55/5">
                      <td className="p-3.5 font-extrabold text-slate-900">Billing, GST Invoices & Quotes</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-slate-500 font-bold">Read Only</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                    </tr>
                    <tr className="hover:bg-slate-55/5">
                      <td className="p-3.5 font-extrabold text-slate-900">Stock Ledger & Supplier Purchase</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-slate-500 font-bold">Read Only</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-blue-600 font-extrabold">Log OUT Only</td>
                      <td className="p-3.5 text-blue-600 font-extrabold">Log IN Only</td>
                    </tr>
                    <tr className="hover:bg-slate-55/5">
                      <td className="p-3.5 font-extrabold text-slate-900">Formula Configurator Rates</td>
                      <td className="p-3.5 text-green-600 font-extrabold">FULL (C-R-U-D)</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                      <td className="p-3.5 text-red-500 font-bold">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'arch' && (
          <div className="space-y-8 animate-fadeIn">
            {/* System Architecture */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">3.1</span> 3-Tier Enterprise Application Architecture
              </h3>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                To guarantee scaling and uptime for the next 10 years, ABMS is structured using a robust 3-Tier architecture running on Cloud Run:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5.5 border border-slate-200 rounded-2xl bg-white shadow-2xs">
                  <div className="text-red-650 font-mono font-black text-[10px] uppercase tracking-wider mb-2">TIER 1 — PRESENTATION LAYER</div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1.5 font-display">React + Vite SPA Client</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    A blazing-fast, mobile-optimized Single Page Application using Tailwind CSS and Lucide React. Integrates local storage for smooth transition tracking and utilizes CSS flexboxes optimized for low-bandwidth 4G connection in workshops.
                  </p>
                </div>
                
                <div className="p-5.5 border border-slate-200 rounded-2xl bg-white shadow-2xs">
                  <div className="text-red-650 font-mono font-black text-[10px] uppercase tracking-wider mb-2">TIER 2 — SERVICES & API LAYER</div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1.5 font-display">Node/Express Core REST API</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Manages authentication, session tracking, validation rules, ticket generation queues, PDF processing, and pricing calculations. Exposes a webhook gateway for future automated WhatsApp follow-ups and CRM syncing.
                  </p>
                </div>

                <div className="p-5.5 border border-slate-200 rounded-2xl bg-white shadow-2xs">
                  <div className="text-red-650 font-mono font-black text-[10px] uppercase tracking-wider mb-2">TIER 3 — PERSISTENCE LAYER</div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1.5 font-display">Cloud SQL & Auth Engine</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Utilizes Cloud SQL (PostgreSQL) for transactional database consistency, paired with Firebase Authentication for passwordless OTP sign-in. Stores binary engineering files (CDR, PDF drafts, photos) inside secure Cloud Storage buckets.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Protocols */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">3.2</span> Security Protocols & Data Protection
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Secure OTP-Based Login',
                    desc: 'Signage operators and delivery boys don\'t use traditional long passwords. Passwordless login with Firebase Authentication via WhatsApp OTP provides zero-friction access while locking down credentials.'
                  },
                  {
                    title: 'Daily Cloud Backup & Snapshotting',
                    desc: 'Database snapshots taken at 11:30 PM (IST) automatically, retained for 1 year. Secondary offline backups can be exported manually via CSV export from the Owner\'s Panel.'
                  },
                  {
                    title: 'System Access Log Audit Trail',
                    desc: 'Every billing update, stock withdrawal, or deadline shift is logged inside an immutable `audit_logs` table with actor UUID, timestamp, ip_address, and previous state.'
                  },
                  {
                    title: 'Edge Caching & Cloudflare Web Application Firewall',
                    desc: 'Mitigates denial-of-service threats, and restricts administrative panels to authorized IP bounds if required by the owner.'
                  }
                ].map((proto, idx) => (
                  <div key={idx} className="p-4.5 border border-red-100 bg-red-50/20 rounded-2xl">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <ShieldAlert className="w-4.5 h-4.5 text-red-650 shrink-0" />
                      {proto.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1.5 pl-6.5 leading-relaxed font-semibold">{proto.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Development Phases */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">4.1</span> Phase-Wise Development Roadmap
              </h3>
              <p className="text-sm text-slate-600 mb-6 font-semibold">
                A progressive 14-week roll-out timeline to transition Agrasen Flex Printers from notebooks to an automated digital workflow without interrupting active client operations:
              </p>
              
              <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-6">
                {[
                  {
                    phase: 'PHASE 1: Core System & Infrastructure Setup (Weeks 1-3)',
                    desc: 'Provisioning Firebase Auth and PostgreSQL on Google Cloud Run. Establishing modular project structure and base internationalization (English/Hindi). Implementing Owner Dashboard views and baseline CRM tables.',
                    status: 'Ready for Implementation'
                  },
                  {
                    phase: 'PHASE 2: Calculators & Work Order Lifecycles (Weeks 4-6)',
                    desc: 'Building all 11 material-specific pricing estimators. Linking estimators to the admin rate control panel. Developing the job dispatch pipeline (Quotation → Approved → Design → Printing → Installation).',
                    status: 'Planned'
                  },
                  {
                    phase: 'PHASE 3: Inventory Control & Floor ticket System (Weeks 7-9)',
                    desc: 'Implementing inventory threshold checks. Adding "Stock In/Out" log forms. Deploying the ticket system for print operators and installers to report immediate machinery issues on the shop floor.',
                    status: 'Planned'
                  },
                  {
                    phase: 'PHASE 4: Billing Engine, Reports & PDF Output (Weeks 10-12)',
                    desc: 'Creating professional GST invoice generator with discount logic and automated outstanding balance ledger. Adding monthly visual analytics charts for Owner revenue tracking.',
                    status: 'Planned'
                  },
                  {
                    phase: 'PHASE 5: Automated WhatsApp & Future AI Engine (Weeks 13-14)',
                    desc: 'Triggering real-time SMS/WhatsApp reminders to customers for design approvals and outstanding dues. Testing Gemini-powered quotation assist to parse raw text orders into line item costs.',
                    status: 'Planned'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-red-500 bg-white" />
                    <h4 className="text-sm font-extrabold text-slate-900 font-display">{item.phase}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">{item.desc}</p>
                    <span className="inline-block mt-2.5 px-2.5 py-1 text-[9px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-700 rounded-md uppercase tracking-wider">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
