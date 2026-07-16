/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, MapPin, Compass, Mic, Square, Play, Trash2, 
  Edit3, Trash, CheckSquare, ListPlus, FileText, 
  Map, User, Calendar, Plus, Save, RotateCcw, AlertTriangle, 
  CheckCircle2, FolderOpen, Send, Phone, UserCheck, Check, Clock
} from 'lucide-react';
import { Customer, UserRole, Job, JobStatus } from '../types';

// Site Survey Data Structures
export interface SurveyMeasurement {
  id: string;
  itemName: string;
  width: number;
  height: number;
  depth?: number;
  heightFromGround?: number;
  quantity: number;
  unit: 'Feet' | 'Inches' | 'mm' | 'cm';
}

export interface GeotaggedPhoto {
  id: string;
  url: string;
  category: string;
  caption: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
}

export interface VoiceNote {
  id: string;
  url: string;
  duration: string;
  date: string;
  time: string;
  transcript?: string;
}

export interface SiteSurvey {
  id: string;
  customerName: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
  projectName: string;
  assignedEmployee: string;
  surveyDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Started' | 'Completed';
  checkInTime?: string;
  checkInGPS?: { lat: number; lng: number };
  measurements: SurveyMeasurement[];
  photos: GeotaggedPhoto[];
  voiceNotes: VoiceNote[];
  sketchUrl?: string;
  materialsSuggested: string[];
  notes: string;
  attachedFiles: { name: string; size: string; type: string }[];
  isSubmitted: boolean;
}

export interface SiteJob {
  id: string;
  jobTitle: string;
  customerName: string;
  assignedEmployee: string;
  status: 'Assigned' | 'Started' | 'In Progress' | 'Completed';
  beforePhotos: string[];
  afterPhotos: string[];
  completionNotes?: string;
  completionDate?: string;
  completionTime?: string;
  completionGPS?: { lat: number; lng: number };
}

interface SiteSurveyJobSystemProps {
  userRole: UserRole;
  lang: 'EN' | 'HI';
  customers: Customer[];
  jobs: Job[];
  onUpdateJobStatus: (id: string, status: JobStatus, photoUrl?: string, note?: string) => void;
}

// Initial Mock Surveys
const INITIAL_SURVEYS: SiteSurvey[] = [
  {
    id: 'SRV-001',
    customerName: 'Sharma Sweets & Caterers',
    contactPerson: 'Mr. Ramesh Sharma',
    phoneNumber: '9876543210',
    address: 'Shop No. 12, Main Market, Sector 15, Rohini, Delhi',
    projectName: 'Front Façade Signboard Survey',
    assignedEmployee: 'Amit Singh',
    surveyDate: '2026-07-16',
    priority: 'High',
    status: 'Pending',
    measurements: [],
    photos: [],
    voiceNotes: [],
    materialsSuggested: [],
    notes: '',
    attachedFiles: [],
    isSubmitted: false
  },
  {
    id: 'SRV-002',
    customerName: 'Mittal Saree Emporium',
    contactPerson: 'Mr. Mittal',
    phoneNumber: '9988776655',
    address: '45, Chandni Chowk, Delhi',
    projectName: 'Showroom Glass ACP Panel & Pillar Survey',
    assignedEmployee: 'Rahul Kumar',
    surveyDate: '2026-07-17',
    priority: 'Medium',
    status: 'Completed',
    checkInTime: '10:15 AM',
    checkInGPS: { lat: 28.6562, lng: 77.2301 },
    measurements: [
      { id: 'm1', itemName: 'Main Entrance Board', width: 12, height: 4, heightFromGround: 10, quantity: 1, unit: 'Feet' },
      { id: 'm2', itemName: 'Side Pillar Left', width: 2.5, height: 11, quantity: 1, unit: 'Feet' }
    ],
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=60',
        category: 'Front View',
        caption: 'Front banner view containing old faded signage.',
        latitude: 28.6562,
        longitude: 77.2301,
        date: '2026-07-16',
        time: '10:20 AM'
      }
    ],
    voiceNotes: [
      { id: 'v1', url: '#', duration: '0:12', date: '2026-07-16', time: '10:25 AM', transcript: 'Need to replace existing iron truss. Wall is rough plaster.' }
    ],
    materialsSuggested: ['ACP', 'LED', 'Acrylic'],
    notes: 'Need scaffolding for mounting above 10ft. Wall power cable is available from the display window.',
    attachedFiles: [{ name: 'mittal_concept.pdf', size: '1.2 MB', type: 'pdf' }],
    isSubmitted: true
  }
];

// Initial Mock Jobs
const INITIAL_SITE_JOBS: SiteJob[] = [
  {
    id: 'SJB-001',
    jobTitle: 'Install ACP Board - Sharma Sweets',
    customerName: 'Sharma Sweets & Caterers',
    assignedEmployee: 'Rahul Kumar',
    status: 'Assigned',
    beforePhotos: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60'],
    afterPhotos: []
  },
  {
    id: 'SJB-002',
    jobTitle: 'Mount LED Glow Sign - Mittal Sarees',
    customerName: 'Mittal Saree Emporium',
    assignedEmployee: 'Ramu Pal',
    status: 'In Progress',
    beforePhotos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&auto=format&fit=crop&q=60'],
    afterPhotos: []
  }
];

export default function SiteSurveyJobSystem({ userRole, lang, customers, jobs, onUpdateJobStatus }: SiteSurveyJobSystemProps) {
  // Persistence state
  const [surveys, setSurveys] = useState<SiteSurvey[]>(() => {
    const saved = localStorage.getItem('abms_site_surveys');
    return saved ? JSON.parse(saved) : INITIAL_SURVEYS;
  });

  const [siteJobs, setSiteJobs] = useState<SiteJob[]>(() => {
    const saved = localStorage.getItem('abms_site_jobs');
    return saved ? JSON.parse(saved) : INITIAL_SITE_JOBS;
  });

  // Navigation: Admin View vs Field Employee View
  // If user is Owner or Manager, default to 'admin'. If employee, default to 'field'.
  const isManagerOrOwner = userRole === 'Owner' || userRole === 'Manager';
  const [viewMode, setViewMode] = useState<'admin' | 'field'>(isManagerOrOwner ? 'admin' : 'field');

  // Active items
  const [activeSurvey, setActiveSurvey] = useState<SiteSurvey | null>(null);
  const [activeJob, setActiveJob] = useState<SiteJob | null>(null);

  // Search/Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form States - Create New Survey
  const [showCreateSurveyModal, setShowCreateSurveyModal] = useState(false);
  const [newSurveyCust, setNewSurveyCust] = useState('');
  const [newSurveyContact, setNewSurveyContact] = useState('');
  const [newSurveyPhone, setNewSurveyPhone] = useState('');
  const [newSurveyAddr, setNewSurveyAddr] = useState('');
  const [newSurveyProj, setNewSurveyProj] = useState('');
  const [newSurveyEmp, setNewSurveyEmp] = useState('Amit Singh');
  const [newSurveyDate, setNewSurveyDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSurveyPriority, setNewSurveyPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Form States - Create New Job
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCust, setNewJobCust] = useState('');
  const [newJobEmp, setNewJobEmp] = useState('Rahul Kumar');

  // Field Survey inputs
  const [measurementName, setMeasurementName] = useState('');
  const [measWidth, setMeasWidth] = useState<number>(0);
  const [measHeight, setMeasHeight] = useState<number>(0);
  const [measDepth, setMeasDepth] = useState<number>(0);
  const [measGround, setMeasGround] = useState<number>(0);
  const [measQty, setMeasQty] = useState<number>(1);
  const [measUnit, setMeasUnit] = useState<'Feet' | 'Inches' | 'mm' | 'cm'>('Feet');

  // Photo uploads state
  const [photoCategory, setPhotoCategory] = useState('Front View');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Voice note simulator
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordInterval = useRef<NodeJS.Timeout | null>(null);

  // Checklist verification states
  const [chkMeasurements, setChkMeasurements] = useState(false);
  const [chkPhotos, setChkPhotos] = useState(false);
  const [chkGPS, setChkGPS] = useState(false);
  const [chkNotes, setChkNotes] = useState(false);

  // Sketchpad State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sketchColor, setSketchColor] = useState('#ef4444'); // default Red accent
  const [sketchWidth, setSketchWidth] = useState(3);
  const [sketchHistory, setSketchHistory] = useState<string[]>([]);

  // Trigger auto geolocation save simulations
  const [currentGPS, setCurrentGPS] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('abms_site_surveys', JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem('abms_site_jobs', JSON.stringify(siteJobs));
  }, [siteJobs]);

  // Request & capture mock GPS coordinates
  const triggerGPSCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGPS({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setChkGPS(true);
        },
        () => {
          // Fallback coordinate generation near Delhi
          const randomLat = 28.6139 + (Math.random() - 0.5) * 0.1;
          const randomLng = 77.2090 + (Math.random() - 0.5) * 0.1;
          setCurrentGPS({ lat: randomLat, lng: randomLng });
          setChkGPS(true);
        }
      );
    } else {
      const randomLat = 28.6139 + (Math.random() - 0.5) * 0.1;
      const randomLng = 77.2090 + (Math.random() - 0.5) * 0.1;
      setCurrentGPS({ lat: randomLat, lng: randomLng });
      setChkGPS(true);
    }
  };

  // Check in at site
  const handleSiteCheckIn = (srvId: string) => {
    triggerGPSCapture();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lat = currentGPS?.lat || 28.7041;
    const lng = currentGPS?.lng || 77.1025;

    const updated = surveys.map((s) => {
      if (s.id === srvId) {
        return {
          ...s,
          status: 'Started' as const,
          checkInTime: nowStr,
          checkInGPS: { lat, lng }
        };
      }
      return s;
    });
    setSurveys(updated);
    const updatedActive = updated.find((s) => s.id === srvId);
    if (updatedActive) setActiveSurvey(updatedActive);
  };

  // Add survey request (Admin)
  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurveyCust) return;

    const newSrv: SiteSurvey = {
      id: `SRV-0${surveys.length + 1}`,
      customerName: newSurveyCust,
      contactPerson: newSurveyContact || 'N/A',
      phoneNumber: newSurveyPhone || 'N/A',
      address: newSurveyAddr || 'Delhi Yard',
      projectName: newSurveyProj || 'General Branding Measurement',
      assignedEmployee: newSurveyEmp,
      surveyDate: newSurveyDate,
      priority: newSurveyPriority,
      status: 'Pending',
      measurements: [],
      photos: [],
      voiceNotes: [],
      materialsSuggested: [],
      notes: '',
      attachedFiles: [],
      isSubmitted: false
    };

    setSurveys([newSrv, ...surveys]);
    setShowCreateSurveyModal(false);
    // Reset inputs
    setNewSurveyCust('');
    setNewSurveyContact('');
    setNewSurveyPhone('');
    setNewSurveyAddr('');
    setNewSurveyProj('');
  };

  // Add job request (Admin)
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCust) return;

    const newSjb: SiteJob = {
      id: `SJB-0${siteJobs.length + 1}`,
      jobTitle: newJobTitle,
      customerName: newJobCust,
      assignedEmployee: newJobEmp,
      status: 'Assigned',
      beforePhotos: [],
      afterPhotos: []
    };

    setSiteJobs([newSjb, ...siteJobs]);
    setShowCreateJobModal(false);
    setNewJobTitle('');
    setNewJobCust('');
  };

  // Add field measurements entry
  const handleAddMeasurement = () => {
    if (!measurementName || !measWidth || !measHeight || !activeSurvey) return;

    const newMeas: SurveyMeasurement = {
      id: `M-${Date.now()}`,
      itemName: measurementName,
      width: measWidth,
      height: measHeight,
      depth: measDepth || undefined,
      heightFromGround: measGround || undefined,
      quantity: measQty,
      unit: measUnit
    };

    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return {
          ...s,
          measurements: [...s.measurements, newMeas]
        };
      }
      return s;
    });

    setSurveys(updatedSurveys);
    const refreshed = updatedSurveys.find((s) => s.id === activeSurvey.id);
    if (refreshed) {
      setActiveSurvey(refreshed);
      setChkMeasurements(true);
    }

    // Reset inputs
    setMeasurementName('');
    setMeasWidth(0);
    setMeasHeight(0);
    setMeasDepth(0);
    setMeasGround(0);
    setMeasQty(1);
  };

  // Delete measurement entry
  const handleDeleteMeasurement = (measId: string) => {
    if (!activeSurvey) return;
    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return {
          ...s,
          measurements: s.measurements.filter((m) => m.id !== measId)
        };
      }
      return s;
    });
    setSurveys(updatedSurveys);
    const refreshed = updatedSurveys.find((s) => s.id === activeSurvey.id);
    if (refreshed) {
      setActiveSurvey(refreshed);
      if (refreshed.measurements.length === 0) setChkMeasurements(false);
    }
  };

  // Photo attachment with mock/real Geo-tagging
  const handleAddPhoto = () => {
    if (!photoCaption || !activeSurvey) return;

    // Use simulated or inputted url
    const finalUrl = photoUrlInput || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=60';
    const lat = currentGPS?.lat || 28.6139 + (Math.random() - 0.5) * 0.05;
    const lng = currentGPS?.lng || 77.2090 + (Math.random() - 0.5) * 0.05;

    const newPhoto: GeotaggedPhoto = {
      id: `P-${Date.now()}`,
      url: finalUrl,
      category: photoCategory,
      caption: photoCaption,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return {
          ...s,
          photos: [...s.photos, newPhoto]
        };
      }
      return s;
    });

    setSurveys(updatedSurveys);
    const refreshed = updatedSurveys.find((s) => s.id === activeSurvey.id);
    if (refreshed) {
      setActiveSurvey(refreshed);
      setChkPhotos(true);
    }

    setPhotoCaption('');
    setPhotoUrlInput('');
  };

  // Voice note simulator buttons
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordInterval.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recordInterval.current) {
      clearInterval(recordInterval.current);
    }
    setIsRecording(false);
    if (!activeSurvey) return;

    const finalDur = `${Math.floor(recordingSeconds / 60)}:${String(recordingSeconds % 60).padStart(2, '0')}`;
    const newVoice: VoiceNote = {
      id: `V-${Date.now()}`,
      url: '#',
      duration: finalDur,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      transcript: 'Customer reiterated high-resolution vinyl requirements for the upper side panel.'
    };

    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return {
          ...s,
          voiceNotes: [...s.voiceNotes, newVoice]
        };
      }
      return s;
    });
    setSurveys(updatedSurveys);
    const refreshed = updatedSurveys.find((s) => s.id === activeSurvey.id);
    if (refreshed) setActiveSurvey(refreshed);
  };

  // Delete voice note
  const handleDeleteVoice = (voiceId: string) => {
    if (!activeSurvey) return;
    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return {
          ...s,
          voiceNotes: s.voiceNotes.filter((v) => v.id !== voiceId)
        };
      }
      return s;
    });
    setSurveys(updatedSurveys);
    const refreshed = updatedSurveys.find((s) => s.id === activeSurvey.id);
    if (refreshed) setActiveSurvey(refreshed);
  };

  // Material selection toggler
  const handleToggleMaterialChoice = (material: string) => {
    if (!activeSurvey) return;
    const isSelected = activeSurvey.materialsSuggested.includes(material);
    const updatedSuggested = isSelected
      ? activeSurvey.materialsSuggested.filter((m) => m !== material)
      : [...activeSurvey.materialsSuggested, material];

    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return {
          ...s,
          materialsSuggested: updatedSuggested
        };
      }
      return s;
    });
    setSurveys(updatedSurveys);
    const refreshed = updatedSurveys.find((s) => s.id === activeSurvey.id);
    if (refreshed) setActiveSurvey(refreshed);
  };

  // Handle sketch URL save
  const saveSketch = () => {
    if (!canvasRef.current || !activeSurvey) return;
    const sketchUrl = canvasRef.current.toDataURL();
    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return { ...s, sketchUrl };
      }
      return s;
    });
    setSurveys(updatedSurveys);
    const refreshed = updatedSurveys.find((s) => s.id === activeSurvey.id);
    if (refreshed) {
      setActiveSurvey(refreshed);
      alert(lang === 'EN' ? 'Sketch saved successfully to survey!' : 'रेखाचित्र सफलतापूर्वक सर्वे में सहेज लिया गया!');
    }
  };

  // Drawing pad utility handlers
  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = sketchColor;
    ctx.lineWidth = sketchWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const coords = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Final Survey Submit
  const handleSubmitSurvey = () => {
    if (!activeSurvey) return;

    // Strict Checklist check
    if (activeSurvey.measurements.length === 0) {
      alert(lang === 'EN' ? 'Please add at least one measurement entry!' : 'कृपया कम से कम एक माप प्रविष्टि दर्ज करें!');
      return;
    }
    if (activeSurvey.photos.length === 0) {
      alert(lang === 'EN' ? 'Please attach at least one photo with a category caption!' : 'कृपया विवरण के साथ कम से कम एक फोटो जोड़ें!');
      return;
    }

    const updatedSurveys = surveys.map((s) => {
      if (s.id === activeSurvey.id) {
        return {
          ...s,
          status: 'Completed' as const,
          isSubmitted: true
        };
      }
      return s;
    });

    setSurveys(updatedSurveys);
    setActiveSurvey(null);
    alert(lang === 'EN' ? 'Survey report submitted successfully to manager/owner!' : 'सर्वे रिपोर्ट प्रबंधक/मालिक को सफलतापूर्वक सबमिट कर दी गई है!');
  };

  // --- JOB EXECUTION WORKFLOWS ---
  const handleUpdateSiteJobStatus = (jobId: string, newStatus: SiteJob['status']) => {
    const updated = siteJobs.map((j) => {
      if (j.id === jobId) {
        return { ...j, status: newStatus };
      }
      return j;
    });
    setSiteJobs(updated);
    const active = updated.find((j) => j.id === jobId);
    if (active) setActiveJob(active);
  };

  const [jobBeforeUrl, setJobBeforeUrl] = useState('');
  const [jobAfterUrl, setJobAfterUrl] = useState('');
  const [jobNotesInput, setJobNotesInput] = useState('');

  // Add before photo
  const handleAddBeforePhoto = () => {
    if (!activeJob) return;
    const url = jobBeforeUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=60';
    const updated = siteJobs.map((j) => {
      if (j.id === activeJob.id) {
        return { ...j, beforePhotos: [...j.beforePhotos, url] };
      }
      return j;
    });
    setSiteJobs(updated);
    const refreshed = updated.find((j) => j.id === activeJob.id);
    if (refreshed) setActiveJob(refreshed);
    setJobBeforeUrl('');
  };

  // Add mandatory completion photo
  const handleAddAfterPhoto = () => {
    if (!activeJob) return;
    const url = jobAfterUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60';
    const updated = siteJobs.map((j) => {
      if (j.id === activeJob.id) {
        return { ...j, afterPhotos: [...j.afterPhotos, url] };
      }
      return j;
    });
    setSiteJobs(updated);
    const refreshed = updated.find((j) => j.id === activeJob.id);
    if (refreshed) setActiveJob(refreshed);
    setJobAfterUrl('');
  };

  // Complete Job Execution with strict validation
  const handleCompleteSiteJob = () => {
    if (!activeJob) return;

    // MANDATORY check for completion photos
    if (activeJob.afterPhotos.length === 0) {
      const errMsgEn = "Please upload at least one completion photo before marking this job as completed.";
      const errMsgHi = "कार्य पूर्ण करने से पहले कृपया कम से कम एक पूर्णता फोटो अपलोड करें।";
      alert(lang === 'EN' ? errMsgEn : errMsgHi);
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lat = currentGPS?.lat || 28.6139;
    const lng = currentGPS?.lng || 77.2090;

    const updated = siteJobs.map((j) => {
      if (j.id === activeJob.id) {
        return {
          ...j,
          status: 'Completed' as const,
          completionNotes: jobNotesInput,
          completionDate: dateStr,
          completionTime: timeStr,
          completionGPS: { lat, lng }
        };
      }
      return j;
    });

    setSiteJobs(updated);
    setActiveJob(null);
    setJobNotesInput('');
    alert(lang === 'EN' ? 'Site installation job successfully completed and saved to logs!' : 'साइट स्थापना का काम सफलतापूर्वक पूरा कर इतिहास में दर्ज कर दिया गया है!');
  };

  // Search filter lists
  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch = s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.assignedEmployee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSiteJobs = siteJobs.filter((j) => {
    const matchesSearch = j.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.assignedEmployee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6" id="site-survey-execution-system">
      {/* Module Title */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500 rounded-xl">
            <Compass className="w-7 h-7 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight flex items-center gap-2">
              {lang === 'EN' ? 'Smart Site Survey & Execution Command' : 'स्मार्ट साइट सर्वे एवं कार्य निष्पादन केंद्र'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">Mobile-Ready Bilingual GPS Site Measurement & Installation Ledger</p>
          </div>
        </div>

        {/* View Toggle (Admin vs Field Operator) */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'admin' ? 'bg-red-650 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            {lang === 'EN' ? 'Admin Dashboard View' : 'प्रबंधक डैशबोर्ड'}
          </button>
          <button
            onClick={() => {
              setViewMode('field');
              triggerGPSCapture();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'field' ? 'bg-red-650 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            {lang === 'EN' ? 'Field Mobile-App View' : 'ऑन-साइट मोबाइल व्यू'}
          </button>
        </div>
      </div>

      {/* --- ADMIN DASHBOARD PANEL --- */}
      {viewMode === 'admin' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">Total Survey Assignments</span>
              <span className="text-2xl font-black font-display text-slate-900 mt-1 block">{surveys.length}</span>
            </div>
            <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 font-mono block">Pending Field Surveys</span>
              <span className="text-2xl font-black font-display text-amber-600 mt-1 block">
                {surveys.filter(s => s.status === 'Pending').length}
              </span>
            </div>
            <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 font-mono block">Completed Site Reports</span>
              <span className="text-2xl font-black font-display text-green-600 mt-1 block">
                {surveys.filter(s => s.status === 'Completed').length}
              </span>
            </div>
            <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 font-mono block">Active Site Installations</span>
              <span className="text-2xl font-black font-display text-red-600 mt-1 block">
                {siteJobs.filter(j => j.status !== 'Completed').length}
              </span>
            </div>
          </div>

          {/* Controls & Creation Row */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder={lang === 'EN' ? 'Search by customer, employee or project...' : 'ग्राहक, कर्मचारी या प्रोजेक्ट नाम से खोजें...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 pl-10 bg-slate-50 text-slate-800 font-medium"
              />
              <span className="absolute left-3.5 top-3 text-slate-400 font-mono text-sm font-bold">🔍</span>
            </div>

            {/* Quick Filter & Create Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-bold cursor-pointer"
              >
                <option value="All">{lang === 'EN' ? 'All Surveys' : 'सभी सर्वे'}</option>
                <option value="Pending">{lang === 'EN' ? 'Pending' : 'लंबित'}</option>
                <option value="Started">{lang === 'EN' ? 'In Progress' : 'कार्य जारी'}</option>
                <option value="Completed">{lang === 'EN' ? 'Completed' : 'पूर्ण'}</option>
              </select>

              <button
                onClick={() => setShowCreateSurveyModal(true)}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {lang === 'EN' ? 'Dispatch Site Surveyor' : 'नया सर्वे असाइन करें'}
              </button>

              <button
                onClick={() => setShowCreateJobModal(true)}
                className="px-4 py-2.5 bg-red-650 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-red-700 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {lang === 'EN' ? 'Create Execution Job' : 'नया स्थापना कार्य बनाएं'}
              </button>
            </div>
          </div>

          {/* Creation Modal - Dispatch Site Survey */}
          {showCreateSurveyModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form onSubmit={handleCreateSurvey} className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-scaleUp">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 font-display">
                    <Compass className="w-5 h-5 text-red-600" />
                    {lang === 'EN' ? 'Dispatch Site Surveyor' : 'फील्ड सर्वे कर्मचारी भेजें'}
                  </h3>
                  <button type="button" onClick={() => setShowCreateSurveyModal(false)} className="text-slate-400 hover:text-slate-600 font-bold font-mono">✕</button>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">CUSTOMER SELECT</label>
                    <select
                      value={newSurveyCust}
                      onChange={(e) => {
                        setNewSurveyCust(e.target.value);
                        const match = customers.find(c => c.name === e.target.value);
                        if (match) {
                          setNewSurveyContact(match.name.split(' ')[0]);
                          setNewSurveyPhone(match.phone);
                          setNewSurveyAddr(match.address);
                        }
                      }}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800"
                      required
                    >
                      <option value="">{lang === 'EN' ? '-- Select CRM Customer --' : '-- ग्राहक चुनें --'}</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">CONTACT PERSON</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh"
                        value={newSurveyContact}
                        onChange={(e) => setNewSurveyContact(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">PHONE NUMBER</label>
                      <input
                        type="text"
                        placeholder="e.g. 9876..."
                        value={newSurveyPhone}
                        onChange={(e) => setNewSurveyPhone(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">SITE ADDRESS</label>
                    <textarea
                      placeholder="Enter specific physical site location details..."
                      value={newSurveyAddr}
                      onChange={(e) => setNewSurveyAddr(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl h-16"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">PROJECT NAME / PURPOSE</label>
                    <input
                      type="text"
                      placeholder="e.g. Glow Signboard Front Survey"
                      value={newSurveyProj}
                      onChange={(e) => setNewSurveyProj(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">SURVEYOR</label>
                      <select
                        value={newSurveyEmp}
                        onChange={(e) => setNewSurveyEmp(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Amit Singh">Amit Singh</option>
                        <option value="Rahul Kumar">Rahul Kumar</option>
                        <option value="Ramu Pal">Ramu Pal</option>
                        <option value="Vikram Seth">Vikram Seth</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">TARGET DATE</label>
                      <input
                        type="date"
                        value={newSurveyDate}
                        onChange={(e) => setNewSurveyDate(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">PRIORITY</label>
                      <select
                        value={newSurveyPriority}
                        onChange={(e) => setNewSurveyPriority(e.target.value as any)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateSurveyModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Create Survey Request
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Creation Modal - Create Site Job Execution */}
          {showCreateJobModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form onSubmit={handleCreateJob} className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scaleUp">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 font-display">
                    <CheckCircle2 className="w-5 h-5 text-red-600" />
                    {lang === 'EN' ? 'Create Execution Job' : 'स्थापना कार्य प्रविष्टि'}
                  </h3>
                  <button type="button" onClick={() => setShowCreateJobModal(false)} className="text-slate-400 hover:text-slate-600 font-bold font-mono">✕</button>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">JOB TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g. Install LED Box Sharma Sweets"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">CUSTOMER SELECT</label>
                    <select
                      value={newJobCust}
                      onChange={(e) => setNewJobCust(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                      required
                    >
                      <option value="">-- Choose Customer --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">ASSIGNED FIELD WORKER</label>
                    <select
                      value={newJobEmp}
                      onChange={(e) => setNewJobEmp(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="Rahul Kumar">Rahul Kumar (Operator)</option>
                      <option value="Amit Singh">Amit Singh (Surveyor)</option>
                      <option value="Ramu Pal">Ramu Pal (Installer)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateJobModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Dispatch Installer
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Survey assignments report grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Surveys List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-4 pb-2.5 border-b border-slate-100 font-display flex items-center justify-between">
                  <span>📋 {lang === 'EN' ? 'Site Survey Ledger' : 'साइट सर्वे रजिस्टर'}</span>
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md font-mono">{filteredSurveys.length} surveys</span>
                </h3>

                <div className="space-y-4">
                  {filteredSurveys.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setActiveSurvey(s)}
                      className={`p-5 border rounded-2xl cursor-pointer transition-all ${activeSurvey?.id === s.id ? 'border-red-600 bg-red-50/10 shadow-xs' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{s.id}</span>
                            <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-md ${s.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{s.priority} Priority</span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm font-display mt-2">{s.projectName}</h4>
                          <p className="text-xs text-slate-600 mt-1 font-semibold">{s.customerName}</p>
                        </div>

                        <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-lg self-start ${s.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : s.status === 'Started' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                          {s.status === 'Completed' ? 'REPORT SUBMITTED' : s.status === 'Started' ? 'IN PROGRESS' : 'PENDING DISPATCH'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-500 font-bold">
                        <div>👷 {s.assignedEmployee}</div>
                        <div>📅 {s.surveyDate}</div>
                        <div className="text-right sm:text-left">📏 {s.measurements.length} {lang === 'EN' ? 'measurements' : 'माप'}</div>
                      </div>
                    </div>
                  ))}

                  {filteredSurveys.length === 0 && (
                    <div className="text-center py-12 text-slate-400 font-mono text-xs">No active survey records found.</div>
                  )}
                </div>
              </div>

              {/* Site Installations & Execution List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-4 pb-2.5 border-b border-slate-100 font-display flex items-center justify-between">
                  <span>🛠️ {lang === 'EN' ? 'Site Job Execution Logs' : 'स्थापना कार्य विवरण'}</span>
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md font-mono">{filteredSiteJobs.length} active</span>
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredSiteJobs.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => setActiveJob(j)}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all ${activeJob?.id === j.id ? 'border-red-650 bg-red-50/15 shadow-xs' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{j.id}</span>
                          <h4 className="font-bold text-slate-900 text-xs font-display mt-2">{j.jobTitle}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">{j.customerName}</p>
                        </div>
                        <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-md ${j.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {j.status}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <div>👷 {j.assignedEmployee}</div>
                        <div>📸 {j.afterPhotos.length} completion proof</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Right Inspection Panel Workspace */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-start">
              {activeSurvey ? (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/40 font-bold">
                        ADMIN INSPECTION: {activeSurvey.id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-2 font-display">{activeSurvey.projectName}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{activeSurvey.customerName}</p>
                    </div>
                    <button onClick={() => setActiveSurvey(null)} className="text-slate-400 hover:text-slate-600 font-mono text-xs">✕ Close</button>
                  </div>

                  {/* General details */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs font-mono font-bold text-slate-600">
                    <div>👤 Contact: {activeSurvey.contactPerson} ({activeSurvey.phoneNumber})</div>
                    <div>📍 Address: {activeSurvey.address}</div>
                    {activeSurvey.checkInTime && (
                      <div className="text-emerald-600">⏰ Check-In logged at: {activeSurvey.checkInTime}</div>
                    )}
                    {activeSurvey.checkInGPS && (
                      <div className="text-blue-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> GPS Geotag: {activeSurvey.checkInGPS.lat.toFixed(4)}, {activeSurvey.checkInGPS.lng.toFixed(4)}
                        <a
                          href={`https://www.google.com/maps?q=${activeSurvey.checkInGPS.lat},${activeSurvey.checkInGPS.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-600 underline text-[10px] ml-1 font-bold"
                        >
                          (Open Maps)
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Field measurements */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2 flex items-center gap-1">
                      <span>📏</span> Measurements ({activeSurvey.measurements.length})
                    </h4>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {activeSurvey.measurements.map((m, idx) => (
                        <div key={idx} className="p-2.5 border border-slate-100 rounded-xl bg-slate-50 text-xs flex justify-between font-mono font-bold text-slate-700">
                          <div>
                            <span className="text-slate-900 font-sans">{m.itemName}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Width: {m.width} • Height: {m.height} • Unit: {m.unit}
                            </span>
                          </div>
                          <span className="bg-red-50 border border-red-100 text-red-600 text-[10px] px-2 py-1 rounded-md self-center">
                            {m.quantity} Qty
                          </span>
                        </div>
                      ))}
                      {activeSurvey.measurements.length === 0 && (
                        <div className="text-center py-6 text-slate-400 font-mono text-[10px]">No measurements uploaded by operator yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Geotagged Photos */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2 flex items-center gap-1">
                      <span>📸</span> Geotagged Site Photos ({activeSurvey.photos.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                      {activeSurvey.photos.map((p) => (
                        <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-1.5 flex flex-col justify-between">
                          <img src={p.url} alt={p.caption} className="w-full h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                          <div className="mt-1.5 text-[9px] font-mono leading-tight font-bold text-slate-600">
                            <span className="text-red-600 uppercase block font-black text-[8px]">{p.category}</span>
                            <p className="line-clamp-1 text-slate-900 font-sans font-medium">{p.caption}</p>
                            <span className="text-[8px] text-blue-500 block mt-0.5">📍 Lat: {p.latitude} Lng: {p.longitude}</span>
                          </div>
                        </div>
                      ))}
                      {activeSurvey.photos.length === 0 && (
                        <div className="col-span-2 text-center py-6 text-slate-400 font-mono text-[10px]">No site photos captured yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Interactive sketch inspection */}
                  {activeSurvey.sketchUrl && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-1 flex items-center gap-1">
                        <span>✏️</span> Site Rough Sketch
                      </h4>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-1">
                        <img src={activeSurvey.sketchUrl} alt="rough site sketch" className="w-full h-32 object-contain" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  )}

                  {/* Voice notes */}
                  {activeSurvey.voiceNotes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-1 flex items-center gap-1">
                        <span>🎙️</span> Surveyor Voice Note Thread
                      </h4>
                      {activeSurvey.voiceNotes.map((vn) => (
                        <div key={vn.id} className="bg-red-50/50 border border-red-100 p-2.5 rounded-xl font-mono text-[10px] text-slate-600 font-bold">
                          <div className="flex justify-between text-[8px] text-slate-400">
                            <span>⏱️ Duration: {vn.duration}</span>
                            <span>{vn.date} • {vn.time}</span>
                          </div>
                          <p className="text-slate-800 italic mt-1 font-sans font-medium">"{vn.transcript}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Material recommendations */}
                  {activeSurvey.materialsSuggested.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-1">💡 Suggested Materials</h4>
                      <div className="flex flex-wrap gap-1">
                        {activeSurvey.materialsSuggested.map((m) => (
                          <span key={m} className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-mono font-bold text-[9px] uppercase tracking-wider">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Free notes */}
                  {activeSurvey.notes && (
                    <div className="border-t border-slate-100 pt-3">
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-1">📝 Surveyor Notes</h4>
                      <p className="text-xs text-slate-600 bg-slate-55/5 p-2 rounded-xl italic font-medium">"{activeSurvey.notes}"</p>
                    </div>
                  )}
                </div>
              ) : activeJob ? (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/40 font-bold">
                        EXECUTION STATUS: {activeJob.id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-2 font-display">{activeJob.jobTitle}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{activeJob.customerName}</p>
                    </div>
                    <button onClick={() => setActiveJob(null)} className="text-slate-400 hover:text-slate-600 font-mono text-xs">✕ Close</button>
                  </div>

                  {/* Workflow steps */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2 text-xs font-mono font-bold text-slate-600">
                    <div>👷 Assigned Installer: {activeJob.assignedEmployee}</div>
                    <div>🎯 Current Status: <strong className="text-red-600">{activeJob.status}</strong></div>
                    {activeJob.completionDate && (
                      <>
                        <div className="text-emerald-600">✅ Completed on: {activeJob.completionDate} at {activeJob.completionTime}</div>
                        {activeJob.completionGPS && (
                          <div className="text-blue-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> GPS Verified: {activeJob.completionGPS.lat}, {activeJob.completionGPS.lng}
                          </div>
                        )}
                        {activeJob.completionNotes && (
                          <div className="italic text-slate-600 font-sans border-t pt-2 mt-2">Notes: "{activeJob.completionNotes}"</div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Before / After Photo Compare */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 font-mono block mb-1">Before Dispatch</span>
                      {activeJob.beforePhotos.map((url, idx) => (
                        <img key={idx} src={url} alt="before signage" className="w-full h-32 object-cover rounded-xl border border-slate-200" referrerPolicy="no-referrer" />
                      ))}
                      {activeJob.beforePhotos.length === 0 && (
                        <div className="h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-mono">No before photos</div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-800 font-mono block mb-1">★ After Completion</span>
                      {activeJob.afterPhotos.map((url, idx) => (
                        <img key={idx} src={url} alt="completed signage installation" className="w-full h-32 object-cover rounded-xl border-2 border-emerald-500" referrerPolicy="no-referrer" />
                      ))}
                      {activeJob.afterPhotos.length === 0 && (
                        <div className="h-32 rounded-xl border-2 border-dashed border-red-200 bg-red-50/10 flex items-center justify-center text-[10px] text-red-500 font-mono font-bold text-center p-2">Pending completion photo</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-24 text-slate-400 space-y-3 my-auto">
                  <Compass className="w-12 h-12 mx-auto text-slate-300" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">Select Item to Inspect</p>
                    <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto mt-1 leading-relaxed">
                      Select any site survey request or site job execution log on the left to inspect customer specifications, drawings, geo-coordinates, measurements, and completion proof photos.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE FIELD OPERATOR APPLET VIEW --- */}
      {viewMode === 'field' && (
        <div className="max-w-md mx-auto space-y-6 animate-fadeIn font-sans">
          {/* Active Work Select list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block mb-2">My Active Site Survey Assignments</span>
            <div className="grid grid-cols-1 gap-2.5">
              {surveys.filter(s => !s.isSubmitted).map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSurvey(s);
                    setActiveJob(null);
                  }}
                  className={`p-4 border rounded-xl text-left transition-all ${activeSurvey?.id === s.id ? 'border-red-600 bg-red-50/5 shadow-2xs font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{s.id}</span>
                    <span className={`text-[8px] font-bold uppercase font-mono px-1.5 py-0.5 rounded-md ${s.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{s.priority}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-2">{s.projectName}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">📍 Address: {s.address}</p>
                </button>
              ))}
              {surveys.filter(s => !s.isSubmitted).length === 0 && (
                <p className="text-[10px] text-slate-400 font-mono py-2 text-center">No active surveys assigned to you.</p>
              )}
            </div>

            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block mt-5 mb-2">My Active Site Signage Jobs</span>
            <div className="grid grid-cols-1 gap-2.5">
              {siteJobs.filter(j => j.status !== 'Completed').map((j) => (
                <button
                  key={j.id}
                  onClick={() => {
                    setActiveJob(j);
                    setActiveSurvey(null);
                  }}
                  className={`p-4 border rounded-xl text-left transition-all ${activeJob?.id === j.id ? 'border-red-600 bg-red-50/5 shadow-2xs font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{j.id}</span>
                    <span className="text-[8px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">{j.status}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-2">{j.jobTitle}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">👤 Customer: {j.customerName}</p>
                </button>
              ))}
              {siteJobs.filter(j => j.status !== 'Completed').length === 0 && (
                <p className="text-[10px] text-slate-400 font-mono py-2 text-center">No active installation tasks assigned.</p>
              )}
            </div>
          </div>

          {/* Active Survey Workspace Form */}
          {activeSurvey && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-500">SURVEY WORKSPACE: {activeSurvey.id}</span>
                  <h3 className="font-black text-slate-900 text-sm font-display mt-2">{activeSurvey.projectName}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Customer: {activeSurvey.customerName}</p>
                </div>
                <button onClick={() => setActiveSurvey(null)} className="text-xs text-slate-400 hover:text-slate-600 font-mono font-bold">✕ Close</button>
              </div>

              {/* Step 1: GPS & Checkin */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">1. Site Check-In</span>
                {activeSurvey.checkInTime ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-mono font-bold leading-relaxed">
                    ✓ Checked-In successfully at: {activeSurvey.checkInTime}
                    {activeSurvey.checkInGPS && (
                      <div className="mt-1 text-[10px] text-blue-600">📍 GPS Captured: {activeSurvey.checkInGPS.lat.toFixed(5)}, {activeSurvey.checkInGPS.lng.toFixed(5)}</div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSiteCheckIn(activeSurvey.id)}
                    className="w-full py-3 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:shadow-2xs transition-all"
                  >
                    <MapPin className="w-4 h-4 animate-bounce" />
                    {lang === 'EN' ? 'Press to Start Survey' : 'सर्वे शुरू करें (चेक-इन)'}
                  </button>
                )}
              </div>

              {/* Step 2: Interactive Drawing sketch pad */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">2. On-Site Sketch Pad</span>
                
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  {/* Tool Controls */}
                  <div className="flex justify-between items-center bg-slate-100 p-2.5 border-b border-slate-200 flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={sketchColor}
                        onChange={(e) => setSketchColor(e.target.value)}
                        className="w-7 h-7 p-0 rounded-md cursor-pointer border border-slate-300"
                        title="Pick Color"
                      />
                      <select
                        value={sketchWidth}
                        onChange={(e) => setSketchWidth(parseInt(e.target.value))}
                        className="p-1 text-[10px] border border-slate-300 rounded-md font-mono"
                      >
                        <option value="2">Thin</option>
                        <option value="4">Medium</option>
                        <option value="8">Thick</option>
                      </select>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="px-2 py-1 bg-slate-200 rounded text-[10px] font-mono font-bold hover:bg-slate-300 text-slate-700"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={saveSketch}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-mono font-bold uppercase tracking-wide hover:bg-slate-800"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Draw canvas area */}
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={180}
                    onMouseDown={handleStartDrawing}
                    onMouseMove={handleDraw}
                    onMouseUp={handleStopDrawing}
                    onMouseLeave={handleStopDrawing}
                    onTouchStart={handleStartDrawing}
                    onTouchMove={handleDraw}
                    onTouchEnd={handleStopDrawing}
                    className="w-full bg-white cursor-crosshair h-44"
                  />
                </div>
              </div>

              {/* Step 3: Measurement Entry Form */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">3. Measurement Ledger</span>
                
                {/* Inputs for measurements */}
                <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">ITEM NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Main Front Flex Board"
                      value={measurementName}
                      onChange={(e) => setMeasurementName(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">WIDTH</label>
                      <input
                        type="number"
                        value={measWidth}
                        onChange={(e) => setMeasWidth(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">HEIGHT</label>
                      <input
                        type="number"
                        value={measHeight}
                        onChange={(e) => setMeasHeight(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">UNIT</label>
                      <select
                        value={measUnit}
                        onChange={(e) => setMeasUnit(e.target.value as any)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Feet">Feet</option>
                        <option value="Inches">Inches</option>
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">DEPTH (OPT)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={measDepth}
                        onChange={(e) => setMeasDepth(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">FROM GROUND</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={measGround}
                        onChange={(e) => setMeasGround(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">QTY</label>
                      <input
                        type="number"
                        value={measQty}
                        onChange={(e) => setMeasQty(parseInt(e.target.value) || 1)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddMeasurement}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                  >
                    + {lang === 'EN' ? 'Add Measurement' : 'माप जोड़ें'}
                  </button>
                </div>

                {/* List measurements added */}
                <div className="space-y-2">
                  {activeSurvey.measurements.map((m) => (
                    <div key={m.id} className="p-3 border border-slate-200 bg-slate-50 rounded-xl flex justify-between items-center font-mono text-[11px] font-bold">
                      <div>
                        <span className="text-slate-800 font-sans block text-xs">{m.itemName}</span>
                        <span className="text-[10px] text-slate-400">
                          {m.width}x{m.height} {m.unit} • Qty: {m.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteMeasurement(m.id)}
                        className="text-red-500 hover:text-red-700 font-bold p-1 text-xs"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Photo uploads & simulations */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">4. Capture Site Photos</span>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">CATEGORY</label>
                      <select
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Front View">Front View</option>
                        <option value="Side View">Side View</option>
                        <option value="Existing Board">Existing Board</option>
                        <option value="Installation Area">Installation Area</option>
                        <option value="Electrical Point">Electrical Point</option>
                        <option value="Surroundings">Surroundings</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">CAPTION</label>
                      <input
                        type="text"
                        placeholder="e.g. wall where truss is fixed"
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">SIMULATED PHOTO FILE (OR URL)</label>
                    <input
                      type="text"
                      placeholder="Enter photo link (e.g. banner.jpg) or keep default"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <button
                    onClick={handleAddPhoto}
                    className="w-full py-2 bg-slate-950 text-white rounded-xl text-xs uppercase cursor-pointer"
                  >
                    📸 {lang === 'EN' ? 'Attach & Geotag Photo' : 'फोटो अपलोड करें'}
                  </button>
                </div>

                {/* Grid of uploaded geotagged photos */}
                <div className="grid grid-cols-2 gap-2">
                  {activeSurvey.photos.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-1 flex flex-col justify-between">
                      <img src={p.url} alt={p.caption} className="w-full h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="p-1 text-[8px] font-mono font-bold leading-tight">
                        <span className="text-red-600 block">{p.category}</span>
                        <p className="line-clamp-1 text-slate-900 font-sans">{p.caption}</p>
                        <span className="text-blue-500 block mt-0.5">📍 Lat: {p.latitude} Lng: {p.longitude}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 5: Voice Notes */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">5. Voice Note observations</span>
                
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-red-600 animate-ping' : 'bg-slate-400'}`} />
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {isRecording ? `Recording... ${recordingSeconds}s` : 'Voice Recorder'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {isRecording ? (
                      <button
                        onClick={stopRecording}
                        className="p-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5 text-red-500" /> Stop & Save
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="p-2 bg-red-650 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-white" /> Start Recording
                      </button>
                    )}
                  </div>
                </div>

                {/* Recorded Voice notes list */}
                <div className="space-y-2">
                  {activeSurvey.voiceNotes.map((vn) => (
                    <div key={vn.id} className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-[10px] font-mono text-slate-600 font-bold space-y-1">
                      <div className="flex justify-between items-center text-[8px] text-slate-400">
                        <span>🎙️ Surveyor Recording • {vn.duration}</span>
                        <button onClick={() => handleDeleteVoice(vn.id)} className="text-red-500 font-mono">✕ Delete</button>
                      </div>
                      <p className="text-slate-800 font-medium italic font-sans">"{vn.transcript}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 6: Suggested Materials */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">6. Material Recommendations</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Flex', 'ACP', 'Acrylic', 'LED', 'Vinyl', 'Sunboard', 'Frame', 'Standee', 'Other'].map((mat) => {
                    const isSelected = activeSurvey.materialsSuggested.includes(mat);
                    return (
                      <button
                        key={mat}
                        onClick={() => handleToggleMaterialChoice(mat)}
                        className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 7: Observations notes */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">7. Observations & Special Notes</span>
                <textarea
                  placeholder="e.g. Scaffolding is required, power supply socket is 5 meters away..."
                  value={activeSurvey.notes}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setSurveys(surveys.map(s => s.id === activeSurvey.id ? { ...s, notes: txt } : s));
                    setActiveSurvey({ ...activeSurvey, notes: txt });
                  }}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl h-20"
                />
              </div>

              {/* Submission Checklist */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-extrabold uppercase font-mono text-slate-700 tracking-wider">✓ Submission Checklist Verification</span>
                
                <div className="space-y-2 text-xs text-slate-600">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSurvey.measurements.length > 0}
                      readOnly
                      className="w-4 h-4 rounded text-red-600 cursor-pointer"
                    />
                    <span className={activeSurvey.measurements.length > 0 ? 'line-through text-slate-400 font-bold' : 'font-bold'}>
                      Measurements Added ({activeSurvey.measurements.length})
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSurvey.photos.length > 0}
                      readOnly
                      className="w-4 h-4 rounded text-red-600 cursor-pointer"
                    />
                    <span className={activeSurvey.photos.length > 0 ? 'line-through text-slate-400 font-bold' : 'font-bold'}>
                      Site Photos Uploaded ({activeSurvey.photos.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!activeSurvey.checkInTime}
                      readOnly
                      className="w-4 h-4 rounded text-red-600 cursor-pointer"
                    />
                    <span className={activeSurvey.checkInTime ? 'line-through text-slate-400 font-bold' : 'font-bold'}>
                      GPS Geotag Check-In Captured
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleSubmitSurvey}
                  disabled={activeSurvey.measurements.length === 0 || activeSurvey.photos.length === 0}
                  className="w-full py-3.5 mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {lang === 'EN' ? 'Submit Finished Report' : 'रिपोर्ट प्रबंधक को भेजें'}
                </button>
              </div>
            </div>
          )}

          {/* Active Site Signage Install / Execution Work */}
          {activeJob && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-500">JOB WORKFLOW: {activeJob.id}</span>
                  <h3 className="font-black text-slate-900 text-sm font-display mt-2">{activeJob.jobTitle}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Customer: {activeJob.customerName}</p>
                </div>
                <button onClick={() => setActiveJob(null)} className="text-xs text-slate-400 hover:text-slate-600 font-mono font-bold">✕ Close</button>
              </div>

              {/* Status workflow dispatcher */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">Update Task Pipeline Progress:</span>
                
                {activeJob.status === 'Assigned' && (
                  <button
                    onClick={() => handleUpdateSiteJobStatus(activeJob.id, 'Started')}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Start Job & Log Arrival Time
                  </button>
                )}

                {activeJob.status === 'Started' && (
                  <button
                    onClick={() => handleUpdateSiteJobStatus(activeJob.id, 'In Progress')}
                    className="w-full py-3 bg-red-650 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Transition to In Progress
                  </button>
                )}
              </div>

              {/* Upload Before Photo */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs font-bold text-slate-600">
                <span className="text-[11px] font-black uppercase text-slate-400 font-mono block">Optional: Upload Before Photo</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter URL or keep default link"
                    value={jobBeforeUrl}
                    onChange={(e) => setJobBeforeUrl(e.target.value)}
                    className="flex-1 text-xs p-2 border border-slate-200 rounded-xl"
                  />
                  <button
                    onClick={handleAddBeforePhoto}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {activeJob.beforePhotos.map((p, i) => (
                    <img key={i} src={p} alt="before installation" className="w-full h-20 object-cover rounded-xl" referrerPolicy="no-referrer" />
                  ))}
                </div>
              </div>

              {/* Mandatory After Photo Upload */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs font-bold text-slate-800">
                <span className="text-[11px] font-black uppercase text-red-600 font-mono block">★ Mandatory: Upload After Completion Photo</span>
                <p className="text-[9px] text-slate-450 leading-relaxed font-sans font-medium">This site job CANNOT be closed or finalized until at least one completed installation proof photo is uploaded.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter completed banner/ACP photo link"
                    value={jobAfterUrl}
                    onChange={(e) => setJobAfterUrl(e.target.value)}
                    className="flex-1 text-xs p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-mono"
                  />
                  <button
                    onClick={handleAddAfterPhoto}
                    className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
                  >
                    Add Photo
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {activeJob.afterPhotos.map((p, i) => (
                    <img key={i} src={p} alt="completed installation photo" className="w-full h-24 object-cover rounded-xl border-2 border-emerald-500 shadow-2xs" referrerPolicy="no-referrer" />
                  ))}
                </div>
              </div>

              {/* Completion Notes */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono block">Signage / Repair Notes</span>
                <textarea
                  placeholder="Add details about completed ACP brackets or LED wiring..."
                  value={jobNotesInput}
                  onChange={(e) => setJobNotesInput(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl h-16"
                />
              </div>

              {/* Strict Complete button */}
              <button
                onClick={handleCompleteSiteJob}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4.5 h-4.5" />
                {lang === 'EN' ? 'Complete Installation Job' : 'स्थापना कार्य समाप्त करें'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
