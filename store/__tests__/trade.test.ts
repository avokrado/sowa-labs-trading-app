import { store } from "@/store";
import {
  addTrade,
  executeBuyTrade,
  executeSellTrade,
} from "@/store/tradesSlice";
describe("Trade redux state tests", () => {
  it("Should initially set trades to an empty array", () => {
    const state = store.getState().trades;
    expect(state.trades).toEqual([]);
  });

  it("Should handle adding a trade", () => {
    store.dispatch(addTrade("BUY", 1, 100, 100));
    const state = store.getState().trades;
    expect(state.trades).toEqual([
      {
        id: expect.any(String),
        type: "BUY",
        amountInBTC: 1,
        amountInEUR: 100,
        price: 100,
        timestamp: expect.any(Number),
      },
    ]);
  });

  it("Should handle buy trade", () => {
    store.dispatch(
      executeBuyTrade({ amountInBTC: 1, amountInEUR: 100, price: 100 })
    );
    const state = store.getState().trades;
    expect(state.trades).toHaveLength(2);
  });

  it("Should handle sell trade", () => {
    store.dispatch(
      executeSellTrade({ amountInBTC: 1, amountInEUR: 100, price: 100 })
    );
    const state = store.getState().trades;
    expect(state.trades).toHaveLength(3);
  });
});
