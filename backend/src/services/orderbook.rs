use sqlx::PgPool;
use crate::repositories::market_data::MarketDataRepository;
use crate::services::market_data::MarketDataProvider;
use crate::models::orderbook::{OrderBook, MarketPrice};
use crate::utils::errors::ServiceError;
use anyhow::Result;
use std::sync::Arc;

pub struct OrderBookService {
    market_data_provider: Arc<MarketDataProvider>,
    market_data_repo: Arc<MarketDataRepository>,
}

impl OrderBookService {
    pub fn new(
        market_data_provider: Arc<MarketDataProvider>,
        market_data_repo: Arc<MarketDataRepository>,
    ) -> Self {
        Self {
            market_data_provider,
            market_data_repo,
        }
    }

    pub async fn get_order_book(&self, market_pair: &str) -> Result<OrderBook> {
        // First try to get from repository
        if let Some(data) = self.market_data_repo.get_market_data(market_pair).await? {
            if data.timestamp + chrono::Duration::seconds(30) > chrono::Utc::now() {
                return Ok(data.order_book);
            }
        }

        // If not found or stale, fetch new data
        let market_data = self.market_data_provider.fetch_market_data(market_pair).await?;
        
        // Generate synthetic order book based on market data
        let order_book = OrderBook::generate_synthetic(
            market_pair,
            market_data.price,
            market_data.volume_24h
        );

        // Save to repository
        self.market_data_repo.save_market_data(MarketDataRecord {
            symbol: market_pair.to_string(),
            price: market_data.price,
            volume_24h: market_data.volume_24h,
            change_24h: market_data.change_24h,
            timestamp: market_data.timestamp,
            order_book: order_book.clone(),
        }).await?;

        Ok(order_book)
    }

    pub async fn get_market_price(&self, market_pair: &str) -> Result<MarketPrice> {
        let market_data = self.market_data_provider.fetch_market_data(market_pair).await?;
        
        Ok(MarketPrice {
            market_pair: market_pair.to_string(),
            price: market_data.price,
            change_24h: market_data.change_24h,
            volume_24h: market_data.volume_24h,
            timestamp: market_data.timestamp,
        })
    }
}

pub async fn get_order_book(
    pool: &PgPool,
    market_pair: &str,
) -> Result<OrderBook, ServiceError> {
    // Validate market pair
    if !is_valid_market_pair(market_pair) {
        return Err(ServiceError::BadRequest("Invalid market pair".into()));
    }
    
    // Get the order book
    let order_book = OrderBook::get_order_book(pool, market_pair).await
        .map_err(|e| ServiceError::InternalServerError(format!("Failed to fetch order book: {}", e)))?;
    
    Ok(order_book)
}

pub async fn get_market_price(
    pool: &PgPool,
    market_pair: &str,
) -> Result<MarketPrice, ServiceError> {
    // Validate market pair
    if !is_valid_market_pair(market_pair) {
        return Err(ServiceError::BadRequest("Invalid market pair".into()));
    }
    
    // Get the market price
    let market_price = OrderBook::get_market_price(pool, market_pair).await
        .map_err(|e| ServiceError::InternalServerError(format!("Failed to fetch market price: {}", e)))?;
    
    Ok(market_price)
}

// Helper function to validate market pairs
fn is_valid_market_pair(market_pair: &str) -> bool {
    let valid_pairs = ["SOL/USD", "SOL/USDC", "SOL/USDT", "BTC/SOL"];
    valid_pairs.contains(&market_pair)
} 