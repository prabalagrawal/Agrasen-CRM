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
                <span className="text-red-650 font-mono">2.1</span> Relational Database & Entity Relationship Model
              </h3>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                The database is a highly normalized relational model designed in <strong>PostgreSQL</strong> via <strong>Prisma ORM</strong> to guarantee referential integrity, strong constraints, and scalability. Below are the core enterprise relationships, cascading behaviors, and the official data schema definition:
              </p>

              {/* Relationship Integrity Specs */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-4 shadow-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 font-mono">CORE ENTITY RELATIONSHIPS</h4>
                  <ul className="space-y-2.5 text-xs font-mono text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">1. Customer → Quotations:</span>
                      <span>1-to-Many. Managed via <code>ON DELETE RESTRICT</code> to prevent orphan order records.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">2. Quotation → Products:</span>
                      <span>1-to-Many. Models line items with strict price locks and margin configurations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">3. Quotation → Workflow:</span>
                      <span>1-to-1. Controls the current execution phase from design to final on-site installation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">4. Workflow → Audit Logs:</span>
                      <span>1-to-Many. Captures timestamped state changes, digital checksum hashes, and terminal telemetry.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">5. Workflow → Attachments:</span>
                      <span>1-to-Many. Stores write-protected references to files uploaded securely to Cloudflare R2.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">6. Customer → Payments:</span>
                      <span>1-to-Many. Outstanding balance calculated dynamically; supports multi-mode payments.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">7. Employee → Assigned Jobs:</span>
                      <span>1-to-Many. Real-time task allocation with role restrictions and status transitions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">8. Inventory → Purchase Orders:</span>
                      <span>1-to-Many PO lines tracking suppliers, current rates, and automated stock increments.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-red-50/50 border border-red-200/85 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-950">FILE STORAGE STRATEGY (CLOUDFLARE R2)</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    To prevent bloating the PostgreSQL database, all files (site photos, design drafts, customer signatures, artwork vectors, PDF invoices) are stored in **Cloudflare R2**. 
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The database stores strictly structured metadata for each uploaded asset. File delivery is permission-checked at the NestJS gateway, generating **short-lived signed URLs** instead of permanent public routes.
                  </p>
                  <div className="bg-white border border-slate-200 rounded-xl p-3 font-mono text-[10px] text-slate-800 space-y-1 shadow-2xs">
                    <span className="font-bold text-red-700 block mb-1">R2 Database Metadata Schema:</span>
                    <div>• <code>id: UUID</code> (Primary Key)</div>
                    <div>• <code>originalName: String</code> (Original File Name)</div>
                    <div>• <code>storageKey: String UNIQUE</code> (R2 Object Key)</div>
                    <div>• <code>mimeType: String</code> (Validation filter, e.g. image/png)</div>
                    <div>• <code>size: Int</code> (Strict validation up to 25MB)</div>
                    <div>• <code>checksum: String</code> (SHA-256 for data verification)</div>
                    <div>• <code>uploadedById: UUID REFERENCES Employees(id)</code></div>
                    <div>• <code>relatedRecordId: UUID</code> (Polymorphic Relation Identifier)</div>
                  </div>
                </div>
              </div>

              {/* Prisma Schema Display */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 font-display">Prisma Schema Definition (Production-Grade Modeling)</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 border border-slate-800 rounded-2xl font-mono text-xs bg-slate-950 text-slate-300 leading-relaxed shadow-lg overflow-x-auto">
                    <span className="text-yellow-500 font-bold">model</span> <span className="text-emerald-400 font-bold">Customer</span> &#123;
                    <br />&nbsp;&nbsp;id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@id @default(uuid()) @db.Uuid
                    <br />&nbsp;&nbsp;name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String
                    <br />&nbsp;&nbsp;phone &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@unique
                    <br />&nbsp;&nbsp;gstin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String? &nbsp;&nbsp;&nbsp;&nbsp;@db.VarChar(15)
                    <br />&nbsp;&nbsp;address &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String?
                    <br />&nbsp;&nbsp;quotations &nbsp;&nbsp;Quotation[]
                    <br />&nbsp;&nbsp;payments &nbsp;&nbsp;&nbsp;&nbsp;Payment[]
                    <br />&nbsp;&nbsp;createdAt &nbsp;&nbsp;&nbsp;DateTime &nbsp;&nbsp;&nbsp;@default(now())
                    <br />&#125;
                    <br />
                    <br /><span className="text-yellow-500 font-bold">model</span> <span className="text-emerald-400 font-bold">Quotation</span> &#123;
                    <br />&nbsp;&nbsp;id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@id @default(uuid()) @db.Uuid
                    <br />&nbsp;&nbsp;customerId &nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@db.Uuid
                    <br />&nbsp;&nbsp;customer &nbsp;&nbsp;&nbsp;&nbsp;Customer &nbsp;&nbsp;&nbsp;@relation(fields: [customerId], references: [id], onDelete: Restrict)
                    <br />&nbsp;&nbsp;products &nbsp;&nbsp;&nbsp;&nbsp;Product[]
                    <br />&nbsp;&nbsp;workflow &nbsp;&nbsp;&nbsp;&nbsp;Workflow?
                    <br />&nbsp;&nbsp;totalAmount &nbsp;Decimal &nbsp;&nbsp;&nbsp;&nbsp;@db.Decimal(10, 2)
                    <br />&nbsp;&nbsp;createdAt &nbsp;&nbsp;&nbsp;DateTime &nbsp;&nbsp;&nbsp;@default(now())
                    <br />&#125;
                  </div>

                  <div className="p-5 border border-slate-800 rounded-2xl font-mono text-xs bg-slate-950 text-slate-300 leading-relaxed shadow-lg overflow-x-auto">
                    <span className="text-yellow-500 font-bold">model</span> <span className="text-emerald-400 font-bold">Workflow</span> &#123;
                    <br />&nbsp;&nbsp;id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@id @default(uuid()) @db.Uuid
                    <br />&nbsp;&nbsp;quotationId &nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@unique @db.Uuid
                    <br />&nbsp;&nbsp;quotation &nbsp;&nbsp;&nbsp;Quotation &nbsp;&nbsp;@relation(fields: [quotationId], references: [id], onDelete: Cascade)
                    <br />&nbsp;&nbsp;currentStage String
                    <br />&nbsp;&nbsp;isLocked &nbsp;&nbsp;&nbsp;&nbsp;Boolean &nbsp;&nbsp;&nbsp;&nbsp;@default(false)
                    <br />&nbsp;&nbsp;attachments &nbsp;Attachment[]
                    <br />&nbsp;&nbsp;auditLogs &nbsp;&nbsp;&nbsp;AuditLog[]
                    <br />&nbsp;&nbsp;updatedAt &nbsp;&nbsp;&nbsp;DateTime &nbsp;&nbsp;&nbsp;@updatedAt
                    <br />&#125;
                    <br />
                    <br /><span className="text-yellow-500 font-bold">model</span> <span className="text-emerald-400 font-bold">Attachment</span> &#123;
                    <br />&nbsp;&nbsp;id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@id @default(uuid()) @db.Uuid
                    <br />&nbsp;&nbsp;workflowId &nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@db.Uuid
                    <br />&nbsp;&nbsp;workflow &nbsp;&nbsp;&nbsp;&nbsp;Workflow &nbsp;&nbsp;&nbsp;@relation(fields: [workflowId], references: [id], onDelete: Cascade)
                    <br />&nbsp;&nbsp;originalName String
                    <br />&nbsp;&nbsp;storageKey &nbsp;&nbsp;String &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@unique
                    <br />&nbsp;&nbsp;mimeType &nbsp;&nbsp;&nbsp;&nbsp;String
                    <br />&nbsp;&nbsp;size &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Int
                    <br />&nbsp;&nbsp;checksum &nbsp;&nbsp;&nbsp;&nbsp;String
                    <br />&nbsp;&nbsp;uploadedBy &nbsp;&nbsp;String
                    <br />&nbsp;&nbsp;createdAt &nbsp;&nbsp;&nbsp;DateTime &nbsp;&nbsp;&nbsp;@default(now())
                    <br />&#125;
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
                <span className="text-red-650 font-mono">3.1</span> Enterprise SaaS Production Architecture
              </h3>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                The production deployment of ABMS leverages a micro-services friendly, high-availability architecture designed to support millions of records and seamless multi-branch operations:
              </p>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4.5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <div className="text-red-650 font-mono font-black text-[9px] uppercase tracking-wider">TIER 1 — FRONTEND</div>
                  <h4 className="font-extrabold text-xs text-slate-900 font-display">Next.js (App Router) + shadcn</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    A statically pre-rendered React workspace styled with Tailwind CSS, leveraging modular layouts, absolute path aliases, responsive views, and localized translation contexts (Hindi/English).
                  </p>
                </div>
                
                <div className="p-4.5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <div className="text-red-650 font-mono font-black text-[9px] uppercase tracking-wider">TIER 2 — BACKEND</div>
                  <h4 className="font-extrabold text-xs text-slate-900 font-display">NestJS Core REST & WebSockets</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Built on NestJS for clean Dependency Injection, central error boundary filters, strict class-validator decorators, and real-time operational socket events (WebSockets).
                  </p>
                </div>

                <div className="p-4.5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <div className="text-red-650 font-mono font-black text-[9px] uppercase tracking-wider">TIER 3 — PERSISTENCE</div>
                  <h4 className="font-extrabold text-xs text-slate-900 font-display">PostgreSQL + Prisma ORM</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Fully normalized database engine. Implements standard transaction execution scopes, automated schema migrations, indexing, and strict constraints (Prisma).
                  </p>
                </div>

                <div className="p-4.5 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <div className="text-red-650 font-mono font-black text-[9px] uppercase tracking-wider">CACHE & QUEUES</div>
                  <h4 className="font-extrabold text-xs text-slate-900 font-display">Redis + BullMQ Pipelines</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Facilitates low-latency cache stores and handles asynchronous workloads (automated PDF reports generator, WhatsApp approvals, and follow-up email campaigns).
                  </p>
                </div>
              </div>
            </div>

            {/* Security Protocols */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2 font-display">
                <span className="text-red-650 font-mono">3.2</span> Security, Authentication, & Compliance Protocol
              </h3>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-5 border border-red-100 bg-red-50/20 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-950 flex items-center gap-1.5 font-mono">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-650 shrink-0" />
                    ENTERPRISE SECURITY CONTROLS
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-semibold">
                    <li>• <strong className="text-slate-900">RBAC:</strong> Role-Based Access Control verified at API routes level (Owner, Manager, Designer, Operator, Delivery).</li>
                    <li>• <strong className="text-slate-900">Token Auth:</strong> Dual Token System (JWT Access Tokens & Refresh Tokens) delivered via HttpOnly, Secure, SameSite=Strict cookies.</li>
                    <li>• <strong className="text-slate-900">SQLi & XSS:</strong> Auto-escaped inputs via Prisma queries, strict string sanitizers, and secure content security policies headers.</li>
                    <li>• <strong className="text-slate-900">Rate Limiting:</strong> IP-based request throttlers on public API paths and login routes (NestJS Throttler).</li>
                    <li>• <strong className="text-slate-900">Malware Scanning:</strong> Sandboxed file stream validation before files are dispatched to Cloudflare R2 storage.</li>
                  </ul>
                </div>

                <div className="p-5 border border-slate-200 bg-slate-50 rounded-2xl space-y-3 font-mono text-[11px] text-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-sans">SaaS PREPAREDNESS & EXTENSIBILITY</h4>
                  <p className="leading-relaxed">
                    Designed with future-proof abstractions (SOLID, Repository Pattern, and modular Service Providers) to support subsequent feature growth without rewrite overhead:
                  </p>
                  <ul className="space-y-1 text-[10px] text-slate-600">
                    <li>• <strong>Multi-Tenancy:</strong> Tenant ID scoping implemented in database indexes.</li>
                    <li>• <strong>Multi-Warehouse:</strong> Inventory tracking maps rolls to specific warehouse racks.</li>
                    <li>• <strong>WhatsApp & Email:</strong> Clean webhook controller interfaces ready for Twilio/Meta Business integrations.</li>
                    <li>• <strong>Scanner Support:</strong> Fields optimized for rapid keyboard-emulated QR/Barcode scanner inputs.</li>
                  </ul>
                </div>
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
