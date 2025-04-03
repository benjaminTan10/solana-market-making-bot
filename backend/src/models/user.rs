use bson::{doc, Document};
use chrono::{DateTime, Utc};
use mongodb::{Collection, Database};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: Uuid,
    pub email: String,
    pub name: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl User {
    pub fn collection(db: &Database) -> Collection<Self> {
        db.collection::<Self>("users")
    }

    pub async fn find_by_id(db: &Database, id: Uuid) -> Result<Option<Self>, mongodb::error::Error> {
        let filter = doc! { "_id": id };
        Self::collection(db).find_one(filter, None).await
    }

    pub async fn find_by_email(db: &Database, email: &str) -> Result<Option<Self>, mongodb::error::Error> {
        let filter = doc! { "email": email };
        Self::collection(db).find_one(filter, None).await
    }

    pub async fn create(
        db: &Database,
        email: &str,
        name: &str,
        password_hash: &str,
    ) -> Result<Self, mongodb::error::Error> {
        let now = Utc::now();
        let user = Self {
            id: Uuid::new_v4(),
            email: email.to_string(),
            name: name.to_string(),
            password_hash: password_hash.to_string(),
            created_at: now,
            updated_at: now,
        };

        Self::collection(db).insert_one(&user, None).await?;
        Ok(user)
    }
} 