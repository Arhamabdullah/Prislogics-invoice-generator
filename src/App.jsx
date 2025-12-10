// import React, { useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// // Function to write test invoice
// const testFirestoreWrite = async () => {
//   try {
//     const docRef = await addDoc(collection(db, "invoices"), {
//       clientName: "Test Client",
//       invoiceNumber: "TEST-0001",
//       brand: "slade.png",
//       createdAt: new Date(),
//     });
//     console.log("Document written with ID:", docRef.id);
//     alert("Firestore write successful! Check your Firebase console.");
//   } catch (error) {
//     console.error("Error adding document:", error);
//     alert("Firestore write failed. Check console for details.");
//   }
// };

// function formatInvoiceNumber(num) {
//   return `BWI-INV-UAE-${String(num).padStart(4, "0")}`;
// }

// const BANK_OPTIONS = [
//   { label: "UAE - Prislogics Marketing (Wio Bank)", value: "uae-prislogics", details: `Account holder: PRISLOGICS MARKETING MANAGEMENT L.L.C S.O.C\nAccount number: 9307520214\nIBAN: AE220860000009307520214\nBIC: WIOBAEADXXX` },
//   { label: "UK - Book Writing Inn LTD (Lloyds)", value: "uk-lloyds", details: `Account Name: Book Writing Inn LTD\nAccount Number: 28662160\nSort Code: 30-54-66\nIBAN: GB25LOYD30546628662160\nBIC: LOYDGB21F95` },
//   { label: "USA - Book Writing Inn Ltd (Wise US)", value: "usa-wise", details: `Account Name: Book Writing Inn Ltd\nAccount Number: 213496653898\nAccount Type: Checking\nRouting Number: 101019628\nSWIFT/BIC: TRWIUS35XXX` },
//   { label: "UAE/International - Book Writing Inn Ltd (Wise GB)", value: "uae-wise-gb", details: `Account Name: Book Writing Inn Ltd\nIBAN: GB49TRWI23080115134001\nSWIFT/BIC: TRWIGB2LXXX` },
//   { label: "Point Brand Inc Limited (Wise UK)", value: "pointbrand", details: `Name: Point Brand Inc Limited\nAccount number: 23557501\nSort code: 60-84-64 (Use when sending from UK)\nIBAN: GB96TRWI60846423557501\nSwift/BIC: TRWIGB2LXXX` },
// ];

// const LETTERHEADS = [
//   { value: "bwi-uae.png", label: "BWI UAE" },
//   { value: "bwi-uk.png", label: "BWI UK" },
//   { value: "expert.png", label: "Expert" },
//   { value: "oxford.png", label: "Oxford" },
//   { value: "pointbrand.png", label: "Point Brand" },
//   { value: "slade.png", label: "Slade" },
// ];

// export default function App() {
//   const [currency, setCurrency] = useState("USD");
//   const [status, setStatus] = useState("Unpaid");
//   const [date, setDate] = useState("2025-12-06");
//   const [dueDate, setDueDate] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [description, setDescription] = useState("");
//   const [items, setItems] = useState([{ desc: "", amt: "" }]);
//   const [invoiceCounter, setInvoiceCounter] = useState(2);
//   const [selectedLetterhead, setSelectedLetterhead] = useState("slade.png");
//   const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0].value);

//   // Step 2: State for fetching and displaying all invoices
//   const [allInvoices, setAllInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBrand, setSortBrand] = useState("");

//   const LETTERHEAD_IMAGE = `/Letterhead/${selectedLetterhead}`;
//   const invoiceRef = useRef(null);
//   const currentBankDetails = BANK_OPTIONS.find(b => b.value === selectedBank)?.details || BANK_OPTIONS[0].details;

//   const addItem = () => setItems([...items, { desc: "", amt: "" }]);
//   const updateItem = (i, field, value) => {
//     const newItems = [...items];
//     newItems[i][field] = value;
//     setItems(newItems);
//   };
//   const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

//   const total = items.reduce((sum, item) => sum + (parseFloat(item.amt) || 0), 0);
//   const invoiceNumber = formatInvoiceNumber(invoiceCounter);

//   // Step 2: Fetch invoices from Firestore
//   const fetchInvoices = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const invoices = querySnapshot.docs.map(doc => doc.data());
//       setAllInvoices(invoices);
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//       alert("Failed to fetch invoices.");
//     }
//   };

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoiceNumber}.pdf`);

//     // Save invoice to Firestore
//     try {
//       const docId = `${clientName.replace(/\s+/g, "")}-${invoiceNumber}`;
//       await setDoc(doc(db, "invoices", docId), {
//         clientName,
//         clientEmail,
//         invoiceNumber,
//         items,
//         total,
//         brand: selectedLetterhead,
//         date,
//         dueDate,
//         currency,
//         status,
//         bankDetails: currentBankDetails,
//         createdAt: new Date(),
//       });
//       alert("Invoice saved to Firestore!");
//     } catch (error) {
//       console.error("Error saving invoice:", error);
//       alert("Failed to save invoice to Firestore.");
//     }

//     setInvoiceCounter(c => c + 1);
//   };

//   return (
//     <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
//       <div style={{ maxWidth: "1800px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>

//         {/* LEFT PANEL */}
//         <div style={{ flex: "1 1 520px", background: "white", padding: "35px", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
//           <h2 style={{ marginTop: 0, color: "#2c3e50", fontSize: "28px" }}>Professional Invoice Generator</h2>

//           {/* Letterhead */}
//           <div style={{ marginBottom: "25px" }}>
//             <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Choose Brand Letterhead</label>
//             <select value={selectedLetterhead} onChange={e => setSelectedLetterhead(e.target.value)}
//               style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "2px solid #3498db", fontSize: "16px" }}>
//               {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//             </select>
//           </div>

//           {/* Bank */}
//           <div style={{ marginBottom: "25px" }}>
//             <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Bank Details for Payment</label>
//             <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}
//               style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "2px solid #27ae60", fontSize: "16px" }}>
//               {BANK_OPTIONS.map(bank => <option key={bank.value} value={bank.value}>{bank.label}</option>)}
//             </select>
//           </div>

//           {/* Date */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
//             <div><label>Invoice Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
//             <div><label>Due Date (optional)</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} /></div>
//           </div>

//           {/* Client info */}
//           <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: "100%", padding: "14px", margin: "15px 0", borderRadius: "8px", border: "1px solid #ccc" }} />
//           <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{ width: "100%", padding: "14px", marginBottom: "25px", borderRadius: "8px", border: "1px solid #ccc" }} />

//           {/* Description */}
//           <textarea placeholder="Project Description (optional)" rows={4} value={description} onChange={e => setDescription(e.target.value)}
//             style={{ width: "100%", padding: "14px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #ccc", resize: "vertical" }} />

//           {/* Line Items */}
//           <strong style={{ display: "block", marginBottom: "12px", fontSize: "18px" }}>Line Items</strong>
//           {items.map((item, i) => (
//             <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "center" }}>
//               <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} style={{ flex: 3, padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <input type="number" placeholder="0.00" value={item.amt} onChange={e => updateItem(i, "amt", e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <button onClick={() => removeItem(i)} style={{ background: "#e74c3c", color: "white", width: "42px", height: "42px", borderRadius: "8px", border: "none", fontSize: "20px" }}>×</button>
//             </div>
//           ))}
//           <button onClick={addItem} style={{ background: "#3498db", color: "white", padding: "12px 28px", border: "none", borderRadius: "8px", margin: "20px 0" }}>+ Add Line Item</button>

//           {/* Currency */}
//           <div style={{ margin: "30px 0" }}>
//             <label><strong>Currency:</strong></label>
//             {["USD", "GBP", "EUR", "AED"].map(c => (
//               <label key={c} style={{ marginLeft: "20px" }}>
//                 <input type="radio" checked={currency === c} onChange={() => setCurrency(c)} /> {c}
//               </label>
//             ))}
//           </div>

//           {/* Status */}
//           <div style={{ marginBottom: "35px" }}>
//             <label><strong>Status:</strong></label>
//             <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: "10px", marginLeft: "12px", borderRadius: "6px" }}>
//               <option>Unpaid</option>
//               <option>Paid</option>
//             </select>
//           </div>

//           {/* Buttons */}
//           <button onClick={downloadPDF} style={{ width: "100%", background: "#27ae60", color: "white", padding: "20px", fontSize: "22px", fontWeight: "bold", border: "none", borderRadius: "12px", cursor: "pointer", boxShadow: "0 10px 30px rgba(39,174,96,0.4)" }}>Download PDF Invoice</button>
//           <button onClick={testFirestoreWrite} style={{ width: "100%", background: "#f39c12", color: "white", padding: "16px", fontSize: "18px", marginTop: "15px", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}>Test Firestore Write</button>
//           <button onClick={fetchInvoices} style={{ width: "100%", background: "#8e44ad", color: "white", padding: "16px", fontSize: "18px", marginTop: "15px", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}>Show All Invoices</button>

//           {/* All Invoices Table */}
//           {allInvoices.length > 0 && (
//             <div style={{ marginTop: "30px", maxHeight: "400px", overflowY: "auto" }}>
//               <input placeholder="Search by client name" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc" }} />
//               <select value={sortBrand} onChange={e => setSortBrand(e.target.value)} style={{ marginBottom: "12px", padding: "10px", borderRadius: "6px" }}>
//                 <option value="">All Brands</option>
//                 {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//               </select>

//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     <th style={{ border: "1px solid #ccc", padding: "8px" }}>Client Name</th>
//                     <th style={{ border: "1px solid #ccc", padding: "8px" }}>Invoice #</th>
//                     <th style={{ border: "1px solid #ccc", padding: "8px" }}>Brand</th>
//                     <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
//                     <th style={{ border: "1px solid #ccc", padding: "8px" }}>Currency</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allInvoices
//                     .filter(inv => inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
//                     .filter(inv => sortBrand === "" || inv.brand === sortBrand)
//                     .map((inv, idx) => (
//                       <tr key={idx}>
//                         <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inv.clientName}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inv.invoiceNumber}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inv.brand}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inv.total}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inv.currency}</td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//         </div>

//         {/* RIGHT PANEL (PDF invoice preview) */}
//         <div ref={invoiceRef} style={{ width: "210mm", height: "297mm", background: "white", position: "relative", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
//           {/* Letterhead background */}
//           <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${LETTERHEAD_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", zIndex: 1 }} />

//           {/* Invoice content */}
//           <div style={{ position: "relative", zIndex: 10, padding: "190px 38mm 100px 38mm", color: "#000" }}>
//             <h1 style={{ textAlign: "center", fontSize: "46px", fontWeight: "bold", margin: "0 0 60px 0", letterSpacing: "2px" }}>INVOICE</h1>
//             {/* ...rest of invoice content remains unchanged... */}
//             {/* TOTAL, Payment Details, Watermark */}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }








// import React, { useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// // Helper function to format invoice numbers
// function formatInvoiceNumber(num) {
//   return `BWI-INV-UAE-${String(num).padStart(4, "0")}`;
// }

// // Bank options
// const BANK_OPTIONS = [
//   { label: "UAE - Prislogics Marketing (Wio Bank)", value: "uae-prislogics", details: `Account holder: PRISLOGICS MARKETING MANAGEMENT L.L.C S.O.C\nAccount number: 9307520214\nIBAN: AE220860000009307520214\nBIC: WIOBAEADXXX` },
//   { label: "UK - Book Writing Inn LTD (Lloyds)", value: "uk-lloyds", details: `Account Name: Book Writing Inn LTD\nAccount Number: 28662160\nSort Code: 30-54-66\nIBAN: GB25LOYD30546628662160\nBIC: LOYDGB21F95` },
//   { label: "USA - Book Writing Inn Ltd (Wise US)", value: "usa-wise", details: `Account Name: Book Writing Inn Ltd\nAccount Number: 213496653898\nAccount Type: Checking\nRouting Number: 101019628\nSWIFT/BIC: TRWIUS35XXX` },
//   { label: "UAE/International - Book Writing Inn Ltd (Wise GB)", value: "uae-wise-gb", details: `Account Name: Book Writing Inn Ltd\nIBAN: GB49TRWI23080115134001\nSWIFT/BIC: TRWIGB2LXXX` },
//   { label: "Point Brand Inc Limited (Wise UK)", value: "pointbrand", details: `Name: Point Brand Inc Limited\nAccount number: 23557501\nSort code: 60-84-64 (Use when sending from UK)\nIBAN: GB96TRWI60846423557501\nSwift/BIC: TRWIGB2LXXX` },
// ];

// // Letterhead options
// const LETTERHEADS = [
//   { value: "bwi-uae.png", label: "BWI UAE" },
//   { value: "bwi-uk.png", label: "BWI UK" },
//   { value: "expert.png", label: "Expert" },
//   { value: "oxford.png", label: "Oxford" },
//   { value: "pointbrand.png", label: "Point Brand" },
//   { value: "slade.png", label: "Slade" },
// ];

// export default function App() {
//   // States
//   const [currency, setCurrency] = useState("USD");
//   const [status, setStatus] = useState("Unpaid");
//   const [date, setDate] = useState("2025-12-06");
//   const [dueDate, setDueDate] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [description, setDescription] = useState("");
//   const [items, setItems] = useState([{ desc: "", amt: "" }]);
//   const [invoiceCounter, setInvoiceCounter] = useState(2);
//   const [selectedLetterhead, setSelectedLetterhead] = useState("slade.png");
//   const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0].value);

//   // Fetch & display invoices
//   const [allInvoices, setAllInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBrand, setSortBrand] = useState("");

//   const invoiceRef = useRef(null);
//   const LETTERHEAD_IMAGE = `/Letterhead/${selectedLetterhead}`;
//   const currentBankDetails = BANK_OPTIONS.find(b => b.value === selectedBank)?.details || BANK_OPTIONS[0].details;

//   const total = items.reduce((sum, item) => sum + (parseFloat(item.amt) || 0), 0);
//   const invoiceNumber = formatInvoiceNumber(invoiceCounter);

//   // Form item handlers
//   const addItem = () => setItems([...items, { desc: "", amt: "" }]);
//   const updateItem = (i, field, value) => {
//     const newItems = [...items];
//     newItems[i][field] = value;
//     setItems(newItems);
//   };
//   const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

//   // Firestore functions
//   const testFirestoreWrite = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "invoices"), {
//         clientName: "Test Client",
//         invoiceNumber: "TEST-0001",
//         brand: "slade.png",
//         createdAt: new Date(),
//       });
//       alert("Firestore write successful!");
//     } catch (error) {
//       console.error(error);
//       alert("Firestore write failed.");
//     }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAllInvoices(invoices);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to fetch invoices.");
//     }
//   };

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoiceNumber}.pdf`);

//     // Save invoice to Firestore
//     try {
//       const docId = `${clientName.replace(/\s+/g, "")}-${invoiceNumber}`;
//       await setDoc(doc(db, "invoices", docId), {
//         clientName,
//         clientEmail,
//         invoiceNumber,
//         items,
//         total,
//         brand: selectedLetterhead,
//         date,
//         dueDate,
//         currency,
//         status,
//         bankDetails: currentBankDetails,
//         createdAt: new Date(),
//         description,
//       });
//       alert("Invoice saved to Firestore!");
//       setInvoiceCounter(c => c + 1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to save invoice to Firestore.");
//     }
//   };

//   // Download old invoice from data
//   const downloadOldInvoice = async (invoice) => {
//     const element = document.createElement("div");
//     element.style.width = "210mm";
//     element.style.height = "297mm";
//     element.style.background = "white";
//     element.style.position = "relative";
//     element.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
//     element.style.padding = "190px 38mm 100px 38mm";

//     // Letterhead
//     element.innerHTML = `
//       <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:url(/Letterhead/${invoice.brand});background-size:cover;z-index:1"></div>
//       <div style="position:relative;z-index:10">
//         <h1 style="text-align:center;font-size:46px;font-weight:bold;margin-bottom:60px">INVOICE</h1>
//         <div style="display:flex;justify-content:space-between;margin-bottom:50px">
//           <div>
//             <strong>Bill To:</strong><br/>
//             ${invoice.clientName}<br/>
//             ${invoice.clientEmail}
//           </div>
//           <div style="text-align:right">
//             <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
//             <div><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString("en-GB")}</div>
//             <div><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//           </div>
//         </div>
//         ${invoice.description ? `<div style="background:rgba(255,255,255,0.95);padding:15px;border-radius:10px;margin-bottom:30px"><strong>Project Description:</strong><br/>${invoice.description}</div>` : ""}
//         <table style="width:100%;border-collapse:collapse;margin-bottom:40px">
//           <thead>
//             <tr style="background:#2c3e50;color:#fff">
//               <th style="padding:10px;text-align:left">Description</th>
//               <th style="padding:10px;text-align:right">Amount (${invoice.currency})</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${invoice.items.map(i => `<tr><td style="padding:10px;border-bottom:1px solid #eee">${i.desc || "-"}</td><td style="padding:10px;text-align:right">${parseFloat(i.amt || 0).toFixed(2)}</td></tr>`).join("")}
//             <tr style="font-weight:bold;border-top:2px double #000"><td style="padding:12px">TOTAL</td><td style="padding:12px;text-align:right">${invoice.total.toFixed(2)}</td></tr>
//           </tbody>
//         </table>
//         <div style="font-size:12px;white-space:pre-line"><strong>Payment Details:</strong><br/>${invoice.bankDetails}</div>
//         <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:120px;font-weight:900;color:${invoice.status==="Paid"?"rgba(40,167,69,0.2)":"rgba(220,53,69,0.2)"};pointer-events:none;text-align:center;z-index:5">${invoice.status.toUpperCase()}</div>
//       </div>
//     `;

//     document.body.appendChild(element);
//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoice.invoiceNumber}.pdf`);
//     document.body.removeChild(element);
//   };

//   return (
//     <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
//       <div style={{ maxWidth: "1800px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>

//         {/* LEFT PANEL */}
//         <div style={{ flex: "1 1 520px", background: "white", padding: "35px", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
//           <h2 style={{ marginTop: 0, fontSize: "28px" }}>Professional Invoice Generator</h2>

//           {/* Letterhead */}
//           <label>Choose Brand Letterhead</label>
//           <select value={selectedLetterhead} onChange={e => setSelectedLetterhead(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//           </select>

//           {/* Bank */}
//           <label>Bank Details for Payment</label>
//           <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {BANK_OPTIONS.map(bank => <option key={bank.value} value={bank.value}>{bank.label}</option>)}
//           </select>

//           {/* Dates */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
//             <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1 }} />
//             <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ flex: 1 }} placeholder="Due Date" />
//           </div>

//           {/* Client Info */}
//           <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />
//           <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />

//           {/* Description */}
//           <textarea placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }} rows={3} />

//           {/* Line Items */}
//           <strong>Line Items</strong>
//           {items.map((item, i) => (
//             <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//               <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} style={{ flex: 3 }} />
//               <input placeholder="Amount" type="number" value={item.amt} onChange={e => updateItem(i, "amt", e.target.value)} style={{ flex: 1 }} />
//               <button onClick={() => removeItem(i)}>×</button>
//             </div>
//           ))}
//           <button onClick={addItem}>+ Add Line Item</button>

//           {/* Currency & Status */}
//           <div style={{ margin: "15px 0" }}>
//             <label>Currency:</label>
//             {["USD", "GBP", "EUR", "AED"].map(c => (
//               <label key={c} style={{ marginLeft: "10px" }}>
//                 <input type="radio" checked={currency === c} onChange={() => setCurrency(c)} /> {c}
//               </label>
//             ))}
//           </div>
//           <div style={{ marginBottom: "15px" }}>
//             <label>Status:</label>
//             <select value={status} onChange={e => setStatus(e.target.value)}>
//               <option>Unpaid</option>
//               <option>Paid</option>
//             </select>
//           </div>

//           {/* Buttons */}
//           <button onClick={downloadPDF} style={{ width: "100%", padding: "12px", background: "#27ae60", color: "white", marginBottom: "10px" }}>Download PDF & Save</button>
//           <button onClick={testFirestoreWrite} style={{ width: "100%", padding: "12px", background: "#f39c12", color: "white", marginBottom: "10px" }}>Test Firestore Write</button>
//           <button onClick={fetchInvoices} style={{ width: "100%", padding: "12px", background: "#8e44ad", color: "white" }}>Show All Invoices</button>

//           {/* All Invoices Table */}
//           {allInvoices.length > 0 && (
//             <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "15px" }}>
//               <input placeholder="Search by Client" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }} />
//               <select value={sortBrand} onChange={e => setSortBrand(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }}>
//                 <option value="">All Brands</option>
//                 {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//               </select>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     <th style={{ border: "1px solid #ccc", padding: "6px" }}>Client</th>
//                     <th style={{ border: "1px solid #ccc", padding: "6px" }}>Invoice #</th>
//                     <th style={{ border: "1px solid #ccc", padding: "6px" }}>Brand</th>
//                     <th style={{ border: "1px solid #ccc", padding: "6px" }}>Total</th>
//                     <th style={{ border: "1px solid #ccc", padding: "6px" }}>Currency</th>
//                     <th style={{ border: "1px solid #ccc", padding: "6px" }}>Download</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allInvoices
//                     .filter(inv => inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
//                     .filter(inv => sortBrand === "" || inv.brand === sortBrand)
//                     .map((inv, idx) => (
//                       <tr key={idx}>
//                         <td style={{ border: "1px solid #ccc", padding: "6px" }}>{inv.clientName}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "6px" }}>{inv.invoiceNumber}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "6px" }}>{inv.brand}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "6px" }}>{inv.total}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "6px" }}>{inv.currency}</td>
//                         <td style={{ border: "1px solid #ccc", padding: "6px" }}>
//                           <button onClick={() => downloadOldInvoice(inv)} style={{ padding: "6px 10px", background: "#3498db", color: "white", border: "none", borderRadius: "4px" }}>Download</button>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* RIGHT PANEL - Live Invoice Preview */}
//         <div ref={invoiceRef} style={{ width: "210mm", height: "297mm", background: "white", position: "relative", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
//           {/* Letterhead */}
//           <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${LETTERHEAD_IMAGE})`, backgroundSize: "cover", zIndex: 1 }} />

//           {/* Content */}
//           <div style={{ position: "relative", zIndex: 10, padding: "190px 38mm 100px 38mm" }}>
//             <h1 style={{ textAlign: "center", fontSize: "46px", fontWeight: "bold", marginBottom: "60px" }}>INVOICE</h1>

//             {/* Bill To */}
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
//               <div>
//                 <strong>Bill To:</strong><br/>
//                 {clientName || "Client Name"}<br/>
//                 {clientEmail || "Email"}
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div><strong>Invoice #:</strong> {invoiceNumber}</div>
//                 <div><strong>Date:</strong> {new Date(date).toLocaleDateString("en-GB")}</div>
//                 <div><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//               </div>
//             </div>

//             {/* Description */}
//             {description && (
//               <div style={{ background: "rgba(255,255,255,0.95)", padding: "15px", borderRadius: "10px", marginBottom: "30px" }}>
//                 <strong>Project Description:</strong><br/>
//                 {description}
//               </div>
//             )}

//             {/* Line Items Table */}
//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
//               <thead>
//                 <tr style={{ background: "#2c3e50", color: "#fff" }}>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
//                   <th style={{ padding: "10px", textAlign: "right" }}>Amount ({currency})</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.filter(i => i.desc || i.amt).map((item, idx) => (
//                   <tr key={idx}>
//                     <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.desc || "-"}</td>
//                     <td style={{ padding: "10px", textAlign: "right" }}>{parseFloat(item.amt || 0).toFixed(2)}</td>
//                   </tr>
//                 ))}
//                 <tr style={{ fontWeight: "bold", borderTop: "2px double #000" }}>
//                   <td style={{ padding: "12px" }}>TOTAL</td>
//                   <td style={{ padding: "12px", textAlign: "right" }}>{total.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Payment Details */}
//             <div style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
//               <strong>Payment Details:</strong><br/>
//               {currentBankDetails}
//             </div>

//             {/* Watermark */}
//             <div style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%) rotate(-35deg)",
//               fontSize: "120px",
//               fontWeight: "900",
//               color: status === "Paid" ? "rgba(40,167,69,0.2)" : "rgba(220,53,69,0.2)",
//               pointerEvents: "none",
//               zIndex: 5,
//               textAlign: "center",
//             }}>
//               {status.toUpperCase()}
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



// import React, { useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// // Helper function to format invoice numbers
// function formatInvoiceNumber(num) {
//   return `BWI-INV-UAE-${String(num).padStart(4, "0")}`;
// }

// // Team members for "Generated By"
// const GENERATED_BY_OPTIONS = [
//   "Syed Ali Abbas",
//   "Anas Arif",
//   "Arhum Naveed",
//   "Yahya Sohail",
//   "Atyab Kazmi",
//   "Raniya Lateef",
//   "Ahmer Altaf",
//   "Faran Shahid",
//   "Fahad Abbasi",
//   "Wasay Ali",
//   "Ayesha Khan",
//   "Laraib Javaid",
//   "Waqas Awan",
//   "Basit Qureshi",
//   "Syed Arham Abdullah"
// ];

// // Predefined Bank Options + Custom Option
// const BANK_OPTIONS = [
//   { label: "UAE - Prislogics Marketing (Wio Bank)", value: "uae-prislogics", details: `Account holder: PRISLOGICS MARKETING MANAGEMENT L.L.C S.O.C\nAccount number: 9307520214\nIBAN: AE220860000009307520214\nBIC: WIOBAEADXXX` },
//   { label: "UK - Book Writing Inn LTD (Lloyds)", value: "uk-lloyds", details: `Account Name: Book Writing Inn LTD\nAccount Number: 28662160\nSort Code: 30-54-66\nIBAN: GB25LOYD30546628662160\nBIC: LOYDGB21F95` },
//   { label: "USA - Book Writing Inn Ltd (Wise US)", value: "usa-wise", details: `Account Name: Book Writing Inn Ltd\nAccount Number: 213496653898\nAccount Type: Checking\nRouting Number: _LOOK_UP_\nSWIFT/BIC: TRWIUS35XXX` },
//   { label: "UAE/International - Book Writing Inn Ltd (Wise GB)", value: "uae-wise-gb", details: `Account Name: Book Writing Inn Ltd\nIBAN: GB49TRWI23080115134001\nSWIFT/BIC: TRWIGB2LXXX` },
//   { label: "Point Brand Inc Limited (Wise UK)", value: "pointbrand", details: `Name: Point Brand Inc Limited\nAccount number: 23557501\nSort code: 60-84-64 (Use when sending from UK)\nIBAN: GB96TRWI60846423557501\nSwift/BIC: TRWIGB2BXXX` },
//   { label: "Add Custom Bank", value: "custom", details: "" },
// ];

// // Letterhead options
// const LETTERHEADS = [
//   { value: "bwi-uae.png", label: "BWI UAE" },
//   { value: "bwi-uk.png", label: "BWI UK" },
//   { value: "expert.png", label: "Expert" },
//   { value: "oxford.png", label: "Oxford" },
//   { value: "pointbrand.png", label: "Point Brand" },
//   { value: "slade.png", label: "Slade" },
// ];

// export default function App() {
//   // States
//   const [currency, setCurrency] = useState("USD");
//   const [status, setStatus] = useState("Unpaid");
//   const [date, setDate] = useState("2025-12-06");
//   const [dueDate, setDueDate] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [description, setDescription] = useState("");
//   const [items, setItems] = useState([{ desc: "", amt: "" }]);
//   const [invoiceCounter, setInvoiceCounter] = useState(2);
//   const [selectedLetterhead, setSelectedLetterhead] = useState("slade.png");
//   const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0].value);

//   // NEW: Generated By
//   const [generatedBy, setGeneratedBy] = useState(GENERATED_BY_OPTIONS[0]);

//   // Custom Bank State
//   const [customBank, setCustomBank] = useState({
//     holder: "",
//     accountNumber: "",
//     bankName: "",
//     iban: "",
//     swift: "",
//   });

//   // Firestore & List States
//   const [allInvoices, setAllInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBrand, setSortBrand] = useState("");

//   const invoiceRef = useRef(null);
//   const LETTERHEAD_IMAGE = `/Letterhead/${selectedLetterhead}`;

//   // Determine current bank details
//   const currentBankDetails =
//     selectedBank === "custom"
//       ? `Account holder: ${customBank.holder || "N/A"}\nAccount number: ${customBank.accountNumber || "N/A"}\nBank name: ${customBank.bankName || "N/A"}\nIBAN: ${customBank.iban || "N/A"}\nSWIFT/BIC: ${customBank.swift || "N/A"}`.trim()
//       : BANK_OPTIONS.find(b => b.value === selectedBank)?.details || BANK_OPTIONS[0].details;

//   const total = items.reduce((sum, item) => sum + (parseFloat(item.amt) || 0), 0);
//   const invoiceNumber = formatInvoiceNumber(invoiceCounter);

//   // Line Item Handlers
//   const addItem = () => setItems([...items, { desc: "", amt: "" }]);
//   const updateItem = (i, field, value) => {
//     const newItems = [...items];
//     newItems[i][field] = value;
//     setItems(newItems);
//   };
//   const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

//   // Firestore Functions
//   const testFirestoreWrite = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "invoices"), {
//         clientName: "Test Client",
//         invoiceNumber: "TEST-0001",
//         brand: "slade.png",
//         createdAt: new Date(),
//         generatedBy: "Test User"
//       });
//       alert("Firestore write successful!");
//     } catch (error) {
//       console.error(error);
//       alert("Firestore write failed.");
//     }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAllInvoices(invoices);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to fetch invoices.");
//     }
//   };

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoiceNumber}.pdf`);

//     // Save to Firestore (now includes generatedBy)
//     try {
//       const docId = `${clientName.replace(/\s+/g, "")}-${invoiceNumber}`;
//       await setDoc(doc(db, "invoices", docId), {
//         clientName,
//         clientEmail,
//         invoiceNumber,
//         items,
//         total,
//         brand: selectedLetterhead,
//         date,
//         dueDate,
//         currency,
//         status,
//         bankDetails: currentBankDetails,
//         isCustomBank: selectedBank === "custom",
//         customBankDetails: selectedBank === "custom" ? customBank : null,
//         createdAt: new Date(),
//         description,
//         generatedBy, // ← Saved here
//       });
//       alert("Invoice saved to Firestore!");
//       setInvoiceCounter(c => c + 1);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to save invoice to Firestore.");
//     }
//   };

//   const downloadOldInvoice = async (invoice) => {
//     const element = document.createElement("div");
//     element.style.width = "210mm";
//     element.style.height = "297mm";
//     element.style.background = "white";
//     element.style.position = "relative";
//     element.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
//     element.style.padding = "190px 38mm 100px 38mm";

//     element.innerHTML = `
//       <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:url(/Letterhead/${invoice.brand});background-size:cover;z-index:1"></div>
//       <div style="position:relative;z-index:10">
//         <h1 style="text-align:center;font-size:46px;font-weight:bold;margin-bottom:60px">INVOICE</h1>
//         <div style="display:flex;justify-content:space-between;margin-bottom:50px">
//           <div>
//             <strong>Bill To:</strong><br/>
//             ${invoice.clientName}<br/>
//             ${invoice.clientEmail || ""}
//           </div>
//           <div style="text-align:right">
//             <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
//             <div><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString("en-GB")}</div>
//             <div><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//           </div>
//         </div>
//         ${invoice.description ? `<div style="background:rgba(255,255,255,0.95);padding:15px;border-radius:10px;margin-bottom:30px"><strong>Project Description:</strong><br/>${invoice.description}</div>` : ""}
//         <table style="width:100%;border-collapse:collapse;margin-bottom:40px">
//           <thead>
//             <tr style="background:#2c3e50;color:#fff">
//               <th style="padding:10px;text-align:left">Description</th>
//               <th style="padding:10px;text-align:right">Amount (${invoice.currency})</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${invoice.items.map(i => `<tr><td style="padding:10px;border-bottom:1px solid #eee">${i.desc || "-"}</td><td style="padding:10px;text-align:right">${parseFloat(i.amt || 0).toFixed(2)}</td></tr>`).join("")}
//             <tr style="font-weight:bold;border-top:2px double #000"><td style="padding:12px">TOTAL</td><td style="padding:12px;text-align:right">${invoice.total.toFixed(2)}</td></tr>
//           </tbody>
//         </table>
//         <div style="font-size:12px;white-space:pre-line"><strong>Payment Details:</strong><br/>${invoice.bankDetails}</div>
//         <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:120px;font-weight:900;color:${invoice.status==="Paid"?"rgba(40,167,69,0.2)":"rgba(220,53,69,0.2)"};pointer-events:none;text-align:center;z-index:5">${invoice.status.toUpperCase()}</div>
//       </div>
//     `;

//     document.body.appendChild(element);
//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoice.invoiceNumber}.pdf`);
//     document.body.removeChild(element);
//   };

//   return (
//     <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
//       <div style={{ maxWidth: "1800px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>

//         {/* LEFT PANEL - Form */}
//         <div style={{ flex: "1 1 520px", background: "white", padding: "35px", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
//           <h2 style={{ marginTop: 0, fontSize: "28px" }}>Professional Invoice Generator</h2>

//           {/* NEW: Invoice Generated By Dropdown */}
//           <label>Invoice Generated By</label>
//           <select 
//             value={generatedBy} 
//             onChange={e => setGeneratedBy(e.target.value)} 
//             style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
//           >
//             {GENERATED_BY_OPTIONS.map(name => (
//               <option key={name} value={name}>{name}</option>
//             ))}
//           </select>

//           {/* Letterhead */}
//           <label>Choose Brand Letterhead</label>
//           <select value={selectedLetterhead} onChange={e => setSelectedLetterhead(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//           </select>

//           {/* Bank Selection */}
//           <label>Bank Details for Payment</label>
//           <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {BANK_OPTIONS.map(bank => (
//               <option key={bank.value} value={bank.value}>{bank.label}</option>
//             ))}
//           </select>

//           {/* Custom Bank Form */}
//           {selectedBank === "custom" && (
//             <div style={{ border: "2px dashed #3498db", padding: "18px", borderRadius: "12px", background: "#f8fdff", marginBottom: "20px" }}>
//               <strong style={{ display: "block", marginBottom: "12px", color: "#2c3e50" }}>Custom Bank Details</strong>
//               <input placeholder="Account Holder Name" value={customBank.holder} onChange={e => setCustomBank({ ...customBank, holder: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="Account Number" value={customBank.accountNumber} onChange={e => setCustomBank({ ...customBank, accountNumber: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="Bank Name" value={customBank.bankName} onChange={e => setCustomBank({ ...customBank, bankName: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="IBAN" value={customBank.iban} onChange={e => setCustomBank({ ...customBank, iban: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="SWIFT / BIC Code" value={customBank.swift} onChange={e => setCustomBank({ ...customBank, swift: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//             </div>
//           )}

//           {/* Rest of the form... */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
//             <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1 }} />
//             <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ flex: 1 }} placeholder="Due Date" />
//           </div>

//           <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />
//           <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />

//           <textarea placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }} rows={3} />

//           <strong>Line Items</strong>
//           {items.map((item, i) => (
//             <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//               <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} style={{ flex: 3 }} />
//               <input placeholder="Amount" type="number" value={item.amt} onChange={e => updateItem(i, "amt", e.target.value)} style={{ flex: 1 }} />
//               <button onClick={() => removeItem(i)} style={{ width: "36px" }}>×</button>
//             </div>
//           ))}
//           <button onClick={addItem} style={{ marginBottom: "15px" }}>+ Add Line Item</button>

//           <div style={{ margin: "15px 0" }}>
//             <label>Currency:</label>
//             {["USD", "GBP", "EUR", "AED"].map(c => (
//               <label key={c} style={{ marginLeft: "10px" }}>
//                 <input type="radio" checked={currency === c} onChange={() => setCurrency(c)} /> {c}
//               </label>
//             ))}
//           </div>

//           <div style={{ marginBottom: "15px" }}>
//             <label>Status:</label>
//             <select value={status} onChange={e => setStatus(e.target.value)}>
//               <option>Unpaid</option>
//               <option>Paid</option>
//             </select>
//           </div>

//           <button onClick={downloadPDF} style={{ width: "100%", padding: "14px", background: "#27ae60", color: "white", fontSize: "16px", marginBottom: "10px" }}>
//             Download PDF & Save
//           </button>
//           <button onClick={testFirestoreWrite} style={{ width: "100%", padding: "12px", background: "#f39c12", color: "white", marginBottom: "10px" }}>Test Firestore Write</button>
//           <button onClick={fetchInvoices} style={{ width: "100%", padding: "12px", background: "#8e44ad", color: "white" }}>Show All Invoices</button>

//           {/* Invoices List - Now with "Generated By" column */}
//           {allInvoices.length > 0 && (
//             <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "20px" }}>
//               <input placeholder="Search by Client" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }} />
//               <select value={sortBrand} onChange={e => setSortBrand(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }}>
//                 <option value="">All Brands</option>
//                 {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//               </select>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
//                 <thead>
//                   <tr style={{ background: "#34495e", color: "white" }}>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Client</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Invoice #</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Brand</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Currency</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Generated By</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Download</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allInvoices
//                     .filter(inv => inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase()))
//                     .filter(inv => !sortBrand || inv.brand === sortBrand)
//                     .map((inv, idx) => (
//                       <tr key={idx}>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.clientName}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.invoiceNumber}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.brand?.replace(".png", "")}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.total}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.currency}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc", fontSize: "11px" }}>{inv.generatedBy || "-"}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>
//                           <button onClick={() => downloadOldInvoice(inv)} style={{ padding: "6px 12px", background: "#3498db", color: "white", border: "none", borderRadius: "4px" }}>
//                             Download
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* RIGHT PANEL - Live Preview (NO "Generated By" shown here) */}
//         <div ref={invoiceRef} style={{ width: "210mm", minHeight: "297mm", background: "white", position: "relative", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${LETTERHEAD_IMAGE})`, backgroundSize: "cover", zIndex: 1 }} />
//           <div style={{ position: "relative", zIndex: 10, padding: "190px 38mm 100px 38mm" }}>
//             <h1 style={{ textAlign: "center", fontSize: "46px", fontWeight: "bold", marginBottom: "60px" }}>INVOICE</h1>

//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
//               <div>
//                 <strong>Bill To:</strong><br />
//                 {clientName || "Client Name"}<br />
//                 {clientEmail || "client@example.com"}
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div><strong>Invoice #:</strong> {invoiceNumber}</div>
//                 <div><strong>Date:</strong> {new Date(date).toLocaleDateString("en-GB")}</div>
//                 <div><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//               </div>
//             </div>

//             {description && (
//               <div style={{ background: "rgba(255,255,255,0.95)", padding: "15px", borderRadius: "10px", marginBottom: "30px" }}>
//                 <strong>Project Description:</strong><br />
//                 {description}
//               </div>
//             )}

//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
//               <thead>
//                 <tr style={{ background: "#2c3e50", color: "#fff" }}>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
//                   <th style={{ padding: "10px", textAlign: "right" }}>Amount ({currency})</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.filter(i => i.desc || i.amt).map((item, idx) => (
//                   <tr key={idx}>
//                     <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.desc || "-"}</td>
//                     <td style={{ padding: "10px", textAlign: "right" }}>{parseFloat(item.amt || 0).toFixed(2)}</td>
//                   </tr>
//                 ))}
//                 <tr style={{ fontWeight: "bold", borderTop: "2px double #000" }}>
//                   <td style={{ padding: "12px" }}>TOTAL</td>
//                   <td style={{ padding: "12px", textAlign: "right" }}>{total.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <div style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
//               <strong>Payment Details:</strong><br />
//               {currentBankDetails || "Please select bank details"}
//             </div>

//             <div style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%) rotate(-35deg)",
//               fontSize: "120px",
//               fontWeight: "900",
//               color: status === "Paid" ? "rgba(40,167,69,0.2)" : "rgba(220,53,69,0.2)",
//               pointerEvents: "none",
//               zIndex: 5,
//             }}>
//               {status.toUpperCase()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// new one 

// import React, { useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// // Helper function to format invoice numbers
// function formatInvoiceNumber(num) {
//   return `BWI-INV-UAE-${String(num).padStart(4, "0")}`;
// }

// // Team members for "Generated By"
// const GENERATED_BY_OPTIONS = [
//   "Syed Ali Abbas",
//   "Anas Arif",
//   "Arhum Naveed",
//   "Yahya Sohail",
//   "Atyab Kazmi",
//   "Raniya Lateef",
//   "Ahmer Altaf",
//   "Faran Shahid",
//   "Fahad Abbasi",
//   "Wasay Ali",
//   "Ayesha Khan",
//   "Laraib Javaid",
//   "Waqas Awan",
//   "Basit Qureshi",
//   "Syed Arham Abdullah"
// ];

// // Predefined Bank Options + Custom Option
// const BANK_OPTIONS = [
//   { label: "UAE - Prislogics Marketing (Wio Bank)", value: "uae-prislogics", details: `Account holder: PRISLOGICS MARKETING MANAGEMENT L.L.C S.O.C\nAccount number: 9307520214\nIBAN: AE220860000009307520214\nBIC: WIOBAEADXXX` },
//   { label: "UK - Book Writing Inn LTD (Lloyds)", value: "uk-lloyds", details: `Account Name: Book Writing Inn LTD\nAccount Number: 28662160\nSort Code: 30-54-66\nIBAN: GB25LOYD30546628662160\nBIC: LOYDGB21F95` },
//   { label: "USA - Book Writing Inn Ltd (Wise US)", value: "usa-wise", details: `Account Name: Book Writing Inn Ltd\nAccount Number: 213496653898\nAccount Type: Checking\nRouting Number: _LOOK_UP_\nSWIFT/BIC: TRWIUS35XXX` },
//   { label: "UAE/International - Book Writing Inn Ltd (Wise GB)", value: "uae-wise-gb", details: `Account Name: Book Writing Inn Ltd\nIBAN: GB49TRWI23080115134001\nSWIFT/BIC: TRWIGB2LXXX` },
//   { label: "Point Brand Inc Limited (Wise UK)", value: "pointbrand", details: `Name: Point Brand Inc Limited\nAccount number: 23557501\nSort code: 60-84-64 (Use when sending from UK)\nIBAN: GB96TRWI60846423557501\nSwift/BIC: TRWIGB2BXXX` },
//   { label: "Add Custom Bank", value: "custom", details: "" },
// ];

// // Letterhead options
// const LETTERHEADS = [
//   { value: "bwi-uae.png", label: "BWI UAE" },
//   { value: "bwi-uk.png", label: "BWI UK" },
//   { value: "expert.png", label: "Expert" },
//   { value: "oxford.png", label: "Oxford" },
//   { value: "pointbrand.png", label: "Point Brand" },
//   { value: "slade.png", label: "Slade" },
// ];

// export default function App() {
//   const [currency, setCurrency] = useState("USD");
//   const [status, setStatus] = useState("Unpaid");
//   const [date, setDate] = useState("2025-12-06");
//   const [dueDate, setDueDate] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [description, setDescription] = useState("");
//   const [items, setItems] = useState([{ desc: "", amt: "" }]);
//   const [invoiceCounter, setInvoiceCounter] = useState(2);
//   const [selectedLetterhead, setSelectedLetterhead] = useState("slade.png");
//   const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0].value);
//   const [generatedBy, setGeneratedBy] = useState(GENERATED_BY_OPTIONS[0]);
//   const [customBank, setCustomBank] = useState({ holder: "", accountNumber: "", bankName: "", iban: "", swift: "" });
//   const [allInvoices, setAllInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBrand, setSortBrand] = useState("");

//   const invoiceRef = useRef(null);
//   const LETTERHEAD_IMAGE = `/Letterhead/${selectedLetterhead}`;

//   const currentBankDetails =
//     selectedBank === "custom"
//       ? `Account holder: ${customBank.holder || "N/A"}\nAccount number: ${customBank.accountNumber || "N/A"}\nBank name: ${customBank.bankName || "N/A"}\nIBAN: ${customBank.iban || "N/A"}\nSWIFT/BIC: ${customBank.swift || "N/A"}`.trim()
//       : BANK_OPTIONS.find(b => b.value === selectedBank)?.details || BANK_OPTIONS[0].details;

//   const total = items.reduce((sum, item) => sum + (parseFloat(item.amt) || 0), 0);
//   const invoiceNumber = formatInvoiceNumber(invoiceCounter);

//   const addItem = () => setItems([...items, { desc: "", amt: "" }]);
//   const updateItem = (i, field, value) => { const newItems = [...items]; newItems[i][field] = value; setItems(newItems); };
//   const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

//   const testFirestoreWrite = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "invoices"), {
//         clientName: "Test Client",
//         invoiceNumber: "TEST-0001",
//         brand: "slade.png",
//         createdAt: new Date(),
//         generatedBy: "Test User"
//       });
//       alert("Firestore write successful!");
//     } catch (error) { console.error(error); alert("Firestore write failed."); }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAllInvoices(invoices);
//     } catch (error) { console.error(error); alert("Failed to fetch invoices."); }
//   };

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoiceNumber}.pdf`);

//     try {
//       const docId = `${clientName.replace(/\s+/g, "")}-${invoiceNumber}`;
//       await setDoc(doc(db, "invoices", docId), {
//         clientName,
//         clientEmail,
//         invoiceNumber,
//         items,
//         total,
//         brand: selectedLetterhead,
//         date,
//         dueDate,
//         currency,
//         status,
//         bankDetails: currentBankDetails,
//         isCustomBank: selectedBank === "custom",
//         customBankDetails: selectedBank === "custom" ? customBank : null,
//         createdAt: new Date(),
//         description,
//         generatedBy,
//       });
//       alert("Invoice saved to Firestore!");
//       setInvoiceCounter(c => c + 1);
//     } catch (error) { console.error(error); alert("Failed to save invoice to Firestore."); }
//   };

//   const downloadOldInvoice = async (invoice) => {
//     const element = document.createElement("div");
//     element.style.width = "210mm";
//     element.style.height = "297mm";
//     element.style.background = "white";
//     element.style.position = "relative";
//     element.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
//     element.style.padding = "190px 38mm 100px 38mm";

//     element.innerHTML = `
//       <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:url(/Letterhead/${invoice.brand});background-size:contain;background-repeat:no-repeat;background-position:top center;z-index:1"></div>
//       <div style="position:relative;z-index:10">
//         <h1 style="text-align:center;font-size:46px;font-weight:bold;margin-bottom:60px">INVOICE</h1>
//         <div style="display:flex;justify-content:space-between;margin-bottom:50px">
//           <div>
//             <strong>Bill To:</strong><br/>
//             ${invoice.clientName}<br/>
//             ${invoice.clientEmail || ""}
//           </div>
//           <div style="text-align:right">
//             <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
//             <div><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString("en-GB")}</div>
//             <div><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//           </div>
//         </div>
//         ${invoice.description ? `<div style="background:rgba(255,255,255,0.95);padding:15px;border-radius:10px;margin-bottom:30px"><strong>Project Description:</strong><br/>${invoice.description}</div>` : ""}
//         <table style="width:100%;border-collapse:collapse;margin-bottom:40px">
//           <thead>
//             <tr style="background:#2c3e50;color:#fff">
//               <th style="padding:10px;text-align:left">Description</th>
//               <th style="padding:10px;text-align:right">Amount (${invoice.currency})</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${invoice.items.map(i => `<tr><td style="padding:10px;border-bottom:1px solid #eee">${i.desc || "-"}</td><td style="padding:10px;text-align:right">${parseFloat(i.amt || 0).toFixed(2)}</td></tr>`).join("")}
//             <tr style="font-weight:bold;border-top:2px double #000"><td style="padding:12px">TOTAL</td><td style="padding:12px;text-align:right">${invoice.total.toFixed(2)}</td></tr>
//           </tbody>
//         </table>
//         <div style="font-size:12px;white-space:pre-line"><strong>Payment Details:</strong><br/>${invoice.bankDetails}</div>
//         <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:120px;font-weight:900;color:${invoice.status==="Paid"?"rgba(40,167,69,0.2)":"rgba(220,53,69,0.2)"};pointer-events:none;text-align:center;z-index:5">${invoice.status.toUpperCase()}</div>
//       </div>
//     `;

//     document.body.appendChild(element);
//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoice.invoiceNumber}.pdf`);
//     document.body.removeChild(element);
//   };

//   return (
//     <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
//       <div style={{ maxWidth: "1800px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>

//         {/* LEFT PANEL - Form */}
//         <div style={{ flex: "1 1 520px", background: "white", padding: "35px", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
//           <h2 style={{ marginTop: 0, fontSize: "28px" }}>Professional Invoice Generator</h2>

//           <label>Invoice Generated By</label>
//           <select value={generatedBy} onChange={e => setGeneratedBy(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {GENERATED_BY_OPTIONS.map(name => <option key={name} value={name}>{name}</option>)}
//           </select>

//           <label>Choose Brand Letterhead</label>
//           <select value={selectedLetterhead} onChange={e => setSelectedLetterhead(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//           </select>

//           <label>Bank Details for Payment</label>
//           <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {BANK_OPTIONS.map(bank => <option key={bank.value} value={bank.value}>{bank.label}</option>)}
//           </select>

//           {selectedBank === "custom" && (
//             <div style={{ border: "2px dashed #3498db", padding: "18px", borderRadius: "12px", background: "#f8fdff", marginBottom: "20px" }}>
//               <strong style={{ display: "block", marginBottom: "12px", color: "#2c3e50" }}>Custom Bank Details</strong>
//               <input placeholder="Account Holder Name" value={customBank.holder} onChange={e => setCustomBank({ ...customBank, holder: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="Account Number" value={customBank.accountNumber} onChange={e => setCustomBank({ ...customBank, accountNumber: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="Bank Name" value={customBank.bankName} onChange={e => setCustomBank({ ...customBank, bankName: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="IBAN" value={customBank.iban} onChange={e => setCustomBank({ ...customBank, iban: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               <input placeholder="SWIFT / BIC Code" value={customBank.swift} onChange={e => setCustomBank({ ...customBank, swift: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//             </div>
//           )}

//           <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
//             <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1 }} />
//             <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ flex: 1 }} placeholder="Due Date" />
//           </div>

//           <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />
//           <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />

//           <textarea placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }} rows={3} />

//           <strong>Line Items</strong>
//           {items.map((item, i) => (
//             <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//               <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} style={{ flex: 3 }} />
//               <input placeholder="Amount" type="number" value={item.amt} onChange={e => updateItem(i, "amt", e.target.value)} style={{ flex: 1 }} />
//               <button onClick={() => removeItem(i)} style={{ width: "36px" }}>×</button>
//             </div>
//           ))}
//           <button onClick={addItem} style={{ marginBottom: "15px" }}>+ Add Line Item</button>

//           <div style={{ margin: "15px 0" }}>
//             <label>Currency:</label>
//             {["USD", "GBP", "EUR", "AED"].map(c => (
//               <label key={c} style={{ marginLeft: "10px" }}>
//                 <input type="radio" checked={currency === c} onChange={() => setCurrency(c)} /> {c}
//               </label>
//             ))}
//           </div>

//           <div style={{ marginBottom: "15px" }}>
//             <label>Status:</label>
//             <select value={status} onChange={e => setStatus(e.target.value)}>
//               <option>Unpaid</option>
//               <option>Paid</option>
//             </select>
//           </div>

//           <button onClick={downloadPDF} style={{ width: "100%", padding: "14px", background: "#27ae60", color: "white", fontSize: "16px", marginBottom: "10px" }}>
//             Download PDF & Save
//           </button>
//           <button onClick={testFirestoreWrite} style={{ width: "100%", padding: "12px", background: "#f39c12", color: "white", marginBottom: "10px" }}>Test Firestore Write</button>
//           <button onClick={fetchInvoices} style={{ width: "100%", padding: "12px", background: "#8e44ad", color: "white" }}>Show All Invoices</button>

//           {allInvoices.length > 0 && (
//             <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "20px" }}>
//               <input placeholder="Search by Client" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }} />
//               <select value={sortBrand} onChange={e => setSortBrand(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }}>
//                 <option value="">All Brands</option>
//                 {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//               </select>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
//                 <thead>
//                   <tr style={{ background: "#34495e", color: "white" }}>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Client</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Invoice #</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Brand</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Currency</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Generated By</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Download</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allInvoices
//                     .filter(inv => inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase()))
//                     .filter(inv => !sortBrand || inv.brand === sortBrand)
//                     .map((inv, idx) => (
//                       <tr key={idx}>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.clientName}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.invoiceNumber}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.brand?.replace(".png", "")}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.total}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.currency}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc", fontSize: "11px" }}>{inv.generatedBy || "-"}</td>
//                         <td style={{ padding: "6px", border: "1px solid #ccc" }}>
//                           <button onClick={() => downloadOldInvoice(inv)} style={{ padding: "6px 12px", background: "#3498db", color: "white", border: "none", borderRadius: "4px" }}>
//                             Download
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* RIGHT PANEL - Live Preview */}
//         <div ref={invoiceRef} style={{ width: "210mm", minHeight: "297mm", background: "white", position: "relative", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
//           <div style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundImage: `url(${LETTERHEAD_IMAGE})`,
//             backgroundSize: "contain",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "top center",
//             zIndex: 1
//           }} />
//           <div style={{ position: "relative", zIndex: 10, padding: "150px 38mm 100px 38mm" }}>
//             <h1 style={{ textAlign: "center", fontSize: "46px", fontWeight: "bold", marginBottom: "60px" }}>INVOICE</h1>

//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
//               <div>
//                 <strong>Bill To:</strong><br />
//                 {clientName || "Client Name"}<br />
//                 {clientEmail || "client@example.com"}
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div><strong>Invoice #:</strong> {invoiceNumber}</div>
//                 <div><strong>Date:</strong> {new Date(date).toLocaleDateString("en-GB")}</div>
//                 <div><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//               </div>
//             </div>

//             {description && (
//               <div style={{ background: "rgba(255,255,255,0.95)", padding: "15px", borderRadius: "10px", marginBottom: "30px" }}>
//                 <strong>Project Description:</strong><br />
//                 {description}
//               </div>
//             )}

//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
//               <thead>
//                 <tr style={{ background: "#2c3e50", color: "#fff" }}>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
//                   <th style={{ padding: "10px", textAlign: "right" }}>Amount ({currency})</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.filter(i => i.desc || i.amt).map((item, idx) => (
//                   <tr key={idx}>
//                     <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.desc || "-"}</td>
//                     <td style={{ padding: "10px", textAlign: "right" }}>{parseFloat(item.amt || 0).toFixed(2)}</td>
//                   </tr>
//                 ))}
//                 <tr style={{ fontWeight: "bold", borderTop: "2px double #000" }}>
//                   <td style={{ padding: "12px" }}>TOTAL</td>
//                   <td style={{ padding: "12px", textAlign: "right" }}>{total.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <div style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
//               <strong>Payment Details:</strong><br />
//               {currentBankDetails || "Please select bank details"}
//             </div>

//             <div style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%) rotate(-35deg)",
//               fontSize: "120px",
//               fontWeight: "900",
//               color: status === "Paid" ? "rgba(40,167,69,0.2)" : "rgba(220,53,69,0.2)",
//               pointerEvents: "none",
//               zIndex: 5,
//             }}>
//               {status.toUpperCase()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// // Brand prefixes for invoice numbers
// const BRAND_PREFIXES = {
//   "bwi-uae.png": "BWI-INV-UAE",
//   "bwi-uk.png": "BWI-INV-UK",
//   "expert.png": "EXP-INV-UK",
//   "oxford.png": "OXF-INV-UK",
//   "pointbrand.png": "PBI-INV-UK",
//   "slade.png": "SLA-INV-UK"
// };

// // Helper function to format invoice numbers
// function formatInvoiceNumber(num, brand) {
//   const prefix = BRAND_PREFIXES[brand] || "INV";
//   return `${prefix}-${String(num).padStart(4, "0")}`;
// }

// // Team members for "Generated By"
// const GENERATED_BY_OPTIONS = [
//   "Syed Ali Abbas",
//   "Anas Arif",
//   "Arhum Naveed",
//   "Yahya Sohail",
//   "Atyab Kazmi",
//   "Raniya Lateef",
//   "Ahmer Altaf",
//   "Faran Shahid",
//   "Fahad Abbasi",
//   "Wasay Ali",
//   "Ayesha Khan",
//   "Laraib Javaid",
//   "Waqas Awan",
//   "Basit Qureshi",
//   "Syed Arham Abdullah"
// ];

// // Predefined Bank Options + Custom Option
// const BANK_OPTIONS = [
//   { label: "UAE - Prislogics Marketing (Wio Bank)", value: "uae-prislogics", details: `Account holder: PRISLOGICS MARKETING MANAGEMENT L.L.C S.O.C\nAccount number: 9307520214\nIBAN: AE220860000009307520214\nBIC: WIOBAEADXXX` },
//   { label: "UK - Book Writing Inn LTD (Lloyds)", value: "uk-lloyds", details: `Account Name: Book Writing Inn LTD\nAccount Number: 28662160\nSort Code: 30-54-66\nIBAN: GB25LOYD30546628662160\nBIC: LOYDGB21F95` },
//   { label: "USA - Book Writing Inn Ltd (Wise US)", value: "usa-wise", details: `Account Name: Book Writing Inn Ltd\nAccount Number: 213496653898\nAccount Type: Checking\nRouting Number: _LOOK_UP_\nSWIFT/BIC: TRWIUS35XXX` },
//   { label: "UAE/International - Book Writing Inn Ltd (Wise GB)", value: "uae-wise-gb", details: `Account Name: Book Writing Inn Ltd\nIBAN: GB49TRWI23080115134001\nSWIFT/BIC: TRWIGB2LXXX` },
//   { label: "Point Brand Inc Limited (Wise UK)", value: "pointbrand", details: `Name: Point Brand Inc Limited\nAccount number: 23557501\nSort code: 60-84-64 (Use when sending from UK)\nIBAN: GB96TRWI60846423557501\nSwift/BIC: TRWIGB2BXXX` },
//   { label: "Add Custom Bank", value: "custom", details: "" },
// ];

// // Letterhead options
// const LETTERHEADS = [
//   { value: "bwi-uae.png", label: "BWI UAE" },
//   { value: "bwi-uk.png", label: "BWI UK" },
//   { value: "expert.png", label: "Expert" },
//   { value: "oxford.png", label: "Oxford" },
//   { value: "pointbrand.png", label: "Point Brand" },
//   { value: "slade.png", label: "Slade" },
// ];

// export default function App() {
//   // States
//   const [currency, setCurrency] = useState("USD");
//   const [status, setStatus] = useState("Unpaid");
//   const [date, setDate] = useState("2025-12-06");
//   const [dueDate, setDueDate] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [description, setDescription] = useState("");
//   const [items, setItems] = useState([{ desc: "", amt: "" }]);
//   const [invoiceCounter, setInvoiceCounter] = useState(2);
//   const [selectedLetterhead, setSelectedLetterhead] = useState("slade.png");
//   const [selectedBank, setSelectedBank] = useState(BANK_OPTIONS[0].value);
//   const [generatedBy, setGeneratedBy] = useState(GENERATED_BY_OPTIONS[0]);
//   const [customBank, setCustomBank] = useState({ holder: "", accountNumber: "", bankName: "", iban: "", swift: "" });
//   const [allInvoices, setAllInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBrand, setSortBrand] = useState("");

//   const invoiceRef = useRef(null);
//   const LETTERHEAD_IMAGE = `/Letterhead/${selectedLetterhead}`;

//   // Current bank details
//   const currentBankDetails =
//     selectedBank === "custom"
//       ? `Account holder: ${customBank.holder || "N/A"}\nAccount number: ${customBank.accountNumber || "N/A"}\nBank name: ${customBank.bankName || "N/A"}\nIBAN: ${customBank.iban || "N/A"}\nSWIFT/BIC: ${customBank.swift || "N/A"}`.trim()
//       : BANK_OPTIONS.find(b => b.value === selectedBank)?.details || BANK_OPTIONS[0].details;

//   const total = items.reduce((sum, item) => sum + (parseFloat(item.amt) || 0), 0);
//   const invoiceNumber = formatInvoiceNumber(invoiceCounter, selectedLetterhead);

//   // Line Item Handlers
//   const addItem = () => setItems([...items, { desc: "", amt: "" }]);
//   const updateItem = (i, field, value) => { const newItems = [...items]; newItems[i][field] = value; setItems(newItems); };
//   const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

//   // Firestore functions
//   const testFirestoreWrite = async () => {
//     try {
//       await addDoc(collection(db, "invoices"), {
//         clientName: "Test Client",
//         invoiceNumber: "TEST-0001",
//         brand: "slade.png",
//         createdAt: new Date(),
//         generatedBy: "Test User"
//       });
//       alert("Firestore write successful!");
//     } catch (error) { console.error(error); alert("Firestore write failed."); }
//   };

//   const fetchInvoices = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAllInvoices(invoices);
//     } catch (error) { console.error(error); alert("Failed to fetch invoices."); }
//   };

//   const downloadPDF = async () => {
//     const element = invoiceRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoiceNumber}.pdf`);

//     try {
//       const docId = `${clientName.replace(/\s+/g, "")}-${invoiceNumber}`;
//       await setDoc(doc(db, "invoices", docId), {
//         clientName,
//         clientEmail,
//         invoiceNumber,
//         items,
//         total,
//         brand: selectedLetterhead,
//         date,
//         dueDate,
//         currency,
//         status,
//         bankDetails: currentBankDetails,
//         isCustomBank: selectedBank === "custom",
//         customBankDetails: selectedBank === "custom" ? customBank : null,
//         createdAt: new Date(),
//         description,
//         generatedBy,
//       });
//       alert("Invoice saved to Firestore!");
//       setInvoiceCounter(c => c + 1);
//     } catch (error) { console.error(error); alert("Failed to save invoice to Firestore."); }
//   };

//   // Function to download old invoices
//   const downloadOldInvoice = async (invoice) => {
//     const element = document.createElement("div");
//     element.style.width = "210mm";
//     element.style.height = "297mm";
//     element.style.background = "white";
//     element.style.position = "relative";
//     element.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
//     element.style.padding = "150px 38mm 100px 38mm";

//     element.innerHTML = `
//       <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:url(/Letterhead/${invoice.brand});background-size:contain;background-repeat:no-repeat;background-position:top center;z-index:1"></div>
//       <div style="position:relative;z-index:10">
//         <h1 style="text-align:center;font-size:46px;font-weight:bold;margin-bottom:60px">INVOICE</h1>
//         <div style="display:flex;justify-content:space-between;margin-bottom:50px">
//           <div><strong>Bill To:</strong><br/>${invoice.clientName}<br/>${invoice.clientEmail || ""}</div>
//           <div style="text-align:right">
//             <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
//             <div><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString("en-GB")}</div>
//             <div><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//           </div>
//         </div>
//         ${invoice.description ? `<div style="background:rgba(255,255,255,0.95);padding:15px;border-radius:10px;margin-bottom:30px"><strong>Project Description:</strong><br/>${invoice.description}</div>` : ""}
//         <table style="width:100%;border-collapse:collapse;margin-bottom:40px">
//           <thead>
//             <tr style="background:#2c3e50;color:#fff">
//               <th style="padding:10px;text-align:left">Description</th>
//               <th style="padding:10px;text-align:right">Amount (${invoice.currency})</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${invoice.items.map(i => `<tr><td style="padding:10px;border-bottom:1px solid #eee">${i.desc || "-"}</td><td style="padding:10px;text-align:right">${parseFloat(i.amt || 0).toFixed(2)}</td></tr>`).join("")}
//             <tr style="font-weight:bold;border-top:2px double #000"><td style="padding:12px">TOTAL</td><td style="padding:12px;text-align:right">${invoice.total.toFixed(2)}</td></tr>
//           </tbody>
//         </table>
//         <div style="font-size:12px;white-space:pre-line"><strong>Payment Details:</strong><br/>${invoice.bankDetails}</div>
//         <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:120px;font-weight:900;color:${invoice.status==="Paid"?"rgba(40,167,69,0.2)":"rgba(220,53,69,0.2)"};pointer-events:none;text-align:center;z-index:5">${invoice.status.toUpperCase()}</div>
//       </div>
//     `;

//     document.body.appendChild(element);
//     const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: null });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//     pdf.save(`${invoice.invoiceNumber}.pdf`);
//     document.body.removeChild(element);
//   };

//   return (
//     <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>
//       <div style={{ maxWidth: "1800px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>
//         {/* LEFT PANEL - Form */}
//         <div style={{ flex: "1 1 520px", background: "white", padding: "35px", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
//           <h2 style={{ marginTop: 0, fontSize: "28px" }}>Professional Invoice Generator</h2>

//           {/* Generated By */}
//           <label>Invoice Generated By</label>
//           <select value={generatedBy} onChange={e => setGeneratedBy(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {GENERATED_BY_OPTIONS.map(name => <option key={name} value={name}>{name}</option>)}
//           </select>

//           {/* Letterhead */}
//           <label>Choose Brand Letterhead</label>
//           <select value={selectedLetterhead} onChange={e => setSelectedLetterhead(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//           </select>

//           {/* Bank Selection */}
//           <label>Bank Details for Payment</label>
//           <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }}>
//             {BANK_OPTIONS.map(bank => <option key={bank.value} value={bank.value}>{bank.label}</option>)}
//           </select>

//           {/* Custom Bank */}
//           {selectedBank === "custom" && (
//             <div style={{ border: "2px dashed #3498db", padding: "18px", borderRadius: "12px", background: "#f8fdff", marginBottom: "20px" }}>
//               <strong style={{ display: "block", marginBottom: "12px", color: "#2c3e50" }}>Custom Bank Details</strong>
//               {["holder","accountNumber","bankName","iban","swift"].map(field => (
//                 <input key={field} placeholder={field.replace(/([A-Z])/g," $1")} value={customBank[field]} onChange={e => setCustomBank({...customBank, [field]: e.target.value})} style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "6px" }} />
//               ))}
//             </div>
//           )}

//           {/* Dates */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
//             <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1 }} />
//             <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ flex: 1 }} placeholder="Due Date" />
//           </div>

//           <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />
//           <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px" }} />
//           <textarea placeholder="Project Description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px" }} rows={3} />

//           <strong>Line Items</strong>
//           {items.map((item, i) => (
//             <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//               <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} style={{ flex: 3 }} />
//               <input placeholder="Amount" type="number" value={item.amt} onChange={e => updateItem(i, "amt", e.target.value)} style={{ flex: 1 }} />
//               <button onClick={() => removeItem(i)} style={{ width: "36px" }}>×</button>
//             </div>
//           ))}
//           <button onClick={addItem} style={{ marginBottom: "15px" }}>+ Add Line Item</button>

//           {/* Currency */}
//           <div style={{ margin: "15px 0" }}>
//             <label>Currency:</label>
//             {["USD", "GBP", "EUR", "AED"].map(c => (
//               <label key={c} style={{ marginLeft: "10px" }}>
//                 <input type="radio" checked={currency === c} onChange={() => setCurrency(c)} /> {c}
//               </label>
//             ))}
//           </div>

//           {/* Status */}
//           <div style={{ marginBottom: "15px" }}>
//             <label>Status:</label>
//             <select value={status} onChange={e => setStatus(e.target.value)}>
//               <option>Unpaid</option>
//               <option>Paid</option>
//             </select>
//           </div>

//           <button onClick={downloadPDF} style={{ width: "100%", padding: "14px", background: "#27ae60", color: "white", fontSize: "16px", marginBottom: "10px" }}>Download PDF & Save</button>
//           <button onClick={fetchInvoices} style={{ width: "100%", padding: "12px", background: "#8e44ad", color: "white" }}>Show All Invoices</button>

//           {/* Invoice Table */}
//           {allInvoices.length > 0 && (
//             <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "20px" }}>
//               <input placeholder="Search by Client" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }} />
//               <select value={sortBrand} onChange={e => setSortBrand(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }}>
//                 <option value="">All Brands</option>
//                 {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
//               </select>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
//                 <thead>
//                   <tr style={{ background: "#34495e", color: "white" }}>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Client</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Invoice #</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Brand</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Currency</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Generated By</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Download</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allInvoices.filter(inv => inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase())).filter(inv => !sortBrand || inv.brand === sortBrand).map((inv, idx) => (
//                     <tr key={idx}>
//                       <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.clientName}</td>
//                       <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.invoiceNumber}</td>
//                       <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.brand?.replace(".png","")}</td>
//                       <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.total}</td>
//                       <td style={{ padding: "6px", border: "1px solid #ccc" }}>{inv.currency}</td>
//                       <td style={{ padding: "6px", border: "1px solid #ccc", fontSize: "11px" }}>{inv.generatedBy || "-"}</td>
//                       <td style={{ padding: "6px", border: "1px solid #ccc" }}>
//                         <button onClick={() => downloadOldInvoice(inv)} style={{ padding: "6px 12px", background: "#3498db", color: "white", border: "none", borderRadius: "4px" }}>Download</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* RIGHT PANEL - Live Preview */}
//         <div ref={invoiceRef} style={{ width: "210mm", minHeight: "297mm", background: "white", position: "relative", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${LETTERHEAD_IMAGE})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "top center", zIndex: 1 }} />
//           <div style={{ position: "relative", zIndex: 10, padding: "190px 38mm 100px 38mm" }}>
//             <h1 style={{ textAlign: "center", fontSize: "46px", fontWeight: "bold", marginBottom: "60px" }}>INVOICE</h1>

//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
//               <div><strong>Bill To:</strong><br />{clientName || "Client Name"}<br />{clientEmail || "client@example.com"}</div>
//               <div style={{ textAlign: "right" }}>
//                 <div><strong>Invoice #:</strong> {invoiceNumber}</div>
//                 <div><strong>Date:</strong> {new Date(date).toLocaleDateString("en-GB")}</div>
//                 <div><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
//               </div>
//             </div>

//             {description && (
//               <div style={{ background: "rgba(255,255,255,0.95)", padding: "15px", borderRadius: "10px", marginBottom: "30px" }}>
//                 <strong>Project Description:</strong><br />{description}
//               </div>
//             )}

//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
//               <thead>
//                 <tr style={{ background: "#2c3e50", color: "#fff" }}>
//                   <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
//                   <th style={{ padding: "10px", textAlign: "right" }}>Amount ({currency})</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.filter(i => i.desc || i.amt).map((item, idx) => (
//                   <tr key={idx}>
//                     <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{item.desc || "-"}</td>
//                     <td style={{ padding: "10px", textAlign: "right" }}>{parseFloat(item.amt || 0).toFixed(2)}</td>
//                   </tr>
//                 ))}
//                 <tr style={{ fontWeight: "bold", borderTop: "2px double #000" }}>
//                   <td style={{ padding: "12px" }}>TOTAL</td>
//                   <td style={{ padding: "12px", textAlign: "right" }}>{total.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <div style={{ fontSize: "12px", whiteSpace: "pre-line" }}>
//               <strong>Payment Details:</strong><br />{currentBankDetails || "Please select bank details"}
//             </div>

//             <div style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%) rotate(-35deg)",
//               fontSize: "120px",
//               fontWeight: "900",
//               color: status === "Paid" ? "rgba(40,167,69,0.2)" : "rgba(220,53,69,0.2)",
//               pointerEvents: "none",
//               zIndex: 5,
//             }}>{status.toUpperCase()}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { PDFDocument } from "pdf-lib";

const BRAND_PREFIXES = {
  "bwi-uae.png": "BWI-INV-UAE",
  "bwi-uk.png": "BWI-INV-UK",
  "expert.png": "EXP-INV-UK",
  "oxford.png": "OXF-INV-UK",
  "pointbrand.png": "PBI-INV-UK",
  "slade.png": "SLA-INV-UK"
};

function formatInvoiceNumber(num, brand) {
  const prefix = BRAND_PREFIXES[brand] || "INV";
  return `${prefix}-${String(num).padStart(4, "0")}`;
}

const GENERATED_BY_OPTIONS = [
  "Syed Ali Abbas", "Anas Arif", "Arhum Naveed", "Yahya Sohail", "Atyab Kazmi",
  "Raniya Lateef", "Ahmer Altaf", "Faran Shahid", "Fahad Abbasi", "Wasay Ali",
  "Ayesha Khan", "Laraib Javaid", "Waqas Awan", "Basit Qureshi", "Syed Arham Abdullah"
];

const BANK_OPTIONS = [
  { label: "UAE - Prislogics Marketing (Wio Bank)", value: "uae-prislogics", details: `Account holder: PRISLOGICS MARKETING MANAGEMENT L.L.C S.O.C\nAccount number: 9307520214\nIBAN: AE220860000009307520214\nBIC: WIOBAEADXXX` },
  { label: "UK - Book Writing Inn LTD (Lloyds)", value: "uk-lloyds", details: `Account Name: Book Writing Inn LTD\nAccount Number: 28662160\nSort Code: 30-54-66\nIBAN: GB25LOYD30546628662160\nBIC: LOYDGB21F95` },
  { label: "USA - Book Writing Inn Ltd (Wise US)", value: "usa-wise", details: `Account Name: Book Writing Inn Ltd\nAccount Number: 213496653898\nAccount Type: Checking\nRouting Number: _LOOK_UP_\nSWIFT/BIC: TRWIUS35XXX` },
  { label: "UAE/International - Book Writing Inn Ltd (Wise GB)", value: "uae-wise-gb", details: `Account Name: Book Writing Inn Ltd\nIBAN: GB49TRWI23080115134001\nSWIFT/BIC: TRWIGB2LXXX` },
  { label: "Point Brand Inc Limited (Wise UK)", value: "pointbrand", details: `Name: Point Brand Inc Limited\nAccount number: 23557501\nSort code: 60-84-64 (Use when sending from UK)\nIBAN: GB96TRWI60846423557501\nSwift/BIC: TRWIGB2BXXX` },
  { label: "Add Custom Bank", value: "custom", details: "" },
];

const LETTERHEADS = [
  { value: "bwi-uae.png", label: "BWI UAE" },
  { value: "bwi-uk.png", label: "BWI UK" },
  { value: "expert.png", label: "Expert" },
  { value: "oxford.png", label: "Oxford" },
  { value: "pointbrand.png", label: "Point Brand" },
  { value: "slade.png", label: "Slade" },
];

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #e0e0e0",
  background: "#fafafa",
  fontSize: "15px",
  transition: "all 0.3s ease",
  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.03)"
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 6.646a.5.5 0 0 1 .708 0L8 9.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: "40px"
};

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
  const [generatedBy, setGeneratedBy] = useState(GENERATED_BY_OPTIONS[0]);
  const [customBank, setCustomBank] = useState({ holder: "", accountNumber: "", bankName: "", iban: "", swift: "" });
  const [allInvoices, setAllInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBrand, setSortBrand] = useState("");

  const invoiceRef = useRef(null);
  const LETTERHEAD_IMAGE = `/Letterhead/${selectedLetterhead}`;

  const currentBankDetails =
    selectedBank === "custom"
      ? `Account holder: ${customBank.holder || "N/A"}\nAccount number: ${customBank.accountNumber || "N/A"}\nBank name: ${customBank.bankName || "N/A"}\nIBAN: ${customBank.iban || "N/A"}\nSWIFT/BIC: ${customBank.swift || "N/A"}`.trim()
      : BANK_OPTIONS.find(b => b.value === selectedBank)?.details || BANK_OPTIONS[0].details;

  const total = items.reduce((sum, item) => sum + (parseFloat(item.amt) || 0), 0);
  const invoiceNumber = formatInvoiceNumber(invoiceCounter, selectedLetterhead);

  const addItem = () => setItems([...items, { desc: "", amt: "" }]);
  const updateItem = (i, field, value) => {
    const newItems = [...items];
    newItems[i][field] = value;
    setItems(newItems);
  };
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  // ... (fetchInvoices & downloadPDF functions stay exactly the same)
  const fetchInvoices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllInvoices(invoices);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch invoices.");
    }
  };

  // UPDATED downloadPDF — WITH PDF CONCATENATION
  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    try {
      // 1. Capture invoice as image
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const invoiceImgData = canvas.toDataURL("image/jpeg", 1.0);

      // 2. Create main invoice PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(invoiceImgData, "JPEG", 0, 0, width, height);

      // 3. Convert to bytes for pdf-lib
      const mainPdfBytes = pdf.output("arraybuffer");

      // 4. Load into pdf-lib
      const finalPdfDoc = await PDFDocument.load(mainPdfBytes);

      // 5. If BWI UAE → fetch and append extra PDF
      if (selectedLetterhead === "bwi-uae.png") {
        try {
          const response = await fetch("/extras/bwi-uae-1.pdf");
          if (!response.ok) throw new Error("Extra PDF not found");
          const extraPdfBytes = await response.arrayBuffer();
          const extraPdfDoc = await PDFDocument.load(extraPdfBytes);

          const copiedPages = await finalPdfDoc.copyPages(extraPdfDoc, extraPdfDoc.getPageIndices());
          copiedPages.forEach(page => finalPdfDoc.addPage(page));
        } catch (err) {
          console.warn("Failed to attach UAE document:", err);
          alert("Warning: UAE registration document could not be attached.");
        }
      }

      // 6. Save final merged PDF
      const finalPdfBytes = await finalPdfDoc.save();
      const blob = new Blob([finalPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 7. Save to Firestore
      const docId = `${clientName.replace(/\s+/g, "")}-${invoiceNumber}`;
      await setDoc(doc(db, "invoices", docId), {
        clientName, clientEmail, invoiceNumber, items, total,
        brand: selectedLetterhead, date, dueDate, currency, status,
        bankDetails: currentBankDetails,
        isCustomBank: selectedBank === "custom",
        customBankDetails: selectedBank === "custom" ? customBank : null,
        createdAt: new Date(), description, generatedBy,
      });

      alert("Invoice downloaded & saved successfully!");
      setInvoiceCounter(c => c + 1);

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Error generating PDF. Check console.");
    }
  };

  // downloadOldInvoice remains unchanged
  const downloadOldInvoice = async (invoice) => {
    const element = document.createElement("div");
    element.style.cssText = "width:210mm;height:297mm;background:white;position:relative;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:150px 38mm 100px 38mm;";
    element.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:url(/Letterhead/${invoice.brand});background-size:contain;background-repeat:no-repeat;background-position:top center;z-index:1"></div>
      <div style="position:relative;z-index:10">
        <h1 style="text-align:center;font-size:46px;font-weight:bold;margin-bottom:60px">INVOICE</h1>
        <div style="display:flex;justify-content:space-between;margin-bottom:50px">
          <div><strong>Bill To:</strong><br/>${invoice.clientName}<br/>${invoice.clientEmail || ""}</div>
          <div style="text-align:right">
            <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
            <div><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString("en-GB")}</div>
            <div><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
          </div>
        </div>
        ${invoice.description ? `<div style="background:rgba(255,255,255,0.95);padding:15px;border-radius:10px;margin-bottom:30px"><strong>Project Description:</strong><br/>${invoice.description}</div>` : ""}
        <table style="width:100%;border-collapse:collapse;margin-bottom:40px">
          <thead><tr style="background:#2c3e50;color:#fff">
            <th style="padding:10px;text-align:left">Description</th>
            <th style="padding:10px;text-align:right">Amount (${invoice.currency})</th>
          </tr></thead>
          <tbody>
            ${invoice.items.map(i => `<tr><td style="padding:10px;border-bottom:1px solid #eee">${i.desc || "-"}</td><td style="padding:10px;text-align:right">${parseFloat(i.amt || 0).toFixed(2)}</td></tr>`).join("")}
            <tr style="font-weight:bold;border-top:2px double #000"><td style="padding:12px">TOTAL</td><td style="padding:12px;text-align:right">${invoice.total.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <div style="font-size:12px;white-space:pre-line"><strong>Payment Details:</strong><br/>${invoice.bankDetails}</div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:120px;font-weight:900;color:${invoice.status==="Paid"?"rgba(40,167,69,0.2)":"rgba(220,53,69,0.2)"};pointer-events:none;z-index:5">${invoice.status.toUpperCase()}</div>
      </div>`;
    document.body.appendChild(element);
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`${invoice.invoiceNumber}.pdf`);
    document.body.removeChild(element);
  };

  return (
    <div style={{ padding: "30px 20px", background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: "1900px", margin: "0 auto", display: "flex", gap: "50px", flexWrap: "wrap", justifyContent: "center" }}>

        {/* LEFT PANEL – Form */}
        <div style={{
          flex: "1 1 560px",
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255,255,255,0.4)"
        }}>
          <h2 style={{ margin: "0 0 30px", fontSize: "32px", fontWeight: "700", background: "linear-gradient(90deg, #2c3e50, #3498db)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Prislogics Invoice Generator
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50" }}>Generated By</label>
            <select value={generatedBy} onChange={e => setGeneratedBy(e.target.value)} style={selectStyle}>
              {GENERATED_BY_OPTIONS.map(name => <option key={name}>{name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50" }}>Brand Letterhead</label>
            <select value={selectedLetterhead} onChange={e => setSelectedLetterhead(e.target.value)} style={selectStyle}>
              {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50" }}>Bank Details</label>
            <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} style={selectStyle}>
              {BANK_OPTIONS.map(bank => <option key={bank.value} value={bank.value}>{bank.label}</option>)}
            </select>
          </div>

          {selectedBank === "custom" && (
            <div style={{ border: "2px dashed #3498db", background: "linear-gradient(145deg, #f0f8ff, #e6f2ff)", padding: "20px", borderRadius: "16px", marginBottom: "24px", boxShadow: "0 4px 15px rgba(52,152,219,0.15)" }}>
              <strong style={{ display: "block", marginBottom: "14px", color: "#2c3e50" }}>Custom Bank Details</strong>
              {["holder", "accountNumber", "bankName", "iban", "swift"].map(field => (
                <input
                  key={field}
                  placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  value={customBank[field]}
                  onChange={e => setCustomBank({ ...customBank, [field]: e.target.value })}
                  style={{ ...inputStyle, background: "white", marginBottom: "8px 0" }}
                />
              ))}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} placeholder="Due Date" />
          </div>

          <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} style={{...inputStyle, marginBottom: "16px"}} />
          <input placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{...inputStyle, marginBottom: "16px"}} />
          <textarea placeholder="Project Description (optional)" value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, minHeight: "100px", resize: "vertical", marginBottom: "24px"}} rows={3} />

          <strong style={{ display: "block", marginBottom: "12px", color: "#2c3e50" }}>Line Items</strong>
          {items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 40px", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
              <input placeholder="Description" value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} style={inputStyle} />
              <input placeholder="Amount" type="number" value={item.amt} onChange={e => updateItem(i, "amt", e.target.value)} style={inputStyle} />
              <button onClick={() => removeItem(i)} style={{ height: "50px", width: "50px", borderRadius: "12px", background: "#e74c3c", color: "white", fontSize: "20px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(231,76,60,0.3)" }}>×</button>
            </div>
          ))}
          <button onClick={addItem} style={{ width: "100%", padding: "14px", background: "linear-gradient(90deg, #3498db, #2980b9)", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", margin: "16px 0 24px", cursor: "pointer", boxShadow: "0 6px 20px rgba(52,152,219,0.3)" }}>
            + Add Line Item
          </button>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontWeight: "600", color: "#2c3e50" }}>Currency:</label>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                {["USD", "GBP", "EUR", "AED"].map(c => (
                  <label key={c} style={{ display: "flex", alignItems: "center", fontWeight: "500" }}>
                    <input type="radio" checked={currency === c} onChange={() => setCurrency(c)} style={{ marginRight: "6px" }} /> {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontWeight: "600", color: "#2c3e50" }}>Status:</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{...selectStyle, width: "140px", marginLeft: "10px"}}>
                <option>Unpaid</option>
                <option>Paid</option>
              </select>
            </div>
          </div>

          <button onClick={downloadPDF} style={{ width: "100%", padding: "18px", background: "linear-gradient(90deg, #27ae60, #1e8449)", color: "white", fontSize: "18px", fontWeight: "700", border: "none", borderRadius: "16px", cursor: "pointer", boxShadow: "0 10px 30px rgba(39,174,96,0.4)", transition: "transform 0.2s" }}>
            Download PDF & Save Invoice
          </button>

          <button onClick={fetchInvoices} style={{ width: "100%", marginTop: "12px", padding: "14px", background: "#8e44ad", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 6px 20px rgba(142,68,173,0.3)" }}>
            Show All Saved Invoices
          </button>

         {/* Saved invoices table – also beautified */}
{allInvoices.length > 0 && (
  <div style={{ marginTop: "30px", padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
    
    {/* ✅ UPDATED SEARCH PLACEHOLDER */}
    <input
      placeholder="Search by client, invoice or generated by..."
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      style={{...inputStyle, marginBottom: "12px"}}
    />

    <select value={sortBrand} onChange={e => setSortBrand(e.target.value)} style={{...selectStyle, marginBottom: "12px"}}>
      <option value="">All Brands</option>
      {LETTERHEADS.map(lh => <option key={lh.value} value={lh.value}>{lh.label}</option>)}
    </select>

    <div style={{ maxHeight: "360px", overflow: "auto", borderRadius: "12px", overflow: "hidden", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.05)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        
        {/* ✅ HEADER UPDATED */}
        <thead style={{ background: "linear-gradient(90deg, #2c3e50, #34495e)", color: "white", position: "sticky", top: 0, zIndex: 10 }}>
          <tr>
            {["Client", "Invoice #", "Brand", "Total", "Date", "By", ""].map(h => (
              <th key={h} style={{ padding: "14px 10px", textAlign: "left", fontWeight: "600" }}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {allInvoices
            // ✅ MULTI-FIELD SEARCH
            .filter(inv => {
              const query = searchQuery.toLowerCase();
              return (
                inv.clientName?.toLowerCase().includes(query) ||
                inv.invoiceNumber?.toLowerCase().includes(query) ||
                inv.generatedBy?.toLowerCase().includes(query)
              );
            })

            .filter(inv => !sortBrand || inv.brand === sortBrand)

            .map((inv, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white", transition: "background 0.2s" }}>
                
                <td style={{ padding: "12px 10px" }}>{inv.clientName}</td>
                <td style={{ padding: "12px 10px" }}>{inv.invoiceNumber}</td>
                <td style={{ padding: "12px 10px" }}>{inv.brand?.replace(".png", "").toUpperCase()}</td>
                <td style={{ padding: "12px 10px" }}>${inv.total}</td>

                {/* ✅ GENERATED DATE COLUMN */}
                <td style={{ padding: "12px 10px" }}>
                  {inv.createdAt?.seconds
                    ? new Date(inv.createdAt.seconds * 1000).toLocaleDateString("en-GB")
                    : new Date(inv.createdAt).toLocaleDateString("en-GB")}
                </td>

                <td style={{ padding: "12px 10px", fontSize: "12px" }}>{inv.generatedBy || "-"}</td>

                <td style={{ padding: "12px 10px" }}>
                  <button
                    onClick={() => downloadOldInvoice(inv)}
                    style={{
                      padding: "8px 16px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Download
                  </button>
                </td>

              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}

        </div>

        {/* RIGHT PANEL – Live Preview (A4) */}
       <div ref={invoiceRef} style={{
  width: "210mm",
  height: "297mm",               // 🔥 FIXED A4 HEIGHT
  maxHeight: "297mm",            // 🔥 Prevent stretching
  background: "white",
  position: "relative",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
  transform: "scale(0.94)",
  transformOrigin: "top left",
  flexShrink: 0,                  // 🔥 Prevent flexbox from resizing it
}}>

          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${LETTERHEAD_IMAGE})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "top center", zIndex: 1, opacity: 0.98 }} />
          <div style={{ position: "relative", zIndex: 10, padding: "190px 38mm 100px 38mm", color: "#2c3e50" }}>
            <h1 style={{ textAlign: "center", fontSize: "48px", fontWeight: "900", marginBottom: "70px", letterSpacing: "2px" }}>INVOICE</h1>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px", fontSize: "15px" }}>
              <div>
                <strong style={{ fontSize: "16px" }}>Bill To:</strong><br />
                {clientName || "Client Name"}<br />
                {clientEmail || "client@example.com"}
              </div>
              <div style={{ textAlign: "right" }}>
                <div><strong>Invoice #:</strong> {invoiceNumber}</div>
                <div><strong>Date:</strong> {new Date(date).toLocaleDateString("en-GB")}</div>
                <div><strong>Due Date:</strong> {dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "Upon Receipt"}</div>
              </div>
            </div>

            {description && (
              <div style={{ background: "rgba(255,255,255,0.96)", padding: "18px", borderRadius: "14px", marginBottom: "32px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", fontSize: "14.5px" }}>
                <strong>Project Description:</strong><br />{description}
              </div>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
              <thead>
                <tr style={{ background: "linear-gradient(90deg, #2c3e50, #34495e)", color: "#fff" }}>
                  <th style={{ padding: "14px", textAlign: "left", borderRadius: "10px 0 0 10px" }}>Description</th>
                  <th style={{ padding: "14px", textAlign: "right", borderRadius: "0 10px 10px 0" }}>Amount ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.desc || i.amt).map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "rgba(52,152,219,0.04)" : "transparent" }}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{item.desc || "-"}</td>
                    <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #eee" }}>{parseFloat(item.amt || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", borderTop: "3px double #2c3e50" }}>
                  <td style={{ padding: "16px", fontSize: "18px" }}>TOTAL</td>
                  <td style={{ padding: "16px", textAlign: "right", fontSize: "18px", color: "#27ae60" }}>{total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontSize: "13px", lineHeight: "1.6", background: "rgba(255,255,255,0.95)", padding: "16px", borderRadius: "12px", boxShadow: "0 3px 12px rgba(0,0,0,0.08)" }}>
              <strong>Payment Details:</strong><br />
              <pre style={{ margin: "8px 0 0", fontFamily: "inherit", whiteSpace: "pre-wrap" }}>{currentBankDetails || "Please select bank details"}</pre>
            </div>

            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-35deg)",
              fontSize: "130px", fontWeight: "900", color: status === "Paid" ? "rgba(40,167,69,0.18)" : "rgba(231,76,60,0.18)",
              pointerEvents: "none", zIndex: 5, letterSpacing: "8px"
            }}>
              {status.toUpperCase()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}