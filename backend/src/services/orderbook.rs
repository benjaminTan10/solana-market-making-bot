use sqlx::PgPool;

use crate::models::orderbook::{OrderBook, MarketPrice};
use crate::utils::errors::ServiceError;

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