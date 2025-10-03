'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
}

interface InvoiceData {
  // Company Details
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyLogo: string;

  // Client Details
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;

  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;

  // Line Items
  lineItems: LineItem[];

  // Additional Settings
  notes: string;
  terms: string;

  // Global Settings
  globalTaxRate: number;
  globalDiscountRate: number;
  globalDiscountType: 'percentage' | 'fixed';

  // Theme
  theme: string;
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

export default function InvoiceGenerator() {
  const [isClient, setIsClient] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyLogo: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    lineItems: [
      {
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
      }
    ],
    notes: '',
    terms: '',
    globalTaxRate: 0,
    globalDiscountRate: 0,
    globalDiscountType: 'percentage',
    theme: 'modern',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', message: '' });
  const [shareLink, setShareLink] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load data from localStorage on mount (client-side only)
  useEffect(() => {
    if (isClient) {
      const savedData = localStorage.getItem('invoiceData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Ensure all required fields exist with proper defaults
          const completeData = {
            ...invoiceData, // Use initial state as base
            ...parsed, // Override with saved data
            // Ensure lineItems always has at least one item
            lineItems: parsed.lineItems && parsed.lineItems.length > 0
              ? parsed.lineItems.map((item: any) => ({
                  id: item.id || Date.now().toString(),
                  description: item.description || '',
                  quantity: Number(item.quantity) || 1,
                  unitPrice: Number(item.unitPrice) || 0,
                  discount: Number(item.discount) || 0,
                  tax: Number(item.tax) || 0,
                }))
              : [{
                  id: Date.now().toString(),
                  description: '',
                  quantity: 1,
                  unitPrice: 0,
                  discount: 0,
                  tax: 0,
                }],
            // Ensure global settings have proper defaults
            globalTaxRate: Number(parsed.globalTaxRate) || 0,
            globalDiscountRate: Number(parsed.globalDiscountRate) || 0,
            globalDiscountType: parsed.globalDiscountType || 'percentage',
          };
          setInvoiceData(completeData);
          // Force update after loading data
          setTimeout(() => {
            setForceUpdate(prev => prev + 1);
          }, 200);
        } catch (error) {
          console.error('Error loading saved invoice data:', error);
        }
      }
    }
  }, [isClient]);

  // Save to localStorage whenever data changes (client-side only)
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    }
  }, [invoiceData, isClient]);

  // Force update when critical data changes
  useEffect(() => {
    if (isClient) {
      setForceUpdate(prev => prev + 1);
    }
  }, [
    invoiceData.companyLogo,
    invoiceData.companyName,
    invoiceData.clientName,
    invoiceData.theme,
    invoiceData.currency,
    invoiceData.invoiceNumber,
    isClient
  ]);

  const currentTheme = themes.find(t => t.id === invoiceData.theme) || themes[0];
  const currentCurrency = currencies.find(c => c.code === invoiceData.currency) || currencies[0];

  const updateInvoiceData = (updates: Partial<InvoiceData>) => {
    setInvoiceData(prev => ({ ...prev, ...updates }));
    // Force re-render of invoice preview
    setForceUpdate(prev => prev + 1);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
    };
    updateInvoiceData({
      lineItems: [...invoiceData.lineItems, newItem]
    });
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    updateInvoiceData({
      lineItems: invoiceData.lineItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    });
  };

  const removeLineItem = (id: string) => {
    if (invoiceData.lineItems.length > 1) {
      updateInvoiceData({
        lineItems: invoiceData.lineItems.filter(item => item.id !== id)
      });
    }
  };

  const calculateLineTotal = (item: LineItem) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const tax = Number(item.tax) || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (tax / 100);
    const total = afterDiscount + taxAmount;

    return isNaN(total) ? 0 : total;
  };

  const calculateTotals = () => {
    // Calculate line item totals
    const lineItemTotals = invoiceData.lineItems.map(item => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;
      const tax = Number(item.tax) || 0;

      const itemSubtotal = quantity * unitPrice;
      const itemDiscount = itemSubtotal * (discount / 100);
      const itemAfterDiscount = itemSubtotal - itemDiscount;
      const itemTax = itemAfterDiscount * (tax / 100);
      const itemTotal = itemAfterDiscount + itemTax;

      return {
        subtotal: isNaN(itemSubtotal) ? 0 : itemSubtotal,
        discount: isNaN(itemDiscount) ? 0 : itemDiscount,
        tax: isNaN(itemTax) ? 0 : itemTax,
        total: isNaN(itemTotal) ? 0 : itemTotal
      };
    });

    // Calculate subtotals
    const subtotal = lineItemTotals.reduce((sum, item) => sum + item.subtotal, 0);
    const itemDiscounts = lineItemTotals.reduce((sum, item) => sum + item.discount, 0);
    const itemTaxes = lineItemTotals.reduce((sum, item) => sum + item.tax, 0);
    const afterItemCalculations = subtotal - itemDiscounts + itemTaxes;

    // Apply global tax
    const globalTaxRate = Number(invoiceData.globalTaxRate) || 0;
    const globalTaxAmount = afterItemCalculations * (globalTaxRate / 100);
    const afterGlobalTax = afterItemCalculations + globalTaxAmount;

    // Apply global discount
    const globalDiscountRate = Number(invoiceData.globalDiscountRate) || 0;
    let globalDiscountAmount = 0;
    if (invoiceData.globalDiscountType === 'percentage') {
      globalDiscountAmount = afterGlobalTax * (globalDiscountRate / 100);
    } else {
      globalDiscountAmount = globalDiscountRate;
    }

    const grandTotal = afterGlobalTax - globalDiscountAmount;

    return {
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      itemDiscounts: isNaN(itemDiscounts) ? 0 : itemDiscounts,
      itemTaxes: isNaN(itemTaxes) ? 0 : itemTaxes,
      globalTaxAmount: isNaN(globalTaxAmount) ? 0 : globalTaxAmount,
      globalDiscountAmount: isNaN(globalDiscountAmount) ? 0 : globalDiscountAmount,
      totalTax: isNaN(itemTaxes + globalTaxAmount) ? 0 : itemTaxes + globalTaxAmount,
      totalDiscount: isNaN(itemDiscounts + globalDiscountAmount) ? 0 : itemDiscounts + globalDiscountAmount,
      grandTotal: isNaN(grandTotal) ? 0 : Math.max(0, grandTotal) // Ensure total is not negative
    };
  };

  const totals = calculateTotals();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target?.result as string;
        updateInvoiceData({ companyLogo: logoData });
        // Force immediate re-render
        setTimeout(() => {
          setForceUpdate(prev => prev + 1);
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToPDF = async () => {
    if (!invoiceRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateShareLink = () => {
    if (!isClient) return;

    // Create a compressed version of the invoice data
    const compressedData = {
      c: invoiceData.companyName,
      e: invoiceData.companyEmail,
      p: invoiceData.companyPhone,
      a: invoiceData.companyAddress,
      l: invoiceData.companyLogo,
      cn: invoiceData.clientName,
      ce: invoiceData.clientEmail,
      cp: invoiceData.clientPhone,
      ca: invoiceData.clientAddress,
      n: invoiceData.invoiceNumber,
      d: invoiceData.invoiceDate,
      du: invoiceData.dueDate,
      cu: invoiceData.currency,
      i: invoiceData.lineItems.map(item => ({
        id: item.id,
        d: item.description,
        q: item.quantity,
        u: item.unitPrice,
        ds: item.discount,
        t: item.tax
      })),
      no: invoiceData.notes,
      te: invoiceData.terms,
      th: invoiceData.theme,
      gtr: invoiceData.globalTaxRate,
      gdr: invoiceData.globalDiscountRate,
      gdt: invoiceData.globalDiscountType
    };

    // Create a short ID for the invoice
    const shortId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    // Store the compressed data in localStorage with the short ID
    localStorage.setItem(`invoice_${shortId}`, JSON.stringify(compressedData));

    // Create short link with your domain
    const link = `https://flipfilex.com/i/${shortId}`;
    setShareLink(link);

    // Copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
  };

  const sendEmail = () => {
    setEmailData({
      to: 'pakistanboy9990@gmail.com',
      subject: `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.companyName || 'FlipFileX'}`,
      message: `Dear ${invoiceData.clientName || 'Client'},\n\nPlease find attached your invoice ${invoiceData.invoiceNumber}.\n\nThank you for your business!\n\nBest regards,\n${invoiceData.companyName || 'FlipFileX'}\n\nGenerated with FlipFileX Invoice Generator\nhttps://flipfilex.com/invoice-generator`
    });
    setShowEmailModal(true);
  };

  const createNewInvoice = () => {
    const newInvoiceData: InvoiceData = {
      companyName: invoiceData.companyName, // Keep company info
      companyEmail: invoiceData.companyEmail,
      companyPhone: invoiceData.companyPhone,
      companyAddress: invoiceData.companyAddress,
      companyLogo: invoiceData.companyLogo,
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: invoiceData.currency, // Keep currency preference
      lineItems: [
        {
          id: Date.now().toString(),
          description: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          tax: 0,
        }
      ],
      notes: '',
      terms: '',
      globalTaxRate: 0, // Reset global settings
      globalDiscountRate: 0,
      globalDiscountType: 'percentage',
      theme: invoiceData.theme, // Keep theme preference
    };
    setInvoiceData(newInvoiceData);
    setShareLink(''); // Clear share link
    setForceUpdate(prev => prev + 1); // Force update

    // Auto-scroll to invoice preview section
    setTimeout(() => {
      if (invoiceRef.current) {
        invoiceRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">

      {/* Form Section */}
      <div className="xl:col-span-1 space-y-6">

        {/* Theme Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M11 7L9 9l-4-4v8l4-4 2 2" />
            </svg>
            Color Theme
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => updateInvoiceData({ theme: theme.id })}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  invoiceData.theme === theme.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{theme.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Company Details
          </h3>

          {/* Logo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
            <div className="flex items-center space-x-4">
              {invoiceData.companyLogo && (
                <img
                  src={invoiceData.companyLogo}
                  alt="Company Logo"
                  className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                />
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {invoiceData.companyLogo ? 'Change Logo' : 'Upload Logo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Company Name *"
              value={invoiceData.companyName}
              onChange={(e) => updateInvoiceData({ companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Company Email"
              value={invoiceData.companyEmail}
              onChange={(e) => updateInvoiceData({ companyEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Company Phone"
              value={invoiceData.companyPhone}
              onChange={(e) => updateInvoiceData({ companyPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              placeholder="Company Address"
              value={invoiceData.companyAddress}
              onChange={(e) => updateInvoiceData({ companyAddress: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Client Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Client Details
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Client Name *"
              value={invoiceData.clientName}
              onChange={(e) => updateInvoiceData({ clientName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={invoiceData.clientEmail}
              onChange={(e) => updateInvoiceData({ clientEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Client Phone"
              value={invoiceData.clientPhone}
              onChange={(e) => updateInvoiceData({ clientPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              placeholder="Client Address"
              value={invoiceData.clientAddress}
              onChange={(e) => updateInvoiceData({ clientAddress: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Invoice Settings
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Invoice Number"
              value={invoiceData.invoiceNumber}
              onChange={(e) => updateInvoiceData({ invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => updateInvoiceData({ invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => updateInvoiceData({ dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={invoiceData.currency}
                onChange={(e) => updateInvoiceData({ currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Global Invoice Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Global Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Global Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Apply to all items"
                value={invoiceData.globalTaxRate}
                onChange={(e) => updateInvoiceData({ globalTaxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">This will be added to individual item tax rates</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Global Discount</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Discount amount"
                  value={invoiceData.globalDiscountRate}
                  onChange={(e) => updateInvoiceData({ globalDiscountRate: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <select
                  value={invoiceData.globalDiscountType}
                  onChange={(e) => updateInvoiceData({ globalDiscountType: e.target.value as 'percentage' | 'fixed' })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">{currentCurrency.symbol}</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Applied after individual item calculations</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-indigo-900">Calculation Order</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    1. Individual item calculations<br/>
                    2. Global tax added<br/>
                    3. Global discount applied
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Management */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Line Items
          </h3>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {invoiceData.lineItems.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700">Item #{index + 1}</span>
                  {invoiceData.lineItems.length > 1 && (
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2 rounded-l border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
                          {currentCurrency.symbol}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-r text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => updateLineItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tax (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.tax}
                        onChange={(e) => updateLineItem(item.id, { tax: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-700 font-medium">Item Total:</span>
                      <span className="text-indigo-900 font-semibold">
                        {currentCurrency.symbol}{calculateLineTotal(item).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addLineItem}
            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg border-2 border-dashed border-indigo-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Line Item</span>
          </button>
        </div>

        {/* Notes & Terms */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Notes & Terms
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                placeholder="Add any additional notes for your client..."
                value={invoiceData.notes}
                onChange={(e) => updateInvoiceData({ notes: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">These notes will appear on the invoice</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
              <textarea
                placeholder="Payment terms, refund policy, etc..."
                value={invoiceData.terms}
                onChange={(e) => updateInvoiceData({ terms: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Legal terms and payment conditions</p>
            </div>

            {/* Live Preview of notes and terms */}
            {(invoiceData.notes || invoiceData.terms) && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview on Invoice:
                </h4>
                <div className="space-y-3">
                  {invoiceData.notes && (
                    <div className="bg-white border border-indigo-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-indigo-800 mb-1">Notes:</p>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{invoiceData.notes}</p>
                    </div>
                  )}
                  {invoiceData.terms && (
                    <div className="bg-white border border-indigo-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-indigo-800 mb-1">Terms & Conditions:</p>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{invoiceData.terms}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Export & Share
          </h3>
          <div className="space-y-3">
            <button
              onClick={exportToPDF}
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export PDF</span>
                </>
              )}
            </button>

            <button
              onClick={sendEmail}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email Invoice</span>
            </button>

            <button
              onClick={generateShareLink}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Generate Share Link</span>
            </button>

            <hr className="border-gray-300 my-4" />

            <button
              onClick={createNewInvoice}
              className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Invoice</span>
            </button>

            {shareLink && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-purple-800 font-medium">Share link created & copied!</p>
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <p className="text-sm text-purple-700 break-all font-mono">{shareLink}</p>
                </div>
                <p className="text-xs text-purple-600 mt-2">Share this link with your clients to view the invoice online</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="xl:col-span-2">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)]">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 xl:sticky xl:top-0 xl:z-10">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Invoice Preview
            </h3>
          </div>

          <div className="p-6 xl:h-[calc(100vh-9rem)] xl:overflow-y-auto">
            <div
              key={`invoice-${forceUpdate}-${invoiceData.invoiceNumber}`}
              ref={invoiceRef}
              className="bg-white p-8 min-h-[800px]"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.secondary} 0%, #ffffff 50%)`,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  {invoiceData.companyLogo && (
                    <img
                      src={invoiceData.companyLogo}
                      alt="Company Logo"
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: currentTheme.primary }}>
                      {invoiceData.companyName || 'Your Company Name'}
                    </h1>
                    <p className="text-gray-600">{invoiceData.companyEmail}</p>
                    <p className="text-gray-600">{invoiceData.companyPhone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold" style={{ color: currentTheme.accent }}>
                    INVOICE
                  </h2>
                  <p className="text-lg font-semibold mt-2">#{invoiceData.invoiceNumber}</p>
                </div>
              </div>

              {/* Company and Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ color: currentTheme.accent }}>
                    From:
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{invoiceData.companyName || 'Your Company Name'}</p>
                    <p className="whitespace-pre-line">{invoiceData.companyAddress}</p>
                    <p>{invoiceData.companyEmail}</p>
                    <p>{invoiceData.companyPhone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ color: currentTheme.accent }}>
                    To:
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{invoiceData.clientName || 'Client Name'}</p>
                    <p className="whitespace-pre-line">{invoiceData.clientAddress}</p>
                    <p>{invoiceData.clientEmail}</p>
                    <p>{invoiceData.clientPhone}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-700">Invoice Date</h4>
                  <p className="text-gray-900">{new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Due Date</h4>
                  <p className="text-gray-900">{new Date(invoiceData.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Currency</h4>
                  <p className="text-gray-900">{currentCurrency.name}</p>
                </div>
              </div>

              {/* Line Items Table - Preview Only */}
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
  {invoiceData.lineItems.map((item, index) => (
    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
      <td className="border border-gray-300 px-4 py-3">
        {item.description || 'Item description'}
      </td>
      <td className="border border-gray-300 px-4 py-3 text-center">
        {item.quantity}
      </td>
      <td className="border border-gray-300 px-4 py-3 text-right">
        {currentCurrency.symbol}{Number(item.unitPrice).toFixed(2)}
      </td>
      <td className="border border-gray-300 px-4 py-3 text-right">
        {item.discount}%
      </td>
      <td className="border border-gray-300 px-4 py-3 text-right">
        {item.tax}%
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
                      {/* Subtotal */}
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="font-medium">{currentCurrency.symbol}{totals.subtotal.toFixed(2)}</span>
                      </div>

                      {/* Item-level discounts */}
                      {totals.itemDiscounts > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 text-sm">Item Discounts:</span>
                          <span className="font-medium text-red-600 text-sm">-{currentCurrency.symbol}{totals.itemDiscounts.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Item-level taxes */}
                      {totals.itemTaxes > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 text-sm">Item Taxes:</span>
                          <span className="font-medium text-sm">{currentCurrency.symbol}{totals.itemTaxes.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Global tax */}
                      {totals.globalTaxAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Global Tax ({invoiceData.globalTaxRate}%):</span>
                          <span className="font-medium">{currentCurrency.symbol}{totals.globalTaxAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Global discount */}
                      {totals.globalDiscountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            Global Discount ({invoiceData.globalDiscountType === 'percentage'
                              ? `${invoiceData.globalDiscountRate}%`
                              : `${currentCurrency.symbol}${invoiceData.globalDiscountRate}`}):
                          </span>
                          <span className="font-medium text-red-600">-{currentCurrency.symbol}{totals.globalDiscountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Totals summary */}
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

              {/* Notes and Terms in Invoice Preview */}
              {(invoiceData.notes || invoiceData.terms) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {invoiceData.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3" style={{ color: currentTheme.accent }}>
                        Notes:
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.notes}</p>
                      </div>
                    </div>
                  )}
                  {invoiceData.terms && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3" style={{ color: currentTheme.accent }}>
                        Terms & Conditions:
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{invoiceData.terms}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Invoice via Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                <input
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="pakistanboy9990@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => {
                  try {
                    // Create mailto link with FlipFileX domain reference
                    const subject = encodeURIComponent(emailData.subject);
                    const body = encodeURIComponent(emailData.message + '\n\n---\nSent from FlipFileX Invoice Generator\nhttps://flipfilex.com/invoice-generator');
                    const mailtoUrl = `mailto:${emailData.to}?subject=${subject}&body=${body}`;

                    // Close modal first
                    setShowEmailModal(false);

                    // Open email client
                    window.location.href = mailtoUrl;

                  } catch (error) {
                    alert('Could not open email client. Please use the "Copy Details" option instead.');
                    console.error('Email error:', error);
                  }
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 text-sm"
              >
                Open Email App
              </button>
              <button
                onClick={() => {
                  // Copy email details to clipboard
                  const emailText = `To: ${emailData.to}\nSubject: ${emailData.subject}\n\nMessage:\n${emailData.message}\n\n---\nSent from FlipFileX Invoice Generator\nhttps://flipfilex.com/invoice-generator`;

                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(emailText).then(() => {
                      alert('Email details copied to clipboard! You can paste this into any email application.');
                    });
                  } else {
                    alert('Please copy these details manually:\n\n' + emailText);
                  }
                  setShowEmailModal(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 text-sm"
              >
                Copy Details
              </button>
            </div>
            <button
              onClick={() => setShowEmailModal(false)}
              className="w-full mt-3 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400"
            >
              Cancel
            </button>

            {/* Email Instructions */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-blue-900">Email Options:</p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li><strong>Open Email App:</strong> Opens Gmail/Outlook with pre-filled details</li>
                    <li><strong>Copy Details:</strong> Copies text to paste in any email service</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 Tip: Export PDF first, then attach it to your email!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}