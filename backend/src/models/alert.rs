use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Alert {
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
    pub async fn find_by_user(pool: &PgPool, user_id: Uuid) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT * FROM alerts WHERE user_id = $1
            "#,
            user_id
        )
        .fetch_all(pool)
        .await
    }

    pub async fn create(
        pool: &PgPool,
        user_id: Uuid,
        alert_type: &str,
        market_pair: &str,
        price_threshold: Option<f64>,
        percentage_change: Option<f64>,
        is_above: Option<bool>,
        enabled: bool,
    ) -> Result<Self, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            INSERT INTO alerts (
                id, user_id, alert_type, market_pair, price_threshold,
                percentage_change, is_above, enabled, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
            "#,
            Uuid::new_v4(),
            user_id,
            alert_type,
            market_pair,
            price_threshold,
            percentage_change,
            is_above,
            enabled,
            Utc::now(),
            Utc::now()
        )
        .fetch_one(pool)
        .await
    }

    pub async fn delete(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            DELETE FROM alerts WHERE id = $1 AND user_id = $2
            "#,
            id,
            user_id
        )
        .execute(pool)
        .await?;

        Ok(())
    }
} 