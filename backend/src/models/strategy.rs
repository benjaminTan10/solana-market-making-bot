use bson::{doc, Document};
use chrono::{DateTime, Utc};
use mongodb::{Collection, Database};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Strategy {
    #[serde(rename = "_id")]
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
    pub fn collection(db: &Database) -> Collection<Self> {
        db.collection::<Self>("strategies")
    }

    pub async fn find_by_user(db: &Database, user_id: Uuid) -> Result<Vec<Self>, mongodb::error::Error> {
        let filter = doc! { "user_id": user_id };
        let cursor = Self::collection(db).find(filter, None).await?;
        cursor.try_collect().await
    }

    pub async fn find_by_id(db: &Database, id: Uuid, user_id: Uuid) -> Result<Option<Self>, mongodb::error::Error> {
        let filter = doc! { "_id": id, "user_id": user_id };
        Self::collection(db).find_one(filter, None).await
    }

    pub async fn create(
        db: &Database,
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
    ) -> Result<Self, mongodb::error::Error> {
        let now = Utc::now();
        let strategy = Self {
            id: Uuid::new_v4(),
            user_id,
            name: name.to_string(),
            strategy_type: strategy_type.to_string(),
            trading_pair: trading_pair.to_string(),
            execution_platform: execution_platform.to_string(),
            min_trade_size,
            max_trade_size,
            max_daily_volume,
            auto_trading,
            stealth_mode,
            risk_alerts,
            transaction_delay,
            trade_frequency,
            created_at: now,
            updated_at: now,
        };

        Self::collection(db).insert_one(&strategy, None).await?;
        Ok(strategy)
    }

    pub async fn update(
        db: &Database,
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
    ) -> Result<Self, mongodb::error::Error> {
        let filter = doc! { "_id": id, "user_id": user_id };
        let now = Utc::now();
        
        let update = doc! {
            "$set": {
                "name": name,
                "strategy_type": strategy_type,
                "trading_pair": trading_pair,
                "execution_platform": execution_platform,
                "min_trade_size": min_trade_size,
                "max_trade_size": max_trade_size,
                "max_daily_volume": max_daily_volume,
                "auto_trading": auto_trading,
                "stealth_mode": stealth_mode,
                "risk_alerts": risk_alerts,
                "transaction_delay": transaction_delay,
                "trade_frequency": trade_frequency,
                "updated_at": now
            }
        };

        Self::collection(db).update_one(filter.clone(), update, None).await?;
        
        // Fetch the updated document
        let updated = Self::collection(db).find_one(filter, None).await?
            .ok_or_else(|| mongodb::error::Error::from(mongodb::error::ErrorKind::InvalidArgument { message: "Strategy not found after update".into() }))?;
        
        Ok(updated)
    }
} 