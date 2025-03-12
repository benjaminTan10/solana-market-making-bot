use {
    crate::common::logger::Logger,
    anyhow::{anyhow, Result},
    reqwest::{Client, header::HeaderMap, StatusCode},
    serde::{Deserialize, Serialize},
    serde_json::json,
    solana_sdk::{
        pubkey::Pubkey,
        signature::{Keypair, Signer},
        transaction::Transaction,
    },
    std::{str::FromStr, sync::Arc},
    tokio::time::sleep,
    std::time::Duration,
    base64::Engine,
};

const JUPITER_API_URL: &str = "https://public.jupiterapi.com/pump-fun/swap";

// Priority fee levels for Jupiter API
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PriorityFeeLevel {
    #[serde(rename = "low")]
    Low,
    #[serde(rename = "medium")]
    Medium, 
    #[serde(rename = "high")]
    High,
    #[serde(rename = "extreme")]
    Extreme,
}

impl Default for PriorityFeeLevel {
    fn default() -> Self {
        PriorityFeeLevel::High
    }
}

// Response from Jupiter API
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JupiterResponse {
    pub transaction: String,
}

pub struct JupiterClient {
    client: Client,
    wallet: Arc<Keypair>,
    rpc_client: Arc<solana_client::nonblocking::rpc_client::RpcClient>,
    logger: Logger,
}

impl JupiterClient {
    pub fn new(
        wallet: Arc<Keypair>,
        rpc_client: Arc<solana_client::nonblocking::rpc_client::RpcClient>,
    ) -> Self {
        let logger = Logger::new("[JUPITER-API]".to_string());
        let client = Client::new();
        
        Self {
            client,
            wallet,
            rpc_client,
            logger,
        }
    }

    pub async fn swap(
        &self,
        mint: &str,
        amount: u64,
        is_buy: bool,
    ) -> Result<String> {
        // Validate mint address
        let _mint_pubkey = Pubkey::from_str(mint)?;
        
        // Prepare request payload
        let swap_type = if is_buy { "BUY" } else { "SELL" };
        
        // Use Signer trait method to get pubkey
        let wallet_pubkey = self.wallet.pubkey().to_string();
        
        let payload = json!({
            "wallet": wallet_pubkey,
            "type": swap_type,
            "mint": mint,
            "inAmount": amount.to_string(),
            "priorityFeeLevel": "high",
            "slippageBps": "100",
            "commitment": "confirmed"
        });
        
        self.logger.info(format!("Sending {} request to Jupiter API for {} {} tokens", 
            swap_type, amount, mint));
        
        // Create headers
        let mut headers = HeaderMap::new();
        headers.insert("Content-Type", "application/json".parse()?);
        
        // Send request with retries
        let max_retries = 3;
        let mut retry_count = 0;
        let mut last_error = None;
        
        while retry_count < max_retries {
            match self.client.post(JUPITER_API_URL)
                .headers(headers.clone())
                .json(&payload)
                .send()
                .await {
                    Ok(response) => {
                        // Store the status code before consuming the response
                        let status = response.status();
                        
                        // Check if response is successful
                        if status.is_success() {
                            // Parse response
                            let jupiter_response: JupiterResponse = response.json().await?;
                            
                            // Use the updated base64 decode method
                            let transaction_bytes = base64::engine::general_purpose::STANDARD
                                .decode(&jupiter_response.transaction)?;
                            
                            // Deserialize transaction
                            let transaction: Transaction = bincode::deserialize(&transaction_bytes)?;
                            
                            // Sign and send transaction
                            self.logger.info("Sending transaction to the network...".to_string());
                            
                            // Send transaction with retries
                            let signature = self.rpc_client
                                .send_and_confirm_transaction(&transaction)
                                .await?;
                            
                            return Ok(signature.to_string());
                        } else {
                            // Handle error response
                            let error_text = response.text().await?;
                            self.logger.error(format!("Jupiter API error: {} (Status: {})", 
                                error_text, status));
                            
                            last_error = Some(anyhow!("API error: {} (Status: {})", 
                                error_text, status));
                        }
                    },
                    Err(e) => {
                        self.logger.error(format!("Request error: {}", e));
                        last_error = Some(anyhow!("Request error: {}", e));
                    }
                }
            
            // Increment retry count and wait before retrying
            retry_count += 1;
            if retry_count < max_retries {
                self.logger.warning(format!("Retrying request ({}/{})", retry_count, max_retries));
                sleep(Duration::from_millis(500)).await;
            }
        }
        
        // Return last error if all retries failed
        Err(last_error.unwrap_or_else(|| anyhow!("Failed to send request after {} retries", max_retries)))
    }
} 