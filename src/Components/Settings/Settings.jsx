import React, { useContext, useEffect, useState } from 'react';
import Team from './Team';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import MyContext from '../../Context/MyContext'; // Ensure your context is imported correctly
import { useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import ProductManagement from './ProductManagemet.jsx/ProductManagement';

const AllReceipts = () => {
  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h6">All Receipts</Typography>
      <Typography variant="body1">All receipts content goes here.</Typography>
    </Box>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { logged } = useContext(MyContext); // Get logged status from context
  const navigate = useNavigate(); // Initialize navigate hook

  // Redirect to login if not logged in
  useEffect(() => {
    if (!logged) {
      navigate('/login');
    }
  }, [logged, navigate]); // Ensure useEffect runs when `logged` changes

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" padding={10} align='center'>
            Settings
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Receipts" />
            <Tab label="Team Management" />
            <Tab label="Product Management" />
          </Tabs>

          <Box sx={{ marginTop: 2 }}>
            {activeTab === 0 && <AllReceipts />}
            {activeTab === 1 && <Team />}
            {activeTab === 2 && <ProductManagement />}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
