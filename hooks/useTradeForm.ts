import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { validateDecimalInput } from "@/utils/decimalInput";
import { formatDecimalInput } from "@/utils/decimalInput";
import { debounce } from "lodash";

const MIN_BTC_AMOUNT = 0.00000001; // 1 satoshi
const MAX_EUR_DECIMALS = 2;
const MAX_BTC_DECIMALS = 8;
const DEBOUNCE_MS = 500;

export function useTradeForm() {
  const currentBtcTradePrice = useSelector(
    (state: RootState) => state.trades.tradeBTCprice
  );

  const [eurAmount, setEurAmount] = useState<string>("");
  const [btcAmount, setBtcAmount] = useState<string>("");
  const [btcError, setBtcError] = useState<string>("");

  const calculateBtcFromEur = debounce((eurValue: string) => {
    if (!currentBtcTradePrice || !eurValue) {
      setBtcAmount("");
      setBtcError("");
      return;
    }

    const eurNum = parseFloat(eurValue);
    const btcNum = eurNum / currentBtcTradePrice;
    const roundedBtc = Math.round(btcNum * 1e8) / 1e8;

    setBtcAmount(roundedBtc.toString());
    setBtcError(
      roundedBtc < MIN_BTC_AMOUNT
        ? `Minimum amount is ${MIN_BTC_AMOUNT} BTC`
        : ""
    );
  }, DEBOUNCE_MS);

  const calculateEurFromBtc = debounce((btcValue: string) => {
    if (!currentBtcTradePrice || !btcValue) {
      setEurAmount("");
      setBtcError("");
      return;
    }

    const btcNum = parseFloat(btcValue);
    const eurNum = btcNum * currentBtcTradePrice;
    const roundedEur = Math.round(eurNum * 100) / 100;

    setEurAmount(roundedEur.toString());
    setBtcError(
      btcNum < MIN_BTC_AMOUNT ? `Minimum amount is ${MIN_BTC_AMOUNT} BTC` : ""
    );
  }, DEBOUNCE_MS);

  useEffect(() => {
    return () => {
      calculateEurFromBtc.cancel();
      calculateBtcFromEur.cancel();
    };
  }, []);

  const handleEurChange = (text: string) => {
    const formattedText = formatDecimalInput(text);
    if (validateDecimalInput(formattedText, MAX_EUR_DECIMALS)) {
      setEurAmount(formattedText);
      calculateBtcFromEur(formattedText);
    }
  };

  const handleBtcChange = (text: string) => {
    const formattedText = formatDecimalInput(text);
    if (validateDecimalInput(formattedText, MAX_BTC_DECIMALS)) {
      setBtcAmount(formattedText);
      calculateEurFromBtc(formattedText);
    }
  };

  const resetForm = () => {
    setEurAmount("");
    setBtcAmount("");
    setBtcError("");
    calculateEurFromBtc.cancel();
    calculateBtcFromEur.cancel();
  };

  return {
    eurAmount,
    btcAmount,
    btcError,
    currentBtcTradePrice,
    handleEurChange,
    handleBtcChange,
    resetForm,
  };
}
