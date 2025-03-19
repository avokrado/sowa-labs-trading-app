import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { executeBuyTrade, executeSellTrade } from "@/store/tradesSlice";
import { closeModal } from "@/store/modalSlice";

export function useTrade() {
  const dispatch = useDispatch<AppDispatch>();
  const [buyError, setBuyError] = useState<string | undefined>(undefined);
  const [sellError, setSellError] = useState<string | undefined>(undefined);

  const resetErrors = () => {
    setBuyError(undefined);
    setSellError(undefined);
  };

  const handleBuy = async (params: {
    eurVal: number;
    btcVal: number;
    currentPrice: number;
    onSuccess: () => void;
  }) => {
    resetErrors();
    const { eurVal, btcVal, currentPrice, onSuccess } = params;

    try {
      await dispatch(
        executeBuyTrade({
          amountInBTC: btcVal,
          amountInEUR: eurVal,
          price: currentPrice,
        })
      ).unwrap();

      dispatch(closeModal());
      onSuccess();
    } catch (error: any) {
      setBuyError(error);
    }
  };

  const handleSell = async (params: {
    eurVal: number;
    btcVal: number;
    currentPrice: number;
    onSuccess: () => void;
  }) => {
    resetErrors();
    const { eurVal, btcVal, currentPrice, onSuccess } = params;

    try {
      await dispatch(
        executeSellTrade({
          amountInBTC: btcVal,
          amountInEUR: eurVal,
          price: currentPrice,
        })
      ).unwrap();

      dispatch(closeModal());
      onSuccess();
    } catch (error: any) {
      setSellError(error);
    }
  };

  return {
    buyError,
    sellError,
    resetErrors,
    handleBuy,
    handleSell,
  };
}
