use actix_web::{web, HttpResponse, Responder, get, post, put};
use serde::{Deserialize, Serialize};
use crate::services::trading::{get_trading_strategies, create_strategy, update_strategy, execute_trade};
use crate::utils::auth::AuthenticatedUser;

#[derive(Debug, Deserialize)]
pub struct StrategyRequest {
    pub name: String,
    pub strategy_type: String,
    pub trading_pair: String,
    pub execution_platform: String,
    pub min_trade_size: f64,
    pub max_trade_size: f64,
    pub max_daily_volume: f64,
    pub auto_trading: bool,
    pub stealth_mode: bool,
    pub risk_alerts: bool,
    pub transaction_delay: i32,
    pub trade_frequency: i32,
}

#[derive(Debug, Deserialize)]
pub struct TradeRequest {
    pub wallet_id: uuid::Uuid,
    pub action: String,  // "buy" or "sell"
    pub amount: f64,
    pub token: String,
    pub price: Option<f64>,
}

#[get("/strategies")]
async fn list_strategies(
    auth_user: AuthenticatedUser,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match get_trading_strategies(&db_pool, auth_user.user_id).await {
        Ok(strategies) => HttpResponse::Ok().json(strategies),
        Err(e) => {
            let error_response = format!("Failed to fetch strategies: {}", e);
            HttpResponse::InternalServerError().body(error_response)
        }
    }
}

#[post("/strategies")]
async fn add_strategy(
    auth_user: AuthenticatedUser,
    req: web::Json<StrategyRequest>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match create_strategy(&db_pool, auth_user.user_id, req.into_inner()).await {
        Ok(strategy) => HttpResponse::Created().json(strategy),
        Err(e) => {
            let error_response = format!("Failed to create strategy: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

#[put("/strategies/{strategy_id}")]
async fn update_strategy_handler(
    auth_user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
    req: web::Json<StrategyRequest>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    let strategy_id = path.into_inner();
    match update_strategy(&db_pool, auth_user.user_id, strategy_id, req.into_inner()).await {
        Ok(strategy) => HttpResponse::Ok().json(strategy),
        Err(e) => {
            let error_response = format!("Failed to update strategy: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

#[post("/execute")]
async fn execute_trade_handler(
    auth_user: AuthenticatedUser,
    req: web::Json<TradeRequest>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    match execute_trade(&db_pool, auth_user.user_id, req.into_inner()).await {
        Ok(transaction) => HttpResponse::Ok().json(transaction),
        Err(e) => {
            let error_response = format!("Failed to execute trade: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/trading")
            .service(list_strategies)
            .service(add_strategy)
            .service(update_strategy_handler)
            .service(execute_trade_handler)
    );
} 