import jsPDF from "jspdf";

interface QueryData {
  id: string;
  originalQuery: string;
  refinedQuery?: string | null;
  sources: string[];
  llms: string[];
  status: string;
  startedAt: Date;
  completedAt?: Date | null;
  responses: ResponseData[];
}

interface ResponseData {
  id: string;
  source: string;
  llm: string;
  content: string;
  relevanceScore?: number | null;
  citationCount?: number | null;
  createdAt: Date;
}

/**
 * Export query results to PDF
 */
export async function exportToPDF(query: QueryData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with auto-pagination
  const addText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }

    const lines = doc.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      if (yPosition + 10 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    }

    yPosition += 5;
  };

  // Add header
  addText("ACM Research Platform - Query Results", 18, true);
  addText(`Generated: ${new Date().toLocaleString()}`, 10);
  yPosition += 5;

  // Add query information
  addText("Query Details", 14, true);
  addText(`Original Query: ${query.originalQuery}`, 11);

  if (query.refinedQuery) {
    addText(`Refined Query: ${query.refinedQuery}`, 11);
  }

  addText(`Sources: ${query.sources.join(", ")}`, 11);
  addText(`LLMs: ${query.llms.join(", ")}`, 11);
  addText(`Status: ${query.status}`, 11);
  addText(
    `Submitted: ${new Date(query.startedAt).toLocaleString()}`,
    10
  );

  if (query.completedAt) {
    addText(
      `Completed: ${new Date(query.completedAt).toLocaleString()}`,
      10
    );
  }

  yPosition += 10;

  // Add responses
  addText(`Results (${query.responses.length})`, 14, true);
  yPosition += 5;

  query.responses.forEach((response, index) => {
    // Response header
    addText(`${index + 1}. ${response.source} - ${response.llm}`, 12, true);

    if (response.relevanceScore !== null && response.relevanceScore !== undefined) {
      addText(`Relevance Score: ${(response.relevanceScore * 100).toFixed(0)}%`, 10);
    }

    if (response.citationCount !== null && response.citationCount !== undefined) {
      addText(`Citations: ${response.citationCount}`, 10);
    }

    // Content
    addText(response.content, 10);
    yPosition += 10;
  });

  // Save the PDF
  const fileName = `query_results_${query.id}_${Date.now()}.pdf`;
  doc.save(fileName);

  return fileName;
}

/**
 * Export query results to CSV
 */
export function exportToCSV(query: QueryData) {
  const rows: string[][] = [];

  // Add headers
  rows.push([
    "Response ID",
    "Source",
    "LLM",
    "Content",
    "Relevance Score",
    "Citation Count",
    "Created At",
  ]);

  // Add data rows
  query.responses.forEach((response) => {
    rows.push([
      response.id,
      response.source,
      response.llm,
      `"${response.content.replace(/"/g, '""')}"`, // Escape quotes
      response.relevanceScore?.toString() || "",
      response.citationCount?.toString() || "",
      new Date(response.createdAt).toISOString(),
    ]);
  });

  // Convert to CSV string
  const csvContent = rows.map((row) => row.join(",")).join("\n");

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `query_results_${query.id}_${Date.now()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return `query_results_${query.id}_${Date.now()}.csv`;
}

/**
 * Export individual response to text file
 */
export function exportResponseToText(response: ResponseData) {
  const content = `
ACM Research Platform - Response Export
Generated: ${new Date().toLocaleString()}

Source: ${response.source}
LLM: ${response.llm}
Relevance Score: ${response.relevanceScore ? (response.relevanceScore * 100).toFixed(0) + "%" : "N/A"}
Citation Count: ${response.citationCount || "N/A"}
Created: ${new Date(response.createdAt).toLocaleString()}

Content:
${response.content}
`.trim();

  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `response_${response.id}_${Date.now()}.txt`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
