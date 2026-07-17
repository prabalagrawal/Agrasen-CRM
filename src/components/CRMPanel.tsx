import React, { useState } from 'react';
import {
  Users,
  Phone,
  FileText,
  PlusCircle,
  AlertCircle,
  Search,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Upload,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  FileUp,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { Customer, TimelineEvent } from '../types';

interface CRMPanelProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (id: string, updated: Partial<Customer>) => void;
  lang: 'EN' | 'HI';
  currentUser: any;
}

export default function CRMPanel({ customers, onAddCustomer, onUpdateCustomer, lang, currentUser }: CRMPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);

  // New customer states
  const [newName, setNewName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGst, setNewGst] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Timeline / Notes creation states
  const [manualLogType, setManualLogType] = useState<'Call' | 'WhatsApp' | 'Feedback'>('Call');
  const [manualLogTitle, setManualLogTitle] = useState('');
  const [manualLogDesc, setManualLogDesc] = useState('');
  const [noteText, setNoteText] = useState('');

  // File upload states
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');

  // Active simulated action states
  const [activeSimulation, setActiveSimulation] = useState<{ type: 'Call' | 'WhatsApp'; text?: string; phone?: string } | null>(null);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0] || null;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.phone.includes(searchTerm) ||
      (c.gst && c.gst.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      alert(lang === 'EN' ? 'Please fill in Name and Phone number' : 'कृपया नाम और फोन नंबर दर्ज करें।');
      return;
    }

    const newCust: Customer = {
      id: `CUST-${Date.now().toString().substring(8)}`,
      name: newName,
      companyName: newCompanyName || 'N/A',
      phone: newPhone,
      whatsapp: newWhatsapp || newPhone,
      email: newEmail || 'N/A',
      gst: newGst || 'N/A',
      address: newAddress || 'N/A',
      customerSince: new Date().toISOString().split('T')[0],
      outstandingBalance: 0,
      timeline: [
        {
          id: `TL-NEW-${Date.now()}`,
          type: 'Created',
          title: 'Customer Account Opened',
          description: `Customer registered on Agrasen OS CRM by ${currentUser?.name || 'Super Admin'}.`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          byUser: currentUser?.name || 'Super Admin'
        }
      ]
    };

    if (newNotes) {
      newCust.notesList = [
        {
          id: `N-NEW-${Date.now()}`,
          text: newNotes,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          author: currentUser?.name || 'Super Admin'
        }
      ];
    }

    onAddCustomer(newCust);
    setSelectedCustomerId(newCust.id);
    setShowAddForm(false);

    // Reset Form
    setNewName('');
    setNewCompanyName('');
    setNewPhone('');
    setNewWhatsapp('');
    setNewEmail('');
    setNewGst('');
    setNewAddress('');
    setNewNotes('');
  };

  const handleAddTimelineLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    if (!manualLogTitle) return;

    const newEvent: TimelineEvent = {
      id: `TL-${Date.now()}`,
      type: manualLogType,
      title: manualLogTitle,
      description: manualLogDesc || `${manualLogType} logged manually in CRM.`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      byUser: currentUser?.name || 'Super Admin'
    };

    const updatedTimeline = [newEvent, ...(selectedCustomer.timeline || [])];
    onUpdateCustomer(selectedCustomer.id, {
      timeline: updatedTimeline
    });

    setManualLogTitle('');
    setManualLogDesc('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !noteText) return;

    const newNote = {
      id: `N-${Date.now()}`,
      text: noteText,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      author: currentUser?.name || 'Super Admin'
    };

    const updatedNotes = [newNote, ...(selectedCustomer.notesList || [])];
    onUpdateCustomer(selectedCustomer.id, {
      notesList: updatedNotes
    });

    setNoteText('');
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newFileName) return;

    const finalUrl = newFileUrl || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80';
    const newFile = {
      name: newFileName,
      url: finalUrl,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const updatedFiles = [newFile, ...(selectedCustomer.uploadedFiles || [])];
    const updatedTimeline = [
      {
        id: `TL-UP-${Date.now()}`,
        type: 'Feedback',
        title: `Design Uploaded: ${newFileName}`,
        description: `Attached layout specification to active profile documents pool.`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        byUser: currentUser?.name || 'Super Admin'
      },
      ...(selectedCustomer.timeline || [])
    ];

    onUpdateCustomer(selectedCustomer.id, {
      uploadedFiles: updatedFiles,
      timeline: updatedTimeline
    });

    setNewFileName('');
    setNewFileUrl('');
  };

  const triggerDirectActionSim = (type: 'Call' | 'WhatsApp', actionPreset?: string) => {
    if (!selectedCustomer) return;
    let message = '';
    if (type === 'WhatsApp') {
      if (actionPreset === 'payment') {
        message = `Dear ${selectedCustomer.name}, this is a payment reminder regarding your outstanding balance of ₹${selectedCustomer.outstandingBalance.toLocaleString()} on Agrasen Flex Printers. Kindly settle at your earliest. Thanks!`;
      } else if (actionPreset === 'design') {
        message = `Hello ${selectedCustomer.name}, we have completed the initial drafts of your branding design. Please review the shared documents when free so we can move to print.`;
      } else {
        message = `Hello ${selectedCustomer.name}, this is a general status update on your flex printing order. Please let us know if you require any modifications.`;
      }
    }
    setActiveSimulation({ type, text: message, phone: selectedCustomer.phone });
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Modal overlay */}
      {activeSimulation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-xl animate-scaleIn space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                {activeSimulation.type === 'WhatsApp' ? (
                  <MessageCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <PhoneCall className="w-5 h-5 text-blue-500" />
                )}
                {activeSimulation.type === 'WhatsApp' ? 'Simulate WhatsApp Message' : 'Simulate Call Connect'}
              </h3>
              <button onClick={() => setActiveSimulation(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeSimulation.type === 'WhatsApp' ? (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500">
                  You are sending a custom message to <span className="font-semibold text-zinc-800">{selectedCustomer?.name}</span> ({activeSimulation.phone}):
                </p>
                <div className="bg-green-50/50 border border-green-200/60 p-3.5 rounded-xl text-xs font-sans text-zinc-700 leading-relaxed italic relative">
                  {activeSimulation.text}
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setActiveSimulation(null)}
                    className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs text-zinc-600 font-medium"
                  >
                    Cancel
                  </button>
                  <a
                    href={`https://wa.me/91${activeSimulation.phone}?text=${encodeURIComponent(activeSimulation.text || '')}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      if (selectedCustomer) {
                        const newEvent: TimelineEvent = {
                          id: `TL-WA-${Date.now()}`,
                          type: 'WhatsApp',
                          title: 'WhatsApp Contacted',
                          description: `Sent message: "${activeSimulation.text?.substring(0, 50)}..."`,
                          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
                          byUser: currentUser?.name || 'Super Admin'
                        };
                        onUpdateCustomer(selectedCustomer.id, {
                          timeline: [newEvent, ...(selectedCustomer.timeline || [])]
                        });
                      }
                      setActiveSimulation(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Launch WhatsApp Web
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center py-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 animate-pulse">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-zinc-900 text-base">Calling {selectedCustomer?.name}</h4>
                  <p className="font-mono text-xs text-zinc-500">{activeSimulation.phone}</p>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Simulating dial out. When the customer answers, log notes inside their profile details.
                </p>
                <div className="flex gap-2 justify-center pt-4">
                  <button
                    onClick={() => {
                      if (selectedCustomer) {
                        const newEvent: TimelineEvent = {
                          id: `TL-CALL-${Date.now()}`,
                          type: 'Call',
                          title: 'Outbound Call Connected',
                          description: 'Spoke directly with customer. Logged manually.',
                          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
                          byUser: currentUser?.name || 'Super Admin'
                        };
                        onUpdateCustomer(selectedCustomer.id, {
                          timeline: [newEvent, ...(selectedCustomer.timeline || [])]
                        });
                      }
                      setActiveSimulation(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs"
                  >
                    Log Successful Call
                  </button>
                  <button
                    onClick={() => setActiveSimulation(null)}
                    className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs text-zinc-600 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main CRM Title and Grid Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: Customer Directory Search & List */}
        <div className="w-full lg:w-2/5 space-y-4">
          
          <div className="bg-white border border-zinc-200 rounded-2xl p-4.5 space-y-4 shadow-3xs">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-1.5 uppercase">
                <Users className="w-4 h-4 text-zinc-700" />
                Customer Directory
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {lang === 'EN' ? 'New' : 'नया'}
              </button>
            </div>

            {/* Quick search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder={lang === 'EN' ? 'Search by name, company, phone, GST...' : 'नाम, कंपनी, फोन, जीएसटी खोजें...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* New Customer Form Overlay / Block */}
          {showAddForm && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  {lang === 'EN' ? 'Register New Customer' : 'नया ग्राहक दर्ज करें'}
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-zinc-500 uppercase">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prabal Agrawal"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-zinc-500 uppercase">Company / Shop Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Sweets"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-zinc-500 uppercase">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-zinc-500 uppercase">WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="WhatsApp (defaults to Phone)"
                      value={newWhatsapp}
                      onChange={(e) => setNewWhatsapp(e.target.value)}
                      className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-zinc-500 uppercase">Email ID</label>
                    <input
                      type="email"
                      placeholder="client@mail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-zinc-500 uppercase">GSTIN Code</label>
                    <input
                      type="text"
                      placeholder="07AAAAA1111A1Z1"
                      value={newGst}
                      onChange={(e) => setNewGst(e.target.value)}
                      className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-zinc-500 uppercase">Full Physical Address</label>
                  <input
                    type="text"
                    placeholder="Delhi, India"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-zinc-500 uppercase">Initial Internal Note</label>
                  <textarea
                    rows={2}
                    placeholder="Any specific instructions or preferences..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 border border-zinc-200 text-zinc-600 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-zinc-950 text-white rounded-lg text-xs font-semibold"
                  >
                    Save Customer Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Customer list scroll area */}
          <div className="max-h-[70vh] overflow-y-auto space-y-2 pr-1">
            {filteredCustomers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                  }`}
                >
                  <div className="w-full flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-xs leading-tight tracking-tight">{c.name}</h4>
                      <p className={`text-[10px] mt-0.5 font-sans ${isSelected ? 'text-zinc-350' : 'text-zinc-500'}`}>
                        {c.companyName && c.companyName !== 'N/A' ? c.companyName : 'Individual'}
                      </p>
                    </div>
                    {c.outstandingBalance > 0 ? (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 shrink-0 ${
                        isSelected ? 'bg-red-950 border border-red-800 text-red-200' : 'bg-red-50 text-red-700'
                      }`}>
                        ₹{c.outstandingBalance.toLocaleString()}
                      </span>
                    ) : (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm shrink-0 font-medium ${
                        isSelected ? 'bg-zinc-800 text-zinc-350' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        Paid
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-dashed w-full flex items-center justify-between text-[10px] font-mono opacity-80">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {c.phone}
                    </span>
                    <span>GST: {c.gst && c.gst !== 'N/A' ? c.gst.substring(0, 7) + '...' : 'None'}</span>
                  </div>
                </button>
              );
            })}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-10 bg-white border border-zinc-200 rounded-2xl text-zinc-400">
                <Users className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <p className="text-xs font-semibold">No customers found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Customer Profile Timeline View */}
        <div className="flex-1">
          {selectedCustomer ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-6 shadow-3xs">
              
              {/* Header profile section */}
              <div className="pb-5 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-zinc-900 tracking-tight">{selectedCustomer.name}</h1>
                    <span className="font-mono text-[9px] bg-zinc-100 text-zinc-600 border border-zinc-200 px-1.5 py-0.5 rounded-sm">
                      {selectedCustomer.id}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">
                    {selectedCustomer.companyName && selectedCustomer.companyName !== 'N/A'
                      ? `Partner Business: ${selectedCustomer.companyName}`
                      : 'Registered Retail Client'}
                    {' • '}Customer Since {selectedCustomer.customerSince}
                  </p>
                </div>

                {/* Instant Actions row */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerDirectActionSim('Call')}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    title="Direct Phone Call Simulation"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Client
                  </button>
                  <button
                    onClick={() => triggerDirectActionSim('WhatsApp')}
                    className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    title="WhatsApp Quick Send"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                  
                  {/* WhatsApp Pre-filled Quick templates dropdown */}
                  <div className="relative group">
                    <button className="px-2 py-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-xl text-xs font-bold transition-all">
                      Templates
                    </button>
                    <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 w-48 z-10 space-y-0.5">
                      <button
                        onClick={() => triggerDirectActionSim('WhatsApp', 'payment')}
                        className="w-full text-left px-3 py-2 text-[10px] hover:bg-zinc-50 rounded-lg text-zinc-700"
                      >
                        Payment Due Reminder
                      </button>
                      <button
                        onClick={() => triggerDirectActionSim('WhatsApp', 'design')}
                        className="w-full text-left px-3 py-2 text-[10px] hover:bg-zinc-50 rounded-lg text-zinc-700"
                      >
                        Design Draft Approval
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-50/50 border border-zinc-200/40 p-4 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-450 block">Mobile No.</span>
                  <span className="text-xs font-mono font-semibold text-zinc-800">{selectedCustomer.phone}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-450 block">GSTIN Register</span>
                  <span className="text-xs font-mono font-semibold text-zinc-800">{selectedCustomer.gst || 'Retail No-GST'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-450 block">Outstanding balance</span>
                  <span className={`text-xs font-mono font-bold ${selectedCustomer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{selectedCustomer.outstandingBalance.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-450 block">Email Address</span>
                  <span className="text-xs font-semibold text-zinc-800 truncate block">{selectedCustomer.email || 'N/A'}</span>
                </div>
                <div className="col-span-2 md:col-span-4 pt-2 border-t border-zinc-200/40 mt-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-450 block">Billing physical address</span>
                  <span className="text-[11px] font-sans text-zinc-700">{selectedCustomer.address || 'Delhi, India'}</span>
                </div>
              </div>

              {/* TABS GRID: 1. Communications Timeline, 2. Documents Attachment, 3. Notes Feed */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* 1. CHRONOLOGICAL COMMUNICATIONS TIMELINE */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      Chronological Unified Timeline
                    </h3>
                  </div>

                  {/* Manual Log Timeline input form */}
                  <form onSubmit={handleAddTimelineLog} className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Manual CRM Logger</span>
                      <div className="flex bg-white border border-zinc-200 p-0.5 rounded-lg">
                        {(['Call', 'WhatsApp', 'Feedback'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setManualLogType(type)}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-semibold transition-all cursor-pointer ${
                              manualLogType === type ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Log Title (e.g. Callback Requested)"
                        value={manualLogTitle}
                        onChange={(e) => setManualLogTitle(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none"
                      />
                      <textarea
                        rows={1}
                        placeholder="Additional timeline event context..."
                        value={manualLogDesc}
                        onChange={(e) => setManualLogDesc(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Append Log Event
                      </button>
                    </div>
                  </form>

                  {/* Timeline Feed */}
                  <div className="relative border-l-2 border-zinc-150 pl-4 space-y-5 max-h-[350px] overflow-y-auto pr-2">
                    {selectedCustomer.timeline && selectedCustomer.timeline.length > 0 ? (
                      selectedCustomer.timeline.map((evt) => {
                        let iconColor = 'bg-zinc-100 text-zinc-600';
                        if (evt.type === 'Created') iconColor = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
                        if (evt.type === 'WhatsApp') iconColor = 'bg-green-50 text-green-700 border border-green-250';
                        if (evt.type === 'QuotationSent' || evt.type === 'QuotationApproved') iconColor = 'bg-yellow-50 text-yellow-700 border border-yellow-200';
                        if (evt.type === 'Production' || evt.type === 'Printing' || evt.type === 'Installation') iconColor = 'bg-orange-50 text-orange-700 border border-orange-200';
                        if (evt.type === 'Invoice' || evt.type === 'Payment') iconColor = 'bg-teal-50 text-teal-700 border border-teal-200';
                        if (evt.type === 'Feedback') iconColor = 'bg-blue-50 text-blue-700 border border-blue-200';

                        return (
                          <div key={evt.id} className="relative group">
                            {/* Dot indicator marker */}
                            <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${iconColor}`}>
                              {evt.type.substring(0, 1)}
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-xs text-zinc-800">{evt.title}</h4>
                                <span className="text-[9px] font-mono text-zinc-450">{evt.date}</span>
                              </div>
                              <p className="text-[11px] text-zinc-600 leading-snug">{evt.description}</p>
                              {evt.byUser && (
                                <span className="block text-[9px] font-mono text-zinc-400">
                                  Action logged by: <span className="font-medium text-zinc-500">{evt.byUser}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-zinc-400 italic">No timeline triggers found for this customer.</p>
                    )}
                  </div>
                </div>

                {/* RIGHT SPLIT: Documents list and Notes Feed */}
                <div className="space-y-6">
                  
                  {/* NOTES FEED SECTION */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                      Client Notes Feed
                    </h3>

                    {/* Quick Add Note Form */}
                    <form onSubmit={handleAddNote} className="space-y-2">
                      <textarea
                        rows={2}
                        required
                        placeholder="Add quick internal reference note..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full text-xs p-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-zinc-400 outline-none resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[9px] font-bold"
                        >
                          Publish Note
                        </button>
                      </div>
                    </form>

                    {/* Notes Scroll */}
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {selectedCustomer.notesList && selectedCustomer.notesList.length > 0 ? (
                        selectedCustomer.notesList.map((n) => (
                          <div key={n.id} className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl space-y-1">
                            <p className="text-[11px] text-zinc-700 font-sans leading-relaxed">{n.text}</p>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-400">
                              <span>by {n.author}</span>
                              <span>{n.date}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-zinc-400">
                          <p className="text-[10px] italic">No text notes logged yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DOCUMENTS & ATTACHMENTS SECTION */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-zinc-500" />
                      Design & Billing Files
                    </h3>

                    {/* Simulate File Attachment Form */}
                    <form onSubmit={handleUploadFile} className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-xl space-y-2">
                      <span className="block text-[8px] font-bold uppercase text-zinc-450 tracking-wider">Simulate Document Attachment</span>
                      <div className="space-y-1">
                        <input
                          type="text"
                          required
                          placeholder="File Name (e.g. shop_front_draft.cdr)"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          className="w-full text-[10px] p-1.5 bg-white border border-zinc-200 rounded-md focus:border-zinc-400 outline-none"
                        />
                        <select
                          value={newFileUrl}
                          onChange={(e) => setNewFileUrl(e.target.value)}
                          className="w-full text-[10px] p-1.5 bg-white border border-zinc-200 rounded-md focus:border-zinc-400 outline-none"
                        >
                          <option value="">Mock CDR Template File</option>
                          <option value="https://images.unsplash.com/photo-1542838132-92c53300491e">Sample CAD layout (JPG)</option>
                          <option value="https://images.unsplash.com/photo-1586075010923-2dd4570fb338">Billing Receipt PDF (Link)</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" /> Attach File
                        </button>
                      </div>
                    </form>

                    {/* Files list */}
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                      {selectedCustomer.uploadedFiles && selectedCustomer.uploadedFiles.length > 0 ? (
                        selectedCustomer.uploadedFiles.map((f, i) => (
                          <div key={i} className="flex justify-between items-center p-2.5 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileUp className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              <div className="min-w-0">
                                <span className="block text-[11px] font-medium text-zinc-800 truncate" title={f.name}>
                                  {f.name}
                                </span>
                                <span className="block text-[8px] font-mono text-zinc-400">Attached: {f.uploadedAt}</span>
                              </div>
                            </div>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:bg-zinc-100 text-zinc-500 rounded-lg shrink-0"
                              title="Download/View File"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-zinc-400">
                          <p className="text-[10px] italic">No document attachments logged.</p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-zinc-200 rounded-3xl text-zinc-400 shadow-3xs flex flex-col items-center justify-center">
              <Users className="w-12 h-12 text-zinc-200 mb-2 animate-bounce" />
              <h3 className="font-bold text-sm text-zinc-800">Select a Customer Profile</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Pick an account from the directory rail to inspect active timeline events and files.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
