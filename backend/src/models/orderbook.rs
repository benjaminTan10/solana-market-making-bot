use serde::{Deserialize, Serialize};
use mongodb::Database;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct OrderBookEntry {
    pub price: f64,
    pub size: f64,
    pub total: f64,
    pub is_bot: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OrderBook {
    pub market_pair: String,
    pub bids: Vec<OrderBookEntry>,
    pub asks: Vec<OrderBookEntry>,
    pub last_price: f64,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MarketPrice {
    pub market_pair: String,
    pub price: f64,
    pub change_24h: f64,
    pub high_24h: f64,
    pub low_24h: f64,
    pub volume_24h: f64,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

// For now, we'll use mock data since we're not connecting to a real exchange
impl OrderBook {
    pub async fn get_order_book(_db: &Database, market_pair: &str) -> Result<Self, anyhow::Error> {
        // In a real implementation, this would fetch data from an exchange API
        // For now, we'll generate mock data
        let now = chrono::Utc::now();
        let base_price = match market_pair {
            "SOL/USD" => 150.0,
            "SOL/USDC" => 149.8,
            "SOL/USDT" => 149.9,
            _ => 100.0,
        };
        
        let mut bids = Vec::new();
        let mut asks = Vec::new();
        
        // Generate mock bids (buy orders)
        for i in 1..16 {
            let price_offset = (i as f64) * 0.1;
            let price = base_price - price_offset;
            let size = 10.0 + (rand::random::<f64>() * 90.0);
            let is_bot = rand::random::<f64>() > 0.65;
            
            bids.push(OrderBookEntry {
                price,
                size,
                total: price * size,
                is_bot,
            });
        }
        
        // Generate mock asks (sell orders)
        for i in 1..16 {
            let price_offset = (i as f64) * 0.1;
            let price = base_price + price_offset;
            let size = 10.0 + (rand::random::<f64>() * 90.0);
            let is_bot = rand::random::<f64>() > 0.65;
            
            asks.push(OrderBookEntry {
                price,
                size,
                total: price * size,
                is_bot,
            });
        }
        
        Ok(Self {
            market_pair: market_pair.to_string(),
            bids,
            asks,
            last_price: base_price,
            timestamp: now,
        })
    }
    
    pub async fn get_market_price(_db: &Database, market_pair: &str) -> Result<MarketPrice, anyhow::Error> {
        // In a real implementation, this would fetch data from an exchange API
        let now = chrono::Utc::now();
        let base_price = match market_pair {
            "SOL/USD" => 150.0,
            "SOL/USDC" => 149.8,
            "SOL/USDT" => 149.9,
            _ => 100.0,
        };
        
        let change_24h = (rand::random::<f64>() * 6.0) - 3.0; // -3% to +3%
        let high_24h = base_price * (1.0 + (rand::random::<f64>() * 0.05)); // Up to 5% higher
        let low_24h = base_price * (1.0 - (rand::random::<f64>() * 0.05)); // Up to 5% lower
        let volume_24h = 1_000_000.0 + (rand::random::<f64>() * 9_000_000.0); // 1M to 10M
        
        Ok(MarketPrice {
            market_pair: market_pair.to_string(),
            price: base_price,
            change_24h,
            high_24h,
            low_24h,
            volume_24h,
            timestamp: now,
        })
    }
} 