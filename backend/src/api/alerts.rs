use actix_web::{web, HttpResponse, Responder, get, post, delete};
use serde::{Deserialize, Serialize};
use crate::services::alerts::{get_alerts, create_alert, delete_alert};
use crate::utils::auth::AuthenticatedUser;

#[derive(Debug, Deserialize)]
pub struct AlertRequest {
    pub alert_type: String,
    pub market_pair: String,
    pub price_threshold: Option<f64>,
    pub percentage_change: Option<f64>,
    pub is_above: Option<bool>,
    pub enabled: bool,
}

#[get("")]
async fn list_alerts(
    auth_user: AuthenticatedUser,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match get_alerts(&db_pool, auth_user.user_id).await {
        Ok(alerts) => HttpResponse::Ok().json(alerts),
        Err(e) => {
            let error_response = format!("Failed to fetch alerts: {}", e);
            HttpResponse::InternalServerError().body(error_response)
        }
    }
}

#[post("")]
async fn add_alert(
    auth_user: AuthenticatedUser,
    req: web::Json<AlertRequest>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match create_alert(&db_pool, auth_user.user_id, req.into_inner()).await {
        Ok(alert) => HttpResponse::Created().json(alert),
        Err(e) => {
            let error_response = format!("Failed to create alert: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

#[delete("/{alert_id}")]
async fn remove_alert(
    auth_user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    let alert_id = path.into_inner();
    match delete_alert(&db_pool, auth_user.user_id, alert_id).await {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => {
            let error_response = format!("Failed to delete alert: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/alerts")
            .service(list_alerts)
            .service(add_alert)
            .service(remove_alert)
    );
} 