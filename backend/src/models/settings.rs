use bson::{doc, Document};
use chrono::{DateTime, Utc};
use mongodb::{Collection, Database};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
    #[serde(rename = "_id")]
    pub id: Uuid,
    pub user_id: Uuid,
    pub min_wallet_balance: f64,
    pub default_allocation_percentage: f64,
    pub risk_level: String,
    pub notification_email: Option<String>,
    pub auto_rebalance: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Settings {
    pub fn collection(db: &Database) -> Collection<Self> {
        db.collection::<Self>("settings")
    }

    pub async fn find_by_user(db: &Database, user_id: Uuid) -> Result<Option<Self>, mongodb::error::Error> {
        let filter = doc! { "user_id": user_id };
        Self::collection(db).find_one(filter, None).await
    }

    pub async fn create_or_update(
        db: &Database,
        user_id: Uuid,
        min_wallet_balance: Option<f64>,
        default_allocation_percentage: Option<f64>,
        risk_level: Option<&str>,
        notification_email: Option<&str>,
        auto_rebalance: Option<bool>,
    ) -> Result<Self, mongodb::error::Error> {
        // Check if settings exist for this user
        let existing = Self::find_by_user(db, user_id).await?;

        if let Some(settings) = existing {
            // Update existing settings
            let filter = doc! { "_id": settings.id };
            let now = Utc::now();
            
            let mut update_doc = doc! { "updated_at": now };
            
            if let Some(min_balance) = min_wallet_balance {
                update_doc.insert("min_wallet_balance", min_balance);
            }
            
            if let Some(allocation) = default_allocation_percentage {
                update_doc.insert("default_allocation_percentage", allocation);
            }
            
            if let Some(risk) = risk_level {
                update_doc.insert("risk_level", risk);
            }
            
            if let Some(email) = notification_email {
                update_doc.insert("notification_email", email);
            }
            
            if let Some(rebalance) = auto_rebalance {
                update_doc.insert("auto_rebalance", rebalance);
            }
            
            let update = doc! { "$set": update_doc };
            
            Self::collection(db).update_one(filter.clone(), update, None).await?;
            
            // Fetch the updated document
            let updated = Self::collection(db).find_one(filter, None).await?
                .ok_or_else(|| mongodb::error::Error::from(mongodb::error::ErrorKind::InvalidArgument { message: "Settings not found after update".into() }))?;
            
            Ok(updated)
        } else {
            // Create new settings
            let now = Utc::now();
            let settings = Self {
                id: Uuid::new_v4(),
                user_id,
                min_wallet_balance: min_wallet_balance.unwrap_or(0.1),
                default_allocation_percentage: default_allocation_percentage.unwrap_or(10.0),
                risk_level: risk_level.unwrap_or("medium").to_string(),
                notification_email: notification_email.map(|s| s.to_string()),
                auto_rebalance: auto_rebalance.unwrap_or(false),
                created_at: now,
                updated_at: now,
            };

            Self::collection(db).insert_one(&settings, None).await?;
            Ok(settings)
        }
    }
} 