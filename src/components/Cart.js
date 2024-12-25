import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { removeFromCart, updateQuantity, fetchCart } from "../redux/cart/cartSlice";
import {addOrder} from '../redux/order/orderSlice'
import NavBar from "./NavBar";
import DELETE from "../assets/delete.png";
import "./styles.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const getTotalPrice = () => items.reduce((total, item) => total + item.price * item.quantity, 0);


  const handleCheckout = async() => {
    const cartItems = items.map(item => ({
      productId: item.id,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
    }));
    dispatch(addOrder(cartItems));

    navigate("/checkout",{
      state:{
        cartItems:items,
        totalPrice:getTotalPrice()
      }
    });
  }



  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ cartItemId, newQuantity }));
    }
  };

  const handleRemoveFromCart =async (id) =>{
      await dispatch(removeFromCart(id));
     dispatch(fetchCart())
  }



  return (
    <div>
       <NavBar cartItems={items} />

      {error && <div>{error}</div>}



      

      <div className="mainTable">

      <h5 onClick={()=>navigate(-1)}>Go Back</h5>
        <h1>Your Cart</h1>

        {status === "loading" && <div className="loading">Loading...</div>}

        {items.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="cart table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="center">${item.price}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button>
                      {item.quantity}
                      <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>
                    </TableCell>
                    <TableCell align="center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <img style={{cursor:"pointer"}} onClick={() => handleRemoveFromCart(item.id)} src={DELETE} alt="delete"/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>Your cart is empty.</p>
        )}

        {items.length > 0 && (
          <div className="cartSummary">
            <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
            <Button variant="contained" onClick={handleCheckout} size="medium">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
