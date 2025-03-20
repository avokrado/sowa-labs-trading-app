import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { executeBuyTrade, executeSellTrade } from "@/store/tradesSlice";
import { closeModal } from "@/store/modalSlice";

export function useTrade() {
  const dispatch = useDispatch<AppDispatch>();
  const [buyError, setBuyError] = useState<string | undefined>(undefined);
  const [sellError, setSellError] = useState<string | undefined>(undefined);
  const currentBtcTradePrice = useSelector(
    (state: RootState) => state.trades.tradeBTCprice
  );

  const resetErrors = () => {
    setBuyError(undefined);
    setSellError(undefined);
  };

  const handleBuy = async (params: {
    eurVal: number;
    btcVal: number;
    onSuccess: () => void;
  }) => {
    resetErrors();
    const { eurVal, btcVal, onSuccess } = params;

    try {
      await dispatch(
        executeBuyTrade({
          amountInBTC: btcVal,
          amountInEUR: eurVal,
          price: currentBtcTradePrice,
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
    onSuccess: () => void;
  }) => {
    resetErrors();
    const { eurVal, btcVal, onSuccess } = params;

    try {
      await dispatch(
        executeSellTrade({
          amountInBTC: btcVal,
          amountInEUR: eurVal,
          price: currentBtcTradePrice,
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
