use actix_web::{web, HttpResponse, Responder, get, post, delete};
use serde::{Deserialize, Serialize};
use crate::services::wallets::{get_wallets, add_wallet, remove_wallet, get_wallet_balance};
use crate::utils::auth::AuthenticatedUser;

#[derive(Debug, Deserialize)]
pub struct AddWalletRequest {
    pub address: String,
    pub label: Option<String>,
    pub allocation_percentage: Option<f64>,
}

#[derive(Debug, Serialize)]
pub struct WalletResponse {
    pub id: uuid::Uuid,
    pub address: String,
    pub label: Option<String>,
    pub balance: f64,
    pub allocation_percentage: f64,
    pub status: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[get("")]
async fn list_wallets(
    auth_user: AuthenticatedUser,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match get_wallets(&db_pool, auth_user.user_id).await {
        Ok(wallets) => HttpResponse::Ok().json(wallets),
        Err(e) => {
            let error_response = format!("Failed to fetch wallets: {}", e);
            HttpResponse::InternalServerError().body(error_response)
        }
    }
}

#[post("")]
async fn create_wallet(
    auth_user: AuthenticatedUser,
    req: web::Json<AddWalletRequest>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match add_wallet(
        &db_pool, 
        auth_user.user_id, 
        &req.address, 
        req.label.as_deref(), 
        req.allocation_percentage
    ).await {
        Ok(wallet) => HttpResponse::Created().json(wallet),
        Err(e) => {
            let error_response = format!("Failed to add wallet: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

#[delete("/{wallet_id}")]
async fn delete_wallet(
    auth_user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    let wallet_id = path.into_inner();
    match remove_wallet(&db_pool, auth_user.user_id, wallet_id).await {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => {
            let error_response = format!("Failed to remove wallet: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

#[get("/{wallet_id}/balance")]
async fn wallet_balance(
    auth_user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    let wallet_id = path.into_inner();
    match get_wallet_balance(&db_pool, auth_user.user_id, wallet_id).await {
        Ok(balance) => HttpResponse::Ok().json(balance),
        Err(e) => {
            let error_response = format!("Failed to get wallet balance: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/wallets")
            .service(list_wallets)
            .service(create_wallet)
            .service(delete_wallet)
            .service(wallet_balance)
    );
} 