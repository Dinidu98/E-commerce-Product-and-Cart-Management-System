import React from "react";
import { useNavigate } from "react-router-dom";
import CART from "../assets/cart.png";
import "./styles.css";

const NavBar = ({ cartItems }) => {
  const navigate = useNavigate();

  return (
    <header className="navDiv">
      <h2 onClick={()=>navigate('/')}>E-COMMERCE</h2>
      <div className="cartDiv">
        <img onClick={() => navigate("/cart")} src={CART} alt="Cart" />
        {cartItems.length > 0 && <div className="dot" />}
      </div>
    </header>
  );
};

export default NavBar;