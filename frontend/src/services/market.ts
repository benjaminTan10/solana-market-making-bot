import api from './api';
import { MarketDataRecord } from '@/types/market';

export const marketService = {
  async getMarketData(symbol: string): Promise<MarketDataRecord> {
    const response = await api.get(`/market/data/${symbol}`);
    return response.data;
  },

  async getLatestPrices(): Promise<MarketDataRecord[]> {
    const response = await api.get('/market/prices');
    return response.data;
  },

  async getOrderBook(symbol: string) {
    const response = await api.get(`/orderbook/${symbol}`);
    return response.data;
  },
}; 