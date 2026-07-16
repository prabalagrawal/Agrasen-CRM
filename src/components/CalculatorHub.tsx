/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, Settings, RefreshCw, FilePlus, HelpCircle, TrendingUp, Sparkles } from 'lucide-react';
import { CalculatorRates } from '../types';

interface CalculatorHubProps {
  rates: CalculatorRates;
  onUpdateRates: (newRates: CalculatorRates) => void;
  onAddJobFromCalc: (job: { title: string; description: string; cost: number }) => void;
  userRole: string;
  lang: 'EN' | 'HI';
}

export default function CalculatorHub({ rates, onUpdateRates, onAddJobFromCalc, userRole, lang }: CalculatorHubProps) {
  // Calculator Type Selection
  const [calcType, setCalcType] = useState<
    'flex' | 'acp' | 'acrylic' | 'led' | 'sunboard' | 'vinyl' | 'cards' | 'wedding' | 'brochure' | 'stickers'
  >('flex');

  // Input states
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(4);
  const [quantity, setQuantity] = useState<number>(1);
  const [materialGrade, setMaterialGrade] = useState<string>('standard');
  const [hasInstallation, setHasInstallation] = useState<boolean>(true);
  const [hasTransport, setHasTransport] = useState<boolean>(true);
  const [customMargin, setCustomMargin] = useState<number>(rates.defaultProfitMargin);

  // Administrative formula config editor states
  const [showFormulaEditor, setShowFormulaEditor] = useState<boolean>(false);
  const [editableRates, setEditableRates] = useState<CalculatorRates>({ ...rates });

  // Handle live admin rate edits
  const handleRateFieldChange = (key: keyof CalculatorRates, val: number) => {
    const updated = { ...editableRates, [key]: val };
    setEditableRates(updated);
    onUpdateRates(updated);
  };

  // Perform Calculation logic based on selection
  const performCalculation = () => {
    let baseMaterialCost = 0;
    let basePrintingCost = 0;
    let baseLabourCost = 0;
    let name = '';

    const area = width * height;

    switch (calcType) {
      case 'flex':
        const flexPricePerSqft =
          materialGrade === 'star'
            ? rates.flexStar
            : materialGrade === 'backlit'
            ? rates.flexBacklit
            : rates.flexStandard;
        baseMaterialCost = area * flexPricePerSqft;
        basePrintingCost = area * 5; // standard printing machine wear and tear
        baseLabourCost = 1.5 * rates.labourRatePerHour; // 1.5 hours of finishing
        name = `Flex Banner (${materialGrade === 'star' ? 'Star Grade' : materialGrade === 'backlit' ? 'Backlit Glow' : 'Normal'})`;
        break;

      case 'acp':
        const acpPricePerSqft = materialGrade === 'premium' ? rates.acpPremium : rates.acpStandard;
        baseMaterialCost = area * acpPricePerSqft;
        basePrintingCost = area * 10; // Router cutting / design charges
        baseLabourCost = 5 * rates.labourRatePerHour; // structural framing takes 5 hours
        name = `ACP Signage Board (${materialGrade === 'premium' ? 'Premium Aludecor' : 'Standard Sheet'})`;
        break;

      case 'acrylic':
        const acrylicPricePerSqft = materialGrade === 'led' ? rates.acrylicLed : rates.acrylicStandard;
        baseMaterialCost = area * acrylicPricePerSqft;
        basePrintingCost = area * 15; // Laser cutting tool cost
        baseLabourCost = 4 * rates.labourRatePerHour;
        name = `Acrylic Letters Sign (${materialGrade === 'led' ? '3D LED Illuminated' : 'Standard 3D Acrylic'})`;
        break;

      case 'led':
        // Assuming about 15 LED modules per sqft
        const modulesNeeded = Math.ceil(area * 15);
        baseMaterialCost = modulesNeeded * rates.ledModuleSingle + Math.ceil(modulesNeeded / 40) * rates.ledPowerSupply;
        basePrintingCost = 200; // Wiring wiring loom heat shrink
        baseLabourCost = 3 * rates.labourRatePerHour;
        name = `LED Backlit Modules Kit (${modulesNeeded} modules)`;
        break;

      case 'sunboard':
        baseMaterialCost = area * rates.sunboardStandard;
        basePrintingCost = area * 8; // eco-solvent print cost
        baseLabourCost = 1 * rates.labourRatePerHour;
        name = `Sunboard Vinyl Mount Display`;
        break;

      case 'vinyl':
        const vinylPricePerSqft =
          materialGrade === 'glossy'
            ? rates.vinylGlossy
            : materialGrade === 'oneway'
            ? rates.vinylOneWay
            : rates.vinylStandard;
        baseMaterialCost = area * vinylPricePerSqft;
        basePrintingCost = area * 7;
        baseLabourCost = 2 * rates.labourRatePerHour;
        name = `Vinyl Glass Film (${materialGrade === 'glossy' ? 'Glossy Laminate' : materialGrade === 'oneway' ? 'One Way Vision' : 'Standard'})`;
        break;

      case 'cards':
        const cardRate = materialGrade === 'premium' ? rates.visitingCardPremium : rates.visitingCardStandard;
        // quantity is count, not area
        baseMaterialCost = quantity * cardRate;
        basePrintingCost = quantity * 0.2; // plates and offset charge
        baseLabourCost = 150; // cutting bundle packs
        name = `Visiting Cards (${materialGrade === 'premium' ? 'Premium Spot UV Velvet' : 'Standard 350GSM'})`;
        break;

      case 'wedding':
        baseMaterialCost = quantity * rates.weddingCardStandard;
        basePrintingCost = quantity * 2; // screen printing gold foil ink
        baseLabourCost = 400; // ribbon and manual envelope packing
        name = `Designer Wedding Cards Collection`;
        break;

      case 'brochure':
        baseMaterialCost = quantity * rates.brochureStandard;
        basePrintingCost = quantity * 1;
        baseLabourCost = 250; // machine creasing & folding
        name = `Company Brochure Pamphlets`;
        break;

      case 'stickers':
        baseMaterialCost = quantity * rates.stickerStandard;
        basePrintingCost = quantity * 0.5; // plotter kiss cut
        baseLabourCost = 100;
        name = `Custom Die-cut Stickers Roll`;
        break;
    }

    // Transport and Installation Base Costs
    const transportFee = hasTransport ? rates.transportBaseRate : 0;
    const installationFee = hasInstallation ? rates.installationBaseRate : 0;

    // Total raw cost
    const rawCost = (baseMaterialCost + basePrintingCost + baseLabourCost) * (calcType === 'cards' || calcType === 'wedding' || calcType === 'brochure' || calcType === 'stickers' ? 1 : quantity) + transportFee + installationFee;

    // Margin addition
    const marginAmount = rawCost * (customMargin / 100);
    const subtotal = rawCost + marginAmount;

    // GST calculation
    const gstAmount = subtotal * 0.18;
    const finalPrice = subtotal + gstAmount;

    return {
      name,
      materialCost: baseMaterialCost * (calcType === 'cards' || calcType === 'wedding' || calcType === 'brochure' || calcType === 'stickers' ? 1 : quantity),
      printingCost: basePrintingCost * (calcType === 'cards' || calcType === 'wedding' || calcType === 'brochure' || calcType === 'stickers' ? 1 : quantity),
      labourCost: baseLabourCost * (calcType === 'cards' || calcType === 'wedding' || calcType === 'brochure' || calcType === 'stickers' ? 1 : quantity),
      transportCost: transportFee,
      installationCost: installationFee,
      rawCost,
      marginAmount,
      subtotal,
      gstAmount,
      finalPrice,
    };
  };

  const results = performCalculation();

  const handleCreateJob = () => {
    onAddJobFromCalc({
      title: `${results.name} (${width}x${height} ft)`,
      description: `Automatically created from Smart Estimator. Dimensions: ${width}ft x ${height}ft, Qty: ${quantity}. Installation: ${hasInstallation ? 'Yes' : 'No'}.`,
      cost: Math.round(results.finalPrice),
    });
    alert(lang === 'EN' ? 'Job successfully logged as Approved from Calculator estimate!' : 'कैलकुलेटर एस्टीमेट से काम स्वीकृत के रूप में सफ़लतापूर्वक दर्ज किया गया!');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Selector & Inputs Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Calculator className="w-5 h-5 text-red-600" />
              {lang === 'EN' ? '1. Select Product Estimator' : '1. उत्पाद एस्टीमेटर चुनें'}
            </h3>
            {(userRole === 'Owner' || userRole === 'Manager') && (
              <button
                onClick={() => setShowFormulaEditor(!showFormulaEditor)}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                {showFormulaEditor ? 'Close Config' : 'Admin Formula Editor'}
              </button>
            )}
          </div>

          {/* Calculator Grid Picker */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
            {[
              { id: 'flex', label: lang === 'EN' ? 'Flex Banner' : 'फ्लेक्स बैनर' },
              { id: 'acp', label: lang === 'EN' ? 'ACP Board' : 'ACP बोर्ड' },
              { id: 'acrylic', label: lang === 'EN' ? 'Acrylic Letter' : 'एक्रेलिक अक्षर' },
              { id: 'led', label: lang === 'EN' ? 'LED Signage' : 'LED ग्लोबोर्ड' },
              { id: 'vinyl', label: lang === 'EN' ? 'Vinyl Wrap' : 'विनाइल ग्लास' },
              { id: 'sunboard', label: lang === 'EN' ? 'Sunboard' : 'सनबोर्ड' },
              { id: 'cards', label: lang === 'EN' ? 'Visiting Cards' : 'विजिटिंग कार्ड' },
              { id: 'wedding', label: lang === 'EN' ? 'Wedding Cards' : 'शादी कार्ड' },
              { id: 'brochure', label: lang === 'EN' ? 'Brochures' : 'पम्पलेट' },
              { id: 'stickers', label: lang === 'EN' ? 'Stickers' : 'स्टिकर' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setCalcType(p.id as any);
                  // Default parameters helper
                  if (p.id === 'cards' || p.id === 'wedding' || p.id === 'brochure' || p.id === 'stickers') {
                    setQuantity(100);
                  } else {
                    setQuantity(1);
                  }
                }}
                className={`py-2 px-3 border rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                  calcType === p.id
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-3xs font-extrabold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Dynamic input parameters form */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-850 uppercase tracking-wider mb-2">
              {lang === 'EN' ? '2. Set Project Specifications' : '2. प्रोजेक्ट का विवरण सेट करें'}
            </h4>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Dimensions toggle */}
              {!(calcType === 'cards' || calcType === 'wedding' || calcType === 'brochure' || calcType === 'stickers') ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {lang === 'EN' ? 'Width (Feet)' : 'चौड़ाई (फीट)'}
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {lang === 'EN' ? 'Height (Feet)' : 'ऊंचाई (फीट)'}
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {lang === 'EN' ? 'Card / Flyer Paper Type' : 'पेपर का प्रकार'}
                  </label>
                  <select
                    value={materialGrade}
                    onChange={(e) => setMaterialGrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="standard">Standard 300 GSM Matte</option>
                    <option value="premium">Premium Velvet Spot UV</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {lang === 'EN' ? 'Quantity (Items / Banners)' : 'मात्रा (नग)'}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Sub-material dropdown choices */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {calcType === 'flex' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Flex roll grade</label>
                  <select
                    value={materialGrade}
                    onChange={(e) => setMaterialGrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="standard">Normal Flex (Frontlit) - ₹{rates.flexStandard}/sqft</option>
                    <option value="star">Star Flex (Premium Glossy) - ₹{rates.flexStar}/sqft</option>
                    <option value="backlit">Retro Backlit Glow Sign Flex - ₹{rates.flexBacklit}/sqft</option>
                  </select>
                </div>
              )}

              {calcType === 'acp' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ACP grade</label>
                  <select
                    value={materialGrade}
                    onChange={(e) => setMaterialGrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="standard">Standard Aludecor Sheet - ₹{rates.acpStandard}/sqft</option>
                    <option value="premium">Premium Wooden/Gloss ACP - ₹{rates.acpPremium}/sqft</option>
                  </select>
                </div>
              )}

              {calcType === 'acrylic' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Letter backing</label>
                  <select
                    value={materialGrade}
                    onChange={(e) => setMaterialGrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="standard">Standard Acrylic Solid Letters - ₹{rates.acrylicStandard}/sqft</option>
                    <option value="led">Illuminated Samsung LED 3D Letters - ₹{rates.acrylicLed}/sqft</option>
                  </select>
                </div>
              )}

              {calcType === 'vinyl' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Vinyl type</label>
                  <select
                    value={materialGrade}
                    onChange={(e) => setMaterialGrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="standard">Eco Solvent Normal Vinyl - ₹{rates.vinylStandard}/sqft</option>
                    <option value="glossy">High-Gloss Premium Vinyl - ₹{rates.vinylGlossy}/sqft</option>
                    <option value="oneway">One Way Glass Vision Film - ₹{rates.vinylOneWay}/sqft</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {lang === 'EN' ? 'Profit Margin Percentage' : 'लाभ मार्जिन %'}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={customMargin}
                  onChange={(e) => setCustomMargin(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 my-3"
                />
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
                  <span>10% Low</span>
                  <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{customMargin}% Target</span>
                  <span>100% High</span>
                </div>
              </div>
            </div>

            {/* Logistics & Labor toggles */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3.5 p-3.5 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasInstallation}
                  onChange={(e) => setHasInstallation(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {lang === 'EN' ? 'Include Site Installation' : 'साइट फिटिंग शामिल करें'}
                  </div>
                  <p className="text-[10px] text-slate-500">Adds flat ₹{rates.installationBaseRate} iron frame installation</p>
                </div>
              </label>

              <label className="flex items-center gap-3.5 p-3.5 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasTransport}
                  onChange={(e) => setHasTransport(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {lang === 'EN' ? 'Include Tempo/E-Rickshaw Transport' : 'गाड़ी भाड़ा / परिवहन शामिल करें'}
                  </div>
                  <p className="text-[10px] text-slate-500">Adds flat ₹{rates.transportBaseRate} delivery dispatch charge</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Admin Rates Panel */}
        {showFormulaEditor && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 font-mono text-xs space-y-4 shadow-md">
            <h4 className="font-sans font-bold text-red-500 text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
              <Settings className="w-4 h-4" />
              Admin Formula Configurator: Standard Rates Directory
            </h4>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Modifying these prices updates calculations instantly. The application stores rates inside reactive state hooks so formulas adapt on keypress.
            </p>

            <div className="grid sm:grid-cols-3 gap-3.5 pt-2">
              {[
                { label: 'Standard Flex /sqft', key: 'flexStandard' },
                { label: 'Star Flex /sqft', key: 'flexStar' },
                { label: 'Backlit Flex /sqft', key: 'flexBacklit' },
                { label: 'Standard ACP /sqft', key: 'acpStandard' },
                { label: 'Premium ACP /sqft', key: 'acpPremium' },
                { label: '3D Acrylic /sqft', key: 'acrylicStandard' },
                { label: 'LED Acrylic /sqft', key: 'acrylicLed' },
                { label: 'Normal Vinyl /sqft', key: 'vinylStandard' },
                { label: 'Glossy Vinyl /sqft', key: 'vinylGlossy' },
                { label: 'One Way Vinyl /sqft', key: 'vinylOneWay' },
                { label: 'Base Labour /hr', key: 'labourRatePerHour' },
                { label: 'Base Transport Fee', key: 'transportBaseRate' },
                { label: 'Base Installation Fee', key: 'installationBaseRate' },
              ].map((rate) => (
                <div key={rate.key}>
                  <label className="block text-[10px] text-slate-450 mb-1">{rate.label}</label>
                  <input
                    type="number"
                    value={editableRates[rate.key as keyof CalculatorRates] || 0}
                    onChange={(e) => handleRateFieldChange(rate.key as any, parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Breakdown and Selling Price Summary */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5 text-sm uppercase tracking-wider">
            <TrendingUp className="w-5 h-5 text-red-600" />
            {lang === 'EN' ? '3. Estimate Invoice Summary' : '3. एस्टीमेट बिल विवरण'}
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Selected Product:</span>
              <span className="font-bold text-slate-900 text-right">{results.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Material Cost:</span>
              <span className="font-bold text-slate-800">₹{results.materialCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Printing wear & tear:</span>
              <span className="font-bold text-slate-800">₹{results.printingCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Labour Charge:</span>
              <span className="font-bold text-slate-800">₹{results.labourCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Transport flat-fee:</span>
              <span className="font-bold text-slate-800">₹{results.transportCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Installation flat-fee:</span>
              <span className="font-bold text-slate-800">₹{results.installationCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-dashed border-slate-200">
              <span className="text-slate-600 font-bold">Total Raw Cost:</span>
              <span className="font-bold text-slate-900">₹{Math.round(results.rawCost).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Markup Margin (+{customMargin}%):</span>
              <span>₹{Math.round(results.marginAmount).toLocaleString()}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Subtotal (Pre-Tax):</span>
              <span className="font-bold text-slate-900">₹{Math.round(results.subtotal).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>GST Tax (18%):</span>
              <span>₹{Math.round(results.gstAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Final Price Block */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4.5 text-center">
            <div className="text-[10px] uppercase font-mono text-red-800 font-extrabold tracking-widest mb-1.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-600" /> Estimated Final Selling Price
            </div>
            <div className="text-3xl font-display font-extrabold text-red-600">
              ₹{Math.round(results.finalPrice).toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-450 mt-1 font-mono">
              Inclusive of GST & Services. Rate code: R-{calcType.toUpperCase()}
            </div>
          </div>

          <button
            onClick={handleCreateJob}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all hover:shadow-sm cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            {lang === 'EN' ? 'Convert to Approved Work Order' : 'मंजूर वर्क ऑर्डर में बदलें'}
          </button>
        </div>
      </div>
    </div>
  );
}
