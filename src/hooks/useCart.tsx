import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { CartProduct, Product, Stock } from "../types";
import { useStock } from "./useStock";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: CartProduct[];
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const { stock } = useStock();
  const [cart, setCart] = useState<CartProduct[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });
  const updateCartAndStorage = (updateCart: CartProduct[]) => {
    setCart(updateCart);
    localStorage.setItem(
      "@RocketShoes:cart",
      JSON.stringify(updateCart, null, 2)
    );
  };

  const addProduct = async (product: Product) => {
    try {
      const currentCartAmount =
        cart.find((item) => item.id === product.id)?.amount || 0;
      //no more stock
      if (currentCartAmount >= stock[product.id]) {
        throw new Error("não há no estoque");
      }
      const updatedCart: CartProduct[] = cart.map((item) => {
        if (product.id !== item.id) return item;
        return { ...item, amount: item.amount + 1 };
      });
      if (!updatedCart.find((p) => p.id === product.id)) {
        updatedCart.push({ ...product, amount: 1 });
      }
      updateCartAndStorage(updatedCart);

      console.log(updatedCart);
      //update amount
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const updatedCart = cart.filter((p) => p.id !== productId);
      updateCartAndStorage(updatedCart);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
