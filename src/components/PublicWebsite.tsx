/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, UploadCloud, CheckCircle, FileText, Globe } from 'lucide-react';

interface PublicWebsiteProps {
  onAddJob: (job: { title: string; description: string; cost: number; customerName: string }) => void;
  lang: 'EN' | 'HI';
}

export default function PublicWebsite({ onAddJob, lang }: PublicWebsiteProps) {
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteService, setQuoteService] = useState('Flex Banner');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const services = [
    { name: 'Flex Banners (Star & Retro)', desc: 'High strength, vibrant color reproduction, weather-proof outdoor flex printing.' },
    { name: 'ACP Elevation Glow Signboards', desc: 'Premium Aluminum Composite Panel backing with CNC router 3D acrylic raised LED letters.' },
    { name: '3D Acrylic & LED Signages', desc: 'Energy-efficient high-visibility letters for brand showcases, frontages and halls.' },
    { name: 'Vinyl Printing & Glass Filming', desc: 'Glossy/Matte vinyl laminates, One Way Vision films, and frosted privacy door textures.' },
    { name: 'Visiting Cards & Stationery', desc: 'Premium thick card stocks, velvet/uv lamination, wedding cards, flyers, and pamphlets.' },
    { name: 'Sunboard Displays & Standees', desc: 'Indoor foam board panels, custom shapes cutouts, and roll-up standees for exhibitions.' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quotePhone) {
      alert(lang === 'EN' ? 'Please fill in your name and phone number.' : 'कृपया अपना नाम और फ़ोन नंबर दर्ज करें।');
      return;
    }

    // Add a simulated job
    onAddJob({
      title: `${quoteService} - Public Request`,
      description: quoteDesc || `Requested from public website. File: ${uploadedFileName || 'No design uploaded'}`,
      cost: 0, // Assigned by owner later
      customerName: quoteName,
    });

    setSuccessMsg(
      lang === 'EN'
        ? 'Thank you! Your quotation request has been logged. Our receptionist will call you within 15 minutes.'
        : 'धन्यवाद! आपकी कोटेशन रिक्वेस्ट दर्ज कर ली गई है। हमारे कर्मचारी 15 मिनट के भीतर आपसे संपर्क करेंगे।'
    );

    // Reset Form
    setQuoteName('');
    setQuotePhone('');
    setQuoteDesc('');
    setUploadedFile(null);
    setUploadedFileName('');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Brand Hero banner */}
      <div className="bg-slate-900 text-white relative py-24 px-8 text-center border-b-4 border-red-600 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white font-mono text-xs font-bold uppercase rounded-full tracking-wider shadow-xs animate-pulse">
            <Globe className="w-3.5 h-3.5" /> 20+ Years of Craftsmanship
          </div>
          <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tight leading-tight">
            {lang === 'EN' ? 'Premium Flex & Glow Signage Manufacturing' : 'प्रीमियम फ्लेक्स और ग्लो साइनबोर्ड निर्माता'}
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            {lang === 'EN'
              ? 'Agrasen Flex Printers manufactures industrial-grade indoor and outdoor signboards, front-lit/back-lit retro banners, 3D acrylic letters, and premium commercial stationery since 2006.'
              : 'अग्रसेन फ्लेक्स प्रिंटर्स 2006 से औद्योगिक स्तर के इनडोर और आउटडोर साइनबोर्ड, फ्रंट-लिट/बैक-लिट रेट्रो बैनर, 3D एक्रेलिक लेटर और प्रीमियम व्यावसायिक स्टेशनरी का निर्माण करते आ रहे हैं।'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#quote-form" className="px-6.5 py-3.5 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition-all text-xs uppercase tracking-wider">
              {lang === 'EN' ? 'Request Instant Quotation' : 'तुरंत कोटेशन प्राप्त करें'}
            </a>
            <a href="#services-list" className="px-6.5 py-3.5 bg-slate-800 text-slate-200 border border-slate-700 font-bold rounded-xl hover:bg-slate-700 transition-all text-xs uppercase tracking-wider">
              {lang === 'EN' ? 'View Our Services' : 'हमारी सेवाएं देखें'}
            </a>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto py-20 px-6" id="services-list">
        <div className="text-center mb-14 space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight font-display">
            {lang === 'EN' ? 'What We Manufacture' : 'हम क्या बनाते हैं'}
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full" />
          <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
            {lang === 'EN' ? 'Complete execution from raw materials to final site installation under one roof.' : 'कच्चे माल की खरीद से लेकर अंतिम साइट पर फिटिंग तक की पूरी जिम्मेदारी हमारे एक ही छत के नीचे।'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div key={idx} className="bg-white p-6 border border-slate-200/80 rounded-2xl hover:shadow-md hover:border-red-200 transition-all flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base mb-2.5 font-display">{svc.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{svc.desc}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-red-600 uppercase tracking-wider">
                <span>{lang === 'EN' ? 'Commercial Quality' : 'व्यावसायिक गुणवत्ता'}</span>
                <span className="text-red-500">★ ★ ★ ★ ★</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Request Form & Upload Design Section */}
      <div className="bg-white border-y border-slate-200/80 py-20 px-6" id="quote-form">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left info column */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              {lang === 'EN' ? 'Let\'s start your project' : 'अपना प्रोजेक्ट शुरू करें'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
              {lang === 'EN'
                ? 'Fill out the form with your required size parameters. If you have an existing layout or drawing (CDR, PDF, AI, JPG), upload it. Our sales team will verify specs and prepare a GST quotation.'
                : 'अपनी आवश्यकता के अनुसार विवरण भरें। यदि आपके पास कोई डिज़ाइन या ड्राइंग (CDR, PDF, AI, JPG) है, तो उसे अपलोड करें। हमारी सेल्स टीम तुरंत जीएसटी कोटेशन तैयार करेगी।'}
            </p>

            <div className="space-y-4 pt-6 border-t border-slate-150">
              <div className="flex items-center gap-4 text-sm text-slate-800 p-3 rounded-2xl hover:bg-slate-55/10 transition-colors">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-950">+91 98765-43210 / 011-27004455</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === 'EN' ? 'Owner Ramesh Sharma' : 'मालिक रमेश शर्मा'}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-800 p-3 rounded-2xl hover:bg-slate-55/10 transition-colors">
                <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-950">Agrasen Flex Printers Hub</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gali No. 4, Industrial Area, Rohini Sec 3, Delhi</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-800 p-3 rounded-2xl hover:bg-slate-55/10 transition-colors">
                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-950 font-mono">agrasenflex@gmail.com</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sales & Business Inquiries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="p-6 border border-slate-200/80 rounded-2xl bg-slate-50 shadow-xs">
            <h3 className="font-display font-extrabold text-slate-900 mb-5 pb-3 border-b border-slate-200/80 text-sm uppercase tracking-wider">
              {lang === 'EN' ? 'Request Free Quotation' : 'मुफ़्त कोटेशन अनुरोध'}
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex gap-2 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRequestQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  {lang === 'EN' ? 'Your Name' : 'आपका नाम'} *
                </label>
                <input
                  type="text"
                  required
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="e.g. Sunil Kumar"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  {lang === 'EN' ? 'WhatsApp Phone' : 'व्हाट्सएप मोबाइल'} *
                </label>
                <input
                  type="tel"
                  required
                  value={quotePhone}
                  onChange={(e) => setQuotePhone(e.target.value)}
                  placeholder="e.g. 9812345678"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  {lang === 'EN' ? 'Service Required' : 'आवश्यक सेवा'}
                </label>
                <select
                  value={quoteService}
                  onChange={(e) => setQuoteService(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="Flex Banner">Flex Banner Printing</option>
                  <option value="ACP LED Signboard">ACP 3D LED Signboard</option>
                  <option value="Acrylic Letters">Acrylic Raised Letters</option>
                  <option value="Vinyl Wrap">One Way Glass Vinyl</option>
                  <option value="Visiting Cards">Business Visiting Cards</option>
                  <option value="Wedding / Stationery">Wedding & Brochure Cards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  {lang === 'EN' ? 'Project Dimensions / Details' : 'प्रोजेक्ट का आकार / विवरण'}
                </label>
                <textarea
                  value={quoteDesc}
                  onChange={(e) => setQuoteDesc(e.target.value)}
                  rows={3}
                  placeholder="e.g. Need ACP Board size 8ft x 3ft in Blue color with Warm LEDs."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  {lang === 'EN' ? 'Upload Design File (CDR, PDF, JPG)' : 'डिज़ाइन फाइल अपलोड करें'}
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-red-500 rounded-xl p-5 text-center cursor-pointer bg-white transition-all relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    {uploadedFileName ? (
                      <span className="text-red-600 font-bold flex items-center justify-center gap-1.5">
                        <FileText className="w-4 h-4" /> {uploadedFileName}
                      </span>
                    ) : lang === 'EN' ? (
                      'Drag & Drop or Click to Upload design layout'
                    ) : (
                      'फ़ाइल यहाँ खींचें या अपलोड करने के लिए क्लिक करें'
                    )}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-red-700 hover:shadow-sm transition-all uppercase tracking-wider cursor-pointer"
              >
                {lang === 'EN' ? 'Send Request to Reception' : 'रिसेप्शन को अनुरोध भेजें'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
