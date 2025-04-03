use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Strategy {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub strategy_type: String,
    pub trading_pair: String,
    pub execution_platform: String,
    pub min_trade_size: f64,
    pub max_trade_size: f64,
    pub max_daily_volume: f64,
    pub auto_trading: bool,
    pub stealth_mode: bool,
    pub risk_alerts: bool,
    pub transaction_delay: i32,
    pub trade_frequency: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Strategy {
    pub async fn find_by_user(pool: &PgPool, user_id: Uuid) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT * FROM strategies WHERE user_id = $1
            "#,
            user_id
        )
        .fetch_all(pool)
        .await
    }

    pub async fn find_by_id(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<Option<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT * FROM strategies WHERE id = $1 AND user_id = $2
            "#,
            id,
            user_id
        )
        .fetch_optional(pool)
        .await
    }

    pub async fn create(
        pool: &PgPool,
        user_id: Uuid,
        name: &str,
        strategy_type: &str,
        trading_pair: &str,
        execution_platform: &str,
        min_trade_size: f64,
        max_trade_size: f64,
        max_daily_volume: f64,
        auto_trading: bool,
        stealth_mode: bool,
        risk_alerts: bool,
        transaction_delay: i32,
        trade_frequency: i32,
    ) -> Result<Self, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            INSERT INTO strategies (
                id, user_id, name, strategy_type, trading_pair, execution_platform,
                min_trade_size, max_trade_size, max_daily_volume, auto_trading,
                stealth_mode, risk_alerts, transaction_delay, trade_frequency,
                created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
            "#,
            Uuid::new_v4(),
            user_id,
            name,
            strategy_type,
            trading_pair,
            execution_platform,
            min_trade_size,
            max_trade_size,
            max_daily_volume,
            auto_trading,
            stealth_mode,
            risk_alerts,
            transaction_delay,
            trade_frequency,
            Utc::now(),
            Utc::now()
        )
        .fetch_one(pool)
        .await
    }

    pub async fn update(
        pool: &PgPool,
        id: Uuid,
        user_id: Uuid,
        name: &str,
        strategy_type: &str,
        trading_pair: &str,
        execution_platform: &str,
        min_trade_size: f64,
        max_trade_size: f64,
        max_daily_volume: f64,
        auto_trading: bool,
        stealth_mode: bool,
        risk_alerts: bool,
        transaction_delay: i32,
        trade_frequency: i32,
    ) -> Result<Self, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            UPDATE strategies
            SET name = $3, strategy_type = $4, trading_pair = $5, execution_platform = $6,
                min_trade_size = $7, max_trade_size = $8, max_daily_volume = $9, auto_trading = $10,
                stealth_mode = $11, risk_alerts = $12, transaction_delay = $13, trade_frequency = $14,
                updated_at = $15
            WHERE id = $1 AND user_id = $2
            RETURNING *
            "#,
            id,
            user_id,
            name,
            strategy_type,
            trading_pair,
            execution_platform,
            min_trade_size,
            max_trade_size,
            max_daily_volume,
            auto_trading,
            stealth_mode,
            risk_alerts,
            transaction_delay,
            trade_frequency,
            Utc::now()
        )
        .fetch_one(pool)
        .await
    }
} 