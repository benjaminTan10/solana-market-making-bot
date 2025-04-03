use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Wallet {
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
    pub async fn find_by_user(pool: &PgPool, user_id: Uuid) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT * FROM wallets WHERE user_id = $1
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
            SELECT * FROM wallets WHERE id = $1 AND user_id = $2
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
        address: &str,
        label: Option<&str>,
        allocation_percentage: Option<f64>,
    ) -> Result<Self, sqlx::Error> {
        let allocation = allocation_percentage.unwrap_or(0.0);
        
        sqlx::query_as!(
            Self,
            r#"
            INSERT INTO wallets (id, user_id, address, label, allocation_percentage, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            "#,
            Uuid::new_v4(),
            user_id,
            address,
            label,
            allocation,
            "Active",
            Utc::now(),
            Utc::now()
        )
        .fetch_one(pool)
        .await
    }

    pub async fn delete(pool: &PgPool, id: Uuid, user_id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            DELETE FROM wallets WHERE id = $1 AND user_id = $2
            "#,
            id,
            user_id
        )
        .execute(pool)
        .await?;

        Ok(())
    }
} 