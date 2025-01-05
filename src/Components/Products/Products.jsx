import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../Supabase';
import ReactDOM from 'react-dom/client'; // For React 18+

import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Drawer,
  Badge,
  Fab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ProductCard from './ProductCard';
import CloseIcon from '@mui/icons-material/Close';
import Receipt  from '../Reciept/Reciept';
import { createRoot } from 'react-dom/client';
import MyContext from '../../Context/MyContext';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  const getProductsForCategories = async (category) => {
    try {
      setLoading(true);
      let query = supabase.from('Products').select('*', { count: 'exact' });

      if (category) {
        query = query.eq('product_type', category);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setProducts(data);
      setFilteredProducts(data);
      setTotalCount(count);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (e) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getAllProductsCategories = async () => {
    try {
      const { data, error } = await supabase.from('Products').select('product_type');

      if (error) {
        setError(error.message);
        return;
      }

      const uniqueProductTypes = [...new Set(data.map((item) => item.product_type))];
      setProductTypes(uniqueProductTypes);
    } catch (e) {
      setError('An unexpected error occurred');
    }
  };
const{userName}=useContext(MyContext);
  useEffect(() => {
    if(!userName){navigate('/login');}
    getAllProductsCategories();
    const queryParams = new URLSearchParams(location.search);
  
    const category = queryParams.get('category');
    setSelectedCategory(category || '');
    getProductsForCategories(category);
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category) {
      navigate(`?category=${category}`, { replace: true });
    } else {
      navigate('', { replace: true });
    }
    getProductsForCategories(category);
  };


const handleCheckOut = () => {
  const products = cart.map(item => ({
    id: item.id,
    description: `${item.product_name}`,
    quantity: item.quantity,
  }));

  // Create and mount Receipt component directly
  const receiptDiv = document.createElement('div');
  receiptDiv.style.display = 'none';
  document.body.appendChild(receiptDiv);
  console.log("selected category", selectedCategory);

  const root = createRoot(receiptDiv); // Create a root using React 18 API

  if (selectedCategory === 'Plumber') {
    root.render(
      <Receipt 
        customerName={customerName} 
        products={products} 
        type={'Plumbing'}
      />
    );
  } else {
    root.render(
      <Receipt 
        customerName={customerName} 
        products={products} 
        type={selectedCategory}
      />
    );
  }

  // Cleanup after PDF generation
  setTimeout(() => {
    root.unmount(); // Correct way to unmount the root in React 18
    document.body.removeChild(receiptDiv); // Remove the receiptDiv from the body
  }, 4000);
};

  useEffect(() => {
    const filtered = products.filter(product =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPage(1);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [searchTerm, products]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const addToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const updateCartItemQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const {customerName}=useContext(MyContext);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Products
        </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Customer: {customerName}
        </Typography>


        <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
          <FormControl variant="outlined" sx={{ minWidth: 100 }}>
            <InputLabel id="category-label">Product Category</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Product Category"
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {productTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} onAddToCart={addToCart}   isInCart={cart.some(item => item.id === product.id)}/>
            </Grid>
          ))}
        </Grid>

        <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length} products
          </Typography>
        </Stack>
      </Paper>

      <Fab
        color="primary"
        aria-label="cart"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={toggleCart}
      >
        <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      <Drawer anchor="right" open={isCartOpen} onClose={toggleCart}>
        <Box sx={{ width: 350, p: 2, position: 'relative' }}>
          <IconButton
            edge="end"
            aria-label="close"
            onClick={toggleCart}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Shopping Cart
          </Typography>

          <List>
            {cart.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.product_name}
                    secondary={
                      <ButtonGroup size="small" sx={{ mt: 1 }}>
                        <Button
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>
                        <Button disabled>
                          {item.quantity}
                        </Button>
                        <Button
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </ButtonGroup>
                    }
                  />
               
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Button type="primary" onClick={handleCheckOut}>
                          Checkout
                        </Button>
          {cart.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              Your cart is empty
            </Typography>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default Products;