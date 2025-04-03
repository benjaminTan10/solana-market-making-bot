use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
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
    pub async fn find_by_user(pool: &PgPool, user_id: Uuid) -> Result<Option<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT * FROM settings WHERE user_id = $1
            "#,
            user_id
        )
        .fetch_optional(pool)
        .await
    }

    pub async fn create_or_update(
        pool: &PgPool,
        user_id: Uuid,
        min_wallet_balance: Option<f64>,
        default_allocation_percentage: Option<f64>,
        risk_level: Option<&str>,
        notification_email: Option<&str>,
        auto_rebalance: Option<bool>,
    ) -> Result<Self, sqlx::Error> {
        // Check if settings exist for this user
        let existing = Self::find_by_user(pool, user_id).await?;

        if let Some(settings) = existing {
            // Update existing settings
            sqlx::query_as!(
                Self,
                r#"
                UPDATE settings
                SET min_wallet_balance = COALESCE($3, min_wallet_balance),
                    default_allocation_percentage = COALESCE($4, default_allocation_percentage),
                    risk_level = COALESCE($5, risk_level),
                    notification_email = COALESCE($6, notification_email),
                    auto_rebalance = COALESCE($7, auto_rebalance),
                    updated_at = $8
                WHERE id = $1 AND user_id = $2
                RETURNING *
                "#,
                settings.id,
                user_id,
                min_wallet_balance,
                default_allocation_percentage,
                risk_level,
                notification_email,
                auto_rebalance,
                Utc::now()
            )
            .fetch_one(pool)
            .await
        } else {
            // Create new settings
            sqlx::query_as!(
                Self,
                r#"
                INSERT INTO settings (
                    id, user_id, min_wallet_balance, default_allocation_percentage,
                    risk_level, notification_email, auto_rebalance, created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
                "#,
                Uuid::new_v4(),
                user_id,
                min_wallet_balance.unwrap_or(0.1),
                default_allocation_percentage.unwrap_or(10.0),
                risk_level.unwrap_or("medium"),
                notification_email,
                auto_rebalance.unwrap_or(false),
                Utc::now(),
                Utc::now()
            )
            .fetch_one(pool)
            .await
        }
    }
} 