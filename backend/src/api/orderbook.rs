use actix_web::{web, HttpResponse, Responder, get};
use crate::services::orderbook::{get_order_book, get_market_price};
use crate::utils::auth::AuthenticatedUser;

#[get("/{market_pair}")]
async fn get_orders(
    auth_user: AuthenticatedUser,
    path: web::Path<String>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    let market_pair = path.into_inner();
    match get_order_book(&db_pool, &market_pair).await {
        Ok(orders) => HttpResponse::Ok().json(orders),
        Err(e) => {
            let error_response = format!("Failed to fetch order book: {}", e);
            HttpResponse::InternalServerError().body(error_response)
        }
    }
}

#[get("/price/{market_pair}")]
async fn get_price(
    auth_user: AuthenticatedUser,
    path: web::Path<String>,
    db_pool: web::Data<sqlx::PgPool>,
) -> impl Responder {
    let market_pair = path.into_inner();
    match get_market_price(&db_pool, &market_pair).await {
        Ok(price) => HttpResponse::Ok().json(price),
        Err(e) => {
            let error_response = format!("Failed to fetch market price: {}", e);
            HttpResponse::InternalServerError().body(error_response)
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/orderbook")
            .service(get_orders)
            .service(get_price)
    );
} 