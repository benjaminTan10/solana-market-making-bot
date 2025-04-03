use actix_web::{error::ResponseError, http::StatusCode, HttpResponse};
use serde::Serialize;
use std::fmt;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ServiceError {
    #[error("Internal Server Error: {0}")]
    InternalServerError(String),
    
    #[error("Bad Request: {0}")]
    BadRequest(String),
    
    #[error("Unauthorized: {0}")]
    Unauthorized(String),
    
    #[error("Not Found: {0}")]
    NotFound(String),
    
    #[error("Conflict: {0}")]
    Conflict(String),
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

impl ResponseError for ServiceError {
    fn error_response(&self) -> HttpResponse {
        let error_message = self.to_string();
        let error_response = ErrorResponse {
            error: error_message,
        };
        
        HttpResponse::build(self.status_code())
            .json(error_response)
    }
    
    fn status_code(&self) -> StatusCode {
        match *self {
            ServiceError::InternalServerError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ServiceError::BadRequest(_) => StatusCode::BAD_REQUEST,
            ServiceError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            ServiceError::NotFound(_) => StatusCode::NOT_FOUND,
            ServiceError::Conflict(_) => StatusCode::CONFLICT,
        }
    }
}

impl From<sqlx::Error> for ServiceError {
    fn from(error: sqlx::Error) -> ServiceError {
        match error {
            sqlx::Error::RowNotFound => ServiceError::NotFound("Resource not found".into()),
            sqlx::Error::Database(e) if e.constraint().is_some() => {
                ServiceError::Conflict("Resource already exists".into())
            }
            _ => ServiceError::InternalServerError(error.to_string()),
        }
    }
}

impl From<jsonwebtoken::errors::Error> for ServiceError {
    fn from(error: jsonwebtoken::errors::Error) -> ServiceError {
        ServiceError::Unauthorized(error.to_string())
    }
}

impl From<bcrypt::BcryptError> for ServiceError {
    fn from(error: bcrypt::BcryptError) -> ServiceError {
        ServiceError::InternalServerError(error.to_string())
    }
} 