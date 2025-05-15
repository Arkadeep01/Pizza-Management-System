import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPizzaBases,
  fetchSauces,
  fetchCheeses,
  fetchToppings,
  createOrder,
} from '../redux/slices/pizzaSlice';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ShoppingCart, LocalPizza } from '@mui/icons-material';

const PizzaBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    bases,
    sauces,
    cheeses,
    toppings,
    selectedBase,
    selectedSauce,
    selectedCheese,
    selectedToppings,
    loading,
    error,
  } = useSelector((state) => state.pizza);

  const [openDialog, setOpenDialog] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchPizzaBases());
    dispatch(fetchSauces());
    dispatch(fetchCheeses());
    dispatch(fetchToppings());
  }, [dispatch]);

  const calculateTotal = () => {
    let total = 0;
    if (selectedBase) {
      total += selectedBase.price;
    }
    if (selectedSauce) {
      total += selectedSauce.price;
    }
    if (selectedCheese) {
      total += selectedCheese.price;
    }
    selectedToppings.forEach((topping) => {
      total += topping.price;
    });
    return total.toFixed(2);
  };

  const handleBaseChange = (base) => {
    dispatch({ type: 'pizza/selectBase', payload: base });
  };

  const handleSauceChange = (sauce) => {
    dispatch({ type: 'pizza/selectSauce', payload: sauce });
  };

  const handleCheeseChange = (cheese) => {
    dispatch({ type: 'pizza/selectCheese', payload: cheese });
  };

  const handleToppingToggle = (topping) => {
    dispatch({ type: 'pizza/toggleTopping', payload: topping });
  };

  const handleOrder = async () => {
    const orderData = {
      base: selectedBase,
      sauce: selectedSauce,
      cheese: selectedCheese,
      toppings: selectedToppings,
      totalAmount: parseFloat(calculateTotal()),
    };

    const result = await dispatch(createOrder(orderData));
    if (!result.error) {
      setOrderSuccess(true);
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    if (orderSuccess) {
      navigate('/dashboard');
    }
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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Pizza Builder Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocalPizza sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">Build Your Pizza</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* Base Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Choose Your Base
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedBase?._id || ''}
                  onChange={(e) =>
                    handleBaseChange(
                      bases.find((base) => base._id === e.target.value)
                    )
                  }
                >
                  {bases.map((base) => (
                    <FormControlLabel
                      key={base._id}
                      value={base._id}
                      control={<Radio />}
                      label={`₹{base.name} - ₹₹{base.price.toFixed(2)}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Sauce Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Choose Your Sauce
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedSauce?._id || ''}
                  onChange={(e) =>
                    handleSauceChange(
                      sauces.find((sauce) => sauce._id === e.target.value)
                    )
                  }
                >
                  {sauces.map((sauce) => (
                    <FormControlLabel
                      key={sauce._id}
                      value={sauce._id}
                      control={<Radio />}
                      label={`₹{sauce.name} - ₹₹{sauce.price.toFixed(2)}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Cheese Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Choose Your Cheese
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedCheese?._id || ''}
                  onChange={(e) =>
                    handleCheeseChange(
                      cheeses.find((cheese) => cheese._id === e.target.value)
                    )
                  }
                >
                  {cheeses.map((cheese) => (
                    <FormControlLabel
                      key={cheese._id}
                      value={cheese._id}
                      control={<Radio />}
                      label={`₹{cheese.name} - ₹₹{cheese.price.toFixed(2)}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Toppings Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Choose Your Toppings
              </Typography>
              <Grid container spacing={2}>
                {toppings.map((topping) => (
                  <Grid item xs={12} sm={6} md={4} key={topping._id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedToppings.some(
                            (t) => t._id === topping._id
                          )}
                          onChange={() => handleToppingToggle(topping)}
                        />
                      }
                      label={`₹{topping.name} - ₹{topping.price.toFixed(2)}`}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ShoppingCart sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">Order Summary</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Selection
              </Typography>
              {selectedBase && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Base: {selectedBase.name} - ₹{selectedBase.price.toFixed(2)}
                </Typography>
              )}
              {selectedSauce && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Sauce: {selectedSauce.name} - ₹{selectedSauce.price.toFixed(2)}
                </Typography>
              )}
              {selectedCheese && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Cheese: {selectedCheese.name} - ₹{selectedCheese.price.toFixed(2)}
                </Typography>
              )}
              {selectedToppings.length > 0 && (
                <>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Toppings:
                  </Typography>
                  {selectedToppings.map((topping) => (
                    <Typography
                      key={topping._id}
                      variant="body2"
                      sx={{ ml: 2, mb: 0.5 }}
                    >
                      • {topping.name} - ₹{topping.price.toFixed(2)}
                    </Typography>
                  ))}
                </>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total: {calculateTotal()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleOrder}
              disabled={
                !selectedBase || !selectedSauce || !selectedCheese || loading
              }
            >
              Place Order
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Success Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {orderSuccess ? 'Order Placed Successfully!' : 'Error'}
        </DialogTitle>
        <DialogContent>
          {orderSuccess ? (
            <Typography>
              Your pizza order has been placed successfully. You can track your
              order status in your dashboard.
            </Typography>
          ) : (
            <Typography color="error">{error}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {orderSuccess ? 'Go to Dashboard' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PizzaBuilder; 