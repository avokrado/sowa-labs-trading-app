import { NativeModule, requireNativeModule } from "expo";

interface PriceResponse {
  symbol?: string;
  price: string;
}

declare class BitcoinPriceModule extends NativeModule<any> {
  getPrice(): Promise<PriceResponse>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BitcoinPriceModule>("BitcoinPrice");
