use actix_web::{
    dev::Payload, error::ErrorUnauthorized, http::header, web, Error, FromRequest, HttpRequest,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::future::{ready, Ready};
use uuid::Uuid;

use crate::config::Config;
use crate::models::user::User;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: i64,
    pub iat: i64,
}

#[derive(Debug)]
pub struct AuthenticatedUser {
    pub user_id: Uuid,
}

impl FromRequest for AuthenticatedUser {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        // Extract the token from the Authorization header
        let auth_header = req
            .headers()
            .get(header::AUTHORIZATION)
            .and_then(|h| h.to_str().ok());

        if let Some(auth_header) = auth_header {
            if auth_header.starts_with("Bearer ") {
                let token = &auth_header[7..]; // Remove "Bearer " prefix
                let config = Config::from_env();
                
                // Decode the token
                match decode::<Claims>(
                    token,
                    &DecodingKey::from_secret(config.jwt_secret.as_bytes()),
                    &Validation::default(),
                ) {
                    Ok(token_data) => {
                        // Convert the subject to a UUID
                        if let Ok(user_id) = Uuid::parse_str(&token_data.claims.sub) {
                            return ready(Ok(AuthenticatedUser { user_id }));
                        }
                    }
                    Err(_) => {}
                }
            }
        }

        ready(Err(ErrorUnauthorized("Invalid or missing authentication token")))
    }
}

pub fn generate_token(user_id: Uuid) -> Result<String, jsonwebtoken::errors::Error> {
    let config = Config::from_env();
    let now = Utc::now();
    let expires_at = now + Duration::seconds(config.jwt_expiration);
    
    let claims = Claims {
        sub: user_id.to_string(),
        exp: expires_at.timestamp(),
        iat: now.timestamp(),
    };
    
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
    )
} 