use mongodb::{Collection, Database};
use crate::models::orderbook::{OrderBook, MarketPrice};
use anyhow::Result;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MarketDataRecord {
    pub symbol: String,
    pub price: f64,
    pub volume_24h: f64,
    pub change_24h: f64,
    pub timestamp: DateTime<Utc>,
    pub order_book: OrderBook,
}

pub struct MarketDataRepository {
    collection: Collection<MarketDataRecord>,
}

impl MarketDataRepository {
    pub fn new(db: Database) -> Self {
        Self {
            collection: db.collection("market_data"),
        }
    }

    pub async fn save_market_data(&self, data: MarketDataRecord) -> Result<()> {
        let filter = doc! { "symbol": &data.symbol };
        let update = doc! { "$set": bson::to_document(&data)? };
        self.collection.update_one(filter, update, None).await?;
        Ok(())
    }

    pub async fn get_market_data(&self, symbol: &str) -> Result<Option<MarketDataRecord>> {
        let filter = doc! { "symbol": symbol };
        let result = self.collection.find_one(filter, None).await?;
        Ok(result)
    }

    pub async fn get_latest_prices(&self) -> Result<Vec<MarketPrice>> {
        let mut cursor = self.collection.find(None, None).await?;
        let mut prices = Vec::new();
        
        while let Some(record) = cursor.try_next().await? {
            prices.push(MarketPrice {
                market_pair: record.symbol,
                price: record.price,
                change_24h: record.change_24h,
                volume_24h: record.volume_24h,
                timestamp: record.timestamp,
            });
        }
        
        Ok(prices)
    }
} 