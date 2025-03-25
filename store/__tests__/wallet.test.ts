import { store } from "@/store";
import { executeBuyTrade, executeSellTrade } from "@/store/tradesSlice";

describe("Wallet redux state tests", () => {
  it("Should initially set wallet to 0 BTC and 100 EUR", () => {
    const state = store.getState().wallet;
    expect(state.btcBalanceInSats).toEqual(0);
    expect(state.eurBalance).toEqual(100);
  });

  it("Should update balances after BUY trade", async () => {
    await store.dispatch(
      executeBuyTrade({ amountInBTC: 1, amountInEUR: 50, price: 50 })
    );
    const state = store.getState().wallet;
    expect(state.btcBalanceInSats).toEqual(100000000);
    expect(state.eurBalance).toEqual(50); // 100 - 50
  });

  it("Should update balances after SELL trade", async () => {
    await store.dispatch(
      executeSellTrade({ amountInBTC: 1, amountInEUR: 50, price: 50 })
    );

    const state = store.getState().wallet;
    expect(state.btcBalanceInSats).toEqual(0);
    expect(state.eurBalance).toEqual(100); // 50 + 50
  });

  it("Should reject BUY trade with insufficient EUR balance", async () => {
    const result = await store.dispatch(
      executeBuyTrade({ amountInBTC: 1, amountInEUR: 150, price: 150 })
    );

    const state = store.getState().wallet;
    expect(result.payload).toBe("Insufficient EUR balance");
    expect(state.btcBalanceInSats).toEqual(0);
    expect(state.eurBalance).toEqual(100);
  });

  it("Should reject SELL trade with insufficient BTC balance", async () => {
    const result = await store.dispatch(
      executeSellTrade({ amountInBTC: 1, amountInEUR: 50, price: 50 })
    );

    expect(result.payload).toBe("Insufficient BTC balance");
    const state = store.getState().wallet;
    expect(state.btcBalanceInSats).toEqual(0);
    expect(state.eurBalance).toEqual(100);
  });
});
