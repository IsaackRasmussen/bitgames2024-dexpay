import "./App.css";
import * as React from "react";
import { useState } from "react";

import {
  BottomNavigation,
  BottomNavigationAction,
  Fade,
  Paper,
} from "@mui/material";
import ShowProducts from "./ShowProducts.tsx";
import ShowInvoice from "./ShowInvoice.tsx";
import { Payments, AttachMoney } from "@mui/icons-material";

function App() {
  const [invoiceOpen, setInvoiceOpen] = React.useState(false);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [shoppingCartVisible, setShoppingCartVisible] = useState(false);
  const [shoppingCartTotal, setShoppingCartTotal] = useState(0);

  // Open invoice dialog, create a Lightning invoice
  const handleClickOpen = () => {
    setInvoiceOpen(true);
  };

  const getPriceFormatted = (price: number): string => {
    return (price ?? 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      useGrouping: false,
    });
  };
  const getPriceInDollarString = (price: number): string => {
    // 17th July 2024, approx 1 USD = 6.85 DKK
    return getPriceFormatted(price / (100 * 6.85));
  };

  const addProductToCart = (product: any) => {
    (shoppingCart as any[]).push(product);
    setShoppingCart(shoppingCart);
    setShoppingCartVisible(true);

    let totalPrice = 0;
    shoppingCart.forEach((p: any) => (totalPrice += p.sellingPrice));

    setShoppingCartTotal(totalPrice);
  };

  return (
    <div>
      <ShowProducts
        key="KeyShowProducts"
        onProductAdd={(product: any) => addProductToCart(product)}
      />
      <Fade in={shoppingCartVisible} key="KeyShowShoppingCart">
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation>
            <span style={{ fontSize: "2em" }} onClick={handleClickOpen}>
              <AttachMoney />
              {getPriceInDollarString(shoppingCartTotal)}
            </span>
            <BottomNavigationAction
              label="Pay"
              icon={<Payments />}
              onClick={handleClickOpen}
            />
          </BottomNavigation>
        </Paper>
      </Fade>

      <ShowInvoice
        shoppingCart={shoppingCart}
        invoiceOpen={invoiceOpen}
        shoppingCartTotal={shoppingCartTotal}
        closeDialog={() => setInvoiceOpen(false)}
      />
    </div>
  );
}

export default App;
