/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import EstimateBuilder from './EstimateBuilder';
import { CalculatorRates, Customer, Quotation } from '../types';

interface CalculatorHubProps {
  rates: CalculatorRates;
  onUpdateRates: (newRates: CalculatorRates) => void;
  onAddJobFromCalc: (job: { title: string; description: string; cost: number; customerName: string }) => void;
  userRole: string;
  lang: 'EN' | 'HI';
  customers?: Customer[];
  onAddQuotation?: (q: Quotation) => void;
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
  return (
    <div className="w-full space-y-6" id="redesigned-estimate-workspace">
      
      {/* Brand-new intelligent Estimate Builder component */}
      <EstimateBuilder
        rates={rates}
        onUpdateRates={onUpdateRates}
        onAddJobFromCalc={onAddJobFromCalc}
        userRole={userRole}
        lang={lang}
        customers={customers}
        onAddQuotation={onAddQuotation}
      />

    </div>
  );
}
