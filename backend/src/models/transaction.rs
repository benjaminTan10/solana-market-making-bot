use bson::{doc, Document};
use chrono::{DateTime, Utc};
use mongodb::{Collection, Database};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Transaction {
    #[serde(rename = "_id")]
    pub id: Uuid,
    pub user_id: Uuid,
    pub wallet_id: Uuid,
    pub action: String,
    pub amount: f64,
    pub token: String,
    pub price: f64,
    pub status: String,
    pub slippage: Option<f64>,
    pub transaction_hash: Option<String>,
    pub created_at: DateTime<Utc>,
}

impl Transaction {
    pub fn collection(db: &Database) -> Collection<Self> {
        db.collection::<Self>("transactions")
    }

    pub async fn find_by_user(db: &Database, user_id: Uuid, limit: i64) -> Result<Vec<Self>, mongodb::error::Error> {
        let filter = doc! { "user_id": user_id };
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "created_at": -1 })
            .limit(limit)
            .build();
            
        let cursor = Self::collection(db).find(filter, options).await?;
        cursor.try_collect().await
    }

    pub async fn find_by_wallet(db: &Database, wallet_id: Uuid, user_id: Uuid, limit: i64) -> Result<Vec<Self>, mongodb::error::Error> {
        let filter = doc! { "wallet_id": wallet_id, "user_id": user_id };
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "created_at": -1 })
            .limit(limit)
            .build();
            
        let cursor = Self::collection(db).find(filter, options).await?;
        cursor.try_collect().await
    }

    pub async fn create(
        db: &Database,
        user_id: Uuid,
        wallet_id: Uuid,
        action: &str,
        amount: f64,
        token: &str,
        price: f64,
        status: &str,
        slippage: Option<f64>,
        transaction_hash: Option<&str>,
    ) -> Result<Self, mongodb::error::Error> {
        let transaction = Self {
            id: Uuid::new_v4(),
            user_id,
            wallet_id,
            action: action.to_string(),
            amount,
            token: token.to_string(),
            price,
            status: status.to_string(),
            slippage,
            transaction_hash: transaction_hash.map(|s| s.to_string()),
            created_at: Utc::now(),
        };

        Self::collection(db).insert_one(&transaction, None).await?;
        Ok(transaction)
    }
} 