import React, { useState, useEffect } from 'react';
import { supabase } from '../../Supabase';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  CircularProgress, 
  Card, 
  CardContent, 
  Divider, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Container
} from '@mui/material';
import { 
  AccessTime, 
  Download, 
  Delete, 
  Search,
  Sort,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const AllReceipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Fetch receipts from Supabase
  useEffect(() => {
    const fetchReceipts = async () => {
      const { data, error } = await supabase
        .from('Receipts')
        .select('created_at, Customer, Createdby, url, id');

      if (error) {
        console.error('Error fetching receipts:', error.message);
      } else {
        setReceipts(data);
        setFilteredReceipts(data);
      }
      setLoading(false);
    };

    fetchReceipts();
  }, []);

  // Handle search and sort
  useEffect(() => {
    let result = [...receipts];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(receipt =>
        receipt.Customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredReceipts(result);
  }, [searchTerm, sortOrder, receipts]);

  const handleDownload = (url, filename) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDelete = async () => {
    if (selectedReceipt) {
      const { id } = selectedReceipt;
      const { error } = await supabase
        .from('Receipts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting receipt:', error.message);
      } else {
        setReceipts(receipts.filter((receipt) => receipt.id !== id));
        setFilteredReceipts(filteredReceipts.filter((receipt) => receipt.id !== id));
      }
      setOpenDialog(false);
    }
  };

  const styles = {
    headerContainer: {
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '24px',
    },
    searchContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      alignItems: 'center',
    },
    card: {
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      },
    },
    actionButton: {
      borderRadius: '8px',
      textTransform: 'none',
      fontWeight: 600,
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Paper sx={styles.headerContainer} elevation={0}>
          

          {/* Search and Sort Controls */}
          <Box sx={styles.searchContainer}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ fontSize: '0.875rem', padding: '4px 8px' }}>
              <InputLabel>Sort by Date</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Sort by Date"
                startAdornment={
                  <InputAdornment position="start">
                    <Sort />
                  </InputAdornment>
                }
              >
                <MenuItem value="newest"sx={{ fontSize: '0.875rem', padding: '4px 8px' }}>Newest First</MenuItem>
                <MenuItem value="oldest"sx={{ fontSize: '0.875rem', padding: '4px 8px' }}>Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Receipt List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : filteredReceipts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No receipts found
            </Typography>
          </Paper>
        ) : (
          <List>
            {filteredReceipts.map((receipt) => (
              <ListItem key={receipt.id} sx={{ mb: 2, px: 0 }}>
                <Card sx={{ ...styles.card, width: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {receipt.Customer}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(receipt.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Created by: {receipt.Createdby}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownload(receipt.url, `receipt-${receipt.Customer}.pdf`)}
                        sx={styles.actionButton}
                        startIcon={<Download />}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setSelectedReceipt(receipt);
                          setOpenDialog(true);
                        }}
                        sx={styles.actionButton}
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the receipt for {selectedReceipt?.Customer}?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ ...styles.actionButton, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              color="error"
              variant="contained"
              sx={{ ...styles.actionButton, px: 3 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AllReceipt;