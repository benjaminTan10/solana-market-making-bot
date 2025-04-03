use actix_web::{web, HttpResponse, Responder, get, put};
use serde::{Deserialize, Serialize};
use crate::services::settings::{get_user_settings, update_user_settings};
use crate::utils::auth::AuthenticatedUser;

#[derive(Debug, Deserialize)]
pub struct SettingsRequest {
    pub min_wallet_balance: Option<f64>,
    pub default_allocation_percentage: Option<f64>,
    pub risk_level: Option<String>,
    pub notification_email: Option<String>,
    pub auto_rebalance: Option<bool>,
}

#[get("")]
async fn get_settings(
    auth_user: AuthenticatedUser,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match get_user_settings(&db_pool, auth_user.user_id).await {
        Ok(settings) => HttpResponse::Ok().json(settings),
        Err(e) => {
            let error_response = format!("Failed to fetch settings: {}", e);
            HttpResponse::InternalServerError().body(error_response)
        }
    }
}

#[put("")]
async fn update_settings(
    auth_user: AuthenticatedUser,
    req: web::Json<SettingsRequest>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match update_user_settings(&db_pool, auth_user.user_id, req.into_inner()).await {
        Ok(settings) => HttpResponse::Ok().json(settings),
        Err(e) => {
            let error_response = format!("Failed to update settings: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/settings")
            .service(get_settings)
            .service(update_settings)
    );
} 