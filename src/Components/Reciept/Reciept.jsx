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
  .header, .footer {
    position: fixed;
    left: 0;
    right: 0;
    padding: 20px;
  }
  .header {
    top: 0;
  }
  .footer {
    bottom: 0;
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
      const element = document.getElementById("receipt-container");
      if (!element) return;

      const options = {
        margin: [],
        filename: `receipt-${customerName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          scrollY: 0,
          windowWidth: 794, // A4 width in pixels
          windowHeight: 1123 // A4 height in pixels
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait",
          compress: true
        }
      };

      // Generate PDF as blob
      const pdf = await html2pdf().from(element).set(options).outputPdf('blob');
      
      // Upload to Supabase Storage
      const timestamp = new Date().getTime();
      const filePath = `${customerName}-${timestamp}.pdf`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reciepts')
        .upload(filePath, pdf, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('reciepts')
        .getPublicUrl(filePath);

      // Save to Receipts table
      await saveToDatabase(publicUrl);

      // Also save as local file
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${customerName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  };

  const saveToDatabase = async (publicUrl) => {
    try {
      const { data, error } = await supabase
        .from("Receipts")
        .insert([
          {
            Customer: customerName,
            Createdby: userName,
            url: publicUrl,
            created_at: new Date().toISOString()
          },
        ])
        .select();

      if (error) {
        throw new Error(`Database insert failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Database Error:", error);
      throw error;
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
      position: "relative",
    },
    page: {
      padding: "20mm",
      boxSizing: "border-box",
      backgroundColor: "#fff",
      height: "297mm",
      position: "relative",
      overflow: "hidden",
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
          <ProductTable items={pageItems} startIndex={pageIndex * ITEMS_PER_PAGE} />
          <Footer />
        </div>
      ))}
    </div>
  );
};

export default Receipt;
