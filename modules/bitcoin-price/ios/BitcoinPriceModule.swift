
import ExpoModulesCore

public class BitcoinPriceModule: Module {
  
  public func definition() -> ModuleDefinition {
    Name("BitcoinPrice")

/* 
Keeping this as simple as possible
Real world implementation would include classes, error handling, no hardcoded URL, etc.
 */
    Function("getPrice") { () -> [String: Any]? in
      let urlString = "https://api.binance.com/api/v3/ticker/price?symbol=BTCEUR"
      
      guard let url = URL(string: urlString) else {
        return nil
      }
      
      do {
        let data = try Data(contentsOf: url)
        let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
        return json
      } catch {
        return nil
      }
    }
  }
}