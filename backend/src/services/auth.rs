use bcrypt::{hash, verify, DEFAULT_COST};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::user::User;
use crate::utils::auth::generate_token;
use crate::utils::errors::ServiceError;

pub async fn register_user(
    pool: &PgPool,
    email: &str,
    password: &str,
    name: &str,
) -> Result<(User, String), ServiceError> {
    // Check if user already exists
    if let Some(_) = User::find_by_email(pool, email).await? {
        return Err(ServiceError::Conflict("User with this email already exists".into()));
    }
    
    // Hash the password
    let password_hash = hash(password, DEFAULT_COST)?;
    
    // Create the user
    let user = User::create(pool, email, name, &password_hash).await?;
    
    // Generate a JWT token
    let token = generate_token(user.id)?;
    
    Ok((user, token))
}

pub async fn login_user(
    pool: &PgPool,
    email: &str,
    password: &str,
) -> Result<(User, String), ServiceError> {
    // Find the user
    let user = User::find_by_email(pool, email).await?
        .ok_or_else(|| ServiceError::Unauthorized("Invalid email or password".into()))?;
    
    // Verify the password
    if !verify(password, &user.password_hash)? {
        return Err(ServiceError::Unauthorized("Invalid email or password".into()));
    }
    
    // Generate a JWT token
    let token = generate_token(user.id)?;
    
    Ok((user, token))
} 