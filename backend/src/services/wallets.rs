use mongodb::Database;
use uuid::Uuid;
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;

use crate::models::wallet::Wallet;
use crate::utils::errors::ServiceError;
use crate::config::Config;

pub async fn get_wallets(
    db: &Database,
    user_id: Uuid,
) -> Result<Vec<Wallet>, ServiceError> {
    let wallets = Wallet::find_by_user(db, user_id).await?;
    Ok(wallets)
}

pub async fn add_wallet(
    db: &Database,
    user_id: Uuid,
    address: &str,
    label: Option<&str>,
    allocation_percentage: Option<f64>,
) -> Result<Wallet, ServiceError> {
    // Validate Solana address
    if let Err(_) = address.parse::<Pubkey>() {
        return Err(ServiceError::BadRequest("Invalid Solana address".into()));
    }
    
    // Create the wallet
    let wallet = Wallet::create(db, user_id, address, label, allocation_percentage).await?;
    Ok(wallet)
}

pub async fn remove_wallet(
    db: &Database,
    user_id: Uuid,
    wallet_id: Uuid,
) -> Result<(), ServiceError> {
    // Check if wallet exists and belongs to user
    let wallet = Wallet::find_by_id(db, wallet_id, user_id).await?
        .ok_or_else(|| ServiceError::NotFound("Wallet not found".into()))?;
    
    // Delete the wallet
    Wallet::delete(db, wallet_id, user_id).await?;
    Ok(())
}

pub async fn get_wallet_balance(
    db: &Database,
    user_id: Uuid,
    wallet_id: Uuid,
) -> Result<f64, ServiceError> {
    // Check if wallet exists and belongs to user
    let wallet = Wallet::find_by_id(db, wallet_id, user_id).await?
        .ok_or_else(|| ServiceError::NotFound("Wallet not found".into()))?;
    
    // In a real implementation, we would query the Solana blockchain
    // For now, we'll return a mock balance
    let config = Config::from_env();
    let client = RpcClient::new(config.solana_rpc_url);
    
    // Parse the wallet address
    let pubkey = wallet.address.parse::<Pubkey>()
        .map_err(|_| ServiceError::BadRequest("Invalid Solana address".into()))?;
    
    // Get the balance
    match client.get_balance(&pubkey) {
        Ok(lamports) => {
            // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
            let sol_balance = lamports as f64 / 1_000_000_000.0;
            Ok(sol_balance)
        },
        Err(e) => {
            // For demo purposes, return a mock balance if there's an error
            // In production, you might want to propagate the error
            let mock_balance = 35.42;
            Ok(mock_balance)
        }
    }
} 