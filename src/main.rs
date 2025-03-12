use {
    dotenvy::dotenv,
    crate::{
        common::{
            logger::Logger,
            utils::{create_nonblocking_rpc_client, create_rpc_client, import_env_var, import_wallet, AppState},
        },
        engine::monitor::grpc_monitor::monitor_transactions_grpc,
    },
    anyhow::Result,
    solana_sdk::signature::Signer,
    std::sync::Arc,
    tonic::transport::Channel,
    clap::{Parser, ArgAction},
};

mod common;
mod dex;
mod engine;
mod services;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Scale factor for transaction amounts (e.g. 10 means 1/10th of normal amount)
    #[arg(short, long, default_value_t = 1)]
    scale: u64,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize environment
    dotenv().ok();
    
    // Parse command line arguments
    let args = Args::parse();
    
    // Setup logging
    let logger = Logger::new("[MAIN]".to_string());
    logger.info(format!("Starting PumpFun sniper bot with scale 1/{} ...", args.scale));

    // Initialize clients and state
    let rpc_client = Arc::new(create_rpc_client()?);
    let rpc_nonblocking_client = Arc::new(create_nonblocking_rpc_client().await?);
    let wallet = import_wallet()?;
    
    logger.info(format!("Bot wallet: {}", wallet.pubkey()));

    let state = AppState {
        rpc_client: rpc_client.clone(),
        rpc_nonblocking_client: rpc_nonblocking_client.clone(),
        wallet: wallet.clone(),
        scale: args.scale,
    };

    // Get configuration from environment
    let slippage = import_env_var("SLIPPAGE").parse::<u64>().unwrap_or(5);
    let grpc_url = import_env_var("RPC_GRPC");
    
    // Validate gRPC URL format
    if !grpc_url.starts_with("http://") && !grpc_url.starts_with("https://") {
        logger.error("Invalid gRPC URL format - must start with http:// or https://".to_string());
        return Err(anyhow::anyhow!("Invalid gRPC URL format"));
    }

    logger.success("Bot initialization complete".to_string());
    logger.info("Starting gRPC transaction monitor...".to_string());

    // Create gRPC channel
    let channel = Channel::from_shared(grpc_url.clone())?
        .connect()
        .await?;

    // Start gRPC monitoring
    monitor_transactions_grpc(&grpc_url, state).await?;

    Ok(())
}
