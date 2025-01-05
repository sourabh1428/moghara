import React, { useState, useEffect } from 'react';

import {
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../../../Supabase';

const AddProductSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('Products')
        .select('product_type', { distinct: true });

      if (error) throw error;
      const uniqueCategories = [...new Set(data.map(item => item.product_type))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setErrorMessage('Failed to fetch categories');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrorMessage('Category name cannot be empty');
      return;
    }

    try {
      const { error } = await supabase.from('Products').insert([
        { product_name: 'Category Placeholder', product_type: newCategoryName.trim() },
      ]);

      if (error) throw error;

      setSuccessMessage('New category added successfully!');
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      setErrorMessage('Failed to add new category');
    }
  };

  const handleAddProduct = async () => {
    if (!selectedCategory || !newProductName.trim()) {
      setErrorMessage('Both category and product name are required');
      return;
    }

    try {
      const { error } = await supabase.from('Products').insert([
        { product_name: newProductName.trim(), product_type: selectedCategory },
      ]);

      if (error) throw error;

      setSuccessMessage('Product added successfully!');
      setNewProductName('');
    } catch (error) {
      setErrorMessage('Failed to add product');
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Category
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleAddCategory}
              startIcon={<AddIcon />}
            >
              Add Category
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Product
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Select Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCategory && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="New Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleAddProduct}
                  startIcon={<AddIcon />}
                >
                  Add Product
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={() => {
          setSuccessMessage('');
          setErrorMessage('');
        }}
      >
        <Alert
          onClose={() => {
            setSuccessMessage('');
            setErrorMessage('');
          }}
          severity={successMessage ? 'success' : 'error'}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProductSection;

