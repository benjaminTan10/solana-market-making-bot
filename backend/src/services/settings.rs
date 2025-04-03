use mongodb::Database;
use uuid::Uuid;

use crate::api::settings::SettingsRequest;
use crate::models::settings::Settings;
use crate::utils::errors::ServiceError;

pub async fn get_user_settings(
    db: &Database,
    user_id: Uuid,
) -> Result<Settings, ServiceError> {
    let settings = Settings::find_by_user(db, user_id).await?
        .ok_or_else(|| ServiceError::NotFound("Settings not found".into()))?;
    
    Ok(settings)
}

pub async fn update_user_settings(
    db: &Database,
    user_id: Uuid,
    req: SettingsRequest,
) -> Result<Settings, ServiceError> {
    // Validate settings
    if let Some(min_balance) = req.min_wallet_balance {
        if min_balance < 0.0 {
            return Err(ServiceError::BadRequest("Minimum wallet balance cannot be negative".into()));
        }
    }
    
    if let Some(allocation) = req.default_allocation_percentage {
        if allocation < 0.0 || allocation > 100.0 {
            return Err(ServiceError::BadRequest("Allocation percentage must be between 0 and 100".into()));
        }
    }
    
    if let Some(risk_level) = &req.risk_level {
        if !["low", "medium", "high"].contains(&risk_level.to_lowercase().as_str()) {
            return Err(ServiceError::BadRequest("Risk level must be low, medium, or high".into()));
        }
    }
    
    // Update settings
    let settings = Settings::create_or_update(
        db,
        user_id,
        req.min_wallet_balance,
        req.default_allocation_percentage,
        req.risk_level.as_deref(),
        req.notification_email.as_deref(),
        req.auto_rebalance,
    ).await?;
    
    Ok(settings)
} 