import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { addToCart, fetchCart } from "../redux/cart/cartSlice";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from "@mui/material";
import NavBar from "./NavBar";
import IMAGE from "../assets/mainImage.png";
import LAPTOP from "../assets/laptop.png";
import SMARTPHONE from "../assets/phone.png";
import HEADSET from "../assets/headset.png";
import "./styles.css";

const ProductList = () => {
  const dispatch = useDispatch();

  const { products, status } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
    if (status === "idle") dispatch(fetchProducts());
    if (status === "failed") setError("Failed to Fetch Product Details");
  }, [dispatch, status]);

  const handleAddToCart = async (product) => {
    const cartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    };
    await dispatch(addToCart(cartItem));
    dispatch(fetchProducts());
  };

  const isProductInCart = (id) =>
    cartItems.some((item) => item.productId === id);

  const renderProductImage = (name) => {
    switch (name.toLowerCase()) {
      case "laptop":
        return LAPTOP;
      case "smartphone":
        return SMARTPHONE;
      case "headphones":
        return HEADSET;
      default:
        return IMAGE;
    }
  };

  return (
    <div className="wrapper">
      <header className="navDiv">
        <h2>E-COMMERCE</h2>
        <NavBar cartItems={cartItems} />
      </header>

      <section className="mainDiv">
        <div className="textDiv">
          <h1>Upgrade your tech with the latest gadgets!</h1>
          <p>
            Explore cutting-edge gadgets and smart solutions that simplify your
            life. Shop with ease and stay ahead in the digital world.
          </p>
        </div>
        <div className="imageDiv">
          <img src={IMAGE} alt="Main" />
        </div>
      </section>

      <section className="productDiv">
        <h1>Products</h1>
        <div className="cardDiv">
          {status === "loading" && <div className="loading">Loading...</div>}
          {error && <p>{error}</p>}
          {status === "succeeded" && products.length === 0 && (
            <p>No products available at the moment.</p>
          )}

          {status === "succeeded" &&
            products.map((product) => (
              <Card key={product.id} sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={renderProductImage(product.name)}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography color="red" variant="h6" component="div">
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="body2" color="green">
                    {product.quantityInStock > 0 ? <p>In Stock: {product.quantityInStock}</p>:null}
                    
                  </Typography>
                </CardContent>
                <CardActions>
                  {product.quantityInStock >= 0 ? (
                    isProductInCart(product.id) ? (
                      <Typography variant="body2" color="blue">
                        Item Added to Cart
                      </Typography>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="small"
                        color="primary"
                      >
                        Add to Cart
                      </Button>
                    )
                  ) : <div className="outOfStock">Out of Stock</div>}
                </CardActions>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
};

export default ProductList;
