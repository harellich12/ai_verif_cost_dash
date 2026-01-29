import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function PrintReportBtn() {
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePrint = async () => {
        const element = document.getElementById('dashboard-container');
        if (!element) return;

        setIsGenerating(true);

        try {
            // 1. Capture the DOM
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const canvas = await (html2canvas as any)(element, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#0f172a', // Ensure background matches dark theme
            });

            // 2. Initialize PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();

            // 3. Add Header
            pdf.setFillColor(15, 23, 42); // Dark background
            pdf.rect(0, 0, pdfWidth, 20, 'F'); // Header bar

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            pdf.text('Confidential - Verification ROI Model', 10, 12);

            pdf.setFontSize(10);
            pdf.setTextColor(148, 163, 184); // Slate-400
            pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth - 10, 12, { align: 'right' });

            // 4. Add Dashboard Image
            const imgRatio = canvas.width / canvas.height;
            const imgHeight = pdfWidth / imgRatio;

            // Place image below header (y=25)
            pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, imgHeight);

            // 5. Save
            pdf.save('Verification_Strategy_Brief.pdf');

        } catch (error) {
            console.error('Failed to generate PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-3 py-2 
                     bg-slate-700/50 hover:bg-slate-700 
                     text-slate-300 hover:text-white
                     text-sm font-medium rounded-lg 
                     border border-slate-600/50
                     transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export Summary to PDF"
        >
            {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <FileText size={16} />
            )}
            <span>{isGenerating ? 'Generating...' : 'Export PDF'}</span>
        </button>
    );
}
