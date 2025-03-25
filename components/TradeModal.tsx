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
import Button from "@/components/ui/Button";
import { useTradeForm } from "@/hooks/useTradeForm";
import { useTrade } from "@/hooks/useTrade";
import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TradeModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const { eurAmount, btcAmount, handleEurChange, handleBtcChange, resetForm } =
    useTradeForm();

  const { buyError, sellError, resetErrors, handleBuy, handleSell } =
    useTrade();

  function handleCloseModal() {
    resetErrors();
    resetForm();
    dispatch(closeModal());
  }

  const executeBuy = () => {
    const eurVal = parseFloat(eurAmount);
    const btcVal = parseFloat(btcAmount);
    handleBuy({ eurVal, btcVal, onSuccess: handleCloseModal });
  };

  const executeSell = () => {
    const eurVal = parseFloat(eurAmount);
    const btcVal = parseFloat(btcAmount);
    handleSell({ eurVal, btcVal, onSuccess: handleCloseModal });
  };

  function onHandleEurChange(text: string) {
    resetErrors();
    handleEurChange(text);
  }

  function onHandleBtcChange(text: string) {
    resetErrors();
    handleBtcChange(text);
  }

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
            <Ionicons name="close" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>

          {/* EUR Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={eurAmount}
              onChangeText={onHandleEurChange}
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
              onChangeText={onHandleBtcChange}
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
              disabled={!eurAmount || !btcAmount}
            />
            <Button
              onPress={executeSell}
              title="Sell"
              error={sellError}
              disabled={!eurAmount || !btcAmount}
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
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
    borderColor: COLORS.input.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.input.background,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
    backgroundColor: COLORS.input.background,
    color: COLORS.text.primary,
    textAlign: "right",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.input.label,
  },
});
