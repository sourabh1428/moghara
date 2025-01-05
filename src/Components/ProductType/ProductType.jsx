import React, { useContext, useEffect, useState } from 'react';
import { supabase } from '../../Supabase';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Button, 
  Typography, 
  Container, 
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MyContext from '../../Context/MyContext';
import { styled } from '@mui/system';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CategoryIcon from '@mui/icons-material/Category';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  
}));

const StyledBox = styled(Box)(({ theme }) => ({

  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  width: '100%',
  maxWidth: 400,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.dark,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),

  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  
}));

const ProductType = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const { customerName, setCustomerName ,logged} = useContext(MyContext);
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userName } = useContext(MyContext);

  async function getCategories() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('Products').select('product_type');

      if (error) {
        setError(error.message);
        return;
      }

      const uniqueProductTypes = [...new Set(data.map((item) => item.product_type))];
      setProductTypes(uniqueProductTypes);
    } catch (e) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
    if (!userName || logged==false) {
      navigate('/login');
    }
  }, [userName, navigate]);

  const handleProductTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleNameChange = (event) => {
    setCustomerName(event.target.value);
  };

  const handleMobileChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleProceed = () => {
    if (!selectedType || !customerName || !mobileNumber) {
      setError('Please fill out all fields');
      return;
    }
    navigate(`/Products?category=${selectedType}`);
  };

  return (
    <StyledContainer>
      <StyledBox>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Product Selection
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
          Welcome back, {userName}!
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <form noValidate>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="product-type-label">Product Type</InputLabel>
              <Select
                labelId="product-type-label"
                value={selectedType}
                onChange={handleProductTypeChange}
                label="Product Type"
                startAdornment={<CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />}
              >
                {productTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <StyledTextField
              fullWidth
              required
              id="customerName"
              label="Customer Name"
              value={customerName}
              onChange={handleNameChange}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />,
              }}
            />

            <StyledTextField
              fullWidth
              required
              id="mobileNumber"
              label="Mobile Number"
              value={mobileNumber}
              onChange={handleMobileChange}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />,
              }}
            />

            <StyledButton
              fullWidth
              variant="contained"
              onClick={handleProceed}
            >
              Proceed to Products
            </StyledButton>
          </form>
        )}
      </StyledBox>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ProductType;

