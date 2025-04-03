use sqlx::PgPool;
use uuid::Uuid;

use crate::api::trading::{StrategyRequest, TradeRequest};
use crate::models::strategy::Strategy;
use crate::models::transaction::Transaction;
use crate::models::wallet::Wallet;
use crate::utils::errors::ServiceError;

pub async fn get_trading_strategies(
    pool: &PgPool,
    user_id: Uuid,
) -> Result<Vec<Strategy>, ServiceError> {
    let strategies = Strategy::find_by_user(pool, user_id).await?;
    Ok(strategies)
}

pub async fn create_strategy(
    pool: &PgPool,
    user_id: Uuid,
    req: StrategyRequest,
) -> Result<Strategy, ServiceError> {
    // Validate strategy parameters
    if req.min_trade_size <= 0.0 {
        return Err(ServiceError::BadRequest("Minimum trade size must be positive".into()));
    }
    
    if req.max_trade_size < req.min_trade_size {
        return Err(ServiceError::BadRequest("Maximum trade size must be greater than minimum trade size".into()));
    }
    
    if req.max_daily_volume <= 0.0 {
        return Err(ServiceError::BadRequest("Maximum daily volume must be positive".into()));
    }
    
    if req.transaction_delay < 0 {
        return Err(ServiceError::BadRequest("Transaction delay cannot be negative".into()));
    }
    
    if req.trade_frequency <= 0 {
        return Err(ServiceError::BadRequest("Trade frequency must be positive".into()));
    }
    
    // Create the strategy
    let strategy = Strategy::create(
        pool,
        user_id,
        &req.name,
        &req.strategy_type,
        &req.trading_pair,
        &req.execution_platform,
        req.min_trade_size,
        req.max_trade_size,
        req.max_daily_volume,
        req.auto_trading,
        req.stealth_mode,
        req.risk_alerts,
        req.transaction_delay,
        req.trade_frequency,
    ).await?;
    
    Ok(strategy)
}

pub async fn update_strategy(
    pool: &PgPool,
    user_id: Uuid,
    strategy_id: Uuid,
    req: StrategyRequest,
) -> Result<Strategy, ServiceError> {
    // Check if strategy exists and belongs to user
    let existing = Strategy::find_by_id(pool, strategy_id, user_id).await?
        .ok_or_else(|| ServiceError::NotFound("Strategy not found".into()))?;
    
    // Validate strategy parameters
    if req.min_trade_size <= 0.0 {
        return Err(ServiceError::BadRequest("Minimum trade size must be positive".into()));
    }
    
    if req.max_trade_size < req.min_trade_size {
        return Err(ServiceError::BadRequest("Maximum trade size must be greater than minimum trade size".into()));
    }
    
    if req.max_daily_volume <= 0.0 {
        return Err(ServiceError::BadRequest("Maximum daily volume must be positive".into()));
    }
    
    if req.transaction_delay < 0 {
        return Err(ServiceError::BadRequest("Transaction delay cannot be negative".into()));
    }
    
    if req.trade_frequency <= 0 {
        return Err(ServiceError::BadRequest("Trade frequency must be positive".into()));
    }
    
    // Update the strategy
    let strategy = Strategy::update(
        pool,
        strategy_id,
        user_id,
        &req.name,
        &req.strategy_type,
        &req.trading_pair,
        &req.execution_platform,
        req.min_trade_size,
        req.max_trade_size,
        req.max_daily_volume,
        req.auto_trading,
        req.stealth_mode,
        req.risk_alerts,
        req.transaction_delay,
        req.trade_frequency,
    ).await?;
    
    Ok(strategy)
}

pub async fn execute_trade(
    pool: &PgPool,
    user_id: Uuid,
    req: TradeRequest,
) -> Result<Transaction, ServiceError> {
    // Check if wallet exists and belongs to user
    let wallet = Wallet::find_by_id(pool, req.wallet_id, user_id).await?
        .ok_or_else(|| ServiceError::NotFound("Wallet not found".into()))?;
    
    // Validate trade parameters
    if req.amount <= 0.0 {
        return Err(ServiceError::BadRequest("Trade amount must be positive".into()));
    }
    
    if !["buy", "sell"].contains(&req.action.to_lowercase().as_str()) {
        return Err(ServiceError::BadRequest("Action must be 'buy' or 'sell'".into()));
    }
    
    // In a real implementation, we would execute the trade on the blockchain
    // For now, we'll just create a transaction record
    
    // Calculate price if not provided
    let price = req.price.unwrap_or_else(|| {
        // Mock price calculation
        match req.token.as_str() {
            "SOL" => 150.0,
            "BTC" => 60000.0,
            _ => 1.0,
        }
    });
    
    // Create transaction record
    let transaction = Transaction::create(
        pool,
        user_id,
        req.wallet_id,
        &req.action,
        req.amount,
        &req.token,
        price,
        "completed", // Status
        Some(0.1), // Mock slippage
        Some("mock_transaction_hash"), // Mock transaction hash
    ).await?;
    
    Ok(transaction)
} 