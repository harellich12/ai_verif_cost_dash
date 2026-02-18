import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

export function PrintReportBtn() {
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePrint = async () => {
        const element = document.getElementById('dashboard-container');
        if (!element) return;

        setIsGenerating(true);

        try {
            const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ]);

            // 1. Capture the DOM
            const canvas = await html2canvas(
                element,
                {
                    scale: 2, // High resolution
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#0f172a', // Ensure background matches dark theme
                } as unknown as Parameters<typeof html2canvas>[1]
            );

            // 2. Initialize PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // 3. Add paginated Dashboard Image
            const headerHeight = 20;
            const imageTop = 25;
            const bottomMargin = 10;
            const usableImageHeight = pdfHeight - imageTop - bottomMargin;

            const imgRatio = canvas.width / canvas.height;
            const imgHeight = pdfWidth / imgRatio;

            const drawHeader = (pageNumber: number) => {
                pdf.setFillColor(15, 23, 42);
                pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(14);
                pdf.text('Confidential - Verification ROI Model', 10, 12);

                pdf.setFontSize(10);
                pdf.setTextColor(148, 163, 184);
                pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth - 10, 12, { align: 'right' });
                pdf.text(`Page ${pageNumber}`, pdfWidth - 10, 17, { align: 'right' });
            };

            let renderedHeight = 0;
            let pageNumber = 1;
            while (renderedHeight < imgHeight) {
                if (pageNumber > 1) {
                    pdf.addPage();
                }
                drawHeader(pageNumber);
                pdf.addImage(imgData, 'PNG', 0, imageTop - renderedHeight, pdfWidth, imgHeight);
                renderedHeight += usableImageHeight;
                pageNumber += 1;
            }

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
