use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Transaction {
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
    pub async fn find_by_user(pool: &PgPool, user_id: Uuid, limit: i64) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT * FROM transactions 
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
            "#,
            user_id,
            limit
        )
        .fetch_all(pool)
        .await
    }

    pub async fn find_by_wallet(pool: &PgPool, wallet_id: Uuid, user_id: Uuid, limit: i64) -> Result<Vec<Self>, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            SELECT * FROM transactions 
            WHERE wallet_id = $1 AND user_id = $2
            ORDER BY created_at DESC
            LIMIT $3
            "#,
            wallet_id,
            user_id,
            limit
        )
        .fetch_all(pool)
        .await
    }

    pub async fn create(
        pool: &PgPool,
        user_id: Uuid,
        wallet_id: Uuid,
        action: &str,
        amount: f64,
        token: &str,
        price: f64,
        status: &str,
        slippage: Option<f64>,
        transaction_hash: Option<&str>,
    ) -> Result<Self, sqlx::Error> {
        sqlx::query_as!(
            Self,
            r#"
            INSERT INTO transactions (
                id, user_id, wallet_id, action, amount, token, price, 
                status, slippage, transaction_hash, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
            "#,
            Uuid::new_v4(),
            user_id,
            wallet_id,
            action,
            amount,
            token,
            price,
            status,
            slippage,
            transaction_hash,
            Utc::now()
        )
        .fetch_one(pool)
        .await
    }
} 