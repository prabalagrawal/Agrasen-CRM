import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, ShieldAlert, History, UserCheck, FileText, 
  CheckCircle2, AlertTriangle, RotateCcw, Activity, 
  Laptop, Globe, RefreshCw, FileCheck, Search, ShieldCheck, 
  ArrowRight, FileBadge, Check, X, HelpCircle, Clock
} from 'lucide-react';
import { api } from '../services/api';
import { UserRole } from '../types';

interface WorkflowLockSystemProps {
  currentEmployee: any;
  lang: 'EN' | 'HI';
}

// Predefined workflow templates representing core modules
const SYSTEM_WORKFLOW_TEMPLATES = [
  { id: 'WF-CRM', name: 'CRM & Lead Intake', department: 'Sales' },
  { id: 'WF-CUSTOMER', name: 'Customer Verification', department: 'Sales' },
  { id: 'WF-VISIT', name: 'Site Visit Planning', department: 'Field Team' },
  { id: 'WF-MEASURE', name: 'Precision Measurements', department: 'Field Team' },
  { id: 'WF-QUOTE', name: 'Quotations & Estimates', department: 'Sales' },
  { id: 'WF-DESIGN', name: 'Design Layout Approval', department: 'Design' },
  { id: 'WF-PROD', name: 'Production & Printing', department: 'Production Team' },
  { id: 'WF-QC', name: 'Quality Control', department: 'Production Team' },
  { id: 'WF-DISPATCH', name: 'Dispatch & Logistics', department: 'Office Executive' },
  { id: 'WF-INSTALL', name: 'On-site Installation', department: 'Field Team' },
  { id: 'WF-BILLING', name: 'Billing & Invoice Generation', department: 'Administration' },
  { id: 'WF-PAYMENT', name: 'Payments Reconciliation', department: 'Administration' },
  { id: 'WF-INVENTORY', name: 'Inventory & Stock Out', department: 'Administration' },
  { id: 'WF-PO', name: 'Purchase Orders', department: 'Administration' }
];

// Seed active workflow instances
const MOCK_ACTIVE_WORKFLOWS = [
  { id: 'WF-2026-001', customerName: 'Sharma Sweets & Caterers', currentStage: 'Precision Measurements', date: '2026-07-16' },
  { id: 'WF-2026-002', customerName: 'Mittal Saree Emporium', currentStage: 'Billing & Invoice Generation', date: '2026-07-17' },
  { id: 'WF-2026-003', customerName: 'Max Healthcare Delhi', currentStage: 'CRM & Lead Intake', date: '2026-07-18' }
];

export default function WorkflowLockSystem({ currentEmployee, lang }: WorkflowLockSystemProps) {
  const [stages, setStages] = useState<any[]>([]);
  const [reopenRequests, setReopenRequests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>('WF-2026-001');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('WF-MEASURE');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Reopen Request Modal/Form state
  const [showReopenModal, setShowReopenModal] = useState<boolean>(false);
  const [reopenReason, setReopenReason] = useState<string>('Incorrect Measurements');
  const [reopenExplanation, setReopenExplanation] = useState<string>('');
  const [reopenNotes, setReopenNotes] = useState<string>('');

  // Complete Confirmation Modal state
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [durationInput, setDurationInput] = useState<number>(30);
  const [extraLogMsg, setExtraLogMsg] = useState<string>('');

  // Active Audit logs local view
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const activeWorkflow = MOCK_ACTIVE_WORKFLOWS.find(w => w.id === activeWorkflowId) || MOCK_ACTIVE_WORKFLOWS[0];

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkflowData();
      if (data.success) {
        setStages(data.workflowStages || []);
        setReopenRequests(data.reopenRequests || []);
        setHistory(data.workflowHistory || []);
      }
      // Also fetch global audits
      const dbRes = await api.getWorkflowData(); // uses localized retrieval
      const localAudits = JSON.parse(localStorage.getItem('abms_audit_logs') || '[]');
      setAuditLogs(localAudits);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Helper to construct compound unique stage ID
  const getStageCompoundId = (wId: string, tId: string) => `${wId}-${tId}`;

  const getStageStatus = (wId: string, tId: string) => {
    const compId = getStageCompoundId(wId, tId);
    const stage = stages.find(s => s.id === compId);
    return stage ? stage.status : 'Pending'; // Default to Pending if not created yet
  };

  const getStageInfo = (wId: string, tId: string) => {
    const compId = getStageCompoundId(wId, tId);
    return stages.find(s => s.id === compId);
  };

  // Stage Lock Action
  const handleLockStage = async () => {
    setShowCompleteModal(false);
    setLoading(true);
    try {
      const compId = getStageCompoundId(activeWorkflowId, selectedTemplateId);
      const template = SYSTEM_WORKFLOW_TEMPLATES.find(t => t.id === selectedTemplateId);
      
      // Capture detailed device telemetry (enterprise security requirement)
      const browser = navigator.userAgent.includes('Chrome') ? 'Google Chrome' : 'Standard Web Browser';
      const os = navigator.userAgent.includes('Windows') ? 'Microsoft Windows' : navigator.userAgent.includes('Mac') ? 'macOS' : 'Linux Kernel';
      const device = window.innerWidth < 768 ? 'Mobile Terminal' : 'Desktop Workstation';

      await api.completeWorkflowStage({
        stageId: compId,
        workflowId: activeWorkflowId,
        stageName: template?.name || 'Workflow Stage',
        customerName: activeWorkflow.customerName,
        durationMinutes: Number(durationInput),
        browser,
        os,
        device
      });

      // Write action to local logs too to sync immediately
      const loggedUser = `${currentEmployee.name} (${currentEmployee.role})`;
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newAudit = {
        id: `AUDIT-${Date.now()}`,
        username: loggedUser,
        action: 'Stage Locked',
        timestamp,
        device,
        beforeValue: 'In Progress',
        afterValue: `🔒 Completed and Locked stage "${template?.name}" for ${activeWorkflow.customerName}.`
      };

      const updatedAudits = [newAudit, ...auditLogs].slice(0, 50);
      setAuditLogs(updatedAudits);
      localStorage.setItem('abms_audit_logs', JSON.stringify(updatedAudits));

      await fetchWorkflowData();
    } catch (err: any) {
      alert(err.message || 'An error occurred while locking the stage.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Reopen Request
  const handleSubmitReopen = async () => {
    if (!reopenExplanation.trim()) {
      alert('Please provide a detailed explanation.');
      return;
    }
    setShowReopenModal(false);
    setLoading(true);
    try {
      const compId = getStageCompoundId(activeWorkflowId, selectedTemplateId);
      const template = SYSTEM_WORKFLOW_TEMPLATES.find(t => t.id === selectedTemplateId);

      await api.requestWorkflowReopen({
        stageId: compId,
        workflowId: activeWorkflowId,
        stageName: template?.name || 'Stage',
        customerName: activeWorkflow.customerName,
        reason: reopenReason,
        detailedExplanation: reopenExplanation,
        supportingNotes: reopenNotes
      });

      // Local audit log write
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newAudit = {
        id: `AUDIT-${Date.now()}`,
        username: `${currentEmployee.name} (${currentEmployee.role})`,
        action: 'Reopen Requested',
        timestamp,
        device: 'Web Client',
        beforeValue: 'Locked Record',
        afterValue: `Requested Reopen for ${template?.name} (Reason: ${reopenReason})`
      };
      const updatedAudits = [newAudit, ...auditLogs].slice(0, 50);
      setAuditLogs(updatedAudits);
      localStorage.setItem('abms_audit_logs', JSON.stringify(updatedAudits));

      // Reset form
      setReopenExplanation('');
      setReopenNotes('');
      await fetchWorkflowData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  // Manager Resolve Reopen Request
  const handleResolveRequest = async (reqId: string, status: 'Approved' | 'Rejected') => {
    setLoading(true);
    try {
      const res = await api.resolveWorkflowReopen(reqId, status);
      alert(`Reopen Request has been successfully ${status.toLowerCase()}!`);

      // Write audit
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newAudit = {
        id: `AUDIT-${Date.now()}`,
        username: `${currentEmployee.name} (${currentEmployee.role})`,
        action: `Reopen Request ${status}`,
        timestamp,
        device: 'Manager Dashboard',
        beforeValue: 'Pending Approval',
        afterValue: `Manager ${currentEmployee.name} ${status} reopen request ${reqId}.`
      };
      const updatedAudits = [newAudit, ...auditLogs].slice(0, 50);
      setAuditLogs(updatedAudits);
      localStorage.setItem('abms_audit_logs', JSON.stringify(updatedAudits));

      await fetchWorkflowData();
    } catch (err: any) {
      alert(err.message || 'Failed to resolve request.');
    } finally {
      setLoading(false);
    }
  };

  const selectedStageStatus = getStageStatus(activeWorkflowId, selectedTemplateId);
  const selectedStageInfo = getStageInfo(activeWorkflowId, selectedTemplateId);
  const selectedTemplate = SYSTEM_WORKFLOW_TEMPLATES.find(t => t.id === selectedTemplateId);

  // Check if there's a pending reopen request for this stage
  const currentPendingRequest = reopenRequests.find(r => r.stageId === getStageCompoundId(activeWorkflowId, selectedTemplateId) && r.status === 'Pending');

  // Filter workflows by query
  const filteredWorkflows = MOCK_ACTIVE_WORKFLOWS.filter(w => 
    w.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isManagerOrAdmin = currentEmployee.role === 'Super Admin' || currentEmployee.role === 'Manager' || currentEmployee.role === 'Owner';

  return (
    <div id="workflow-control-wrapper" className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
      
      {/* Upper Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {lang === 'EN' ? 'Workflow Locking & Controlled Reopen Center' : 'कार्यप्रवाह लॉकिंग और नियंत्रण रीओपन केंद्र'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {lang === 'EN' 
              ? 'Authorized Cryptographic Business Record & Compliance Module • RFC-2026 Secure Audit'
              : 'अधिकृत क्रिप्टोग्राफिक व्यवसाय रिकॉर्ड और अनुपालन मॉड्यूल'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchWorkflowData}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {lang === 'EN' ? 'Sync Systems' : 'सिंक सिस्टम'}
          </button>
          
          <div className="bg-slate-900 text-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {currentEmployee.name} ({currentEmployee.role})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Active Orders & Templates (4 spans) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Active Orders List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. {lang === 'EN' ? 'SELECT ACTIVE CLIENT WORKFLOW' : 'सक्रिय ग्राहक कार्यप्रवाह चुनें'}
            </h3>
            
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder={lang === 'EN' ? 'Search client names...' : 'ग्राहक का नाम खोजें...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {filteredWorkflows.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    setActiveWorkflowId(w.id);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    activeWorkflowId === w.id 
                      ? 'bg-red-50/50 border-red-200 text-red-900 shadow-2xs' 
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-xs font-sans">{w.customerName}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{w.id} • Assigned: Team Alpha</p>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${activeWorkflowId === w.id ? 'translate-x-1 text-red-600' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Workflow Stage Templates Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. {lang === 'EN' ? 'WORKFLOW STAGES' : 'कार्यप्रवाह चरण'}
            </h3>
            
            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
              {SYSTEM_WORKFLOW_TEMPLATES.map((tmpl) => {
                const status = getStageStatus(activeWorkflowId, tmpl.id);
                const info = getStageInfo(activeWorkflowId, tmpl.id);
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {status === 'Completed' ? (
                        <span className="p-1 bg-emerald-500 text-white rounded-full">
                          <Lock className="w-3 h-3" />
                        </span>
                      ) : status === 'In Progress' ? (
                        <span className="p-1 bg-amber-500 text-white rounded-full animate-pulse">
                          <Activity className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="p-1 bg-slate-200 text-slate-500 rounded-full">
                          <Unlock className="w-3 h-3" />
                        </span>
                      )}
                      
                      <div>
                        <p className="font-semibold text-xs">{tmpl.name}</p>
                        <p className={`text-[9px] font-mono ${selectedTemplateId === tmpl.id ? 'text-slate-300' : 'text-slate-400'}`}>
                          Dept: {tmpl.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {info && info.version > 1 && (
                        <span className={`text-[8px] font-mono px-1 py-0.2 rounded-sm ${
                          selectedTemplateId === tmpl.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          V{info.version}
                        </span>
                      )}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                        status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : status === 'In Progress'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {status === 'Completed' ? 'Locked' : status === 'In Progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Center Column: Stage Details and Complete Lock Form (5 spans) */}
        <div className="xl:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Header Area */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-sm">
                  {selectedTemplate?.department} Department
                </span>
                <h2 className="text-sm font-bold mt-1.5">{selectedTemplate?.name}</h2>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Current State</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-sm ${
                  selectedStageStatus === 'Completed'
                    ? 'bg-emerald-500 text-white'
                    : selectedStageStatus === 'In Progress'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {selectedStageStatus === 'Completed' ? '🔒 LOCKED RECORD' : selectedStageStatus === 'In Progress' ? '● IN PROGRESS' : '○ PENDING'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              
              {/* Context Metadata card */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-xs border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-mono">Active Client:</span>
                  <span className="font-bold text-slate-800">{activeWorkflow.customerName}</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-mono">Workflow ID:</span>
                  <span className="font-mono text-slate-800 font-semibold">{activeWorkflowId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-mono">Registry Version:</span>
                  <span className="font-mono text-slate-800 font-bold text-red-600">
                    Version {selectedStageInfo ? selectedStageInfo.version : 1}
                  </span>
                </div>
              </div>

              {/* STAGE STATE 1 & 2: PENDING OR IN PROGRESS */}
              {(selectedStageStatus === 'Pending' || selectedStageStatus === 'In Progress') && (
                <div className="space-y-4">
                  <div className="border-l-2 border-amber-500 bg-amber-50/50 p-3.5 rounded-r-xl">
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {lang === 'EN' ? 'Stage is Open for Corrections' : 'चरण संपादन के लिए खुला है'}
                    </p>
                    <p className="text-[11px] text-amber-700 mt-1">
                      {lang === 'EN' 
                        ? 'Assigned personnel can update site photos, adjust measurements, and update file attachments freely. These actions will be stored as draft changes.' 
                        : 'कर्मचारी स्वतंत्र रूप से फोटो और माप संपादित कर सकते हैं।'}
                    </p>
                  </div>

                  {/* Form input details to lock */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-700">Audit Completion Registry Fields</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 block">Actual Completion Duration (Minutes)</label>
                      <input 
                        type="number"
                        value={durationInput}
                        onChange={(e) => setDurationInput(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 block">System Extra Log Details (Optional)</label>
                      <input 
                        type="text"
                        placeholder="e.g. Approved layout design from client Ramesh"
                        value={extraLogMsg}
                        onChange={(e) => setExtraLogMsg(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Complete & Lock Button */}
                  <button
                    onClick={() => setShowCompleteModal(true)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all text-xs"
                  >
                    <Lock className="w-4 h-4" />
                    Complete Stage & Lock Record
                  </button>
                </div>
              )}

              {/* STAGE STATE 3: LOCKED / COMPLETED */}
              {selectedStageStatus === 'Completed' && selectedStageInfo && (
                <div className="space-y-4">
                  
                  {/* Immutable lock statement banner */}
                  <div className="bg-emerald-500 text-white p-4 rounded-xl space-y-2 shadow-xs">
                    <p className="text-xs font-bold font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 animate-bounce" />
                      🔒 OFFICIAL SECURE RECORD LOCKED
                    </p>
                    <p className="text-[10px] text-emerald-100 leading-relaxed">
                      This stage is finalized. Under compliance, the record is write-protected. All photographs, signatures, design values, and invoice totals are sealed and tamper-resistant.
                    </p>
                  </div>

                  {/* Audit details metadata */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs font-mono text-slate-700">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-400">Completed By:</span>
                      <span className="font-bold text-slate-900">{selectedStageInfo.completedBy?.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-400">Employee ID:</span>
                      <span className="text-slate-900">{selectedStageInfo.completedBy?.id || 'EMP-003'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-400">Date/Time Locked:</span>
                      <span className="text-slate-900">{selectedStageInfo.completedBy?.date} • {selectedStageInfo.completedBy?.time}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-400">Operational Role:</span>
                      <span className="text-slate-900">{selectedStageInfo.completedBy?.role}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-400">Lock Terminal:</span>
                      <span className="text-[10px] text-slate-900">{selectedStageInfo.completedBy?.device}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-400">System Environment:</span>
                      <span className="text-[10px] text-slate-900">{selectedStageInfo.completedBy?.os}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-400">Browser Stamp:</span>
                      <span className="text-[10px] text-slate-900">{selectedStageInfo.completedBy?.browser}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Duration Elapsed:</span>
                      <span className="text-slate-900 font-bold">{selectedStageInfo.completedBy?.durationMinutes} mins</span>
                    </div>
                  </div>

                  {/* Cryptographic Hash Signature */}
                  <div className="bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-[9px] flex flex-col gap-1 shadow-xs border border-slate-800">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block">🔒 Digital HMAC SHA-256 Checksum Signature</span>
                    <span className="text-emerald-400 break-all select-all">{selectedStageInfo.completedBy?.checksum}</span>
                  </div>

                  {/* Reopen Action Panel */}
                  <div className="pt-3 border-t border-slate-100">
                    {currentPendingRequest ? (
                      <div className="bg-amber-500/10 border border-amber-300 text-amber-800 p-3.5 rounded-xl space-y-1">
                        <p className="text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          Reopen Request Pending Approval
                        </p>
                        <p className="text-[10px] text-amber-700">
                          Submitted on {currentPendingRequest.requestDate} at {currentPendingRequest.requestTime}. A manager is currently reviewing this request.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[11px] text-slate-500 italic">
                          Need corrections? Operational employees cannot directly unlock this stage. You must initiate an official reopen approval request.
                        </p>
                        <button
                          onClick={() => setShowReopenModal(true)}
                          className="w-full py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          Request Reopen
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Column: Manager Requests Panel & Version History Audits (3 spans) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Manager Reopen Approval Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Manager Controls
              </h3>
              <span className="bg-red-100 text-red-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                {reopenRequests.filter(r => r.status === 'Pending').length} Pending
              </span>
            </div>

            {/* Check role permissions warning */}
            {!isManagerOrAdmin && (
              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-[10px] text-slate-500 italic">
                🔒 You are currently logged in as a <strong>{currentEmployee.role}</strong>. Reopen requests can only be resolved by Managers, Owners, or Super Admins.
              </div>
            )}

            <div className="space-y-3 max-h-[220px] overflow-y-auto mt-2">
              {reopenRequests.filter(r => r.status === 'Pending').length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CheckCircle2 className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                  No pending reopen requests.
                </div>
              ) : (
                reopenRequests.filter(r => r.status === 'Pending').map((req) => (
                  <div key={req.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{req.stageName}</p>
                        <p className="text-[9px] font-mono text-slate-500">{req.id} • {req.employeeName}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.2 rounded-sm font-mono">
                        PENDING
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-150 text-[10px] text-slate-700">
                      <p className="font-semibold text-red-600 font-mono">Reason: {req.reason}</p>
                      <p className="mt-1 leading-normal italic">"{req.detailedExplanation}"</p>
                    </div>

                    {isManagerOrAdmin ? (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleResolveRequest(req.id, 'Approved')}
                          className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleResolveRequest(req.id, 'Rejected')}
                          className="py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <p className="text-[8px] text-slate-400 italic text-center">Requires manager authorization</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Version History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1 border-b border-slate-100 pb-2">
              <History className="w-4 h-4 text-slate-500" />
              Correction History
            </h3>

            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-mono">
                  No stage corrections logged.
                </div>
              ) : (
                history.map((hist) => (
                  <div key={hist.id} className="border-l-2 border-red-500 pl-3 py-1 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-800 font-mono">V{hist.version} Archived</span>
                      <span className="text-[9px] font-mono text-slate-400">{hist.whenChanged.split(' ')[0]}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Employee <strong>{hist.changedBy}</strong> corrected with approval from manager <strong>{hist.approvedBy}</strong>.
                    </p>
                    <p className="text-[9px] text-red-700 font-semibold bg-red-50 p-1 rounded-sm">
                      Why: "{hist.whyChanged}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* COMPACT IMMUTABLE AUDIT LOG COMPONENT */}
      <div className="mt-8 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-xl font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-950 text-red-500 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              System Immutable Audit Trail (RFC-2026 Compliant)
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Secure SHA-256 Logs</span>
        </div>

        <div className="space-y-2.5 max-h-[240px] overflow-y-auto text-[11px] pr-2">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 italic py-4 text-center">No system operations recorded in audit log yet.</p>
          ) : (
            auditLogs.map((log, idx) => (
              <div key={log.id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 border-b border-slate-800 pb-2 text-slate-300">
                <div className="md:col-span-2 text-slate-500">{log.timestamp}</div>
                <div className="md:col-span-2 font-bold text-red-400 truncate">{log.action}</div>
                <div className="md:col-span-2 text-emerald-400 truncate">{log.username}</div>
                <div className="md:col-span-1 text-slate-500">{log.device || 'Web-Client'}</div>
                <div className="md:col-span-5 text-slate-400 italic break-all leading-relaxed">
                  {log.afterValue}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL 1: CONFIRM COMPLETION & LOCK */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="p-2.5 bg-red-50 text-red-600 rounded-full">
                <Lock className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Complete This Stage?</h3>
                <p className="text-xs text-slate-400">Finalize current workflow stage & seal data</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to finalize this workflow stage. Once completed:
            </p>

            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <li>This stage will become permanently locked.</li>
              <li>Editing will no longer be possible.</li>
              <li>Uploaded measurements, files, and photos cannot be replaced or removed.</li>
              <li>Operational notes become read-only.</li>
              <li>Immutable audit logs with terminal telemetry and digital checksums will be permanently created.</li>
            </ul>

            <p className="text-[11px] text-slate-400 italic">
              * If corrections are required later, a manager must review and approve an official reopen request.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLockStage}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-all"
              >
                Complete & Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST REOPEN MODAL */}
      {showReopenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-full">
                <RotateCcw className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Request Workflow Stage Reopen</h3>
                <p className="text-xs text-slate-500 font-mono">Stage: {selectedTemplate?.name}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Core Reason</label>
                <select
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                >
                  <option value="Incorrect Measurements">Incorrect Measurements / Dimensions</option>
                  <option value="Client Change Request">Client Requested Design Update</option>
                  <option value="Missing Quality Details">Missing Quality Assurance Data</option>
                  <option value="Billing Discrepancy">Billing / Pricing Discrepancy</option>
                  <option value="Other">Other Operational Correction</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Explanation Required</label>
                <textarea
                  rows={3}
                  placeholder="Explain exactly why this record needs to be modified, detailing previous incorrect values and intended corrections..."
                  value={reopenExplanation}
                  onChange={(e) => setReopenExplanation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Supporting Notes / Ref File (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Approved layout ticket ref #9421"
                  value={reopenNotes}
                  onChange={(e) => setReopenNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowReopenModal(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReopen}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-all"
              >
                Submit Reopen Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
