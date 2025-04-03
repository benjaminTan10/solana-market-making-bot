use bson::{doc, Document};
use chrono::{DateTime, Utc};
use mongodb::{Collection, Database};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Wallet {
    #[serde(rename = "_id")]
    pub id: Uuid,
    pub user_id: Uuid,
    pub address: String,
    pub label: Option<String>,
    pub allocation_percentage: f64,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Wallet {
    pub fn collection(db: &Database) -> Collection<Self> {
        db.collection::<Self>("wallets")
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
        address: &str,
        label: Option<&str>,
        allocation_percentage: Option<f64>,
    ) -> Result<Self, mongodb::error::Error> {
        let now = Utc::now();
        let wallet = Self {
            id: Uuid::new_v4(),
            user_id,
            address: address.to_string(),
            label: label.map(|s| s.to_string()),
            allocation_percentage: allocation_percentage.unwrap_or(0.0),
            status: "Active".to_string(),
            created_at: now,
            updated_at: now,
        };

        Self::collection(db).insert_one(&wallet, None).await?;
        Ok(wallet)
    }

    pub async fn delete(db: &Database, id: Uuid, user_id: Uuid) -> Result<(), mongodb::error::Error> {
        let filter = doc! { "_id": id, "user_id": user_id };
        Self::collection(db).delete_one(filter, None).await?;
        Ok(())
    }
} 