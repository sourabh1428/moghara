import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Mail, Globe, Phone, MapPin } from 'lucide-react';
import logo from '../../assets/Header.png'
import { BorderLeft, BorderRight } from '@mui/icons-material';
import  WhatsApp from '../../assets/whatsapp.svg'
import { supabase } from '../../Supabase';


const Receipt = ({ customerName, products ,type }) => {
  const[cat,setCat]=useState('');


  useEffect(() => {
    const generateAndUploadPDF = async () => {
      const element = document.getElementById('receipt');
      const opt = {
        margin: 10,
        filename: `receipt-${customerName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
  
      // Generate the PDF as a Blob
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
  
      // Trigger the download
      const pdfUrl = URL.createObjectURL(pdfBlob); // Create a URL for the blob
      const link = document.createElement('a'); // Create a link element
      link.href = pdfUrl; // Set the link to the PDF Blob URL
      link.download = `receipt-${customerName}.pdf`; // Set the filename
      link.click(); // Simulate a click to start the download
  
      // Upload the PDF to Supabase
      const fileName = `receipts/receipt-${customerName}-${Date.now()}.pdf`;
      const { data, error } = await supabase.storage
        .from('receipts') // Replace with your Supabase bucket name
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
        });
  
      if (error) {
        console.error('Error uploading PDF to Supabase:', error.message);
      } else {
        console.log('PDF uploaded successfully:', data);
      }
    };
  
    generateAndUploadPDF();
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
     marginTop:'-50px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: '8px',
    },
    dividerMain:{
      borderTop: '8px solid rgb(94, 94, 94)',
      margin: '30px ',
    },
    divider: {
      borderTop: '1px solid rgb(0, 0, 0)',
      margin: '24px 0',
    },
    customerInfo: {
      marginBottom: '24px',
    },
    customerName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'red',
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
      borderLeft:"2px solid black",
      borderTop:"2px solid black",
      borderRight: '2px solid rgb(0, 0, 0)', // Adds right border for vertical rows
    },
    tableHeader: {
      backgroundColor: '#f8f8f8',
      fontWeight: 'bold',
      color: 'skyblue',
      textAlign: 'left',
      padding: '12px',
      
      borderRight: '2px solid rgb(0, 0, 0)', // Adds right border for vertical rows
      borderBottom: '2px solid rgb(0, 0, 0)',
    },
    tableCell: {
      padding: '12px',
      borderRight: '1px solid rgb(0, 0, 0)', // Adds right border for vertical rows
      borderBottom: '1px solid rgb(0, 0, 0)', // Adds bottom border for table cells
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
    whataspp:{
      marginLeft:'10px',
      height:'20px',
      width:'20px',
      fill:'#4caf50'
    },
    spann:{
      display: 'flex',
      align: 'center',
      gap:'10px'

    }
  };

  return (
    <div id="receipt" style={styles.receipt}>
      <div style={styles.header}>
        <img 
          src={logo}
          alt="Company Logo" 
          style={styles.logo}
        />
         <div style={styles.dividerMain}></div>
        <h1 style={styles.title}>{type}</h1>
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
            <th style={styles.tableHeader}>Price</th>  
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td style={styles.tableCell}>{index + 1}</td>
              <td style={styles.tableCell}>{product.description}</td>
              <td style={styles.tableCell}>{product.quantity}</td>
              <td style={styles.tableCell}></td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={styles.divider}></div>
      
      <div style={styles.footer}>
        <div style={styles.contactInfo}>
          <Phone style={styles.icon} size={16} />
          <span style={styles.spann}>Call: 8658899497, 9437884397 | <img style={styles.whataspp} src={WhatsApp}/>: 918752352</span>
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

