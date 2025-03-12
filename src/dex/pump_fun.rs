use {
    crate::common::{logger::Logger, utils::import_env_var},
    anyhow::{anyhow, Result},
    anchor_client::{
        solana_sdk::{
            signature::Keypair,
            signer::Signer,
        },
        Cluster,
    },
    log::{error, info},     
    borsh::{BorshDeserialize, BorshSerialize},
    pumpfun::{
        accounts::BondingCurveAccount,
        PriorityFee,
        PumpFun as PumpFunClient,
        error::ClientError,
    },
    solana_client::nonblocking::rpc_client::RpcClient,
    solana_sdk::pubkey::Pubkey,
    std::{str::FromStr, sync::Arc, time::Duration},
    spl_associated_token_account::instruction::create_associated_token_account,
    tokio::time::sleep,
};
use super::jupiter_client::JupiterClient;

pub const PUMP_PROGRAM: &str = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
pub const PUMP_GLOBAL: &str = "4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf";
pub const PUMP_FEE_RECIPIENT: &str = "CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM";
pub const PUMP_ACCOUNT: &str = "Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1";
pub const PUMP_BUY_METHOD: u64 = 17177263679997991869;
pub const PUMP_SELL_METHOD: u64 = 17177263679997991869;
pub const TOKEN_PROGRAM: &str = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
pub const RENT_PROGRAM: &str = "SysvarRent111111111111111111111111111111111";
pub const ASSOCIATED_TOKEN_PROGRAM: &str = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

pub struct Pump {
    pub client: Arc<RpcClient>,
    pub keypair: Arc<Keypair>,
    pump_client: PumpFunClient,
    jupiter_client: JupiterClient,
}

impl Pump {
    pub fn new(client: Arc<RpcClient>, keypair: Arc<Keypair>) -> Self {
        let rpc_url = import_env_var("RPC_HTTPS");
        println!("RPC URL:::::: {}", rpc_url);
        info!("RPC URL: {}", rpc_url);
        let custom_cluster = Cluster::Custom(rpc_url, "".to_string());
        
        let pump_client = PumpFunClient::new(
            custom_cluster,
            keypair.clone(),
            None,
            None,
        );
        
        let jupiter_client = JupiterClient::new(keypair.clone(), client.clone());
    
        Self { 
            client,
            keypair,
            pump_client,
            jupiter_client,
        }
    }

    pub async fn ensure_token_account(&self, mint: &str) -> Result<()> {
        let mint_pubkey = Pubkey::from_str(mint)?;
        let wallet_pubkey = self.keypair.pubkey();
        let token_account = spl_associated_token_account::get_associated_token_address(
            &wallet_pubkey,
            &mint_pubkey
        );
        
        // Check if account exists
        match self.client.get_account(&token_account).await {
            Ok(_) => Ok(()),
            Err(_) => {
                // Create ATA if it doesn't exist
                let create_ata_ix = create_associated_token_account(
                    &self.keypair.pubkey(),
                    &self.keypair.pubkey(),
                    &mint_pubkey,
                    &spl_token::id(),
                );
                
                let recent_blockhash = self.client.get_latest_blockhash().await?;
                let transaction = solana_sdk::transaction::Transaction::new_signed_with_payer(
                    &[create_ata_ix],
                    Some(&self.keypair.pubkey()),
                    &[&*self.keypair],
                    recent_blockhash,
                );
                
                // Send transaction and wait for confirmation
                self.client.send_and_confirm_transaction_with_spinner(&transaction).await?;
                
                // Wait a moment for account to be available
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                
                // Try multiple times to verify account creation
                for _ in 0..3 {
                    match self.client.get_account(&token_account).await {
                        Ok(_) => return Ok(()),
                        Err(_) => {
                            tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                            continue;
                        }
                    }
                }
                
                Err(anyhow!("Failed to verify token account creation after multiple attempts"))
            }
        }
    }

    pub async fn get_token_balance(&self, mint: &str) -> Result<u64> {
        let mint_pubkey = Pubkey::from_str(mint)?;
        let wallet_pubkey = self.keypair.pubkey();
        let token_account = spl_associated_token_account::get_associated_token_address(
            &wallet_pubkey,
            &mint_pubkey
        );
        
        // Try to ensure token account exists
        match self.ensure_token_account(mint).await {
            Ok(_) => (),
            Err(e) => {
                println!("Warning: Failed to ensure token account: {} - Assuming 0 balance", e);
                return Ok(0);
            }
        }
        
        // Get balance, return 0 if account not found
        match self.client.get_token_account_balance(&token_account).await {
            Ok(balance) => {
                let amount = balance.amount.parse()?;
                println!("Found token balance: {}", amount);
                Ok(amount)
            },
            Err(e) => {
                println!("Failed to get token balance: {} - Assuming 0 balance", e);
                Ok(0)
            }
        }
    }

    pub async fn buy(&self, mint: &str, amount: u64) -> Result<String> {
        // Don't try to buy if amount is 0
        if amount == 0 {
            return Err(anyhow!("Cannot buy with 0 SOL"));
        }

        // Ensure we have enough SOL balance
        let wallet_balance = self.client.get_balance(&self.keypair.pubkey()).await?;
        if wallet_balance < amount {
            return Err(anyhow!("Insufficient SOL balance: have {}, need {}", wallet_balance, amount));
        }

        // Ensure token account exists before buying
        self.ensure_token_account(mint).await?;

        // Use Jupiter API for faster transactions
        self.jupiter_client.swap(mint, amount, true).await
    }

    pub async fn sell(&self, mint: &str, amount: u64) -> Result<String> {
        // Don't try to sell if amount is 0
        if amount == 0 {
            return Err(anyhow!("Cannot sell 0 tokens - No tokens available in wallet"));
        }

        // Ensure token account exists and we have enough balance
        let current_balance = self.get_token_balance(mint).await?;
        if current_balance == 0 {
            return Err(anyhow!("No tokens available in wallet to sell"));
        }
        if current_balance < amount {
            return Err(anyhow!("Insufficient token balance: have {} tokens, trying to sell {} tokens", 
                current_balance, amount));
        }

        // Use Jupiter API for faster transactions
        self.jupiter_client.swap(mint, amount, false).await
    }
}

#[derive(Debug)]
pub struct PumpInfo {
    pub mint: String,
    pub bonding_curve: String,
    pub associated_bonding_curve: String,
    pub raydium_pool: Option<String>,
    pub raydium_info: Option<String>,
    pub complete: bool,
    pub virtual_sol_reserves: u64,
    pub virtual_token_reserves: u64,
    pub total_supply: u64,
}

pub const PUMP_PROGRAM_ID: &str = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

#[derive(BorshSerialize, BorshDeserialize)]
struct BuyInstruction {
    amount: u64,
}

#[derive(BorshSerialize, BorshDeserialize)]
struct SellInstruction {
    amount: u64,
}

pub async fn execute_swap(
    pump: &Pump, 
    mint: &str, 
    is_buy: bool, 
    scale: u64,
    target_amount: Option<u64>
) -> Result<String> {
    let logger = Logger::new("[EXECUTE SWAP]".to_string());
    
    // Calculate amount based on target transaction if available
    let amount = match target_amount {
        Some(target_amt) => {
            // Copy target amount divided by scale
            let copy_amount = (target_amt as f64 / scale as f64) as u64;
            logger.info(format!(
                "Copying target transaction amount: {} SOL scaled by 1/{} = {} SOL",
                target_amt as f64 / 1_000_000_000.0,
                scale,
                copy_amount as f64 / 1_000_000_000.0
            ));
            copy_amount
        }
        None => {
            logger.info("No target transaction amount provided, skipping swap".to_string());
            return Err(anyhow!("No target amount provided for swap"));
        }
    };

    // Add minimum/maximum amount checks for buys
    if is_buy {
        // Check if we have enough balance including fees
        let required_balance = amount + 10_000_000; // Amount + 0.01 SOL for fees
        let wallet_balance = pump.client.get_balance(&pump.keypair.pubkey()).await?;
        
        if wallet_balance < required_balance {
            return Err(anyhow!("Insufficient balance: have {} SOL, need {} SOL (including fees)",
                wallet_balance as f64 / 1_000_000_000.0,
                required_balance as f64 / 1_000_000_000.0));
        }

        logger.info(format!(
            "Final buy amount after adjustments: {} SOL",
            amount as f64 / 1_000_000_000.0
        ));
    }

    // Execute the swap with additional logging
    let result = if is_buy {
        logger.info(format!(
            "Initiating buy transaction for {} SOL with mint {}",
            amount as f64 / 1_000_000_000.0,
            mint
        ));
        pump.buy(mint, amount).await
    } else {
        pump.sell(mint, amount).await
    };

    match &result {
        Ok(sig) => logger.success(format!("Swap executed successfully: {}", sig)),
        Err(e) => {
            logger.error(format!("Swap failed: {}", e));
            logger.info(String::from("Attempting to diagnose error..."));
            // Add diagnostic information
            if is_buy {
                if let Ok(balance) = pump.client.get_balance(&pump.keypair.pubkey()).await {
                    logger.info(format!("Current wallet balance: {} SOL", balance as f64 / 1_000_000_000.0));
                }
            } else {
                if let Ok(balance) = pump.get_token_balance(mint).await {
                    logger.info(format!("Current token balance: {}", balance));
                }
            }
        }
    }

    result
} 