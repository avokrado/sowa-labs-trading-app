import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { closeModal } from "@/store/modalSlice";
import Button from "./Button";
import { useTradeForm } from "@/hooks/useTradeForm";
import { useTrade } from "@/hooks/useTrade";

export default function TradeModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const wsStatus = useSelector((state: RootState) => state.price.wsStatus);
  const {
    eurAmount,
    btcAmount,
    currentPrice,
    handleEurChange,
    handleBtcChange,
    resetForm,
  } = useTradeForm();

  const { buyError, sellError, resetErrors, handleBuy, handleSell } =
    useTrade();

  function handleCloseModal() {
    dispatch(closeModal());
    resetErrors();
    resetForm();
  }

  const executeBuy = () => {
    const eurVal = parseFloat(eurAmount);
    const btcVal = parseFloat(btcAmount);
    handleBuy({ eurVal, btcVal, currentPrice, onSuccess: handleCloseModal });
  };

  const executeSell = () => {
    const eurVal = parseFloat(eurAmount);
    const btcVal = parseFloat(btcAmount);
    handleSell({ eurVal, btcVal, currentPrice, onSuccess: handleCloseModal });
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={handleCloseModal}
      onBackButtonPress={handleCloseModal}
      useNativeDriver
      hideModalContentWhileAnimating
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={handleCloseModal}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={{ fontWeight: "semibold", fontSize: 24 }}>x</Text>
          </TouchableOpacity>

          {/* EUR Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={eurAmount}
              onChangeText={handleEurChange}
              // Use decimal-pad on iOS, numeric on Android
              keyboardType={
                Platform.select({
                  ios: "decimal-pad",
                  android: "numeric",
                }) || "numeric"
              }
              style={styles.input}
            />
            <Text style={styles.label}>EUR</Text>
          </View>

          {/* BTC Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={btcAmount}
              onChangeText={handleBtcChange}
              keyboardType={
                Platform.select({
                  ios: "decimal-pad",
                  android: "numeric",
                }) || "numeric"
              }
              style={styles.input}
            />
            <Text style={styles.label}>BTC</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 16 }}>
            <Button
              onPress={executeBuy}
              title="Buy"
              error={buyError}
              disabled={wsStatus !== "connected" || !eurAmount || !btcAmount}
            />
            <Button
              onPress={executeSell}
              title="Sell"
              error={sellError}
              disabled={wsStatus !== "connected" || !eurAmount || !btcAmount}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    gap: 32,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
    backgroundColor: "white",
    color: "black",
    textAlign: "right",
  },
  label: {
    fontWeight: "semibold",
    fontSize: 16,
    color: "blue",
  },
});
