'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { API_URL } from '../../../lib/api';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    issuedAt: string;
    dueDate: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    vehicle: {
        make: string;
        model: string;
        year: number;
        vin: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
}

interface BusinessProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    logo: string;
}

export default function InvoicePage() {
    const params = useParams();
    const id = params?.id as string;
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            Promise.all([
                fetchInvoice(),
                fetchBusinessProfile()
            ]).then(() => setIsLoading(false));
        }
    }, [id]);

    const fetchInvoice = async () => {
        // In a real app, fetch from API
        // For now using mock data as per previous implementation
        const mockInvoice = {
            id: id,
            invoiceNumber: 'INV-2024-001',
            issuedAt: new Date().toLocaleDateString(),
            dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            customer: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '555-0101',
                address: '123 Main St, Springfield, IL 62704',
            },
            vehicle: {
                make: 'Toyota',
                model: 'Camry',
                year: 2020,
                vin: 'VIN123456789',
            },
            items: [
                { id: '1', description: 'Brake Pad Replacement', quantity: 1, unitPrice: 150.00, total: 150.00 },
                { id: '2', description: 'Brake Rotor Resurfacing', quantity: 2, unitPrice: 45.00, total: 90.00 },
                { id: '3', description: 'Labor', quantity: 2, unitPrice: 85.00, total: 170.00 },
            ],
            subtotal: 410.00,
            tax: 41.00,
            total: 451.00,
        };
        setInvoice(mockInvoice);
    };

    const fetchBusinessProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/business-profile`);
            if (res.ok) {
                const data = await res.json();
                setBusinessProfile(data);
            }
        } catch (error) {
            console.error('Failed to fetch business profile', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice-${invoice?.invoiceNumber || 'document'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try printing instead.');
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading invoice details...</div>;
    if (!invoice) return <div className="p-8 text-center">Invoice not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
            <div className="max-w-4xl mx-auto">
                {/* Actions Bar - Hidden when printing */}
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <Link
                        href="/jobs"
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jobs
                    </Link>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Invoice Card */}
                <div ref={invoiceRef} className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-8 print:bg-white print:text-black print:border-b print:border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-white print:text-black">INVOICE</h1>
                                <p className="text-slate-400 print:text-gray-600">#{invoice.invoiceNumber}</p>
                            </div>
                            <div className="text-right">
                                {businessProfile?.logo && (
                                    <div className="mb-4 flex justify-end">
                                        <img src={businessProfile.logo} alt="Business Logo" className="h-16 w-auto object-contain bg-white rounded-lg p-1" />
                                    </div>
                                )}
                                <div className="text-2xl font-bold text-blue-400 print:text-black">{businessProfile?.name || 'Red Panther Auto'}</div>
                                <p className="text-slate-400 text-sm mt-1 print:text-gray-600 whitespace-pre-line">
                                    {businessProfile?.address || '123 Mechanic Lane\nAuto City, AC 12345'}<br />
                                    {businessProfile?.phone || '(555) 123-4567'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-12 mb-12">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Bill To</h3>
                                <div className="text-gray-900 font-medium text-lg">{invoice.customer.name}</div>
                                <div className="text-gray-600 mt-1">
                                    {invoice.customer.address}<br />
                                    {invoice.customer.email}<br />
                                    {invoice.customer.phone}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Vehicle</h3>
                                    <div className="text-gray-900 font-medium">
                                        {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
                                    </div>
                                    <div className="text-gray-600 text-sm mt-1 font-mono">
                                        {invoice.vehicle.vin}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Dates</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-gray-500 text-sm">Issued:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{invoice.issuedAt}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-sm">Due:</span>
                                            <span className="ml-2 text-gray-900 font-medium">{invoice.dueDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <table className="w-full mb-12">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="text-center py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Qty</th>
                                    <th className="text-right py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Unit Price</th>
                                    <th className="text-right py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-4 text-gray-900 font-medium">{item.description}</td>
                                        <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                                        <td className="py-4 text-right text-gray-600">${item.unitPrice.toFixed(2)}</td>
                                        <td className="py-4 text-right text-gray-900 font-medium">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${invoice.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span>${invoice.tax.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-gray-200 my-4" />
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${invoice.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-8 text-center text-gray-500 text-sm border-t border-gray-100 print:bg-white print:border-t-2 print:border-gray-200">
                        <p>Thank you for your business!</p>
                        <p className="mt-2">Please make checks payable to {businessProfile?.name || 'Red Panther Auto'}.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
