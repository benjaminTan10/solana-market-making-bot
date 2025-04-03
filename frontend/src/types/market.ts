export interface MarketDataRecord {
  symbol: string;
  price: number;
  volume_24h: number;
  change_24h: number;
  timestamp: string;
  order_book: OrderBook;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  is_bot: boolean;
}

export interface MarketPrice {
  market_pair: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  timestamp: string;
} 