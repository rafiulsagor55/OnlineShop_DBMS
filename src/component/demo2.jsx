import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import "./demo.css";

const Demo2 = () => {
  const contentRef = useRef();

  const exportPDF = () => {
    const content = contentRef.current;
    const contentWidth = content.offsetWidth;
    const pdfWidth = 595.28; // A4 width in points (210mm)
    const scale = (pdfWidth - 80) / contentWidth;
  
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      orientation: "portrait",
    });
  
    doc.html(content, {
      callback: function (doc) {
        const pageCount = doc.internal.getNumberOfPages();
        
        // Add page numbers to each page
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          
          // // Center the content vertically (your existing code)
          const pageHeight = doc.internal.pageSize.height;
          // const contentHeight = doc.internal.getCurrentPageInfo().pageContext.pageHeight;
          // const yOffset = (pageHeight - contentHeight) / 2;
          // if (yOffset > 0) {
          //   doc.internal.pageSize.y = yOffset;
          // }
          
          // Add page number at the bottom center
          const pageSize = doc.internal.pageSize;
          const pageWidth = pageSize.width;
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 20,
            { align: 'center' }
          );
        }
        
        doc.save("exported-document.pdf");
      },
      margin: [40, 0, 40, 0],
      autoPaging: "text",
      html2canvas: {
        scale: scale,
        useCORS: true,
        letterRendering: true,
        width: contentWidth,
      },
      width: pdfWidth,
      windowWidth: contentWidth,
      x: (pdfWidth - contentWidth * scale) / 2,
      y: 0,
    });
  };

  return (
    <div style={{ padding: "20px" ,overflow:"auto",}}>
      <h2>Export HTML to PDF (Selectable Text)</h2>
      <button onClick={exportPDF} style={{ marginBottom: "20px" }}>
        Download PDF
      </button>

      <div
        ref={contentRef}
        style={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          color: "#333",
          fontFamily: "Arial",
          width: "100%",
          maxWidth: "700px", // This will be the reference width
          boxSizing: "border-box",
          overflow:"auto",
        }}
      >
        <h1 style={{ color: "#4A90E2", fontSize: "24px", marginTop: 0 }}>
          Sample PDF Content
        </h1>
        <p style={{ fontSize: "12px", lineHeight: "1.5" }}>
          This is some text content that will be searchable, selectable, and
          copyable in the PDF.
        </p>
        <p
          style={{ marginTop: "20px", marginBottom: "10px", fontSize: "12px" }}
        >
          Here's an image:
        </p>
        <img
          src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Placeholder"
          style={{
            maxWidth: "100%",
            height: "auto",
            marginBottom: "30px",
          }}
        />
        <img
          src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Placeholder"
          style={{
            maxWidth: "100%",
            height: "auto",
            marginBottom: "30px",
          }}
        />
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "10px",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th>Name</th>
              <th>Age</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jane Doe</td>
              <td>28</td>
              <td>Engineer</td>
            </tr>
            <tr>
              <td>John Smith</td>
              <td>35</td>
              <td>Designer</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: "12px", lineHeight: "1.5" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
          exercitationem voluptates odit pariatur voluptatum minus aspernatur
          ipsum, distinctio quibusdam velit hic est esse at dolores corrupti,
          recusandae obcaecati unde omnis.Lorem ipsum dolor sit amet consectetur
          adipisicing elit.
        </p>
      </div>
    </div>
  );
};

export default Demo2;
