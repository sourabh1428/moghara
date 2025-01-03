import React, { useContext, useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import headerImg from '../../assets/Header.png'
import MyContext from '../../Context/MyContext';
const Receipt = ({ customerName, products }) => {



  useEffect(() => {
    if (headerImg) {
      const element = document.getElementById('receipt');
      const opt = {
        margin: 1,
        filename: `receipt-${customerName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    }
  }, [headerImg, customerName]);

  if (!headerImg) return null;

  return (
    <div id="receipt" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img 
          src={headerImg}
          alt="Header" 
          style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
        />
      </div>
      
      {/* Rest of the component remains the same */}
      <div style={{ borderTop: '1px solid #dddddd', marginBottom: '20px' }}></div>
      
      <h1 style={{ fontSize: '19px', fontWeight: 700 }}>Customer Name: {customerName}</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={tableHeaderStyle}>S. No</th>
            <th style={tableHeaderStyle}>Description</th>
            <th style={tableHeaderStyle}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>{product.description}</td>
              <td style={tableCellStyle}>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ borderTop: '1px solid #dddddd', margin: '20px 0' }}></div>
      
      <div style={{ textAlign: 'center', fontSize: '12px', fontFamily: '"Droid Serif", Georgia, Times, serif' }}>
        <p style={{ margin: '5px 0' }}><strong>For any queries Call: 8658899497, 9437884397, Whatsapp: 918752352</strong></p>
        <p style={{ margin: '5px 0' }}><strong>Address: Lucky Complex, 1st floor, Panikolli, Jajpur, Odisha. (755043)</strong></p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="mailto:mogharaservies@gmail.com" style={socialLinkStyle}>
          <img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/mail@2x.png" alt="Email" width={32} height={32} />
        </a>
        <a href="https://moghara.com" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
          <img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/website@2x.png" alt="Website" width={32} height={32} />
        </a>
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  padding: '10px',
  border: '1px solid #dddddd',
  textAlign: 'center',
  fontWeight: 700,
};

const tableCellStyle = {
  padding: '10px',
  border: '1px solid #dddddd',
  textAlign: 'center',
};

const socialLinkStyle = {
  display: 'inline-block',
  margin: '0 10px',
  textDecoration: 'none',
};

export default Receipt;