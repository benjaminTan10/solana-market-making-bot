use actix_web::{web, HttpResponse, Responder, post};
use serde::{Deserialize, Serialize};
use mongodb::Database;
use crate::services::auth::{login_user, register_user};
use crate::utils::errors::ServiceError;

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub name: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user_id: uuid::Uuid,
    pub email: String,
}

#[post("/login")]
async fn login(
    req: web::Json<LoginRequest>,
    db: web::Data<Database>,
) -> impl Responder {
    match login_user(&db, &req.email, &req.password).await {
        Ok((user, token)) => HttpResponse::Ok().json(AuthResponse {
            token,
            user_id: user.id,
            email: user.email,
        }),
        Err(e) => {
            let error_response = format!("Login failed: {}", e);
            HttpResponse::Unauthorized().body(error_response)
        }
    }
}

#[post("/register")]
async fn register(
    req: web::Json<RegisterRequest>,
    db: web::Data<Database>,
) -> impl Responder {
    match register_user(&db, &req.email, &req.password, &req.name).await {
        Ok((user, token)) => HttpResponse::Created().json(AuthResponse {
            token,
            user_id: user.id,
            email: user.email,
        }),
        Err(e) => {
            let error_response = format!("Registration failed: {}", e);
            HttpResponse::BadRequest().body(error_response)
        }
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .service(login)
            .service(register)
    );
} 