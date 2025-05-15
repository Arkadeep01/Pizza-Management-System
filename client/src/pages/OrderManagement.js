import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders,
  updateOrderStatus,
  fetchOrderStatistics,
} from '../redux/slices/orderSlice';
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
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  Visibility,
  CheckCircle,
  Cancel,
  Pending,
  LocalShipping,
  FilterList,
  Sort,
} from '@mui/icons-material';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, statistics, loading, error } = useSelector(
    (state) => state.order
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchOrderStatistics());
  }, [dispatch]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    await dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Pending color="warning" />;
      case 'preparing':
        return <LocalShipping color="info" />;
      case 'ready':
        return <CheckCircle color="success" />;
      case 'delivered':
        return <CheckCircle color="success" />;
      case 'cancelled':
        return <Cancel color="error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning.main';
      case 'preparing':
        return 'info.main';
      case 'ready':
        return 'success.main';
      case 'delivered':
        return 'success.main';
      case 'cancelled':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          order._id.toLowerCase().includes(searchTerm) ||
          order.user.name.toLowerCase().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-desc':
          return b.totalAmount - a.totalAmount;
        case 'amount-asc':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

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
          <ShoppingCart sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h5">Order Management</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h4">
                  {statistics?.totalOrders || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Orders
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {statistics?.pendingOrders || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Revenue
                </Typography>
                <Typography variant="h4" color="success.main">
                  ₹{statistics?.todayRevenue?.toFixed(2) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Order Value
                </Typography>
                <Typography variant="h4" color="primary.main">
                  ₹{statistics?.averageOrderValue?.toFixed(2) || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Sort Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="preparing">Preparing</MenuItem>
              <MenuItem value="ready">Ready</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <MenuItem value="date-desc">Date (Newest First)</MenuItem>
              <MenuItem value="date-asc">Date (Oldest First)</MenuItem>
              <MenuItem value="amount-desc">Amount (High to Low)</MenuItem>
              <MenuItem value="amount-asc">Amount (Low to High)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by Order ID or Customer"
            />
          </Grid>
        </Grid>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1">{order._id}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography variant="body1">{order.user.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(order.status)}
                      <Typography
                        variant="body1"
                        sx={{ ml: 1, color: getStatusColor(order.status) }}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="body1">
                      ₹{order.totalAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleStatusUpdate(order._id, getNextStatus(order.status))
                      }
                    >
                      Mark as {getNextStatus(order.status)}
                    </Button>
                    {order.status !== 'cancelled' && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        sx={{ ml: 1 }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
            No orders found
          </Typography>
        )}
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <Typography variant="body1">
                    Order ID: {selectedOrder._id}
                  </Typography>
                  <Typography variant="body1">
                    Customer: {selectedOrder.user.name}
                  </Typography>
                  <Typography variant="body1">
                    Status: {selectedOrder.status}
                  </Typography>
                  <Typography variant="body1">
                    Total Amount: ₹{selectedOrder.totalAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    Date: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Pizza Details
                  </Typography>
                  <Typography variant="body1">
                    Base: {selectedOrder.base.name}
                  </Typography>
                  <Typography variant="body1">
                    Sauce: {selectedOrder.sauce.name}
                  </Typography>
                  <Typography variant="body1">
                    Cheese: {selectedOrder.cheese.name}
                  </Typography>
                  {selectedOrder.toppings.length > 0 && (
                    <>
                      <Typography variant="body1">Toppings:</Typography>
                      {selectedOrder.toppings.map((topping) => (
                        <Typography key={topping._id} variant="body2" sx={{ ml: 2 }}>
                          • {topping.name}
                        </Typography>
                      ))}
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderManagement; 