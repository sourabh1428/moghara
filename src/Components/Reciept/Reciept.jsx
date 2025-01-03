import React, { useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Mail, Globe, Phone, MapPin } from 'lucide-react';
import logo from '../../assets/Header.png'
const Receipt = ({ customerName, products }) => {
  useEffect(() => {
    const element = document.getElementById('receipt');
    const opt = {
      margin: 10,
      filename: `receipt-${customerName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  }, [customerName]);

  const styles = {
    receipt: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    logo: {
      maxWidth: '100%',
      height: 'auto',
      marginBottom: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: '8px',
    },
    divider: {
      borderTop: '1px solid #e0e0e0',
      margin: '24px 0',
    },
    customerInfo: {
      marginBottom: '24px',
    },
    customerName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: '4px',
    },
    date: {
      fontSize: '14px',
      color: '#666666',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '24px',
    },
    tableHeader: {
      backgroundColor: '#f8f8f8',
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'left',
      padding: '12px',
      borderBottom: '2px solid #e0e0e0',
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      color: '#333333',
    },
    footer: {
      textAlign: 'center',
      color: '#666666',
      fontSize: '14px',
    },
    contactInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
    icon: {
      marginRight: '8px',
    },
    links: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '16px',
    },
    link: {
      color: '#0066cc',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      marginRight: '16px',
    },
  };

  return (
    <div id="receipt" style={styles.receipt}>
      <div style={styles.header}>
        <img 
          src={logo}
          alt="Company Logo" 
          style={styles.logo}
        />
        <h1 style={styles.title}>Receipt</h1>
      </div>
      
      <div style={styles.divider}></div>
      
      <div style={styles.customerInfo}>
        <h2 style={styles.customerName}>Customer: {customerName}</h2>
        <p style={styles.date}>Date: {new Date().toLocaleDateString()}</p>
      </div>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>S. No</th>
            <th style={styles.tableHeader}>Description</th>
            <th style={styles.tableHeader}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td style={styles.tableCell}>{index + 1}</td>
              <td style={styles.tableCell}>{product.description}</td>
              <td style={styles.tableCell}>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={styles.divider}></div>
      
      <div style={styles.footer}>
        <div style={styles.contactInfo}>
          <Phone style={styles.icon} size={16} />
          <span>Call: 8658899497, 9437884397 | WhatsApp: 918752352</span>
        </div>
        <div style={styles.contactInfo}>
          <MapPin style={styles.icon} size={16} />
          <span>Lucky Complex, 1st floor, Panikolli, Jajpur, Odisha. (755043)</span>
        </div>
        <div style={styles.links}>
          <a href="mailto:mogharaservies@gmail.com" style={styles.link}>
            <Mail style={styles.icon} size={16} />
            mogharaservies@gmail.com
          </a>
          <a href="https://moghara.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
            <Globe style={styles.icon} size={16} />
            moghara.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Receipt;

