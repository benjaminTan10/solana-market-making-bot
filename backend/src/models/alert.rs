use bson::{doc, Document};
use chrono::{DateTime, Utc};
use mongodb::{Collection, Database};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Alert {
    #[serde(rename = "_id")]
    pub id: Uuid,
    pub user_id: Uuid,
    pub alert_type: String,
    pub market_pair: String,
    pub price_threshold: Option<f64>,
    pub percentage_change: Option<f64>,
    pub is_above: Option<bool>,
    pub enabled: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Alert {
    pub fn collection(db: &Database) -> Collection<Self> {
        db.collection::<Self>("alerts")
    }

    pub async fn find_by_user(db: &Database, user_id: Uuid) -> Result<Vec<Self>, mongodb::error::Error> {
        let filter = doc! { "user_id": user_id };
        let cursor = Self::collection(db).find(filter, None).await?;
        cursor.try_collect().await
    }

    pub async fn create(
        db: &Database,
        user_id: Uuid,
        alert_type: &str,
        market_pair: &str,
        price_threshold: Option<f64>,
        percentage_change: Option<f64>,
        is_above: Option<bool>,
        enabled: bool,
    ) -> Result<Self, mongodb::error::Error> {
        let now = Utc::now();
        let alert = Self {
            id: Uuid::new_v4(),
            user_id,
            alert_type: alert_type.to_string(),
            market_pair: market_pair.to_string(),
            price_threshold,
            percentage_change,
            is_above,
            enabled,
            created_at: now,
            updated_at: now,
        };

        Self::collection(db).insert_one(&alert, None).await?;
        Ok(alert)
    }

    pub async fn delete(db: &Database, id: Uuid, user_id: Uuid) -> Result<(), mongodb::error::Error> {
        let filter = doc! { "_id": id, "user_id": user_id };
        Self::collection(db).delete_one(filter, None).await?;
        Ok(())
    }
} 