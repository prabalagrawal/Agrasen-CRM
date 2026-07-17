/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Plus,
  Trash2,
  Check,
  Sparkles,
  AlertTriangle,
  User,
  Layers,
  Minimize2,
  Maximize2,
  Copy,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Undo,
  PlusCircle,
  HelpCircle,
  Clock,
  Settings,
  ChevronDown
} from 'lucide-react';

import { CalculatorRates, Customer, Quotation, QuoteItem } from '../types';

interface EstimateBuilderProps {
  rates: CalculatorRates;
  onUpdateRates?: (newRates: CalculatorRates) => void;
  onAddJobFromCalc?: (job: { title: string; description: string; cost: number; customerName: string }) => void;
  userRole?: string;
  lang?: 'EN' | 'HI';
  customers?: Customer[];
  onAddQuotation?: (q: Quotation) => void;
}

interface CustomChargeItem {
  id: string;
  name: string;
  amount: number;
}

interface QuotationProductItem {
  id: string;
  productId: string;
  productName: string;
  materialName: string;
  materialRateKey: string;
  width: number;
  height: number;
  unit: 'Feet' | 'Inches' | 'MM' | 'CM';
  quantity: number;
  sqftArea: number;
  runningFoot: number;
  includedCharges: Record<string, boolean>;
  rateOverrides: Record<string, number>;
  customCharges: CustomChargeItem[];
  itemTotal: number;
  description: string;
}

const PRODUCT_TEMPLATES = [
  { id: 'flex', name: 'Flex Banner', icon: '⛺', desc: 'Outdoor frontlit/backlit promotion banner', category: 'Banner' },
  { id: 'acp', name: 'ACP Board', icon: '🪵', desc: 'Aluminum Composite Panel backing board', category: 'Signage' },
  { id: 'led', name: 'LED Board', icon: '💡', desc: 'Custom illuminated letters signage board', category: 'Illuminated' },
  { id: 'glow', name: 'Glow Sign Board', icon: '🔲', desc: 'Backlit box signage with internal lighting', category: 'Illuminated' },
  { id: 'vinyl', name: 'Vinyl Print', icon: '🖼️', desc: 'High-resolution adhesive media print', category: 'Print' },
  { id: 'sunboard', name: 'Sunboard Cutout', icon: '📦', desc: 'Rigid foam board mounting for internal poster', category: 'Display' },
  { id: 'standee', name: 'Roll-up Standee', icon: '📊', desc: 'Retractable promotional banner standee', category: 'Display' },
  { id: 'visiting', name: 'Visiting Card', icon: '💳', desc: 'Premium corporate business card printing', category: 'Stationery' },
  { id: 'wedding', name: 'Wedding Invitation', icon: '💌', desc: 'Custom luxury textured ceremonial cards', category: 'Stationery' }
];

const QUICK_SIZE_PRESETS = [
  { name: '8x4 Banner', width: 8, height: 4, unit: 'Feet', desc: 'Standard Outdoor Promo' },
  { name: '10x3 Shop Board', width: 10, height: 3, unit: 'Feet', desc: 'Sleek Shop Facade' },
  { name: '12x4 ACP Board', width: 12, height: 4, unit: 'Feet', desc: 'Standard exterior panel' },
  { name: '2.5x6 Standee', width: 2.5, height: 6, unit: 'Feet', desc: 'Retractable display' },
  { name: '3.5x2 Business Card', width: 3.5, height: 2, unit: 'Inches', desc: 'Standard wallet card' }
];

const MATERIAL_OPTIONS: Record<string, { name: string; rateKey: keyof CalculatorRates; desc: string; quality: 'Standard' | 'Premium' }[]> = {
  flex: [
    { name: 'Standard Frontlit Flex', rateKey: 'flexStandard', desc: 'Economic frontlit banner backing', quality: 'Standard' },
    { name: 'Star Premium Flex', rateKey: 'flexStar', desc: 'Glossy heavy-weight durable fabric', quality: 'Premium' },
    { name: 'Heavy Backlit Flex', rateKey: 'flexBacklit', desc: 'Optimum glow sign light transmission', quality: 'Premium' }
  ],
  acp: [
    { name: 'Standard 3mm ACP', rateKey: 'acpStandard', desc: 'Standard interior panel backing', quality: 'Standard' },
    { name: 'Premium 4mm ACP (Heavy Duty)', rateKey: 'acpPremium', desc: 'Industrial weatherproof facade panels', quality: 'Premium' }
  ],
  led: [
    { name: 'Acrylic Standard Board', rateKey: 'acrylicStandard', desc: 'Solid clear sheets with vinyl graphics', quality: 'Standard' },
    { name: '3D LED Acrylic Board', rateKey: 'acrylicLed', desc: 'Engraved 3D letters illuminated with LEDs', quality: 'Premium' }
  ],
  glow: [
    { name: 'Standard Backlit Flex Board', rateKey: 'flexBacklit', desc: 'Lightweight translucent fabric box signage', quality: 'Standard' },
    { name: 'Acrylic LED Glow Board', rateKey: 'acrylicLed', desc: 'Illuminated custom premium acrylic layout', quality: 'Premium' }
  ],
  vinyl: [
    { name: 'Standard Self-Adhesive Vinyl', rateKey: 'vinylStandard', desc: 'Glossy printable adhesive sheets', quality: 'Standard' },
    { name: 'Glossy Laminated Vinyl', rateKey: 'vinylGlossy', desc: 'UV scratchproof laminated long life vinyl', quality: 'Premium' },
    { name: 'One-Way Vision Mesh', rateKey: 'vinylOneWay', desc: 'Perforated glass film showing graphic outer-only', quality: 'Premium' }
  ],
  sunboard: [
    { name: 'Standard 3mm Sunboard', rateKey: 'sunboardStandard', desc: 'Economic high-density rigid board', quality: 'Standard' },
    { name: 'Premium 5mm Sunboard', rateKey: 'sunboardStandard', desc: 'Stiff interior visual board mount', quality: 'Premium' }
  ],
  standee: [
    { name: 'Economy Flex Standee', rateKey: 'flexStandard', desc: 'Star flex print in rollup aluminum stand', quality: 'Standard' },
    { name: 'Premium Glossy Vinyl Standee', rateKey: 'vinylGlossy', desc: 'Laminated vinyl on rollup cassette', quality: 'Premium' }
  ],
  visiting: [
    { name: 'Standard 300 GSM Art Card', rateKey: 'visitingCardStandard', desc: 'Matte/Glossy standard business cards', quality: 'Standard' },
    { name: 'Premium 400 GSM Velvet Card', rateKey: 'visitingCardPremium', desc: 'Velvet smooth cards with spot UV gloss', quality: 'Premium' }
  ],
  wedding: [
    { name: 'Elegant Textured Wedding Card', rateKey: 'weddingCardStandard', desc: 'Traditional artistic paper with hot foil', quality: 'Standard' }
  ]
};

export default function EstimateBuilder({
  rates,
  onUpdateRates,
  onAddJobFromCalc,
  userRole = 'Owner',
  lang = 'EN',
  customers = [],
  onAddQuotation
}: EstimateBuilderProps) {
  
  // --- STATE FOR QUOTATION ITEMS (MULTIPLE PRODUCTS) ---
  const [quoteItems, setQuoteItems] = useState<QuotationProductItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // --- FORM COMPOSER STATES (FOR ACTIVE ITEM) ---
  const [selectedProduct, setSelectedProduct] = useState<string>('flex');
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number>(0);
  const [width, setWidth] = useState<number>(8);
  const [height, setHeight] = useState<number>(4);
  const [unit, setUnit] = useState<'Feet' | 'Inches' | 'MM' | 'CM'>('Feet');
  const [quantity, setQuantity] = useState<number>(1);

  // 10 Customizable Surcharges (Toggles & Direct manual inputs)
  const [includedCharges, setIncludedCharges] = useState<Record<string, boolean>>({
    material: true,
    printing: true,
    frame: false,
    transport: false,
    installation: false,
    packaging: false,
    labour: false,
    design: false,
    accessories: false,
    miscellaneous: false
  });

  const [rateOverrides, setRateOverrides] = useState<Record<string, number>>({
    material: 45,
    printing: 25,
    frame: 120,
    transport: 250,
    installation: 350,
    packaging: 50,
    labour: 150,
    design: 200,
    accessories: 100,
    miscellaneous: 50
  });

  const [customCharges, setCustomCharges] = useState<CustomChargeItem[]>([]);
  const [newCustomName, setNewCustomName] = useState<string>('');
  const [newCustomAmount, setNewCustomAmount] = useState<string>('');

  // --- GLOBAL QUOTATION LEVEL ADJUSTMENTS ---
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [markupPercent, setMarkupPercent] = useState<number>(rates.defaultProfitMargin || 25);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [gstEnabled, setGstEnabled] = useState<boolean>(true);

  // Quick Customer Registration Inline Modal State
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustPhone, setNewCustPhone] = useState<string>('');

  // Sizing calculated values
  const [sqftArea, setSqftArea] = useState<number>(32);
  const [runningFoot, setRunningFoot] = useState<number>(24);
  const [activeItemTotal, setActiveItemTotal] = useState<number>(0);

  // Global pricing ledger calculated state (sum of all quote items)
  const [globalSubtotal, setGlobalSubtotal] = useState<number>(0);
  const [globalMarkupAmount, setGlobalMarkupAmount] = useState<number>(0);
  const [globalGstAmount, setGlobalGstAmount] = useState<number>(0);
  const [globalGrandTotal, setGlobalGrandTotal] = useState<number>(0);

  // UI Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Calculate active composer item total live
  const calculateActiveItem = () => {
    let subtotal = 0;

    // A. Material cost: rate * sqft * quantity
    if (includedCharges.material) {
      subtotal += rateOverrides.material * sqftArea * quantity;
    }
    // B. Printing cost: rate * sqft * quantity
    if (includedCharges.printing) {
      subtotal += rateOverrides.printing * sqftArea * quantity;
    }
    // C. Frame structural cost: rate * running foot * quantity
    if (includedCharges.frame) {
      subtotal += rateOverrides.frame * runningFoot * quantity;
    }
    // D. Flat charges (multiplied by qty or outright flat)
    if (includedCharges.transport) {
      subtotal += rateOverrides.transport;
    }
    if (includedCharges.installation) {
      subtotal += rateOverrides.installation * quantity;
    }
    if (includedCharges.packaging) {
      subtotal += rateOverrides.packaging * quantity;
    }
    if (includedCharges.labour) {
      subtotal += rateOverrides.labour;
    }
    if (includedCharges.design) {
      subtotal += rateOverrides.design;
    }
    if (includedCharges.accessories) {
      subtotal += rateOverrides.accessories * quantity;
    }
    if (includedCharges.miscellaneous) {
      subtotal += rateOverrides.miscellaneous;
    }

    // E. Custom Charges
    customCharges.forEach(item => {
      subtotal += item.amount;
    });

    setActiveItemTotal(Number(subtotal.toFixed(2)));
  };

  // Convert dimensions to standard sqft & running foot multipliers
  useEffect(() => {
    let conversionFactorSqFt = 1;
    let conversionFactorRunning = 1;

    if (unit === 'Inches') {
      conversionFactorSqFt = 1 / 144;
      conversionFactorRunning = 1 / 12;
    } else if (unit === 'MM') {
      conversionFactorSqFt = 1 / 92903.04;
      conversionFactorRunning = 1 / 304.8;
    } else if (unit === 'CM') {
      conversionFactorSqFt = 1 / 929.0304;
      conversionFactorRunning = 1 / 30.48;
    }

    const calculatedSqFt = Number((width * height * conversionFactorSqFt).toFixed(3));
    const calculatedRunningFt = Number(((2 * (width + height)) * conversionFactorRunning).toFixed(3));

    setSqftArea(calculatedSqFt);
    setRunningFoot(calculatedRunningFt);
  }, [width, height, unit]);

  // Handle product or material index change: apply catalog default rates to active override input
  useEffect(() => {
    const materialsList = MATERIAL_OPTIONS[selectedProduct] || [];
    const mat = materialsList[selectedMaterialIndex] || materialsList[0];
    if (mat) {
      const basePrice = rates[mat.rateKey] || 45;
      setRateOverrides(prev => ({
        ...prev,
        material: basePrice
      }));
    }
  }, [selectedProduct, selectedMaterialIndex, rates]);

  // Recalculate active item on any field modification
  useEffect(() => {
    calculateActiveItem();
  }, [
    selectedProduct,
    selectedMaterialIndex,
    width,
    height,
    unit,
    quantity,
    includedCharges,
    rateOverrides,
    customCharges
  ]);

  // Calculate global invoice summary based on items in the list
  const calculateGlobalInvoice = () => {
    const itemsSum = quoteItems.reduce((acc, item) => acc + item.itemTotal, 0);
    setGlobalSubtotal(Number(itemsSum.toFixed(2)));

    const markupAmount = itemsSum * (markupPercent / 100);
    setGlobalMarkupAmount(Number(markupAmount.toFixed(2)));

    const discountedSubtotal = Math.max(0, (itemsSum + markupAmount) - discountAmount);
    
    let calculatedGst = 0;
    if (gstEnabled) {
      calculatedGst = discountedSubtotal * 0.18;
    }
    setGlobalGstAmount(Number(calculatedGst.toFixed(2)));

    const finalTotal = discountedSubtotal + calculatedGst;
    setGlobalGrandTotal(Number(finalTotal.toFixed(2)));
  };

  // Recalculate global invoice whenever items or adjustments change
  useEffect(() => {
    calculateGlobalInvoice();
  }, [quoteItems, markupPercent, discountAmount, gstEnabled]);

  // Action: Add/Update Product in the active quote
  const handlePushProductToQuote = () => {
    const matchedProduct = PRODUCT_TEMPLATES.find(p => p.id === selectedProduct);
    const materialsList = MATERIAL_OPTIONS[selectedProduct] || [];
    const matchedMaterial = materialsList[selectedMaterialIndex] || materialsList[0];

    const itemDesc = `${matchedProduct?.name || 'Item'} (${width}x${height} ${unit}) - ${matchedMaterial?.name || 'Material'}`;

    const newQuotationProduct: QuotationProductItem = {
      id: editingItemId || `ITEM-${Date.now()}`,
      productId: selectedProduct,
      productName: matchedProduct?.name || 'Product',
      materialName: matchedMaterial?.name || 'Material',
      materialRateKey: matchedMaterial?.rateKey || 'flexStandard',
      width,
      height,
      unit,
      quantity,
      sqftArea,
      runningFoot,
      includedCharges: { ...includedCharges },
      rateOverrides: { ...rateOverrides },
      customCharges: [...customCharges],
      itemTotal: activeItemTotal,
      description: itemDesc
    };

    if (editingItemId) {
      setQuoteItems(quoteItems.map(item => item.id === editingItemId ? newQuotationProduct : item));
      setEditingItemId(null);
      triggerToast('Product specifications updated in quotation!');
    } else {
      setQuoteItems([...quoteItems, newQuotationProduct]);
      triggerToast('Product added successfully to draft!');
    }

    // Reset composer to standard defaults
    setQuantity(1);
    setCustomCharges([]);
    setIncludedCharges({
      material: true,
      printing: true,
      frame: false,
      transport: false,
      installation: false,
      packaging: false,
      labour: false,
      design: false,
      accessories: false,
      miscellaneous: false
    });
  };

  // Edit item in list: Load it back to Composer workspace
  const handleEditItemInList = (item: QuotationProductItem) => {
    setEditingItemId(item.id);
    setSelectedProduct(item.productId);
    
    const materialsList = MATERIAL_OPTIONS[item.productId] || [];
    const matIndex = materialsList.findIndex(m => m.name === item.materialName);
    setSelectedMaterialIndex(matIndex !== -1 ? matIndex : 0);

    setWidth(item.width);
    setHeight(item.height);
    setUnit(item.unit);
    setQuantity(item.quantity);
    setIncludedCharges({ ...item.includedCharges });
    setRateOverrides({ ...item.rateOverrides });
    setCustomCharges([...item.customCharges]);
    triggerToast('Specifications loaded to composer. Edit and re-add!');
  };

  // Duplicate item in list
  const handleDuplicateItemInList = (item: QuotationProductItem) => {
    const duplicated: QuotationProductItem = {
      ...item,
      id: `ITEM-DUP-${Date.now()}-${Math.random().toString().substring(2,5)}`
    };
    setQuoteItems([...quoteItems, duplicated]);
    triggerToast('Product item duplicated!');
  };

  // Delete item from list
  const handleDeleteItemFromList = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
    if (editingItemId === id) {
      setEditingItemId(null);
    }
    triggerToast('Product removed from quotation draft.');
  };

  // Reorder items in list: Up/Down
  const handleReorderItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...quoteItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setQuoteItems(newItems);
  };

  // Quick Inline custom charge addition
  const handleAddCustomCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomName.trim() || !newCustomAmount) return;
    const amt = parseFloat(newCustomAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newCharge: CustomChargeItem = {
      id: `CST-${Date.now()}`,
      name: newCustomName.trim(),
      amount: amt
    };

    setCustomCharges([...customCharges, newCharge]);
    setNewCustomName('');
    setNewCustomAmount('');
    triggerToast(`Added surcharge: ${newCharge.name}`);
  };

  // Quick inline customer registry helper
  const handleRegisterCustomerInline = () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      alert('Please fill out Name and Phone.');
      return;
    }
    if (customers) {
      const newCust: Customer = {
        id: `CUST-NEW-${Date.now()}`,
        name: newCustName.trim(),
        companyName: 'N/A',
        phone: newCustPhone.trim(),
        whatsapp: newCustPhone.trim(),
        email: 'N/A',
        address: 'N/A',
        gst: 'N/A',
        customerSince: new Date().toISOString().split('T')[0],
        outstandingBalance: 0,
        notesList: [
          {
            id: `N-${Date.now()}`,
            text: 'Registered inline from Redesigned Estimate Builder workspace',
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            author: 'System'
          }
        ],
        timeline: [
          {
            id: `TL-${Date.now()}`,
            type: 'Created',
            title: 'Customer Account Created',
            description: 'Registered inline from Redesigned Estimate Builder workspace.',
            date: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        ]
      };
      
      // We push it locally if available
      customers.push(newCust);
      setSelectedCustomerId(newCust.id);
      setShowAddCustomerModal(false);
      setNewCustName('');
      setNewCustPhone('');
      triggerToast(`Registered client: ${newCust.name}!`);
    }
  };

  // Save Quotation Draft globally
  const handleSaveQuotationDraft = () => {
    if (quoteItems.length === 0) {
      alert('Cannot compile. Please add at least one product item to your quotation first.');
      return;
    }
    if (!onAddQuotation) {
      alert('Parent database billing operations not fully linked.');
      return;
    }

    const customerObj = customers.find(c => c.id === selectedCustomerId);
    const customerName = customerObj?.name || 'Direct Walk-in Client';
    const customerId = customerObj?.id || 'CUST-GEN';

    // Map QuotationProductItems to global QuoteItems format
    const compiledItems: QuoteItem[] = quoteItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: Number((item.itemTotal / item.quantity).toFixed(2)),
      amount: item.itemTotal
    }));

    const newQuotation: Quotation = {
      id: `QTN-RED-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().split('T')[0],
      customerId,
      customerName,
      items: compiledItems,
      subtotal: globalSubtotal,
      discount: discountAmount,
      gstPercent: gstEnabled ? 18 : 0,
      gstAmount: globalGstAmount,
      total: globalGrandTotal,
      status: 'Draft',
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    onAddQuotation(newQuotation);
    setQuoteItems([]);
    triggerToast(`Quotation ${newQuotation.id} successfully compiled and saved!`);
    alert(`🎉 Successfully saved quotation draft ${newQuotation.id} for ${customerName} totaling ₹${globalGrandTotal}.`);
  };

  // Push quotation products directly to Production Job Board
  const handlePushAllToJobBoard = () => {
    if (quoteItems.length === 0) {
      alert('Please add at least one product to push to production board.');
      return;
    }
    if (!onAddJobFromCalc) {
      alert('Job board integration callbacks not fully initialized.');
      return;
    }

    const customerObj = customers.find(c => c.id === selectedCustomerId);
    const customerName = customerObj?.name || 'Direct Walk-in Client';

    quoteItems.forEach(item => {
      onAddJobFromCalc({
        title: `${item.productName} (${item.width}x${item.height} ${item.unit})`,
        description: `Production Order: Qty ${item.quantity} using ${item.materialName}. Surcharges: ${Object.entries(item.includedCharges).filter(([_, val]) => val).map(([key]) => key).join(', ')}`,
        cost: item.itemTotal,
        customerName
      });
    });

    setQuoteItems([]);
    triggerToast('All items pushed to active Production Queue!');
    alert(`🚀 Confirmed: Sent ${quoteItems.length} job(s) directly to shop floor print queue for ${customerName}!`);
  };

  const activeMaterials = MATERIAL_OPTIONS[selectedProduct] || [];
  const currentMaterial = activeMaterials[selectedMaterialIndex] || activeMaterials[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 pb-36 relative text-zinc-800 font-sans" id="redesigned-pos-workspace">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-zinc-900 border border-zinc-800 text-white font-mono text-xs py-3 px-5 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section (Compact Apple-Style) */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-5">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">POS WORKSPACE • ESTIMATES</span>
          <h2 className="text-xl font-medium text-zinc-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-zinc-800 stroke-[1.5]" />
            Quotation Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-normal">Configure specifications, fabrication, and custom surcharges to build multi-product quotes.</p>
        </div>

        {/* Customer Select Toolbar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-zinc-100/50 p-1.5 px-3 border border-zinc-200/50 rounded-xl flex items-center gap-2 flex-1 sm:flex-initial">
            <User className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="text-xs font-medium text-zinc-800 bg-transparent outline-none pr-4 cursor-pointer"
            >
              <option value="">Direct Walk-In Client</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="p-2 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 border border-zinc-200/40 rounded-xl cursor-pointer transition-colors"
            title="Register New Customer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* INLINE QUICK REGISTER CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-zinc-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-zinc-200 w-full max-w-sm rounded-2xl p-6 shadow-xl animate-scaleUp">
            <div className="space-y-1 mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Register New Customer</h3>
              <p className="text-xs text-zinc-400">Add custom billing logs to save the quotation.</p>
            </div>
            <div className="space-y-4 text-xs text-zinc-700">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-450">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Soni"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-800 font-normal transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-450">Mobile Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-800 font-normal transition-all"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddCustomerModal(false)}
                  className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterCustomerInline}
                  className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TWO COLUMN GRID WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPOSER (Active product specification: Col Span 7) */}
        <div className="lg:col-span-7 bg-white/50 space-y-6">
          
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">Product Spec Builder</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Customize properties for the active line item.</p>
            </div>
            {editingItemId && (
              <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-0.5 rounded-lg font-medium">
                Editing Mode
              </span>
            )}
          </div>

          {/* 1. SELECT PRODUCT PILLS */}
          <div className="space-y-2">
            <span className="block text-[10px] font-mono uppercase text-zinc-400 tracking-wider">1. Select Product Catalog</span>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {PRODUCT_TEMPLATES.map((p) => {
                const isSelected = selectedProduct === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p.id);
                      setSelectedMaterialIndex(0);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-50 border-zinc-200/60 hover:bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECT MATERIAL */}
          <div className="space-y-2">
            <span className="block text-[10px] font-mono uppercase text-zinc-400 tracking-wider">2. Select Material Media</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeMaterials.map((mat, idx) => {
                const isSelected = selectedMaterialIndex === idx;
                const basePrice = rates[mat.rateKey] || 45;
                return (
                  <button
                    key={mat.name}
                    onClick={() => setSelectedMaterialIndex(idx)}
                    className={`p-3.5 text-left border rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-900/5 border-zinc-800'
                        : 'bg-white border-zinc-200/60 hover:border-zinc-350'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-zinc-900">{mat.name}</span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase ${
                        mat.quality === 'Premium' ? 'bg-amber-100 text-amber-900' : 'bg-zinc-100 text-zinc-800'
                      }`}>
                        {mat.quality}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal mb-2">{mat.desc}</p>
                    <div className="text-[10px] font-mono text-zinc-500 border-t border-zinc-100/80 pt-2 flex justify-between">
                      <span>Base Rate:</span>
                      <span className="font-semibold text-zinc-900">₹{basePrice}/sqft</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. DIMENSIONS & QUANTITY MULTIPLIERS */}
          <div className="space-y-2.5">
            <span className="block text-[10px] font-mono uppercase text-zinc-400 tracking-wider">3. Dimensions & Quantity</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/40">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Width</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={width}
                  onChange={(e) => setWidth(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full h-8 px-2.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 outline-none focus:border-zinc-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Height</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={height}
                  onChange={(e) => setHeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full h-8 px-2.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 outline-none focus:border-zinc-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full h-8 px-2 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 cursor-pointer outline-none"
                >
                  <option value="Feet">Feet</option>
                  <option value="Inches">Inches</option>
                  <option value="MM">MM</option>
                  <option value="CM">CM</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-8 px-2 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 outline-none focus:border-zinc-800 text-center"
                />
              </div>

              <div className="sm:col-span-4 border-t border-zinc-200/40 pt-2 flex justify-between items-center text-[10px] font-mono text-zinc-400 px-1">
                <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" /> Calculated Multipliers:</span>
                <div className="flex gap-4">
                  <span>Sq.Ft: <span className="text-zinc-900 font-semibold">{sqftArea}</span></span>
                  <span>Running Ft: <span className="text-zinc-900 font-semibold">{runningFoot}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK STANDARD SIZE PRESETS */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Quick Size Presets</span>
            <div className="flex flex-wrap gap-1">
              {QUICK_SIZE_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setWidth(p.width);
                    setHeight(p.height);
                    setUnit(p.unit as any);
                    triggerToast(`Preset applied: ${p.name}`);
                  }}
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200/60 text-[10px] font-mono text-zinc-600 rounded-md cursor-pointer transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4. OPTIONAL CHARGES */}
          <div className="space-y-3 border-t border-zinc-100 pt-5">
            <div className="flex justify-between items-center">
              <span className="block text-[10px] font-mono uppercase text-zinc-400 tracking-wider">4. Fabrication & Surcharges</span>
              <span className="text-[10px] font-mono text-zinc-400">Enable/disable instant rates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Media Raw Material */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.material}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, material: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Material Media</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.material}
                    disabled={!includedCharges.material}
                    onChange={(e) => setRateOverrides(p => ({ ...p, material: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">/sqft</span>
                </div>
              </div>

              {/* Printing */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.printing}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, printing: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Printing</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.printing}
                    disabled={!includedCharges.printing}
                    onChange={(e) => setRateOverrides(p => ({ ...p, printing: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">/sqft</span>
                </div>
              </div>

              {/* Frame */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.frame}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, frame: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Frame structure</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.frame}
                    disabled={!includedCharges.frame}
                    onChange={(e) => setRateOverrides(p => ({ ...p, frame: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">/rft</span>
                </div>
              </div>

              {/* Transport */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.transport}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, transport: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Transport/Deliv</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.transport}
                    disabled={!includedCharges.transport}
                    onChange={(e) => setRateOverrides(p => ({ ...p, transport: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">flat</span>
                </div>
              </div>

              {/* Installation */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.installation}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, installation: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Installation</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.installation}
                    disabled={!includedCharges.installation}
                    onChange={(e) => setRateOverrides(p => ({ ...p, installation: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">/qty</span>
                </div>
              </div>

              {/* Packaging */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.packaging}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, packaging: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Packaging</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.packaging}
                    disabled={!includedCharges.packaging}
                    onChange={(e) => setRateOverrides(p => ({ ...p, packaging: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">/qty</span>
                </div>
              </div>

              {/* Labour */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.labour}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, labour: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Labour</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.labour}
                    disabled={!includedCharges.labour}
                    onChange={(e) => setRateOverrides(p => ({ ...p, labour: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">flat</span>
                </div>
              </div>

              {/* Design */}
              <div className="p-2 px-3 bg-zinc-50/50 border border-zinc-200/50 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includedCharges.design}
                    onChange={(e) => setIncludedCharges(p => ({ ...p, design: e.target.checked }))}
                    className="w-3.5 h-3.5 accent-zinc-900 cursor-pointer rounded"
                  />
                  <span className="text-xs text-zinc-700 font-medium">Design Work</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                  <span>₹</span>
                  <input
                    type="number"
                    value={rateOverrides.design}
                    disabled={!includedCharges.design}
                    onChange={(e) => setRateOverrides(p => ({ ...p, design: parseFloat(e.target.value) || 0 }))}
                    className="w-14 h-6 text-center bg-white border border-zinc-200 rounded text-xs disabled:opacity-40"
                  />
                  <span className="text-[9px] text-zinc-400">flat</span>
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC CUSTOM CHARGES */}
          <div className="space-y-3 bg-zinc-50/40 p-4 rounded-xl border border-zinc-200/50">
            <div>
              <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-wide">Special Customized Surcharges</h4>
              <p className="text-[11px] text-zinc-400">Add custom fabrication requests or on-site height adjustments.</p>
            </div>
            
            <form onSubmit={handleAddCustomCharge} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Eyelets, Heavy backplates"
                required
                value={newCustomName}
                onChange={(e) => setNewCustomName(e.target.value)}
                className="flex-1 h-8 px-3 bg-white border border-zinc-200 rounded-lg text-xs outline-none focus:border-zinc-800"
              />
              <input
                type="number"
                placeholder="₹ Amount"
                required
                value={newCustomAmount}
                onChange={(e) => setNewCustomAmount(e.target.value)}
                className="w-24 h-8 px-3 bg-white border border-zinc-200 rounded-lg text-xs outline-none focus:border-zinc-800 font-mono text-center"
              />
              <button
                type="submit"
                className="px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                Add
              </button>
            </form>

            {customCharges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-200/30">
                {customCharges.map((c) => (
                  <span key={c.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-zinc-250 rounded text-[10px] font-mono font-medium text-zinc-800">
                    <span>{c.name}: ₹{c.amount}</span>
                    <button
                      type="button"
                      onClick={() => setCustomCharges(customCharges.filter(x => x.id !== c.id))}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ADD PRODUCT TO QUOTE ROW */}
          <div className="bg-zinc-100 border border-zinc-200/50 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-mono font-bold">Line Item Subtotal</span>
              <span className="text-base font-semibold font-mono text-zinc-900">₹{activeItemTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={handlePushProductToQuote}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-medium text-xs rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              {editingItemId ? 'Update Line Specification' : 'Add to Quotation Draft'}
            </button>
          </div>

        </div>

        {/* RIGHT BILLING PORTAL (Quotation draft, listing multiple items: Col Span 5) */}
        <div className="lg:col-span-5 bg-zinc-50/20 border border-zinc-200/60 rounded-2xl p-5 md:p-6 space-y-6">
          
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">Quotation Draft Registry</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Adjust gross margins and discounts for the draft.</p>
          </div>

          {/* ADDED PRODUCTS ITEM LIST */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
              <span>LISTED SPECIFICATIONS ({quoteItems.length})</span>
              <span>SUM COST</span>
            </div>

            {quoteItems.length === 0 ? (
              <div className="border border-dashed border-zinc-200 rounded-xl p-8 text-center space-y-2 bg-white/40">
                <span className="text-xl block text-zinc-450">📋</span>
                <div>
                  <span className="text-xs font-medium text-zinc-850 block">Draft list is empty</span>
                  <p className="text-[10px] text-zinc-400 leading-normal max-w-[200px] mx-auto mt-1">Configure parameters on the left and click "Add to Quotation Draft".</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {quoteItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="border border-zinc-200 rounded-xl p-3 bg-white hover:border-zinc-400 transition-all space-y-2.5 relative group"
                    >
                      
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-zinc-900">{item.productName}</span>
                            <span className="text-[9px] text-zinc-450 font-mono">({item.width}x{item.height} {item.unit})</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{item.materialName} • Qty {item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold font-mono text-zinc-900">₹{item.itemTotal}</span>
                      </div>

                      {/* Action Panel for Product rows */}
                      <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-[10px] font-mono text-zinc-500">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => handleReorderItem(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleReorderItem(index, 'down')}
                            disabled={index === quoteItems.length - 1}
                            className="p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 font-sans">
                          <button
                            onClick={() => handleEditItemInList(item)}
                            className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-400 text-zinc-600 rounded transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateItemInList(item)}
                            className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-400 text-zinc-600 rounded transition-all cursor-pointer"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleDeleteItemFromList(item.id)}
                            className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 hover:border-red-500 hover:text-red-600 text-zinc-500 rounded transition-all cursor-pointer"
                          >
                            Del
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* GLOBAL ADJUSTMENT PANEL (DISCOUNT, MARKUP, GST) */}
          <div className="border-t border-zinc-200/60 pt-5 space-y-4">
            
            {/* Markup Slider */}
            <div className="space-y-1.5 bg-zinc-50/50 p-3.5 rounded-xl border border-zinc-200/50">
              <div className="flex justify-between items-center text-[10px] text-zinc-450 uppercase font-mono tracking-wider">
                <span>Profit Margin Markup</span>
                <span className="font-mono text-zinc-900 font-semibold">{markupPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(parseInt(e.target.value))}
                className="w-full accent-zinc-800 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none mt-1"
              />
              <div className="flex justify-between text-[9px] text-zinc-450 font-mono mt-1">
                <span>Cost Only</span>
                <span>25% Target</span>
                <span>100% Max</span>
              </div>
            </div>

            {/* Discount and GST */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 bg-zinc-50/50 p-3 rounded-xl border border-zinc-200/50">
                <label className="text-[10px] text-zinc-450 uppercase block font-mono">Special Discount</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full h-8 pl-5 pr-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold outline-none focus:border-zinc-800"
                  />
                  <span className="absolute left-1.5 top-2 text-xs text-zinc-450 font-mono">₹</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-50/50 rounded-xl border border-zinc-200/50 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-450 uppercase font-mono">GST (18% rate)</span>
                <button
                  onClick={() => setGstEnabled(!gstEnabled)}
                  className={`w-full h-8 mt-1 rounded-lg text-[10px] font-mono transition-colors border ${
                    gstEnabled
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {gstEnabled ? '✓ Active' : 'None'}
                </button>
              </div>
            </div>

          </div>

          {/* ITEMISED BILLING INVOICE LEDGER */}
          <div className="bg-zinc-50/80 rounded-2xl p-4.5 border border-zinc-200/50 font-mono text-[10px] text-zinc-500 space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Commercial Billing Summary</span>
            <div className="flex justify-between">
              <span>Items Net Subtotal:</span>
              <span className="font-semibold text-zinc-900">₹{globalSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Profit Markup ({markupPercent}%):</span>
              <span className="font-semibold text-zinc-800">+₹{globalMarkupAmount.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-zinc-650">
                <span>Special Discount:</span>
                <span className="font-semibold text-zinc-700">-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST Surcharges ({gstEnabled ? '18%' : '0%'}):</span>
              <span className="font-semibold text-zinc-900">₹{globalGstAmount.toLocaleString()}</span>
            </div>
            <div className="border-t border-zinc-200 pt-2.5 flex justify-between text-xs text-zinc-900 font-semibold font-mono">
              <span className="uppercase tracking-wider">Quotation Grand Total:</span>
              <span className="text-sm">₹{globalGrandTotal.toLocaleString()}</span>
            </div>
          </div>

        </div>

      </div>

      {/* STICKY GLASSY FLOATING BOTTOM BAR (SaaS Premium signature design) */}
      <div className="fixed bottom-6 left-6 right-6 md:left-24 md:right-8 bg-white/70 backdrop-blur-md border border-zinc-200/80 py-4 px-6 shadow-xl rounded-2xl z-40 max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="space-y-0.5 text-left">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Quotation Total Est.</span>
            <div className="text-lg sm:text-xl font-semibold font-mono text-zinc-900">
              ₹{globalGrandTotal.toLocaleString()}
            </div>
          </div>
          {quoteItems.length > 0 && (
            <span className="text-[10px] font-mono bg-zinc-100 px-2.5 py-0.5 rounded-full text-zinc-600">
              {quoteItems.length} Products
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          
          <button
            onClick={() => {
              calculateGlobalInvoice();
              triggerToast('Recalculated global invoice ledger');
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-xl cursor-pointer transition-colors border border-zinc-200/50"
          >
            Recalculate
          </button>

          <button
            onClick={handleSaveQuotationDraft}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-medium rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-zinc-200" /> Save Draft
          </button>

          <button
            onClick={handlePushAllToJobBoard}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 border border-zinc-200/50"
          >
            Push to Production
          </button>

        </div>

      </div>

    </div>
  );
}
