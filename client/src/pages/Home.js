import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import {
  Restaurant,
  LocalPizza,
  ShoppingCart,
  Security,
} from '@mui/icons-material';

const features = [
  {
    title: 'Customize Your Pizza',
    description: 'Create your perfect pizza with our wide range of toppings, sauces, and cheeses.',
    icon: <LocalPizza sx={{ fontSize: 60 }} />,
  },
  {
    title: 'Easy Ordering',
    description: 'Place your order with just a few clicks and track its status in real-time.',
    icon: <ShoppingCart sx={{ fontSize: 60 }} />,
  },
  {
    title: 'Secure Payments',
    description: 'Enjoy safe and secure payments with our integrated payment system.',
    icon: <Security sx={{ fontSize: 60 }} />,
  },
  {
    title: 'Quality Ingredients',
    description: 'We use only the freshest ingredients to ensure the best taste.',
    icon: <Restaurant sx={{ fontSize: 60 }} />,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Pizza Management System
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Create, Order, and Enjoy Your Perfect Pizza
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/pizza-builder' : '/login')}
            sx={{ mt: 4 }}
          >
            {isAuthenticated ? 'Build Your Pizza' : 'Get Started'}
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Order?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Join us today and experience the best pizza ordering system.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/pizza-builder' : '/register')}
            sx={{ mt: 2 }}
          >
            {isAuthenticated ? 'Order Now' : 'Sign Up Now'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 