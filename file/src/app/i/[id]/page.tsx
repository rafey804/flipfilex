'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface InvoiceData {
  c: string;
  e: string;
  p: string;
  a: string;
  l: string;
  cn: string;
  ce: string;
  cp: string;
  ca: string;
  n: string;
  d: string;
  du: string;
  cu: string;
  i: Array<{
    id: string;
    d: string;
    q: number;
    u: number;
    ds: number;
    t: number;
  }>;
  no: string;
  te: string;
  th: string;
  gtr: number;
  gdr: number;
  gdt: 'percentage' | 'fixed';
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
];

const themes = [
  { id: 'modern', name: 'Modern Blue', primary: '#3B82F6', secondary: '#EFF6FF', accent: '#1E40AF' },
  { id: 'emerald', name: 'Professional Emerald', primary: '#10B981', secondary: '#ECFDF5', accent: '#047857' },
  { id: 'purple', name: 'Creative Purple', primary: '#8B5CF6', secondary: '#F3E8FF', accent: '#5B21B6' },
  { id: 'orange', name: 'Energetic Orange', primary: '#F59E0B', secondary: '#FEF3C7', accent: '#D97706' },
  { id: 'slate', name: 'Corporate Slate', primary: '#64748B', secondary: '#F8FAFC', accent: '#334155' },
];

export default function InvoiceViewPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !id) {
      setLoading(false);
      setError('Invalid invoice ID');
      return;
    }

    try {
      const storedData = localStorage.getItem(`invoice_${id}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setInvoiceData(data);
        setError(null);
      } else {
        setError('Invoice not found');
      }
    } catch (err) {
      console.error('Error loading invoice:', err);
      setError('Invalid invoice data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const calculateLineTotal = (item: any) => {
    const subtotal = item.q * item.u;
    const discountAmount = subtotal * (item.ds / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (item.t / 100);
    return afterDiscount + taxAmount;
  };

  const calculateTotals = () => {
    if (!invoiceData) {
      return {
        subtotal: 0,
        itemDiscounts: 0,
        itemTaxes: 0,
        globalTaxAmount: 0,
        globalDiscountAmount: 0,
        totalTax: 0,
        totalDiscount: 0,
        grandTotal: 0
      };
    }

    const lineItemTotals = invoiceData.i.map(item => {
      const itemSubtotal = item.q * item.u;
      const itemDiscount = itemSubtotal * (item.ds / 100);
      const itemAfterDiscount = itemSubtotal - itemDiscount;
      const itemTax = itemAfterDiscount * (item.t / 100);
      const itemTotal = itemAfterDiscount + itemTax;

      return {
        subtotal: itemSubtotal,
        discount: itemDiscount,
        tax: itemTax,
        total: itemTotal
      };
    });

    const subtotal = lineItemTotals.reduce((sum, item) => sum + item.subtotal, 0);
    const itemDiscounts = lineItemTotals.reduce((sum, item) => sum + item.discount, 0);
    const itemTaxes = lineItemTotals.reduce((sum, item) => sum + item.tax, 0);
    const afterItemCalculations = subtotal - itemDiscounts + itemTaxes;

    const globalTaxAmount = afterItemCalculations * ((invoiceData.gtr || 0) / 100);
    const afterGlobalTax = afterItemCalculations + globalTaxAmount;

    let globalDiscountAmount = 0;
    if (invoiceData.gdt === 'percentage') {
      globalDiscountAmount = afterGlobalTax * ((invoiceData.gdr || 0) / 100);
    } else {
      globalDiscountAmount = invoiceData.gdr || 0;
    }

    const grandTotal = afterGlobalTax - globalDiscountAmount;

    return {
      subtotal,
      itemDiscounts,
      itemTaxes,
      globalTaxAmount,
      globalDiscountAmount,
      totalTax: itemTaxes + globalTaxAmount,
      totalDiscount: itemDiscounts + globalDiscountAmount,
      grandTotal: Math.max(0, grandTotal)
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The invoice you\'re looking for doesn\'t exist or has expired.'}</p>
          <a
            href="/invoice-generator"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Create New Invoice
          </a>
        </div>
      </div>
    );
  }

  const currentTheme = themes.find(t => t.id === invoiceData.th) || themes[0];
  const currentCurrency = currencies.find(c => c.code === invoiceData.cu) || currencies[0];
  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shared Invoice</h1>
          <p className="text-gray-600">Generated with FlipFileX Invoice Generator</p>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div
              className="bg-white p-8 min-h-[800px]"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.secondary} 0%, #ffffff 50%)`,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  {invoiceData.l && (
                    <img
                      src={invoiceData.l}
                      alt="Company Logo"
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: currentTheme.primary }}>
                      {invoiceData.c || 'Company Name'}
                    </h1>
                    <p className="text-gray-600">{invoiceData.e}</p>
                    <p className="text-gray-600">{invoiceData.p}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.accent }}>
                    INVOICE
                  </h2>
                  <p className="text-lg font-semibold mt-2">#{invoiceData.n}</p>
                </div>
              </div>

              {/* Company and Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ color: currentTheme.accent }}>
                    From:
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{invoiceData.c || 'Company Name'}</p>
                    <p className="whitespace-pre-line">{invoiceData.a}</p>
                    <p>{invoiceData.e}</p>
                    <p>{invoiceData.p}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ color: currentTheme.accent }}>
                    To:
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{invoiceData.cn || 'Client Name'}</p>
                    <p className="whitespace-pre-line">{invoiceData.ca}</p>
                    <p>{invoiceData.ce}</p>
                    <p>{invoiceData.cp}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-700">Invoice Date</h4>
                  <p className="text-gray-900">{new Date(invoiceData.d).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Due Date</h4>
                  <p className="text-gray-900">{new Date(invoiceData.du).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Currency</h4>
                  <p className="text-gray-900">{currentCurrency.name}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: currentTheme.secondary }}>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold" style={{ color: currentTheme.accent }}>
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold" style={{ color: currentTheme.accent }}>
                        Qty
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold" style={{ color: currentTheme.accent }}>
                        Unit Price
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold" style={{ color: currentTheme.accent }}>
                        Discount
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold" style={{ color: currentTheme.accent }}>
                        Tax
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold" style={{ color: currentTheme.accent }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.i.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 px-4 py-3">
                          {item.d || 'Item description'}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          {item.q}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {currentCurrency.symbol}{item.u.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {item.ds}%
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {item.t}%
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                          {currentCurrency.symbol}{calculateLineTotal(item).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-96">
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="font-medium">{currentCurrency.symbol}{totals.subtotal.toFixed(2)}</span>
                      </div>

                      {totals.itemDiscounts > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 text-sm">Item Discounts:</span>
                          <span className="font-medium text-red-600 text-sm">-{currentCurrency.symbol}{totals.itemDiscounts.toFixed(2)}</span>
                        </div>
                      )}

                      {totals.itemTaxes > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 text-sm">Item Taxes:</span>
                          <span className="font-medium text-sm">{currentCurrency.symbol}{totals.itemTaxes.toFixed(2)}</span>
                        </div>
                      )}

                      {totals.globalTaxAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Global Tax ({invoiceData.gtr}%):</span>
                          <span className="font-medium">{currentCurrency.symbol}{totals.globalTaxAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {totals.globalDiscountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            Global Discount ({invoiceData.gdt === 'percentage'
                              ? `${invoiceData.gdr}%`
                              : `${currentCurrency.symbol}${invoiceData.gdr}`}):
                          </span>
                          <span className="font-medium text-red-600">-{currentCurrency.symbol}{totals.globalDiscountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {(totals.totalDiscount > 0 || totals.totalTax > 0) && (
                        <>
                          <hr className="border-gray-300 my-3" />
                          {totals.totalDiscount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-700 font-medium">Total Discount:</span>
                              <span className="font-semibold text-red-600">-{currentCurrency.symbol}{totals.totalDiscount.toFixed(2)}</span>
                            </div>
                          )}
                          {totals.totalTax > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-700 font-medium">Total Tax:</span>
                              <span className="font-semibold">{currentCurrency.symbol}{totals.totalTax.toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      )}

                      <hr className="border-gray-400 my-3" />
                      <div className="flex justify-between text-lg font-bold" style={{ color: currentTheme.accent }}>
                        <span>Grand Total:</span>
                        <span>{currentCurrency.symbol}{totals.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              {(invoiceData.no || invoiceData.te) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {invoiceData.no && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3" style={{ color: currentTheme.accent }}>
                        Notes:
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.no}</p>
                      </div>
                    </div>
                  )}
                  {invoiceData.te && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3" style={{ color: currentTheme.accent }}>
                        Terms & Conditions:
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.te}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-8 space-x-4">
          <a
            href="/invoice-generator"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Create Your Own Invoice
          </a>
          <button
            onClick={() => window.print()}
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}