# Solana Market Nexus Backend

A robust backend service for the Solana Market Nexus application, providing market making bot administration and management capabilities on the Solana blockchain.

## Features

- User authentication and authorization with JWT
- Wallet management for Solana addresses
- Trading strategy configuration and execution
- Real-time order book monitoring
- Price alerts and notifications
- Performance analytics and reporting
- Transaction logging and history

## Technology Stack

- Rust
- Actix-web for HTTP server
- MongoDB for data persistence
- Solana SDK for blockchain interactions
- JWT for authentication
- CORS support
- Structured logging

## Prerequisites

- Rust (latest stable version)
- MongoDB
- Solana CLI tools (for development and testing)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=solana_market_nexus
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

## Project Structure

backend/
├── src/
│ ├── api/ # API route handlers
│ ├── models/ # Database models
│ ├── services/ # Business logic
│ ├── utils/ # Utility functions
│ ├── config.rs # Configuration management
│ ├── db.rs # Database connection
│ └── main.rs # Application entry point

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/wallets` - Wallet management
- `/api/trading` - Trading strategy operations
- `/api/orderbook` - Order book monitoring
- `/api/alerts` - Price alert management
- `/api/settings` - User settings

## Building and Running

1. Install dependencies:

```bash
cargo build
```

2. Run the server:
```bash
cargo run
```

The server will start on `http://localhost:8080` by default.

## Development

```bash
# Run with hot reload
cargo watch -x run

# Run tests
cargo test

# Check formatting
cargo fmt -- --check

# Run linter
cargo clippy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]





