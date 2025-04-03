-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    label VARCHAR(255),
    allocation_percentage FLOAT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Strategies table
CREATE TABLE strategies (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    strategy_type VARCHAR(50) NOT NULL,
    trading_pair VARCHAR(50) NOT NULL,
    execution_platform VARCHAR(50) NOT NULL,
    min_trade_size FLOAT NOT NULL,
    max_trade_size FLOAT NOT NULL,
    max_daily_volume FLOAT NOT NULL,
    auto_trading BOOLEAN NOT NULL,
    stealth_mode BOOLEAN NOT NULL,
    risk_alerts BOOLEAN NOT NULL,
    transaction_delay INTEGER NOT NULL,
    trade_frequency INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    amount FLOAT NOT NULL,
    token VARCHAR(50) NOT NULL,
    price FLOAT NOT NULL,
    status VARCHAR(50) NOT NULL,
    slippage FLOAT,
    transaction_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    market_pair VARCHAR(50) NOT NULL,
    price_threshold FLOAT,
    percentage_change FLOAT,
    is_above BOOLEAN,
    enabled BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    min_wallet_balance FLOAT NOT NULL,
    default_allocation_percentage FLOAT NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    notification_email VARCHAR(255),
    auto_rebalance BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
); 