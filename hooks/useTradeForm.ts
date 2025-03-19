import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useTradeForm() {
  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );
  
  const [eurAmount, setEurAmount] = useState<string>("");
  const [btcAmount, setBtcAmount] = useState<string>("");
  
  // Whenever eurAmount changes, update btcAmount
  useEffect(() => {
    if (!currentPrice) return;

    const parsed = parseFloat(eurAmount);
    if (!isNaN(parsed)) {
      const newBtc = parsed / currentPrice;
      // Round to 8 decimal places
      const roundedBtc = Math.round(newBtc * 1e8) / 1e8;
      setBtcAmount(roundedBtc.toString());
    } else {
      setBtcAmount("");
    }
  }, [eurAmount, currentPrice]);

  const handleEurChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    // Ensure only 2 decimal places for EUR
    const parts = cleaned.split('.');
    if (parts[1]?.length > 2) {
      parts[1] = parts[1].slice(0, 2);
      setEurAmount(parts.join('.'));
    } else {
      setEurAmount(cleaned);
    }
  };

  const handleBtcChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    // Ensure only 8 decimal places for BTC
    const parts = cleaned.split('.');
    if (parts[1]?.length > 8) {
      parts[1] = parts[1].slice(0, 8);
      setBtcAmount(parts.join('.'));
    } else {
      setBtcAmount(cleaned);
    }

    if (currentPrice) {
      const parsed = parseFloat(cleaned);
      if (!isNaN(parsed)) {
        const newEur = parsed * currentPrice;
        // Round to 2 decimal places
        const roundedEur = Math.round(newEur * 100) / 100;
        setEurAmount(roundedEur.toString());
      } else {
        setEurAmount("");
      }
    }
  };

  const resetForm = () => {
    setEurAmount("");
    setBtcAmount("");
  };

  return {
    eurAmount,
    btcAmount,
    currentPrice,
    handleEurChange,
    handleBtcChange,
    resetForm
  };
} 