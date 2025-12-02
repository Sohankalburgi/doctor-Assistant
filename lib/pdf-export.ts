import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function exportText(text: string, filename: string = "export.pdf") {
    const doc = new jsPDF();
    
    doc.setFontSize(12);

    // Split text into lines to handle long text
    const lines = doc.splitTextToSize(text, 190);
    doc.text(lines, 10, 10);

    doc.save(filename);
}

export async function exportTranslation(
    sourceText: string,
    translatedText: string,
    sourceLang: string,
    targetLang: string,
    filename: string = "translation.pdf"
) {
    // Create a temporary HTML element for rendering with Unicode support
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "-10000px";
    element.style.padding = "40px";
    element.style.fontFamily = "'Segoe UI', 'Arial Unicode MS', 'Noto Sans', sans-serif";
    element.style.backgroundColor = "#ffffff";
    element.style.width = "800px";
    element.style.color = "#000000";
    element.style.lineHeight = "1.6";

    element.innerHTML = `
        <div style="font-family: 'Segoe UI', 'Arial Unicode MS', 'Noto Sans', sans-serif; background: white; color: black;">
            <h1 style="font-size: 28px; margin-bottom: 30px; color: #000000; font-weight: bold;">Translation Report</h1>
            
            <div style="margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px;">
                <p style="margin: 8px 0; font-size: 14px; color: #000;"><strong>Source Language:</strong> ${sourceLang}</p>
                <p style="margin: 8px 0; font-size: 14px; color: #000;"><strong>Target Language:</strong> ${targetLang}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 18px; color: #333333; margin-bottom: 15px; font-weight: bold;">Source Text:</h2>
                <div style="white-space: pre-wrap; word-wrap: break-word; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2196F3; color: #000000; font-size: 14px; line-height: 1.8;">
                    ${escapeHtml(sourceText)}
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 18px; color: #333333; margin-bottom: 15px; font-weight: bold;">Translated Text:</h2>
                <div style="white-space: pre-wrap; word-wrap: break-word; background-color: #f0f8ff; padding: 15px; border-left: 4px solid #4CAF50; color: #000000; font-size: 14px; line-height: 1.8;">
                    ${escapeHtml(translatedText)}
                </div>
            </div>
            
            <div style="border-top: 2px solid #e0e0e0; padding-top: 15px; margin-top: 30px;">
                <p style="font-size: 12px; color: #999999; margin: 0;">
                    Generated: ${new Date().toLocaleString()}
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(element);

    try {
        // Suppress CSS parsing errors during html2canvas rendering
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.warn = (...args: Parameters<typeof console.warn>) => {
            // Silently ignore warnings about unsupported CSS functions
            const message = args[0]?.toString() || '';
            if (!message.includes('lab') && !message.includes('color function')) {
                originalWarn(...args);
            }
        };
        
        console.error = (...args: Parameters<typeof console.error>) => {
            // Silently ignore errors about unsupported CSS functions
            const message = args[0]?.toString() || '';
            if (!message.includes('lab') && !message.includes('color function')) {
                originalError(...args);
            }
        };

        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#ffffff",
            logging: false,
            useCORS: false,
            allowTaint: true,
            windowHeight: element.scrollHeight,
            windowWidth: element.scrollWidth,
            ignoreElements: (element) => {
                // Ignore style and link tags to avoid parsing problematic CSS
                if (element.tagName === 'STYLE' || element.tagName === 'LINK') {
                    return true;
                }
                return false;
            },
        });

        // Restore console functions
        console.warn = originalWarn;
        console.error = originalError;

        document.body.removeChild(element);

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const doc = new jsPDF("p", "mm", "a4");

        let heightLeft = imgHeight;
        let position = 0;

        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4 height in mm

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= 297;
        }

        doc.save(filename);
    } catch (error) {
        if (document.body.contains(element)) {
            document.body.removeChild(element);
        }
        console.error("Error generating PDF:", error);
        throw error;
    }
}

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
