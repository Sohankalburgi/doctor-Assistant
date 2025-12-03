import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

export async function convertMarkdownToPrintableText(markdown: string) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkStringify, {
            bullet: "-",          // use hyphens for lists
            fences: true,         // keep ``` code blocks
            listItemIndent: "one", // indentation for nested lists
            rule: "-",            // horizontal rules style
        })
        .process(markdown);

    return String(file);
}



export const handleExportPDFRecords = async (record: any) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Patient Consultation Report", 14, 15);

    // Patient Details Section
    doc.setFontSize(12);
    doc.text(`Patient Name: ${record.patientName}`, 14, 30);
    doc.text(`Age: ${record.patientAge}`, 14, 37);
    doc.text(`Gender: ${record.patientGender}`, 14, 44);
    doc.text(`Consultation Date: ${formatDate(record.createdAt)}`, 14, 51);

    // Space before table
    doc.setFontSize(14);
    doc.text("Consultation Transcript", 14, 70);

    // Prepare chat table
    const rows = await Promise.all(
        record.chats.map(async (chat) => {
            const markdown = chat.text || chat.content || "";

            const formattedText = await convertMarkdownToPrintableText(markdown);

            return [
                chat.sender || chat.role || "N/A",
                formattedText,
                chat.timestamp
                    ? new Date(chat.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "",
            ];
        })
    );


    autoTable(doc, {
        startY: 75,
        head: [["Sender", "Message", "Time"]],
        body: rows.map((row) => {
            return [
                row[0],
                row[1].replace(/\n/g, "\n"),  // preserve line breaks
                row[2],
            ]
        }),
        styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: "linebreak",   // ❗ required for multiline text
        },
        columnStyles: {
            1: { cellWidth: 100 }, // message column wider
        },
        headStyles: {
            fillColor: [40, 40, 40],
            textColor: [255, 255, 255],
        },
        margin: { left: 14, right: 14 },

        // ❗ preserve whitespace, indentation, code blocks
        didParseCell: function (data) {
            if (data.section === "body" && data.column.index === 1) {
                data.cell.styles.fontSize = 9;

                // Make autotable respect indents and spacing
                data.cell.text = data.cell.text.flatMap((line) =>
                    line.split("\n")
                );
            }
        },
    });


    // Save PDF
    doc.save(`${record.patientName}-consultation.pdf`);
};
