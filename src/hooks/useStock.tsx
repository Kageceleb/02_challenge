import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Stock } from "../types";

export const useStock = () => {
  const [stock, setStock] = useState<Record<Stock["id"], Stock["amount"]>>({});
  useEffect(() => {
    api
      .get("/stock")
      .then(function (response) {
        setStock(
          response.data.reduce((acc: any, item: Stock) => {
            acc[item.id] = item.amount;
            return acc;
          }, {})
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  });
  return { stock };
};
