import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  CardMedia,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event) => {
    setQuantity(Math.max(1, parseInt(event.target.value) || 1));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        border: isInCart ? '2px solid green' : 'none', // Highlight with green border if in cart
        
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      {/* Uncomment for product image */}
      {/* <CardMedia
        component="img"
        height="140"
        image={product.image_url || 'https://via.placeholder.com/140'}
        alt={product.product_name}
      /> */}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {product.product_name}
        </Typography>
        {/* Uncomment for product type */}
        {/* <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.product_type}
        </Typography> */}
        {/* Uncomment for product price */}
        {/* <Typography variant="h6" color="primary">
          ${product.price ? product.price.toFixed(2) : 'N/A'}
        </Typography> */}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <TextField
          type="number"
          label="Qty"
          value={quantity}
          onChange={handleQuantityChange}
          inputProps={{ min: 1 }}
          size="small"
          sx={{ width: '70px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          startIcon={<AddShoppingCartIcon />}
          disabled={isInCart} // Disable button if the product is already in the cart
        >
          {isInCart ? 'Added to Cart' : 'Add to Cart'} {/* Change button text if in cart */}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
