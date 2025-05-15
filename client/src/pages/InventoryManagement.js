import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInventory,
  updateInventoryItem,
  addInventoryItem,
  deleteInventoryItem,
} from '../redux/slices/inventorySlice';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { bases, sauces, cheeses, toppings, loading, error } = useSelector(
    (state) => state.inventory
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    minimumQuantity: '',
    category: '',
  });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        minimumQuantity: item.minimumQuantity,
        category: item.category,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        price: '',
        quantity: '',
        minimumQuantity: '',
        category: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      price: '',
      quantity: '',
      minimumQuantity: '',
      category: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      minimumQuantity: parseInt(formData.minimumQuantity),
    };

    if (selectedItem) {
      await dispatch(updateInventoryItem({ id: selectedItem._id, ...itemData }));
    } else {
      await dispatch(addInventoryItem(itemData));
    }
    handleCloseDialog();
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await dispatch(deleteInventoryItem(item._id));
    }
  };

  const renderInventorySection = (title, items, category) => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog({ category })}
          sx={{ ml: 2 }}
        >
          Add New
        </Button>
      </Box>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Price: ${item.price.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  color={item.quantity <= item.minimumQuantity ? 'error' : 'text.secondary'}
                >
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Minimum Quantity: {item.minimumQuantity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h5">Inventory Management</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderInventorySection('Pizza Bases', bases, 'base')}
        {renderInventorySection('Sauces', sauces, 'sauce')}
        {renderInventorySection('Cheeses', cheeses, 'cheese')}
        {renderInventorySection('Toppings', toppings, 'topping')}
      </Paper>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ step: '0.01', min: '0' }}
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ min: '0' }}
            />
            <TextField
              fullWidth
              label="Minimum Quantity"
              name="minimumQuantity"
              type="number"
              value={formData.minimumQuantity}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ min: '0' }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              <MenuItem value="base">Pizza Base</MenuItem>
              <MenuItem value="sauce">Sauce</MenuItem>
              <MenuItem value="cheese">Cheese</MenuItem>
              <MenuItem value="topping">Topping</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={
              !formData.name ||
              !formData.price ||
              !formData.quantity ||
              !formData.minimumQuantity ||
              !formData.category
            }
          >
            {selectedItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InventoryManagement; 