use crate::config::Config;
use mongodb::{Client, Database};
use std::time::Duration;

pub async fn init_db(config: &Config) -> Database {
    let client_options = mongodb::options::ClientOptions::parse(&config.mongodb_uri)
        .await
        .expect("Failed to parse MongoDB connection string");
    
    let client = Client::with_options(client_options)
        .expect("Failed to create MongoDB client");
    
    // Get a handle to the database
    client.database(&config.mongodb_database)
} 