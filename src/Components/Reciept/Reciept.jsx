import React, { useContext, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Mail, Globe, Phone, MapPin } from 'lucide-react';
import logo from '../../assets/Header.png';
import WhatsApp from '../../assets/whatsapp.svg';
import { supabase } from '../../Supabase';
import MyContext from '../../Context/MyContext';

// CSS styles for print media
const printStyles = `
@media print {
  .page {
    page-break-after: auto;
    page-break-inside: avoid;
    page-break-before: auto;
    margin: 0;
  }
  table {
    page-break-inside: avoid;
  }
}
`;

const Receipt = ({ customerName = "Customer", products = [], type = "Receipt" }) => {
  const contextValue = useContext(MyContext);
  const userName = contextValue?.userName || "Admin";
  const ITEMS_PER_PAGE = 10;

  const splitIntoPages = (items) => {
    if (!items?.length) return [];
    return Array.from({ length: Math.ceil(items.length / ITEMS_PER_PAGE) }, (_, i) =>
      items.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE)
    );
  };

  const generatePDF = async () => {
    try {
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = printStyles;
      document.head.appendChild(styleSheet);

      const element = document.getElementById("receipt-container");
      if (!element) return;

      const options = {
        margin: 0,
        filename: `receipt-${customerName}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().from(element).set(options).save();

      document.head.removeChild(styleSheet);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  };

  const saveToDatabase = async (publicUrl) => {
    try {
      await supabase
        .from("Receipts")
        .insert([
          {
            Customer: customerName,
            Createdby: userName,
            url: publicUrl,
          },
        ])
        .select();
    } catch (error) {
      console.error("Database Error:", error);
    }
  };

  useEffect(() => {
    if (customerName && products?.length > 0) {
      generatePDF();
    }
  }, [customerName, products]);

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      lineHeight: "1.5",
      backgroundColor: "#fff",
      width: "210mm",
      margin: "0 auto",
    },
    page: {
      padding: "20mm",
      boxSizing: "border-box",
      backgroundColor: "#fff",
      minHeight: "297mm",
      display: "flex",
      flexDirection: "column",
    },
    headerContainer: {
      marginBottom: "30px",
      textAlign: "center",
    },
    logo: {
      maxWidth: "100%",
      height: "80px",
      objectFit: "contain",
    },
    mainDivider: {
      borderTop: "8px solid #5e5e5e",
      margin: "15px 0",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      margin: "10px 0",
    },
    customerInfo: {
      marginBottom: "20px",
    },
    customerName: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "red",
      marginBottom: "5px",
    },
    contentWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "30px",
    },
    th: {
      backgroundColor: "#f8f8f8",
      color: "skyblue",
      padding: "12px",
      border: "2px solid black",
      textAlign: "left",
      fontWeight: "bold",
    },
    td: {
      padding: "12px",
      border: "1px solid black",
      color: "#333",
    },
    footer: {
      borderTop: "1px solid #eee",
      padding: "20px 0",
      textAlign: "center",
      marginTop: "auto",
    },
    contactInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "8px",
    },
    links: {
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      marginTop: "16px",
    },
    link: {
      color: "#0066cc",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    whatsapp: {
      height: "20px",
      width: "20px",
    },
  };

  const Header = () => (
    <div style={styles.headerContainer}>
      <img src={logo} alt="Company Logo" style={styles.logo} />
      <div style={styles.mainDivider} />
      <h1 style={styles.title}>{type}</h1>
    </div>
  );

  const ProductTable = ({ items, startIndex }) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>S. No</th>
          <th style={styles.th}>Description</th>
          <th style={styles.th}>Quantity</th>
          <th style={styles.th}>Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={item.id || idx}>
            <td style={styles.td}>{startIndex + idx + 1}</td>
            <td style={styles.td}>{item.description}</td>
            <td style={styles.td}>{item.quantity}</td>
            <td style={styles.td}>{item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const Footer = () => (
    <div style={styles.footer}>
      <div style={styles.contactInfo}>
        <Phone size={16} />
        <span>Call: 8658899497, 9437884397</span>
        <img src={WhatsApp} alt="WhatsApp" style={styles.whatsapp} />
        <span>918752352</span>
      </div>
      <div style={styles.contactInfo}>
        <MapPin size={16} />
        <span>Lucky Complex, 1st floor, Panikolli, Jajpur, Odisha. (755043)</span>
      </div>
      <div style={styles.links}>
        <a href="mailto:mogharaservies@gmail.com" style={styles.link}>
          <Mail size={16} />mogharaservies@gmail.com
        </a>
        <a href="https://moghara.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
          <Globe size={16} />moghara.com
        </a>
      </div>
    </div>
  );

  const pages = splitIntoPages(products);

  if (!products?.length) return null;

  return (
    <div id="receipt-container" style={styles.container}>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} style={styles.page} className="page">
          <Header />
          <div style={styles.customerInfo}>
            <h2 style={styles.customerName}>Customer: {customerName}</h2>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
          <div style={styles.contentWrapper}>
            <ProductTable items={pageItems} startIndex={pageIndex * ITEMS_PER_PAGE} />
            <Footer />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Receipt;