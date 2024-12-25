import React from "react";
import NavBar from "./NavBar";
import { useLocation,useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CHECK from "../assets/check.png";
import "./styles.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const { cartItems, totalPrice } = location.state;
  const navigate=useNavigate()

  // console.log(cartItems, totalPrice);

  return (
    <div>
      <NavBar cartItems={"items"} />

      <div className="confirmDiv">
        <Card sx={{ maxWidth: "50%"}}>
          <img className="check" src={CHECK} alt="check" />
          <h1>Thank you for your order</h1>
          
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Order Details
              </Typography>
              {cartItems.map((items) => (
                <div key={items.id}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {items.productName} ${items.price} X {items.quantity}
                  </Typography>
                  
                </div>
              ))}
            </CardContent>
            <Typography gutterBottom variant="h5" component="div">
               Total ${totalPrice}
              </Typography>
              <CardActionArea  style={{ marginBottom:"20px" }}>
                <p onClick={()=>navigate('/')}>Go Back</p>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;

