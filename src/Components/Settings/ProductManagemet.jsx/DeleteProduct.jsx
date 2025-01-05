import React, { useState, useEffect } from 'react';

import {
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { supabase } from '../../../Supabase';

const DeleteProductSection = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState('');
  const [itemToDelete, setItemToDelete] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory]);

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

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('product_type', selectedCategory);

      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setErrorMessage('Failed to fetch products');
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'category') {
        const { error } = await supabase
          .from('Products')
          .delete()
          .eq('product_type', itemToDelete);
        if (error) throw error;
        setSelectedCategory('');
        fetchCategories();
      } else {
        const { error } = await supabase
          .from('Products')
          .delete()
          .eq('product_type', selectedCategory)
          .eq('product_name', itemToDelete);
        if (error) throw error;
        setSelectedProduct('');
        fetchProducts();
      }

      setSuccessMessage(`${deleteType === 'category' ? 'Category' : 'Product'} deleted successfully!`);
      setOpenDeleteDialog(false);
    } catch (error) {
      setErrorMessage(`Failed to delete ${deleteType}`);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Delete Category or Product
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
                    <IconButton
                      size="small"
                      sx={{ ml: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteType('category');
                        setItemToDelete(category);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteSweepIcon color="error" />
                    </IconButton>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCategory && (
              <FormControl fullWidth size="small">
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  label="Select Product"
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.product_name}>
                      {product.product_name}
                      <IconButton
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteType('product');
                          setItemToDelete(product.product_name);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>
          Delete {deleteType === 'category' ? 'Category' : 'Product'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the {deleteType} "{itemToDelete}"?
            {deleteType === 'category' && " This will delete all products in this category."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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

export default DeleteProductSection;

