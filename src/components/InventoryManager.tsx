/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, AlertTriangle, ArrowUpRight, ArrowDownRight, Plus, History, RefreshCw } from 'lucide-react';
import { Material, StockHistory } from '../types';

interface InventoryManagerProps {
  materials: Material[];
  onAddMaterial: (material: Material) => void;
  onUpdateStock: (materialId: string, type: 'IN' | 'OUT', qty: number, reason: string) => void;
  lang: 'EN' | 'HI';
}

export default function InventoryManager({ materials, onAddMaterial, onUpdateStock, lang }: InventoryManagerProps) {
  const [selectedMat, setSelectedMat] = useState<Material | null>(null);
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustQty, setAdjustQty] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<'Roll' | 'Vinyl' | 'ACP' | 'Acrylic' | 'LED' | 'Ink' | 'Hardware' | 'Board'>('Roll');
  const [newMatMinStock, setNewMatMinStock] = useState<number>(100);
  const [newMatUnit, setNewMatUnit] = useState('SqFt');
  const [newMatSupplier, setNewMatSupplier] = useState('');
  const [newMatPrice, setNewMatPrice] = useState<number>(10);

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMat) return;
    if (adjustQty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    onUpdateStock(selectedMat.id, adjustType, adjustQty, adjustReason || (adjustType === 'IN' ? 'Supplier Restock' : 'Floor Consumption'));
    
    // Reset adjustment states
    setAdjustQty(100);
    setAdjustReason('');
    setSelectedMat(null);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName) return;

    const newMaterial: Material = {
      id: `MAT-00${materials.length + 1}`,
      name: newMatName,
      category: newMatCategory,
      stockLevel: 0, // initially zero, can restock via IN adjustment
      minStockLevel: newMatMinStock,
      unit: newMatUnit,
      supplier: newMatSupplier || 'Local Vendor',
      lastPurchasePrice: newMatPrice,
      history: [],
    };

    onAddMaterial(newMaterial);
    setShowAddForm(false);
    // Reset inputs
    setNewMatName('');
    setNewMatSupplier('');
  };

  return (
    <div className="space-y-6">
      {/* KPI stock summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider">{lang === 'EN' ? 'Total Catalog Items' : 'कुल कैटलॉग आइटम'}</div>
            <div className="text-xl font-display font-bold text-slate-900 mt-1">{materials.length} Materials</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-mono text-yellow-800 font-bold tracking-wider">{lang === 'EN' ? 'Low Stock Alerts' : 'कम स्टॉक चेतावनी'}</div>
            <div className="text-xl font-display font-bold text-yellow-950 mt-1">
              {materials.filter((m) => m.stockLevel <= m.minStockLevel).length} Items Low
            </div>
          </div>
          <div className="p-3 bg-yellow-100 rounded-xl text-yellow-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider">{lang === 'EN' ? 'Stock Value Estimated' : 'स्टॉक का अनुमानित मूल्य'}</div>
            <div className="text-xl font-display font-bold text-slate-900 mt-1">
              ₹{materials.reduce((sum, m) => sum + m.stockLevel * m.lastPurchasePrice, 0).toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100/50">
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Layout for lists & logs */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main inventory directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-600" />
                {lang === 'EN' ? 'Material Stock Inventory' : 'सामग्री स्टॉक इन्वेंटरी'}
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" /> {lang === 'EN' ? 'Add Material Type' : 'नई सामग्री जोड़ें'}
              </button>
            </div>

            {/* Low stock notice banner */}
            {materials.some((m) => m.stockLevel <= m.minStockLevel) && (
              <div className="mb-4.5 p-4 bg-yellow-50/50 border border-yellow-200 text-yellow-850 rounded-xl text-xs flex gap-2.5">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'EN' ? 'Restock Warning:' : 'स्टॉक चेतावनी:'}</strong> Some high-turnover media stocks (such as Star Flex and LED modules) have dropped below secure threshold levels. Place supplier orders immediately.
                </span>
              </div>
            )}

            {/* Catalog Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-3 font-bold text-slate-700">Material / Spec</th>
                    <th className="p-3 font-bold text-slate-700">Category</th>
                    <th className="p-3 font-bold text-slate-700 text-right">In Stock</th>
                    <th className="p-3 font-bold text-slate-700 text-right">Min Safe</th>
                    <th className="p-3 font-bold text-slate-700">Unit Price</th>
                    <th className="p-3 font-bold text-slate-700">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {materials.map((m) => {
                    const isLow = m.stockLevel <= m.minStockLevel;
                    return (
                      <tr key={m.id} className="hover:bg-slate-55/10 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          <div>{m.name}</div>
                          <span className="text-[10px] text-slate-450 font-mono block mt-0.5 font-normal">Supplier: {m.supplier}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-700">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold font-mono">
                          <span className={isLow ? 'text-red-600' : 'text-slate-900'}>
                            {m.stockLevel.toLocaleString()} {m.unit}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-400 font-medium">
                          {m.minStockLevel.toLocaleString()} {m.unit}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-700">
                          ₹{m.lastPurchasePrice}/{m.unit}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedMat(m)}
                            className="text-red-600 hover:text-red-700 font-bold cursor-pointer text-xs transition-colors"
                          >
                            Update stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Adjust Stock Form & Stock Audit Logs */}
        <div className="space-y-6">
          {selectedMat ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 mb-4">
                Modify stock: {selectedMat.name}
              </h3>
              <form onSubmit={handleStockAdjustment} className="space-y-4">
                <div className="flex flex-col gap-2.5">
                  <label className="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-xl bg-emerald-50 text-emerald-800 border-emerald-200 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="adjType"
                      checked={adjustType === 'IN'}
                      onChange={() => setAdjustType('IN')}
                      className="accent-emerald-600"
                    />
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    Stock IN (Supplier Supply)
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-xl bg-red-50 text-red-800 border-red-200 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="adjType"
                      checked={adjustType === 'OUT'}
                      onChange={() => setAdjustType('OUT')}
                      className="accent-red-600"
                    />
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                    Stock OUT (Floor Use)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adjust Quantity ({selectedMat.unit}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Action Log</label>
                  <input
                    type="text"
                    placeholder="e.g. Bulk roll restocked / Print wastage"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMat(null)}
                    className="flex-1 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-xs">
                    Log Adjustment
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 mb-4 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-500" />
                Latest Stock Logs
              </h3>

              {/* Collapsed history timeline */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {materials.flatMap((m) => m.history.map((h) => ({ ...h, matName: m.name, matUnit: m.unit }))).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6 font-mono">No transaction logs logged this period.</p>
                ) : (
                  materials
                    .flatMap((m) => m.history.map((h) => ({ ...h, matName: m.name, matUnit: m.unit })))
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((log) => (
                      <div key={log.id} className="p-3 border border-slate-150 rounded-xl bg-slate-50/50 text-xs">
                        <div className="flex justify-between font-mono text-[10px] text-slate-400 mb-1.5">
                          <span>{log.date}</span>
                          <span className={log.type === 'IN' ? 'text-green-600 font-extrabold' : 'text-red-500 font-extrabold'}>
                            {log.type === 'IN' ? '+' : '-'}{log.qty} {log.matUnit}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 truncate">{log.matName}</div>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">
                          Reason: {log.reason} — by {log.user}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Add Material Overlay form */}
          {showAddForm && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 mb-4">
                Create Catalog Entry
              </h3>
              <form onSubmit={handleCreateMaterial} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    value={newMatName}
                    onChange={(e) => setNewMatName(e.target.value)}
                    placeholder="e.g. Backlit PVC Star Film"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newMatCategory}
                      onChange={(e) => setNewMatCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Roll">Rolls/PVC</option>
                      <option value="Vinyl">Vinyl Films</option>
                      <option value="ACP">ACP Sheets</option>
                      <option value="Acrylic">Acrylics</option>
                      <option value="LED">LEDs</option>
                      <option value="Ink">Ink bottles</option>
                      <option value="Hardware">Hardware/Tools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Measure</label>
                    <select
                      value={newMatUnit}
                      onChange={(e) => setNewMatUnit(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value="SqFt">SqFt</option>
                      <option value="Sheets">Sheets</option>
                      <option value="Modules">Modules</option>
                      <option value="Bottles">Bottles</option>
                      <option value="Nos">Numbers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Min Threshold</label>
                    <input
                      type="number"
                      required
                      value={newMatMinStock}
                      onChange={(e) => setNewMatMinStock(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newMatPrice}
                      onChange={(e) => setNewMatPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Supplier</label>
                  <input
                    type="text"
                    value={newMatSupplier}
                    onChange={(e) => setNewMatSupplier(e.target.value)}
                    placeholder="Supplier name"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-xs">
                    Add catalog
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
