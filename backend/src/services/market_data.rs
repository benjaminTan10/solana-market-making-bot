use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketData {
    pub symbol: String,
    pub price: f64,
    pub volume_24h: f64,
    pub change_24h: f64,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

pub struct MarketDataProvider {
    client: reqwest::Client,
    cache: Arc<RwLock<Vec<MarketData>>>,
}

impl MarketDataProvider {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
            cache: Arc::new(RwLock::new(Vec::new())),
        }
    }

    pub async fn fetch_market_data(&self, symbol: &str) -> Result<MarketData> {
        // First check cache
        let cache = self.cache.read().await;
        if let Some(data) = cache.iter().find(|d| d.symbol == symbol) {
            if data.timestamp + chrono::Duration::seconds(30) > chrono::Utc::now() {
                return Ok(data.clone());
            }
        }
        drop(cache);

        // Fetch fresh data
        let url = format!("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true");
        let response = self.client.get(&url).send().await?;
        let data = response.json::<serde_json::Value>().await?;

        let market_data = MarketData {
            symbol: symbol.to_string(),
            price: data["solana"]["usd"].as_f64().unwrap_or_default(),
            volume_24h: data["solana"]["usd_24h_vol"].as_f64().unwrap_or_default(),
            change_24h: data["solana"]["usd_24h_change"].as_f64().unwrap_or_default(),
            timestamp: chrono::Utc::now(),
        };

        // Update cache
        let mut cache = self.cache.write().await;
        if let Some(existing) = cache.iter_mut().find(|d| d.symbol == symbol) {
            *existing = market_data.clone();
        } else {
            cache.push(market_data.clone());
        }

        Ok(market_data)
    }
} 