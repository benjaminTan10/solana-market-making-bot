use actix_web::web;

mod auth;
mod wallets;
mod trading;
mod orderbook;
mod alerts;
mod settings;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .configure(auth::config)
            .configure(wallets::config)
            .configure(trading::config)
            .configure(orderbook::config)
            .configure(alerts::config)
            .configure(settings::config),
    );
} 