// Import Redux store and actions
import { store } from "@/store";
import { updatePrice, setWsStatus, setError } from "@/store/priceSlice";

/**
 * Service class to handle WebSocket connection to Binance price feed
 */
class WebSocketService {
  // WebSocket instance
  private ws: WebSocket | null = null;
  // Track number of reconnection attempts
  private reconnectAttempts = 0;
  // Maximum number of times to attempt reconnecting
  private maxReconnectAttempts = 5;
  // Timer for reconnection attempts
  private reconnectTimeout: NodeJS.Timeout | null = null;

  /**
   * Establishes WebSocket connection to Binance API
   */
  connect() {
    try {
      // Update Redux state to show connecting status
      store.dispatch(setWsStatus("connecting"));

      // Connect to Binance WebSocket API for BTC/EUR trading pair
      this.ws = new WebSocket("wss://stream.binance.com:9443/ws/btceur@trade");

      // On successful connection
      this.ws.onopen = () => {
        this.reconnectAttempts = 0; // Reset reconnect counter
        store.dispatch(setWsStatus("connected"));
      };

      // Handle incoming messages
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const price = parseFloat(data.p); // Extract price from message
          store.dispatch(updatePrice(price)); // Update price in Redux store
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      // Handle connection close
      this.ws.onclose = () => {
        store.dispatch(setWsStatus("disconnected"));
        this.attemptReconnect(); // Try to reconnect
      };

      // Handle connection errors
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        store.dispatch(setError("WebSocket connection error"));
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      store.dispatch(setError("Failed to establish WebSocket connection"));
    }
  }

  /**
   * Attempts to reconnect to WebSocket with exponential backoff
   * Will try up to maxReconnectAttempts times
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      store.dispatch(setError("Maximum reconnection attempts reached"));
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, 5000); // Wait 5 seconds between attempts
  }

  /**
   * Cleanly disconnects from WebSocket
   * Clears any pending reconnection attempts
   */
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create and export singleton instance
export const wsService = new WebSocketService();
