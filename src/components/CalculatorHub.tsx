/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calculator, Settings, RefreshCw, FilePlus, HelpCircle, 
  TrendingUp, Sparkles, Plus, Trash, Check, X, FileText, 
  ArrowRight, Download, Save, Users, AlertCircle, ShoppingCart, Edit, Info
} from 'lucide-react';
import { CalculatorRates, Customer, Quotation, QuoteItem } from '../types';

interface CalculatorHubProps {
  rates: CalculatorRates;
  onUpdateRates: (newRates: CalculatorRates) => void;
  onAddJobFromCalc: (job: { title: string; description: string; cost: number; customerName: string }) => void;
  userRole: string;
  lang: 'EN' | 'HI';
  customers?: Customer[];
  onAddQuotation?: (q: Quotation) => void;
}

// Custom structure for a confirmed item in our Estimate Builder
export interface EstimateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  // Core structured cost output required
  materialCost: number;
  machineCost: number;
  printingCost: number;
  labourCost: number;
  transportCost: number;
  miscCost: number;
  subtotal: number;
  gstAmount: number;
  profitPercent: number;
  profitAmount: number;
  finalSellingPrice: number;
  // Raw parameters to allow loading back into calculator for editing!
  rawParams: any;
}

export default function CalculatorHub({ 
  rates, 
  onUpdateRates, 
  onAddJobFromCalc, 
  userRole, 
  lang,
  customers = [],
  onAddQuotation
}: CalculatorHubProps) {

  // Selected Active Sub-Calculator
  const [activeCalc, setActiveCalc] = useState<
    'printing' | 'frame' | 'standee' | 'visiting_card' | 'wedding_card' | 'marketing' | 'labour' | 'transport'
  >('printing');

  // --- STATE FOR ESTIMATE BUILDER (Line Items List) ---
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>(() => {
    const saved = localStorage.getItem('abms_temp_estimate');
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Customer for estimate
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customCustomerName, setCustomCustomerName] = useState<string>('');

  // Editing state - if editing an item already inside the estimate list
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Core administrative formula configurations
  const [showFormulaEditor, setShowFormulaEditor] = useState<boolean>(false);
  const [adminRates, setAdminRates] = useState<any>({
    // Standard inputs from rates prop
    ...rates,
    // Frame materials
    msFrameRate: 75, // per kg
    giFrameRate: 95, // per kg
    woodenFrameRate: 55, // per running foot
    aluminiumFrameRate: 190, // per kg
    cuttingRate: 45,
    weldingRate: 120,
    paintingRate: 80,
    fabricationLabourRate: 250,
    // Standee accessories
    rollUpStandCost: 650,
    xStandCost: 280,
    lStandCost: 380,
    promoStandCost: 1250,
    carryBagCost: 75,
    packagingBaseCost: 45,
    // Wedding card categories
    weddingCardHandmadePaper: 22,
    weddingCardTexturedPaper: 18,
    weddingCardMetallicPaper: 28,
    weddingCardVelvetPaper: 40,
    weddingEnvelopeSimple: 6,
    weddingEnvelopeDesigner: 18,
    weddingEnvelopeVelvetBox: 65,
    // Labour standard hourly fees
    electricianHourlyRate: 250,
    welderHourlyRate: 220,
    helperHourlyRate: 110,
    designerHourlyRate: 350,
    printerHourlyRate: 180,
    // Transport parameters
    fuelDieselRate: 12,
    fuelCngRate: 8,
    fuelPetrolRate: 15,
    vehicleTataAceBase: 650,
    vehicleERickshawBase: 220,
    vehicleBoleroBase: 850,
    vehicleThreeWheelerBase: 380,
  });

  // Synced from persistent store if available
  useEffect(() => {
    const savedAdminRates = localStorage.getItem('abms_calculator_admin_rates');
    if (savedAdminRates) {
      setAdminRates(JSON.parse(savedAdminRates));
    }
  }, []);

  // Sync estimate to local storage
  useEffect(() => {
    localStorage.setItem('abms_temp_estimate', JSON.stringify(estimateItems));
  }, [estimateItems]);

  // Handle Admin Configuration updates
  const handleUpdateAdminRates = (key: string, val: number) => {
    const updated = { ...adminRates, [key]: val };
    setAdminRates(updated);
    localStorage.setItem('abms_calculator_admin_rates', JSON.stringify(updated));
    // Also sync back standard rates if matching
    if (key in rates) {
      onUpdateRates({ ...rates, [key]: val } as any);
    }
  };

  // --- PARAMETERS FOR THE 8 SUB-CALCULATORS ---
  
  // 1. Printing Calculator states
  const [printProduct, setPrintProduct] = useState<string>('Flex Banner');
  const [printWidth, setPrintWidth] = useState<number>(10);
  const [printHeight, setPrintHeight] = useState<number>(4);
  const [printQuantity, setPrintQuantity] = useState<number>(1);
  const [printMaterialGrade, setPrintMaterialGrade] = useState<string>('Standard');
  const [printProfitMargin, setPrintProfitMargin] = useState<number>(adminRates.defaultProfitMargin || 30);

  // 2. Frame Calculator states
  const [frameType, setFrameType] = useState<string>('MS Frame');
  const [frameWidth, setFrameWidth] = useState<number>(8);
  const [frameHeight, setFrameHeight] = useState<number>(4);
  const [framePipeSize, setFramePipeSize] = useState<string>('1.5 inch');
  const [framePipeWeight, setFramePipeWeight] = useState<number>(0.8); // kg per feet
  const [frameProfitMargin, setFrameProfitMargin] = useState<number>(30);

  // 3. Standee Calculator states
  const [standeeType, setStandeeType] = useState<string>('Roll-Up Standee');
  const [standeeSize, setStandeeSize] = useState<string>('2.5x6 Feet');
  const [standeeMaterial, setStandeeMaterial] = useState<string>('Star Flex');
  const [standeeQty, setStandeeQty] = useState<number>(2);
  const [standeeProfitMargin, setStandeeProfitMargin] = useState<number>(30);

  // 4. Visiting Card Calculator states
  const [cardGsm, setCardGsm] = useState<string>('350 GSM');
  const [cardSides, setCardSides] = useState<'Single' | 'Double'>('Double');
  const [cardFinish, setCardFinish] = useState<'Matt' | 'Gloss' | 'Soft Touch'>('Matt');
  const [cardSpecial, setCardSpecial] = useState<string>('Spot UV');
  const [cardQty, setCardQty] = useState<number>(1000);
  const [cardProfitMargin, setCardProfitMargin] = useState<number>(35);

  // 5. Wedding Card Calculator states
  const [weddingPaper, setWeddingPaper] = useState<string>('Metallic');
  const [weddingPrintType, setWeddingPrintType] = useState<string>('Digital Print');
  const [weddingEnvelope, setWeddingEnvelope] = useState<string>('Designer');
  const [weddingFoiling, setWeddingFoiling] = useState<'Gold' | 'Silver' | 'None'>('Gold');
  const [weddingAccessory, setWeddingAccessory] = useState<'Ribbon' | 'Wax Seal' | 'Tassel' | 'None'>('Ribbon');
  const [weddingQty, setWeddingQty] = useState<number>(200);
  const [weddingProfitMargin, setWeddingProfitMargin] = useState<number>(40);

  // 6. Marketing Material Calculator states
  const [marketingType, setMarketingType] = useState<string>('Brochures');
  const [marketingPaper, setMarketingPaper] = useState<string>('170 GSM Matte');
  const [marketingQty, setMarketingQty] = useState<number>(500);
  const [marketingProfitMargin, setMarketingProfitMargin] = useState<number>(30);

  // 7. Labour Calculator states
  const [labourType, setLabourType] = useState<string>('Fabrication');
  const [labourRateType, setLabourRateType] = useState<'Hourly' | 'Daily'>('Hourly');
  const [labourDuration, setLabourDuration] = useState<number>(12); // hours or days
  const [labourWorkerCount, setLabourWorkerCount] = useState<number>(2);
  const [labourProfitMargin, setLabourProfitMargin] = useState<number>(20);

  // 8. Transport Calculator states
  const [transportDistance, setTransportDistance] = useState<number>(25); // km
  const [transportFuel, setTransportFuel] = useState<'Diesel' | 'CNG' | 'Petrol'>('Diesel');
  const [transportVehicle, setTransportVehicle] = useState<string>('Chota Hathi / Tata Ace');
  const [transportDriverIncluded, setTransportDriverIncluded] = useState<boolean>(true);
  const [transportHelpers, setTransportHelpers] = useState<number>(1);
  const [transportToll, setTransportToll] = useState<number>(120);
  const [transportProfitMargin, setTransportProfitMargin] = useState<number>(15);

  // --- OUTPUT CALCULATED STATE FOR PREVIEW ---
  const [currentPreview, setCurrentPreview] = useState<EstimateItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // --- INTERNAL CALCULATION ENGINE ---
  const calculateCurrentProduct = (): EstimateItem => {
    let name = '';
    let category = '';
    let quantity = 1;

    let materialCost = 0;
    let machineCost = 0;
    let printingCost = 0;
    let labourCost = 0;
    let transportCost = 0;
    let miscCost = 0;
    let profitPercent = 30;

    const rawParams: any = { activeCalc };

    if (activeCalc === 'printing') {
      category = 'Printing';
      quantity = printQuantity;
      profitPercent = printProfitMargin;
      rawParams.printProduct = printProduct;
      rawParams.printWidth = printWidth;
      rawParams.printHeight = printHeight;
      rawParams.printQuantity = printQuantity;
      rawParams.printMaterialGrade = printMaterialGrade;
      rawParams.printProfitMargin = printProfitMargin;

      const area = printWidth * printHeight;
      let baseRate = adminRates.flexStandard;

      if (printProduct === 'Flex Banner') {
        baseRate = printMaterialGrade === 'Premium' ? adminRates.flexStar : adminRates.flexStandard;
      } else if (printProduct === 'Backlit Flex') {
        baseRate = adminRates.flexBacklit;
      } else if (printProduct === 'Vinyl') {
        baseRate = printMaterialGrade === 'Premium' ? adminRates.vinylGlossy : adminRates.vinylStandard;
      } else if (printProduct === 'One Way Vision') {
        baseRate = adminRates.vinylOneWay;
      } else if (printProduct === 'Sunboard') {
        baseRate = adminRates.sunboardStandard;
      } else if (printProduct === 'Foam Board') {
        baseRate = adminRates.sunboardStandard * 1.2;
      } else if (printProduct === 'Canvas') {
        baseRate = 75;
      } else if (printProduct === 'ACP Printing') {
        baseRate = adminRates.acpStandard;
      } else if (printProduct === 'Acrylic Printing') {
        baseRate = adminRates.acrylicStandard;
      } else if (printProduct === 'LED Board') {
        baseRate = adminRates.acrylicLed;
      } else if (printProduct === 'Glow Sign') {
        baseRate = 145;
      }

      name = `${printProduct} (${printWidth}x${printHeight} ft) - ${printMaterialGrade}`;
      materialCost = area * baseRate * printQuantity;
      machineCost = area * 8 * printQuantity; // Eco-solvent printer wear and tear
      printingCost = area * 6 * printQuantity; // Ink consumption
      labourCost = printQuantity * 120; // Framing & grommets labor
      transportCost = 150; 
      miscCost = 40 * printQuantity;

    } else if (activeCalc === 'frame') {
      category = 'Frame';
      quantity = 1;
      profitPercent = frameProfitMargin;
      rawParams.frameType = frameType;
      rawParams.frameWidth = frameWidth;
      rawParams.frameHeight = frameHeight;
      rawParams.framePipeSize = framePipeSize;
      rawParams.framePipeWeight = framePipeWeight;
      rawParams.frameProfitMargin = frameProfitMargin;

      // Running length of pipe around perimeter + 1 center bar support
      const runningFeet = (frameWidth + frameHeight) * 2 + frameWidth;
      const totalWeightKg = runningFeet * framePipeWeight;

      let pipeRate = adminRates.msFrameRate;
      if (frameType === 'GI Frame') pipeRate = adminRates.giFrameRate;
      else if (frameType === 'Wooden Frame') pipeRate = adminRates.woodenFrameRate;
      else if (frameType === 'Aluminium Frame') pipeRate = adminRates.aluminiumFrameRate;
      else if (frameType === 'Custom Frame') pipeRate = 125;

      name = `${frameType} (${frameWidth}x${frameHeight} ft) [Pipe: ${framePipeSize}]`;
      
      // For wooden frame, pricing is based on running length, otherwise weight
      materialCost = frameType === 'Wooden Frame' ? runningFeet * pipeRate : totalWeightKg * pipeRate;
      machineCost = adminRates.cuttingRate + adminRates.weldingRate; // saws + welding power consumption
      printingCost = 0;
      labourCost = adminRates.fabricationLabourRate + (runningFeet * 5); // fabrication labor + layout labor
      transportCost = 250;
      miscCost = adminRates.paintingRate + 80; // anti-rust coating / paints / screws

    } else if (activeCalc === 'standee') {
      category = 'Standee';
      quantity = standeeQty;
      profitPercent = standeeProfitMargin;
      rawParams.standeeType = standeeType;
      rawParams.standeeSize = standeeSize;
      rawParams.standeeMaterial = standeeMaterial;
      rawParams.standeeQty = standeeQty;
      rawParams.standeeProfitMargin = standeeProfitMargin;

      let standCost = adminRates.rollUpStandCost;
      if (standeeType === 'X Stand') standCost = adminRates.xStandCost;
      else if (standeeType === 'L Stand') standCost = adminRates.lStandCost;
      else if (standeeType === 'Promotional Standee') standCost = adminRates.promoStandCost;

      let printArea = 15; // default 2.5x6 feet
      if (standeeSize === '2x5 Feet') printArea = 10;
      else if (standeeSize === '3x6 Feet') printArea = 18;

      let printRate = adminRates.flexStandard;
      if (standeeMaterial === 'Star Flex') printRate = adminRates.flexStar;
      else if (standeeMaterial === 'Vinyl Matte' || standeeMaterial === 'Vinyl Glossy') printRate = adminRates.vinylStandard;

      name = `${standeeType} - Size ${standeeSize} (${standeeMaterial})`;
      
      materialCost = (standCost + adminRates.carryBagCost) * standeeQty;
      machineCost = printArea * 5 * standeeQty;
      printingCost = printArea * printRate * standeeQty;
      labourCost = standeeQty * 60; // assembly fitting labor
      transportCost = 100;
      miscCost = adminRates.packagingBaseCost * standeeQty;

    } else if (activeCalc === 'visiting_card') {
      category = 'Visiting Card';
      quantity = cardQty;
      profitPercent = cardProfitMargin;
      rawParams.cardGsm = cardGsm;
      rawParams.cardSides = cardSides;
      rawParams.cardFinish = cardFinish;
      rawParams.cardSpecial = cardSpecial;
      rawParams.cardQty = cardQty;
      rawParams.cardProfitMargin = cardProfitMargin;

      let paperBase = 0.5; // per card
      if (cardGsm === '350 GSM') paperBase = 0.75;
      else if (cardGsm === '400 GSM') paperBase = 1.1;

      let finishingRate = 0.2;
      if (cardFinish === 'Gloss') finishingRate = 0.25;
      else if (cardFinish === 'Soft Touch') finishingRate = 0.6;

      let enhancementCost = 0;
      if (cardSpecial === 'Spot UV') enhancementCost = 0.5 * cardQty;
      else if (cardSpecial === 'Foiling') enhancementCost = 1.2 * cardQty;
      else if (cardSpecial === 'Rounded Corners') enhancementCost = 0.15 * cardQty;

      name = `Visiting Cards (${cardGsm}) - ${cardSides} Sided, ${cardFinish} finish`;
      
      materialCost = paperBase * cardQty;
      machineCost = 120 + (cardQty * 0.05); // heavy cutter & offset press wear
      printingCost = (cardSides === 'Double' ? 1.4 : 0.8) * cardQty;
      labourCost = 250; // sorting, inspection and box packing
      transportCost = 0;
      miscCost = (finishingRate * cardQty) + enhancementCost;

    } else if (activeCalc === 'wedding_card') {
      category = 'Wedding Card';
      quantity = weddingQty;
      profitPercent = weddingProfitMargin;
      rawParams.weddingPaper = weddingPaper;
      rawParams.weddingPrintType = weddingPrintType;
      rawParams.weddingEnvelope = weddingEnvelope;
      rawParams.weddingFoiling = weddingFoiling;
      rawParams.weddingAccessory = weddingAccessory;
      rawParams.weddingQty = weddingQty;
      rawParams.weddingProfitMargin = weddingProfitMargin;

      let paperRate = adminRates.weddingCardHandmadePaper;
      if (weddingPaper === 'Textured') paperRate = adminRates.weddingCardTexturedPaper;
      else if (weddingPaper === 'Metallic') paperRate = adminRates.weddingCardMetallicPaper;
      else if (weddingPaper === 'Velvet') paperRate = adminRates.weddingCardVelvetPaper;

      let printingRate = 5; // standard print per card
      if (weddingPrintType === 'Screen Print') printingRate = 8;
      else if (weddingPrintType === 'Foil Print') printingRate = 15;
      else if (weddingPrintType === 'Offset Press') printingRate = 4;

      let envRate = adminRates.weddingEnvelopeSimple;
      if (weddingEnvelope === 'Designer') envRate = adminRates.weddingEnvelopeDesigner;
      else if (weddingEnvelope === 'Velvet Box') envRate = adminRates.weddingEnvelopeVelvetBox;

      let accessoryRate = 0;
      if (weddingAccessory === 'Ribbon') accessoryRate = 5;
      else if (weddingAccessory === 'Wax Seal') accessoryRate = 12;
      else if (weddingAccessory === 'Tassel') accessoryRate = 6;

      name = `Wedding Card [${weddingPaper} Paper] + ${weddingEnvelope} Envelope`;
      
      materialCost = (paperRate + envRate + accessoryRate) * weddingQty;
      machineCost = weddingQty * 2; // plate preparation & heat embossing machine
      printingCost = (printingRate + (weddingFoiling !== 'None' ? 6 : 0)) * weddingQty;
      labourCost = weddingQty * 8; // envelope manual assembly, folding, bow gluing
      transportCost = 0;
      miscCost = weddingQty * 1.5; // glue stick & packing cartons

    } else if (activeCalc === 'marketing') {
      category = 'Marketing Material';
      quantity = marketingQty;
      profitPercent = marketingProfitMargin;
      rawParams.marketingType = marketingType;
      rawParams.marketingPaper = marketingPaper;
      rawParams.marketingQty = marketingQty;
      rawParams.marketingProfitMargin = marketingProfitMargin;

      let unitMat = 2.5; // Flyer
      let unitPrint = 1.8;

      if (marketingType === 'Pamphlets') {
        unitMat = 1.1; unitPrint = 0.8;
      } else if (marketingType === 'Brochures') {
        unitMat = 6.5; unitPrint = 4.2;
      } else if (marketingType === 'Letterheads') {
        unitMat = 1.8; unitPrint = 1.0;
      } else if (marketingType === 'Envelopes') {
        unitMat = 2.2; unitPrint = 1.2;
      } else if (marketingType === 'Stickers') {
        unitMat = 0.6; unitPrint = 0.5;
      } else if (marketingType === 'ID Cards') {
        unitMat = 18.0; unitPrint = 12.0;
      } else if (marketingType === 'Certificates') {
        unitMat = 9.0; unitPrint = 6.0;
      }

      name = `${marketingType} - printed on ${marketingPaper}`;
      
      materialCost = unitMat * marketingQty;
      machineCost = marketingQty * 0.15; // folding machine & cutter
      printingCost = unitPrint * marketingQty;
      labourCost = 200 + (marketingQty * 0.1); // bundler & manual inspection
      transportCost = 0;
      miscCost = 100;

    } else if (activeCalc === 'labour') {
      category = 'Labour';
      quantity = labourWorkerCount;
      profitPercent = labourProfitMargin;
      rawParams.labourType = labourType;
      rawParams.labourRateType = labourRateType;
      rawParams.labourDuration = labourDuration;
      rawParams.labourWorkerCount = labourWorkerCount;
      rawParams.labourProfitMargin = labourProfitMargin;

      let standardHourRate = adminRates.helperHourlyRate;
      if (labourType === 'Electrician') standardHourRate = adminRates.electricianHourlyRate;
      else if (labourType === 'Welder') standardHourRate = adminRates.welderHourlyRate;
      else if (labourType === 'Designer') standardHourRate = adminRates.designerHourlyRate;
      else if (labourType === 'Printing') standardHourRate = adminRates.printerHourlyRate;
      else if (labourType === 'Fabrication') standardHourRate = adminRates.fabricationLabourRate;
      else if (labourType === 'Installation') standardHourRate = 200;

      const totalHours = labourRateType === 'Hourly' ? labourDuration : labourDuration * 8;
      const basePay = totalHours * standardHourRate * labourWorkerCount;

      name = `${labourType} Duty: ${labourWorkerCount} crew members for ${labourDuration} ${labourRateType === 'Hourly' ? 'Hrs' : 'Days'}`;
      
      materialCost = 0;
      machineCost = totalHours * 15 * labourWorkerCount; // tool rentals / ladders wear
      printingCost = 0;
      labourCost = basePay;
      transportCost = labourWorkerCount * 100; // worker pocket allowance travel
      miscCost = 150; // security gear helmet gloves hire

    } else if (activeCalc === 'transport') {
      category = 'Transport';
      quantity = 1;
      profitPercent = transportProfitMargin;
      rawParams.transportDistance = transportDistance;
      rawParams.transportFuel = transportFuel;
      rawParams.transportVehicle = transportVehicle;
      rawParams.transportDriverIncluded = transportDriverIncluded;
      rawParams.transportHelpers = transportHelpers;
      rawParams.transportToll = transportToll;
      rawParams.transportProfitMargin = transportProfitMargin;

      let vehicleBase = adminRates.vehicleTataAceBase;
      if (transportVehicle === 'E-Rickshaw') vehicleBase = adminRates.vehicleERickshawBase;
      else if (transportVehicle === 'Bolero Pickup') vehicleBase = adminRates.vehicleBoleroBase;
      else if (transportVehicle === '3-Wheeler') vehicleBase = adminRates.vehicleThreeWheelerBase;

      let fuelKMRate = adminRates.fuelDieselRate;
      if (transportFuel === 'CNG') fuelKMRate = adminRates.fuelCngRate;
      else if (transportFuel === 'Petrol') fuelKMRate = adminRates.fuelPetrolRate;

      const fuelSpent = transportDistance * fuelKMRate;
      const helpersWage = transportHelpers * 350; // load unload allowance
      const driverFee = transportDriverIncluded ? 400 : 0;

      name = `Logistics: ${transportVehicle} (${transportDistance} km distance)`;
      
      materialCost = 0;
      machineCost = fuelSpent; // Fuel cost categorized as machine/engine running
      printingCost = 0;
      labourCost = driverFee + helpersWage; // driver & manual loader labor
      transportCost = vehicleBase; // frame dispatch base rent
      miscCost = transportToll;

    }

    const rawCost = materialCost + machineCost + printingCost + labourCost + transportCost + miscCost;
    const profitAmount = rawCost * (profitPercent / 100);
    const subtotal = rawCost + profitAmount;
    const gstAmount = subtotal * 0.18; // 18% standard ERP Signage GST
    const finalSellingPrice = subtotal + gstAmount;

    return {
      id: editingItemId || `ITEM-${Date.now()}`,
      name,
      category,
      description: `Auto-calculated pricing estimate for ${category} with raw inputs.`,
      quantity,
      materialCost: Math.round(materialCost),
      machineCost: Math.round(machineCost),
      printingCost: Math.round(printingCost),
      labourCost: Math.round(labourCost),
      transportCost: Math.round(transportCost),
      miscCost: Math.round(miscCost),
      subtotal: Math.round(subtotal),
      gstAmount: Math.round(gstAmount),
      profitPercent,
      profitAmount: Math.round(profitAmount),
      finalSellingPrice: Math.round(finalSellingPrice),
      rawParams
    };
  };

  // Perform active calculation
  const results = calculateCurrentProduct();

  // --- 6 REQUIRED BUTTONS DISPATCHERS ---

  // Button 1: Calculate
  const handleCalculateBtn = () => {
    // Computes and sets current state, which updates live display cards
    const calculated = calculateCurrentProduct();
    setCurrentPreview(calculated);
    alert(lang === 'EN' ? `Calculation successful! Final Selling Price is ₹${calculated.finalSellingPrice.toLocaleString()}` : `गणना सफल! अंतिम बिक्री मूल्य ₹${calculated.finalSellingPrice.toLocaleString()} है`);
  };

  // Button 2: Preview cost breakdown modal
  const handlePreviewBtn = () => {
    const calculated = calculateCurrentProduct();
    setCurrentPreview(calculated);
    setShowPreviewModal(true);
  };

  // Button 3: Reset current inputs to sensible defaults
  const handleResetBtn = () => {
    if (activeCalc === 'printing') {
      setPrintProduct('Flex Banner');
      setPrintWidth(10);
      setPrintHeight(4);
      setPrintQuantity(1);
      setPrintMaterialGrade('Standard');
      setPrintProfitMargin(30);
    } else if (activeCalc === 'frame') {
      setFrameType('MS Frame');
      setFrameWidth(8);
      setFrameHeight(4);
      setFramePipeSize('1.5 inch');
      setFramePipeWeight(0.8);
      setFrameProfitMargin(30);
    } else if (activeCalc === 'standee') {
      setStandeeType('Roll-Up Standee');
      setStandeeSize('2.5x6 Feet');
      setStandeeMaterial('Star Flex');
      setStandeeQty(2);
      setStandeeProfitMargin(30);
    } else if (activeCalc === 'visiting_card') {
      setCardGsm('350 GSM');
      setCardSides('Double');
      setCardFinish('Matt');
      setCardSpecial('Spot UV');
      setCardQty(1000);
      setCardProfitMargin(35);
    } else if (activeCalc === 'wedding_card') {
      setWeddingPaper('Metallic');
      setWeddingPrintType('Digital Print');
      setWeddingEnvelope('Designer');
      setWeddingFoiling('Gold');
      setWeddingAccessory('Ribbon');
      setWeddingQty(200);
      setWeddingProfitMargin(40);
    } else if (activeCalc === 'marketing') {
      setMarketingType('Brochures');
      setMarketingPaper('170 GSM Matte');
      setMarketingQty(500);
      setMarketingProfitMargin(30);
    } else if (activeCalc === 'labour') {
      setLabourType('Fabrication');
      setLabourRateType('Hourly');
      setLabourDuration(12);
      setLabourWorkerCount(2);
      setLabourProfitMargin(20);
    } else if (activeCalc === 'transport') {
      setTransportDistance(25);
      setTransportFuel('Diesel');
      setTransportVehicle('Chota Hathi / Tata Ace');
      setTransportDriverIncluded(true);
      setTransportHelpers(1);
      setTransportToll(120);
      setTransportProfitMargin(15);
    }
    setEditingItemId(null);
    setCurrentPreview(null);
  };

  // Button 4: Save Draft of current estimate line items
  const handleSaveDraftBtn = () => {
    if (estimateItems.length === 0) {
      alert(lang === 'EN' ? 'Please add at least one item to estimate before saving draft!' : 'ड्राफ्ट सहेजने के लिए कृपया पहले कम से कम एक उत्पाद एस्टीमेट में जोड़ें!');
      return;
    }
    localStorage.setItem('abms_temp_estimate', JSON.stringify(estimateItems));
    alert(lang === 'EN' ? 'Quotation estimate draft successfully saved to local storage!' : 'कोटेशन एस्टीमेट ड्राफ्ट सफलतापूर्वक सुरक्षित कर लिया गया है!');
  };

  // Button 5: OK / Add to Estimate (Commits item to construction ledger & Updates Grand Total!)
  const handleAddToEstimateBtn = () => {
    const item = calculateCurrentProduct();
    
    let updated;
    if (editingItemId) {
      // Replaces existing item being edited
      updated = estimateItems.map((e) => e.id === editingItemId ? item : e);
      setEditingItemId(null);
      alert(lang === 'EN' ? 'Estimate item successfully updated!' : 'एस्टीमेट का उत्पाद सफलतापूर्वक संशोधित किया गया!');
    } else {
      // Appends new item
      updated = [...estimateItems, item];
      alert(lang === 'EN' ? `"${item.name}" added to quotation estimate!` : `"${item.name}" को एस्टीमेट में जोड़ दिया गया है!`);
    }

    setEstimateItems(updated);
    handleResetBtn();
  };

  // Button 6: Cancel
  const handleCancelBtn = () => {
    handleResetBtn();
    setEditingItemId(null);
    setCurrentPreview(null);
  };

  // --- ESTIMATE BUILDER CONTROLS ---

  // Edit item inside estimate list: load its raw parameters back into respective sub-calculator
  const handleEditEstimateItem = (item: EstimateItem) => {
    setEditingItemId(item.id);
    const p = item.rawParams;
    setActiveCalc(p.activeCalc);

    if (p.activeCalc === 'printing') {
      setPrintProduct(p.printProduct);
      setPrintWidth(p.printWidth);
      setPrintHeight(p.printHeight);
      setPrintQuantity(p.printQuantity);
      setPrintMaterialGrade(p.printMaterialGrade);
      setPrintProfitMargin(p.printProfitMargin);
    } else if (p.activeCalc === 'frame') {
      setFrameType(p.frameType);
      setFrameWidth(p.frameWidth);
      setFrameHeight(p.frameHeight);
      setFramePipeSize(p.framePipeSize);
      setFramePipeWeight(p.framePipeWeight);
      setFrameProfitMargin(p.frameProfitMargin);
    } else if (p.activeCalc === 'standee') {
      setStandeeType(p.standeeType);
      setStandeeSize(p.standeeSize);
      setStandeeMaterial(p.standeeMaterial);
      setStandeeQty(p.standeeQty);
      setStandeeProfitMargin(p.standeeProfitMargin);
    } else if (p.activeCalc === 'visiting_card') {
      setCardGsm(p.cardGsm);
      setCardSides(p.cardSides);
      setCardFinish(p.cardFinish);
      setCardSpecial(p.cardSpecial);
      setCardQty(p.cardQty);
      setCardProfitMargin(p.cardProfitMargin);
    } else if (p.activeCalc === 'wedding_card') {
      setWeddingPaper(p.weddingPaper);
      setWeddingPrintType(p.weddingPrintType);
      setWeddingEnvelope(p.weddingEnvelope);
      setWeddingFoiling(p.weddingFoiling);
      setWeddingAccessory(p.weddingAccessory);
      setWeddingQty(p.weddingQty);
      setWeddingProfitMargin(p.weddingProfitMargin);
    } else if (p.activeCalc === 'marketing') {
      setMarketingType(p.marketingType);
      setMarketingPaper(p.marketingPaper);
      setMarketingQty(p.marketingQty);
      setMarketingProfitMargin(p.marketingProfitMargin);
    } else if (p.activeCalc === 'labour') {
      setLabourType(p.labourType);
      setLabourRateType(p.labourRateType);
      setLabourDuration(p.labourDuration);
      setLabourWorkerCount(p.labourWorkerCount);
      setLabourProfitMargin(p.labourProfitMargin);
    } else if (p.activeCalc === 'transport') {
      setTransportDistance(p.transportDistance);
      setTransportFuel(p.transportFuel);
      setTransportVehicle(p.transportVehicle);
      setTransportDriverIncluded(p.transportDriverIncluded);
      setTransportHelpers(p.transportHelpers);
      setTransportToll(p.transportToll);
      setTransportProfitMargin(p.transportProfitMargin);
    }

    // Scroll to calculator
    document.getElementById('estimator-main-calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Remove item from estimate
  const handleRemoveEstimateItem = (id: string) => {
    const updated = estimateItems.filter((item) => item.id !== id);
    setEstimateItems(updated);
  };

  // Calculate Grand Total of Confirmed Estimate Items
  const estSubtotal = estimateItems.reduce((acc, item) => acc + item.subtotal, 0);
  const estGst = estimateItems.reduce((acc, item) => acc + item.gstAmount, 0);
  const estGrandTotal = estimateItems.reduce((acc, item) => acc + item.finalSellingPrice, 0);

  // Generate and commit final Quotation inside the ERP
  const handleGenerateFinalQuotation = () => {
    if (estimateItems.length === 0) {
      alert(lang === 'EN' ? 'Your estimate is empty! Please calculate and confirm products first.' : 'आपका एस्टीमेट खाली है! कृपया पहले उत्पादों की गणना करें और एस्टीमेट में जोड़ें।');
      return;
    }

    // Determine customer name
    let custId = selectedCustomerId || 'CUST-GEN';
    let custName = customCustomerName || 'Walk-In Customer';

    if (selectedCustomerId) {
      const match = customers.find((c) => c.id === selectedCustomerId);
      if (match) {
        custName = match.name;
      }
    }

    const items: QuoteItem[] = estimateItems.map((item) => ({
      description: item.name,
      quantity: item.quantity,
      rate: Math.round(item.subtotal / item.quantity),
      amount: item.subtotal
    }));

    const finalQuote: Quotation = {
      id: `QUO-0${Math.floor(Date.now() / 100000)}`,
      date: new Date().toISOString().split('T')[0],
      customerId: custId,
      customerName: custName,
      items,
      subtotal: Math.round(estSubtotal),
      discount: 0,
      gstPercent: 18,
      gstAmount: Math.round(estGst),
      total: Math.round(estGrandTotal),
      status: 'Approved',
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    if (onAddQuotation) {
      onAddQuotation(finalQuote);
    }

    // Convert to approved work orders automatically
    onAddJobFromCalc({
      title: `${estimateItems[0].name} ${estimateItems.length > 1 ? `+ ${estimateItems.length - 1} more items` : ''}`,
      description: `Quotation created from Smart Estimator. Total items: ${estimateItems.length}. Grand Total: ₹${estGrandTotal.toLocaleString()}`,
      cost: estGrandTotal,
      customerName: custName
    });

    setEstimateItems([]);
    setSelectedCustomerId('');
    setCustomCustomerName('');
    alert(lang === 'EN' 
      ? `Quotation created successfully! Approved Work Order generated under Customer "${custName}".` 
      : `कोटेशन सफलतापूर्वक तैयार किया गया! ग्राहक "${custName}" के तहत स्वीकृत वर्क ऑर्डर जनरेट हो गया है।`
    );
  };

  return (
    <div className="space-y-6" id="smart-estimator-hub">
      {/* Category selector header */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-4 shadow-3xs flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-red-650" />
          <span className="text-xs font-black uppercase text-slate-800 tracking-wider font-display">
            {lang === 'EN' ? 'Professional Estimate Hub' : 'व्यावसायिक एस्टीमेटर कैलकुलेटर'}
          </span>
        </div>

        {/* Global Configuration editors */}
        <div className="flex gap-2">
          {(userRole === 'Owner' || userRole === 'Manager') && (
            <button
              onClick={() => setShowFormulaEditor(!showFormulaEditor)}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-red-600" />
              {showFormulaEditor ? 'Hide Admin Rates' : 'Admin Rates config'}
            </button>
          )}
        </div>
      </div>

      {/* --- ADMIN FORMULA CONFIGURATION ACCORDION PANEL --- */}
      {showFormulaEditor && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 font-mono text-[11px] space-y-4 shadow-md animate-scaleUp">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <h4 className="font-sans font-bold text-red-500 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Formula Configurator Dashboard: Live ERP Base Rates
            </h4>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Owner Session Authorized</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[10px]">
            Modifying these raw cost values updates the algorithms instantly. The system applies these prices to base material, machine power wear, prints, and installation labor formulas.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Standard Flex /sqft', key: 'flexStandard' },
              { label: 'Star Flex /sqft', key: 'flexStar' },
              { label: 'Backlit Flex /sqft', key: 'flexBacklit' },
              { label: 'MS Pipe /kg', key: 'msFrameRate' },
              { label: 'GI Pipe /kg', key: 'giFrameRate' },
              { label: 'Wooden Frame /ft', key: 'woodenFrameRate' },
              { label: 'Aluminium Frame /kg', key: 'aluminiumFrameRate' },
              { label: 'Frame Cutting Rate', key: 'cuttingRate' },
              { label: 'Frame Welding Rate', key: 'weldingRate' },
              { label: 'Aludecor ACP /sqft', key: 'acpStandard' },
              { label: 'Premium ACP /sqft', key: 'acpPremium' },
              { label: 'Roll-Up Standee Stand', key: 'rollUpStandCost' },
              { label: 'X-Stand Hardware', key: 'xStandCost' },
              { label: 'L-Stand Hardware', key: 'lStandCost' },
              { label: 'Promotional Table Stand', key: 'promoStandCost' },
              { label: 'Wedding Handmade Paper', key: 'weddingCardHandmadePaper' },
              { label: 'Wedding Textured Paper', key: 'weddingCardTexturedPaper' },
              { label: 'Wedding Metallic Paper', key: 'weddingCardMetallicPaper' },
              { label: 'Wedding Velvet Box', key: 'weddingEnvelopeVelvetBox' },
              { label: 'Base Labour Rate /hr', key: 'labourRatePerHour' },
              { label: 'Fabricator Rate /hr', key: 'fabricationLabourRate' },
              { label: 'Base Transport Dispatch', key: 'transportBaseRate' },
              { label: 'Flat Installation base', key: 'installationBaseRate' },
              { label: 'Default ERP Margin %', key: 'defaultProfitMargin' },
            ].map((rate) => (
              <div key={rate.key} className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                <label className="block text-[9px] text-slate-450 mb-1">{rate.label}</label>
                <input
                  type="number"
                  value={adminRates[rate.key] || 0}
                  onChange={(e) => handleUpdateAdminRates(rate.key, parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white text-xs font-bold font-mono focus:outline-hidden focus:border-red-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Left side contains active calculator, right side contains the active Estimate builder */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE CALCULATOR ENGINE (8 Columns) */}
        <div className="lg:col-span-7 space-y-6" id="estimator-main-calculator">
          
          {/* Sub-Calculator category pickers (Touch Friendly Buttons) */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-3xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block mb-3.5">
              {lang === 'EN' ? '1. Choose Estimator Engine' : '1. एस्टीमेटर कैलकुलेटर चुनें'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'printing', label: lang === 'EN' ? 'Banner & Print' : 'बैनर एवं प्रिंट' },
                { id: 'frame', label: lang === 'EN' ? 'Truss / Frame' : 'लोहा/लकड़ी फ्रेम' },
                { id: 'standee', label: lang === 'EN' ? 'Standee Display' : 'स्टैंडी डिस्प्ले' },
                { id: 'visiting_card', label: lang === 'EN' ? 'Visiting Card' : 'विजिटिंग कार्ड' },
                { id: 'wedding_card', label: lang === 'EN' ? 'Wedding Cards' : 'शादी निमंत्रण' },
                { id: 'marketing', label: lang === 'EN' ? 'Marketing Doc' : 'मार्केटिंग पैम्फलेट' },
                { id: 'labour', label: lang === 'EN' ? 'Crew & Labour' : 'मजदूरी एवं फिटिंग' },
                { id: 'transport', label: lang === 'EN' ? 'Tempo Logistics' : 'गाड़ी भाड़ा/परिवहन' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCalc(c.id as any);
                    handleResetBtn();
                  }}
                  className={`p-3 border rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    activeCalc === c.id
                      ? 'border-red-650 bg-red-50 text-red-750 font-black shadow-xs ring-1 ring-red-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Editing indicator */}
            {editingItemId && (
              <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-xl flex items-center justify-between font-mono animate-pulse">
                <span>⚠️ EDITING EXISTING ITEM IN THE ESTIMATE LIST (ID: {editingItemId})</span>
                <button onClick={() => setEditingItemId(null)} className="text-amber-500 font-black hover:text-amber-700">✕ Cancel Edit</button>
              </div>
            )}
          </div>

          {/* DYNAMIC CALCULATOR DETAILS INPUT FIELDS */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>🔧</span> {lang === 'EN' ? '2. Input Product Parameters' : '2. प्रोजेक्ट का विवरण भरें'}
            </h3>

            {/* PRINTING CALCULATOR FORM */}
            {activeCalc === 'printing' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PRODUCT TYPE</label>
                  <select
                    value={printProduct}
                    onChange={(e) => setPrintProduct(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Flex Banner">Flex Banner</option>
                    <option value="Backlit Flex">Backlit Flex</option>
                    <option value="Vinyl">Vinyl Print</option>
                    <option value="One Way Vision">One Way Glass Film</option>
                    <option value="Sunboard">Sunboard Mount</option>
                    <option value="Foam Board">Foam Board</option>
                    <option value="Canvas">Canvas Fabric</option>
                    <option value="ACP Printing">ACP Panel Print</option>
                    <option value="Acrylic Printing">Acrylic Plate Print</option>
                    <option value="LED Board">LED Illuminated Letters</option>
                    <option value="Glow Sign">Glow Sign Box</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">GRADE / FINISHING</label>
                  <select
                    value={printMaterialGrade}
                    onChange={(e) => setPrintMaterialGrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Standard">Standard Normal</option>
                    <option value="Premium">Premium Star Grade / Glossy</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">WIDTH (FT)</label>
                    <input
                      type="number"
                      value={printWidth}
                      onChange={(e) => setPrintWidth(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">HEIGHT (FT)</label>
                    <input
                      type="number"
                      value={printHeight}
                      onChange={(e) => setPrintHeight(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">QUANTITY</label>
                    <input
                      type="number"
                      value={printQuantity}
                      onChange={(e) => setPrintQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-500">PROFIT MARGIN (%)</label>
                    <span className="text-xs font-mono font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded">{printProfitMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="5"
                    value={printProfitMargin}
                    onChange={(e) => setPrintProfitMargin(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>
              </div>
            )}

            {/* FRAME CALCULATOR FORM */}
            {activeCalc === 'frame' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">MATERIAL FRAME TYPE</label>
                  <select
                    value={frameType}
                    onChange={(e) => setFrameType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="MS Frame">MS Iron Truss Frame</option>
                    <option value="GI Frame">GI Galvanized Pipe Frame</option>
                    <option value="Wooden Frame">Wooden Timber Framing</option>
                    <option value="Aluminium Frame">Aluminium Frame Profile</option>
                    <option value="Custom Frame">Custom Special Profile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PIPE THICKNESS SIZE</label>
                  <select
                    value={framePipeSize}
                    onChange={(e) => setFramePipeSize(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="0.75 inch">0.75 inch Light Duty</option>
                    <option value="1 inch">1.0 inch Medium</option>
                    <option value="1.5 inch">1.5 inch Standard Structural</option>
                    <option value="2 inch">2.0 inch Heavy Pole</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">WIDTH (FT)</label>
                    <input
                      type="number"
                      value={frameWidth}
                      onChange={(e) => setFrameWidth(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">HEIGHT (FT)</label>
                    <input
                      type="number"
                      value={frameHeight}
                      onChange={(e) => setFrameHeight(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">KG / FOOT RATIO</label>
                    <input
                      type="number"
                      step="0.1"
                      value={framePipeWeight}
                      onChange={(e) => setFramePipeWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-500">PROFIT MARGIN (%)</label>
                    <span className="text-xs font-mono font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded">{frameProfitMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="5"
                    value={frameProfitMargin}
                    onChange={(e) => setFrameProfitMargin(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>
              </div>
            )}

            {/* STANDEE CALCULATOR FORM */}
            {activeCalc === 'standee' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">STANDEE TYPE</label>
                  <select
                    value={standeeType}
                    onChange={(e) => setStandeeType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Roll-Up Standee">Roll-Up Aluminium Standee</option>
                    <option value="X Stand">X-Standee (Lightweight Fiber)</option>
                    <option value="L Stand">L-Frame Iron Standee</option>
                    <option value="Promotional Standee">Promotional Demo Table Canopy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PRINTING MATERIAL</label>
                  <select
                    value={standeeMaterial}
                    onChange={(e) => setStandeeMaterial(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Star Flex">Star Flex Banner Print</option>
                    <option value="Normal Flex">Normal Frontlit Flex</option>
                    <option value="Vinyl Matte">Vinyl Matte Laminate Mount</option>
                    <option value="Vinyl Glossy">Vinyl Glossy High Reflection</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">STANDEE DIMENSION</label>
                    <select
                      value={standeeSize}
                      onChange={(e) => setStandeeSize(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="2x5 Feet">2.0 ft x 5.0 ft</option>
                      <option value="2.5x6 Feet">2.5 ft x 6.0 ft (Standard)</option>
                      <option value="3x6 Feet">3.0 ft x 6.0 ft (Large)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">STANDEE QUANTITY</label>
                    <input
                      type="number"
                      value={standeeQty}
                      onChange={(e) => setStandeeQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-500">PROFIT MARGIN (%)</label>
                    <span className="text-xs font-mono font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded">{standeeProfitMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="5"
                    value={standeeProfitMargin}
                    onChange={(e) => setStandeeProfitMargin(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>
              </div>
            )}

            {/* VISITING CARD CALCULATOR FORM */}
            {activeCalc === 'visiting_card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PAPER THICKNESS GSM</label>
                  <select
                    value={cardGsm}
                    onChange={(e) => setCardGsm(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="300 GSM">300 GSM Art Card Matte</option>
                    <option value="350 GSM">350 GSM Royal Velvet (Standard)</option>
                    <option value="400 GSM">400 GSM Luxury Thick Ivory</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">PRINTING SIDES</label>
                    <select
                      value={cardSides}
                      onChange={(e) => setCardSides(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="Single">Single Sided</option>
                      <option value="Double">Double Sided</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">QUANTITY (CARDS)</label>
                    <select
                      value={cardQty}
                      onChange={(e) => setCardQty(parseInt(e.target.value) || 100)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white font-mono"
                    >
                      <option value="100">100 cards</option>
                      <option value="500">500 cards</option>
                      <option value="1000">1,000 cards</option>
                      <option value="2000">2,000 cards</option>
                      <option value="5000">5,000 cards</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PROTECTIVE LAMINATION</label>
                  <select
                    value={cardFinish}
                    onChange={(e) => setCardFinish(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Matt">Matt Thermal Lamination</option>
                    <option value="Gloss">Gloss Premium Lamination</option>
                    <option value="Soft Touch">Soft Touch Velvet feel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">SPECIAL ENHANCEMENTS</label>
                  <select
                    value={cardSpecial}
                    onChange={(e) => setCardSpecial(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="None">None (Standard Cut)</option>
                    <option value="Spot UV">Spot UV Gloss raised</option>
                    <option value="Foiling">Foil Emboss (Gold/Silver)</option>
                    <option value="Rounded Corners">Rounded Corners Die Cut</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-500">PROFIT MARGIN (%)</label>
                    <span className="text-xs font-mono font-bold text-red-650 bg-red-50 px-2 py-0.5 rounded">{cardProfitMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="5"
                    value={cardProfitMargin}
                    onChange={(e) => setCardProfitMargin(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>
              </div>
            )}

            {/* WEDDING CARD CALCULATOR FORM */}
            {activeCalc === 'wedding_card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">CARD PAPER BASE</label>
                  <select
                    value={weddingPaper}
                    onChange={(e) => setWeddingPaper(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Metallic">Metallic Shimmer Card</option>
                    <option value="Handmade">Premium Handmade Organic Paper</option>
                    <option value="Textured">Textured Royal Cardboard</option>
                    <option value="Velvet">Luxury Velvet Padded Board</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PRINTING TECHNOLOGY</label>
                  <select
                    value={weddingPrintType}
                    onChange={(e) => setWeddingPrintType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Screen Print">Handmade Screen Print (Gold ink)</option>
                    <option value="Foil Print">Embossed Foil Hot Stamping</option>
                    <option value="Digital Print">Full Color Digital High-Res</option>
                    <option value="Offset Press">Bulk Offset Lithography</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ENVELOPE CASING</label>
                  <select
                    value={weddingEnvelope}
                    onChange={(e) => setWeddingEnvelope(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Simple">Simple Pocket Cardboard Casing</option>
                    <option value="Designer">Laser-Cut Designer Jacket</option>
                    <option value="Velvet Box">Rigid Velvet Presentation Box</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">HOT FOILING</label>
                    <select
                      value={weddingFoiling}
                      onChange={(e) => setWeddingFoiling(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="None">None</option>
                      <option value="Gold">Gold Foil Lettering</option>
                      <option value="Silver">Silver Foil Accents</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">ACCESSORIES</label>
                    <select
                      value={weddingAccessory}
                      onChange={(e) => setWeddingAccessory(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="None">None</option>
                      <option value="Ribbon">Satin Bow Ribbon</option>
                      <option value="Wax Seal">Royal Wax Seal Stamp</option>
                      <option value="Tassel">Silk Tassel hanger</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">QUANTITY (CARDS)</label>
                    <input
                      type="number"
                      value={weddingQty}
                      onChange={(e) => setWeddingQty(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">PROFIT % TARGET</label>
                    <input
                      type="number"
                      value={weddingProfitMargin}
                      onChange={(e) => setWeddingProfitMargin(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MARKETING MATERIAL FORM */}
            {activeCalc === 'marketing' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">MARKETING TYPE</label>
                  <select
                    value={marketingType}
                    onChange={(e) => setMarketingType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Brochures">Brochures (Bi-fold / Tri-fold)</option>
                    <option value="Flyers">Flyers (Single Sheet Handouts)</option>
                    <option value="Pamphlets">Pamphlets (Lightweight Bond)</option>
                    <option value="Letterheads">Letterheads (Premium Executive Bond)</option>
                    <option value="Envelopes">Envelopes (Custom Branded 100GSM)</option>
                    <option value="Stickers">Stickers (Roll Feed Plotter Cut)</option>
                    <option value="ID Cards">Employee ID Cards (PVC Laminated)</option>
                    <option value="Certificates">Certificates (Gold Border Art Paper)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">PAPER GRADE / GSM</label>
                  <select
                    value={marketingPaper}
                    onChange={(e) => setMarketingPaper(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="130 GSM Gloss">130 GSM Glossy Flyer Paper</option>
                    <option value="170 GSM Matte">170 GSM Premium Matte</option>
                    <option value="80 GSM Bond">80 GSM Bond Executive Letterhead</option>
                    <option value="PVC Plastic">PVC Rigid Plastic 1mm</option>
                    <option value="300 GSM Royal">300 GSM Heavy Ivory Cardboard</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">BULK QUANTITY</label>
                    <input
                      type="number"
                      value={marketingQty}
                      onChange={(e) => setMarketingQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">PROFIT % TARGET</label>
                    <input
                      type="number"
                      value={marketingProfitMargin}
                      onChange={(e) => setMarketingProfitMargin(Math.max(5, parseInt(e.target.value) || 5))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* LABOUR ESTIMATOR FORM */}
            {activeCalc === 'labour' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">FIELD CREW CATEGORY</label>
                  <select
                    value={labourType}
                    onChange={(e) => setLabourType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Fabrication">Iron Fabricator Welder Crew</option>
                    <option value="Installation">Site Installation Mounting crew</option>
                    <option value="Design">Professional Graphics Designer / DTP</option>
                    <option value="Printing">Printer Operator technician</option>
                    <option value="Electrician">Electrical Glow-Board Wireman</option>
                    <option value="Helper">General Site Helper / Loader</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">RATE TYPE</label>
                    <select
                      value={labourRateType}
                      onChange={(e) => setLabourRateType(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="Hourly">Hourly rate</option>
                      <option value="Daily">Daily wage (8 hours)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">CREW COUNT</label>
                    <input
                      type="number"
                      value={labourWorkerCount}
                      onChange={(e) => setLabourWorkerCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">DURATION ({labourRateType === 'Hourly' ? 'HRS' : 'DAYS'})</label>
                    <input
                      type="number"
                      value={labourDuration}
                      onChange={(e) => setLabourDuration(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">MARKUP MARGIN %</label>
                    <input
                      type="number"
                      value={labourProfitMargin}
                      onChange={(e) => setLabourProfitMargin(Math.max(5, parseInt(e.target.value) || 5))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TRANSPORT LOGISTICS FORM */}
            {activeCalc === 'transport' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">LOGISTICS VEHICLE</label>
                  <select
                    value={transportVehicle}
                    onChange={(e) => setTransportVehicle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Chota Hathi / Tata Ace">Chota Hathi (Tata Ace) - Mini Truck</option>
                    <option value="E-Rickshaw">Electric Cargo Rickshaw (Eco)</option>
                    <option value="Bolero Pickup">Bolero Pickup Heavy 1.5 Ton</option>
                    <option value="3-Wheeler">3-Wheeler Auto Loader</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">FUEL ENGINE TYPE</label>
                    <select
                      value={transportFuel}
                      onChange={(e) => setTransportFuel(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG Green fuel</option>
                      <option value="Petrol">Petrol</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">DISTANCE (KM)</label>
                    <input
                      type="number"
                      value={transportDistance}
                      onChange={(e) => setTransportDistance(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">LOAD HELPERS COUNT</label>
                    <input
                      type="number"
                      value={transportHelpers}
                      onChange={(e) => setTransportHelpers(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">TOLL & TAX CORRIDORS (₹)</label>
                    <input
                      type="number"
                      value={transportToll}
                      onChange={(e) => setTransportToll(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <input
                    type="checkbox"
                    checked={transportDriverIncluded}
                    onChange={(e) => setTransportDriverIncluded(e.target.checked)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">Include Driver Allowance</span>
                    <p className="text-[10px] text-slate-500">Adds flat ₹400 driver wage</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- CALCULATOR ACTIONS FOOTER (6 REQUIRED BUTTONS) --- */}
            <div className="pt-5 border-t border-slate-100 flex flex-wrap gap-2.5 justify-end">
              {/* Reset current inputs */}
              <button
                type="button"
                onClick={handleResetBtn}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Reset
              </button>

              {/* Cancel editing */}
              <button
                type="button"
                onClick={handleCancelBtn}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              {/* Save Draft */}
              <button
                type="button"
                onClick={handleSaveDraftBtn}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Save Draft
              </button>

              {/* Preview detailed cost structure */}
              <button
                type="button"
                onClick={handlePreviewBtn}
                className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                Preview Cost
              </button>

              {/* Calculate Selling Price */}
              <button
                type="button"
                onClick={handleCalculateBtn}
                className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer shadow-3xs"
              >
                Calculate
              </button>

              {/* OK / Add to Estimate (COMMITTING TO LEDGER!) */}
              <button
                type="button"
                onClick={handleAddToEstimateBtn}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 font-black" />
                OK / Add to Estimate
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL ESTIMATE BUILDER & GENERATOR (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5.5 shadow-3xs space-y-5 flex flex-col justify-between min-h-[460px]">
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider pb-3 border-b border-slate-100 font-display flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-red-650" />
                  {lang === 'EN' ? 'Active Estimate Line Items' : 'एस्टीमेट निर्माण विवरण'}
                </span>
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md font-mono font-bold">
                  {estimateItems.length} items
                </span>
              </h3>

              {/* Customer Link Selector */}
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200/50 rounded-2xl">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-mono">
                  Link Estimate to Customer profile (CRM)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value);
                      if (e.target.value) setCustomCustomerName('');
                    }}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800"
                  >
                    <option value="">{lang === 'EN' ? '-- Select CRM Customer --' : '-- ग्राहक चुनें --'}</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {!selectedCustomerId && (
                    <input
                      type="text"
                      placeholder="Or enter new customer name directly..."
                      value={customCustomerName}
                      onChange={(e) => setCustomCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white"
                    />
                  )}
                </div>
              </div>

              {/* Line Items List constructor */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {estimateItems.map((item) => (
                  <div key={item.id} className="p-3.5 border border-slate-200 rounded-2xl hover:border-slate-350 bg-white shadow-3xs flex justify-between items-center transition-all">
                    <div>
                      <span className="text-[8px] bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs mt-1 leading-snug">{item.name}</h4>
                      <div className="text-[10px] text-slate-500 font-mono font-bold mt-1">
                        Subtotal: ₹{item.subtotal.toLocaleString()} • Qty: {item.quantity}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditEstimateItem(item)}
                        className="p-1.5 text-slate-500 hover:text-red-650 hover:bg-red-50 rounded-lg transition-all"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveEstimateItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-slate-100 rounded-lg transition-all"
                        title="Remove Item"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {estimateItems.length === 0 && (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Your Estimate Ledger is empty.</p>
                    <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto">
                      Adjust parameters of any calculator on the left, click **"OK / Add to Estimate"** to build a comprehensive quote.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* GRAND TOTAL BLOCK (ONLY updates after user clicks Add to Estimate!) */}
            {estimateItems.length > 0 && (
              <div className="pt-5 border-t border-slate-100 space-y-4">
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex justify-between items-center">
                  <div className="font-mono text-xs">
                    <span className="text-slate-500 block font-bold uppercase">Estimated Subtotal</span>
                    <span className="text-slate-450 block mt-0.5 text-[10px] font-normal">GST (18% inclusive)</span>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-red-700 tracking-wider mb-0.5">ESTIMATE GRAND TOTAL</div>
                    <div className="text-2xl font-black font-display text-red-650">₹{estGrandTotal.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setEstimateItems([]);
                      alert(lang === 'EN' ? 'Estimate builder reset completely.' : 'एस्टीमेट निर्माण रजिस्टर पूरी तरह से रीसेट हो गया है।');
                    }}
                    className="py-3 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all cursor-pointer text-center"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleGenerateFinalQuotation}
                    className="py-3 bg-red-650 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer text-center"
                  >
                    Generate Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DETAILED COST BREAKDOWN MODAL PANEL (PREVIEW) --- */}
      {showPreviewModal && currentPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleUp font-mono">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5 text-red-650" />
                ERP Commercial Cost Matrix Preview
              </h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-100 text-slate-900 font-sans font-bold">
                <span>ITEM DETAILS:</span>
                <span className="text-right max-w-[260px]">{currentPreview.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-y-2.5 text-slate-600 font-bold">
                <div>Material Base Cost:</div>
                <div className="text-right text-slate-900">₹{currentPreview.materialCost.toLocaleString()}</div>

                <div>Machinery Wear & Power:</div>
                <div className="text-right text-slate-900">₹{currentPreview.machineCost.toLocaleString()}</div>

                <div>High-Volume Printing Cost:</div>
                <div className="text-right text-slate-900">₹{currentPreview.printingCost.toLocaleString()}</div>

                <div>Welding & Crew Labour:</div>
                <div className="text-right text-slate-900">₹{currentPreview.labourCost.toLocaleString()}</div>

                <div>Logistics / Dispatch:</div>
                <div className="text-right text-slate-900">₹{currentPreview.transportCost.toLocaleString()}</div>

                <div>Other Miscellaneous Costs:</div>
                <div className="text-right text-slate-900">₹{currentPreview.miscCost.toLocaleString()}</div>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between font-extrabold text-slate-900">
                <span>Sum Raw Expenses:</span>
                <span>₹{Math.round(currentPreview.materialCost + currentPreview.machineCost + currentPreview.printingCost + currentPreview.labourCost + currentPreview.transportCost + currentPreview.miscCost).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-emerald-600 font-extrabold">
                <span>Markup Profits (+{currentPreview.profitPercent}%):</span>
                <span>₹{currentPreview.profitAmount.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-150 flex justify-between text-slate-900 font-bold">
                <span>Pre-Tax Subtotal:</span>
                <span>₹{currentPreview.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-500 font-bold">
                <span>Signage GST (18%):</span>
                <span>₹{currentPreview.gstAmount.toLocaleString()}</span>
              </div>

              <div className="pt-4 mt-2 border-t-2 border-slate-900 bg-red-50/50 p-4.5 rounded-2xl flex justify-between items-center text-red-650">
                <span className="font-sans font-black text-xs uppercase tracking-wider block">FINAL SELLING PRICE:</span>
                <span className="text-3xl font-display font-black">₹{currentPreview.finalSellingPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans uppercase"
              >
                Close Cost Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
