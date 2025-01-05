import React, { useEffect, useState } from 'react';
import { supabase } from '../../Supabase';
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Box,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [openNewCategoryDialog, setOpenNewCategoryDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState('');
  const [itemToDelete, setItemToDelete] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('Products')
        .select('product_type', { distinct: true });

      if (categoryError) throw categoryError;
      const uniqueCategories = [...new Set(categoryData.map(item => item.product_type))];
      setCategories(uniqueCategories);

      if (selectedCategory) {
        const { data: productData, error: productError } = await supabase
          .from('Products')
          .select('*')
          .eq('product_type', selectedCategory);

        if (productError) throw productError;
        setProducts(productData);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setErrorMessage('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedProduct('');
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
      setOpenNewCategoryDialog(false);
      fetchData();
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
      fetchData();
    } catch (error) {
      setErrorMessage('Failed to add product');
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
      } else {
        const { error } = await supabase
          .from('Products')
          .delete()
          .eq('product_type', selectedCategory)
          .eq('product_name', itemToDelete);
        if (error) throw error;
        setSelectedProduct('');
      }

      setSuccessMessage(`${deleteType === 'category' ? 'Category' : 'Product'} deleted successfully!`);
      setOpenDeleteDialog(false);
      fetchData();
    } catch (error) {
      setErrorMessage(`Failed to delete ${deleteType}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4 }}>
          Product Management
        </Typography>

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
                  onChange={(e) => handleCategoryChange(e.target.value)}
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
                <>
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
                </>
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
      </Paper>
    </Container>
  );
};

export default AddProduct;

