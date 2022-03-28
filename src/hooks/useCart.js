import React from 'react';
import AppContex from "../context";

export const useCart = () => {
  const { cartItems, setCartItems } = React.useContext(AppContex)
  const totalPrice = cartItems.reduce((sum, obj) => Number(obj.price) + sum, 0);

  return { cartItems, setCartItems, totalPrice }
}