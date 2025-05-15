import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  Person,
  Email,
} from '@mui/icons-material'

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const recentOrders = orders.slice(0, 3);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">Profile</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => navigate('/pizza-builder')}
              sx={{ mt: 2 }}
            >
              Order New Pizza
            </Button>
          </Paper>
        </Grid>

        {/* Recent Orders Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ShoppingCart sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">Recent Orders</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Card key={order._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order ID
                        </Typography>
                        <Typography variant="body1">{order._id}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color:
                              order.status === 'delivered'
                                ? 'success.main'
                                : order.status === 'cancelled'
                                ? 'error.main'
                                : 'primary.main',
                          }}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography variant="body1">
                          ₹{order.totalAmount.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                No orders found
              </Typography>
            )}
            {orders.length > 3 && (
              <Button
                variant="text"
                color="primary"
                fullWidth
                onClick={() => navigate('/orders')}
                sx={{ mt: 2 }}
              >
                View All Orders
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard; 