import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, clearError } from '../../redux/slices/authSlice';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    const verifyUserEmail = async () => {
      const result = await dispatch(verifyEmail(token));
      if (!result.error) {
        setVerificationStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
      }
    };

    verifyUserEmail();
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, token, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Email Verification
          </Typography>
          {verificationStatus === 'verifying' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Verifying your email...
              </Typography>
            </Box>
          )}
          {verificationStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Email verified successfully! Redirecting to login...
            </Alert>
          )}
          {verificationStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || 'Invalid or expired verification token'}
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail; 