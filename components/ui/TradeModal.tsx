import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { closeModal } from "@/store/modalSlice";
import { buyBitcoin, sellBitcoin } from "@/store/portfolioSlice";
import { useEffect, useState } from "react";
import Button from "./Button";

const DEFAULT_EUR_AMOUNT = 100;
export default function TradeModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );

  const [eurAmount, setEurAmount] = useState<number | null>(DEFAULT_EUR_AMOUNT);
  const [btcAmount, setBtcAmount] = useState<string | null>(null);

  useEffect(() => {
    if (currentPrice) {
      setBtcAmount((DEFAULT_EUR_AMOUNT / currentPrice).toFixed(8));
    }
  }, [currentPrice]);

  const handleBuy = () => {
    if (!eurAmount) return;
    dispatch(buyBitcoin({ amountInEUR: eurAmount, currentPrice }));
    dispatch(closeModal());
    setEurAmount(null);
    setBtcAmount(null);
  };

  const handleSell = () => {
    if (!btcAmount) return;
    dispatch(sellBitcoin({ amountInBTC: btcAmount, currentPrice }));
    dispatch(closeModal());
    setEurAmount(null);
    setBtcAmount(null);
  };

  const handleEurChange = (text: string) => {
    const newEurAmount = text ? parseFloat(text) : null;
    setEurAmount(newEurAmount);
    setBtcAmount(
      newEurAmount && currentPrice
        ? (newEurAmount / currentPrice).toFixed(8).toString()
        : null
    );
  };

  const handleBtcChange = (text: string) => {
    setBtcAmount(text || null);
    setEurAmount(text && currentPrice ? parseFloat(text) * currentPrice : null);
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => dispatch(closeModal())}
      onBackButtonPress={() => dispatch(closeModal())}
      useNativeDriver
      hideModalContentWhileAnimating
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <View style={styles.modalView}>
        <TouchableOpacity
          onPress={() => dispatch(closeModal())}
          style={{ alignSelf: "flex-end" }}
        >
          <Text style={{ fontWeight: "semibold", fontSize: 24 }}>x</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            borderColor: "gray",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: "#f3f4f6",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            value={eurAmount?.toString()}
            onChangeText={handleEurChange}
            textAlign="right"
            keyboardType="numeric"
            style={{
              borderBottomWidth: 1,
              paddingHorizontal: 16,
              paddingVertical: 16,
              flex: 1,
              backgroundColor: "white",
              color: "black",
            }}
          />
          <Text style={{ fontWeight: "semibold", fontSize: 16, color: "blue" }}>
            EUR
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            borderColor: "gray",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: "#f3f4f6",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            value={btcAmount?.toString()}
            onChangeText={handleBtcChange}
            textAlign="right"
            keyboardType="numeric"
            style={{
              borderBottomWidth: 1,
              paddingHorizontal: 16,
              paddingVertical: 16,
              flex: 1,
              backgroundColor: "white",
              color: "black",
            }}
          />
          <Text style={{ fontWeight: "semibold", fontSize: 16, color: "blue" }}>
            BTC
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Button onPress={handleBuy} title="Buy" />
          <Button onPress={handleSell} title="Sell" />
        </View>
      </View>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
});
