import { NativeModule, requireNativeModule } from "expo";

declare class BitcoinPriceModule extends NativeModule<any> {

}

// This call loads the native module object from the JSI.
export default requireNativeModule<BitcoinPriceModule>("BitcoinPrice");
