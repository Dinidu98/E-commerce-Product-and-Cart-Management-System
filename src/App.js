import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import { Route,Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import OrderConfirmation from "./components/OrderConfirmation";

function App() {
  return (
    <div className="App">
      <Toaster
  position="bottom-right"
  reverseOrder={false}
/>
      <Routes>
        <Route path="/" element={<ProductList/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<OrderConfirmation/>}/>
      </Routes>
     
    </div>
  );
}

export default App;
