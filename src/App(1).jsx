import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function formatInvoiceNumber(num) {
  return `BWI-INV-UAE-${String(num).padStart(4, "0")}`;
}

const BANK_OPTIONS = [
  {
    label: "UAE - Prislogics Marketing (Wio Bank)",
    value: "uae-prislogics",
    details: `Account holder: PRISLOGICS MARKETING MANAGEMENT L.L.C S.O.C
Account number: 9307520214
IBAN: AE220860000009307520214
BIC: WIOBAEADXXX`,
  },
  {
    label: "UK - Book Writing Inn LTD (Lloyds)",
    value: "uk-lloyds",
    details: `Account Name: Book Writing Inn LTD
Account Number: 28662160
Sort Code: 30-54-66
IBAN: GB25LOYD30546628662160
BIC: LOYDGB21F95`,
  },
  {
    label: "USA - Book Writing Inn Ltd (Wise US)",
    value: "usa-wise",
    details: `Account Name: Book Writing Inn Ltd
Account Number: 213496653898
Account Type: Checking
Routing Number: 101019628
SWIFT/BIC: TRWIUS35XXX`,
  },
  {
    label: "UAE/International - Book Writing Inn Ltd (Wise GB)",
    value: "uae-wise-gb",
    details: `Account Name: Book Writing Inn Ltd
IBAN: GB49TRWI23080115134001
SWIFT/BIC: TRWIGB2LXXX`,
  },
  {
    label: "Point Brand Inc Limited (Wise UK)",
    value: "pointbrand",
    details: `Name: Point Brand Inc Limited
Account number: 23557501
Sort code: 60-84-64 (Use when sending from UK)
IBAN: GB96TRWI60846423557501
Swift/BIC: TRWIGB2LXXX`,
  },
  {
    label: "Oxford Book Publishing Limited",
    value: "Wise Payments Limited",
    details: `Name: Oxford Book Publishing Limited
Account number: 57057435
Sort code: 60-84-64 (For UK transfers)
IBAN: GB09 TRWI 6084 6457 0574 35
Swift/BIC: TRWIGB2LXXX`,
  },
  
  
];

const LETTERHEADS = [
  { value: "bwi-uae.png", label: "BWI UAE" },
  { value: "bwi-uk.png", label: "BWI UK" },
  { value: "expert.png", label: "Expert" },
  { value: "oxford.png", label: "Oxford" },
  { value: "pointbrand.png", label: "Point Brand" },
  { value: "slade.png", label: "Slade" },
];

export default function App() {
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("Unpaid");
  const [date, setDate] = useState("2025-12-06");
  const [dueDate, setDueDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([{ desc: "", amt: "" }]);
  const [invoiceCounter, setInvoiceCounter] = useState(2);
  const [selectedLetterhead, setSelectedLetterhead] = useState("slade.png");
  const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0].value);

  const LETTERHEAD_IMAGE = `/Letterhead/${selectedLetterhead}`;
  const invoiceRef = useRef(null);

  const currentBankDetails = BANK_OPTIONS.find(b => b.value === selectedBank)?.details || BANK_OPTIONS[0].details;

  const addItem = () => setItems([...items, { desc: "", amt: "" }]);
  const updateItem = (i, field, value) => {
    const newItems = [...items];
    newItems[i][field] = value;
    setItems(newItems);
  };
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const total = items.reduce((sum, item) => sum + (parseFloat(item.amt) || 0), 0);
  const invoiceNumber = formatInvoiceNumber(invoiceCounter);

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`${invoiceNumber}.pdf`);
    setInvoiceCounter(c => c + 1);
  };

  return (
    <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1800px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>

        {/* LEFT PANEL - SAME AS BEFORE */}
        <div style={{ flex: "1 1 520px", background: "white", padding: "35px", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
          <h2 style={{ marginTop: 0, color: "#2c3e50", fontSize: "28px" }}>Professional Invoice Generator</h2>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Choose Brand Letterhead</label>
            <select value={selectedLetterhead} onChange={e => setSelectedLetterhead(e.target.value)}
              style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "2px solid #3498db", fontSize: "16px" }}>
              {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Bank Details for Payment</label>
            <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}
              style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "2px solid #27ae60", fontSize: "16px" }}>
              {BANK_OPTIONS.map(bank => <option key={bank.value} value={bank.value}>{bank.label}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div><label>Invoice Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
            <div><label>Due Date (optional)</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
          </div>

          <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: "100%", padding: "14px", margin: "15px 0", borderRadius: "8px", border: "1px solid #ccc" }} />
          <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{ width: "100%", padding: "14px", marginBottom: "25px", borderRadius: "8px", border: "1px solid #ccc" }} />

          <textarea placeholder="Project Description (optional)" rows={4} value={description} onChange={e => setDescription(e.target.value)}
            style={{ width: "100%", padding: "14px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #ccc", resize: "vertical" }} />

          <strong style={{ display: "block", marginBottom: "12px", fontSize: "18px" }}>Line Items</strong>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "center" }}>
              <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} style={{ flex: 3, padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }} />
              <input type="number" placeholder="0.00" value={item.amt} onChange={e => updateItem(i, "amt", e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }} />
              <button onClick={() => removeItem(i)} style={{ background: "#e74c3c", color: "white", width: "42px", height: "42px", borderRadius: "8px", border: "none", fontSize: "20px" }}>×</button>
            </div>
          ))}

          <button onClick={addItem} style={{ background: "#3498db", color: "white", padding: "12px 28px", border: "none", borderRadius: "8px", margin: "20px 0" }}>+ Add Line Item</button>

          <div style={{ margin: "30px 0" }}>
            <label><strong>Currency:</strong></label>
            {["USD", "GBP", "EUR", "AED"].map(c => (
              <label key={c} style={{ marginLeft: "20px" }}>
                <input type="radio" checked={currency === c} onChange={() => setCurrency(c)} /> {c}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: "35px" }}>
            <label><strong>Status:</strong></label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: "10px", marginLeft: "12px", borderRadius: "6px" }}>
              <option>Unpaid</option>
              <option>Paid</option>
            </select>
          </div>

          <button onClick={downloadPDF} style={{
            width: "100%", background: "#27ae60", color: "white", padding: "20px", fontSize: "22px", fontWeight: "bold",
            border: "none", borderRadius: "12px", cursor: "pointer", boxShadow: "0 10px 30px rgba(39,174,96,0.4)"
          }}>
            Download PDF Invoice
          </button>
        </div>

        {/* RIGHT SIDE - PAYMENT DETAILS ALIGNED TO LEFT (LIKE FOOTER) */}
        <div ref={invoiceRef} style={{
          width: "210mm",
          height: "297mm",
          background: "white",
          position: "relative",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${LETTERHEAD_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 1,
          }} />

          <div style={{
            position: "relative",
            zIndex: 10,
            padding: "190px 38mm 100px 38mm",
            color: "#000",
          }}>
            <h1 style={{ textAlign: "center", fontSize: "46px", fontWeight: "bold", margin: "0 0 60px 0", letterSpacing: "2px" }}>
              INVOICE
            </h1>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px", fontSize: "16px", lineHeight: "1.9" }}>
              <div>
                <strong style={{ fontSize: "17px" }}>Bill To:</strong><br />
                {clientName || "Client Name"}<br />
                {clientEmail && <>{clientEmail}</>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div><strong>Invoice #:</strong> {invoiceNumber}</div>
                <div><strong>Date:</strong> {new Date(date).toLocaleDateString("en-GB")}</div>
                <div><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
              </div>
            </div>

            {description && (
              <div style={{
                background: "rgba(255,255,255,0.94)",
                padding: "18px 24px",
                borderRadius: "10px",
                marginBottom: "40px",
                fontSize: "15px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
              }}>
                <strong>Project Description:</strong><br />
                {description}
              </div>
            )}

            {/* TABLE WITH TOTAL INSIDE */}
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "30px 0 60px 0",
              background: "rgba(255,255,255,0.96)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
            }}>
              <thead>
                <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
                  <th style={{ padding: "18px 20px", textAlign: "left", fontSize: "16px", fontWeight: "600" }}>Description</th>
                  <th style={{ padding: "18px 20px", textAlign: "right", fontSize: "16px", fontWeight: "600" }}>Amount ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.desc || i.amt).map((item, i) => (
                  <tr key={i}>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #eee", fontSize: "15.5px" }}>{item.desc || "—"}</td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: "600" }}>
                      {parseFloat(item.amt || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}

                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td style={{
                    padding: "22px 20px",
                    fontSize: "19px",
                    fontWeight: "bold",
                    color: "#2c3e50",
                    borderTop: "3px double #999",
                  }}>
                    TOTAL
                  </td>
                  <td style={{
                    padding: "22px 20px",
                    fontSize: "21px",
                    fontWeight: "bold",
                    color: "#27ae60",
                    textAlign: "right",
                    borderTop: "3px double #999",
                  }}>
                    {total.toFixed(2)} {currency}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* PAYMENT DETAILS - NOW LEFT-ALIGNED LIKE FOOTER */}
            <div style={{
              padding: "28px 35px",
              fontSize: "12px",
              lineHeight: "2.1",
              width: "480px",// Fixed width to match footer alignment
              position: "absolute",
              right: "33%",
              top:"85%",
              margin: "-50ox 0 160px 0",     // Pushed up, safe from footer
              textAlign: "left",
            }}>
              <h3 style={{ margin: "0 0 18px 0", fontSize: "21px", color: "#2c3e50", fontWeight: "bold" }}>
                Payment Details
              </h3>
              <div style={{ whiteSpace: "pre-line", color: "#333", fontFamily: "Consolas, monospace" }}>
                {currentBankDetails}
              </div>
            </div>

          {/* PAID / UNPAID WATERMARK — NOW ALWAYS VISIBLE */}
{status === "Paid" ? (
  <div style={{
    position: "absolute",
    top: "75%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-35deg)",
    fontSize: "180px",
    fontWeight: "900",
    color: "rgba(40, 167, 69, 0.22)",
    pointerEvents: "none",
    zIndex: 5,
    letterSpacing: "8px",
    userSelect: "none",
  }}>
    PAID
  </div>
) : (
  <div style={{
    position: "absolute",
    top: "75%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-35deg)",
    fontSize: "180px",
    fontWeight: "900",
    color: "rgba(220, 53, 69, 0.22)",
    pointerEvents: "none",
    zIndex: 5,
    letterSpacing: "8px",
    userSelect: "none",
  }}>
    UNPAID
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}
