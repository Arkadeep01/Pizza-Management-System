import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { showToast } from '../common/Toast';

const PaymentForm = ({ order, onSuccess, onFailure }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();

    if (!res) {
      showToast.error('Razorpay SDK failed to load');
      return;
    }

    try {
      // Create order on your backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: order.totalAmount * 100, // Convert to paise
          orderId: order._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Pizza Management System',
        description: `Order #${order._id}`,
        order_id: data.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        handler: async function (response) {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch(
              `${process.env.REACT_APP_API_URL}/api/orders/verify-payment`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                  orderId: order._id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            showToast.success('Payment successful!');
            if (onSuccess) onSuccess(verifyData);
          } catch (error) {
            showToast.error(error.message || 'Payment verification failed');
            if (onFailure) onFailure(error);
          }
        },
        modal: {
          ondismiss: function () {
            showToast.info('Payment cancelled');
            if (onFailure) onFailure(new Error('Payment cancelled'));
          },
        },
        theme: {
          color: '#1976d2',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      showToast.error(error.message || 'Failed to initiate payment');
      if (onFailure) onFailure(error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Typography variant="body1">
          Total Amount: ₹{order.totalAmount.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePayment}
          sx={{ mt: 2 }}
        >
          Pay Now
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentForm; 