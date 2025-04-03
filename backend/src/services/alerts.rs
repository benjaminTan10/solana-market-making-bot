use sqlx::PgPool;
use uuid::Uuid;

use crate::api::alerts::AlertRequest;
use crate::models::alert::Alert;
use crate::utils::errors::ServiceError;

pub async fn get_alerts(
    pool: &PgPool,
    user_id: Uuid,
) -> Result<Vec<Alert>, ServiceError> {
    let alerts = Alert::find_by_user(pool, user_id).await?;
    Ok(alerts)
}

pub async fn create_alert(
    pool: &PgPool,
    user_id: Uuid,
    req: AlertRequest,
) -> Result<Alert, ServiceError> {
    // Validate alert parameters
    match req.alert_type.as_str() {
        "price" => {
            if req.price_threshold.is_none() || req.is_above.is_none() {
                return Err(ServiceError::BadRequest("Price alerts require price_threshold and is_above parameters".into()));
            }
        },
        "percentage" => {
            if req.percentage_change.is_none() || req.is_above.is_none() {
                return Err(ServiceError::BadRequest("Percentage alerts require percentage_change and is_above parameters".into()));
            }
        },
        _ => return Err(ServiceError::BadRequest("Invalid alert type".into())),
    }
    
    // Create the alert
    let alert = Alert::create(
        pool,
        user_id,
        &req.alert_type,
        &req.market_pair,
        req.price_threshold,
        req.percentage_change,
        req.is_above,
        req.enabled,
    ).await?;
    
    Ok(alert)
}

pub async fn delete_alert(
    pool: &PgPool,
    user_id: Uuid,
    alert_id: Uuid,
) -> Result<(), ServiceError> {
    // Delete the alert
    Alert::delete(pool, alert_id, user_id).await?;
    Ok(())
} 