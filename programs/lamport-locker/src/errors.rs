use anchor_lang::error_code;

#[error_code]
pub enum VaultError {
    #[msg("Not enough funds.")]
    InsufficientFunds,
    #[msg("Minimun balance required for rend exempt")]
    MinimumBalanceRequired,
}