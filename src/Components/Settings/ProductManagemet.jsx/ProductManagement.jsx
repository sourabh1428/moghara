import React, { useState } from 'react';
import { Container, Paper, Typography, Tabs, Tab, Box } from '@mui/material';

import DeleteProductSection from './DeleteProduct';
import AddProductSection from './AddProduct';

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
      
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="product management tabs">
            <Tab label="Add Products" />
            <Tab label="Delete Products" />
          </Tabs>
        </Box>

        {activeTab === 0 && <AddProductSection />}
        {activeTab === 1 && <DeleteProductSection />}
      </Paper>
    </Container>
  );
};

export default ProductManagement;

