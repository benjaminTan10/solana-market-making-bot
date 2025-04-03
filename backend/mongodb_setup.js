// Run this script with: mongo mongodb://localhost:27017/solana_market_nexus mongodb_setup.js

db = db.getSiblingDB('solana_market_nexus');

// Create unique index on users collection
db.users.createIndex({ email: 1 }, { unique: true });

// Create indexes for wallets collection
db.wallets.createIndex({ user_id: 1 });
db.wallets.createIndex({ address: 1 });

// Create indexes for strategies collection
db.strategies.createIndex({ user_id: 1 });

// Create indexes for transactions collection
db.transactions.createIndex({ user_id: 1 });
db.transactions.createIndex({ wallet_id: 1 });
db.transactions.createIndex({ created_at: -1 });

// Create indexes for alerts collection
db.alerts.createIndex({ user_id: 1 });
db.alerts.createIndex({ market_pair: 1 });

// Create indexes for settings collection
db.settings.createIndex({ user_id: 1 }, { unique: true });

print("MongoDB indexes created successfully"); 