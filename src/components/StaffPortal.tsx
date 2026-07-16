/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, ArrowRight, CheckSquare, Image, MessageSquare, AlertCircle, Play, Pause, CheckCircle } from 'lucide-react';
import { Job, UserRole, JobStatus } from '../types';

interface StaffPortalProps {
  jobs: Job[];
  role: UserRole;
  onUpdateJobStatus: (jobId: string, status: JobStatus, photo?: string, note?: string) => void;
  onRaiseTicketFromStaff: (title: string, desc: string, type: string) => void;
  lang: 'EN' | 'HI';
}

export default function StaffPortal({ jobs, role, onUpdateJobStatus, onRaiseTicketFromStaff, lang }: StaffPortalProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [simPhotoUrl, setSimPhotoUrl] = useState('');

  // Ticket filing fast states
  const [showFastTicketForm, setShowFastTicketForm] = useState(false);
  const [tktTitle, setTktTitle] = useState('');
  const [tktDesc, setTktDesc] = useState('');
  const [tktType, setTktType] = useState('Machine Issue');

  // Filter jobs based on role assigned
  const roleJobs = jobs.filter((j) => {
    if (role === 'Designer') return j.status === 'Design' || j.status === 'Approved';
    if (role === 'Operator') return j.status === 'Printing' || j.status === 'Finishing';
    if (role === 'Delivery') return j.status === 'Installation' || j.status === 'Delivered';
    return true; // manager / reception see all
  });

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const handleStatusCycle = (nextStatus: JobStatus) => {
    if (!selectedJobId) return;
    onUpdateJobStatus(selectedJobId, nextStatus);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !newNoteText) return;

    onUpdateJobStatus(selectedJobId, selectedJob?.status || 'Approved', undefined, newNoteText);
    setNewNoteText('');
  };

  const handleUploadPhotoSimulation = () => {
    if (!selectedJobId) return;
    const url = simPhotoUrl || 'completion_proof_sheet.jpg';
    onUpdateJobStatus(selectedJobId, selectedJob?.status || 'Approved', url, `Uploaded verification file attachment: ${url}`);
    setSimPhotoUrl('');
    alert(lang === 'EN' ? 'Proof asset simulated uploaded and synced to client approval record!' : 'प्रमाण एसेट अपलोड की नकल की गई और ग्राहक एप्रूवल रिकॉर्ड में सिंक किया गया!');
  };

  const handleRaiseFastTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tktTitle) return;

    onRaiseTicketFromStaff(tktTitle, tktDesc, tktType);
    setShowFastTicketForm(false);
    setTktTitle('');
    setTktDesc('');
    alert('Ticket raised and dispatched to manager on duty!');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-fadeIn">
      {/* Assigned Tasks directory list */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 font-display">
              <Briefcase className="w-4.5 h-4.5 text-red-600" />
              {lang === 'EN' ? `Assigned Work Checklist: ${role}` : `सौंपे गए कार्य सूची: ${role}`}
            </h3>
            <button
              onClick={() => setShowFastTicketForm(!showFastTicketForm)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-mono text-[10px] uppercase font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Raise Floor Ticket
            </button>
          </div>

          {showFastTicketForm && (
            <form onSubmit={handleRaiseFastTicket} className="mb-6 p-4.5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4 animate-fadeIn">
              <h4 className="font-extrabold text-[10px] uppercase font-mono text-red-600 tracking-wider">Quick Incident Report</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="What is the problem? (e.g. Flex Roll torn)"
                  value={tktTitle}
                  onChange={(e) => setTktTitle(e.target.value)}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500"
                />
                <select
                  value={tktType}
                  onChange={(e) => setTktType(e.target.value)}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 cursor-pointer focus:ring-2 focus:ring-red-500"
                >
                  <option value="Machine Issue">Machine/Printer Jam</option>
                  <option value="Need Material">Running Out of Stock/Inks</option>
                  <option value="Electricity Issue">Power Failure</option>
                  <option value="Site Issue">Fitting Dimensions mismatch</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Details of damage/shortage (optional)..."
                value={tktDesc}
                onChange={(e) => setTktDesc(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFastTicketForm(false)}
                  className="px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer transition-all">
                  File Ticket
                </button>
              </div>
            </form>
          )}

          {/* Checklist listings */}
          <div className="space-y-4">
            {roleJobs.map((j) => (
              <div
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className={`p-5 border rounded-2xl cursor-pointer transition-all ${
                  selectedJobId === j.id
                    ? 'border-red-600 bg-red-50/10 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-55/10'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm font-display">{j.title}</h4>
                    <span className="font-mono text-[9px] text-slate-500 block mt-1.5 font-bold">
                      Order Code: {j.id} • Target deadline: <span className="font-extrabold text-red-600">{j.deadline}</span>
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-black bg-slate-900 text-white px-3 py-1 rounded-lg shrink-0">
                    {j.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 font-semibold">Spec: {j.description}</p>

                {/* Next workflow helper prompt */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
                  <span>Comments count: {j.notes.length}</span>
                  <span className="text-red-600 font-black flex items-center gap-1">
                    Click to update status workflow <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}

            {roleJobs.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-12 font-bold font-mono">No active jobs assigned to your department right now.</p>
            )}
          </div>
        </div>
      </div>

      {/* Staff Actions Panel workspace */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        {selectedJob ? (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-bold border border-slate-200/40">
                Work Item Code: {selectedJob.id}
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-3 font-display">{selectedJob.title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 font-medium">{selectedJob.description}</p>
            </div>

            {/* Workflow Control Box */}
            <div className="space-y-3.5">
              <span className="text-[11px] font-extrabold text-slate-700 block uppercase font-mono tracking-wider">
                Log Workspace Progress Update:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {role === 'Designer' && selectedJob.status === 'Approved' && (
                  <button
                    onClick={() => handleStatusCycle('Design')}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="w-4 h-4" /> Start Designing Layout
                  </button>
                )}

                {role === 'Designer' && selectedJob.status === 'Design' && (
                  <button
                    onClick={() => handleStatusCycle('Printing')}
                    className="w-full py-3 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Submit Design & Dispatch to Print
                  </button>
                )}

                {role === 'Operator' && selectedJob.status === 'Printing' && (
                  <button
                    onClick={() => handleStatusCycle('Finishing')}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Move to Finishing & Framing
                  </button>
                )}

                {role === 'Operator' && selectedJob.status === 'Finishing' && (
                  <button
                    onClick={() => handleStatusCycle('Installation')}
                    className="w-full py-3 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Frame Complete — Dispatch to Installers
                  </button>
                )}

                {role === 'Delivery' && selectedJob.status === 'Installation' && (
                  <button
                    onClick={() => handleStatusCycle('Delivered')}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Log Completed Site Installation
                  </button>
                )}

                {role === 'Delivery' && selectedJob.status === 'Delivered' && (
                  <button
                    onClick={() => handleStatusCycle('Completed')}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Final Handover: Complete & Close Order
                  </button>
                )}

                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[10px] font-mono text-slate-500 font-bold leading-relaxed">
                  Current Status is: <strong className="text-red-600">{selectedJob.status}</strong>. Click the workflow trigger buttons above to transition stages.
                </div>
              </div>
            </div>

            {/* Simulating Proof/Photo Upload */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                <Image className="w-4.5 h-4.5 text-slate-400" />
                Upload Proof Photo
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. board_on_site_sharma.jpg"
                  value={simPhotoUrl}
                  onChange={(e) => setSimPhotoUrl(e.target.value)}
                  className="flex-1 text-[11px] p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-red-500 font-mono"
                />
                <button
                  onClick={handleUploadPhotoSimulation}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] rounded-xl font-bold uppercase cursor-pointer transition-colors shrink-0"
                >
                  Upload
                </button>
              </div>
            </div>

            {/* Add internal job discussion note thread */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                <MessageSquare className="w-4.5 h-4.5 text-slate-400" />
                Discussion Thread
              </span>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {selectedJob.notes.map((n, idx) => (
                  <div key={idx} className="p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-[11px]">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-0.5 font-bold">
                      <span className="text-slate-800">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{n.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Add note details for owner..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500"
                />
                <button type="submit" className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs rounded-xl font-bold uppercase cursor-pointer transition-colors">
                  Add
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 space-y-3 my-auto">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
            <div>
              <p className="text-sm font-bold text-slate-700">Select Assigned Job</p>
              <p className="text-[10px] text-slate-500 max-w-[180px] mx-auto mt-1 leading-relaxed">
                Select any active work order from the checklist on the left to log status adjustments, upload attachments, or add comments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
